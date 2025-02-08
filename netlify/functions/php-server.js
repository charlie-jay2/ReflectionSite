const { exec } = require("child_process");

exports.handler = async (event) => {
    return new Promise((resolve) => {
        exec("php index.php", (error, stdout, stderr) => {
            if (error) {
                resolve({
                    statusCode: 500,
                    body: JSON.stringify({ error: stderr || error.message }),
                });
            } else {
                resolve({
                    statusCode: 200,
                    headers: { "Content-Type": "text/html" },
                    body: stdout,
                });
            }
        });
    });
};
