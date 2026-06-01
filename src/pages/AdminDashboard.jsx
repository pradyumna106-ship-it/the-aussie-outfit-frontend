import { Navigate, Link, useNavigate } from 'react-router';
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Star,
  Truck,
  Plus,
  Eye,
  ClipboardList,
  TicketPercent,
  ImageIcon,
  BarChart3,
} from 'lucide-react';
import { fetchDatas } from "../datas/data.js"; // ✅ import here
import { getOrders } from '../api/order.api.js';
import { getUsers,getCurrentUser } from '../api/auth.api.js';
import { getAllReviews } from '../api/review.api.js';
import { useAuth } from '../context/AuthContext';
import { useOutletContext } from 'react-router';
import { useEffect, useState, useCallback } from 'react';
import {
  createSalesReports
} from "../api/admin.api.js";
import { getBrands, getCategories, getProducts } from '../api/product.api.js';
export function AdminDashboard() {
  const { isAuthenticated, isAdmin, loading, setLoading, user, getNewAccessToken } = useAuth();
  // const { productCount, products } = useOutletContext();
  const [cartOpen, setCartOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const navigate = useNavigate()
  useEffect(() => {

    const loadData = async () => {
      try {
        setLoading(true);
        const [
          ordersRes,
          usersRes,
          reviewsRes,
          resProduct, resCategories, resBrands
        ] = await Promise.all([
          getOrders(),
          getUsers(),
          getAllReviews(),
          getProducts(),getCategories(),getBrands()
        ]);
        // ORDERS
        const ordersData =
          ordersRes?.data?.data || [];
        setOrders(ordersData);
        const totalOrders =
          ordersRes?.data?.count ||
          ordersData.length;
        setOrderCount(totalOrders);
        console.log(
          "All Orders:",
          ordersData
        );
        // USERS
        const users =
          usersRes?.data?.data || [];
        const customersData =
          users.filter(
            (user) =>
              user.roles.includes("customer")
          );
        setCustomers(customersData);
        const totalCustomers =
          customersData.length;
        setCustomerCount(totalCustomers);
        // REVIEWS
        const rev =
          reviewsRes?.data?.data || [];
        setReviews(rev);
        setReviewCount(
          reviewsRes?.data?.count ||
          rev.length
        );
        console.log(
          "All Reviews:",
          rev
        );
          setProducts(resProduct.data.data || []);
          setProductCount(resProduct.data.count || 0);
          setCategories(resCategories.data.data || []);
          setBrands(resBrands.data.data || [])
      } catch (error) {
        console.error(
          "Dashboard Load Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  //if (!isAuthenticated || !isAdmin) {
  //  return <Navigate to="/admin/login" />;
  //}
  const generateSalesReport = async () => {
      try {
        // TOTAL REVENUE
        const totalRevenue = orders.reduce((total, order) => total + (order.totalAmount || (order.subtotalAmount + order.taxAmount + order.shippingAmount - order.discountAmount)),0);
        // CANCELLED ORDERS
        const cancelledOrders = orders.filter((order) => order.status === "cancelled").length;
        // REFUNDED AMOUNT
        const refundedAmount = orders.filter((order) => order.paymentStatus === "refunded").reduce((total, order) => total + order.totalAmount,0);
        // STATUS COUNTS
        const orderStatusCounts = {
          pending:
            orders.filter(
              (o) =>
                o.status === "pending"
            ).length,
          confirmed:
            orders.filter(
              (o) =>
                o.status === "confirmed"
            ).length,
          shipped:
            orders.filter(
              (o) =>
                o.status === "shipped"
            ).length,
          delivered:
            orders.filter(
              (o) =>
                o.status === "delivered"
            ).length,
          cancelled:
            orders.filter(
              (o) =>
                o.status === "cancelled"
            ).length
        };
        // TOP PRODUCTS
        const topProductsMap = {};
            orders.forEach((order) => {order.items?.forEach((item) => { const productId = item.productId || item._id;
                if (!topProductsMap[productId]) {
                  topProductsMap[productId] = {
                    productId,
                    name: item.productName || item.name,
                    quantitySold: 0,
                    revenue: 0
                  };
                }
                topProductsMap[productId].quantitySold +=
                  item.quantity || 0;
                topProductsMap[productId].revenue +=
                  (item.price || 0) *
                  (item.quantity || 0);
              });
            });
            const topProducts = Object.values(topProductsMap).sort((a, b) =>  b.quantitySold - a.quantitySold).slice(0, 5);
            console.log(topProducts);
        // FINAL PAYLOAD
        const payload = {
          period: "daily",
          periodStart:
            new Date(),
          periodEnd:
            new Date(),
          totalOrders:
            orders.length,
          totalRevenue,
          totalCustomers:
            customerCount,
          totalProducts:
            productCount,
          cancelledOrders,
          refundedAmount,
          topProducts,
          orderStatusCounts
        };
        console.log("view before append: ",payload)
        const res = await createSalesReports(payload);
        console.log("Sales Report Generated", res);
      } catch (error) {
        console.error(
          error
        );

      }
  };
  const stats = [
    {
      title: 'Total Products',
      value: productCount,
      icon: Package,
      color: 'bg-[#255441]',
    },
    {
      title: 'Orders',
      value: orderCount,
      icon: ShoppingCart,
      color: 'bg-[#a56a2a]',
    },
    {
      title: 'Customers',
      value: customerCount,
      icon: Users,
      color: 'bg-[#7a3b2e]',
    },
    {
      title: 'Revenue',
      value: '$'+orders.reduce((total, order) => total + (order.totalAmount || order.subtotalAmount + order.taxAmount + order.shippingAmount - order.discountAmount), 0).toLocaleString(),
      icon: DollarSign,
      color: 'bg-[#4f5f2f]',
    },
    {
      title: 'Reviews',
      value: reviewCount,
      icon: Star,
      color: 'bg-[#8d6e3b]',
    }
  ];

  const recentOrders = orders
    .slice(0, 3)
    .map((order) => ({
      id: order.orderNumber,

      customer: order.customerName || "Unknown Customer",

      total:
        `${order.currency} ${order.totalAmount}`,

      status: order.status,
    }));

  return (
    <div className="min-h-screen bg-[#f6f1e6]">
      {/* Page Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Heading */}
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[3px] text-[#8a7b65] mb-3">
            Everything Australian
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-[#1b1610]">
            Admin Dashboard
          </h1>

          <p className="mt-4 text-[#5f5647] text-lg">
            Manage products, customers, orders and store activity.
          </p>
        </div>
        <button
            onClick={generateSalesReport}
            className="
              bg-[#255441]
              text-white
              px-5
              py-3
              rounded-2xl
            "
          >
            Generate Sales Report
          </button>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="bg-[#fffcf6] border border-[#d7cab5] rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#756a5b] text-sm mb-2">
                      {item.title}
                    </p>

                    <h2 className="text-3xl font-bold text-[#1b1610]">
                      {item.value}
                    </h2>
                  </div>

                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Left Section */}
          <div className="xl:col-span-2 flex flex-col gap-8">

            {/* Quick Actions */}
            <div className="bg-[#fffcf6] border border-[#d7cab5] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1b1610]">
                  Quick Actions
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <Link
                  to="/admin/manage-products"
                  state={{products,brands,categories}}
                  className="bg-[#255441] hover:bg-[#1e4636] transition-colors rounded-xl p-5 text-white flex items-center gap-4"
                >
                  <Package className="w-8 h-8"/>

                  <div>
                    <h3 className="font-semibold text-lg">
                      Manage Product
                    </h3>

                    <p className="text-sm text-[#d8e7df]">
                      Create new product listing
                    </p>
                  </div>
                </Link>

                <Link
                  to="/admin/manage-orders"
                  state={{ orders }}
                  className="bg-[#a56a2a] hover:bg-[#8d5923] transition-colors rounded-xl p-5 text-white flex items-center gap-4"
                >
                  <ClipboardList className="w-8 h-8" />

                  <div>
                    <h3 className="font-semibold text-lg">
                      Manage Orders
                    </h3>

                    <p className="text-sm text-[#f4e3d2]">
                      Process customer orders
                    </p>
                  </div>
                </Link>

                <Link
                  to="/admin/customers"
                  state={{ customers,orders,reviews }}
                  className="bg-[#7a3b2e] hover:bg-[#643025] transition-colors rounded-xl p-5 text-white flex items-center gap-4"
                >
                  <Users className="w-8 h-8" />

                  <div>
                    <h3 className="font-semibold text-lg">
                      Customers
                    </h3>

                    <p className="text-sm text-[#f3ddda]">
                      View customer accounts
                    </p>
                  </div>
                </Link>

                <Link
                  to="/admin/reviews"
                  state={{ reviews }}
                  className="bg-[#4f5f2f] hover:bg-[#424f27] transition-colors rounded-xl p-5 text-white flex items-center gap-4"
                >
                  <Star className="w-8 h-8" />

                  <div>
                    <h3 className="font-semibold text-lg">
                      Reviews
                    </h3>

                    <p className="text-sm text-[#d9e0c8]">
                      Moderate product reviews
                    </p>
                  </div>
                </Link>
              </div>
            </div>

           {/* STORE MANAGEMENT */}
            <div className="
              bg-[#fffcf6]
              border
              border-[#d7cab5]
              rounded-2xl
              p-6
            ">

              <div className="
                flex
                items-center
                justify-between
                mb-6
              ">

                <h2 className="
                  text-2xl
                  font-bold
                  text-[#1b1610]
                ">
                  Store Management
                </h2>

              </div>

              <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
              ">

                {/* COUPONS */}
                <Link
                  to="/admin/coupons"
                  className="
                    bg-[#255441]
                    hover:bg-[#1d4334]
                    transition-all
                    rounded-2xl
                    p-5
                    text-white
                    flex
                    items-center
                    gap-4
                    hover:scale-[1.02]
                  "
                >

                  <TicketPercent className="w-8 h-8" />

                  <div>

                    <h3 className="
                      font-semibold
                      text-lg
                    ">
                      Coupons
                    </h3>

                    <p className="
                      text-sm
                      text-[#d8e7df]
                    ">
                      Manage store discounts
                    </p>

                  </div>

                </Link>

                {/* BANNERS */}
                <Link
                  to="/admin/banners"
                  className="
                    bg-[#C76F1C]
                    hover:bg-[#aa5d17]
                    transition-all
                    rounded-2xl
                    p-5
                    text-white
                    flex
                    items-center
                    gap-4
                    hover:scale-[1.02]
                  "
                >

                  <ImageIcon className="w-8 h-8" />

                  <div>

                    <h3 className="
                      font-semibold
                      text-lg
                    ">
                      Banners
                    </h3>

                    <p className="
                      text-sm
                      text-[#f6e2cd]
                    ">
                      Homepage promotions
                    </p>

                  </div>

                </Link>

                {/* SALES REPORTS */}
                <Link
                  to="/admin/reports/sales"
                  className="
                    bg-[#7a3b2e]
                    hover:bg-[#642f25]
                    transition-all
                    rounded-2xl
                    p-5
                    text-white
                    flex
                    items-center
                    gap-4
                    hover:scale-[1.02]
                  "
                >

                  <BarChart3 className="w-8 h-8" />

                  <div>

                    <h3 className="
                      font-semibold
                      text-lg
                    ">
                      Sales Reports
                    </h3>

                    <p className="
                      text-sm
                      text-[#f0ddda]
                    ">
                      Revenue & order insights
                    </p>

                  </div>

                </Link>

              </div>

            </div>

            {/* Recent Orders */}
            <div className="bg-[#fffcf6] border border-[#d7cab5] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1b1610]">
                  Recent Orders
                </h2>

                <Link
                  to="/admin/manage-orders"
                  state={{ orders }}
                  className="text-[#255441] hover:underline text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[#e6dac6]">
                      <th className="text-left py-4 text-[#756a5b] font-medium">
                        Order ID
                      </th>

                      <th className="text-left py-4 text-[#756a5b] font-medium">
                        Customer
                      </th>

                      <th className="text-left py-4 text-[#756a5b] font-medium">
                        Total
                      </th>

                      <th className="text-left py-4 text-[#756a5b] font-medium">
                        Status
                      </th>

                      <th className="text-left py-4 text-[#756a5b] font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr
                        key={index}
                        className="border-b border-[#f0e7d8]"
                      >
                        <td className="py-5 font-semibold text-[#1b1610]">
                          {order.id}
                        </td>

                        <td className="py-5 text-[#5f5647]">
                          {order.customer}
                        </td>

                        <td className="py-5 text-[#255441] font-semibold">
                          {order.total}
                        </td>

                        <td className="py-5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'Processing'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="py-5">
                          <button className="flex items-center gap-2 text-[#255441] hover:underline text-sm">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col gap-8">

            {/* Inventory */}
            <div className="bg-[#fffcf6] border border-[#d7cab5] rounded-2xl p-6">

              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-[#255441]" />

                <h2 className="text-2xl font-bold text-[#1b1610]">
                  Inventory
                </h2>
              </div>

              <div className="space-y-5">

                {products.slice(0, 5).map((product) => {

                  // Example stock percentage
                  const percentage =
                    Math.min(
                      ((product.stock || 0) / 200) * 100,
                      100
                    );

                  return (
                    <div key={product._id}>

                      <div className="flex justify-between mb-2">

                        <span className="text-[#5f5647]">
                          {product.name}
                        </span>

                        <span className="font-semibold text-[#1b1610]">
                          {product.stock || 0} Items
                        </span>
                      </div>

                      <div className="w-full h-3 bg-[#eadfce] rounded-full overflow-hidden">

                        <div
                          className="h-full bg-[#255441] transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-[#fffcf6] border border-[#d7cab5] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-6 h-6 text-[#255441]" />

                <h2 className="text-2xl font-bold text-[#1b1610]">
                  Shipping Updates
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-[#f6f1e6] rounded-xl p-4">
                  <p className="font-semibold text-[#1b1610] mb-1">
                    24 Orders Ready
                  </p>

                  <p className="text-sm text-[#5f5647]">
                    Awaiting shipment pickup
                  </p>
                </div>

                <div className="bg-[#f6f1e6] rounded-xl p-4">
                  <p className="font-semibold text-[#1b1610] mb-1">
                    6 Delayed Orders
                  </p>

                  <p className="text-sm text-[#5f5647]">
                    Requires customer follow-up
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
