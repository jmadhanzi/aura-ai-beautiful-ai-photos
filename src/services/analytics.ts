// ── Analytics Service (PostHog) ────────────────────────
// Tracks funnel events with zero PII.
// Enable by setting VITE_POSTHOG_KEY in .env

const KEY = import.meta.env.VITE_POSTHOG_KEY;
const HOST = 'https://us.i.posthog.com';

let _ph: { capture: (e: string, p?: Record<string, unknown>) => void; identify: (id: string, props?: Record<string, unknown>) => void } | null = null;

export async function initAnalytics() {
  if (!KEY || typeof window === 'undefined') return;
  const { default: posthog } = await import('posthog-js');
  posthog.init(KEY, { api_host: HOST, capture_pageview: false, autocapture: false });
  _ph = posthog;
}

export function track(event: string, props?: Record<string, unknown>) {
  _ph?.capture(event, props);
  if (import.meta.env.DEV) console.log('[track]', event, props);
}

export function identify(userId: string, props?: Record<string, unknown>) {
  _ph?.identify(userId, props);
}

// ── Named events ───────────────────────────────────────
export const Analytics = {
  splashViewed:           ()                               => track('splash_viewed'),
  onboardingStep:         (step: number)                   => track('onboarding_step', { step }),
  goalSelected:           (goal: string)                   => track('goal_selected', { goal }),
  ahaTriggered:           (prompt: string)                 => track('aha_triggered', { prompt }),
  loginStarted:           (provider: string)               => track('login_started', { provider }),
  paywallViewed:          (screen: number)                 => track('paywall_viewed', { screen }),
  planSelected:           (plan: string)                   => track('plan_selected', { plan }),
  trialStarted:           (plan: string)                   => track('trial_started', { plan }),
  photoUploaded:          ()                               => track('photo_uploaded'),
  aiProcessingStarted:    (tool: string)                   => track('ai_processing_started', { tool }),
  aiProcessingCompleted:  (tool: string, ms: number)       => track('ai_processing_completed', { tool, ms }),
  photoExported:          (type: 'watermark' | 'clean')    => track('photo_exported', { type }),
  shareTriggered:         (platform: string)               => track('share_triggered', { platform }),
  referralCopied:         ()                               => track('referral_copied'),
  styleDnaViewed:         ()                               => track('style_dna_viewed'),
};
