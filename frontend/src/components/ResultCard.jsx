
function ResultCard({
  score,
  status,
  reason,
  recommendation,
  details,
  scannedUrl,
  onScanAgain,
}) {
  const scoreNumber = Math.min(
    100,
    Math.max(0, parseInt(score, 10) || 0)
  );

  let riskLevel;
  let riskClass;

  if (scoreNumber <= 30) {
    riskLevel = "LOW RISK";
    riskClass = "risk-low";
  } else if (scoreNumber <= 70) {
    riskLevel = "MEDIUM RISK";
    riskClass = "risk-medium";
  } else {
    riskLevel = "HIGH RISK";
    riskClass = "risk-high";
  }

  const circumference = 2 * Math.PI * 68;
  const progress = (scoreNumber / 100) * circumference;

  const engineStats = [
    {
      label: "Malicious",
      value: details?.malicious ?? 0,
      className: "engine-malicious",
      symbol: "!",
    },
    {
      label: "Suspicious",
      value: details?.suspicious ?? 0,
      className: "engine-suspicious",
      symbol: "⚠",
    },
    {
      label: "Harmless",
      value: details?.harmless ?? 0,
      className: "engine-harmless",
      symbol: "✓",
    },
    {
      label: "Undetected",
      value: details?.undetected ?? 0,
      className: "engine-undetected",
      symbol: "—",
    },
  ];

  return (
    <section className={`fl-report ${riskClass}`}>
      {/* REPORT HEADER */}
      <header className="fl-report-header">
        <div>
          <div className="fl-report-eyebrow">
            <span className="fl-report-live-dot" />
            FRAUDLENS / THREAT INTELLIGENCE REPORT
          </div>

          <h2>Security assessment</h2>

          <p>
            Analysis completed. Review the assessment and
            recommendations below.
          </p>
        </div>

        <div className="fl-report-complete">
          <span>✓</span>
          ANALYSIS COMPLETE
        </div>
      </header>

      {/* TARGET */}
      <div className="fl-report-target">
        <div className="fl-report-target-icon">⌕</div>

        <div className="fl-report-target-info">
          <span>ANALYZED INPUT</span>
          <strong>
            {scannedUrl || "Submitted content"}
          </strong>
        </div>

        <div className="fl-report-target-type">
          SECURITY REPORT
        </div>
      </div>

      {/* SCORE AND RISK */}
      <div className="fl-report-overview">
        <div className="fl-report-score-panel">
          <div className="fl-report-section-label">
            THREAT SCORE
          </div>

          <div className="fl-score-content">
            <div className="fl-score-ring">
              <svg viewBox="0 0 160 160" role="img" aria-label={`Threat score ${scoreNumber} out of 100`}>
                <circle
                  className="fl-score-track"
                  cx="80"
                  cy="80"
                  r="68"
                />

                <circle
                  className="fl-score-progress"
                  cx="80"
                  cy="80"
                  r="68"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                />
              </svg>

              <div className="fl-score-value">
                <strong>{scoreNumber}</strong>
                <span>/ 100</span>
              </div>
            </div>

            <div className="fl-score-caption">
              <span className="fl-report-section-label">
                RISK CLASSIFICATION
              </span>

              <div className="fl-risk-label">
                <span className="fl-risk-indicator" />
                {riskLevel}
              </div>

              <p>
                {scoreNumber <= 30
                  ? "The reported threat score is relatively low. Continue to verify unexpected messages and links."
                  : scoreNumber <= 70
                    ? "The reported threat score indicates caution. Review the findings before interacting."
                    : "The reported threat score is high. Avoid interacting with this content until it has been verified."}
              </p>
            </div>
          </div>
        </div>

        <div className="fl-report-status-panel">
          <div className="fl-report-section-label">
            ANALYSIS STATUS
          </div>

          <div className="fl-status-value">
            <span className="fl-status-check">✓</span>
            <div>
              <strong>{status || "Unknown"}</strong>
              <span>Returned by analysis engine</span>
            </div>
          </div>

          <div className="fl-status-divider" />

          <div className="fl-report-section-label">
            SCORE INTERPRETATION
          </div>

          <div className="fl-score-scale">
            <div>
              <span className="scale-dot scale-green" />
              <span>0–30</span>
              <strong>Low</strong>
            </div>

            <div>
              <span className="scale-dot scale-orange" />
              <span>31–70</span>
              <strong>Medium</strong>
            </div>

            <div>
              <span className="scale-dot scale-red" />
              <span>71–100</span>
              <strong>High</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ENGINE ANALYSIS */}
      {details && (
        <section className="fl-report-engines">
          <div className="fl-report-block-heading">
            <div>
              <span className="fl-report-section-label">
                SECURITY ENGINE
              </span>

              <h3>Detection breakdown</h3>

              <p>
                Engine statistics returned in the analysis report.
              </p>
            </div>

            <span className="fl-engine-total">
              {details.totalEngines ?? 0} TOTAL ENGINES
            </span>
          </div>

          <div className="fl-engine-grid">
            {engineStats.map((engine) => (
              <article
                className={`fl-engine-card ${engine.className}`}
                key={engine.label}
              >
                <div className="fl-engine-card-top">
                  <span>{engine.label}</span>
                  <span className="fl-engine-symbol">
                    {engine.symbol}
                  </span>
                </div>

                <strong>{engine.value}</strong>

                <span className="fl-engine-card-caption">
                  Detection count
                </span>
              </article>
            ))}
          </div>

          <div className="fl-engine-footnote">
            <span>ⓘ</span>
            These values represent the engine statistics supplied
            by the analysis service.
          </div>
        </section>
      )}

      {/* FINDINGS */}
      <div className="fl-report-findings">
        <div className="fl-report-block-heading">
          <div>
            <span className="fl-report-section-label">
              INVESTIGATION FINDINGS
            </span>

            <h3>Why this result?</h3>
          </div>

          <span className="fl-report-block-number">01</span>
        </div>

        <div className="fl-report-text-panel">
          <div className="fl-report-text-icon">⌕</div>

          <p>
            {reason || "No reason provided by the analysis engine."}
          </p>
        </div>
      </div>

      {/* RECOMMENDATION */}
      <div className="fl-report-recommendation">
        <div className="fl-report-block-heading">
          <div>
            <span className="fl-report-section-label">
              RECOMMENDED ACTION
            </span>

            <h3>Security recommendation</h3>
          </div>

          <span className="fl-report-block-number">02</span>
        </div>

        <div className="fl-report-recommendation-body">
          <div className="fl-recommendation-icon">✦</div>

          <p>
            {recommendation ||
              "No recommendation provided by the analysis engine."}
          </p>
        </div>
      </div>

      {/* REPORT FOOTER */}
      <footer className="fl-report-footer">
        <div>
          <span className="fl-report-footer-mark">FL</span>

          <div>
            <strong>FRAUDLENS</strong>
            <span>THREAT INTELLIGENCE SYSTEM</span>
          </div>
        </div>

        <span>END OF SECURITY REPORT</span>
      </footer>

      {/* ACTION */}
      {onScanAgain && (
        <button
          type="button"
          className="fl-report-scan-again"
          onClick={onScanAgain}
        >
          <span>↻</span>
          Start a new investigation
          <span>↗</span>
        </button>
      )}
    </section>
  );
}

export default ResultCard;
