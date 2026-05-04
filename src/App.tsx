import { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import OfflineBanner from '@/components/OfflineBanner';
import { useAuth } from '@/hooks/useAuth';
import { initAnalytics } from '@/services/analytics';

// ── Eagerly loaded (critical path) ──────────────────────
import SplashScreen from './pages/SplashScreen';
import OnboardingHero from './pages/OnboardingHero';
import OnboardingFeatures from './pages/OnboardingFeatures';
import OnboardingPersonalize from './pages/OnboardingPersonalize';
import OnboardingAha from './pages/OnboardingAha';
import LoginHub from './pages/LoginHub';
import HomeScreen from './pages/HomeScreen';
import SettingsScreen from './pages/SettingsScreen';

// ── Lazily loaded (non-critical, code-split) ─────────────
const TikTokLogin    = lazy(() => import('./pages/TikTokLogin'));
const FacebookLogin  = lazy(() => import('./pages/LoginPages').then(m => ({ default: m.FacebookLogin })));
const InstagramLogin = lazy(() => import('./pages/LoginPages').then(m => ({ default: m.InstagramLogin })));
const PhoneLogin     = lazy(() => import('./pages/LoginPages').then(m => ({ default: m.PhoneLogin })));
const EmailLogin     = lazy(() => import('./pages/LoginPages').then(m => ({ default: m.EmailLogin })));
const NotFound       = lazy(() => import('./pages/NotFound'));

// ── Paywall: collapsed to 3 screens ─────────────────────
const EmotionalHook      = lazy(() => import('./pages/paywall/EmotionalHook'));
const PlanSelection      = lazy(() => import('./pages/paywall/PlanSelection'));
const FreeTrialGuarantee = lazy(() => import('./pages/paywall/FreeTrialGuarantee'));

// ── Fallback for lazy chunks ─────────────────────────────
const LazyFallback = () => (
  <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--ink)' }}>
    <div className="flex gap-1.5">
      {[0, 0.18, 0.36].map((d, i) => (
        <div key={i} className="rounded-full" style={{ width: 5, height: 5, background: 'var(--gold)', animation: `dotPulse 1.1s ease-in-out infinite ${d}s` }} />
      ))}
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2, staleTime: 60_000 } },
});

const AnimatedRoutes = () => {
  const location = useLocation();
  useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ── Onboarding ───────────────────────── */}
        <Route path="/"             element={<PageTransition><SplashScreen /></PageTransition>} />
        <Route path="/onboarding/1" element={<PageTransition><OnboardingHero /></PageTransition>} />
        <Route path="/onboarding/2" element={<PageTransition><OnboardingFeatures /></PageTransition>} />
        <Route path="/onboarding/3" element={<PageTransition><OnboardingPersonalize /></PageTransition>} />
        <Route path="/onboarding/4" element={<PageTransition><OnboardingAha /></PageTransition>} />

        {/* ── Auth ─────────────────────────────── */}
        <Route path="/login"           element={<PageTransition><LoginHub /></PageTransition>} />
        <Route path="/login/tiktok"    element={<PageTransition><Suspense fallback={<LazyFallback />}><TikTokLogin /></Suspense></PageTransition>} />
        <Route path="/login/facebook"  element={<PageTransition><Suspense fallback={<LazyFallback />}><FacebookLogin /></Suspense></PageTransition>} />
        <Route path="/login/instagram" element={<PageTransition><Suspense fallback={<LazyFallback />}><InstagramLogin /></Suspense></PageTransition>} />
        <Route path="/login/phone"     element={<PageTransition><Suspense fallback={<LazyFallback />}><PhoneLogin /></Suspense></PageTransition>} />
        <Route path="/login/email"     element={<PageTransition><Suspense fallback={<LazyFallback />}><EmailLogin /></Suspense></PageTransition>} />

        {/* ── Paywall — 3 screens ───────────────── */}
        <Route path="/paywall/1" element={<PageTransition variant="paywall"><Suspense fallback={<LazyFallback />}><EmotionalHook /></Suspense></PageTransition>} />
        <Route path="/paywall/2" element={<PageTransition variant="paywall"><Suspense fallback={<LazyFallback />}><PlanSelection /></Suspense></PageTransition>} />
        <Route path="/paywall/3" element={<PageTransition variant="paywall"><Suspense fallback={<LazyFallback />}><FreeTrialGuarantee /></Suspense></PageTransition>} />
        {/* Legacy paywall routes redirect to compressed flow */}
        <Route path="/paywall/4" element={<PageTransition variant="paywall"><Suspense fallback={<LazyFallback />}><PlanSelection /></Suspense></PageTransition>} />
        <Route path="/paywall/5" element={<PageTransition variant="paywall"><Suspense fallback={<LazyFallback />}><PlanSelection /></Suspense></PageTransition>} />
        <Route path="/paywall/6" element={<PageTransition variant="paywall"><Suspense fallback={<LazyFallback />}><FreeTrialGuarantee /></Suspense></PageTransition>} />
        <Route path="/paywall/7" element={<PageTransition variant="paywall"><Suspense fallback={<LazyFallback />}><FreeTrialGuarantee /></Suspense></PageTransition>} />

        {/* ── App ──────────────────────────────── */}
        <Route path="/home" element={
          <PageTransition>
            <ProtectedRoute requirePro>
              <HomeScreen />
            </ProtectedRoute>
          </PageTransition>
        } />
        <Route path="/settings" element={
          <PageTransition>
            <ProtectedRoute>
              <SettingsScreen />
            </ProtectedRoute>
          </PageTransition>
        } />
        <Route path="*" element={<PageTransition><Suspense fallback={<LazyFallback />}><NotFound /></Suspense></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

// ── Boot analytics ───────────────────────────────────────
initAnalytics().catch(() => {});

const App = () => (
  <ErrorBoundary>
    <OfflineBanner />
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
