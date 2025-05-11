import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get } from "../../../services/callApi";
import { toast } from "react-toastify";
// MUI imports
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Typography,
  Stack,
  Rating,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { statisticProductDetail } from "@/services/api";

interface StatisticProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  discount: number;
  category: string;
  totalSold: number;
  totalRating: number;
  avgRating: number;
  totalReview: number;
  quantitySold: number;
}

// Styled components with your theme colors
const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "var(--color-primary)",
  color: "rgba(0, 0, 0, 0.87)",
  "&:hover": {
    backgroundColor: "var(--color-secondary)",
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "var(--color-tertiary)",
  color: "rgba(0, 0, 0, 0.87)",
  "&:hover": {
    backgroundColor: "var(--color-quaternary)",
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  backgroundColor: "var(--color-quinary)",
}));

const DetailProductAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<StatisticProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      get(`${statisticProductDetail}/${id}`)
        .then((response) => {
          setProduct(response.data.data);
        })
        .catch(() => {
          setError("Lỗi khi tải thông tin sản phẩm. Vui lòng thử lại sau.");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const goBack = () => {
    navigate("/admin/products");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress sx={{ color: "var(--color-primary)" }} />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Paper sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1">{error || "Product not found"}</Typography>
        <PrimaryButton
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={goBack}
          sx={{ mt: 2 }}
        >
          Back to Products
        </PrimaryButton>
      </Paper>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, my: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" component="h1" fontWeight="bold">
            Product Details: {product.name}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={goBack}
          >
            Back
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          {/* Product Image */}
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 30%" } }}>
            <CardMedia
              component="img"
              image={product.imageUrl || "https://via.placeholder.com/300"}
              alt={product.name}
              sx={{
                width: "100%",
                borderRadius: 1,
                boxShadow: 2,
                height: "auto",
                maxHeight: 350,
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Product Details */}
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 70%" } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 2,
              }}
            >
              {/* Basic Info */}
              <Box sx={{ flex: 1 }}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Basic Information
                    </Typography>
                    <Box sx={{ display: "grid", gap: 1 }}>
                      <Typography variant="body1">
                        <strong>ID:</strong> {product.id}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Name:</strong> {product.name}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Price:</strong> {formatCurrency(product.price)}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Stock:</strong> {product.stock} units
                      </Typography>
                      <Typography variant="body1">
                        <strong>Category:</strong> {product.category}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Discount:</strong> {product.discount}%
                      </Typography>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Box>

              {/* Sales Stats */}
              <Box sx={{ flex: 1 }}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sales Statistics
                    </Typography>
                    <Box sx={{ display: "grid", gap: 1 }}>
                      <Typography variant="body1">
                        <strong>Total Sold:</strong>{" "}
                        {formatCurrency(product.totalSold || 0)}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Units Sold:</strong> {product.quantitySold || 0}{" "}
                        units
                      </Typography>
                    </Box>

                    <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                      Review Statistics
                    </Typography>
                    <Box sx={{ display: "grid", gap: 1 }}>
                      <Typography variant="body1">
                        <strong>Total Reviews:</strong>{" "}
                        {product.totalReview || 0}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body1" mr={1}>
                          <strong>Average Rating:</strong>{" "}
                          {product.avgRating?.toFixed(1) || "N/A"}
                        </Typography>
                        <Rating
                          value={product.avgRating || 0}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Box>
            </Box>

            {/* Description */}
            <StyledCard sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">
                  {product.description || "No description available."}
                </Typography>
              </CardContent>
            </StyledCard>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
              >
                Edit Product
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
              >
                Delete Product
              </Button>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default DetailProductAdmin;
