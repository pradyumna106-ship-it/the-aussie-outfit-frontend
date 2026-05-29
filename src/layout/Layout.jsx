import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { router } from "../routes.js";
import Header from "../components/Header";
import Footer from "../components/Footer.jsx";
import { TopServiceBar } from "../components/TopServiceBar";
import Cart from "../components/Cart";
import { getBrands, getCategories, getProducts } from "../api/product.api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { isTokenExpired } from "../utils/token.js"
function Layout() {
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const navigate = useNavigate()
  const { getNewAccessToken, isAuthenticated, loading, setLoading } = useAuth() 
  useEffect(() => {
      async function loadDatas() {
        try {
          const token = localStorage.getItem("token");
            if (isTokenExpired(token)) {
              await getNewAccessToken()
              console.log("Token expired");
            } else {
              console.log("Token valid");
            }
          const [productRes,brandRes,categoryRes] = await Promise.all([
            getProducts(),
            getBrands(),
            getCategories()
          ]);
        setProducts(productRes.data.data || []);
        setBrands(brandRes.data.data || []);
        setCategories(categoryRes.data.data || []);
        setProductCount(productRes.data.count);
  
        }catch(error) {
          console.error(error)
        }
      }
      loadDatas()
    },[])
    const shopping = [
        { label: "Akubra", path:"/boots"}
    ]
  return (
    <div className="min-h-screen bg-[#f6f1e6] flex flex-col">
      
      {/* TOP SERVICE BAR */}
      <TopServiceBar />

      {/* HEADER */}
      <Header
        onCartToggle={() => setCartOpen((prev) => !prev)}
        brands={brands}
        categories={categories}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 relative">
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