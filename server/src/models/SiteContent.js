const mongoose = require('mongoose');

const SiteContentSchema = new mongoose.Schema(
  {
    heroBadge: {
      type: String,
      default: 'Next-Generation IT & Cloud Solutions',
    },
    heroTitle: {
      type: String,
      default: 'Architecting Scalable Digital Systems for Modern Enterprises',
    },
    heroSubtitle: {
      type: String,
      default: 'NexaTech empowers global businesses with elite cloud infrastructure, intelligent AI integrations, and high-performance custom software engineering.',
    },
    heroCtaText: {
      type: String,
      default: 'Explore Capabilities',
    },
    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
        suffix: { type: String, default: '' },
      },
    ],
    aboutHeading: {
      type: String,
      default: 'Engineering the Backbone of Tomorrow’s Tech Infrastructure',
    },
    aboutDescription: {
      type: String,
      default: 'Founded by senior systems engineers, NexaTech transforms complex technical challenges into competitive advantages through robust architectures, zero-downtime deployments, and bulletproof security.',
    },
    contactEmail: {
      type: String,
      default: 'contact@nexatech.internal',
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      discord: { type: String, default: 'https://discord.com' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SiteContent', SiteContentSchema);
