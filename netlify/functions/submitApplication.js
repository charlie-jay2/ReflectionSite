exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {
        // Dynamically import 'node-fetch' since it's an ESM module
        const { default: fetch } = await import('node-fetch');

        const { discordUsername, email, whyJob, benefit, experience, extraNotes } =
            JSON.parse(event.body);

        const webhookURL = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookURL) {
            throw new Error("Discord webhook URL is not configured.");
        }

        const message = {
            content: `**New Job Application**\n\n**Discord Username:** ${discordUsername}\n**Email:** ${email}\n**Why they want the job:** ${whyJob}\n**How they can benefit Reflection:** ${benefit}\n**Experience:**\n${experience}\n**Extra Notes:**\n${extraNotes || "None"}`,
        };

        const response = await fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message),
        });

        if (!response.ok) {
            throw new Error(`Failed to send webhook: ${response.statusText}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Application submitted successfully!" }),
        };
    } catch (error) {
        console.error("Error in submitApplication:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
        };
    }
};
