const { MongoClient } = require("mongodb");

const mongoURI = process.env.MONGO_URI; // The MongoDB URI
const dbName = "EvoVisionDB";
const collectionName = "AdBoards";

exports.handler = async (event, context) => {
    if (event.httpMethod === "POST") {
        try {
            const { action, gameID } = JSON.parse(event.body);
            const mongoClient = new MongoClient(mongoURI);
            await mongoClient.connect();
            const db = mongoClient.db(dbName);
            const collection = db.collection(collectionName);

            const gameData = await collection.findOne({ gameID });

            if (!gameData) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: "Game not found" }),
                };
            }

            let updated = {};
            let responseMessage = "Action performed successfully";

            switch (action) {
                case "suspend":
                    updated = { suspended: true };
                    responseMessage = `Game with ID ${gameID} suspended.`;
                    break;

                case "disable":
                    updated = { active: false };
                    responseMessage = `Game with ID ${gameID} disabled.`;
                    break;

                case "blacklist":
                    updated = { blacklisted: true };
                    responseMessage = `Game with ID ${gameID} blacklisted.`;
                    break;

                case "enable":
                    updated = { active: true, suspended: false, blacklisted: false };
                    responseMessage = `Game with ID ${gameID} enabled.`;
                    break;

                default:
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: "Invalid action" }),
                    };
            }

            await collection.updateOne({ gameID }, { $set: updated });

            await mongoClient.close();

            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, message: responseMessage }),
            };
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to perform action" }),
            };
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }
};
