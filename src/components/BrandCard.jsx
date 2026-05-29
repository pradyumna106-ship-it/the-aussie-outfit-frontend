export function BrandCard({ name, dark, onClick, logo }) {
  return (
    <div
      onClick={onClick}
      className={`
        group
        h-[180px]
        rounded-2xl
        border
        border-[#d8ccb7]
        px-6
        py-5
        flex
        flex-col
        items-center
        justify-between
        cursor-pointer
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        hover:border-[#b79d74]
        ${dark ? "bg-[#efe1c6]" : "bg-[#fffdf7]"}
      `}
    >
      {/* Logo */}
      <div className="flex-1 flex items-center justify-center w-full">
        <img
          src={logo}
          alt={name}
          className="
            max-h-[80px]
            object-contain
            transition-transform
            duration-300
            group-hover:scale-105
          "
        />
      </div>

      {/* Brand Name */}
      <div className="pt-4 text-center">
        <span
          className="
            text-[16px]
            font-semibold
            tracking-wide
            text-[#2b241c]
          "
        >
          {name}
        </span>
      </div>
    </div>
  );
}