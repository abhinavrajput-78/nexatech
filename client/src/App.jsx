import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { ScrollToTop } from './components/layout/ScrollToTop';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ServiceDetailPage } from './pages/public/ServiceDetailPage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { ContactPage } from './pages/public/ContactPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { TermsPage } from './pages/public/TermsPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminContactsPage } from './pages/admin/AdminContactsPage';

// Layout shell for public pages
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#070B14] text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0E1726',
            color: '#F8FAFC',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            fontSize: '13px',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: {
              primary: '#06B6D4',
              secondary: '#070B14',
            },
          },
          error: {
            iconTheme: {
              primary: '#F43F5E',
              secondary: '#070B14',
            },
          },
        }}
      />

      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Console Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="testimonials" element={<AdminTestimonialsPage />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="contacts" element={<AdminContactsPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
