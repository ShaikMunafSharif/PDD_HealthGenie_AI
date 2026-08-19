package com.healthgenie.ai.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.healthgenie.ai.data.local.DataStoreManager
import com.healthgenie.ai.data.local.dao.UserProfileDao
import com.healthgenie.ai.data.local.entity.UserProfileEntity
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class SettingsUiState(
    val profile: UserProfileEntity? = null,
    val waterReminders: Boolean = true,
    val exerciseReminders: Boolean = true,
    val mealReminders: Boolean = true,
)

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val userProfileDao: UserProfileDao,
    private val dataStoreManager: DataStoreManager,
) : ViewModel() {
    private val _uiState = MutableStateFlow(SettingsUiState())
    val uiState: StateFlow<SettingsUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            userProfileDao.getProfile().collect { p -> _uiState.update { it.copy(profile = p) } }
        }
        viewModelScope.launch {
            dataStoreManager.waterReminders.collect { v -> _uiState.update { it.copy(waterReminders = v) } }
        }
        viewModelScope.launch {
            dataStoreManager.exerciseReminders.collect { v -> _uiState.update { it.copy(exerciseReminders = v) } }
        }
        viewModelScope.launch {
            dataStoreManager.mealReminders.collect { v -> _uiState.update { it.copy(mealReminders = v) } }
        }
    }

    fun toggleWaterReminders(v: Boolean) { viewModelScope.launch { dataStoreManager.setWaterReminders(v) } }
    fun toggleExerciseReminders(v: Boolean) { viewModelScope.launch { dataStoreManager.setExerciseReminders(v) } }
    fun toggleMealReminders(v: Boolean) { viewModelScope.launch { dataStoreManager.setMealReminders(v) } }

    fun logout() {
        viewModelScope.launch {
            val p = userProfileDao.getProfileSync()
            if (p != null) userProfileDao.upsertProfile(p.copy(isAuthenticated = false))
        }
    }
}
