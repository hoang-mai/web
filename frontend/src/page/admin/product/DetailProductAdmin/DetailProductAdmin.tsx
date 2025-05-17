import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get, del, patch } from "../../../../services/callApi";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Divider,
  Paper,
  Typography,
  Rating,
  Chip,
  Skeleton,
  Tabs,
  Tab,
  Modal,
  alpha,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import RestoreIcon from "@mui/icons-material/Restore";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import CommentIcon from "@mui/icons-material/Comment";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { statisticProductDetail, productAdmin } from "@/services/api";
import Chart from "./Chart";
import UpdateProductModal from "../UpdateProduct";
import { PieChart } from "@mui/x-charts/PieChart";

// Types and interfaces
interface StatisticProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  discount: number;
  category: string;
  isDeleted: boolean;
  totalSold: number;
  totalRating: number;
  avgRating: number;
  totalReview: number;
  quantitySold: number;
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

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
  },
  overflow: "hidden",
}));

const StatusChip = styled(Chip)<{ status: "active" | "deleted" }>(
  ({ status, theme }) => ({
    fontWeight: 600,
    borderRadius: "8px",
    backgroundColor:
      status === "active"
        ? alpha(theme.palette.success.main, 0.1)
        : alpha(theme.palette.error.main, 0.1),
    color: status === "active" ? "var(--color-success)" : "var(--color-error)",
    "& .MuiChip-icon": {
      color:
        status === "active" ? "var(--color-success)" : "var(--color-error)",
    },
    boxShadow: `0 2px 8px ${
      status === "active"
        ? alpha(theme.palette.success.main, 0.2)
        : alpha(theme.palette.error.main, 0.2)
    }`,
  })
);

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  padding: "10px 20px",
  fontWeight: 600,
  boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
  textTransform: "none",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    boxShadow: "0 5px 12px rgba(0,0,0,0.15)",
  },
}));

const InfoSection = styled(Box)(({ theme }) => ({
  marginBottom: "16px",
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
}));

const StatCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  flex: "1 1 240px",
  minWidth: "240px",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  },
}));

// Functional Components
function TabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `product-tab-${index}`,
    "aria-controls": `product-tabpanel-${index}`,
  };
}

// Main Component
const DetailProductAdmin = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<StatisticProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Modal state for update product
  const [openUpdate, setOpenUpdate] = useState(false);

  const [reload, setReload] = useState(false);

  // Modal state
  // Modal state for delete/restore product
  const [open, setOpen] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    get(`${statisticProductDetail}/${id}`)
      .then((response) => {
        setProduct(response.data.data);
        setError(null);
      })
      .catch(() => {
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (reload) {
      get(`${statisticProductDetail}/${id}`)
        .then((response) => {
          setProduct(response.data.data);
          setError(null);
        })
        .catch(() => {
          setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
        })
        .finally(() => {
          setReload(false);
        });
    }
  }, [reload, id]);

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleDelete = (productId: number) => {
    toast
      .promise(del(`${productAdmin}/${productId}`), {
        pending: "Đang xóa sản phẩm...",
        success: "Xóa sản phẩm thành công!",
        error: "Xóa sản phẩm thất bại!",
      })
      .then(() => {
        setReload(true);
      })
      .catch((res: ErrorResponse) => {
        setError(res.message);
      });
  };
  const handleRestore = (productId: number) => {
    toast
      .promise(patch(`${productAdmin}/${productId}/restore`, {}), {
        pending: "Đang khôi phục sản phẩm...",
        success: "Khôi phục sản phẩm thành công!",
        error: "Khôi phục sản phẩm thất bại!",
      })
      .then(() => {
        setReload(true);
      })
      .catch((res: ErrorResponse) => {
        setError(res.message);
      });
  };

  // Category mapping helper
  const getCategoryName = (categoryCode: string) => {
    const categories = {
      MOBILE: "Điện thoại",
      LAPTOP: "Máy tính xách tay",
      TABLET: "Máy tính bảng",
    };

    return categories[categoryCode as keyof typeof categories] || categoryCode;
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box my={4}>
          <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            <Skeleton variant="text" width="40%" height={40} />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Skeleton variant="rounded" width={100} height={40} />
              <Skeleton variant="rounded" width={100} height={40} />
            </Box>
          </Box>

          <Skeleton
            variant="rounded"
            height={400}
            sx={{ borderRadius: 2, mb: 4 }}
          />

          <Box sx={{ mb: 2 }}>
            <Skeleton variant="text" width="30%" height={40} />
            <Skeleton variant="text" width="100%" height={120} />
          </Box>
        </Box>
      </Container>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <Container maxWidth="md">
        <Paper
          sx={{
            p: 5,
            my: 4,
            borderRadius: 3,
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h4"
            color="error.main"
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 3 }}
          >
            Không tìm thấy sản phẩm
          </Typography>

          <Typography variant="body1" mb={4} color="text.secondary">
            {error ??
              "Không thể tải thông tin sản phẩm hoặc sản phẩm không tồn tại."}
          </Typography>

          <ActionButton
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/products")}
            sx={{
              bgcolor: "primary.main",
              color: "common.white",
            }}
            size="large"
          >
            Quay lại danh sách sản phẩm
          </ActionButton>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pb: 6, pt: 2 }}>
      {/* Breadcrumbs and Header */}
      <Box mb={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={3}
          mb={2}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              sx={{
                color: "text.primary",
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
              {product.name}
            </Typography>
            <StatusChip
              status={product.isDeleted ? "deleted" : "active"}
              label={product.isDeleted ? "Ngừng kinh doanh" : "Đang hoạt động"}
              icon={
                product.isDeleted ? (
                  <DeleteIcon fontSize="small" />
                ) : (
                  <InventoryIcon fontSize="small" />
                )
              }
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <ActionButton
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/admin/products")}
              sx={{
                borderColor: alpha(theme.palette.primary.main, 0.5),
                color: "text.primary",
              }}
            >
              Quay lại
            </ActionButton>
            <ActionButton
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setOpenUpdate(true)}
              sx={{
                color: "white",
                bgcolor: "#ff9800",
              }}
            >
              Chỉnh sửa
            </ActionButton>
            {product.isDeleted ? (
              <ActionButton
                variant="contained"
                startIcon={<RestoreIcon />}
                onClick={() => setOpen(true)}
                sx={{
                  bgcolor: theme.palette.success.main,
                  color: "white",
                  "&:hover": {
                    bgcolor: theme.palette.success.dark,
                  },
                }}
              >
                Khôi phục
              </ActionButton>
            ) : (
              <ActionButton
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={() => setOpen(true)}
                sx={{
                  bgcolor: theme.palette.error.main,
                  color: "white",
                  "&:hover": {
                    bgcolor: theme.palette.error.dark,
                  },
                }}
              >
                Ngừng kinh doanh
              </ActionButton>
            )}
          </Box>
        </Box>
      </Box>

      {/* Product Card */}
      <StyledCard sx={{ mb: 5 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {/* Product Image */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "0 0 350px" },
              maxWidth: "100%",
              bgcolor: alpha(theme.palette.background.default, 0.5),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
            }}
          >
            <CardMedia
              component="img"
              image={product.imageUrl || "https://via.placeholder.com/500"}
              alt={product.name}
              sx={{
                maxHeight: 350,
                width: "auto",
                maxWidth: "100%",
                objectFit: "contain",
                borderRadius: 2,
              }}
            />
          </Box>

          {/* Product Info */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 calc(100% - 350px)" },
              p: 4,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      Giá bán
                    </Typography>
                    <Box
                      sx={{ display: "flex", alignItems: "baseline", gap: 1 }}
                    >
                      {product.discount > 0 ? (
                        <>
                          <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ letterSpacing: "-0.5px" }}
                          >
                            {formatCurrency(
                              product.price * (1 - product.discount / 100)
                            )}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              textDecoration: "line-through",
                              opacity: 0.7,
                            }}
                            color="text.secondary"
                          >
                            {formatCurrency(product.price)}
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          variant="h4"
                          fontWeight="bold"
                          sx={{ letterSpacing: "-0.5px" }}
                        >
                          {formatCurrency(product.price)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                {product.discount > 0 && (
                  <Chip
                    icon={<LocalOfferIcon />}
                    label={`Giảm ${product.discount}%`}
                    color="error"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.95rem",
                      height: 36,
                      px: 1,
                      borderRadius: "8px",
                    }}
                  />
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, mb: 3 }}>
              <InfoSection>
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                    color: "primary.main",
                  }}
                >
                  <CategoryIcon color="primary" />
                </Box>
                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ letterSpacing: "1px" }}
                  >
                    Danh mục
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="500"
                    fontSize="1.1rem"
                  >
                    {getCategoryName(product.category)}
                  </Typography>
                </Box>
              </InfoSection>

              <InfoSection>
                <Box
                  sx={{
                    backgroundColor: alpha(
                      product.stock > 10
                        ? theme.palette.success.main
                        : product.stock > 0
                        ? theme.palette.warning.main
                        : theme.palette.error.main,
                      0.1
                    ),
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px ${alpha(
                      product.stock > 10
                        ? theme.palette.success.main
                        : product.stock > 0
                        ? theme.palette.warning.main
                        : theme.palette.error.main,
                      0.2
                    )}`,
                  }}
                >
                  <InventoryIcon
                    color={
                      product.stock > 10
                        ? "success"
                        : product.stock > 0
                        ? "warning"
                        : "error"
                    }
                  />
                </Box>
                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ letterSpacing: "1px" }}
                  >
                    Tồn kho
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="500"
                    fontSize="1.1rem"
                    color={
                      product.stock > 10
                        ? "success.main"
                        : product.stock > 0
                        ? "warning.main"
                        : "error.main"
                    }
                  >
                    {product.stock} sản phẩm
                  </Typography>
                </Box>
              </InfoSection>

              <InfoSection>
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px ${alpha(
                      theme.palette.info.main,
                      0.2
                    )}`,
                    color: "info.main",
                  }}
                >
                  <CommentIcon color="info" />
                </Box>
                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ letterSpacing: "1px" }}
                  >
                    Đánh giá
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body1"
                      fontWeight="500"
                      fontSize="1.1rem"
                    >
                      {Number(product.avgRating).toFixed(1)}
                    </Typography>
                    <Rating
                      value={product.avgRating || 0}
                      precision={0.5}
                      readOnly
                      size="small"
                      emptyIcon={
                        <StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />
                      }
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({product.totalRating || 0})
                    </Typography>
                  </Box>
                </Box>
              </InfoSection>
            </Box>
          </Box>
        </Box>
      </StyledCard>

      {/* Tabs Section */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="product information tabs"
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
            <Tab label="Mô tả sản phẩm" {...a11yProps(0)} />
            <Tab label="Doanh thu & Bán hàng" {...a11yProps(1)} />
            <Tab label="Đơn hàng" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography
            variant="h6"
            fontWeight="medium"
            gutterBottom
            color="text.primary"
          >
            Mô tả chi tiết
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {product.description ? (
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-line",
                lineHeight: 1.7,
                color: alpha(theme.palette.text.primary, 0.87),
              }}
            >
              {product.description}
            </Typography>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography
                variant="body1"
                color="text.secondary"
                fontStyle="italic"
              >
                Không có mô tả cho sản phẩm này.
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box>
            <Typography
              variant="h6"
              fontWeight="medium"
              gutterBottom
              color="text.primary"
            >
              Thống kê doanh thu
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 5 }}>
              <StatCard>
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px ${alpha(
                      theme.palette.success.main,
                      0.2
                    )}`,
                  }}
                >
                  <ShoppingCartIcon color="success" />
                </Box>
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    fontWeight={500}
                  >
                    Tổng doanh thu
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="success.main"
                    sx={{ mt: 0.5 }}
                  >
                    {formatCurrency(product.totalSold || 0)}
                  </Typography>
                </Box>
              </StatCard>

              <StatCard>
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px ${alpha(
                      theme.palette.info.main,
                      0.2
                    )}`,
                  }}
                >
                  <LocalShippingIcon color="info" />
                </Box>
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    fontWeight={500}
                  >
                    Đã bán
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ mt: 0.5 }}>
                    {product.quantitySold || 0} sản phẩm
                  </Typography>
                </Box>
              </StatCard>
            </Box>

            {/* Revenue Chart */}
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h6"
                fontWeight="medium"
                gutterBottom
                color="text.primary"
              >
                Biểu đồ doanh thu
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  borderRadius: 3,
                  p: 3,
                }}
              >
                <Chart />
              </Box>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography
            variant="h6"
            fontWeight="medium"
            gutterBottom
            color="text.primary"
          >
            Thống kê đơn hàng
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 4,
            }}
          >
            <PieChart
              series={[
                {
                  data: [
                    {
                      id: 0,
                      value: product.quantityDelivered || 0,
                      label: "Đã giao hàng",
                      color: "#6EE7B7", // green
                    },
                    {
                      id: 1,
                      value: product.quantityPending || 0,
                      label: "Đang giao hàng",
                      color: "#93C5FD", // blue
                    },
                    {
                      id: 2,
                      value: product.quantityCancelled || 0,
                      label: "Đã hủy",
                      color: "#FCA5A5", // red
                    },
                    {
                      id: 3,
                      value: product.quantityReturned || 0,
                      label: "Đã trả hàng",
                      color: "#FBBF24", // yellow
                    },
                  ],
                  highlightScope: {
                    highlight :"item",
                    fade :'global',
                  },
                  arcLabel: (item) => `${item.value}`,
                  arcLabelMinAngle: 20,
                },
              ]}
              width={500}
              height={400}
              margin={{ top: 0, bottom: 80, left: 20, right: 20 }}
            />

            <Typography
              variant="body1"
              sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}
            >
              {Number(product.quantityDelivered) +
                Number(product.quantityPending) +
                Number(product.quantityCancelled) +
                Number(product.quantityReturned) >
              0
                ? `Tổng số: ${
                    Number(product.quantityDelivered) +
                    Number(product.quantityPending) +
                    Number(product.quantityCancelled) +
                    Number(product.quantityReturned)
                  } sản phẩm`
                : "Chưa có dữ liệu đơn hàng cho sản phẩm này"}
            </Typography>
          </Box>
        </TabPanel>
      </Box>

      {openUpdate && product && (
        <UpdateProductModal
          open={openUpdate}
          onClose={setOpenUpdate}
          product={product}
          setReload={setReload}
        />
      )}

      {open &&
        (product.isDeleted ? (
          <RestoreProductModal
            open={open}
            onClose={() => setOpen(false)}
            productId={Number(id)}
            onRestore={(id) => handleRestore(id)}
          />
        ) : (
          <DeleteProductModal
            open={open}
            onClose={() => setOpen(false)}
            productId={Number(id)}
            onDelete={(id) => handleDelete(id)}
          />
        ))}
    </Container>
  );
};

const DeleteProductModal = ({
  open,
  onClose,
  productId,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  productId: number;
  onDelete: (id: number) => void;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          outline: "none",
          width: { xs: "90%", sm: "400px" },
        }}
      >
        <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-center text-red-500">
            Xóa sản phẩm
          </h1>
          <div className="mt-6 text-center"></div>
          <div className="flex justify-center "></div>
          <p className="text-center">
            Sản phẩm sẽ không hiển thị trong danh sách sản phẩm của người dùng.
          </p>
          <div className="flex gap-4 mt-6 justify-center">
            <Button
              variant="contained"
              sx={{ bgcolor: "var(--color-error)" }}
              onClick={() => {
                onDelete(productId);
                onClose();
              }}
            >
              Xóa
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "var(--color-success)", color: "white" }}
              onClick={onClose}
            >
              Hủy
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

const RestoreProductModal = ({
  open,
  onClose,
  productId,
  onRestore,
}: {
  open: boolean;
  onClose: () => void;
  productId: number;
  onRestore: (id: number) => void;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          outline: "none",
          width: { xs: "90%", sm: "400px" },
        }}
      >
        <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-lg">
          <h1
            className="text-2xl font-bold text-center"
            style={{ color: "var(--color-primary)" }}
          >
            Khôi phục sản phẩm
          </h1>
          <p className="mt-4 text-center">
            Bạn có chắc chắn muốn khôi phục sản phẩm này không?
          </p>
          <div className="flex gap-4 mt-6 justify-center">
            <Button
              variant="contained"
              sx={{ bgcolor: "var(--color-success)", color: "white" }}
              onClick={() => {
                onRestore(productId);
                onClose();
              }}
            >
              Khôi phục
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "var(--color-error)" }}
              onClick={onClose}
            >
              Hủy
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};
export default DetailProductAdmin;
