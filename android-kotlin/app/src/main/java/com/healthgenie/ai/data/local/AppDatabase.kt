package com.healthgenie.ai.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.healthgenie.ai.data.local.dao.*
import com.healthgenie.ai.data.local.entity.*

@Database(
    entities = [
        UserProfileEntity::class,
        HealthScoreEntity::class,
        WaterLogEntity::class,
        SymptomLogEntity::class,
        ChatMessageEntity::class,
        EmergencyContactEntity::class,
        StreakEntity::class,
        ExerciseLogEntity::class,
        PeriodLogEntity::class,
        PregnancyAppointmentEntity::class,
        AchievementEntity::class,
    ],
    version = 1,
    exportSchema = true
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userProfileDao(): UserProfileDao
    abstract fun healthScoreDao(): HealthScoreDao
    abstract fun waterLogDao(): WaterLogDao
    abstract fun symptomLogDao(): SymptomLogDao
    abstract fun chatMessageDao(): ChatMessageDao
    abstract fun emergencyContactDao(): EmergencyContactDao
    abstract fun streakDao(): StreakDao
    abstract fun exerciseLogDao(): ExerciseLogDao
    abstract fun periodLogDao(): PeriodLogDao
    abstract fun pregnancyAppointmentDao(): PregnancyAppointmentDao
    abstract fun achievementDao(): AchievementDao
}
