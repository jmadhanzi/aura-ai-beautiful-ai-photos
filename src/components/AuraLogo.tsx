import { motion } from 'framer-motion';

const AuraLogo = ({ size = 'default' }: { size?: 'default' | 'small' }) => {
  const scale = size === 'small' ? 0.6 : 1;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 110 * scale, height: 110 * scale }}>
      {/* Ring 1 */}
      <div
        className="absolute rounded-full animate-[spin_8s_linear_infinite]"
        style={{
          width: 110 * scale,
          height: 110 * scale,
          border: `${1.5 * scale}px solid rgba(201,168,76,0.6)`,
        }}
      />
      {/* Ring 2 */}
      <div
        className="absolute rounded-full animate-[spin_6s_linear_infinite_reverse]"
        style={{
          width: 84 * scale,
          height: 84 * scale,
          border: `${1 * scale}px solid rgba(201,168,76,0.3)`,
        }}
      />
      {/* Ring 3 */}
      <div
        className="absolute rounded-full animate-[spin_4s_linear_infinite]"
        style={{
          width: 60 * scale,
          height: 60 * scale,
          border: `${1 * scale}px solid rgba(0,229,195,0.25)`,
        }}
      />
      {/* Center */}
      <div
        className="relative z-10 flex items-center justify-center rounded-full"
        style={{
          width: 46 * scale,
          height: 46 * scale,
          background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
          boxShadow: '0 0 30px rgba(201,168,76,0.5)',
        }}
      >
        <span
          className="font-display"
          style={{
            fontSize: 22 * scale,
            fontWeight: 900,
            color: '#07070F',
            lineHeight: 1,
          }}
        >
          A
        </span>
      </div>
    </div>
  );
};

export default AuraLogo;
