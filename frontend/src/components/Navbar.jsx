
import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  let user = null;

  try {
    const storedUser = localStorage.getItem("fraudlens_user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Unable to read user data:", error);
  }

  const isLoggedIn =
    Boolean(localStorage.getItem("fraudlens_token")) && Boolean(user);

  const publicLinks = [
    { name: "Home", path: "/" },
  ];

  const privateLinks = [
    { name: "Dashboard", path: "/dashboard", icon: "▦" },
    { name: "URL Scanner", path: "/url-scanner", icon: "⌕" },
    { name: "Email", path: "/email-analyzer", icon: "✉" },
    { name: "SMS", path: "/sms-analyzer", icon: "▣" },
    { name: "History", path: "/history", icon: "◷" },
    { name: "Awareness", path: "/fraud-awareness", icon: "◇" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("fraudlens_token");
    localStorage.removeItem("fraudlens_user");

    setMenuOpen(false);
    navigate("/login", { replace: true });
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="fl-navbar">
      <style>{`
        .fl-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          min-height: 76px;
          padding: 0 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          background: rgba(18,19,21,.96);
          border-bottom: 1px solid #303135;
          backdrop-filter: blur(18px);
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
        }

        .fl-navbar * {
          box-sizing: border-box;
        }

        .fl-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          color: #f4f4f5;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 23px;
          font-weight: 700;
          letter-spacing: -1px;
          white-space: nowrap;
        }

        .fl-brand-icon {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          color: #fb923c;
          background: rgba(249,115,22,.1);
          border: 1px solid rgba(249,115,22,.3);
          font-size: 22px;
        }

        .fl-brand-accent {
          color: #fb923c;
        }

        .fl-nav-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .fl-nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 13px;
          border-radius: 8px;
          text-decoration: none;
          color: #999aa0;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          transition: .2s ease;
        }

        .fl-nav-link:hover {
          color: #fb923c;
          background: rgba(249,115,22,.06);
        }

        .fl-nav-link.active {
          color: #fb923c;
          background: rgba(249,115,22,.09);
        }

        .fl-nav-link.active::after {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 20%;
          width: 60%;
          height: 2px;
          border-radius: 5px;
          background: #f97316;
        }

        .fl-nav-icon {
          font-size: 15px;
          color: #fb923c;
        }

        .fl-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .fl-get-started {
          border: 0;
          border-radius: 8px;
          padding: 12px 18px;
          background: linear-gradient(110deg, #ea580c, #fb923c);
          color: #17120e;
          font-family: inherit;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: .2s ease;
          white-space: nowrap;
        }

        .fl-get-started:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(249,115,22,.2);
        }

        .fl-user-area {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-left: 15px;
          border-left: 1px solid #35363a;
        }

        .fl-user-avatar {
          display: grid;
          place-items: center;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          color: #fb923c;
          background: rgba(249,115,22,.13);
          border: 1px solid rgba(249,115,22,.3);
          font-size: 13px;
          font-weight: 800;
        }

        .fl-user-name {
          max-width: 105px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #d4d4d8;
          font-size: 12px;
          font-weight: 700;
        }

        .fl-logout {
          border: 1px solid #49403b;
          border-radius: 7px;
          padding: 9px 12px;
          color: #fb923c;
          background: rgba(249,115,22,.06);
          font-family: inherit;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: .2s ease;
          white-space: nowrap;
        }

        .fl-logout:hover {
          background: rgba(249,115,22,.15);
          border-color: #f97316;
        }

        .fl-menu-toggle {
          display: none;
          width: 40px;
          height: 40px;
          border: 1px solid #38393d;
          border-radius: 8px;
          color: #fb923c;
          background: #202124;
          font-size: 21px;
          cursor: pointer;
        }

        .fl-mobile-menu {
          display: none;
        }

        @media (max-width: 1100px) {
          .fl-navbar {
            padding: 0 3%;
            gap: 12px;
          }

          .fl-nav-link {
            padding: 10px 8px;
            font-size: 11px;
          }

          .fl-user-name {
            display: none;
          }

          .fl-brand {
            font-size: 20px;
          }
        }

        @media (max-width: 760px) {
          .fl-navbar {
            min-height: 68px;
            padding: 0 19px;
          }

          .fl-nav-links,
          .fl-nav-right {
            display: none;
          }

          .fl-menu-toggle {
            display: grid;
            place-items: center;
          }

          .fl-mobile-menu {
            position: absolute;
            top: 68px;
            left: 0;
            right: 0;
            display: flex;
            flex-direction: column;
            gap: 5px;
            padding: 15px 19px 20px;
            background: #18191b;
            border-bottom: 1px solid #35363a;
            box-shadow: 0 15px 30px rgba(0,0,0,.35);
          }

          .fl-mobile-menu .fl-nav-link {
            padding: 13px 14px;
            font-size: 13px;
          }

          .fl-mobile-menu .fl-nav-link.active::after {
            display: none;
          }

          .fl-mobile-user {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 14px 5px 5px;
            margin-top: 10px;
            border-top: 1px solid #35363a;
          }

          .fl-mobile-user .fl-user-name {
            display: block;
            flex: 1;
          }

          .fl-mobile-menu .fl-get-started {
            margin-top: 8px;
          }

          .fl-mobile-logout {
            width: 100%;
            margin-top: 8px;
            padding: 12px;
          }
        }
      `}</style>

      {/* BRAND */}
      <NavLink
        to={isLoggedIn ? "/dashboard" : "/"}
        className="fl-brand"
        onClick={closeMenu}
      >
        <span className="fl-brand-icon">⌑</span>
        <span>
          Fraud<span className="fl-brand-accent">Lens</span>
        </span>
      </NavLink>

      {/* DESKTOP NAVIGATION */}
      <div className="fl-nav-links">
        {!isLoggedIn ? (
          <>
            {publicLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  `fl-nav-link ${isActive ? "active" : ""}`
                }
              >
                {item.name}
              </NavLink>
            ))}

            <button
              className="fl-nav-link"
              onClick={() => {
                document.getElementById("tools")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              Explore
            </button>
          </>
        ) : (
          privateLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `fl-nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="fl-nav-icon">{item.icon}</span>
              {item.name}
            </NavLink>
          ))
        )}
      </div>

      {/* DESKTOP RIGHT SIDE */}
      <div className="fl-nav-right">
        {!isLoggedIn ? (
          <>
            <button
              className="fl-nav-link"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>

            <button
              className="fl-get-started"
              onClick={() => navigate("/login")}
            >
              Get Started →
            </button>
          </>
        ) : (
          <div className="fl-user-area">
            <div className="fl-user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <span className="fl-user-name">
              {user?.name || "User"}
            </span>

            <button className="fl-logout" onClick={handleLogout}>
              Logout ↗
            </button>
          </div>
        )}
      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        className="fl-menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? "×" : "☰"}
      </button>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fl-mobile-menu">
          {!isLoggedIn ? (
            <>
              {publicLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `fl-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              <button
                className="fl-nav-link"
                onClick={() => {
                  closeMenu();
                  if (location.pathname === "/") {
                    document.getElementById("tools")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  } else {
                    navigate("/");
                  }
                }}
              >
                Platform
              </button>

              <button
                className="fl-get-started"
                onClick={() => {
                  closeMenu();
                  navigate("/login");
                }}
              >
                Sign In / Get Started →
              </button>
            </>
          ) : (
            <>
              {privateLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `fl-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <span className="fl-nav-icon">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}

              <div className="fl-mobile-user">
                <div className="fl-user-avatar">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <span className="fl-user-name">
                  {user?.name || "User"}
                </span>
              </div>

              <button
                className="fl-logout fl-mobile-logout"
                onClick={handleLogout}
              >
                Logout ↗
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
