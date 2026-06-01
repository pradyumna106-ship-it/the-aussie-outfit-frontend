import { useEffect, useState } from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
  User,
  Search,
  Heart,
  BellIcon,
} from "lucide-react";
import logo from "../assets/logo-gumleaf.png"
import { getProducts, getBrands } from '../api/product.api.js';
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Header = ({
  onCartToggle,
  setShowNotifications,
  showNotifications
}) => {

  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isCustomer } = useAuth();
  const [mobileOpen, setMobileOpen] =
    useState(false);
  const [openMobileMenu, setOpenMobileMenu] =
    useState(null);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // =========================
  // CATEGORY HELPERS
  // =========================

  useEffect(() => {
      const loadProducts = async () => {
        try {
          const [resCategories, resBrands] = await Promise.all([getCategories(),getBrands()]);
          setCategories(resCategories.data.data || []);
          setBrands(resBrands.data.data || [])
          console.log("Brands: ",resBrands);
          console.log("Categories: ",resCategories);
        } catch (error) {
          console.error("Products Error:", error);
        }
      };
      loadProducts();
    }, []);
  const getSubCategories = (name) => {
    const parent = categories.find(
      (cat) => cat.name === name
    );

    return parent?.subCategories || [];
  };

  const boots = getSubCategories("boots");
  const hats = getSubCategories("hats");
  const workwear = getSubCategories("workwear");
  const accessories = getSubCategories("accessories");

  // =========================
  // NAVIGATION
  // =========================

  const toSlug = (str) =>
    str.toLowerCase().replace(/\s+/g, "-");

  const handleCategoryClick = (
    parent,
    child
  ) => {
    navigate(
      `/products/${toSlug(parent)}/${toSlug(
        child
      )}`
    );
  };

  const handleBrandClick = (item) =>
    navigate(`/products/brands/${item.name}`);

  const toggleMobileMenu = (key) =>
    setOpenMobileMenu((prev) =>
      prev === key ? null : key
    );

  const onSearchClick = () => {
    navigate("/products/search");
  };

  // =========================
  // DESKTOP DROPDOWN
  // =========================

  const DesktopDropdown = ({
    label,
    items,
    onItemClick,
    cols = false,
  }) => (
    <div className="relative group">
      <button
        className="
          flex
          items-center
          gap-1
          text-[#255441]
          hover:text-[#FFFDF6]
          transition
        "
      >
        {label}

        <ChevronDown
          size={16}
          className="
            transition-transform
            duration-200
            group-hover:rotate-180
          "
        />
      </button>

      <div
        className={`
          absolute
          top-full
          left-0
          mt-2
          bg-white
          text-black
          rounded-xl
          shadow-2xl
          opacity-0
          invisible
          group-hover:opacity-100
          group-hover:visible
          transition-all
          duration-200
          p-3
          z-50
          ${cols ? "w-64" : "w-48"}
        `}
      >
        <div
          className={
            cols
              ? "grid grid-cols-2 gap-1"
              : "flex flex-col gap-1"
          }
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => onItemClick(item)}
              className="
                text-sm
                text-left
                px-3
                py-2
                rounded-lg
                hover:bg-[#f3ede2]
                hover:text-[#255441]
                transition
              "
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // =========================
  // MOBILE ACCORDION
  // =========================

  const MobileAccordion = ({
    label,
    menuKey,
    items,
    onItemClick,
  }) => (
    <div className="border-b border-gray-800">
      <button
        onClick={() => toggleMobileMenu(menuKey)}
        className="
          w-full
          flex
          justify-between
          items-center
          py-3
          text-sm
          font-medium
          text-[#CFC3AD]
          hover:text-white
          transition
        "
      >
        {label}

        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            openMobileMenu === menuKey
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {openMobileMenu === menuKey && (
        <div
          className="
            pb-3
            pl-3
            flex
            flex-col
            gap-1
          "
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                onItemClick(item);
                setMobileOpen(false);
              }}
              className="
                text-sm
                text-left
                text-gray-300
                hover:text-white
                py-1.5
                transition
              "
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* HEADER */}

      <header
        className="
          w-full
          sticky
          top-0
          z-50
          bg-[#CFC3AD]
          shadow-lg
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            lg:px-8
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              h-16
            "
          >
            {/* LOGO */}

            <Link
              to="/"
              className="
                text-2xl
                font-bold
                tracking-wider
                text-[#255441]
              "
            >
              <img
                src={logo}
                alt="Everything Australia"
                width="120"
              />
            </Link>

            {/* DESKTOP NAV */}

            {isCustomer && (
              <nav
                className="
                  hidden
                  lg:flex
                  items-center
                  gap-8
                "
              >
                <DesktopDropdown
                  label="Brands"
                  items={brands}
                  onItemClick={handleBrandClick}
                />

                <DesktopDropdown
                  label="Boots"
                  items={boots}
                  onItemClick={(item) =>
                    handleCategoryClick(
                      "boots",
                      item.name
                    )
                  }
                  cols
                />

                <DesktopDropdown
                  label="Hats"
                  items={hats}
                  onItemClick={(item) =>
                    handleCategoryClick(
                      "hats",
                      item.name
                    )
                  }
                  cols
                />

                <DesktopDropdown
                  label="Workwear"
                  items={workwear}
                  onItemClick={(item) =>
                    handleCategoryClick(
                      "workwear",
                      item.name
                    )
                  }
                  cols
                />

                <DesktopDropdown
                  label="Accessories"
                  items={accessories}
                  onItemClick={(item) =>
                    handleCategoryClick(
                      "accessories",
                      item.name
                    )
                  }
                />

                <NavLink
                  to="/products/sale"
                  className="
                    text-[#255441]
                    hover:text-[#FFFDF6]
                    transition
                    font-medium
                  "
                >
                  Sale
                </NavLink>

                <button
                  onClick={onSearchClick}
                  className="
                    p-2
                    text-[#255441]
                    rounded-full
                    transition-colors
                  "
                >
                  <Search className="w-5 h-5" />
                </button>
              </nav>
            )}

            {/* RIGHT SIDE */}

            <div className="flex items-center gap-4">

              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="
                      hidden
                      lg:flex
                      items-center
                      gap-2
                      px-4
                      py-2
                      rounded-xl
                      bg-[#255441]
                      text-white
                      hover:bg-[#1c3d30]
                      transition
                      text-sm
                      font-medium
                    "
                  >
                    Admin Dashboard
                  </Link>

                  <Link
                    to="/admin/profile"
                    className="
                      text-[#255441]
                      hover:text-[#FFFDF6]
                      transition
                    "
                  >
                    <User size={24} />
                  </Link>
                </>
              )}

              {isCustomer && (
                <>
                  
                  <button className="relative
                      text-[#255441]
                      hover:text-[#FFFDF6]
                      transition" onClick={() => navigate('/favourites')}>
                  <Heart className="w-5 h-5" />
                </button>
                <button className="relative
                      text-[#255441]
                      hover:text-[#FFFDF6]
                      transition" onClick={() => setShowNotifications(!showNotifications)}>
                  <BellIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onCartToggle()}
                    className="
                      relative
                      text-[#255441]
                      hover:text-[#FFFDF6]
                      transition
                    "
                  >
                    <ShoppingCart size={24} />

                    {cartCount > 0 && (
                      <span
                        className="
                          absolute
                          -top-2
                          -right-2
                          bg-[#255441]
                          text-white
                          text-xs
                          font-bold
                          w-5
                          h-5
                          rounded-full
                          flex
                          items-center
                          justify-center
                        "
                      >
                        {cartCount}
                      </span>
                    )}
                  </button>
                    <Link
                    to="/profile"
                    className="
                      text-[#255441]
                      hover:text-[#FFFDF6]
                      transition
                    "
                  >
                    <User size={24} />
                  </Link>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="
                      border
                      border-[#255441]
                      px-4
                      py-2
                      rounded-lg
                      text-white
                      bg-[#255441]
                      hover:bg-[#122B21]
                      hover:text-[#CFCFCF]
                      transition
                      text-sm
                      font-medium
                    "
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="
                      border
                      border-[#255441]
                      px-4
                      py-2
                      rounded-lg
                      text-[#255441]
                      hover:bg-[#122B21]
                      hover:text-[#CFCFCF]
                      transition
                      text-sm
                      font-medium
                    "
                  >
                    Register
                  </Link>
                </>
              )}

              <button
                className="
                  lg:hidden
                  text-[#255441]
                "
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}

      <div
        onClick={() => setMobileOpen(false)}
        className={`
          fixed
          inset-0
          bg-black/60
          z-50
          transition-opacity
          duration-300
          ${
            mobileOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      />

      <div
        className={`
          fixed
          top-0
          left-0
          h-full
          w-[320px]
          bg-[#1a1a1a]
          text-white
          z-50
          overflow-y-auto
          transform
          transition-transform
          duration-300
          ease-in-out
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div
          className="
            flex
            items-center
            justify-between
            p-4
            border-b
            border-gray-700
          "
        >
          <h2
            className="
              text-xl
              font-bold
              text-[#CFC3AD]
            "
          >
            Menu
          </h2>

          <button
            onClick={() => setMobileOpen(false)}
          >
            <X size={26} />
          </button>
        </div>

        {isCustomer && (
          <div
            className="
              p-4
              flex
              flex-col
              gap-1
            "
          >
            <MobileAccordion
              label="Brands"
              menuKey="brands"
              items={brands}
              onItemClick={handleBrandClick}
            />

            <MobileAccordion
              label="Boots"
              menuKey="boots"
              items={boots}
              onItemClick={(item) =>
                handleCategoryClick(
                  "boots",
                  item.name
                )
              }
            />

            <MobileAccordion
              label="Hats"
              menuKey="hats"
              items={hats}
              onItemClick={(item) =>
                handleCategoryClick(
                  "hats",
                  item.name
                )
              }
            />

            <MobileAccordion
              label="Workwear"
              menuKey="workwear"
              items={workwear}
              onItemClick={(item) =>
                handleCategoryClick(
                  "workwear",
                  item.name
                )
              }
            />

            <MobileAccordion
              label="Accessories"
              menuKey="accessories"
              items={accessories}
              onItemClick={(item) =>
                handleCategoryClick(
                  "accessories",
                  item.name
                )
              }
            />
            
          </div>
        )}
      </div>
    </>
  );
};

export default Header;