const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      trim: true,
    },
    client: {
      type: String,
      default: 'Confidential Client',
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Project summary is required'],
      maxlength: 300,
      trim: true,
    },
    challenge: {
      type: String,
      default: '',
    },
    solution: {
      type: String,
      default: '',
    },
    results: {
      type: [String],
      default: [],
    },
    techStack: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    demoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    githubUrl: {
      type: String,
      default: '',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
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

ProjectSchema.index({ slug: 1, isPublished: 1, category: 1 });

module.exports = mongoose.model('Project', ProjectSchema);
