
import { useEffect, useMemo, useState } from "react";
import PageLayout from "../components/PageLayout";
import { apiFetch } from "../utils/api";
import "./History.css";

function getRiskLevel(status) {
  const value = status?.toLowerCase() || "";

  if (value.includes("high") || value.includes("malicious")) return "high";
  if (value.includes("medium") || value.includes("suspicious")) return "medium";
  if (
    value.includes("low") ||
    value.includes("safe") ||
    value.includes("no threat")
  ) return "low";

  return "unknown";
}

function getRecordKey(item, index) {
  return item._id || `${item.createdAt || "record"}-${index}`;
}

function getTypeIcon(type) {
  switch (type?.toUpperCase()) {
    case "URL": return "◎";
    case "EMAIL": return "✉";
    case "SMS": return "▤";
    default: return "⌕";
  }
}

function formatDate(date) {
  if (!date) return "Unknown time";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Unknown time";

  return parsed.toLocaleString();
}

function formatShortDate(date) {
  if (!date) return "Unknown date";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Unknown date";

  return parsed.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch(
          "http://localhost:5000/api/history",
          { method: "GET" }
        );

        if (!response) return;

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to fetch history.");
        }

        const records = data.history || [];
        setHistory(records);

        if (records.length > 0) {
          setSelectedKey(getRecordKey(records[0], 0));
        }
      } catch (err) {
        console.error("History Fetch Error:", err);
        setError(err.message || "Unable to load scan history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    return history
      .map((item, index) => ({ ...item, _displayKey: getRecordKey(item, index) }))
      .filter((item) => {
        const text =
          `${item.type || ""} ${item.input || ""} ${item.status || ""}`
            .toLowerCase();

        const matchesSearch = text.includes(search.toLowerCase());
        const risk = getRiskLevel(item.status);

        const matchesRisk =
          riskFilter === "All" ||
          (riskFilter === "High" && risk === "high") ||
          (riskFilter === "Medium" && risk === "medium") ||
          (riskFilter === "Low" && risk === "low");

        const matchesType =
          typeFilter === "All" ||
          item.type?.toUpperCase() === typeFilter.toUpperCase();

        return matchesSearch && matchesRisk && matchesType;
      });
  }, [history, search, riskFilter, typeFilter]);

  const selectedRecord =
    filteredHistory.find((item) => item._displayKey === selectedKey) ||
    filteredHistory[0] ||
    null;

  const highCount = history.filter(
    (item) => getRiskLevel(item.status) === "high"
  ).length;

  const mediumCount = history.filter(
    (item) => getRiskLevel(item.status) === "medium"
  ).length;

  const lowCount = history.filter(
    (item) => getRiskLevel(item.status) === "low"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setRiskFilter("All");
    setTypeFilter("All");
  };

  return (
    <PageLayout>
      <main className="investigation-page">

        {/* TOP HEADER */}
        <header className="investigation-header">
          <div>
            <div className="investigation-eyebrow">
              <span className="eyebrow-pulse" />
              FRAUDLENS / INTELLIGENCE CENTER
            </div>

            <h1>Investigation <span>Log</span></h1>
            <p>
              A centralized view of every URL, email and SMS security analysis.
            </p>
          </div>

          <div className="investigation-total">
            <span className="total-symbol">◷</span>
            <div>
              <strong>{history.length}</strong>
              <small>RECORDED SCANS</small>
            </div>
          </div>
        </header>

        {/* COMPACT OVERVIEW STRIP */}
        <section className="investigation-overview">
          <div className="overview-cell">
            <span className="overview-label">TOTAL ACTIVITY</span>
            <strong>{history.length}</strong>
            <span className="overview-foot">All recorded analyses</span>
          </div>

          <div className="overview-cell">
            <span className="overview-label">HIGH RISK</span>
            <strong className="risk-text-high">{highCount}</strong>
            <span className="overview-foot">Malicious / high risk</span>
          </div>

          <div className="overview-cell">
            <span className="overview-label">MEDIUM RISK</span>
            <strong className="risk-text-medium">{mediumCount}</strong>
            <span className="overview-foot">Suspicious results</span>
          </div>

          <div className="overview-cell">
            <span className="overview-label">LOW RISK</span>
            <strong className="risk-text-low">{lowCount}</strong>
            <span className="overview-foot">Safe / low risk</span>
          </div>

          <div className="overview-visual" aria-hidden="true">
            <div className="overview-bar">
              <span style={{ width: `${history.length ? (highCount / history.length) * 100 : 0}%` }} />
              <span style={{ width: `${history.length ? (mediumCount / history.length) * 100 : 0}%` }} />
              <span style={{ width: `${history.length ? (lowCount / history.length) * 100 : 0}%` }} />
            </div>
            <small>RISK DISTRIBUTION</small>
          </div>
        </section>

        {/* WORKSPACE */}
        <section className="investigation-workspace">

          {/* LEFT: TIMELINE */}
          <aside className="investigation-timeline">
            <div className="workspace-panel-heading">
              <div>
                <span className="panel-kicker">ACTIVITY FEED</span>
                <h2>Scan timeline</h2>
              </div>
              <span className="timeline-count">{filteredHistory.length}</span>
            </div>

            <div className="timeline-list">
              {filteredHistory.map((item, index) => {
                const risk = getRiskLevel(item.status);
                const active = selectedRecord?._displayKey === item._displayKey;

                return (
                  <button
                    type="button"
                    key={item._displayKey}
                    className={`timeline-entry ${active ? "active" : ""}`}
                    onClick={() => setSelectedKey(item._displayKey)}
                  >
                    <span className={`timeline-marker ${risk}`} />
                    <span className="timeline-entry-content">
                      <span className="timeline-entry-top">
                        <strong>{item.type || "SCAN"}</strong>
                        <small>{formatShortDate(item.createdAt)}</small>
                      </span>
                      <span className="timeline-entry-input">
                        {item.input || "No input available"}
                      </span>
                      <span className={`timeline-entry-status ${risk}`}>
                        {item.status || "Unknown status"}
                      </span>
                    </span>
                    <span className="timeline-arrow">›</span>
                  </button>
                );
              })}

              {!loading && !error && filteredHistory.length === 0 && (
                <div className="timeline-empty">
                  No matching activity.
                </div>
              )}
            </div>
          </aside>

          {/* CENTRE + RIGHT */}
          <div className="investigation-main">

            {/* FILTER BAR */}
            <div className="investigation-filterbar">
              <div className="filterbar-title">
                <span className="panel-kicker">RECORD EXPLORER</span>
                <strong>Security events</strong>
                <small>{filteredHistory.length} matching records</small>
              </div>

              <div className="investigation-filters">
                <label className="investigation-search">
                  <span>⌕</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search records..."
                  />
                </label>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  aria-label="Filter by scan type"
                >
                  <option value="All">All types</option>
                  <option value="URL">URL</option>
                  <option value="EMAIL">Email</option>
                  <option value="SMS">SMS</option>
                </select>

                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  aria-label="Filter by risk"
                >
                  <option value="All">All risks</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                {(search || riskFilter !== "All" || typeFilter !== "All") && (
                  <button
                    type="button"
                    className="filter-reset"
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* RECORD TABLE */}
            <div className="investigation-table-panel">
              <div className="table-panel-heading">
                <div>
                  <span className="panel-kicker">RECENT ACTIVITY</span>
                  <h2>Investigation records</h2>
                </div>
                <span className="table-total">{filteredHistory.length} RECORDS</span>
              </div>

              <div className="investigation-table-scroll">
                <table className="investigation-table">
                  <thead>
                    <tr>
                      <th>TYPE</th>
                      <th>ANALYZED INPUT</th>
                      <th>RISK STATUS</th>
                      <th>SCORE</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredHistory.map((item) => {
                      const risk = getRiskLevel(item.status);
                      const active = selectedRecord?._displayKey === item._displayKey;

                      return (
                        <tr
                          key={item._displayKey}
                          className={active ? "selected" : ""}
                          onClick={() => setSelectedKey(item._displayKey)}
                        >
                          <td>
                            <span className={`table-type-icon ${item.type?.toLowerCase() || "other"}`}>
                              {getTypeIcon(item.type)}
                            </span>
                            <span className="table-type-name">{item.type || "Scan"}</span>
                          </td>

                          <td>
                            <span className="table-input" title={item.input || ""}>
                              {item.input || "—"}
                            </span>
                            <small className="table-date">{formatDate(item.createdAt)}</small>
                          </td>

                          <td>
                            <span className={`table-risk ${risk}`}>
                              <i />
                              {item.status || "Unknown"}
                            </span>
                          </td>

                          <td>
                            <strong className={`table-score ${risk}`}>
                              {item.score ?? "—"}
                            </strong>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {!loading && !error && filteredHistory.length === 0 && (
                  <div className="table-empty">
                    <span>⌕</span>
                    <strong>No records found</strong>
                    <small>Try changing your search or filters.</small>
                  </div>
                )}
              </div>
            </div>

            {/* SELECTED RECORD DETAILS */}
            <section className="investigation-detail">
              <div className="detail-heading">
                <div>
                  <span className="panel-kicker">CASE FILE / SELECTED RECORD</span>
                  <h2>Investigation details</h2>
                </div>

                {selectedRecord && (
                  <span className={`detail-risk ${getRiskLevel(selectedRecord.status)}`}>
                    {selectedRecord.status || "Unknown"}
                  </span>
                )}
              </div>

              {!selectedRecord && !loading && !error && (
                <div className="detail-placeholder">
                  <span>◎</span>
                  <strong>Select a record to investigate</strong>
                  <small>Choose any item from the timeline or records table.</small>
                </div>
              )}

              {selectedRecord && (
                <div className="detail-content">
                  <div className="detail-score-block">
                    <div>
                      <span className="panel-kicker">THREAT SCORE</span>
                      <strong className={`detail-score ${getRiskLevel(selectedRecord.status)}`}>
                        {selectedRecord.score ?? "—"}
                        {selectedRecord.score !== undefined && selectedRecord.score !== null
                          ? <small>/100</small>
                          : null}
                      </strong>
                    </div>

                    <div className="detail-record-type">
                      <span>{getTypeIcon(selectedRecord.type)}</span>
                      <div>
                        <strong>{selectedRecord.type || "Security Scan"}</strong>
                        <small>{formatDate(selectedRecord.createdAt)}</small>
                      </div>
                    </div>
                  </div>

                  <div className="detail-input-block">
                    <span className="panel-kicker">ANALYZED INPUT</span>
                    <p>{selectedRecord.input || "No input available"}</p>
                  </div>

                  <div className="detail-information-grid">
                    {selectedRecord.details?.indicatorCount !== undefined && (
                      <div>
                        <span>INDICATORS</span>
                        <strong>{selectedRecord.details.indicatorCount}</strong>
                      </div>
                    )}

                    {selectedRecord.details?.totalEngines !== undefined && (
                      <div>
                        <span>SECURITY ENGINES</span>
                        <strong>{selectedRecord.details.totalEngines}</strong>
                      </div>
                    )}

                    {selectedRecord.details?.malicious !== undefined && (
                      <div>
                        <span>MALICIOUS DETECTIONS</span>
                        <strong>{selectedRecord.details.malicious}</strong>
                      </div>
                    )}

                    {selectedRecord.details?.suspicious !== undefined && (
                      <div>
                        <span>SUSPICIOUS DETECTIONS</span>
                        <strong>{selectedRecord.details.suspicious}</strong>
                      </div>
                    )}
                  </div>

                  {selectedRecord.reason && (
                    <div className="detail-text-section">
                      <span className="panel-kicker">ANALYSIS SUMMARY</span>
                      <p>{selectedRecord.reason}</p>
                    </div>
                  )}

                  {selectedRecord.recommendation && (
                    <div className="detail-recommendation">
                      <span>✦</span>
                      <div>
                        <strong>Recommended action</strong>
                        <p>{selectedRecord.recommendation}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </section>

        {/* STATES */}
        {loading && (
          <div className="investigation-state">
            <div className="investigation-spinner" />
            <strong>Loading investigation records...</strong>
          </div>
        )}

        {!loading && error && (
          <div className="investigation-state error">
            <strong>Unable to load scan history</strong>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="investigation-state">
            <strong>No scan activity yet</strong>
            <p>Your URL, Email and SMS scans will appear here.</p>
          </div>
        )}

      </main>
    </PageLayout>
  );
}

export default History;
