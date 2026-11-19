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
  let riskColor;

  if (scoreNumber <= 30) {
    riskLevel = "LOW RISK";
    riskColor = "#22C55E";
  } else if (scoreNumber <= 70) {
    riskLevel = "MEDIUM RISK";
    riskColor = "#F59E0B";
  } else {
    riskLevel = "HIGH RISK";
    riskColor = "#EF4444";
  }

  return (
    <div
      style={{
        background:
          "linear-gradient(145deg, #172033, #111827)",
        border: "1px solid #26364F",
        borderRadius: "20px",
        padding: "30px",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.35)",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "7px 15px",
            borderRadius: "20px",
            background: `${riskColor}18`,
            color: riskColor,
            border: `1px solid ${riskColor}55`,
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          ANALYSIS COMPLETE
        </div>

        <h2
          style={{
            fontSize: "28px",
            margin: "15px 0 5px",
          }}
        >
          🛡️ Security Analysis Result
        </h2>

        <p
          style={{
            color: "#64748B",
            margin: 0,
            fontSize: "13px",
            wordBreak: "break-all",
          }}
        >
          {scannedUrl || "Scanned URL"}
        </p>
      </div>

      {/* SCORE */}

      <div
        style={{
          background: "#020617",
          border: "1px solid #1E293B",
          borderRadius: "16px",
          padding: "25px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#94A3B8",
            margin: "0 0 8px",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          THREAT SCORE
        </p>

        <div
          style={{
            fontSize: "56px",
            fontWeight: "800",
            color: riskColor,
          }}
        >
          {scoreNumber}
          <span
            style={{
              fontSize: "20px",
              color: "#64748B",
            }}
          >
            /100
          </span>
        </div>

        {/* SCORE BAR */}

        <div
          style={{
            marginTop: "18px",
            height: "12px",
            background: "#1E293B",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${scoreNumber}%`,
              height: "100%",
              background: riskColor,
              borderRadius: "20px",
              transition: "width 0.8s ease",
            }}
          />
        </div>

        <div
          style={{
            marginTop: "15px",
            display: "inline-block",
            padding: "8px 18px",
            borderRadius: "20px",
            background: `${riskColor}18`,
            color: riskColor,
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {riskLevel}
        </div>
      </div>

      {/* STATUS */}

      <div
        style={{
          marginTop: "20px",
          background: "#020617",
          border: "1px solid #1E293B",
          borderRadius: "12px",
          padding: "17px",
        }}
      >
        <div
          style={{
            color: "#64748B",
            fontSize: "12px",
            marginBottom: "6px",
            fontWeight: "bold",
          }}
        >
          STATUS
        </div>

        <div
          style={{
            color: riskColor,
            fontWeight: "bold",
          }}
        >
          {status || "Unknown"}
        </div>
      </div>

      {/* VIRUSTOTAL DETAILS */}

      {details && (
        <div
          style={{
            marginTop: "20px",
            background: "#020617",
            border: "1px solid #1E293B",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: "18px",
            }}
          >
            🔍 Security Engine Analysis
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            <EngineBox
              label="Malicious"
              value={details.malicious ?? 0}
              color="#EF4444"
              icon="🔴"
            />

            <EngineBox
              label="Suspicious"
              value={details.suspicious ?? 0}
              color="#F59E0B"
              icon="🟠"
            />

            <EngineBox
              label="Harmless"
              value={details.harmless ?? 0}
              color="#22C55E"
              icon="🟢"
            />

            <EngineBox
              label="Undetected"
              value={details.undetected ?? 0}
              color="#94A3B8"
              icon="⚪"
            />
          </div>

          <div
            style={{
              marginTop: "18px",
              paddingTop: "15px",
              borderTop: "1px solid #1E293B",
              color: "#94A3B8",
              fontSize: "14px",
            }}
          >
            <strong style={{ color: "white" }}>
              Total Engines Analyzed:
            </strong>{" "}
            {details.totalEngines ?? 0}
          </div>
        </div>
      )}

      {/* REASON */}

      <InfoBox
        title="🔎 Why this result?"
        text={reason || "No reason provided."}
      />

      {/* RECOMMENDATION */}

      <InfoBox
        title="💡 Security Recommendation"
        text={
          recommendation ||
          "No recommendation provided."
        }
      />

      {/* ACTION */}

      {onScanAgain && (
        <button
          onClick={onScanAgain}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "14px",
            background: "#2563EB",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🔄 Scan Another Email
        </button>
      )}
    </div>
  );
}

// ======================================================
// ENGINE BOX
// ======================================================

function EngineBox({
  label,
  value,
  color,
  icon,
}) {
  return (
    <div
      style={{
        background: "#0F172A",
        border: "1px solid #1E293B",
        borderRadius: "10px",
        padding: "15px",
      }}
    >
      <div
        style={{
          color: "#94A3B8",
          fontSize: "13px",
          marginBottom: "7px",
        }}
      >
        {icon} {label}
      </div>

      <div
        style={{
          color,
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ======================================================
// INFO BOX
// ======================================================

function InfoBox({ title, text }) {
  return (
    <div
      style={{
        marginTop: "20px",
        background: "#020617",
        border: "1px solid #1E293B",
        borderRadius: "12px",
        padding: "18px",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#CBD5E1",
          lineHeight: "1.6",
          fontSize: "14px",
        }}
      >
        {text}
      </div>
    </div>
  );
}

export default ResultCard;