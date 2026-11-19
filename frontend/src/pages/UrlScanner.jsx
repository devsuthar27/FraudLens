import { useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import ResultCard from "../components/ResultCard";
import { addHistory } from "../utils/historyStorage";
import { apiFetch } from "../utils/api";
import { pageTheme } from "../styles/theme";

function UrlScanner() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    const input = url.trim();

    if (!input) {
      setError("⚠ Please enter a URL.");
      setResult(null);
      return;
    }

    let normalizedUrl;

   try {
  const value = /^https?:\/\//i.test(input)
    ? input
    : `https://${input}`;

  const parsedUrl = new URL(value);

  if (
    parsedUrl.protocol !== "http:" &&
    parsedUrl.protocol !== "https:"
  ) {
    throw new Error("Invalid protocol");
  }

  // Require a real domain name
  if (
    !parsedUrl.hostname.includes(".") ||
    parsedUrl.hostname.length < 4
  ) {
    throw new Error("Invalid domain");
  }

  normalizedUrl = parsedUrl.href;
} catch {
      setError("⚠ Please enter a valid website URL.");
      setResult(null);
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await apiFetch(
        "http://localhost:5000/api/analyze-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: normalizedUrl,
          }),
        }
      );

      if (!response) {
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "URL analysis failed."
        );
      }

      if (!data.report) {
        throw new Error(
          "No analysis result received from backend."
        );
      }

      setResult(data.report);

      addHistory(
        "URL",
        normalizedUrl,
        data.report
      );
    } catch (err) {
      console.error("URL Scanner Error:", err);

      setError(
        `⚠ ${
          err.message ||
          "Unable to analyze URL."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUrl("");
    setResult(null);
    setError("");
  };

  return (
    <>
      <Navbar />

       <div
        style={{
          ...pageTheme,
          minHeight: "100vh",
          background:
          "radial-gradient(circle at 50% -20%, #172554 0%, #0F172A 38%, #020617 100%)",
          color: "white",
          padding: "45px 5%",
          fontFamily:
            "Inter, Arial, Helvetica, sans-serif",
          boxSizing: "border-box",
        }}
      >

        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >

          {/* ================= HERO ================= */}

          <div
            style={{
              textAlign: "center",
              marginBottom: "45px",
            }}
          >
            {/* SECURITY CENTER BADGE */}

            <div
              style={{
                display: "inline-block",
                alignItems: "center",
                padding: "7px 15px",
                border: "1px solid #1d4ed8",
                borderRadius: "30px",
                color: "#60A5FA",
                fontSize: "13px",
                fontWeight: "bold",
                letterSpacing: "0.5px",
               
                marginBottom: "20px",
              }}
            >
              🛡️ SECURITY SCANNER
            </div>

            {/* TITLE */}

            <h1
              style={{
                margin: "0",
                fontSize: "46px",
                fontWeight: "800",
                padding: "7px 12px",
                //fontSize: "12px",
                marginBottom: "15px",
              }}
            >
              🌐 URL{" "}
              <span
                style={{
                  color: "#5da1f5",
                }}
              >
                Scanner
              </span>
            </h1>

            <p
              style={{
                marginTop: "18px",
                color: "#94A3B8",
                fontSize: "17px",
                padding: "7px 15px",
                //fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              Analyze websites for phishing,
              malware and suspicious security
              indicators.
            </p>
          </div>

          {/* ================= INPUT CARD ================= */}

          <div
            style={{
              maxWidth: "850px",
              margin: "0 auto",
              background:
                "rgba(30,41,59,0.82)",
              padding: "30px",
              borderRadius: "16px",
              border: "1px solid #334155",
              boxShadow:
                "0 15px 45px rgba(0,0,0,0.25)",
              backdropFilter: "blur(10px)",
            }}
          >

            {/* LABEL */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <strong
                style={{
                  fontSize: "17px",
                }}
              >
                🌐 Website URL
              </strong>

              <span
                style={{
                  color: "#64748B",
                  fontSize: "13px",
                }}
              >
                {url.length} characters
              </span>
            </div>

            {/* URL INPUT */}

            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);

                if (error) {
                  setError("");
                }
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !loading
                ) {
                  handleAnalyze();
                }
              }}
              placeholder="Paste the suspicious website URL here..."
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "10px",
                border:
                  "1px solid #475569",
                background: "#020617",
                color: "white",
                fontSize: "15px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />

            {/* EXAMPLE */}

            <div
              style={{
                marginTop: "12px",
                color: "#64748B",
                fontSize: "13px",
              }}
            >
              Example:{" "}
              <span
                style={{
                  color: "#94A3B8",
                }}
              >
                https://example.com
              </span>
            </div>

            {/* ERROR */}

            {error && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "12px",
                  background: "#7F1D1D",
                  borderRadius: "8px",
                  color: "#FCA5A5",
                  fontWeight: "bold",
                }}
              >
                {error}
              </div>
            )}

            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "22px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleAnalyze}
                disabled={loading}
                style={{
                  padding: "13px 28px",
                  background: loading
                    ? "#475569"
                    : "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: "9px",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
              >
                {loading
                  ? "🤖 Analyzing..."
                  : "🔍 Analyze URL"}
              </button>

              <button
                onClick={handleClear}
                disabled={loading}
                style={{
                  padding: "13px 25px",
                  background: "#334155",
                  color: "white",
                  border: "none",
                  borderRadius: "9px",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                  fontSize: "15px",
                }}
              >
                ✕ Clear
              </button>
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
              />
            </div>
          )}

          {/* ================= FOOTER ================= */}

          <footer
            style={{
              textAlign: "center",
              padding: "50px 0 10px",
              color: "#475569",
              fontSize: "13px",
            }}
          >
            🛡️ FraudLens — URL Security Scanner
          </footer>
        </div>
      </div>
    </>
  );
}

export default UrlScanner;