import { Navigate, Link } from 'react-router';
import {
  CircleCheck,
  Package,
  ArrowLeft,
  Truck,
  ShoppingBag,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Order() {
  const { isAuthenticated } = useAuth();
  const { cart, clearCart, getCartTotal } = useCart();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const shipping = getCartTotal() >= 200 ? 0 : 15;
  const tax = getCartTotal() * 0.08;

  const finalTotal = getCartTotal() + shipping + tax;

  return (
    <div className="min-h-screen bg-[#f6f1e6] py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Top Navigation */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#255441] hover:text-[#1e4334] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Continue Shopping</span>
          </Link>
        </div>

        {/* Success Section */}
        <div className="bg-[#fffdf6] border border-[#d7cab5] rounded-3xl p-8 md:p-12 mb-8 shadow-sm">
          <div className="text-center mb-10">

            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CircleCheck className="w-14 h-14 text-green-600" />
            </div>

            <p className="uppercase tracking-[4px] text-[#8a7b65] text-sm mb-3">
              Everything Australian
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-[#1b1610] mb-4">
              Order Confirmed
            </h1>

            <p className="text-[#635846] text-lg">
              Thank you for shopping with us.
            </p>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            <div className="bg-[#f6f1e6] rounded-2xl p-5 border border-[#e5d7c4]">
              <p className="text-sm text-[#7a6e5c] mb-2">
                Order Number
              </p>

              <h3 className="text-2xl font-bold text-[#1b1610]">
                #{orderNumber}
              </h3>
            </div>

            <div className="bg-[#f6f1e6] rounded-2xl p-5 border border-[#e5d7c4]">
              <p className="text-sm text-[#7a6e5c] mb-2">
                Estimated Delivery
              </p>

              <h3 className="text-xl font-semibold text-[#1b1610]">
                {estimatedDelivery.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h3>
            </div>

            <div className="bg-[#f6f1e6] rounded-2xl p-5 border border-[#e5d7c4]">
              <p className="text-sm text-[#7a6e5c] mb-2">
                Payment Status
              </p>

              <h3 className="text-xl font-semibold text-green-700">
                Paid Successfully
              </h3>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="w-6 h-6 text-[#255441]" />

              <h2 className="text-2xl font-bold text-[#1b1610]">
                Order Items
              </h2>
            </div>

            <div className="space-y-4">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fdfaf4] border border-[#e5d7c4] rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover border border-[#d7cab5]"
                      />

                      <div>
                        <h3 className="text-lg font-semibold text-[#1b1610]">
                          {item.name}
                        </h3>

                        <p className="text-[#6d6252] text-sm mt-1">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="text-xl font-bold text-[#255441]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="bg-[#fdfaf4] border border-[#e5d7c4] rounded-2xl p-8 text-center">
                  <p className="text-[#6d6252] text-lg">
                    No order items available.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-[#f6f1e6] rounded-3xl border border-[#e5d7c4] p-8 mb-10">
            <h2 className="text-2xl font-bold text-[#1b1610] mb-6">
              Order Summary
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between text-[#635846]">
                <span>Subtotal</span>

                <span>${getCartTotal().toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-[#635846]">
                <span>Shipping</span>

                <span className="text-green-700 font-medium">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-[#635846]">
                <span>Tax</span>

                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-[#d7cab5] pt-4 flex justify-between text-2xl font-bold text-[#1b1610]">
                <span>Total</span>

                <span className="text-[#255441]">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-[#255441] rounded-3xl p-8 text-white mb-10">
            <div className="flex items-start gap-4">

              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <Truck className="w-7 h-7" />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">
                  What's Next?
                </h2>

                <ul className="space-y-3 text-[#dce7e1]">
                  <li>
                    • You'll receive an order confirmation email shortly.
                  </li>

                  <li>
                    • Tracking details will be shared once shipped.
                  </li>

                  <li>
                    • Orders usually arrive within 5–7 business days.
                  </li>

                  <li>
                    • Free returns available within 90 days.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">

            <Link
              to="/"
              onClick={() => clearCart()}
              className="flex-1 border border-[#cfc3ad] hover:bg-[#efe5d6] transition-colors rounded-2xl py-4 px-6 text-center font-semibold text-[#1b1610]"
            >
              Back to Home
            </Link>

            <Link
              to="/boots"
              onClick={() => clearCart()}
              className="flex-1 bg-[#255441] hover:bg-[#1d4334] transition-colors rounded-2xl py-4 px-6 text-center font-semibold text-white"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
