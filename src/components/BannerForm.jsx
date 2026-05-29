import { ArrowLeft } from "lucide-react";
import {
  useEffect,
  useState
} from "react";

export default function BannerForm({
  initialData,
  onSubmit,
  loading
}) {

  const [formData, setFormData] =
    useState({
      title: "",
      subtitle: "",
      imageUrl: "",
      mobileImageUrl: "",
      targetUrl: "",
      placement: "home-hero",
      sortOrder: 0,
      startsAt: "",
      expiresAt: "",
      status: "draft",
      image: null,
      mobileImage: null
    });

  const [preview, setPreview] =
    useState("");

  const [mobilePreview, setMobilePreview] =
    useState("");

  useEffect(() => {

    if (initialData) {

      setFormData({
        title:
          initialData?.title || "",

        subtitle:
          initialData?.subtitle || "",

        imageUrl:
          initialData?.imageUrl || "",

        mobileImageUrl:
          initialData?.mobileImageUrl || "",

        targetUrl:
          initialData?.targetUrl || "",

        placement:
          initialData?.placement ||
          "home-hero",

        sortOrder:
          initialData?.sortOrder || 0,

        startsAt:
          initialData?.startsAt
            ? initialData.startsAt.slice(0, 10)
            : "",

        expiresAt:
          initialData?.expiresAt
            ? initialData.expiresAt.slice(0, 10)
            : "",

        status:
          initialData?.status ||
          "draft",

        image: null,
        mobileImage: null
      });

      setPreview(
        initialData?.imageUrl || ""
      );

      setMobilePreview(
        initialData?.mobileImageUrl || ""
      );

    }

  }, [initialData]);

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  const handleImageChange = (
    e,
    field
  ) => {

    const file =
      e.target.files[0];

    if (!file) return;

    setFormData({
      ...formData,
      [field]: file
    });

    const previewUrl =
      URL.createObjectURL(file);

    if (field === "image") {

      setPreview(previewUrl);

    } else {

      setMobilePreview(previewUrl);

    }

  };

  return (

    <div className="
      bg-[#FFFDF6]
      border
      border-[#e7dcc8]
      rounded-3xl
      p-8
      space-y-6
      shadow-sm
    ">
            

      {/* TITLE */}
      <div>

        <label className="
          block
          mb-2
          text-sm
          font-semibold
          text-[#1B1610]
        ">
          Banner Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter banner title"
          className="
            w-full
            px-4
            py-4
            rounded-2xl
            border
            border-[#d8ccb7]
          "
        />

      </div>

      {/* SUBTITLE */}
      <div>

        <label className="
          block
          mb-2
          text-sm
          font-semibold
          text-[#1B1610]
        ">
          Subtitle
        </label>

        <textarea
          rows={4}
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          placeholder="Enter subtitle"
          className="
            w-full
            px-4
            py-4
            rounded-2xl
            border
            border-[#d8ccb7]
            resize-none
          "
        />

      </div>

      {/* TARGET URL */}
      <div>

        <label className="
          block
          mb-2
          text-sm
          font-semibold
          text-[#1B1610]
        ">
          Target URL
        </label>

        <input
          type="text"
          name="targetUrl"
          value={formData.targetUrl}
          onChange={handleChange}
          placeholder="/collections/hats"
          className="
            w-full
            px-4
            py-4
            rounded-2xl
            border
            border-[#d8ccb7]
          "
        />

      </div>

      {/* PLACEMENT */}
      <div>

        <label className="
          block
          mb-2
          text-sm
          font-semibold
          text-[#1B1610]
        ">
          Placement
        </label>

        <select
          name="placement"
          value={formData.placement}
          onChange={handleChange}
          className="
            w-full
            px-4
            py-4
            rounded-2xl
            border
            border-[#d8ccb7]
          "
        >

          <option value="home-hero">
            Home Hero
          </option>

          <option value="home-section">
            Home Section
          </option>

          <option value="category-page">
            Category Page
          </option>

          <option value="product-page">
            Product Page
          </option>

          <option value="cart-page">
            Cart Page
          </option>

        </select>

      </div>

      {/* SORT ORDER */}
      <div>

        <label className="
          block
          mb-2
          text-sm
          font-semibold
          text-[#1B1610]
        ">
          Sort Order
        </label>

        <input
          type="number"
          name="sortOrder"
          value={formData.sortOrder}
          onChange={handleChange}
          className="
            w-full
            px-4
            py-4
            rounded-2xl
            border
            border-[#d8ccb7]
          "
        />

      </div>

      {/* START DATE */}
      <div>

        <label className="
          block
          mb-2
          text-sm
          font-semibold
          text-[#1B1610]
        ">
          Starts At
        </label>

        <input
          type="date"
          name="startsAt"
          value={formData.startsAt}
          onChange={handleChange}
          className="
            w-full
            px-4
            py-4
            rounded-2xl
            border
            border-[#d8ccb7]
          "
        />

      </div>

      {/* EXPIRES DATE */}
      <div>

        <label className="
          block
          mb-2
          text-sm
          font-semibold
          text-[#1B1610]
        ">
          Expires At
        </label>

        <input
          type="date"
          name="expiresAt"
          value={formData.expiresAt}
          onChange={handleChange}
          className="
            w-full
            px-4
            py-4
            rounded-2xl
            border
            border-[#d8ccb7]
          "
        />

      </div>

      {/* STATUS */}
      <div>

        <label className="
          block
          mb-2
          text-sm
          font-semibold
          text-[#1B1610]
        ">
          Status
        </label>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="
            w-full
            px-4
            py-4
            rounded-2xl
            border
            border-[#d8ccb7]
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

      {/* IMAGE UPLOADS */}
        <div className="space-y-6">

          {/* DESKTOP IMAGE URL */}
          <div>

            <label
              className="
                block
                mb-2
                text-sm
                font-semibold
                text-[#1B1610]
              "
            >
              Desktop Image URL
            </label>

            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => {

                handleChange(e);

                setPreview(e.target.value);

              }}
              placeholder="https://example.com/banner.jpg"
              className="
                w-full
                px-4
                py-4
                rounded-2xl
                border
                border-[#d8ccb7]
              "
            />

          </div>

          {/* MOBILE IMAGE URL */}
          <div>

            <label
              className="
                block
                mb-2
                text-sm
                font-semibold
                text-[#1B1610]
              "
            >
              Mobile Image URL
            </label>

            <input
              type="text"
              name="mobileImageUrl"
              value={formData.mobileImageUrl}
              onChange={(e) => {

                handleChange(e);

                setMobilePreview(e.target.value);

              }}
              placeholder="https://example.com/mobile-banner.jpg"
              className="
                w-full
                px-4
                py-4
                rounded-2xl
                border
                border-[#d8ccb7]
              "
            />

          </div>

        </div>

      {/* PREVIEWS */}
      <div className="
        grid
        md:grid-cols-2
        gap-6
      ">

        {preview && (

          <div>

            <p className="
              mb-2
              text-sm
              font-semibold
            ">
              Desktop Preview
            </p>

            <img
              src={preview}
              alt="Desktop Preview"
              className="
                w-full
                h-56
                object-cover
                rounded-2xl
                border
              "
            />

          </div>

        )}

        {mobilePreview && (

          <div>

            <p className="
              mb-2
              text-sm
              font-semibold
            ">
              Mobile Preview
            </p>

            <img
              src={mobilePreview}
              alt="Mobile Preview"
              className="
                w-full
                h-56
                object-cover
                rounded-2xl
                border
              "
            />

          </div>

        )}

      </div>

      {/* SUBMIT */}
      <button
        type="button"
        disabled={loading}
        onClick={() =>
          onSubmit(formData)
        }
        className="
          w-full
          bg-[#255441]
          hover:bg-[#1d4334]
          text-white
          py-4
          rounded-2xl
          font-semibold
          transition
        "
      >

        {
          loading
            ? "Please wait..."
            : "Save Banner"
        }

      </button>

    </div>

  );

}