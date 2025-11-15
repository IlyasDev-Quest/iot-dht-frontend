import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { DatePicker } from "./DatePicker";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useChartData } from "@/hooks/useChartData";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function ChartCard() {
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    data,
    loading,
    error,
    noData,
    fetchData,
  } = useChartData();

  const options: ApexOptions = {
    chart: { height: 350, type: "area" },
    colors: ["#FF4560", "#008FFB"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    xaxis: { type: "datetime" },
    tooltip: { x: { format: "dd/MM/yy HH:mm" } },
  };

  return (
    <div className="card p-6 rounded-xl shadow-sm bg-white space-y-6">
      {/* Filter Section */}
      <div className="flex items-end gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
        </div>

        <Button
          onClick={fetchData}
          className="flex items-center gap-2 h-[42px]"
        >
          Filter <SlidersHorizontal />
        </Button>
      </div>

      {/* Chart */}
      <div className="w-full">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {noData && <p>No data for the selected interval.</p>}

        {!loading && !noData && (
          <ReactApexChart
            options={options}
            series={data}
            type="area"
            height={350}
          />
        )}
      </div>
    </div>
  );
}
