async function testStream() {
  console.log("Starting streaming test...");
  const startTime = Date.now();
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1:8b",
        prompt: "Say 'Hello, I am ready' in exactly 5 words.",
        system: "You are HealthGenie AI, a personal health assistant.",
        stream: true,
        options: {
          num_predict: 20
        }
      })
    });

    if (!response.ok) {
      console.error("Response not ok:", response.status);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log("Stream finished.");
        break;
      }
      const timeDiff = ((Date.now() - startTime) / 1000).toFixed(2);
      const chunkText = decoder.decode(value, { stream: true });
      console.log(`[${timeDiff}s] Received chunk text:`, chunkText);
    }
  } catch (err) {
    console.error("Error during stream:", err);
  }
}

testStream();
