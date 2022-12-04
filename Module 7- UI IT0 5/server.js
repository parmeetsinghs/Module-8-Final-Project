//This server file runs the localhost on webpage
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');


const app = require('./app');
const MONGO_DATA_BASE = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);


mongoose.connect(MONGO_DATA_BASE,

  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(con => {
    console.log(`The Database connection was successful with ${process.env.DATABASE}`);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

