const mongoose = require('mongoose');
console.log(process.env.NODE_ENV);
const express = require("express");
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./server/app.js');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
});


const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


