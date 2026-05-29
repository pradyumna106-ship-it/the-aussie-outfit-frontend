import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  ArrowLeft,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Package,
  DollarSign,
  Boxes,
  ShoppingBag,
  Pencil,
  Trash2
} from "lucide-react";

export default function ProductView() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const product =
    location.state?.product;

  if (!product) {

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
          Product Not Found
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
          Back to Dashboard
        </span>

      </button>

      {/* MAIN */}
      <div
        className="
          grid
          lg:grid-cols-2
          gap-10
        "
      >

        {/* IMAGE */}
        <div
          className="
            bg-[#fffcf6]
            rounded-3xl
            border
            border-[#d7c6ab]
            overflow-hidden
            shadow-sm
          "
        >

          <div
            className="
              aspect-square
              bg-[#e8dcc8]
              relative
            "
          >

            <img
              src={product.images?.[0]}
              alt={product.name}
              className="
                w-full
                h-full
                object-cover
              "
            />

            {product.stock === 0 && (

              <div
                className="
                  absolute
                  inset-0
                  bg-black/50
                  flex
                  items-center
                  justify-center
                "
              >

                <span
                  className="
                    bg-white
                    px-6
                    py-3
                    rounded-full
                    font-semibold
                  "
                >
                  Out Of Stock
                </span>

              </div>
            )}

          </div>

        </div>

        {/* INFO */}
        <div className="flex flex-col">

          {/* CATEGORY */}
          <div className="mb-4">

            <span
              className="
                inline-block
                bg-[#245441]
                text-white
                px-4
                py-1
                rounded-full
                text-sm
                font-medium
              "
            >
              {
                product.categoryId?.name ||
                "Category"
              }
            </span>

          </div>

          {/* TITLE */}
          <h1
            className="
              text-4xl
              lg:text-5xl
              font-bold
              text-[#1d1d1d]
              leading-tight
              mb-5
            "
          >
            {product.name}
          </h1>

          {/* RATING */}
          <div
            className="
              flex
              items-center
              gap-3
              mb-6
            "
          >

            <div
              className="
                flex
                items-center
                gap-1
              "
            >

              {[1, 2, 3, 4, 5].map(
                (star, index) => (

                <Star
                  key={index}
                  className={`
                    w-5
                    h-5
                    ${
                      star <= 4
                        ? "fill-[#c8821a] text-[#c8821a]"
                        : "text-gray-300"
                    }
                  `}
                />

              ))}

            </div>

            <span className="text-[#6b6257]">
              Admin Product Overview
            </span>

          </div>

          {/* PRICE */}
          <div className="mb-6">

            <h2
              className="
                text-4xl
                font-bold
                text-[#245441]
              "
            >
              AUD $
              {
                product.basePrice ||
                product.price
              }
            </h2>

          </div>

          {/* DESCRIPTION */}
          <p
            className="
              text-[#5f564a]
              text-lg
              leading-relaxed
              mb-8
            "
          >
            {product.description}
          </p>

          {/* PRODUCT DETAILS */}
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
              mb-8
            "
          >

            <div
              className="
                bg-white
                border
                border-[#d7c6ab]
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
                  SKU
                </h3>

              </div>

              <p className="text-[#5f564a]">
                {product.sku || "N/A"}
              </p>

            </div>

            <div
              className="
                bg-white
                border
                border-[#d7c6ab]
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

                <Boxes
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
                  Stock
                </h3>

              </div>

              <p className="text-[#5f564a]">
                {product.stock}
              </p>

            </div>

            <div
              className="
                bg-white
                border
                border-[#d7c6ab]
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

                <ShoppingBag
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
                  Brand
                </h3>

              </div>

              <p className="text-[#5f564a]">
                {
                  product.brandId?.name ||
                  "N/A"
                }
              </p>

            </div>

            <div
              className="
                bg-white
                border
                border-[#d7c6ab]
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

                <DollarSign
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
                  Status
                </h3>

              </div>

              <p className="text-[#5f564a]">
                {
                  product.stock > 0
                    ? "Available"
                    : "Unavailable"
                }
              </p>

            </div>

          </div>

          {/* ACTIONS */}
          <div
            className="
              flex
              flex-wrap
              gap-4
              mb-10
            "
          >

            <button
              onClick={() =>
                navigate(
                  `/admin/products/edit-product/${product._id}`,
                  {
                    state: {
                      product
                    }
                  }
                )
              }
              className="
                flex
                items-center
                gap-2
                px-6
                py-4
                rounded-2xl
                bg-[#245441]
                text-white
                font-semibold
                hover:bg-[#1c4032]
                transition
              "
            >

              <Pencil
                className="
                  w-5
                  h-5
                "
              />

              Edit Product

            </button>

            <button
              className="
                flex
                items-center
                gap-2
                px-6
                py-4
                rounded-2xl
                bg-red-600
                text-white
                font-semibold
                hover:bg-red-700
                transition
              "
            >

              <Trash2
                className="
                  w-5
                  h-5
                "
              />

              Delete Product

            </button>

            <button
              onClick={() =>
                navigate(
                  `/products/${product._id}/reviews`
                )
              }
              className="
                px-6
                py-4
                rounded-2xl
                bg-[#3d2c1d]
                text-white
                font-semibold
                hover:bg-[#2a1f15]
                transition
              "
            >
              View Reviews
            </button>

          </div>

          {/* FEATURES */}
          <div
            className="
              border-t
              border-[#cec3ad]
              pt-8
              space-y-6
            "
          >

            <div
              className="
                flex
                items-start
                gap-4
              "
            >

              <div
                className="
                  bg-[#e6f0ec]
                  p-2
                  rounded-full
                "
              >

                <Truck
                  className="
                    w-5
                    h-5
                    text-[#245441]
                  "
                />

              </div>

              <div>

                <h3
                  className="
                    font-semibold
                    text-[#1d1d1d]
                    mb-1
                  "
                >
                  Shipping Enabled
                </h3>

                <p
                  className="
                    text-[#6b6257]
                    text-sm
                  "
                >
                  Product available for
                  Australia-wide delivery.
                </p>

              </div>

            </div>

            <div
              className="
                flex
                items-start
                gap-4
              "
            >

              <div
                className="
                  bg-[#e6f0ec]
                  p-2
                  rounded-full
                "
              >

                <RotateCcw
                  className="
                    w-5
                    h-5
                    text-[#245441]
                  "
                />

              </div>

              <div>

                <h3
                  className="
                    font-semibold
                    text-[#1d1d1d]
                    mb-1
                  "
                >
                  Return Policy
                </h3>

                <p
                  className="
                    text-[#6b6257]
                    text-sm
                  "
                >
                  Easy return management
                  available for admins.
                </p>

              </div>

            </div>

            <div
              className="
                flex
                items-start
                gap-4
              "
            >

              <div
                className="
                  bg-[#e6f0ec]
                  p-2
                  rounded-full
                "
              >

                <ShieldCheck
                  className="
                    w-5
                    h-5
                    text-[#245441]
                  "
                />

              </div>

              <div>

                <h3
                  className="
                    font-semibold
                    text-[#1d1d1d]
                    mb-1
                  "
                >
                  Admin Verified Product
                </h3>

                <p
                  className="
                    text-[#6b6257]
                    text-sm
                  "
                >
                  Product approved and
                  verified in inventory.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}