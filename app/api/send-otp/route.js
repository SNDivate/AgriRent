// app/api/send-otp/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create a transporter with your email credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'deshmukhaishwarya484@gmail.com',
    pass: 'dagm cyxq dflm nrnn', // Note: Use environment variables for sensitive data in production
  },
});

// Function to generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { email } = data;
    
    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // Generate OTP
    const otp = generateOTP();

    // Email content
    const mailOptions = {
      from: 'deshmukhaishwarya484@gmail.com',
      to: email,
      subject: 'Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
          <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Return success response with OTP for verification on client side
    // Note: In a production environment, you would typically store this in a database
    // with an expiration time rather than returning it to the client
    return NextResponse.json({ message: "OTP sent successfully", otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 });
  }
}