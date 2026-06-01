import { useState, useEffect } from "react";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useCart } from '../context/CartContext';
import { getRatingsByProductId } from "../api/review.api.js"
import { toast } from 'sonner';
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { getProductById } from "../api/product.api.js";
import { useFavourite } from "../context/FavouriteContext"
export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart()
  //const { products } = useOutletContext();
  const location = useLocation()
  const product = location.state?.product
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
    const { toggleFavourite, isFavourite } = useFavourite();
    const fav = product ? isFavourite(product._id) : false;
  console.log("Product from state:", product);
  useEffect(() => {
    async function fetchProduct() {
      setLoading(false);
      const res = await getRatingsByProductId(id);
        console.log("rating: ",res.data)
        setRating(res.data.averageRating);
        if (!product) {
          setLoading(true);
          await getProductById(id)
            .then((res) => {
              setLoading(false);
              if (res.data) {
                // Update the product state with the fetched data
                setProduct(res.data);
              } else {
                toast.error("Product not found");
                navigate("/products");
              }
            })
            .catch((err) => {
              setLoading(false);
              toast.error("Failed to fetch product details");
              navigate("/products");
            });
            
        }
        }
    fetchProduct()
  }, []);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    for (let index = 0; index < quantity; index++) {
      addToCart(product);
    }
    toast.success(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to cart!`);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f6f1e6] flex items-center justify-center">
        <h1 className="text-2xl font-semibold text-[#245441]">
          Product not found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f1e6] px-4 md:px-8 lg:px-14 py-8">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 text-[#245441] hover:text-[#1c4032] transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />

        <span className="font-medium">
          Back to Products
        </span>
      </button>

      {/* MAIN SECTION */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* IMAGE */}
        <div className="bg-[#fffcf6] rounded-2xl border border-[#cec3ad] overflow-hidden">
          <div className="aspect-square bg-[#e8dcc8] flex items-center justify-center relative">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white px-6 py-3 rounded-full font-semibold">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex flex-col">
          {/* CATEGORY */}
          <div className="mb-4">
            <span className="inline-block bg-[#245441] text-white px-4 py-1 rounded-full text-sm font-medium">
              {product.category}
            </span>
          </div>

          {/* TITLE */}
          <h1 className="text-4xl lg:text-5xl font-bold text-[#1d1d1d] leading-tight mb-5">
            {product.name}
          </h1>

          {/* RATING */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${
                    index < Math.floor(rating)
                      ? "fill-[#c8821a] text-[#c8821a]"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <span className="text-[#6b6257]">
              {rating} out of 5
            </span>
          </div>

          {/* PRICE */}
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-[#245441]">
              AUD ${product.basePrice}
            </h2>
          </div>

          {/* DESCRIPTION */}
          <p className="text-[#5f564a] text-lg leading-relaxed mb-8">
            {product.description}
          </p>

          {/* QUANTITY */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b6257] mb-3">
              Quantity
            </h3>

            <div className="flex items-center gap-4">
              <button
                onClick={decrementQuantity}
                className="w-11 h-11 rounded-xl border border-[#cec3ad] bg-white flex items-center justify-center hover:bg-[#f3ede3] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="text-2xl font-semibold w-10 text-center">
                {quantity}
              </span>

              <button
                onClick={incrementQuantity}
                className="w-11 h-11 rounded-xl border border-[#cec3ad] bg-white flex items-center justify-center hover:bg-[#f3ede3] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

                    {/* ACTION BUTTONS */}
          <div className="flex gap-4 mb-10">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-[#245441] hover:bg-[#beb078] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg font-semibold"
            >
              <ShoppingCart className="w-5 h-5 text-[#FFFDF6]" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={() => toggleFavourite(product)}
              className="w-14 h-14 rounded-xl border border-[#cec3ad] bg-white flex items-center justify-center hover:bg-[#f3ede3] transition-colors"
            >
              <Heart
                  className={`w-6 h-6 transition-colors ${
                    isFavourite(product?._id)
                      ? "fill-red-500 text-red-500"
                      : "text-[#5f564a]"
                  }`}
                />
            </button>
            <button
              onClick={() => navigate(`/products/${id}/reviews`)}
              className="
                px-5
                py-3
                rounded-2xl
                bg-[#3d2c1d]
                text-white
                font-semibold
                shadow-sm
                transition
                hover:bg-[#2a1f15]
                hover:scale-[1.02]
                active:scale-[0.98]
              "
            >
              <span>Reviews</span>
            </button>
          </div>

          {/* FEATURES */}
          <div className="border-t border-[#cec3ad] pt-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#e6f0ec] p-2 rounded-full">
                <Truck className="w-5 h-5 text-[#245441]" />
              </div>

              <div>
                <h3 className="font-semibold text-[#1d1d1d] mb-1">
                  Free Shipping
                </h3>

                <p className="text-[#6b6257] text-sm">
                  Free Australia-wide shipping on eligible
                  orders.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#e6f0ec] p-2 rounded-full">
                <RotateCcw className="w-5 h-5 text-[#245441]" />
              </div>

              <div>
                <h3 className="font-semibold text-[#1d1d1d] mb-1">
                  90 Day Returns
                </h3>

                <p className="text-[#6b6257] text-sm">
                  Easy returns with hassle-free exchanges.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#e6f0ec] p-2 rounded-full">
                <ShieldCheck className="w-5 h-5 text-[#245441]" />
              </div>

              <div>
                <h3 className="font-semibold text-[#1d1d1d] mb-1">
                  Authentic Australian Quality
                </h3>

                <p className="text-[#6b6257] text-sm">
                  Trusted workwear and boots built for
                  durability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}