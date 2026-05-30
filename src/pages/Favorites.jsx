
import { useFavourite } from "../context/FavouriteContext";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
export default function Favorites() {
    const navigate = useNavigate()
    const { favourites, } = useFavourite();
    const handleNavigate = (product) => {
        navigate(`/products/detail/${product._id}`, { state: { product } });
    }
  return (

  <div className="min-h-screen bg-[#f4ede1]">

    {/* HEADER */}
    <div
      className="
        bg-[#3d2c1d]
        text-white
        px-6
        py-8
        shadow-sm
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          flex
          items-center
          justify-between
          gap-4
        "
      >

        <div>

          <h1
            className="
              text-4xl
              font-bold
              tracking-wide
            "
          >
            Your Favourites ❤️
          </h1>

          <p
            className="
              text-[#d7c6ab]
              mt-2
            "
          >
            Save the Australian styles you love.
          </p>

        </div>

        <button
          onClick={() => navigate("/")}
          className="
            px-5
            py-3
            rounded-2xl
            bg-[#fffaf2]
            text-[#3d2c1d]
            font-semibold
            transition
            hover:bg-[#f5efe6]
          "
        >
          Back To Home
        </button>

      </div>

    </div>

    {/* CONTENT */}
    <div
      className="
        max-w-7xl
        mx-auto
        px-6
        py-10
      "
    >

      {favourites.length === 0 ? (

        <div
          className="
            bg-[#fffaf2]
            border
            border-[#d7c6ab]
            rounded-3xl
            p-14
            text-center
            shadow-sm
          "
        >

          <div className="text-6xl mb-4">
            🤍
          </div>

          <h2
            className="
              text-3xl
              font-bold
              text-[#2d2418]
            "
          >
            No favourites yet
          </h2>

          <p
            className="
              text-[#786754]
              mt-3
            "
          >
            Explore Everything Australia and
            save your favourite products.
          </p>

          <button
            onClick={() => navigate("/")}
            className="
              mt-6
              px-6
              py-3
              rounded-2xl
              bg-[#3d2c1d]
              text-white
              font-semibold
              transition
              hover:bg-[#2a1f15]
            "
          >
            Explore Products
          </button>

        </div>

      ) : (

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-8
          "
        >

          {favourites.map((product, index) => (

            <div
              key={index}
              className="
                transform
                transition
                hover:-translate-y-1
              "
            >

              <ProductCard
                product={product}
                onClick={() =>
                  handleNavigate(product)
                }
              />

            </div>

          ))}

        </div>

      )}

    </div>

  </div>
)
}