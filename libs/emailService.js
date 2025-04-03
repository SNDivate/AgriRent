// lib/emailService.js
import nodemailer from "nodemailer";

// Create a reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'deshmukhaishwarya484@gmail.com',
      pass: 'dagm cyxq dflm nrnn', // Note: Use environment variables for sensitive data in production
    },
  });
};

// Send OTP email
const sendOtpEmail = async (email, otp) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: 'deshmukhaishwarya484@gmail.com',
    to: email,
    subject: 'Your Email Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a5568; text-align: center;">Email Verification</h2>
        <p style="color: #4a5568; font-size: 16px;">Thank you for registering with our service. Please use the verification code below to complete your registration:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; padding: 15px 30px; background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #4a5568;">
            ${otp}
          </div>
        </div>
        <p style="color: #4a5568; font-size: 14px;">This code will expire in 15 minutes.</p>
        <p style="color: #4a5568; font-size: 14px;">If you didn't request this verification, please ignore this email.</p>
        <div style="text-align: center; margin-top: 30px; color: #718096; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Send welcome email after successful registration
const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: 'deshmukhaishwarya484@gmail.com',
    to: email,
    subject: 'Welcome to Our Platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a5568; text-align: center;">Welcome, ${name}!</h2>
        <p style="color: #4a5568; font-size: 16px;">Thank you for registering with our service. Your account has been successfully created and is now ready to use.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="YOUR_WEBSITE_URL/login" style="display: inline-block; padding: 12px 24px; background-color: #4299e1; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Login to Your Account
          </a>
        </div>
        <p style="color: #4a5568; font-size: 14px;">If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <div style="text-align: center; margin-top: 30px; color: #718096; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export { sendOtpEmail, sendWelcomeEmail };