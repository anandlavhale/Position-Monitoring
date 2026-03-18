const { sendContactFormEmail } = require('../utils/emailService');

// Handle contact form submissions
exports.submitContactForm = async (req, res) => {
  try {
    console.log('Contact form submission received:', req.body);
    const { name, email, subject, message } = req.body;
    
    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email, subject, and message' 
      });
    }

    // Validate email format
    if (!email.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // Send email
    await sendContactFormEmail(name, email, subject, message);
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!'
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send your message. Please try again later.',
      error: error.message 
    });
  }
}; 