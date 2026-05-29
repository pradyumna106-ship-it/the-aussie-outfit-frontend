// src/api/cart.api.js

import API from "./axios.js";

// GET USER CART
export const getCartByUser =
  (userId) =>
    API.get(
      `/cart/user/${userId}`
    );

// ADD TO CART
export const addToCart = (
  data
) =>
  API.post(
    "/cart",
    data
  );

// UPDATE CART ITEM
export const updateCartItem =
  (itemId, data) =>
    API.put(
      `/cart/item/${itemId}`,
      data
    );

    
// DELETE CART ITEM
export const deleteCartItem =
  (itemId) =>
    API.delete(
      `/cart/item/${itemId}`
    );

// CLEAR USER CART
export const clearCart = (
  userId
) =>
  API.delete(
    `/cart/user/${userId}`
  );