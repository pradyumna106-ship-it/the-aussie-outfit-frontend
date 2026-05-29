
const ProductsSection = () => {
  const products = [
    {
      id: 1,
      name: 'Blundstone 600 Boot Brown',
      price: 'AUD $153.00',
      availability: 'Available in multiple colours',
      image: '/images/img_imagepreview.svg',
      badge: 'Sale',
    },
    {
      id: 2,
      name: 'Blundstone 600 Boot Brown',
      price: 'AUD $153.00',
      availability: 'Available in multiple colours',
      image: '/images/img_imagepreview.svg',
      badge: 'Sale',
    },
    {
      id: 3,
      name: 'Blundstone 600 Boot Brown',
      price: 'AUD $153.00',
      availability: 'Available in multiple colours',
      image: '/images/img_imagepreview.svg',
      badge: 'Sale',
    },
    {
      id: 4,
      name: 'Blundstone 600 Boot Brown',
      price: 'AUD $153.00',
      availability: 'Available in multiple colours',
      image: '/images/img_imagepreview.svg',
      badge: 'Sale',
    },
    {
      id: 5,
      name: 'Blundstone 600 Boot Brown',
      price: 'AUD $153.00',
      availability: 'Available in multiple colours',
      image: '/images/img_imagepreview.svg',
      badge: 'Sale',
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-[74px]">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[112px]">
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-[20px]">
          {/* Section Title */}
          <h2 className="text-[24px] sm:text-[28px] md:text-[30px] lg:text-6xl font-bold leading-[30px] sm:leading-[34px] md:leading-[36px] lg:leading-9xl text-text-primary">
            Latest products
          </h2>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 lg:gap-[18px]">
            {products?.map((product) => (
              <div
                key={product?.id}
                className="flex flex-col gap-4 md:gap-[18px] bg-[#fffcf6] border border-[#cec3ad] rounded-md p-3 sm:p-3.5 md:p-[14px] hover:shadow-lg transition-shadow duration-200"
              >
                {/* Product Image with Badge */}
                <div
                  className="relative w-full h-[160px] sm:h-[170px] md:h-[180px] lg:h-[190px] bg-cover bg-center rounded p-3"
                  style={{ backgroundImage: `url(${product?.image})` }}
                >
                  <div className="flex flex-row justify-start items-start">
                    <span className="bg-[#a8231c] text-text-white text-[10px] sm:text-xs font-bold leading-xs px-3 sm:px-[14px] py-1 sm:py-1.5 rounded-xl">
                      {product?.badge}
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex flex-col gap-3 sm:gap-4 md:gap-[16px]">
                  <div className="flex flex-col gap-2 sm:gap-3 md:gap-[16px]">
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-lg font-semibold leading-[18px] sm:leading-[20px] md:leading-2xl lg:leading-2xl text-text-primary">
                      {product?.name}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-sm font-normal leading-[14px] sm:leading-sm md:leading-sm text-[#635746]">
                      {product?.availability}
                    </p>
                  </div>

                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-[20px] sm:leading-[22px] md:leading-3xl lg:leading-3xl text-[#245441]">
                    {product?.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;