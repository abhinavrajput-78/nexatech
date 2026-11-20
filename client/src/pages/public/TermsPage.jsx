import React from 'react';
import { useTitle } from '../../hooks/useTitle';
import { Card } from '../../components/ui/Card';
import { ShieldAlert } from 'lucide-react';

export const TermsPage = () => {
  useTitle('Terms of Service');

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-950/70 text-purple-300 border border-purple-500/20 mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          Last updated: January 1, 2026 • NexaTech Enterprise Operations
        </p>
      </div>

      <Card className="p-8 sm:p-12 space-y-6 text-sm text-slate-300 leading-relaxed font-sans bg-slate-900/60">
        <div>
          <h2 className="text-lg font-heading font-bold text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or browsing this NexaTech website starter application, you acknowledge and agree to be bound by these Terms of Service. If you do not agree to all provisions, you must discontinue utilization of this portal.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-heading font-bold text-white mb-2">2. Illustrative Portfolio & Demo Disclaimer</h2>
          <p>
            NexaTech and the included portfolio entries are starter content. Replace example contact details, sample content, and policies with your real company information before launch. This project does not claim real clients, certifications, or achievements.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-heading font-bold text-white mb-2">3. Acceptable Use Policy</h2>
          <p>
            You agree not to disrupt, compromise, or execute automated malicious testing (including brute force login attacks, unauthorized SQL/NoSQL injections, or DDoS flooding) against this API platform. Violators will face immediate IP rate limiting and permanent network blacklisting.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-heading font-bold text-white mb-2">4. Intellectual Property</h2>
          <p>
            All custom architecture designs, codebase components, branding assets, and technical frameworks displayed remain proprietary to NexaTech or their respective open-source copyright holders.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-heading font-bold text-white mb-2">5. Limitation of Liability</h2>
          <p>
            Under no circumstances shall NexaTech or its contributors be held liable for indirect, incidental, or consequential damages resulting from downtime or reliance on information presented within this starter repository.
          </p>
        </div>
      </Card>
    </div>
  );
};
