const config = require('../../config.js');
const { Pool } = require('pg');

module.exports = new Pool(config);