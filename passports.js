const keys = require('./configs/keys');
const passport = require('./passport');

passport.use(new FacebookStrategy({
    clientID: keys.facebook.app_id,
    clientSecret: keys.facebook.app_secret,
    callbackURL: keys.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('AccessToken:',accessToken);
    console.log('refreshToken:',refreshToken);
    console.log('profile:',profile);
  }
));