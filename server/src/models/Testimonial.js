const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
      maxlength: 100,
    },
    role: {
      type: String,
      required: [true, 'Client role is required'],
      trim: true,
      maxlength: 100,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: 100,
    },
    content: {
      type: String,
      required: [true, 'Testimonial content is required'],
      maxlength: 1000,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    avatar: {
      type: String,
      default: '',
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

TestimonialSchema.index({ isPublished: 1 });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
