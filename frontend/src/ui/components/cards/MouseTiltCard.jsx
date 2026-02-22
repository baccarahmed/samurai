import React, { useRef, useState } from 'react';

const MouseTiltCard = ({ children, tiltIntensity = 12, scale = 1.03, glareIntensity = 0.08, className = '' }) => {
  const ref = useRef(null);
  const [transformStyle, setTransformStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const x = (px / rect.width) - 0.5;
    const y = (py / rect.height) - 0.5;
    const rx = (-y * tiltIntensity).toFixed(2);
    const ry = (x * tiltIntensity).toFixed(2);
    setTransformStyle({
      transform: `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`,
      transition: 'transform 80ms ease-out',
      willChange: 'transform',
    });
    const gX = Math.max(0, Math.min(rect.width, px));
    const gY = Math.max(0, Math.min(rect.height, py));
    setGlareStyle({
      pointerEvents: 'none',
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(600px circle at ${gX}px ${gY}px, rgba(255,255,255,${glareIntensity}) 0%, rgba(255,255,255,0) 60%)`,
      opacity: 1,
      borderRadius: 'inherit',
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 200ms ease',
      willChange: 'transform',
    });
    setGlareStyle({ opacity: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div style={{ position: 'relative', borderRadius: 'inherit', ...transformStyle }}>
        <div style={glareStyle} />
        {children}
      </div>
    </div>
  );
};

export default MouseTiltCard;

