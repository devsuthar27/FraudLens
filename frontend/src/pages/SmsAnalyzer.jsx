import { useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import ResultCard from "../components/ResultCard";
import { addHistory } from "../utils/historyStorage";
import { apiFetch } from "../utils/api";
import { pageTheme } from "../styles/theme";

function SmsAnalyzer() {
  const [sms, setSms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    const input = sms.trim();

    if (!input) {
      setError("⚠ SMS Content is required to analyze");
      setResult(null);
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await apiFetch(
        "http://localhost:5000/api/analyze-sms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sms: input,
          }),
        }
      );

      if (!response) {
        return;
      }

      const rawResponse = await response.text();

      let data;

      try {
        data = JSON.parse(rawResponse);
      } catch {
        throw new Error(
          "Backend returned an invalid response. Please make sure the FraudLens backend is running on port 5000."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || "SMS analysis failed."
        );
      }

      if (!data.report) {
        throw new Error(
          "No analysis result received from backend."
        );
      }

      setResult(data.report);

      addHistory(
        "SMS",
        input,
        data.report
      );
    } catch (err) {
      console.error("SMS Analyzer Error:", err);

      setResult(null);

      setError(
        `⚠ ${
          err.message || "Unable to analyze SMS."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSms("");
    setResult(null);
    setError("");
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "calc(100vh - 72px)",
          background:
            "radial-gradient(circle at 50% 0%, #172554 0%, #0F172A 55%, #020617 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
          padding: "55px 40px 70px",
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
            {/* SECURITY CENTER */}

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
              }}
            >
              📱 SMS{" "}
              <span
                style={{
                  color: "#5da1f5",
                }}
              >
                Analyzer
              </span>
            </h1>

            <p
              style={{
                marginTop: "18px",
                color: "#94A3B8",
                fontSize: "17px",
              }}
            >
              Analyze suspicious SMS messages for
              scams, phishing and security threats.
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

            {/* INPUT HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "15px",
                marginBottom: "12px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <strong
                  style={{
                    fontSize: "17px",
                  }}
                >
                  📱 SMS Content
                </strong>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#64748B",
                    fontSize: "13px",
                  }}
                >
                  Paste the suspicious message for
                  security analysis.
                </p>
              </div>

              <span
                style={{
                  padding: "6px 11px",
                  borderRadius: "20px",
                  background: "#0F172A",
                  color: "#94A3B8",
                  fontSize: "12px",
                }}
              >
                {sms.length} characters
              </span>
            </div>

            {/* TEXTAREA */}

            <textarea
              value={sms}
              onChange={(e) => {
                setSms(e.target.value);

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
              placeholder="Paste suspicious SMS message here...

Example:
Congratulations! You have won a reward. Click the link to claim..."
              rows={9}
              disabled={loading}
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
                resize: "vertical",
                outline: "none",
                lineHeight: "1.7",
                fontFamily:
                  "Arial, sans-serif",
                opacity: loading ? 0.7 : 1,
              }}
            />

            {/* ERROR */}

            {error && (
              <div
                style={{
                  marginTop: "14px",
                  padding: "13px 15px",
                  background:
                    "rgba(127,29,29,0.45)",
                  border:
                    "1px solid rgba(239,68,68,0.35)",
                  borderRadius: "10px",
                  color: "#FCA5A5",
                  fontSize: "14px",
                  lineHeight: "1.5",
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
                marginTop: "20px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleAnalyze}
                disabled={loading}
                style={{
                  flex: "1",
                  minWidth: "180px",
                  padding: "13px 25px",
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
                  boxShadow: loading
                    ? "none"
                    : "0 8px 20px rgba(37,99,235,0.25)",
                }}
              >
                {loading
                  ? "🤖 Analyzing SMS..."
                  : "🔍 Analyze SMS"}
              </button>

              <button
                onClick={handleClear}
                disabled={loading}
                style={{
                  padding: "13px 25px",
                  background: "#334155",
                  color: "white",
                  border:
                    "1px solid #475569",
                  borderRadius: "9px",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                  fontSize: "15px",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                ✕ Clear
              </button>
            </div>

            {/* SHORTCUT */}

            <p
              style={{
                margin: "15px 0 0",
                color: "#64748B",
                fontSize: "12px",
                textAlign: "right",
              }}
            >
              Tip: Press Ctrl + Enter to analyze
            </p>
          </div>

          {/* ================= LOADER ================= */}

          {loading && (
            <div
              style={{
                maxWidth: "850px",
                margin: "30px auto 0",
                background:
                  "rgba(30,41,59,0.75)",
                padding: "20px",
                borderRadius: "14px",
                border:
                  "1px solid #334155",
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

          {/* ================= INFO ================= */}

          {!result &&
            !loading &&
            !error && (
              <div
                style={{
                  maxWidth: "850px",
                  margin: "30px auto 0",
                  padding: "18px 20px",
                  background:
                    "rgba(30,41,59,0.55)",
                  border:
                    "1px solid rgba(51,65,85,0.7)",
                  borderRadius: "12px",
                  textAlign: "center",
                  color: "#94A3B8",
                  fontSize: "13px",
                }}
              >
                🛡️ FraudLens will analyze the
                message and provide a threat score,
                reason and security recommendation.
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
            🛡️ FraudLens — SMS Security Analyzer
          </footer>
        </div>
      </div>
    </>
  );
}

export default SmsAnalyzer;