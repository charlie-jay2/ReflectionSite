const { MongoClient } = require("mongodb");

const mongoURI = process.env.MONGO_URI; // Make sure this is set in your Netlify environment variables
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

            switch (action) {
                case "suspend":
                    // Add suspension logic (e.g., add time)
                    await collection.updateOne(
                        { gameID },
                        { $set: { suspended: true } }
                    );
                    break;

                case "disable":
                    // Disable the board images, make them black
                    await collection.updateOne(
                        { gameID },
                        { $set: { active: false } }
                    );
                    break;

                case "blacklist":
                    // Blacklist the game
                    await collection.updateOne(
                        { gameID },
                        { $set: { blacklisted: true } }
                    );
                    break;

                case "enable":
                    // Re-enable the board images
                    await collection.updateOne(
                        { gameID },
                        { $set: { active: true, suspended: false, blacklisted: false } }
                    );
                    break;

                default:
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: "Invalid action" }),
                    };
            }

            await mongoClient.close();
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true }),
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
