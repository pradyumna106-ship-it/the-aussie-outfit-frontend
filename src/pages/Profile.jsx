import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
// import your API
import { getUserByUserId,getAddressesByUserId, deleteAddress } from "../api/user.api.js";
import { logoutUser } from "../api/auth.api.js";
import { useAuth } from "../context/AuthContext";
import { getBrandById, getBrands } from "../api/product.api.js"
import { getOrderById, getUserOrders } from "../api/order.api.js"
export function Profile() {
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [preferredBrands, setPreferredBrands] = useState([]);
  const [userAuth] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );
  const { logout, isCustomer } = useAuth();
  //const { brands } = useOutletContext();
  // 1. Add location to user state (line ~14)
  const [user, setUser] = useState({
    id: "",
    userId: "",
    fullName: "",
    email: "",
    role: "",
    phone: "",
    location: "",   // ← ADD THIS
    joined: "",
    profileImage: "",
    bio: "",
    gender: "",
    dateOfBirth: "",
  });
  // 2. Add orders state (after your other useState hooks, ~line 30)
  const [orders, setOrders] = useState([]);
  // EDIT STATES
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [addresses, setAddresses] = useState([]);
  
  // FETCH PROFILE DATA
  const handleLogout = async () => {
    if(window.confirm("Are you sure you want to logout?")) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.log("No refresh token found, but proceeding with logout.");
        }
        const payload = { refreshToken: refreshToken };
        await logoutUser(payload);
        logout();
        localStorage.clear();
        navigate("/login");
      } catch (error) {
        console.log("Error during logout:", error);
      }
    }
    
  };

  // LOAD PROFILE ON PAGE LOAD
  useEffect(() => {
    const getProfileData = async () => {
      console.log(`userAuth: ${JSON.stringify(userAuth)}`);
    try {
      const promises = [
        getUserByUserId(userAuth.id),
        getAddressesByUserId(userAuth.id),
        getBrands()
      ];
      if (isCustomer || userAuth.roles?.includes("customer")) {
        promises.push(getUserOrders(userAuth.id));
      }

      const responses = await Promise.all(promises);
      const resUser = responses[0];
      const resAddresses = responses[1];
      const resBrands = responses[2];
      const resOrders = isCustomer || userAuth.roles?.includes("customer") ? responses[3] : null;
      
      setOrders(resOrders.data?.data || []);
        if (resUser.status === 200 || resAddresses.status === 200) {
          const profile = resUser.data.data;
          const fetchedAddresses = resAddresses.data.data;
          const allBrands = resBrands.data.data || [];
          const selectedBrands = allBrands.filter((brand) =>
            profile.preferredBrands?.includes(brand._id)
          );
          setAddresses(fetchedAddresses);
          const ordersData = resOrders.data?.data || [];
          console.log("Fetched orders:", ordersData);
          setOrders(ordersData);
          setUser({
            id: profile._id || "",
            userId: profile.userId || "",
            fullName: `${profile.firstName || ""} ${profile.lastName || ""}`,

            email: userAuth.email || "",
            phone: userAuth.phone || "",
            role: userAuth.roles?.[0] || "customer",

            location:
              fetchedAddresses?.find((addr) => addr.isDefault)
                ? `${fetchedAddresses.find((addr) => addr.isDefault)?.city},
                  ${fetchedAddresses.find((addr) => addr.isDefault)?.state}
                  ${fetchedAddresses.find((addr) => addr.isDefault)?.postalCode}`
                : "Bangalore",

            profileImage: profile.profileImage || "",
            bio: profile.bio || "",
            gender: profile.gender || "",

            dateOfBirth: profile.dateOfBirth
              ? new Date(profile.dateOfBirth).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "",

            joined: profile.createdAt
              ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "",

            preferredCategories: profile.preferredCategories || [],

            // Store actual brand objects
            preferredBrands: selectedBrands,

            favoriteColors: profile.favoriteColors || [],

            sizes: profile.sizes || {
              topWear: "",
              bottomWear: "",
              footwear: {
                region: "",
                size: "",
              },
            },

            lifestylePreferences: profile.lifestylePreferences || {
              budgetRange: "",
              shoppingFrequency: "",
            },
          });
        }

    } catch (error) {
      console.log(error);
    }
  };
    getProfileData();

  }, []);
  const getBrand = async (id) => {
    const res = await getBrandById(id);
    setBrand(res.data.data|| null)
  } 
  console.log("orders", orders, Array.isArray(orders));
  console.log("addresses", addresses, Array.isArray(addresses));
  console.log(
    "preferredCategories",
    user.preferredCategories,
    Array.isArray(user.preferredCategories)
  );
  console.log(
    "preferredBrands",
    user.preferredBrands,
    Array.isArray(user.preferredBrands)
  );
  console.log(
    "favoriteColors",
    user.favoriteColors,
    Array.isArray(user.favoriteColors)
  );
  const editAddress = (address) => {
    navigate(`/edit-address/${address._id}`, { state: { address } });
  }
  const handleNavigate = (profile) => {
    navigate(`/edit-profile/${profile.id}`, { state: { profile } });
  }
  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const res = await deleteAddress(addressId);
        if (res.status === 200) {
          setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
        }
      } catch (error) {
        console.log("Error deleting address:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1e6] py-16 px-4">
      <button
            onClick={() => navigate(-1)}
            className="
              flex
              items-center
              gap-2
              px-5
              py-3
              rounded-2xl
              bg-[#3d2c1d]
              text-white
              hover:bg-[#2a1f15]
              transition
            "
          >
            <ArrowLeft size={18} />
            Back
          </button>
      <div className="max-w-6xl mx-auto">

        {/* PAGE TITLE */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-[#1b1610]">
            My Profile
          </h1>

          <p className="text-[#635846] mt-3 text-lg">
            Manage your account details and view your order history.
          </p>
        </div>

        {/* PROFILE CARD */}
          <div className="bg-[#fffdf6] border border-[#d8c8ae] rounded-[32px] overflow-hidden shadow-sm">

            {/* TOP HERO */}
            <div className="bg-gradient-to-r from-[#255441] to-[#1d4333] p-10 text-white">

              <div className="flex flex-col lg:flex-row lg:items-center gap-8">

                {/* IMAGE */}
                <div className="shrink-0">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullName}
                      className="w-36 h-36 rounded-full object-cover border-4 border-white/20"
                    />
                  ) : (
                    <div className="w-36 h-36 rounded-full bg-white/20 flex items-center justify-center text-5xl font-bold">
                      {user.fullName?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="flex-1">

                  <h2 className="text-4xl font-bold">
                    {user.fullName}
                  </h2>

                  <div className="flex flex-wrap gap-3 mt-4">

                    <span className="bg-white/10 px-4 py-2 rounded-full text-sm capitalize">
                      {user.role}
                    </span>

                    <span className="bg-white/10 px-4 py-2 rounded-full text-sm capitalize">
                      {user.gender}
                    </span>

                    <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
                      Joined {user.joined}
                    </span>

                  </div>

                  <p className="mt-6 text-white/80 leading-7 max-w-3xl">
                    {user.bio}
                  </p>
                </div>

              </div>
            </div>

            {/* CONTENT */}
            <div className="p-8 lg:p-10">

              {/* BASIC INFO */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <div className="bg-[#f7f2e9] rounded-2xl p-5">
                  <p className="text-sm text-[#7b6f5f]">
                    Email
                  </p>

                  <h3 className="mt-2 font-semibold text-[#1b1610] break-all">
                    {user.email}
                  </h3>
                </div>

                <div className="bg-[#f7f2e9] rounded-2xl p-5">
                  <p className="text-sm text-[#7b6f5f]">
                    Phone
                  </p>

                  <h3 className="mt-2 font-semibold text-[#1b1610]">
                    {user.phone}
                  </h3>
                </div>

                <div className="bg-[#f7f2e9] rounded-2xl p-5">
                  <p className="text-sm text-[#7b6f5f]">
                    Location
                  </p>

                  <h3 className="mt-2 font-semibold text-[#1b1610]">
                    {user.location || "Bangalore"}
                  </h3>
                </div>

                <div className="bg-[#f7f2e9] rounded-2xl p-5">
                  <p className="text-sm text-[#7b6f5f]">
                    Date Of Birth
                  </p>

                  <h3 className="mt-2 font-semibold text-[#1b1610]">
                    {user.dateOfBirth}
                  </h3>
                </div>

              </div>

              {/* PREFERENCES */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

                {/* CATEGORIES */}
                <div className="border border-[#ece2d0] rounded-3xl p-7">

                  <h3 className="text-2xl font-bold text-[#1b1610] mb-6">
                    Preferred Categories
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    {user.preferredCategories?.map((category) => (
                      <span
                        key={category}
                        className="bg-[#255441] text-white px-4 py-2 rounded-full text-sm capitalize"
                      >
                        {category.replaceAll("-", " ")}
                      </span>
                    ))}
                  </div>
                </div>

                {/* BRANDS */}
                <div className="border border-[#ece2d0] rounded-3xl p-7">

                  <h3 className="text-2xl font-bold text-[#1b1610] mb-6">
                    Preferred Brands
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    {user.preferredBrands?.map((brand,index) => (
                      <span
                        key={index}
                        className="bg-[#255441] text-white px-4 py-2 rounded-full text-sm capitalize"
                      >
                        {brand.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* COLORS */}
                <div className="border border-[#ece2d0] rounded-3xl p-7">

                  <h3 className="text-2xl font-bold text-[#1b1610] mb-6">
                    Favorite Colors
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    {user.favoriteColors?.map((color) => (
                      <span
                        key={color}
                        className="border border-[#d6cab7] px-4 py-2 rounded-full text-sm text-[#1b1610]"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* SIZE + LIFESTYLE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

                {/* SIZES */}
                <div className="border border-[#ece2d0] rounded-3xl p-7">

                  <h3 className="text-2xl font-bold text-[#1b1610] mb-6">
                    Clothing Sizes
                  </h3>

                  <div className="grid grid-cols-3 gap-4">

                    <div className="bg-[#f7f2e9] rounded-2xl p-5 text-center">
                      <p className="text-sm text-[#7b6f5f]">
                        Top Wear
                      </p>

                      <h4 className="text-3xl font-bold mt-2 text-[#255441]">
                        {user.sizes?.topWear}
                      </h4>
                    </div>

                    <div className="bg-[#f7f2e9] rounded-2xl p-5 text-center">
                      <p className="text-sm text-[#7b6f5f]">
                        Bottom
                      </p>

                      <h4 className="text-3xl font-bold mt-2 text-[#255441]">
                        {user.sizes?.bottomWear}
                      </h4>
                    </div>

                    <div className="bg-[#f7f2e9] rounded-2xl p-5 text-center">
                      <p className="text-sm text-[#7b6f5f]">
                        Footwear
                      </p>

                      <h4 className="text-3xl font-bold mt-2 text-[#255441]">
                        {user.sizes?.footwear?.size}
                      </h4>
                    </div>

                  </div>

                  <p className="mt-5 text-sm text-[#7b6f5f]">
                    Region: {user.sizes?.footwear?.region}
                  </p>

                </div>

                {/* LIFESTYLE */}
                <div className="border border-[#ece2d0] rounded-3xl p-7">

                  <h3 className="text-2xl font-bold text-[#1b1610] mb-6">
                    Lifestyle Preferences
                  </h3>

                  <div className="space-y-5">

                    <div className="bg-[#f7f2e9] rounded-2xl p-5 flex items-center justify-between">

                      <div>
                        <p className="text-sm text-[#7b6f5f]">
                          Budget Range
                        </p>

                        <h4 className="text-xl font-bold mt-2 text-[#1b1610] capitalize">
                          {user.lifestylePreferences?.budgetRange}
                        </h4>
                      </div>

                    </div>

                    <div className="bg-[#f7f2e9] rounded-2xl p-5 flex items-center justify-between">

                      <div>
                        <p className="text-sm text-[#7b6f5f]">
                          Shopping Frequency
                        </p>

                        <h4 className="text-xl font-bold mt-2 text-[#1b1610] capitalize">
                          {user.lifestylePreferences?.shoppingFrequency}
                        </h4>
                      </div>

                    </div>
                    <div className="flex flex-wrap gap-4">

                    <button
                      onClick={() => handleNavigate(user)}
                      className="
                        bg-[#1e4638]
                        text-white
                        px-6
                        py-3
                        rounded-2xl
                        font-semibold
                        hover:scale-105
                        transition
                      "
                    >
                      Edit Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="
                        bg-red-500
                        text-white
                        px-6
                        py-3
                        rounded-2xl
                        font-semibold
                        hover:bg-red-600
                        hover:scale-105
                        transition
                      "
                    >
                      Logout
                    </button>

                  </div>

                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* ROLE BASED SECTION */}
              {user.role === "customer" ? (

              <>
                {/* ================= CUSTOMER VIEW ================= */}

                {/* ORDER HISTORY */}
                <div className="mt-10 bg-[#fffdf6] border border-[#d8c8ae] rounded-[24px] p-8 shadow-sm">

                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-[#1b1610]">
                      Order History
                    </h2>

                    <div className="bg-[#255441] text-white px-4 py-2 rounded-xl text-sm font-semibold">
                      {orders.length} Orders
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">

                      <thead>
                        <tr className="border-b border-[#e7dcc8]">
                          <th className="text-left py-4 text-[#1b1610]">Order ID</th>
                          <th className="text-left py-4 text-[#1b1610]">Product</th>
                          <th className="text-left py-4 text-[#1b1610]">Date</th>
                          <th className="text-left py-4 text-[#1b1610]">Status</th>
                          <th className="text-left py-4 text-[#1b1610]">Amount</th>
                        </tr>
                      </thead>

                      <tbody>
                          {orders.map((order, index) => (
                            <tr
                              key={index}
                              className="border-b border-[#f1e8d9]"
                            >
                              <td className="py-5 text-[#255441] font-semibold">
                                #{order.orderNumber}
                              </td>

                              <td className="py-5 text-[#635846]">
                                {order.items?.map((item) => (
                                  <div key={item.productName}>
                                    {item.productName} x {item.quantity}
                                  </div>
                                ))}
                              </td>

                              <td className="py-5 text-[#635846]">
                                {new Date(order.placedAt).toLocaleDateString()}
                              </td>

                              <td className="py-5">
                                <span
                                  className={`
                                    px-3 py-1 rounded-full text-xs font-semibold
                                    ${
                                      order.status === "delivered"
                                        ? "bg-green-100 text-green-700"
                                        : order.status === "cancelled"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }
                                  `}
                                >
                                  {order.status}
                                </span>
                              </td>

                              <td className="py-5 text-[#1b1610] font-semibold">
                                ₹{order.totalAmount}
                              </td>
                            </tr>
                          ))}
                        </tbody>

                    </table>
                  </div>
                </div>

                {/* ADDRESSES */}
                <div className="mt-10 bg-[#fffdf6] border border-[#d8c8ae] rounded-[24px] p-8 shadow-sm">

                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">

                    <h2 className="text-3xl font-bold text-[#1b1610]">
                      Your Addresses
                    </h2>

                    <div className="bg-[#255441] text-white px-4 py-2 rounded-xl text-sm font-semibold">
                      {addresses.length} Addresses
                    </div>

                  </div>

                  {/* Address List */}
                  <div className="space-y-4">

                    {addresses.map((address, index) => (
                      <div
                        key={index}
                        className="
                          border border-[#f1e8d9]
                          rounded-2xl
                          p-5
                          bg-white/70
                        "
                      >

                        {/* Top Row */}
                        <div className="flex items-center justify-between mb-3">

                          <span
                            className="
                              px-3 py-1 rounded-full text-xs font-semibold
                              bg-[#255441]/10 text-[#255441]
                              uppercase
                            "
                          >
                            {address.addressType || "Home"}
                          </span>

                          {address.isDefault && (
                            <span
                              className="
                                px-3 py-1 rounded-full text-xs font-semibold
                                bg-green-100 text-green-700
                              "
                            >
                              Default
                            </span>
                          )}

                        </div>

                        {/* Name */}
                        <h3 className="text-lg font-semibold text-[#1b1610]">
                          {address.fullName}
                        </h3>

                        {/* Phone */}
                        <p className="text-[#635846] mt-1">
                          {address.phoneNumber}
                        </p>

                        {/* Address */}
                        <div className="mt-3 text-[#3d342b] leading-7">

                          <p>{address.addressLine1}</p>

                          {address.addressLine2 && (
                            <p>{address.addressLine2}</p>
                          )}

                          {address.landmark && (
                            <p>Landmark: {address.landmark}</p>
                          )}

                          <p>
                            {address.city}, {address.state} -{" "}
                            {address.postalCode}
                          </p>

                          <p>{address.country}</p>

                        </div>
                          <div className="flex gap-3 mt-5">

                            <button
                              onClick={() => editAddress(address)}
                              className="
                                bg-[#1e4638]
                                text-white
                                px-6
                                py-3
                                rounded-2xl
                                font-semibold
                                hover:scale-105
                                transition
                              "
                            >
                              Edit
                            </button>

                            {/* Delete button can be added here */}
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className="
                                bg-red-500
                                text-white
                                px-6
                                py-3
                                rounded-2xl
                                font-semibold
                                hover:bg-red-600
                                hover:scale-105
                                transition
                              "
                            >
                              Delete
                            </button>
                          </div>
                      </div>
                    ))}

                  </div>
                </div>
              </>




          ) : (

            /* ================= ADMIN VIEW ================= */

            <div className="mt-10 space-y-8">

              {/* ADMIN STATS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-[#255441] text-white rounded-[24px] p-8">
                  <p className="text-sm uppercase tracking-wider opacity-80">
                    Products Added
                  </p>

                  <h2 className="text-5xl font-bold mt-4">
                    148
                  </h2>

                  <p className="mt-4 text-sm opacity-80">
                    Total products uploaded to the store.
                  </p>
                </div>

                <div className="bg-[#3d2c1d] text-white rounded-[24px] p-8">
                  <p className="text-sm uppercase tracking-wider opacity-80">
                    Orders Managed
                  </p>

                  <h2 className="text-5xl font-bold mt-4">
                    932
                  </h2>

                  <p className="mt-4 text-sm opacity-80">
                    Orders processed this month.
                  </p>
                </div>

                <div className="bg-[#cfc3ad] rounded-[24px] p-8">
                  <p className="text-sm uppercase tracking-wider text-[#635846]">
                    Admin Activities
                  </p>

                  <h2 className="text-5xl font-bold mt-4 text-[#1b1610]">
                    421
                  </h2>

                  <p className="mt-4 text-sm text-[#635846]">
                    Product updates, reviews, and inventory edits.
                  </p>
                </div>

              </div>

              {/* RECENT ADMIN ACTIVITY */}
              <div className="bg-[#fffdf6] border border-[#d8c8ae] rounded-[24px] p-8 shadow-sm">

                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-[#1b1610]">
                    Recent Activities
                  </h2>

                  <div className="bg-[#255441] text-white px-4 py-2 rounded-xl text-sm font-semibold">
                    Admin Panel
                  </div>
                </div>

                <div className="space-y-5">

                  <div className="border border-[#ece2d0] rounded-2xl p-5 bg-[#faf7f2]">
                    <p className="text-[#1b1610] font-semibold">
                      Added new product
                    </p>

                    <p className="text-[#635846] mt-1">
                      RM Williams Urban Boots uploaded successfully.
                    </p>

                    <span className="text-sm text-[#9c8f7c] mt-2 block">
                      2 hours ago
                    </span>
                  </div>

                  <div className="border border-[#ece2d0] rounded-2xl p-5 bg-[#faf7f2]">
                    <p className="text-[#1b1610] font-semibold">
                      Updated Inventory
                    </p>

                    <p className="text-[#635846] mt-1">
                      Blundstone stock quantity updated.
                    </p>

                    <span className="text-sm text-[#9c8f7c] mt-2 block">
                      Yesterday
                    </span>
                  </div>

                  <div className="border border-[#ece2d0] rounded-2xl p-5 bg-[#faf7f2]">
                    <p className="text-[#1b1610] font-semibold">
                      Managed Customer Review
                    </p>

                    <p className="text-[#635846] mt-1">
                      Approved new review for Akubra Hat.
                    </p>

                    <span className="text-sm text-[#9c8f7c] mt-2 block">
                      3 days ago
                    </span>
                  </div>

                </div>

              </div>

            </div>

          )}

      </div>

    </div>
  );
}