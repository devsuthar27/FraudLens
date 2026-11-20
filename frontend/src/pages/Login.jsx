
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (isRegister && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegister
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const body = isRegister
        ? { name, email, password }
        : { email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      localStorage.setItem("fraudlens_token", data.token);
      localStorage.setItem("fraudlens_user", JSON.stringify(data.user));

      setMessage(
        isRegister
          ? "Account created successfully!"
          : "Login successful!"
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      console.error("Authentication Error:", err);
      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setMessage("");
  };

  return (
    <div className="auth-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        .auth-page {
          min-height: 100vh;
          background: #101113;
          color: #f4f4f5;
          font-family: 'DM Sans', sans-serif;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          overflow: hidden;
        }

        .auth-brand {
          position: relative;
          min-height: 100vh;
          padding: 42px 7%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 15% 80%, rgba(249,115,22,.12), transparent 45%),
            linear-gradient(145deg, #191a1d, #111214 65%, #171719);
          border-right: 1px solid #292a2d;
        }

        .auth-brand::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .16;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
        }

        .brand-top, .brand-content, .brand-bottom {
          position: relative;
          z-index: 1;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 23px;
          font-weight: 700;
          letter-spacing: -1px;
        }

        .brand-logo-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          color: #ff9b52;
          background: rgba(249,115,22,.12);
          border: 1px solid rgba(249,115,22,.3);
          font-size: 22px;
        }

        .brand-logo span {
          color: #fb923c;
        }

        .brand-status {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #343538;
          background: rgba(255,255,255,.035);
          color: #b7b7bc;
          padding: 9px 13px;
          border-radius: 30px;
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-weight: 700;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 10px rgba(74,222,128,.7);
        }

        .brand-content {
          max-width: 590px;
          margin: 55px 0;
        }

        .brand-eyebrow {
          color: #fb923c;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-bottom: 23px;
        }

        .brand-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(42px, 5.2vw, 69px);
          line-height: 1.07;
          letter-spacing: -3.5px;
          font-weight: 700;
          margin: 0;
        }

        .brand-heading span {
          color: #fb923c;
        }

        .brand-description {
          color: #96979c;
          font-size: 15px;
          line-height: 1.9;
          max-width: 440px;
          margin-top: 24px;
        }

        .brand-visual {
          margin-top: 45px;
          padding: 19px;
          max-width: 440px;
          border: 1px solid #343538;
          border-radius: 17px;
          background: rgba(255,255,255,.035);
          backdrop-filter: blur(12px);
        }

        .visual-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 17px;
          color: #c4c4c8;
          font-size: 12px;
        }

        .visual-label {
          color: #777980;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .visual-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-top: 1px solid #303135;
        }

        .visual-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #252629;
          font-size: 15px;
        }

        .visual-info {
          flex: 1;
          min-width: 0;
        }

        .visual-info strong {
          display: block;
          font-size: 12px;
          font-weight: 600;
        }

        .visual-info small {
          color: #777980;
          font-size: 10px;
        }

        .visual-tag {
          color: #86efac;
          font-size: 10px;
          font-weight: 700;
          background: rgba(34,197,94,.1);
          padding: 6px 8px;
          border-radius: 6px;
        }

        .brand-bottom {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          color: #66676c;
          font-size: 11px;
        }

        .auth-panel {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 45px 9%;
          background: #141517;
        }

        .auth-panel {
          position: relative;
        }

        .auth-home-button {
          position: absolute;
          top: 28px;
          left: 9%;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 10px 14px;
          border: 1px solid #38393d;
          border-radius: 9px;
          background: #1b1c1f;
          color: #c5c6ca;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: border-color .2s, color .2s, background .2s;
        }

        .auth-home-button:hover {
          color: #fb923c;
          border-color: rgba(251, 146, 60, .45);
          background: rgba(251, 146, 60, .06);
        }

        .auth-home-arrow {
          color: #fb923c;
          font-size: 16px;
          line-height: 1;
        }

        .auth-form-wrap {
          width: 100%;
          max-width: 430px;
        }

        .mobile-brand {
          display: none;
        }

        .form-kicker {
          color: #fb923c;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .form-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 34px;
          font-weight: 700;
          letter-spacing: -1.4px;
          margin: 0;
        }

        .form-subtitle {
          color: #85868c;
          font-size: 13px;
          line-height: 1.7;
          margin: 10px 0 30px;
        }

        .auth-mode {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5px;
          padding: 5px;
          background: #1d1e21;
          border: 1px solid #303135;
          border-radius: 11px;
          margin-bottom: 27px;
        }

        .auth-mode button {
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #85868c;
          padding: 11px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          transition: .2s;
        }

        .auth-mode button.active {
          color: #ffad70;
          background: #302319;
          box-shadow: inset 0 0 0 1px rgba(249,115,22,.2);
        }

        .auth-field {
          margin-bottom: 19px;
        }

        .auth-field label {
          display: block;
          color: #d2d2d5;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 9px;
        }

        .auth-input-wrap {
          position: relative;
        }

        .auth-input {
          width: 100%;
          height: 49px;
          padding: 0 15px;
          border: 1px solid #38393d;
          border-radius: 9px;
          outline: none;
          background: #1b1c1f;
          color: #f4f4f5;
          font-family: inherit;
          font-size: 13px;
          transition: .2s;
        }

        .auth-input::placeholder {
          color: #62636a;
        }

        .auth-input:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249,115,22,.1);
        }

        .password-input {
          padding-right: 75px;
        }

        .password-toggle {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          border: 0;
          background: transparent;
          color: #fb923c;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .auth-message {
          padding: 12px 14px;
          border-radius: 9px;
          font-size: 12px;
          line-height: 1.5;
          margin-bottom: 17px;
        }

        .auth-error {
          color: #fca5a5;
          background: rgba(127,29,29,.2);
          border: 1px solid rgba(239,68,68,.3);
        }

        .auth-success {
          color: #86efac;
          background: rgba(20,83,45,.2);
          border: 1px solid rgba(34,197,94,.3);
        }

        .auth-submit {
          width: 100%;
          height: 51px;
          margin-top: 5px;
          border: 0;
          border-radius: 9px;
          background: linear-gradient(110deg, #ea580c, #f97316);
          color: #17120e;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 9px 25px rgba(249,115,22,.13);
          transition: .2s;
        }

        .auth-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(249,115,22,.24);
        }

        .auth-submit:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .auth-security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
          color: #777980;
          font-size: 11px;
        }

        .auth-security-note span {
          color: #86efac;
        }

        .auth-footer {
          margin-top: 55px;
          text-align: center;
          color: #55565c;
          font-size: 10px;
          letter-spacing: .5px;
        }

        @media (max-width: 900px) {
          .auth-page {
            grid-template-columns: .9fr 1.1fr;
          }

          .auth-brand {
            padding: 32px 7%;
          }

          .brand-heading {
            font-size: 48px;
          }

          .auth-panel {
            padding: 35px 7%;
          }
        }

        @media (max-width: 680px) {
          .auth-page {
            display: block;
          }

          .auth-brand {
            display: none;
          }

          .auth-panel {
            min-height: 100vh;
            padding: 82px 22px 35px;
          }

          .auth-home-button {
            top: 22px;
            left: 22px;
          }

          .mobile-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 55px;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 21px;
            font-weight: 700;
          }

          .mobile-brand span {
            color: #fb923c;
          }

          .mobile-brand-icon {
            width: 39px;
            height: 39px;
            display: grid;
            place-items: center;
            border-radius: 12px;
            color: #fb923c;
            background: rgba(249,115,22,.12);
            border: 1px solid rgba(249,115,22,.3);
          }

          .form-heading {
            font-size: 30px;
          }

          .auth-footer {
            margin-top: 40px;
          }
        }
      `}</style>

      {/* LEFT BRAND PANEL */}
      <section className="auth-brand">
        <div className="brand-top">
          <div className="brand-logo">
            <div className="brand-logo-icon">⌑</div>
            <div>Fraud<span>Lens</span></div>
          </div>
        </div>

        <div className="brand-content">
          <div className="brand-eyebrow">
            Digital Trust · Threat Intelligence
          </div>

          <h1 className="brand-heading">
            Stay one step
            <br />
            ahead of
            <br />
            <span>digital threats.</span>
          </h1>

          <p className="brand-description">
            Your personal security workspace for identifying suspicious
            websites, analysing messages and understanding digital threats
            before they become a problem.
          </p>

          <div className="brand-visual">
            <div className="visual-header">
              <span>Security workspace</span>
              <span className="visual-label">Live interface</span>
            </div>

            <div className="visual-row">
              <div className="visual-icon">⌕</div>
              <div className="visual-info">
                <strong>Website Intelligence</strong>
                <small>URL threat analysis</small>
              </div>
              <div className="visual-tag">READY</div>
            </div>

            <div className="visual-row">
              <div className="visual-icon">✉</div>
              <div className="visual-info">
                <strong>Message Forensics</strong>
                <small>Email and SMS analysis</small>
              </div>
              <div className="visual-tag">READY</div>
            </div>

            <div className="visual-row">
              <div className="visual-icon">◷</div>
              <div className="visual-info">
                <strong>Investigation History</strong>
                <small>Your previous scan records</small>
              </div>
              <div className="visual-tag">READY</div>
            </div>
          </div>
        </div>

        <div className="brand-bottom">
          <span>© 2026 FraudLens</span>
          <span>Think before you trust.</span>
        </div>
      </section>

      {/* RIGHT AUTHENTICATION PANEL */}
      <main className="auth-panel">
        <button
          type="button"
          className="auth-home-button"
          onClick={() => navigate("/")}
          aria-label="Back to Home"
        >
          <span className="auth-home-arrow">←</span>
          <span>Back to Home</span>
        </button>

        <div className="auth-form-wrap">
          <div className="mobile-brand">
            <div className="mobile-brand-icon">⌑</div>
            <div>Fraud<span>Lens</span></div>
          </div>

          <div className="form-kicker">
            {isRegister ? "Create your account" : "Secure access"}
          </div>

          <h2 className="form-heading">
            {isRegister ? "Join FraudLens." : "Welcome back."}
          </h2>

          <p className="form-subtitle">
            {isRegister
              ? "Set up your account and take control of your digital security."
              : "Sign in to your security workspace and continue your investigations."}
          </p>

          <div className="auth-mode">
            <button
              type="button"
              className={!isRegister ? "active" : ""}
              onClick={() => {
                setIsRegister(false);
                setError("");
                setMessage("");
              }}
            >
              Sign In
            </button>

            <button
              type="button"
              className={isRegister ? "active" : ""}
              onClick={() => {
                setIsRegister(true);
                setError("");
                setMessage("");
              }}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="auth-field">
                <label>Full Name</label>
                <input
                  className="auth-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>
            )}

            <div className="auth-field">
              <label>Email Address</label>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label>Password</label>

              <div className="auth-input-wrap">
                <input
                  className="auth-input password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-message auth-error">
                ⚠ {error}
              </div>
            )}

            {message && (
              <div className="auth-message auth-success">
                ✓ {message}
              </div>
            )}

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isRegister
                ? "Create Secure Account →"
                : "Sign In to FraudLens →"}
            </button>
          </form>

          <div className="auth-security-note">
            <span>●</span>
            Secure authentication · Protected workspace
          </div>

          <div className="auth-footer">
            FRAUDLENS SECURITY PLATFORM · BUILT FOR DIGITAL TRUST
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
