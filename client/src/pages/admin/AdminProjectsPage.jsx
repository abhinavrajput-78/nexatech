import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit2, Trash2, Check, X, ExternalLink, Github } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTitle } from '../../hooks/useTitle';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminProjectsPage = () => {
  useTitle('Admin — Case Studies Management');

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Cloud Architecture',
    client: '',
    summary: '',
    challenge: '',
    solution: '',
    resultsText: '',
    techStackText: '',
    image: '',
    demoUrl: '',
    githubUrl: '',
    featured: false,
    isPublished: true,
    order: 0,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/projects');
      if (res.data?.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load projects: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Cloud Architecture',
      client: 'Confidential Enterprise',
      summary: '',
      challenge: '',
      solution: '',
      resultsText: '',
      techStackText: '',
      image: '',
      demoUrl: '',
      githubUrl: '',
      featured: false,
      isPublished: true,
      order: projects.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title || '',
      slug: proj.slug || '',
      category: proj.category || 'Cloud Architecture',
      client: proj.client || '',
      summary: proj.summary || '',
      challenge: proj.challenge || '',
      solution: proj.solution || '',
      resultsText: Array.isArray(proj.results) ? proj.results.join('\n') : '',
      techStackText: Array.isArray(proj.techStack) ? proj.techStack.join(', ') : '',
      image: proj.image || '',
      demoUrl: proj.demoUrl || '',
      githubUrl: proj.githubUrl || '',
      featured: Boolean(proj.featured),
      isPublished: proj.isPublished !== undefined ? proj.isPublished : true,
      order: proj.order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Project title is required');
      return;
    }
    if (!formData.summary.trim()) {
      toast.error('Project summary is required');
      return;
    }

    // URL validation
    const validateUrl = (url) => {
      if (!url.trim()) return true;
      try {
        const u = new URL(url.trim());
        return u.protocol === 'http:' || u.protocol === 'https:';
      } catch (_) {
        return false;
      }
    };

    if (formData.demoUrl && !validateUrl(formData.demoUrl)) {
      toast.error('Live Demo URL must begin with http:// or https://');
      return;
    }
    if (formData.githubUrl && !validateUrl(formData.githubUrl)) {
      toast.error('GitHub URL must begin with http:// or https://');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      category: formData.category.trim(),
      client: formData.client.trim() || 'Confidential Client',
      summary: formData.summary.trim(),
      challenge: formData.challenge.trim(),
      solution: formData.solution.trim(),
      results: formData.resultsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      techStack: formData.techStackText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      image: formData.image.trim(),
      demoUrl: formData.demoUrl.trim(),
      githubUrl: formData.githubUrl.trim(),
      featured: formData.featured,
      isPublished: formData.isPublished,
      order: Number(formData.order) || 0,
    };

    setSaving(true);
    try {
      if (editingProject) {
        await api.put(`/api/admin/projects/${editingProject._id}`, payload);
        toast.success('Case study updated');
      } else {
        await api.post('/api/admin/projects', payload);
        toast.success('Case study created');
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete case study "${title}"?`)) return;
    try {
      await api.delete(`/api/admin/projects/${id}`);
      toast.success('Project deleted');
      fetchProjects();
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  const handleTogglePublished = async (proj) => {
    try {
      await api.put(`/api/admin/projects/${proj._id}`, { isPublished: !proj.isPublished });
      toast.success(`Project ${!proj.isPublished ? 'published' : 'unpublished'}`);
      fetchProjects();
    } catch (err) {
      toast.error('Update failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Case Studies & Portfolio
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Manage showcase projects, architectural solutions, and metrics.
          </p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" size="sm" icon={Plus}>
          Add New Case Study
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner message="Querying case studies..." />
      ) : (
        <Card className="p-0 overflow-hidden bg-[#0C1527] border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Title & Slug</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4">Published</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {projects.map((proj) => (
                  <tr key={proj._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white text-sm">{proj.title}</div>
                      <div className="text-[11px] font-mono text-slate-400">{proj.slug}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="cyan" size="sm">{proj.category}</Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{proj.client}</td>
                    <td className="py-3 px-4">
                      {proj.featured ? (
                        <span className="text-amber-400 font-bold">★ Featured</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(proj)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                          proj.isPublished
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-emerald-950/40 hover:text-emerald-400 hover:border-emerald-500/30'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {proj.isPublished ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(proj)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(proj._id, proj.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Architectural Case Study' : 'Create Architectural Case Study'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Slug (auto-generated if blank)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Cloud Architecture">Cloud Architecture</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Custom Software">Custom Software</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="DevOps & CI/CD">DevOps & CI/CD</option>
                <option value="Enterprise Mobile">Enterprise Mobile</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Client (Label)
              </label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="e.g. Fintech Concept"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Summary (Card Preview) *
            </label>
            <textarea
              rows={2}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                The Challenge
              </label>
              <textarea
                rows={3}
                value={formData.challenge}
                onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                The Solution
              </label>
              <textarea
                rows={3}
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Results / Metrics (One item per line)
              </label>
              <textarea
                rows={3}
                value={formData.resultsText}
                onChange={(e) => setFormData({ ...formData, resultsText: e.target.value })}
                placeholder="99.999% uptime maintained&#10;P99 latency down from 4s to 78ms&#10;40% compute cost reduction"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Tech Stack (Comma-separated)
              </label>
              <textarea
                rows={3}
                value={formData.techStackText}
                onChange={(e) => setFormData({ ...formData, techStackText: e.target.value })}
                placeholder="AWS, Kubernetes, Terraform, ArgoCD, Go"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Image URL (Unsplash or CDN)
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Live Demo URL (HTTP/HTTPS)
              </label>
              <input
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                placeholder="https://demo.example.com"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                GitHub URL (HTTP/HTTPS)
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Mark as Featured Case Study</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Published (Publicly Viewable)</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              {editingProject ? 'Update Case Study' : 'Save Case Study'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
