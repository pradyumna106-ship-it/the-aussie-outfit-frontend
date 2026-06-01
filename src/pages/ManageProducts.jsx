import { Plus } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductTable from "../components/ProductTable";
import CategoryTable from "../components/CategoryTable";
import BrandTable from "../components/BrandTable";
import { useOutletContext } from "react-router-dom";
import { deleteBrand, deleteCategory, deleteProduct } from "../api/product.api.js"


export default function ManageProducts() {
  const navigate = useNavigate();
  //const { brands, products, categories } = useOutletContext()
  const location = useLocation()
  const brands = location.state?.brands || JSON.parse(localStorage.getItem("brands"));
  const products = location.state?.products || JSON.parse(localStorage.getItem("products"));
  const categories = location.state?.categories || JSON.parse(localStorage.getItem("categories"));
  localStorage.setItem("products",JSON.stringify(products))
  localStorage.setItem("brands",JSON.stringify(brands))
  localStorage.setItem("categories",JSON.stringify(categories))
  const [activeSection, setActiveSection] = useState("products");
  const handleAddProduct = () => {
    navigate("/admin/add-product");
  };
  const productsWithCategory = products.map((product) => {

      const matchedCategory = categories.find(
        (category) =>
          String(category._id) ===
          String(product.categoryId?._id || product.categoryId)
      );

      return {
        ...product,
        category: matchedCategory.name || null,
      };

  });

  const handleEditProduct = (product) => {
    navigate(`/admin/edit-product/${product._id}`,{state:{product}});
  };

  const handleDeleteProduct = async (id) => {
    alert(`Delete Product ID: ${id}`);
    const res = await deleteProduct(id);
    if (res.status === 200) {
      alert('Product deleted Successfully');
    } else {
      alert('Failed to Delete')
    }
  };

  const handleViewReviews = (id) => {
    navigate(`/admin/reviews/${id}`);
  };
  const handleAddBrand = () => {
    navigate(`/admin/add-brand`);
  }
  const handleAddCategory = () => {
    navigate(`/admin/add-category`);
  }
  const handleEditCategory = (category) => {
    navigate(`/admin/edit-category/${category._id}`,{state:{category}});
  }
  const handleDeleteCategory = async (id) => {
    alert(`Delete Category ID: ${id}`);
    const res = await deleteCategory(id);
    if (res.status === 200) {
      alert('Category deleted Successfully');
    } else {
      alert('Failed to Delete')
    }
  }
  const handleEditBrand = (brand) => {
    navigate(`/admin/edit-brand/${brand._id}`,{state:{brand}});
  }
  const handleDeleteBrand = async (id) => {
    alert(`Delete brand ID: ${id}`);
    const res = await deleteBrand(id);
    if (res.status === 200) {
      alert('Brand deleted Successfully');
    } else {
      alert('Failed to Delete')
    }
  }
  return (
    <div className="min-h-screen bg-[#f6f1e7] p-6">
      
      {/* Header */}
      <div className="bg-[#fffaf1] border border-[#d8ccb7] rounded-2xl p-6 shadow-sm">
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div>
            <h1 className="text-3xl font-bold text-[#2b241c]">
              Product Management
            </h1>

            <p className="text-[#7a6d5c] mt-2">
              Manage products, inventory, pricing, brands, categories and reviews.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            
            {/* BACK */}
            <button
              onClick={() => navigate('/admin/dashboard')}
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

            {/* ADD CATEGORY */}
            <button
              onClick={handleAddCategory}
              className="
                flex
                items-center
                gap-2
                px-5
                py-3
                rounded-2xl
                bg-[#d1a36d]
                text-white
                hover:bg-[#b88955]
                transition
              "
            >
              <Plus className="w-5 h-5" />

              Add Category
            </button>

            {/* ADD BRAND */}
            <button
              onClick={handleAddBrand}
              className="
                flex
                items-center
                gap-2
                px-5
                py-3
                rounded-2xl
                bg-[#255441]
                text-white
                hover:bg-[#1c4032]
                transition
              "
            >
              <Plus className="w-5 h-5" />

              Add Brand
            </button>

            {/* ADD PRODUCT */}
            <button
              onClick={handleAddProduct}
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
              <Plus className="w-5 h-5" />

              Add Product
            </button>

          </div>
        </div>
      </div>
      {/* Section Navigation */}
        <div className="sticky top-0 z-10 bg-[#f6f1e7] py-3">
          <div className="flex gap-2 bg-[#fffaf1] border border-[#d8ccb7] rounded-2xl p-2 shadow-sm w-fit">
            {[
              { label: "Products", id: "products" },
              { label: "Categories", id: "categories" },
              { label: "Brands", id: "brands" },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
                  activeSection === id
                    ? "bg-[#3d2c1d] text-white"
                    : "text-[#2b241c] hover:bg-[#f5ede1]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {activeSection === "products" && (
          <ProductTable
            products={productsWithCategory}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
            handleViewReviews={handleViewReviews}
          />
        )}

        {activeSection === "categories" && (
          <CategoryTable
            categories={categories}
            handleEditCategory={handleEditCategory}
            handleDeleteCategory={handleDeleteCategory}
          />
        )}

        {activeSection === "brands" && (
          <BrandTable
            brands={brands}
            handleEditBrand={handleEditBrand}
            handleDeleteBrand={handleDeleteBrand}
          />
        )}
    </div>
  );
}