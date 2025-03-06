// adminAction.js - This function will handle actions like Suspend, Disable, Blacklist, Enable

const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;  // MongoDB URI (store in environment variables)
const dbName = "EvoVisionDB";  // Database name
const collectionName = "AdBoards";  // Collection name

// Handler for the serverless function
exports.handler = async (event, context) => {
    const { action, gameID, additionalData } = JSON.parse(event.body);  // Get action data from the request

    let updateData = {};

    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const collection = client.db(dbName).collection(collectionName);

        switch (action) {
            case "Suspend":
                updateData = { suspended: true, suspendedUntil: Date.now() + additionalData };
                break;
            case "Disable":
                updateData = { active: false };  // Disable EvoVision (turn off screens)
                break;
            case "Blacklist":
                updateData = { blacklisted: true };  // Blacklist the game permanently
                break;
            case "Enable":
                updateData = { active: true, suspended: false };  // Enable EvoVision
                break;
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "Invalid action." }),
                };
        }

        // Update the game's status in MongoDB
        const result = await collection.updateOne(
            { gameID },
            { $set: updateData },
            { upsert: true }
        );

        await client.close();

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: `Action ${action} applied to game ${gameID}.` }),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: "Error applying action." }),
        };
    }
};
