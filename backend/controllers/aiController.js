import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

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

function determineSpecialist(text) {
  const lowerText = (text || '').toLowerCase();
  if (lowerText.includes('heart') || lowerText.includes('chest') || lowerText.includes('palpitations') || lowerText.includes('blood pressure')) return 'Cardiologist';
  if (lowerText.includes('skin') || lowerText.includes('fungal') || lowerText.includes('acne') || lowerText.includes('rash') || lowerText.includes('psoriasis')) return 'Dermatologist';
  if (lowerText.includes('osteo') || lowerText.includes('arthri') || lowerText.includes('joint') || lowerText.includes('bone') || lowerText.includes('fracture')) return 'Orthopedist';
  if (lowerText.includes('cramps') || lowerText.includes('period') || lowerText.includes('pregnancy') || lowerText.includes('pelvic')) return 'Gynecologist';
  if (lowerText.includes('migraine') || lowerText.includes('paralysis') || lowerText.includes('headache') || lowerText.includes('dizziness') || lowerText.includes('nerve')) return 'Neurologist';
  if (lowerText.includes('gastro') || lowerText.includes('ulcer') || lowerText.includes('hepatitis') || lowerText.includes('stomach') || lowerText.includes('nausea') || lowerText.includes('reflux')) return 'Gastroenterologist';
  if (lowerText.includes('thyroid') || lowerText.includes('diabete') || lowerText.includes('weight') || lowerText.includes('hormone')) return 'Endocrinologist';
  if (lowerText.includes('anxiety') || lowerText.includes('insomnia') || lowerText.includes('depression') || lowerText.includes('stress')) return 'Psychiatrist';
  if (lowerText.includes('asthma') || lowerText.includes('pneumonia') || lowerText.includes('tuber') || lowerText.includes('cough') || lowerText.includes('breath') || lowerText.includes('lung')) return 'Pulmonologist';
  return 'General Practitioner';
}

function generateMockAIRecommendation(context, prompt) {
  const pLower = (prompt || '').trim().toLowerCase();

  // Handle Greetings and Conversational Intros
  const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'who are you', 'what can you do', 'help', 'hi healthgenie', 'hello healthgenie'];
  const isGreeting = greetings.some(g => pLower === g || pLower.startsWith(g + ' ') || pLower.endsWith(' ' + g) || pLower === g + '!' || pLower === g + '.');
  
  if (isGreeting) {
    return `Hello! 👋 I am HealthGenie AI, your personal clinical health assistant.\n\nHow can I help you today? You can ask me to:\n• 🩺 **Analyze Symptoms:** Evaluate how you're feeling and get clinical guidance\n• 🥗 **Plan Meals:** Create personalized, nutrition-dense daily diet plans\n• 🏃 **Suggest Workouts:** Get tailored exercise and movement routines\n• 👨‍⚕️ **Find Specialists:** Get recommendations on which doctor type to consult\n\nWhat would you like to explore today?`;
  }

  if (context === 'symptoms' || pLower.includes('symptom') || pLower.includes('pain') || pLower.includes('fever')) {
    return `**Symptom Clinical Evaluation:**
Based on your input ("${prompt}"), here is the clinical evaluation:

1. **Possible Considerations:**
   - **Primary Consideration:** Acute Viral or Inflammatory Response (Confidence: 75%)
   - **Secondary Consideration:** Localized Musculoskeletal or Metabolic Fatigue (Confidence: 20%)

2. **Urgency & Care Level:**
   - **Severity:** Moderate
   - **Recommended Care:** Schedule a consultation with a General Physician within 24-48 hours.

3. **Immediate Action Steps:**
   - Stay well-hydrated with water and electrolyte fluids.
   - Monitor temperature and blood pressure every 6 hours.
   - Rest adequately and avoid strenuous physical exertion.

⚠️ **Urgent Warning:** If you experience shortness of breath, sudden chest discomfort, or high fever (>102°F), seek immediate care at an Emergency Room.`;
  }

  if (context === 'doctor' || pLower.includes('doctor') || pLower.includes('specialist')) {
    const recommendedSpec = determineSpecialist(prompt);
    return `**Recommended Specialist:** **${recommendedSpec}**

**Why this specialist is recommended:**
Based on your reported symptoms, a ${recommendedSpec} is best equipped to provide an accurate diagnosis and specialized treatment plan.

**Key Questions to Ask During Your Visit:**
1. What diagnostic tests or imaging do you recommend for these symptoms?
2. Are there specific lifestyle or dietary changes I should make immediately?
3. What is the expected timeline for symptom resolution?

**Recommended Next Step:** Check our Nearby Hospitals tab to book an appointment with a verified ${recommendedSpec}.`;
  }

  if (context === 'diet' || pLower.includes('diet') || pLower.includes('food') || pLower.includes('meal')) {
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
    return `**Daily Caloric Target:** ~2,100 kcal | **Macronutrient Split:** 50% Carbs, 25% Protein, 25% Healthy Fats

**Suggested Daily Meal Structure:**
- **Breakfast (8:00 AM):** Whole grain oatmeal with fresh berries, chia seeds, and almond butter (400 kcal)
- **Lunch (1:00 PM):** Grilled lean protein / tofu bowl with quinoa, steamed broccoli, and olive oil dressing (650 kcal)
- **Snack (4:30 PM):** Greek yogurt with walnuts or a handful of roasted almonds (250 kcal)
- **Dinner (7:30 PM):** Steamed salmon / lentil curry with brown rice and leafy green salad (550 kcal)

**Hydration Target:** 3.0 Liters of water throughout the day.`;
  }

  if (context === 'exercise' || pLower.includes('exercise') || pLower.includes('workout')) {
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
    return `**Recommended Intensity:** Moderate Aerobic + Mobility Focus

**30-Minute Daily Routine:**
1. **Warm-up (5 min):** Arm circles, leg swings, and light brisk walking.
2. **Main Circuit (20 min - 3 sets):**
   - Bodyweight Squats: 12 reps
   - Push-ups (or Incline Push-ups): 10 reps
   - Walking Lunges: 10 per leg
   - Plank Hold: 30 seconds
3. **Cool-down (5 min):** Deep hamstring and chest stretches with slow nasal breathing.`;
  }

  return `Hello! 👋 I am HealthGenie AI, your personal clinical health assistant.\n\nHow can I help you today? Feel free to ask about your symptoms, meal recommendations, workout plans, or general wellness advice!`;
}

export const chatStream = async (req, res) => {
  const { prompt, context = 'general', options = {} } = req.body;
  let systemPrompt = SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.general;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  const pLower = (prompt || '').toLowerCase();

  // If prompt explicitly requests RAW JSON (e.g., structured meal/workout generator pages)
  if ((context === 'diet' || context === 'exercise') && pLower.includes('raw json format')) {
    try {
      let selectedPlan = null;
      if (context === 'diet') {
        const dietDataPath = path.join(process.cwd(), 'data', 'diet_recommendations.json');
        const altDataPath = path.join(process.cwd(), 'backend', 'data', 'diet_recommendations.json');
        const finalPath = fs.existsSync(dietDataPath) ? dietDataPath : altDataPath;
        const dietData = JSON.parse(fs.readFileSync(finalPath, 'utf8'));
        let bestMatch = dietData.find(d => d.category === 'DEFAULT') || dietData[0];
        selectedPlan = bestMatch.plan;
      } else {
        const exDataPath = path.join(process.cwd(), 'data', 'exercise_recommendations.json');
        const altExPath = path.join(process.cwd(), 'backend', 'data', 'exercise_recommendations.json');
        const finalPath = fs.existsSync(exDataPath) ? exDataPath : altExPath;
        const exData = JSON.parse(fs.readFileSync(finalPath, 'utf8'));
        selectedPlan = exData[0].plan;
      }
      res.write(JSON.stringify({ response: JSON.stringify(selectedPlan), done: false }) + '\n');
      res.write(JSON.stringify({ response: '', done: true }) + '\n');
      return res.end();
    } catch (err) {
      console.error("[AI Controller] Raw JSON load error:", err.message);
    }
  }

  // Use OpenRouter API if Key is Available
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey) {
    try {
      console.log(`[AI Controller] Querying OpenRouter AI for prompt: "${prompt.slice(0, 40)}..."`);
      const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`
        },
        body: JSON.stringify({
          model: 'google/gemma-4-31b-it:free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        })
      });

      if (aiRes.ok) {
        const data = await aiRes.json();
        const contentText = data.choices?.[0]?.message?.content;
        if (contentText) {
          console.log("[AI Controller] OpenRouter AI generated response successfully!");
          const chunks = contentText.match(/\S+|\s+/g) || [];
          for (let i = 0; i < chunks.length; i++) {
            res.write(JSON.stringify({ response: chunks[i], done: false }) + '\n');
            await new Promise(resolve => setTimeout(resolve, 20));
          }
          res.write(JSON.stringify({ response: '', done: true }) + '\n');
          return res.end();
        }
      } else {
        console.warn("[AI Controller] OpenRouter API non-200 status:", aiRes.status);
      }
    } catch (orErr) {
      console.warn("[AI Controller] OpenRouter API connection exception:", orErr.message);
    }
  }

  // Intelligent Fallback Stream
  console.log("[AI Controller] Executing smart local recommendation fallback...");
  const aiResponse = generateMockAIRecommendation(context, prompt);
  const chunks = aiResponse.match(/\S+|\s+/g) || [];
  for (let i = 0; i < chunks.length; i++) {
    res.write(JSON.stringify({ response: chunks[i], done: false }) + '\n');
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  res.write(JSON.stringify({ response: '', done: true }) + '\n');
  return res.end();
};

export const recommendHospitals = async (req, res) => {
  try {
    const { symptoms, userLocation, radiusMeters = 5000 } = req.body;
    const apiKey = process.env.GROK_API_KEY;

    let recommendationText = '';

    if (apiKey) {
      try {
        const promptText = `As HealthGenie AI, analyze these patient symptoms: "${symptoms}".
Do NOT include raw headers like "AI Hospital Triage Recommendation". Simply provide:
1. Symptom Assessment
2. Urgency Level (Low/Medium/High/Critical)
3. Recommended Facility Type (e.g. 24x7 Emergency Room, Trauma Center, Pediatric Clinic, General Hospital)
4. 3 immediate action steps.`;
        
        const restUrl = 'https://api.x.ai/v1/chat/completions';
        const aiRes = await fetch(restUrl, {
          method: 'POST',
          headers: { 
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({ 
             model: 'grok-beta',
             messages: [{ role: 'user', content: promptText }]
          })
        });

        if (aiRes.ok) {
          const data = await aiRes.json();
          recommendationText = data.choices?.[0]?.message?.content;
        }
      } catch (err) {
        console.warn('Grok hospital recommendation error:', err.message);
      }
    }

    if (!recommendationText) {
      const isUrgent = (symptoms || '').toLowerCase().includes('chest') || (symptoms || '').toLowerCase().includes('bleed') || (symptoms || '').toLowerCase().includes('severe');
      recommendationText = `**Symptom Assessment:** "${symptoms}"
**Urgency Level:** ${isUrgent ? '🔴 CRITICAL / EMERGENCY' : '🟡 MODERATE'}

**Recommended Facility Type:** ${isUrgent ? '24x7 Emergency Trauma Center' : 'Multi-Specialty Hospital / General Clinic'}

**Action Steps:**
1. ${isUrgent ? 'Seek immediate emergency transport or dial 108/112.' : 'Filter nearby hospitals by 24x7 open status.'}
2. Have your identification and medical history ready.
3. Call ahead to the hospital emergency desk if possible.`;
    }

    res.json({
      status: 'OK',
      symptoms,
      recommendation: recommendationText
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};
