import { useRef, useState, useCallback } from 'react';

const BeforeAfterSlider = () => {
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

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none touch-none overflow-hidden"
      style={{ height: 260, borderRadius: 20 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Before (full width background) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #14121f, #1a1830)' }}
      >
        <span className="text-7xl opacity-60 grayscale">😐</span>
      </div>

      {/* After (clipped from right) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #1f1828, #241a30)',
          clipPath: `inset(0 0 0 ${position}%)`,
        }}
      >
        <span className="text-7xl" style={{ filter: 'drop-shadow(0 0 12px rgba(201,168,76,0.4))' }}>😊</span>
      </div>

      {/* Labels */}
      <span className="absolute bottom-3 left-4 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Before</span>
      <span className="absolute bottom-3 right-4 text-[10px] font-mono uppercase tracking-wider text-gold">After</span>

      {/* Drag handle */}
      <div
        className="absolute top-0 bottom-0 z-10 flex items-center"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="h-full w-[2px]" style={{ background: 'rgba(201,168,76,0.7)' }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center rounded-full"
          style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
            boxShadow: '0 0 16px rgba(201,168,76,0.5)',
            cursor: 'ew-resize',
          }}
        >
          <span className="text-obsidian text-sm font-bold">⇄</span>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
