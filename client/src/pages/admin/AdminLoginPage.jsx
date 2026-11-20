import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Terminal, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useTitle } from '../../hooks/useTitle';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const AdminLoginPage = () => {
  useTitle('Administrator Authentication');

  const { admin, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If already authenticated, redirect to dashboard
  if (admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      toast.error('Email and password are required.');
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password);
      toast.success('Authenticated as administrator');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const msg = err.message || 'Invalid administrator credentials';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-glow-cyan">
              <Terminal className="w-6 h-6 text-cyan-400" />
            </div>
          </Link>
          <h1 className="text-2xl font-heading font-extrabold text-white">
            NexaTech Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Restricted Administrator Management Boundary
          </p>
        </div>

        <Card className="p-8 bg-[#0C1527] border-white/10 shadow-2xl">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 mb-6">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@nexatech.internal"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to Admin Workspace
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center space-y-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase">Starter Admin Credentials</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@nexatech.internal');
                    setPassword('Admin@NexaTech2026!');
                    toast.success('Default credentials filled');
                  }}
                  className="text-[10px] font-semibold text-cyan-300 hover:text-white underline"
                >
                  Auto-fill
                </button>
              </div>
              <div className="text-[11px] font-mono text-slate-300">
                Email: <span className="text-white">admin@nexatech.internal</span><br />
                Password: <span className="text-white">Admin@NexaTech2026!</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              Accounts are managed server-side or via{' '}
              <code className="text-cyan-400 font-mono">npm run create-admin</code>.
            </p>
          </div>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
};
