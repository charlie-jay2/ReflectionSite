const { MongoClient, ObjectId } = require("mongodb");

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
        const { id, status } = JSON.parse(event.body);

        if (!id || !status) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid data" }),
            };
        }

        await client.connect();
        const database = client.db("applicationsDB");
        const collection = database.collection("applications");

        await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Status updated" }),
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
