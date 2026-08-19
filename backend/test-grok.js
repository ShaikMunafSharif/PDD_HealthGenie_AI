import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GROK_API_KEY;

async function testGrok() {
  console.log("Testing Grok API...");
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          { role: 'user', content: 'Hello, are you working?' }
        ],
        stream: false
      })
    });

    console.log("Status:", response.status, response.statusText);
    const data = await response.text();
    console.log("Data:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

testGrok();
