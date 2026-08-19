// utils/healthCalculations.js

/**
 * Calculates BMR (Basal Metabolic Rate) using the Mifflin-St Jeor Equation
 * @param {number} weight in kg
 * @param {number} height in cm
 * @param {number} age in years
 * @param {string} gender 'male' or 'female'
 */
export function calculateBMR(weight = 70, height = 170, age = 30, gender = 'male') {
  // Mifflin-St Jeor Equation
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  return Math.round(bmr);
}

/**
 * Calculates daily caloric target based on BMR and Activity Level
 * @param {number} bmr 
 * @param {string} activityLevel 'sedentary' | 'light' | 'moderate' | 'active' | 'highly_active'
 */
export function calculateDailyCalories(bmr, activityLevel = 'moderate') {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    highly_active: 1.9
  };
  const multiplier = multipliers[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
}

/**
 * Calculates dynamic daily step target based on activity level
 * @param {string} activityLevel 
 */
export function calculateDailyStepsTarget(activityLevel = 'moderate') {
  const targets = {
    sedentary: 5000,
    light: 7500,
    moderate: 10000,
    active: 12500,
    highly_active: 15000
  };
  return targets[activityLevel] || 10000;
}

/**
 * Calculates dynamic sleep target based on age
 * @param {number} age 
 */
export function calculateSleepTarget(age = 30) {
  if (age < 18) return 9;
  if (age > 65) return 7.5;
  return 8; // standard adult
}

/**
 * Generates a realistic historical array anchoring on the user's current stats.
 * This ensures charts are never empty.
 */
export function generateHistoricalData(days, currentDailyStats, currentHealthScore, currentWaterIntake) {
  const data = [];
  const now = new Date();

  // Extract base stats to anchor the variations
  const baseScore = currentHealthScore || 70;
  const baseSteps = currentDailyStats?.steps || 8000;
  const baseWater = currentWaterIntake || 2000;
  const baseCalories = currentDailyStats?.calories || 2000;
  const baseSleep = currentDailyStats?.sleep || 7.5;

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    
    // Slight random variations around the base
    const variance = (Math.random() - 0.5); // -0.5 to 0.5
    
    data.push({
      day: daysOfWeek[d.getDay()], // For 7-day charts (Mon, Tue, etc.)
      dayIndex: days - i, // For 30-day charts (1, 2, 3...)
      fullDate: d.toISOString().split('T')[0],
      
      score: Math.min(100, Math.max(40, Math.round(baseScore + (variance * 15)))),
      steps: Math.max(0, Math.round(baseSteps + (variance * 4000))),
      water: Math.max(0, Math.round(baseWater + (variance * 1000))),
      calories: Math.max(0, Math.round(baseCalories + (variance * 600))),
      sleep: Math.min(12, Math.max(4, Number((baseSleep + (variance * 3)).toFixed(1))))
    });
  }

  // Ensure the very last day (today) exactly matches the current stats
  const today = data[data.length - 1];
  today.score = baseScore;
  today.steps = baseSteps;
  today.water = baseWater;
  today.calories = baseCalories;
  today.sleep = baseSleep;

  return data;
}
