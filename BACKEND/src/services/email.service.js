const nodemailer = require("nodemailer");

const FROM_EMAIL = process.env.EMAIL_FROM || process.env.SMTP_USER || "no-reply@example.com";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  // use secure for port 465 typically
  secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// optional: verify transporter at startup and log helpful message
transporter.verify().then(() => {
  console.log("SMTP transporter ready");
}).catch((err) => {
  console.warn("SMTP transporter verification failed:", err && (err.message || err));
});

async function sendOtpEmail(email, otp) {
  const from = FROM_EMAIL;

  if (!email) throw new Error("sendOtpEmail: missing recipient email");

  return transporter.sendMail({
    from,
    to: email,
    subject: "Your HealthSetu OTP",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  });
}

async function sendMail(to, subject, html, text) {
  // basic validation
  if (!to) {
    const err = new Error("sendMail: missing recipient 'to' address");
    console.error(err);
    throw err;
  }

  const from = FROM_EMAIL;

  // if transporter is not configured, fallback to console log (useful for dev)
  if (!transporter) {
    console.log("EMAIL MOCK ->", { from, to, subject, text: text || html });
    return { mock: true };
  }

  try {
    const info = await transporter.sendMail({ from, to, subject, html, text });
    console.log(`Email sent to ${to}: ${info && info.messageId ? info.messageId : JSON.stringify(info)}`);
    return info;
  } catch (err) {
    // rethrow with the original error so callers can detect and log it
    console.error("sendMail error:", err && (err.stack || err));
    throw err;
  }
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildAcceptanceEmail(hospitalName, note) {
  const subject = `HealthSetu: your registration request was accepted`;
  const html = `<p>Hi ${escapeHtml(hospitalName) || "Team"},</p>
    <p>Congratulations — your registration request has been accepted and your hospital is now listed on HealthSetu.</p>
    ${note ? `<p><strong>Note from admin:</strong> ${escapeHtml(note)}</p>` : ""}
    <p>If you have any questions, reply to this email or contact support.</p>
    <p>Regards,<br/>HealthSetu</p>`;
  const text = `Hi ${hospitalName || "Team"},\n\nYour registration request has been accepted.\n${note ? `Note from admin: ${note}\n\n` : ""}Regards,\nHealthSetu`;
  return { subject, html, text };
}

function buildRejectionEmail(hospitalName, note) {
  const subject = `HealthSetu: your registration request was rejected`;
  const html = `<p>Hi ${hospitalName || "Team"},</p>
    <p>We reviewed your registration request and unfortunately it has been rejected.</p>
    ${note ? `<p><strong>Note from admin:</strong> ${note}</p>` : ""}
    <p>If you'd like to reapply please update your submission and contact support.</p>
    <p>Regards,<br/>HealthSetu</p>`;
  return { subject, html };
}

function buildChangesRequestedEmail(hospitalName, note) {
  const subject = `HealthSetu: additional information required for your registration`;
  const html = `<p>Hi ${hospitalName || "Team"},</p>
    <p>We need some additional information before we can approve your registration:</p>
    <p><strong>Requested changes:</strong> ${note || "Please update missing/incorrect fields."}</p>
    <p>Please update your request and resubmit. Regards,<br/>HealthSetu</p>`;
  return { subject, html };
}

module.exports = {
  sendOtpEmail,
  sendMail,
  buildRejectionEmail,
  buildChangesRequestedEmail,
  buildAcceptanceEmail,
};