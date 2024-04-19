const nodemailer = require('nodemailer'); // npm install nodemailer
const debug = require('debug')('app:controller');
require('dotenv').config();

const mailController = {
  async sendMail(req, res) {
    debug('mail send controller called');

    const { email, subject, text } = req.body;

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
        text: text
      };

      // Envoyer le mail
      await transporter.sendMail(mailOptions);

      res.json({ status: 'success', message: 'Mail sent successfully' });
    } catch (error) {
      debug('Error sending mail:', error);
      res.status(500).json({ status: 'error', message: 'Error sending mail' });
    }
  }
};

module.exports = mailController;