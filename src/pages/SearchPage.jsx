import React, {
  useMemo,
  useState,
} from "react";

import {
  Search,
  ArrowLeft,
} from "lucide-react";

import {
  useNavigate,
  useOutletContext,
} from "react-router-dom";

import ProductCard from "../components/ProductCard";

const SearchPage = () => {
  const navigate = useNavigate();

  // REAL PRODUCTS FROM LAYOUT / CONTEXT
  const { products = [] } =
    useOutletContext();

  const [query, setQuery] =
    useState("");

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts =
    useMemo(() => {
      const search =
        query.toLowerCase();

      return products.filter(
        (product) => {
          return (
            product.name
              ?.toLowerCase()
              .includes(search) ||

            product.description
              ?.toLowerCase()
              .includes(search) ||

            product.tags?.some((tag) =>
              tag
                ?.toLowerCase()
                .includes(search)
            )
          );
        }
      );
    }, [query, products]);

  return (
    <div className="min-h-screen bg-[#f5f1e8]">

      {/* HERO */}

      <div className="bg-[#255441] py-16 px-4">
        <div className="max-w-7xl mx-auto">

          <h1
            className="
              text-4xl
              md:text-5xl
              font-bold
              text-white
              tracking-wide
              mb-4
            "
          >
            Search Products
          </h1>

          <p
            className="
              text-[#d8ccb7]
              text-lg
              max-w-2xl
            "
          >
            Explore premium Australian
            boots, hats, workwear and
            accessories.
          </p>
        </div>
      </div>

      {/* CONTENT */}

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          py-10
        "
      >

        {/* SEARCH BAR */}

        <div
          className="
            bg-white
            border
            border-[#e7dfcf]
            rounded-2xl
            shadow-lg
            p-5
            mb-10
          "
        >

          <div
            className="
              flex
              flex-col
              md:flex-row
              gap-4
            "
          >

            {/* INPUT */}

            <div className="relative flex-1">

              <Search
                size={20}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) =>
                  setQuery(
                    e.target.value
                  )
                }
                className="
                  w-full
                  h-14
                  rounded-xl
                  border
                  border-gray-300
                  bg-[#faf8f3]
                  pl-12
                  pr-4
                  outline-none
                  focus:border-[#255441]
                  focus:ring-2
                  focus:ring-[#255441]/20
                  transition
                "
              />
            </div>

            {/* BACK BUTTON */}

            <button
              onClick={() =>
                navigate(-1)
              }
              className="
                h-14
                px-6
                rounded-xl
                bg-[#255441]
                text-white
                font-medium
                hover:bg-[#1d3f31]
                transition
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
        </div>

        {/* RESULT COUNT */}

        <div className="mb-8">

          <h2
            className="
              text-2xl
              font-bold
              text-[#255441]
            "
          >
            Search Results
          </h2>

          <p className="text-gray-600 mt-1">
            {filteredProducts.length}
            {" "}
            products found
          </p>
        </div>

        {/* PRODUCTS */}

        {filteredProducts.length === 0 ? (

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-[#e7dfcf]
              shadow-md
              py-20
              text-center
            "
          >

            <Search
              size={60}
              className="
                mx-auto
                text-[#cbb89b]
                mb-5
              "
            />

            <h3
              className="
                text-3xl
                font-bold
                text-[#255441]
                mb-3
              "
            >
              No Products Found
            </h3>

            <p className="text-gray-600">
              Try another search term.
            </p>
          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              gap-8
            "
          >

            {filteredProducts.map(
              (product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={() =>
                    navigate(
                      `/products/detail/${product._id}`,
                      {
                        state: {
                          product,
                        },
                      }
                    )
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;