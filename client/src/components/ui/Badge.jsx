import React from 'react';

export const Badge = ({
  children,
  variant = 'cyan',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-950/60 text-cyan-400 border-cyan-500/20',
    violet: 'bg-purple-950/60 text-purple-300 border-purple-500/20',
    emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/20',
    amber: 'bg-amber-950/60 text-amber-300 border-amber-500/20',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    rose: 'bg-rose-950/60 text-rose-300 border-rose-500/20',
  };

  const dotColor = {
    cyan: 'bg-cyan-400',
    violet: 'bg-purple-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    slate: 'bg-slate-400',
    rose: 'bg-rose-400',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border backdrop-blur-sm ${
        variantStyles[variant] || variantStyles.cyan
      } ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            dotColor[variant] || dotColor.cyan
          }`}
        />
      )}
      {children}
    </span>
  );
};
