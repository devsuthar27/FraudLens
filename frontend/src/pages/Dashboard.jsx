
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { apiFetch } from "../utils/api";

function Dashboard() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadScans = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch(
        "http://localhost:5000/api/scans",
        { method: "GET" }
      );

      if (!response) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load scan history."
        );
      }

      setScans(
        Array.isArray(data.scans) ? data.scans : []
      );
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError(
        err.message || "Unable to load dashboard data."
      );
      setScans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScans();

    const handleFocus = () => loadScans();

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // RISK CLASSIFICATION
  const getStatusText = (status) =>
    String(status || "").toLowerCase();

  const isHighRisk = (status) =>
    getStatusText(status).includes("high risk");

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

  // DASHBOARD COUNTS
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
    totalScans - highRisk - mediumRisk - lowRisk;

  const urlScans = scans.filter(
    (item) => String(item.type || "").toUpperCase() === "URL"
  ).length;

  const emailScans = scans.filter(
    (item) => String(item.type || "").toUpperCase() === "EMAIL"
  ).length;

  const smsScans = scans.filter(
    (item) => String(item.type || "").toUpperCase() === "SMS"
  ).length;

  const getPercentage = (value) =>
    totalScans === 0
      ? 0
      : Math.round((value / totalScans) * 100);

  const getStatusColor = (status) => {
    const value = getStatusText(status);

    if (value.includes("high risk")) return "#EF4444";

    if (
      value.includes("medium risk") ||
      value.includes("suspicious")
    ) return "#F59E0B";

    if (
      value.includes("low risk") ||
      value.includes("safe") ||
      value.includes("no threat detected")
    ) return "#22C55E";

    return "#A3A3A3";
  };

  const getTypeIcon = (type) => {
    switch (String(type || "").toUpperCase()) {
      case "URL": return "◎";
      case "EMAIL": return "✉";
      case "SMS": return "▤";
      default: return "⌕";
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
      ? "Unknown date"
      : parsed.toLocaleString();
  };

  const quickActions = [
    {
      title: "URL Scanner",
      description: "Inspect suspicious website links.",
      icon: "◎",
      path: "/url-scanner",
    },
    {
      title: "Email Analyzer",
      description: "Check suspicious email content.",
      icon: "✉",
      path: "/email-analyzer",
    },
    {
      title: "SMS Analyzer",
      description: "Inspect suspicious text messages.",
      icon: "▤",
      path: "/sms-analyzer",
    },
  ];

  return (
    <PageLayout>
      <div className="dashboard-page">

        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <div className="dashboard-eyebrow">
              <span>◈</span> SECURITY OVERVIEW
            </div>

            <h1>
              Welcome to <span>FraudLens.</span>
            </h1>

            <p>
              Monitor your analysis activity and review
              potential digital threats.
            </p>
          </div>

          <button
            className="dashboard-refresh"
            onClick={loadScans}
            disabled={loading}
          >
            ↻ {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </header>

        {/* ERROR */}
        {error && !loading && (
          <div className="dashboard-error">
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div className="dashboard-loading">
            <div className="dashboard-spinner" />
            Loading your security dashboard...
          </div>
        ) : (
          <>
            {/* OVERVIEW CARDS */}
            <section className="dashboard-stats">
              <StatCard
                icon="⌕"
                label="Total Scans"
                value={totalScans}
                description="All recorded analyses"
                color="#F59E0B"
              />

              <StatCard
                icon="!"
                label="High Risk"
                value={highRisk}
                description="Potentially dangerous"
                color="#EF4444"
              />

              <StatCard
                icon="◈"
                label="Medium Risk"
                value={mediumRisk}
                description="Suspicious activity"
                color="#F59E0B"
              />

              <StatCard
                icon="✓"
                label="Low Risk"
                value={lowRisk}
                description="Low-risk results"
                color="#22C55E"
              />
            </section>

            {/* ANALYTICS */}
            <section className="dashboard-analytics">

              <div className="dashboard-panel">
                <div className="dashboard-panel-heading">
                  <div>
                    <span className="dashboard-panel-kicker">
                      ANALYTICS
                    </span>
                    <h2>Threat Overview</h2>
                    <p>Distribution of scan results</p>
                  </div>
                  <span className="dashboard-panel-icon">◈</span>
                </div>

                <div className="dashboard-risk-list">
                  <ProgressRow
                    label="High Risk"
                    value={highRisk}
                    percentage={getPercentage(highRisk)}
                    color="#EF4444"
                  />

                  <ProgressRow
                    label="Medium Risk"
                    value={mediumRisk}
                    percentage={getPercentage(mediumRisk)}
                    color="#F59E0B"
                  />

                  <ProgressRow
                    label="Low Risk"
                    value={lowRisk}
                    percentage={getPercentage(lowRisk)}
                    color="#22C55E"
                  />

                  {otherScans > 0 && (
                    <ProgressRow
                      label="Other"
                      value={otherScans}
                      percentage={getPercentage(otherScans)}
                      color="#A3A3A3"
                    />
                  )}
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="dashboard-panel-heading">
                  <div>
                    <span className="dashboard-panel-kicker">
                      ANALYTICS
                    </span>
                    <h2>Scan Distribution</h2>
                    <p>Content types analyzed</p>
                  </div>
                  <span className="dashboard-panel-icon">▤</span>
                </div>

                <div className="dashboard-risk-list">
                  <ProgressRow
                    label="URL Scans"
                    value={urlScans}
                    percentage={getPercentage(urlScans)}
                    color="#F59E0B"
                  />

                  <ProgressRow
                    label="Email Scans"
                    value={emailScans}
                    percentage={getPercentage(emailScans)}
                    color="#A78BFA"
                  />

                  <ProgressRow
                    label="SMS Scans"
                    value={smsScans}
                    percentage={getPercentage(smsScans)}
                    color="#38BDF8"
                  />
                </div>

                <div className="dashboard-distribution-total">
                  <span>Total analyzed</span>
                  <strong>{totalScans}</strong>
                </div>
              </div>
            </section>

            {/* QUICK ACTIONS */}
            <section className="dashboard-quick-section">
              <div className="dashboard-section-heading">
                <div>
                  <h2>Security Tools</h2>
                  <p>Choose a tool to analyze suspicious content.</p>
                </div>
              </div>

              <div className="dashboard-quick-grid">
                {quickActions.map((action) => (
                  <Link
                    to={action.path}
                    className="dashboard-action-card"
                    key={action.path}
                  >
                    <div className="dashboard-action-icon">
                      {action.icon}
                    </div>

                    <div>
                      <h3>{action.title}</h3>
                      <p>{action.description}</p>
                    </div>

                    <span className="dashboard-action-arrow">
                      ↗
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* RECENT ACTIVITY */}
            <section className="dashboard-panel dashboard-recent">
              <div className="dashboard-panel-heading">
                <div>
                  <span className="dashboard-panel-kicker">
                    ACTIVITY
                  </span>
                  <h2>Recent Scans</h2>
                  <p>Your latest security analyses</p>
                </div>

                <Link
                  to="/history"
                  className="dashboard-view-all"
                >
                  View History ↗
                </Link>
              </div>

              {scans.length === 0 ? (
                <div className="dashboard-empty">
                  <span>⌕</span>
                  <h3>No scans yet</h3>
                  <p>
                    Start by analyzing a URL, email or SMS.
                  </p>
                </div>
              ) : (
                <div className="dashboard-recent-list">
                  {scans.slice(0, 5).map((item, index) => {
                    const statusColor =
                      getStatusColor(item.status);

                    return (
                      <div
                        className="dashboard-recent-item"
                        key={
                          item._id ||
                          `${item.createdAt}-${index}`
                        }
                      >
                        <div className="dashboard-recent-type">
                          {getTypeIcon(item.type)}
                        </div>

                        <div className="dashboard-recent-info">
                          <strong>
                            {item.type || "Security"} Analysis
                          </strong>
                          <span>
                            {formatDate(item.createdAt)}
                          </span>
                        </div>

                        <div className="dashboard-recent-result">
                          <strong style={{ color: statusColor }}>
                            {item.score ?? "—"}
                          </strong>

                          <span
                            style={{
                              color: statusColor,
                              borderColor: `${statusColor}55`,
                              background: `${statusColor}12`,
                            }}
                          >
                            {item.status || "Unknown"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* AWARENESS BANNER */}
            <section className="dashboard-awareness">
              <div className="dashboard-awareness-icon">🛡️</div>
              <div>
                <span>SECURITY REMINDER</span>
                <h2>Stay alert. Think before you click.</h2>
                <p>
                  Never share your OTP or UPI PIN.
                  Always verify suspicious links and payment requests.
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </PageLayout>
  );
}

function StatCard({ icon, label, value, description, color }) {
  return (
    <article className="dashboard-stat-card">
      <div className="dashboard-stat-top">
        <span
          className="dashboard-stat-icon"
          style={{ color, background: `${color}16` }}
        >
          {icon}
        </span>
        <span className="dashboard-stat-indicator">
          SCAN DATA
        </span>
      </div>

      <strong className="dashboard-stat-value">
        {value}
      </strong>

      <h3>{label}</h3>
      <p>{description}</p>
    </article>
  );
}

function ProgressRow({ label, value, percentage, color }) {
  return (
    <div className="dashboard-progress-row">
      <div className="dashboard-progress-label">
        <span>{label}</span>
        <strong>{value} <small>({percentage}%)</small></strong>
      </div>

      <div className="dashboard-progress-track">
        <div
          className="dashboard-progress-fill"
          style={{
            width: `${percentage}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

export default Dashboard;
