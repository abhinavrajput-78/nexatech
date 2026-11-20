import React, { useState, useEffect } from 'react';
import { FileEdit, Save, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTitle } from '../../hooks/useTitle';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminContentPage = () => {
  useTitle('Admin — Homepage & Site Copy Configuration');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [content, setContent] = useState({
    heroBadge: '',
    heroTitle: '',
    heroSubtitle: '',
    heroCtaText: '',
    stats: [
      { label: 'Uptime Reliability', value: '99.99', suffix: '%' },
      { label: 'Cloud Architecture Deployed', value: '180', suffix: '+' },
      { label: 'Enterprise Security Audits', value: '250', suffix: '+' },
      { label: 'Average Performance Gain', value: '3.4', suffix: 'x' },
    ],
    aboutHeading: '',
    aboutDescription: '',
    contactEmail: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      discord: '',
    },
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/content');
      if (res.data?.success && res.data?.data) {
        setContent(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatChange = (index, field, val) => {
    const updated = [...(content.stats || [])];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, stats: updated });
  };

  const handleSocialChange = (field, val) => {
    setContent({
      ...content,
      socialLinks: { ...content.socialLinks, [field]: val },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/admin/content', content);
      toast.success('Homepage and company copy saved successfully');
    } catch (err) {
      toast.error('Failed to save content: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading editable site copy..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Homepage & Brand Content
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Directly update copy, headline narratives, and company contact details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero Section Copy */}
        <Card className="p-6 sm:p-8 bg-[#0C1527] border-white/10 space-y-4">
          <h3 className="text-base font-heading font-bold text-white pb-3 border-b border-white/5">
            Hero Section Copy
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Floating Hero Badge
            </label>
            <input
              type="text"
              value={content.heroBadge || ''}
              onChange={(e) => setContent({ ...content, heroBadge: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Hero Headline
            </label>
            <input
              type="text"
              value={content.heroTitle || ''}
              onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Hero Subtitle / Narrative
            </label>
            <textarea
              rows={3}
              value={content.heroSubtitle || ''}
              onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Primary CTA Button Text
            </label>
            <input
              type="text"
              value={content.heroCtaText || ''}
              onChange={(e) => setContent({ ...content, heroCtaText: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </Card>

        {/* Live Metrics & Stats */}
        <Card className="p-6 sm:p-8 bg-[#0C1527] border-white/10 space-y-4">
          <h3 className="text-base font-heading font-bold text-white pb-3 border-b border-white/5">
            Key Metrics & Stats Counter
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.stats?.map((st, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                <span className="text-[11px] font-mono font-bold text-cyan-400">Stat #{idx + 1}</span>
                <input
                  type="text"
                  placeholder="Metric Label"
                  value={st.label || ''}
                  onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Value (e.g. 99.99)"
                    value={st.value || ''}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Suffix (%)"
                    value={st.suffix || ''}
                    onChange={(e) => handleStatChange(idx, 'suffix', e.target.value)}
                    className="w-20 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* About Section Copy */}
        <Card className="p-6 sm:p-8 bg-[#0C1527] border-white/10 space-y-4">
          <h3 className="text-base font-heading font-bold text-white pb-3 border-b border-white/5">
            About Section Copy
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              About Heading
            </label>
            <input
              type="text"
              value={content.aboutHeading || ''}
              onChange={(e) => setContent({ ...content, aboutHeading: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              About Narrative
            </label>
            <textarea
              rows={4}
              value={content.aboutDescription || ''}
              onChange={(e) => setContent({ ...content, aboutDescription: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>
        </Card>

        {/* Company Contact & Social Links */}
        <Card className="p-6 sm:p-8 bg-[#0C1527] border-white/10 space-y-4">
          <h3 className="text-base font-heading font-bold text-white pb-3 border-b border-white/5">
            Company Contact Email & Social Channels
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Primary Corporate Contact Email
            </label>
            <input
              type="email"
              value={content.contactEmail || ''}
              onChange={(e) => setContent({ ...content, contactEmail: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={content.socialLinks?.github || ''}
                onChange={(e) => handleSocialChange('github', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={content.socialLinks?.linkedin || ''}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" loading={saving} icon={Save} iconPosition="left">
            Save Site Content Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};
