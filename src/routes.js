import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import { Login } from "./pages/Login";
import Register from "./pages/Register";
import { Profile } from "./pages/Profile";
import { Order } from "./pages/Order";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import Layout from "./layout/Layout";
import ManageProducts from "./pages/ManageProducts";
import OrderManagement from "./pages/OrderManagement";
import UserManagement from "./pages/UserManagement";
import CustomerProfile from "./pages/CustomerProfile";
import AddProductPage from "./pages/AddProduct";
import Reviews from "./pages/Reviews";
import SearchPage from "./pages/SearchPage";
import OrderConfirm from "./pages/OrderConfirm";
import AddBrandPage from "./pages/AddBrandPage";
import AddCategoryPage from "./pages/AddCategoryPage";
import Brands from "./pages/Brands";
import EditAddress from "./pages/EditAddress";
import Checkout from "./pages/Checkout";
import ProductReviewPage from "./pages/ProductReviewPage";
import ProductReviews from "./pages/ProductReviews";
import Favorites from "./pages/Favorites";
import ProductView from "./pages/ProductView";
import PaymentOperationView from "./pages/PaymentOperationView";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CouponsPage from "./pages/CouponsPage";
import BannersPage from "./pages/BannersPage";
import SalesReportsPage from "./pages/SalesReportsPage";
import CouponFormPage from "./pages/CouponFormPage";
import BannerFormPage from "./pages/BannerFormPage";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "home", Component: Home },

      // PRODUCTS
      // /products                          → all products
      // /products/brands                   → all brands
      // /products/brands/blundstone        → brand detail
      // /products/boots/safety             → boots > safety
      // /products/sale                     → sale page
      { path: "products",                  Component: Products },
      { path: "products/:category",        Component: Products },
      { path: "products/:category/:slug",  Component: Products },
      { path: "products/detail/:id",       Component: ProductDetail },
      { path: "brands", Component: Brands},
      { path: "products/search", Component: SearchPage},
      { path: "products/order-confirm", Component: OrderConfirm},
      { path: "products/:productId/reviews", Component:ProductReviews},
      { path: "products/:productId/reviews/form", Component:ProductReviewPage},
      { path: "products/:productId/reviews/:id", Component:ProductReviewPage},
      { path: "favourites", Component: Favorites},
      // AUTH & ACCOUNT
      { path: "login",    Component: Login },
      { path: "register", Component: Register },
      { path: "profile",  Component: Profile },
      { path: "forget-password", Component: ForgotPassword },
      { path: "reset-password", Component: ResetPassword },
      { path: "edit-profile/:id",  Component: Register },
      { path: "edit-address/:id",  Component: EditAddress },
      { path: "add-address", Component: EditAddress },
      { path: "orders",   Component: Order },
      { path: "checkout", Component: Checkout},

      // ADMIN
      { path: "admin/login",     Component: AdminLogin },
      { path: "admin/dashboard", Component: AdminDashboard },
      { path: 'admin/manage-products', Component: ManageProducts},
      { path: "admin/add-product", Component: AddProductPage},
      { path: "admin/add-brand", Component: AddBrandPage },
      { path: "admin/edit-brand/:id", Component: AddBrandPage},
      { path: "admin/add-category", Component: AddCategoryPage },
      { path: "admin/edit-category/:id", Component: AddCategoryPage},
      { path: "admin/edit-product/:id", Component: AddProductPage},
      { path: "admin/manage-orders", Component: OrderManagement},
      { path: "admin/manage-order/:id", Component: OrderManagement},
      { path: "admin/customers", Component:UserManagement},
      { path: "admin/customer/:id", Component:CustomerProfile},
      { path: "admin/reviews", Component:Reviews },
      { path: "admin/reviews/:id", Component:Reviews},
      { path: "admin/profile", Component:Profile},
      { path: "admin/coupons", Component:CouponsPage},
      { path: "admin/coupons/create", Component: CouponFormPage},
      { path: "admin/coupons/:id/edit", Component: CouponFormPage},
      { path: "admin/banners", Component: BannersPage},
      { path: "admin/banners/create", Component: BannerFormPage},
      { path: "admin/banners/:id/edit", Component: BannerFormPage},
      { path: "admin/reports/sales",Component: SalesReportsPage},
      { path: "admin/products/:id", Component: ProductView},
      { path: "admin/manage-orders/:id/payment", Component: PaymentOperationView},
    ],
  },
]);