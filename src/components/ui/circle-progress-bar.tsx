import React from "react";

const CircleProgressBar = ({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) => {
  const colorVariants = {
    purple: "stroke-[#853063]",
    green: "stroke-[#308548]",
    red: "stroke-[#E90000]",
  };
  const radius = 85;
  const dashArray = radius * Math.PI * 2;
  const dashOffset =
    dashArray - (dashArray * (percentage > 100 ? 100 : percentage)) / 100;
  return (
    <div className="aspect-square   w-full h-full resize-none overflow-auto">
      <svg viewBox={`0 0 200 200`}>
        <circle
          cx="100"
          cy="100"
          strokeWidth="13px"
          r="85"
          className="fill-none stroke-[#CCCCCC]"
        />
        <circle
          cx="100"
          cy="100"
          strokeWidth="13px"
          r="85"
          // @ts-ignore
          className={`fill-none ${colorVariants[color]} `}
          style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset }}
          transform={`rotate(-180 ${200 / 2} ${200 / 2})`}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default CircleProgressBar;
