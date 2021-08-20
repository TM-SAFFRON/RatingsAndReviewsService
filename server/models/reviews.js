const client = require("../db/index.js");

client
  .connect()
  .then(() => console.log("Database connected..."))
  .catch(() => console.log("Cannot connect to database."));

module.exports = {
  getAll: async (queryParameters, callback) => {
    const { product_id, count = 5, sort = "relevant", page = 1 } = queryParameters;

    let sortType = "";
    if (sort === "newest") {
      sortType = "TO_TIMESTAMP(date / 1000) DESC";
    } else if (sort === "helpful") {
      sortType = "helpfulness DESC";
    } else if (sort === "relevant" || sort === "") {
      sortType = "TO_TIMESTAMP(date / 1000) DESC, helpfulness DESC";
    }

    const query =
    `SELECT COALESCE (json_agg(row_to_json(reviews)), '[]'::json) AS results
      FROM (
        SELECT
          id AS review_id,
          rating,
          summary,
          recommend,
          NULLIF(response, 'null') as response,
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
        OFFSET ${parseInt(count)*(page-1)}
        LIMIT ${parseInt(count)}
      ) reviews;`;

    try {
      const { rows } = await client.query(query);
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
  },

  getAllMeta: async ({ product_id }, callback) => {
    product_id = parseInt(product_id);

    const ratingsQuery = `select rating, count(rating) from reviews r where product_id = ${product_id} group by rating;`;
    const recommendedQuery = `select recommend, count(recommend) from reviews r where product_id = ${product_id} group by recommend;`;
    const characteristicsQuery = ` 	SELECT c.name, c.id, AVG(cr.value)::NUMERIC(10,2) as value
    FROM characteristics c
    JOIN characteristic_reviews cr
    ON c.id = cr.characteristic_id
    WHERE product_id = ${product_id}
   GROUP BY name, c.id;`;

   try {
     // fetch and shape ratings
    const ratingsData = await client.query(ratingsQuery);
    const ratings = ratingsData.rows;
    let restructuredRatings = {};
    for (var i = 0; i < ratings.length; i++) {
      restructuredRatings[ratings[i].rating] = ratings[i].count;
    }
    // fetch and shape recommended
    const recommendedData = await client.query(recommendedQuery);
    const recommends = recommendedData.rows;
    let restructuredRecommends = {};
    for (var i = 0; i < recommends.length; i++) {
      restructuredRecommends[recommends[i].recommend] = recommends[i].count;
    }
    // fetch and shape characteristics
    const characteristicsData = await client.query(characteristicsQuery);
    const characteristics = characteristicsData.rows;
    let restructuredCharacteristics = {};
    for (var i = 0; i < characteristics.length; i++) {
      restructuredCharacteristics[characteristics[i].name] = {
        id: characteristics[i].id,
        value: characteristics[i].value,
      }
    }
    // send back meta data
    callback(null, {
      product_id: product_id,
      ratings: restructuredRatings,
      recommended: restructuredRecommends,
      characteristics: restructuredCharacteristics,
    });
  } catch (err) {
    callback(err);
  }
  },

  postReview: async (bodyParameters, callback) => {
    const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = bodyParameters;

    const date = Date.now();
    const response = '';

    const insertReviewsQuery = `INSERT INTO reviews (
      product_id,
      rating,
      date,
      summary,
      body,
      recommend,
      reviewer_name,
      reviewer_email,
      response)
      VALUES (
      ${parseInt(product_id)},
      ${rating},
      ${date},
      '${summary}',
      '${body}',
      ${recommend},
      '${name}',
      '${email}',
      '${response}'
      ) returning id;`;

      try {
        // insert into review table and get the new review_id
        const { rows } = await client.query(insertReviewsQuery);
        const { id: review_id } = rows[0];

        // insert each characteristic
        const insertCharacteristicQueries = [];
        for (var characteristic_id in characteristics) {
          insertCharacteristicQueries.push(
            client.query(`INSERT INTO characteristic_reviews(characteristic_id, review_id, value) VALUES (${parseInt(characteristic_id)}, ${review_id}, ${characteristics[characteristic_id]});`)
          );
        }
        Promise.all(insertCharacteristicQueries)
          .then(() => console.log('successfully inserted characteristics'))
          .catch(() => console.error('insertion error at characteristics table'));

        // if there are photos, insert photos
        const insertPhotoQueries = [];
        if (photos.length > 0) {
          for (var photo of photos) {
            insertPhotoQueries.push(
              client.query(`INSERT INTO reviews_photos (review_id, url) VALUES (${review_id}, '${photo}');`)
            );
          }
          Promise.all(insertPhotoQueries)
          .then(() => console.log('successfully inserted photos'))
          .catch(() => console.error('insertion error at photos table'));
        }
        callback(null, review_id);
      } catch(err) {
        callback(err);
      }
  },

  markHelpful: async ({ review_id }, callback) => {
    const helpfulQuery = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${review_id};`;
    try {
      await client.query(helpfulQuery);
      callback(null);
    } catch (err) {
      callback(err);
    }
  },

  report: async ({ review_id }, callback) => {
    const reportQuery = `UPDATE reviews SET reported = true WHERE id = ${review_id};`;
    try {
      await client.query(reportQuery);
      callback(null);
    } catch(err) {
      callback(err);
    }
  }
};
