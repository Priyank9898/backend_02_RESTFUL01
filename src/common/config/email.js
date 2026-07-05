import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true if using port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Generic email sender
const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to,
    subject,
    html,
  });
};

// EMail verification
const sendVerificationMail = async (email, token) => {
  const subject = "Verify Your Email";

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const html = `
    <h2>Welcome!</h2>

    <p>Thank you for registering.</p>

    <p>Please click the button below to verify your email.</p>

    <a href="${verificationUrl}">
      Verify Email
    </a>
  `;

  await sendMail(email, subject, html);
};

// Forgot Password
const sendResetPasswordMail = async (email, token) => {
  const subject = "Reset Your Password";

  const resetPasswordUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const html = `
    <h2>Password Reset Request</h2>

    <p>We received a request to reset your password.</p>

    <p>Click the button below to reset your password.</p>

    <a href="${resetPasswordUrl}">
      Reset Password
    </a>

    <p>This link will expire in 5 minutes.</p>

    <p>If you didn't request this, you can safely ignore this email.</p>
  `;

  await sendMail(email, subject, html);
};

export { sendVerificationMail, sendResetPasswordMail };
