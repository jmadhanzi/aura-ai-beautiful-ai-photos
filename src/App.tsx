import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

import SplashScreen from "./pages/SplashScreen";
import OnboardingHero from "./pages/OnboardingHero";
import OnboardingFeatures from "./pages/OnboardingFeatures";
import OnboardingAha from "./pages/OnboardingAha";
import LoginHub from "./pages/LoginHub";
import TikTokLogin from "./pages/TikTokLogin";
import { FacebookLogin, InstagramLogin, PhoneLogin, EmailLogin } from "./pages/LoginPages";
import EmotionalHook from "./pages/paywall/EmotionalHook";
import BeforeAfterProof from "./pages/paywall/BeforeAfterProof";
import ValueStack from "./pages/paywall/ValueStack";
import SocialProof from "./pages/paywall/SocialProof";
import PlanSelection from "./pages/paywall/PlanSelection";
import UrgencyTimer from "./pages/paywall/UrgencyTimer";
import FreeTrialGuarantee from "./pages/paywall/FreeTrialGuarantee";
import HomeScreen from "./pages/HomeScreen";
import SettingsScreen from "./pages/SettingsScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  useAuth(); // Initialize auth state listener

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><SplashScreen /></PageTransition>} />
        <Route path="/onboarding/1" element={<PageTransition><OnboardingHero /></PageTransition>} />
        <Route path="/onboarding/2" element={<PageTransition><OnboardingFeatures /></PageTransition>} />
        <Route path="/onboarding/3" element={<PageTransition><OnboardingAha /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginHub /></PageTransition>} />
        <Route path="/login/tiktok" element={<PageTransition><TikTokLogin /></PageTransition>} />
        <Route path="/login/facebook" element={<PageTransition><FacebookLogin /></PageTransition>} />
        <Route path="/login/instagram" element={<PageTransition><InstagramLogin /></PageTransition>} />
        <Route path="/login/phone" element={<PageTransition><PhoneLogin /></PageTransition>} />
        <Route path="/login/email" element={<PageTransition><EmailLogin /></PageTransition>} />
        <Route path="/paywall/1" element={<PageTransition variant="paywall"><EmotionalHook /></PageTransition>} />
        <Route path="/paywall/2" element={<PageTransition variant="paywall"><BeforeAfterProof /></PageTransition>} />
        <Route path="/paywall/3" element={<PageTransition variant="paywall"><ValueStack /></PageTransition>} />
        <Route path="/paywall/4" element={<PageTransition variant="paywall"><SocialProof /></PageTransition>} />
        <Route path="/paywall/5" element={<PageTransition variant="paywall"><PlanSelection /></PageTransition>} />
        <Route path="/paywall/6" element={<PageTransition variant="paywall"><UrgencyTimer /></PageTransition>} />
        <Route path="/paywall/7" element={<PageTransition variant="paywall"><FreeTrialGuarantee /></PageTransition>} />
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
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
