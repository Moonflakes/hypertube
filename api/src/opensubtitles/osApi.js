import OS from 'opensubtitles-api';
import redis from '../redis';
import http from 'http';
import srt2vtt from 'srt-to-vtt';

const OpenSubtitles = new OS({
  useragent: 'hypertybe',
  username: 'dodobardo',
  password: 'massimo1',
  ssl: true
});

function getSubtitles({ imdbID }) {
  return new Promise((resolve, reject) => {
    redis.get(`${imdbID}::subtitles`, (err, reply) => {
      if (err) {
        return reject(err);
      }
      if (reply) {
        return resolve(JSON.parse(reply));
      } else {
        OpenSubtitles
          .search({
            sublanguageid: 'ita,fre,eng',
            extensions: ['srt', 'vtt'],
            imdbid: imdbID,
          })
          .then((subs) => {
            var subtitles = [];
            if (subs.en) {
              subtitles.push({
                language: subs.en.langcode.toUpperCase(),
                url: subs.en.vtt.replace('https','http')
              })
            }

            if (subs.fr) {
              subtitles.push({
                language: subs.fr.langcode.toUpperCase(),
                url: subs.fr.vtt.replace('https','http')
              })
            }

            if (subs.it) {
              subtitles.push({
                language: subs.it.langcode.toUpperCase(),
                url: subs.it.vtt.replace('https','http')
              })
            }
            if (subtitles.length) {
              redis.set(`${imdbID}::subtitles`, JSON.stringify(subtitles), 'EX', 86400);
            }
            return resolve(subtitles)
          })
          .catch((err) => reject(err));
      }
    })
  })
}

async function middleware(req, res) {
  const { imdbID, language } = req.params;

  if (!imdbID || !imdbID.length || !language || !language.length)
    return res.sendStatus(400);

  try {
    const subtitle = (await getSubtitles({ imdbID }))
      .find(sub => sub.language === language);
    
    if (!subtitle)
      return res.sendStatus(404);
    
      http.get(subtitle.url.replace('https', 'http'), file => {
        res.writeHead(200, { 'Content-Type': 'text/vtt' })
        
        subtitle.url.includes('srt')
          ? file.pipe(srt2vtt()).pipe(res)
          : file.pipe(res)
      });
  } catch (e) {
    return res.sendStatus(500);
  }
}

module.exports = { getSubtitles, middleware };