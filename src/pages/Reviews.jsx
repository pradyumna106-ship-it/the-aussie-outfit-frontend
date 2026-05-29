import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Star, Search, ArrowLeft, Download } from "lucide-react";
import { exportToCSV } from "../utils/exportUtils";
import { useOutletContext } from "react-router-dom";
export default function Reviews() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const location = useLocation();

  const reviewsStateForm = location.state?.reviews;
  const { products } = useOutletContext();
  const [reviews, setReviews] = useState(
  reviewsStateForm || []
);

  const toggleStatus = (_id) => {

    setReviews((prev) =>

      prev.map((review) =>

        review._id === _id
          ? {
              ...review,
              isApproved:
                !review.isApproved
            }
          : review
      )
    );
  };

  const filteredReviews = reviews.filter(
    (review) =>

      review?.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      review?.comment
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f6f1e7] p-8">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        <div>
          <p className="text-sm tracking-[4px] uppercase text-[#8b7355]">
            Everything Australia
          </p>

          <h1 className="text-4xl font-bold text-[#2d241c] mt-2">
            Customer Reviews
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="
              flex
              items-center
              gap-2
              px-5
              py-3
              rounded-2xl
              border
              border-[#d8c3a5]
              bg-white
              text-[#3d2c1d]
              hover:bg-[#f1e4d2]
              transition
            "
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            onClick={() => exportToCSV(reviews, "reviews.csv")}
            className="
              flex
              items-center
              gap-2
              px-5
              py-3
              rounded-2xl
              bg-[#3d2c1d]
              text-white
              hover:bg-[#2a1f15]
              transition
            "
          >
            <Download size={18} />
            Export Reviews
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md mb-8">
        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-[#8b7355]
          "
        />

        <input
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            pl-11
            pr-4
            py-4
            rounded-2xl
            border
            border-[#d8c3a5]
            bg-white
            outline-none
            focus:ring-2
            focus:ring-[#c49b66]
          "
        />
      </div>

      {/* REVIEWS */}
      <div className="grid gap-6">
        {filteredReviews.length === 0 ? (
          <div
            className="
              bg-white
              rounded-3xl
              p-10
              text-center
              shadow-sm
            "
          >
            <p className="text-[#7b6a58] text-lg">
              No reviews found
            </p>
          </div>
        ) : (
          filteredReviews.map((review, index) => (
            <div
              key={index}
              className="
                bg-white
                rounded-3xl
                p-6
                shadow-sm
                border
                border-[#eadfce]
              "
            >
              {/* TOP */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div>
                  <h2 className="text-2xl font-semibold text-[#2d241c]">
                    {review?.title || "Untitled Review"}
                  </h2>

                  <p className="text-[#8b7355] mt-1">
                    by User ID: {review?.userId}
                            •
                            {new Date(
                              review?.createdAt
                            ).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-medium
                    w-fit
                    ${
                      review?.isApproved
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {review?.isApproved
                  ? "APPROVED"
                  : "HIDDEN"}
                </span>
              </div>

              {/* RATING */}
              <div className="flex gap-1 mt-5">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className={
                      index < review?.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              {/* COMMENT */}
              <p className="text-[#5f5143] leading-7 mt-5">
                {review?.comment}
              </p>
              {review?.images?.length > 0 && (

              <div className="flex gap-3 mt-5 flex-wrap">

                {review.images.map(
                  (image, index) => (

                    <img
                      key={index}
                      src={image}
                      alt="review"
                      className="
                        w-24
                        h-24
                        rounded-2xl
                        object-cover
                        border
                        border-[#eadfce]
                      "
                    />

                  )
                )}

              </div>
            )}

              {/* ACTIONS */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => toggleStatus(review._id || review.id)}
                  className={`
                    px-5
                    py-3
                    rounded-2xl
                    text-sm
                    font-medium
                    transition
                    ${
                      review?.isApproved
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }
                  `}
                >
                  {review?.isApproved
                    ? "Hide Review"
                    : "Approve Review"}
                </button>

                <button
                  onClick={() => navigate(`/admin/products/${review.productId}`, { state: { product: products.find((p) => p._id === review.productId) } })}
                  className="
                    px-5
                    py-3
                    rounded-2xl
                    border
                    border-[#d8c3a5]
                    text-[#3d2c1d]
                    hover:bg-[#f5eadc]
                    transition
                  "
                >
                  View Product
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}