// src/api/user.api.js

import API from "./axios.js";

// ================= USERS =================

// GET USERS
export const getUsers = () =>
  API.get("/users");

// GET USER BY ID
export const getUserById = (
  id
) =>
  API.get(
    `/users/${id}`
  );
export const getUserByUserId = (
  userId
) =>
  API.get(
    `/users/userAuthId/${userId}`
  );
// CREATE USER
export const createUser = (
  data
) =>
  API.post(
    "/users",
    data
  );

// UPDATE USER
export const updateUser = (
  id,
  data
) =>
  API.put(
    `/users/${id}`,
    data
  );

// DELETE USER
export const deleteUser = (
  id
) =>
  API.delete(
    `/users/${id}`
  );

// ================= ADDRESS =================

export const getAddresses =
  () =>
    API.get(
      "/users/address"
    );

export const getAddressById =
  (id) =>
    API.get(
      `/users/address/${id}`
    );

export const getAddressesByUserId =
  (userId) =>
    API.get(
      `/users/address/user/${userId}`
    );

export const createAddress =
  (data) =>
    API.post(
      "/users/address",
      data
    );

export const updateAddress =
  (id, data) =>
    API.put(
      `/users/address/${id}`,
      data
    );

export const deleteAddress =
  (id) =>
    API.delete(
      `/users/address/${id}`
    );

// ================= NEWSLETTER =================

export const getNewsletterPreferences =
  () =>
    API.get(
      "/users/newsLetterPreference"
    );

export const getNewsletterPreferenceById =
  (id) =>
    API.get(
      `/users/newsLetterPreference/${id}`
    );

export const createNewsletterPreference =
  (data) =>
    API.post(
      "/users/newsLetterPreference",
      data
    );

export const updateNewsletterPreference =
  (id, data) =>
    API.put(
      `/users/newsLetterPreference/${id}`,
      data
    );

export const deleteNewsletterPreference =
  (id) =>
    API.delete(
      `/users/newsLetterPreference/${id}`
    );