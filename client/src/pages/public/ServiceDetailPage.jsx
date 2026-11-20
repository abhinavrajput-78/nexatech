import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Cloud,
  Cpu,
  Code,
  ShieldCheck,
  Terminal,
  Smartphone,
  Layers,
  Server,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useTitle } from '../../hooks/useTitle';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { FadeIn } from '../../components/animations/MotionWrapper';

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

export const ServiceDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  useTitle(service ? service.title : 'Service Blueprint');

  useEffect(() => {
    setLoading(true);
    api.get(`/api/services/${slug}`)
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setService(res.data.data);
        } else {
          setError('Service not found');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load service blueprint');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading architecture blueprint..." />;
  }

  if (error || !service) {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-heading font-bold text-white mb-3">Service Blueprint Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'The requested service does not exist.'}</p>
        <Button to="/services" variant="primary" icon={ArrowLeft} iconPosition="left">
          Back to Services
        </Button>
      </div>
    );
  }

  const IconComp = iconMap[service.icon] || Code;

  return (
    <div className="pt-28 pb-20 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Services</span>
        </Link>

        {/* Hero Banner */}
        <FadeIn delay={0.1}>
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-slate-900 via-[#0C1527] to-[#070B14] border border-cyan-500/20 shadow-2xl relative overflow-hidden mb-12">
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <IconComp className="w-8 h-8" />
                </div>
                <div>
                  <Badge variant="cyan" size="sm" className="mb-2">Enterprise Practice</Badge>
                  <h1 className="text-3xl sm:text-4xl font-heading font-black text-white">
                    {service.title}
                  </h1>
                </div>
              </div>

              <Button
                to={`/contact?service=${encodeURIComponent(service.title)}`}
                variant="primary"
                size="md"
                icon={ArrowRight}
                iconPosition="right"
              >
                Inquire About Service
              </Button>
            </div>

            <p className="mt-6 text-base text-slate-300 leading-relaxed font-sans max-w-3xl">
              {service.shortDescription}
            </p>
          </div>
        </FadeIn>

        {/* In-depth Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">
                Architectural Scope & Methodologies
              </h2>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {service.description}
              </div>
            </div>

            {/* Core Features */}
            {service.features && service.features.length > 0 && (
              <div>
                <h3 className="text-lg font-heading font-bold text-white mb-4">
                  Standard Technical Deliverables
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-900/60 border border-white/5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-200">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div>
                <h3 className="text-lg font-heading font-bold text-white mb-4">
                  Enterprise Business Benefits
                </h3>
                <div className="space-y-2.5">
                  {service.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center gap-3"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-xs font-medium text-slate-200">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA Card */}
          <div>
            <Card className="sticky top-28 bg-[#0C1527] border-cyan-500/30">
              <h3 className="text-lg font-heading font-bold text-white mb-2">
                Need a Custom Architectural Blueprint?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Our principal consultants can evaluate your current infrastructure, map migration paths, and provide a fixed SLA estimation.
              </p>

              <div className="space-y-3 mb-6 text-xs text-slate-300 font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Response SLA:</span>
                  <span className="text-cyan-400 font-bold">&lt; 24 Business Hours</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Delivery Model:</span>
                  <span>Agile / Fixed Sprint</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Security:</span>
                  <span>Zero-Trust Compliant</span>
                </div>
              </div>

              <Button
                to={`/contact?service=${encodeURIComponent(service.title)}`}
                variant="primary"
                size="md"
                className="w-full"
              >
                Schedule Scoping Session
              </Button>
            </Card>
          </div>
        </div>

        {/* FAQs Accordion */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="border-t border-white/10 pt-12 mb-16">
            <h2 className="text-2xl font-heading font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {service.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-900/60 border border-white/10 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-medium text-sm text-white hover:text-cyan-300 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        openFaq === idx ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/5">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
