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

  getMeta: (req, res) => {
    models.reviews.getAllMeta(req.query, (err, data) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(data);
      }
    })
  },

  post: (req, res) => {
    models.reviews.postReview(req.body, (err, data) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(201).send();
      }
    })
  }
};