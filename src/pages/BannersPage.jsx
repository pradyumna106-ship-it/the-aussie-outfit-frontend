import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getBanners,
  deleteBanner
} from "../api/admin.api.js";

import BannerTable from "../components/BannerTable";
import { useNavigate } from "react-router-dom";

export default function BannersPage() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);

  const fetchBanners = async () => {

    try {

      const res = await getBanners();

      setBanners(res.data.data || []);

    } catch (error) {

      toast.error("Failed to load banners");

    }

  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {

    try {

      await deleteBanner(id);

      toast.success("Banner deleted");

      fetchBanners();

    } catch (error) {

      toast.error("Delete failed");

    }

  };

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
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-[#1B1610] mb-8">
          Banners
        </h1>

          <button
            onClick={() =>
              navigate("/admin/banners/create")
            }
            className="bg-[#255441] text-white px-5 py-3 rounded-2xl"
          >
            Add Banner
          </button>
      </div>

      <BannerTable
        banners={banners}
        onDelete={handleDelete}
      />

    </div>

  );

}