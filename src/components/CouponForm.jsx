import { useState, useEffect } from "react";

export default function CouponForm({
  initialData,
  onSubmit,
  loading
}) {
  useEffect(() => {

  if (initialData) {

    setFormData({
      code: initialData?.code || "",
      title: initialData?.title || "",
      description:
        initialData?.description || "",

      discountType:
        initialData?.discountType ||
        "percentage",

      discountValue:
        initialData?.discountValue || 0,

      maxDiscountAmount:
        initialData?.maxDiscountAmount || 0,

      minimumOrderAmount:
        initialData?.minimumOrderAmount || 0,

      usageLimit:
        initialData?.usageLimit || 1,

      usageLimitPerUser:
        initialData?.usageLimitPerUser || 1,

      startsAt:
        initialData?.startsAt
          ? new Date(initialData.startsAt)
              .toISOString()
              .slice(0, 16)
          : "",

      expiresAt:
        initialData?.expiresAt
          ? new Date(initialData.expiresAt)
              .toISOString()
              .slice(0, 16)
          : "",

      status:
        initialData?.status || "draft"
    });

  }

}, [initialData]);
  const [formData, setFormData] = useState({
    code: initialData?.code || "",
    title: initialData?.title || "",
    description:
      initialData?.description || "",

    discountType:
      initialData?.discountType ||
      "percentage",

    discountValue:
      initialData?.discountValue || 0,

    maxDiscountAmount:
      initialData?.maxDiscountAmount || 0,

    minimumOrderAmount:
      initialData?.minimumOrderAmount || 0,

    usageLimit:
      initialData?.usageLimit || 1,

    usageLimitPerUser:
      initialData?.usageLimitPerUser || 1,

    startsAt:
      initialData?.startsAt
        ? initialData.startsAt.slice(0, 16)
        : "",

    expiresAt:
      initialData?.expiresAt
        ? initialData.expiresAt.slice(0, 16)
        : "",

    status:
      initialData?.status || "draft"
  });
    const generateCouponCode = (
      title
    ) => {
  
      if (!title) return "";
  
      const cleaned =
        title
          .toUpperCase()
          .replace(/[^A-Z0-9 ]/g, "")
          .trim()
          .split(" ")
          .join("-");
  
      const random =
        Math.floor(
          1000 + Math.random() * 9000
        );
  
      return `${cleaned}-${random}`;
  
    };
  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked
    } = e.target;
     
      const updatedFormData = {
        ...formData,
        [name]: type === "checkbox"
          ? checked
          : value
      };

      // AUTO GENERATE COUPON CODE
      if (name === "title") {

        updatedFormData.code =
          generateCouponCode(value);

      }

      setFormData(updatedFormData);
    };

  return (

    <div className="
          space-y-6
          bg-white
          p-8
          rounded-3xl
          border
          border-[#e7dcc8]
        ">

          {/* CODE */}
          <div>

            <label className="block mb-2 font-medium">
              Coupon Code
            </label>

            <input
                type="text"
                name="code"
                value={formData.code}
                readOnly
                className="
                  w-full
                  border
                  rounded-2xl
                  px-4
                  py-3
                  bg-[#f5f1e8]
                  text-[#5f5647]
                  cursor-not-allowed
                "
              />

          </div>

          {/* TITLE */}
          <div>

            <label className="block mb-2 font-medium">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="
                w-full
                border
                rounded-2xl
                px-4
                py-3
              "
            />

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="
                w-full
                border
                rounded-2xl
                px-4
                py-3
              "
            />

          </div>

          {/* DISCOUNT TYPE */}
          <div>

            <label className="block mb-2 font-medium">
              Discount Type
            </label>

            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="
                w-full
                border
                rounded-2xl
                px-4
                py-3
              "
            >

              <option value="percentage">
                Percentage
              </option>

              <option value="fixed">
                Fixed
              </option>

            </select>

          </div>

          {/* DISCOUNT VALUE */}
          <div>

            <label className="block mb-2 font-medium">
              Discount Value
            </label>

            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              className="
                w-full
                border
                rounded-2xl
                px-4
                py-3
              "
            />

          </div>

          {/* MAX DISCOUNT */}
          <div>

            <label className="block mb-2 font-medium">
              Max Discount Amount
            </label>

            <input
              type="number"
              name="maxDiscountAmount"
              value={formData.maxDiscountAmount}
              onChange={handleChange}
              className="
                w-full
                border
                rounded-2xl
                px-4
                py-3
              "
            />

          </div>

          {/* MINIMUM ORDER */}
          <div>

            <label className="block mb-2 font-medium">
              Minimum Order Amount
            </label>

            <input
              type="number"
              name="minimumOrderAmount"
              value={formData.minimumOrderAmount}
              onChange={handleChange}
              className="
                w-full
                border
                rounded-2xl
                px-4
                py-3
              "
            />

          </div>

          {/* USAGE LIMIT */}
          <div>

            <label className="block mb-2 font-medium">
              Usage Limit
            </label>

            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              className="
                w-full
                border
                rounded-2xl
                px-4
                py-3
              "
            />

          </div>

          {/* USAGE PER USER */}
          <div>

            <label className="block mb-2 font-medium">
              Usage Limit Per User
            </label>

            <input
              type="number"
              name="usageLimitPerUser"
              value={formData.usageLimitPerUser}
              onChange={handleChange}
              className="
                w-full
                border
                rounded-2xl
                px-4
                py-3
              "
            />

          </div>

          {/* START DATE */}
          <div>

            <label className="block mb-2 font-medium">
              Starts At
            </label>

            <input
              type="date"
              name="startsAt"
              value={formData.startsAt}
              onChange={handleChange}
              className="
                w-full
                border
                rounded-2xl
                px-4
                py-3
              "
            />

          </div>

          {/* EXPIRES DATE */}
          <div>

            <label className="block mb-2 font-medium">
              Expires At
            </label>

            <input
              type="date"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              className="
                w-full
                border
                rounded-2xl
                px-4
                py-3
              "
            />

          </div>

          {/* STATUS */}
          <div>

            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="
                w-full
                border
                rounded-2xl
                px-4
                py-3
              "
            >

              <option value="draft">
                Draft
              </option>

              <option value="active">
                Active
              </option>

              <option value="paused">
                Paused
              </option>

              <option value="expired">
                Expired
              </option>

            </select>

          </div>

          {/* SUBMIT */}
          <button
            type="button"
            onClick={() => onSubmit(formData)}
            disabled={loading}
            className="
              bg-[#255441]
              hover:bg-[#1d4334]
              text-white
              px-6
              py-3
              rounded-2xl
              transition
            "
          >

            {
              loading
                ? "Saving..."
                : "Save Coupon"
            }

          </button>

        </div>
  );

}