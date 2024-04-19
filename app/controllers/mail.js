const nodemailer = require('nodemailer'); // npm install nodemailer
const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../service/error.js');

const mailController = {
  async sendMail(req, res) {
    debug('mail send controller called');

    const { email, subject, message } = req.body;

    try {
      // Créer un transporter pour envoyer le mail
      const transporter = nodemailer.createTransport({
        service: 'Outlook',
        auth: {
          user: process.env.OUTLOOK_USER,
          pass: process.env.OUTLOOK_PASSWORD
        }
      });

      // Définir les options du mail
      const mailOptions = {
        from: process.env.OUTLOOK_USER,
        to: email,
        subject: subject,
        text: message
      };

      // Envoyer le mail
      await transporter.sendMail(mailOptions);

      res.json({ status: 'success', message: 'Mail sent successfully' });

    } catch (error) {
      debug('Error sending mail:', error);
      errorHandler._500(error, req, res);
    }
  }
};

module.exports = mailController;