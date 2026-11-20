import React from 'react';
import { Terminal, Home, ArrowLeft } from 'lucide-react';
import { useTitle } from '../../hooks/useTitle';
import { Button } from '../../components/ui/Button';

export const NotFoundPage = () => {
  useTitle('404 — Node Not Found');

  return (
    <div className="pt-32 pb-24 max-w-xl mx-auto px-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6 shadow-glow-cyan">
        <Terminal className="w-10 h-10 text-cyan-400" />
      </div>

      <h1 className="text-6xl sm:text-7xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-400 mb-4">
        404
      </h1>

      <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3">
        Endpoint Route Not Mapped
      </h2>

      <p className="text-sm text-slate-400 max-w-md mx-auto mb-8 font-mono">
        The requested URI path is not registered in the NexaTech frontend gateway or backend routing tables.
      </p>

      <div className="flex items-center justify-center gap-4">
        <Button to="/" variant="primary" icon={Home} iconPosition="left">
          Return to Headquarters
        </Button>
      </div>
    </div>
  );
};
