const { MongoClient } = require("mongodb");

const mongoURI = process.env.MONGODB_URI;
const client = new MongoClient(mongoURI);

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {
        const { username } = JSON.parse(event.body);

        // Get user's IP address
        const ipAddress =
            event.headers["x-forwarded-for"] || event.headers["client-ip"] || "Unknown";

        // Generate a session token and expiration time
        const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString("base64");
        const loginTime = new Date();
        const expirationTime = new Date(loginTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours

        await client.connect();
        const database = client.db("applicationsDB"); // Replace with your database name
        const collection = database.collection("sessions");

        // Save session data
        await collection.insertOne({
            username,
            ipAddress,
            sessionToken,
            loginTime,
            expirationTime,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Session created", sessionToken }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" }),
        };
    } finally {
        await client.close();
    }
};
