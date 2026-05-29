import { useNavigate } from "react-router-dom";

export default function CouponTable({
  coupons,
  loading,
  onDelete
}) {

  const navigate = useNavigate();

  if (loading) {
    return (
      <p className="text-[#1B1610]">
        Loading...
      </p>
    );
  }

  return (

    <div className="
      overflow-x-auto
      bg-white
      rounded-3xl
      border
      border-[#e7dcc8]
    ">

      <table className="w-full min-w-[1000px]">

        <thead className="bg-[#f8f3ea]">

          <tr>

            <th className="px-6 py-4 text-left">
              Code
            </th>

            <th className="px-6 py-4 text-left">
              Title
            </th>

            <th className="px-6 py-4 text-left">
              Type
            </th>

            <th className="px-6 py-4 text-left">
              Value
            </th>

            <th className="px-6 py-4 text-left">
              Status
            </th>

            <th className="px-6 py-4 text-left">
              Expires
            </th>

            <th className="px-6 py-4 text-left">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {coupons.map((coupon) => (

            <tr
              key={coupon._id}
              className="
                border-t
                border-[#eee3d3]
              "
            >

              {/* CODE */}
              <td className="px-6 py-5 font-semibold">
                {coupon.code}
              </td>

              {/* TITLE */}
              <td className="px-6 py-5">
                {coupon.title}
              </td>

              {/* TYPE */}
              <td className="px-6 py-5 capitalize">
                {coupon.discountType}
              </td>

              {/* VALUE */}
              <td className="px-6 py-5">

                {
                  coupon.discountType ===
                  "percentage"
                    ? `${coupon.discountValue}%`
                    : `AUD $${coupon.discountValue}`
                }

              </td>

              {/* STATUS */}
              <td className="px-6 py-5">

                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold

                    ${
                      coupon.status === "active"
                        ? "bg-green-100 text-green-700"

                        : coupon.status === "paused"
                        ? "bg-yellow-100 text-yellow-700"

                        : coupon.status === "expired"
                        ? "bg-red-100 text-red-700"

                        : "bg-gray-100 text-gray-700"
                    }
                  `}
                >

                  {coupon.status}

                </span>

              </td>

              {/* EXPIRES */}
              <td className="px-6 py-5">

                {
                  new Date(
                    coupon.expiresAt
                  ).toLocaleDateString()
                }

              </td>

              {/* ACTIONS */}
              <td className="px-6 py-5">

                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      navigate(
                        `/admin/coupons/${coupon._id}/edit`
                      )
                    }
                    className="
                      px-4
                      py-2
                      rounded-xl
                      bg-[#255441]
                      hover:bg-[#1d4334]
                      text-white
                      transition
                    "
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      onDelete(coupon._id)
                    }
                    className="
                      px-4
                      py-2
                      rounded-xl
                      bg-[#A8241C]
                      hover:bg-[#8f1d17]
                      text-white
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