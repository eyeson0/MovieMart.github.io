import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { dbStore, TitleRecord, StreamingSourceRecord } from './src/server/db';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// PUBLIC CATALOG APIS
// ---------------------------------------------------------------------------

// GET /api/titles - Search and filter catalog
app.get('/api/titles', (req: Request, res: Response) => {
  const { q, genre, type, region, isPublicDomain, sort } = req.query;
  let titles = dbStore.getAllTitles();

  if (q && typeof q === 'string') {
    const query = q.toLowerCase().trim();
    titles = titles.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.synopsis.toLowerCase().includes(query) ||
        t.genres.some((g) => g.toLowerCase().includes(query))
    );
  }

  if (genre && typeof genre === 'string' && genre !== 'All') {
    titles = titles.filter((t) => t.genres.includes(genre));
  }

  if (type && typeof type === 'string' && (type === 'movie' || type === 'series')) {
    titles = titles.filter((t) => t.type === type);
  }

  if (region && typeof region === 'string') {
    titles = titles.filter((t) => t.region_category === region);
  }

  if (isPublicDomain === 'true') {
    titles = titles.filter((t) => t.is_public_domain);
  }

  if (sort === 'rating') {
    titles.sort((a, b) => b.mart_rating - a.mart_rating);
  } else if (sort === 'newest') {
    titles.sort((a, b) => b.release_year - a.release_year);
  } else {
    // Trending & featured priority
    titles.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }

  res.json({ success: true, count: titles.length, titles });
});

// GET /api/titles/featured - Hero banner spotlight
app.get('/api/titles/featured', (req: Request, res: Response) => {
  const titles = dbStore.getAllTitles();
  const featured = titles.find((t) => t.is_featured) || titles[0];
  res.json({ success: true, title: featured });
});

// GET /api/titles/:id - Detailed title record with active sources & seasons
app.get('/api/titles/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const title = dbStore.getTitleById(id);

  if (!title) {
    return res.status(404).json({ success: false, error: 'Title not found' });
  }

  const sources = dbStore.getSourcesByTitleId(title.id);
  res.json({
    success: true,
    title,
    sources,
    hasStreamingAvailable: sources.some((s) => s.is_active && s.health_status === 'operational'),
  });
});

// GET /api/sources/:titleId - Authorized playback options
app.get('/api/sources/:titleId', (req: Request, res: Response) => {
  const { titleId } = req.params;
  const title = dbStore.getTitleById(titleId);

  if (!title) {
    return res.status(404).json({ success: false, error: 'Title not found' });
  }

  const sources = dbStore.getSourcesByTitleId(title.id);
  res.json({
    success: true,
    titleId: title.id,
    sources,
    allowlistedOrigins: ['https://commondatastorage.googleapis.com', 'https://archive.org'],
  });
});

// POST /api/sources/health-check - Real probe of a streaming source
app.post('/api/sources/health-check', async (req: Request, res: Response) => {
  const { sourceId } = req.body;
  const source = dbStore.getSourceById(sourceId);

  if (!source) {
    return res.status(404).json({ success: false, error: 'Source not found' });
  }

  const startTime = Date.now();
  let status: 'operational' | 'offline' = 'operational';
  let httpStatus = 200;
  let latency = 0;

  try {
    // If it's a simulated offline URL, handle promptly
    if (source.stream_url.includes('invalid-nonexistent-server-test')) {
      status = 'offline';
      httpStatus = 503;
      latency = 999;
    } else {
      const probe = await fetch(source.stream_url, { method: 'HEAD', signal: AbortSignal.timeout(3000) });
      latency = Date.now() - startTime;
      httpStatus = probe.status;
      status = probe.ok ? 'operational' : 'offline';
    }
  } catch (err: any) {
    status = 'offline';
    httpStatus = 500;
    latency = 999;
  }

  const updated = dbStore.updateSource(source.id, {
    health_status: status,
    latency_ms: latency,
  });

  res.json({
    success: true,
    sourceId: source.id,
    healthStatus: status,
    latencyMs: latency,
    httpStatus,
    updatedSource: updated,
  });
});

// ---------------------------------------------------------------------------
// USER ACCOUNT & PROGRESS APIS
// ---------------------------------------------------------------------------

// GET /api/watchlist - Get user's saved list
app.get('/api/watchlist', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'demo-user-1';
  const watchlist = dbStore.getUserWatchlist(userId);
  res.json({ success: true, count: watchlist.length, watchlist });
});

// POST /api/watchlist/toggle - Add/Remove from user's watchlist
app.post('/api/watchlist/toggle', (req: Request, res: Response) => {
  const { userId = 'demo-user-1', titleId } = req.body;
  if (!titleId) {
    return res.status(400).json({ success: false, error: 'titleId required' });
  }

  const isSaved = dbStore.toggleWatchlist(userId, titleId);
  res.json({ success: true, titleId, isSaved });
});

// GET /api/watch-progress - Get user's continue watching list
app.get('/api/watch-progress', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'demo-user-1';
  const progressList = dbStore.getUserAllProgress(userId);
  res.json({ success: true, count: progressList.length, progress: progressList });
});

// POST /api/watch-progress - Record current playback progress
app.post('/api/watch-progress', (req: Request, res: Response) => {
  const { userId = 'demo-user-1', titleId, progressSeconds, durationSeconds } = req.body;
  if (!titleId || typeof progressSeconds !== 'number') {
    return res.status(400).json({ success: false, error: 'titleId and progressSeconds required' });
  }

  const record = dbStore.saveWatchProgress(userId, titleId, progressSeconds, durationSeconds || 0);
  res.json({ success: true, record });
});

// ---------------------------------------------------------------------------
// ADVERTISING & 24-HOUR AD-FREE PASS APIS
// ---------------------------------------------------------------------------

// POST /api/ads/reward-attempt - Start voluntary rewarded ad session
app.post('/api/ads/reward-attempt', (req: Request, res: Response) => {
  const { userId = 'demo-user-1', slotKey = 'rewarded_24h_pass' } = req.body;
  const attempt = dbStore.startRewardAttempt(userId, slotKey);

  res.json({
    success: true,
    attemptId: attempt.id,
    expiresAt: attempt.expires_at,
    verificationHash: attempt.verification_hash,
  });
});

// POST /api/ads/redeem-reward - Redeem completed ad event & unlock 24-hour pass
app.post('/api/ads/redeem-reward', (req: Request, res: Response) => {
  const { userId = 'demo-user-1', attemptId } = req.body;
  if (!attemptId) {
    return res.status(400).json({ success: false, error: 'attemptId required' });
  }

  const result = dbStore.redeemReward(userId, attemptId);
  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json(result);
});

// GET /api/ads/pass-status - Check if user has active 24-hour pass
app.get('/api/ads/pass-status', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'demo-user-1';
  const status = dbStore.getUserPassStatus(userId);
  res.json({ success: true, ...status });
});

// ---------------------------------------------------------------------------
// COPYRIGHT / DMCA APIS
// ---------------------------------------------------------------------------

// POST /api/copyright-report - Submit a DMCA takedown notice
app.post('/api/copyright-report', (req: Request, res: Response) => {
  const { claimantName, claimantEmail, infringingUrl, originalWorkDescription, titleId, sourceId } = req.body;

  if (!claimantName || !claimantEmail || !infringingUrl || !originalWorkDescription) {
    return res.status(400).json({ success: false, error: 'All fields are required for formal DMCA review.' });
  }

  const report = dbStore.submitCopyrightReport({
    claimant_name: claimantName,
    claimant_email: claimantEmail,
    infringing_url: infringingUrl,
    original_work_description: originalWorkDescription,
    title_id: titleId,
    source_id: sourceId,
  });

  res.json({
    success: true,
    message: 'Report submitted successfully. Reference ID generated.',
    reportId: report.id,
  });
});

// ---------------------------------------------------------------------------
// ADMINISTRATOR APIS
// ---------------------------------------------------------------------------

// GET /api/admin/overview - Aggregated metrics
app.get('/api/admin/overview', (req: Request, res: Response) => {
  const titles = dbStore.getAllTitles();
  const sources = dbStore.sources;
  const operationalSources = sources.filter((s) => s.is_active && s.health_status === 'operational').length;
  const reports = dbStore.getCopyrightReports();
  const auditLogs = dbStore.getAuditLogs();

  res.json({
    success: true,
    stats: {
      totalTitles: titles.length,
      moviesCount: titles.filter((t) => t.type === 'movie').length,
      seriesCount: titles.filter((t) => t.type === 'series').length,
      publicDomainCount: titles.filter((t) => t.is_public_domain).length,
      totalSources: sources.length,
      activeSources: sources.filter((s) => s.is_active).length,
      operationalSources,
      healthPercentage: sources.length > 0 ? Math.round((operationalSources / sources.length) * 100) : 100,
      pendingCopyrightReports: reports.filter((r) => r.status === 'pending').length,
    },
    sources,
    adPlacements: dbStore.adPlacements,
    recentReports: reports.slice(0, 5),
    recentAuditLogs: auditLogs.slice(0, 10),
  });
});

// POST /api/admin/titles - Create new title
app.post('/api/admin/titles', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.title || !body.synopsis) {
    return res.status(400).json({ success: false, error: 'Title and synopsis are required' });
  }

  const newTitle: TitleRecord = {
    id: `t-${Date.now()}`,
    slug: (body.title as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    title: body.title,
    type: body.type || 'movie',
    tagline: body.tagline || '',
    synopsis: body.synopsis,
    poster_url: body.poster_url || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdrop_url: body.backdrop_url || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    release_year: parseInt(body.release_year, 10) || new Date().getFullYear(),
    release_date: body.release_date || new Date().toISOString().split('T')[0],
    duration_minutes: parseInt(body.duration_minutes, 10) || 120,
    age_rating: body.age_rating || 'PG-13',
    genres: Array.isArray(body.genres) ? body.genres : ['Action'],
    languages: [{ code: 'en', name: 'English', isOriginal: true }],
    subtitles: [],
    mart_rating: 8.5,
    imdb_rating: 8.0,
    rotten_tomatoes_pct: 85,
    is_featured: !!body.is_featured,
    is_trending: !!body.is_trending,
    is_public_domain: !!body.is_public_domain,
    region_category: body.region_category || 'hollywood',
  };

  dbStore.addTitle(newTitle);
  res.json({ success: true, title: newTitle });
});

// PUT /api/admin/sources/:id - Update source or toggle active
app.put('/api/admin/sources/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = dbStore.updateSource(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Source not found' });
  }
  res.json({ success: true, source: updated });
});

// POST /api/admin/sources - Add new authorized source
app.post('/api/admin/sources', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.title_id || !body.stream_url || !body.server_name) {
    return res.status(400).json({ success: false, error: 'title_id, server_name, and stream_url are required' });
  }

  const newSource: StreamingSourceRecord = {
    id: `src-${Date.now()}`,
    title_id: body.title_id,
    provider_name: body.provider_name || 'MovieMart Cloud',
    server_name: body.server_name,
    source_type: body.source_type || 'mp4',
    stream_url: body.stream_url,
    authorized_origin: new URL(body.stream_url).origin,
    quality_label: body.quality_label || '1080p HD',
    is_active: body.is_active !== false,
    health_status: 'operational',
    latency_ms: 45,
    license_reference: body.license_reference || 'VERIFIED-MANUAL-ENTRY',
    last_verified_at: new Date().toISOString(),
  };

  dbStore.addSource(newSource);
  res.json({ success: true, source: newSource });
});

// DELETE /api/admin/sources/:id - Delete source
app.delete('/api/admin/sources/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  dbStore.deleteSource(id);
  res.json({ success: true });
});

// POST /api/admin/ad-placements/toggle - Toggle ad slot
app.post('/api/admin/ad-placements/toggle', (req: Request, res: Response) => {
  const { slotKey } = req.body;
  const slot = dbStore.adPlacements.find((p) => p.slot_key === slotKey);
  if (!slot) {
    return res.status(404).json({ success: false, error: 'Ad placement not found' });
  }

  slot.is_enabled = !slot.is_enabled;
  dbStore.logAudit('admin', 'TOGGLE_AD_SLOT', 'AD_PLACEMENT', slot.slot_key, `Toggled to ${slot.is_enabled}`);
  res.json({ success: true, slot });
});

// POST /api/admin/copyright-reports/:id - Resolve DMCA report & optionally disable source
app.post('/api/admin/copyright-reports/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes, disableSourceId } = req.body;

  if (disableSourceId) {
    dbStore.updateSource(disableSourceId, { is_active: false, health_status: 'offline' });
  }

  const updated = dbStore.updateCopyrightStatus(id, status, adminNotes);
  res.json({ success: true, report: updated });
});

// ---------------------------------------------------------------------------
// VITE INTEGRATION (Mount Vite Middlewares)
// ---------------------------------------------------------------------------

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: HOST,
        port: PORT,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`🎬 MovieMart Full-Stack Platform listening on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start MovieMart server:', err);
  process.exit(1);
});
