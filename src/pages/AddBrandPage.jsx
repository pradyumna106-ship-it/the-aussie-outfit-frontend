import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createBrand, updateBrand } from "../api/product.api.js"
export default function AddBrandPage() {

  const navigate = useNavigate();

  const { id } = useParams();
  
  const location = useLocation();

  const brand = location.state?.brand;

  const [formData, setFormData] = useState(
    brand || {
      name: "",
      description: "",
      logo: "",
      isActive: true,
    }
  );

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? checked
        : value,
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const payload = {
      ...formData,
    };

    console.log("Brand Payload:", payload);
    if (!id) {
      const res = await createBrand(payload)
      if (res.status === 201 || res.status === 200) {
          alert("Brand Added Successfully!");
      } else {
          alert("failed!! to store")
      }
    } else {
      const res = await updateBrand(id,payload)
      if (res.status === 201 || res.status === 200) {
          alert("Brand Saved Successfully!");
      } else {
          alert("failed!! to store")
      }
    }
    
  };

  return (
    <div className="min-h-screen bg-[#f6f1e7] p-6">

      {/* Header */}
      <div
        className="
          bg-[#fffaf1]
          border
          border-[#d8ccb7]
          rounded-3xl
          p-6
          shadow-sm
        "
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-[#2b241c]">
              Add Brand
            </h1>

            <p className="text-[#7a6d5c] mt-2">
              Create and manage premium product brands.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/manage-products")}
            className="
              px-5
              py-3
              rounded-2xl
              bg-[#3d2f1f]
              text-white
              hover:bg-[#2b241c]
              transition
            "
          >
            Back to Brands
          </button>

        </div>
      </div>

      {/* Form */}
      <div
        className="
          mt-6
          bg-[#fffaf1]
          border
          border-[#d8ccb7]
          rounded-3xl
          p-8
          shadow-sm
          max-w-5xl
          mx-auto
        "
      >

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6"
        >

          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium text-[#5c4e3d] mb-2">
              Brand Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Akubra"
              required
              className="
                w-full
                px-4
                py-3
                rounded-2xl
                border
                border-[#d8ccb7]
                bg-[#f8f3ea]
                outline-none
                focus:border-[#3d2f1f]
              "
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#5c4e3d] mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              placeholder="Write brand description..."
              required
              className="
                w-full
                px-4
                py-3
                rounded-2xl
                border
                border-[#d8ccb7]
                bg-[#f8f3ea]
                outline-none
                resize-none
                focus:border-[#3d2f1f]
              "
            />
          </div>

          {/* Brand Logo */}
          <div>
            <label className="block text-sm font-medium text-[#5c4e3d] mb-2">
              Brand Logo URL
            </label>

            <input
              type="text"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              required
              className="
                w-full
                px-4
                py-3
                rounded-2xl
                border
                border-[#d8ccb7]
                bg-[#f8f3ea]
                outline-none
                focus:border-[#3d2f1f]
              "
            />
          </div>

          {/* Preview */}
          {formData.logo && (
            <div>
              <label className="block text-sm font-medium text-[#5c4e3d] mb-3">
                Logo Preview
              </label>

              <div
                className="
                  bg-white
                  border
                  border-[#d8ccb7]
                  rounded-3xl
                  p-6
                  flex
                  justify-center
                  items-center
                "
              >
                <img
                  src={formData.logo}
                  alt="Brand Logo"
                  className="
                    max-h-[220px]
                    object-contain
                  "
                />
              </div>
            </div>
          )}

          {/* Active */}
          <div>
            <label
              className="
                flex
                items-center
                gap-3
                cursor-pointer
              "
            >
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-5 w-5 accent-[#3d2f1f]"
              />

              <span className="text-[#2b241c] font-medium">
                Brand Active
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="
                w-full
                py-4
                rounded-2xl
                bg-[#3d2f1f]
                text-white
                text-lg
                font-semibold
                hover:bg-[#2b241c]
                transition
              "
            >
              Save Brand
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}