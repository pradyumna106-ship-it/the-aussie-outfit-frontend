import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
  } = useCart();

  const subtotal = getCartTotal();

  const shipping = subtotal > 250 ? 0 : 15;

  const total = subtotal + shipping;

  return (
    <div className="h-full bg-[#f6f1e6]">
      <div className="px-4 py-6 sm:px-6">

        {/* EMPTY CART */}
        {cart.length === 0 ? (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              text-center
              py-20
            "
          >
            <div className="text-6xl mb-4">🛍️</div>

            <h2 className="text-2xl font-semibold text-[#2b2b2b] mb-2">
              Your cart is empty
            </h2>

            <p className="text-[#6f6658] mb-6">
              Start shopping premium Australian products.
            </p>

            <button
              onClick={() => navigate("/")}
              className="
                bg-[#245441]
                text-white
                px-6
                py-3
                rounded-xl
                hover:opacity-90
                transition
              "
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">

            {/* CART ITEMS */}
            <section className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={item._id || item.id || index}
                  className="
                    bg-[#fffdf8]
                    border
                    border-[#d8cdbd]
                    rounded-2xl
                    p-4
                    flex
                    gap-4
                  "
                >
                  {/* IMAGE */}
                  <div
                    className="
                      w-24
                      h-24
                      rounded-xl
                      overflow-hidden
                      bg-[#ede4d5]
                      flex-shrink-0
                    "
                  >
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h3
                      className="
                        text-lg
                        font-semibold
                        text-[#2b2b2b]
                        mb-1
                      "
                    >
                      {item.productName}
                    </h3>

                    <p className="text-[#245441] font-bold mb-3">
                      AUD ${Number(item.price).toFixed(2)}
                    </p>

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        flex-wrap
                      "
                    >
                      {/* QUANTITY */}
                      <div
                        className="
                          flex
                          items-center
                          border
                          border-[#d8cdbd]
                          rounded-xl
                          overflow-hidden
                        "
                      >
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId || item._id || item.id,
                              item.quantity - 1
                            )
                          }
                          className="
                            px-3
                            py-1.5
                            hover:bg-[#f3ede2]
                            transition
                          "
                        >
                          −
                        </button>

                        <span className="px-4 py-1.5">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId || item._id || item.id,
                              item.quantity + 1
                            )
                          }
                          className="
                            px-3
                            py-1.5
                            hover:bg-[#f3ede2]
                            transition
                          "
                        >
                          +
                        </button>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          removeFromCart(
                            item.productId || item._id || item.id
                          )
                        }
                        className="
                          text-red-600
                          hover:text-red-700
                          text-sm
                          font-medium
                        "
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* SUMMARY */}
            <aside
              className="
                bg-[#fffdf8]
                border
                border-[#d8cdbd]
                rounded-2xl
                p-5
              "
            >
              <h2
                className="
                  text-xl
                  font-semibold
                  text-[#2b2b2b]
                  mb-5
                "
              >
                Order Summary
              </h2>

              <div className="space-y-3 border-b border-[#d8cdbd] pb-4">
                <div className="flex justify-between">
                  <span className="text-[#6f6658]">
                    Subtotal
                  </span>

                  <span className="font-medium">
                    AUD ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6f6658]">
                    Shipping
                  </span>

                  <span className="font-medium">
                    {shipping === 0
                      ? "Free"
                      : `AUD $${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between py-5">
                <span className="text-lg font-semibold">
                  Total
                </span>

                <span
                  className="
                    text-2xl
                    font-bold
                    text-[#245441]
                  "
                >
                  AUD ${total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="
                  w-full
                  bg-[#245441]
                  text-white
                  py-3
                  rounded-xl
                  font-medium
                  hover:opacity-90
                  transition
                "
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/")}
                className="
                  w-full
                  mt-3
                  border
                  border-[#d8cdbd]
                  py-3
                  rounded-xl
                  hover:bg-[#f3ede2]
                  transition
                "
              >
                Continue Shopping
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;