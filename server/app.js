const express = require('express');
const controllers = require('./controllers');

const app = express();
module.exports.app = app;

app.use(express.json());
app.get('/', (req, res) => {
  res.status(200).send('Welcome to Ratings and Reviews!');
})
app.get('/reviews', controllers.reviews.get);
app.get('/reviews/meta', controllers.reviews.getMeta);
app.post('/reviews', controllers.reviews.post);
app.put('/reviews/:review_id/helpful', controllers.reviews.putHelpful);
app.put('/reviews/:review_id/report', controllers.reviews.putReport);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log('Listening on port', PORT));