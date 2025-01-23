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
        const { username, password } = JSON.parse(event.body);

        await client.connect();
        const database = client.db("applicationsDB"); // Replace with your database name
        const collection = database.collection("logins");

        // Find user with matching username and password
        const user = await collection.findOne({ username, password });

        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Invalid username or password" }),
            };
        }

        // Call the session creation function
        const sessionResponse = await fetch("/.netlify/functions/sessionschema", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
        });

        const sessionData = await sessionResponse.json();

        return {
            statusCode: sessionResponse.status,
            body: JSON.stringify(sessionData),
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
