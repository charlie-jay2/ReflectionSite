const { MongoClient } = require("mongodb");

exports.handler = async () => {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        // Connect to MongoDB
        await client.connect();
        const db = client.db("reflection_jobs");
        const collection = db.collection("jobs");

        // Fetch all jobs
        const jobs = await collection.find().toArray();

        return {
            statusCode: 200,
            body: JSON.stringify(jobs),
        };
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return { statusCode: 500, body: "Internal Server Error" };
    } finally {
        await client.close();
    }
};
