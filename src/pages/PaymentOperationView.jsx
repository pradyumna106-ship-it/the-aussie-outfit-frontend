import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  ArrowLeft,
  CreditCard,
  BadgeCheck,
  Clock3,
  CircleDollarSign,
  Wallet,
  Receipt,
  User,
  CalendarDays,
  Package,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { exportToCSV } from "../utils/exportUtils";

import { updatePaymentStatus } from "../api/payment.api";

export default function PaymentOperationView() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const payment =
    location.state?.payment;

  const order =
    location.state?.order;
  const handlePaymentStatus = async(payment, status) => {
    const res = await updatePaymentStatus(payment._id, status)
    console.log(res.data.data)
  }

  if (!payment) {

    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-[#f6f1e6]
        "
      >
        <h1
          className="
            text-3xl
            font-bold
            text-[#2d2418]
          "
        >
          Payment Not Found
        </h1>
      </div>
    );
  }

  return (

    <div
      className="
        min-h-screen
        bg-[#f6f1e6]
        px-4
        md:px-8
        lg:px-14
        py-8
      "
    >

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="
          flex
          items-center
          gap-2
          text-[#245441]
          hover:text-[#1c4032]
          transition-colors
          mb-8
        "
      >

        <ArrowLeft
          className="
            w-5
            h-5
          "
        />

        <span className="font-medium">
          Back
        </span>

      </button>

      {/* HEADER */}
      <div
        className="
          bg-[#fffaf2]
          border
          border-[#d7c6ab]
          rounded-3xl
          p-6
          shadow-sm
          mb-8
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-5
          "
        >

          <div>

            <p
              className="
                text-sm
                tracking-[4px]
                uppercase
                text-[#8b7355]
              "
            >
              Everything Australia
            </p>

            <h1
              className="
                text-4xl
                font-bold
                text-[#2d2418]
                mt-2
              "
            >
              Payment Operation
            </h1>

          </div>

          <div>

            <span
              className={`
                px-5
                py-3
                rounded-2xl
                text-sm
                font-semibold
                ${
                  payment.status === "successful"
                    ? "bg-green-100 text-green-700"
                    : payment.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }
              `}
            >
              {payment.status?.toUpperCase()}
            </span>

          </div>

        </div>

      </div>

      {/* MAIN */}
      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
        "
      >

        {/* LEFT */}
        <div
          className="
            lg:col-span-2
            space-y-6
          "
        >

          {/* PAYMENT DETAILS */}
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

            <h2
              className="
                text-2xl
                font-bold
                text-[#2d2418]
                mb-6
              "
            >
              Payment Information
            </h2>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
              "
            >

              {/* PAYMENT ID */}
              <div
                className="
                  bg-white
                  border
                  border-[#eadfce]
                  rounded-2xl
                  p-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mb-3
                  "
                >

                  <Receipt
                    className="
                      w-5
                      h-5
                      text-[#245441]
                    "
                  />

                  <h3
                    className="
                      font-semibold
                      text-[#2d2418]
                    "
                  >
                    Payment ID
                  </h3>

                </div>

                <p className="text-[#5f564a] break-all">
                  {payment._id}
                </p>

              </div>

              {/* ORDER ID */}
              <div
                className="
                  bg-white
                  border
                  border-[#eadfce]
                  rounded-2xl
                  p-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mb-3
                  "
                >

                  <Package
                    className="
                      w-5
                      h-5
                      text-[#245441]
                    "
                  />

                  <h3
                    className="
                      font-semibold
                      text-[#2d2418]
                    "
                  >
                    Order ID
                  </h3>

                </div>

                <p className="text-[#5f564a] break-all">
                  {payment.orderId}
                </p>

              </div>

              {/* USER */}
              <div
                className="
                  bg-white
                  border
                  border-[#eadfce]
                  rounded-2xl
                  p-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mb-3
                  "
                >

                  <User
                    className="
                      w-5
                      h-5
                      text-[#245441]
                    "
                  />

                  <h3
                    className="
                      font-semibold
                      text-[#2d2418]
                    "
                  >
                    User ID
                  </h3>

                </div>

                <p className="text-[#5f564a] break-all">
                  {payment.userId}
                </p>

              </div>

              {/* PAYMENT METHOD */}
              <div
                className="
                  bg-white
                  border
                  border-[#eadfce]
                  rounded-2xl
                  p-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mb-3
                  "
                >

                  <Wallet
                    className="
                      w-5
                      h-5
                      text-[#245441]
                    "
                  />

                  <h3
                    className="
                      font-semibold
                      text-[#2d2418]
                    "
                  >
                    Payment Method
                  </h3>

                </div>

                <p className="text-[#5f564a] capitalize">
                  {payment.paymentMethod}
                </p>

              </div>

            </div>

          </div>

          {/* TRANSACTION */}
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

            <h2
              className="
                text-2xl
                font-bold
                text-[#2d2418]
                mb-6
              "
            >
              Transaction Overview
            </h2>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-5
              "
            >

              {/* AMOUNT */}
              <div
                className="
                  bg-white
                  border
                  border-[#eadfce]
                  rounded-2xl
                  p-5
                "
              >

                <CircleDollarSign
                  className="
                    w-7
                    h-7
                    text-[#245441]
                    mb-3
                  "
                />

                <p className="text-[#8b7762] text-sm">
                  Amount
                </p>

                <h2
                  className="
                    text-3xl
                    font-bold
                    text-[#245441]
                    mt-2
                  "
                >
                  AUD ${payment.amount}
                </h2>

              </div>

              {/* STATUS */}
              <div
                className="
                  bg-white
                  border
                  border-[#eadfce]
                  rounded-2xl
                  p-5
                "
              >

                {
                  payment.status === "successful"
                    ? (
                      <CheckCircle2
                        className="
                          w-7
                          h-7
                          text-green-600
                          mb-3
                        "
                      />
                    )
                    : (
                      <XCircle
                        className="
                          w-7
                          h-7
                          text-red-600
                          mb-3
                        "
                      />
                    )
                }

                <p className="text-[#8b7762] text-sm">
                  Payment Status
                </p>

                <h2
                  className={`
                    text-2xl
                    font-bold
                    mt-2
                    ${
                      payment.status === "successful"
                        ? "text-green-700"
                        : "text-red-700"
                    }
                  `}
                >
                  {payment.status}
                </h2>

              </div>

              {/* DATE */}
              <div
                className="
                  bg-white
                  border
                  border-[#eadfce]
                  rounded-2xl
                  p-5
                "
              >

                <CalendarDays
                  className="
                    w-7
                    h-7
                    text-[#245441]
                    mb-3
                  "
                />

                <p className="text-[#8b7762] text-sm">
                  Created At
                </p>

                <h2
                  className="
                    text-lg
                    font-bold
                    text-[#2d2418]
                    mt-2
                  "
                >
                  {
                    new Date(
                      payment.createdAt
                    ).toLocaleDateString(
                      "en-AU",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      }
                    )
                  }
                </h2>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div
          className="
            space-y-6
          "
        >

          {/* QUICK STATUS */}
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

            <h2
              className="
                text-xl
                font-bold
                text-[#2d2418]
                mb-5
              "
            >
              Payment Status
            </h2>

            <div className="space-y-4">

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <BadgeCheck
                  className="
                    w-5
                    h-5
                    text-[#245441]
                  "
                />

                <span className="text-[#5f564a]">
                  Verified Transaction
                </span>

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <Clock3
                  className="
                    w-5
                    h-5
                    text-[#245441]
                  "
                />

                <span className="text-[#5f564a]">
                  Last Updated:
                  {" "}
                  {
                    new Date(
                      payment.updatedAt
                    ).toLocaleTimeString(
                      "en-AU"
                    )
                  }
                </span>

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <CreditCard
                  className="
                    w-5
                    h-5
                    text-[#245441]
                  "
                />

                <span className="text-[#5f564a]">
                  Secure Payment Gateway
                </span>

              </div>

            </div>

          </div>

          {/* ACTIONS */}
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

            <h2
              className="
                text-xl
                font-bold
                text-[#2d2418]
                mb-5
              "
            >
              Actions
            </h2>

            <div className="space-y-3">
                  
              <button
                onClick={() => handlePaymentStatus(payment, {status: "successful"})}
                className="
                  w-full
                  px-5
                  py-3
                  rounded-2xl
                  bg-[#245441]
                  text-white
                  font-semibold
                  hover:bg-[#1c4032]
                  transition
                "
              >
                Mark successful
              </button>

              <button
                onClick={() => handlePaymentStatus(payment, {status: "cancelled"})}
                className="
                  w-full
                  px-5
                  py-3
                  rounded-2xl
                  bg-[#A8241C]
                  text-white
                  font-semibold
                  hover:bg-[#891B15]
                  transition
                "
              >
                Mark cancel
              </button>

              <button
              onClick={() => handlePaymentStatus(payment, {status: "refunded"})}
                className="
                  w-full
                  px-5
                  py-3
                  rounded-2xl
                  bg-[#8b5e34]
                  text-white
                  font-semibold
                  hover:bg-[#734b28]
                  transition
                "
              >
                Refund Payment
              </button>

              <button
              onClick={() => exportToCSV(order?.items, "orderItems.csv")}
                className="
                  w-full
                  px-5
                  py-3
                  rounded-2xl
                  border
                  border-[#ccb89c]
                  bg-white
                  text-[#2d2418]
                  font-semibold
                  hover:bg-[#f6efe5]
                  transition
                "
              >
                Download Receipt
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}