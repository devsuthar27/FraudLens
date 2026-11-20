
import { useState } from "react";
import PageLayout from "../components/PageLayout";
import Loader from "../components/Loader";
import ResultCard from "../components/ResultCard";
import { addHistory } from "../utils/historyStorage";
import { apiFetch } from "../utils/api";

const phishingPatterns = [
  {
    number: "01",
    title: "Urgent account warnings",
    description:
      "Scammers create panic by claiming your account will be suspended or blocked.",
    example: "Your account will be disabled within 24 hours.",
  },
  {
    number: "02",
    title: "Credential harvesting",
    description:
      "Fake login or verification requests try to steal passwords and account details.",
    example: "Verify your account to continue.",
  },
  {
    number: "03",
    title: "Prize and reward scams",
    description:
      "Unexpected rewards are used to encourage clicks and collect personal information.",
    example: "Congratulations! Claim your reward now.",
  },
  {
    number: "04",
    title: "Suspicious attachments",
    description:
      "Unexpected files may contain malicious software or lead to unsafe downloads.",
    example: "Invoice.pdf.exe",
  },
];

const emailClues = [
  {
    title: "Sender identity",
    description: "Does the sender address match the organisation?",
    icon: "01",
  },
  {
    title: "Urgent language",
    description: "Is the message pressuring you to act immediately?",
    icon: "02",
  },
  {
    title: "Sensitive information",
    description: "Does it request passwords, OTPs or payment details?",
    icon: "03",
  },
];

function EmailAnalyzer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    const input = email.trim();

    if (!input) {
      setError("Email content is required.");
      setResult(null);
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await apiFetch(
        "http://localhost:5000/api/analyze-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: input,
          }),
        }
      );

      if (!response) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Email analysis failed."
        );
      }

      if (!data.report) {
        throw new Error(
          "No analysis result received from backend."
        );
      }

      setResult(data.report);
      addHistory("Email", input, data.report);
    } catch (err) {
      console.error("Email Analyzer Error:", err);
      setError(
        err.message || "Unable to analyze email."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setEmail("");
    setResult(null);
    setError("");
  };

  return (
    <PageLayout>
      <div className="email-forensics">

        {/* PAGE HEADER */}
        <header className="email-forensics-header">
          <div>
            <div className="email-forensics-eyebrow">
              <span className="email-forensics-live-dot" />
              MESSAGE FORENSICS / THREAT ANALYSIS
            </div>

            <h1>
              Investigate the <span>message.</span>
            </h1>

            <p>
              Examine suspicious email content, identify common
              phishing techniques and review the security findings.
            </p>
          </div>

          <div className="email-forensics-header-mark">
            <span>02</span>
            <div>
              EMAIL
              <br />
              INTELLIGENCE
            </div>
          </div>
        </header>

        {/* MAIN WORKSPACE */}
        <div className="email-forensics-layout">

          {/* LEFT: EMAIL INVESTIGATION */}
          <main className="email-forensics-main">

            <section className="email-compose-panel">
              <div className="email-compose-top">
                <div>
                  <span className="email-forensics-kicker">
                    INCOMING MESSAGE
                  </span>

                  <h2>Email investigation</h2>

                  <p>
                    Paste the suspicious email below.
                    Include its message text for inspection.
                  </p>
                </div>

                <div className="email-compose-icon">
                  ✉
                </div>
              </div>

              {/* MAIL STYLE HEADER */}
              <div className="email-message-meta">
                <div className="email-meta-row">
                  <span>FROM</span>
                  <strong>Unverified sender</strong>
                  <small>Identity not checked</small>
                </div>

                <div className="email-meta-row">
                  <span>SUBJECT</span>
                  <strong>Message content provided for review</strong>
                </div>

                <div className="email-meta-row">
                  <span>INPUT</span>
                  <strong>Manual email submission</strong>
                </div>
              </div>

              {/* EMAIL EDITOR */}
              <div className="email-editor-heading">
                <label htmlFor="email-content">
                  MESSAGE BODY
                </label>

                <span>
                  {email.length.toLocaleString()} characters
                </span>
              </div>

              <textarea
                id="email-content"
                className="email-forensics-editor"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
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
                  "Paste the complete suspicious email here...\n\nExample:\nDear Customer,\n\nYour account requires immediate verification. Click the link below to avoid suspension...\n\nRegards,\nCustomer Support"
                }
                rows={13}
                disabled={loading}
              />

              <div className="email-editor-bottom">
                <span>
                  <span className="email-editor-status-dot" />
                  READY FOR INSPECTION
                </span>

                <span>CTRL + ENTER TO ANALYZE</span>
              </div>

              {error && (
                <div className="email-forensics-error" role="alert">
                  <span>!</span>
                  {error}
                </div>
              )}

              <div className="email-forensics-actions">
                <button
                  type="button"
                  className="email-forensics-submit"
                  onClick={handleAnalyze}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="email-forensics-spinner" />
                      Inspecting message...
                    </>
                  ) : (
                    <>
                      Analyze message
                      <span>↗</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="email-forensics-reset"
                  onClick={handleClear}
                  disabled={loading}
                >
                  Clear
                </button>
              </div>

              <div className="email-forensics-privacy-note">
                <span>ⓘ</span>
                Submit only email content you are authorised to inspect.
              </div>
            </section>

            {/* EMAIL CLUES */}
            <section className="email-clues-panel">
              <div className="email-clues-heading">
                <div>
                  <span className="email-forensics-kicker">
                    INVESTIGATOR CHECKLIST
                  </span>

                  <h2>What should you examine?</h2>

                  <p>
                    Three important clues to review before trusting
                    an unexpected email.
                  </p>
                </div>

                <span className="email-clues-count">
                  03 CHECKS
                </span>
              </div>

              <div className="email-clues-list">
                {emailClues.map((clue) => (
                  <article
                    className="email-clue-item"
                    key={clue.icon}
                  >
                    <span>{clue.icon}</span>

                    <div>
                      <h3>{clue.title}</h3>
                      <p>{clue.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>

          {/* RIGHT: PHISHING INTELLIGENCE */}
          <aside className="email-forensics-side">
            <div className="email-side-heading">
              <span className="email-forensics-kicker">
                PHISHING INTELLIGENCE
              </span>

              <span className="email-side-symbol">⌁</span>
            </div>

            <h2>How phishing emails fool people.</h2>

            <p className="email-side-intro">
              Fraudulent emails often imitate trusted organisations
              and use emotional pressure to trigger quick decisions.
            </p>

            <div className="email-phishing-patterns">
              {phishingPatterns.map((pattern) => (
                <article
                  className="email-phishing-pattern"
                  key={pattern.number}
                >
                  <span className="email-pattern-number">
                    {pattern.number}
                  </span>

                  <div>
                    <h3>{pattern.title}</h3>

                    <p>{pattern.description}</p>

                    <code>{pattern.example}</code>
                  </div>
                </article>
              ))}
            </div>

            <div className="email-side-warning">
              <span>!</span>

              <div>
                <strong>Think before you respond.</strong>

                <p>
                  Do not reply with passwords, OTPs or banking
                  information. Contact the organisation using
                  its official website or phone number.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* ANALYSIS RESULT */}
        {loading && (
          <section className="email-forensics-result">
            <div className="email-result-heading">
              <span className="email-forensics-kicker">
                ANALYSIS IN PROGRESS
              </span>

              <h2>Examining message indicators</h2>

              <p>
                Please wait while FraudLens processes the submitted content.
              </p>
            </div>

            <Loader />
          </section>
        )}

        {result && !loading && (
          <section className="email-forensics-result">
            <div className="email-result-heading">
              <span className="email-forensics-kicker">
                INVESTIGATION COMPLETE
              </span>

              <h2>Email security assessment</h2>

              <p>
                Review the findings and recommendations returned
                by the FraudLens analysis engine.
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
        <footer className="email-forensics-footer">
          <span>FRAUDLENS / EMAIL FORENSICS</span>

          <span>
            Automated analysis may not identify every phishing attempt.
          </span>
        </footer>
      </div>
    </PageLayout>
  );
}

export default EmailAnalyzer;
