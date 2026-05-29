import { useEffect, useState } from "react";

import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

import { toast } from "sonner";

import BannerForm from "../components/BannerForm";

import {
  createBanner,
  updateBanner,
  getBannerById
} from "../api/admin.api.js";
import { ArrowLeft } from "lucide-react";

export default function BannerFormPage() {

  const navigate = useNavigate();
  const location = useLocation()
  const { id } = useParams();

  const isEdit = Boolean(id);
  const bannerFromState = location.state?.banner
  const [banner, setBanner] =
    useState(bannerFromState||null);

  const [loading, setLoading] =
    useState(false);

    
  useEffect(() => {

    if (isEdit) {
      fetchBanner();
    }

  }, [id]);

  const fetchBanner = async () => {

    try {

      setLoading(true);

      const res =
        await getBannerById(id);

      setBanner(res.data.data);

    } catch (error) {

      toast.error(
        "Failed to load banner"
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

      if (formData.imageUrl) {

        payload.append(
          "imageUrl",
          formData.imageUrl
        );

      }

      if (formData.mobileImageUrl) {

        payload.append(
          "mobileImageUrl",
          formData.mobileImageUrl
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
              ? "Edit Banner"
              : "Create Banner"
          }
        </h1>

        <BannerForm
          initialData={banner}
          onSubmit={handleSubmit}
          loading={loading}
        />

      </div>

    </div>

  );

}