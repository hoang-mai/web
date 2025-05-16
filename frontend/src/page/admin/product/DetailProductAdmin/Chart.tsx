import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { get } from "../../../../services/callApi";
import { statisticRevenueProduct } from "@/services/api";
import { Box, Button, Typography, alpha, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import DateRangeIcon from "@mui/icons-material/DateRange";

interface StatisticRevenueProduct {
  revenue: number;
  week?: number;
  month?: number;
  year?: number;
}

type ViewLevel = "year" | "month" | "week";
type ChartType = "bar" | "line";

const Chart = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const [revenueData, setRevenueData] = useState<StatisticRevenueProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Chart configuration
  const [chartType, setChartType] = useState<ChartType>("bar");

  // View level and navigation
  const [viewLevel, setViewLevel] = useState<ViewLevel>("year");
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<
    { year?: number; month?: number }[]
  >([]);

  // Fetch chart data
  useEffect(() => {
    const fetchRevenueData = async () => {

      let url = `${statisticRevenueProduct}/${id}`;
      const params = [];

      if (year) {
        params.push(`year=${year}`);
      }

      if (month) {
        params.push(`month=${month}`);
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      try {
        const response = await get(url);
        setRevenueData(response.data.data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueData();
  }, [id, year, month]);

  // Click handler for data points
  const handleDataClick = (dataIndex: number) => {
    if (dataIndex >= 0 && dataIndex < revenueData.length) {
      const item = revenueData[dataIndex];

      if (item.year && !item.month && !item.week) {
        // If year is clicked, show months of that year
        setNavigationHistory((prev) => [...prev, { year: item.year }]);
        setYear(item.year);
        setMonth(null);
        setViewLevel("month");
      } else if (item.year && item.month && !item.week) {
        // If month is clicked, show weeks of that month
        setNavigationHistory((prev) => [
          ...prev,
          { year: item.year, month: item.month },
        ]);
        setMonth(item.month);
        setViewLevel("week");
      }
    }
  };

  const handleBackNavigation = () => {
    // Pop the last navigation entry and navigate back
    if (navigationHistory.length > 0) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      setNavigationHistory(newHistory);

      if (viewLevel === "week") {
        // Go back to month view
        setMonth(null);
        setViewLevel("month");
      } else if (viewLevel === "month") {
        // Go back to year view
        setYear(null);
        setViewLevel("year");
      }
    }
  };

  const handleChartTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: ChartType | null
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Đang tải dữ liệu biểu đồ...
        </Typography>
      </Box>
    );
  }

  if (!revenueData || revenueData.length === 0) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Không có dữ liệu doanh thu để hiển thị
        </Typography>
      </Box>
    );
  }

  // Generate x-axis labels based on the view level
  const xLabels = revenueData.map((item) =>
    item.week
      ? `Tuần ${item.week}`
      : item.month
      ? `Tháng ${item.month}`
      : item.year
      ? `${item.year}`
      : ""
  );

  // Get view level icon
  const getLevelIcon = () => {
    switch (viewLevel) {
      case "week":
        return <CalendarViewWeekIcon sx={{ mr: 1 }} />;
      case "month":
        return <CalendarViewMonthIcon sx={{ mr: 1 }} />;
      default:
        return <DateRangeIcon sx={{ mr: 1 }} />;
    }
  };

  return (
    <Box>
      {/* Chart controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {getLevelIcon()}
          <Typography variant="body1" fontWeight={500}>
            {viewLevel === "week"
              ? `Tuần (${year} - Tháng ${month})`
              : viewLevel === "month"
              ? `Tháng (${year})`
              : "Năm"}
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          aria-label="chart type"
          size="small"
          sx={{
            "& .MuiToggleButtonGroup-grouped": {
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              "&.Mui-selected": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                },
              },
            },
          }}
        >
          <ToggleButton value="bar" aria-label="bar chart">
            <BarChartIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="line" aria-label="line chart">
            <ShowChartIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Chart rendering */}
      <Box
        sx={{
          height: 350,
          width: "100%",
          mt: 2,
        }}
      >
        {chartType === "bar" ? (
          <BarChart
            onItemClick={(_, params) => {
              const { dataIndex } = params;
              handleDataClick(dataIndex);
            }}
            xAxis={[
              {
                scaleType: "band",
                data: xLabels,
                tickLabelStyle: {
                  fontSize: 12,
                  color: alpha(theme.palette.text.primary, 0.7),
                },
              },
            ]}
            series={[
              {
                data: revenueData.map((item) => item.revenue),
                label: "Doanh thu (VNĐ)",
                color: "var(--color-primary, #FFC107)",
                highlightScope: {
                  highlight: "item",
                  fade: "series",
                },
              },
            ]}
            height={340}
            margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
            slotProps={{
              bar: {
                style: { cursor: "pointer" },
              },
            }}
          />
        ) : (
          <LineChart
            xAxis={[
              {
                scaleType: "point",
                data: xLabels,
                tickLabelStyle: {
                  fontSize: 12,
                  color: alpha(theme.palette.text.primary, 0.7),
                },
              },
            ]}
            series={[
              {
                data: revenueData.map((item) => item.revenue),
                label: "Doanh thu (VNĐ)",
                curve: "natural",
                color: "var(--color-tertiary, #2979ff)",
                area: true,
                highlightScope: {
                  highlight: "item",
                  fade: "series",
                },
              },
            ]}
            height={340}
            margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
            slotProps={{
              line: {
                style: { cursor: "pointer" },
              },
            }}
          />
        )}
      </Box>

      {/* Back navigation */}
      {navigationHistory.length > 0 && (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackNavigation}
            size="medium"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              py: 1,
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              "&:hover": {
                bgcolor: alpha(theme.palette.background.paper, 1),
              },
            }}
          >
            Quay lại {viewLevel === "week" ? "tháng" : "năm"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Chart;
