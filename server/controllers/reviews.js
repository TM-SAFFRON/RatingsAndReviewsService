const models = require("../models");

module.exports = {
  get: (req, res) => {
    // res = res.bind(this);
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
  },

  putHelpful: (req, res) => {
    models.reviews.markHelpful(req.params, (err, data) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(204).send();
      }
    })
  },

  putReport: (req, res) => {
    models.reviews.report(req.params, (err, data) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(204).send();
      }
    })
  }
};