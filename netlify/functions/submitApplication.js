const fetch = require("node-fetch");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { name, email, coverLetter } = JSON.parse(event.body);

    const webhookURL = process.env.DISCORD_WEBHOOK_URL;

    const message = {
        content: `New Job Application\n\n**Name:** ${name}\n**Email:** ${email}\n**Cover Letter:**\n${coverLetter}`,
    };

    try {
        await fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message),
        });

        return { statusCode: 200, body: "Application submitted successfully!" };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: "Error submitting application." };
    }
};
