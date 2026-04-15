import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import SplashScreen from "./pages/SplashScreen";
import OnboardingHero from "./pages/OnboardingHero";
import OnboardingFeatures from "./pages/OnboardingFeatures";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding/1" element={<OnboardingHero />} />
          <Route path="/onboarding/2" element={<OnboardingFeatures />} />
          <Route path="/login" element={<LoginHub />} />
          <Route path="/login/tiktok" element={<TikTokLogin />} />
          <Route path="/login/facebook" element={<FacebookLogin />} />
          <Route path="/login/instagram" element={<InstagramLogin />} />
          <Route path="/login/phone" element={<PhoneLogin />} />
          <Route path="/login/email" element={<EmailLogin />} />
          <Route path="/paywall/1" element={<EmotionalHook />} />
          <Route path="/paywall/2" element={<BeforeAfterProof />} />
          <Route path="/paywall/3" element={<ValueStack />} />
          <Route path="/paywall/4" element={<SocialProof />} />
          <Route path="/paywall/5" element={<PlanSelection />} />
          <Route path="/paywall/6" element={<UrgencyTimer />} />
          <Route path="/paywall/7" element={<FreeTrialGuarantee />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
