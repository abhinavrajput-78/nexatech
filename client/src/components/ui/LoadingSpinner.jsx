import React from 'react';

export const LoadingSpinner = ({ size = 'md', message = 'Loading...', fullScreen = false }) => {
  const sizeMap = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-16 h-16 border-3',
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <div className="relative">
        <div
          className={`${sizeMap[size]} rounded-full border-cyan-500/20 border-t-cyan-400 animate-spin`}
        />
        <div className="absolute inset-0 rounded-full blur-sm bg-cyan-400/20 animate-pulse" />
      </div>
      {message && <p className="text-sm font-medium text-slate-400 tracking-wide">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070B14]/80 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};
