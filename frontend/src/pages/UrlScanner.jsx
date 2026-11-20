
import { useState } from "react";
import PageLayout from "../components/PageLayout";
import Loader from "../components/Loader";
import ResultCard from "../components/ResultCard";
import { addHistory } from "../utils/historyStorage";
import { apiFetch } from "../utils/api";

const warningSigns = [
  {
    number: "01",
    title: "Misspelled domains",
    description:
      "Look for extra letters, swapped characters or names that imitate trusted brands.",
    example: "paypaI.com instead of paypal.com",
  },
  {
    number: "02",
    title: "Unusual subdomains",
    description:
      "A trusted brand name appearing before an unrelated main domain can be deceptive.",
    example: "bank.example-site.com",
  },
  {
    number: "03",
    title: "Unexpected URL shorteners",
    description:
      "Shortened links can hide the destination. Verify the destination before opening.",
    example: "Unknown shortened links",
  },
  {
    number: "04",
    title: "Urgent login requests",
    description:
      "Messages asking you to immediately log in, verify or unlock an account deserve scrutiny.",
    example: "Your account will be blocked today",
  },
];

function UrlScanner() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    const input = url.trim();

    if (!input) {
      setError("Please enter a website URL to inspect.");
      setResult(null);
      return;
    }

    let normalizedUrl;

    try {
      const value = /^https?:\/\//i.test(input)
        ? input
        : `https://${input}`;

      const parsedUrl = new URL(value);

      if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
      ) {
        throw new Error("Invalid protocol");
      }

      if (
        !parsedUrl.hostname.includes(".") ||
        parsedUrl.hostname.length < 4
      ) {
        throw new Error("Invalid domain");
      }

      normalizedUrl = parsedUrl.href;
    } catch {
      setError("Please enter a valid website URL.");
      setResult(null);
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await apiFetch(
        "http://localhost:5000/api/analyze-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: normalizedUrl,
          }),
        }
      );

      if (!response) {
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "URL analysis failed."
        );
      }

      if (!data.report) {
        throw new Error(
          "No analysis result received from backend."
        );
      }

      setResult(data.report);

      addHistory(
        "URL",
        normalizedUrl,
        data.report
      );
    } catch (err) {
      console.error("URL Scanner Error:", err);

      setError(
        err.message || "Unable to analyze this URL."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUrl("");
    setResult(null);
    setError("");
  };

  return (
    <PageLayout>
      <div className="url-lab">

        {/* PAGE HEADER */}
        <header className="url-lab-header">
          <div className="url-lab-heading">
            <div className="url-lab-eyebrow">
              <span className="url-lab-eyebrow-dot" />
              THREAT INTELLIGENCE / WEB ANALYSIS
            </div>

            <h1>
              Investigate a <span>website.</span>
            </h1>

            <p>
              Inspect suspicious links before you trust them.
              Understand common URL-based threats and review
              the security report returned by the scanner.
            </p>
          </div>

          <div className="url-lab-header-mark">
            <span>01</span>
            <div>
              URL
              <br />
              INTELLIGENCE
            </div>
          </div>
        </header>

        {/* MAIN WORKSPACE */}
        <div className="url-lab-workspace">

          {/* LEFT COLUMN */}
          <div className="url-lab-left-stack">

            {/* URL INVESTIGATION PANEL */}
            <section className="url-lab-main">
              <div className="url-lab-section-top">
                <div>
                  <span className="url-lab-kicker">
                    INVESTIGATION PANEL
                  </span>

                  <h2>Website inspection</h2>

                  <p>
                    Enter the complete URL you want to investigate.
                  </p>
                </div>

                <div className="url-lab-icon">↗</div>
              </div>

              <label
                className="url-lab-label"
                htmlFor="url-target"
              >
                TARGET WEBSITE
              </label>

              <div className="url-lab-input-wrap">
                <span className="url-lab-input-prefix">
                  https://
                </span>

                <input
                  id="url-target"
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);

                    if (error) {
                      setError("");
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) {
                      handleAnalyze();
                    }
                  }}
                  placeholder="example.com or paste a full URL"
                  disabled={loading}
                  autoComplete="url"
                />

                {url && (
                  <button
                    type="button"
                    className="url-lab-input-clear"
                    onClick={handleClear}
                    disabled={loading}
                    aria-label="Clear URL"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="url-lab-input-meta">
                <span>{url.length} characters</span>
                <span>Press Enter to inspect</span>
              </div>

              {error && (
                <div
                  className="url-lab-error"
                  role="alert"
                >
                  <span>!</span>
                  {error}
                </div>
              )}

              <div className="url-lab-actions">
                <button
                  type="button"
                  className="url-lab-submit"
                  onClick={handleAnalyze}
                  disabled={loading}
                >
                  {loading
                    ? "Inspecting website..."
                    : "Start investigation"}

                  <span>↗</span>
                </button>

                <button
                  type="button"
                  className="url-lab-clear"
                  onClick={handleClear}
                  disabled={loading}
                >
                  Reset
                </button>
              </div>

              <div className="url-lab-note">
                <span>ⓘ</span>
                Only HTTP and HTTPS website URLs are supported.
              </div>

              {/* LOADING */}
              {loading && (
                <div className="url-lab-result">
                  <Loader />
                </div>
              )}

              {/* SCAN RESULT */}
              {result && !loading && (
                <div className="url-lab-result">
                  <div className="url-lab-result-heading">
                    <span className="url-lab-kicker">
                      INVESTIGATION OUTPUT
                    </span>

                    <h2>Scan report</h2>
                  </div>

                  <ResultCard
                    score={result.score}
                    status={result.status}
                    reason={result.reason}
                    recommendation={result.recommendation}
                    details={result.details || {}}
                  />
                </div>
              )}
            </section>

            {/* URL ANATOMY LAB */}
            <section className="url-lab-anatomy">
              <div className="url-lab-anatomy-header">
                <div>
                  <span className="url-lab-kicker">
                    LEARN THE STRUCTURE
                  </span>

                  <h2>Inside a website URL</h2>

                  <p>
                    Understand the different parts of a web address
                    and learn where deceptive links can hide.
                  </p>
                </div>

                <div className="url-lab-anatomy-icon">
                  ⌘
                </div>
              </div>

              {/* URL EXAMPLE */}
              <div className="url-lab-url-example">
                <span className="url-part-protocol">
                  https://
                </span>

                <span className="url-part-subdomain">
                  secure.
                </span>

                <span className="url-part-domain">
                  example-login
                </span>

                <span className="url-part-tld">
                  .com
                </span>

                <span className="url-part-path">
                  /verify
                </span>
              </div>

              {/* URL COMPONENTS */}
              <div className="url-lab-url-labels">
                <div>
                  <span className="url-label-dot protocol-dot" />
                  <strong>Protocol</strong>
                  <p>Connection method</p>
                </div>

                <div>
                  <span className="url-label-dot subdomain-dot" />
                  <strong>Subdomain</strong>
                  <p>Additional host name</p>
                </div>

                <div>
                  <span className="url-label-dot domain-dot" />
                  <strong>Domain</strong>
                  <p>Registered website name</p>
                </div>

                <div>
                  <span className="url-label-dot tld-dot" />
                  <strong>Extension</strong>
                  <p>.com, .org, .in</p>
                </div>

                <div>
                  <span className="url-label-dot path-dot" />
                  <strong>Path</strong>
                  <p>Specific page location</p>
                </div>
              </div>

              {/* RED FLAGS */}
              <div className="url-lab-red-flags">
                <div className="url-lab-red-flags-title">
                  <span>!</span>
                  <strong>
                    Things that deserve a second look
                  </strong>
                </div>

                <div className="url-lab-red-flag">
                  <code>paypaI.com</code>
                  <p>
                    Look-alike characters replacing real letters.
                  </p>
                </div>

                <div className="url-lab-red-flag">
                  <code>bank.example-login.com</code>
                  <p>
                    The actual registered domain may not be
                    the brand shown first.
                  </p>
                </div>

                <div className="url-lab-red-flag">
                  <code>
                    example.com.untrusted-site.net
                  </code>
                  <p>
                    A trusted name appearing inside a longer
                    deceptive hostname.
                  </p>
                </div>
              </div>

              {/* ANATOMY FOOTER */}
              <div className="url-lab-anatomy-footer">
                <span>01 / URL EDUCATION</span>

                <span>
                  HTTPS alone does not prove a website is trustworthy.
                </span>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN - THREAT KNOWLEDGE */}
          <aside className="url-lab-side">
            <div className="url-lab-side-heading">
              <span className="url-lab-kicker">
                THREAT KNOWLEDGE
              </span>

              <span className="url-lab-side-symbol">
                ⌁
              </span>
            </div>

            <h2>Know what to look for.</h2>

            <p className="url-lab-side-intro">
              Fraudulent websites often use small tricks to
              make a dangerous link look familiar.
            </p>

            <div className="url-lab-warning-list">
              {warningSigns.map((item) => (
                <article
                  className="url-lab-warning"
                  key={item.number}
                >
                  <div className="url-lab-warning-number">
                    {item.number}
                  </div>

                  <div>
                    <h3>{item.title}</h3>

                    <p>{item.description}</p>

                    <code>{item.example}</code>
                  </div>
                </article>
              ))}
            </div>

            <div className="url-lab-safety">
              <span className="url-lab-safety-icon">
                !
              </span>

              <div>
                <strong>Pause before you click</strong>

                <p>
                  Never enter passwords, OTPs or payment details
                  on a website reached through an unexpected message.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* INVESTIGATION PROCESS */}
        <section className="url-lab-bottom">
          <div>
            <span className="url-lab-kicker">
              THE INVESTIGATION PROCESS
            </span>

            <h2>
              From suspicious link to informed decision.
            </h2>
          </div>

          <div className="url-lab-process">
            <article>
              <span>01</span>

              <div>
                <h3>Submit a URL</h3>
                <p>
                  Provide the website address you want to inspect.
                </p>
              </div>
            </article>

            <article>
              <span>02</span>

              <div>
                <h3>Request analysis</h3>
                <p>
                  FraudLens sends the URL to its connected
                  analysis service.
                </p>
              </div>
            </article>

            <article>
              <span>03</span>

              <div>
                <h3>Review the report</h3>
                <p>
                  Read the returned threat assessment
                  and recommendations.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="url-lab-footer">
          <span>FRAUDLENS / URL INTELLIGENCE</span>

          <span>
            Security analysis is an aid, not a guarantee of safety.
          </span>
        </footer>
      </div>
    </PageLayout>
  );
}

export default UrlScanner;
