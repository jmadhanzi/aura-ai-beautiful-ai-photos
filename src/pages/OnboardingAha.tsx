import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, Sparkles, Zap } from 'lucide-react';

/* ── Quick-tap suggestions ──────────────────────────────── */
const suggestions = [
  { label: '✨ Polish my look', prompt: 'Make me look polished and professional' },
  { label: '💼 LinkedIn headshot', prompt: 'Give me a confident LinkedIn-ready headshot look' },
  { label: '🎭 Editorial magazine', prompt: 'Make me look like I belong on a magazine cover' },
  { label: '🌅 Golden hour glow', prompt: 'Apply a warm golden hour cinematic look' },
  { label: '🎯 Dating profile', prompt: 'Make me look approachable, confident, and attractive for a dating profile' },
  { label: '🏆 Award ceremony', prompt: 'Make me look ready for a red carpet event' },
];

/* ── Simulated transformations ──────────────────────────── */
const AURA_SYSTEM = `You are AURA's AI transformation engine — the smartest beauty editor on the planet.
When a user describes a look they want, respond with a 2-part transformation brief:
1. One punchy sentence starting with "Applied:" describing the specific technical adjustments
2. One insight starting with "Why it works:" explaining why this will make them look better

Be specific, confident, and technical. Mention actual techniques: frequency separation, luminosity masks, color grading, face sculpting vectors, etc. Never be generic. Make the user feel like they're getting a $500 professional edit.`;

const OnboardingAha = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ applied: string; why: string } | null>(null);
  const [tried, setTried] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTry = async (text?: string) => {
    const query = text ?? prompt;
    if (!query.trim()) return;
    setPrompt(query);
    setLoading(true);
    setResult(null);
    setTried(true);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 180,
          system: AURA_SYSTEM,
          messages: [{ role: 'user', content: query }],
        }),
      });
      const data = await res.json();
      const raw: string = data?.content?.[0]?.text ?? '';
      const appliedMatch = raw.match(/Applied:(.*?)(?=Why it works:|$)/s);
      const whyMatch = raw.match(/Why it works:(.*)/s);
      setResult({
        applied: appliedMatch?.[1]?.trim() ?? raw.split('\n')[0],
        why: whyMatch?.[1]?.trim() ?? 'This combination creates a naturally elevated look that reads as effortlessly confident.',
      });
    } catch {
      setResult({
        applied: 'Precision skin frequency separation, +12% eye contrast lift, warm 3200K color temperature shift, subtle jaw contouring vectors applied.',
        why: 'This combination makes your features pop naturally — no filter feel, just you at your best.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-ink px-6 py-10 overflow-hidden">
      <div className="aurora-bg">
        <div className="aurora-blob aurora-gold" />
        <div className="aurora-blob aurora-violet" />
      </div>

      <div className="relative z-10 flex flex-col w-full max-w-sm mx-auto">
        {/* Step pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 mb-8"
          style={{ border: '1px solid rgba(200,164,90,0.2)', background: 'rgba(200,164,90,0.05)' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          <span className="font-mono text-[10px] font-medium tracking-widest uppercase" style={{ color: 'var(--gold)' }}>
            Step 4 · Try it now
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="font-display mb-2" style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            Type a look.
            <br />
            <em className="not-italic italic" style={{
              background: 'linear-gradient(135deg, var(--gold), var(--gold-bright))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Watch it transform.
            </em>
          </h1>
          <p className="font-body text-sm mb-7" style={{ color: 'var(--text-muted)' }}>
            A question, a goal, a half-formed idea — AURA elevates it.
          </p>
        </motion.div>

        {/* Input bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 rounded-2xl p-4 mb-4"
          style={{
            background: 'var(--void)',
            border: '1.5px solid rgba(200,164,90,0.3)',
            boxShadow: '0 0 24px rgba(200,164,90,0.06)',
          }}
        >
          <Sparkles className="h-4 w-4 shrink-0" style={{ color: 'var(--gold)' }} />
          <input
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTry()}
            placeholder="Describe the look you want…"
            className="flex-1 bg-transparent text-sm outline-none font-body"
            style={{ color: 'var(--text-primary)' }}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => handleTry()}
            disabled={loading || !prompt.trim()}
            className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))' }}
          >
            <ArrowUp className="h-4 w-4" style={{ color: 'var(--ink)' }} />
          </motion.button>
        </motion.div>

        {/* Quick-tap chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {suggestions.map((s) => (
            <motion.button
              key={s.label}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleTry(s.prompt)}
              className="rounded-full px-3 py-1.5 font-body text-xs font-medium transition-all"
              style={{
                background: prompt === s.prompt ? 'rgba(200,164,90,0.12)' : 'var(--void)',
                border: `1px solid ${prompt === s.prompt ? 'rgba(200,164,90,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: prompt === s.prompt ? 'var(--gold)' : 'var(--text-secondary)',
              }}
            >
              {s.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading state */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl p-5 mb-4"
              style={{ background: 'var(--void)', border: '1px solid var(--glass-border)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-4 w-4 animate-pulse" style={{ color: 'var(--gold)' }} />
                <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>AURA is analyzing your vision…</span>
              </div>
              <div className="flex flex-col gap-2">
                {[80, 60, 45].map((w, i) => (
                  <div key={i} className="h-2 rounded-full overflow-hidden" style={{ width: `${w}%`, background: 'rgba(255,255,255,0.04)' }}>
                    <div
                      className="h-full rounded-full animate-shimmer"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(200,164,90,0.3), transparent)', backgroundSize: '200% 100%' }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result — the AHA moment */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="rounded-2xl overflow-hidden mb-6"
              style={{ border: '1px solid rgba(200,164,90,0.25)' }}
            >
              {/* Header bar */}
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: 'rgba(200,164,90,0.08)', borderBottom: '1px solid rgba(200,164,90,0.15)' }}>
                <Sparkles className="h-4 w-4" style={{ color: 'var(--gold)' }} />
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
                  ✦ AURA Enhancement Ready
                </span>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                  <span className="font-mono text-[9px]" style={{ color: 'var(--teal)' }}>LIVE</span>
                </div>
              </div>

              {/* Applied section */}
              <div className="px-4 pt-4 pb-3" style={{ background: 'var(--void)' }}>
                <div className="flex items-start gap-2.5 mb-4">
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--rose)' }} />
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest block mb-1" style={{ color: 'var(--text-faint)' }}>Applied</span>
                    <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{result.applied}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--teal)' }} />
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest block mb-1" style={{ color: 'var(--text-faint)' }}>Why it works</span>
                    <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{result.why}</p>
                  </div>
                </div>
              </div>

              {/* Try again nudge */}
              <div className="px-4 py-3 flex items-center justify-between"
                style={{ background: 'rgba(200,164,90,0.04)', borderTop: '1px solid rgba(200,164,90,0.1)' }}>
                <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>Upload a photo to apply this</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ color: 'var(--gold)', fontSize: 14 }}
                >→</motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA area */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: tried ? 0 : 0.5 }}
          className="flex flex-col gap-3 mt-auto pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(232,84,122,0.35)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="relative w-full rounded-2xl py-4 font-body text-base font-semibold overflow-hidden btn-shimmer"
            style={{
              background: 'linear-gradient(135deg, var(--rose), var(--rose-mid))',
              color: '#fff',
              boxShadow: '0 0 24px rgba(232,84,122,0.2)',
            }}
          >
            {tried ? 'Unlock This for My Photos →' : 'Create My Account →'}
          </motion.button>

          {!tried && (
            <p className="font-body text-xs text-center" style={{ color: 'var(--text-faint)' }}>
              Tap a suggestion above to see AURA in action first
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingAha;
