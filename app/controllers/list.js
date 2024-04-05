const debug = require('debug')('app:controller');
require('dotenv').config();
const listDataMapper = require('../models/list.js');
const jwt = require('jsonwebtoken');

const listController = {

  async insertIntoList(req, res) {
    debug('list insertIntoList controller called');

    const { title, poster_path, overview, genres } = req.body;

    if (!title || !overview || !genres) {
      return res.status(400).json({ message: 'Données incomplètes' });
    };

    const picture = poster_path || 'Pas d\'affiche';

    try {
      const userId = req.user.id;

      const insertIntoMovie = await listDataMapper.insertIntoMovie({ name: title, picture, description: overview, genre: genres });
      const insertIntoList = await listDataMapper.insertIntoList({name: title, picture, id: userId });
      res.json({ status: 'success', data: {insertIntoMovie, insertIntoList} });

  } catch (error) {
      debug('Erreur lors de l\'insertion dans la liste :', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de l\'insertion dans la liste.' });
  };
},

async insertIntoToReview(req, res) {
  debug('list insertIntoToReview controller called');

  const { title, poster_path, overview, genres } = req.body;

  if (!title || !overview || !genres) {
    return res.status(400).json({ message: 'Données incomplètes' });
  };

  const picture = poster_path || 'Pas d\'affiche';

  try {
    const userId = req.user.id;

    const insertIntoMovie = await listDataMapper.insertIntoMovie({ name: title, picture, description: overview, genre: genres });
    const insertIntoToReview = await listDataMapper.insertIntoToReview({name: title, picture, id: userId });
    res.json({ status: 'success', data: {insertIntoMovie, insertIntoToReview} });

} catch (error) {
    debug('Erreur lors de l\'insertion dans la liste à revoir:', error);
    res.status(500).json({ status: 'error', message: 'Erreur lors de l\'insertion dans la liste à revoir.' });
};
},

  async show(req, res) {
    debug('list show controller called');

    try {
      const id = req.user.id
      const list = await listDataMapper.show(id);
          res.json({ status: 'success', data: list });
    } catch (error) {
      debug('Erreur lors de l\'affichage de la liste :', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de l\'affichage de la liste.' });
    };
  },

  async delete(req, res) {
    debug('list delete controller called');

    const id = req.user.id;

    const isRemoved = await listDataMapper.delete(id);

    if (isRemoved) {
      res.json({ status: 'success' });

    } else {
      res.json({ status: 'fail' });
    };
},
};

module.exports = listController;