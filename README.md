# BailBridge / Namma Nyaya Agent ⚖️

AI-powered legal assistance platform designed to help undertrial families navigate the Indian justice system under **BNS/BNSS 2023**.

Built as a rapid innovation sprint project focused on reducing the **information gap** faced by marginalized families during arrests, bail hearings, and legal procedures.

---

## ✨ Features

* 🤖 Multi-agent AI legal workflow
* ⚖️ Bail eligibility analysis
* 🛡️ Rights & procedural violation checks
* 📄 FIR upload + document analysis
* 🗣️ Multilingual intake (English, Hindi, Kannada)
* 📍 e-Seva / DLSA legal aid routing
* 🔒 Evidence Vault with SHA-256 hashing
* 📑 Automated legal document generation
* 💬 Persistent multi-message legal conversations

---

## 🧠 Legal Grounding

Integrated with:

* BNSS 2023
* BNS 2023
* Article 21, 22, 39A
* D.K. Basu Guidelines
* NALSA legal aid framework

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* Motion animations

### Backend

* Node.js
* Express
* Gemini AI
* Firebase

Built using Gemini, Firebase, Google Cloud Run, and a grounded RAG pipeline based on BNS and BNSS legal texts, BailBridge combines AI, legal accessibility, and procedural support inside one platform.


---

## 🚀 Run Locally

### Install dependencies

```bash id="j33nrd"
npm install
```

### Create `.env`

```env id="odrff7"
GEMINI_API_KEY=your_key
GOOGLE_MAPS_PLATFORM_KEY=your_key
APP_URL=http://localhost:3000
```

### Start server

```bash id="yn7c3i"
npm run dev
```

---

## ⚠️ Disclaimer

This platform provides legal information, not legal advice.
Always consult a qualified advocate before taking legal action.

---

## ❤️ Vision

BailBridge aims to make legal rights, bail procedures, and access to justice more understandable and accessible for vulnerable communities across India.
