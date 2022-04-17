import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Main from "./pages/Main/Main";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import NotFound from "./pages/NotFound/NotFound";
import { getItem } from "./utils/localStorage";

function ProtectedRoutes({ redirectTo }) {
  const isAuthenticated = getItem("token");

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
}

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />

      <Route element={<ProtectedRoutes redirectTo="/" />}>
        <Route path="/main" element={<Main />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default MainRoutes;
