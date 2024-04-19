const nodemailer = require('nodemailer'); // npm install nodemailer
const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../service/error.js');

const mailController = {

  // Allows you to send an email
  async sendMail(req, res) {
    debug('mail send controller called');

    const { email, subject, message } = req.body;

    try {
      // Create a transport to send the email
      const transporter = nodemailer.createTransport({
        service: 'Outlook',
        auth: {
          user: process.env.OUTLOOK_USER,
          pass: process.env.OUTLOOK_PASSWORD
        }
      });

      // Set email options
      const mailOptions = {
        from: process.env.OUTLOOK_USER,
        to: email,
        subject: subject,
        text: message
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      res.json({ status: 'success', message: 'Mail sent successfully' });

    } catch (error) {
      debug('Error sending mail:', error);
      errorHandler._500(error, req, res);
    }
  }
};

module.exports = mailController;