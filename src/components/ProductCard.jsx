
export default function ProductCard({ product, onClick }) {
  return (
    <div onClick={onClick}className="bg-[#fffdf6] border border-[#cfc3ad] rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg">
      
      {/* Image */}
      <div className="relative h-[220px] bg-[#6e4021]">
          <img src={product.images?.[0] || "https://img.freepik.com/premium-vector/picture-icon-isolated-white-background-vector-illustration_736051-240.jpg?semt=ais_hybrid&w=740&q=80"} alt="product-image" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            <span className="absolute top-4 left-4 bg-[#a8241c] text-white text-xs px-4 py-1 rounded-full">
              Sale
            </span>
      </div>
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[#1b1610] mb-2">
          {product.name}
        </h3>

        <p className="text-[#255441] font-bold text-lg">
          {product.basePrice}
        </p>
      </div>
    </div>
  );
}
