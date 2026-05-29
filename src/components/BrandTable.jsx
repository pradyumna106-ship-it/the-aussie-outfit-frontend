// src/components/admin/BrandTable.jsx
export default function BrandTable({
  brands,
  handleEditBrand,
  handleDeleteBrand,
}) {
  return (
    <div
      className="
        mt-6
        overflow-x-auto
        bg-[#fffaf1]
        border
        border-[#d8ccb7]
        rounded-2xl
        shadow-sm
      "
    >
      <table className="w-full min-w-[1000px] border-collapse">

        {/* Table Header */}
        <thead className="bg-[#efe1c6]">
          <tr>

            <th className="text-left px-6 py-4 text-[#2b241c] font-semibold">
              Brand
            </th>

            <th className="text-left px-6 py-4 text-[#2b241c] font-semibold">
              Description
            </th>

            <th className="text-left px-6 py-4 text-[#2b241c] font-semibold">
              Status
            </th>

            <th className="text-left px-6 py-4 text-[#2b241c] font-semibold">
              Actions
            </th>

          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {brands.map((brand, index) => (
            <tr
              key={index}
              className={`
                border-t
                border-[#ece1cf]
                hover:bg-[#fcf7ef]
                transition
                ${
                  index % 2 === 0
                    ? "bg-[#fffdf9]"
                    : "bg-[#fffaf1]"
                }
              `}
            >

              {/* Brand Info */}
              <td className="px-6 py-5">

                <div className="flex items-center gap-4">

                  <img
                    src={brand.logo}
                    alt={brand.name}
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
                      {brand.name}
                    </h3>

                    <p className="text-sm text-[#8a7b69] mt-1">
                      Brand ID: {brand._id}
                    </p>
                  </div>

                </div>

              </td>

              {/* Description */}
              <td className="px-6 py-5 text-[#5c4e3d] max-w-[450px]">
                <p className="line-clamp-4">
                  {brand.description}
                </p>
              </td>

              {/* Status */}
              <td className="px-6 py-5">
                {brand.isActive ? (
                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-green-100
                      text-green-700
                      text-sm
                      font-medium
                    "
                  >
                    Active
                  </span>
                ) : (
                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-red-100
                      text-red-700
                      text-sm
                      font-medium
                    "
                  >
                    Inactive
                  </span>
                )}
              </td>

              {/* Actions */}
              <td className="px-6 py-5">

                <div className="flex flex-wrap gap-2">

                  <button
                    onClick={() =>
                      handleEditBrand(brand)
                    }
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
                    onClick={() =>
                      handleDeleteBrand(brand._id)
                    }
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

                </div>

              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}