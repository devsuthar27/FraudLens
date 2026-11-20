
function Loader() {
  return (
    <div className="fl-loader">
      <style>{`
        .fl-loader {
          margin-top: 30px;
          max-width: 700px;
          padding: 30px;
          background: #15191f;
          border: 1px solid rgba(251, 146, 60, 0.18);
          border-radius: 16px;
          color: #e5e7eb;
          font-family: inherit;
          overflow: hidden;
        }

        .fl-loader-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
        }

        .fl-loader-radar {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          position: relative;
          border: 1px solid rgba(251, 146, 60, 0.35);
          border-radius: 50%;
          background: rgba(251, 146, 60, 0.05);
          overflow: hidden;
        }

        .fl-loader-radar::before {
          content: "";
          position: absolute;
          inset: 5px;
          border: 1px solid rgba(251, 146, 60, 0.25);
          border-radius: 50%;
        }

        .fl-loader-radar::after {
          content: "";
          position: absolute;
          width: 50%;
          height: 50%;
          top: 0;
          left: 50%;
          transform-origin: bottom left;
          background: linear-gradient(
            45deg,
            transparent 35%,
            rgba(251, 146, 60, 0.55)
          );
          animation: flRadarSpin 2s linear infinite;
        }

        .fl-loader-radar-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #fb923c;
          border-radius: 50%;
          top: 21px;
          left: 21px;
          z-index: 2;
          box-shadow: 0 0 10px #fb923c;
        }

        @keyframes flRadarSpin {
          to { transform: rotate(360deg); }
        }

        .fl-loader-title {
          font-size: 16px;
          font-weight: 700;
          color: #f8fafc;
          margin: 0 0 5px;
        }

        .fl-loader-subtitle {
          color: #87919e;
          font-size: 12px;
          margin: 0;
        }

        .fl-loader-status {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          margin-top: 8px;
          background: #1b2028;
          border: 1px solid rgba(255,255,255,0.045);
          border-radius: 9px;
          color: #a1aab6;
          font-size: 13px;
          animation: flStatusPulse 4s infinite;
        }

        .fl-loader-status:nth-child(2) {
          animation-delay: 0s;
        }

        .fl-loader-status:nth-child(3) {
          animation-delay: 1s;
        }

        .fl-loader-status:nth-child(4) {
          animation-delay: 2s;
        }

        .fl-loader-status:nth-child(5) {
          animation-delay: 3s;
        }

        .fl-loader-indicator {
          width: 7px;
          height: 7px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #475569;
        }

        @keyframes flStatusPulse {
          0%, 20% {
            color: #fb923c;
            border-color: rgba(251,146,60,0.25);
            background: rgba(251,146,60,0.055);
          }
          25%, 100% {
            color: #a1aab6;
            border-color: rgba(255,255,255,0.045);
            background: #1b2028;
          }
        }

        .fl-loader-status:nth-child(2) .fl-loader-indicator {
          animation: flDotPulse 4s infinite;
        }

        .fl-loader-status:nth-child(3) .fl-loader-indicator {
          animation: flDotPulse 4s infinite 1s;
        }

        .fl-loader-status:nth-child(4) .fl-loader-indicator {
          animation: flDotPulse 4s infinite 2s;
        }

        .fl-loader-status:nth-child(5) .fl-loader-indicator {
          animation: flDotPulse 4s infinite 3s;
        }

        @keyframes flDotPulse {
          0%, 20% {
            background: #fb923c;
            box-shadow: 0 0 8px rgba(251,146,60,0.7);
          }
          25%, 100% {
            background: #475569;
            box-shadow: none;
          }
        }

        .fl-loader-progress {
          height: 4px;
          width: 100%;
          margin-top: 24px;
          background: #29313b;
          border-radius: 10px;
          overflow: hidden;
        }

        .fl-loader-progress-bar {
          height: 100%;
          width: 35%;
          border-radius: 10px;
          background: linear-gradient(
            90deg,
            #f97316,
            #fb923c,
            #fdba74
          );
          animation: flProgressMove 1.8s ease-in-out infinite;
        }

        @keyframes flProgressMove {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(300%); }
        }

        .fl-loader-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          color: #647080;
          font-size: 11px;
          letter-spacing: 0.3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .fl-loader *,
          .fl-loader *::before,
          .fl-loader *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <div className="fl-loader-header">
        <div className="fl-loader-radar">
          <div className="fl-loader-radar-dot" />
        </div>

        <div>
          <h3 className="fl-loader-title">
            Security Analysis in Progress
          </h3>
          <p className="fl-loader-subtitle">
            FraudLens Intelligence Engine
          </p>
        </div>
      </div>

      <div aria-live="polite">
        <div className="fl-loader-status">
          <span className="fl-loader-indicator" />
          Analyzing phishing indicators
        </div>

        <div className="fl-loader-status">
          <span className="fl-loader-indicator" />
          Comparing threat intelligence databases
        </div>

        <div className="fl-loader-status">
          <span className="fl-loader-indicator" />
          Evaluating security signals
        </div>

        <div className="fl-loader-status">
          <span className="fl-loader-indicator" />
          Preparing security assessment
        </div>
      </div>

      <div className="fl-loader-progress">
        <div className="fl-loader-progress-bar" />
      </div>

      <div className="fl-loader-footer">
        <span>FRAUDLENS SCANNER</span>
        <span>ANALYZING...</span>
      </div>
    </div>
  );
}

export default Loader;
