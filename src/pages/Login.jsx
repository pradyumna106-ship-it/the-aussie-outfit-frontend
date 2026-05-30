import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/auth.api.js"
export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.clear()
    setError("");

    const { email, password } = formData;

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    const payload = {email, password};
    try {
      const res = await loginUser(payload);

      console.log("Received Response:", res);

      console.log("Login Success:", res.data);
      login({
        token: res.data.data.accessToken,
        refreshToken: res.data.data.refreshToken,
        user: res.data.data.user
      })
      navigate("/");

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1e6] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[#fffcf6] border border-[#d8ccb8] rounded-[40px] shadow-xl p-8">

        <div className="text-center mb-8">
          <p className="text-[#245441] font-semibold uppercase tracking-[0.2em] text-sm mb-2">
            Welcome Back
          </p>

          <h1 className="text-3xl font-bold text-[#1d1d1d] mb-2">
            Login
          </h1>

          <p className="text-[#6b6257] text-sm">
            Continue shopping Australian products
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              ✉️
            </span>

            <input
              type="email"
              name="email"
              placeholder="EMAIL"
              value={formData.email}
              onChange={handleChange}
              className="
                w-full h-12 pl-12 pr-4
                rounded-md border border-[#cec3ad]
                bg-white outline-none
                text-sm uppercase
                focus:ring-2 focus:ring-[#245441]
              "
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              🔒
            </span>

            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              value={formData.password}
              onChange={handleChange}
              className="
                w-full h-12 pl-12 pr-4
                rounded-md border border-[#cec3ad]
                bg-white outline-none
                text-sm uppercase
                focus:ring-2 focus:ring-[#245441]
              "
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="
              w-full h-12
              bg-[#245441]
              hover:bg-[#1c4032]
              transition
              text-white
              rounded-md
              font-semibold
              flex items-center justify-center gap-2
            "
          >
            Login
            <span>→</span>
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">

          <button
            onClick={() => navigate(`/forget-password`)}
            type="button"
            className="text-sm text-[#245441] hover:underline"
          >
            Forgot Password?
          </button>

          <p className="text-[#6b6257] text-sm">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-[#245441] font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
        {/* FOOTER */}
            <div className="mt-8 text-center">

              <p className="text-[#6b6257]">

                Are you a Admin?{" "}

                <Link
                  to="/admin/login"
                  className="text-[#245441] font-semibold hover:underline"
                >
                  Admin Login
                </Link>

              </p>

            </div>
      </div>
    </div>
  );
}

export default Login;