
import { useState } from "react";
import PageLayout from "../components/PageLayout";
import Loader from "../components/Loader";
import ResultCard from "../components/ResultCard";
import { addHistory } from "../utils/historyStorage";
import { apiFetch } from "../utils/api";

const scamPatterns = [
  {
    number: "01",
    title: "Fake KYC updates",
    description:
      "Messages threaten account restrictions unless you urgently update KYC details.",
    example: "Your bank KYC has expired. Update immediately.",
    tag: "BANKING FRAUD",
  },
  {
    number: "02",
    title: "UPI payment tricks",
    description:
      "Fraudsters may send fake payment requests or ask you to enter your UPI PIN.",
    example: "Approve this request to receive your refund.",
    tag: "PAYMENT FRAUD",
  },
  {
    number: "03",
    title: "Parcel delivery scams",
    description:
      "Fake delivery alerts use unexpected fees or address updates to lure people to links.",
    example: "Your parcel is on hold. Pay a small fee.",
    tag: "DELIVERY FRAUD",
  },
  {
    number: "04",
    title: "Prize and reward scams",
    description:
      "Unexpected winnings are used to collect personal details or encourage payments.",
    example: "You have won a cash reward. Claim now.",
    tag: "REWARD FRAUD",
  },
];

const safetyChecks = [
  {
    number: "01",
    title: "Unknown sender",
    description: "Do you recognise the sender and expect this message?",
  },
  {
    number: "02",
    title: "Suspicious links",
    description: "Does the message contain an unfamiliar or shortened URL?",
  },
  {
    number: "03",
    title: "Urgent requests",
    description: "Is it pressuring you to act, pay or share information?",
  },
];

function SmsAnalyzer() {
  const [sms, setSms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    const input = sms.trim();

    if (!input) {
      setError("SMS content is required to analyze.");
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
        err.message || "Unable to analyze SMS."
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
    <PageLayout>
      <div className="sms-intelligence">

        {/* PAGE HEADER */}
        <header className="sms-intelligence-header">
          <div>
            <div className="sms-intelligence-eyebrow">
              <span className="sms-eyebrow-dot" />
              MOBILE SECURITY / MESSAGE INTELLIGENCE
            </div>

            <h1>
              Decode the <span>message.</span>
            </h1>

            <p>
              Investigate suspicious text messages, understand
              common SMS fraud techniques and review the
              security assessment.
            </p>
          </div>

          <div className="sms-header-mark">
            <span>03</span>
            <div>
              SMS
              <br />
              INTELLIGENCE
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="sms-intelligence-layout">

          {/* LEFT: PHONE INVESTIGATION */}
          <main className="sms-investigation-column">

            <section className="sms-phone-section">
              <div className="sms-phone-section-heading">
                <div>
                  <span className="sms-kicker">
                    MESSAGE INSPECTION
                  </span>

                  <h2>Inspect a text message</h2>

                  <p>
                    Paste the SMS content to investigate
                    potentially suspicious patterns.
                  </p>
                </div>

                <span className="sms-device-label">
                  MOBILE / SMS
                </span>
              </div>

              {/* PHONE PREVIEW */}
              <div className="sms-phone-stage">
                <div className="sms-phone">
                  <div className="sms-phone-top">
                    <span className="sms-phone-speaker" />
                    <span className="sms-phone-camera" />
                  </div>

                  <div className="sms-phone-screen">
                    <div className="sms-phone-status">
                      <span>MESSAGE PREVIEW</span>
                      <span>•••</span>
                    </div>

                    <div className="sms-phone-contact">
                      <div className="sms-contact-avatar">
                        SMS
                      </div>

                      <div>
                        <strong>Unknown sender</strong>
                        <span>Sender not verified</span>
                      </div>
                    </div>

                    <div className="sms-phone-date">
                      MESSAGE CONTENT
                    </div>

                    <div className="sms-chat-area">
                      {sms.trim() ? (
                        <div className="sms-chat-bubble">
                          {sms}
                        </div>
                      ) : (
                        <div className="sms-chat-placeholder">
                          <span>✉</span>
                          <strong>Your message will appear here</strong>
                          <p>
                            Paste an SMS in the editor below
                            to preview its content.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="sms-phone-bottom">
                      <span>Message preview only</span>
                      <span>FraudLens</span>
                    </div>
                  </div>
                </div>

                <div className="sms-phone-caption">
                  <span className="sms-preview-dot" />
                  LIVE MESSAGE PREVIEW
                </div>
              </div>

              {/* INPUT EDITOR */}
              <div className="sms-editor-panel">
                <div className="sms-editor-heading">
                  <label htmlFor="sms-content">
                    SMS CONTENT
                  </label>

                  <span>
                    {sms.length.toLocaleString()} characters
                  </span>
                </div>

                <textarea
                  id="sms-content"
                  className="sms-editor"
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
                  placeholder={
                    "Paste the suspicious SMS message here...\n\nExample:\nDear Customer, your bank account KYC has expired. Update your details immediately using the link below..."
                  }
                  rows={6}
                  disabled={loading}
                />

                <div className="sms-editor-meta">
                  <span>
                    <span className="sms-editor-ready-dot" />
                    READY FOR INSPECTION
                  </span>

                  <span>CTRL + ENTER TO ANALYZE</span>
                </div>

                {error && (
                  <div className="sms-error" role="alert">
                    <span>!</span>
                    {error}
                  </div>
                )}

                <div className="sms-actions">
                  <button
                    type="button"
                    className="sms-analyze-button"
                    onClick={handleAnalyze}
                    disabled={loading}
                  >
                    {loading
                      ? "Analyzing message..."
                      : "Analyze SMS"}

                    <span>↗</span>
                  </button>

                  <button
                    type="button"
                    className="sms-clear-button"
                    onClick={handleClear}
                    disabled={loading}
                  >
                    Clear
                  </button>
                </div>

                <div className="sms-editor-note">
                  <span>ⓘ</span>
                  Submit only message content you are authorised to inspect.
                </div>
              </div>
            </section>

            {/* SAFETY CHECKLIST */}
            <section className="sms-checklist-panel">
              <div className="sms-checklist-heading">
                <div>
                  <span className="sms-kicker">
                    QUICK SECURITY CHECK
                  </span>

                  <h2>Before you trust an SMS</h2>
                </div>

                <span>03 CHECKS</span>
              </div>

              <div className="sms-checklist-grid">
                {safetyChecks.map((item) => (
                  <article
                    className="sms-check-item"
                    key={item.number}
                  >
                    <span>{item.number}</span>

                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>

          {/* RIGHT: SMS THREAT INTELLIGENCE */}
          <aside className="sms-threat-panel">
            <div className="sms-threat-heading">
              <span className="sms-kicker">
                SMS THREAT LIBRARY
              </span>

              <span className="sms-threat-symbol">⌁</span>
            </div>

            <h2>Know the common tricks.</h2>

            <p className="sms-threat-intro">
              Fraudulent SMS messages often imitate banks,
              delivery services and familiar organisations
              to make requests look legitimate.
            </p>

            <div className="sms-scam-list">
              {scamPatterns.map((pattern) => (
                <article
                  className="sms-scam-item"
                  key={pattern.number}
                >
                  <div className="sms-scam-topline">
                    <span className="sms-scam-number">
                      {pattern.number}
                    </span>

                    <span className="sms-scam-tag">
                      {pattern.tag}
                    </span>
                  </div>

                  <h3>{pattern.title}</h3>

                  <p>{pattern.description}</p>

                  <code>{pattern.example}</code>
                </article>
              ))}
            </div>

            <div className="sms-threat-warning">
              <span>!</span>

              <div>
                <strong>Never share your OTP or UPI PIN.</strong>

                <p>
                  You do not need to enter your UPI PIN
                  to receive money. Verify unexpected
                  requests independently.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* RESULT */}
        {loading && (
          <section className="sms-result-section">
            <div>
              <span className="sms-kicker">
                ANALYSIS IN PROGRESS
              </span>

              <h2>Inspecting SMS content</h2>

              <p>
                Please wait while FraudLens processes
                the submitted message.
              </p>
            </div>

            <Loader />
          </section>
        )}

        {result && !loading && (
          <section className="sms-result-section">
            <div className="sms-result-heading">
              <span className="sms-kicker">
                INVESTIGATION COMPLETE
              </span>

              <h2>SMS security assessment</h2>

              <p>
                Review the findings and recommendations
                returned by the FraudLens analysis engine.
              </p>
            </div>

            <ResultCard
              score={result.score}
              status={result.status}
              reason={result.reason}
              recommendation={result.recommendation}
              details={result.details}
              onScanAgain={handleClear}
            />
          </section>
        )}

        {/* FOOTER */}
        <footer className="sms-intelligence-footer">
          <span>FRAUDLENS / SMS INTELLIGENCE</span>

          <span>
            Automated analysis may not identify every fraudulent message.
          </span>
        </footer>
      </div>
    </PageLayout>
  );
}

export default SmsAnalyzer;
