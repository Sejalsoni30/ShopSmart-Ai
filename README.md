# ShopSmart AI

A complete, production-style full-stack web application that acts as an AI-powered shopping assistant. It helps users discover, evaluate, compare, and choose products based on natural language requirements and budget constraints.

## Features
- **AI Shopping Assistant**: Conversational AI that remembers your requirements, budget, and context using Gemini.
- **Demo Mode**: Fully functional with a detailed "Demo Catalog" if no Gemini API key is provided.
- **Product Search & Filtering**: Advanced filtering by category, price, and rating.
- **Product Comparison**: Side-by-side comparison of up to 4 products.
- **Modern Premium UI**: Built with vanilla CSS, featuring glassmorphism, dark mode aesthetics, and micro-animations.
- **Responsive**: Fully functional on desktop, tablet, and mobile.

## Tech Stack
- **Frontend**: React, Vite, React Router, Vanilla CSS, Lucide React (Icons).
- **Backend**: Node.js, Express.js.
- **AI**: Google Gemini API (`@google/genai`).

## Project Structure
```
shopsmart-ai/
├── client/          # React Frontend (Vite)
├── server/          # Node.js/Express Backend
├── .env.example     # Environment variables template
└── README.md
```

## Setup Instructions

### 1. Environment Variables
Copy the `.env.example` file to `.env` in the root (or `server` folder depending on your setup) and fill in your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
PORT=5000
```
*Note: If no API key is provided, the application will automatically run in **Demo Mode**, using basic deterministic logic and the fictional Demo Catalog.*

### 2. Backend Setup
```bash
cd server
npm install
npm start
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Security Notes
- The Gemini API key is **only** used on the server-side.
- No API keys are exposed to the frontend bundles.
- All AI responses are treated as untrusted data and verified when applicable.

## Known Limitations
- The product catalog is fictional (Demo Catalog) for UI testing purposes.
- In Demo Mode (without Gemini), the chat assistant uses very basic keyword matching.
