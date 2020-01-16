import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import path from 'path';
import jwt from 'jsonwebtoken';

import { typeDefs, resolvers } from './schema';
import neo4j from './neo4j';
import {passport42, passportGoogle} from './passport';
import authMiddleware from './authMiddleware'
import osAPI from './opensubtitles/osApi'
import trailerMiddleware from './trailer'
import moviesCleaner from './moviesCleaner'
import cron from 'node-cron';

import stream from './stream';

cron.schedule('0 0 * * 0-7', moviesCleaner);

Promise.almost = r => Promise.all(r.map(p => p.catch ? p.catch(() => null) : p));

const app = express();

app.use(cors())
app.use('/static', express.static(path.join(__dirname, '../static')));
app.use(authMiddleware);

app.get('/stream/:imdbID/:resolution', stream.middleware.bind(stream));
app.get('/subtitles/:imdbID/:language', osAPI.middleware);
app.get('/trailers/:imdbID', trailerMiddleware);

app.get('/auth/42', passport42.authenticate('42', { session:false }));
app.get('/auth/42/callback', (req, res, next) => {
  passport42.authenticate('42', {
    session: false
  }, function(err, user) {
    if (err)
      return res.redirect(`${process.env.FRONT_HOST}/signin?fail`);
    
    var token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '2h' }); //, { expiresIn: '1h' }

    return res.redirect(`${process.env.FRONT_HOST}/oauth?token=${token}`);
  })(req, res, next)
});

app.get('/auth/google', passportGoogle.authenticate('google', { scope: ['profile','email']} ));
app.get('/auth/google/callback', (req, res, next) => {
  passportGoogle.authenticate('google', {
    session: false
  }, function(err, user) {
    if (err)
      return res.redirect(`${process.env.FRONT_HOST}/signin?fail`);
    
    var token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '2h' }); //, { expiresIn: '1h' }

    return res.redirect(`${process.env.FRONT_HOST}/oauth?token=${token}`);
  })(req, res, next)
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, neo4j })
});

server.applyMiddleware({ app });

export default app;