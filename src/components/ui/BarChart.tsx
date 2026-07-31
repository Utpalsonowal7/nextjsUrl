import {
     BarChart,
     Bar,
     XAxis,
     YAxis,
     CartesianGrid,
     Tooltip,
     Legend,
} from "recharts";

interface ChartProps {
     source?: string;
     clicks?: number;
}

interface ProvidedProps {
     data: ChartProps[];
     datakey: string
}


const SimpleBarChart = ({ data, datakey }: ProvidedProps) => {
     return (
          <BarChart
               style={{
                    width: "100%",
                    maxWidth: "700px",
                    maxHeight: "70vh",
                    aspectRatio: 1.618,
               }}
               responsive
               data={data}
               margin={{
                    top: 6,
                    right: 0,
                    left: 0,
                    bottom: 0,
               }}
               barCategoryGap="20%"
          >
               {/* <CartesianGrid strokeDasharray="3 3" /> */}
               <XAxis
                    dataKey={datakey}
                    tick={{
                         fontSize: 10,
                    }}
               />
               <YAxis
                    width="auto"
                    tick={{
                         fontSize: 10,
                    }}
               />
               <Tooltip
                    labelStyle={{
                         color: "#8884d8",
                         // fontWeight: 500,
                    }}
               />
               <Legend />
               <Bar
                    dataKey="clicks"
                    fill="#8884d8"
                    activeBar={{ fill: "pink", stroke: "blue" }}
                    radius={[2, 2, 0, 0]}
                    barSize={40}
               />
          </BarChart>
     );
};

export default SimpleBarChart;
