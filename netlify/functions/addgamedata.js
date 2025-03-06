const { MongoClient } = require("mongodb");

const mongoURI = process.env.MONGO_URI; // The MongoDB URI
const dbName = "EvoVisionDB";
const collectionName = "AdBoards";

exports.handler = async (event, context) => {
    if (event.httpMethod === "POST") {
        try {
            const { gameID, ownerID, frontBoardImage, backBoardImage, userAds, evoqAds } = JSON.parse(event.body);

            const mongoClient = new MongoClient(mongoURI);
            await mongoClient.connect();
            const db = mongoClient.db(dbName);
            const collection = db.collection(collectionName);

            // Check if the game already exists in the database
            const existingGame = await collection.findOne({ gameID });

            if (existingGame) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: "Game already exists in the database" }),
                };
            }

            // Create a new entry for the game
            const newGameData = {
                gameID,
                ownerID,
                evoqAds: evoqAds || [],  // Default empty array if not provided
                userAds: userAds || [],  // Default empty array if not provided
                frontBoardImage: frontBoardImage || "rbxassetid://defaultFrontImage",  // Default image if not provided
                backBoardImage: backBoardImage || "rbxassetid://defaultBackImage",  // Default image if not provided
                active: true,
                suspended: false,
                blacklisted: false,
                createdAt: new Date(),
            };

            await collection.insertOne(newGameData);

            await mongoClient.close();

            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, message: "New game added to the database" }),
            };
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to add game data" }),
            };
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }
};
