import { useLayoutEffect, useState } from "react";
import { useProfileAdmin } from "@/store/useProfileAdmin";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Button,
  Modal,
  TextField,
  IconButton,
  Paper,
  Container,
  Avatar,
  Stack,
  styled,
} from "@mui/material";
import {
  Person,
  Email,
  Logout,
  LockReset,
  Visibility,
  VisibilityOff,
  Badge as BadgeIcon,
  AccountCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { post } from "@/services/callApi";
import { toast } from "react-toastify";
import { changePasswordRoute } from "@/services/api";

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

function ProfileAdmin() {
  const { admin, clearAdmin } = useProfileAdmin();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useLayoutEffect(() => {
    // Check if admin data is available
    if (admin) {
      setLoading(false);
    }
  }, [admin]);

  const handleLogout = () => {
    clearAdmin();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/admin/login", { replace: true });
  };

  const handleChangePassword = async () => {
    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    toast
      .promise(
        post(changePasswordRoute, {
          oldPassword,
          newPassword,
        }),
        {
          pending: "Đang xử lý...",
          success: "Đổi mật khẩu thành công",
          error: {
            render({ data }: { data: any }) {
              return data?.response?.data?.message || "Đổi mật khẩu thất bại";
            },
          },
        }
      )
      .then(() => {
        handleCloseModal();
      });
  };

  const handleCloseModal = () => {
    setOpenChangePassword(false);
    // Reset form
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          mb: 4,
          boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Box
          sx={{
            bgcolor: "var(--color-primary)",
            py: 6,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: "#fff",
              boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
              mb: 2,
            }}
          >
            <AccountCircle
              sx={{ fontSize: 80, color: "var(--color-primary)" }}
            />
          </Avatar>

          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            {admin?.role || "Quản trị viên"}
          </Typography>

          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.3)",
              px: 2,
              py: 0.5,
              borderRadius: 5,
              fontSize: "0.875rem",
            }}
          >
            ID: {admin?.id}
          </Box>

          <BadgeIcon
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              fontSize: 30,
              color: "rgba(0,0,0,0.2)",
            }}
          />
        </Box>

        <Box sx={{ p: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "var(--color-quinary)",
              display: "flex",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Email sx={{ color: "var(--color-primary)", mr: 2, mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600 }}>
                Email
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {admin?.email}
              </Typography>
            </Box>
          </Paper>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mt: 3 }}
          >
            <Button
              variant="contained"
              startIcon={<LockReset />}
              onClick={() => setOpenChangePassword(true)}
              fullWidth
              sx={{
                py: 1.5,
                textTransform: "none",
                borderRadius: 2,
                bgcolor: "var(--color-secondary)",
                color: "#000",
                fontWeight: 500,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                "&:hover": {
                  bgcolor: "var(--color-secondary)",
                  opacity: 0.9,
                },
              }}
            >
              Đổi mật khẩu
            </Button>

            <Button
              variant="outlined"
              startIcon={<Logout />}
              onClick={handleLogout}
              fullWidth
              sx={{
                py: 1.5,
                textTransform: "none",
                borderRadius: 2,
                borderColor: "var(--color-error)",
                color: "var(--color-error)",
                fontWeight: 500,
                "&:hover": {
                  borderColor: "var(--color-error)",
                  bgcolor: "rgba(255,72,66,0.04)",
                },
              }}
            >
              Đăng xuất
            </Button>
          </Stack>
        </Box>
      </Paper>{" "}
      {/* Change Password Modal */}
      <Modal
        open={openChangePassword}
        onClose={handleCloseModal}
        aria-labelledby="change-password-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            width: "100%",
            maxWidth: 480,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              bgcolor: "var(--color-primary)",
              p: 2.5,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Đổi mật khẩu
            </Typography>
          </Box>

          <Box sx={{ p: 3, "& .MuiTextField-root": { mb: 2.5 } }}>
            <StyledTextField
              label="Mật khẩu cũ"
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    edge="end"
                    size="small"
                    aria-label={
                      showOldPassword ? "hide password" : "show password"
                    }
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <StyledTextField
              label="Mật khẩu mới"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                    size="small"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <StyledTextField
              label="Xác nhận mật khẩu mới"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
              p: 2.5,
              bgcolor: "rgba(0,0,0,0.02)",
              borderTop: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Button
              onClick={handleCloseModal}
              sx={{
                color: "text.secondary",
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Hủy
            </Button>

            <Button
              onClick={handleChangePassword}
              variant="contained"
              sx={{
                bgcolor: "var(--color-primary)",
                color: "black",
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                "&:hover": {
                  bgcolor: "var(--color-primary)",
                  opacity: 0.9,
                },
              }}
            >
              Xác nhận
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}

export default ProfileAdmin;
