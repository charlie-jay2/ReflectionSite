const { MongoClient, ObjectId } = require("mongodb");

exports.handler = async (event) => {
    if (event.httpMethod !== "GET") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        const { id } = event.queryStringParameters; // Get the job ID from query parameters

        if (!id) {
            return { statusCode: 400, body: "Job ID is required" };
        }

        // Connect to MongoDB
        await client.connect();
        const db = client.db("reflection_jobs");
        const collection = db.collection("jobs");

        // Find the job by ID
        const job = await collection.findOne({ _id: new ObjectId(id) });

        if (!job) {
            return { statusCode: 404, body: "Job not found" };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(job),
        };
    } catch (error) {
        console.error("Error fetching job:", error);
        return { statusCode: 500, body: "Internal Server Error" };
    } finally {
        await client.close();
    }
};
