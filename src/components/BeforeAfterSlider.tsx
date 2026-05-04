import { useRef, useState, useCallback } from 'react';

interface Props {
  beforeUrl?: string;
  afterUrl?: string;
  height?: number;
}

const BeforeAfterSlider = ({ beforeUrl, afterUrl, height = 280 }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const onPointerUp = useCallback(() => { dragging.current = false; }, []);

  const hasRealImages = beforeUrl && afterUrl && beforeUrl !== afterUrl;

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none touch-none overflow-hidden"
      style={{ height, borderRadius: 20, cursor: 'ew-resize' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Before */}
      <div className="absolute inset-0 bg-cover bg-center" style={{
        background: hasRealImages ? undefined : 'linear-gradient(135deg, #14121f, #1a1830)',
        backgroundImage: hasRealImages && beforeUrl ? `url(${beforeUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        {!hasRealImages && <div className="w-full h-full flex items-center justify-center"><span className="text-6xl grayscale opacity-50">😐</span></div>}
        {/* Grayscale filter for before when real image */}
        {hasRealImages && (
          <div className="absolute inset-0" style={{
            backgroundImage: `url(${beforeUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(0.7) brightness(0.95)',
          }} />
        )}
      </div>

      {/* After */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          clipPath: `inset(0 0 0 ${position}%)`,
          background: hasRealImages ? undefined : 'linear-gradient(135deg, #1f1828, #241a30)',
        }}
      >
        {hasRealImages ? (
          <div className="absolute inset-0" style={{
            backgroundImage: `url(${afterUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl" style={{ filter: 'drop-shadow(0 0 16px rgba(200,164,90,0.5))' }}>😊</span>
          </div>
        )}
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-white opacity-50">Before</span>
      </div>
      <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--gold)' }}>After AURA</span>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 z-10 flex items-center pointer-events-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="h-full w-px" style={{ background: 'rgba(200,164,90,0.8)' }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center rounded-full"
          style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
            boxShadow: '0 0 20px rgba(200,164,90,0.5)',
            cursor: 'ew-resize',
            pointerEvents: 'all',
          }}
        >
          <span style={{ color: 'var(--ink)', fontSize: 16, fontWeight: 700 }}>⇄</span>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
