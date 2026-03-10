import { Routes, Route, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { getToken, logout } from "./api/client";
import Login from "./components/Login";
import Register from "./components/Register";
import LandingPage from "./components/LandingPage";
import FridgeUpload from "./components/FridgeUpload";
import RecipeList from "./components/RecipeList";
import RecipeDetail from "./components/RecipeDetail";
import ProcessingScreen from "./components/ProcessingScreen";
import { Camera, BookOpen } from "lucide-react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = !!getToken();

  function handleLogout() {
    logout();
    navigate("/");
  }

  if (!loggedIn) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 border-b border-[#E5E5EA] bg-[#F5F5F7]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link
          to="/recipes"
          className="text-xl font-bold tracking-tight text-[#1C1C1E]"
        >
          WhatToCook
        </Link>
        <div className="flex items-center gap-1">
          <Link
            to="/upload"
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
              isActive("/upload")
                ? "bg-white text-[#1C1C1E] shadow-sm"
                : "text-[#8E8E93] hover:text-[#1C1C1E]"
            }`}
          >
            <Camera className="h-4 w-4" />
            Upload
          </Link>
          <Link
            to="/recipes"
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
              isActive("/recipes")
                ? "bg-white text-[#1C1C1E] shadow-sm"
                : "text-[#8E8E93] hover:text-[#1C1C1E]"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Recipes
          </Link>
          <div className="mx-2 h-5 w-px bg-[#D1D1D6]" />
          <button
            onClick={handleLogout}
            className="rounded-full px-4 py-2 text-sm font-medium text-[#8E8E93] transition-all duration-300 hover:bg-white hover:text-[#1C1C1E] hover:shadow-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}

/**
 * `/` renders the landing page for guests, or redirects to /recipes if logged in.
 */
function HomePage() {
  if (getToken()) {
    return <Navigate to="/recipes" replace />;
  }
  return <LandingPage />;
}

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <RecipeList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <FridgeUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/processing/:uploadId"
          element={
            <ProtectedRoute>
              <ProcessingScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/:id"
          element={
            <ProtectedRoute>
              <RecipeDetail />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
