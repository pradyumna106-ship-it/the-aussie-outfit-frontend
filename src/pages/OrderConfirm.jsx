// src/pages/OrderConfirm.jsx

import React from "react";

import {
  CircleCheck,
  Package,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

const OrderConfirm = () => {
  const navigate = useNavigate();

  const {
    cart,
    clearCart,
    getCartTotal,
  } = useCart();

  // =========================
  // ORDER DETAILS
  // =========================

  const orderNumber = Math.floor(
    100000 + Math.random() * 900000
  );

  const estimatedDelivery =
    new Date();

  estimatedDelivery.setDate(
    estimatedDelivery.getDate() + 5
  );

  const subtotal = getCartTotal();

  const shipping =
    subtotal >= 50 ? 0 : 5.99;

  const tax = subtotal * 0.08;

  const total =
    subtotal + shipping + tax;

  // =========================
  // ACTIONS
  // =========================

  const handleHome = () => {
    clearCart();
    navigate("/");
  };

  const handleContinueShopping =
    () => {
      clearCart();
      navigate("/products");
    };

  return (
    <div className="min-h-screen bg-[#f5f1e8]">

      {/* HERO */}

      <div
        className="
          bg-gradient-to-r
          from-[#255441]
          via-[#3d6a56]
          to-[#c38b52]
          py-16
          px-4
          text-white
        "
      >
        <div
          className="
            max-w-6xl
            mx-auto
            text-center
          "
        >

          <div
            className="
              w-24
              h-24
              rounded-full
              bg-white/10
              border
              border-white/20
              flex
              items-center
              justify-center
              mx-auto
              mb-6
              backdrop-blur-sm
            "
          >
            <CircleCheck
              size={54}
              className="text-[#f4d4a5]"
            />
          </div>

          <h1
            className="
              text-4xl
              md:text-6xl
              font-bold
              mb-4
            "
          >
            Order Confirmed
          </h1>

          <p
            className="
              text-lg
              md:text-xl
              text-white/90
              max-w-2xl
              mx-auto
            "
          >
            Thank you for shopping with
            Everything Australia.
            Your order has been placed
            successfully.
          </p>
        </div>
      </div>

      {/* CONTENT */}

      <div
        className="
          max-w-6xl
          mx-auto
          px-4
          py-12
          grid
          lg:grid-cols-3
          gap-8
        "
      >

        {/* LEFT SIDE */}

        <div className="lg:col-span-2 space-y-8">

          {/* ORDER DETAILS */}

          <div
            className="
              bg-white
              rounded-3xl
              shadow-lg
              border
              border-[#e7dfcf]
              p-8
            "
          >

            <div
              className="
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-6
                border-b
                border-[#ebe3d5]
                pb-6
                mb-6
              "
            >

              <div>
                <p
                  className="
                    text-sm
                    uppercase
                    tracking-wide
                    text-gray-500
                    mb-2
                  "
                >
                  Order Number
                </p>

                <h2
                  className="
                    text-3xl
                    font-bold
                    text-[#255441]
                  "
                >
                  #{orderNumber}
                </h2>
              </div>

              <div>
                <p
                  className="
                    text-sm
                    uppercase
                    tracking-wide
                    text-gray-500
                    mb-2
                  "
                >
                  Estimated Delivery
                </p>

                <h2
                  className="
                    text-2xl
                    font-semibold
                    text-black
                  "
                >
                  {estimatedDelivery.toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </h2>
              </div>
            </div>

            {/* ORDER ITEMS */}

            <div>

              <h3
                className="
                  text-2xl
                  font-bold
                  text-[#255441]
                  mb-6
                "
              >
                Order Items
              </h3>

              <div className="space-y-5">

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      border-b
                      border-[#f1ece2]
                      pb-5
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-4
                      "
                    >

                      <div
                        className="
                          w-20
                          h-20
                          rounded-2xl
                          overflow-hidden
                          bg-[#faf7f2]
                          border
                        "
                      >
                        <img
                          src={
                            item.productImage
                          }
                          alt={
                            item.productName
                          }
                          className="
                            w-full
                            h-full
                            object-cover
                          "
                        />
                      </div>

                      <div>
                        <h4
                          className="
                            text-lg
                            font-semibold
                            text-[#255441]
                          "
                        >
                          {item.productName}
                        </h4>

                        <p className="text-gray-600 text-sm mt-1">
                          Quantity :
                          {" "}
                          {
                            item.quantity
                          }
                        </p>
                      </div>
                    </div>

                    <h4
                      className="
                        text-xl
                        font-bold
                        text-[#c66e1c]
                      "
                    >
                      $
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(2)}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* NEXT STEPS */}

          <div
            className="
              bg-[#255441]
              rounded-3xl
              p-8
              text-white
              shadow-lg
            "
          >

            <div
              className="
                flex
                items-start
                gap-5
              "
            >

              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-white/10
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <Package
                  size={32}
                  className="text-[#f4d4a5]"
                />
              </div>

              <div>

                <h3
                  className="
                    text-3xl
                    font-bold
                    mb-4
                  "
                >
                  What's Next?
                </h3>

                <ul className="space-y-3 text-white/90">

                  <li>
                    • You'll receive an
                    email confirmation
                    shortly
                  </li>

                  <li>
                    • Tracking details
                    will be shared once
                    your order ships
                  </li>

                  <li>
                    • Expected delivery
                    within 5–7 business
                    days
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div>

          <div
            className="
              bg-white
              rounded-3xl
              shadow-lg
              border
              border-[#e7dfcf]
              p-8
              sticky
              top-24
            "
          >

            <h3
              className="
                text-3xl
                font-bold
                text-[#255441]
                mb-8
              "
            >
              Order Summary
            </h3>

            <div className="space-y-5">

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Subtotal
                </span>

                <span className="font-semibold">
                  $
                  {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Shipping
                </span>

                <span className="font-semibold text-green-600">
                  {shipping === 0
                    ? "Free"
                    : `$${shipping.toFixed(
                        2
                      )}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Tax
                </span>

                <span className="font-semibold">
                  ${tax.toFixed(2)}
                </span>
              </div>

              <div
                className="
                  border-t
                  pt-5
                  flex
                  justify-between
                  items-center
                "
              >

                <span
                  className="
                    text-2xl
                    font-bold
                    text-[#255441]
                  "
                >
                  Total
                </span>

                <span
                  className="
                    text-3xl
                    font-bold
                    text-[#c66e1c]
                  "
                >
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* BUTTONS */}

            <div className="space-y-4 mt-10">

              <button
                onClick={
                  handleContinueShopping
                }
                className="
                  w-full
                  bg-[#c66e1c]
                  hover:bg-[#aa5c17]
                  text-white
                  py-4
                  rounded-2xl
                  font-semibold
                  transition
                  flex
                  items-center
                  justify-center
                  gap-3
                "
              >
                <ShoppingBag size={22} />
                Continue Shopping
              </button>

              <button
                onClick={handleHome}
                className="
                  w-full
                  border-2
                  border-[#255441]
                  text-[#255441]
                  hover:bg-[#255441]
                  hover:text-white
                  py-4
                  rounded-2xl
                  font-semibold
                  transition
                  flex
                  items-center
                  justify-center
                  gap-3
                "
              >
                <ArrowLeft size={22} />
                Back To Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirm;