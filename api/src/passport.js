import passport from "passport";
import neo4j from './neo4j';
const FortyTwoStrategy = require('passport-42').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

export const passport42 = passport.use(new FortyTwoStrategy({
    clientID: process.env['42_UID'],
    clientSecret: process.env['42_SECRET'],
    callbackURL: process.env['42_CALLBACK_URL'],
    profileFields: {
        'fortyTwoId': function (obj) { return String(obj.id); },
        'username': 'login',
        'lastname': 'last_name',
        'firstname': 'first_name',
        'email': 'email'
      }
  },
  async function(accessToken, refreshToken, profile, cb) {
    const { fortyTwoId, username, firstname, lastname, email } = profile;
    const avatar = '/male/25';

    try {
      const user = await neo4j.mergeOn('User', { fortyTwoId }, { fortyTwoId, username, lastname, firstname, email, avatar });

      cb(null, { id: user.get('id') });
    } catch(err) {
      cb(err); 
    }
  }
));

export const passportGoogle = passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_ID'],
  clientSecret: process.env['GOOGLE_SECRET'],
  callbackURL: process.env['GOOGLE_CALLBACK_URL']
},
async function(token, tokenSecret, profile, cb) {
  const googleId = profile.id;
  const lastname = profile.name.familyName;
  const firstname = profile.name.givenName;
  const email = profile.emails[0].value;
  const username = email;
  const avatar = '/male/25';

  try {
    const user = await neo4j.mergeOn('User', { googleId }, { googleId, username, lastname, firstname, email, avatar });

    cb(null, { id: user.get('id') });
  } catch(err) {
    cb(err); 
  }
}
));

export default {
  passport42,
  passportGoogle
}