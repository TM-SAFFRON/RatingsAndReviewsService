const models = require("../models");

module.exports = {
  get: (req, res) => {
    // console.log('params', req.params);
    // console.log('query', req.query);

    models.reviews.getAll(req.query, (err, data) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(data);
      }
    });
  },
};
