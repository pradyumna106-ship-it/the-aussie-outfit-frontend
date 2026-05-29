import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { toast } from "sonner";

// API
 import { forgotPassword } from "../api/auth.api.js";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
    
  const handleSubmit = async () => {

    try {
        console.log(email)
      setLoading(true);
        const payload = { email }
      // Replace with API call
      const res = await forgotPassword(payload);
      console.log(res)
        console.log(payload)
        console.log("After call: ",email)
        const resetToken = res.data.resetToken;
      if (
        res.status === 200
      ) {

        toast.success(
          "Reset token generated"
        );

        navigate(
          "/reset-password",
          {
            state: {
              resetToken
            }
          }
        );

      }

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to send reset request"
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
          Forgot Password
        </h1>

        <p className="
          text-[#6b6257]
          mb-8
        ">
          Enter your email address
        </p>

        <div className="space-y-6">

                <div>

                    <label className="
                    block
                    mb-2
                    text-sm
                    font-medium
                    text-[#1B1610]
                    ">
                    Email
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

                    <Mail className="
                        w-5
                        h-5
                        text-[#6b6257]
                    " />

                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) =>
                        setEmail(e.target.value)
                        }
                        placeholder="Enter email"
                        className="
                        w-full
                        px-3
                        py-4
                        outline-none
                        bg-transparent
                        "
                    />

                    </div>

                </div>

                <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSubmit()}
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
                        : "Send Reset Link"
                    }
                </button>

                </div>

      </div>

    </div>

  );

}