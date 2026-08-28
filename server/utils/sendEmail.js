// server/utils/sendEmail.js

/**
 * Send email utility
 * Supports nodemailer if configured via env or falls back gracefully in development
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      return await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Geeta University - CareerConnect" <no-reply@geetauniversity.edu.in>',
        to,
        subject,
        html,
        text,
      });
    } else {
      console.log(`[Email Simulation] To: ${to} | Subject: ${subject}`);
      return { messageId: "simulated-email" };
    }
  } catch (error) {
    console.error("sendEmail Error:", error);
    return { error };
  }
};

module.exports = sendEmail;
