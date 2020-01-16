import url from 'url';
import { UserInputError } from 'apollo-server-express';

import imdbApi from '../imdbapi/parser';
import osApi from '../opensubtitles/osApi';
import torrentApi from '../searchengine/torrentSearchEngine';

/**
 * QUERIES
 */

const getMovieByImdbID = async (_, { imdbID }, { req }) => {
  try {
    return imdbApi.getMovie(imdbID, req.get('Accept-Language'));
  } catch {
    return null;
  }
}

const getMoviesByType = async (_, { input }, { req }) => {
  if (!['genre', 'person'].includes(input.type))
    throw new UserInputError('USER_INPUT_ERROR');

  const language = req.get('Accept-Language');

  return ({
      genre: imdbApi.getGenre,
      person: imdbApi.getFilmography
    })[input.type](
      input.type === 'genre'
        ? { genre: input.value, startId: input.startId, language }
        : { nameID: input.value, lastPage: input.lastPage, lastImdbID: input.lastImdbID, language }
    )
}

const searchMovie = async(_, { input }, { req }) => {
  return imdbApi.searchMovies({
    ...input, language: req.get('Accept-Language')
  });;
}

const topRatedMovies = async (_, { input = {} }, { req }) => 
  imdbApi.getTopRated({ ...input, language: req.get('Accept-Language') });

const recentlyAddedMovies = async (_, { input = {} }, { req }) => 
  imdbApi.getRecentlyAdded({ ...input, language: req.get('Accept-Language') });

/**
 * MUTATIONS
 */

const commentMovie = async(_, { input: { imdbID, comment } }, { neo4j, req: { user } }) => {
  const movie = await neo4j.merge('Movie', { imdbID });

  await movie.relateTo(user, 'comments', { content: comment }, true);
  
  return { imdbID };
}

const watchMovie = async(_, { input: { imdbID, currentTime } }, { neo4j, req: { user } }) => {
  const movie = await neo4j.merge('Movie', { imdbID });

  await user.relateTo(movie, 'watchedMovies', { currentTime });

  return user.toJson();
}

const addMovieToFavorites = async(_, { input: { imdbID } }, { neo4j, req: { user } }) => {
  const movie = await neo4j.merge('Movie', { imdbID });

  await user.relateTo(movie, 'favoriteMovies');

  return user.toJson();
}

const removeMovieToFavorites = async(_, { input: { imdbID } }, { neo4j, req: { user } }) => {
  const favoriteRelations = await user.get('favoriteMovies');
  
  const favoriteRelation = favoriteRelations.find(fr =>
      fr.otherNode().get('imdbID') === imdbID);

  if (favoriteRelation)
    await favoriteRelation.delete();

  return user.toJson();
}

 /**
  * TYPES
  */

const trailer = async ({ imdbID, trailer }) => (trailer && url.resolve(process.env.API_HOST, `/trailers/${imdbID}`)) || null 

const subtitles = async ({ imdbID }) => (await osApi.getSubtitles({ imdbID }))
  .map(s => ({ ...s, url: url.resolve(process.env.API_HOST, `subtitles/${imdbID}/${s.language}`) }));

const torrents = async ({ imdbID, torrents }) =>  {
  const ts = torrents || await torrentApi.getTorrents({ imdbID })
  
  return ts ? Object.values(ts) : []
}

const comments = async ({ imdbID }, args, { neo4j }) => {
  try {
    const movie = await neo4j.find('Movie', imdbID);
    const commentsRelations = await movie.get('comments');

    return Promise.all(commentsRelations.map(cr => ({
      ...cr.properties(),
      user: cr.otherNode().properties()
    })))
  } catch {
    return [];
  }
}

const currentUserTime = async ({ imdbID }, args, { req: { user } }) => {
  const watchRelations = await user.get('watchedMovies');
  
  const watch = watchRelations.find(wr =>
      wr.otherNode().get('imdbID') === imdbID);

  return watch ? watch.get('currentTime') : null;
}

const isFavorite = async ({ imdbID }, args, { req: { user } }) => {
  const favoriteRelations = await user.get('favoriteMovies');

  return !!favoriteRelations.find(wr => wr.otherNode().get('imdbID') === imdbID);
}

export default {
  mutations: { commentMovie, watchMovie, addMovieToFavorites, removeMovieToFavorites },
  queries: { getMovieByImdbID, searchMovie, topRatedMovies, recentlyAddedMovies, getMoviesByType },
  types: { trailer, subtitles, torrents, comments, currentUserTime, isFavorite }
}