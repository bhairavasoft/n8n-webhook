import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import { uploadToDrive } from "../utils/googleDrive.js";

const router = express.Router();

router.post("/aisensy", express.json(), async (req, res) => {
    try {
        console.log("📩 Incoming Message:", JSON.stringify(req.body, null, 2));

        console.log(
            "📂 Real message_content:",
            JSON.stringify(req.body?.data?.message?.message_content, null, 2)
        );

        const message = req.body?.data?.message;

        // Only process FILE messages
        if (message?.message_type === "FILE") {
            const messageContent = message?.message_content;

            console.log(
                "📂 Message Content:",
                JSON.stringify(messageContent, null, 2)
            );

            const fileUrl =
                messageContent?.file_url ||
                messageContent?.url ||
                messageContent?.document?.url;

            const fileName =
                messageContent?.file_name ||
                messageContent?.filename ||
                `${message?.userName || ''}-${message?.phone_number || ''}-${Date.now()}`;

            if (!fileUrl) {
                console.log("❌ No file URL found inside message_content");
                return res.status(200).json({
                    status: "no file url found",
                });
            }

            console.log("📥 Downloading file from:", fileUrl);

            // Ensure uploads directory exists
            const uploadsDir = path.resolve("./uploads");
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir);
            }

            const filePath = path.join(uploadsDir, fileName);

            // Download file
            const response = await axios({
                url: fileUrl,
                method: "GET",
                responseType: "stream",
            });

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
            });

            console.log("✅ File downloaded locally");

            // Upload to Google Drive
            const driveResponse = await uploadToDrive(filePath, fileName);

            console.log("☁ Uploaded to Drive:", driveResponse.id);

            // Delete local file
            fs.unlinkSync(filePath);
            console.log("🗑 Local file deleted");
        } else {
            console.log("ℹ Not a FILE message, skipping...");
        }

        return res.status(200).json({
            status: "success",
            received: true,
        });
    } catch (err) {
        console.error("❌ Webhook Error:", err);
        return res.status(500).json({
            error: "Server error",
        });
    }
});

export default router;