// const postgres = require('postgresql');
const config = require('../../config.js');
const { Client } = require('pg');

module.exports = new Client(config);

// module.exports.client;

// const psqlConnection = postgres.createConnection({
//   host: 'localhost',
//   user: 'postgres',
//   password,
//   database: 'ratingsandreviews'
// })

// psqlConnection.connect((err) => {
//   if (err) {
//     throw err
//   } else {
//     console.log('connected to database');
//   }
// });