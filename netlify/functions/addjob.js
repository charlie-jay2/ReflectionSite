const { MongoClient } = require("mongodb");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        const { title, description, requirements, applicationLink, applicationDeadline } = JSON.parse(event.body);

        // Connect to MongoDB
        await client.connect();
        const db = client.db("reflection_jobs");
        const collection = db.collection("jobs");

        // Insert the job
        const result = await collection.insertOne({
            title,
            description,
            requirements,
            applicationLink,
            applicationDeadline: new Date(applicationDeadline),
            createdAt: new Date(),
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Job added successfully!", id: result.insertedId }),
        };
    } catch (error) {
        console.error("Error adding job:", error);
        return { statusCode: 500, body: "Internal Server Error" };
    } finally {
        await client.close();
    }
};
