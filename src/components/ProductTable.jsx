// src/components/admin/ProductTable.jsx

export default function ProductTable({
  products,
  handleEditProduct,
  handleDeleteProduct,
  handleViewReviews,
}) {
  return (
      <div className="mt-6 overflow-x-auto bg-[#fffaf1] border border-[#d8ccb7] rounded-2xl shadow-sm">
        
        <table className="w-full min-w-[900px] border-collapse">
          
          {/* Table Header */}
          <thead className="bg-[#efe1c6]">
            <tr>
              
              <th className="text-left px-6 py-4 text-[#2b241c] font-semibold">
                Product
              </th>

              <th className="text-left px-6 py-4 text-[#2b241c] font-semibold">
                Category
              </th>

              <th className="text-left px-6 py-4 text-[#2b241c] font-semibold">
                Price
              </th>

              <th className="text-left px-6 py-4 text-[#2b241c] font-semibold">
                Stock
              </th>

              <th className="text-left px-6 py-4 text-[#2b241c] font-semibold">
                Actions
              </th>

            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {products.map((product, index) => (
              <tr
                key={index}
                className={`
                  border-t
                  border-[#ece1cf]
                  hover:bg-[#fcf7ef]
                  transition
                  ${index % 2 === 0 ? "bg-[#fffdf9]" : "bg-[#fffaf1]"}
                `}
              >

                {/* Product Info */}
                <td className="px-6 py-5">
                  
                  <div className="flex items-center gap-4">
                    
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="
                        h-16
                        w-16
                        rounded-xl
                        object-cover
                        border
                        border-[#d8ccb7]
                        bg-white
                      "
                    />

                    <div>
                      <h3 className="font-semibold text-[#2b241c]">
                        {product.name}
                      </h3>

                      <p className="text-sm text-[#8a7b69] mt-1">
                        Product ID: {product._id}
                      </p>
                    </div>

                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-5 text-[#5c4e3d]">
                  {product.category}
                </td>

                {/* Price */}
                <td className="px-6 py-5 font-semibold text-[#2b241c]">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(product.basePrice)}
                </td>

                {/* Stock */}
                <td className="px-6 py-5">
                  {product.stock >= 0 ? (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                      In Stock
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                      Out of Stock
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-5">
                  
                  <div className="flex flex-wrap gap-2">
                    
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="
                        px-4
                        py-2
                        rounded-lg
                        bg-[#3d2f1f]
                        text-white
                        text-sm
                        hover:bg-[#2b241c]
                        transition
                      "
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="
                        px-4
                        py-2
                        rounded-lg
                        bg-red-600
                        text-white
                        text-sm
                        hover:bg-red-700
                        transition
                      "
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => handleViewReviews(product._id)}
                      className="
                        px-4
                        py-2
                        rounded-lg
                        border
                        border-[#cdbba2]
                        bg-white
                        text-[#2b241c]
                        text-sm
                        hover:bg-[#f5ede1]
                        transition
                      "
                    >
                      Reviews
                    </button>

                  </div>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
  );
}