import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// [Development: Morgan]
if (process.env.ENV === "development"){
    app.use(morgan("dev"));
};

// [Static files]
const distPath = path.join(__dirname, "dist");
app.use(express.static(path.join(__dirname, "dist")));

// [Read body from POST]
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// [Routes]
import { chatRouter } from "./routes/all-router.js";
app.use("/chat", chatRouter);

// [Single-page] Always return index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

// [Global Error Handler]
app.use((err, req, res, next) => {
    console.error("[Error]: ", err);

    if (err.response) {
        return res.status(err.response.status).json({
            error: "API Error",
            message: err.response.data
        });
    };

    return res.status(500).json({
        error: "Internal Server Error",
        message: err.message || "Unexpected error"
    });
});

// [Run server]
const PORT = process.env.PORT || 22700;
app.listen(PORT, () => {
    if (process.env.ENV === "development"){
        console.log(`Server is running on http://localhost:${PORT}`);
    } else {
        console.log(`Server is running on https://english-chat.onrender.com`);
    };
})