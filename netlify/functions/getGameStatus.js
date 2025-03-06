const { MongoClient } = require("mongodb");

const mongoURI = process.env.MONGO_URI; // The MongoDB URI
const dbName = "EvoVisionDB";
const collectionName = "AdBoards";

exports.handler = async (event, context) => {
    if (event.httpMethod === "POST") {
        try {
            const { gameID } = JSON.parse(event.body);
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

            await mongoClient.close();

            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    data: {
                        active: gameData.active,
                        suspended: gameData.suspended,
                        blacklisted: gameData.blacklisted,
                    },
                }),
            };
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to retrieve game status" }),
            };
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }
};
