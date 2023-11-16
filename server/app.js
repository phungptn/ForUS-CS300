const express = require('express');
const app = express();
// const tourRouter = require('./routes/tourRoutes');
// const userRouter = require('./routes/userRoutes');
const morgan = require('morgan');


// // Middleware
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

app.use(morgan('dev'));

app.use(express.json());
// app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// app.get('/', (req, res) => {
//   res.status(400).json({ message: 'Hello from Express!', app: 'Natrous' });
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });.

// Routes
// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);

module.exports = app;
