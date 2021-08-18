const client = require("../db/index.js");

client
  .connect()
  .then(() => console.log("Database connected..."))
  .catch(() => console.log("Cannot connect to database."));

module.exports = {
  getAll: async (queryParameters, callback) => {
    const { product_id, count = 5, sort = "", page = 1 } = queryParameters;

    let sortType = "";
    if (sort === "newest" || sort === "") {
      sortType = "to_timestamp(date) DESC";
    } else if (sort === "helpful") {
      sortType = "helpfulness DESC";
    } else if (sort === "revelant") {
      sortType = "helpfulness DESC";
    }

    const query =
    `SELECT COALESCE (json_agg(row_to_json(reviews)), '[]'::json) AS results
      FROM (
        SELECT
          id AS review_id,
          rating,
          summary,
          recommend,
          NULLIF(response, 'null') AS response,
          body,
          TO_TIMESTAMP(date / 1000) AS date,
          reviewer_name,
          helpfulness,
          (SELECT COALESCE (json_agg(row_to_json(photos)), '[]'::json)
          FROM (
            SELECT
              id,
              url
              FROM reviews_photos
              WHERE reviews.id = reviews_photos.review_id
          ) photos
        ) AS photos
        FROM reviews
        WHERE product_id = ${parseInt(product_id)}
        ORDER BY ${sortType}
        LIMIT ${parseInt(count)}
      ) reviews;`;

    try {
      const { rows } = await client.query(query
        // `SELECT * FROM reviews WHERE product_id = ${parseInt(
        //   product_id
        // )} ORDER BY ${sortType} LIMIT ${parseInt(count)};`
      );
      const { results } = rows[0];
      callback(null, {
        product: product_id,
        page: page - 1,
        count: +count,
        results,
      });
    } catch (err) {
      callback(err);
    }

    // client.query(`SELECT * FROM reviews WHERE product_id = ${parseInt(product_id)} ORDER BY ${sortType} LIMIT ${parseInt(count)};`)
    //   .then(data => callback(null, data.rows))
    //   .catch(err => callback(err));
  },

  getAllMeta: async ({ product_id }, callback) => {
    product_id = parseInt(product_id);

    const ratingsQuery = `select rating, count(rating) from reviews r where product_id = 25171 group by rating;`;
    const recommendedQuery = `select recommend, count(recommend) from reviews r where product_id = 41359 group by recommend;`;
  },
};
