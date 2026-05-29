import { Download } from "lucide-react";
import React,{useEffect,useState} from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { exportToCSV } from "../utils/exportUtils";
import { updateOrderStatus } from "../api/order.api.js";
import { useAuth } from "../context/AuthContext";
import { getUserByUserId } from "../api/user.api.js";
import { getPaymentByOrder } from "../api/payment.api.js";
const ORDER_STATUS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned"
];

export default function OrderManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const userAuth = useAuth();
  const admin = userAuth.user;
  const [packedBy, setPackedBy] = useState("");
  const [admins, setAdmins] = useState([]);
  const [orders, setOrders] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [adminNames, setAdminNames] = useState({});
  const [revenue, setRevenue] = useState(0)
  const ordersFromState = location.state?.orders;
    useEffect(() => {

        if (ordersFromState) {

          console.log(
            "Orders from state:",
            ordersFromState
          );

          setOrders(ordersFromState);

          // FETCH ADMIN DETAILS
          ordersFromState.forEach((order) => {

            if (order?.packedBy) {
              getAdminDetails(order.packedBy);
            }

          });

          // FETCH PAYMENT DETAILS
          ordersFromState.forEach(async (order) => {

            const payment =
              await getPaymentDetails(order._id);

            setPaymentDetails((prev) => ({
              ...prev,
              [order._id]: payment
            }));

          });
        }

      }, []);
  const getPaymentDetails = async (orderId) => {

    try {
      
      const res = await getPaymentByOrder(orderId);
      console.log(res.data)
      return res.data.data[0];
    } catch (err) {
      console.error("Failed to fetch payment details", err);
    }
  };
  const getAdminDetails = async (adminId) => {

    try {

      if (!adminId) return;

      // Prevent duplicate API calls
      //if (adminNames[adminId]) return;

      const res = await getUserByUserId(adminId);

      const first =
        res.data.data.firstName || "";

      const last =
        res.data.data.lastName || "";

      const fullName =
        `${first} ${last}`.trim();

      setAdminNames((prev) => ({
        ...prev,
        [adminId]: fullName
      }));

    } catch (err) {

      console.error(
        "Failed to fetch admin details",
        err
      );

    }

  };

  const handleStatusChange = async (orderId, newStatus) => {
    // Update the order status in the backend
    await updateOrderStatus(orderId, { status: newStatus, packedBy: admin.id})
      .then((res) => {
        if (res.data) {
          // If the update is successful, update the local state to reflect the change
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderId ? { ...order, status: newStatus, packedBy: admin.id } : order
            )
          );
        }
      })
      .catch((err) => {
        console.error("Failed to update order status:", err);
      });
  };
  return (
    <div className="min-h-screen bg-[#f4ede1] p-6">
      
      {/* HEADER */}
      <div
        className="
          bg-[#fffaf2]
          border
          border-[#d7c6ab]
          rounded-3xl
          p-6
          shadow-sm
        "
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          
          <div>
            <h1 className="text-4xl font-bold text-[#2d2418]">
              Orders Management
            </h1>

            <p className="text-[#786754] mt-2">
              Monitor Australian orders, deliveries, shipments, and payments.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            
            <button
              onClick={() => navigate(-1)}
              className="
                px-5
                py-3
                rounded-2xl
                border
                border-[#ccb89c]
                bg-white
                text-[#2d2418]
                hover:bg-[#f6efe5]
                transition
              "
            >
              Back
            </button>

            <button
              onClick={() => exportToCSV(orders, "orders.csv")}
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
              <Download size={18} /> Export Orders
            </button>

          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
        
        <div className="bg-[#fffaf2] border border-[#d7c6ab] rounded-3xl p-5">
          <p className="text-[#8b7762] text-sm">Total Orders</p>
          <h2 className="text-3xl font-bold text-[#2d2418] mt-2">{orders.length}</h2>
        </div>

        <div className="bg-[#fffaf2] border border-[#d7c6ab] rounded-3xl p-5">
          <p className="text-[#8b7762] text-sm">Delivered</p>
          <h2 className="text-3xl font-bold text-green-700 mt-2">{orders.filter((order) => order.status.toUpperCase() === "DELIVERED").length}</h2>
        </div>

        <div className="bg-[#fffaf2] border border-[#d7c6ab] rounded-3xl p-5">
          <p className="text-[#8b7762] text-sm">Pending</p>
          <h2 className="text-3xl font-bold text-yellow-700 mt-2">{orders.filter((order) => order.status.toUpperCase() === "PENDING").length}</h2>
        </div>

        <div className="bg-[#fffaf2] border border-[#d7c6ab] rounded-3xl p-5">
          <p className="text-[#8b7762] text-sm">Revenue</p>
          <h2 className="text-3xl font-bold text-[#2d2418] mt-2">
            ${orders.reduce((total, order) => total + (order.totalAmount || order.subtotalAmount + order.taxAmount + order.shippingAmount - order.discountAmount), 0).toLocaleString()}
          </h2>
        </div>

      </div>

      {/* TABLE */}
      <div
        className="
          mt-6
          overflow-x-auto
          bg-[#fffaf2]
          border
          border-[#d7c6ab]
          rounded-3xl
          shadow-sm
        "
      >
        <table className="w-full border-collapse min-w-[1100px]">
          
          {/* TABLE HEAD */}
          <thead className="bg-[#ebdcc1]">
            <tr>
              <th className="px-6 py-5 text-left text-[#2d2418] font-semibold">
                Order ID
              </th>

              <th className="px-6 py-5 text-left text-[#2d2418] font-semibold">
                Customer
              </th>

              <th className="px-6 py-5 text-left text-[#2d2418] font-semibold">
                Total
              </th>

              <th className="px-6 py-5 text-left text-[#2d2418] font-semibold">
                Payment
              </th>

              <th className="px-6 py-5 text-left text-[#2d2418] font-semibold">
                Status
              </th>

              <th className="px-6 py-5 text-left text-[#2d2418] font-semibold">
                Packed By
              </th>

              <th className="px-6 py-5 text-left text-[#2d2418] font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={index}
                className={`
                  border-t
                  border-[#efe3d1]
                  hover:bg-[#fcf6ee]
                  transition
                  ${
                    index % 2 === 0
                      ? "bg-[#fffdf9]"
                      : "bg-[#fffaf2]"
                  }
                `}
              >
                
                {/* ORDER ID */}
                <td className="px-6 py-5 font-semibold text-[#2d2418]">
                  #{order.orderNumber}
                </td>

                {/* CUSTOMER */}
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-medium text-[#3f3427]">
                      {order.username || order.customerName || order.customer?.name || "Unknown User"}
                    </span>

                    <span className="text-sm text-[#8b7762]">
                      Australia Customer
                    </span>
                  </div>
                </td>

                {/* TOTAL */}
                <td className="px-6 py-5 font-semibold text-[#2d2418]">
                  ${order.totalAmount || order.subtotalAmount + order.taxAmount + order.shippingAmount - order.discountAmount}
                </td>

                {/* PAYMENT */}
                <td className="px-6 py-5">
                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      font-medium
                      ${
                        paymentDetails[order._id]?.status === "successful"
                          ? "bg-green-100 text-green-700"
                          : paymentDetails[order._id]?.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : paymentDetails[order._id]?.status === "cancelled"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >
                    {paymentDetails[order._id]?.status || "pending"}
                  </span>
                </td>

                {/* STATUS */}
                <td className="px-6 py-5">
                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      font-medium

                      ${
                        order.status?.toLowerCase() === "pending"
                          ? "bg-gray-100 text-gray-700"

                        : order.status?.toLowerCase() === "confirmed"
                          ? "bg-blue-100 text-blue-700"

                        : order.status?.toLowerCase() === "processing"
                          ? "bg-yellow-100 text-yellow-700"

                        : order.status?.toLowerCase() === "shipped"
                          ? "bg-indigo-100 text-indigo-700"

                        : order.status?.toLowerCase() === "delivered"
                          ? "bg-green-100 text-green-700"

                        : order.status?.toLowerCase() === "cancelled"
                          ? "bg-red-100 text-red-700"

                        : order.status?.toLowerCase() === "returned"
                          ? "bg-purple-100 text-purple-700"

                        : "bg-gray-100 text-gray-700"
                      }
                    `}
                  >
                    {order.status?.charAt(0).toUpperCase() +
                      order.status?.slice(1)}
                  </span>

                </td>

                {/* PACKED BY */}
                <td className="px-6 py-5 text-[#5f5244]">
                  {adminNames[order.packedBy]}
                </td>

        {/* ACTIONS */}
        <td className="px-6 py-5">

          <div className="flex flex-wrap gap-3">

            {/* VIEW */}
            <button
              onClick={() =>
                navigate(
                  `/admin/manage-orders/${order._id}/payment`,
                  {
                    state: {
                      order,
                      payment: paymentDetails[order._id]
                    }
                  }
                )
              }
              className="
                px-4
                py-2
                rounded-2xl
                bg-[#1B1610]
                text-[#FFFDF6]
                text-sm
                font-medium
                border
                border-[#1B1610]
                hover:bg-[#255441]
                hover:border-[#255441]
                transition-all
                duration-200
                shadow-sm
              "
            >
              View
            </button>

            {ORDER_STATUS
              .filter((status) => status !== "pending")
              .map((status) => {

                const currentStatus =
                  order.status?.toLowerCase();

                const isCurrentStatus =
                  currentStatus === status;

                const isCancelled =
                  currentStatus === "cancelled";

                const isDelivered =
                  currentStatus === "delivered";

                const isDisabled =
                  isCancelled ||
                  isCurrentStatus ||
                  (
                    isDelivered &&
                    status === "cancelled"
                  );

                let buttonStyle = "";

                switch (status) {

                  case "confirmed":
                    buttonStyle = `
                      bg-[#255441]
                      hover:bg-[#1d4334]
                      border-[#255441]
                      text-[#FFFDF6]
                    `;
                    break;

                  case "processing":
                    buttonStyle = `
                      bg-[#C76F1C]
                      hover:bg-[#a95e18]
                      border-[#C76F1C]
                      text-[#FFFDF6]
                    `;
                    break;

                  case "shipped":
                    buttonStyle = `
                      bg-[#F6F1E6]
                      hover:bg-[#ebe3d2]
                      border-[#d8ccb7]
                      text-[#1B1610]
                    `;
                    break;

                  case "delivered":
                    buttonStyle = `
                      bg-[#255441]
                      hover:bg-[#1d4334]
                      border-[#255441]
                      text-[#FFFDF6]
                    `;
                    break;

                  case "cancelled":
                    buttonStyle = `
                      bg-[#A8241C]
                      hover:bg-[#8d1d17]
                      border-[#A8241C]
                      text-[#FFFDF6]
                    `;
                    break;

                  case "returned":
                    buttonStyle = `
                      bg-[#FFFDF6]
                      hover:bg-[#f3eee3]
                      border-[#C76F1C]
                      text-[#C76F1C]
                    `;
                    break;

                  default:
                    buttonStyle = `
                      bg-gray-200
                      hover:bg-gray-300
                      border-gray-300
                      text-gray-700
                    `;
                }

                return (
                  <button
                    key={status}
                    disabled={isDisabled}
                    onClick={() =>
                      handleStatusChange(
                        order._id,
                        status
                      )
                    }
                    className={`
                      px-4
                      py-2
                      rounded-2xl
                      text-sm
                      font-medium
                      border
                      transition-all
                      duration-200
                      shadow-sm

                      ${
                        isDisabled
                          ? `
                            bg-gray-200
                            border-gray-200
                            text-gray-400
                            cursor-not-allowed
                            opacity-60
                          `
                          : buttonStyle
                      }
                    `}
                  >
                    {status.charAt(0).toUpperCase() +
                      status.slice(1)}
                  </button>
                );

              })}

          </div>

        </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}