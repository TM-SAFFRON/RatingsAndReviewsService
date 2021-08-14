\copy reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) from '/Users/shirleyzhang/Downloads/reviews.csv' delimiter ',' csv header;

\copy reviews_photos(id, review_id, url) from '/Users/shirleyzhang/Downloads/reviews_photos.csv' delimiter ',' csv header;

\copy characteristics(id, product_id, name) from '/Users/shirleyzhang/Downloads/characteristics.csv' delimiter ',' csv header;

\copy characteristic_reviews(id, characteristic_id, review_id, value) from '/Users/shirleyzhang/Downloads/characteristic_reviews.csv' delimiter ',' csv header;