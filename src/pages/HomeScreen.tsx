import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/design-system/animations';
import { ChevronRight, ArrowUp, Home, Search, FolderOpen, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/useAppStore';
const quickTools = [
  { emoji: '✨', label: 'Skin' },
  { emoji: '👔', label: 'Headshot' },
  { emoji: '🌅', label: 'Background' },
  { emoji: '💎', label: 'Sculpt' },
  { emoji: '🎨', label: 'Style' },
  { emoji: '🎬', label: 'Cinematic' },
  { emoji: '💋', label: 'Makeup' },
  { emoji: '📱', label: 'Optimize' },
];

interface RecentEdit {
  id: string;
  name: string;
  tool: string;
  time: string;
  gradient: string;
}

const tabs = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Search, label: 'Explore', path: '/home' },
  { icon: FolderOpen, label: 'History', path: '/home' },
  { icon: Settings, label: 'Settings', path: '/home' },
];

const HomeScreen = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(false);
  const [hoverUpload, setHoverUpload] = useState(false);
  const [recentEdits, setRecentEdits] = useState<RecentEdit[]>([]);
  const [uploading, setUploading] = useState(false);

  const gradients = [
    'linear-gradient(135deg, #8B5CF6, #C084FC)',
    'linear-gradient(135deg, #FF6B9D, #F59E0B)',
    'linear-gradient(135deg, #06B6D4, #3B82F6)',
  ];

  // Fetch recent edits
  useEffect(() => {
    const fetchEdits = async () => {
      const { data } = await supabase
        .from('photo_edits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) {
        setRecentEdits(data.map((e, i) => ({
          id: e.id,
          name: e.original_url?.split('/').pop() || 'Untitled',
          tool: e.tool_used || 'AI Edit',
          time: new Date(e.created_at).toLocaleDateString(),
          gradient: gradients[i % gradients.length],
        })));
      }
    };
    fetchEdits();
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) return;
    setSelectedFile(file);
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
        tool_used: 'AI Transform',
        prompt_used: prompt || null,
      });
    }
    setUploading(false);
    setPreview(null);
    setSelectedFile(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handlePromptSubmit = () => {
    if (!prompt.trim()) return;
    setAiLoading(true);
    setAiResult(false);
    setTimeout(() => { setAiLoading(false); setAiResult(true); }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-obsidian pb-20">
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />

      {/* Header */}
      <header className="relative flex items-center justify-between px-6 pt-12 pb-4">
        <div>
          <p className="text-xs text-muted-foreground font-body">Good morning ✦</p>
          <h1 className="font-display text-xl font-bold text-foreground">Welcome{currentUser?.name ? `, ${currentUser.name}` : ' to AURA'}</h1>
        </div>
        <button onClick={signOut} className="h-10 w-10 rounded-full flex items-center justify-center font-display font-bold text-sm text-obsidian" style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)' }}>
          {currentUser?.name?.[0]?.toUpperCase() || 'A'}
        </button>
      </header>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex-1 px-6 space-y-6">

        {/* Upload Zone */}
        <motion.div variants={fadeUp}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />

          {!preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={() => setHoverUpload(true)}
              onMouseLeave={() => setHoverUpload(false)}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center gap-3 rounded-[20px] cursor-pointer transition-all"
              style={{
                padding: '24px',
                border: `2px dashed ${dragOver ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.25)'}`,
                background: dragOver || hoverUpload ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.04)',
              }}
            >
              {/* Icon with bounce on hover */}
              <motion.span
                className="text-[32px]"
                animate={hoverUpload ? { y: [0, -4, 0] } : { y: 0 }}
                transition={hoverUpload ? { duration: 0.6, repeat: Infinity, ease: 'easeInOut' } : {}}
              >
                📷
              </motion.span>
              <p className="text-sm font-body font-medium text-foreground">Upload a photo to transform</p>
              <p className="text-xs text-muted-foreground">Tap to select · or drag & drop</p>
            </div>
          ) : (
            <div className="rounded-[20px] overflow-hidden" style={{ border: '2px solid rgba(201,168,76,0.25)' }}>
              <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
              <div className="p-4 flex gap-3">
                <button onClick={() => { setPreview(null); setSelectedFile(null); }} className="flex-1 rounded-xl py-3 text-sm font-body text-muted-foreground" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  Remove
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleUploadAndTransform}
                  disabled={uploading}
                  className="relative flex-1 rounded-xl py-3 text-sm font-body font-semibold text-obsidian bg-gradient-to-r from-gold to-gold-light overflow-hidden disabled:opacity-50"
                >
                  <span className="relative z-10">{uploading ? 'Uploading...' : 'Transform This Photo →'}</span>
                  <div className="absolute inset-0 animate-shimmer" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)', backgroundSize: '200% 100%' }} />
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>

        {/* AI Prompt Bar */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '3px solid #C9A84C' }}
        >
          <span className="text-lg shrink-0">✨</span>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePromptSubmit()}
            placeholder="Try 'Make me look confident...'"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-body"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePromptSubmit}
            className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-r from-gold to-gold-light"
          >
            <ArrowUp className="h-4 w-4 text-obsidian" />
          </motion.button>
        </motion.div>

        {/* AI Loading / Result */}
        {aiLoading && (
          <div className="rounded-2xl h-16 overflow-hidden" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.05) 0%, rgba(201,168,76,0.15) 50%, rgba(201,168,76,0.05) 100%)', backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite', border: '1px solid rgba(201,168,76,0.1)' }} />
        )}
        {aiResult && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-4" style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)' }}>
            <p className="text-xs text-gold font-body font-semibold mb-1">✦ AI Result</p>
            <p className="text-sm text-foreground/80 font-body">Applied "confident" preset — enhanced jawline definition, brightened eyes, subtle warm color grade. Ready to export!</p>
          </motion.div>
        )}

        {/* Quick Tools */}
        <motion.div variants={fadeUp}>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Quick Tools</p>
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {quickTools.map((t) => (
              <motion.button
                key={t.label}
                whileHover={{ borderColor: 'rgba(201,168,76,0.4)', y: -2 }}
                className="flex flex-col items-center gap-1.5 rounded-2xl px-4 py-3 shrink-0 transition-all"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', minWidth: '72px' }}
              >
                <span className="text-lg">{t.emoji}</span>
                <span className="text-[10px] font-body text-muted-foreground whitespace-nowrap">{t.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Edits */}
        <motion.div variants={fadeUp}>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Recent Edits</p>
          <div className="flex flex-col gap-2">
            {recentEdits.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 rounded-2xl p-3 transition-all cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="h-12 w-12 rounded-xl shrink-0" style={{ background: item.gradient }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-semibold text-foreground truncate">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">{item.tool} · {item.time}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-3 px-4" style={{ background: 'rgba(7,7,15,0.95)', borderTop: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
        {tabs.map((tab) => {
          const active = tab.label === 'Home';
          return (
            <motion.button
              key={tab.label}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1"
            >
              <tab.icon className={`h-5 w-5 ${active ? 'text-gold' : 'text-muted-foreground'}`} />
              <span className={`text-[10px] font-body ${active ? 'text-gold font-semibold' : 'text-muted-foreground'}`}>{tab.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default HomeScreen;
