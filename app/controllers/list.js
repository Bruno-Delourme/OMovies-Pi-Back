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

  async show(req, res) {
    debug('list show controller called');

    try {
      const list = await listDataMapper.show();
          res.json({ status: 'success', data: list });
    } catch {
      debug('Erreur lors de l\'affichage de la liste :', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de l\'affichage de la liste.' });
    };
    
  },

  async delete(req, res) {
    debug('list delete controller called');

    const { id } = req.params;

    const isRemoved = await listDataMapper.delete(id);

    if (isRemoved) {
      res.json({ status: 'success' });

    } else {
      res.json({ status: 'fail' });
    };
},
};

module.exports = listController;