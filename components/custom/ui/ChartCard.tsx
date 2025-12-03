import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { DatePicker } from "./DatePicker";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useChartData } from "@/hooks/useChartData";
import { Badge } from "@/components/ui/badge";

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
    groupBy,
    fetchData,
  } = useChartData();

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "line",
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
    },
    colors: ["#FF4560", "#008FFB"],
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false, // This ensures local time display
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
          hour: "HH:mm",
        },
      },
    },
    yaxis: [
      {
        title: { text: "Temperature (°C)" },
        labels: {
          formatter: (val) => val.toFixed(1) + "°C",
        },
      },
      {
        opposite: true,
        title: { text: "Humidity (%)" },
        labels: {
          formatter: (val) => val.toFixed(1) + "%",
        },
      },
    ],
    tooltip: {
      x: {
        format:
          groupBy === "minute"
            ? "dd MMM yyyy HH:mm"
            : groupBy === "hour"
            ? "dd MMM yyyy HH:mm"
            : groupBy === "day"
            ? "dd MMM yyyy"
            : groupBy === "week"
            ? "'Week' w, yyyy"
            : "MMM yyyy",
      },
      y: {
        formatter: (val, { seriesIndex }) => {
          const unit = seriesIndex === 0 ? "°C" : "%";
          return val.toFixed(1) + unit;
        },
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  };

  const getGroupByLabel = () => {
    switch (groupBy) {
      case "minute":
        return "Per Minute";
      case "hour":
        return "Hourly";
      case "day":
        return "Daily";
      case "week":
        return "Weekly";
      case "month":
        return "Monthly";
      default:
        return "";
    }
  };

  return (
    <div className="card p-6 rounded-xl shadow-sm bg-white space-y-6">
      {/* Header with Grouping Badge */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Temperature & Humidity</h3>
        {groupBy && data.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {getGroupByLabel()} Averages
          </Badge>
        )}
      </div>

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
          disabled={!startDate || !endDate || loading}
          className="flex items-center gap-2 h-[42px]"
        >
          {loading ? "Loading..." : "Filter"}{" "}
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Chart */}
      <div className="w-full">
        {loading && (
          <div className="flex items-center justify-center h-[350px]">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">
                Loading chart data...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-[350px]">
            <div className="text-center">
              <p className="text-red-500 font-medium">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {noData && !loading && (
          <div className="flex items-center justify-center h-[350px]">
            <div className="text-center text-muted-foreground">
              <p className="font-medium">No data available</p>
              <p className="text-sm mt-1">
                Try selecting a different date range
              </p>
            </div>
          </div>
        )}

        {!loading && !error && !noData && data.length > 0 && (
          <ReactApexChart
            options={options}
            series={data}
            type="line"
            height={350}
          />
        )}
      </div>

      {/* Data Info */}
      {!loading && !error && !noData && data.length > 0 && (
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Showing {data[0]?.data?.length || 0} data points
        </div>
      )}
    </div>
  );
}
