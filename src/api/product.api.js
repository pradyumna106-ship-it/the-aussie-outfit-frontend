// src/api/product.api.js

import API from "./axios.js";

// ================= PRODUCTS =================

// GET ALL PRODUCTS
export const getProducts = () =>
  API.get("/products");

// GET PRODUCT BY ID
export const getProductById = (
  id
) =>
  API.get(
    `/products/${id}`
  );

// CREATE PRODUCT
export const createProduct = (
  data
) =>
  API.post(
    "/products",
    data
  );

// UPDATE PRODUCT
export const updateProduct = (
  id,
  data
) =>
  API.put(
    `/products/${id}`,
    data
  );

// DELETE PRODUCT
export const deleteProduct = (
  id
) =>
  API.delete(
    `/products/${id}`
  );

// ================= CATEGORIES =================

export const getCategories =
  () =>
    API.get(
      "/products/categories"
    );

export const getCategoryById =
  (id) =>
    API.get(
      `/products/categories/${id}`
    );

export const getCategoryBySlug =
  (slug) =>
    API.get(
      `/products/categories/slug/${slug}`
    );
export const createCategory =
  (data) =>
    API.post(
      "/products/categories",
      data
    );

export const updateCategory =
  (id, data) =>
    API.put(
      `/products/categories/${id}`,
      data
    );

export const deleteCategory =
  (id) =>
    API.delete(
      `/products/categories/${id}`
    );

// ================= BRANDS =================

export const getBrands = () =>
  API.get(
    "/products/brands"
  );

export const getBrandById = (
  id
) =>
  API.get(
    `/products/brands/${id}`
  );

export const createBrand = (
  data
) =>
  API.post(
    "/products/brands",
    data
  );

export const updateBrand = (
  id,
  data
) =>
  API.put(
    `/products/brands/${id}`,
    data
  );

export const deleteBrand = (
  id
) =>
  API.delete(
    `/products/brands/${id}`
  );