import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mail,
  Send,
  MessageSquare,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Terminal,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTitle } from '../../hooks/useTitle';
import api from '../../services/api';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FadeIn } from '../../components/animations/MotionWrapper';

export const ContactPage = () => {
  useTitle('Architecture Consultation & Project Scoping');

  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    selectedService: serviceParam || 'Cloud Architecture & Infrastructure',
    budget: '$25,000 - $50,000',
    timeline: '1 - 3 months',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (serviceParam) {
      setFormData((prev) => ({
        ...prev,
        selectedService: serviceParam,
        subject: `Inquiry regarding ${serviceParam}`,
      }));
    }
  }, [serviceParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Browser client validation
    if (!formData.name.trim()) {
      toast.error('Please enter your full name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!formData.subject.trim()) {
      toast.error('Please enter an inquiry subject.');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Please enter your project details or message.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.post('/api/contact', formData);
      if (res.data?.success) {
        if (res.data.emailStatus === 'sent') {
          setSubmittedSuccess(true);
          toast.success('Consultation request and email notification sent successfully!');
        } else if (res.data.emailStatus === 'failed') {
          const msg = 'Your message was saved, but the email notification could not be delivered.';
          setErrorMessage(msg);
          toast.error(msg);
        } else {
          const msg = 'Your message was saved, but email delivery is not configured.';
          setErrorMessage(msg);
          toast.error(msg);
        }
      } else {
        throw new Error(res.data?.message || 'Submission failed');
      }
    } catch (err) {
      const msg = err.message || 'Unable to submit your enquiry at this time.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Initiate Consultation"
          title="Schedule an Architecture Review"
          subtitle="Connect with our principal software architects to analyze infrastructure bottlenecks, explore AI implementations, or scope custom systems."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Side Info Panel */}
          <div className="space-y-6">
            <Card className="bg-[#0C1527] border-cyan-500/25">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-white">Direct Dispatch</h4>
                  <p className="text-xs text-slate-400">Engineering Inquiries</p>
                </div>
              </div>
              <a
                href="mailto:contact@nexatech.internal"
                className="text-xs font-mono text-cyan-400 hover:underline block mb-4"
              >
                contact@nexatech.internal
              </a>
              <p className="text-xs text-slate-400 leading-relaxed">
                Response SLA: All technical scoping submissions receive review by a senior architect within 24 business hours.
              </p>
            </Card>

            <Card className="bg-slate-900/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-white">Confidentiality</h4>
                  <p className="text-xs text-slate-400">Mutual NDA Protection</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                We strictly protect all technical documentation and proprietary operational details under mutual NDA prior to code auditing.
              </p>
            </Card>

            <Card className="bg-slate-900/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-white">Engagement Models</h4>
                  <p className="text-xs text-slate-400">Flexible Delivery</p>
                </div>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
                <li>• Architecture Audit Sprint (2 weeks)</li>
                <li>• End-to-End System Development</li>
                <li>• Dedicated Principal Staff Augmentation</li>
              </ul>
            </Card>
          </div>

          {/* Contact Form Container */}
          <div className="lg:col-span-2">
            <Card className="p-8 sm:p-10 border-white/10 shadow-2xl relative">
              {submittedSuccess ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-2">
                    Enquiry Received Successfully
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed mb-6 font-sans">
                    Thank you, <strong className="text-white">{formData.name}</strong>. Your project scoping inquiry regarding <strong className="text-cyan-400">{formData.subject}</strong> has been logged into our systems.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmittedSuccess(false);
                      setFormData({
                        name: '',
                        email: '',
                        subject: '',
                        message: '',
                        selectedService: 'Cloud Architecture & Infrastructure',
                        budget: '$25,000 - $50,000',
                        timeline: '1 - 3 months',
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300">
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-white font-medium mb-1">
                          Submission Notice
                        </strong>
                        <span>{errorMessage}</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Your Full Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        maxLength={100}
                        placeholder="e.g. Dr. Jordan Vance"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Corporate Email <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="jordan@enterprise.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Primary Discipline
                      </label>
                      <select
                        name="selectedService"
                        value={formData.selectedService}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      >
                        <option value="Cloud Architecture & Infrastructure">Cloud Architecture</option>
                        <option value="AI Systems & Machine Learning">AI & Machine Learning</option>
                        <option value="Custom Full-Stack Web Engineering">Custom Web Engineering</option>
                        <option value="Cybersecurity & DevSecOps">Cybersecurity & DevSecOps</option>
                        <option value="DevOps & Continuous Delivery">DevOps & CI/CD</option>
                        <option value="Enterprise Mobile Solutions">Mobile App Solutions</option>
                        <option value="General Technical Scoping">General Technical Scoping</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Estimated Budget
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      >
                        <option value="< $25,000">&lt; $25,000</option>
                        <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                        <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                        <option value="$100,000+">$100,000+</option>
                        <option value="Undisclosed / Flexible">Undisclosed / Flexible</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Desired Timeline
                      </label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      >
                        <option value="Immediate (< 1 month)">Immediate (&lt; 1 mo)</option>
                        <option value="1 - 3 months">1 - 3 months</option>
                        <option value="3 - 6 months">3 - 6 months</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Inquiry Subject <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      maxLength={200}
                      placeholder="e.g. Multi-region cloud migration consultation"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Project Specifications & Technical Requirements <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      maxLength={5000}
                      placeholder="Please outline current infrastructure, concurrency targets, known latency constraints, or compliance deadlines..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-sans"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={submitting}
                    icon={Send}
                    iconPosition="right"
                    className="w-full sm:w-auto"
                  >
                    Submit Technical Enquiry
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
