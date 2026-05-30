export default function SalesReportTable({
  reports, handleDelete
}) {

  return (

    <div
      className="
        overflow-x-auto
        bg-white
        rounded-3xl
        border
        border-[#e7dcc8]
      "
    >

      <table className="w-full">

        <thead
          className="
            bg-[#255441]
            text-white
          "
        >

          <tr>

            <th className="px-6 py-4 text-left">
              Period
            </th>

            <th className="px-6 py-4 text-left">
              Period Start
            </th>

            <th className="px-6 py-4 text-left">
              Period End
            </th>

            <th className="px-6 py-4 text-left">
              Orders
            </th>

            <th className="px-6 py-4 text-left">
              Revenue
            </th>

            <th className="px-6 py-4 text-left">
              Customers
            </th>

            <th className="px-6 py-4 text-left">
              Products
            </th>

            <th className="px-6 py-4 text-left">
              Cancelled
            </th>

            <th className="px-6 py-4 text-left">
              Refunded
            </th>

            <th className="px-6 py-4 text-left">
              Pending
            </th>

            <th className="px-6 py-4 text-left">
              Confirmed
            </th>

            <th className="px-6 py-4 text-left">
              Shipped
            </th>

            <th className="px-6 py-4 text-left">
              Delivered
            </th>

            <th className="px-6 py-4 text-left">
              Cancelled Status
            </th>

            <th className="px-6 py-4 text-left">
              Generated At
            </th>
            
            <th className="px-6 py-4 text-left">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {reports.map((report) => (

            <tr
              key={report._id}
              className="border-b"
            >

              <td className="px-6 py-4">
                {report.period}
              </td>

              <td className="px-6 py-4">
                {
                  new Date(
                    report.periodStart
                  ).toLocaleDateString()
                }
              </td>

              <td className="px-6 py-4">
                {
                  new Date(
                    report.periodEnd
                  ).toLocaleDateString()
                }
              </td>

              <td className="px-6 py-4">
                {report.totalOrders}
              </td>

              <td className="px-6 py-4">
                AUD $
                {report.totalRevenue}
              </td>

              <td className="px-6 py-4">
                {report.totalCustomers}
              </td>

              <td className="px-6 py-4">
                {report.totalProducts}
              </td>

              <td className="px-6 py-4">
                {report.cancelledOrders}
              </td>

              <td className="px-6 py-4">
                AUD $
                {report.refundedAmount}
              </td>

              <td className="px-6 py-4">
                {
                  report.orderStatusCounts
                    ?.pending
                }
              </td>

              <td className="px-6 py-4">
                {
                  report.orderStatusCounts
                    ?.confirmed
                }
              </td>

              <td className="px-6 py-4">
                {
                  report.orderStatusCounts
                    ?.shipped
                }
              </td>

              <td className="px-6 py-4">
                {
                  report.orderStatusCounts
                    ?.delivered
                }
              </td>

              <td className="px-6 py-4">
                {
                  report.orderStatusCounts
                    ?.cancelled
                }
              </td>

              <td className="px-6 py-4">
                {
                  new Date(
                    report.generatedAt
                  ).toLocaleString()
                }
              </td>
              <td className="px-6 py-4">
                <button
                    onClick={() =>
                      handleDelete(report._id)
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
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}