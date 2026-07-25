import { Pie, PieChart, Tooltip } from 'recharts';

// #region Sample data
export const data = [
     { name: "India", value: 482, fill: "#ec4899" },
     { name: "United States", value: 361, fill: "#06b6d4" },
     { name: "United Kingdom", value: 247, fill: "#84cc16" },
     { name: "Germany", value: 184, fill: "#f97316" },
     { name: "Japan", value: 126, fill: "#6366f1" },
];

// #endregion
export default function PiChart({ isAnimationActive = true }: { isAnimationActive?: boolean }) {
  return (
       <PieChart
            style={{
                 width: "100%",
                 maxWidth: "300px",
                 maxHeight: "25vh",
                 outline: "none",
                 aspectRatio: 1,
            }}
            responsive
       >
            <Pie
                 data={data}
                 innerRadius="60%"
                 outerRadius="100%"
                 // Corner radius is the rounded edge of each pie slice
                 // cornerRadius="50%"
                 fill="#e31d48"
                 // padding angle is the gap between each pie slice
                 paddingAngle={2}
                 dataKey="value"
                 stroke='none'
                 isAnimationActive={isAnimationActive}
            />
            <Tooltip />
       </PieChart>
  );
}