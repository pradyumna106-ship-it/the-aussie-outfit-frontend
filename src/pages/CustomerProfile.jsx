import { useLocation, useNavigate } from "react-router-dom";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  // Data from navigate state
  const customer = location.state?.customer;
  const orders = location.state?.orders;
  const reviews = location.state?.reviews;
  // If no customer data
  if (!customer) {
    return (
      <div className="min-h-screen bg-[#f6f1e7] flex items-center justify-center">
        <div
          className="
            bg-[#fffaf1]
            border
            border-[#d8ccb7]
            rounded-3xl
            p-10
            text-center
            shadow-sm
          "
        >
          <h1 className="text-3xl font-bold text-[#2b241c]">
            Customer Not Found
          </h1>

          <p className="text-[#7a6d5c] mt-3">
            No customer data received.
          </p>

          <button
            onClick={() => navigate("/admin/customers")}
            className="
              mt-6
              px-5
              py-3
              rounded-2xl
              bg-[#3d2f1f]
              text-white
              hover:bg-[#2b241c]
              transition
            "
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f1e7] p-6">

      {/* Header */}
      <div
        className="
          bg-[#fffaf1]
          border
          border-[#d8ccb7]
          rounded-3xl
          p-6
          shadow-sm
        "
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div className="flex items-center gap-5">
            <img
              src={
                customer.image ||
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop"
              }
              alt={customer.username}
              className="
                h-28
                w-28
                rounded-2xl
                object-cover
                border-4
                border-[#e7dbc7]
              "
            />

            <div>
              <h1 className="text-3xl font-bold text-[#2b241c]">
                {customer.username}
              </h1>

              <p className="text-[#7a6d5c] mt-2">
                Premium Australian Lifestyle Customer
              </p>

              <div className="flex flex-wrap gap-3 mt-4">

                <span
                  className={`
                    px-4
                    py-1.5
                    rounded-full
                    text-sm
                    font-medium
                    ${
                      customer.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {customer.status}
                </span>

                <span
                  className="
                    px-4
                    py-1.5
                    rounded-full
                    bg-[#efe1c6]
                    text-[#5b4632]
                    text-sm
                    font-medium
                  "
                >
                  Customer ID: {customer.id}
                </span>

              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="
              px-5
              py-3
              rounded-2xl
              bg-[#3d2f1f]
              text-white
              hover:bg-[#2b241c]
              transition
            "
          >
            Back to Customers
          </button>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* Personal Info */}
        <div
          className="
            bg-[#fffaf1]
            border
            border-[#d8ccb7]
            rounded-3xl
            p-6
            shadow-sm
          "
        >
          <h2 className="text-2xl font-bold text-[#2b241c] mb-6">
            Personal Information
          </h2>

          <div className="space-y-5">

            <div>
              <p className="text-sm text-[#8a7b69] mb-1">
                Email Address
              </p>

              <div
                className="
                  bg-[#f8f3ea]
                  border
                  border-[#e7dbc7]
                  rounded-2xl
                  px-4
                  py-3
                  text-[#2b241c]
                "
              >
                {customer.email || "Not Available"}
              </div>
            </div>

            <div>
              <p className="text-sm text-[#8a7b69] mb-1">
                Phone Number
              </p>

              <div
                className="
                  bg-[#f8f3ea]
                  border
                  border-[#e7dbc7]
                  rounded-2xl
                  px-4
                  py-3
                  text-[#2b241c]
                "
              >
                {customer.phone || "Not Available"}
              </div>
            </div>

            <div>
              <p className="text-sm text-[#8a7b69] mb-1">
                Location
              </p>

              <div
                className="
                  bg-[#f8f3ea]
                  border
                  border-[#e7dbc7]
                  rounded-2xl
                  px-4
                  py-3
                  text-[#2b241c]
                "
              >
                {customer.location || "Australia"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <p className="text-sm text-[#8a7b69] mb-1">
                  Gender
                </p>

                <div
                  className="
                    bg-[#f8f3ea]
                    border
                    border-[#e7dbc7]
                    rounded-2xl
                    px-4
                    py-3
                    text-[#2b241c]
                  "
                >
                  {customer.gender || "Not Available"}
                </div>
              </div>

              <div>
                <p className="text-sm text-[#8a7b69] mb-1">
                  Joined On
                </p>

                <div
                  className="
                    bg-[#f8f3ea]
                    border
                    border-[#e7dbc7]
                    rounded-2xl
                    px-4
                    py-3
                    text-[#2b241c]
                  "
                >
                  {customer.joinedDate || "2026"}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Summary */}
        <div
          className="
            bg-[#fffaf1]
            border
            border-[#d8ccb7]
            rounded-3xl
            p-6
            shadow-sm
          "
        >
          <h2 className="text-2xl font-bold text-[#2b241c] mb-6">
            Customer Summary
          </h2>

          <div className="grid grid-cols-1 gap-5">

            <div
              className="
                bg-[#f8f3ea]
                border
                border-[#e7dbc7]
                rounded-2xl
                p-5
              "
            >
              <p className="text-[#8a7b69] text-sm">
                Total Orders
              </p>

              <h3 className="text-4xl font-bold text-[#2b241c] mt-2">
                {customer.totalOrders || 0}
              </h3>
            </div>

            <div
              className="
                bg-[#f8f3ea]
                border
                border-[#e7dbc7]
                rounded-2xl
                p-5
              "
            >
              <p className="text-[#8a7b69] text-sm">
                Total Spend
              </p>

              <h3 className="text-4xl font-bold text-[#2b241c] mt-2">
                ${customer.totalSpend || 0}
              </h3>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}