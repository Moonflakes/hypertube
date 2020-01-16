import url from 'url';
import fetch from 'node-fetch';
import { load } from 'cheerio';
import { getBigImage } from './utils';
import redis, { redisPromise } from '../redis';
import torrentApi from '../searchengine/torrentSearchEngine';

const MOVIE_PER_PAGE = 16;
const IMDB_BASE_URL = 'https://www.imdb.com';
const IMDB_TOP_RATED_URL = url.resolve(IMDB_BASE_URL, '/chart/top');

const baseSearchUrl = url.resolve(IMDB_BASE_URL, '/search/title/?title_type=feature');
const movieUrl = url.resolve(IMDB_BASE_URL, '/title/');
const nameUrl = url.resolve(IMDB_BASE_URL, '/name/');
const filmographyUrl = url.resolve(IMDB_BASE_URL, '/filmosearch/?explore=title_type&ref_=filmo_ref_yr&mode=detail&title_type=movie');
const genreUrl = url.resolve(IMDB_BASE_URL, '/search/title/?title_type=movie&explore=title_type,genres&view=simple');
const YTS_BASE_URL = 'https://yts.ae';

function getFetchIMDBOptions({ language }) {
  return {
    headers: {
      'accept-language': language,
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      "accept-encoding": "gzip, deflate, br"
    },
  };
}

/*
  *
  * Movie Search
  *   title: "Example"
  *   releaseDate: "YYYY"
  *   userRating: [4.1, 9.9] or [5.5]
  *   genres: ["action", "comedy"]
  *   sort: "(alpha/user_rating/boxoffice_gross_us/year),(asc/desc)"
  *   startId: "51" Pagination
  *  Returned => Array of { title, image, imdbID, paginationID }
*/

function searchMovies({
  title, releaseDate, userRating, genres, sort, startId, language = 'en-US'
}) {
  const url = `${baseSearchUrl}&title=${title || ""}&release_date=${releaseDate.join(',') || ""}&user_rating=${userRating.join(',') || ""}&genres=${genres.join(',') || ""}&sort=${sort || ""}&start=${startId || ""}`;
  return fetch(url, getFetchIMDBOptions({ language }))
    .then((response) => response.text())
    .then((body) => {
      const $ = load(body);
      return $('.lister-item').map((i, element) => {
        const $image = $(element).find('.lister-item-image a img');
        const $title = $(element).find('.lister-item-header a');
        const imdbID = $title.attr('href').match(/title\/(.*)\//)[1];
        const imgUrl = getBigImage($image.attr('loadlate'));
        const imdbRating = $(element).find('.ratings-imdb-rating strong:not([class])').text().trim();
        var datePublished = ($(element).find('span.lister-item-year').text().trim().match(/\(\d{4}\)$/)) ? $(element).find('span.lister-item-year').text().trim().match(/\(\d{4}\)$/)[0].slice(1, -1) : "";
        const paginationID = $(element).find('.lister-item-index')
          .text()
          .trim()
          .slice(0, -1);
        return {
          title: $title.text(),
          poster: imgUrl,
          imdbID,
          paginationID,
          datePublished,
          imdbRating,
        };
      }).get();
    });
}

/*
  *
  * Get Name
  *   nameID: 'nm0000138'
  * Returned => { name, img }
*/

async function getName(nameID) {
  let person;

  if ((person = await redisPromise.get(`person::${nameID}`)))
    return JSON.parse(person);

  return fetch(`${nameUrl}${nameID}`)
    .then((response) => response.text())
    .then((body) => {
      const $ = load(body);
      
      person = {
        nameID,
        name: $('#name-overview-widget .header span.itemprop').text(),
        img: ($('#name-overview-widget-layout #img_primary div.image a img').attr('src'))
          ? getBigImage($('#name-overview-widget-layout #img_primary div.image a img').attr('src'))
          : 'https://m.media-amazon.com/images/G/01/imdb/images/nopicture/medium/name-2135195744._CB470041852_.png',
      }

      redis.set(`person::${nameID}`, JSON.stringify(person), 'EX', 86400);
      
      return person;
    });
}

async function getTrailer(trailerUrl, imdbID) {
  const trailer = await redisPromise.get(`trailer::${imdbID}`);

  if (trailer)
    return trailer;
  if (!trailerUrl)
    return Promise.reject(null);

  return fetch(url.resolve(IMDB_BASE_URL, trailerUrl.trim()))
    .then(res => res.text())
    .then(res => {
      const [, encodings] = /"encodings":\[(.*?)\]/g.exec(res)
      const trailers = JSON.parse(`[${encodings}]`);
      const trailer = (trailers.find(el => el.definition === "720p") || trailers[0]).videoUrl;

      redis.set(`trailer::${imdbID}`, trailer, 'EX', 86400);

      return (trailer);
    })
}

/*
  *
  * Get Movie
  *   imdbID: 'tt0172156'
  *   Returned => {
  *      imdbID,
  *      title,
  *      summary,
  *      storyLine,
  *      runTime,
  *      imdbRating,
  *      poster,
  *      genres,
  *      datePublished,
  *      directors,
  *      writers,
  *      stars,
  *      trailer: await trailer
  *   }
*/

async function getNameFromCredit($, credit) {
  return Promise.all(
    $(credit)
      .find('a')
      .filter((i, link) => $(link).attr('href').match(/name\/(.*)\//))
      .map((i, link) => (
        getName($(link).attr('href').match(/name\/(.*)\//)[1])
      )).get()
  );
}

async function getMovie(imdbID, language = 'en-US') {
  let movie = await redisPromise.get(`${imdbID}::imdb::${language}`);

  if (movie)
    return Promise.resolve(JSON.parse(movie));

  return fetch(`${movieUrl}${imdbID}`, getFetchIMDBOptions({ language }))
    .then((response) => response.text())
    .then(async (body) => {
      const $ = load(body);
      const $title = $('.title_wrapper h1');
      const title = $title.first()
        .contents()
        .filter((i, el) => el.type === 'text')
        .text()
        .trim();
      const runTime = $('.title_wrapper .subtext time')
        .first()
        .contents()
        .filter((i, el) => el.type === 'text')
        .text()
        .trim();
      const imdbRating = $('span[itemProp="ratingValue"]').text();
      const poster = getBigImage($('div.poster a img').attr('src'));
      const coverImg = $('div.slate a img').attr('src');
      const summary = $('div.summary_text').text().trim();
      const datePublished = $('div.title_wrapper .subtext a').last().text().trim();
      const storyLine = $('#titleStoryLine div p span').text().trim();
      const genres = [];
      $('#titleStoryLine div.see-more a').each((i, element) => {
        if ($(element).attr('href').match(/^\/search\/title\?genres=/gm)) {
          genres.push($(element).text().trim());
        }
      });

      const creditSummary = $('.plot_summary .credit_summary_item');
      const urlTrailer = $('div.slate a').attr('href');
      const duration = $('time').first().text().trim();

      const [directors, writers, stars, trailer] = await Promise.almost([
        getNameFromCredit($, creditSummary.get(0)),
        getNameFromCredit($, creditSummary.get(1)),
        getNameFromCredit($, creditSummary.get(2)),
        getTrailer(urlTrailer, imdbID)
      ])

      const movie = {
        imdbID,
        title,
        summary,
        storyLine,
        runTime,
        imdbRating,
        poster,
        coverImg,
        genres,
        datePublished,
        directors,
        writers,
        stars,
        trailer,
        duration,
      };
      redis.set(`${imdbID}::imdb::${language}`, JSON.stringify(movie), 'EX', 86400);
      return movie;
    });
}

/*
  *
  * Get Filmography (We only keep movies with active torrents)
  *   nameID: 'nm0000138'
  *   lastImdbID: 'ttxxxxxx' || null
  *   lastPage: 1
  *   limit: MOVIE_PER_PAGE
  *   recursive: Boolean
  *   hasFirst: Boolean
  * Returned => MovieCollection { lastImdbID, lastPage, hasNext, movies, person }
*/

// @TODO implement redis logic to getFilmography
function getFilmography({ nameID, lastImdbID = null, lastPage = 1, limit = MOVIE_PER_PAGE, language = 'en-US' }, recursive = false, hasFirst = false) {
  const currentYear = (new Date()).getFullYear();
  return fetch(`${filmographyUrl}&role=${nameID}&sort=year,desc&page=${lastPage}`, getFetchIMDBOptions({ language }))
    .then((response) => response.text())
    .then(async (body) => {
      const $ = load(body);
      let nextCollection = { movies: [] };
      let $items = $('.article .lister .lister-list .lister-item')
        .filter((i, element) =>
          parseInt($(element).find('.lister-item-year').text().slice(1, 5)) <= currentYear);
      const totalPageItemsLength = $items.length;
      if (!totalPageItemsLength)
        return ({
          lastImdbID: null,
          lastPage: null,
          hasNext: false,
          movies: []
        });

      const lastImdbIDIndex = lastImdbID
        ? $(`.lister-item-image[data-tconst="${lastImdbID}"]`).parent().index() + 1
        : 0;

      $items = $items.slice(lastImdbIDIndex, lastImdbIDIndex + limit);
      const newLastImdbID = $items.last().find('.lister-item-image').data('tconst');

      let movies = (await Promise.almost(
        $items
          .map(async (i, element) => {
            const imdbID = $(element).find('.lister-item-header a').attr('href').match(/title\/(.*)\//)[1];
            const torrents = await torrentApi.getTorrents({ imdbID });

            if (!torrents)
              return Promise.reject('NO_TORRENT_FOUND::getFilmographyRecursive')

            return hasFirst ? {
              imdbID,
              poster: getBigImage($(element).find('.lister-item-image a img').attr('loadlate')),
              title: $(element).find('.lister-item-header a').text().trim(),
              datePublished: $(element).find('.lister-item-year').text().slice(1, 5),
              imdbRating: $(element).find('.ratings-imdb-rating').attr('data-value'),
            } : ((hasFirst = true) && await getMovie(imdbID, language));
          })
          .get()
      )).filter(p => p);
        
      const hasNext = $('.lister-page-next.next-page').length || lastImdbIDIndex + limit < totalPageItemsLength;

      return ({
        lastImdbID: newLastImdbID,
        lastPage: lastPage,
        hasNext,
        ...(movies.length < limit && hasNext
          ? (nextCollection = await getFilmography({
            nameID,
            lastImdbID: lastImdbIDIndex + limit < totalPageItemsLength ? newLastImdbID : null,
            lastPage: lastImdbIDIndex + limit < totalPageItemsLength ? lastPage : parseInt(lastPage) + 1,
            limit: limit - movies.length,
            language
          }, true, hasFirst))
          : {}),
        movies: [...movies, ...nextCollection.movies],
        person: recursive || await getName(nameID)
      })
    });
}

/*
  *
  * Get Genre
  *   genres: "action,comedy"
  *   sort: "(alpha/user_rating/boxoffice_gross_us/year),(asc/desc)"
  *   startId: "51" Pagination
  * Returned => { img, title, imdbID, paginationID }
*/

async function getGenre({
  genre,
  startId = 1,
  limit = MOVIE_PER_PAGE,
  $tmp = null,
  hasFirst = false,
  isRecursive = false,
  language = 'en-US'
}) {
  let movies;

  if ((movies = await redisPromise.get(`getGenre::${genre}::${startId}::${language}`)))
    return JSON.parse(movies);

  const $ = $tmp || load(await fetch(`${genreUrl}&genres=${genre}&start=${startId}`, getFetchIMDBOptions({ language }))
    .then((response) => response.text()));

  const minIndex = startId - 1;
  const maxIndex = minIndex + limit;
  const newStartId = maxIndex + 1;

  const $items = $('.lister-list .lister-item');
  const maxPageIndex = $items.length - 1;
  const hasNext = newStartId - limit < 100 && (maxIndex < maxPageIndex || $('.next-page').length);

  movies = (await Promise.almost(
    $items
      .slice(minIndex, maxIndex)
      .map(async (i, element) => {
        const imdbID = $(element).find('.lister-item-content .lister-item-header a').attr('href').match(/title\/(.*)\//)[1];
        const torrents = await torrentApi.getTorrents({ imdbID });

        if (!torrents)
          return Promise.reject('NO_TORRENT_FOUND::getGenre');

        return ({
          imdbID,
          title: $(element).find('.lister-item-content .lister-item-header a').text().trim(),
          poster: getBigImage($(element).find('.lister-item-image a img').attr('loadlate')),
          datePublished: $(element).find('.lister-item-year').text().slice(1, 5),
          imdbRating: $(element).find('.col-imdb-rating strong').text().trim(),
        })
      })
      .get()
  )).filter(p => p)

  const isCollectionNeedMoreMovies = movies.length < limit;

  let nextCollection = { movies: [] };
  let nextCollectionPromise = Promise.resolve(nextCollection);
  let firstMoviePromise = Promise.resolve(movies[0]);

  if (!hasFirst && movies[0]) {
    firstMoviePromise = getMovie(movies[0].imdbID, language);
    hasFirst = true;
  }

  if (hasNext && (!isRecursive || isCollectionNeedMoreMovies))
    nextCollectionPromise = getGenre({
      genre,
      startId: newStartId,
      limit: isCollectionNeedMoreMovies ? limit - movies.length : MOVIE_PER_PAGE,
      $tmp: maxPageIndex - maxIndex >= limit ? $ : null,
      hasFirst: isCollectionNeedMoreMovies ? hasFirst : false,
      isRecursive: true,
      language,
    });

  const collection = ({
    hasNext,
    startId: newStartId,
    ...(isCollectionNeedMoreMovies ? (nextCollection = await nextCollectionPromise) : {}),
    movies: [...movies.slice(1), ...nextCollection.movies],
    genre,
  });

  if (movies[0])
    collection.movies.unshift(await firstMoviePromise);

  redis.set(`getGenre::${genre}::${startId}::${language}`, JSON.stringify(collection), 'EX', 86400);

    return collection;
}

async function getTopRated({ lastImdbID = null, limit = MOVIE_PER_PAGE, language = 'en-US' }, $tmp = null, hasFirst = false, recursive = false) {
  let topRatedMovies;

  if ((topRatedMovies = await redisPromise.get(`topRatedMovies::${lastImdbID}::${language}`)))
    return JSON.parse(topRatedMovies);

  const $ = $tmp || load(await fetch(IMDB_TOP_RATED_URL, getFetchIMDBOptions({ language })).then(res => res.text()))

  const minIndex = lastImdbID
    ? $(`td.ratingColumn .seen-widget-${lastImdbID}`).parent().parent().index() + 1
    : 0;
  const maxIndex = minIndex + limit;
  const hasNext = maxIndex < 249;

  const $items = $('.lister-list tr').slice(minIndex, maxIndex);
  const newLastImdbID = $items.last().find('td.ratingColumn .seen-widget').attr('data-titleid');

  const movies = (await Promise.almost(
    $items
      .map(async (i, element) => {
        const imdbID = $(element).find('td.ratingColumn .seen-widget').attr('data-titleid');
        const torrents = await torrentApi.getTorrents({ imdbID });

        if (!torrents)
          return Promise.reject('NO_TORRENT_FOUND::getTopRated');

        return {
          ...(hasFirst
            ? {
              imdbID,
              poster: getBigImage($(element).find('.posterColumn img').attr('src')),
              title: $(element).find('.titleColumn a').text().trim(),
              imdbRating: $(element).find('.ratingColumn strong').text().trim(),
              datePublished: $(element).find('.titleColumn .secondaryInfo').text().slice(1, 5)
            }
            : (hasFirst = true) && await getMovie(imdbID, language)),
          torrents: Object.values(torrents)
        }
      })
      .get()
  )).filter(p => p)
  
  let nextCollection = { movies: [] };
  let nextCollectionPromise = Promise.resolve(nextCollection);

  if (hasNext && (!recursive || movies.length < limit)) {
    nextCollectionPromise =  getTopRated({
        lastImdbID: newLastImdbID,
        limit: movies.length < limit ? limit - movies.length : MOVIE_PER_PAGE
    }, $, movies.length < limit ? hasFirst : false, true);
  }

  const collection = ({
    hasNext,
    lastImdbID: newLastImdbID,
    ...(movies.length < limit ? (nextCollection = await nextCollectionPromise) : {}),
    movies: [...movies, ...nextCollection.movies],
  });

  redis.set(`topRatedMovies::${lastImdbID}::${language}`, JSON.stringify(collection), 'EX', 86400)

  return collection;
}

async function getRecentlyAdded({ page = 1, limit = MOVIE_PER_PAGE, language = 'en-US' }) {
  let recentlyAddedMovies;

  if ((recentlyAddedMovies = await redisPromise.get(`recentlyAddedMovies::${page}::${limit}::${language}`)))
    return JSON.parse(recentlyAddedMovies);

  // const { data: { movies } } = await yts.getMovies({ sortBy: 'latest', limit, page, quality: ['720p','1080p'] });
  const { data: { movies } } = await fetch(`${YTS_BASE_URL}/api/v2/list_movies.json?sort_by=latest&limit=${limit}&page=${page}&quality=720p,1080p`)
    .then(res => res.json())

  recentlyAddedMovies = (await Promise.almost(
    movies.map(async m => {
      const torrents = m.torrents.reduce((torrents, torrent) => 
        torrent.seeds < 20 ? torrents : ({
          ...torrents,
          [torrent.quality]: {
            ...torrent,
            magnet: torrentApi.YTSTorrentToMagnet(torrent, m.imdb_code)
          }
        }), {});

      if (!Object.keys(torrents).length)
        return Promise.reject(`NO_TORRENT_FOUND::getRecentlyAdded::${m.imdb_code}`)

      redis.set(`${m.imdb_code}::torrents`, JSON.stringify(torrents), 'EX', 86400);

      return getMovie(m.imdb_code, language)
    })
  )).filter(p => p);

  if (recentlyAddedMovies.length)
    redis.set(`recentlyAddedMovies::${page}::${limit}::${language}`, JSON.stringify(recentlyAddedMovies), 'EX', 86400);

  return recentlyAddedMovies;
}

export default {
  searchMovies,
  getMovie,
  getName,
  getFilmography,
  getGenre,
  getTopRated,
  getRecentlyAdded,
};