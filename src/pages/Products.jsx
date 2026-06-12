import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from "react-router-dom"
import ProductCard from '../components/ProductCard';
import { useNavigate } from "react-router-dom"
import { useOutletContext } from 'react-router-dom';
import { fetchDatas } from "../datas/data.js"; // ✅ import here
import { getProducts, getCategories, getBrands } from '../api/product.api.js';
import { useAuth } from '../context/AuthContext.jsx';
export function Products() {
  // const {
  //     products,
  //     brands,
  //     categories
  //   } = useOutletContext();
  const [cartOpen, setCartOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const { getNewAccessToken, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const handleNavigate = (product) => {
    navigate(`/products/detail/${product._id}`, {state: {product}})
    console.log('clicked to navigate')
  }
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [resProduct, resCategories, resBrands] = await Promise.all([getProducts(),getCategories(),getBrands()]);
        setProducts(resProduct.data.data || []);
        setProductCount(resProduct.data.count || 0);
        setCategories(resCategories.data.data || []);
        setBrands(resBrands.data.data || [])
      } catch (error) {
        console.error("Products Error:", error);
      }
    };

    loadProducts();
  }, []);
  console.log("products:",products)
  console.log("brands:",brands)
  console.log("categories:",categories)
  const filteredAndSortedProducts = useMemo(() => {

  let filtered = [...products];

  // =========================
  // BRAND FILTER
  // /products/brands/rm-williams
  // =========================

  if (category === "brands" && slug) {

      const currentBrand = brands.find(
        brand => brand.name?.toLowerCase() === slug?.toLowerCase()
      );
      
      if (!currentBrand) return [];
      
      filtered = filtered.filter(
        (product) =>
          String(
            product.brandId?._id ||
            product.brandId
          ) === String(currentBrand._id)
      );
    }

    // =========================
    // CATEGORY + SUBCATEGORY
    // /products/accessories/belts
    // =========================

    else if (category && slug) {

      // parent category
      const parentCategory = categories.find(
        (cat) => cat.slug === category
      );

      if (!parentCategory) return [];

      // sub category
      const subCategory =
        parentCategory.subCategories?.find(
          (sub) => sub.slug === slug
        );

      if (!subCategory) return [];

      // FILTER USING _id
      filtered = filtered.filter(
        (product) =>
          String(
            product.categoryId?._id ||
            product.categoryId
          ) === String(subCategory._id)
      );
    }

    // =========================
    // TOP CATEGORY
    // /products/accessories
    // =========================

    else if (category) {

      const matchedCategory = categories.find(cat => cat.slug?.toLowerCase() === category?.toLowerCase());
      console.log("URL category param:", category);
      console.log("matchedCategory:", matchedCategory);
      console.log("subCategoryIds:", matchedCategory?.subCategories?.map(sub => String(sub._id)));
      console.log("product categoryIds:", products.map(p => String(p.categoryId?._id || p.categoryId)));
      if (!matchedCategory) return [];

      // all subcategory ids
      const subCategoryIds =
        matchedCategory.subCategories?.map(
          (sub) => String(sub._id)
        ) || [];

      filtered = filtered.filter((product) => {

        const productCategoryId = String(
          product.categoryId?._id ||
          product.categoryId
        );

        return subCategoryIds.includes(
          productCategoryId
        );
      });
    }

    // =========================
    // SIDEBAR FILTER
    // =========================

    // SIDEBAR FILTER — replace the existing selectedCategory block
    if (selectedCategory !== "all") {
      const selectedParent = categories.find(
        (cat) => String(cat._id) === String(selectedCategory)
      );

      if (selectedParent) {
        // Parent category selected → include all its subcategory products
        const subIds = selectedParent.subCategories?.map(
          (sub) => String(sub._id)
        ) || [];

        filtered = filtered.filter((product) =>
          subIds.includes(
            String(product.categoryId?._id || product.categoryId)
          )
        );
      } else {
        // It might already be a subcategory _id (future use)
        filtered = filtered.filter(
          (product) =>
            String(product.categoryId?._id || product.categoryId) ===
            String(selectedCategory)
        );
      }
    }

    // =========================
    // SORTING
    // =========================

    return filtered.sort((a, b) => {

      switch (sortBy) {

        case "price-low":
          return a.basePrice - b.basePrice;

        case "price-high":
          return b.basePrice - a.basePrice;

        default:
          return a.name.localeCompare(b.name);
      }
    });

  }, [
    products,
    brands,
    categories,
    category,
    slug,
    selectedCategory,
    sortBy
  ]);

  return (
    <main className="min-h-screen bg-[#f6f1e6]">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Breadcrumb */}

        <div className="mb-4">
          <p className="text-sm text-[#7b6f5c]">
            Home / product & Shoes / Safety product
          </p>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#2b2b2b] mb-4">
            Safety product
          </h1>

          <p className="text-[#6f6658] max-w-3xl leading-relaxed">
            Shop premium Australian safety product and workwear.
          </p>
        </div>
        <div className="mb-12 bg-[#fffdf8] border border-[#d8cdbd] rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-[#2b2b2b] mb-4">
            About { brands.find((brand) => brand.name?.toLowerCase() === slug?.toLowerCase())?.name || categories.find(cat => cat.slug?.toLowerCase() === category?.toLowerCase())?.name}
          </h2>
          <img
            src={brands.find((brand) => brand.name?.toLowerCase() === slug?.toLowerCase())?.logo || categories.find(cat => cat.slug?.toLowerCase() === category?.toLowerCase())?.image}
            alt={brands.find((brand) => brand.name?.toLowerCase() === slug?.toLowerCase())?.name || categories.find(cat => cat.slug?.toLowerCase() === category?.toLowerCase())?.name}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <div
            className={`overflow-hidden transition-all duration-300 ${
              showFullDescription ? "max-h-[1000px]" : "max-h-32"
            }`}
          >
            <p className="text-[#6f6658] leading-relaxed">
              {brands.find((brand) => brand.name?.toLowerCase() === slug?.toLowerCase())?.description || categories.find(cat => cat.slug?.toLowerCase() === category?.toLowerCase())?.description}
            </p>
          </div>

          <button
            onClick={() =>
              setShowFullDescription(!showFullDescription)
            }
            className="mt-4 text-[#245441] font-semibold hover:underline"
          >
            {showFullDescription ? "Read Less" : "Read More"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-[#fffdf8] border border-[#d8cdbd] rounded-2xl p-6 sticky top-24">

              <div className="flex items-center gap-2 mb-6">
                <span className="text-[#245441] text-lg">
                  ⚙️
                </span>

                <h2 className="text-xl font-semibold text-[#2b2b2b]">
                  Filters
                </h2>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[#7b6f5c] mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  <label className="
                        flex items-center gap-3 w-full
                        p-3 rounded-xl cursor-pointer
                        hover:bg-[#f3ede2] transition-colors
                      ">
                  <input
                    type="radio"
                    value="all"
                    className="h-4 w-4"
                    checked={selectedCategory === "all"}
                    onChange={(e) =>
                      setSelectedCategory(e.target.value)
                    }
                  />
                  <span>All Categories</span>
                </label>
                  {categories.map((category,index) => (
                    <label
                      key={index}
                      className="
                        flex items-center gap-3 w-full
                        p-3 rounded-xl cursor-pointer
                        hover:bg-[#f3ede2] transition-colors
                      "
                    >
                      <input
                        type="radio"
                        value={category._id}
                        checked={selectedCategory === category._id}
                        onChange={(e) =>
                          setSelectedCategory(e.target.value)
                        }
                        className="h-4 w-4"
                      />

                      <span className="text-[#2b2b2b]">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[#7b6f5c] mb-4">
                  Sort By
                </h3>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="
                    w-full rounded-xl border border-[#d8cdbd]
                    bg-white px-4 py-3 outline-none
                    focus:ring-2 focus:ring-[#245441]
                  "
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products */}
            <section className="flex-1">

              <div className="flex items-center justify-between mb-6">
                <p className="text-[#6f6658]">
                  {productCount} products found
                </p>
              </div>

              {filteredAndSortedProducts.length === 0 ? (

                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold text-[#2b2b2b]">
                    No Products Found
                  </h2>

                  <p className="text-[#6f6658] mt-2">
                    This category does not exist or has no products.
                  </p>
                </div>

              ) : (

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAndSortedProducts.map((product,index) => (
                    <ProductCard
                      key={index}
                      product={product}
                      onClick={() => handleNavigate(product)}
                    />
                  ))}
                </div>

              )}

            </section>
        </div>
      </div>
    </main>
  );
}

export default Products;