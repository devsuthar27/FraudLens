import { NavLink, useNavigate } from "react-router-dom";
import { pageTheme } from "../styles/theme";

function Navbar() {
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "📊",
      width: "130px",
    },
    {
      name: "URL Scanner",
      path: "/url-scanner",
      icon: "🌐",
      width: "150px",
    },
    {
      name: "Email",
      path: "/email-analyzer",
      icon: "📧",
      width: "90px",
    },
    {
      name: "SMS",
      path: "/sms-analyzer",
      icon: "📱",
      width: "80px",
    },
    {
      name: "History",
      path: "/history",
      icon: "📜",
      width: "95px",
    },
  ];

  // ================= USER =================

  let user = null;

  try {
    const storedUser = localStorage.getItem("fraudlens_user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Unable to read user data:", error);
  }

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("fraudlens_token");
    localStorage.removeItem("fraudlens_user");

    navigate("/login", {
      replace: true,
    });

    window.location.reload();
  };

  return (
    <nav
      style={{
        background: "rgba(15, 23, 42, 0.95)",
        borderBottom: "1px solid #334155",

        height: "72px",

        padding: "0 40px",

        display: "grid",

        // LEFT | CENTER | RIGHT
        gridTemplateColumns: "1fr auto 1fr",

        alignItems: "center",

        position: "sticky",
        top: 0,

        zIndex: 1000,

        backdropFilter: "blur(12px)",

        boxSizing: "border-box",

        width: "100%",
      }}
    >
      {/* =====================================================
          LEFT SIDE — LOGO
      ===================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",

          minWidth: 0,
        }}
      >
        <NavLink
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "white",

            display: "flex",
            alignItems: "center",

            gap: "10px",

            fontSize: "24px",
            fontWeight: "bold",

            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              fontSize: "30px",
              lineHeight: 1,
            }}
          >
            🛡️
          </span>

          <span>
            Fraud
            <span
              style={{
                color: "#60A5FA",
              }}
            >
              Lens
            </span>
          </span>
        </NavLink>
      </div>

      {/* =====================================================
          CENTER — NAVIGATION
      ===================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "center",

          justifyContent: "center",

          gap: "35px",

          flexShrink: 0,
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              textDecoration: "none",

              color: isActive
                ? "white"
                : "#94A3B8",

              background: isActive
                ? "#2563EB"
                : "transparent",

              width: item.width,

              height: "20px",

              padding: "17px 40px",

              boxSizing: "border-box",

              borderRadius: "30px",

              // IMPORTANT:
              // Same font weight prevents layout shifting
              fontWeight: "670",

              fontSize: "15px",

              transition:
                "background 0.2s ease, color 0.2s ease",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              gap: "5px",

              flexShrink: 0,

              whiteSpace: "nowrap",
            })}
          >
            <span
              style={{
                width: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {item.icon}
            </span>

            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* =====================================================
          RIGHT SIDE — USER
      ===================================================== */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          justifyContent: "flex-end",

          minWidth: 0,
        }}
      >
        {user && (
          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: "10px",

              paddingLeft: "15px",

              borderLeft:
                "1px solid #334155",

              flexShrink: 0,
            }}
          >
            {/* USER AVATAR */}

            <div
              style={{
                width: "36px",
                height: "36px",

                minWidth: "36px",

                borderRadius: "50%",

                background: "#2563EB",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                fontWeight: "bold",

                fontSize: "16px",

                color: "white",
              }}
            >
              {user.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            {/* USER NAME */}

            <span
              style={{
                color: "#E2E8F0",

                fontSize: "14px",

                fontWeight: "600",

                maxWidth: "120px",

                overflow: "hidden",

                textOverflow: "ellipsis",

                whiteSpace: "nowrap",
              }}
            >
              {user.name || "User"}
            </span>

            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              style={{
                marginLeft: "5px",

                height: "38px",

                padding: "0 13px",

                background: "#7F1D1D",

                color: "#FCA5A5",

                border:
                  "1px solid #991B1B",

                borderRadius: "8px",

                cursor: "pointer",

                fontSize: "14px",

                fontWeight: "bold",

                whiteSpace: "nowrap",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                transition:
                  "background 0.2s ease",
              }}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;