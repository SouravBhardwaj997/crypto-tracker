# 📈 Crypto Tracker

A full-stack cryptocurrency tracking application that fetches real-time market data, stores historical snapshots using a cron job, and displays interactive charts through a modern React frontend.

---

## 🚀 Tech Stack

### **Frontend**

- React (Vite)
- Axios
- React Router
- Recharts (Charts & Visualization)

### **Backend**

- Node.js
- Express
- MongoDB + Mongoose
- Axios
- node-cron
- CoinGecko API

---

# 🛠️ Setup & Installation

## ⚙️ Backend Setup (`/server`)

### 1. Navigate to backend

```bash
cd server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create .env file

Inside /server:

```bash
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 4. Start the server file

Inside /server:

```bash
npm run dev
```

Backend available at:
http://localhost:5000

## 💻 Frontend Setup (`/client`)

### 1. Navigate to frontend

```bash
cd client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create .env file

Inside /client:

```bash
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Start the Frontend Server

Inside /client:

```bash
npm run dev
```

Backend available at:
http://localhost:5173

# ⏱️ Cron Job Details

Location:/server/src/cron/cryptoCron.js

## 🔄 What the Cron Job Does (Runs Every 1 Minute)

- Fetches latest top cryptocurrency data from **CoinGecko API**
- Stores historical snapshots in the `History` MongoDB collection
- Updates the most recent prices in the `Current` collection
- Uses in-memory caching to minimize API calls and prevent rate-limit errors

## 🕒 Cron Expression

```js
cron.schedule("*/1 * * * *", async () => {
  // Executes every 1 minute
});
```

⭐ Why the Cron Job is Useful

Enables historical price charts on the frontend

Keeps data updated without manual API calls

Ensures app remains functional even if CoinGecko API rate-limits

Maintains clean "current vs. historical" separation in the database
