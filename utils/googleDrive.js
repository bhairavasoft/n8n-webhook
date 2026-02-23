import { google } from "googleapis";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

export const uploadToDrive = async (filePath, fileName) => {
    const folderId = process.env.FOLDER_ID;

    const response = await drive.files.create({
        requestBody: {
            name: fileName,
            parents: [folderId],
        },
        media: {
            body: fs.createReadStream(filePath),
        },
    });

    return response.data;
};

async function testAuth() {
    try {
        const authClient = await auth.getClient();
        const drive = google.drive({ version: "v3", auth: authClient });

        // Just try listing 1 file
        const res = await drive.files.list({
            pageSize: 1,
            fields: "files(id, name)",
        });

        console.log("✅ Credentials are valid!");
        console.log("Response:", res.data);
    } catch (error) {
        console.error("❌ Credentials are NOT valid");
        console.error(error.message);
    }
}

testAuth();