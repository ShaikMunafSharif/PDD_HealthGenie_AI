import fetch from 'node-fetch';

const apiKey = process.env.GROK_API_KEY;

async function listModels() {
  try {
    const response = await fetch('https://api.x.ai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    console.log("Status:", response.status, response.statusText);
    const data = await response.json();
    console.log("Models:", JSON.stringify(data.data.map(m => m.id), null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

listModels();
