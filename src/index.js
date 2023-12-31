/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const routes = require('./routes');

require('./database');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use('/', routes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
