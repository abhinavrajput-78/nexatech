import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Briefcase,
  Quote,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useTitle } from '../../hooks/useTitle';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminDashboardPage = () => {
  useTitle('Admin Overview & Analytics');

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/admin/dashboard');
      if (res.data?.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Aggregating operational analytics..." />;
  }

  if (error || !dashboardData) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h3 className="text-xl font-heading font-bold text-white mb-2">Metrics Unavailable</h3>
        <p className="text-xs text-rose-300 mb-6">{error || 'Could not query dashboard statistics'}</p>
        <Button onClick={fetchDashboard} variant="secondary" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  const { stats, analytics = [], recentContacts = [] } = dashboardData;

  const maxMonthlyCount = Math.max(...analytics.map((a) => a.count), 1);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Architecture Console Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Real-time enquiry statistics, publication states, and monthly conversion analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button to="/admin/contacts" variant="primary" size="sm" icon={Mail} iconPosition="left">
            Review Enquiries ({stats.contacts?.pending || 0} Pending)
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-[#0C1527] border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Services</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-white mb-1">
            {stats.services?.total || 0}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            <span className="text-emerald-400 font-bold">{stats.services?.active || 0}</span> active on portal
          </div>
        </Card>

        <Card className="bg-[#0C1527] border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Projects</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-white mb-1">
            {stats.projects?.total || 0}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            <span className="text-emerald-400 font-bold">{stats.projects?.published || 0}</span> published case studies
          </div>
        </Card>

        <Card className="bg-[#0C1527] border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Testimonials</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Quote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-white mb-1">
            {stats.testimonials?.total || 0}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Verified client endorsements
          </div>
        </Card>

        <Card className="bg-[#0C1527] border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-white mb-1">
            {stats.contacts?.total || 0}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <Badge variant="amber" size="sm">{stats.contacts?.pending || 0} pending</Badge>
            <Badge variant="emerald" size="sm">{stats.contacts?.resolved || 0} resolved</Badge>
          </div>
        </Card>
      </div>

      {/* 6-Month Analytics & Enquiry Distribution */}
      <Card className="p-6 sm:p-8 bg-[#0C1527] border-white/10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-white">
                Six-Month Inquiry Volume Analytics
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Monthly inbound technical consultation submissions
              </p>
            </div>
          </div>
          <Badge variant="cyan" size="sm">Monthly Trend</Badge>
        </div>

        {analytics.length > 0 ? (
          <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-48 pt-6">
            {analytics.map((item, idx) => {
              const heightPercent = Math.max(12, Math.round((item.count / maxMonthlyCount) * 100));
              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-mono font-bold text-cyan-400 group-hover:scale-110 transition-transform">
                    {item.count}
                  </span>
                  <div className="w-full max-w-[48px] bg-slate-800/80 rounded-t-lg relative overflow-hidden flex items-end h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-sky-600 to-cyan-400 rounded-t-lg shadow-glow-cyan transition-all duration-500 group-hover:brightness-125"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 text-center">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-xs text-slate-500 font-mono">
            No analytics data accumulated yet.
          </div>
        )}
      </Card>

      {/* Recent Enquiries Table */}
      <Card className="p-6 bg-[#0C1527] border-white/10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-white">
                Recent Project Inquiries
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Latest client submissions requiring technical qualification
              </p>
            </div>
          </div>
          <Link
            to="/admin/contacts"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentContacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 font-mono uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Email Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {recentContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">
                      <div>{contact.name}</div>
                      <div className="text-[11px] text-slate-500">{contact.email}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">{contact.subject}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-cyan-400">
                      {contact.selectedService || 'General'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          contact.status === 'resolved'
                            ? 'emerald'
                            : contact.status === 'contacted'
                            ? 'cyan'
                            : 'amber'
                        }
                        size="sm"
                      >
                        {contact.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] text-slate-400">
                        {contact.emailStatus || 'not_configured'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500 font-mono">
            No inquiries recorded in database yet.
          </div>
        )}
      </Card>
    </div>
  );
};
