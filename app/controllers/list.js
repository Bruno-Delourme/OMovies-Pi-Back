const debug = require('debug')('app:controller');
require('dotenv').config();
const listDataMapper = require('../models/list.js');

const listController = {

  async insertIntoList(req, res) {
    debug('list insertIntoList controller called');

    const { title, poster_path, overview, genres } = req.body;

    if (!title || !overview || !genres) {
        return res.status(400).json({ message: 'Données incomplètes' });
    }

    const picture = poster_path || 'Pas d\'affiche';

    try {
        const userId = req.user.id;

        // Insérer le film dans la base de données et récupérer l'ID du film inséré
        const insertIntoMovie = await listDataMapper.insertIntoMovie({ name: title, picture, description: overview, genre: genres });
        const movieId = insertIntoMovie.id;

        // Insérer le film dans la liste des favoris de l'utilisateur
        const insertIntoList = await listDataMapper.insertIntoList({ id: userId }, { id: movieId, name: title, picture });
        
        res.json({ status: 'success', data: { insertIntoMovie, insertIntoList } });

    } catch (error) {
        debug('Erreur lors de l\'insertion dans la liste des favoris:', error);
        res.status(500).json({ status: 'error', message: 'Erreur lors de l\'insertion dans la liste des favoris.' });
    }
},

  async insertIntoToReview(req, res) {
    debug('list insertIntoToReview controller called');

    const { title, poster_path, overview, genres } = req.body;

    if (!title || !overview || !genres) {
        return res.status(400).json({ message: 'Données incomplètes' });
    }

    const picture = poster_path || 'Pas d\'affiche';

    try {
        const userId = req.user.id;

        const insertIntoMovie = await listDataMapper.insertIntoMovie({ name: title, picture, description: overview, genre: genres });
        const movieId = insertIntoMovie.id;

        const insertIntoToReview = await listDataMapper.insertIntoToReview({ id: userId }, { id: movieId, name: title, picture });
        
        res.json({ status: 'success', data: { insertIntoMovie, insertIntoToReview } });

    } catch (error) {
        debug('Erreur lors de l\'insertion dans la liste à revoir :', error);
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

  async deleteFromList(req, res) {
    debug('list delete controller called');

    
  try {
    const userId = req.user.id;
    const { title, poster_path } = req.body;

    const deleteFromList = await listDataMapper.deleteFromList({id: userId}, {name: title, picture: poster_path});
    const deleteFromMovie = await listDataMapper.deleteFromMovie({ name: title});
    res.json({ status: 'success' });

    } catch (error) {
      debug('Erreur lors de la suppression du film dans la liste des favoris:', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la suppression du film dans la liste des favoris.' });
    };
},

  async deleteFromToReview(req, res) {
    debug('list delete controller called');

  
  try {
    const userId = req.user.id;
    const { title, poster_path } = req.body;

    const deleteFromToReview = await listDataMapper.deleteFromToReview({id: userId}, {name: title, picture: poster_path});
    const deleteFromMovie = await listDataMapper.deleteFromMovie({ name: title });
    res.json({ status: 'success' });

  } catch (error) {
    debug('Erreur lors de la suppression du film dans la liste des films à revoir:', error);
    res.status(500).json({ status: 'error', message: 'Erreur lors de la suppression du film dans la liste des films à revoir.' });
  };
},
};

module.exports = listController;