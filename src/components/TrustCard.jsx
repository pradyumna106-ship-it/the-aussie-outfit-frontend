export function TrustCard({ title, desc }) {
  return (
    <div className="bg-[#fffdf6] border border-[#cfc3ad] rounded-lg p-6 hover:shadow-md transition-all duration-300">
      
      <h3 className="text-[#255441] text-xl font-bold mb-2">
        {title}
      </h3>

      <p className="text-sm leading-6 text-[#635846]">
        {desc}
      </p>
    </div>
  );
}