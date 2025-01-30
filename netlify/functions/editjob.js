const { MongoClient, ObjectId } = require("mongodb");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        const { jobId, title, description, requirements, applicationLink, applicationDeadline } = JSON.parse(event.body);

        if (!jobId) {
            return { statusCode: 400, body: "Job ID is required" };
        }

        // Connect to MongoDB
        await client.connect();
        const db = client.db("reflection_jobs");
        const collection = db.collection("jobs");

        // Update the job details
        const result = await collection.updateOne(
            { _id: new ObjectId(jobId) },
            {
                $set: {
                    title,
                    description,
                    requirements,
                    applicationLink,
                    applicationDeadline: new Date(applicationDeadline),
                },
            }
        );

        if (result.matchedCount === 0) {
            return { statusCode: 404, body: "Job not found" };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Job updated successfully!" }),
        };
    } catch (error) {
        console.error("Error updating job:", error);
        return { statusCode: 500, body: "Internal Server Error" };
    } finally {
        await client.close();
    }
};
