<<<<<<< HEAD:backend/index.js
const keys = require('../src/keys.js')
=======
const keys = require('./configs/keys')
>>>>>>> f486e9243573f5d517d1abec84ebf3cd3ca3bf45:index.js

const cors = require('cors');
const express = require('express');

const bodyParser = require('body-parser');
const rp = require('request-promise');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const compiler = webpack(webpackConfig);

var Amadeus = require('amadeus');

// -------------- Express Server -------------- //

/* Order */
// cookieParser
// session
// passport.initialize
// passport.session
// app.router

const app = express()
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(passport.initialize()); 
app.use(passport.session());
var jsonParser = bodyParser.json();
const port = process.env.PORT || 3000

const amadeus = new Amadeus({
    clientId: keys.amadeus_key,
    clientSecret: keys.amadeus_secret
});

console.log(process.env.NODE_ENV); // Debug Line

if (process.env.NODE_ENV === 'development') {
    console.log('Using Hod Middleware!');  
    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath
    }));  
    app.use(require('webpack-hot-middleware')(compiler));
}
app.use('/',express.static('./build'));

// -------------- Custom app.use() -------------- //

// app.use(cors());

// app.use(cors({
//     exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
// }));

// var allowedOrigins = ['http://localhost:3000',
//                       'https://www.facebook.com'];

// app.use(cors({
//   origin: function(origin, callback){
//     // allow requests with no origin 
//     // (like mobile apps or curl requests)
//     console.log('Origin:',origin)
//     console.log('Callback:',callback)
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){
//       var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }));

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// });

// -------------- Passport Serialization -------------- //

passport.serializeUser(function(user, done) {
    console.log('Serializing User!');
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log('Deserializing User!');
    done(null, user);
});

// -------------- API Routes -------------- //

// NOTE: //
/* When you fetch you MUST have `headers: { 'Content-Type': 'application/json' }` in order for jsonParser to do it's job */

app.post('/amadeus/lowfare',jsonParser,(req, res) => {

    let options = req.body;

    amadeus.shopping.flightOffers.get({
        origin : options.origin,
        destination : options.destination,
        departureDate : options.departureDate
      }).then(response => {
          res.status(200).send(response)
      }).catch(function (err) {
          // API call failed...
          console.error(err)
          console.error(`Unable to reach the website: ${options.uri}`)
          res.status(500).send(err)
      })

})

// -------------- OAuth Routes -------------- //

/* Configuration */

passport.use(new FacebookStrategy({
    clientID: keys.facebook.app_id,
    clientSecret: keys.facebook.app_secret,
    callbackURL: keys.facebook.callback_url,
    redirect_uri: keys.facebook.callback_url,
    enableProof: true,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log('accessToken:',accessToken);
    // console.log('refreshToken:',refreshToken);
    // console.log('profile:',profile);
    // console.log('done',done)
    // console.log('Passport callback function reached!');
    done(null, profile);
  }
));

/* Facebook Auth */

app.get('/auth/facebook', passport.authenticate('facebook'), (req, res) => {
    console.log('Authenticating...');
});

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    console.log('Successfully Logged In! Redirecting to main route...')    
    res.redirect('/');
});

// -------------- Other Routes -------------- //

// app.get('/login:provider', cors(), (req, res) => {
//     console.log('Request:',req.params.provider) // includes the ':'
//     res.redirect('/auth/' + req.params.provider.substring(1))
// })

app.get('/login', (req, res) => {
    res.render('Login!');
});

app.get('/logout', (req, res) => {
    res.render('Logout!');
})

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// -------------- Listening -------------- //

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});