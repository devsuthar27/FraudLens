import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🌐",
      title: "URL Scanner",
      description:
        "Analyze website URLs using security intelligence and detect potentially malicious destinations.",
      button: "Scan URL",
      path: "/url-scanner",
    },
    {
      icon: "📧",
      title: "Email Analyzer",
      description:
        "Identify phishing patterns, suspicious requests and potentially dangerous email content.",
      button: "Analyze Email",
      path: "/email-analyzer",
    },
    {
      icon: "📱",
      title: "SMS Analyzer",
      description:
        "Detect scam messages, suspicious links and social-engineering patterns in SMS content.",
      button: "Analyze SMS",
      path: "/sms-analyzer",
    },
  ];

  const scrollToFeatures = () => {
    document
      .getElementById("features")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          background:
            "radial-gradient(circle at 50% -20%, #172554 0%, #0F172A 42%, #020617 100%)",
          minHeight: "calc(100vh - 72px)",
          color: "white",
          fontFamily:
            "Inter, Arial, Helvetica, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* ==================================================
            HERO
        ================================================== */}

        <section
          style={{
            position: "relative",
            minHeight: "650px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "70px 25px 90px",
            boxSizing: "border-box",
          }}
        >
          {/* Background glow */}

          <div
            style={{
              position: "absolute",
              width: "420px",
              height: "420px",
              borderRadius: "50%",
              background:
                "rgba(37, 99, 235, 0.16)",
              filter: "blur(100px)",
              top: "70px",
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "900px",
              width: "100%",
              textAlign: "center",
            }}
          >
            {/* Security badge */}

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 15px",
                borderRadius: "999px",
                background:
                  "rgba(37, 99, 235, 0.10)",
                border:
                  "1px solid rgba(96, 165, 250, 0.25)",
                color: "#93C5FD",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "25px",
              }}
            >
              <span>🛡️</span>
              Intelligent Cyber Fraud Detection
            </div>

            {/* Shield */}

            <div
              style={{
                width: "92px",
                height: "92px",
                margin: "0 auto 25px",
                borderRadius: "26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "50px",
                background:
                  "linear-gradient(145deg, #1D4ED8, #2563EB)",
                border:
                  "1px solid rgba(147,197,253,0.35)",
                boxShadow:
                  "0 20px 60px rgba(37,99,235,0.35)",
              }}
            >
              🛡️
            </div>

            {/* Brand */}

            <h1
              style={{
                margin: 0,
                fontSize:
                  "clamp(48px, 8vw, 78px)",
                lineHeight: "1",
                fontWeight: "800",
                letterSpacing: "-3px",
              }}
            >
              Fraud
              <span
                style={{
                  color: "#60A5FA",
                }}
              >
                Lens
              </span>
            </h1>

            <h2
              style={{
                margin:
                  "25px 0 18px",
                fontSize:
                  "clamp(24px, 4vw, 36px)",
                lineHeight: "1.2",
                fontWeight: "700",
              }}
            >
              Stay One Step Ahead of
              <span
                style={{
                  color: "#60A5FA",
                }}
              >
                {" "}
                Cyber Fraud
              </span>
            </h2>

            <p
              style={{
                maxWidth: "720px",
                margin: "0 auto",
                color: "#94A3B8",
                fontSize: "17px",
                lineHeight: "1.8",
              }}
            >
              FraudLens analyzes suspicious URLs,
              phishing emails and scam SMS messages
              to identify potential cyber threats and
              provide actionable security guidance.
            </p>

            {/* Buttons */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "14px",
                flexWrap: "wrap",
                marginTop: "35px",
              }}
            >
              <button
                onClick={() =>
                  navigate("/login")
                }
                style={{
                  padding:
                    "14px 28px",
                  background:
                    "linear-gradient(135deg, #2563EB, #3B82F6)",
                  color: "white",
                  border: "none",
                  borderRadius: "11px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow:
                    "0 12px 30px rgba(37,99,235,0.3)",
                }}
              >
                Get Started →
              </button>

              <button
                onClick={scrollToFeatures}
                style={{
                  padding:
                    "14px 28px",
                  background:
                    "rgba(30,41,59,0.8)",
                  color: "#E2E8F0",
                  border:
                    "1px solid #334155",
                  borderRadius: "11px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Explore Features
              </button>
            </div>

            {/* Trust indicators */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "28px",
                flexWrap: "wrap",
                marginTop: "45px",
                color: "#64748B",
                fontSize: "13px",
              }}
            >
              <span>✓ URL Analysis</span>
              <span>✓ Email Analysis</span>
              <span>✓ SMS Analysis</span>
              <span>✓ Secure History</span>
            </div>
          </div>
        </section>

        {/* ==================================================
            FEATURES
        ================================================== */}

        <section
          id="features"
          style={{
            padding:
              "90px 25px 100px",
            background:
              "rgba(15,23,42,0.65)",
            borderTop:
              "1px solid rgba(51,65,85,0.45)",
            borderBottom:
              "1px solid rgba(51,65,85,0.45)",
          }}
        >
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "50px",
              }}
            >
              <div
                style={{
                  color: "#60A5FA",
                  fontSize: "13px",
                  fontWeight: "700",
                  textTransform:
                    "uppercase",
                  letterSpacing: "2px",
                  marginBottom: "12px",
                }}
              >
                Security Tools
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize:
                    "clamp(30px, 5vw, 42px)",
                  fontWeight: "800",
                }}
              >
                One Platform.
                <br />
                Multiple Threat Vectors.
              </h2>

              <p
                style={{
                  maxWidth: "650px",
                  margin:
                    "18px auto 0",
                  color: "#94A3B8",
                  lineHeight: "1.7",
                }}
              >
                Analyze the most common forms of
                digital fraud from one centralized
                security platform.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(270px, 1fr))",
                gap: "22px",
              }}
            >
              {features.map(
                (feature) => (
                  <div
                    key={feature.path}
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95))",
                      border:
                        "1px solid #334155",
                      borderRadius: "18px",
                      padding: "30px",
                      transition:
                        "transform 0.25s ease, border-color 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-6px)";
                      e.currentTarget.style.borderColor =
                        "#3B82F6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(0)";
                      e.currentTarget.style.borderColor =
                        "#334155";
                    }}
                  >
                    <div
                      style={{
                        width: "58px",
                        height: "58px",
                        borderRadius: "15px",
                        background:
                          "rgba(37,99,235,0.12)",
                        border:
                          "1px solid rgba(59,130,246,0.2)",
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        fontSize: "29px",
                        marginBottom:
                          "22px",
                      }}
                    >
                      {feature.icon}
                    </div>

                    <h3
                      style={{
                        fontSize: "21px",
                        margin:
                          "0 0 12px",
                      }}
                    >
                      {feature.title}
                    </h3>

                    <p
                      style={{
                        color: "#94A3B8",
                        lineHeight: "1.7",
                        minHeight: "82px",
                        margin:
                          "0 0 22px",
                      }}
                    >
                      {feature.description}
                    </p>

                    <button
                      onClick={() =>
                        navigate(
                          feature.path
                        )
                      }
                      style={{
                        padding:
                          "10px 18px",
                        background:
                          "#1E40AF",
                        color: "white",
                        border: "none",
                        borderRadius:
                          "8px",
                        cursor:
                          "pointer",
                        fontWeight:
                          "600",
                      }}
                    >
                      {feature.button} →
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ==================================================
            HOW IT WORKS
        ================================================== */}

        <section
          style={{
            padding:
              "90px 25px",
          }}
        >
          <div
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "50px",
              }}
            >
              <div
                style={{
                  color: "#60A5FA",
                  fontSize: "13px",
                  fontWeight: "700",
                  textTransform:
                    "uppercase",
                  letterSpacing: "2px",
                  marginBottom: "12px",
                }}
              >
                Simple Workflow
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize:
                    "clamp(30px, 5vw, 40px)",
                }}
              >
                How FraudLens Works
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "25px",
              }}
            >
              {[
                [
                  "01",
                  "Submit",
                  "Enter a URL, email or SMS message.",
                ],
                [
                  "02",
                  "Analyze",
                  "FraudLens examines the content for suspicious indicators.",
                ],
                [
                  "03",
                  "Protect",
                  "Receive a risk assessment and security recommendation.",
                ],
              ].map(
                ([number, title, text]) => (
                  <div
                    key={number}
                    style={{
                      position:
                        "relative",
                      padding: "28px",
                      background:
                        "#0F172A",
                      border:
                        "1px solid #334155",
                      borderRadius:
                        "16px",
                    }}
                  >
                    <div
                      style={{
                        color:
                          "#3B82F6",
                        fontSize:
                          "14px",
                        fontWeight:
                          "800",
                        marginBottom:
                          "18px",
                      }}
                    >
                      {number}
                    </div>

                    <h3
                      style={{
                        margin:
                          "0 0 10px",
                        fontSize:
                          "20px",
                      }}
                    >
                      {title}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        color:
                          "#94A3B8",
                        lineHeight:
                          "1.7",
                      }}
                    >
                      {text}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ==================================================
            CTA
        ================================================== */}

        <section
          style={{
            padding:
              "20px 25px 90px",
          }}
        >
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              padding: "55px 30px",
              textAlign: "center",
              borderRadius: "22px",
              background:
                "linear-gradient(135deg, #172554, #1E3A8A)",
              border:
                "1px solid rgba(96,165,250,0.25)",
              boxShadow:
                "0 25px 70px rgba(15,23,42,0.5)",
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

            <h2
              style={{
                margin:
                  "0 0 12px",
                fontSize:
                  "clamp(28px, 5vw, 40px)",
              }}
            >
              Ready to analyze a threat?
            </h2>

            <p
              style={{
                color: "#BFDBFE",
                maxWidth: "600px",
                margin:
                  "0 auto 25px",
                lineHeight: "1.7",
              }}
            >
              Start using FraudLens to inspect
              suspicious digital content.
            </p>

            <button
              onClick={() =>
                navigate("/login")
              }
              style={{
                padding:
                  "14px 28px",
                background: "white",
                color: "#1D4ED8",
                border: "none",
                borderRadius:
                  "10px",
                fontSize: "16px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              Launch FraudLens →
            </button>
          </div>
        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer
          style={{
            borderTop:
              "1px solid #1E293B",
            padding:
              "28px 20px",
            textAlign: "center",
            color: "#64748B",
            fontSize: "13px",
          }}
        >
          <div
            style={{
              color: "#CBD5E1",
              fontWeight: "700",
              fontSize: "15px",
              marginBottom: "7px",
            }}
          >
            🛡️ FraudLens
          </div>

          AI-Powered Cyber Fraud Detection

          <div
            style={{
              marginTop: "8px",
              color: "#475569",
            }}
          >
            Final Year Capstone Project
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;