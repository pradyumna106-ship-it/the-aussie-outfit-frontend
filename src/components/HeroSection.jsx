import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HeroSection = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const isLoggedIn = user;
  const handleShopBoots = () => {
    navigate("/products/Boots");
  };

  const handleViewSale = () => {
    navigate("/products/Sale");
  };
    const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };
  return (
    <>
      <Helmet>
        <title>
          Everything Australian - Authentic Boots,
          Hats & Workwear
        </title>

        <meta
          name="description"
          content="Shop authentic Australian boots, hats, and workwear with 43+ years experience."
        />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#245441] via-[#3f6b57] to-[#d1a36d] text-white">
        
        {/* BACKGROUND OVERLAY */}
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
          
          <div className="grid md:grid-cols-2 gap-14 items-center">
            
            {/* LEFT CONTENT */}
            <div className="space-y-8">
              
              {/* BADGE */}
              <div>
                <span
                  className="
                    inline-block
                    bg-white/10
                    border
                    border-white/20
                    backdrop-blur-sm
                    px-4
                    py-2
                    rounded-full
                    text-xs
                    md:text-sm
                    tracking-[2px]
                    font-semibold
                    uppercase
                    text-[#f4d4a5]
                  "
                >
                  Authentic Australian Boots, Hats &
                  Workwear
                </span>
              </div>

              {/* HEADING */}
              <div className="space-y-5">
                <h1
                  className="
                    text-4xl
                    sm:text-5xl
                    lg:text-7xl
                    font-bold
                    leading-tight
                  "
                >
                  Built tough for work, weekends,
                  and the outback.
                </h1>

                <p
                  className="
                    text-base
                    md:text-lg
                    lg:text-xl
                    text-white/90
                    leading-relaxed
                    max-w-2xl
                  "
                >
                  A cleaner MERN storefront concept
                  for Everything Australian, focused
                  on fast category discovery,
                  confident sizing, trusted reviews,
                  and low-friction checkout.
                </p>
              </div>
                 {/* BUTTONS */}

              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  gap-4
                "
              >

               {/* LOGGED IN */}

                {isLoggedIn ? (
                  <>
                    <button
                      onClick={
                        handleShopBoots
                      }
                      className="
                        bg-[#c66e1c]
                        hover:bg-[#a85c17]
                        text-white
                        px-8
                        py-6
                        rounded-full
                        text-base
                        font-semibold
                        transition-all
                      "
                    >
                      Shop Boots
                    </button>

                    <button
                      onClick={
                        handleViewSale
                      }
                      className="
                        border-2
                        border-white
                        bg-transparent
                        hover:bg-white/10
                        text-white
                        px-8
                        py-6
                        rounded-full
                        text-base
                        font-semibold
                        transition-all
                      "
                    >
                      View Sale
                    </button>
                  </>
                ) : (
                  <>
                    {/* PUBLIC */}

                    <button
                      onClick={
                        handleRegister
                      }
                      className="
                        bg-[#c66e1c]
                        hover:bg-[#a85c17]
                        text-white
                        px-8
                        py-6
                        rounded-full
                        text-base
                        font-semibold
                        transition-all
                      "
                    >
                      Register
                    </button>

                    <button
                      onClick={
                        handleLogin
                      }
                      className="
                        border-2
                        border-white
                        bg-transparent
                        hover:bg-white/10
                        text-white
                        px-8
                        py-6
                        rounded-full
                        text-base
                        font-semibold
                        transition-all
                      "
                    >
                      Login
                    </button>
                  </>
                )}
              </div>

              {/* STATS */}
              <div className="flex flex-wrap gap-8 pt-6">
                
                <div>
                  <h3 className="text-3xl font-bold">
                    43+
                  </h3>

                  <p className="text-white/80 text-sm">
                    Years Experience
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold">
                    1000+
                  </h3>

                  <p className="text-white/80 text-sm">
                    Premium Products
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold">
                    Australia
                  </h3>

                  <p className="text-white/80 text-sm">
                    Wide Shipping
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="hidden md:block">
              <div className="relative">
                
                {/* GLOW */}
                <div className="absolute -inset-4 bg-[#d1a36d]/30 blur-3xl rounded-full" />

                {/* IMAGE */}
                <img
                  src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop"
                  alt="Australian Boots"
                  className="
                    relative
                    w-full
                    h-[520px]
                    object-cover
                    rounded-3xl
                    shadow-2xl
                    border
                    border-white/20
                  "
                />

                {/* FLOATING CARD */}
                <div
                  className="
                    absolute
                    bottom-6
                    left-6
                    bg-white/10
                    backdrop-blur-md
                    border
                    border-white/20
                    rounded-2xl
                    p-5
                    text-white
                  "
                >
                  <p className="text-sm text-white/80">
                    Best Selling Category
                  </p>

                  <h3 className="text-2xl font-bold mt-1">
                    Work Boots
                  </h3>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;