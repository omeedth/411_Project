const keys = require('./configs/keys')

const cors = require('cors');
const express = require('express');

const bodyParser = require('body-parser');
const rp = require('request-promise');

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const compiler = webpack(webpackConfig);

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require("firebase/app");

// Add the Firebase products that you want to use
// require("firebase/auth");
require("firebase/firestore");

// const admin = require('firebase-admin');
// const functions = require('firebase-functions');

var Amadeus = require('amadeus');

/* Testing Calls To REST API */


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

/* Firebase Setup */

const firebaseConfig = {
    apiKey: keys.firebaseConfig.apiKey,
    authDomain: keys.firebaseConfig.authDomain,
    databaseURL: keys.firebaseConfig.databaseURL,
    projectId: keys.firebaseConfig.projectId,
    storageBucket: keys.firebaseConfig.storageBucket,
    messagingSenderId: keys.firebaseConfig.messagingSenderId,
    appId: keys.firebaseConfig.appId,
    measurementId: keys.firebaseConfig.measurementId
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// admin.initializeApp(functions.config().firebase);
// admin.initializeApp(firebaseConfig);

let db = firebase.firestore();

// let docRef = db.collection('users').doc('alovelace');

// let setAda = docRef.set({
//   first: 'Ada',
//   last: 'Lovelace',
//   born: 1815
// });

// let aTuringRef = db.collection('users').doc('aturing');

// let setAlan = aTuringRef.set({
//   'first': 'Alan',
//   'middle': 'Mathison',
//   'last': 'Turing',
//   'born': 1912
// });

// db.collection('users').get()
//   .then((snapshot) => {
//     snapshot.forEach((doc) => {
//       console.log(doc.id, '=>', doc.data());
//     });
//   })
//   .catch((err) => {
//     console.log('Error getting documents', err);
//   });

/* ----------------------------------------------------- */

/* Amadeus Setup */

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

app.get('/test',(req, res) => {
    res.status(200).send({'Test': 'test data'})
})

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

app.post('/yelp/businesses/search',jsonParser,(req, res) => {    

    let body = req.body;
    let options = {
        method: 'GET',
        uri: body.uri,
        qs: {
            // access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
            location: body.location
        },
        headers: {            
            'User-Agent': 'Request-Promise',
            'cache-control': 'no-cache',
            'Authorization': ('Bearer ' + keys.yelp.APIKey)
        },
        json: true // Automatically parses the JSON string in the response
    }    
    console.log('Options:',options)
    // console.log('\n\n');

    rp(options).then((response) => {
        // console.log('Succeeded')
        console.log('Data:',response)
        res.status(200).send(response)
    }).catch((err) => {
        // console.log('Failed')
        console.log('ERROR:',err)
        res.status(500).send(err)
    });

})

app.post('/firebase/add',jsonParser,(req,res) => {

    let body = req.body;
    let response = body.response
    // console.log('Body:',body)
    console.log('Response:',response)
    console.log('User ID:',response.userID)

    console.log('Adding to firebase...')

    let docRef = db.collection('users').doc(response.userID);
    let [first,last] = response.name.split(' ', 2);
    console.log('First:',first,', Last:',last)

    let setAda = docRef.set({
        first: first,
        last: last,
        email: response.email
    });
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