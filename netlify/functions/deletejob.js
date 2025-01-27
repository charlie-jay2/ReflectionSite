const { MongoClient, ObjectId } = require("mongodb");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        const { jobId } = JSON.parse(event.body);

        // Connect to MongoDB
        await client.connect();
        const db = client.db("reflection_jobs");
        const collection = db.collection("jobs");

        // Delete the job by ID
        const result = await collection.deleteOne({ _id: new ObjectId(jobId) });

        if (result.deletedCount === 0) {
            return { statusCode: 404, body: "Job not found" };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Job deleted successfully!" }),
        };
    } catch (error) {
        console.error("Error deleting job:", error);
        return { statusCode: 500, body: "Internal Server Error" };
    } finally {
        await client.close();
    }
};
