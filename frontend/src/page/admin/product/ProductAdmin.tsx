import { productAdmin, productStatistic } from "@/services/api";
import { del, get, patch } from "@/services/callApi";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  Divider,
  Stack,
  Modal,
  styled,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import { toast } from "react-toastify";
import UpdateProductModal from "./UpdateProduct";
import CreateProductModal from "./CreateProduct";
import { useNavigate } from "react-router-dom";
const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "black",
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "var(--color-secondary)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--color-primary)",
    },
  },
});
const StyledFormControl = styled(FormControl)({
  "& .MuiInputLabel-root.Mui-focused": {
    color: "black",
  },
});

const StyledSelect = styled(Select)({
  "&.MuiOutlinedInput-root": {
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--color-secondary)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--color-primary)",
    },
  },
});
interface Product {
  id: number;
  name: string;
  price: string;
  description: string | null;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  discount: number;
  stock: number;
  isDeleted: boolean;
}

interface ProductStatistic {
  total: number;
  active: number;
  inactive: number;
}

type SortDirection = "asc" | "desc";
type SortField =
  | "id"
  | "name"
  | "price"
  | "category"
  | "stock"
  | "isDeleted"
  | "createdAt";
type Status = "null" | "true" | "false";
type Category = "null" | "MOBILE" | "LAPTOP" | "TABLET";

function ProductAdmin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [productStats, setProductStats] = useState<ProductStatistic | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state - client-side
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting state
  const [orderBy, setOrderBy] = useState<SortField>("createdAt");
  const [orderDirection, setOrderDirection] = useState<SortDirection>("asc");

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDebounce] = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState<Status>("null");
  const [categoryFilter, setCategoryFilter] = useState<Category>("null");

  // Modal state for delete/restore product
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  // Modal state for update product
  const [openUpdate, setOpenUpdate] = useState(false);
  const [productUpdate, setProductUpdate] = useState<Product | null>(null);

  // Modal state for create product
  const [openCreate, setOpenCreate] = useState(false);

  // Reload state
  const [reload, setReload] = useState(false);

  // Handle sorting change
  const handleRequestSort = (property: SortField) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0); // Reset to first page when sorting changes
  };

  // Handle pagination change
  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteOrRestore = (productId: number, isDeleted: boolean) => {
    setProductId(productId);
    setOpen(true);
    setIsDeleted(isDeleted);
  };
  const handleDelete = (productId: number) => {
    toast
      .promise(del(`${productAdmin}/${productId}`), {
        pending: "Đang xóa sản phẩm...",
        success: "Xóa sản phẩm thành công!",
        error: "Xóa sản phẩm thất bại!",
      })
      .then(() => {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === productId ? { ...product, isDeleted: true } : product
          )
        );
        setProductStats((prev) => ({
          ...prev!,
          inactive: prev!.inactive + 1,
          active: prev!.active - 1,
        }));
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
        setProducts((prev) =>
          prev.map((product) =>
            product.id === productId
              ? { ...product, isDeleted: false }
              : product
          )
        );
        setProductStats((prev) => ({
          ...prev!,
          inactive: prev!.inactive - 1,
          active: prev!.active + 1,
        }));
      })
      .catch((res: ErrorResponse) => {
        setError(res.message);
      });
  };

  const fetchProducts = async () => {
    get(
      `${productAdmin}?page=${
        page + 1
      }&limit=${rowsPerPage}&orderBy=${orderBy}&order=${orderDirection.toUpperCase()}&search=${searchDebounce}&isDeleted=${statusFilter}&category=${categoryFilter}`
    )
      .then((response) => {
        setTotalProducts(response.data.data.total);
        setProducts(response.data.data.data);
      })
      .catch(() => {
        setError("Lỗi khi tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
      });
  };

  useEffect(() => {
    get(productStatistic)
      .then((statisticResponse) => {
        setProductStats(statisticResponse.data.data);
      })
      .catch(() => {
        setError("Lỗi khi tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchProducts();
    setLoading(false)
  }, [
    page,
    rowsPerPage,
    orderBy,
    orderDirection,
    searchDebounce,
    statusFilter,
    categoryFilter,
  ]);

  useEffect(() => {
    if (reload) {
      fetchProducts();
      setReload(false);
    }
  }, [reload]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && page > 0) {
        setPage((prev) => prev - 1);
      }
      if (
        event.key === "ArrowRight" &&
        page < Math.ceil(totalProducts / rowsPerPage) - 1
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [page, rowsPerPage, totalProducts]);

  if (loading) {
    return (
      <Box
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Quản Lý Sản Phẩm
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Quản Lý Sản Phẩm
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f8f9fa" }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 600, color: "#1a3353" }}
      >
        Quản Lý Sản Phẩm
      </Typography>

      {/* Dashboard Summary Cards */}
      <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Paper
          elevation={2}
          sx={{
            p: 2.5,
            bgcolor: "#e3f2fd",
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            flex: "1 1 230px",
            minWidth: "230px",
          }}
        >
          <Box
            sx={{
              mr: 2,
              p: 1.5,
              borderRadius: "50%",
              bgcolor: "#1976d2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <InventoryIcon sx={{ color: "white" }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Tổng sản phẩm
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {productStats?.total}
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: 2.5,
            bgcolor: "#e8f5e9",
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            flex: "1 1 230px",
            minWidth: "230px",
          }}
        >
          <Box
            sx={{
              mr: 2,
              p: 1.5,
              borderRadius: "50%",
              bgcolor: "#4caf50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <VisibilityIcon sx={{ color: "white" }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Đang hoạt động
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {productStats?.active}
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: 2.5,
            bgcolor: "#ffebee",
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            flex: "1 1 230px",
            minWidth: "230px",
          }}
        >
          <Box
            sx={{
              mr: 2,
              p: 1.5,
              borderRadius: "50%",
              bgcolor: "#f44336",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DeleteIcon sx={{ color: "white" }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Ngừng kinh doanh
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {productStats?.inactive}
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: 2.5,
            bgcolor: "#fff8e1",
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            flex: "1 1 230px",
            minWidth: "230px",
          }}
        >
          <Box
            sx={{
              mr: 2,
              p: 1.5,
              borderRadius: "50%",
              bgcolor: "#ff9800",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CategoryIcon sx={{ color: "white" }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Danh mục
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              3
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Card
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6">Danh sách sản phẩm</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              color: "black",
              fontWeight: "medium",
              borderRadius: 2,
              bgcolor: "var(--color-tertiary)",
            }}
            onClick={() => setOpenCreate(true)}
          >
            Thêm sản phẩm mới
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <StyledTextField
            label="Tìm kiếm sản phẩm"
            placeholder="Nhập tên sản phẩm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1, minWidth: "200px" }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <StyledFormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Trạng thái</InputLabel>
            <StyledSelect
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as Status);
                setPage(0);
              }}
              label="Trạng thái"
            >
              <MenuItem value="null">Tất cả</MenuItem>
              <MenuItem value="false">Đang hoạt động</MenuItem>
              <MenuItem value="true">Ngừng kinh doanh</MenuItem>
            </StyledSelect>
          </StyledFormControl>

          <StyledFormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Danh mục</InputLabel>
            <StyledSelect
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value as Category);
                setPage(0);
              }}
              label="Danh mục"
            >
              <MenuItem value="null">Tất cả danh mục</MenuItem>
              <MenuItem value="MOBILE">Điện thoại</MenuItem>
              <MenuItem value="LAPTOP">Máy tính xách tay</MenuItem>
              <MenuItem value="TABLET">Máy tính bảng</MenuItem>
            </StyledSelect>
          </StyledFormControl>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ boxShadow: "none", borderRadius: 2 }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow className="bg-(--color-tertiary)">
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "id"}
                    direction={orderBy === "id" ? orderDirection : "asc"}
                    onClick={() => handleRequestSort("id")}
                  >
                    Mã SP
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? orderDirection : "asc"}
                    onClick={() => handleRequestSort("name")}
                  >
                    Sản phẩm
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "category"}
                    direction={orderBy === "category" ? orderDirection : "asc"}
                    onClick={() => handleRequestSort("category")}
                  >
                    Danh mục
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "price"}
                    direction={orderBy === "price" ? orderDirection : "asc"}
                    onClick={() => handleRequestSort("price")}
                  >
                    Giá bán
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "stock"}
                    direction={orderBy === "stock" ? orderDirection : "asc"}
                    onClick={() => handleRequestSort("stock")}
                  >
                    Tồn kho
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "isDeleted"}
                    direction={orderBy === "isDeleted" ? orderDirection : "asc"}
                    onClick={() => handleRequestSort("isDeleted")}
                  >
                    Trạng thái
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    className="odd:bg-(--color-quinary) even:bg-white"
                    onClick={() => {
                      navigate(`/admin/products/${product.id}`);
                    }}
                  >
                    <TableCell>{product.id}</TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          component="img"
                          src={product.imageUrl}
                          alt={product.name}
                          sx={{
                            height: 50,
                            width: 50,
                            objectFit: "cover",
                          }}
                        />
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, mb: 0.5 }}
                          >
                            {product.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                            sx={{ maxWidth: 200, display: "block" }}
                          >
                            {product.description?.substring(0, 50) ?? "Không có mô tả"}...
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        {product.discount > 0 && (
                          <Typography
                            component="span"
                            sx={{ fontWeight: "bold", color: "error.main" }}
                          >
                            {Number(
                              Number(product.price) *
                                (1 - product.discount / 100)
                            ).toLocaleString("vi-VN", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            })}{" "}
                            ₫
                          </Typography>
                        )}
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {product.discount > 0 ? (
                            <>
                              <Typography
                                component="span"
                                sx={{
                                  textDecoration: "line-through",
                                  color: "text.secondary",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {Number(product.price).toLocaleString("vi-VN")}{" "}
                                ₫
                              </Typography>
                              <Chip
                                label={`-${product.discount}%`}
                                color="error"
                                size="small"
                                sx={{ ml: 1, height: 20 }}
                              />
                            </>
                          ) : (
                            <>
                              {Number(product.price).toLocaleString("vi-VN")} ₫
                            </>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        let stockColor: "error" | "success" | "warning" =
                          "error";
                        if (product.stock > 10) {
                          stockColor = "success";
                        } else if (product.stock > 0) {
                          stockColor = "warning";
                        }
                        return (
                          <Chip
                            label={product.stock}
                            color={stockColor}
                            size="small"
                            sx={{ minWidth: 60 }}
                          />
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          product.isDeleted
                            ? "Ngừng kinh doanh"
                            : "Đang hoạt động"
                        }
                        color={product.isDeleted ? "error" : "success"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Sửa sản phẩm">
                          <IconButton
                            size="small"
                            sx={{ color: "#ff9800" }}
                            onClick={() => {
                              setProductUpdate(product);
                              setOpenUpdate(true);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={
                            product.isDeleted
                              ? "Khôi phục sản phẩm"
                              : "Ngừng kinh doanh"
                          }
                        >
                          <IconButton
                            onClick={() => {
                              handleDeleteOrRestore(
                                product.id,
                                product.isDeleted
                              );
                            }}
                            size="small"
                            sx={{
                              color: product.isDeleted ? "#4caf50" : "#f44336",
                            }}
                          >
                            {product.isDeleted ? (
                              <RestoreIcon fontSize="small" />
                            ) : (
                              <DeleteIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      Không tìm thấy sản phẩm nào.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          labelRowsPerPage="Dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} trong ${count}`
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalProducts}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      {open &&
        productId !== null &&
        (isDeleted ? (
          <RestoreProductModal
            open={open}
            onClose={() => setOpen(false)}
            productId={productId}
            onRestore={(id) => handleRestore(id)}
          />
        ) : (
          <DeleteProductModal
            open={open}
            onClose={() => setOpen(false)}
            productId={productId}
            onDelete={(id) => handleDelete(id)}
          />
        ))}
      {openUpdate && productUpdate && (
        <UpdateProductModal
          open={openUpdate}
          onClose={setOpenUpdate}
          product={productUpdate}
          setReload={setReload}
        />
      )}
      {openCreate && (
        <CreateProductModal
          open={openCreate}
          onClose={setOpenCreate}
          setReload={setReload}
        />
      )}
    </Box>
  );
}

export default ProductAdmin;

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
          <h1
            className="text-2xl font-bold text-center"
            style={{ color: "var(--color-primary)" }}
          >
            Xóa sản phẩm
          </h1>
          <p className="mt-4 text-center">
            Bạn có chắc chắn muốn xóa sản phẩm này không?
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
