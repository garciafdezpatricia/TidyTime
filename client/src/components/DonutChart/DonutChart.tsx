import React from 'react';

export default function DonutChart({ total, value }: {total:any, value:any}) {
  const radius = 50; // radio del círculo
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / total) * circumference;

  return (
    <svg width="20%" height="20%" viewBox="0 0 120 120">
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#d3d3d3"
        strokeWidth="10"
        fill="transparent"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#879C89"
        strokeWidth="10"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 60 60)`}
        style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
      />
      <text
        x="60"
        y="60"
        textAnchor="middle"
        dy=".3em"
        fontSize="20">
        {`${value}/${total}`}
      </text>
    </svg>
  );
};
