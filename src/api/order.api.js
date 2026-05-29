// src/api/order.api.js

import API from "./axios.js";

// CREATE ORDER
export const createOrder = (
  data
) =>
  API.post(
    "/orders",
    data
  );

// GET USER ORDERS
export const getUserOrders =
  (userId) =>
    API.get(
      `/orders/user/${userId}`
    );

// GET ORDER BY ID
export const getOrderById =
  (orderId) =>
    API.get(
      `/orders/${orderId}`
    );

// UPDATE ORDER STATUS
export const updateOrderStatus =
  (orderId, data) =>
    API.put(
      `/orders/${orderId}/status`,
      data
    );

  export const getOrders = () =>
    API.get("/orders");