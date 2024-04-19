const debug = require('debug')('app:server');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./app/routers/index.js')

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api", router);

app.post('/api/send-mail', async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    await sendEmail(email, subject, message);
    res.status(200).json({ message: 'E-mail envoyé avec succès' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail' });
  }
});

app.listen(PORT, () => debug(`server ready on http://localhost:${PORT}`));
