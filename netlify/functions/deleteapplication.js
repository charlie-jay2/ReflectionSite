const { MongoClient, ObjectId } = require("mongodb");

const mongoURI = process.env.MONGODB_URI;
const client = new MongoClient(mongoURI);

exports.handler = async (event) => {
    if (event.httpMethod === "POST") {
        try {
            const { id } = JSON.parse(event.body);

            await client.connect();
            const database = client.db("applicationsDB");
            const collection = database.collection("applications");

            const result = await collection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 1) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: "Application deleted successfully" }),
                };
            } else {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: "Application not found" }),
                };
            }
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal Server Error" }),
            };
        } finally {
            await client.close();
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }
};
