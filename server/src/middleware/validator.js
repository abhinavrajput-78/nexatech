const validateContactInput = (req, res, next) => {
  const { name, email, subject, message } = req.body;

  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Full name is required');
  } else if (name.trim().length > 100) {
    errors.push('Name cannot exceed 100 characters');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push('Email address is required');
  } else if (!emailRegex.test(email.trim())) {
    errors.push('Please provide a valid email address');
  }

  if (!subject || typeof subject !== 'string' || !subject.trim()) {
    errors.push('Subject is required');
  } else if (subject.trim().length > 200) {
    errors.push('Subject cannot exceed 200 characters');
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    errors.push('Message is required');
  } else if (message.trim().length > 5000) {
    errors.push('Message cannot exceed 5000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    });
  }

  next();
};

const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email.trim())) {
    errors.push('Please enter a valid email address');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    });
  }

  next();
};

const isValidHttpUrl = (string) => {
  if (!string || string.trim() === '') return true;
  try {
    const url = new URL(string.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

const validateProjectUrls = (req, res, next) => {
  const { demoUrl, githubUrl } = req.body;

  if (demoUrl && !isValidHttpUrl(demoUrl)) {
    return res.status(400).json({
      success: false,
      message: 'Live demo URL must use HTTP or HTTPS',
    });
  }

  if (githubUrl && !isValidHttpUrl(githubUrl)) {
    return res.status(400).json({
      success: false,
      message: 'GitHub URL must use HTTP or HTTPS',
    });
  }

  next();
};

module.exports = {
  validateContactInput,
  validateLoginInput,
  validateProjectUrls,
  isValidHttpUrl,
};
