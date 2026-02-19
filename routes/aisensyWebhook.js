import express from "express";
import crypto from "crypto";

const router = express.Router();

// Secret key from AiSensy dashboard
const AISENSY_SECRET = "test-signature-123";

router.post("/aisensy", express.json(), (req, res) => {
    try {
        // const signature = req.headers["x-aisensy-signature"];

        // Convert body back to raw string for signature check
        // const rawBody = JSON.stringify(req.body);

        // Generate expected signature
        // const expectedSignature = crypto
        //     .createHmac("sha256", AISENSY_SECRET)
        //     .update(rawBody)
        //     .digest("hex");

        // console.log(signature)
        // console.log(expectedSignature)

        // if (signature !== expectedSignature) {
        //     console.log("❌ Invalid Signature");
        //     return res.status(401).json({ error: "Unauthorized" });
        // }

        console.log("✅ Webhook Verified Successfully!");
        console.log("------------------------")
        console.log("------------------------")

        // Extract message
        const message = req.body?.data?.message;

        console.log("Incoming Header:", req.headers);
        console.log("------------------------")
        console.log("------------------------")
        console.log("📩 Incoming Message:", message);
        console.log("------------------------")
        console.log("------------------------")
        console.log("------------------------")
        console.log("------------------------")
        console.log("------------------------")
        console.log("------------------------")
        console.log("------------------------")
        console.log("------------------------")

        return res.status(200).json({
            status: "success",
            received: true,
        });
    } catch (err) {
        console.error("Webhook Error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;
