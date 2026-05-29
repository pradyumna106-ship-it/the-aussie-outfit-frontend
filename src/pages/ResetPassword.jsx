import { useState } from "react";
import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

import { toast } from "sonner";

// API
import { resetPassword } from "../api/auth.api.js";

export default function ResetPassword() {

  const navigate = useNavigate();

  const location = useLocation();

  const resetToken =
    location.state?.resetToken;

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword
  ] = useState(false);

  const [formData, setFormData] =
    useState({
      password: "",
      confirmPassword: ""
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });

  };

  const handleSubmit = async () => {

    if (
      formData.password !==
      formData.confirmPassword
    ) {

      toast.error(
        "Passwords do not match"
      );

      return;

    }

    try {

      setLoading(true);

      // Replace with API
      const res = await resetPassword({
        token: resetToken,
        password: formData.password
      });
      console.log(res.data)
      toast.success(
        "Password reset successful"
      );

      navigate("/login");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Reset failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="
      min-h-screen
      bg-[#F6F1E6]
      flex
      items-center
      justify-center
      px-4
    ">

      <div className="
        w-full
        max-w-md
        bg-[#FFFDF6]
        border
        border-[#e7dcc8]
        rounded-3xl
        p-8
        shadow-sm
      ">

        <h1 className="
          text-3xl
          font-bold
          text-[#1B1610]
          mb-2
        ">
          Reset Password
        </h1>

        <p className="
          text-[#6b6257]
          mb-8
        ">
          Create a new password
        </p>

        <div
          className="space-y-6"
        >

          {/* PASSWORD */}
          <div>

            <label className="
              block
              mb-2
              text-sm
              font-medium
              text-[#1B1610]
            ">
              New Password
            </label>

            <div className="
              flex
              items-center
              border
              border-[#d8ccb7]
              rounded-2xl
              bg-white
              px-4
            ">

              <Lock className="
                w-5
                h-5
                text-[#6b6257]
              " />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="
                  w-full
                  px-3
                  py-4
                  outline-none
                  bg-transparent
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {
                  showPassword
                    ? <EyeOff />
                    : <Eye />
                }
              </button>

            </div>

          </div>

          {/* CONFIRM PASSWORD */}
          <div>

            <label className="
              block
              mb-2
              text-sm
              font-medium
              text-[#1B1610]
            ">
              Confirm Password
            </label>

            <div className="
              flex
              items-center
              border
              border-[#d8ccb7]
              rounded-2xl
              bg-white
              px-4
            ">

              <Lock className="
                w-5
                h-5
                text-[#6b6257]
              " />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                required
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                placeholder="Confirm password"
                className="
                  w-full
                  px-3
                  py-4
                  outline-none
                  bg-transparent
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {
                  showConfirmPassword
                    ? <EyeOff />
                    : <Eye />
                }
              </button>

            </div>

          </div>

          <button
             onClick={handleSubmit}
            disabled={loading}
            className="
              w-full
              bg-[#255441]
              hover:bg-[#1d4334]
              text-white
              py-4
              rounded-2xl
              font-semibold
              transition
              disabled:opacity-60
            "
          >
            {
              loading
                ? "Please wait..."
                : "Reset Password"
            }
          </button>

        </div>

      </div>

    </div>

  );

}