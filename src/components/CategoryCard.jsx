export function CategoryCard({
  title,
  dark,
  onClick,
  image
}) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-lg
        border
        border-[#cfc3ad]
        overflow-hidden
        cursor-pointer
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
        ${dark ? "bg-[#e5d6b8]" : "bg-[#fffdf6]"}
      `}
    >
      {/* IMAGE */}
      <div className="h-[180px] w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-300
            hover:scale-105
          "
        />
      </div>

      {/* CATEGORY NAME */}
      <div className="p-4 text-center">
        <h3 className="text-xl font-bold text-[#1b1610]">
          {title}
        </h3>
      </div>
    </div>
  );
}