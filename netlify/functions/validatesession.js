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
        const { sessionToken } = JSON.parse(event.body);

        await client.connect();
        const database = client.db("applicationsDB"); // Replace with your database name
        const collection = database.collection("sessions");

        const session = await collection.findOne({ sessionToken });

        if (!session || new Date() > new Date(session.expirationTime)) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Session expired or invalid" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Session valid" }),
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
