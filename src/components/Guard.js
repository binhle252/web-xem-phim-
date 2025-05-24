import { Navigate, useLocation } from "react-router-dom";

export default function Guard({ children }) {
  const location = useLocation();
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return children; // Chưa đăng nhập ⇒ cho qua

  const { role_id } = JSON.parse(storedUser);
  const isAdminRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/manage");
  const isContentRoute = location.pathname.startsWith("/content");

  // Admin (role 1) mà đang vào route user hoặc content ⇒ đẩy sang /manageuser
  if (Number(role_id) === 1 && (!isAdminRoute)) {
    return <Navigate to="/manageuser" replace />;
  }

  // Ban Nội dung (role 2) mà đang vào route không phải /content ⇒ đẩy sang /content/movies/all
  if (Number(role_id) === 2 && (!isContentRoute)) {
    return <Navigate to="/content/movies/all" replace />;
  }

  // User thường (role khác 1 và 2) mà đang vào route admin hoặc content ⇒ đẩy về /
  if (Number(role_id) !== 1 && Number(role_id) !== 2 && (isAdminRoute || isContentRoute)) {
    return <Navigate to="/" replace />;
  }

  return children; // Hợp lệ ⇒ render như bình thường
}