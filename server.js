import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// [CORS]
const allowedOrigins = process.env.CLIENT_URLS 
  ? process.env.CLIENT_URLS.split(",") 
  : ["http://localhost:22700"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy error"), false);
    }
  },
  methods: ["GET", "POST", "DELETE"],
  credentials: true
}));

// [Static files]
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// [Read body from POST]
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// [Routes]
import { chatRouter } from "./src/routes/all-router.js";
app.use("/chat", chatRouter);

// [SPA] Always return index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// [Run server]
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on https://english-chat.onrender.com`);
})