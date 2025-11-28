// App.tsx
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { CoursesPage } from "./pages/CoursesPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/courses" replace />} />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <CoursesPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
