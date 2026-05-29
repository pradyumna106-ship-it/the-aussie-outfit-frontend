import { useEffect, useState } from "react";

import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

import { toast } from "sonner";

import CouponForm from "../components/CouponForm";

import {
  createCoupon,
  updateCoupon,
  getCouponById
} from "../api/admin.api.js";
import { ArrowLeft } from "lucide-react";

export default function CouponFormPage() {

  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = Boolean(id);
  const location = useLocation()
  const couponStateForm = location.state?.coupon;
  const [coupon, setCoupon] =
    useState(couponStateForm||null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (!couponStateForm && isEdit) {
      fetchCoupon();
    }

  }, [id]);


  const fetchCoupon = async () => {

    try {

      setLoading(true);

      const res =
        await getCouponById(id);

      setCoupon(res.data.data);

    } catch (error) {

      toast.error(
        "Failed to load coupon"
      );

    } finally {

      setLoading(false);

    }

  };

  const handleSubmit = async (
    formData
  ) => {

    try {

      setLoading(true);

      const payload = new FormData();

      payload.append(
        "title",
        formData.title
      );

      payload.append(
        "subtitle",
        formData.subtitle
      );

      payload.append(
        "targetUrl",
        formData.targetUrl
      );

      payload.append(
        "placement",
        formData.placement
      );

      payload.append(
        "sortOrder",
        formData.sortOrder
      );

      payload.append(
        "startsAt",
        formData.startsAt
      );

      payload.append(
        "expiresAt",
        formData.expiresAt
      );

      payload.append(
        "status",
        formData.status
      );

      if (formData.image) {

        payload.append(
          "image",
          formData.image
        );

      }

      if (formData.mobileImage) {

        payload.append(
          "mobileImage",
          formData.mobileImage
        );

      }

      if (isEdit) {

        await updateBanner(
          id,
          payload
        );

        toast.success(
          "Banner updated"
        );

      } else {

        await createBanner(
          payload
        );

        toast.success(
          "Banner created"
        );

      }

      navigate("/admin/banners");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Operation failed"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="
      min-h-screen
      bg-[#F6F1E6]
      p-8
    ">
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
              <ArrowLeft /> Back
            </button>   

      <div className="
        max-w-3xl
        mx-auto
      ">

        <h1 className="
          text-4xl
          font-bold
          text-[#1B1610]
          mb-8
        ">
          {
            isEdit
              ? "Edit Coupon"
              : "Create Coupon"
          }
        </h1>

        <CouponForm
          initialData={coupon}
          onSubmit={handleSubmit}
          loading={loading}
        />

      </div>

    </div>

  );

}