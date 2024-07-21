// Copyright 2024 Patricia García Fernández.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';

export default function DonutChart({ total, value }: {total:any, value:any}) {
  const radius = 50; // radio del círculo
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = total !== 0 ? circumference - (value / total) * circumference : 0;

  return (
    <svg width="20%" height="20%" viewBox="0 0 120 120">
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#d8d8d8"
        strokeWidth="10"
        fill="transparent"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#000000"
        strokeWidth="10"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 60 60)`}
        style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
      />
      <text
        data-testid='total-tasks-donut'
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
