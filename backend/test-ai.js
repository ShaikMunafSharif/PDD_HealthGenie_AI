import fetch from 'node-fetch';

async function test() {
  const res = await fetch('http://127.0.0.1:5000/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Symptoms: chest pain', context: 'symptoms' })
  });
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}
test();
