import React, { useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  createReview,
  createOrUpdateRating,
  updateReview
} from "../api/review.api";

import { useAuth } from "../context/AuthContext";

export default function ProductReviewPage() {

  const location = useLocation();

  const review = location.state?.review;
  const navigate = useNavigate()
  const productName = location.state?.name;

  const { productId, id } = useParams();

  const { user } = useAuth();

  const [title, setTitle] = useState(review?.title || "");

  const [comment, setComment] = useState(review?.comment || "");

  const [rating, setRating] = useState(review?.rating || 0);

  const [images, setImages] = useState(review?.images || []);

  const handleFileChange = (e) => {

    const files = Array.from(e.target.files);

    setImages(files);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const payload = {
        productId: productId,
        userId: user.id,
        title,
        comment,
        images,
        likes: review?.likes || 0,
        dislikes: review?.dislikes || 0,
        isVerifiedPurchase:
          review?.isVerifiedPurchase || false,
        isApproved: true,
        isActive: true
      };

      let reviewId = id;
      console.log('view what have missed: ',payload)
      // CREATE REVIEW
      if (!id) {

        const reviewRes =
          await createReview(payload);

        console.log(reviewRes);

        reviewId =
          reviewRes?.data?.data?._id;
      }

      // UPDATE REVIEW
      else {

        const reviewRes =
          await updateReview(id, payload);

        console.log(reviewRes);

        reviewId =
          reviewRes?.data?.data?._id;
      }

      // CREATE / UPDATE RATING
      const ratingPayload = {
        reviewId,
        productId:productId,
        userId: user.id,
        rating
      };

      const ratingRes =
        await createOrUpdateRating(
          ratingPayload
        );

      console.log(ratingRes);

      setTitle("");
      setComment("");
      setRating(0);
      setImages([]);

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <div className="min-h-screen bg-[#f4ede1] p-6 flex justify-center items-center">

      <div
        className="
          w-full
          max-w-2xl
          bg-[#fffaf2]
          border
          border-[#d7c6ab]
          rounded-3xl
          shadow-sm
          p-8
        "
      >
        {/* BACK BUTTON */}
              <button
                onClick={() => navigate(`/products/${productId}/reviews`)}
                className="flex items-center gap-2 text-[#245441] hover:text-[#1c4032] transition-colors mb-8"
              >
                <ArrowLeft className="w-5 h-5" />
        
                <span className="font-medium">
                  Back to Reviews
                </span>
              </button>

        <h1
          className="
            text-4xl
            font-bold
            text-[#2d2418]
            mb-2
          "
        >
          {productName || 'Product Review'}
        </h1>

        <p className="text-[#786754] mb-8">
          Share your experience about the product.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* TITLE */}
          <div>

            <label
              className="
                block
                mb-2
                font-semibold
                text-[#2d2418]
              "
            >
              Review Title
            </label>

            <input
              type="text"
              placeholder="Enter review title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="
                w-full
                px-4
                py-3
                rounded-2xl
                border
                border-[#ccb89c]
                bg-white
                outline-none
                focus:ring-2
                focus:ring-[#8b5e34]
              "
            />

          </div>

          {/* RATING */}
          <div>

            <label
              className="
                block
                mb-3
                font-semibold
                text-[#2d2418]
              "
            >
              Rating
            </label>

            <div className="flex gap-2">

              {[1, 2, 3, 4, 5].map((star) => (

                <Star
                  key={star}
                  onClick={() => setRating(star)}
                  className={`
                    h-8
                    w-8
                    cursor-pointer
                    transition

                    ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  `}
                />

              ))}

            </div>

          </div>

          {/* COMMENT */}
          <div>

            <label
              className="
                block
                mb-2
                font-semibold
                text-[#2d2418]
              "
            >
              Comment
            </label>

            <textarea
              rows={5}
              placeholder="Write your review..."
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              className="
                w-full
                px-4
                py-3
                rounded-2xl
                border
                border-[#ccb89c]
                bg-white
                outline-none
                resize-none
                focus:ring-2
                focus:ring-[#8b5e34]
              "
            />

          </div>
          {/* IMAGE UPLOAD */}
          <div>

            <label
              className="
                block
                mb-3
                font-semibold
                text-[#2d2418]
              "
            >
              Upload Images
            </label>

            <div className="flex items-center gap-4">

              <label
                htmlFor="imageUpload"
                className="
                  inline-flex
                  items-center
                  justify-center
                  px-5
                  py-3
                  rounded-2xl
                  bg-[#3d2c1d]
                  text-white
                  font-medium
                  cursor-pointer
                  transition
                  hover:bg-[#2a1f15]
                "
              >
                Upload Image
              </label>

              <span className="text-sm text-[#786754]">
                {images.length > 0
                  ? `${images.length} file(s) selected`
                  : "No files selected"}
              </span>

            </div>

            <input
              id="imageUpload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="
              w-full
              py-4
              rounded-2xl
              bg-[#3d2c1d]
              text-white
              font-semibold
              hover:bg-[#2a1f15]
              transition
            "
          >
            Submit Review
          </button>

        </form>

      </div>

    </div>
  );
}