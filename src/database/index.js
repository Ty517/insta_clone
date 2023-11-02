/* eslint-disable no-console */
const mongoose = require('mongoose');

const DB = process.env.DATABASE;
console.log('DB:', DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'))
  .catch(console.log);
