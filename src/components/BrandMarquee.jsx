// src/components/BrandMarquee.jsx

import { useNavigate } from "react-router-dom";

const BrandMarquee = ({ brands = [] }) => {

  const navigate = useNavigate();

  const marqueeBrands = [...brands, ...brands];

  const handleBrandClick = (brand) => {
    navigate(`/products/brands/${brand.name}`);
  };

  return (
    <section className="w-full bg-[#efe7d7] border-y border-[#d8ccb7] py-10 overflow-hidden">

      {/* HEADER */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 mb-8">
        <div className="flex items-center justify-between">

          <h2 className="text-3xl font-bold text-[#1c1c1c]">
            Shop By Brands
          </h2>

          <button
            onClick={() => navigate("/brands")}
            className="
              text-[#245441]
              font-semibold
              hover:underline
            "
          >
            View All
          </button>

        </div>
      </div>

      {/* MARQUEE */}
      <div className="relative overflow-hidden">

        <div
          className="
            flex
            w-max
            animate-brand-marquee
          "
        >
          {marqueeBrands.map((brand, index) => (

            <button
              key={`${brand._id}-${index}`}
              onClick={() => handleBrandClick(brand)}
              className="
                flex-shrink-0
                mx-4
                flex
                items-center
                justify-center
                w-[220px]
                h-[120px]
                bg-white
                rounded-2xl
                shadow-sm
                border
                border-[#e4dac7]
                hover:shadow-lg
                hover:scale-105
                transition-all
                duration-300
                p-6
              "
            >

              <img
                src={brand.logo}
                alt={brand.name}
                className="
                  max-h-[70px]
                  w-full
                  object-contain
                "
              />

            </button>

          ))}
        </div>

      </div>
    </section>
  );
};

export default BrandMarquee;