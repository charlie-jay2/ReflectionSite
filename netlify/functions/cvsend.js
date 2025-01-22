const { FormData } = require("formdata-node");
const { fetch } = require("undici");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {
        // Get the CV file from the request body
        const formData = new FormData();
        const cvFile = event.body.cv; // Assuming the file is sent as a multipart form field
        if (!cvFile) {
            throw new Error("No file found in the request.");
        }

        // Validate the file type
        const validTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (!validTypes.includes(cvFile.type)) {
            throw new Error("Invalid file type. Only PDF and DOCX are allowed.");
        }

        // Create a new FormData object for sending the file to Discord
        formData.append("file", cvFile, cvFile.name);

        // Get the Discord webhook URL from environment variables
        const webhookURL = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookURL) {
            throw new Error("Discord webhook URL is not configured.");
        }

        // Send the form data to Discord
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
