import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import { apiFetch } from "../utils/api";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH HISTORY =================

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch(
          "http://localhost:5000/api/history",
          {
            method: "GET",
          }
        );

        if (!response) {
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to fetch history."
          );
        }

        setHistory(data.history || []);
      } catch (err) {
        console.error("History Fetch Error:", err);

        setError(
          err.message || "Unable to load scan history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // ================= HELPERS =================

  const getTypeIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "URL":
        return "🌐";

      case "EMAIL":
        return "📧";

      case "SMS":
        return "📱";

      default:
        return "🔍";
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "#94A3B8";

    const value = status.toLowerCase();

    if (
      value.includes("high") ||
      value.includes("malicious")
    ) {
      return "#F87171";
    }

    if (
      value.includes("medium") ||
      value.includes("suspicious")
    ) {
      return "#FBBF24";
    }

    if (
      value.includes("low") ||
      value.includes("safe") ||
      value.includes("no threat")
    ) {
      return "#4ADE80";
    }

    return "#94A3B8";
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <PageLayout>
        <div
          style={{
            minHeight: "calc(100vh - 72px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#CBD5E1",
            fontSize: "18px",
          }}
        >
          ⏳ Loading scan history...
        </div>
      </PageLayout>
    );
  }

  // ================= PAGE =================

  return (
    <PageLayout>
      <div
  style={{
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "50px 30px 30px",
    boxSizing: "border-box",
  }}
>

        {/* ================= HEADER ================= */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "45px",
          }}
        >
          {/* Security Center Badge */}

          <div
            style={{
              display: "inline-block",
              alignItems: "center",
              gap: "1px",
              padding: "7px 15px",
              border: "1px solid #1D4ED8",
              borderRadius: "20px",
              color: "#60A5FA",
              fontSize: "13px",
              fontWeight: "bold",
              marginBottom: "18px",
              background: "rgba(37, 99, 235, 0.08)",
            }}
          >
            🛡️ SECURITY SCANNER
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "46px",
              fontWeight: "800",
              letterSpacing: "1px",
            }}
          >
            📜 Scan{" "}
            <span style={{ color: "#5da1f5" }}>
              History
            </span>
          </h1>

          <p
            style={{
              
              color: "#94A3B8",
              fontSize: "17px",
            }}
          >
            Review your previous FraudLens security analyses.
          </p>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto 25px",
              padding: "15px 18px",
              background: "rgba(127, 29, 29, 0.35)",
              border: "1px solid #7F1D1D",
              borderRadius: "10px",
              color: "#FCA5A5",
              textAlign: "center",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!error && history.length === 0 && (
          <div
            style={{
              background: "rgba(30, 41, 59, 0.75)",
              border: "1px solid #334155",
              borderRadius: "18px",
              padding: "70px 30px",
              textAlign: "center",
              boxShadow:
                "0 15px 40px rgba(0,0,0,0.20)",
            }}
          >
            <div
              style={{
                fontSize: "60px",
                marginBottom: "15px",
              }}
            >
              📭
            </div>

            <h2
              style={{
                marginBottom: "10px",
              }}
            >
              No Scan History Yet
            </h2>

            <p
              style={{
                color: "#94A3B8",
                margin: 0,
              }}
            >
              Your URL, Email and SMS analyses
              will appear here after scanning.
            </p>
          </div>
        )}

        {/* ================= HISTORY ================= */}

        {!error && history.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {history.map((item, index) => {
              const statusColor = getStatusColor(
                item.status
              );

              return (
                <div
                  key={item._id || index}
                  style={{
                    background:
                      "rgba(30, 41, 59, 0.78)",
                    border:
                      "1px solid #334155",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow:
                      "0 12px 35px rgba(0,0,0,0.18)",
                    backdropFilter: "blur(8px)",
                  }}
                >

                  {/* TOP */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          background: "#0F172A",
                          border:
                            "1px solid #334155",
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "center",
                          fontSize: "23px",
                        }}
                      >
                        {getTypeIcon(item.type)}
                      </div>

                      <div>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "18px",
                          }}
                        >
                          {item.type || "Scan"}
                        </h3>

                        <p
                          style={{
                            margin:
                              "5px 0 0",
                            color: "#64748B",
                            fontSize: "13px",
                          }}
                        >
                          🕒{" "}
                          {item.createdAt
                            ? new Date(
                                item.createdAt
                              ).toLocaleString()
                            : "Unknown time"}
                        </p>
                      </div>
                    </div>

                    {/* STATUS */}

                    <div
                      style={{
                        padding:
                          "7px 14px",
                        borderRadius: "20px",
                        background:
                          `${statusColor}18`,
                        border:
                          `1px solid ${statusColor}55`,
                        color: statusColor,
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      {item.status ||
                        "Unknown"}
                    </div>
                  </div>

                  {/* INPUT */}

                  <div
                    style={{
                      marginTop: "20px",
                      padding: "16px",
                      background: "#0F172A",
                      borderRadius: "10px",
                      border:
                        "1px solid #1E293B",
                      wordBreak:
                        "break-word",
                    }}
                  >
                    <div
                      style={{
                        color: "#64748B",
                        fontSize: "11px",
                        fontWeight: "bold",
                        marginBottom: "7px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      ANALYZED INPUT
                    </div>

                    <div
                      style={{
                        color: "#CBD5E1",
                        fontSize: "14px",
                        lineHeight: "1.6",
                      }}
                    >
                      {item.input || "—"}
                    </div>
                  </div>

                  {/* SCORE */}

                  <div
                    style={{
                      marginTop: "17px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        color: "#94A3B8",
                      }}
                    >
                      Threat Score
                    </span>

                    <strong
                      style={{
                        color: statusColor,
                        fontSize: "17px",
                      }}
                    >
                      {item.score ?? "—"}
                    </strong>
                  </div>

                  {/* REASON */}

                  {item.reason && (
                    <div
                      style={{
                        marginTop: "15px",
                        color: "#CBD5E1",
                        lineHeight: "1.6",
                      }}
                    >
                      <strong>
                        Reason:
                      </strong>{" "}
                      {item.reason}
                    </div>
                  )}

                  {/* RECOMMENDATION */}

                  {item.recommendation && (
                    <div
                      style={{
                        marginTop: "15px",
                        padding: "13px 15px",
                        background:
                          "rgba(37, 99, 235, 0.12)",
                        border:
                          "1px solid rgba(37, 99, 235, 0.25)",
                        borderRadius: "9px",
                        color: "#BFDBFE",
                        lineHeight: "1.5",
                      }}
                    >
                      💡{" "}
                      <strong>
                        Recommendation:
                      </strong>{" "}
                      {item.recommendation}
                    </div>
                  )}

                  {/* DETAILS */}

                  {item.details && (
                    <div
                      style={{
                        marginTop: "16px",
                        paddingTop: "14px",
                        borderTop:
                          "1px solid #334155",
                        color: "#64748B",
                        fontSize: "13px",
                        display: "flex",
                        gap: "20px",
                        flexWrap: "wrap",
                      }}
                    >
                      {item.details
                        .indicatorCount !==
                        undefined && (
                        <span>
                          🔎 Indicators:{" "}
                          {
                            item.details
                              .indicatorCount
                          }
                        </span>
                      )}

                      {item.details
                        .totalEngines !==
                        undefined && (
                        <span>
                          🛡️ Engines:{" "}
                          {
                            item.details
                              .totalEngines
                          }
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ================= FOOTER ================= */}

        <div
          style={{
            textAlign: "center",
            padding: "45px 0 15px",
            color: "#475569",
            fontSize: "13px",
          }}
        >
          🛡️ FraudLens Security Center
        </div>
      </div>
    </PageLayout>
  );
}

export default History;