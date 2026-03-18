const nodemailer = require('nodemailer');

// Create a transporter using Gmail with optimized settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    // Note: Gmail app passwords should not have spaces when used in code
    pass: process.env.EMAIL_PASSWORD.replace(/\s+/g, '')
  },
  // Add these settings to improve delivery speed
  pool: true, // Use connection pool
  maxConnections: 5, // Maximum number of connections
  maxMessages: Infinity, // Maximum number of messages per connection
  rateDelta: 1000, // How many milliseconds between messages
  rateLimit: 5 // Maximum number of messages per rateDelta
});

const sendVerificationEmail = async (email, verificationCode) => {
  const mailOptions = {
    from: `"EduConnect" <${process.env.EMAIL_USER}>`, // Changed from "Education Platform" to "EduConnect"
    to: email,
    subject: 'EduConnect - Your Email Verification Code',
    priority: 'high', // Set high priority
    headers: {
      'X-Priority': '1', // High priority for email clients
      'X-MSMail-Priority': 'High',
      'Importance': 'High'
    },
    html: `
      <h2>Welcome to EduConnect!</h2>
      <p>Your verification code is:</p>
      <h1 style="color: #4F46E5; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background: #F3F4F6; border-radius: 8px;">${verificationCode}</h1>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    `
  };

  try {
    // Log the verification code to console for development purposes
    console.log('\n==================================');
    console.log('📧 VERIFICATION EMAIL');
    console.log('==================================');
    console.log(`📧 To: ${email}`);
    console.log(`📧 From: ${process.env.EMAIL_USER}`);
    console.log(`📧 Verification Code: ${verificationCode}`);
    console.log('==================================\n');
    
    // Send email with a timeout to prevent hanging
    const result = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email sending timeout')), 10000)
      )
    ]);
    
    console.log('Verification email sent successfully to:', email);
    return result;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

// New function to send contact form submissions
const sendContactFormEmail = async (name, email, subject, message) => {
  const mailOptions = {
    from: `"EduConnect Contact Form" <${process.env.EMAIL_USER}>`,
    to: 'nehulkarvedant@gmail.com', // Admin email address
    subject: `EduConnect Contact: ${subject}`,
    priority: 'high',
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'High'
    },
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
      <p style="margin-top: 20px; color: #666;">This email was sent from the EduConnect contact form.</p>
    `
  };

  try {
    console.log('\n==================================');
    console.log('📧 CONTACT FORM SUBMISSION');
    console.log('==================================');
    console.log(`📧 From: ${name} (${email})`);
    console.log(`📧 Subject: ${subject}`);
    console.log(`📧 Message: ${message}`);
    console.log('==================================\n');
    
    const result = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email sending timeout')), 10000)
      )
    ]);
    
    console.log('Contact form email sent successfully from:', email);
    return result;
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw new Error(`Failed to send contact form email: ${error.message}`);
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
if (!process.env.FRONTEND_URL) {
    console.error('FRONTEND_URL environment variable is not set!');
  }
  
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"EduConnect" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'EduConnect - Password Reset Request',
    priority: 'high',
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'High'
    },
    html: `
      <h2>EduConnect Password Reset</h2>
      <p>You are receiving this email because you (or someone else) has requested to reset your password.</p>
      <p>Please click the link below or copy it to your browser to complete the process:</p>
      <p><a href="${resetUrl}" style="padding: 10px 15px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Reset Password</a></p>
      <p>Or copy this link: <span style="color: #4F46E5;">${resetUrl}</span></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `
  };

  try {
    console.log('\n==================================');
    console.log('📧 PASSWORD RESET EMAIL');
    console.log('==================================');
    console.log(`📧 To: ${email}`);
    console.log(`📧 Reset URL: ${resetUrl}`);
    console.log('==================================\n');
    
    const result = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email sending timeout')), 10000)
      )
    ]);
    
    console.log('Password reset email sent successfully to:', email);
    return result;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendContactFormEmail
}; 
