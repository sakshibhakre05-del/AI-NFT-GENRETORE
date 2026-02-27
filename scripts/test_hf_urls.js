const https = require('https');
require('dotenv').config({ path: './backend/.env' });

const token = process.env.HUGGING_FACE_API_KEY;
const model = 'stabilityai/stable-diffusion-2';

const urls = [
    `https://api-inference.huggingface.co/models/${model}`,
    `https://router.huggingface.co/hf-inference/models/${model}`,
    `https://router.huggingface.co/${model}`,
    `https://router.huggingface.co/models/${model}`
];

async function test() {
    for (const url of urls) {
        console.log(`Testing URL: ${url}`);
        try {
            const result = await new Promise((resolve, reject) => {
                const req = https.request(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => resolve({ status: res.statusCode, data }));
                });
                req.on('error', reject);
                req.write(JSON.stringify({ inputs: 'test prompt' }));
                req.end();
            });
            console.log(`Status: ${result.status}`);
            console.log(`Data (first 100 chars): ${result.data.substring(0, 100)}\n`);
        } catch (e) {
            console.log(`Error: ${e.message}\n`);
        }
    }
}

test();
