# Teammate

A blockchain-powered sports and social platform. there is option to connect your wallet its a demonstration project to connect 
different wallet with modal.

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-%23FFDD00.svg?style=flat-square&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/khemrregmii)

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (for backend)
- [Python](https://www.python.org/) (if any Python scripts are used)
- [Git](https://git-scm.com/)

## Project Structure

```
teammate/
  Backend/      # Node.js/Express backend
  Frontend/     # React frontend (Vite)
  README.md
```

## 1. Clone the Repository

```bash
git clone <your-repo-url>
cd teammate
```

## 2. Setup Environment Variables

### Backend

- Copy `.env.example` to `.env` in `Backend/` and fill in your values (MongoDB URL, JWT secret, etc).

### Frontend

- Copy `.env.example` to `.env` in `Frontend/` and set `VITE_API_BASE_URL` to your backend URL (e.g. `http://127.0.0.1:5000`).

## 3. Install Dependencies

### Backend

```bash
cd Backend
npm install
```

### Frontend

```bash
cd ../Frontend
npm install
```

## 4. Run the Project

### Start Backend

```bash
cd Backend
npm start
# or
node app.js
```

The backend will run on [http://127.0.0.1:5000](http://127.0.0.1:5000) by default.

### Start Frontend

```bash
cd ../Frontend
npm run dev
```

The frontend will run on [http://localhost:3002](http://localhost:3002) or the port specified in your `.env`.

## 5. Open in Browser

Visit [http://localhost:3002](http://localhost:3002) to use the app.

## Output Demo

Watch a demo of the project here:  
👉 [https://www.loom.com/share/c5dd238419d84a82a341ee5c9c1032df?sid=f9c99f38-87fb-42a8-8fe6-4fa7be840344](https://www.loom.com/share/c5dd238419d84a82a341ee5c9c1032df?sid=f9c99f38-87fb-42a8-8fe6-4fa7be840344)

## Troubleshooting

- Ensure MongoDB is running and accessible.
- Make sure your `.env` files are configured correctly.
- If you encounter CORS issues, check backend CORS settings.
- For wallet integrations, ensure browser extensions (MetaMask, Phantom, etc.) are installed.

---

If you like this project, [buy me a coffee!](https://buymeacoffee.com/khemrregmii) ☕

## License

MIT

