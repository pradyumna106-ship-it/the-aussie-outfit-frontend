// datas.js
import { getBrands, getCategories, getProducts } from "../api/product.api.js";
import { getUserNotifications } from "../api/notification.api.js";
import { isTokenExpired } from "../utils/token.js";

export async function fetchDatas(user, getNewAccessToken) {
  try {
    if (!user) return { products: [], brands: [], categories: [], productCount: 0, notifications: [] };

    const token = localStorage.getItem("token");
    if (isTokenExpired(token)) {
      await getNewAccessToken();
    }

    const userId = user?.id || user?._id;

    const [productRes, brandRes, categoryRes] = await Promise.all([
      getProducts(),
      getBrands(),
      getCategories()
    ]);

    let userRes = { data: { data: [] } };
    if (userId) {
      userRes = await getUserNotifications(userId);
    }

    return {
      products: productRes.data.data || [],
      brands: brandRes.data.data || [],
      categories: categoryRes.data.data || [],
      productCount: productRes.data.count || 0,
      notifications: userRes.data.data || []
    };
  } catch (error) {
    console.error("fetchDatas failed:", error);
    return { products: [], brands: [], categories: [], productCount: 0, notifications: [] };
  }
}
