import { checkTokenRoute } from "@/services/api";
import { get } from "@/services/callApi";
import { Box, Modal } from "@mui/material";

import { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";
import LeftSideBar from "./LeftSideBar";
import { useSessionExpired } from "@/store/useSessionExpired";
import { useProfileAdmin } from "@/store/useProfileAdmin";

function LayoutAdmin() {
  const navigate = useNavigate();
  const { isSessionExpired, hideSessionExpiredModal } = useSessionExpired();
  const [collapsed, setCollapsed] = useState(false);
  const { clearAdmin } = useProfileAdmin.getState();
  useEffect(() => {
    get(checkTokenRoute)
      .then((res) => {
        if (res.data.data.role === "user") {
          navigate("/", { replace: true });
          return;
        }
        useProfileAdmin.getState().setAdmin(res.data.data);
      })
  }, []);

  if (!localStorage.getItem("access_token")) {
    return <Navigate to="/admin/login" replace={true} />;
  }

  return (
    <>
      <Modal
        open={isSessionExpired}
        onClose={hideSessionExpiredModal}
        className="flex items-center justify-center "
      >
        <Box className="flex items-center justify-center outline-none">
          <div className="flex flex-col items-center justify-center bg-white text-black p-8 rounded-xl">
            <h1 className="text-2xl font-bold">Phiên đăng nhập đã hết hạn</h1>
            <p className="mt-4">Vui lòng đăng nhập lại để tiếp tục.</p>
            <button
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                hideSessionExpiredModal();
                clearAdmin();
                navigate("/admin/login", { replace: true });
              }}
              className="mt-6 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-black rounded"
            >
              Đăng nhập lại
            </button>
          </div>
        </Box>
      </Modal>
      <div className="flex">
        <LeftSideBar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div
          className={`${
            collapsed ? "ml-20" : "ml-64"
          } w-full p-6 transition-all duration-300`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default LayoutAdmin;
