import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';

export function useAuth() {
  const { currentUser, setCurrentUser, setIsProUser, setSelectedPlan, setOnboardingComplete } = useAppStore();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setCurrentUser({
            id: profile.id,
            name: profile.full_name || '',
            email: profile.email || '',
            avatar: profile.avatar_url || '',
          });
          setIsProUser(profile.is_pro);
          if (profile.plan_type) {
            setSelectedPlan(profile.plan_type as 'weekly' | 'monthly' | 'annual');
          }
          if (profile.is_pro) {
            setOnboardingComplete(true);
          }
        }
      } else {
        setCurrentUser(null);
        setIsProUser(false);
      }
    });

    // Check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setCurrentUser({
            id: profile.id,
            name: profile.full_name || '',
            email: profile.email || '',
            avatar: profile.avatar_url || '',
          });
          setIsProUser(profile.is_pro);
          if (profile.plan_type) {
            setSelectedPlan(profile.plan_type as 'weekly' | 'monthly' | 'annual');
          }
          if (profile.is_pro) {
            setOnboardingComplete(true);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [setCurrentUser, setIsProUser, setSelectedPlan, setOnboardingComplete]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsProUser(false);
    setOnboardingComplete(false);
  };

  return { currentUser, signOut };
}
