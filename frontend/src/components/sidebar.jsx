
import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "▦",
  },
  {
    name: "URL Scanner",
    path: "/url-scanner",
    icon: "◎",
  },
  {
    name: "Email Analyzer",
    path: "/email-analyzer",
    icon: "✉",
  },
  {
    name: "SMS Analyzer",
    path: "/sms-analyzer",
    icon: "▤",
  },
  {
    name: "Scan History",
    path: "/history",
    icon: "◷",
  },
  {
    name: "Fraud Awareness",
    path: "/fraud-awareness",
    icon: "◈",
  },
];

function Sidebar() {
  const navigate = useNavigate();

  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem("fraudlens_user") || "{}"
    );
  } catch {
    user = {};
  }

  const userName = user.name || user.username || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("fraudlens_token");
    localStorage.removeItem("fraudlens_user");

    navigate("/login", { replace: true });
  };

  return (
    <aside className="fl-sidebar">
      {/* BRAND */}
      <div className="fl-sidebar-brand">
        <div className="fl-brand-icon">
          🛡️
        </div>

        <div>
          <h2>FraudLens</h2>
          <span>SECURITY CENTER</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="fl-sidebar-section">
        <p className="fl-sidebar-label">
          WORKSPACE
        </p>

        <nav className="fl-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `fl-sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="fl-sidebar-icon">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* SECURITY MESSAGE */}
      <div className="fl-sidebar-security">
        <div className="fl-security-icon">
          🔐
        </div>

        <strong>Stay Protected</strong>

        <p>
          Think and Verify before you click.
          Stay alert against Digital Fraud.
        </p>
      </div>

      {/* USER PROFILE */}
      <div className="fl-sidebar-profile">
        <div className="fl-user-avatar">
          {userInitial}
        </div>

        <div className="fl-user-details">
          <strong>{userName}</strong>
          <span>Account</span>
        </div>

        <button
          className="fl-logout-button"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
        >
          ↪
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
