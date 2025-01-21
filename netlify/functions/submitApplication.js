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

        // Embed structure for Discord
        const embed = {
            title: "New Job Application",
            color: 3447003, // Green color (can be changed to match your theme)
            fields: [
                {
                    name: "Discord Username",
                    value: discordUsername,
                    inline: true,
                },
                {
                    name: "Email",
                    value: email,
                    inline: true,
                },
                {
                    name: "Why do they want the job?",
                    value: whyJob || "No response",
                },
                {
                    name: "How can they benefit Reflection?",
                    value: benefit || "No response",
                },
                {
                    name: "Experience",
                    value: experience || "No experience listed",
                },
                {
                    name: "Extra Notes",
                    value: extraNotes || "No additional notes",
                },
            ],
            footer: {
                text: "Job Application",
            },
            timestamp: new Date(),
        };

        // Sending the embed to Discord
        const response = await fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                embeds: [embed],
            }),
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
