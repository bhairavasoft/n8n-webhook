import express from "express";
import router from "./routes/aisensyWebhook.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use("/webhook", router);

// console.log(process.env.GOOGLE_SERVICE_ACCOUNT)

app.get("/health", (req, res) => {
    return res.status(200).json({
        status: "ok",
        message: "Webhook service is running 🚀",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
