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
        const form = new formidable.IncomingForm(); // Use the correct import method
        form.parse(event.body, async (err, fields, files) => {
            if (err) {
                console.error("Error parsing form data:", err);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ message: "Error parsing form data", error: err.message }),
                };
            }

            const file = files.cv; // The uploaded file should be here
            if (!file) {
                throw new Error("No file found in the request.");
            }

            const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            if (!validTypes.includes(file.mimetype)) {
                throw new Error("Invalid file type. Only PDF and DOCX are allowed.");
            }

            // Send the file to Discord webhook
            const formData = new FormData();
            formData.append("file", fs.createReadStream(file.filepath), file.originalFilename);

            const webhookURL = process.env.DISCORD_WEBHOOK_URL;

            if (!webhookURL) {
                throw new Error("Discord webhook URL is not configured.");
            }

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
        });
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
