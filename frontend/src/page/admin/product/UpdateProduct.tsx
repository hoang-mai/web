import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  styled,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { productAdmin } from "@/services/api";
import { put } from "@/services/callApi";
import { toast } from "react-toastify";

// Styled components using the global color scheme
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

const StyledFormControl = styled(FormControl)({
  "& .MuiInputLabel-root.Mui-focused": {
    color: "black",
  },
});

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  discount: number;
  stock: number;
  isDeleted: boolean;
}
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
interface UpdateProductModalProps {
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  product: Product | StatisticProduct;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

type Category = "MOBILE" | "LAPTOP" | "TABLET";

const UpdateProductModal: React.FC<UpdateProductModalProps> = ({
  open,
  onClose,
  product,
  setReload,
}) => {
  const [formData, setFormData] = useState<Product | StatisticProduct>(product);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product.imageUrl);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });
      // Clear error when field is edited
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: "",
        });
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));

      if (errors.imageUrl) {
        setErrors({
          ...errors,
          imageUrl: "",
        });
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Tên sản phẩm là bắt buộc";

    if (!formData.price) newErrors.price = "Giá là bắt buộc";
    else if (isNaN(Number(formData.price))) newErrors.price = "Giá phải là số";
    else if (Number(formData.price) < 0) newErrors.price = "Giá không được âm";

    if (!formData.stock) newErrors.stock = "Số lượng là bắt buộc";
    else if (formData.stock < 0) newErrors.stock = "Số lượng không được âm";

    if (formData.discount < 0) newErrors.discount = "Giảm giá không được âm";
    else if (formData.discount > 100)
      newErrors.discount = "Giảm giá không được lớn hơn 100%";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !product) return;
    setLoading(true);
    toast
      .promise(
        put(`${productAdmin}/${product.id}`, {
          name: formData.name,
          price: Number(formData.price),
          description: formData.description,
          category: formData.category,
          discount: Number(formData.discount),
          stock: Number(formData.stock),
          imageUrl: formData.imageUrl,
        }),
        {
          pending: "Đang cập nhật sản phẩm...",
          success: "Cập nhật sản phẩm thành công!",
          error: "Cập nhật sản phẩm thất bại!",
        }
      )
      .then(() => {
        setReload(true);
        onClose(false);
      })
      .catch((error: ErrorResponse) => {
        if (error.errors.length > 0) {
          const errorMessages = error.errors.join(", ");
          setErrors({ ...errors, submit: errorMessages });
        } else setErrors({ ...errors, submit: error.message });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="update-product-modal-title"
      className="flex items-center justify-center"
    >
      <Box className="bg-white rounded-lg shadow-lg overflow-hidden w-3xl">
        <Box className="relative flex items-center justify-center p-4 bg-[var(--color-primary)]">
          <Typography
            id="update-product-modal-title"
            variant="h6"
            component="h2"
          >
            Cập Nhật Sản Phẩm
          </Typography>
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "inherit",
            }}
            onClick={() => onClose(false)}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ px: 3, pb: 3 }} className="overflow-y-auto max-h-[80vh]">
          {/* Image upload section */}
          <Box className="flex flex-row items-center justify-between p-4">
            <div className="flex flex-1 items-center justify-center">
              <Box
                component="img"
                src={imagePreview}
                alt={product.name}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                }}
              />
            </div>
            <Button
              variant="outlined"
              color="primary"
              component="label"
              sx={{ height: "small", textTransform: "none" }}
              className="!text-black !border-(--color-primary) hover:!bg-(--color-quaternary)"
            >
              Đổi ảnh{" "}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {errors.imageUrl && (
              <FormHelperText error>{errors.imageUrl}</FormHelperText>
            )}
          </Box>
          <Box sx={{ mb: 2 }}>
            <StyledTextField
              fullWidth
              label="Tên Sản Phẩm"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name}
            />
          </Box>

          {/* Price and discount side by side */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: "1 1 50%" }}>
              <StyledTextField
                fullWidth
                label="Giá"
                name="price"
                value={formData.price || ""}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.price}
                helperText={errors.price}
                slotProps={{
                  input: {
                    endAdornment: (
                      <Typography color="text.secondary">VNĐ</Typography>
                    ),
                  },
                }}
              />
            </Box>
            <Box sx={{ flex: "1 1 50%" }}>
              <StyledTextField
                fullWidth
                label="Giảm Giá (%)"
                name="discount"
                type="number"
                value={formData.discount ?? 0}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.discount}
                helperText={errors.discount}
                slotProps={{
                  input: {
                    endAdornment: (
                      <Typography color="text.secondary">%</Typography>
                    ),
                  },
                }}
              />
            </Box>
          </Box>

          {/* Category and Stock side by side */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: "1 1 50%" }}>
              <StyledTextField
                fullWidth
                label="Số Lượng"
                name="stock"
                type="number"
                value={formData.stock ?? ""}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.stock}
                helperText={errors.stock}
              />
            </Box>
            <Box sx={{ flex: "1 1 50%" }}>
              <StyledFormControl fullWidth error={!!errors.category}>
                <InputLabel id="category-label">Danh Mục</InputLabel>
                <StyledSelect
                  labelId="category-label"
                  name="category"
                  value={formData.category || ""}
                  label="Danh Mục"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      category: e.target.value as Category,
                    });
                  }}
                >
                  <MenuItem value="MOBILE">Điện Thoại</MenuItem>
                  <MenuItem value="LAPTOP">Máy Tính Xách Tay</MenuItem>
                  <MenuItem value="TABLET">Máy Tính Bảng</MenuItem>
                </StyledSelect>
                {errors.category && (
                  <FormHelperText>{errors.category}</FormHelperText>
                )}
              </StyledFormControl>
            </Box>
          </Box>

          {/* Description */}
          <Box sx={{ mb: 2 }}>
            <StyledTextField
              fullWidth
              label="Mô Tả"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              variant="outlined"
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Box>

          {/* Error message */}
          {errors.submit && (
            <Box sx={{ mb: 2 }}>
              <Typography color="error" variant="body2">
                {errors.submit}
              </Typography>
            </Box>
          )}
        </Box>
        {/* Action buttons */}
        <Box className="flex justify-center items-center gap-2 p-2 bg-gray-100">
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            className="!bg-(--color-primary) !text-black"
          >
            {loading ? "Đang cập nhật..." : "Cập Nhật Sản Phẩm"}
          </Button>
          <Button
            onClick={() => onClose(false)}
            variant="outlined"
            color="inherit"
          >
            Hủy
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateProductModal;
