// src/api/notification.api.js

import API from "./axios.js";

// ORDER CONFIRMATION
export const sendOrderConfirmation =
  (data) =>
    API.post(
      "/notifications/order-confirmation",
      data
    );

// PASSWORD RESET
export const sendPasswordReset =
  (data) =>
    API.post(
      "/notifications/password-reset",
      data
    );

// GET USER NOTIFICATIONS
export const getUserNotifications =
  (userId) =>
    API.get(
      `/notifications/user/${userId}`
    );