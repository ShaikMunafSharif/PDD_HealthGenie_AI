package com.healthgenie.ai.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.healthgenie.ai.data.local.dao.*
import com.healthgenie.ai.data.local.entity.HealthScoreEntity
import com.healthgenie.ai.data.local.entity.UserProfileEntity
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.LocalTime
import javax.inject.Inject

data class DashboardUiState(
    val userName: String = "User",
    val greeting: String = "Good Morning",
    val healthScore: Int = 72,
    val steps: Int = 4520,
    val calories: Int = 1840,
    val sleepHours: Float = 7.2f,
    val waterMl: Int = 0,
    val waterGoal: Int = 2500,
    val streakDays: Int = 0,
    val isLoading: Boolean = true,
)

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val userProfileDao: UserProfileDao,
    private val healthScoreDao: HealthScoreDao,
    private val waterLogDao: WaterLogDao,
    private val streakDao: StreakDao,
) : ViewModel() {

    private val _uiState = MutableStateFlow(DashboardUiState())
    val uiState: StateFlow<DashboardUiState> = _uiState.asStateFlow()

    init {
        loadDashboard()
    }

    private fun loadDashboard() {
        viewModelScope.launch {
            // Greeting
            val greeting = when (LocalTime.now().hour) {
                in 5..11 -> "Good Morning"
                in 12..16 -> "Good Afternoon"
                in 17..20 -> "Good Evening"
                else -> "Good Night"
            }
            _uiState.update { it.copy(greeting = greeting) }

            // User profile
            val profile = userProfileDao.getProfileSync()
            if (profile != null) {
                _uiState.update { it.copy(userName = profile.name.ifEmpty { "User" }) }
            }

            // Seed default health score if none exists
            val today = LocalDate.now().toString()
            healthScoreDao.getLatestScore().first().let { score ->
                if (score == null) {
                    healthScoreDao.insert(
                        HealthScoreEntity(
                            overallScore = 72, fitness = 65, diet = 70,
                            sleep = 80, hydration = 60, vitals = 75,
                            steps = 4520, calories = 1840, sleepHours = 7.2f,
                            date = today
                        )
                    )
                }
            }

            // Observe health score
            healthScoreDao.getLatestScore().collect { score ->
                if (score != null) {
                    _uiState.update {
                        it.copy(
                            healthScore = score.overallScore,
                            steps = score.steps,
                            calories = score.calories,
                            sleepHours = score.sleepHours,
                            isLoading = false
                        )
                    }
                }
            }
        }

        // Observe water
        viewModelScope.launch {
            val today = LocalDate.now().toString()
            waterLogDao.getTotalForDate(today).collect { total ->
                _uiState.update { it.copy(waterMl = total) }
            }
        }

        // Observe streak
        viewModelScope.launch {
            val thirtyDaysAgo = LocalDate.now().minusDays(30).toString()
            val count = streakDao.countSince(thirtyDaysAgo)
            _uiState.update { it.copy(streakDays = count) }
        }
    }
}
