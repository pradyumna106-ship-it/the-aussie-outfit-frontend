import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getSalesReports, deleteBanner } from "../api/admin.api.js";

import SalesReportTable from "../components/SalesReportTable";
import { useNavigate } from "react-router-dom";

export default function SalesReportsPage() {

  const [reports, setReports] = useState([]);
  const navigate = useNavigate()

  const fetchReports = async () => {

    try {

      const res = await getSalesReports();

      setReports(res.data.data || []);

    } catch (error) {

      toast.error("Failed to load sales reports");

    }

  };

  const handleDelete = async (id) => {
    const res = await deleteBanner(id);
    console.log(res.data.data);
  }

  useEffect(() => {
    fetchReports();
  }, []);

  return (

    <div className="p-8 bg-[#F6F1E6] min-h-screen">
      <button
            onClick={() => navigate(-1)}
            className="
              px-5
              py-3
              rounded-2xl
              bg-[#3d2f1f]
              text-white
              hover:bg-[#2b241c]
              transition
            "
          >
            Back to Dashboard
          </button>

      <h1 className="text-4xl font-bold text-[#1B1610] mb-8">
        Sales Reports
      </h1>

      <SalesReportTable reports={reports} handleDelete={handleDelete}/>

    </div>

  );

}