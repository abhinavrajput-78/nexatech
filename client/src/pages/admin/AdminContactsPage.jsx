import React, { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  Filter,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTitle } from '../../hooks/useTitle';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminContactsPage = () => {
  useTitle('Admin — Inquiries & Leads Management');

  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchContacts(1);
  }, [statusFilter]);

  const fetchContacts = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '15');
      if (statusFilter) params.set('status', statusFilter);
      if (searchTerm.trim()) params.set('search', searchTerm.trim());

      const res = await api.get(`/api/admin/contacts?${params.toString()}`);
      if (res.data?.success) {
        setContacts(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toast.error('Failed to load enquiries: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchContacts(1);
  };

  const handleOpenDetail = (contact) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedContact) return;
    setUpdatingStatus(true);
    try {
      const res = await api.patch(`/api/admin/contacts/${selectedContact._id}/status`, {
        status: newStatus,
      });
      if (res.data?.success) {
        toast.success(`Enquiry marked as ${newStatus}`);
        setSelectedContact(res.data.data);
        // Refresh list
        fetchContacts(pagination.page);
      }
    } catch (err) {
      toast.error('Failed to update status: ' + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) return;
    try {
      await api.delete(`/api/admin/contacts/${id}`);
      toast.success('Enquiry record deleted');
      if (selectedContact && selectedContact._id === id) {
        setIsDetailModalOpen(false);
      }
      fetchContacts(pagination.page);
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Client Inquiries & Consultation Requests
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Review submitted requirements, delivery timelines, email statuses, and update engagement states.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-white/5 w-full sm:w-auto">
          {[
            { label: 'All', value: '' },
            { label: 'Pending', value: 'pending' },
            { label: 'Contacted', value: 'contacted' },
            { label: 'Resolved', value: 'resolved' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === tab.value
                  ? 'bg-cyan-500 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-72">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search enquiries..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>
      </div>

      {/* Contacts Table */}
      {loading ? (
        <LoadingSpinner message="Querying enquiries..." />
      ) : (
        <Card className="p-0 overflow-hidden bg-[#0C1527] border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Subject & Message</th>
                  <th className="py-3 px-4">Discipline</th>
                  <th className="py-3 px-4">Email Delivery</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {contacts.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">
                      <div>{c.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{c.email}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-200 truncate">{c.subject}</div>
                      <div className="text-[11px] text-slate-500 truncate">{c.message}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-cyan-400">
                      {c.selectedService || 'General'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          c.emailStatus === 'sent'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20'
                            : c.emailStatus === 'failed'
                            ? 'bg-rose-950/60 text-rose-400 border border-rose-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {c.emailStatus || 'not_configured'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          c.status === 'resolved'
                            ? 'emerald'
                            : c.status === 'contacted'
                            ? 'cyan'
                            : 'amber'
                        }
                        size="sm"
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(c)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-white/5 text-xs text-slate-400 font-mono">
              <span>Total records: {pagination.total}</span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => fetchContacts(pagination.page - 1)}
                  icon={ChevronLeft}
                >
                  Previous
                </Button>
                <span className="self-center px-2">Page {pagination.page} / {pagination.totalPages}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => fetchContacts(pagination.page + 1)}
                  icon={ChevronRight}
                  iconPosition="right"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Empty State */}
      {!loading && contacts.length === 0 && (
        <div className="text-center py-16 bg-[#0C1527] rounded-2xl border border-white/5">
          <Mail className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No inquiry messages found.</p>
        </div>
      )}

      {/* Detail View Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Consultation Inquiry Specifications"
        maxWidth="max-w-2xl"
      >
        {selectedContact && (
          <div className="space-y-6">
            {/* Contact Header */}
            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h4 className="text-base font-heading font-bold text-white">{selectedContact.name}</h4>
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="text-xs font-mono text-cyan-400 hover:underline"
                >
                  {selectedContact.email}
                </a>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-1">
                <Badge
                  variant={
                    selectedContact.status === 'resolved'
                      ? 'emerald'
                      : selectedContact.status === 'contacted'
                      ? 'cyan'
                      : 'amber'
                  }
                  size="md"
                >
                  Status: {selectedContact.status}
                </Badge>
                <span className="text-[10px] text-slate-500 font-mono">
                  SMTP Status: {selectedContact.emailStatus || 'not_configured'}
                </span>
              </div>
            </div>

            {/* Scoping Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5">
                <span className="text-slate-500 block text-[10px] uppercase">Service</span>
                <span className="text-white font-semibold">{selectedContact.selectedService || 'General'}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5">
                <span className="text-slate-500 block text-[10px] uppercase">Budget</span>
                <span className="text-emerald-400 font-semibold">{selectedContact.budget || 'Undisclosed'}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5">
                <span className="text-slate-500 block text-[10px] uppercase">Timeline</span>
                <span className="text-cyan-400 font-semibold">{selectedContact.timeline || 'Flexible'}</span>
              </div>
            </div>

            {/* Subject & Message */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">Subject:</span>
              <p className="text-sm font-semibold text-white">{selectedContact.subject}</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">Project Specifications:</span>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans max-h-60 overflow-y-auto">
                {selectedContact.message}
              </div>
            </div>

            {/* Technical Metadata */}
            <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-white/5 space-y-1">
              <div>Submitted at: {new Date(selectedContact.createdAt).toLocaleString()}</div>
              {selectedContact.ip && <div>Origin IP: {selectedContact.ip}</div>}
            </div>

            {/* Actions: Update status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Mark Status:</span>
                <Button
                  onClick={() => handleUpdateStatus('pending')}
                  disabled={updatingStatus || selectedContact.status === 'pending'}
                  variant="secondary"
                  size="sm"
                >
                  Pending
                </Button>
                <Button
                  onClick={() => handleUpdateStatus('contacted')}
                  disabled={updatingStatus || selectedContact.status === 'contacted'}
                  variant="secondary"
                  size="sm"
                >
                  Contacted
                </Button>
                <Button
                  onClick={() => handleUpdateStatus('resolved')}
                  disabled={updatingStatus || selectedContact.status === 'resolved'}
                  variant="primary"
                  size="sm"
                >
                  Resolved
                </Button>
              </div>

              <Button
                onClick={() => handleDelete(selectedContact._id)}
                variant="danger"
                size="sm"
                icon={Trash2}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
