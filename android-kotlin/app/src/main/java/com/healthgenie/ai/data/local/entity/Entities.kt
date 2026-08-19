package com.healthgenie.ai.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "user_profile")
data class UserProfileEntity(
    @PrimaryKey val uid: String,
    val name: String = "",
    val email: String = "",
    val gender: String = "",
    val age: Int = 0,
    val height: Float = 0f,
    val weight: Float = 0f,
    val bloodGroup: String = "",
    val medicalConditions: String = "",  // JSON array
    val allergies: String = "",          // JSON array
    val isAuthenticated: Boolean = false,
    val hasCompletedOnboarding: Boolean = false,
    val hasCompletedSetup: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "health_scores")
data class HealthScoreEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val overallScore: Int = 72,
    val fitness: Int = 65,
    val diet: Int = 70,
    val sleep: Int = 80,
    val hydration: Int = 60,
    val vitals: Int = 75,
    val steps: Int = 0,
    val calories: Int = 0,
    val sleepHours: Float = 0f,
    val date: String = "",
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "water_logs")
data class WaterLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val amountMl: Int,
    val date: String,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "symptom_logs")
data class SymptomLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val bodyParts: String = "",        // JSON array
    val symptoms: String = "",          // JSON array
    val severity: Int = 5,
    val duration: String = "",
    val frequency: String = "occasional",
    val notes: String = "",
    val analysisResult: String = "",
    val date: String = "",
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "chat_messages")
data class ChatMessageEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val role: String,                   // "user" or "assistant"
    val content: String,
    val context: String = "general",
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "emergency_contacts")
data class EmergencyContactEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val phone: String,
    val type: String = "personal",     // personal, doctor, emergency
    val isPrimary: Boolean = false,
)

@Entity(tableName = "streaks")
data class StreakEntity(
    @PrimaryKey val date: String,
    val activityCount: Int = 1,
    val type: String = "general"
)

@Entity(tableName = "exercise_logs")
data class ExerciseLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val exerciseName: String,
    val duration: Int = 0,             // minutes
    val caloriesBurned: Int = 0,
    val date: String = "",
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "period_logs")
data class PeriodLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,
    val flow: String = "medium",       // light, medium, heavy
    val symptoms: String = "",          // JSON array
    val mood: String = "",
    val notes: String = ""
)

@Entity(tableName = "pregnancy_appointments")
data class PregnancyAppointmentEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val doctorName: String = "",
    val date: String,
    val time: String = "",
    val notes: String = "",
    val completed: Boolean = false
)

@Entity(tableName = "achievements")
data class AchievementEntity(
    @PrimaryKey val achievementId: String,
    val name: String,
    val icon: String,
    val unlocked: Boolean = false,
    val unlockedDate: Long? = null
)
