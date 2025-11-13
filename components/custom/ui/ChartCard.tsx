import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { DatePicker } from "./DatePicker";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

// Only import react-apexcharts on the client
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ChartCard = () => {
  const series = [
    { name: "Temperature", data: [31, 40, 28, 51, 42, 109, 100] },
    { name: "Humidity", data: [11, 32, 45, 32, 34, 52, 41] },
  ];

  const options: ApexOptions = {
    chart: { height: 350, type: "area" },
    colors: ["#FF4560", "#008FFB"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
    },
    tooltip: { x: { format: "dd/MM/yy HH:mm" } },
  };

  return (
    <div className="card p-6 rounded-xl shadow-sm bg-white space-y-6">
      {/* Filter Section */}
      <div className="flex items-end gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <DatePicker label="Start Date" />
        </div>

        <div className="flex-1 min-w-[200px]">
          <DatePicker label="End Date" />
        </div>

        <Button className="flex items-center gap-2 h-[42px]">
          Filter <SlidersHorizontal />
        </Button>
      </div>

      {/* Chart */}
      <div className="w-full">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default ChartCard;
