import YtsApi from 'yts-api-pt';
import { search } from 'thepiratebay';

import redis, { redisPromise } from '../redis';
import { magnetReqPromise, YTSTorrentToMagnet } from './utils'

const yts = new YtsApi();

async function getMovieYts({ imdbID }) {
  try {
    const res = await yts.getMovies({
      queryTerm: imdbID,
      genre: 'action',
      sortBy: 'seeds',
      orderBy: 'desc',
      withRtRatings: true,
    })
    if (!res || !res.data || !res.data.movies || !res.data.movies.length)
      return null;

    const torrents = (await Promise.almost(
      res.data.movies[0].torrents.map(async torrent => ({
        ...torrent,
        magnet: YTSTorrentToMagnet(torrent, imdbID),
      })
    ))).filter(p => p)

    return ({
      '720p': torrents.find(torrent => torrent.quality === '720p'),
      '1080p': torrents.find(torrent => torrent.quality === '1080p')
    });
  } catch {
    return null;
  }
}

async function getMovieTpb({ imdbID }) {
  try {
    const res = await search(imdbID, {
      category: 'video',
      filter: {
        verified: true,
      },
      page: 0,
      orderBy: 'seeds',
      sortBy: 'desc',
    });
  
    if (!res.length)
      return (null);
  
    const hdFilm = res.find(movie => movie.name.match(/.*720[p]?.*/));
    const fullHdFilm = res.find(movie => movie.name.match(/.*1080[p]?.*/));
  
    return ({
      '720p': {
        seeds: hdFilm.seeders,
        peers: hdFilm.leechers,
        size: hdFilm.size,
        magnet: hdFilm.magnetLink,
        quality: '720p',
      }, '1080p': {
        seeds: fullHdFilm.seeders,
        peers: fullHdFilm.leechers,
        size: fullHdFilm.size,
        magnet: fullHdFilm.magnetLink,
        quality: '1080p',
      }
    });
  } catch {
    return null;
  }
}

async function getTorrents({ imdbID }) {
  let torrents = await redisPromise.get(`${imdbID}::torrents`);

  if (torrents)
    return JSON.parse(torrents);

  try {
    const torrents = (await Promise.almost(
      [getMovieYts, getMovieTpb].map((torrentProvider, i) => torrentProvider({ imdbID }))
    ))
      .filter(p => p)
      .reduce((finalTorrents, currentTorrents) => currentTorrents && Object.keys(currentTorrents).length
        ? {
          ...finalTorrents,
          ...(currentTorrents['720p'] && (!finalTorrents['720p'] || currentTorrents['720p'].seeds > finalTorrents['720p'].seeds)
            ? {'720p': currentTorrents['720p'] } : {}),
          ...(currentTorrents['1080p'] && (!finalTorrents['1080p'] || currentTorrents['1080p'].seeds > finalTorrents['1080p'].seeds)
          ? {'1080p': currentTorrents['1080p'] } : {})
        } : finalTorrents, {});

    if (!Object.keys(torrents).length)
      return null
    
    redis.set(`${imdbID}::torrents`, JSON.stringify(torrents), 'EX', 86400);

    return torrents;
  } catch (e){
    return null;
  }
}

export default {
  getTorrents,
  magnetReqPromise,
  YTSTorrentToMagnet,
};