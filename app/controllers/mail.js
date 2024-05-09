const nodemailer = require("nodemailer"); // npm install nodemailer
const debug = require("debug")("app:controller");
const { OUTLOOK_USER, OUTLOOK_PASSWORD } = require("../config/config.js");

const mailController = {
  // Allows you to send an email
  async sendMail(req, res) {
    debug("mail send controller called");

    const { email, subject, message } = req.body;

    // Create a transport to send the email
    const transporter = nodemailer.createTransport({
      service: "Outlook",
      auth: {
        user: OUTLOOK_USER,
        pass: OUTLOOK_PASSWORD,
      },
    });

    // Set email options
    const mailOptions = {
      from: OUTLOOK_USER,
      to: email,
      subject: subject,
      text: message,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.json({ status: "success", message: "Mail sent successfully" });
  },
};

module.exports = mailController;
