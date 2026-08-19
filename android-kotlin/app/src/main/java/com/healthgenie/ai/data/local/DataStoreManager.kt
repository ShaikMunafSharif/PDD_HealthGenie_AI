package com.healthgenie.ai.data.local

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "healthgenie_prefs")

@Singleton
class DataStoreManager @Inject constructor(
    private val context: Context
) {
    companion object Keys {
        val WATER_DAILY_GOAL = intPreferencesKey("water_daily_goal")
        val WATER_STREAK = intPreferencesKey("water_streak")
        val OLLAMA_BASE_URL = stringPreferencesKey("ollama_base_url")
        val GEMINI_API_KEY = stringPreferencesKey("gemini_api_key")
        val CURRENT_STREAK = intPreferencesKey("current_streak")
        val LONGEST_STREAK = intPreferencesKey("longest_streak")
        val IS_AUTHENTICATED = booleanPreferencesKey("is_authenticated")
        val HAS_ONBOARDED = booleanPreferencesKey("has_onboarded")

        // Notification prefs
        val WATER_REMINDER_ENABLED = booleanPreferencesKey("water_reminder_enabled")
        val WATER_REMINDER_INTERVAL_MS = longPreferencesKey("water_reminder_interval_ms")
        val EXERCISE_REMINDER_ENABLED = booleanPreferencesKey("exercise_reminder_enabled")
        val EXERCISE_REMINDER_TIME = stringPreferencesKey("exercise_reminder_time")
        val MEAL_REMINDER_ENABLED = booleanPreferencesKey("meal_reminder_enabled")
        val MEAL_BREAKFAST_TIME = stringPreferencesKey("meal_breakfast_time")
        val MEAL_LUNCH_TIME = stringPreferencesKey("meal_lunch_time")
        val MEAL_DINNER_TIME = stringPreferencesKey("meal_dinner_time")

        // Women's health
        val CYCLE_LENGTH = intPreferencesKey("cycle_length")
        val PERIOD_LENGTH = intPreferencesKey("period_length")
        val LAST_PERIOD_START = stringPreferencesKey("last_period_start")

        // Pregnancy
        val IS_PREGNANT = booleanPreferencesKey("is_pregnant")
        val DUE_DATE = stringPreferencesKey("due_date")
    }

    private val store get() = context.dataStore

    // Generic read/write
    fun <T> getFlow(key: Preferences.Key<T>, default: T): Flow<T> =
        store.data.map { it[key] ?: default }

    suspend fun <T> set(key: Preferences.Key<T>, value: T) {
        store.edit { it[key] = value }
    }

    // Convenience
    val waterDailyGoal: Flow<Int> = getFlow(WATER_DAILY_GOAL, 2000)
    val waterStreak: Flow<Int> = getFlow(WATER_STREAK, 0)
    val isAuthenticated: Flow<Boolean> = getFlow(IS_AUTHENTICATED, false)
    val hasOnboarded: Flow<Boolean> = getFlow(HAS_ONBOARDED, false)
    val currentStreak: Flow<Int> = getFlow(CURRENT_STREAK, 0)
    val ollamaBaseUrl: Flow<String> = getFlow(OLLAMA_BASE_URL, "http://10.0.2.2:11434")

    val waterReminderEnabled: Flow<Boolean> = getFlow(WATER_REMINDER_ENABLED, true)
    val exerciseReminderEnabled: Flow<Boolean> = getFlow(EXERCISE_REMINDER_ENABLED, true)
    val mealReminderEnabled: Flow<Boolean> = getFlow(MEAL_REMINDER_ENABLED, true)

    // Aliases for SettingsViewModel
    val waterReminders: Flow<Boolean> = waterReminderEnabled
    val exerciseReminders: Flow<Boolean> = exerciseReminderEnabled
    val mealReminders: Flow<Boolean> = mealReminderEnabled

    suspend fun setAuthenticated(value: Boolean) = set(IS_AUTHENTICATED, value)
    suspend fun setOnboarded(value: Boolean) = set(HAS_ONBOARDED, value)
    suspend fun setWaterGoal(goal: Int) = set(WATER_DAILY_GOAL, goal)
    suspend fun setWaterStreak(streak: Int) = set(WATER_STREAK, streak)
    suspend fun setCurrentStreak(streak: Int) = set(CURRENT_STREAK, streak)
    suspend fun setWaterReminders(value: Boolean) = set(WATER_REMINDER_ENABLED, value)
    suspend fun setExerciseReminders(value: Boolean) = set(EXERCISE_REMINDER_ENABLED, value)
    suspend fun setMealReminders(value: Boolean) = set(MEAL_REMINDER_ENABLED, value)
}
