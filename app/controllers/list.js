const debug = require('debug')('app:controller');
const listDataMapper = require('../models/list.js');

const listController = {

  async insert(req, res) {
    debug('list create controller called');

    const { title, poster_path, overview, genres } = req.body;

    if (!title || !overview || !genres) {
      return res.status(400).json({ message: 'Données incomplètes' });
    };

    const picture = poster_path || 'Pas d\'affiche';

    try {
      const insertToList = await listDataMapper.insert({ name: title, picture, description: overview, genre: genres });
      res.json({ status: 'success', data: insertToList });

  } catch {
    debug('Erreur lors de l\'insertion dans la liste :', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de l\'insertion dans la liste.' });
  };
},
};

module.exports = listController;