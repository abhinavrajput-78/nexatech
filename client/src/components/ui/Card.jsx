import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={`relative rounded-2xl bg-[#0E1726]/80 backdrop-blur-xl border border-white/[0.08] p-6 sm:p-8 transition-all duration-300 ${
        hoverEffect
          ? 'hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-950/30'
          : ''
      } ${glow ? 'shadow-glow-cyan border-cyan-500/40' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
