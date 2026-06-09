import { Download } from "lucide-react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { exportToCSV } from "../utils/exportUtils";
import { getUserByUserId, getAddressesByUserId } from "../api/user.api.js";
import { useEffect, useState } from "react";


export default function UserManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [customers, setCustomers] = useState([]);
  const customersData = location.state?.customers || JSON.parse(localStorage.getItem("customers")) || [];
  const orders = location.state?.orders || JSON.parse(localStorage.getItem("orders")) || [];
  const reviews = location.state?.reviews || JSON.parse(localStorage.getItem("reviews")) || [];
  useEffect(() => {
    async function fetchCustomerDetails() {
      console.log("Received Customers from Dashboard:", customersData);
      localStorage.setItem("customers", JSON.stringify(customersData));
      localStorage.setItem("orders", JSON.stringify(orders));
      localStorage.setItem("reviews", JSON.stringify(reviews));
      if (customersData?.length) {
        const customerPromises =
                customersData.map(
                  async (customer) => {

                    const [
                      userRes,
                      addressRes
                    ] = await Promise.all([

                      getUserByUserId(
                        customer._id
                      ),

                      getAddressesByUserId(
                        customer._id
                      )

                    ]);

                    return {
                      customer,
                      details:
                        userRes.data.data,
                      address:
                        addressRes.data.data
                    };
                  }
                );

              const customerData =
                await Promise.all(
                  customerPromises
                );

              console.log(
                "Detailed Customer Data:",
                customerData
              );

              const formattedCustomers =
                customerData.map(
                  ({
                    customer,
                    details,
                    address
                  }) => {

                    return {

                      id: customer._id,

                      username: details
                        ? `${details.firstName} ${details.lastName}`
                        : "Unknown",

                      email:
                        customer.email,

                      phone:
                        customer.phone,

                      location: address.find((a) => a.userId === customer._id).city
                        || "N/A",

                      gender:
                        details?.gender ||
                        "N/A",

                      dob:
                        details?.dateOfBirth ||
                        "N/A",

                      image:
                        details?.profileImage ||
                        "https://via.placeholder.com/150",

                      joinedDate:
                        new Date(
                          customer.createdAt
                        ).toLocaleDateString(
                          "en-AU",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          }
                        ),
                      totalOrders: orders.filter((o) => o.userId === customer._id).length,
                      status:
                        customer.status
                    };
                  }
                );

              setCustomers(
                formattedCustomers
              );
      } else {
        console.warn(
          "No customers data passed from Dashboard."
        );
      }
    }

    fetchCustomerDetails();
  }, []);
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
              Customer Management
            </h1>

            <p className="text-[#786754] mt-2">
              Manage Australian customer profiles, orders, and activities.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            
            <button
              onClick={() => {
                localStorage.removeItem("customers");
                localStorage.removeItem("orders");
                localStorage.removeItem("reviews");
                navigate("/admin/dashboard")}}
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
              onClick={() => exportToCSV(customers, "customers.csv")}
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
              <Download size={18} />
              Export Customers
            </button>

          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
        
        <div className="bg-[#fffaf2] border border-[#d7c6ab] rounded-3xl p-5">
          <p className="text-[#8b7762] text-sm">Total Customers</p>
          <h2 className="text-3xl font-bold text-[#2d2418] mt-2">{customers.length}</h2>
        </div>

        <div className="bg-[#fffaf2] border border-[#d7c6ab] rounded-3xl p-5">
          <p className="text-[#8b7762] text-sm">Active Users</p>
          <h2 className="text-3xl font-bold text-green-700 mt-2">{customers.filter((c) => c.status === "active").length}</h2>
        </div>

        <div className="bg-[#fffaf2] border border-[#d7c6ab] rounded-3xl p-5">
          <p className="text-[#8b7762] text-sm">Inactive Users</p>
          <h2 className="text-3xl font-bold text-red-700 mt-2">{customers.filter((c) => c.status === "inactive").length}</h2>
        </div>

        <div className="bg-[#fffaf2] border border-[#d7c6ab] rounded-3xl p-5">
          <p className="text-[#8b7762] text-sm">Revenue</p>
          <h2 className="text-3xl font-bold text-[#2d2418] mt-2">
            ${orders.reduce((total, order) => total + (order.totalAmount || order.subtotalAmount + order.taxAmount + order.shippingAmount - order.discountAmount), 0).toLocaleString()}
          </h2>
        </div>

      </div>

      {/* CUSTOMER TABLE */}
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
          
          {/* HEAD */}
          <thead className="bg-[#ebdcc1]">
            <tr>
              <th className="px-6 py-5 text-left text-[#2d2418] font-semibold">
                Customer
              </th>

              <th className="px-6 py-5 text-left text-[#2d2418] font-semibold">
                Phone
              </th>

              <th className="px-6 py-5 text-left text-[#2d2418] font-semibold">
                Email
              </th>

              <th className="px-6 py-5 text-left text-[#2d2418] font-semibold">
                Location
              </th>

              <th className="px-6 py-5 text-left text-[#2d2418] font-semibold">
                Status
              </th>

              <th className="px-6 py-5 text-left text-[#2d2418] font-semibold">
                Orders
              </th>

              <th className="px-6 py-5 text-left text-[#2d2418] font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {customers.map((customer, index) => (
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
                
                {/* CUSTOMER */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    
                    <img
                      src={customer.image}
                      alt={customer.username}
                      className="
                        h-14
                        w-14
                        rounded-2xl
                        object-cover
                        border
                        border-[#d7c6ab]
                      "
                    />

                    <div>
                      <h3 className="font-semibold text-[#2d2418]">
                        {customer.username}
                      </h3>

                      <p className="text-sm text-[#8b7762]">
                        Joined {customer.joinedDate}
                      </p>
                    </div>

                  </div>
                </td>

                {/* PHONE */}
                <td className="px-6 py-5 text-[#5f5244]">
                  {customer.phone}
                </td>

                {/* EMAIL */}
                <td className="px-6 py-5 text-[#5f5244]">
                  {customer.email}
                </td>

                {/* LOCATION */}
                <td className="px-6 py-5 text-[#5f5244]">
                  {customer.location}
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
                        customer.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {customer.status}
                  </span>
                </td>

                {/* ORDERS */}
                <td className="px-6 py-5 font-semibold text-[#2d2418]">
                  {customer.totalOrders}
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-2">
                    
                    <button
                            onClick={() =>
                                navigate(`/admin/customer/${customer.id}`, {
                                state: { customer, orders, reviews },
                                })
                            }
                            className="
                                px-4
                                py-2
                                rounded-xl
                                bg-[#3d2c1d]
                                text-white
                                text-sm
                                hover:bg-[#2a1f15]
                                transition
                            "
                            >
                            Profile
                            </button>

                            <button
                              onClick={() => navigate(`/admin/manage-order/${customer.id}`,{
                                state: { orders: orders.filter((o) => o.userId === customer.id)}
                              })}
                              className="
                                px-4
                                py-2
                                rounded-xl
                                bg-[#8b5e34]
                                text-white
                                text-sm
                                hover:bg-[#734b28]
                                transition
                              "
                            >
                              Orders
                            </button>

                            <button
                            onClick={() => navigate(`/admin/reviews/${customer.id}`,{
                                state: { reviews: reviews.filter((o) => o.userId === customer.id)}
                              })}
                              className="
                                px-4
                                py-2
                                rounded-xl
                                border
                                border-[#ccb89c]
                                bg-white
                                text-[#2d2418]
                                text-sm
                                hover:bg-[#f6efe5]
                                transition
                              "
                            >
                              Reviews
                            </button>

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