const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const route = require('./routes/userRoute');

// // Middleware
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

app.use(morgan('dev'));

app.use(express.json());
app.use(cookieParser());

route(app);


module.exports = app;
