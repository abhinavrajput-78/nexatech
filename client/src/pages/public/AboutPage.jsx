import React from 'react';
import { ShieldCheck, Cpu, Terminal, Users, CheckCircle2, Award, Zap, ArrowRight } from 'lucide-react';
import { useTitle } from '../../hooks/useTitle';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FadeIn, SlideUp } from '../../components/animations/MotionWrapper';

export const AboutPage = () => {
  useTitle('About Our Engineering Organization');

  const principles = [
    {
      icon: Terminal,
      title: 'Deterministic Engineering',
      desc: 'We replace guesswork with automated testing, infrastructure as code, and mathematical verification of high-throughput distributed systems.',
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Trust Security by Design',
      desc: 'Perimeters are porous; cryptographic verification and least-privilege IAM roles are enforced at every communication boundary.',
    },
    {
      icon: Cpu,
      title: 'Private & Sovereign AI Systems',
      desc: 'Enterprise machine learning should enrich proprietary workflows without transmitting sensitive corporate IP to third-party public models.',
    },
    {
      icon: Zap,
      title: 'Relentless Performance Optimization',
      desc: 'From kernel-level socket tuning to micro-frontend caching, sub-millisecond response latencies remain our standard benchmark.',
    },
  ];

  const milestones = [
    {
      year: 'Phase 1',
      title: 'Foundations & Cloud Sovereignty',
      desc: 'Established dedicated multi-cloud deployment automation frameworks, eliminating vendor lock-in for enterprise clients.',
    },
    {
      year: 'Phase 2',
      title: 'High-Concurrency Distributed Engines',
      desc: 'Engineered fault-tolerant event streams handling over 10 billion telemetry data points per month across global clusters.',
    },
    {
      year: 'Phase 3',
      title: 'Enterprise RAG & Private Intelligence',
      desc: 'Pioneered zero-data-leak vector search workflows and fine-tuned LLM inference on private GPU topologies.',
    },
    {
      year: 'Phase 4',
      title: 'Autonomous Systems & Continuous Delivery',
      desc: 'Standardized automated canary analysis and AI-assisted anomaly detection across mission-critical client infrastructure.',
    },
  ];

  const team = [
    {
      name: 'Alexander Croft',
      role: 'Principal Systems Architect',
      specialty: 'Distributed Systems & Multi-Region Kubernetes',
      bio: 'Ex-infrastructure lead with 14+ years architecting high-frequency financial platforms and fault-tolerant cloud backbones.',
    },
    {
      name: 'Dr. Aris Thorne',
      role: 'Head of Artificial Intelligence',
      specialty: 'LLM Fine-Tuning & Vector Search Engines',
      bio: 'PhD in Cognitive Computation; specialist in deploying sovereign RAG architectures and low-latency inference runtimes.',
    },
    {
      name: 'Devin Zhao',
      role: 'VP of DevSecOps & Security',
      specialty: 'Zero-Trust Perimeter & SOC2/HIPAA Auditing',
      bio: 'Certified ethical hacker and kernel security researcher focused on automated container security and cryptographic mTLS.',
    },
    {
      name: 'Maya Lin',
      role: 'Director of Web Engineering',
      specialty: 'High-Throughput Micro-Frontends & React',
      bio: 'Pioneer of high-performance modern web platforms handling millions of daily active enterprise users.',
    },
  ];

  return (
    <div className="pt-28 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <FadeIn delay={0.1}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-cyan-950/70 text-cyan-300 border border-cyan-500/20 mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>Who We Are</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white max-w-4xl mx-auto leading-tight mb-6">
            Engineering the Digital Backbone for Tomorrow’s Global Enterprises
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Founded by veteran systems architects, NexaTech was established to bridge the divide between theoretical software engineering and the relentless operational demands of 99.99% uptime production environments.
          </p>
        </FadeIn>
      </section>

      {/* Core Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.06]">
        <SectionHeading
          badge="Guiding Tenets"
          title="Architectural Precision Above All"
          subtitle="Our engineering standards are built on rigorous principles tested across billions of production requests."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {principles.map((p, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <Card className="h-full">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                  <p.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">{p.desc}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Engineering Roadmap / Milestones */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.06]">
        <SectionHeading
          badge="Evolution"
          title="Milestones in Technical Excellence"
          subtitle="A continuum of continuous innovation in cloud architecture, AI workflows, and software scale."
        />

        <div className="relative border-l-2 border-cyan-500/30 ml-4 sm:ml-32 space-y-12">
          {milestones.map((m, idx) => (
            <FadeIn key={idx} delay={idx * 0.15}>
              <div className="relative pl-8 sm:pl-10">
                {/* Node icon */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-cyan-400 shadow-glow-cyan border-2 border-[#070B14]" />

                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                  {m.year}
                </span>
                <h4 className="text-xl font-heading font-bold text-white mb-2">{m.title}</h4>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">{m.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Leadership & Principal Architects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.06]">
        <SectionHeading
          badge="Leadership"
          title="Principal Systems Architects"
          subtitle="Direct technical oversight on every architectural blueprint, security audit, and deployment pipeline."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <Card className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-sky-500/20 border border-cyan-500/30 flex items-center justify-center font-heading font-bold text-cyan-300 text-xl mb-4">
                    {(member.name || 'A').charAt(0)}
                  </div>
                  <h4 className="text-lg font-heading font-bold text-white">{member.name}</h4>
                  <p className="text-xs font-mono text-cyan-400 mb-2">{member.role}</p>
                  <p className="text-xs text-slate-400 italic mb-4">Focus: {member.specialty}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{member.bio}</p>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 text-center">
        <Card className="p-8 sm:p-12 text-center bg-gradient-to-b from-slate-900 to-[#0A101E]">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
            Partner With Senior Engineers Who Know Production
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mb-6">
            We operate as an extension of your core leadership, upholding your reputation with robust code and rock-solid infrastructure.
          </p>
          <Button to="/contact" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
            Initiate Architecture Discussion
          </Button>
        </Card>
      </section>
    </div>
  );
};
