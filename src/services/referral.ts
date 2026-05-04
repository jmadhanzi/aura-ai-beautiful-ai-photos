// ── Referral Service ───────────────────────────────────
// Generates unique codes, tracks redemptions via Supabase.

import { supabase } from '@/integrations/supabase/client';
import { track } from './analytics';

export function generateCode(userId: string): string {
  // Short readable code: first 4 chars of userId + 4 random chars
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const rand = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `AURA-${userId.slice(0, 4).toUpperCase()}-${rand}`;
}

export async function getOrCreateReferralCode(userId: string): Promise<string> {
  // Check if profile already has a referral code
  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code')
    .eq('id', userId)
    .single();

  if (profile?.referral_code) return profile.referral_code as string;

  // Generate and save
  const code = generateCode(userId);
  await supabase
    .from('profiles')
    .update({ referral_code: code } as Record<string, unknown>)
    .eq('id', userId);

  return code;
}

export function getReferralLink(code: string): string {
  return `https://aura.app/r/${code}`;
}

export async function copyReferralLink(code: string): Promise<void> {
  const link = getReferralLink(code);
  await navigator.clipboard.writeText(link);
  track('referral_copied');
}

export async function shareReferral(code: string): Promise<void> {
  const link = getReferralLink(code);
  const text = `✦ I use AURA AI Studio to edit my photos — it's incredible. Get 1 month free: ${link}`;

  if (navigator.share) {
    await navigator.share({ title: 'Try AURA AI Studio', text, url: link });
  } else {
    await navigator.clipboard.writeText(text);
  }
  track('referral_shared');
}
