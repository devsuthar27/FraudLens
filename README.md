# 🔐 FraudLens
### Cyber Fraud Detection and Awareness Platform

FraudLens is a full-stack cybersecurity web application designed to help users identify potential online fraud through suspicious URLs, emails, and SMS messages.

## 🚀 Features

- **URL Scanner:** Analyzes URLs using VirusTotal API.
- **Email Analyzer:** Uses rule-based detection to identify suspicious email content.
- **SMS Analyzer:** Detects potential SMS scams using predefined fraud indicators.
- **User Authentication:** JWT-based authentication.
- **Dashboard:** Overview of scanning activities.
- **Scan History:** Stores and displays previous scan records.

## 🛠️ Tech Stack

**Frontend:** React.js, Vite, React Router DOM

**Backend:** Node.js, Express.js

**Database:** MongoDB, Mongoose

**Security & Integration:** JWT, bcrypt, VirusTotal API

## 📁 Project Structure

```text
FraudLens/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd FraudLens
```

### 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend setup

Open another terminal:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
VIRUSTOTAL_API_KEY=your_virustotal_api_key
```

Start the backend:

```bash
npm start
```

## 🔍 How It Works

1. Users authenticate through the application.
2. Users submit URLs, emails, or SMS messages.
3. The backend processes the submitted content.
4. VirusTotal provides external security intelligence for URL analysis.
5. Rule-based logic evaluates email and SMS content.
6. Results are displayed and scan records are stored in MongoDB.

## ⚠️ Disclaimer

FraudLens provides automated security analysis to identify potentially suspicious content. A result showing no detected threats does not guarantee that the content is completely safe.

## 👨‍💻 Developer

**Dev Suthar**  
B.Tech Computer Science Engineering

*Developed as an academic capstone project.*