import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Film, 
  Server, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  RefreshCw, 
  Trash2, 
  FileText, 
  Sliders, 
  Activity,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { Title, StreamingSource, CopyrightReport, AuditLog, AdPlacement } from '../../types/ott';

interface AdminDashboardProps {
  onClose: () => void;
  onRefreshCatalog: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onRefreshCatalog,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'sources' | 'ads' | 'dmca' | 'audit'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [sources, setSources] = useState<StreamingSource[]>([]);
  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>([]);
  const [reports, setReports] = useState<CopyrightReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [probingSourceId, setProbingSourceId] = useState<string | null>(null);

  // Form states for adding title & source
  const [newTitleName, setNewTitleName] = useState('');
  const [newTitleSynopsis, setNewTitleSynopsis] = useState('');
  const [newTitleType, setNewTitleType] = useState<'movie' | 'series'>('movie');
  const [newTitleRegion, setNewTitleRegion] = useState('hollywood');
  const [isPublicDomain, setIsPublicDomain] = useState(false);

  const [newSourceTitleId, setNewSourceTitleId] = useState('');
  const [newSourceServerName, setNewSourceServerName] = useState('Main Fast Edge CDN');
  const [newSourceUrl, setNewSourceUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setSources(data.sources);
        setAdPlacements(data.adPlacements);
        setReports(data.recentReports);
        setAuditLogs(data.recentAuditLogs);
        if (data.sources.length > 0) {
          setNewSourceTitleId(data.sources[0].title_id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Run live health check on a server source
  const handleProbeSource = async (sourceId: string) => {
    setProbingSourceId(sourceId);
    try {
      const res = await fetch('/api/sources/health-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId }),
      });
      const data = await res.json();
      if (data.success && data.updatedSource) {
        setSources((prev) =>
          prev.map((s) => (s.id === sourceId ? data.updatedSource : s))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProbingSourceId(null);
    }
  };

  // Toggle source enabled
  const handleToggleSource = async (source: StreamingSource) => {
    try {
      const res = await fetch(`/api/admin/sources/${source.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !source.is_active }),
      });
      const data = await res.json();
      if (data.success) {
        setSources((prev) =>
          prev.map((s) => (s.id === source.id ? data.source : s))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete source
  const handleDeleteSource = async (sourceId: string) => {
    try {
      await fetch(`/api/admin/sources/${sourceId}`, { method: 'DELETE' });
      setSources((prev) => prev.filter((s) => s.id !== sourceId));
    } catch (err) {
      console.error(err);
    }
  };

  // Create Title
  const handleCreateTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleName.trim() || !newTitleSynopsis.trim()) return;

    try {
      const res = await fetch('/api/admin/titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitleName,
          synopsis: newTitleSynopsis,
          type: newTitleType,
          region_category: newTitleRegion,
          is_public_domain: isPublicDomain,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewTitleName('');
        setNewTitleSynopsis('');
        fetchAdminData();
        onRefreshCatalog();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Source
  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceTitleId || !newSourceUrl) return;

    try {
      const res = await fetch('/api/admin/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_id: newSourceTitleId,
          server_name: newSourceServerName,
          stream_url: newSourceUrl,
          provider_name: 'MovieMart Authorized Partner',
          quality_label: '1080p Ultra HD',
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Ad Slot
  const handleToggleAdSlot = async (slotKey: string) => {
    try {
      const res = await fetch('/api/admin/ad-placements/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotKey }),
      });
      const data = await res.json();
      if (data.success) {
        setAdPlacements((prev) =>
          prev.map((p) => (p.slot_key === slotKey ? data.slot : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Resolve DMCA Report
  const handleResolveDmca = async (reportId: string, disableSourceId?: string) => {
    try {
      const res = await fetch(`/api/admin/copyright-reports/${reportId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'resolved',
          adminNotes: 'Addressed by security team. Offending resource verified.',
          disableSourceId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#121212] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-[#181818] border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-[#E50914] border border-red-600/40 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">MovieMart Operations Console</h2>
              <p className="text-xs text-gray-400">Authorized Source Monitoring, Monetization & DMCA Governance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminData}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh Stats"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-2.5 bg-[#141414] border-b border-white/10 flex items-center gap-2 flex-shrink-0 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'sources' ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Streaming Sources ({sources.length})
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'catalog' ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Add Catalog Title
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'ads' ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Monetization & Ads
          </button>
          <button
            onClick={() => setActiveTab('dmca')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dmca' ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>DMCA Reports</span>
            {reports.filter((r) => r.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'audit' ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Audit Log
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-[#181818] rounded-2xl border border-white/5 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-gray-400">Total Titles</div>
                  <div className="text-2xl font-black text-white">{stats.totalTitles}</div>
                  <div className="text-[10px] text-gray-500">
                    {stats.moviesCount} Movies • {stats.seriesCount} Series
                  </div>
                </div>

                <div className="p-4 bg-[#181818] rounded-2xl border border-white/5 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-gray-400">Active Sources</div>
                  <div className="text-2xl font-black text-emerald-400">
                    {stats.operationalSources} / {stats.totalSources}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {stats.healthPercentage}% Operational
                  </div>
                </div>

                <div className="p-4 bg-[#181818] rounded-2xl border border-white/5 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-gray-400">Public Domain</div>
                  <div className="text-2xl font-black text-amber-400">{stats.publicDomainCount}</div>
                  <div className="text-[10px] text-gray-500">Pre-1928 & Verified</div>
                </div>

                <div className="p-4 bg-[#181818] rounded-2xl border border-white/5 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-gray-400">DMCA Notices</div>
                  <div className="text-2xl font-black text-red-400">{stats.pendingCopyrightReports}</div>
                  <div className="text-[10px] text-gray-500">Pending Review</div>
                </div>
              </div>

              {/* Quick Summary Notice */}
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Streaming Allowlist active: commondatastorage.googleapis.com, archive.org</span>
                </div>
                <span className="font-mono text-[10px]">Security Engine Online</span>
              </div>
            </div>
          )}

          {/* TAB 2: STREAMING SOURCES */}
          {activeTab === 'sources' && (
            <div className="space-y-6">
              {/* Add Source Form */}
              <form onSubmit={handleCreateSource} className="p-4 bg-[#181818] rounded-2xl border border-white/10 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#E50914]" />
                  Provision New Authorized Streaming Server
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold block mb-1">Title ID</label>
                    <input
                      type="text"
                      value={newSourceTitleId}
                      onChange={(e) => setNewSourceTitleId(e.target.value)}
                      placeholder="e.g. t-dune-prophecy"
                      className="w-full bg-[#202020] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 font-bold block mb-1">Server Name</label>
                    <input
                      type="text"
                      value={newSourceServerName}
                      onChange={(e) => setNewSourceServerName(e.target.value)}
                      placeholder="e.g. FastEdge CDN Server 4"
                      className="w-full bg-[#202020] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 font-bold block mb-1">Stream URL (HLS / MP4)</label>
                    <input
                      type="url"
                      value={newSourceUrl}
                      onChange={(e) => setNewSourceUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#202020] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#E50914] hover:bg-red-600 text-white font-bold text-xs cursor-pointer"
                  >
                    Add Server Source
                  </button>
                </div>
              </form>

              {/* Sources Table */}
              <div className="bg-[#181818] rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
                <div className="p-3 bg-[#202020] grid grid-cols-12 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <div className="col-span-4">Server / Provider</div>
                  <div className="col-span-3">Title ID / License</div>
                  <div className="col-span-2">Health / Latency</div>
                  <div className="col-span-3 text-right">Actions</div>
                </div>

                {sources.map((s) => (
                  <div key={s.id} className="p-3 grid grid-cols-12 items-center text-xs gap-2">
                    <div className="col-span-4 min-w-0">
                      <div className="font-bold text-white truncate">{s.server_name}</div>
                      <div className="text-[10px] text-gray-400 truncate">{s.provider_name}</div>
                    </div>

                    <div className="col-span-3 min-w-0">
                      <div className="text-gray-300 font-mono text-[11px] truncate">{s.title_id}</div>
                      <div className="text-[10px] text-gray-500 truncate">{s.license_reference || 'MANUAL'}</div>
                    </div>

                    <div className="col-span-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.health_status === 'operational'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-950 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {s.health_status} ({s.latency_ms}ms)
                      </span>
                    </div>

                    <div className="col-span-3 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleProbeSource(s.id)}
                        disabled={probingSourceId === s.id}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
                        title="Run Live Health Probe"
                      >
                        <Activity className={`w-3.5 h-3.5 ${probingSourceId === s.id ? 'animate-spin text-amber-400' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleToggleSource(s)}
                        className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                          s.is_active ? 'bg-emerald-600 text-white' : 'bg-neutral-700 text-gray-300'
                        }`}
                      >
                        {s.is_active ? 'Enabled' : 'Disabled'}
                      </button>

                      <button
                        onClick={() => handleDeleteSource(s.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete source"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ADD TITLE */}
          {activeTab === 'catalog' && (
            <form onSubmit={handleCreateTitle} className="p-5 bg-[#181818] rounded-2xl border border-white/10 space-y-4 max-w-2xl">
              <h3 className="text-sm font-bold text-white">Create New Catalog Record</h3>

              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Title</label>
                <input
                  type="text"
                  value={newTitleName}
                  onChange={(e) => setNewTitleName(e.target.value)}
                  placeholder="e.g. Interstellar Odyssey"
                  className="w-full bg-[#202020] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Synopsis</label>
                <textarea
                  rows={3}
                  value={newTitleSynopsis}
                  onChange={(e) => setNewTitleSynopsis(e.target.value)}
                  placeholder="Comprehensive plot summary..."
                  className="w-full bg-[#202020] border border-white/10 rounded-xl p-3 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 font-bold block mb-1">Content Type</label>
                  <select
                    value={newTitleType}
                    onChange={(e) => setNewTitleType(e.target.value as any)}
                    className="w-full bg-[#202020] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="movie">Movie</option>
                    <option value="series">TV Series</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-bold block mb-1">Category / Language</label>
                  <select
                    value={newTitleRegion}
                    onChange={(e) => setNewTitleRegion(e.target.value)}
                    className="w-full bg-[#202020] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="hollywood">Hollywood / International</option>
                    <option value="hindi_dubbed">Hindi Dubbed</option>
                    <option value="nepali">Nepali Cinema</option>
                    <option value="korean">Korean Drama</option>
                    <option value="anime">Anime</option>
                    <option value="classics">Public Domain Classics</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pd-check"
                  checked={isPublicDomain}
                  onChange={(e) => setIsPublicDomain(e.target.checked)}
                  className="rounded text-[#E50914]"
                />
                <label htmlFor="pd-check" className="text-xs text-gray-300 font-medium">
                  Verified Public Domain title (Pre-1928 or documented notice omission)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#E50914] hover:bg-red-600 text-white font-bold text-xs cursor-pointer"
              >
                Publish Title to Database
              </button>
            </form>
          )}

          {/* TAB 4: ADS & MONETIZATION */}
          {activeTab === 'ads' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Configured Advertising Placements</h3>
              <div className="space-y-3">
                {adPlacements.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-[#181818] rounded-2xl border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{p.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Slot: <span className="font-mono text-gray-300">{p.slot_key}</span> • Provider: {p.provider}
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleAdSlot(p.slot_key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        p.is_enabled
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-neutral-700 text-gray-300'
                      }`}
                    >
                      {p.is_enabled ? 'Active Placement' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DMCA COMPLAINTS */}
          {activeTab === 'dmca' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">DMCA & Copyright Inquiries</h3>
              {reports.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400 bg-[#181818] rounded-2xl">
                  No pending DMCA notices.
                </div>
              ) : (
                reports.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 bg-[#181818] rounded-2xl border border-white/10 space-y-3 text-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-white font-bold">{r.claimant_name} ({r.claimant_email})</div>
                        <div className="text-gray-400 mt-0.5">URL: {r.infringing_url}</div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'resolved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <p className="text-gray-300 bg-neutral-900 p-2.5 rounded-lg border border-white/5">
                      "{r.original_work_description}"
                    </p>

                    {r.status === 'pending' && (
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleResolveDmca(r.id, r.source_id)}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer"
                        >
                          Disable Offending Source & Resolve
                        </button>
                        <button
                          onClick={() => handleResolveDmca(r.id)}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-xs cursor-pointer"
                        >
                          Dismiss / Retain
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 6: AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="bg-[#181818] rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden text-xs">
              <div className="p-3 bg-[#202020] grid grid-cols-12 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-3">Timestamp</div>
                <div className="col-span-3">Action</div>
                <div className="col-span-6">Details</div>
              </div>
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 grid grid-cols-12 text-xs gap-2">
                  <div className="col-span-3 text-gray-500 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="col-span-3 font-bold text-white">{log.action}</div>
                  <div className="col-span-6 text-gray-300 truncate">{log.details}</div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
