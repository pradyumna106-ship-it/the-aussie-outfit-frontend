import { useNavigate } from "react-router-dom";
function Footer() {
  const navigate = useNavigate();

  const handleNavigate = (category) => {
    navigate(`/products/${category}`);
  };
  const footerData = {
    explore: [
      "Brands",
      "Hats",
      "Boots / Shoes",
      "Safety Boots",
      "Work Boots (Non-Safety)",
      "Workwear",
      "Accessories",
      "Sale",
      "Australian Made",
      "Gift Card",
    ],
    customerService: [
      "FAQs",
      "Sizing",
      "Returns",
      "Contact Us",
      "Shipping",
    ],
    information: [
      "Blog",
      "About Us",
      "Privacy Policy",
      "Terms & Conditions",
    ],
    brands: [
      "Akubra",
      "Bisley",
      "Blundstone",
      "FXD",
      "Hard Yakka",
      "KingGee",
      "Mongrel",
      "Redback",
      "RM Williams",
      "Steel Blue",
    ],
    connect: [
      "Facebook",
      "Instagram",
      "Youtube",
      "Blog",
    ],
  };

  return (
    <footer className="mt-20">
      {/* NEWSLETTER */}
      <div className="bg-[#8f7c61] py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            
            {/* LEFT */}
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold text-[#1b1610] uppercase mb-3">
                Stay Up To Date
              </h2>

              <p className="text-[#f4efe7] text-sm md:text-base leading-relaxed">
                Subscribe to our newsletter for Sales,
                Promotion and the latest news
              </p>
            </div>

            {/* RIGHT */}
            <div className="w-full lg:max-w-3xl">
              <div className="flex flex-col md:flex-row gap-3">
                
                {/* SELECT */}
                <select
                  className="
                    h-[52px]
                    px-4
                    bg-white
                    border
                    border-[#b9b1a4]
                    text-[#1b1610]
                    outline-none
                    w-full
                    md:w-[220px]
                  "
                >
                  <option>Select an option...</option>
                  <option>Men</option>
                  <option>Women</option>
                  <option>Workwear</option>
                  <option>Boots</option>
                </select>

                {/* EMAIL */}
                <input
                  type="email"
                  placeholder="ENTER EMAIL ADDRESS"
                  className="
                    h-[52px]
                    px-4
                    bg-white
                    border
                    border-[#b9b1a4]
                    outline-none
                    text-[#1b1610]
                    flex-1
                  "
                />

                {/* BUTTON */}
                <button
                  className="
                    h-[52px]
                    px-8
                    bg-[#1f1f1f]
                    hover:bg-black
                    text-white
                    font-semibold
                    uppercase
                    tracking-wide
                    transition-colors
                  "
                >
                  Subscribe
                </button>
              </div>

              <p className="text-white text-xs mt-4">
                By signing up, you agree to our privacy
                policy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER LINKS */}
      <div className="bg-[#222222] text-white py-16">
        <div
          className="
            max-w-7xl
            mx-auto
            px-6
            grid
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-5
            gap-10
          "
        >
          {/* EXPLORE */}
          <FooterColumn
            title="Explore"
            items={footerData.explore}
            onItemClick={(item) => {
              // Separate page later
              if (item === "Brands") {
                navigate("/brands");
                return;
              }

              handleNavigate(item);
            }}
          />

          <FooterColumn
            title="Customer Service"
            items={footerData.customerService}
          />

          <FooterColumn
            title="Information"
            items={footerData.information}
          />

          {/* BRANDS */}
          <FooterColumn
            title="Top Brands"
            items={footerData.brands}
            onItemClick={(item) =>
              handleNavigate(item)
            }
          />

          <FooterColumn
            title="Connect"
            items={footerData.connect}
          />
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="bg-[#f6f1e6] py-10 border-t border-[#d7cbb9]">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <h2 className="text-3xl md:text-4xl font-black text-[#1b1610] tracking-wide">
              EVERYTHING AUSTRALIAN
            </h2>
          </div>

          {/* BOTTOM */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#6b6257] text-center md:text-left">
              © 2026 Everything Australian. All Rights Reserved.
            </p>

            <div className="flex items-center gap-6 text-sm text-[#6b6257]">
              <a
                href="#"
                className="hover:text-[#245441] transition-colors"
              >
                Privacy Policy
              </a>

              <a
                href="#"
                className="hover:text-[#245441] transition-colors"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
  onItemClick,
}) {
  return (
    <div>
      <h3
        className="
          text-[#b9a487]
          text-lg
          font-bold
          uppercase
          tracking-wide
          mb-5
        "
      >
        {title}
      </h3>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item}>
            <button
              type="button"
              onClick={() =>
                onItemClick && onItemClick(item)
              }
              className="
                text-sm
                text-[#f4efe7]
                hover:text-[#cbb38f]
                transition-colors
                text-left
              "
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Footer;