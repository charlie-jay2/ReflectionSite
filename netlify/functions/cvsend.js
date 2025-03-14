const formidable = require('formidable');
const { fetch } = require('undici');
const fs = require('fs');

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {
        const form = new formidable.IncomingForm();

        const data = await new Promise((resolve, reject) => {
            form.parse(event, (err, fields, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ fields, files });
                }
            });
        });

        const file = data.files.cv ? data.files.cv[0] : null;
        if (!file) {
            throw new Error("No file found in the request.");
        }

        // Validate file type
        const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (!validTypes.includes(file.headers['content-type'])) {
            throw new Error("Invalid file type. Only PDF and DOCX are allowed.");
        }

        // Send the file to Discord Webhook
        const formData = new FormData();
        formData.append("file", fs.createReadStream(file.filepath), file.originalFilename);

        const webhookURL = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookURL) {
            throw new Error("Discord webhook URL is not configured.");
        }

        // Send the file to Discord
        const response = await fetch(webhookURL, {
            method: "POST",
            headers: formData.getHeaders(),
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Failed to send the file to Discord: ${response.statusText}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "CV uploaded successfully!" }),
        };
    } catch (error) {
        console.error("Error in cvsend:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal Server Error",
                error: error.message,
            }),
        };
    }
};
