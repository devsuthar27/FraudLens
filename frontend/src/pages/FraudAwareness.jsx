
import { useMemo, useState } from "react";
import PageLayout from "../components/PageLayout";
import "./FraudAwareness.css";

const scamCategories = [
  {
    id: "upi",
    number: "01",
    title: "UPI & QR Code Scams",
    type: "PAYMENT FRAUD",
    icon: "₹",
    color: "orange",
    description: "Fraudsters trick people into approving payments or sharing payment credentials.",
    example: "Someone sends you a QR code claiming that scanning it will help you receive money. Instead, you are asked to enter your UPI PIN.",
    signs: [
      "A stranger asks you to scan a QR code to receive money.",
      "Someone asks for your UPI PIN or OTP.",
      "You receive an unexpected collect request.",
      "A caller creates urgency around a payment."
    ],
    protect: [
      "Never enter your UPI PIN to receive money.",
      "Check the recipient name and amount before approving.",
      "Do not scan unknown QR codes sent by strangers.",
      "Decline unexpected collect requests."
    ],
    action: "If money is lost, immediately contact your bank and report the transaction through India's cybercrime helpline 1930."
  },
  {
    id: "phishing",
    number: "02",
    title: "Phishing & Fake Websites",
    type: "ONLINE IDENTITY FRAUD",
    icon: "⌕",
    color: "blue",
    description: "Fake websites and messages imitate trusted brands to steal passwords, personal information or banking details.",
    example: "You receive a message saying your bank account will be blocked. The link opens a website that looks like your bank's login page.",
    signs: [
      "A website uses a misspelled or unusual domain.",
      "A message threatens account suspension.",
      "A login page asks for unusual personal details.",
      "The link comes from an unexpected sender."
    ],
    protect: [
      "Type official website addresses yourself.",
      "Check the domain carefully before logging in.",
      "Use multi-factor authentication.",
      "Never enter passwords through suspicious links."
    ],
    action: "If you shared login credentials, change your password immediately using the official website and contact the affected service."
  },
  {
    id: "otp",
    number: "03",
    title: "OTP & KYC Fraud",
    type: "BANKING FRAUD",
    icon: "⌑",
    color: "purple",
    description: "Scammers impersonate bank or service representatives and pressure victims into revealing OTPs or sensitive information.",
    example: "A caller claims that your KYC is incomplete and asks you to share an OTP to prevent your account from being blocked.",
    signs: [
      "Someone asks you to read out an OTP.",
      "A caller requests remote access to your phone.",
      "You are threatened with immediate account suspension.",
      "A message contains an unexpected KYC update link."
    ],
    protect: [
      "Never share OTPs, PINs or passwords.",
      "Use official bank apps and websites.",
      "Contact your bank using its verified number.",
      "Do not install remote-access apps at a stranger's request."
    ],
    action: "Contact your bank immediately if credentials or banking details were shared. Block compromised access and report unauthorized transactions."
  },
  {
    id: "jobs",
    number: "04",
    title: "Fake Job Offers",
    type: "EMPLOYMENT FRAUD",
    icon: "▣",
    color: "green",
    description: "Fraudsters pose as recruiters or companies and demand money or personal information for fake employment opportunities.",
    example: "A recruiter offers a work-from-home job with unusually high pay and asks you to pay a registration or training fee first.",
    signs: [
      "You are guaranteed a job without a proper interview.",
      "A recruiter demands payment to secure employment.",
      "The email address does not match the company's domain.",
      "The offer promises unrealistic earnings."
    ],
    protect: [
      "Verify the company and recruiter independently.",
      "Check job openings on the official careers page.",
      "Do not pay for a guaranteed job offer.",
      "Avoid sharing identity documents with unverified contacts."
    ],
    action: "Save the messages and payment details, contact your bank if money was transferred, and report suspected fraud."
  },
  {
    id: "digital-arrest",
    number: "05",
    title: "Digital Arrest Scams",
    type: "IMPERSONATION FRAUD",
    icon: "⚖",
    color: "red",
    description: "Criminals impersonate law enforcement or government officials and use threats, video calls and intimidation to demand money.",
    example: "A caller claims your identity is connected to a criminal case and tells you to stay on a video call while transferring money for verification.",
    signs: [
      "A caller threatens immediate arrest over a video call.",
      "You are told not to contact family or anyone else.",
      "Someone demands money for verification or settlement.",
      "The caller uses fake documents or official-looking backgrounds."
    ],
    protect: [
      "Do not transfer money because of threats.",
      "Do not trust official-looking video calls without verification.",
      "Contact the relevant agency through independently verified channels.",
      "Discuss suspicious calls with trusted people."
    ],
    action: "End the suspicious call, preserve evidence and report it to the police or cybercrime authorities. Never pay someone claiming to release you from a digital arrest."
  },
  {
    id: "investment",
    number: "06",
    title: "Investment & Trading Scams",
    type: "FINANCIAL FRAUD",
    icon: "↗",
    color: "yellow",
    description: "Fraudsters advertise fake investment schemes, trading groups or guaranteed returns to steal deposits.",
    example: "A social media group promises guaranteed daily profits and displays fake screenshots of successful withdrawals to convince you to invest.",
    signs: [
      "Guaranteed or unusually high returns are promised.",
      "You are pressured to invest immediately.",
      "The platform is not independently verifiable.",
      "You must pay extra fees to withdraw your money."
    ],
    protect: [
      "Verify financial intermediaries and platforms.",
      "Research investments independently.",
      "Never invest based only on social media tips.",
      "Be cautious of guaranteed-return promises."
    ],
    action: "Stop sending money, preserve transaction records and contact your bank and the appropriate financial or cybercrime authorities."
  },
  {
    id: "support",
    number: "07",
    title: "Fake Customer Support",
    type: "IMPERSONATION FRAUD",
    icon: "☎",
    color: "cyan",
    description: "Scammers pretend to be customer support representatives and trick users into revealing credentials or granting device access.",
    example: "You search online for a customer care number, call a fake number and the person asks you to install a screen-sharing application.",
    signs: [
      "A support agent asks for your OTP or PIN.",
      "You are asked to install an unknown application.",
      "The contact number is from an unofficial source.",
      "The agent demands payment to resolve a basic complaint."
    ],
    protect: [
      "Find contact details through official websites or apps.",
      "Never share banking credentials with support agents.",
      "Avoid giving strangers screen-sharing access.",
      "Do not trust random customer-care numbers in search results."
    ],
    action: "Disconnect remote access, uninstall suspicious applications, change compromised credentials and contact your bank if financial access was exposed."
  },
  {
    id: "parcel",
    number: "08",
    title: "Parcel Delivery Scams",
    type: "SMS & LINK FRAUD",
    icon: "▤",
    color: "pink",
    description: "Fake delivery messages claim that a parcel is delayed or blocked and direct victims to malicious links.",
    example: "You receive an SMS claiming that your parcel cannot be delivered because your address is incomplete. The link requests a small payment and personal details.",
    signs: [
      "Unexpected delivery messages contain payment links.",
      "You are asked to pay a small redelivery fee.",
      "The sender uses an unfamiliar website domain.",
      "The message creates urgency around parcel delivery."
    ],
    protect: [
      "Track parcels through the official courier website.",
      "Do not open unknown delivery links.",
      "Verify the tracking number independently.",
      "Avoid entering card details on suspicious pages."
    ],
    action: "Contact the courier through its official channels, block suspicious senders and contact your bank if payment information was exposed."
  }
];

function FraudAwareness() {
  const [selectedId, setSelectedId] = useState("upi");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const selectedScam = scamCategories.find(
    (item) => item.id === selectedId
  );

  const filteredScams = useMemo(() => {
    return scamCategories.filter((item) =>
      `${item.title} ${item.type} ${item.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  const selectScam = (id) => {
    setSelectedId(id);
    setActiveTab("overview");
  };

  return (
    <PageLayout>
      <main className="awareness-page">

        {/* HERO */}
        <section className="awareness-hero">
          <div className="awareness-hero-copy">
            <div className="awareness-eyebrow">
              <span>◈</span> FRAUDLENS / SECURITY KNOWLEDGE CENTER
            </div>

            <h1>
              Think Before You <span>Trust.</span>
            </h1>

            <p>
              Understand how digital scams work, recognize warning signs
              and learn how to protect yourself online.
            </p>

            <div className="awareness-hero-tags">
              <span>REAL-WORLD SCENARIOS</span>
              <span>SCAM PREVENTION</span>
              <span>CYBER SAFETY</span>
            </div>
          </div>

          <div className="awareness-hero-art" aria-hidden="true">
            <div className="awareness-orbit orbit-one" />
            <div className="awareness-orbit orbit-two" />
            <div className="awareness-shield">⬡</div>
            <span className="art-symbol symbol-one">!</span>
            <span className="art-symbol symbol-two">⌕</span>
            <span className="art-symbol symbol-three">✦</span>
            <span className="art-caption">STAY ALERT / STAY SECURE</span>
          </div>
        </section>

        {/* QUICK PRINCIPLES */}
        <section className="awareness-principles">
          <div>
            <span className="principle-number">01</span>
            <div>
              <strong>Pause</strong>
              <small>Don't act under pressure.</small>
            </div>
          </div>
          <div>
            <span className="principle-number">02</span>
            <div>
              <strong>Verify</strong>
              <small>Check the source independently.</small>
            </div>
          </div>
          <div>
            <span className="principle-number">03</span>
            <div>
              <strong>Protect</strong>
              <small>Never share sensitive credentials.</small>
            </div>
          </div>
        </section>

        {/* CATEGORY EXPLORER */}
        <section className="awareness-explorer">
          <div className="awareness-explorer-heading">
            <div>
              <span className="awareness-section-label">THREAT LIBRARY</span>
              <h2>Explore scam categories</h2>
              <p>Select a threat to understand how it works and how to avoid it.</p>
            </div>

            <div className="awareness-category-count">
              <strong>{filteredScams.length.toString().padStart(2, "0")}</strong>
              <small>CATEGORIES</small>
            </div>
          </div>

          <div className="awareness-explorer-layout">

            {/* CATEGORY SELECTOR */}
            <aside className="awareness-category-panel">
              <label className="awareness-category-search">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Find a scam..."
                />
              </label>

              <div className="awareness-category-list">
                {filteredScams.map((scam) => (
                  <button
                    key={scam.id}
                    type="button"
                    className={`awareness-category-item ${selectedId === scam.id ? "active" : ""}`}
                    onClick={() => selectScam(scam.id)}
                  >
                    <span className={`category-icon ${scam.color}`}>
                      {scam.icon}
                    </span>

                    <span className="category-text">
                      <strong>{scam.title}</strong>
                      <small>{scam.type}</small>
                    </span>

                    <span className="category-chevron">›</span>
                  </button>
                ))}

                {filteredScams.length === 0 && (
                  <div className="awareness-no-results">
                    No matching scam categories found.
                  </div>
                )}
              </div>
            </aside>

            {/* SELECTED SCAM CONTENT */}
            <section className="awareness-scam-detail">
              {selectedScam ? (
                <>
                  <div className="scam-detail-top">
                    <div className={`scam-large-icon ${selectedScam.color}`}>
                      {selectedScam.icon}
                    </div>

                    <div className="scam-detail-title">
                      <span className="awareness-section-label">
                        THREAT FILE / {selectedScam.number}
                      </span>
                      <h3>{selectedScam.title}</h3>
                      <span className="scam-type-label">{selectedScam.type}</span>
                    </div>
                  </div>

                  <p className="scam-description">
                    {selectedScam.description}
                  </p>

                  <div className="awareness-detail-tabs">
                    <button
                      className={activeTab === "overview" ? "active" : ""}
                      onClick={() => setActiveTab("overview")}
                    >
                      Overview
                    </button>
                    <button
                      className={activeTab === "warning" ? "active" : ""}
                      onClick={() => setActiveTab("warning")}
                    >
                      Warning Signs
                    </button>
                    <button
                      className={activeTab === "protect" ? "active" : ""}
                      onClick={() => setActiveTab("protect")}
                    >
                      Protection
                    </button>
                  </div>

                  {activeTab === "overview" && (
                    <div className="awareness-tab-content">
                      <div className="scam-example-box">
                        <span className="awareness-section-label">
                          <span>◈</span> REALISTIC SCENARIO
                        </span>
                        <p>{selectedScam.example}</p>
                      </div>

                      <div className="scam-overview-note">
                        <span>!</span>
                        <div>
                          <strong>Remember</strong>
                          <p>
                            Scammers often use urgency, fear or attractive
                            promises to make people act without verifying.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "warning" && (
                    <div className="awareness-tab-content">
                      <span className="awareness-section-label">
                        RED FLAGS TO WATCH
                      </span>
                      <div className="awareness-check-list warning-list">
                        {selectedScam.signs.map((sign, index) => (
                          <div key={index} className="awareness-check-item">
                            <span>!</span>
                            <p>{sign}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "protect" && (
                    <div className="awareness-tab-content">
                      <span className="awareness-section-label">
                        YOUR SAFETY CHECKLIST
                      </span>
                      <div className="awareness-check-list protection-list">
                        {selectedScam.protect.map((step, index) => (
                          <div key={index} className="awareness-check-item">
                            <span>✓</span>
                            <p>{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="scam-response-box">
                    <div className="response-icon">!</div>
                    <div>
                      <span>IF YOU BECOME A VICTIM</span>
                      <p>{selectedScam.action}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="awareness-no-selection">
                  <span>⌕</span>
                  <strong>No category selected</strong>
                  <p>Try another search or select a scam category.</p>
                </div>
              )}
            </section>
          </div>
        </section>

        {/* EMERGENCY RESPONSE */}
        <section className="awareness-emergency">
          <div className="emergency-symbol">1930</div>
          <div className="emergency-copy">
            <span>INDIA / CYBER FINANCIAL FRAUD HELPLINE</span>
            <h2>Act quickly. Report cyber financial fraud.</h2>
            <p>
              If you have lost money through cyber financial fraud,
              contact your bank immediately and report it through the
              national cybercrime helpline.
            </p>
            <a
              href="https://cybercrime.gov.in/"
              target="_blank"
              rel="noreferrer"
            >
              Visit National Cyber Crime Reporting Portal ↗
            </a>
          </div>
          <div className="emergency-number">1930</div>
        </section>

        {/* FINAL REMINDER */}
        <footer className="awareness-footer">
          <span>◈</span>
          <p>
            Your strongest security tool is awareness. Pause, verify and
            think before you trust.
          </p>
        </footer>

      </main>
    </PageLayout>
  );
}

export default FraudAwareness;
