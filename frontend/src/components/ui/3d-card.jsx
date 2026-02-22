import React, { useRef, useEffect } from 'react';

export const CardContainer = ({ children, className = '' }) => {
  return (
    <div
      className={`relative ${className}`}
      style={{ perspective: '1000px' }}
    >
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `rotateX(${(-y * 14).toFixed(2)}deg) rotateY(${(x * 18).toFixed(2)}deg)`;
    };
    const handleLeave = () => {
      el.style.transform = 'rotateX(0deg) rotateY(0deg)';
    };
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`relative transition-transform duration-150 ease-out transform-gpu [transform-style:preserve-3d] ${className}`}
    >
      {children}
    </div>
  );
};

export const CardItem = ({ children, className = '', translateZ = 0, rotateX = 0, rotateZ = 0, as = 'div', ...rest }) => {
  const Component = as;
  const transforms = [];

  if (translateZ !== undefined && translateZ !== null) {
    transforms.push(
      `translateZ(${typeof translateZ === 'number' ? `${translateZ}px` : translateZ})`
    );
  }

  if (rotateX) {
    transforms.push(
      `rotateX(${typeof rotateX === 'number' ? `${rotateX}deg` : rotateX})`
    );
  }

  if (rotateZ) {
    transforms.push(
      `rotateZ(${typeof rotateZ === 'number' ? `${rotateZ}deg` : rotateZ})`
    );
  }

  const style = {
    transform: transforms.join(' '),
    transformStyle: 'preserve-3d',
  };

  const InnerTag = as === 'p' ? 'span' : 'div';

  return (
    <Component className={className} {...rest}>
      {React.createElement(InnerTag, { style }, children)}
    </Component>
  );
};
