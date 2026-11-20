const SiteContent = require('../models/SiteContent');
const { isConnected } = require('../config/db');

// Fallback site content if database is not yet seeded
const defaultContent = {
  heroBadge: 'Next-Generation IT & Cloud Solutions',
  heroTitle: 'Architecting Scalable Digital Systems for Modern Enterprises',
  heroSubtitle: 'NexaTech empowers global businesses with elite cloud infrastructure, intelligent AI integrations, and high-performance custom software engineering.',
  heroCtaText: 'Explore Capabilities',
  stats: [
    { label: 'Uptime Reliability', value: '99.99', suffix: '%' },
    { label: 'Cloud Architecture Deployed', value: '180', suffix: '+' },
    { label: 'Enterprise Security Audits', value: '250', suffix: '+' },
    { label: 'Average Performance Gain', value: '3.4', suffix: 'x' },
  ],
  aboutHeading: 'Engineering the Backbone of Tomorrow’s Tech Infrastructure',
  aboutDescription: 'Founded by senior systems engineers, NexaTech transforms complex technical challenges into competitive advantages through robust architectures, zero-downtime deployments, and bulletproof security.',
  contactEmail: 'contact@nexatech.internal',
  socialLinks: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    discord: 'https://discord.com',
  },
};

// @desc    Get site homepage and company content
// @route   GET /api/content
// @access  Public
const getContent = async (req, res, next) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        success: true,
        data: defaultContent,
        fromFallback: true,
      });
    }

    let content = await SiteContent.findOne();
    if (!content) {
      // Return default content if none created yet
      return res.status(200).json({
        success: true,
        data: defaultContent,
      });
    }

    return res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContent,
  defaultContent,
};
