// src/pages/Checkout.jsx
import React,{ useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { getAddressesByUserId } from "../api/user.api.js"
import { createOrder } from "../api/order.api.js";
import { handlePayment } from "../utils/payment.js";
import { sendOrderConfirmation } from "../api/notification.api.js"
import { getCoupons } from "../api/admin.api.js";
const PAYMENT_METHODS = [
  {id:"cash",label:"Cash on Delivery"},
  {id:"razorpay",label:"Razorpay"}
];
const CURRENCIES = [
  "INR","USD","EUR","GBP","AED","AUD","CAD","SGD","SAR"
]
const Checkout = () => {
  const [couponCode, setCouponCode] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const navigate = useNavigate();
  const [userAuth] = useState(
      JSON.parse(localStorage.getItem("user")) || {}
    );
  const {
    cart,
    getCartTotal,
    clearCart,
  } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [notes,setNotes] = useState("");
  const subtotal = getCartTotal();
  const [currency,setCurrency] = useState("AUD")
  const shipping = subtotal > 250 ? 0 : 15;
  const [visiblePaymentButton, setVisiblePaymentButton] = useState(false);
  const total = subtotal + shipping - discountAmount;
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  useEffect(() => {
    async function fetchAddresses() {
      try {
      const res = await getAddressesByUserId(userAuth.id);
          if (res.data.data && res.data.data.length > 0) {
            setAddresses(res.data.data);
            const defaultAddress = res.data.data.find(
              (addr) => addr.isDefault
            );
            setSelectedAddress(defaultAddress || res.data.data[0]);
          } else {
            toast.error("No addresses found");
          }
        }
        catch(err) {
          toast.error("Failed to fetch addresses");
        }
    }
    async function fetchCoupons() {
      try {
        const res = await getCoupons();

        const activeCoupons = res.data.data.filter(
          (coupon) =>
            coupon.status === "active" &&
            new Date(coupon.startsAt) <= new Date() &&
            new Date(coupon.expiresAt) >= new Date()
        );

        setAvailableCoupons(activeCoupons);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAddresses();
    fetchCoupons();
  }, [])
  const applyCoupon = () => {
    const coupon = availableCoupons.find(
      (c) => c.code.toUpperCase() === couponCode.toUpperCase()
    );

    if (!coupon) {
      toast.error("Invalid coupon code");
      return;
    }

    if (subtotal < coupon.minimumOrderAmount) {
      toast.error(
        `Minimum order amount is AUD ${coupon.minimumOrderAmount}`
      );
      return;
    }

    if (
      coupon.usageLimit &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      toast.error("Coupon usage limit reached");
      return;
    }

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount =
        (subtotal * coupon.discountValue) / 100;

      if (
        coupon.maxDiscountAmount &&
        discount > coupon.maxDiscountAmount
      ) {
        discount = coupon.maxDiscountAmount;
      }
    }

    if (coupon.discountType === "fixed") {
      discount = coupon.discountValue;
    }

    setAppliedCoupon(coupon);
    setDiscountAmount(discount);

    toast.success("Coupon applied successfully");
  };
  const paymentRetry = async (paymentPayload, user) => {
    if(!!paymentPayload && !!user) {
      localStorage.setItem("paymentPayload", JSON.stringify(paymentPayload));
      localStorage.setItem("paymentUser", JSON.stringify(user));
    } else {
      const storedPayload = localStorage.getItem("paymentPayload");
      const storedUser = localStorage.getItem("paymentUser");
      if(storedPayload && storedUser) {
        paymentPayload = JSON.parse(storedPayload);
        user = JSON.parse(storedUser);
      } else {
        toast.error("No payment data found for retry");
        return false;
      }
    }
    const result = await handlePayment(paymentPayload, user);
    console.log("Payment Retry Result:", result);
    if(result) {
      navigate("/products/order-confirm");
    } else {
      toast.error("Payment failed on retry");
    }
    return result;
  }
  const handlePlaceOrder = async () => {
    try {
      if (!selectedAddress) {
        toast.error("Please select address");
        return;
      }
      
      const payload = {
        userId: userAuth.id,
        customerName: selectedAddress.fullName,
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          sku: item.sku || "",
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: (item.price * item.quantity).toFixed(2)
        })),
        shippingAddressId: selectedAddress._id,
        subtotalAmount: subtotal,
        taxAmount: subtotal * 0.08,
        shippingAmount: shipping.toFixed(2),
        discountAmount: 0.00,
        totalAmount: total,
        notes: notes,
        paymentMethod: paymentMethod
      };
      console.log("Order Payload:", payload);
      const res =await createOrder(payload);
      const result = res.data;
      console.log("Order Creation Result:", result.data);
      if (result.success) {
        alert("Order placed successfully!");
        const paymentPayload = {
              orderId: result.data._id,
              userId: userAuth.id,
              paymentMethod: paymentMethod,
              amount: total
        }
        const user = {...userAuth, name: addresses.find(addr => addr.isDefault)?.fullName || addresses[0]?.fullName || userAuth.name}
        const paymentResult = paymentRetry(paymentPayload, user);
        const mailLoad = {
          orderId: result.data._id,
          userId: userAuth.id,
          email: userAuth.email,
          orderNumber: result.data.orderNumber
        }
        console.log("Payment Result:", paymentResult);
        const resMail = await sendOrderConfirmation(mailLoad);
        console.log(resMail)
        setVisiblePaymentButton(false)
      } else {
        toast.error("Failed to place order");
        setVisiblePaymentButton(true)
      }
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <main className="min-h-screen bg-[#f6f1e6] py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        {/* HEADER */}
        <div className="mb-10">
          <p className="text-sm text-[#7b6f5c] mb-2">
            Home / Checkout
          </p>

          <h1 className="text-4xl font-bold text-[#2b2b2b]">
            Checkout
          </h1>
        </div>

        {cart.length === 0 ? (
          <div
            className="
              bg-white
              rounded-3xl
              border border-[#d8cdbd]
              p-12
              text-center
            "
          >
            <h2 className="text-2xl font-semibold text-[#2b2b2b] mb-4">
              Your cart is empty
            </h2>

            <button
              onClick={() => navigate("/")}
              className="
                bg-[#245441]
                text-white
                px-6 py-3
                rounded-xl
              "
            >
              Continue Shopping
            </button>
          </div>
        ) :(
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* LEFT SIDE */}
                <div className="xl:col-span-2 space-y-8">

                  {/* SHIPPING ADDRESSES */}
                  <section
                    className="
                      bg-[#fffdf6]
                      border border-[#d8c8ae]
                      rounded-[24px]
                      p-8
                      shadow-sm
                    "
                  >

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">

                      <h2 className="text-3xl font-bold text-[#1b1610]">
                        Select Shipping Address
                      </h2>

                      <div
                        className="
                          text-[#255441]
                          text-sm
                          font-semibold
                        "
                      >
                        {addresses.length} Addresses
                      </div>
                      <button
                        onClick={() => navigate("/add-address")}
                        className="
                          bg-[#255441]
                          text-white
                          px-4 py-2
                          rounded-xl
                          text-sm
                          font-semibold
                        "
                      >
                        Add Address
                      </button>

                    </div>

                    {/* Address List */}
                    <div className="space-y-4">

                      {addresses.map((address, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedAddress(address)}
                          className={`
                            border rounded-2xl p-5 cursor-pointer transition

                            ${
                              selectedAddress?._id === address._id
                                ? "border-[#255441] bg-[#255441]/5"
                                : "border-[#f1e8d9] bg-white/70"
                            }
                          `}
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

                            <div className="flex items-center gap-2">

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

                              {/* Radio */}
                              <div
                                className={`
                                  w-5 h-5 rounded-full border-2 flex items-center justify-center

                                  ${
                                    selectedAddress?._id === address._id
                                      ? "border-[#255441]"
                                      : "border-gray-400"
                                  }
                                `}
                              >
                                {selectedAddress?._id === address._id && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-[#255441]" />
                                )}
                              </div>

                            </div>

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

                        </div>
                      ))}

                    </div>

                  </section>

                  {/* PAYMENT */}
                  <section
                    className="
                      bg-white
                      rounded-3xl
                      border border-[#d8cdbd]
                      p-6
                    "
                  >
                    <h2 className="text-2xl font-semibold mb-6">
                      Payment Method
                    </h2>

                    <div className="space-y-4">

                      {PAYMENT_METHODS.map((method) => (
                        <label
                          key={method.id}
                          className="flex items-center gap-3 border border-[#d8cdbd] rounded-xl p-4 cursor-pointer transition"
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <span>{method.label}</span>
                        </label>
                      ))}

                    </div>
                  </section>

                  {/* DELIVERY INSTRUCTION */}
                  <section
                    className="
                      bg-white
                      rounded-3xl
                      border border-[#d8cdbd]
                      p-6
                    "
                  >
                    <h2 className="text-2xl font-semibold mb-6">
                      Delivery Instruction
                    </h2>

                    <textarea
                      rows="4"
                      className="
                        w-full
                        border border-[#d8cdbd]
                        rounded-xl
                        p-4
                        resize-none
                      "
                      name="deliveryInstructions"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific instructions for delivery?"
                    />
                  </section>

                </div>
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">
                    Apply Coupon
                  </h3>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value)
                      }
                      placeholder="Enter Coupon Code"
                      className="
                        flex-1
                        border
                        border-[#d8cdbd]
                        rounded-xl
                        px-4
                        py-3
                      "
                    />

                    <button
                      onClick={applyCoupon}
                      className="
                        bg-[#245441]
                        text-white
                        px-5
                        rounded-xl
                      "
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-green-600 mt-2">
                      Coupon {appliedCoupon.code} applied
                    </p>
                  )}
                </div>

                {/* RIGHT SIDE */}
                <aside>
                  <div
                    className="
                      bg-white
                      rounded-3xl
                      border border-[#d8cdbd]
                      p-6
                      sticky top-24
                    "
                  >

                    <h2 className="text-2xl font-semibold mb-6">
                      Order Summary
                    </h2>

                    {/* PRODUCTS */}
                    <div className="space-y-5 mb-6">

                      {cart.map((item) => (
                        <div
                          key={item.productId}
                          className="flex gap-4"
                        >

                          <div
                            className="
                              w-20 h-20
                              rounded-xl
                              overflow-hidden
                              bg-[#f3ede2]
                            "
                          >
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1">

                            <h3 className="font-medium text-[#2b2b2b]">
                              {item.productName}
                            </h3>

                            <p className="text-sm text-[#6f6658]">
                              Qty: {item.quantity}
                            </p>

                            <p className="text-[#245441] font-semibold mt-1">
                              AUD $
                              {(
                                Number(item.price) *
                                Number(item.quantity)
                              ).toFixed(2)}
                            </p>

                          </div>

                        </div>
                      ))}

                    </div>

                    {/* TOTALS */}
                    <div className="border-t border-[#d8cdbd] pt-5 space-y-4">

                      <div className="flex justify-between">
                        <span>Subtotal</span>

                        <span>
                          AUD ${subtotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Shipping</span>

                        <span>
                          {shipping === 0
                            ? "Free"
                            : `AUD $${shipping.toFixed(2)}`}
                        </span>
                      </div>

                      <div
                        className="
                          flex justify-between
                          text-xl font-bold
                          pt-3
                        "
                      >
                        <span>Total</span>

                        <span className="text-[#245441]">
                          AUD ${total.toFixed(2)}
                        </span>
                      </div>

                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      className="
                        w-full
                        mt-8
                        bg-[#245441]
                        text-white
                        py-4
                        rounded-2xl
                        text-lg
                        font-medium
                        hover:opacity-90
                        transition
                      "
                    >
                      Place Order
                    </button>

                    {visiblePaymentButton && (
                      <button
                        onClick={paymentRetry}
                        className="
                          w-full
                          mt-4
                          bg-[#245441]
                          text-white
                          py-4
                          rounded-2xl
                          text-lg
                          font-medium
                          hover:opacity-90
                          transition
                        "
                      >
                        Pay Now
                      </button>
                    )}

                  </div>
                </aside>

              </div>
            )}
      </div>
    </main>
  );
};

export default Checkout;