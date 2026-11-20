import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Send, Github, Linkedin, Twitter, MessageSquare, CheckCircle2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [healthStatus, setHealthStatus] = useState('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await api.get('/api/health');
        if (res.data?.status === 'ok') {
          setHealthStatus('operational');
        } else {
          setHealthStatus('degraded');
        }
      } catch (_) {
        setHealthStatus('offline');
      }
    };
    checkHealth();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing to NexaTech Engineering Insights!');
    setEmail('');
  };

  return (
    <footer className="relative bg-[#05080F] border-t border-white/[0.07] text-slate-400 font-sans pt-16 pb-12 overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-cyan-500/5 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/[0.06]">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-indigo-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#070B14] rounded-[10px] flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
                  Nexa<span className="text-cyan-400">Tech</span>
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Architecting mission-critical cloud infrastructure, cognitive AI workflows, and high-concurrency digital platforms for forward-looking enterprises worldwide.
            </p>

            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 w-fit mt-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  healthStatus === 'operational'
                    ? 'bg-emerald-400 animate-pulse'
                    : healthStatus === 'checking'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-rose-500'
                }`}
              />
              <span className="font-mono">
                {healthStatus === 'operational' && 'API: Operational'}
                {healthStatus === 'checking' && 'API: Connecting...'}
                {healthStatus === 'degraded' && 'API: Degraded Service'}
                {healthStatus === 'offline' && 'API: Offline / Standalone'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-heading">
              Capabilities
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services" className="hover:text-cyan-400 transition-colors">
                  Cloud Architecture
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-cyan-400 transition-colors">
                  AI Systems & RAG
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-cyan-400 transition-colors">
                  Full-Stack Engineering
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-cyan-400 transition-colors">
                  DevSecOps & Security
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-cyan-400 transition-colors">
                  Mobile App Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-heading">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors">
                  About Our Team
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-cyan-400 transition-colors">
                  Featured Case Studies
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors">
                  Work With Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-cyan-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-heading">
              Engineering Dispatch
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Quarterly architectural deep-dives, systems benchmarks, and tech insights.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="architect@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors text-xs"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all flex items-center justify-center"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
                aria-label="Discord"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} NexaTech Enterprise IT Inc. All rights reserved.</p>
          <p className="text-center md:text-right max-w-xl text-[11px] text-slate-400 leading-normal">
            NexaTech and the included portfolio entries are starter content. Replace example contact details, sample content, and policies with your real company information before launch. This project does not claim real clients, certifications, or achievements.
          </p>
        </div>
      </div>
    </footer>
  );
};
