import React from 'react';
import { useTitle } from '../../hooks/useTitle';
import { Card } from '../../components/ui/Card';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage = () => {
  useTitle('Privacy Policy & Data Governance');

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-950/70 text-cyan-300 border border-cyan-500/20 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Governance & Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          Last revised: January 1, 2026 • NexaTech Enterprise Operations
        </p>
      </div>

      <Card className="p-8 sm:p-12 space-y-6 text-sm text-slate-300 leading-relaxed font-sans bg-slate-900/60">
        <div>
          <h2 className="text-lg font-heading font-bold text-white mb-2">1. Starter Template Disclaimer</h2>
          <p>
            NexaTech and the included portfolio entries are starter content. Replace example contact details, sample content, and policies with your real company information before launch. This project does not claim real clients, certifications, or achievements.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-heading font-bold text-white mb-2">2. Information Collection</h2>
          <p>
            We collect contact enquiry information explicitly submitted through our website forms, including full name, business email address, project subject, technical requirements, estimated budget, and deployment timeline. For security verification and DDoS mitigation, IP addresses and browser user-agent headers are logged alongside form submissions.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-heading font-bold text-white mb-2">3. Utilization of Information</h2>
          <p>
            Information collected is strictly utilized to evaluate architectural feasibility, prepare mutual non-disclosure agreements, respond to enterprise consultation requests, and fulfill contractual software engineering obligations. We never sell, lease, or monetize client inquiry records.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-heading font-bold text-white mb-2">4. Cookies and Sessions</h2>
          <p>
            Public browsing on NexaTech does not require tracking cookies. Authorized administrative workspace access utilizes HTTP-only, SameSite session cookies encrypted with JWT secrets that expire after eight hours.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-heading font-bold text-white mb-2">5. Data Retention & Deletion</h2>
          <p>
            Enquiries are stored in MongoDB and may be deleted or modified by authorized administrators upon direct request to <code className="text-cyan-400 font-mono">contact@nexatech.internal</code>.
          </p>
        </div>
      </Card>
    </div>
  );
};
