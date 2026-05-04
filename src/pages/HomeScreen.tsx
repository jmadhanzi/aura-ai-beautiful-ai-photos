import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, FolderOpen, Settings, ArrowUp, ChevronRight, Flame, Sparkles, Camera, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/useAppStore';

/* ── Data ───────────────────────────────────────────────── */
const quickTools = [
  { emoji: '✨', label: 'Skin', color: 'var(--gold)', bg: 'rgba(200,164,90,0.1)', border: 'rgba(200,164,90,0.22)' },
  { emoji: '👔', label: 'Headshot', color: 'var(--rose)', bg: 'rgba(232,84,122,0.08)', border: 'rgba(232,84,122,0.2)' },
  { emoji: '🌅', label: 'Background', color: 'var(--teal)', bg: 'rgba(0,201,173,0.08)', border: 'rgba(0,201,173,0.2)' },
  { emoji: '💎', label: 'Sculpt', color: 'var(--violet)', bg: 'rgba(139,108,240,0.08)', border: 'rgba(139,108,240,0.2)' },
  { emoji: '🎨', label: 'Style', color: 'var(--rose-mid)', bg: 'rgba(232,84,122,0.06)', border: 'rgba(232,84,122,0.16)' },
  { emoji: '🎬', label: 'Cinematic', color: 'var(--violet-mid)', bg: 'rgba(139,108,240,0.06)', border: 'rgba(139,108,240,0.16)' },
  { emoji: '💋', label: 'Makeup', color: '#F07090', bg: 'rgba(240,112,144,0.07)', border: 'rgba(240,112,144,0.18)' },
  { emoji: '📱', label: 'Optimize', color: 'var(--teal-mid)', bg: 'rgba(0,201,173,0.06)', border: 'rgba(0,201,173,0.16)' },
];


const oneTapChips = [
  { label: 'Polish this', icon: '✨' },
  { label: 'Make it editorial', icon: '📸' },
  { label: 'LinkedIn ready', icon: '💼' },
  { label: 'Dating profile', icon: '💛' },
  { label: 'Red carpet', icon: '🏆' },
  { label: 'Natural glow', icon: '🌿' },
];

const presets = [
  { id: 'editorial', label: 'Editorial', icon: '📸', desc: 'Vogue-ready', gradient: 'linear-gradient(135deg, #1a1030, #2d1f50)' },
  { id: 'confident', label: 'Confident', icon: '💼', desc: 'LinkedIn pro', gradient: 'linear-gradient(135deg, #0f1f2e, #1a3244)' },
  { id: 'natural', label: 'Natural Glow', icon: '🌿', desc: 'Effortless', gradient: 'linear-gradient(135deg, #0d2010, #1a3020)' },
  { id: 'dramatic', label: 'Dramatic', icon: '🎭', desc: 'High contrast', gradient: 'linear-gradient(135deg, #1a0a0a, #2e1010)' },
  { id: 'golden', label: 'Golden Hour', icon: '🌤', desc: 'Warm & cinematic', gradient: 'linear-gradient(135deg, #1e1508, #2e2010)' },
  { id: 'moody', label: 'Moody Film', icon: '🎞', desc: 'Analog grain', gradient: 'linear-gradient(135deg, #0a0a14, #141428)' },
];

const tabs = [
  { icon: Home, label: 'Home' },
  { icon: Search, label: 'Explore' },
  { icon: FolderOpen, label: 'History' },
  { icon: Settings, label: 'Settings' },
];

/* ── Component ──────────────────────────────────────────── */
interface RecentEdit { id: string; name: string; tool: string; time: string; gradient: string; }

const HomeScreen = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [hoverUpload, setHoverUpload] = useState(false);
  const [recentEdits, setRecentEdits] = useState<RecentEdit[]>([]);
  const [uploading, setUploading] = useState(false);
  const [streak, setStreak] = useState(7);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const editGradients = [
    'linear-gradient(135deg, #8B5CF6, #C084FC)',
    'linear-gradient(135deg, #E8547A, #F59E0B)',
    'linear-gradient(135deg, #00C9AD, #3B82F6)',
    'linear-gradient(135deg, #C8A45A, #EED498)',
  ];

  useEffect(() => {
    const fetchEdits = async () => {
      const { data } = await supabase
        .from('photo_edits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      if (data) {
        setRecentEdits(data.map((e, i) => ({
          id: e.id,
          name: e.original_url?.split('/').pop()?.split('_').slice(1).join('_') || 'Untitled',
          tool: e.tool_used || 'AI Edit',
          time: formatTime(e.created_at),
          gradient: editGradients[i % editGradients.length],
        })));
      }
    };
    fetchEdits();
  }, []);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return d.toLocaleDateString();
  };

  const handleFile = useCallback((file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) return;
    setSelectedFile(file);
    setAiResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleUploadAndTransform = async () => {
    if (!selectedFile || !currentUser) return;
    setUploading(true);
    const filePath = `${currentUser.id}/${Date.now()}_${selectedFile.name}`;
    const { error } = await supabase.storage.from('photos').upload(filePath, selectedFile);
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(filePath);
      await supabase.from('photo_edits').insert({
        user_id: currentUser.id,
        original_url: publicUrl,
        tool_used: selectedPreset ? `Preset: ${selectedPreset}` : 'AI Transform',
        prompt_used: prompt || null,
      });
    }
    setUploading(false);
    setPreview(null);
    setSelectedFile(null);
    setSelectedPreset(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return;
    setAiLoading(true);
    setAiResult(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          system: 'You are AURA — the world\'s most advanced AI beauty editor. Respond in exactly 2 short lines. Line 1 starts "Applied:" and names specific technical adjustments (frequency separation, luminosity masks, LUT grading, etc). Line 2 starts "Result:" and states the visual outcome in confident, punchy language. Never be generic. Always sound like a $500 professional edit.',
          messages: [{
            role: 'user',
            content: prompt,
          }],
        }),
      });
      const data = await response.json();
      const text = data?.content?.[0]?.text || 'Enhancement queued — upload a photo to apply.';
      setAiResult(text);
    } catch {
      setAiResult('Enhancement queued — upload a photo to apply.');
    } finally {
      setAiLoading(false);
    }
  };

  const tabNavigation = (label: string) => {
    setActiveTab(label);
    if (label === 'Settings') navigate('/settings');
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex min-h-screen flex-col pb-20" style={{ background: 'var(--ink)' }}>
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-36 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top center, rgba(200,164,90,0.06) 0%, transparent 70%)' }} />

      {/* Header */}
      <header className="relative flex items-center justify-between px-6 pt-14 pb-4">
        <div>
          <p className="font-body text-xs" style={{ color: 'var(--text-faint)' }}>{greeting} ✦</p>
          <h1 className="font-display text-xl font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>
            {currentUser?.name ? `Welcome back, ${currentUser.name.split(' ')[0]}` : 'Welcome to AURA'}
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          {/* Streak badge */}
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ background: 'rgba(232,84,122,0.08)', border: '1px solid rgba(232,84,122,0.2)' }}>
            <Flame className="h-3.5 w-3.5" style={{ color: 'var(--rose)' }} />
            <span className="font-mono text-xs font-bold" style={{ color: 'var(--rose)' }}>{streak}</span>
          </div>
          {/* Avatar */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={signOut}
            className="h-10 w-10 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0"
            style={{
              background: 'linear-gradient(135deg, var(--gold-dim), var(--gold), var(--gold-bright))',
              color: 'var(--ink)',
              boxShadow: '0 0 16px rgba(200,164,90,0.3)',
            }}
          >
            {currentUser?.name?.[0]?.toUpperCase() || 'A'}
          </motion.button>
        </div>
      </header>

      <div className="flex-1 px-6 space-y-7">
        {/* ── Upload Zone ─────────────────────────────────── */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={() => setHoverUpload(true)}
              onMouseLeave={() => setHoverUpload(false)}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center gap-3 rounded-3xl cursor-pointer transition-all"
              style={{
                padding: '28px 20px',
                border: `1.5px dashed ${dragOver ? 'rgba(200,164,90,0.7)' : hoverUpload ? 'rgba(200,164,90,0.45)' : 'rgba(200,164,90,0.22)'}`,
                background: dragOver || hoverUpload ? 'rgba(200,164,90,0.05)' : 'rgba(200,164,90,0.025)',
                transition: 'all 0.2s ease',
              }}
            >
              <motion.div
                animate={hoverUpload ? { y: [0, -5, 0] } : { y: 0 }}
                transition={hoverUpload ? { duration: 0.7, repeat: Infinity, ease: 'easeInOut' } : {}}
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: 'rgba(200,164,90,0.1)', border: '1px solid rgba(200,164,90,0.2)' }}
              >
                <Camera className="h-6 w-6" style={{ color: 'var(--gold)' }} />
              </motion.div>
              <div className="text-center">
                <p className="font-body text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Drop your photo here</p>
                <p className="font-body text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Tap to select · JPG, PNG, WebP</p>
              </div>
              <div className="flex gap-2">
                {['Skin', 'Headshot', 'Style'].map((t) => (
                  <span key={t} className="rounded-full px-2.5 py-1 font-mono text-[10px]"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-faint)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl overflow-hidden"
              style={{ border: '1px solid rgba(200,164,90,0.25)' }}
            >
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-52 object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(5,5,9,0.8) 100%)' }} />
                {selectedPreset && (
                  <div className="absolute bottom-3 left-3 rounded-full px-3 py-1"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(200,164,90,0.3)' }}>
                    <span className="font-body text-xs" style={{ color: 'var(--gold)' }}>
                      {presets.find(p => p.id === selectedPreset)?.icon} {presets.find(p => p.id === selectedPreset)?.label}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 flex gap-3" style={{ background: 'var(--void)' }}>
                <button
                  onClick={() => { setPreview(null); setSelectedFile(null); setSelectedPreset(null); }}
                  className="flex-1 rounded-xl py-3 text-sm font-body transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}
                >
                  Remove
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleUploadAndTransform}
                  disabled={uploading}
                  className="flex-1 rounded-xl py-3 text-sm font-body font-semibold relative overflow-hidden btn-shimmer disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, var(--rose), var(--rose-mid))',
                    color: '#fff',
                  }}
                >
                  {uploading ? 'Uploading…' : 'Transform →'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── AI Prompt Bar ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{
            background: 'var(--void)',
            border: '1px solid var(--glass-border)',
            borderLeft: '3px solid var(--gold)',
          }}
        >
          <Sparkles className="h-4 w-4 shrink-0" style={{ color: 'var(--gold)' }} />
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePromptSubmit()}
            placeholder="'Make me look confident and polished…'"
            className="flex-1 bg-transparent text-sm outline-none font-body"
            style={{ color: 'var(--text-primary)' }}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            onClick={handlePromptSubmit}
            disabled={aiLoading || !prompt.trim()}
            className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))' }}
          >
            <ArrowUp className="h-4 w-4" style={{ color: 'var(--ink)' }} />
          </motion.button>
        </motion.div>


        {/* ── One-tap Transformation Chips ───────────── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1"
        >
          {oneTapChips.map((chip) => (
            <motion.button
              key={chip.label}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => { setPrompt(chip.label); }}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 shrink-0 font-body text-xs font-medium transition-all"
              style={{
                background: prompt === chip.label ? 'rgba(200,164,90,0.12)' : 'var(--void)',
                border: `1px solid ${prompt === chip.label ? 'rgba(200,164,90,0.4)' : 'rgba(255,255,255,0.07)'}`,
                color: prompt === chip.label ? 'var(--gold)' : 'var(--text-secondary)',
              }}
            >
              <span style={{ fontSize: 11 }}>{chip.icon}</span>
              {chip.label}
            </motion.button>
          ))}
        </motion.div>

        {/* AI Loading */}
        {aiLoading && (
          <div className="rounded-2xl h-14 overflow-hidden relative"
            style={{ background: 'var(--void)', border: '1px solid rgba(200,164,90,0.15)' }}>
            <div className="absolute inset-0 animate-shimmer"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(200,164,90,0.08), transparent)', backgroundSize: '200% 100%' }} />
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <Zap className="h-4 w-4 animate-pulse" style={{ color: 'var(--gold)' }} />
              <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>Analyzing your request…</span>
            </div>
          </div>
        )}

        {/* AI Result */}
        <AnimatePresence>
          {aiResult && (() => {
            const appliedMatch = aiResult.match(/Applied:(.*?)(?=Result:|$)/s);
            const resultMatch = aiResult.match(/Result:(.*)/s);
            const applied = appliedMatch?.[1]?.trim() ?? aiResult;
            const resultText = resultMatch?.[1]?.trim();
            return (
              <motion.div
                key="ai-result"
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(200,164,90,0.22)' }}
              >
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'rgba(200,164,90,0.07)', borderBottom: '1px solid rgba(200,164,90,0.12)' }}>
                  <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--gold)' }} />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>✦ Enhancement Queued</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                    <span className="font-mono text-[9px]" style={{ color: 'var(--teal)' }}>READY</span>
                  </div>
                </div>
                <div className="px-4 pt-3 pb-3" style={{ background: 'var(--void)' }}>
                  <div className="flex items-start gap-2 mb-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--rose)' }} />
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-widest block mb-0.5" style={{ color: 'var(--text-faint)' }}>Applied</span>
                      <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{applied}</p>
                    </div>
                  </div>
                  {resultText && (
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--teal)' }} />
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-widest block mb-0.5" style={{ color: 'var(--text-faint)' }}>Result</span>
                        <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{resultText}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between"
                  style={{ background: 'rgba(200,164,90,0.03)', borderTop: '1px solid rgba(200,164,90,0.08)' }}>
                  <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>Upload a photo to apply this</span>
                  <button
                    onClick={() => { setAiResult(null); setPrompt(''); }}
                    className="font-mono text-[10px]"
                    style={{ color: 'var(--text-faint)' }}
                  >clear ×</button>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* ── Quick Tools ───────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Quick Tools</p>
            <button className="font-body text-xs" style={{ color: 'var(--gold)' }}>See all</button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1">
            {quickTools.map((t) => (
              <motion.button
                key={t.label}
                whileHover={{ y: -3, borderColor: t.border }}
                whileTap={{ scale: 0.93 }}
                className="flex flex-col items-center gap-1.5 rounded-2xl px-4 py-3.5 shrink-0 transition-all"
                style={{ background: t.bg, border: `1px solid ${t.border}`, minWidth: 68 }}
              >
                <span className="text-lg">{t.emoji}</span>
                <span className="font-body text-[10px] font-medium whitespace-nowrap" style={{ color: t.color }}>{t.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── AI Style Presets ─────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5" style={{ color: 'var(--rose)' }} />
              <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Style Presets</p>
            </div>
            <span className="font-mono text-[10px] rounded-full px-2 py-0.5"
              style={{ background: 'rgba(232,84,122,0.1)', color: 'var(--rose)', border: '1px solid rgba(232,84,122,0.2)' }}>
              Trending
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {presets.map((p) => (
              <motion.button
                key={p.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPreset(selectedPreset === p.id ? null : p.id)}
                className="relative flex flex-col items-center justify-center gap-1.5 rounded-2xl py-4 overflow-hidden"
                style={{
                  background: p.gradient,
                  border: selectedPreset === p.id
                    ? '1.5px solid var(--gold)'
                    : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: selectedPreset === p.id ? '0 0 16px rgba(200,164,90,0.2)' : 'none',
                }}
              >
                {selectedPreset === p.id && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--gold)' }}>
                    <span style={{ fontSize: 8, color: 'var(--ink)', fontWeight: 800 }}>✓</span>
                  </div>
                )}
                <span className="text-xl">{p.icon}</span>
                <span className="font-body text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>{p.label}</span>
                <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>{p.desc}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Recent Edits ──────────────────────────────── */}
        {recentEdits.length > 0 && (
          <div className="pb-2">
            <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Recent Edits</p>
            <div className="flex flex-col gap-2">
              {recentEdits.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-3 rounded-2xl p-3.5 cursor-pointer"
                  style={{ background: 'var(--void)', border: '1px solid var(--glass-border)' }}
                >
                  <div className="h-11 w-11 rounded-xl shrink-0" style={{ background: item.gradient }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                    <p className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.tool} · {item.time}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0" style={{ color: 'var(--text-faint)' }} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {recentEdits.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8">
            <div className="text-3xl">🪄</div>
            <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>Your edits will appear here</p>
            <p className="font-body text-xs text-center max-w-[200px]" style={{ color: 'var(--text-faint)' }}>Upload your first photo to get started</p>
          </div>
        )}
      </div>

      {/* ── Bottom Tab Bar ────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-4 px-4"
        style={{ background: 'var(--navbar-bg)', borderTop: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)' }}
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.label;
          return (
            <motion.button
              key={tab.label}
              whileTap={{ scale: 0.88 }}
              onClick={() => tabNavigation(tab.label)}
              className="flex flex-col items-center gap-1 relative px-3"
            >
              <tab.icon
                className="h-5 w-5 transition-colors"
                style={{ color: active ? 'var(--gold)' : 'var(--text-faint)' }}
              />
              <span className="font-body text-[10px] transition-colors" style={{ color: active ? 'var(--gold)' : 'var(--text-faint)', fontWeight: active ? 600 : 400 }}>
                {tab.label}
              </span>
              {active && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: 'var(--gold)' }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default HomeScreen;
