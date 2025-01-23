const { MongoClient } = require("mongodb");

const mongoURI = process.env.MONGODB_URI; // Ensure your MongoDB URI is set in the environment variables
const client = new MongoClient(mongoURI);

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {
        const data = JSON.parse(event.body);

        await client.connect();
        const database = client.db("applicationsDB"); // Replace with your database name
        const collection = database.collection("applications");

        const result = await collection.insertOne(data);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Application saved", id: result.insertedId }),
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
