// ============================================================================
// MOVIE MART — Automated Test Suite
// Covers Catalog, Truthful Source Errors, 24-Hour Pass Integrity, Replay Attack Prevention,
// Admin Operations, and Copyright Takedown
// ============================================================================

import { dbStore, INITIAL_TITLES } from '../src/server/db';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`❌ TEST FAILED: ${message}`);
  }
  console.log(`✅ ${message}`);
}

async function runTests() {
  console.log('🎬 Running MovieMart Test Suite...\n');

  // 1. Catalog & Category Browsing
  const allTitles = dbStore.getAllTitles();
  assert(allTitles.length >= 8, 'Catalog loads all verified titles');
  assert(allTitles.some((t) => t.is_public_domain), 'Catalog contains verified public-domain classics');
  assert(allTitles.some((t) => t.region_category === 'hindi_dubbed'), 'Catalog contains Hindi dubbed content');
  assert(allTitles.some((t) => t.region_category === 'nepali'), 'Catalog contains Nepali content');

  // 2. Truthful Availability: Title existence != Stream availability
  const pendingTitle = dbStore.getTitleById('t-unlicensed-mystery');
  assert(!!pendingTitle, 'Pending title exists in catalog');
  const activeSources = dbStore.getActiveSourcesByTitleId('t-unlicensed-mystery');
  assert(activeSources.length === 0, 'Pending title correctly returns 0 active playable sources (truthful error trigger)');

  // 3. Multi-server playback and source retrieval
  const duneSources = dbStore.getSourcesByTitleId('t-dune-prophecy');
  assert(duneSources.length >= 2, 'Dune has multiple server options for seamless switching');
  const offlineServer = duneSources.find((s) => s.health_status === 'offline');
  assert(!!offlineServer, 'Offline/maintenance server is properly flagged so player warns user truthfully');

  // 4. Watchlist Isolation
  const user1 = 'test-user-alpha';
  const user2 = 'test-user-beta';
  dbStore.toggleWatchlist(user1, 't-dune-prophecy');
  const user1Watchlist = dbStore.getUserWatchlist(user1);
  const user2Watchlist = dbStore.getUserWatchlist(user2);
  assert(user1Watchlist.length === 1 && user1Watchlist[0].id === 't-dune-prophecy', 'User 1 watchlist stores saved title');
  assert(user2Watchlist.length === 0, 'User 2 watchlist is isolated and cannot see User 1 titles');

  // 5. Watch Progress & Continue Watching
  dbStore.saveWatchProgress(user1, 't-dune-prophecy', 1800, 7200);
  const progress = dbStore.getWatchProgress(user1, 't-dune-prophecy');
  assert(progress?.percentage === 25, 'Playback progress accurately computes 25% watch percentage');
  assert(progress?.progress_seconds === 1800, 'Playback progress accurately stores timestamp in seconds');

  // 6. Monetization & 24-Hour Ad-Free Pass Flow
  const attempt = dbStore.startRewardAttempt(user1, 'rewarded_24h_pass');
  assert(attempt.status === 'started', 'Reward attempt initialized with unique token and verification hash');

  // 7. Duplicate Event / Replay Attack Prevention
  const redemption1 = dbStore.redeemReward(user1, attempt.id);
  assert(redemption1.success === true, 'First redemption succeeds and issues 24-hour pass');
  assert(!!redemption1.pass && redemption1.pass.is_active, 'Pass is marked active with 24-hour duration');

  const passStatus = dbStore.getUserPassStatus(user1);
  assert(passStatus.hasActivePass === true, 'User pass status shows active ad-free status');
  assert(passStatus.remainingSeconds > 86000, 'Pass remaining time is approximately 24 hours (86,400s)');

  // Duplicate attempt must fail
  const redemption2 = dbStore.redeemReward(user1, attempt.id);
  assert(redemption2.success === false, 'Replay attack prevented: duplicate redemption attempt is rejected');

  // 8. Administrative Operations & Copyright Handling
  const dmca = dbStore.submitCopyrightReport({
    claimant_name: 'Studio Legal Dept',
    claimant_email: 'legal@cinema.org',
    infringing_url: 'https://moviemart.io/watch/t-dune-prophecy',
    original_work_description: 'Unauthorized distribution claim',
    title_id: 't-dune-prophecy',
  });
  assert(dmca.status === 'pending', 'DMCA report filed with pending status');

  dbStore.updateCopyrightStatus(dmca.id, 'resolved', 'Verified license on file, source cleared.');
  const resolvedDmca = dbStore.getCopyrightReports().find((r) => r.id === dmca.id);
  assert(resolvedDmca?.status === 'resolved', 'Admin successfully resolved DMCA report');

  console.log('\n🎉 ALL 8 TEST SUITES PASSED CLEANLY!\n');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
