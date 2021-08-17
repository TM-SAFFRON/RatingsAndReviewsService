const client = require('../db/index.js');

client.connect()
  .then(() => console.log('Database connected...'))
  .catch(() => console.log('Cannot connect to database.'));

module.exports = {
  getAll: async (queryParameters, callback) => {
    const { product_id, count, sort, page } = queryParameters;

    let sortType = '';
    if (sort === 'newest') {
      sortType = 'to_timestamp(date) DESC';
    } else if (sort === 'helpful') {
      sortType = 'helpfulness DESC';
    } else if (sort === 'revelant') {
      sortType = 'helpfulness DESC';
    }

    // console.log(`SELECT * FROM reviews WHERE product_id = ${parseInt(product_id)} ORDER BY ${sortType} LIMIT ${parseInt(count)};`);

    try {
      const data = await client.query(`SELECT * FROM reviews WHERE product_id = ${parseInt(product_id)} ORDER BY ${sortType} LIMIT ${parseInt(count)};`);
      callback(null, data.rows);
    } catch (err) {
      callback(err);
    }

    // client.query(`SELECT * FROM reviews WHERE product_id = ${parseInt(product_id)} ORDER BY ${sortType} LIMIT ${parseInt(count)};`)
    //   .then(data => callback(null, data.rows))
    //   .catch(err => callback(err));

  }
}
