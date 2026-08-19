package com.healthgenie.ai.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.healthgenie.ai.data.local.dao.PregnancyAppointmentDao
import com.healthgenie.ai.data.local.entity.PregnancyAppointmentEntity
import com.healthgenie.ai.data.remote.OllamaRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class PregnancyUiState(
    val currentWeek: Int = 12,
    val appointments: List<PregnancyAppointmentEntity> = emptyList(),
    val trimesterInfo: String = "",
    val weeklyTips: String = "",
    val dietInfo: String = "",
    val exerciseInfo: String = "",
    val isLoading: Boolean = false,
)

@HiltViewModel
class PregnancyViewModel @Inject constructor(
    private val appointmentDao: PregnancyAppointmentDao,
    private val ollamaRepository: OllamaRepository,
) : ViewModel() {
    private val _uiState = MutableStateFlow(PregnancyUiState())
    val uiState: StateFlow<PregnancyUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            appointmentDao.getAll().collect { apts -> _uiState.update { it.copy(appointments = apts) } }
        }
    }

    fun updateWeek(w: Int) = _uiState.update { it.copy(currentWeek = w) }

    fun getTrimesterInfo() {
        viewModelScope.launch {
            _uiState.update { it.copy(trimesterInfo = "", isLoading = true) }
            val week = _uiState.value.currentWeek
            val trimester = when { week <= 12 -> "first"; week <= 27 -> "second"; else -> "third" }
            ollamaRepository.streamGenerate("Provide info about the $trimester trimester (week $week). Include baby development, body changes, and important precautions.", "pregnancy")
                .collect { chunk -> _uiState.update { it.copy(trimesterInfo = chunk.full, isLoading = !chunk.done) } }
        }
    }

    fun getWeeklyTips() {
        viewModelScope.launch {
            _uiState.update { it.copy(weeklyTips = "", isLoading = true) }
            ollamaRepository.streamGenerate("Provide week ${_uiState.value.currentWeek} pregnancy tips including what to expect, nutrition, exercise, and self-care.", "pregnancy")
                .collect { chunk -> _uiState.update { it.copy(weeklyTips = chunk.full, isLoading = !chunk.done) } }
        }
    }

    fun getDietInfo() {
        viewModelScope.launch {
            _uiState.update { it.copy(dietInfo = "", isLoading = true) }
            ollamaRepository.streamGenerate("Create a pregnancy-safe meal plan for week ${_uiState.value.currentWeek}. Include foods to eat and avoid, supplements, and hydration tips.", "pregnancy")
                .collect { chunk -> _uiState.update { it.copy(dietInfo = chunk.full, isLoading = !chunk.done) } }
        }
    }

    fun getExerciseInfo() {
        viewModelScope.launch {
            _uiState.update { it.copy(exerciseInfo = "", isLoading = true) }
            ollamaRepository.streamGenerate("Suggest safe exercises for week ${_uiState.value.currentWeek} of pregnancy. Include precautions and modifications.", "pregnancy")
                .collect { chunk -> _uiState.update { it.copy(exerciseInfo = chunk.full, isLoading = !chunk.done) } }
        }
    }

    fun addAppointment(title: String, doctor: String, date: String) {
        viewModelScope.launch {
            appointmentDao.insert(PregnancyAppointmentEntity(title = title, doctorName = doctor, date = date))
        }
    }

    fun toggleComplete(apt: PregnancyAppointmentEntity) {
        viewModelScope.launch { appointmentDao.update(apt.copy(completed = !apt.completed)) }
    }
}
