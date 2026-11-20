
import Sidebar from "./sidebar";

function PageLayout({ children }) {
  return (
    <div className="fl-app-layout">
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* MAIN WORKSPACE */}
      <main className="fl-app-main">
        <div className="fl-page-content">
          {children}
        </div>
      </main>

      {/* SECURITY AWARENESS TICKER */}
      <div className="fl-awareness-ticker">
        <div className="fl-ticker-label">
          💀 Wait… Read This!
        </div>

        <div className="fl-ticker-track">
          <div className="fl-ticker-content">
            <span>
              Never share your OTP with anyone.
            </span>
            <span>•</span>
            <span>
              Never enter your UPI PIN to receive money.
            </span>
            <span>•</span>
            <span>
              Always verify website URLs before logging in.
            </span>
            <span>•</span>
            <span>
              Don't click suspicious SMS or email links.
            </span>
            <span>•</span>
            <span>
              Scammers exploit trust, not just technology.
            </span>
            <span>•</span>
            <span>
              Screen-sharing can expose banking details and OTPs.
            </span>
            <span>•</span>
            <span>
              Use strong, unique passwords
            </span>
            <span>•</span>
            <span>
              Enable two-factor authentication
            </span>
            <span>•</span>
            <span>
              Avoid public Wi-Fi for sensitive activities
            </span>
            <span>•</span>
            <span>
              A legitimate-looking payment screenshot is not proof of payment.
            </span>
            <span>•</span>
            <span>
              Don't scan documents through links sent by unknown contacts.
            </span>
            <span>•</span>
            <span>
              Caller ID can be spoofed; verify the caller independently.
            </span>
            <span>•</span>
            <span>
              Your digital footprint can help scammers impersonate you.
            </span>
            <span>•</span>
            <span>
              Trust is the most exploited vulnerability in social engineering.
            </span>
            <span>•</span>
            <span>
              Attackers study your habits before targeting your identity.
            </span>
            <span>•</span>
            <span>
              A single leaked credential can expose multiple accounts.
            </span>
            <span>•</span>
            <span>
              A password manager reduces the risk of credential reuse.
            </span>
            <span>•</span>
            <span>
             An innocent-looking attachment can execute malicious code.
            </span>
            <span>•</span>
            <span>
              A compromised account can impersonate you more convincingly than a stranger.
            </span>
            <span>•</span>
            <span>
              A QR code is a link you cannot easily inspect before scanning.
            </span>
            <span>•</span>
            <span>
              The weakest recovery method can undermine the strongest password.
            </span>
            <span>•</span>
            <span>
              Digital safety begins with verifying, not trusting.
            </span>
            <span>•</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageLayout;
