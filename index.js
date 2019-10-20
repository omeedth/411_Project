const keys = require('./src/keys.js')

const rp = require('request-promise');
const express = require('express')
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const compiler = webpack(webpackConfig);

const bodyParser = require('body-parser');

var Amadeus = require('amadeus');

// -------------- Express Server -------------- //

const app = express()
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var jsonParser = bodyParser.json();
const port = process.env.PORT || 3000

const amadeus = new Amadeus({
    clientId: keys.amadeus_key,
    clientSecret: keys.amadeus_secret
  });

// TEST

// var originTest = 'NYC'
// var destinationTest = 'MAD'
// var departureDateTest = '2020-04-01'

// amadeus.shopping.flightOffers.get({
//     origin : originTest,
//     destination : destinationTest,
//     departureDate : departureDateTest
//   }).then(response => {
//       console.log(response)
//   }).catch(function (err) {
//       // API call failed...
//       console.error(err)
//       console.error(`Unable to get request!`)
//   })

// -------------------------- //

if (process.env.NODE_ENV === 'development') {
    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath
    }));
    app.use(require('webpack-hot-middleware')(compiler));
}
app.use(express.static('./build'));

/* When you fetch you MUST have `headers: { 'Content-Type': 'application/json' }` in order for jsonParser to do it's job */

/* Make my request a POST request to send some pertinent data over */
app.post('/api/post', jsonParser, (req, res) => {

    // method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    // headers: {
    //   'Content-Type': 'application/json'
    //   // 'Content-Type': 'application/x-www-form-urlencoded',
    // },
    // redirect: 'follow', // manual, *follow, error
    // referrer: 'no-referrer', // no-referrer, *client
    // body: JSON.stringify(data) // body data type must match "Content-Type" header

    let options = req.body;

    /* Steps */
    // 1. Request Bearer Token - (Amadeus)
    // 2. Put the Bearer Token in Auth Header of API call

    console.log(`Options: ${JSON.stringify(options)}`)

    // rp(options)
    //     .then(function (data) {
    //         res.status(200).send(data)
    //     })
    //     .catch(function (err) {
    //         // API call failed...
    //         console.error(err)
    //         console.error(`Unable to reach the website: ${options.uri}`)
    //         res.status(500).send(err)
    //     });

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

    // var originTest = 'NYC'
    // var destinationTest = 'MAD'
    // var departureDateTest = '2020-04-01'

    // amadeus.shopping.flightOffers.get({
    //     origin : originTest,
    //     destination : destinationTest,
    //     departureDate : departureDateTest
    // }).then(response => {
    //     res.status(200).send(response.body)
    // }).catch(function (err) {
    //     // API call failed...
    //     console.error(err)
    //     console.error(`Unable to get request!`)
    //     res.status(500).send({})
    // })

})

/* Make my request a POST request to send some pertinent data over */
app.get('/amadeus/lowfare', jsonParser, (req, res) => {

    let options = req.body;

    console.log(options)

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});