const debug = require('debug')('app:controller');
require('dotenv').config();
const listDataMapper = require('../models/list.js');

const listController = {

// Function that inserts a film into the favorites list
  async insertIntoList(req, res) {
    debug('list insertIntoList controller called');

    const { title, poster_path, overview, genres } = req.body;

    if (!title || !overview || !genres) {
        return res.status(400).json({ message: 'Données incomplètes' });
    }

    const picture = poster_path || 'Pas d\'affiche';
    
    try {
        const userId = req.user.id;

        // const date = new Date();
        // const utcOffsetMinutes = date.getTimezoneOffset(); // Obtient le décalage en minutes
        // const utcOffsetHours = utcOffsetMinutes / 60; // Convertit le décalage en heures
        // // Soustrait le décalage à l'heure actuelle pour obtenir l'heure dans le fuseau horaire de l'utilisateur
        // date.setHours(date.getHours() - utcOffsetHours);

        // Insert the movie into the database and retrieve the ID of the inserted movie
        const insertIntoMovie = await listDataMapper.insertIntoMovie({ name: title, picture, description: overview, genre: genres });
        const movieId = insertIntoMovie.id;

        // Insert the movie into the user's favorites list
        const insertIntoList = await listDataMapper.insertIntoList({ id: userId }, { id: movieId, name: title, picture });
        // const insertIntoList = await listDataMapper.insertIntoList({ id: userId }, { id: movieId, name: title, picture, date_added: date });
        
        res.json({ status: 'success', data: { insertIntoMovie, insertIntoList } });

    } catch (error) {
        debug('Erreur lors de l\'insertion dans la liste des favoris:', error);
        res.status(500).json({ status: 'error', message: 'Erreur lors de l\'insertion dans la liste des favoris.' });
    }
},

// Function which inserts a film into the list of films to watch again
  async insertIntoToReview(req, res) {
    debug('list insertIntoToReview controller called');

    const { title, poster_path, overview, genres } = req.body;

    if (!title || !overview || !genres) {
        return res.status(400).json({ message: 'Données incomplètes' });
    }

    const picture = poster_path || 'Pas d\'affiche';

    try {
        const userId = req.user.id;

        // const date = new Date();
        // const utcOffsetMinutes = date.getTimezoneOffset(); // Obtient le décalage en minutes
        // const utcOffsetHours = utcOffsetMinutes / 60; // Convertit le décalage en heures
        // // Soustrait le décalage à l'heure actuelle pour obtenir l'heure dans le fuseau horaire de l'utilisateur
        // date.setHours(date.getHours() - utcOffsetHours);
        // console.log(date);

        // Insert the movie into the database and retrieve the ID of the inserted movie
        const insertIntoMovie = await listDataMapper.insertIntoMovie({ name: title, picture, description: overview, genre: genres });
        const movieId = insertIntoMovie.id;

        // Insert the movie into the user's list of movies to watch again
        const insertIntoToReview = await listDataMapper.insertIntoToReview({ id: userId }, { id: movieId, name: title, picture });
        // const insertIntoToReview = await listDataMapper.insertIntoToReview({ id: userId }, { id: movieId, name: title, picture, date_added: date });
        
        res.json({ status: 'success', data: { insertIntoMovie, insertIntoToReview } });

    } catch (error) {
        debug('Erreur lors de l\'insertion dans la liste à revoir :', error);
        res.status(500).json({ status: 'error', message: 'Erreur lors de l\'insertion dans la liste à revoir.' });
    };
},

// Function which allows you to display the list of favorites
  async showList(req, res) {
    debug('list show controller called');

    try {
      const id = req.user.id

      // Shows the user's list of favorites
      const list = await listDataMapper.showList(id);

      res.json({ status: 'success', data: list });

    } catch (error) {
      debug('Erreur lors de l\'affichage de la liste des films favoris:', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de l\'affichage de la liste des films favoris.' });
    };
},

// Function which allows you to display the list of films to watch again
async showToReview(req, res) {
  debug('toReview show controller called');

  try {
    const id = req.user.id

    // Displays the user's list of movies to rewatch
    const toReview = await listDataMapper.showToReview(id);

    res.json({ status: 'success', data: toReview });

  } catch (error) {
    debug('Erreur lors de l\'affichage de la liste des films à revoir :', error);
    res.status(500).json({ status: 'error', message: 'Erreur lors de l\'affichage de la liste des films à revoir.' });
  };
},

// Function that allows you to delete a film from the list of favorite films
  async deleteFromList(req, res) {
    debug('list delete controller called');

    
  try {
    const userId = req.user.id;
    const { title, poster_path } = req.body;

    // Removes a movie from the user's favorites list
    const deleteFromList = await listDataMapper.deleteFromList({id: userId}, {name: title, picture: poster_path});
    // Remove a movie from the movie table
    const deleteFromMovie = await listDataMapper.deleteFromMovie({ name: title});

    res.json({ status: 'success' });

    } catch (error) {
      debug('Erreur lors de la suppression du film dans la liste des favoris:', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la suppression du film dans la liste des favoris.' });
    };
},

// Function that allows you to delete a film from the list of films to watch again
  async deleteFromToReview(req, res) {
    debug('list delete controller called');

  
  try {
    const userId = req.user.id;
    const { title, poster_path } = req.body;

    // Removes a movie from the user's watch list
    const deleteFromToReview = await listDataMapper.deleteFromToReview({id: userId}, {name: title, picture: poster_path});
    // Remove a movie from the movie table
    const deleteFromMovie = await listDataMapper.deleteFromMovie({ name: title });
    res.json({ status: 'success' });

  } catch (error) {
    debug('Erreur lors de la suppression du film dans la liste des films à revoir:', error);
    res.status(500).json({ status: 'error', message: 'Erreur lors de la suppression du film dans la liste des films à revoir.' });
  };
},
};

module.exports = listController;