package com.healthgenie.ai.data.local.dao

import androidx.room.*
import com.healthgenie.ai.data.local.entity.*
import kotlinx.coroutines.flow.Flow

@Dao
interface UserProfileDao {
    @Query("SELECT * FROM user_profile LIMIT 1")
    fun getProfile(): Flow<UserProfileEntity?>

    @Query("SELECT * FROM user_profile LIMIT 1")
    suspend fun getProfileSync(): UserProfileEntity?

    @Upsert
    suspend fun upsertProfile(profile: UserProfileEntity)

    @Query("DELETE FROM user_profile")
    suspend fun deleteAll()
}

@Dao
interface HealthScoreDao {
    @Query("SELECT * FROM health_scores ORDER BY timestamp DESC LIMIT 1")
    fun getLatestScore(): Flow<HealthScoreEntity?>

    @Query("SELECT * FROM health_scores ORDER BY timestamp DESC LIMIT :limit")
    fun getHistory(limit: Int = 30): Flow<List<HealthScoreEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(score: HealthScoreEntity)

    @Query("DELETE FROM health_scores")
    suspend fun deleteAll()
}

@Dao
interface WaterLogDao {
    @Query("SELECT * FROM water_logs WHERE date = :date ORDER BY timestamp DESC")
    fun getLogsForDate(date: String): Flow<List<WaterLogEntity>>

    @Query("SELECT COALESCE(SUM(amountMl), 0) FROM water_logs WHERE date = :date")
    fun getTotalForDate(date: String): Flow<Int>

    @Query("SELECT date, SUM(amountMl) as totalMl FROM water_logs GROUP BY date ORDER BY date DESC LIMIT :days")
    fun getDailyTotals(days: Int = 7): Flow<List<DailyWaterTotal>>

    @Insert
    suspend fun insert(log: WaterLogEntity)

    @Query("DELETE FROM water_logs WHERE date = :date")
    suspend fun deleteForDate(date: String)
}

data class DailyWaterTotal(val date: String, val totalMl: Int)

@Dao
interface SymptomLogDao {
    @Query("SELECT * FROM symptom_logs ORDER BY timestamp DESC")
    fun getAll(): Flow<List<SymptomLogEntity>>

    @Query("SELECT * FROM symptom_logs WHERE id = :id")
    suspend fun getById(id: Long): SymptomLogEntity?

    @Insert
    suspend fun insert(log: SymptomLogEntity): Long

    @Delete
    suspend fun delete(log: SymptomLogEntity)
}

@Dao
interface ChatMessageDao {
    @Query("SELECT * FROM chat_messages ORDER BY timestamp ASC")
    fun getAll(): Flow<List<ChatMessageEntity>>

    @Insert
    suspend fun insert(message: ChatMessageEntity): Long

    @Query("UPDATE chat_messages SET content = :content WHERE id = :id")
    suspend fun updateContent(id: Long, content: String)

    @Query("DELETE FROM chat_messages")
    suspend fun deleteAll()
}

@Dao
interface EmergencyContactDao {
    @Query("SELECT * FROM emergency_contacts ORDER BY isPrimary DESC, name ASC")
    fun getAll(): Flow<List<EmergencyContactEntity>>

    @Insert
    suspend fun insert(contact: EmergencyContactEntity): Long

    @Update
    suspend fun update(contact: EmergencyContactEntity)

    @Delete
    suspend fun delete(contact: EmergencyContactEntity)

    @Query("DELETE FROM emergency_contacts WHERE id = :id")
    suspend fun deleteById(id: Long)
}

@Dao
interface StreakDao {
    @Query("SELECT * FROM streaks ORDER BY date DESC LIMIT :limit")
    fun getRecent(limit: Int = 90): Flow<List<StreakEntity>>

    @Upsert
    suspend fun upsert(streak: StreakEntity)

    @Query("SELECT COUNT(*) FROM streaks WHERE date >= :since")
    suspend fun countSince(since: String): Int
}

@Dao
interface ExerciseLogDao {
    @Query("SELECT * FROM exercise_logs ORDER BY timestamp DESC")
    fun getAll(): Flow<List<ExerciseLogEntity>>

    @Insert
    suspend fun insert(log: ExerciseLogEntity): Long
}

@Dao
interface PeriodLogDao {
    @Query("SELECT * FROM period_logs ORDER BY date DESC")
    fun getAll(): Flow<List<PeriodLogEntity>>

    @Upsert
    suspend fun upsert(log: PeriodLogEntity)

    @Query("SELECT * FROM period_logs ORDER BY date DESC LIMIT 1")
    suspend fun getLatest(): PeriodLogEntity?
}

@Dao
interface PregnancyAppointmentDao {
    @Query("SELECT * FROM pregnancy_appointments ORDER BY date ASC")
    fun getAll(): Flow<List<PregnancyAppointmentEntity>>

    @Insert
    suspend fun insert(apt: PregnancyAppointmentEntity): Long

    @Update
    suspend fun update(apt: PregnancyAppointmentEntity)

    @Delete
    suspend fun delete(apt: PregnancyAppointmentEntity)
}

@Dao
interface AchievementDao {
    @Query("SELECT * FROM achievements")
    fun getAll(): Flow<List<AchievementEntity>>

    @Upsert
    suspend fun upsert(achievement: AchievementEntity)

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertAll(achievements: List<AchievementEntity>)
}
