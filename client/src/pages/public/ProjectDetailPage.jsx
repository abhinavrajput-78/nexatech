import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  Server,
  ArrowRight,
} from 'lucide-react';
import { useTitle } from '../../hooks/useTitle';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { FadeIn } from '../../components/animations/MotionWrapper';

export const ProjectDetailPage = () => {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useTitle(project ? project.title : 'Architectural Case Study');

  useEffect(() => {
    setLoading(true);
    api.get(`/api/projects/${slug}`)
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setProject(res.data.data);
        } else {
          setError('Case study not found');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load case study');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading case study details..." />;
  }

  if (error || !project) {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-heading font-bold text-white mb-3">Case Study Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'The requested project does not exist.'}</p>
        <Button to="/projects" variant="primary" icon={ArrowLeft} iconPosition="left">
          Back to Case Studies
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Case Studies</span>
        </Link>

        {/* Hero Banner */}
        <FadeIn delay={0.1}>
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900 mb-12 shadow-2xl">
            {project.image && (
              <div className="h-64 sm:h-96 w-full relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/70 to-transparent" />
              </div>
            )}

            <div className="p-8 sm:p-12 relative -mt-32 sm:-mt-40 z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="cyan">{project.category}</Badge>
                <span className="text-xs font-mono text-slate-400">
                  Client: <strong className="text-slate-200">{project.client}</strong>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-heading font-black text-white mb-4 leading-tight">
                {project.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl font-sans mb-8">
                {project.summary}
              </p>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-4">
                {project.demoUrl && (
                  <Button
                    href={project.demoUrl}
                    variant="primary"
                    size="md"
                    icon={ExternalLink}
                    iconPosition="right"
                  >
                    Launch Live System
                  </Button>
                )}
                {project.githubUrl && (
                  <Button
                    href={project.githubUrl}
                    variant="secondary"
                    size="md"
                    icon={Github}
                    iconPosition="left"
                  >
                    View Repository
                  </Button>
                )}
                <Button
                  to={`/contact?service=${encodeURIComponent(project.category)}`}
                  variant="outline"
                  size="md"
                >
                  Consult Similar Architecture
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Deep Dive Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          <div className="lg:col-span-2 space-y-10">
            {/* Challenge */}
            {project.challenge && (
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>The Architectural Challenge</span>
                </div>
                <h2 className="text-2xl font-heading font-bold text-white mb-3">
                  Operational Bottlenecks & Failure Modes
                </h2>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {project.challenge}
                </div>
              </div>
            )}

            {/* Solution */}
            {project.solution && (
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                  <Server className="w-4 h-4" />
                  <span>The Engineered Solution</span>
                </div>
                <h2 className="text-2xl font-heading font-bold text-white mb-3">
                  Implemented Infrastructure & Logic
                </h2>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {project.solution}
                </div>
              </div>
            )}

            {/* Measurable Results */}
            {project.results && project.results.length > 0 && (
              <div>
                <h3 className="text-xl font-heading font-bold text-white mb-4">
                  Quantifiable Production Outcomes
                </h3>
                <div className="space-y-3">
                  {project.results.map((res, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/25"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium text-slate-200">{res}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Tech Stack & Specs */}
          <div>
            <Card className="sticky top-28 bg-[#0C1527] border-cyan-500/20">
              <h3 className="text-base font-heading font-bold text-white mb-4 pb-2 border-b border-white/5">
                Technology Stack Utilized
              </h3>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.techStack?.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-cyan-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-400 mb-6 space-y-2">
                <p>
                  <strong className="text-white">Note:</strong> Illustrative starter case study. All metrics demonstrate architectural patterns engineered by NexaTech specialists.
                </p>
              </div>

              <Button to="/contact" variant="primary" size="md" className="w-full">
                Discuss Your Architecture
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
