// src/api/payment.api.js

import API from "./axios.js";

// PROCESS PAYMENT
export const processPayment =
  (data) =>
    API.post(
      "/payments/process",
      data
    );

// VERIFY PAYMENT
export const verifyPayment =
  (data) =>
    API.post(
      "/payments/verify",
      data
    );

// GET PAYMENT
export const getPaymentByOrder =
  (orderId) =>
    API.get(
      `/payments/${orderId}`
    );

// UPDATE PAYMENT STATUS
export const updatePaymentStatus =
  (paymentId, data) =>
    API.put(
      `/payments/${paymentId}/status`,
      data
    );