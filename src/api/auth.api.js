// src/api/auth.api.js

import API from "./axios.js";

// ==========================
// AUTH APIs
// ==========================

// REGISTER
export const registerUser = (data) =>
  API.post("/auth/register", data);

// LOGIN
export const loginUser = (data) =>
  API.post("/auth/login", data);

// REFRESH ACCESS TOKEN
export const refreshAccessToken = (data) =>
  API.post("/auth/refresh-token",data);

// LOGOUT
export const logoutUser = (data) =>
  API.post("/auth/logout", data);

// LOGOUT ALL DEVICES
export const logoutAllSessions = () =>
  API.post("/auth/logout-all");

// GET CURRENT USER
export const getCurrentUser = (id) =>
  API.get(`/auth/${id}`);

// FORGOT PASSWORD
export const forgotPassword = (data) =>
  API.post("/auth/forgot-password", data);

// RESET PASSWORD
export const resetPassword = (data) =>
  API.post("/auth/reset-password", data);

// VERIFY TOKEN
export const verifyToken = () =>
  API.get("/auth/verify-token");

export const updateUser = (id, data) =>
  API.put(`/auth/${id}`, data);

export const getUsers = () =>
  API.get("/auth");