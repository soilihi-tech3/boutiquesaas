const nodemailer = require("nodemailer");
require("dotenv").config();

async function test() {
  console.log("Testing Gmail SMTP...");
  console.log("User:", process.env.GMAIL_USER);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER.trim(),
      pass: process.env.GMAIL_APP_PASS.trim()
    }
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER.trim(),
      to: process.env.GMAIL_USER.trim(),
      subject: "Test email from Easymarket",
      text: "This is a test email."
    });
    console.log("SUCCESS!", info.messageId);
  } catch (e) {
    console.error("ERROR:", e.message);
  }
}
test();
