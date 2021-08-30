const config = require('../../config.js');
const { Client } = require('pg');

module.exports = new Client(config);