// src/components/admin/CategoryTable.jsx

export default function CategoryTable({
  categories,
  handleEditCategory,
  handleDeleteCategory,
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
      <table className="w-full min-w-[900px] border-collapse">

        {/* Table Header */}
        <thead className="bg-[#efe1c6]">
          <tr>

            <th className="text-left px-6 py-4 text-[#2b241c] font-semibold">
              Category
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
          {categories.map((category, index) => (
            <tr
              key={category._id}
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

              {/* Category Info */}
              <td className="px-6 py-5">

                <div className="flex items-center gap-4">

                  <img
                    src={category.image}
                    alt={category.name}
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
                    <h3 className="font-semibold text-[#2b241c] capitalize">
                      {category.name}
                    </h3>

                    <p className="text-sm text-[#8a7b69] mt-1">
                      Category ID: {category._id}
                    </p>
                  </div>

                </div>

              </td>

              {/* Description */}
              <td className="px-6 py-5 text-[#5c4e3d] max-w-[400px]">
                <p className="line-clamp-3">
                  {category.description}
                </p>
              </td>

              {/* Status */}
              <td className="px-6 py-5">
                {category.isActive ? (
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
                      handleEditCategory(category)
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
                      handleDeleteCategory(category._id)
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