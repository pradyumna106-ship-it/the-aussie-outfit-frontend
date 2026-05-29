import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  UserCog,
} from "lucide-react";

import { loginUser } from "../api/auth.api.js";
import { useAuth } from "../context/AuthContext";

export function AdminLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!email || !password) {

      setError("Please fill in all fields");

      return;
    }

    try {

      setLoading(true);

      const payload = {
        email,
        password,
      };

      const res = await loginUser(payload);

      console.log("LOGIN RESPONSE:", res.data);

      const authData = {
        token: res.data.data.accessToken,
        refreshToken: res.data.data.refreshToken,
        user: res.data.data.user,
      };

      // CHECK ADMIN ROLE
      const roles = authData?.user?.roles || [];

      if (!roles.includes("admin")) {

        setError("Unauthorized Admin Access");

        return;
      }

      // SAVE USING AUTH CONTEXT
      login(authData);

      console.log("ADMIN LOGIN SUCCESS:", authData);

      navigate("/admin/dashboard");

    } catch (err) {

      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1e6] flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-[#fffcf6] rounded-3xl overflow-hidden shadow-xl border border-[#d8ccb8]">

        {/* LEFT SECTION */}
        <div className="hidden lg:flex flex-col justify-between bg-[#1c4032] text-white p-12 relative overflow-hidden">

          <div>

            <p className="uppercase tracking-[0.25em] text-sm text-[#d7e6de] mb-4">
              Admin Portal
            </p>

            <h1 className="text-5xl font-bold leading-tight mb-6">
              Manage Everything Australian
            </h1>

            <p className="text-[#d7e6de] text-lg leading-relaxed max-w-md">
              Secure administrator access for managing products,
              orders, customers, inventory, and analytics.
            </p>

          </div>

          <div className="space-y-6">

            <div className="flex items-start gap-4">

              <div className="bg-white/10 p-3 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>

                <h3 className="font-semibold text-lg">
                  Secure Admin Access
                </h3>

                <p className="text-[#d7e6de] text-sm">
                  Protected login with role-based authentication.
                </p>

              </div>
            </div>

            <div className="flex items-start gap-4">

              <div className="bg-white/10 p-3 rounded-xl">
                <UserCog className="w-6 h-6" />
              </div>

              <div>

                <h3 className="font-semibold text-lg">
                  Full Management Control
                </h3>

                <p className="text-[#d7e6de] text-sm">
                  Manage catalogue, customers, shipping,
                  and reporting.
                </p>

              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="p-8 md:p-12 flex flex-col justify-center">

          <div className="max-w-md mx-auto w-full">

            {/* HEADER */}
            <div className="mb-10">

              <p className="text-[#245441] font-semibold uppercase tracking-[0.2em] text-sm mb-3">
                Administrator Access
              </p>

              <h2 className="text-4xl font-bold text-[#1d1d1d] mb-3">
                Admin Login
              </h2>

              <p className="text-[#6b6257]">
                Login to manage products, orders, and customers.
              </p>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* EMAIL */}
              <div>

                <label className="block text-sm font-semibold text-[#3d382f] mb-2">
                  Email Address
                </label>

                <div className="relative">

                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a7166]" />

                  <input
                    type="email"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                      w-full
                      pl-12
                      pr-4
                      py-4
                      rounded-xl
                      border
                      border-[#cec3ad]
                      bg-white
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#245441]
                      text-[#1d1d1d]
                    "
                  />

                </div>
              </div>

              {/* PASSWORD */}
              <div>

                <label className="block text-sm font-semibold text-[#3d382f] mb-2">
                  Password
                </label>

                <div className="relative">

                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a7166]" />

                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                      w-full
                      pl-12
                      pr-4
                      py-4
                      rounded-xl
                      border
                      border-[#cec3ad]
                      bg-white
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#245441]
                      text-[#1d1d1d]
                    "
                  />

                </div>
              </div>

              {/* ERROR */}
              {error && (

                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* FORGOT PASSWORD */}
              <div className="flex justify-end">

                <button
                  onClick={() => navigate(`/forget-password`)}
                  type="button"
                  className="text-[#245441] text-sm font-medium hover:underline"
                >
                  Forgot Password?
                </button>

              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  bg-[#245441]
                  hover:bg-[#1c4032]
                  transition-colors
                  text-white
                  py-4
                  rounded-xl
                  font-semibold
                  text-lg
                  flex
                  items-center
                  justify-center
                  gap-2
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >

                {loading ? "Logging in..." : "Admin Login"}

                <ArrowRight className="w-5 h-5" />

              </button>

            </form>

            {/* FOOTER */}
            <div className="mt-8 text-center">

              <p className="text-[#6b6257]">

                Are you a customer?{" "}

                <Link
                  to="/login"
                  className="text-[#245441] font-semibold hover:underline"
                >
                  Customer Login
                </Link>

              </p>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}