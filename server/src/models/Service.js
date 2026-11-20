const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: [true, 'Service slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: 300,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Detailed description is required'],
    },
    icon: {
      type: String,
      default: 'Code',
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ServiceSchema.index({ slug: 1, isActive: 1 });

module.exports = mongoose.model('Service', ServiceSchema);
