"use client";

import { Area, AreaChart, Tooltip, XAxis, YAxis } from "recharts";

type ChartData = {
     name: string;
     clicks: number;
};

interface ClickChartProps {
     isAnimationActive?: boolean;
     data: ChartData[];
}

const ClickChart = ({ isAnimationActive = true, data }: ClickChartProps) => {
     return (
          <AreaChart
               style={{
                    width: "100%",
                    maxWidth: "1000px",
                    maxHeight: "35vh",
                    aspectRatio: 1.618,
                    outline: "none",
               }}
               responsive
               data={data}
               margin={{
                    top: 10,
                    right: 6,
                    left: 0,
                    bottom: 0,
               }}
          >
               <defs>
                    <linearGradient
                         id="clickGradient"
                         x1="0"
                         y1="0"
                         x2="0"
                         y2="1"
                    >
                         <stop
                              offset="5%"
                              stopColor="#ec4899"
                              stopOpacity={0.35}
                         />
                         <stop
                              offset="95%"
                              stopColor="#ec4899"
                              stopOpacity={0}
                         />
                    </linearGradient>
               </defs>

               {/* <CartesianGrid strokeDasharray="3 3" vertical={false} /> */}

               <XAxis
                    dataKey="name"
                    minTickGap={20}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
               />

               <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={40}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) =>
                         Intl.NumberFormat("en", {
                              notation: "compact",
                         }).format(value)
                    }
               />

               <Tooltip
                    contentStyle={{
                         backgroundColor: "#0f172a",
                         border: "1px solid #334155",
                         borderRadius: "12px",
                         color: "#fff",
                    }}
                    labelStyle={{
                         color: "#94a3b8",
                         fontWeight: 500,
                    }}
                    itemStyle={{
                         color: "#ec4899",
                         fontWeight: 600,
                    }}
                    cursor={{ stroke: "#ec4899", strokeWidth: 1 }}
               />

               <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#ec4899"
                    strokeWidth={2}
                    fill="url(#clickGradient)"
                    fillOpacity={1}
                    dot={false}
                    activeDot={{ r: 3 }}
                    isAnimationActive={isAnimationActive}
                    animationDuration={1200}
               />
          </AreaChart>
     );
};

export default ClickChart;
