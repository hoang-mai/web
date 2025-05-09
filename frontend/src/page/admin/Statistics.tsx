import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Divider,
  styled,
  Stack,
  alpha,
  useTheme,
  CircularProgress,
  Tab,
  Tabs,
  Alert,
  Button,
} from "@mui/material";
import { BarChart, LineChart, PieChart, axisClasses } from "@mui/x-charts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";
import { get } from "@/services/callApi";
import { statisticRevenue } from "@/services/api";

interface StatisticRevenue {
  week?: number;
  month?: number;
  year?: number;
  revenueTotal: number;
  quantityDelivered: number;
  quantityPending: number;
  quantityCancelled: number;
  quantityReturned: number;
  bestSellingProducts: BestSellingProduct[];
  revenue: Revenue[];
}
interface BestSellingProduct {
  name: string;
  total: number;
}
interface Revenue {
  year?: number;
  month?: number;
  week?: number;
  day?: number;
  revenue: number;
  quantityDelivered: number;
  quantityPending: number;
  quantityCancelled: number;
  quantityReturned: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Styled components
const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  height: "100%",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  },
}));

const StatBox = styled(Box)(({ theme }) => ({
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  flex: "1 1 230px",
  minWidth: "230px",
}));

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`stats-tabpanel-${index}`}
      aria-labelledby={`stats-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `stats-tab-${index}`,
    "aria-controls": `stats-tabpanel-${index}`,
  };
}
type ViewLevel = "year" | "month" | "week" | "day";
function Statistics() {
  const theme = useTheme();
  const [chartType, setChartType] = useState<"line" | "bar">("bar");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [tabValue, setTabValue] = useState(0);
  // View level and navigation
  const [viewLevel, setViewLevel] = useState<ViewLevel>("year");
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [week, setWeek] = useState<number | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<
    { year?: number; month?: number; week?: number }[]
  >([]);
  const [revenueData, setRevenueData] = useState<StatisticRevenue>({
    revenueTotal: 0,
    quantityDelivered: 0,
    quantityPending: 0,
    quantityCancelled: 0,
    quantityReturned: 0,

    bestSellingProducts: [{ name: "Product A", total: 0 }],

    revenue: [
      {
        year: 2025,
        revenue: 0,
        quantityDelivered: 0,
        quantityPending: 0,
        quantityCancelled: 0,
        quantityReturned: 0,
      },
    ],
  });

  // Function to handle chart type change
  const handleChartTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newChartType: "line" | "bar" | null
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Format data for charts
  const chartMonths = revenueData?.revenue.map((item) => {
    if (item.day) {
      if (item.day !== 7) {
        return `Ngày ${item.day}`;
      } else {
        return `Chủ nhật`;
      }
    } else if (item.week) {
      return `Tuần ${item.week}`;
    } else if (item.month) {
      return `Tháng ${item.month}`;
    } else if (item.year) {
      return `Năm ${item.year}`;
    }
  });
  const revenueValues = revenueData?.revenue.map((item) => item.revenue);
  const deliveredValues = revenueData?.revenue.map(
    (item) => item.quantityDelivered
  );
  const pendingValues = revenueData?.revenue.map(
    (item) => item.quantityPending
  );
  const cancelledValues = revenueData?.revenue.map(
    (item) => item.quantityCancelled
  );
  const returnedValues = revenueData?.revenue.map(
    (item) => item.quantityReturned
  );

  const productCounts: Record<string, number> = {};
  revenueData?.bestSellingProducts.forEach((product) => {
    if (productCounts[product.name]) {
      productCounts[product.name] += product.total;
    } else {
      productCounts[product.name] = product.total;
    }
  });

  const topProducts = Object.entries(productCounts)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Click handler for data points
  const handleDataClick = (dataIndex: number) => {
    if (dataIndex >= 0 && dataIndex < revenueData?.revenue.length) {
      const item = revenueData?.revenue[dataIndex];

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
      } else if (item.year && item.month && item.week && !item.day) {
        // If week is clicked, show days of that week
        console.log(navigationHistory);
        setNavigationHistory((prev) => [
          ...prev,
          { year: item.year, month: item.month },
        ]);
        setWeek(item.week);
        setViewLevel("day");
      }
    }
  };
  const handleBackNavigation = () => {
    // Pop the last navigation entry and navigate back
    if (navigationHistory.length > 0) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      setNavigationHistory(newHistory);

      if (viewLevel === "day") {
        setWeek(null);
        setViewLevel("week");
      } else if (viewLevel === "week") {
        setMonth(null);
        setViewLevel("month");
      } else if (viewLevel === "month") {
        setYear(null);
        setViewLevel("year");
      }
    }
  };
  // In a real application, you would fetch the statistics data here
  useEffect(() => {
    let url = statisticRevenue;
    if (year) {
      url += `?year=${year}`;
    }
    if (month) {
      url += `&month=${month}`;
    }
    if (week) {
      url += `&week=${week}`;
    }
    get(url)
      .then((res) => {
        setRevenueData(res.data.data);
      })
      .catch(() => {
        setError("Có lỗi xảy ra vui lòng thử lại");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [year, month, viewLevel]);

  const totalRevenue = revenueData?.revenueTotal || 0;
  const totalOrders =
    (revenueData?.quantityDelivered || 0) +
    (revenueData?.quantityPending || 0) +
    (revenueData?.quantityCancelled || 0) +
    (revenueData?.quantityReturned || 0);

  // Chart styling
  const chartStyling = {
    height: 350,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-20px, 0)",
      },
    },
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Thống kê
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3, bgcolor: "#f8f9fa" }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        fontWeight="bold"
        color="#1a3353"
      >
        Thống kê
      </Typography>

      {/* Statistics Summary Cards */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        <StatBox sx={{ bgcolor: alpha("#3B82F6", 0.1) }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: "50%",
              bgcolor: "#3B82F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 12px ${alpha("#3B82F6", 0.2)}`,
            }}
          >
            <AttachMoneyIcon sx={{ color: "white" }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Tổng doanh thu
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {totalRevenue.toLocaleString("vi-VN")} ₫
            </Typography>
          </Box>
        </StatBox>

        <StatBox sx={{ bgcolor: alpha("#9C27B0", 0.1) }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: "50%",
              bgcolor: "#9C27B0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 12px ${alpha("#9C27B0", 0.2)}`,
            }}
          >
            <InventoryIcon sx={{ color: "white" }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Đơn hàng
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {totalOrders.toLocaleString()}
            </Typography>
          </Box>
        </StatBox>
      </Box>

      {/* Tabs */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          mb: 4,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="statistics tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                py: 2,
              },
              "& .Mui-selected": {
                color: "var(--color-primary) !important",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "var(--color-primary)",
                height: 3,
              },
            }}
          >
            <Tab
              label="Doanh Thu"
              {...a11yProps(0)}
              icon={<TrendingUpIcon />}
              iconPosition="start"
            />
            <Tab
              label="Đơn Hàng"
              {...a11yProps(1)}
              icon={<InventoryIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {/* Chart Toggle Buttons */}
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Back navigation centered */}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              {navigationHistory.length > 0 && (
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
                  Quay lại{" "}
                  {viewLevel === "day"
                    ? "tuần"
                    : viewLevel === "week"
                    ? "tháng"
                    : viewLevel === "month"
                    ? "năm"
                    : ""}
                </Button>
              )}
            </Box>

            {/* Toggle buttons right-aligned */}
            <Box sx={{ mr: 2 }}>
              <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={handleChartTypeChange}
                aria-label="chart type"
                size="small"
                sx={{
                  "& .MuiToggleButtonGroup-grouped": {
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
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
                  <BarChartIcon fontSize="small" sx={{ mr: 0.5 }} />
                </ToggleButton>
                <ToggleButton value="line" aria-label="line chart">
                  <ShowChartIcon fontSize="small" sx={{ mr: 0.5 }} />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* Revenue Chart */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
              mb: 4,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Doanh thu theo {viewLevel=== "day"?"ngày":viewLevel==="week"?"tuần":viewLevel==="month"?"tháng":"năm"}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box>
              {chartType === "line" ? (
                <LineChart 
                  
                  {...chartStyling}
                  xAxis={[{ data: chartMonths, scaleType: "band" }]}
                  series={[
                    {
                      data: revenueValues,
                      label: "Doanh thu (VNĐ)",
                      color: "var(--color-primary)",
                      curve: "natural",
                      area: true,
                    },
                  ]}
                />
              ) : (
                <BarChart
                  {...chartStyling}
                  onItemClick={(_, params) => {
                    const { dataIndex } = params;
                    handleDataClick(dataIndex);
                  }}
                  xAxis={[{ data: chartMonths, scaleType: "band" }]}
                  series={[
                    {
                      data: revenueValues,
                      label: "Doanh thu (VNĐ)",
                      color: "var(--color-primary)",
                    },
                  ]}
                />
              )}
            </Box>
          </Paper>

          {/* Best Selling Products */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Sản phẩm bán chạy
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
              }}
            >
              <Box sx={{ flex: "1 1 60%", minHeight: 350 }}>
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: topProducts.map((p) => p.name),
                      tickLabelStyle: {
                        angle: 315,
                        textAnchor: "end",
                        fontSize: 12,
                      },
                    },
                  ]}
                  series={[
                    {
                      data: topProducts.map((p) => p.total),
                      color: "#8884d8",
                      label: "Đã bán",
                    },
                  ]}
                  height={350}
                />
              </Box>

              <Box sx={{ flex: "1 1 40%", minHeight: 350 }}>
                <PieChart
                  series={[
                    {
                      data: topProducts.map((p, i) => ({
                        id: i,
                        value: p.total,
                        label: p.name,
                      })),
                      highlightScope: {
                        highlight: "item",
                        fade: "global",
                      },
                      arcLabel: (item) => `${item.value}`,
                      arcLabelMinAngle: 20,
                    },
                  ]}
                  height={350}
                />
              </Box>
            </Box>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Order Status Chart */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
              mb: 4,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Trạng thái đơn hàng theo {viewLevel=== "day"?"ngày":viewLevel==="week"?"tuần":viewLevel==="month"?"tháng":"năm"}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box>
              <BarChart
                {...chartStyling}
                xAxis={[{ data: chartMonths, scaleType: "band" }]}
                series={[
                  {
                    data: deliveredValues,
                    label: "Đã giao hàng",
                    color: "#4caf50",
                  },
                  {
                    data: pendingValues,
                    label: "Đang giao hàng",
                    color: "#ff9800",
                  },
                  {
                    data: cancelledValues,
                    label: "Đã hủy",
                    color: "#f44336",
                  },
                  {
                    data: returnedValues,
                    label: "Đã trả hàng",
                    color: "#9e9e9e",
                  },
                ]}
              />
            </Box>
          </Paper>

          {/* Order Status Distribution */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Phân bố trạng thái đơn hàng
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ height: 400 }}>
              <PieChart
                height={400}
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: revenueData?.quantityDelivered || 0,
                        label: "Đã giao hàng",
                        color: "#4caf50",
                      },
                      {
                        id: 1,
                        value: revenueData?.quantityPending || 0,
                        label: "Đang giao hàng",
                        color: "#ff9800",
                      },
                      {
                        id: 2,
                        value: revenueData?.quantityCancelled || 0,
                        label: "Đã hủy",
                        color: "#f44336",
                      },
                      {
                        id: 3,
                        value: revenueData?.quantityReturned || 0,
                        label: "Đã trả hàng",
                        color: "#9e9e9e",
                      },
                    ],
                    highlightScope: { highlight: "item", fade: "global" },
                    innerRadius: 30,
                    outerRadius: 100,

                    startAngle: 180,
                    endAngle: -180,
                  },
                ]}
              />
            </Box>
          </Paper>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default Statistics;
