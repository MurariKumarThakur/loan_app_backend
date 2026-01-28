const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    await sgMail.send({
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: "MyLoanApp",
      },
      subject,
      html,
    });
    //  console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ SendGrid Error:", error.response?.body || error.message);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;
