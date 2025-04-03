// lib/otpStore.js
/**
 * In a real production environment, you would want to store OTPs in a database
 * or a caching service like Redis. This in-memory implementation is for demonstration 
 * purposes only and will reset when the server restarts.
 */

// Create a singleton OTP store that can be imported in multiple files
const otpStore = new Map();

// Helper function to clean up expired OTPs (could be run periodically)
const cleanExpiredOtps = () => {
  for (const [email, data] of otpStore.entries()) {
    if (Date.now() > data.expiry) {
      otpStore.delete(email);
    }
  }
};

// Set OTP for a specific email
const setOtp = (email, otp, expiryMinutes = 15) => {
  otpStore.set(email, {
    code: otp,
    expiry: Date.now() + expiryMinutes * 60 * 1000,
  });
};

// Get stored OTP data for an email
const getOtp = (email) => {
  return otpStore.get(email);
};

// Verify an OTP for an email
const verifyOtp = (email, otp) => {
  const storedData = otpStore.get(email);
  
  // No OTP found
  if (!storedData) {
    return { valid: false, reason: "not_found" };
  }
  
  // OTP expired
  if (Date.now() > storedData.expiry) {
    otpStore.delete(email);
    return { valid: false, reason: "expired" };
  }
  
  // OTP doesn't match
  if (storedData.code !== otp) {
    return { valid: false, reason: "invalid" };
  }
  
  // OTP is valid
  otpStore.delete(email); // Clean up used OTP
  return { valid: true };
};

// Delete OTP for an email
const deleteOtp = (email) => {
  otpStore.delete(email);
};

// Run cleanup every hour
setInterval(cleanExpiredOtps, 60 * 60 * 1000);

export { setOtp, getOtp, verifyOtp, deleteOtp };