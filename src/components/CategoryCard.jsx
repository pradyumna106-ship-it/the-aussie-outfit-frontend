export function CategoryCard({ title, dark, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        h-[140px]
        rounded-lg
        border
        border-[#cfc3ad]
        p-6
        flex
        items-end
        cursor-pointer
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
        ${dark ? "bg-[#e5d6b8]" : "bg-[#fffdf6]"}
      `}
    >
      <h3 className="text-2xl font-bold text-[#1b1610]">
        {title}
      </h3>
    </div>
  );
}