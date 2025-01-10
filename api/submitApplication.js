export default async function handler(req, res) {
    console.log(`Received ${req.method} request at /api/submitApplication`);

    // Handle GET requests for debugging or informational purposes
    if (req.method === 'GET') {
        return res.status(200).json({ message: 'Welcome to the submitApplication API. Use POST to submit an application.' });
    }

    // Allow only POST requests for actual application submissions
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, discord_username, position, message } = req.body;

        // Validate the incoming data
        if (!name || !email || !discord_username || !position || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const discordBotAPI = process.env.DISCORD_BOT_API; // Discord bot's API endpoint

        const payload = {
            name,
            email,
            discord_username,
            position,
            message,
        };

        // Send data to the Discord bot API
        const response = await fetch(discordBotAPI, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        // Handle errors from the Discord bot API
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Discord bot API error: ${errorText}`);
            throw new Error('Failed to communicate with Discord bot.');
        }

        // Respond to the client with success
        res.status(200).json({ success: true, message: 'Application sent to Discord bot!' });
    } catch (error) {
        console.error('Error handling application:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
