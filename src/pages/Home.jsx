import { Helmet } from 'react-helmet-async';
import { useEffect,useState } from 'react';
import HeroSection from '../components/HeroSection';
import { TrustCard } from '../components/TrustCard';
import { CategoryCard } from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { useNavigate } from "react-router-dom"
import { getCategories,getBrands,getProducts }from "../api/product.api.js"
import { useOutletContext } from "react-router-dom";
import BrandMarquee from "../components/BrandMarquee";
import { getBanners } from '../api/admin.api.js';

const trustItems = [
  {
    title: "43+ years",
    desc: "Family owned, real product advice and Australian retail heritage.",
  },
  {
    title: "90 day returns",
    desc: "Reassurance made visible before shoppers hit product pages.",
  },
  {
    title: "Free shipping",
    desc: "Free delivery threshold promoted throughout discovery.",
  },
  {
    title: "Real reviews",
    desc: "Google review highlights support trust and conversion.",
  },
];



export default function Home() {
  const navigate = useNavigate();
  const {
      products,
      brands,
      categories
    } = useOutletContext();
  const [banners,setBanners] = useState([])
  const [pagination,setPagination] = useState({})
  console.log(products);
  console.log(brands);
  console.log(categories);
  const handleNavigate = (product) => {
    navigate(`/products/detail/${product._id}`, { state: { product } });
    console.log('clicked to navigate')
  }
  useEffect(() => {
    async function loadBanners() {
      const res =await getBanners();
      console.log("Banners data: ",res.data);
      const response = res;
      setBanners(response.data.data || []);
      setPagination(res.data.pagination || {});
    }
    loadBanners()
  },[])
  
  return (
    <>
      {/* Main Page Content Only */}
      <main className="w-full min-h-screen bg-[#f6f0e6]">
        
        {/* Hero */}
        <HeroSection banners={banners} pagination={pagination} />

        <BrandMarquee brands={brands} />


        {/* Trust Section */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {trustItems.map((item, index) => (
              <TrustCard
                key={index}
                title={item.title}
                desc={item.desc}
              />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#1c1c1c]">
              Shop Categories
            </h2>

            <button className="text-[#245441] font-semibold hover:underline">
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.name}
                image={category.image}
                onClick={() => {navigate(`/products/${category.name}`)}}
              />
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#1c1c1c]">
              Featured Products
            </h2>

            <button className="text-[#245441] font-semibold hover:underline">
              Shop All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
              {products.map((product,index) => (
                <ProductCard
                  key={index}
                  product={product}
                  onClick={() => handleNavigate(product)}
                />
              ))}
            </div>
        </section>
      </main>
    </>
  );
}

