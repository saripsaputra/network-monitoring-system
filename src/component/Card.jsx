import { motion } from "framer-motion";

function Card({
  title,
  value,
}) {
  const getColor = () => {
    const number =
      parseInt(value);

    if (number >= 80)
      return "text-red-400";

    if (number >= 60)
      return "text-yellow-400";

    return "text-cyan-400";
  };

  return (
    <div
      className="
        bg-slate-900/60
        backdrop-blur-xl
        border
        border-slate-800
        rounded-3xl
        p-6
      "
    >
      <p className="text-slate-400">
        {title}
      </p>

      <h1
        className={`
          text-5xl
          font-bold
          mt-4
          ${getColor()}
        `}
      >
        {value}
      </h1>
    </div>
  );
}

export default Card;