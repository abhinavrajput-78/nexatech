const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: 5000,
    },
    selectedService: {
      type: String,
      default: 'General Inquiry',
      trim: true,
    },
    budget: {
      type: String,
      default: '',
      trim: true,
    },
    timeline: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'resolved'],
      default: 'pending',
    },
    emailStatus: {
      type: String,
      enum: ['sent', 'failed', 'not_configured'],
      default: 'not_configured',
    },
    ip: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

ContactSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Contact', ContactSchema);
