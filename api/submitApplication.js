export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, discord_username, position, message } = req.body;

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

        const response = await fetch(discordBotAPI, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Failed to communicate with Discord bot.');
        }

        res.status(200).json({ success: true, message: 'Application sent to Discord bot!' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
