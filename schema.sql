DROP DATABASE IF EXISTS ratingsandreviews;

CREATE DATABASE ratingsandreviews;

\c ratingsandreviews;
-- CREATE SCHEMA IF NOT EXISTS rrschema;

CREATE TABLE IF NOT EXISTS reviews (
  id serial PRIMARY KEY,
  product_id INT NOT NULL,
  rating smallint,
  date bigint,
  summary text,
  body text,
  recommend boolean,
  reported boolean default FALSE,
  reviewer_name varchar(50),
  reviewer_email varchar(50),
  response text default '',
  helpfulness smallint default 0
);

CREATE TABLE IF NOT EXISTS reviews_photos (
  id serial PRIMARY KEY,
  review_id INT REFERENCES reviews(id),
  url text
);

CREATE TABLE IF NOT EXISTS characteristics (
  id serial PRIMARY KEY,
  product_id INT NOT NULL,
  name varchar(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS characteristic_reviews (
  id serial PRIMARY KEY,
  characteristic_id INT NOT NULL REFERENCES characteristics(id),
  review_id INT NOT NULL REFERENCES reviews(id),
  value smallint NOT NULL
);
