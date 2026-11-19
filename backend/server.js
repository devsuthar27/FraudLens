const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// ======================================================
// CONFIGURATION
// ======================================================

const PORT = process.env.PORT || 5000;
const VT_API = "https://www.virustotal.com/api/v3";


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(
  express.json({
    limit: "100kb",
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// ======================================================
// MONGODB CONNECTION
// ======================================================

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDatabase() {
  if (!MONGODB_URI) {
    console.log("⚠️ MONGODB_URI is missing in .env");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);

    console.log("🍃 MongoDB connected successfully");
    console.log(`📦 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
  }
}


// ======================================================
// USER MODEL
// ======================================================

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);


// ======================================================
// SCAN HISTORY MODEL
// ======================================================

const scanSchema = new mongoose.Schema(
  {
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  index: true,
  },

    type: {
      type: String,
      enum: ["URL", "EMAIL", "SMS"],
      required: true,
    },

    input: {
      type: String,
      required: true,
    },

    score: {
      type: String,
      default: "—",
    },

    status: {
      type: String,
      default: "Unknown",
    },

    reason: {
      type: String,
      default: "",
    },

    recommendation: {
      type: String,
      default: "",
    },

    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);
scanSchema.index({
  userId: 1,
  createdAt: -1,
});

const Scan = mongoose.model("Scan", scanSchema);


// ======================================================
// ROOT
// ======================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FraudLens Backend is running 🚀",
  });
});


// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    backend: "online",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
    port: PORT,
  });
});

// ======================================================
// AUTH MIDDLEWARE
// ======================================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing in .env");

    return res.status(500).json({
      success: false,
      error: "Server authentication configuration is missing.",
    });
  }

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: "Authentication token is required.",
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (
    scheme !== "Bearer" ||
    !token
  ) {
    return res.status(401).json({
      success: false,
      error: "Invalid authentication format.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        error: "Invalid authentication token.",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "❌ JWT verification failed:",
      error.message
    );

    return res.status(401).json({
      success: false,
      error: "Invalid or expired token.",
    });
  }
}


// ======================================================
// REGISTER
// ======================================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // Check existing user
    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(
      "❌ Register Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Unable to create account.",
    });
  }
});

// ======================================================
// LOGIN
// ======================================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Compare password
    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      success: true,
      message: "Login successful.",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(
      "❌ Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Unable to login.",
    });
  }
});


// ======================================================
// CURRENT USER
// ======================================================

app.get(
  "/api/auth/me",
  authenticateToken,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user.userId
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found.",
        });
      }

      return res.json({
        success: true,
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Unable to retrieve user.",
      });
    }
  }
);


// ======================================================
// URL HELPERS
// ======================================================

function getUrlId(url) {
  return Buffer.from(url)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}


// ======================================================
// URL REPORT
// ======================================================

function createUrlReport(url, attributes) {
  const stats = attributes.last_analysis_stats || {};

  const malicious = stats.malicious || 0;
  const suspicious = stats.suspicious || 0;
  const harmless = stats.harmless || 0;
  const undetected = stats.undetected || 0;

  const total =
    malicious +
    suspicious +
    harmless +
    undetected;

  let score = 0;
  let status;
  let reason;
  let recommendation;

  // ============================================
  // HIGH RISK
  // ============================================

  if (malicious >= 3) {
    score = Math.min(
      100,
      70 + malicious * 5
    );

    status = "🔴 High Risk";

    reason =
      `${malicious} security engines flagged this URL as malicious.`;

    recommendation =
      "Do not visit this website or enter passwords, OTPs, payment details or personal information.";
  }

  // ============================================
  // MEDIUM / SUSPICIOUS
  // ============================================

  else if (malicious > 0 || suspicious >= 3) {
    score = Math.min(
      100,
      45 +
        malicious * 10 +
        suspicious * 5
    );

    status = "🟠 Medium Risk";

    reason =
      malicious > 0
        ? `${malicious} security engine(s) detected malicious indicators.`
        : `${suspicious} security engine(s) reported suspicious indicators.`;

    recommendation =
      "Avoid entering sensitive information and verify the website before continuing.";
  }

  // ============================================
  // LOW RISK
  // ============================================

  else if (suspicious > 0) {
    score = 25;

    status = "🟡 Low Risk";

    reason =
      `${suspicious} security engine(s) reported a suspicious indicator, but no strong malicious detection was found.`;

    recommendation =
      "Proceed carefully and avoid entering sensitive information unless you trust the website.";
  }

  // ============================================
  // NO THREAT DETECTED
  // ============================================

  else {
    score = 5;

    status = "🟢 No Threat Detected";

    reason =
      "No malicious or suspicious detections were returned by the available security engines.";

    recommendation =
      "No known malicious indicators were detected. However, automated scanners cannot guarantee that a website is completely safe.";
  }

  return {
    score: `${score} / 100`,
    status,
    reason,
    recommendation,

    details: {
      malicious,
      suspicious,
      harmless,
      undetected,
      totalEngines: total,
    },

    url,
  };
}


// ======================================================
// VIRUSTOTAL - GET EXISTING REPORT
// ======================================================

async function getUrlReport(url) {
  const urlId = getUrlId(url);

  const response = await fetch(
    `${VT_API}/urls/${urlId}`,
    {
      headers: {
        "x-apikey":
          process.env.VIRUSTOTAL_API_KEY,
      },
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `VirusTotal error: ${response.status} ${text}`
    );
  }

  const data = await response.json();

  return data.data.attributes;
}


// ======================================================
// VIRUSTOTAL - SUBMIT URL
// ======================================================

async function submitUrl(url) {
  const body = new URLSearchParams();

  body.append("url", url);

  const response = await fetch(
    `${VT_API}/urls`,
    {
      method: "POST",

      headers: {
        "x-apikey":
          process.env.VIRUSTOTAL_API_KEY,

        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      body,
    }
  );

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `VirusTotal scan error: ${response.status} ${text}`
    );
  }

  const data = await response.json();

  return data.data.id;
}


// ======================================================
// VIRUSTOTAL - ANALYSIS
// ======================================================

async function getAnalysis(id) {
  const response = await fetch(
    `${VT_API}/analyses/${id}`,
    {
      headers: {
        "x-apikey":
          process.env.VIRUSTOTAL_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to get VirusTotal analysis."
    );
  }

  const data = await response.json();

  return data.data;
}


// ======================================================
// WAIT FOR VIRUSTOTAL
// ======================================================

async function waitForAnalysis(id) {
  for (let i = 0; i < 8; i++) {
    const analysis =
      await getAnalysis(id);

    if (
      analysis.attributes &&
      analysis.attributes.status ===
        "completed"
    ) {
      return true;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 3000)
    );
  }

  return false;
}


// ======================================================
// SAVE SCAN TO DATABASE
// ======================================================

async function saveScan(
  userId,
  type,
  input,
  report
) 

{
  try {
    if (
      mongoose.connection.readyState !== 1
    ) {
      return;
    }

    await Scan.create({
      userId: userId,
      type,
      input,
      score: report.score,
      status: report.status,
      reason: report.reason,
      recommendation:
        report.recommendation,
      details: report.details || {},
    });

    console.log(
      `💾 ${type} scan saved to MongoDB`
    );
  } catch (error) {
    console.error(
      "⚠️ Could not save scan:",
      error.message
    );
  }
}

// ======================================================
// GET USER SCAN HISTORY
// ======================================================

app.get(
  "/api/history",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Invalid user authentication.",
        });
      }

      const history = await Scan.find({
        userId,
      })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      return res.status(200).json({
        success: true,
        count: history.length,
        history,
      });
    } catch (error) {
      console.error(
        "❌ History Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        error: "Unable to fetch scan history.",
      });
    }
  }
);
// ======================================================
// URL SCANNER
// ======================================================

app.post(
  "/api/analyze-url",
  authenticateToken,
  async (req, res) => {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({
          success: false,
          error: "URL is required.",
        });
      }

      let parsedUrl;

      try {
        parsedUrl = new URL(url);
      } catch {
        return res.status(400).json({
          success: false,
          error: "Invalid URL.",
        });
      }

      if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Only HTTP and HTTPS URLs are supported.",
        });
      }

      if (
        !process.env.VIRUSTOTAL_API_KEY
      ) {
        return res.status(500).json({
          success: false,
          error:
            "VirusTotal API key is missing.",
        });
      }

      const cleanUrl = parsedUrl.href;

      console.log(
        `🔍 URL Scan: ${cleanUrl}`
      );

      let attributes =
        await getUrlReport(cleanUrl);

      if (!attributes) {
        console.log(
          "🆕 URL not found. Submitting scan..."
        );

        const analysisId =
          await submitUrl(cleanUrl);

        const completed =
          await waitForAnalysis(
            analysisId
          );

        if (!completed) {
          return res.json({
            success: true,
            source: "VirusTotal",

            report: {
              score: "—",
              status:
                "🔵 Scan In Progress",

              reason:
                "A security scan has been submitted and is still processing.",

              recommendation:
                "Please analyze this URL again after a few seconds.",
            },
          });
        }

        attributes =
          await getUrlReport(cleanUrl);
      }

      if (!attributes) {
        return res.json({
          success: true,

          report: {
            score: "—",
            status:
              "🔵 Scan In Progress",

            reason:
              "The security analysis is still being processed.",

            recommendation:
              "Please try again shortly.",
          },
        });
      }

      const report =
        createUrlReport(
          cleanUrl,
          attributes
        );

      await saveScan(
        req.user?.userId,
        "URL",
        cleanUrl,
        report
      );

      return res.json({
        success: true,
        source: "VirusTotal",
        report,
      });
    } catch (error) {
      console.error(
        "❌ URL Scanner:",
        error.message
      );

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);


// ======================================================
// INTELLIGENT TEXT FRAUD ANALYSIS ENGINE
// ======================================================

function analyzeMessage(text, type) {
  const lower = text.toLowerCase();

  let score = 0;
  const indicators = [];

  // ------------------------------------------------------
  // Helper: Add indicator without duplicates
  // ------------------------------------------------------

  const addIndicator = (message, points) => {
    if (!indicators.includes(message)) {
      indicators.push(message);
      score += points;
    }
  };

  // ------------------------------------------------------
  // 1. FINANCIAL INDICATORS
  // ------------------------------------------------------

  const financialWords = [
    "bank",
    "upi",
    "payment",
    "transaction",
    "account",
    "credit card",
    "debit card",
    "refund",
    "cashback",
    "wallet",
    "money",
    "transfer",
    "pay",
  ];

  financialWords.forEach((word) => {
    if (lower.includes(word)) {
      addIndicator(
        `Financial term: ${word}`,
        6
      );
    }
  });

  // ------------------------------------------------------
  // 2. CREDENTIAL / SENSITIVE INFORMATION
  // ------------------------------------------------------

  const credentialWords = [
    "password",
    "otp",
    "pin",
    "cvv",
    "passcode",
    "verification code",
    "login",
    "username",
    "account verification",
    "verify your account",
  ];

  credentialWords.forEach((word) => {
    if (lower.includes(word)) {
      addIndicator(
        `Credential request: ${word}`,
        12
      );
    }
  });

  // ------------------------------------------------------
  // 3. URGENCY / PRESSURE
  // ------------------------------------------------------

  const urgencyWords = [
    "urgent",
    "immediately",
    "act now",
    "limited time",
    "expires today",
    "within 24 hours",
    "within 48 hours",
    "account blocked",
    "account suspended",
    "last warning",
    "final warning",
  ];

  urgencyWords.forEach((word) => {
    if (lower.includes(word)) {
      addIndicator(
        `Urgency: ${word}`,
        10
      );
    }
  });

  // ------------------------------------------------------
  // 4. REWARD / SCAM PATTERNS
  // ------------------------------------------------------

  const scamWords = [
    "winner",
    "won",
    "prize",
    "reward",
    "lottery",
    "free gift",
    "cash prize",
    "claim now",
    "congratulations",
    "lucky winner",
    "you have been selected",
    "bonus",
  ];

  scamWords.forEach((word) => {
    if (lower.includes(word)) {
      addIndicator(
        `Scam pattern: ${word}`,
        10
      );
    }
  });

  // ------------------------------------------------------
  // 5. SUSPICIOUS ACTIONS
  // ------------------------------------------------------

  const actionWords = [
    "click here",
    "click the link",
    "open the link",
    "verify now",
    "confirm now",
    "send otp",
    "share otp",
    "send money",
    "pay now",
    "login now",
    "update your account",
    "confirm payment",
  ];

  actionWords.forEach((word) => {
    if (lower.includes(word)) {
      addIndicator(
        `Suspicious action: ${word}`,
        14
      );
    }
  });

  // ------------------------------------------------------
  // 6. LINK DETECTION
  // ------------------------------------------------------

  const hasHttpLink =
    lower.includes("http://") ||
    lower.includes("https://");

  const hasWww =
    lower.includes("www.");

  const hasShortenedLink =
    lower.includes("bit.ly") ||
    lower.includes("tinyurl") ||
    lower.includes("t.co") ||
    lower.includes("goo.gl");

  if (hasHttpLink || hasWww) {
    addIndicator(
      "Contains a link",
      8
    );
  }

  if (hasShortenedLink) {
    addIndicator(
      "Uses a shortened URL",
      12
    );
  }

  // ------------------------------------------------------
  // 7. SUSPICIOUS DOMAIN / LINK WORDS
  // ------------------------------------------------------

  const suspiciousLinkWords = [
    "verify",
    "secure-login",
    "account-update",
    "wallet-verify",
    "payment-verify",
    "login-secure",
    "confirm-account",
  ];

  suspiciousLinkWords.forEach((word) => {
    if (lower.includes(word)) {
      addIndicator(
        `Suspicious link pattern: ${word}`,
        10
      );
    }
  });

  // ------------------------------------------------------
  // 8. IMPERSONATION / AUTHORITY PATTERNS
  // ------------------------------------------------------

  const impersonationWords = [
    "customer support",
    "customer care",
    "bank official",
    "account manager",
    "security team",
    "government",
    "income tax",
    "police",
    "delivery partner",
    "support team",
  ];

  impersonationWords.forEach((word) => {
    if (lower.includes(word)) {
      addIndicator(
        `Possible impersonation: ${word}`,
        7
      );
    }
  });

  // ------------------------------------------------------
  // 9. COMBINATION BOOST
  // ------------------------------------------------------

  // Multiple dangerous categories together are
  // considerably more suspicious than a single keyword.

  const hasCredentialIndicator =
    indicators.some((item) =>
      item.startsWith("Credential request:")
    );

  const hasUrgencyIndicator =
    indicators.some((item) =>
      item.startsWith("Urgency:")
    );

  const hasActionIndicator =
    indicators.some((item) =>
      item.startsWith("Suspicious action:")
    );

  const hasFinancialIndicator =
    indicators.some((item) =>
      item.startsWith("Financial term:")
    );

  const hasScamIndicator =
    indicators.some((item) =>
      item.startsWith("Scam pattern:")
    );

  if (
    hasCredentialIndicator &&
    hasUrgencyIndicator
  ) {
    addIndicator(
      "Credential request combined with urgency",
      10
    );
  }

  if (
    hasFinancialIndicator &&
    hasActionIndicator
  ) {
    addIndicator(
      "Financial request combined with suspicious action",
      10
    );
  }

  if (
    hasScamIndicator &&
    hasActionIndicator
  ) {
    addIndicator(
      "Reward/scam pattern combined with suspicious action",
      10
    );
  }

  // ------------------------------------------------------
  // 10. TYPE-SPECIFIC ANALYSIS
  // ------------------------------------------------------

  if (type === "SMS") {
    const smsPatterns = [
      "dear customer",
      "click immediately",
      "reply",
      "call now",
      "send otp",
    ];

    smsPatterns.forEach((word) => {
      if (lower.includes(word)) {
        addIndicator(
          `SMS suspicious pattern: ${word}`,
          8
        );
      }
    });
  }

  if (type === "EMAIL") {
    const emailPatterns = [
      "dear customer",
      "dear user",
      "dear account holder",
      "click below",
      "verify your identity",
      "kindly verify",
      "account security",
    ];

    emailPatterns.forEach((word) => {
      if (lower.includes(word)) {
        addIndicator(
          `Email suspicious pattern: ${word}`,
          7
        );
      }
    });
  }

  // ------------------------------------------------------
  // FINAL SCORE
  // ------------------------------------------------------

  score = Math.min(score, 100);

  let status;
  let reason;
  let recommendation;

  if (score >= 70) {
    status = "🔴 High Risk";

    reason =
      indicators.length > 0
        ? `Multiple suspicious indicators were detected: ${indicators
            .slice(0, 5)
            .join(", ")}.`
        : "Multiple suspicious patterns were detected.";

    recommendation =
      type === "SMS"
        ? "Do not click links, share OTPs or make payments. Verify the sender independently."
        : "Do not click links or provide credentials, OTPs or financial information. Verify the sender independently.";
  } else if (score >= 35) {
    status = "🟠 Medium Risk";

    reason =
      indicators.length > 0
        ? `Potentially suspicious indicators were detected: ${indicators
            .slice(0, 5)
            .join(", ")}.`
        : "Some potentially suspicious patterns were detected.";

    recommendation =
      "Verify the sender and context before clicking links or sharing information.";
  } else {
    status = "🟢 Low Risk";

    reason =
      "No significant scam or phishing indicators were detected in the provided content.";

    recommendation =
      "The message appears low risk based on the available indicators. Still verify unexpected requests.";
  }

  // ------------------------------------------------------
  // FINAL REPORT
  // ------------------------------------------------------

  return {
    score: `${score} / 100`,
    status,
    reason,
    recommendation,

    details: {
      type,
      indicators,
      indicatorCount: indicators.length,

      analysis: {
        financialRisk: hasFinancialIndicator,
        credentialRisk: hasCredentialIndicator,
        urgencyRisk: hasUrgencyIndicator,
        scamRisk: hasScamIndicator,
        actionRisk: hasActionIndicator,
        linkRisk: hasHttpLink || hasWww,
        shortenedUrlRisk: hasShortenedLink,
      },
    },
  };
}


// ======================================================
// EMAIL ANALYZER
// ======================================================

app.post(
  "/api/analyze-email",
  authenticateToken,
  async (req, res) => {
    try {
      const { email } = req.body;

if (!email || !email.trim()) {
  return res.status(400).json({
    success: false,
    error: "Email content is required.",
  });
}

if (email.length > 10000) {
  return res.status(400).json({
    success: false,
    error: "Email content is too large.",
  });
}

      console.log(
        "📧 Email analysis requested."
      );

      const report =
        analyzeMessage(
          email,
          "EMAIL"
        );

      await saveScan(
        req.user?.userId,
        "EMAIL",
        email,
        report
      );

      return res.json({
        success: true,
        source:
          "FraudLens Analysis Engine",
        report,
      });
    } catch (error) {
      console.error(
        "❌ Email Analyzer:",
        error.message
      );

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);


// ======================================================
// SMS ANALYZER
// ======================================================

app.post("/api/analyze-sms", authenticateToken, async (req, res) => {
  try {
    const { sms } = req.body;

if (!sms || !sms.trim()) {
  return res.status(400).json({
    success: false,
    error: "SMS content is required.",
  });
}

if (sms.length > 5000) {
  return res.status(400).json({
    success: false,
    error: "SMS content is too large.",
  });
}

    const text = sms.toLowerCase().trim();

    let score = 0;
    const indicators = [];

    // ==============================
    // 1. OTP / VERIFICATION
    // ==============================

    if (/\botp\b|\bone[- ]time password\b/.test(text)) {
      score += 25;
      indicators.push("OTP or one-time password request detected");
    }

    if (
      /verify|verification|confirm|authenticate|validate|Verify to Get Access|/.test(text)
    ) {
      score += 12;
      indicators.push("Verification request detected");
    }

    // ==============================
    // 2. BANK / FINANCIAL
    // ==============================

    if (
      /bank|banking|account|credit card|debit card|atm|upi|payment|transaction|Unpaid Fees|Unpaid Toll|Unpaid Bill|Send Money/.test(
        text
      )
    ) {
      score += 15;
      indicators.push("Financial or banking-related content detected");
    }

    // ==============================
    // 3. URGENCY / THREAT
    // ==============================

    if (
      /urgent|immediately|act now|within \d+ (minute|minutes|hour|hours)|blocked|suspended|deactivated|expire|expired|Alert|Unusual Activity/.test(
        text
      )
    ) {
      score += 18;
      indicators.push("Urgency or account-threat language detected");
    }

    // ==============================
    // 4. PRIZE / REWARD SCAM
    // ==============================

    if (
      /winner|won|prize|reward|lottery|cashback|cash back|congratulations|lucky/.test(
        text
      )
    ) {
      score += 25;
      indicators.push("Prize or reward scam pattern detected");
    }

    // ==============================
    // 5. MONEY REQUEST
    // ==============================

    if (
      /send money|pay now|make payment|transfer money|deposit|refund|claim.*money|receive.*money|"¥"|"€"|"₹"|"₽"/.test(
        text
      )
    ) {
      score += 20;
      indicators.push("Suspicious money/payment request detected");
    }

    // ==============================
    // 6. SUSPICIOUS LINK
    // ==============================

    if (
      /https?:\/\/|www\.|bit\.ly|tinyurl|t\.co|goo\.gl|shorturl/.test(
        text
      )
    ) {
      score += 25;
      indicators.push("Link or URL detected in SMS");
    }

    // ==============================
    // 7. KYC / PERSONAL INFORMATION
    // ==============================

    if (
      /kyc|pan card|aadhaar|aadhar|personal details|date of birth|dob|password|pin|cvv/.test(
        text
      )
    ) {
      score += 20;
      indicators.push("Request for sensitive personal information detected");
    }

    // ==============================
    // 8. COMMON SCAM PHRASES
    // ==============================

    if (
      /click here|click the link|click below|claim now|verify now|update now|login now/.test(
        text
      )
    ) {
      score += 20;
      indicators.push("Suspicious call-to-action detected");
    }

    // ==============================
    // LIMIT SCORE
    // ==============================

    score = Math.min(score, 100);

    // ==============================
    // DETERMINE STATUS
    // ==============================

    let status;
    let reason;
    let recommendation;

    if (score >= 60) {
      status = "🔴 High Risk";

      reason =
        indicators.length > 0
          ? indicators.join(". ") + "."
          : "Multiple suspicious indicators were detected.";

      recommendation =
        "Do not click links, share OTPs, passwords or banking information. Verify the message through the organization's official website or app.";
    } else if (score >= 30) {
      status = "🟠 Medium Risk";

      reason =
        indicators.length > 0
          ? indicators.join(". ") + "."
          : "Some suspicious characteristics were detected.";

      recommendation =
        "Be cautious. Do not provide sensitive information until the sender and request are independently verified.";
    } else {
      status = "🟢 Safe";

      reason =
        "No significant scam or phishing indicators were detected in this SMS.";

      recommendation =
        "The message appears relatively safe, but always verify unexpected requests independently.";
    }

    const report = {
      score: `${score} / 100`,
      status,
      reason,
      recommendation,
      details: {
        indicators,
        analyzedText: sms,
      },
    };

    // ==============================
    // SAVE SCAN
    // ==============================

    await saveScan(
      req.user?.userId,
      "SMS",
      sms,
      report
    );

    return res.json({
      success: true,
      report,
    });

  } catch (error) {
    console.error("SMS Analyzer Error:", error);

    return res.status(500).json({
      error: "SMS analysis failed.",
    });
  }
});
// ======================================================
// GET USER SCANS - DASHBOARD
// ======================================================

app.get(
  "/api/scans",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Invalid user authentication.",
        });
      }

      const scans = await Scan.find({
        userId,
      })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      return res.status(200).json({
        success: true,
        scans,
      });
    } catch (error) {
      console.error(
        "❌ Dashboard Scans Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        error: "Unable to retrieve scan data.",
      });
    }
  }
);


// ======================================================
// UNKNOWN API ROUTE
// ======================================================

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    error:
      `API route not found: ${req.method} ${req.originalUrl}`,
  });
});


// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use(
  (err, req, res, next) => {
    console.error(
      "❌ Server Error:",
      err
    );

    res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
);


// ======================================================
// START SERVER
// ======================================================

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(
      `🚀 FraudLens Backend running on http://localhost:${PORT}`
    );

    console.log(
      `📡 Health: http://localhost:${PORT}/api/health`
    );
  });
}

startServer();