require('dotenv').config();
require('./database');

const port = process.env.PORT || 3000;
const WEB_DOMAIN = process.env.WEB_DOMAIN || "http://localhost:4000";

var express = require('express');
var app = express();
var router = express.Router();

// Lets us easily parse POST requests
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Sets up sessions
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var uuid = require('uuid/v4');
app.use(session({
  genid: (req) => {
    return uuid(); // This is the session ID
  },
  secret: 'cookie walnut maple orange ostrich headphones bottle game',
  store: new MongoStore({ url: `mongodb+srv://${process.env.DATABASE}:${process.env.DATABASE_ADMIN_PASSWORD}@stanplan-be1xm.mongodb.net/sessions?retryWrites=true&w=majority` }),
  resave: false,
  saveUninitialized: true
}));

// Sets up CORS support
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", WEB_DOMAIN);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use('/', require('./routes'));

app.listen(port, function () {
  console.log("Server is running on port " + port);
});
