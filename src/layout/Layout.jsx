import { Outlet, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { router } from "../routes.js";
import Header from "../components/Header";
import Footer from "../components/Footer.jsx";
import { TopServiceBar } from "../components/TopServiceBar";
import Cart from "../components/Cart";
import { getBrands, getCategories, getProducts } from "../api/product.api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { isTokenExpired } from "../utils/token.js"
import { updateNotification, getUserNotifications } from "../api/notification.api.js";
import NotificationPanel from "../components/NotificationPanel"
function Layout() {
  const [cartOpen, setCartOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([])
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const navigate = useNavigate()
  const { getNewAccessToken, isAuthenticated, loading, setLoading, user } = useAuth() 
  const loadDatas = useCallback(async () => {
    try {
      if (!user) return;

      const token = localStorage.getItem("token");
      if (isTokenExpired(token)) {
        await getNewAccessToken();
      }

      const userId = user?.id || user?._id;

      const productRes = await getProducts();
      const brandRes = await getBrands();
      const categoryRes = await getCategories();

      let userRes = { data: { data: [] } };
      if (userId) {
        userRes = await getUserNotifications(userId);
      }
      console.log("product: ",productRes)
      console.log("user: ",userRes)
      setProducts(productRes.data.data || []);
      setBrands(brandRes.data.data || []);
      setCategories(categoryRes.data.data || []);
      setProductCount(productRes.data.count || 0);
      setNotifications(userRes.data.data || []);
    } catch (error) {
      console.error("Layout API failed:", error);
    }
  }, []);

  // ✅ Call the memoized function inside useEffect
  const fetchData = useCallback(async () => {
    await loadDatas();
  },[loadDatas])
  useEffect(() => {
    const run = async () => {
      await fetchData();
    };
    run();
  }, [fetchData]);
  useEffect(() => {
    return () => {
      if (desktopHoverTimeout.current) clearTimeout(desktopHoverTimeout.current);
    };
  }, []);
    const markAsRead = async (notification) => {

      try {

        // UPDATE UI

        setNotifications((prev) =>
          prev.map((n) =>
            (n._id || n.id) === (notification._id || notification.id)
              ? {
                  ...n,
                  isRead: true,
                  status: "READ",
                  readAt: new Date()
                }
              : n
          )
        );

        // API CALL

        await updateNotification(notification._id || notification.id, {
          isRead: true,
          status: "READ",
          readAt: new Date()
        });

      } catch (error) {

        console.error(
          "Failed to mark notification as read:",
          error
        );
      }
    };

    const markAllAsRead = async () => {

      try {

        // GET ALL UNREAD IDS

        const unreadNotifications = notifications.filter(
          (notification) => !notification.isRead
        );

        // API CALLS

        await Promise.all(
          unreadNotifications.map((notification) =>
            updateNotification(notification._id || notification.id, {
              isRead: true,
              status: "READ",
              readAt: new Date()
            })
          )
        );

        // UPDATE UI

        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            isRead: true,
            status: "READ",
            readAt: new Date()
          }))
        );

      } catch (error) {

        console.error(
          "Failed to mark all notifications as read:",
          error
        );
      }
    };

  return (
    <div className="min-h-screen bg-[#f6f1e6] flex flex-col">
      
      {/* TOP SERVICE BAR */}
      <TopServiceBar />

      {/* HEADER */}
      <Header
        onCartToggle={() => setCartOpen((prev) => !prev)}
        brands={brands}
        categories={categories}
        setShowNotifications={setShowNotifications}
        showNotifications={showNotifications}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 relative">
        {showNotifications && (
            <NotificationPanel
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
            />
          )}
        <Outlet
          context={{
            products,
            brands,
            categories,
            productCount
          }}
        />
      </main>

      {/* CART OVERLAY */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* CART SIDEBAR */}
      <div
        className={`
          fixed top-0 right-0 z-50
          h-screen w-full sm:w-[420px]
          bg-[#f6f1e6]
          shadow-2xl
          transition-transform duration-300 ease-in-out
          overflow-y-auto
          ${cartOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        
        {/* SIDEBAR HEADER */}
        <div className="sticky top-0 z-10 bg-[#f6f1e6] border-b border-[#d8cdbd] px-6 py-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#2b2b2b]">
            Shopping Cart
          </h2>

          <button
            onClick={() => setCartOpen(false)}
            className="
              w-10 h-10 rounded-full
              flex items-center justify-center
              hover:bg-[#e7dcc8]
              transition
            "
          >
            ✕
          </button>
        </div>
        {/* CART CONTENT */}
        <Cart />
      </div>
      <Footer/>
    </div>
  );
}

export default Layout;