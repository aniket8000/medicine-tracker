import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (to, resetUrl) => {
  await transporter.sendMail({
    from: `MedFinder <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your MedFinder password",
    html: `
      <p>You requested a password reset for your MedFinder account.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link expires in 30 minutes. If you didn't request this, you can ignore this email.</p>
    `,
  });
};

export const sendOrderConfirmationEmail = async (to, order) => {
  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:6px 10px;border:1px solid #ddd;">${item.name}</td>
          <td style="padding:6px 10px;border:1px solid #ddd;">${item.quantity}</td>
          <td style="padding:6px 10px;border:1px solid #ddd;">₹${item.price}</td>
        </tr>`
    )
    .join("");

  await transporter.sendMail({
    from: `MedFinder <${process.env.EMAIL_USER}>`,
    to,
    subject: `Order Confirmed — #${order._id}`,
    html: `
      <p>Hi ${order.name},</p>
      <p>Your MedFinder order <strong>#${order._id}</strong> has been confirmed.</p>
      <table style="border-collapse:collapse;margin:12px 0;">
        <thead>
          <tr>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:left;">Medicine</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:left;">Qty</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:left;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <p><strong>Total: ₹${order.total}</strong></p>
      <p>Delivery address: ${order.address}<br/>Contact: ${order.contact}</p>
    `,
  });
};

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const sendContactMessage = async ({ name, email, message }) => {
  await transporter.sendMail({
    from: `MedFinder Contact Form <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `New MedFinder contact message from ${escapeHtml(name)}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `,
  });
};
