import { Pie, PieChart, Tooltip } from "recharts";
import { PiData } from "@/types";

interface PiProps {
     isAnimationActive?: boolean;
     data: PiData[];
}

export default function PiChart({ isAnimationActive = true, data }: PiProps) {
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
                    cornerRadius="2%"
                    fill="#e31d48"
                    // padding angle is the gap between each pie slice
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={isAnimationActive}
               />
               <Tooltip />
          </PieChart>
     );
}
