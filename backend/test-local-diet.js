import fetch from 'node-fetch';

async function testDiet() {
  try {
    const res = await fetch('http://localhost:5000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: 'diet',
        prompt: 'Symptoms: fever, headache\nSeverity: 6/10'
      })
    });
    
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text);
  } catch (e) {
    console.error(e);
  }
}

testDiet();
