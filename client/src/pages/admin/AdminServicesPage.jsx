import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTitle } from '../../hooks/useTitle';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const iconOptions = ['Cloud', 'Cpu', 'Code', 'ShieldCheck', 'Terminal', 'Smartphone', 'Layers', 'Server'];

export const AdminServicesPage = () => {
  useTitle('Admin — Services Management');

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    icon: 'Cloud',
    featuresText: '',
    benefitsText: '',
    faqsJson: '[]',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/services');
      if (res.data?.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load services: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      icon: 'Cloud',
      featuresText: '',
      benefitsText: '',
      faqsJson: '[]',
      order: services.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    setFormData({
      title: srv.title || '',
      slug: srv.slug || '',
      shortDescription: srv.shortDescription || '',
      description: srv.description || '',
      icon: srv.icon || 'Cloud',
      featuresText: Array.isArray(srv.features) ? srv.features.join('\n') : '',
      benefitsText: Array.isArray(srv.benefits) ? srv.benefits.join('\n') : '',
      faqsJson: JSON.stringify(srv.faqs || [], null, 2),
      order: srv.order || 0,
      isActive: srv.isActive !== undefined ? srv.isActive : true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Service title is required');
      return;
    }
    if (!formData.shortDescription.trim()) {
      toast.error('Short description is required');
      return;
    }

    let parsedFaqs = [];
    if (formData.faqsJson.trim()) {
      try {
        parsedFaqs = JSON.parse(formData.faqsJson);
        if (!Array.isArray(parsedFaqs)) {
          throw new Error('FAQs must be a JSON array of { question, answer }');
        }
      } catch (err) {
        toast.error('Invalid FAQs JSON: ' + err.message);
        return;
      }
    }

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      icon: formData.icon,
      features: formData.featuresText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      benefits: formData.benefitsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      faqs: parsedFaqs,
      order: Number(formData.order) || 0,
      isActive: formData.isActive,
    };

    setSaving(true);
    try {
      if (editingService) {
        await api.put(`/api/admin/services/${editingService._id}`, payload);
        toast.success('Service updated successfully');
      } else {
        await api.post('/api/admin/services', payload);
        toast.success('Service created successfully');
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      toast.error('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete service "${title}"?`)) return;
    try {
      await api.delete(`/api/admin/services/${id}`);
      toast.success('Service deleted');
      fetchServices();
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  const handleToggleActive = async (srv) => {
    try {
      await api.put(`/api/admin/services/${srv._id}`, { isActive: !srv.isActive });
      toast.success(`Service ${!srv.isActive ? 'activated' : 'deactivated'}`);
      fetchServices();
    } catch (err) {
      toast.error('Update failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Services Management
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Manage enterprise services, features, deliverables, and FAQs.
          </p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" size="sm" icon={Plus}>
          Add New Service
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading services catalog..." />
      ) : (
        <Card className="p-0 overflow-hidden bg-[#0C1527] border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Icon</th>
                  <th className="py-3 px-4">Title & Slug</th>
                  <th className="py-3 px-4">Deliverables</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {services.map((srv) => (
                  <tr key={srv._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-cyan-400 font-bold">{srv.icon}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white text-sm">{srv.title}</div>
                      <div className="text-[11px] font-mono text-slate-400">{srv.slug}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {srv.features?.length || 0} items
                    </td>
                    <td className="py-3 px-4 font-mono">{srv.order}</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(srv)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                          srv.isActive
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-emerald-950/40 hover:text-emerald-400 hover:border-emerald-500/30'
                        }`}
                        title="Click to toggle status"
                      >
                        {srv.isActive ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(srv)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(srv._id, srv.title)}
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Engineering Service' : 'Add New Engineering Service'}
        maxWidth="max-w-2xl"
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
                Slug (auto-generated if empty)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. cloud-architecture"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {iconOptions.map((ic) => (
                  <option key={ic} value={ic}>
                    {ic}
                  </option>
                ))}
              </select>
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

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Active on Public Site</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Short Description (Card preview) *
            </label>
            <textarea
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Detailed Architectural Scope *
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Deliverables / Features (One item per line)
              </label>
              <textarea
                rows={4}
                value={formData.featuresText}
                onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                placeholder="Multi-cloud strategy&#10;Kubernetes orchestration&#10;Terraform automation"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Enterprise Benefits (One item per line)
              </label>
              <textarea
                rows={4}
                value={formData.benefitsText}
                onChange={(e) => setFormData({ ...formData, benefitsText: e.target.value })}
                placeholder="Zero downtime rolling deployments&#10;45% infrastructure savings&#10;99.99% SLA"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              FAQs (Enter as JSON Array: [{ `"question"`, `"answer"` }])
            </label>
            <textarea
              rows={3}
              value={formData.faqsJson}
              onChange={(e) => setFormData({ ...formData, faqsJson: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
            />
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
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
