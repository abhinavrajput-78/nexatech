import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Cloud,
  Cpu,
  Code,
  ShieldCheck,
  Terminal,
  Smartphone,
  Layers,
  Server,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Search,
} from 'lucide-react';
import { useTitle } from '../../hooks/useTitle';
import api from '../../services/api';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { FadeIn, HoverCard } from '../../components/animations/MotionWrapper';

const iconMap = {
  Cloud,
  Cpu,
  Code,
  ShieldCheck,
  Terminal,
  Smartphone,
  Layers,
  Server,
};

export const ServicesPage = () => {
  useTitle('Enterprise Engineering Services & Capabilities');

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/services');
      if (res.data?.success && res.data?.data) {
        setServices(res.data.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to service database.');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q) ||
      (s.features && s.features.some((f) => f.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="pt-28 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Disciplines"
          title="Enterprise Engineering Services"
          subtitle="Precision cloud architectures, high-performance web engineering, private AI implementations, and automated security pipelines."
        />

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services, skills, or architectures..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner message="Querying enterprise services catalog..." />}

        {/* Error / DB Disconnected State */}
        {!loading && error && (
          <div className="max-w-xl mx-auto p-6 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-center my-8">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h3 className="text-lg font-heading font-bold text-white mb-2">
              Database Connection Unavailable
            </h3>
            <p className="text-xs text-rose-300 leading-relaxed mb-4">
              {error}. If this is a local development instance, ensure MongoDB is active or seeded using <code className="bg-rose-900/50 px-1 py-0.5 rounded font-mono">npm run seed</code>.
            </p>
            <Button onClick={fetchServices} variant="secondary" size="sm">
              Retry Connection
            </Button>
          </div>
        )}

        {/* Services List */}
        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => {
              const IconComp = iconMap[service.icon] || Code;
              return (
                <FadeIn key={service._id || idx} delay={idx * 0.05}>
                  <HoverCard className="h-full">
                    <Card className="h-full flex flex-col justify-between group">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40 transition-all">
                          <IconComp className="w-6 h-6 text-cyan-400" />
                        </div>

                        <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                          {service.title}
                        </h3>

                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                          {service.shortDescription}
                        </p>

                        {service.features && service.features.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                              Key Deliverables:
                            </h4>
                            <ul className="space-y-1.5">
                              {service.features.map((feat, fIdx) => (
                                <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                        <Link
                          to={`/services/${service.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                        >
                          <span>Full Overview</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Button
                          to={`/contact?service=${encodeURIComponent(service.title)}`}
                          variant="secondary"
                          size="sm"
                        >
                          Book Service
                        </Button>
                      </div>
                    </Card>
                  </HoverCard>
                </FadeIn>
              );
            })}
          </div>
        )}

        {/* Empty Search Result */}
        {!loading && !error && filteredServices.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm">No services matched your query "{search}".</p>
            <button
              onClick={() => setSearch('')}
              className="mt-3 text-cyan-400 text-xs font-semibold underline hover:text-cyan-300"
            >
              Clear search filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
