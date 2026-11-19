import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { apiFetch } from "../utils/api";
import { pageTheme } from "../styles/theme";

function Dashboard() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // LOAD SCANS
  // ======================================================

  const loadScans = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch(
        "http://localhost:5000/api/scans",
        {
          method: "GET",
        }
      );

      if (!response) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load scan history."
        );
      }

      setScans(
        Array.isArray(data.scans)
          ? data.scans
          : []
      );
    } catch (err) {
      console.error("Dashboard Error:", err);

      setError(
        err.message ||
          "Unable to load dashboard data."
      );

      setScans([]);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD + REFRESH
  // ======================================================

  useEffect(() => {
    loadScans();

    const handleFocus = () => {
      loadScans();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, []);

  // ======================================================
  // STATUS HELPERS
  // ======================================================

  const getStatusText = (status) =>
    String(status || "").toLowerCase();

  const isHighRisk = (status) =>
    getStatusText(status).includes(
      "high risk"
    );

  const isMediumRisk = (status) => {
    const value = getStatusText(status);

    return (
      value.includes("medium risk") ||
      value.includes("suspicious")
    );
  };

  const isLowRisk = (status) => {
    const value = getStatusText(status);

    return (
      value.includes("low risk") ||
      value.includes("safe") ||
      value.includes("no threat detected")
    );
  };

  // ======================================================
  // COUNTS
  // ======================================================

  const totalScans = scans.length;

  const highRisk = scans.filter((item) =>
    isHighRisk(item.status)
  ).length;

  const mediumRisk = scans.filter((item) =>
    isMediumRisk(item.status)
  ).length;

  const lowRisk = scans.filter((item) =>
    isLowRisk(item.status)
  ).length;

  const otherScans =
    totalScans -
    highRisk -
    mediumRisk -
    lowRisk;

  // ======================================================
  // SCAN TYPES
  // ======================================================

  const urlScans = scans.filter(
    (item) =>
      String(item.type || "").toUpperCase() ===
      "URL"
  ).length;

  const emailScans = scans.filter(
    (item) =>
      String(item.type || "").toUpperCase() ===
      "EMAIL"
  ).length;

  const smsScans = scans.filter(
    (item) =>
      String(item.type || "").toUpperCase() ===
      "SMS"
  ).length;

  // ======================================================
  // PERCENTAGE
  // ======================================================

  const getPercentage = (value) => {
    if (totalScans === 0) return 0;

    return Math.round(
      (value / totalScans) * 100
    );
  };

  // ======================================================
  // STATUS COLOR
  // ======================================================

  const getStatusColor = (status) => {
    const value = getStatusText(status);

    if (value.includes("high risk")) {
      return "#EF4444";
    }

    if (
      value.includes("medium risk") ||
      value.includes("suspicious")
    ) {
      return "#F59E0B";
    }

    if (
      value.includes("low risk") ||
      value.includes("safe") ||
      value.includes("no threat detected")
    ) {
      return "#22C55E";
    }

    return "#60A5FA";
  };

  // ======================================================
  // ICON
  // ======================================================

  const getIcon = (type) => {
    const value = String(
      type || ""
    ).toUpperCase();

    if (value === "URL") return "🌐";
    if (value === "EMAIL") return "📧";
    if (value === "SMS") return "📱";

    return "🔍";
  };

  // ======================================================
  // DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    try {
      return new Date(
        date
      ).toLocaleString();
    } catch {
      return "Unknown date";
    }
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <>
      <Navbar />

      <div
        style={{
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
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          style={{
            maxWidth: "1250px",
            margin: "0 auto 38px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 12px",
                borderRadius: "20px",
                background:
                  "rgba(37,99,235,0.12)",
                border:
                  "1px solid rgba(96,165,250,0.2)",
                color: "#93C5FD",
                fontSize: "12px",
                fontWeight: "700",
                marginBottom: "15px",
              }}
            >
              🛡️ SECURITY CENTER
            </div>

           <h1
             style={{
              margin: "0",
              fontSize: "clamp(32px, 4vw, 46px)",
               fontWeight: "800",
               letterSpacing: "-1.5px",
             }}
            >
              Fraud
              <span
                style={{
                  color: "#60A5FA",
                }}
              >
                Lens
              </span>{" "}
              Dashboard
            </h1>

            <p
              style={{
                color: "#94A3B8",
                marginTop: "10px",
                fontSize: "15px",
                padding: "7px 12px",
                fontSize: "12px",
                marginBottom: "15px",
              }}
            >
              Monitor your fraud detection activity
              and security analysis.
            </p>
          </div>

          <button
            onClick={loadScans}
            disabled={loading}
            style={{
              padding: "11px 17px",
              borderRadius: "10px",
              border:
                "1px solid #334155",
              background: "#0F172A",
              color: "#CBD5E1",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontWeight: "600",
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && !loading && (
          <div
            style={{
              maxWidth: "1250px",
              margin: "0 auto 25px",
              padding: "14px 16px",
              background:
                "rgba(127,29,29,0.45)",
              border:
                "1px solid #991B1B",
              borderRadius: "12px",
              color: "#FCA5A5",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* ==================================================
            LOADING
        ================================================== */}

        {loading ? (
          <div
            style={{
              maxWidth: "1250px",
              margin: "80px auto",
              textAlign: "center",
              color: "#94A3B8",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                marginBottom: "15px",
              }}
            >
              🛡️
            </div>

            <div>
              Loading security dashboard...
            </div>
          </div>
        ) : (
          <div
            style={{
              maxWidth: "1250px",
              margin: "0 auto",
            }}
          >
            {/* ==================================================
                STAT CARDS
            ================================================== */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "18px",
              }}
            >
              <StatCard
                icon="🔍"
                value={totalScans}
                label="Total Scans"
                description="All security analyses"
              />

              <StatCard
                icon="🔴"
                value={highRisk}
                label="High Risk"
                description="Potential threats"
                valueColor="#EF4444"
              />

              <StatCard
                icon="🟠"
                value={mediumRisk}
                label="Medium Risk"
                description="Suspicious activity"
                valueColor="#F59E0B"
              />

              <StatCard
                icon="🟢"
                value={lowRisk}
                label="Low Risk"
                description="Safe or low threat"
                valueColor="#22C55E"
              />
            </div>

            {/* ==================================================
                THREAT + DISTRIBUTION
            ================================================== */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              {/* THREAT OVERVIEW */}

              <DashboardCard
                title="🛡️ Threat Overview"
                subtitle="Risk distribution across your scans"
              >
                <ProgressBar
                  label="🔴 High Risk"
                  value={highRisk}
                  percentage={getPercentage(
                    highRisk
                  )}
                  color="#EF4444"
                />

                <ProgressBar
                  label="🟠 Medium Risk"
                  value={mediumRisk}
                  percentage={getPercentage(
                    mediumRisk
                  )}
                  color="#F59E0B"
                />

                <ProgressBar
                  label="🟢 Low Risk"
                  value={lowRisk}
                  percentage={getPercentage(
                    lowRisk
                  )}
                  color="#22C55E"
                />

                {otherScans > 0 && (
                  <ProgressBar
                    label="🔵 Other"
                    value={otherScans}
                    percentage={getPercentage(
                      otherScans
                    )}
                    color="#60A5FA"
                  />
                )}
              </DashboardCard>

              {/* SCAN DISTRIBUTION */}

              <DashboardCard
                title="📊 Scan Distribution"
                subtitle="Types of content analyzed"
              >
                <ProgressBar
                  label="🌐 URL Scans"
                  value={urlScans}
                  percentage={getPercentage(
                    urlScans
                  )}
                  color="#3B82F6"
                />

                <ProgressBar
                  label="📧 Email Scans"
                  value={emailScans}
                  percentage={getPercentage(
                    emailScans
                  )}
                  color="#8B5CF6"
                />

                <ProgressBar
                  label="📱 SMS Scans"
                  value={smsScans}
                  percentage={getPercentage(
                    smsScans
                  )}
                  color="#06B6D4"
                />
              </DashboardCard>
            </div>

            {/* ==================================================
                RECENT ACTIVITY
            ================================================== */}

            <DashboardCard
              title="📋 Recent Activity"
              subtitle="Your latest security analyses"
              marginTop="20px"
            >
              {scans.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 10px",
                    color: "#64748B",
                  }}
                >
                  <div
                    style={{
                      fontSize: "35px",
                      marginBottom: "10px",
                    }}
                  >
                    🔍
                  </div>

                  <div
                    style={{
                      color: "#CBD5E1",
                      fontWeight: "600",
                    }}
                  >
                    No scans performed yet
                  </div>

                  <p
                    style={{
                      fontSize: "13px",
                      marginTop: "7px",
                    }}
                  >
                    Start analyzing URLs, emails or
                    SMS messages.
                  </p>
                </div>
              ) : (
                scans
                  .slice(0, 5)
                  .map((item, index) => (
                    <div
                      key={
                        item._id ||
                        `${item.createdAt}-${index}`
                      }
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        gap: "15px",
                        padding: "17px 0",
                        borderBottom:
                          index !==
                          Math.min(
                            scans.length,
                            5
                          ) -
                            1
                            ? "1px solid #1E293B"
                            : "none",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "13px",
                        }}
                      >
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background:
                              "#0F172A",
                            border:
                              "1px solid #334155",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            fontSize: "20px",
                          }}
                        >
                          {getIcon(item.type)}
                        </div>

                        <div>
                          <strong
                            style={{
                              fontSize: "14px",
                            }}
                          >
                            {item.type} Scan
                          </strong>

                          <p
                            style={{
                              margin:
                                "5px 0 0",
                              color: "#64748B",
                              fontSize: "12px",
                            }}
                          >
                            {formatDate(
                              item.createdAt
                            )}
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "17px",
                            fontWeight: "800",
                            color:
                              getStatusColor(
                                item.status
                              ),
                          }}
                        >
                          {item.score}
                        </div>

                        <span
                          style={{
                            padding:
                              "7px 11px",
                            borderRadius:
                              "20px",
                            background:
                              `${getStatusColor(
                                item.status
                              )}18`,
                            border:
                              `1px solid ${getStatusColor(
                                item.status
                              )}35`,
                            color:
                              getStatusColor(
                                item.status
                              ),
                            fontWeight:
                              "700",
                            fontSize: "12px",
                          }}
                        >
                          {item.status ||
                            "Unknown"}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </DashboardCard>

            {/* ==================================================
                SYSTEM STATUS
            ================================================== */}

            <DashboardCard
              title="⚡ System Status"
              subtitle="FraudLens service health"
              marginTop="20px"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "12px",
                }}
              >
                <StatusItem
                  label="URL Scanner"
                />

                <StatusItem
                  label="Email Analyzer"
                />

                <StatusItem
                  label="SMS Analyzer"
                />

                <StatusItem
                  label="MongoDB"
                />

                <StatusItem
                  label="Database Records"
                  value={totalScans}
                  showOnline={false}
                />
              </div>
            </DashboardCard>
          </div>
        )}
      </div>
    </>
  );
}

// ======================================================
// DASHBOARD CARD
// ======================================================

function DashboardCard({
  title,
  subtitle,
  children,
  marginTop = "0",
}) {
  return (
    <div
      style={{
        marginTop,
        background:
          "rgba(15,23,42,0.72)",
        padding: "26px",
        borderRadius: "18px",
        border:
          "1px solid rgba(51,65,85,0.8)",
        boxShadow:
          "0 15px 40px rgba(0,0,0,0.18)",
      }}
    >
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "19px",
            fontWeight: "750",
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={{
              margin:
                "6px 0 0",
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  icon,
  value,
  label,
  description,
  valueColor = "white",
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(145deg, rgba(30,41,59,0.92), rgba(15,23,42,0.9))",
        padding: "23px",
        borderRadius: "17px",
        border:
          "1px solid rgba(51,65,85,0.85)",
        boxShadow:
          "0 12px 35px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "43px",
            height: "43px",
            borderRadius: "12px",
            background: "#0F172A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            border:
              "1px solid #334155",
          }}
        >
          {icon}
        </div>

        <span
          style={{
            color: "#475569",
            fontSize: "11px",
            fontWeight: "600",
          }}
        >
          LIVE DATA
        </span>
      </div>

      <h2
        style={{
          fontSize: "34px",
          margin:
            "18px 0 4px",
          color: valueColor,
          fontWeight: "800",
        }}
      >
        {value}
      </h2>

      <div
        style={{
          fontWeight: "700",
          fontSize: "14px",
        }}
      >
        {label}
      </div>

      <p
        style={{
          margin:
            "5px 0 0",
          color: "#64748B",
          fontSize: "12px",
        }}
      >
        {description}
      </p>
    </div>
  );
}

// ======================================================
// PROGRESS BAR
// ======================================================

function ProgressBar({
  label,
  value,
  percentage,
  color,
}) {
  return (
    <div
      style={{
        marginTop: "17px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: "#CBD5E1",
          }}
        >
          {label}
        </span>

        <strong
          style={{
            fontSize: "12px",
            color: "#94A3B8",
          }}
        >
          {value} ({percentage}%)
        </strong>
      </div>

      <div
        style={{
          height: "8px",
          background: "#020617",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: color,
            borderRadius: "20px",
            transition:
              "width 0.5s ease",
            boxShadow:
              `0 0 10px ${color}55`,
          }}
        />
      </div>
    </div>
  );
}

// ======================================================
// SYSTEM STATUS
// ======================================================

function StatusItem({
  label,
  value,
  showOnline = true,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
        padding: "13px 15px",
        background: "#0F172A",
        border:
          "1px solid #1E293B",
        borderRadius: "10px",
      }}
    >
      <span
        style={{
          color: "#CBD5E1",
          fontSize: "13px",
        }}
      >
        {label}
      </span>

      {showOnline ? (
        <span
          style={{
            color: "#4ADE80",
            fontSize: "12px",
            fontWeight: "700",
          }}
        >
          ● Online
        </span>
      ) : (
        <span
          style={{
            color: "#60A5FA",
            fontWeight: "700",
            fontSize: "13px",
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

export default Dashboard;