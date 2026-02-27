const { HfInference } = require('@huggingface/inference')
require('dotenv').config({ path: './backend/.env' });

const hf = new HfInference(process.env.HUGGING_FACE_API_KEY)

async function test() {
    console.log('Testing with @huggingface/inference library...');
    try {
        const result = await hf.textToImage({
            model: 'black-forest-labs/FLUX.1-schnell',
            inputs: 'a digital art of a neon cat',
        })
        console.log('✅ Success! Image generated.');
        console.log('Result length:', result.size, 'bytes');
    } catch (e) {
        console.error('❌ Failed:', e.message);
        if (e.response) {
            console.error('Response Status:', e.response.status);
        }
    }
}
test()
