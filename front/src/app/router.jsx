import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import Profile from "../pages/Profile";
import Sessions from "../pages/Sessions";
import Settings from "../pages/Settings";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";

import Layout from "@/layout";
import { PageWrapper } from "./page-wrapper";

export function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* AUTH */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <PageWrapper>
                <Login />
              </PageWrapper>
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <PageWrapper>
                <Register />
              </PageWrapper>
            </PublicRoute>
          }
        />

        {/* PROTECTED CABINET */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={
              <PageWrapper>
                <Dashboard />
              </PageWrapper>
            }
          />

          <Route
            path="/profile"
            element={
              <PageWrapper>
                <Profile />
              </PageWrapper>
            }
          />

          <Route
            path="/settings"
            element={
              <PageWrapper>
                <Settings />
              </PageWrapper>
            }
          />

          <Route
            path="/sessions"
            element={
              <PageWrapper>
                <Sessions />
              </PageWrapper>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <PageWrapper>
                  <Admin />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
