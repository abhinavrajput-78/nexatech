const Contact = require('../models/Contact');
const { isConnected } = require('../config/db');
const { sendContactEmails } = require('../services/emailService');

// @desc    Submit a contact enquiry
// @route   POST /api/contact
// @access  Public (Rate limited)
const submitContact = async (req, res, next) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database service is currently unavailable. Your submission could not be saved. Please try again later or reach us directly via email.',
      });
    }

    const { name, email, subject, message, selectedService, budget, timeline } = req.body;

    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      selectedService: selectedService ? selectedService.trim() : 'General Inquiry',
      budget: budget ? budget.trim() : '',
      timeline: timeline ? timeline.trim() : '',
      status: 'pending',
      emailStatus: 'not_configured',
      ip: req.ip || req.headers['x-forwarded-for'] || '',
      userAgent: req.headers['user-agent'] || '',
    });

    // Save in database first
    await contact.save();

    // Trigger email notification workflow
    const emailResult = await sendContactEmails(contact);
    if (emailResult.status !== 'not_configured') {
      contact.emailStatus = emailResult.status;
      await contact.save();
    }

    let confirmationMessage = 'Thank you! Your project enquiry has been received and our team will get in touch shortly.';
    if (emailResult.status === 'sent') {
      confirmationMessage += ' A confirmation email has been sent to your address.';
    } else if (emailResult.status === 'failed') {
      console.warn(`[Contact Email Notice] Message saved to database, but SMTP delivery failed: ${emailResult.message}`);
    }

    return res.status(201).json({
      success: true,
      message: confirmationMessage,
      emailStatus: contact.emailStatus,
      emailError: emailResult.status === 'failed' ? emailResult.message : undefined,
      enquiryId: contact._id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact,
};
