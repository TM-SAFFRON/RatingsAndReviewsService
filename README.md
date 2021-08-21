# RatingsAndReviewsService

## Get Reviews
GET /reviews
Query Params:
• product_id (required integer)
• count (optional integer)
• sort (optional string; default is 'relevant'; choices are 'newest', 'helpful', or 'relevant')
• page (optional integer)

## Get Reviews Meta
GET /reviews/meta
Query Params:
• product_id (required integer)

## Post a Review
POST /reviews
Body Param (JSON):
• product_id (required integer)
• rating (required integer 1-5)
• summary (required text)
• body (required text)
• recommend (required boolean)
• name (required string)
• email (required string)
• photos (optional array of URL texts)
• characteristics (required JSON object of characteristic_id key and characteristic rating value)

## Mark a Review as Helpful
PUT /reviews/:review_id/helpful
Path Variables:
• review_id (required integer)

## Report a Review
PUT /reviews/:review_id/report
Path Variables:
• review_id (required integer)