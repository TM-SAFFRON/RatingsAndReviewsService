const express = require('express');
const controllers = require('./controllers');

const app = express();
module.exports.app = app;

// app.set('port', 5000);

app.use(express.json());

app.get('/reviews', controllers.reviews.get);
app.get('/reviews/meta', controllers.reviews.getMeta);
app.post('/reviews', controllers.reviews.post);
app.put('/reviews/:review_id/helpful', controllers.reviews.putHelpful);
app.put('/reviews/:review_id/report', controllers.reviews.putReport);

// how to serve client on another repo?
// app.use(express.static(__dirname + '/../client'));

// app.listen(app.get('port'));
// console.log('Listening on', app.get('port'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log('Listening on port', PORT));