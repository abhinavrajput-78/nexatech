import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Cloud,
  Code,
  Terminal,
  Smartphone,
  CheckCircle2,
  Star,
  Layers,
  Sparkles,
  Server,
  Zap,
} from 'lucide-react';
import { useTitle } from '../../hooks/useTitle';
import api from '../../services/api';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations/MotionWrapper';

// Icon map helper for dynamic icon strings from API
const iconMap = {
  Cloud: Cloud,
  Cpu: Cpu,
  Code: Code,
  ShieldCheck: ShieldCheck,
  Terminal: Terminal,
  Smartphone: Smartphone,
  Layers: Layers,
  Server: Server,
};

export const HomePage = () => {
  useTitle('Next-Gen Enterprise IT, Cloud & AI Systems');

  const [siteContent, setSiteContent] = useState(null);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // 1. Fetch site content
    api.get('/api/content')
      .then((res) => {
        if (res.data?.data) setSiteContent(res.data.data);
      })
      .catch(() => {});

    // 2. Fetch services
    api.get('/api/services')
      .then((res) => {
        if (res.data?.data) setServices(res.data.data.slice(0, 6));
      })
      .catch(() => {});

    // 3. Fetch featured projects
    api.get('/api/projects?limit=3')
      .then((res) => {
        if (res.data?.data) setProjects(res.data.data);
      })
      .catch(() => {});

    // 4. Fetch testimonials
    api.get('/api/testimonials')
      .then((res) => {
        if (res.data?.data) setTestimonials(res.data.data);
      })
      .catch(() => {});
  }, []);

  const stats = siteContent?.stats || [
    { label: 'Uptime Reliability', value: '99.99', suffix: '%' },
    { label: 'Cloud Architecture Deployed', value: '180', suffix: '+' },
    { label: 'Enterprise Security Audits', value: '250', suffix: '+' },
    { label: 'Average Performance Gain', value: '3.4', suffix: 'x' },
  ];

  const techStack = [
    'Amazon Web Services',
    'Google Cloud',
    'Kubernetes',
    'Terraform',
    'Docker',
    'PyTorch',
    'Python',
    'Golang',
    'React 19',
    'Node.js',
    'PostgreSQL',
    'Redis',
  ];

  return (
    <div className="relative overflow-hidden pt-24 pb-16">
      {/* Background Cyber Mesh Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-cyan-500/10 via-indigo-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-80 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-20 text-center">
        {/* Floating Badge */}
        <FadeIn delay={0.1}>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 shadow-lg shadow-cyan-950/50 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{siteContent?.heroBadge || 'Next-Gen Enterprise IT & Software Engineering'}</span>
          </div>
        </FadeIn>

        {/* Hero Title */}
        <FadeIn delay={0.2}>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
            Architecting <span className="text-gradient-cyan">Scalable Digital Systems</span> for Modern Enterprises
          </h1>
        </FadeIn>

        {/* Hero Subtitle */}
        <FadeIn delay={0.3}>
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10 font-sans font-normal">
            {siteContent?.heroSubtitle ||
              'NexaTech empowers global tech leaders with resilient cloud infrastructure, intelligent AI workflows, and high-performance custom software engineering.'}
          </p>
        </FadeIn>

        {/* CTA Buttons */}
        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/services" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
              Explore Capabilities
            </Button>
            <Button to="/contact" variant="secondary" size="lg">
              Schedule Architecture Consultation
            </Button>
          </div>
        </FadeIn>

        {/* Stats Grid */}
        <div className="mt-16 sm:mt-24 pt-10 border-t border-white/[0.08]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, idx) => (
              <FadeIn key={idx} delay={0.2 + idx * 0.1}>
                <div className="p-4 rounded-xl bg-slate-900/30 border border-white/5">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
                    <span className="text-gradient-cyan">{stat.value}</span>
                    <span className="text-cyan-400 text-2xl sm:text-3xl">{stat.suffix}</span>
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CORE CAPABILITIES ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeading
          badge="Enterprise Services"
          title="Engineered for Extreme Reliability & Scale"
          subtitle="Explore our specialized engineering disciplines designed to accelerate your technological roadmap without compromising security."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.length > 0 ? (
            services.map((service, idx) => {
              const IconComp = iconMap[service.icon] || Code;
              return (
                <FadeIn key={service._id || idx} delay={idx * 0.1}>
                  <HoverCard className="h-full">
                    <Card className="h-full flex flex-col justify-between group">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40 transition-all">
                          <IconComp className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6 font-sans">
                          {service.shortDescription}
                        </p>

                        {service.features && service.features.length > 0 && (
                          <ul className="space-y-2 mb-6">
                            {service.features.slice(0, 3).map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                <span className="truncate">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <Link
                          to={`/services/${service.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <span>Explore Architecture</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </Card>
                  </HoverCard>
                </FadeIn>
              );
            })
          ) : (
            // Fallback while loading
            [1, 2, 3].map((n) => (
              <Card key={n} className="h-64 animate-pulse flex flex-col justify-center items-center">
                <div className="w-10 h-10 bg-slate-800 rounded-lg mb-4" />
                <div className="h-4 w-32 bg-slate-800 rounded mb-2" />
                <div className="h-3 w-48 bg-slate-800 rounded" />
              </Card>
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Button to="/services" variant="outline" size="md" icon={ArrowRight} iconPosition="right">
            View All Services & Specializations
          </Button>
        </div>
      </section>

      {/* ================= ARCHITECTURE PILLARS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/[0.06]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-purple-950/60 text-purple-300 border border-purple-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineering Philosophy</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight mb-6">
              Built on Zero-Downtime, Cryptographic Rigor & High Concurrency
            </h2>
            <p className="text-base text-slate-300 leading-relaxed mb-6 font-sans">
              Modern digital enterprises cannot afford fragile deployments, latency spikes, or unverified claims. We engineer software as a predictable, deterministic utility.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: 'Zero-Downtime Multi-Region Resilience',
                  desc: 'Canary deployments, automated health failovers, and active-active database replication.',
                },
                {
                  title: 'Private & Sovereign AI Integrations',
                  desc: 'RAG pipelines and LLMs hosted entirely within your private VPC boundary.',
                },
                {
                  title: 'DevSecOps & Automated Verification',
                  desc: 'Continuous vulnerability scanning, static code security audits, and strict IAM policies.',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-900/40 border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-heading font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl bg-gradient-to-tr from-slate-900 to-[#0A1120] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-xs text-slate-400">nexatech-cluster-status</span>
                </div>
                <Badge variant="emerald" size="sm" dot>Live Telemetry</Badge>
              </div>

              <div className="font-mono text-xs sm:text-sm space-y-3 text-slate-300">
                <div className="text-cyan-400">$ kubectl get deployments -n production</div>
                <div className="text-slate-400">
                  NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY&nbsp;&nbsp;&nbsp;UP-TO-DATE&nbsp;&nbsp;&nbsp;AVAILABLE&nbsp;&nbsp;&nbsp;AGE<br/>
                  api-gateway&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12/12&nbsp;&nbsp;&nbsp;12&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;48d<br/>
                  ai-inference-rag&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8/8&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24d<br/>
                  payment-engine-core&nbsp;&nbsp;16/16&nbsp;&nbsp;&nbsp;16&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;92d
                </div>
                <div className="text-cyan-400">$ sysbench --concurrency=12000 --status</div>
                <div className="text-emerald-400">
                  ✔ P99 Latency: 1.84ms | Total Transactions: 8,421,900 | Error Rate: 0.000%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED PROJECTS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/[0.06]">
        <SectionHeading
          badge="Case Studies"
          title="Featured Engineering Systems"
          subtitle="A selection of high-concurrency architectures and machine learning systems engineered for enterprise scale."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj, idx) => (
            <FadeIn key={proj._id || idx} delay={idx * 0.1}>
              <HoverCard className="h-full">
                <Card className="h-full flex flex-col justify-between overflow-hidden group p-0">
                  {proj.image && (
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1726] via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge variant="cyan">{proj.category}</Badge>
                      </div>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                        {proj.summary}
                      </p>

                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {proj.techStack.slice(0, 4).map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/projects/${proj.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 pt-3 border-t border-white/5"
                    >
                      <span>Read Architectural Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </Card>
              </HoverCard>
            </FadeIn>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button to="/projects" variant="outline" size="md" icon={ArrowRight} iconPosition="right">
            Explore All Case Studies
          </Button>
        </div>
      </section>

      {/* ================= TECH STACK LOGOS / BADGES ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.06]">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Enterprise Platforms & Frameworks We Master
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
          {techStack.map((tech, idx) => (
            <span
              key={idx}
              className="px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono font-medium text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS (ONLY IF PUBLISHED) ================= */}
      {Array.isArray(testimonials) && testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/[0.06]">
          <SectionHeading
            badge="Client Endorsements"
            title="Trusted by Technology Leaders"
            subtitle="Genuine feedback from CTOs and engineering directors who rely on our software and cloud solutions."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => {
              const clientName = t.clientName || t.name || 'Verified Client';
              const role = t.role || 'Executive';
              const company = t.company || 'Enterprise Partner';
              const initial = clientName.trim() ? clientName.trim().charAt(0).toUpperCase() : 'C';

              return (
                <FadeIn key={t._id || idx} delay={idx * 0.1}>
                  <Card className="h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 mb-4">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                        "{t.content || ''}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                      {t.avatar ? (
                        <img
                          src={t.avatar}
                          alt={clientName}
                          className="w-10 h-10 rounded-full object-cover border border-cyan-500/30"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                          {initial}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-heading font-bold text-white">{clientName}</h4>
                        <p className="text-xs text-slate-400">
                          {role}, <span className="text-cyan-400">{company}</span>
                        </p>
                      </div>
                    </div>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= BOTTOM CTA BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-sky-900/40 via-cyan-900/30 to-indigo-900/40 border border-cyan-500/30 p-8 sm:p-14 text-center overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white mb-4">
              Ready to Architect Your Next Breakthrough?
            </h2>
            <p className="text-base text-slate-300 leading-relaxed mb-8">
              Discuss your technical requirements with our principal engineers. We provide transparent architecture proposals, scope estimations, and SLA guarantees.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button to="/contact" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Initiate Project Consultation
              </Button>
              <Button to="/about" variant="secondary" size="lg">
                Discover Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
