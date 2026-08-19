package com.healthgenie.ai.di

import android.content.Context
import androidx.room.Room
import com.healthgenie.ai.data.local.AppDatabase
import com.healthgenie.ai.data.local.dao.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "healthgenie_db"
        ).fallbackToDestructiveMigration().build()
    }

    @Provides fun provideUserProfileDao(db: AppDatabase): UserProfileDao = db.userProfileDao()
    @Provides fun provideHealthScoreDao(db: AppDatabase): HealthScoreDao = db.healthScoreDao()
    @Provides fun provideWaterLogDao(db: AppDatabase): WaterLogDao = db.waterLogDao()
    @Provides fun provideSymptomLogDao(db: AppDatabase): SymptomLogDao = db.symptomLogDao()
    @Provides fun provideChatMessageDao(db: AppDatabase): ChatMessageDao = db.chatMessageDao()
    @Provides fun provideEmergencyContactDao(db: AppDatabase): EmergencyContactDao = db.emergencyContactDao()
    @Provides fun provideStreakDao(db: AppDatabase): StreakDao = db.streakDao()
    @Provides fun provideExerciseLogDao(db: AppDatabase): ExerciseLogDao = db.exerciseLogDao()
    @Provides fun providePeriodLogDao(db: AppDatabase): PeriodLogDao = db.periodLogDao()
    @Provides fun providePregnancyAppointmentDao(db: AppDatabase): PregnancyAppointmentDao = db.pregnancyAppointmentDao()
    @Provides fun provideAchievementDao(db: AppDatabase): AchievementDao = db.achievementDao()
}
