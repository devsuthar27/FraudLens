
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import UrlScanner from "../pages/UrlScanner";
import EmailAnalyzer from "../pages/EmailAnalyzer";
import SmsAnalyzer from "../pages/SmsAnalyzer";
import History from "../pages/History";
import FraudAwareness from "../pages/FraudAwareness";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* PROTECTED */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/url-scanner"
          element={
            <ProtectedRoute>
              <UrlScanner />
            </ProtectedRoute>
          }
        />

        <Route
          path="/email-analyzer"
          element={
            <ProtectedRoute>
              <EmailAnalyzer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sms-analyzer"
          element={
            <ProtectedRoute>
              <SmsAnalyzer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fraud-awareness"
          element={
            <ProtectedRoute>
              <FraudAwareness />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
