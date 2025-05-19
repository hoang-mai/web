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
import { post } from "@/services/callApi";
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

interface CreateProductModalProps {
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

type Category = "MOBILE" | "LAPTOP" | "TABLET";

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  open,
  onClose,
  setReload,
}) => {
  const defaultProductData = {
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    category: "MOBILE",
    discount: 0,
    stock: 0,
  };

  const [formData, setFormData] = useState(defaultProductData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>("");

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setLoading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Posts_imgs");
      data.append("cloud_name", "dhituyxjn");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dhituyxjn/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const uploadedImageUrl = await res.json();
      setFormData({
        ...formData,
        imageUrl: uploadedImageUrl.url,
      });
      setLoading(false);
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

    if (formData.stock && formData.stock < 0)
      newErrors.stock = "Số lượng không được âm";

    if (formData.discount < 0) newErrors.discount = "Giảm giá không được âm";
    else if (formData.discount > 100)
      newErrors.discount = "Giảm giá không được lớn hơn 100";

    if (!imagePreview)
      newErrors.imageUrl = "Hình ảnh sản phẩm là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    toast
      .promise(
        post(productAdmin, {
          name: formData.name,
          price: Number(formData.price),
          description: formData.description,
          category: formData.category,
          discount: Number(formData.discount),
          stock: Number(formData.stock),
          imageUrl: formData.imageUrl,
        }),
        {
          pending: "Đang tạo sản phẩm mới...",
          success: "Tạo sản phẩm mới thành công!",
          error: "Tạo sản phẩm thất bại!",
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
      aria-labelledby="create-product-modal-title"
      className="flex items-center justify-center"
    >
      <Box className="bg-white rounded-lg shadow-lg overflow-hidden w-3xl">
        <Box className="relative flex items-center justify-center p-4 bg-[var(--color-primary)]">
          <Typography
            id="create-product-modal-title"
            variant="h6"
            component="h2"
          >
            Tạo Sản Phẩm Mới
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
              {imagePreview ? (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Product preview"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "200px",
                    height: "200px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px dashed grey",
                    borderRadius: "4px",
                  }}
                >
                  <Typography color="text.secondary">
                    Chưa có ảnh sản phẩm
                  </Typography>
                </Box>
              )}
            </div>
            <Button
              variant="outlined"
              color="primary"
              component="label"
              sx={{ height: "small", textTransform: "none" }}
              className="!text-black !border-(--color-primary) hover:!bg-(--color-quaternary)"
            >
              {imagePreview ? "Đổi ảnh" : "Tải ảnh lên"}{" "}
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
            {loading ? "Đang tạo..." : "Tạo Sản Phẩm"}
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

export default CreateProductModal;
