import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star, Plus, ThumbsDown, ThumbsUp } from "lucide-react";
import { getReviewsByProduct, getRatingsByProductId, deleteRating, deleteReview, updateReview } from "../api/review.api";
import { getUserByUserId } from "../api/user.api.js"
import { useAuth } from "../context/AuthContext"
export default function ProductReviews() {

  const navigate = useNavigate();
    const { productId } = useParams();
    const [likedReviews, setLikedReviews] = useState({});
    const [dislikedReviews, setDisLikedReviews] = useState({});
    const [rating, setRating] = useState(0)
    const [users, setUsers] = useState({})
    const { user } = useAuth()
    const [reviews, setReviews] = useState([])
  useEffect(() => {
    async function loadReviews() {
      const [resReviews, resRating] = await Promise.all([
        getReviewsByProduct(productId),
        getRatingsByProductId(productId)
      ]);
      console.log(resReviews.data.data)
      const datas = await Promise.all(
        resReviews.data.data.map(async (data) => {

          const userProfile = await getUserDetails(data.userId);
          const { _id, ...userWithoutId } = userProfile.data.data;
          console.log(userProfile)
          return {
            ...data,
            ...userWithoutId
          };
        })
      );

      setReviews(datas);
      setRating(resRating.data.data);
    }
    loadReviews()
  },[]);
  const deleteReviewRating = async (review) => {
    const [resReview, resRating] = await Promise.all([
      deleteRating(review._id),
      deleteReview(review._id)
    ])
  }
  const getUserDetails = (userId) => {
    const userDetail = getUserByUserId(userId);
    return userDetail
  }
  const handleIncreaseLikes = async (
  review
) => {

  if (dislikedReviews[review._id])
    return;

  let updatedReview = null;

  if (!likedReviews[review._id]) {

    setLikedReviews((prev) => ({
      ...prev,
      [review._id]: true
    }));

    updatedReview = reviews
      .map((rev) =>

        rev._id === review._id
          ? {
              ...rev,
              likes: rev.likes + 1
            }
          : rev
      )
      .find(
        (rev) =>
          rev._id === review._id
      );

  } else {

    setLikedReviews((prev) => ({
      ...prev,
      [review._id]: false
    }));

    updatedReview = reviews
      .map((rev) =>

        rev._id === review._id
          ? {
              ...rev,
              likes: rev.likes - 1
            }
          : rev
      )
      .find(
        (rev) =>
          rev._id === review._id
      );
  }

  setReviews((prevReviews) =>
    prevReviews.map((rev) =>
      rev._id === review._id
        ? updatedReview
        : rev
    )
  );

  const res =
    await updateReview(
      review._id,
      updatedReview
    );

  console.log(res.data.data);
};

  const handleDecreaseLikes = async (
      review
    ) => {

      if (likedReviews[review._id])
        return;

      let updatedReview = null;

      if (!dislikedReviews[review._id]) {

        setDisLikedReviews((prev) => ({
          ...prev,
          [review._id]: true
        }));

        updatedReview = reviews
          .map((rev) =>

            rev._id === review._id
              ? {
                  ...rev,
                  dislikes:
                    rev.dislikes + 1
                }
              : rev
          )
          .find(
            (rev) =>
              rev._id === review._id
          );

      } else {

        setDisLikedReviews((prev) => ({
          ...prev,
          [review._id]: false
        }));

        updatedReview = reviews
          .map((rev) =>

            rev._id === review._id
              ? {
                  ...rev,
                  dislikes:
                    rev.dislikes - 1
                }
              : rev
          )
          .find(
            (rev) =>
              rev._id === review._id
          );
      }

      setReviews((prevReviews) =>
        prevReviews.map((rev) =>
          rev._id === review._id
            ? updatedReview
            : rev
        )
      );

      const res =
        await updateReview(
          review._id,
          updatedReview
        );

      console.log(res.data.data);
    };
  const handleNavigateAddReview = () => {
    navigate(`/products/${productId}/reviews/form`)
  }
  const handleNavigateEditReview = (review) => {
    navigate(`/products/${productId}/reviews/${review._id}`,{ state:{ review }})
  } 

  return (

    <div className="min-h-screen bg-[#f4ede1] p-6">

      {/* HEADER */}
      <div
        className="
          bg-[#fffaf2]
          border
          border-[#d7c6ab]
          rounded-3xl
          p-6
          shadow-sm
          mb-6
        "
      >

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>

            <h1
              className="
                text-4xl
                font-bold
                text-[#2d2418]
              "
            >
              Product Reviews
            </h1>

            <p className="text-[#786754] mt-2">
              Customer ratings and feedback.
            </p>

          </div>
          <div>
          {/* BACK */}
            <button
              onClick={() => navigate(`/products/detail/${productId}`)}
              className="
                px-5
                py-3
                rounded-2xl
                border
                border-[#cdbba2]
                bg-white
                text-[#2b241c]
                hover:bg-[#f5ede1]
                transition
              "
            >
              Back
            </button>
              {/* ADD REVIEW BUTTON */}
              <button
                onClick={handleNavigateAddReview}
                className="
                  flex
                  items-center
                  gap-2
                  px-5
                  py-3
                  rounded-2xl
                  bg-[#3d2c1d]
                  text-white
                  font-medium
                  hover:bg-[#2a1f15]
                  transition
                "
              >
                <Plus size={18} />
                Add Review
              </button>
          </div>

        </div>

      </div>

      {/* REVIEW LIST */}
      <div className="space-y-5">

        {[...reviews].sort((a, b) => {
                  // current user review first
                  if (a.userId === user.id) return -1;
                  if (b.userId === user.id) return 1;
                  // newest reviews next
                  return (
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                  );
                }).map((review, index) => (

          <div
            key={index}
            className="
              bg-[#fffaf2]
              border
              border-[#d7c6ab]
              rounded-3xl
              p-6
              shadow-sm
            "
          >
            <div className="flex items-center gap-3">

                <img
                  src={review.profileImage}
                  alt="user profile"
                  className="
                    w-12
                    h-12
                    rounded-full
                    object-cover
                    border
                    border-[#d7c6ab]
                  "
                />

                <div className="flex flex-col">

                  <span
                    className="
                      text-lg
                      font-bold
                      text-[#2d2418]
                    "
                  >
                    { (review.userId === user.id) ? "You" : review.firstName + " " + review.lastName }
                  </span>

                </div>

              </div>

            {/* TOP */}
            <div className="flex items-start justify-between gap-4">
              
              <div className="flex-1">

                {/* REVIEW TITLE */}
                {review.title && (
                  <h2
                    className="
                      text-2xl
                      font-bold
                      text-[#2d2418]
                    "
                  >
                    {review.title}
                  </h2>
                )}

                {/* REVIEW COMMENT */}
                <p
                  className="
                    text-[#5f5244]
                    mt-3
                    leading-relaxed
                  "
                >
                  {review.comment}
                </p>

                {/* ATTRIBUTES */}
                <div className="flex flex-wrap items-center gap-3 mt-5">

                  {/* VERIFIED PURCHASE */}
                  {review.isVerifiedPurchase && (
                    <span
                      className="
                        px-3
                        py-1
                        rounded-full
                        bg-green-100
                        text-green-700
                        text-sm
                        font-medium
                      "
                    >
                      Verified Purchase
                    </span>
                  )}

                  {/* APPROVED */}
                  {review.isApproved && (
                    <span
                      className="
                        px-3
                        py-1
                        rounded-full
                        bg-blue-100
                        text-blue-700
                        text-sm
                        font-medium
                      "
                    >
                      Approved
                    </span>
                  )}

                  {/* ACTIVE STATUS */}
                  {review.isActive ? (
                    <span
                      className="
                        px-3
                        py-1
                        rounded-full
                        bg-emerald-100
                        text-emerald-700
                        text-sm
                        font-medium
                      "
                    >
                      Active
                    </span>
                  ) : (
                    <span
                      className="
                        px-3
                        py-1
                        rounded-full
                        bg-red-100
                        text-red-700
                        text-sm
                        font-medium
                      "
                    >
                      Inactive
                    </span>
                  )}
                  {/* Likes */}
                 <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-[#f5efe6]
                      text-[#5f5244]
                      text-sm
                      font-medium
                      flex items-center gap-2
                    "
                  >
                    <button
                      onClick={() => handleIncreaseLikes(review)}
                      className="
                        p-2
                        rounded-lg
                        transition
                        hover:bg-[#ebe1d3]
                      "
                    >
                      <ThumbsUp
                        className={`
                          w-5 h-5 transition
                          ${
                            likedReviews[review._id]
                              ? "fill-[#5f5244] text-[#5f5244]"
                              : "text-[#5f5244]"
                          }
                        `}
                      />
                    </button>

                    {review.likes}
                  </span>

                  {/* DISLIKES */}
                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-[#f5efe6]
                      text-[#5f5244]
                      text-sm
                      font-medium
                      flex items-center gap-2
                    "
                  >
                    <button
                      onClick={() => handleDecreaseLikes(review)}
                      className="
                        p-2
                        rounded-lg
                        transition
                        hover:bg-[#ebe1d3]
                      "
                    >
                      <ThumbsDown
                        className={`
                          w-5 h-5 transition
                          ${
                            dislikedReviews[review._id]
                              ? "fill-[#5f5244] text-[#5f5244]"
                              : "text-[#5f5244]"
                          }
                        `}
                      />
                    </button>

                    {review.dislikes}
                  </span>

                  {/* IMAGES COUNT */}
                  {review.images?.length > 0 && (
                    <span
                      className="
                        px-3
                        py-1
                        rounded-full
                        bg-amber-100
                        text-amber-700
                        text-sm
                        font-medium
                      "
                    >
                      📷 {review.images.length} Images
                    </span>
                  )}

                </div>

              </div>

              {/* RATING */}
              <div className="flex gap-1">

                {[1, 2, 3, 4, 5].map((star, index) => (

                  <Star
                    key={index}
                    className={`
                      h-5
                      w-5

                      ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    `}
                  />

                ))}

              </div>
                {review.userId === user.id && (
                  <div className="mt-4">

                    <button
                      onClick={() => handleNavigateEditReview(review)}
                      className="
                        px-5
                        py-2.5
                        rounded-xl
                        bg-[#3d2c1d]
                        text-white
                        font-semibold
                        text-sm
                        transition
                        hover:bg-[#2a1f15]
                        hover:scale-[1.02]
                        active:scale-[0.98]
                        shadow-sm
                      "
                    >
                      Edit Review
                    </button>

                    <button
                      onClick={() => deleteReviewRating(review._id)}
                      className="
                        px-5
                        py-2.5
                        rounded-xl
                        bg-red-600
                        text-white
                        font-semibold
                        text-sm
                        transition
                        hover:bg-[#2a1f15]
                        hover:scale-[1.02]
                        active:scale-[0.98]
                        shadow-sm
                      "
                    >
                      Delete Review
                    </button>

                  </div>
                )}
                              

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}