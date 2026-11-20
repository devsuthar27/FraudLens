
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      number: "01",
      icon: "⌕",
      title: "URL Intelligence",
      description:
        "Inspect suspicious website addresses and identify potentially malicious destinations.",
      tag: "WEBSITE SECURITY",
      path: "/url-scanner",
      action: "Open URL Scanner",
    },
    {
      number: "02",
      icon: "✉",
      title: "Email Forensics",
      description:
        "Examine email content for phishing attempts, suspicious requests and deceptive language.",
      tag: "EMAIL SECURITY",
      path: "/email-analyzer",
      action: "Analyze Email",
    },
    {
      number: "03",
      icon: "▣",
      title: "SMS Intelligence",
      description:
        "Inspect suspicious text messages, scam links and social-engineering patterns.",
      tag: "MESSAGE SECURITY",
      path: "/sms-analyzer",
      action: "Analyze SMS",
    },
  ];

  const scrollToFeatures = () => {
    document.getElementById("tools")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="home-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .home-page {
          background: #101113;
          color: #f4f4f5;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .home-page * {
          box-sizing: border-box;
        }

        .home-container {
          width: min(1160px, calc(100% - 64px));
          margin: 0 auto;
        }

        /* HERO */

        .home-hero {
          position: relative;
          min-height: 680px;
          display: flex;
          align-items: center;
          padding: 85px 0 105px;
          background:
            radial-gradient(ellipse at 78% 45%, rgba(249,115,22,.10), transparent 34%),
            linear-gradient(180deg, #141517, #101113);
        }

        .home-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .12;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
        }

        .hero-layout {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.05fr .95fr;
          align-items: center;
          gap: 65px;
        }

        .hero-copy {
          max-width: 570px;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 9px 13px;
          border: 1px solid rgba(249,115,22,.25);
          border-radius: 30px;
          background: rgba(249,115,22,.07);
          color: #fb923c;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          margin-bottom: 28px;
        }

        .hero-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fb923c;
          box-shadow: 0 0 12px rgba(249,115,22,.8);
        }

        .hero-title {
          margin: 0;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(46px, 5.5vw, 72px);
          line-height: 1.04;
          letter-spacing: -3.5px;
          font-weight: 700;
        }

        .hero-title span {
          color: #fb923c;
        }

        .hero-description {
          max-width: 490px;
          margin: 24px 0 0;
          color: #999aa0;
          font-size: 15px;
          line-height: 1.9;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 32px;
        }

        .home-btn {
          border: 0;
          border-radius: 9px;
          padding: 14px 22px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: .2s ease;
        }

        .home-btn-primary {
          color: #17120e;
          background: linear-gradient(110deg, #ea580c, #fb923c);
          box-shadow: 0 10px 28px rgba(249,115,22,.16);
        }

        .home-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 32px rgba(249,115,22,.26);
        }

        .home-btn-secondary {
          color: #e4e4e7;
          background: #202124;
          border: 1px solid #38393d;
        }

        .home-btn-secondary:hover {
          border-color: #fb923c;
          color: #fb923c;
        }

        .hero-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 34px;
          color: #777980;
          font-size: 11px;
        }

        .hero-trust span::before {
          content: "✓";
          color: #fb923c;
          margin-right: 7px;
          font-weight: 800;
        }

        /* HERO INTERFACE */

        .hero-visual {
          position: relative;
          padding: 20px;
          border: 1px solid #37383c;
          border-radius: 19px;
          background: rgba(25,26,29,.92);
          box-shadow: 0 30px 90px rgba(0,0,0,.4);
          transform: rotate(1deg);
        }

        .hero-visual::after {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          right: -60px;
          bottom: -60px;
          background: rgba(249,115,22,.13);
          filter: blur(65px);
          pointer-events: none;
        }

        .visual-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 17px;
          border-bottom: 1px solid #343539;
        }

        .visual-window-dots {
          display: flex;
          gap: 6px;
        }

        .visual-window-dots i {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #55565b;
        }

        .visual-window-dots i:first-child {
          background: #f97316;
        }

        .visual-top-label {
          color: #898a90;
          font-size: 10px;
          letter-spacing: 1.2px;
          font-weight: 700;
        }

        .visual-status {
          color: #86efac;
          font-size: 9px;
          font-weight: 800;
        }

        .visual-heading {
          margin-top: 22px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 20px;
          font-weight: 700;
        }

        .visual-subheading {
          color: #777980;
          font-size: 11px;
          margin-top: 5px;
        }

        .visual-scan-box {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 23px;
          padding: 15px;
          background: #111214;
          border: 1px solid #393a3e;
          border-radius: 10px;
        }

        .visual-search-icon {
          color: #fb923c;
          font-size: 21px;
        }

        .visual-scan-text {
          flex: 1;
          min-width: 0;
        }

        .visual-scan-text strong {
          display: block;
          font-size: 11px;
          color: #e4e4e7;
          overflow-wrap: anywhere;
        }

        .visual-scan-text small {
          display: block;
          margin-top: 5px;
          color: #777980;
          font-size: 9px;
        }

        .visual-scan-label {
          color: #fb923c;
          font-size: 9px;
          font-weight: 800;
          background: rgba(249,115,22,.1);
          padding: 6px 8px;
          border-radius: 5px;
        }

        .visual-result {
          margin-top: 18px;
          padding: 17px;
          border: 1px solid rgba(74,222,128,.22);
          border-radius: 11px;
          background: rgba(22,101,52,.08);
        }

        .visual-result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .visual-result-header strong {
          font-size: 12px;
        }

        .visual-safe-tag {
          color: #86efac;
          background: rgba(34,197,94,.12);
          padding: 6px 9px;
          border-radius: 5px;
          font-size: 9px;
          font-weight: 800;
        }

        .visual-result p {
          color: #92949a;
          font-size: 10px;
          line-height: 1.6;
          margin: 12px 0 0;
        }

        .visual-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
          margin-top: 17px;
        }

        .visual-metric {
          padding: 12px 8px;
          background: #202124;
          border: 1px solid #35363a;
          border-radius: 8px;
        }

        .visual-metric strong {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 17px;
          color: #f4f4f5;
        }

        .visual-metric small {
          color: #777980;
          font-size: 9px;
        }

        .visual-disclaimer {
          color: #777980;
          font-size: 9px;
          line-height: 1.5;
          margin-top: 13px;
        }

        /* SECTION COMMON */

        .home-section {
          padding: 105px 0;
        }

        .section-heading {
          max-width: 650px;
          margin-bottom: 45px;
        }

        .section-eyebrow {
          color: #fb923c;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 15px;
        }

        .section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(32px, 4vw, 46px);
          line-height: 1.15;
          letter-spacing: -1.8px;
          margin: 0;
        }

        .section-description {
          color: #92939a;
          font-size: 14px;
          line-height: 1.8;
          margin-top: 15px;
          max-width: 560px;
        }

        /* FEATURES */

        .home-tools {
          background: #151618;
          border-top: 1px solid #292a2d;
          border-bottom: 1px solid #292a2d;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 17px;
        }

        .tool-card {
          position: relative;
          padding: 27px;
          min-height: 295px;
          display: flex;
          flex-direction: column;
          background: #1c1d20;
          border: 1px solid #35363a;
          border-radius: 13px;
          transition: .25s ease;
        }

        .tool-card:hover {
          transform: translateY(-7px);
          border-color: rgba(249,115,22,.6);
          background: #202124;
        }

        .tool-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .tool-icon {
          display: grid;
          place-items: center;
          width: 47px;
          height: 47px;
          border-radius: 12px;
          background: rgba(249,115,22,.1);
          border: 1px solid rgba(249,115,22,.22);
          color: #fb923c;
          font-size: 24px;
        }

        .tool-number {
          color: #66676d;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 700;
        }

        .tool-tag {
          margin-top: 23px;
          color: #fb923c;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        .tool-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 21px;
          margin: 9px 0 10px;
        }

        .tool-description {
          color: #92939a;
          font-size: 12px;
          line-height: 1.8;
          margin: 0;
          flex: 1;
        }

        .tool-link {
          display: flex;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
          margin-top: 23px;
          border: 0;
          background: transparent;
          color: #fb923c;
          padding: 0;
          font-family: inherit;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .tool-link:hover {
          color: #fdba74;
        }

        /* HOW IT WORKS */

        .workflow-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .workflow-step {
          position: relative;
          padding: 8px 5px 15px;
        }

        .workflow-number {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 44px;
          font-weight: 700;
          color: #fb923c;
          letter-spacing: -2px;
        }

        .workflow-line {
          width: 48px;
          height: 2px;
          background: #f97316;
          margin: 18px 0;
        }

        .workflow-step h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 20px;
          margin: 0 0 10px;
        }

        .workflow-step p {
          color: #92939a;
          font-size: 13px;
          line-height: 1.8;
          margin: 0;
          max-width: 290px;
        }

        /* AWARENESS BAND */

        .awareness-band {
          padding: 32px 0;
          background: #1c1d20;
          border-top: 1px solid #35363a;
          border-bottom: 1px solid #35363a;
        }

        .awareness-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .awareness-copy small {
          display: block;
          color: #fb923c;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 8px;
        }

        .awareness-copy strong {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 19px;
        }

        .awareness-copy p {
          color: #85868c;
          font-size: 12px;
          line-height: 1.6;
          margin: 7px 0 0;
        }

        .awareness-button {
          flex-shrink: 0;
          background: transparent;
          color: #fb923c;
          border: 1px solid rgba(249,115,22,.4);
          padding: 12px 17px;
          border-radius: 8px;
          font-family: inherit;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: .2s;
        }

        .awareness-button:hover {
          background: rgba(249,115,22,.1);
        }

        /* CTA */

        .home-cta-section {
          padding: 95px 0;
        }

        .home-cta {
          position: relative;
          overflow: hidden;
          padding: 60px 35px;
          border: 1px solid rgba(249,115,22,.3);
          border-radius: 17px;
          text-align: center;
          background:
            radial-gradient(ellipse at 50% 110%, rgba(249,115,22,.17), transparent 55%),
            linear-gradient(135deg, #22201e, #191a1c);
        }

        .cta-symbol {
          display: inline-grid;
          place-items: center;
          width: 54px;
          height: 54px;
          border-radius: 15px;
          background: rgba(249,115,22,.12);
          border: 1px solid rgba(249,115,22,.3);
          color: #fb923c;
          font-size: 25px;
          margin-bottom: 20px;
        }

        .home-cta h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(29px, 4vw, 43px);
          letter-spacing: -1.5px;
          margin: 0;
        }

        .home-cta p {
          color: #a0a1a6;
          font-size: 13px;
          line-height: 1.8;
          max-width: 520px;
          margin: 15px auto 25px;
        }

        /* FOOTER */

        .home-footer {
          padding: 30px 0;
          border-top: 1px solid #292a2d;
          background: #121315;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .footer-brand {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 19px;
          font-weight: 700;
        }

        .footer-brand span {
          color: #fb923c;
        }

        .footer-caption {
          color: #68696f;
          font-size: 10px;
          margin-top: 5px;
        }

        .footer-right {
          color: #777980;
          font-size: 10px;
          text-align: right;
          line-height: 1.8;
        }

        @media (max-width: 900px) {
          .hero-layout {
            gap: 35px;
          }

          .hero-title {
            font-size: 54px;
          }

          .tools-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 680px) {
          .home-container {
            width: calc(100% - 40px);
          }

          .home-hero {
            padding: 65px 0 75px;
          }

          .hero-layout {
            grid-template-columns: 1fr;
            gap: 45px;
          }

          .hero-title {
            font-size: clamp(43px, 12vw, 61px);
            letter-spacing: -2.7px;
          }

          .hero-description {
            font-size: 13px;
          }

          .hero-visual {
            transform: none;
          }

          .hero-trust {
            gap: 13px;
          }

          .home-section {
            padding: 75px 0;
          }

          .tools-grid,
          .workflow-grid {
            grid-template-columns: 1fr;
          }

          .tool-card {
            min-height: 265px;
          }

          .workflow-grid {
            gap: 20px;
          }

          .awareness-content {
            align-items: flex-start;
            flex-direction: column;
          }

          .home-cta {
            padding: 45px 22px;
          }

          .footer-content {
            align-items: flex-start;
            flex-direction: column;
          }

          .footer-right {
            text-align: left;
          }
        }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section className="home-hero">
        <div className="home-container hero-layout">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              Digital Security · Threat Intelligence
            </div>

            <h1 className="hero-title">
              Don't trust
              <br />
              blindly.
              <br />
              <span>Verify first.</span>
            </h1>

            <p className="hero-description">
              Suspicious links? Unusual emails? Unexpected messages?
              FraudLens helps you investigate digital content, identify
              potential threats and make more informed security decisions.
            </p>

            <div className="hero-actions">
              <button
                className="home-btn home-btn-primary"
                onClick={() => navigate("/login")}
              >
                Enter FraudLens →
              </button>

              <button
                className="home-btn home-btn-secondary"
                onClick={scrollToFeatures}
              >
                Explore Platform
              </button>
            </div>

            <div className="hero-trust">
              <span>URL Investigation</span>
              <span>Email Forensics</span>
              <span>SMS Analysis</span>
            </div>
          </div>

          {/* VISUAL PRODUCT PREVIEW */}
          <div className="hero-visual">
            <div className="visual-topbar">
              <div className="visual-window-dots">
                <i />
                <i />
                <i />
              </div>

              <div className="visual-top-label">
                FRAUDLENS / INTELLIGENCE
              </div>

              <div className="visual-status">● SYSTEM UI</div>
            </div>

            <div className="visual-heading">
              Investigation Workspace
            </div>

            <div className="visual-subheading">
              Your digital threat analysis interface
            </div>

            <div className="visual-scan-box">
              <div className="visual-search-icon">⌕</div>

              <div className="visual-scan-text">
                <strong>https://example-website.com</strong>
                <small>Website investigation preview</small>
              </div>

              <div className="visual-scan-label">URL</div>
            </div>

            <div className="visual-result">
              <div className="visual-result-header">
                <strong>Analysis report preview</strong>
                <div className="visual-safe-tag">DEMO UI</div>
              </div>

              <p>
                A sample representation of how an investigation report
                can be presented inside FraudLens.
              </p>

              <div className="visual-metrics">
                <div className="visual-metric">
                  <strong>URL</strong>
                  <small>Analysis</small>
                </div>

                <div className="visual-metric">
                  <strong>EMAIL</strong>
                  <small>Forensics</small>
                </div>

                <div className="visual-metric">
                  <strong>SMS</strong>
                  <small>Detection</small>
                </div>
              </div>
            </div>

            <div className="visual-disclaimer">
              Illustrative interface preview — not a live scan or real
              security result.
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="home-section home-tools" id="tools">
        <div className="home-container">
          <div className="section-heading">
            <div className="section-eyebrow">
              Investigation Modules / 01
            </div>

            <h2 className="section-title">
              Three ways to
              <br />
              investigate digital threats.
            </h2>

            <p className="section-description">
              A centralized workspace for examining suspicious websites,
              emails and text messages through dedicated analysis tools.
            </p>
          </div>

          <div className="tools-grid">
            {features.map((feature) => (
              <article className="tool-card" key={feature.path}>
                <div className="tool-card-top">
                  <div className="tool-icon">{feature.icon}</div>
                  <div className="tool-number">{feature.number}</div>
                </div>

                <div className="tool-tag">{feature.tag}</div>

                <h3 className="tool-title">{feature.title}</h3>

                <p className="tool-description">
                  {feature.description}
                </p>

                <button
                  className="tool-link"
                  onClick={() => navigate(feature.path)}
                >
                  {feature.action} <span>→</span>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="home-section">
        <div className="home-container">
          <div className="section-heading">
            <div className="section-eyebrow">
              The Process / 02
            </div>

            <h2 className="section-title">
              Simple investigation.
              <br />
              Clearer decisions.
            </h2>

            <p className="section-description">
              FraudLens brings the investigation process into three
              straightforward stages.
            </p>
          </div>

          <div className="workflow-grid">
            <div className="workflow-step">
              <div className="workflow-number">01</div>
              <div className="workflow-line" />
              <h3>Submit</h3>
              <p>
                Enter a website URL, paste email content or provide
                a suspicious SMS message.
              </p>
            </div>

            <div className="workflow-step">
              <div className="workflow-number">02</div>
              <div className="workflow-line" />
              <h3>Analyze</h3>
              <p>
                Let the relevant analysis module examine the submitted
                content for potential warning signs.
              </p>
            </div>

            <div className="workflow-step">
              <div className="workflow-number">03</div>
              <div className="workflow-line" />
              <h3>Understand</h3>
              <p>
                Review the generated findings, risk assessment and
                recommended precautions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AWARENESS */}
      <section className="awareness-band">
        <div className="home-container awareness-content">
          <div className="awareness-copy">
            <small>KNOWLEDGE IS YOUR FIRST DEFENCE</small>
            <strong>Recognize the tricks behind digital fraud.</strong>
            <p>
              Explore common scam techniques and learn practical ways
              to protect yourself.
            </p>
          </div>

          <button
            className="awareness-button"
            onClick={() => navigate("/login")}
          >
            Explore Fraud Awareness →
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta-section">
        <div className="home-container">
          <div className="home-cta">
            <div className="cta-symbol">⌑</div>

            <h2>Think before you trust.</h2>

            <p>
              Take a closer look at suspicious digital content.
              Start your investigation with FraudLens.
            </p>

            <button
              className="home-btn home-btn-primary"
              onClick={() => navigate("/login")}
            >
              Get Started with FraudLens →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="home-container footer-content">
          <div>
            <div className="footer-brand">
              Fraud<span>Lens</span>
            </div>

            <div className="footer-caption">
              Digital Threat Investigation Platform
            </div>
          </div>

          <div className="footer-right">
            Think before you trust. Verify before you click.
            <br />
            © 2026 FraudLens · Final Year Capstone Project
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
