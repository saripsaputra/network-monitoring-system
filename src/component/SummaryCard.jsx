function SummaryCard({ title, value, color }) {
  return (
    <div
      className="
      bg-slate-900/60
      backdrop-blur-xl
      border
      border-slate-800
      rounded-3xl
      p-6
      hover:border-cyan-500
      duration-300
    "
    >
      <h3 className="text-slate-400 text-lg">
        {title}
      </h3>

      <h1
        className={`text-5xl font-bold mt-4 ${color}`}
      >
        {value}
      </h1>
    </div>
  );
}

export default SummaryCard;