import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createCategory, updateCategory } from "../api/product.api.js"
export default function AddCategoryPage() {

  const navigate = useNavigate();

  const location = useLocation();
  const { id } = useParams();
  const category = location.state?.category;

  const [formData, setFormData] = useState(
    category || {
      name: "",
      slug: "",
      description: "",
      image: "",
      subCategories: [],
      isActive: true,
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: type === "checkbox"
          ? checked
          : value,
      };
      // AUTO SLUG
      if (name === "name") {
        updatedData.slug = value
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-");
      }
      return updatedData;
    });
  };
  
  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");
  };

  const handleNameChange = (e) => {

    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }));
  };

  const handleSubCategoryChange = (
    index,
    field,
    value
  ) => {

    const updatedSubCategories = [
      ...formData.subCategories
    ];

    updatedSubCategories[index] = {
      ...updatedSubCategories[index],
      [field]: value,
    };

    // auto slug generation
    if (field === "name") {
      updatedSubCategories[index].slug =
        generateSlug(value);
    }

    setFormData((prev) => ({
      ...prev,
      subCategories: updatedSubCategories,
    }));
  };

  const addSubCategory = () => {

    setFormData((prev) => ({
      ...prev,
      subCategories: [
        ...prev.subCategories,
        {
          name: "",
          slug: "",
        },
      ],
    }));

  };

  const removeSubCategory = (index) => {

    const updatedSubCategories =
      formData.subCategories.filter(
        (_, i) => i !== index
      );

    setFormData((prev) => ({
      ...prev,
      subCategories: updatedSubCategories,
    }));

};

  const handleSubmit = async (e) => {

    e.preventDefault();

    const payload = {
      ...formData,
    };

    console.log("Category Payload:", payload);
    if(!id) {
      const res = await createCategory(payload);
      if (res.status === 201 || res.status === 200) {
          alert("Category Saved Successfully!");
      } else {
          alert("failed!! to store")
      }
    } else {
      const res = await updateCategory(id,payload);
      if (res.status === 201 || res.status === 200) {
          alert("Category Saved Successfully!");
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
              Add Category
            </h1>

            <p className="text-[#7a6d5c] mt-2">
              Create and manage product categories.
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
            Back to Categories
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

          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-[#5c4e3d] mb-2">
              Category Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Hats"
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
                readOnly
                className="
                  w-full
                  px-4
                  py-3
                  rounded-2xl
                  border
                  border-[#d8ccb7]
                  bg-[#ece6da]
                  outline-none
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
              rows={6}
              placeholder="Write category description..."
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
         
          {/* Category Image */}
          <div>
            <label className="block text-sm font-medium text-[#5c4e3d] mb-2">
              Category Image URL
            </label>

            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/category-image.jpg"
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
          {formData.image && (
            <div>
              <label className="block text-sm font-medium text-[#5c4e3d] mb-3">
                Image Preview
              </label>

              <img
                src={formData.image}
                alt="Category Preview"
                className="
                  w-full
                  max-h-[420px]
                  object-cover
                  rounded-3xl
                  border
                  border-[#d8ccb7]
                "
              />
            </div>
          )}

             {/* Sub Categories */}
              <div>
                <div className="flex items-center justify-between mb-4">

                  <label className="block text-sm font-medium text-[#5c4e3d]">
                    Sub Categories
                  </label>

                  <button
                    type="button"
                    onClick={addSubCategory}
                    className="
                      px-4
                      py-2
                      rounded-xl
                      bg-[#245441]
                      text-white
                      text-sm
                    "
                  >
                    Add Sub Category
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.subCategories.map(
                    (subCategory, index) => (
                      <div
                        key={index}
                        className="
                          grid
                          grid-cols-1
                          lg:grid-cols-3
                          gap-4
                          p-4
                          rounded-2xl
                          border
                          border-[#d8ccb7]
                          bg-[#f8f3ea]
                        "
                      >
                        {/* Name */}
                        <input
                          type="text"
                          placeholder="Sub Category Name"
                          value={subCategory.name}
                          onChange={(e) =>
                            handleSubCategoryChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          className="
                            px-4
                            py-3
                            rounded-xl
                            border
                            border-[#d8ccb7]
                            outline-none
                          "
                        />
                        {/* Slug */}
                        <input
                          type="text"
                          placeholder="slug"
                          value={subCategory.slug}
                          readOnly
                          className="
                            px-4
                            py-3
                            rounded-xl
                            border
                            border-[#d8ccb7]
                            bg-[#ece6da]
                            outline-none
                          "
                        />
                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            removeSubCategory(index)
                          }
                          className="
                            px-4
                            py-3
                            rounded-xl
                            bg-red-500
                            text-white
                          "
                        >
                          Remove
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

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
                Category Active
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
              Save Category
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}