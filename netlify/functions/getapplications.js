const { MongoClient } = require("mongodb");

const mongoURI = process.env.MONGODB_URI;
const client = new MongoClient(mongoURI);

exports.handler = async () => {
    try {
        await client.connect();
        const database = client.db("applicationsDB"); // Replace with your database name
        const collection = database.collection("applications");

        const applications = await collection.find().toArray();

        return {
            statusCode: 200,
            body: JSON.stringify(applications),
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
