package com.healthgenie.ai.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.healthgenie.ai.data.local.dao.*
import com.healthgenie.ai.data.local.entity.HealthScoreEntity
import com.healthgenie.ai.data.local.entity.StreakEntity
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AnalyticsUiState(
    val healthHistory: List<HealthScoreEntity> = emptyList(),
    val streaks: List<StreakEntity> = emptyList(),
    val currentStreak: Int = 0,
    val longestStreak: Int = 0,
    val totalActiveDays: Int = 0,
)

@HiltViewModel
class AnalyticsViewModel @Inject constructor(
    private val healthScoreDao: HealthScoreDao,
    private val streakDao: StreakDao,
) : ViewModel() {
    private val _uiState = MutableStateFlow(AnalyticsUiState())
    val uiState: StateFlow<AnalyticsUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            healthScoreDao.getHistory(30).collect { h -> _uiState.update { it.copy(healthHistory = h) } }
        }
        viewModelScope.launch {
            streakDao.getRecent(90).collect { s ->
                _uiState.update { it.copy(streaks = s, totalActiveDays = s.size, longestStreak = s.size.coerceAtMost(30)) }
            }
        }
    }
}
