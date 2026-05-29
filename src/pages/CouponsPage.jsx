import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  getCoupons,
  deleteCoupon
} from "../api/admin.api.js";

import CouponTable from "../components/CouponTable";

export default function CouponsPage() {

  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);

  const [loading, setLoading] = useState(false);

    const fetchCoupons = async () => {

    try {

      setLoading(true);

      const res = await getCoupons();

      setCoupons(res.data.data || []);

    } catch (error) {

      toast.error("Failed to load coupons");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {

    try {

      await deleteCoupon(id);

      toast.success("Coupon deleted");

      fetchCoupons();

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

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-4xl font-bold text-[#1B1610]">
          Coupons
        </h1>

        <button
          onClick={() =>
            navigate("/admin/coupons/create")
          }
          className="bg-[#255441] text-white px-5 py-3 rounded-2xl"
        >
          Create Coupon
        </button>

      </div>

      <CouponTable
        coupons={coupons}
        loading={loading}
        onDelete={handleDelete}
      />

    </div>

  );

};