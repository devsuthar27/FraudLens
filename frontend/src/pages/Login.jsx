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
        ? {
            name,
            email,
            password,
          }
        : {
            email,
            password,
          };

      const response = await fetch(endpoint, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong."
        );
      }

      // Save authentication data
      localStorage.setItem(
        "fraudlens_token",
        data.token
      );

      localStorage.setItem(
        "fraudlens_user",
        JSON.stringify(data.user)
      );

      setMessage(
        isRegister
          ? "Account created successfully!"
          : "Login successful!"
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      console.error(
        "Authentication Error:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to server."
      );
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
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% -20%, #172554 0%, #0F172A 45%, #020617 100%)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
        padding: "25px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Glow */}

      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background:
            "rgba(37, 99, 235, 0.13)",
          filter: "blur(100px)",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />

      {/* LOGIN CARD */}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "450px",
          background:
            "rgba(15, 23, 42, 0.88)",
          border:
            "1px solid rgba(71, 85, 105, 0.65)",
          borderRadius: "22px",
          padding: "38px",
          boxSizing: "border-box",
          boxShadow:
            "0 25px 80px rgba(0,0,0,0.45)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* BRAND */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              margin: "0 auto 18px",
              borderRadius: "21px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "38px",
              background:
                "linear-gradient(145deg, #1D4ED8, #2563EB)",
              boxShadow:
                "0 15px 40px rgba(37,99,235,0.3)",
              border:
                "1px solid rgba(147,197,253,0.3)",
            }}
          >
            🛡️
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              fontWeight: "800",
              letterSpacing: "-1px",
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

          <p
            style={{
              margin:
                "10px 0 0",
              color: "#94A3B8",
              fontSize: "14px",
            }}
          >
            {isRegister
              ? "Create your secure account"
              : "Welcome back to your security center"}
          </p>
        </div>

        {/* SECURITY BADGE */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            padding: "8px",
            marginBottom: "25px",
            borderRadius: "9px",
            background:
              "rgba(34,197,94,0.07)",
            border:
              "1px solid rgba(34,197,94,0.15)",
            color: "#86EFAC",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          🔒 Secure authentication
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          {/* NAME */}

          {isRegister && (
            <div style={fieldWrapper}>
              <label style={labelStyle}>
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your full name"
                style={inputStyle}
              />
            </div>
          )}

          {/* EMAIL */}

          <div style={fieldWrapper}>
            <label style={labelStyle}>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          {/* PASSWORD */}

          <div
            style={{
              ...fieldWrapper,
              marginBottom: "20px",
            }}
          >
            <label style={labelStyle}>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Enter your password"
              style={inputStyle}
            />
          </div>

          {/* ERROR */}

          {error && (
            <div
              style={{
                background:
                  "rgba(127,29,29,0.55)",
                border:
                  "1px solid #991B1B",
                color: "#FCA5A5",
                padding: "12px 14px",
                borderRadius: "10px",
                marginBottom: "16px",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* SUCCESS */}

          {message && (
            <div
              style={{
                background:
                  "rgba(20,83,45,0.55)",
                border:
                  "1px solid #166534",
                color: "#86EFAC",
                padding: "12px 14px",
                borderRadius: "10px",
                marginBottom: "16px",
                fontSize: "13px",
              }}
            >
              ✓ {message}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading
                ? "#475569"
                : "linear-gradient(135deg, #2563EB, #3B82F6)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              boxShadow: loading
                ? "none"
                : "0 10px 25px rgba(37,99,235,0.25)",
              transition:
                "all 0.2s ease",
            }}
          >
            {loading
              ? "⏳ Please wait..."
              : isRegister
              ? "Create Secure Account →"
              : "Login to FraudLens →"}
          </button>
        </form>

        {/* SWITCH */}

        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
            paddingTop: "22px",
            borderTop:
              "1px solid #1E293B",
            color: "#64748B",
            fontSize: "14px",
          }}
        >
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            onClick={switchMode}
            style={{
              background: "none",
              border: "none",
              color: "#60A5FA",
              marginLeft: "6px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px",
            }}
          >
            {isRegister
              ? "Login"
              : "Create one"}
          </button>
        </div>

        {/* FOOTER */}

        <div
          style={{
            textAlign: "center",
            marginTop: "22px",
            color: "#475569",
            fontSize: "11px",
          }}
        >
          🛡️ FraudLens Security Platform
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   STYLES
====================================================== */

const fieldWrapper = {
  marginBottom: "18px",
};

const labelStyle = {
  display: "block",
  color: "#CBD5E1",
  fontSize: "13px",
  fontWeight: "600",
  marginBottom: "8px",
};

const inputStyle = {
  width: "100%",
  padding: "13px 14px",
  boxSizing: "border-box",
  background: "#020617",
  color: "white",
  border: "1px solid #334155",
  borderRadius: "9px",
  outline: "none",
  fontSize: "14px",
};

export default Login;