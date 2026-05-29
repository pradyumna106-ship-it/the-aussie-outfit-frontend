import {
  Pencil,
  Trash2
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function BannerTable({
  banners,
  onDelete
}) {

  const navigate = useNavigate();

  if (!banners?.length) {

    return (
      <div className="
        bg-white
        rounded-3xl
        border
        border-[#e7dcc8]
        p-10
        text-center
      ">
        <p className="text-[#6b6257]">
          No banners found
        </p>
      </div>
    );

  }

  return (

    <div className="
      bg-white
      rounded-3xl
      border
      border-[#e7dcc8]
      overflow-hidden
    ">

      <div className="overflow-x-auto">

        <table className="w-full min-w-[1200px]">

          <thead className="bg-[#f6f1e6]">

            <tr>

              <th className="
                text-left
                px-6
                py-4
                text-sm
                font-semibold
                text-[#1B1610]
              ">
                Banner
              </th>

              <th className="
                text-left
                px-6
                py-4
                text-sm
                font-semibold
                text-[#1B1610]
              ">
                Placement
              </th>

              <th className="
                text-left
                px-6
                py-4
                text-sm
                font-semibold
                text-[#1B1610]
              ">
                Sort Order
              </th>

              <th className="
                text-left
                px-6
                py-4
                text-sm
                font-semibold
                text-[#1B1610]
              ">
                Status
              </th>

              <th className="
                text-left
                px-6
                py-4
                text-sm
                font-semibold
                text-[#1B1610]
              ">
                Starts At
              </th>

              <th className="
                text-left
                px-6
                py-4
                text-sm
                font-semibold
                text-[#1B1610]
              ">
                Expires At
              </th>

              <th className="
                text-center
                px-6
                py-4
                text-sm
                font-semibold
                text-[#1B1610]
              ">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {banners.map((banner) => (

              <tr
                key={banner._id}
                className="
                  border-t
                  border-[#eee4d3]
                  hover:bg-[#fffcf6]
                  transition
                "
              >

                {/* IMAGE + TITLE */}
                <td className="px-6 py-5">

                  <div className="flex items-center gap-4">

                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="
                        w-24
                        h-16
                        object-cover
                        rounded-xl
                        border
                      "
                    />

                    <div>

                      <h2 className="
                        font-semibold
                        text-[#1B1610]
                      ">
                        {banner.title}
                      </h2>

                      <p className="
                        text-sm
                        text-[#6b6257]
                        mt-1
                        max-w-[250px]
                        truncate
                      ">
                        {banner.subtitle}
                      </p>

                    </div>

                  </div>

                </td>

                {/* PLACEMENT */}
                <td className="
                  px-6
                  py-5
                  text-[#5f5647]
                ">
                  {banner.placement}
                </td>

                {/* SORT ORDER */}
                <td className="
                  px-6
                  py-5
                  text-[#5f5647]
                ">
                  {banner.sortOrder}
                </td>

                {/* STATUS */}
                <td className="px-6 py-5">

                  <span className={`
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    ${
                      banner.status === "active"
                        ? "bg-green-100 text-green-700"
                        : banner.status === "paused"
                        ? "bg-yellow-100 text-yellow-700"
                        : banner.status === "expired"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  `}>

                    {banner.status}

                  </span>

                </td>

                {/* START DATE */}
                <td className="
                  px-6
                  py-5
                  text-[#5f5647]
                ">
                  {
                    banner.startsAt
                      ? new Date(
                          banner.startsAt
                        ).toLocaleDateString()
                      : "-"
                  }
                </td>

                {/* EXPIRE DATE */}
                <td className="
                  px-6
                  py-5
                  text-[#5f5647]
                ">
                  {
                    banner.expiresAt
                      ? new Date(
                          banner.expiresAt
                        ).toLocaleDateString()
                      : "-"
                  }
                </td>

                {/* ACTIONS */}
                <td className="
                  px-6
                  py-5
                ">

                  <div className="
                    flex
                    items-center
                    justify-center
                    gap-3
                  ">

                    <button
                      onClick={() =>
                        navigate(
                          `/admin/banners/${banner._id}/edit`,
                          {
                            state: {
                              banner
                            }
                          }
                        )
                      }
                      className="
                        bg-[#255441]
                        hover:bg-[#1d4334]
                        text-white
                        p-2.5
                        rounded-xl
                        transition
                      "
                    >

                      <Pencil className="w-4 h-4" />

                    </button>

                    <button
                      onClick={() =>
                        onDelete(banner._id)
                      }
                      className="
                        bg-[#A8241C]
                        hover:bg-[#8e1d16]
                        text-white
                        p-2.5
                        rounded-xl
                        transition
                      "
                    >

                      <Trash2 className="w-4 h-4" />

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}