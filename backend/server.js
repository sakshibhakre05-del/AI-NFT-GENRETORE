require("dotenv").config();
const http = require("http");
const https = require("https");

const { HfInference } = require("@huggingface/inference");

const PORT = process.env.PORT || 8000;
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

const hf = new HfInference(HUGGING_FACE_API_KEY);

const server = http.createServer(async (req, res) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === "POST" && req.url === "/api/generate") {
        let body = "";

        req.on("data", chunk => (body += chunk.toString()));
        req.on("end", async () => {
            try {
                const { description } = JSON.parse(body);

                console.log(`Generating image for: "${description}"...`);

                const blob = await hf.textToImage({
                    model: "black-forest-labs/FLUX.1-schnell",
                    inputs: description,
                });

                const buffer = Buffer.from(await blob.arrayBuffer());

                res.writeHead(200, { "Content-Type": "image/png" });
                res.end(buffer);

                console.log("✅ Image generated successfully.");
            } catch (err) {
                console.error("AI Generation Error:", err.message);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    error: "AI Generation failed",
                    details: err.message
                }));
            }
        });
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

server.listen(PORT, () => {
    console.log(`✅ AI server running on http://localhost:${PORT}`);
});