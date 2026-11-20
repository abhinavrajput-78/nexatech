import React from 'react';
import { FadeIn } from '../animations/MotionWrapper';

export const SectionHeading = ({
  badge,
  title,
  subtitle,
  centered = true,
  className = '',
}) => {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'} ${className}`}>
      {badge && (
        <FadeIn delay={0.05}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-cyan-950/60 text-cyan-400 border border-cyan-500/20 mb-4 backdrop-blur-sm shadow-sm shadow-cyan-950">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            {badge}
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.1}>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
          {title}
        </h2>
      </FadeIn>

      {subtitle && (
        <FadeIn delay={0.15}>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed font-sans">
            {subtitle}
          </p>
        </FadeIn>
      )}
    </div>
  );
};
