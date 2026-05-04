import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Search, FolderOpen, Settings, ArrowUp, ChevronRight,
  Flame, Sparkles, Camera, TrendingUp, Zap, Download, Share2,
  Copy, Crown, X, LayoutGrid, Clock, Wand2, Dna,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/useAppStore';
import { processImage } from '@/services/imageAI';
import { downloadImage, shareImage } from '@/services/exportService';
import { getOrCreateReferralCode, shareReferral, copyReferralLink } from '@/services/referral';
import { Analytics } from '@/services/analytics';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { EditSkeleton, GallerySkeleton } from '@/components/Skeleton';

/* ── Static data ─────────────────────────────────────── */
const quickTools = [
  { id: 'skin',       emoji: '✨', label: 'Skin',       color: 'var(--gold)',    bg: 'rgba(200,164,90,0.1)',   border: 'rgba(200,164,90,0.22)' },
  { id: 'headshot',   emoji: '👔', label: 'Headshot',   color: 'var(--rose)',    bg: 'rgba(232,84,122,0.08)', border: 'rgba(232,84,122,0.2)' },
  { id: 'background', emoji: '🌅', label: 'Background', color: 'var(--teal)',    bg: 'rgba(0,201,173,0.08)',  border: 'rgba(0,201,173,0.2)' },
  { id: 'sculpt',     emoji: '💎', label: 'Sculpt',     color: 'var(--violet)',  bg: 'rgba(139,108,240,0.08)', border: 'rgba(139,108,240,0.2)' },
  { id: 'style',      emoji: '🎨', label: 'Style',      color: 'var(--rose-mid)',bg: 'rgba(232,84,122,0.06)', border: 'rgba(232,84,122,0.16)' },
  { id: 'cinematic',  emoji: '🎬', label: 'Cinematic',  color: 'var(--violet-mid)', bg: 'rgba(139,108,240,0.06)', border: 'rgba(139,108,240,0.16)' },
  { id: 'makeup',     emoji: '💋', label: 'Makeup',     color: '#F07090',        bg: 'rgba(240,112,144,0.07)', border: 'rgba(240,112,144,0.18)' },
  { id: 'optimize',   emoji: '📱', label: 'Optimize',   color: 'var(--teal-mid)',bg: 'rgba(0,201,173,0.06)',  border: 'rgba(0,201,173,0.16)' },
];

const presets = [
  { id: 'editorial', label: 'Editorial',    icon: '📸', desc: 'Vogue-ready',    gradient: 'linear-gradient(135deg, #1a1030, #2d1f50)' },
  { id: 'confident', label: 'Confident',    icon: '💼', desc: 'LinkedIn pro',   gradient: 'linear-gradient(135deg, #0f1f2e, #1a3244)' },
  { id: 'natural',   label: 'Natural Glow', icon: '🌿', desc: 'Effortless',     gradient: 'linear-gradient(135deg, #0d2010, #1a3020)' },
  { id: 'dramatic',  label: 'Dramatic',     icon: '🎭', desc: 'High contrast',  gradient: 'linear-gradient(135deg, #1a0a0a, #2e1010)' },
  { id: 'golden',    label: 'Golden Hour',  icon: '🌤', desc: 'Cinematic',      gradient: 'linear-gradient(135deg, #1e1508, #2e2010)' },
  { id: 'moody',     label: 'Moody Film',   icon: '🎞', desc: 'Analog grain',   gradient: 'linear-gradient(135deg, #0a0a14, #141428)' },
];

const oneTapChips = [
  { label: '✨ Polish this',      prompt: 'Polish and perfect my appearance professionally' },
  { label: '💼 LinkedIn ready',  prompt: 'Professional LinkedIn headshot look' },
  { label: '🎭 Editorial',       prompt: 'Editorial magazine cover look' },
  { label: '🌅 Golden hour',     prompt: 'Warm cinematic golden hour glow' },
  { label: '💛 Dating profile',  prompt: 'Attractive and approachable dating profile' },
  { label: '🏆 Red carpet',      prompt: 'Glamorous red carpet ready look' },
];

const navTabs = [
  { icon: Home,       label: 'Home',    view: 'home' },
  { icon: LayoutGrid, label: 'Gallery', view: 'gallery' },
  { icon: TrendingUp, label: 'Trends',  view: 'trends' },
  { icon: Settings,   label: 'Settings',view: 'settings' },
];

/* ── AI System prompt ────────────────────────────────── */
const AURA_SYSTEM = `You are AURA — the world's most advanced AI beauty editor. The user's goal is: ${localStorage.getItem('aura_goal') ?? 'everyday confidence'}.
Respond in exactly 2 lines. Line 1 starts "Applied:" and names specific technical adjustments. Line 2 starts "Result:" and states the visual outcome confidently. Reference real techniques: frequency separation, luminosity masks, LUT grading, face sculpting vectors. Sound like a $500 professional edit brief.`;

/* ── Style DNA helper ────────────────────────────────── */
function computeStyleDNA(edits: { tool_used?: string }[]) {
  const counts: Record<string, number> = {};
  for (const e of edits) {
    const t = (e.tool_used ?? '').toLowerCase();
    if (t.includes('skin') || t.includes('skin'))  counts['Warm & Luminous'] = (counts['Warm & Luminous'] ?? 0) + 1;
    if (t.includes('editorial'))                    counts['Editorial']       = (counts['Editorial'] ?? 0) + 2;
    if (t.includes('confident') || t.includes('headshot')) counts['Professional'] = (counts['Professional'] ?? 0) + 2;
    if (t.includes('dramatic') || t.includes('moody'))     counts['Dramatic']    = (counts['Dramatic'] ?? 0) + 2;
    if (t.includes('golden') || t.includes('cinematic'))   counts['Cinematic']   = (counts['Cinematic'] ?? 0) + 2;
    if (t.includes('natural'))                      counts['Natural']        = (counts['Natural'] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
}

interface Edit {
  id: string;
  name: string;
  tool: string;
  time: string;
  original_url: string | null;
  edited_url: string | null;
  gradient: string;
}

/* ── Main Component ──────────────────────────────────── */
const HomeScreen = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const { isProUser } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeView, setActiveView] = useState('home');
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [hoverUpload, setHoverUpload] = useState(false);
  const [edits, setEdits] = useState<Edit[]>([]);
  const [editsLoading, setEditsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedResult, setProcessedResult] = useState<{ originalUrl: string; editedUrl: string; tool: string } | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCopied, setReferralCopied] = useState(false);
  const [showExportSheet, setShowExportSheet] = useState(false);
  const [styleDNA, setStyleDNA] = useState<string[]>([]);
  const [streak] = useState(7);

  const gradients = [
    'linear-gradient(135deg, #8B5CF6, #C084FC)',
    'linear-gradient(135deg, #E8547A, #F59E0B)',
    'linear-gradient(135deg, #00C9AD, #3B82F6)',
    'linear-gradient(135deg, #C8A45A, #EED498)',
  ];

  /* ── Fetch edits ─────────────────────────────────── */
  useEffect(() => {
    const fetchEdits = async () => {
      setEditsLoading(true);
      const { data } = await supabase
        .from('photo_edits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12);

      if (data) {
        const mapped = data.map((e, i) => ({
          id: e.id,
          name: e.original_url?.split('/').pop()?.split('_').slice(1).join('_') || 'Edit',
          tool: e.tool_used ?? 'AI Edit',
          time: formatTime(e.created_at),
          original_url: e.original_url,
          edited_url: e.edited_url,
          gradient: gradients[i % gradients.length],
        }));
        setEdits(mapped);
        // Compute Style DNA from history
        if (data.length >= 3) setStyleDNA(computeStyleDNA(data));
      }
      setEditsLoading(false);
    };
    fetchEdits();
  }, []);

  /* ── Referral code ───────────────────────────────── */
  useEffect(() => {
    if (currentUser?.id) {
      getOrCreateReferralCode(currentUser.id).then(setReferralCode).catch(() => {});
    }
  }, [currentUser?.id]);

  const formatTime = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return Math.floor(diff / 1440) + 'd ago';
  };

  /* ── File handling ───────────────────────────────── */
  const handleFile = useCallback((file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) return;
    setSelectedFile(file);
    setProcessedResult(null);
    setAiResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    Analytics.photoUploaded();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  /* ── Upload → AI Process → Save ─────────────────── */
  const handleTransform = async () => {
    if (!selectedFile || !currentUser) return;
    const tool = selectedTool ?? 'skin';

    setUploading(true);
    const filePath = `${currentUser.id}/${Date.now()}_${selectedFile.name}`;
    const { error } = await supabase.storage.from('photos').upload(filePath, selectedFile);
    setUploading(false);

    if (error) return;

    const { data: { publicUrl: originalUrl } } = supabase.storage.from('photos').getPublicUrl(filePath);

    setUploading(false);
    setProcessing(true);
    setProcessingProgress(0);

    // Animate progress bar
    const interval = setInterval(() => {
      setProcessingProgress(p => Math.min(p + Math.random() * 12, 88));
    }, 300);

    Analytics.aiProcessingStarted(tool);

    const result = await processImage(originalUrl, tool, prompt || undefined);
    clearInterval(interval);
    setProcessingProgress(100);

    Analytics.aiProcessingCompleted(tool, result.processingMs);

    // Save to Supabase
    await supabase.from('photo_edits').insert({
      user_id: currentUser.id,
      original_url: originalUrl,
      edited_url: result.editedUrl,
      tool_used: tool,
      prompt_used: prompt || null,
    });

    setUploadedUrl(originalUrl);
    setProcessedResult({ originalUrl, editedUrl: result.editedUrl, tool });
    setProcessing(false);
    setProcessingProgress(0);

    // Refresh edit list
    const { data: fresh } = await supabase
      .from('photo_edits')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(12);
    if (fresh) {
      setEdits(fresh.map((e, i) => ({
        id: e.id, name: e.original_url?.split('/').pop()?.split('_').slice(1).join('_') || 'Edit',
        tool: e.tool_used ?? 'AI Edit', time: formatTime(e.created_at),
        original_url: e.original_url, edited_url: e.edited_url,
        gradient: gradients[i % gradients.length],
      })));
      if (fresh.length >= 3) setStyleDNA(computeStyleDNA(fresh));
    }
  };

  /* ── AI Prompt ───────────────────────────────────── */
  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return;
    setAiLoading(true);
    setAiResult(null);
    Analytics.ahaTriggered(prompt);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          system: AURA_SYSTEM,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await res.json();
      setAiResult(data?.content?.[0]?.text ?? 'Enhancement queued — upload a photo to apply.');
    } catch {
      setAiResult('Enhancement queued — upload a photo to apply.');
    } finally {
      setAiLoading(false);
    }
  };

  const parseAiResult = (raw: string) => {
    const applied = raw.match(/Applied:(.*?)(?=Result:|$)/s)?.[1]?.trim() ?? raw;
    const result  = raw.match(/Result:(.*)/s)?.[1]?.trim();
    return { applied, result };
  };

  /* ── Export ──────────────────────────────────────── */
  const handleDownload = async () => {
    if (!processedResult) return;
    await downloadImage({
      imageUrl: processedResult.editedUrl,
      isPro: isProUser,
      label: processedResult.tool,
    }, `aura-${processedResult.tool}-edit.jpg`);
    setShowExportSheet(false);
  };

  const handleShare = async () => {
    if (!processedResult) return;
    await shareImage({ imageUrl: processedResult.editedUrl, isPro: isProUser });
    setShowExportSheet(false);
  };

  /* ── Referral ────────────────────────────────────── */
  const handleCopyReferral = async () => {
    if (!referralCode) return;
    await copyReferralLink(referralCode);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2500);
  };

  const handleShareReferral = async () => {
    if (!referralCode) return;
    await shareReferral(referralCode);
  };

  /* ── Tab navigation ──────────────────────────────── */
  const handleTabClick = (view: string) => {
    if (view === 'settings') { navigate('/settings'); return; }
    setActiveView(view);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  /* ── Render ──────────────────────────────────────── */
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
            {currentUser?.name ? `Hey, ${currentUser.name.split(' ')[0]}` : 'AURA Studio'}
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ background: 'rgba(232,84,122,0.08)', border: '1px solid rgba(232,84,122,0.2)' }}>
            <Flame className="h-3.5 w-3.5" style={{ color: 'var(--rose)' }} />
            <span className="font-mono text-xs font-bold" style={{ color: 'var(--rose)' }}>{streak}</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={signOut}
            className="h-10 w-10 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0"
            style={{
              background: 'linear-gradient(135deg, var(--gold-dim), var(--gold), var(--gold-bright))',
              color: 'var(--ink)', boxShadow: '0 0 16px rgba(200,164,90,0.3)',
            }}
          >
            {currentUser?.name?.[0]?.toUpperCase() || 'A'}
          </motion.button>
        </div>
      </header>

      {/* ── VIEWS ─────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* ══ HOME VIEW ══════════════════════════════ */}
        {activeView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 px-6 space-y-6"
          >
            <input
              ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />

            {/* Upload / Preview / Result */}
            <AnimatePresence mode="wait">
              {/* ── Processed Result ── */}
              {processedResult && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(200,164,90,0.25)' }}>
                  {/* Before/After slider with REAL images */}
                  <BeforeAfterSlider
                    beforeUrl={processedResult.originalUrl}
                    afterUrl={processedResult.editedUrl}
                    height={260}
                  />
                  <div className="p-4 flex gap-3" style={{ background: 'var(--void)' }}>
                    <motion.button whileTap={{ scale: 0.95 }}
                      onClick={() => setShowExportSheet(true)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-body text-sm font-semibold overflow-hidden btn-shimmer"
                      style={{ background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))', color: 'var(--ink)' }}>
                      <Download className="h-4 w-4" /> Export
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-body text-sm font-semibold"
                      style={{ background: 'rgba(232,84,122,0.12)', border: '1px solid rgba(232,84,122,0.25)', color: 'var(--rose)' }}>
                      <Share2 className="h-4 w-4" /> Share
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.95 }}
                      onClick={() => { setProcessedResult(null); setPreview(null); setSelectedFile(null); }}
                      className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <X className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                    </motion.button>
                  </div>

                  {/* Pro upsell watermark notice */}
                  {!isProUser && (
                    <div className="mx-4 mb-4 flex items-center gap-3 rounded-xl p-3"
                      style={{ background: 'rgba(200,164,90,0.06)', border: '1px solid rgba(200,164,90,0.2)' }}>
                      <Crown className="h-4 w-4 shrink-0" style={{ color: 'var(--gold)' }} />
                      <p className="font-body text-xs flex-1" style={{ color: 'var(--text-secondary)' }}>
                        Free exports include AURA watermark.{' '}
                        <button onClick={() => navigate('/paywall/1')} className="underline" style={{ color: 'var(--gold)' }}>
                          Upgrade for clean exports →
                        </button>
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Processing State ── */}
              {processing && (
                <motion.div key="processing" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="rounded-3xl p-6 flex flex-col items-center gap-4"
                  style={{ background: 'var(--void)', border: '1px solid rgba(200,164,90,0.2)' }}>
                  <div className="relative h-16 w-16 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full animate-pulse-ring" style={{ border: '2px solid rgba(200,164,90,0.3)' }} />
                    <div className="h-12 w-12 rounded-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))' }}>
                      <Wand2 className="h-5 w-5" style={{ color: 'var(--ink)' }} />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-body text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                      AI is enhancing your photo…
                    </p>
                    <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                      {selectedTool ? quickTools.find(t => t.id === selectedTool)?.label ?? 'Processing' : 'Skin Perfecting'}
                    </p>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, var(--gold-dim), var(--gold), var(--gold-bright))' }}
                      animate={{ width: `${processingProgress}%` }}
                      transition={{ ease: 'easeOut' }}
                    />
                  </div>
                  <p className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>
                    {processingProgress.toFixed(0)}% complete
                  </p>
                </motion.div>
              )}

              {/* ── Upload (no preview yet) ── */}
              {!preview && !processedResult && !processing && (
                <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  onClick={() => fileInputRef.current?.click()}
                  onMouseEnter={() => setHoverUpload(true)}
                  onMouseLeave={() => setHoverUpload(false)}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className="flex flex-col items-center justify-center gap-3 rounded-3xl cursor-pointer"
                  style={{
                    padding: '28px 20px',
                    border: `1.5px dashed ${dragOver ? 'rgba(200,164,90,0.7)' : hoverUpload ? 'rgba(200,164,90,0.45)' : 'rgba(200,164,90,0.22)'}`,
                    background: dragOver || hoverUpload ? 'rgba(200,164,90,0.05)' : 'rgba(200,164,90,0.025)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <motion.div
                    animate={hoverUpload ? { y: [0, -5, 0] } : { y: 0 }}
                    transition={hoverUpload ? { duration: 0.7, repeat: Infinity } : {}}
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
              )}

              {/* ── Preview with tool selector ── */}
              {preview && !processedResult && !processing && (
                <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(200,164,90,0.25)' }}>
                  <div className="relative">
                    <img src={preview} alt="Preview" className="w-full h-52 object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(5,5,9,0.85) 100%)' }} />
                    {selectedTool && (
                      <div className="absolute bottom-3 left-3 rounded-full px-3 py-1"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(200,164,90,0.3)' }}>
                        <span className="font-body text-xs" style={{ color: 'var(--gold)' }}>
                          {quickTools.find(t => t.id === selectedTool)?.emoji} {quickTools.find(t => t.id === selectedTool)?.label}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Tool selector row */}
                  <div className="p-3 flex gap-2 overflow-x-auto scrollbar-none" style={{ background: 'rgba(5,5,9,0.95)' }}>
                    {quickTools.map(t => (
                      <button key={t.id} onClick={() => setSelectedTool(t.id === selectedTool ? null : t.id)}
                        className="flex flex-col items-center gap-1 rounded-xl px-3 py-2 shrink-0 transition-all"
                        style={{
                          background: selectedTool === t.id ? t.bg : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${selectedTool === t.id ? t.border : 'rgba(255,255,255,0.06)'}`,
                        }}>
                        <span className="text-sm">{t.emoji}</span>
                        <span className="font-body text-[10px]" style={{ color: selectedTool === t.id ? t.color : 'var(--text-faint)' }}>{t.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="p-4 flex gap-3" style={{ background: 'var(--void)' }}>
                    <button onClick={() => { setPreview(null); setSelectedFile(null); setSelectedTool(null); }}
                      className="flex-1 rounded-xl py-3 text-sm font-body"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>
                      Remove
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={handleTransform}
                      disabled={uploading}
                      className="flex-1 rounded-xl py-3 text-sm font-body font-semibold overflow-hidden btn-shimmer disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, var(--rose), var(--rose-mid))', color: '#fff' }}>
                      {uploading ? 'Uploading…' : `Transform${selectedTool ? ` with ${quickTools.find(t => t.id === selectedTool)?.label}` : ''} →`}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── AI Prompt Bar ─────────────────── */}
            <div className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: 'var(--void)', border: '1px solid var(--glass-border)', borderLeft: '3px solid var(--gold)' }}>
              <Sparkles className="h-4 w-4 shrink-0" style={{ color: 'var(--gold)' }} />
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePromptSubmit()}
                placeholder="Describe any look — 'confident editorial glow'"
                className="flex-1 bg-transparent text-sm outline-none font-body"
                style={{ color: 'var(--text-primary)' }}
              />
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                onClick={handlePromptSubmit}
                disabled={aiLoading || !prompt.trim()}
                className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))' }}>
                <ArrowUp className="h-4 w-4" style={{ color: 'var(--ink)' }} />
              </motion.button>
            </div>

            {/* One-tap chips */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
              {oneTapChips.map((chip) => (
                <motion.button key={chip.label}
                  whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.94 }}
                  onClick={() => { setPrompt(chip.prompt); setActiveChip(chip.label); }}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 shrink-0 font-body text-xs font-medium"
                  style={{
                    background: activeChip === chip.label ? 'rgba(200,164,90,0.12)' : 'var(--void)',
                    border: `1px solid ${activeChip === chip.label ? 'rgba(200,164,90,0.4)' : 'rgba(255,255,255,0.07)'}`,
                    color: activeChip === chip.label ? 'var(--gold)' : 'var(--text-secondary)',
                  }}>
                  {chip.label}
                </motion.button>
              ))}
            </div>

            {/* AI Loading */}
            {aiLoading && (
              <div className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background: 'var(--void)', border: '1px solid var(--glass-border)' }}>
                <Zap className="h-4 w-4 animate-pulse" style={{ color: 'var(--gold)' }} />
                <div className="flex-1 flex flex-col gap-1.5">
                  {[75, 55].map((w, i) => (
                    <div key={i} className="h-2 rounded-full overflow-hidden" style={{ width: `${w}%`, background: 'rgba(255,255,255,0.04)' }}>
                      <div className="h-full animate-shimmer" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,164,90,0.3), transparent)', backgroundSize: '200% 100%' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Result — two-part */}
            <AnimatePresence>
              {aiResult && (() => {
                const { applied, result: res } = parseAiResult(aiResult);
                return (
                  <motion.div key="ai-result"
                    initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                    className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(200,164,90,0.22)' }}>
                    <div className="flex items-center gap-2 px-4 py-2.5"
                      style={{ background: 'rgba(200,164,90,0.07)', borderBottom: '1px solid rgba(200,164,90,0.12)' }}>
                      <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--gold)' }} />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>✦ Enhancement Brief</span>
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
                      {res && (
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--teal)' }} />
                          <div>
                            <span className="font-mono text-[9px] uppercase tracking-widest block mb-0.5" style={{ color: 'var(--text-faint)' }}>Result</span>
                            <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{res}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2.5 flex items-center justify-between"
                      style={{ background: 'rgba(200,164,90,0.03)', borderTop: '1px solid rgba(200,164,90,0.08)' }}>
                      <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>Upload a photo to apply</span>
                      <button onClick={() => { setAiResult(null); setPrompt(''); setActiveChip(null); }}
                        className="font-mono text-[10px]" style={{ color: 'var(--text-faint)' }}>clear ×</button>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            {/* Quick Tools */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Quick Tools</p>
              </div>
              <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1">
                {quickTools.map((t) => (
                  <motion.button key={t.label}
                    whileHover={{ y: -3 }} whileTap={{ scale: 0.93 }}
                    onClick={() => { setSelectedTool(t.id); if (preview) {} else fileInputRef.current?.click(); }}
                    className="flex flex-col items-center gap-1.5 rounded-2xl px-4 py-3.5 shrink-0"
                    style={{ background: selectedTool === t.id ? t.bg : 'var(--void)', border: `1px solid ${selectedTool === t.id ? t.border : 'rgba(255,255,255,0.07)'}`, minWidth: 68 }}>
                    <span className="text-lg">{t.emoji}</span>
                    <span className="font-body text-[10px] font-medium whitespace-nowrap" style={{ color: selectedTool === t.id ? t.color : 'var(--text-muted)' }}>{t.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Style DNA — show after 3+ edits */}
            {styleDNA.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4" style={{ background: 'var(--void)', border: '1px solid rgba(139,108,240,0.25)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Dna className="h-4 w-4" style={{ color: 'var(--violet)' }} />
                  <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--violet)' }}>Your Style DNA</span>
                </div>
                <p className="font-body text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Based on your edit history, AURA has learned your signature look:
                </p>
                <div className="flex flex-wrap gap-2">
                  {styleDNA.map((trait) => (
                    <span key={trait} className="rounded-full px-3 py-1.5 font-body text-xs font-semibold"
                      style={{ background: 'rgba(139,108,240,0.1)', border: '1px solid rgba(139,108,240,0.3)', color: 'var(--violet-mid)' }}>
                      ✦ {trait}
                    </span>
                  ))}
                </div>
                <p className="font-body text-xs mt-3" style={{ color: 'var(--text-faint)' }}>
                  AURA now auto-applies your style preferences to every edit.
                </p>
              </motion.div>
            )}

            {/* Referral Card */}
            <div className="rounded-2xl p-4" style={{ background: 'var(--void)', border: '1px solid rgba(0,201,173,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4" style={{ color: 'var(--teal)' }} />
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--teal)' }}>Give 1 month, Get 1 month</span>
              </div>
              <p className="font-body text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                Share AURA with a friend. When they subscribe, you both get a free month of Pro.
              </p>
              {referralCode ? (
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5"
                    style={{ background: 'rgba(0,201,173,0.06)', border: '1px solid rgba(0,201,173,0.2)' }}>
                    <span className="font-mono text-sm font-bold flex-1" style={{ color: 'var(--teal)' }}>{referralCode}</span>
                  </div>
                  <motion.button whileTap={{ scale: 0.94 }} onClick={handleCopyReferral}
                    className="rounded-xl px-4 flex items-center gap-2 font-body text-sm font-semibold"
                    style={{ background: referralCopied ? 'rgba(0,201,173,0.15)' : 'rgba(0,201,173,0.1)', border: '1px solid rgba(0,201,173,0.3)', color: 'var(--teal)' }}>
                    <Copy className="h-3.5 w-3.5" />
                    {referralCopied ? 'Copied!' : 'Copy'}
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.94 }} onClick={handleShareReferral}
                    className="rounded-xl px-4 flex items-center gap-2 font-body text-sm font-semibold"
                    style={{ background: 'rgba(0,201,173,0.1)', border: '1px solid rgba(0,201,173,0.3)', color: 'var(--teal)' }}>
                    <Share2 className="h-3.5 w-3.5" />
                  </motion.button>
                </div>
              ) : (
                <div className="h-10 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', animation: 'shimmer 1.8s linear infinite' }} />
              )}
            </div>
          </motion.div>
        )}

        {/* ══ GALLERY VIEW ═══════════════════════════ */}
        {activeView === 'gallery' && (
          <motion.div key="gallery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex-1 px-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Your Edits</h2>
                <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>{edits.length} transformations</p>
              </div>
            </div>

            {editsLoading ? (
              <GallerySkeleton />
            ) : edits.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16">
                <span className="text-4xl">🪄</span>
                <p className="font-body text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>No edits yet</p>
                <p className="font-body text-xs text-center max-w-[200px]" style={{ color: 'var(--text-muted)' }}>Upload your first photo to see your transformations here</p>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setActiveView('home')}
                  className="mt-2 rounded-xl px-6 py-3 font-body text-sm font-semibold btn-shimmer"
                  style={{ background: 'linear-gradient(135deg, var(--rose), var(--rose-mid))', color: '#fff' }}>
                  Upload a Photo
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pb-6">
                {edits.map((edit) => (
                  <motion.div key={edit.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative rounded-2xl overflow-hidden cursor-pointer aspect-square"
                    style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    {edit.edited_url || edit.original_url ? (
                      <img
                        src={edit.edited_url ?? edit.original_url ?? ''}
                        alt={edit.tool}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full" style={{ background: edit.gradient }} />
                    )}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(5,5,9,0.85) 100%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <p className="font-body text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{edit.tool}</p>
                      <p className="font-mono text-[9px]" style={{ color: 'var(--text-faint)' }}>{edit.time}</p>
                    </div>
                    {edit.edited_url && edit.original_url && edit.edited_url !== edit.original_url && (
                      <div className="absolute top-2 right-2 rounded-full px-2 py-0.5"
                        style={{ background: 'rgba(200,164,90,0.9)', backdropFilter: 'blur(8px)' }}>
                        <span className="font-mono text-[9px] font-bold" style={{ color: 'var(--ink)' }}>AI ✦</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ══ TRENDS VIEW ════════════════════════════ */}
        {activeView === 'trends' && (
          <motion.div key="trends" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex-1 px-6">
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4" style={{ color: 'var(--rose)' }} />
                <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>This Week's Looks</h2>
              </div>
              <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>Trending AI styles — updated every Monday</p>
            </div>

            <div className="flex flex-col gap-4 pb-6">
              {[
                { rank: 1, name: 'Quiet Luxury Editorial', stat: '+284% this week', gradient: 'linear-gradient(135deg, #1a1228, #2a1a40)', desc: 'Understated, high-end. No flash, maximum elegance.', chips: ['Soft skin', 'Muted tones', 'Subtle sculpt'] },
                { rank: 2, name: 'Coastal Grandeur', stat: '+156% this week', gradient: 'linear-gradient(135deg, #0e1e28, #1a3a44)', desc: 'Sun-kissed, effortless. The vacation you deserve.', chips: ['Golden warmth', 'Bright eyes', 'Natural glow'] },
                { rank: 3, name: 'Corporate Dark Mode', stat: '+98% this week', gradient: 'linear-gradient(135deg, #0a0a14, #141428)', desc: 'Tech exec energy. Precise, powerful, polished.', chips: ['High contrast', 'Sharp detail', 'Cool tones'] },
                { rank: 4, name: 'Dopamine Dressing', stat: '+76% this week', gradient: 'linear-gradient(135deg, #1f0a1a, #3a1030)', desc: 'Bold, joyful, unapologetically vibrant.', chips: ['Vivid saturation', 'Warm skin', 'Lifted shadows'] },
              ].map((trend) => (
                <motion.div key={trend.rank}
                  whileHover={{ x: 3 }}
                  className="rounded-2xl overflow-hidden" style={{ background: 'var(--void)', border: '1px solid var(--glass-border)' }}>
                  <div className="flex items-center gap-3 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0 font-display font-bold text-lg"
                      style={{ background: trend.gradient, color: 'var(--gold)' }}>
                      #{trend.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{trend.name}</p>
                      <p className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--rose)' }}>{trend.stat}</p>
                    </div>
                  </div>
                  <div className="px-4 pb-3">
                    <p className="font-body text-xs mb-2.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{trend.desc}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {trend.chips.map(c => (
                        <span key={c} className="rounded-full px-2.5 py-1 font-body text-[10px]"
                          style={{ background: 'rgba(200,164,90,0.07)', border: '1px solid rgba(200,164,90,0.18)', color: 'var(--gold)' }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mx-4 mb-4">
                    <motion.button whileTap={{ scale: 0.97 }}
                      onClick={() => { setActiveView('home'); setPrompt(`Apply the ${trend.name} look`); }}
                      className="w-full rounded-xl py-2.5 font-body text-xs font-semibold"
                      style={{ background: 'rgba(232,84,122,0.1)', border: '1px solid rgba(232,84,122,0.22)', color: 'var(--rose)' }}>
                      Try This Look →
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Export Bottom Sheet ────────────────────── */}
      <AnimatePresence>
        {showExportSheet && (
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowExportSheet(false)} />
            <motion.div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-6 py-8"
              style={{ background: 'var(--surface-1)', border: '1px solid rgba(255,255,255,0.08)' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}>
              <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'rgba(255,255,255,0.15)' }} />
              <h3 className="font-display text-xl font-semibold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>Export Your Edit</h3>
              <p className="font-body text-sm text-center mb-6" style={{ color: 'var(--text-muted)' }}>
                {isProUser ? 'Clean export — no watermark.' : 'Free export includes AURA watermark.'}
              </p>
              <div className="flex flex-col gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleDownload}
                  className="flex items-center gap-3 rounded-2xl p-4 font-body text-sm font-semibold"
                  style={{ background: 'rgba(200,164,90,0.1)', border: '1px solid rgba(200,164,90,0.25)' }}>
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(200,164,90,0.15)' }}>
                    <Download className="h-5 w-5" style={{ color: 'var(--gold)' }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p style={{ color: 'var(--text-primary)' }}>Save to Camera Roll</p>
                    <p className="font-body text-xs font-normal mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {isProUser ? 'High quality JPEG · No watermark' : 'JPEG · Includes AURA watermark'}
                    </p>
                  </div>
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleShare}
                  className="flex items-center gap-3 rounded-2xl p-4 font-body text-sm font-semibold"
                  style={{ background: 'rgba(232,84,122,0.08)', border: '1px solid rgba(232,84,122,0.2)' }}>
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(232,84,122,0.1)' }}>
                    <Share2 className="h-5 w-5" style={{ color: 'var(--rose)' }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p style={{ color: 'var(--text-primary)' }}>Share to Instagram / TikTok</p>
                    <p className="font-body text-xs font-normal mt-0.5" style={{ color: 'var(--text-muted)' }}>Opens native share sheet</p>
                  </div>
                </motion.button>
                {!isProUser && (
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setShowExportSheet(false); navigate('/paywall/1'); }}
                    className="flex items-center gap-3 rounded-2xl p-4 font-body text-sm font-semibold btn-shimmer"
                    style={{ background: 'linear-gradient(135deg, var(--rose), var(--rose-mid))', color: '#fff' }}>
                    <Crown className="h-5 w-5" />
                    <div className="flex-1 text-left">
                      <p>Upgrade to Pro — Remove Watermark</p>
                      <p className="font-body text-xs font-normal mt-0.5 opacity-80">$4.17/mo · 3-day free trial</p>
                    </div>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Bottom Tab Bar ─────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-4 px-4"
        style={{ background: 'var(--navbar-bg)', borderTop: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)' }}>
        {navTabs.map((tab) => {
          const active = activeView === tab.view;
          return (
            <motion.button key={tab.label} whileTap={{ scale: 0.88 }}
              onClick={() => handleTabClick(tab.view)}
              className="flex flex-col items-center gap-1 relative px-3">
              <tab.icon className="h-5 w-5" style={{ color: active ? 'var(--gold)' : 'var(--text-faint)' }} />
              <span className="font-body text-[10px]" style={{ color: active ? 'var(--gold)' : 'var(--text-faint)', fontWeight: active ? 600 : 400 }}>
                {tab.label}
              </span>
              {active && (
                <motion.div layoutId="tab-dot" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: 'var(--gold)' }} />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default HomeScreen;
