// Skeleton loader components used throughout the app

const Skeleton = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div
    className={`rounded-xl overflow-hidden ${className ?? ''}`}
    style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.06)',
      position: 'relative',
      ...style,
    }}
  >
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.8s linear infinite',
      }}
    />
  </div>
);

export const EditSkeleton = () => (
  <div className="flex items-center gap-3 p-3.5 rounded-2xl" style={{ background: 'var(--void)', border: '1px solid var(--glass-border)' }}>
    <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
    <div className="flex-1 flex flex-col gap-2">
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-2.5 w-1/2" />
    </div>
  </div>
);

export const GallerySkeleton = () => (
  <div className="grid grid-cols-2 gap-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="rounded-2xl aspect-square" />
    ))}
  </div>
);

export const CardSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: 'var(--void)', border: '1px solid var(--glass-border)' }}>
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-3" style={{ width: `${100 - i * 15}%` }} />
    ))}
  </div>
);

export default Skeleton;
