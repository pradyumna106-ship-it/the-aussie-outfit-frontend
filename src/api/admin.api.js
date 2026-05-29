import API from "./axios.js";

/*
|--------------------------------------------------------------------------
| COUPONS
|--------------------------------------------------------------------------
*/

export const getCoupons =
  () => API.get("/admin/coupon");

export const getCouponById =
  (id) =>
    API.get(`/admin/coupon/${id}`);

export const createCoupon =
  (data) =>
    API.post("/admin/coupon", data);

export const updateCoupon =
  (id, data) =>
    API.put(
      `/admin/coupon/${id}`,
      data
    );

export const deleteCoupon =
  (id) =>
    API.delete(
      `/admin/coupon/${id}`
    );

/*
|--------------------------------------------------------------------------
| BANNERS
|--------------------------------------------------------------------------
*/

export const getBanners =
  () => API.get("/admin/banner");

export const getBannerById =
  (id) =>
    API.get(`/admin/banner/${id}`);

export const createBanner =
  (data) =>
    API.post("/admin/banner", data);

export const updateBanner =
  (id, data) =>
    API.put(
      `/admin/banner/${id}`,
      data
    );

export const deleteBanner =
  (id) =>
    API.delete(
      `/admin/banner/${id}`
    );

/*
|--------------------------------------------------------------------------
| SALES REPORTS
|--------------------------------------------------------------------------
*/

export const getSalesReports =
  () =>
    API.get(
      "/admin/reports/sales"
    );
export const createSalesReports =
    (data) => 
    API.post(
      "/admin/reports/sales",data
    );
export const getSalesReportsById =
    (id) => 
      API.get(
        `/admin/reports/sales/${id}`
      )
export const deleteSalesReports =
    (id) => 
      API.delete(
        `/admin/reports/sales/${id}`
      )