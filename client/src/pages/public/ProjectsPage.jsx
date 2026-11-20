import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight, ExternalLink, AlertCircle, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { useTitle } from '../../hooks/useTitle';
import api from '../../services/api';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { FadeIn, HoverCard } from '../../components/animations/MotionWrapper';

export const ProjectsPage = () => {
  useTitle('Case Studies & Featured Systems Architecture');

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page'), 10) || 1;
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(searchParam);

  useEffect(() => {
    // Fetch categories once
    api.get('/api/projects/categories')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setCategories(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [pageParam, categoryParam, searchParam]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.set('page', pageParam);
      params.set('limit', '9');
      if (categoryParam && categoryParam !== 'All') params.set('category', categoryParam);
      if (searchParam) params.set('search', searchParam);

      const res = await api.get(`/api/projects?${params.toString()}`);
      if (res.data?.success) {
        setProjects(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve case studies.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (cat) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', '1');
    if (cat === 'All') {
      next.delete('category');
    } else {
      next.set('category', cat);
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    next.set('page', '1');
    if (searchInput.trim()) {
      next.set('search', searchInput.trim());
    } else {
      next.delete('search');
    }
    setSearchParams(next);
  };

  const handlePageChange = (newPage) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', newPage.toString());
    setSearchParams(next);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="pt-28 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Portfolio & Systems"
          title="Architectural Case Studies"
          subtitle="Explore how our team engineered mission-critical cloud migrations, sovereign AI workflows, and high-concurrency payment platforms."
        />

        {/* Filter Controls: Search & Category Tabs */}
        <div className="mb-10 space-y-6">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search projects, technologies, or keywords..."
                className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-white text-xs font-semibold transition-all"
              >
                Search
              </button>
            </div>
          </form>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  categoryParam === cat || (cat === 'All' && !searchParams.get('category'))
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && <LoadingSpinner message="Retrieving architectural portfolio..." />}

        {/* Error / DB Offline State */}
        {!loading && error && (
          <div className="max-w-xl mx-auto p-6 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-center my-8">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h3 className="text-lg font-heading font-bold text-white mb-2">
              Database Connection Unavailable
            </h3>
            <p className="text-xs text-rose-300 leading-relaxed mb-4">
              {error}. Ensure MongoDB is connected and seeded.
            </p>
            <Button onClick={fetchProjects} variant="secondary" size="sm">
              Retry Connection
            </Button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && projects.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((proj, idx) => (
                <FadeIn key={proj._id || idx} delay={idx * 0.05}>
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
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
                            <span>Client: {proj.client || 'Enterprise'}</span>
                          </div>

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
                              {proj.techStack.length > 4 && (
                                <span className="text-[11px] font-mono px-1.5 py-0.5 text-slate-400">
                                  +{proj.techStack.length - 4}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <Link
                          to={`/projects/${proj.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 pt-3 border-t border-white/5"
                        >
                          <span>Explore Case Study</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </Card>
                  </HoverCard>
                </FadeIn>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  icon={ChevronLeft}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/5 text-xs font-mono text-slate-300">
                  <span>Page {pagination.page} of {pagination.totalPages}</span>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  icon={ChevronRight}
                  iconPosition="right"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-300 font-semibold mb-1">No case studies found.</p>
            <p className="text-slate-500 text-xs mb-4">Try clearing your search query or selecting another category.</p>
            <Button
              onClick={() => {
                setSearchInput('');
                setSearchParams({});
              }}
              variant="secondary"
              size="sm"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
