import express from "express";
import router from "./routes/aisensyWebhook.js";

const app = express();

app.use("/webhook", router);

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
