import React, { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import { get, post } from "@/services/callApi";
import { checkTokenRoute, loginRoute } from "@/services/api";

interface LoginCredentials {
  email: string;
  password: string;
}

const LoginAdmin: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      if (!/\S+@\S+\.\S+/.test(value) && value.length > 0) {
        setErrorEmail("Email không hợp lệ");
      } else {
        setErrorEmail("");
      }
    }
    if (name === "password") {
      if (value.length < 6 && value.length > 0) {
        setErrorPassword("Mật khẩu phải có ít nhất 6 ký tự");
      } else {
        setErrorPassword("");
      }
    }

    setError("");
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!credentials.email || !credentials.password) {
      setError("Vui lòng nhập cả email và mật khẩu");
      return;
    }
    setIsLoading(true);

    // Gọi API đăng nhập
    toast
      .promise(
        post(loginRoute, {
          email: credentials.email,
          password: credentials.password,
        }),
        {
          pending: "Đang đăng nhập...",
          success: "Đăng nhập thành công!",
          error: "Đăng nhập thất bại!",
        }
      )
      .then((res) => {
        localStorage.setItem("access_token", res.data.data.access_token);
        navigate("/admin");
      })
      .catch((err: ErrorResponse) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      get(checkTokenRoute).then((res) => {
        if (res.data.data.role === "user") {
          navigate("/", { replace: true });
        } else if (res.data.data.role === "admin") {
          navigate("/admin", { replace: true });
        }
      }).catch(() => {
        localStorage.removeItem("access_token");
      });
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--color-tertiary)]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Đăng Nhập
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block mb-2 font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Nhập email"
              autoComplete="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-transparent border-[var(--color-primary)]"
            />
            <div className="h-4 text-sm text-red-700">{errorEmail}</div>
          </div>

          <div className="mb-2">
            <label
              htmlFor="password"
              className="block mb-2 font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-transparent border-[var(--color-primary)]"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <VisibilityOff className="h-5 w-5" />
                ) : (
                  <Visibility className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="h-4 text-sm text-red-700">
            {error || errorPassword}
          </div>

          <button
            type="submit"
            className={`mt-4 px-4 py-2 text-gray-800 font-medium rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] ${
              isLoading
                ? "bg-[var(--color-secondary)] opacity-70 cursor-not-allowed"
                : "bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]"
            }`}
            disabled={isLoading}
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
