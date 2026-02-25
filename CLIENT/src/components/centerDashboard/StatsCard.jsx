import { ArrowUpRight } from "lucide-react";

const highlightMap = {
  green: "from-green-500 to-green-600",
  blue: "from-blue-500 to-blue-600",
  yellow: "from-yellow-400 to-yellow-500",
  teal: "from-teal-500 to-teal-600",
};

const StatsCard = ({
  title,
  value,
  highlight = "teal",
  icon,
  subtitle,
}) => {
  return (
    <div
      className="
        relative overflow-hidden
        bg-white rounded-3xl p-6
        shadow-sm hover:shadow-md
        transition-all duration-300
      "
    >
      {/* Accent strip */}
      <div
        className={`
          absolute inset-x-0 top-0 h-1
          bg-linear-to-r ${highlightMap[highlight]}
        `}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500 font-medium">
          {title}
        </p>

        <div
          className={`
            p-2 rounded-xl
            bg-linear-to-br ${highlightMap[highlight]}
            text-white
          `}
        >
          {icon || <ArrowUpRight size={18} />}
        </div>
      </div>

      {/* Value */}
      <h3 className="text-4xl font-bold text-gray-900">
        {value}
      </h3>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-sm text-gray-500 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatsCard;
