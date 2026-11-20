import React, { useState, useEffect } from 'react';
import { Quote, Plus, Edit2, Trash2, Check, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTitle } from '../../hooks/useTitle';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminTestimonialsPage = () => {
  useTitle('Admin — Testimonials Management');

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    avatar: '',
    isPublished: true,
    order: 0,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/testimonials');
      if (res.data?.success) {
        setTestimonials(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load testimonials: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingTestimonial(null);
    setFormData({
      clientName: '',
      role: '',
      company: '',
      content: '',
      rating: 5,
      avatar: '',
      isPublished: true,
      order: testimonials.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTestimonial(t);
    setFormData({
      clientName: t.clientName || '',
      role: t.role || '',
      company: t.company || '',
      content: t.content || '',
      rating: t.rating || 5,
      avatar: t.avatar || '',
      isPublished: Boolean(t.isPublished),
      order: t.order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.clientName.trim() || !formData.company.trim() || !formData.content.trim()) {
      toast.error('Client name, company, and feedback content are required');
      return;
    }

    setSaving(true);
    try {
      if (editingTestimonial) {
        await api.put(`/api/admin/testimonials/${editingTestimonial._id}`, formData);
        toast.success('Testimonial updated');
      } else {
        await api.post('/api/admin/testimonials', formData);
        toast.success('Testimonial created');
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      toast.error('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete testimonial from "${name}"?`)) return;
    try {
      await api.delete(`/api/admin/testimonials/${id}`);
      toast.success('Testimonial removed');
      fetchTestimonials();
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  const handleTogglePublished = async (t) => {
    try {
      await api.put(`/api/admin/testimonials/${t._id}`, { isPublished: !t.isPublished });
      toast.success(`Testimonial ${!t.isPublished ? 'published on homepage' : 'hidden'}`);
      fetchTestimonials();
    } catch (err) {
      toast.error('Update failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Client Testimonials Management
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Verified endorsements displayed on the homepage. Only published records are rendered publicly.
          </p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" size="sm" icon={Plus}>
          Add Testimonial
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner message="Querying verified testimonials..." />
      ) : (
        <Card className="p-0 overflow-hidden bg-[#0C1527] border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Client & Company</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Feedback Preview</th>
                  <th className="py-3 px-4">Homepage Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {testimonials.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white text-sm">{t.clientName}</div>
                      <div className="text-[11px] text-slate-400">
                        {t.role}, <span className="text-cyan-400">{t.company}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-sm truncate text-slate-400 italic">
                      "{t.content}"
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(t)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                          t.isPublished
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-emerald-950/40 hover:text-emerald-400 hover:border-emerald-500/30'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {t.isPublished ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" />
                            <span>Hidden / Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(t)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(t._id, t.clientName)}
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTestimonial ? 'Edit Testimonial' : 'Add Client Testimonial'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Client Name *
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. CTO, Head of Cloud"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Rating (1 - 5 Stars)
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★</option>
                <option value={3}>3 Stars ★★★</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Client Avatar Image URL
            </label>
            <input
              type="text"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Endorsement Feedback *
            </label>
            <textarea
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              maxLength={1000}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Publish on Homepage (Show publicly)</span>
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
              {editingTestimonial ? 'Update Testimonial' : 'Save Testimonial'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
