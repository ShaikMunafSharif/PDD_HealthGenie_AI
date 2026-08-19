// ━━━ OLLAMA AI SERVICE ━━━
// Streaming integration with llama3.1:8b for HealthGenie AI

const OLLAMA_BASE = 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3.1:8b';

const SYSTEM_PROMPTS = {
  general: `You are HealthGenie AI, a compassionate and knowledgeable personal health assistant. You provide helpful, accurate health guidance based on established medical knowledge. Always recommend consulting a real doctor for serious conditions. Be empathetic, clear, and concise. Format your responses with clear sections when appropriate.`,
  
  symptoms: `You are HealthGenie AI, an expert medical symptom analyzer. When analyzing symptoms:
1. List the most likely conditions with approximate confidence levels
2. Assess severity (mild/moderate/severe)  
3. Recommend specific actions
4. Clearly state when to see a doctor urgently
5. Suggest relevant specialist types
Always remind users you're an AI assistant and they should consult a real doctor for diagnosis.`,

  diet: `You are HealthGenie AI, a nutrition and diet expert. Create personalized meal plans considering:
- User's health conditions, allergies, and dietary restrictions
- Caloric needs based on age, weight, height, and activity level
- Balanced macronutrient ratios
- Local food availability
Provide specific meals with portions. Be practical and encouraging.`,

  exercise: `You are HealthGenie AI, a fitness and exercise specialist. Recommend exercises that are:
- Safe for the user's health conditions
- Appropriate for their fitness level
- Progressive in difficulty
- Include warm-up and cool-down
Provide sets, reps, and rest periods. Include safety warnings where needed.`,

  women: `You are HealthGenie AI, specialized in women's health. Provide empathetic, evidence-based guidance on:
- Menstrual cycle management and tracking
- PCOS care and management
- Hormone-aware skincare
- Women's nutrition needs
Be sensitive, informative, and non-judgmental.`,

  pregnancy: `You are HealthGenie AI, a pregnancy care specialist. Provide safe, evidence-based guidance for:
- Trimester-specific advice
- Safe exercises during pregnancy
- Nutrition requirements by week
- Warning signs to watch for
Always emphasize the importance of regular prenatal checkups.`,

  doctor: `You are HealthGenie AI, a medical referral assistant. Based on the user's symptoms and health profile:
- Recommend the most appropriate type of doctor/specialist
- Explain why that specialist is recommended
- Suggest questions to ask during the visit
- Indicate urgency level`,

  firstAid: `You are HealthGenie AI, a first aid expert. Provide clear, step-by-step first aid instructions that are:
- Easy to follow in emergency situations
- Based on established first aid protocols
- Include when to call emergency services
Keep instructions concise and action-oriented.`,

  healthScore: `You are HealthGenie AI, a health analytics expert. Analyze the user's health data to:
- Identify strengths and areas for improvement
- Provide specific, actionable tips
- Set realistic short-term goals
- Celebrate progress and milestones
Be motivating and data-driven.`
};

export async function checkAIStatus() {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return { available: false, models: [] };
    const data = await res.json();
    const available = data.status === 'ok';
    const models = [];
    if (data.providers?.grok) models.push('grok-beta');
    return { available, models };
  } catch {
    return { available: false, models: [] };
  }
}

export async function* streamHealthGenie(prompt, context = 'general', options = {}) {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: options.signal,
      body: JSON.stringify({
        prompt,
        context,
        options
      })
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        if (buffer.trim()) {
          try {
            const data = JSON.parse(buffer);
            if (data.response) {
              fullResponse += data.response;
              yield { token: data.response, full: fullResponse, done: true };
            }
          } catch {
            // ignore trailing incomplete JSON
          }
        }
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const data = JSON.parse(line);
          if (data.response) {
            fullResponse += data.response;
            yield { token: data.response, full: fullResponse, done: false };
          }
          if (data.done) {
            yield { token: '', full: fullResponse, done: true };
          }
        } catch (err) {
          // Skip malformed line
        }
      }
    }
  } catch (error) {
    console.warn("[HealthGenie AI] Service stream warning:", error.message);
    const fallbackText = getFallbackResponse(context, prompt);
    const chunks = fallbackText.match(/\S+|\s+/g) || [];
    let fullResponse = '';
    for (let i = 0; i < chunks.length; i++) {
      fullResponse += chunks[i];
      yield { token: chunks[i], full: fullResponse, done: false };
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    yield { token: '', full: fullResponse, done: true };
  }
}

// Non-streaming version for simple queries
export async function askHealthGenie(prompt, context = 'general') {
  let result = '';
  for await (const chunk of streamHealthGenie(prompt, context)) {
    result = chunk.full;
  }
  return result;
}

function getFallbackResponse(context, prompt) {
  const pLower = (prompt || '').trim().toLowerCase();

  const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'who are you', 'what can you do', 'help'];
  if (greetings.some(g => pLower === g || pLower.startsWith(g + ' ') || pLower.endsWith(' ' + g) || pLower === g + '!')) {
    return "Hello! 👋 I am HealthGenie AI, your personal clinical health assistant.\n\nHow can I help you today? Feel free to ask about your symptoms, meal recommendations, workout plans, or general wellness advice!";
  }
  
  if (context === 'diet') {
    if (pLower.includes('raw json format')) {
      return JSON.stringify({
        Monday: { breakfast: "Oatmeal with berries", lunch: "Grilled chicken salad", dinner: "Baked salmon", snack: "Apple" },
        Tuesday: { breakfast: "Smoothie bowl", lunch: "Quinoa salad", dinner: "Turkey meatballs", snack: "Almonds" },
        Wednesday: { breakfast: "Avocado toast", lunch: "Lentil soup", dinner: "Grilled tofu", snack: "Yogurt" },
        Thursday: { breakfast: "Eggs and spinach", lunch: "Tuna wrap", dinner: "Chicken stir-fry", snack: "Carrots" },
        Friday: { breakfast: "Protein pancakes", lunch: "Mixed bean salad", dinner: "Shrimp pasta", snack: "Rice cakes" },
        Saturday: { breakfast: "Chia pudding", lunch: "Turkey sandwich", dinner: "Beef stew", snack: "Cheese string" },
        Sunday: { breakfast: "Fruit salad", lunch: "Chicken Caesar", dinner: "Roasted veggie bowl", snack: "Dark chocolate" }
      });
    }
    return "I'm unable to generate a personalized meal plan right now. Here's a general healthy eating guide:\n\n**Breakfast:** Oatmeal with fruits and nuts\n**Lunch:** Grilled chicken salad with mixed vegetables\n**Snack:** Greek yogurt with berries\n**Dinner:** Baked fish with steamed vegetables and brown rice\n\nAim for 2000-2500 calories/day (adjust based on your needs).";
  }

  if (context === 'exercise') {
    if (pLower.includes('raw json format')) {
      return JSON.stringify({
        Monday: [{ name: "Light Walk", duration: "15 min", calories: 50, exercises: 1, level: "Light", color: "#10B981", icon: "🚶" }],
        Tuesday: [{ name: "Stretching", duration: "15 min", calories: 50, exercises: 3, level: "Light", color: "#10B981", icon: "🧘" }],
        Wednesday: [{ name: "Light Walk", duration: "15 min", calories: 50, exercises: 1, level: "Light", color: "#10B981", icon: "🚶" }],
        Thursday: [{ name: "Yoga", duration: "20 min", calories: 70, exercises: 4, level: "Light", color: "#10B981", icon: "🧘" }],
        Friday: [{ name: "Light Walk", duration: "15 min", calories: 50, exercises: 1, level: "Light", color: "#10B981", icon: "🚶" }],
        Saturday: [{ name: "Stretching", duration: "15 min", calories: 50, exercises: 3, level: "Light", color: "#10B981", icon: "🧘" }],
        Sunday: [{ name: "Rest", duration: "0 min", calories: 0, exercises: 0, level: "Light", color: "#10B981", icon: "🧘" }]
      });
    }
    return "I'm unable to generate personalized exercise recommendations right now. Here's a basic routine:\n\n**Warm-up (5 min):** Light jogging or jumping jacks\n**Cardio (20 min):** Brisk walking or cycling\n**Strength (15 min):** Push-ups, squats, planks\n**Cool-down (5 min):** Stretching\n\nAlways start at your comfort level and gradually increase intensity.";
  }

  const fallbacks = {
    general: "I'm currently unable to connect to my AI engine. Here are some general health tips:\n\n• Stay hydrated — aim for 8 glasses of water daily\n• Get 7-9 hours of quality sleep\n• Incorporate 30 minutes of moderate exercise daily\n• Eat a balanced diet rich in fruits and vegetables\n• Practice stress management through meditation or deep breathing\n\n⚠️ For specific health concerns, please consult a healthcare professional.",
    symptoms: "I'm unable to analyze your symptoms right now due to a connection issue.\n\n**Important:** If you're experiencing severe symptoms such as:\n• Chest pain or difficulty breathing\n• Sudden severe headache\n• Signs of stroke (face drooping, arm weakness, speech difficulty)\n• Severe bleeding\n\n**Please call emergency services immediately.**\n\nFor non-emergency symptoms, please try again later or consult your doctor.",
    women: "I'm unable to connect to my AI engine right now. For women's health concerns, please consult your gynecologist or healthcare provider for personalized advice.",
    pregnancy: "I'm unable to connect right now. **Important:** For any pregnancy-related concerns, especially urgent ones, please contact your OB-GYN or visit your nearest hospital immediately.",
    doctor: "I'm unable to provide specialist recommendations right now. For general guidance:\n• **Primary Care:** Start with your GP for general symptoms\n• **Emergency:** Call 108/112 for life-threatening situations\n• **Specialist:** Ask your GP for a referral to the appropriate specialist",
    firstAid: "I'm unable to provide specific first aid guidance right now.\n\n**For emergencies, call your local emergency number immediately.**\n\nGeneral first aid: Keep calm, ensure safety, apply pressure to wounds, don't move injured persons unless in danger.",
    healthScore: "I'm unable to analyze your health data right now. Keep tracking your daily metrics and try again when the AI service is available."
  };

  return fallbacks[context] || fallbacks.general;
}

export { SYSTEM_PROMPTS };
export default { streamHealthGenie, askHealthGenie, checkAIStatus };
