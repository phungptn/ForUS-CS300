const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');

const setupRoute = require('./controllers');

// // Middleware
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

app.use(morgan('dev'));

app.use(express.json());
app.use(cookieParser());
app.use(session({
	secret: process.env.SECRET,
	cookie: {
		maxAge: 30 * 24 * 60 * 60 * 1000 // max cookie age 1 month
	},
	saveUninitialized: false,
	resave: false
}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
 

// Data sanitization against XSS
app.use(xss());

app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(compression());

// Setup route for the app
setupRoute(app);


module.exports = app;
