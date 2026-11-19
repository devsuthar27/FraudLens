import { useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import ResultCard from "../components/ResultCard";
import { addHistory } from "../utils/historyStorage";
import { apiFetch } from "../utils/api";
import { pageTheme } from "../styles/theme";

function EmailAnalyzer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    const input = email.trim();

    if (!input) {
      setError("Email Content is required to analyze.");
      setResult(null);
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await apiFetch(
        "http://localhost:5000/api/analyze-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: input,
          }),
        }
      );

      // apiFetch handles invalid/expired JWT
      if (!response) {
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Email analysis failed."
        );
      }

      if (!data.report) {
        throw new Error(
          "No analysis result received from backend."
        );
      }

      setResult(data.report);

      addHistory(
        "Email",
        input,
        data.report
      );
    } catch (err) {
      console.error(
        "Email Analyzer Error:",
        err
      );

      setError(
        err.message ||
          "Unable to analyze email."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setEmail("");
    setResult(null);
    setError("");
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "calc(100vh - 70px)",
          background:
            "radial-gradient(circle at top, #172554 0%, #0F172A 45%, #020617 100%)",
          color: "white",
          fontFamily: "Arial",
          padding: "50px 25px 80px",
        }}
      >
        {/* ================= HEADER ================= */}

        <div
          style={{
            maxWidth: "950px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "7px 15px",
              borderRadius: "20px",
              background: "#172554",
              border: "1px solid #1D4ED8",
              color: "#60A5FA",
              fontSize: "13px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            🛡️ SECURITY SCANNER
          </div>

          <h1
            style={{
              fontSize: "46px",
              margin: "0",
              fontWeight: "800",
            }}
          >
            📧 Email{" "}
            <span style={{ color: "#5da1f5" }}>
              Analyzer
            </span>
          </h1>

          <p
            style={{
              color: "#94A3B8",
              fontSize: "17px",
              margin: 0,
            }}
          >
            Analyze emails for phishing, scams and
            suspicious security indicators.
          </p>
        </div>

        {/* ================= INPUT CARD ================= */}

        <div
          style={{
            maxWidth: "850px",
            margin: "40px auto 0",
            background:
              "linear-gradient(145deg, #172033, #111827)",
            border: "1px solid #26364F",
            borderRadius: "20px",
            padding: "32px",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          {/* LABEL */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontSize: "15px",
                color: "#CBD5E1",
                fontWeight: "bold",
              }}
            >
              ✉️ Email Content
            </div>

            <span
              style={{
                color: "#64748B",
                fontSize: "13px",
              }}
            >
              {email.length} characters
            </span>
          </div>

          {/* TEXTAREA */}

          <textarea
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              if (error) {
                setError("");
              }
            }}
            onKeyDown={(e) => {
              if (
                (e.ctrlKey || e.metaKey) &&
                e.key === "Enter" &&
                !loading
              ) {
                handleAnalyze();
              }
            }}
            placeholder={
              "Paste the suspicious email content here...\n\nExample:\nDear Customer,\nYour account requires immediate verification..."
            }
            rows="12"
            style={{
              width: "100%",
              padding: "17px",
              background: "#020617",
              color: "white",
              border: "1px solid #334155",
              borderRadius: "11px",
              outline: "none",
              fontSize: "15px",
              boxSizing: "border-box",
              resize: "vertical",
              lineHeight: "1.6",
              fontFamily: "Arial",
            }}
          />

          {/* ERROR */}

          {error && (
            <div
              style={{
                marginTop: "15px",
                padding: "13px 15px",
                background: "#3F1219",
                border: "1px solid #7F1D1D",
                borderRadius: "9px",
                color: "#FCA5A5",
                fontSize: "14px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* BUTTONS */}

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "20px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                flex: "1",
                minWidth: "190px",
                padding: "14px 25px",
                background: loading
                  ? "#475569"
                  : "#2563EB",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                fontSize: "15px",
                fontWeight: "bold",
                boxShadow: loading
                  ? "none"
                  : "0 8px 25px rgba(37,99,235,0.25)",
              }}
            >
              {loading
                ? "🤖 Analyzing..."
                : "🔍 Analyze Email"}
            </button>

            <button
              onClick={handleClear}
              disabled={loading}
              style={{
                padding: "14px 25px",
                background: "#1E293B",
                color: "#CBD5E1",
                border: "1px solid #334155",
                borderRadius: "10px",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                fontSize: "15px",
              }}
            >
              ✕ Clear
            </button>
          </div>

          {/* INFO */}

          <div
            style={{
              marginTop: "22px",
              display: "flex",
              justifyContent: "space-between",
              gap: "15px",
              flexWrap: "wrap",
              color: "#64748B",
              fontSize: "13px",
            }}
          >
            <span>🔒 Private Analysis</span>
            <span>🧠 Threat Detection</span>
            <span>⚡ Fast Results</span>
          </div>

          <div
            style={{
              marginTop: "12px",
              color: "#475569",
              fontSize: "12px",
            }}
          >
            Tip: Press Ctrl + Enter to analyze.
          </div>
        </div>

        {/* ================= LOADER ================= */}

        {loading && (
          <div
            style={{
              maxWidth: "850px",
              margin: "30px auto 0",
            }}
          >
            <Loader />
          </div>
        )}

        {/* ================= RESULT ================= */}

        {result && !loading && (
          <div
            style={{
              maxWidth: "850px",
              margin: "35px auto 0",
            }}
          >
            <ResultCard
              score={result.score}
              status={result.status}
              reason={result.reason}
              recommendation={
                result.recommendation
              }
              details={result.details}
              onScanAgain={handleClear}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default EmailAnalyzer;