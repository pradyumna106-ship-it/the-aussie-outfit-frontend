import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createProduct, updateProduct } from "../api/product.api.js"
import { useOutletContext } from "react-router-dom";


export default function AddProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
   const { id } = useParams();
  const product = location.state?.product;
  const { brands,  categories } = useOutletContext()

  const [formData, setFormData] = useState(
    product || {
      name: "",
      slug: "",
      description: "",
      categoryId: "",
      brandId: "",
      basePrice: "",
      stock: "",
      images: [""],
      tags: "",
      isActive: true,
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];

    updatedImages[index] = value;

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const removeImageField = (index) => {
    const updatedImages = formData.images.filter(
      (_, i) => i !== index
    );

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,

      basePrice: Number(formData.basePrice),

      stock: Number(formData.stock),

      tags: Array.isArray(formData.tags)
        ? formData.tags
        : formData.tags
            .split(",")
            .map((tag) => tag.trim()),
    };

    console.log("Product Payload:", payload);
    if(!id) {
      const res = await createProduct(payload);
      if (res.status === 201 || res.status === 200) {
          alert("Product Saved Successfully!");
      } else {
          alert("failed!! to store")
      }
    } else {
      const res = await updateProduct(id,payload);
      if (res.status === 201 || res.status === 200) {
          alert("Product Saved Successfully!");
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
              Add New Product
            </h1>

            <p className="text-[#7a6d5c] mt-2">
              Create and manage premium fashion products.
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
            Back to Products
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
          max-w-6xl
          mx-auto
        "
      >
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-[#5c4e3d] mb-2">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Akubra Dusty Dawn Hat"
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

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-[#5c4e3d] mb-2">
              Slug
            </label>

            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="akubra-dusty-dawn-hat"
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
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-[#5c4e3d] mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Write product description..."
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

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[#5c4e3d] mb-2">
              Category
            </label>

            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
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
            >
              <option value="">
                Select Category
              </option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-[#5c4e3d] mb-2">
              Brand
            </label>

            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
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
            >
              <option value="">
                Select Brand
              </option>

              {brands.map((brand) => (
                <option
                  key={brand._id}
                  value={brand._id}
                >
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Base Price */}
          <div>
            <label className="block text-sm font-medium text-[#5c4e3d] mb-2">
              Base Price
            </label>

            <input
              type="number"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleChange}
              placeholder="319"
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

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-[#5c4e3d] mb-2">
              Stock Quantity
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="15"
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

          {/* Tags */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-[#5c4e3d] mb-2">
              Tags
            </label>

            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="hat, western-hat, akubra"
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

            <p className="text-sm text-[#7a6d5c] mt-2">
              Separate tags using commas.
            </p>
          </div>

          {/* Images */}
          <div className="lg:col-span-2">

            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-[#5c4e3d]">
                Product Images
              </label>

              <button
                type="button"
                onClick={addImageField}
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-[#3d2f1f]
                  text-white
                  text-sm
                "
              >
                Add Image
              </button>
            </div>

            <div className="space-y-4">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-center"
                >
                  <input
                    type="text"
                    value={image}
                    onChange={(e) =>
                      handleImageChange(index, e.target.value)
                    }
                    placeholder="https://example.com/image.jpg"
                    className="
                      flex-1
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

                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="
                        px-4
                        py-3
                        rounded-2xl
                        bg-red-500
                        text-white
                      "
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          {formData.images[0] && (
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-[#5c4e3d] mb-3">
                Image Preview
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {formData.images.map(
                  (image, index) =>
                    image && (
                      <img
                        key={index}
                        src={image}
                        alt={`Preview ${index}`}
                        className="
                          w-full
                          h-56
                          object-cover
                          rounded-2xl
                          border
                          border-[#d8ccb7]
                        "
                      />
                    )
                )}

              </div>
            </div>
          )}

          {/* Active */}
          <div className="lg:col-span-2">
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
                Product Active
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="lg:col-span-2 pt-4">
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
              Save Product
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}