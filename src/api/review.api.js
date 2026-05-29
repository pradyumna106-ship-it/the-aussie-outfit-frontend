// src/api/review.api.js

import API from "./axios.js";

// CREATE REVIEW
export const createReview = (
  data
) =>
  API.post(
    "/reviews",
    data
  );

// GET PRODUCT REVIEWS
export const getReviewsByProduct =
  (productId) =>
    API.get(
      `/reviews/product/${productId}`
    );

export const getAllReviews = () =>
  API.get("/reviews");
// UPDATE REVIEW
export const updateReview = (
  reviewId,
  data
) =>
  API.put(
    `/reviews/${reviewId}`,
    data
  );

// DELETE REVIEW
export const deleteReview = (
  reviewId
) =>
  API.delete(
    `/reviews/${reviewId}`
  );

export const createOrUpdateRating = (
  data
) => 
  API.post(
    `/reviews/ratings`,data
  );

export const getRatingsByProductId = (
  productId
) => 
  API.get(
    `/reviews/ratings/product/${productId}`
  );

export const deleteRating = (
  reviewId
) => 
  API.delete(`/reviews/ratings/${reviewId}`);