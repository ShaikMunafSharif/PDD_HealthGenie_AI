package com.healthgenie.ai.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.healthgenie.ai.data.local.dao.PeriodLogDao
import com.healthgenie.ai.data.local.entity.PeriodLogEntity
import com.healthgenie.ai.data.remote.OllamaRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import javax.inject.Inject

data class WomenUiState(
    val periodLogs: List<PeriodLogEntity> = emptyList(),
    val selectedFlow: String = "medium",
    val selectedMood: String = "",
    val periodNotes: String = "",
    val aiInsight: String = "",
    val isLoading: Boolean = false,
    val isStreaming: Boolean = false,
    val pcosInfo: String = "",
    val skinInfo: String = "",
    val dietInfo: String = "",
)

@HiltViewModel
class WomenViewModel @Inject constructor(
    private val periodLogDao: PeriodLogDao,
    private val ollamaRepository: OllamaRepository,
) : ViewModel() {
    private val _uiState = MutableStateFlow(WomenUiState())
    val uiState: StateFlow<WomenUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            periodLogDao.getAll().collect { logs -> _uiState.update { it.copy(periodLogs = logs) } }
        }
    }

    fun updateFlow(v: String) = _uiState.update { it.copy(selectedFlow = v) }
    fun updateMood(v: String) = _uiState.update { it.copy(selectedMood = v) }
    fun updateNotes(v: String) = _uiState.update { it.copy(periodNotes = v) }

    fun logPeriod() {
        viewModelScope.launch {
            periodLogDao.upsert(PeriodLogEntity(
                date = LocalDate.now().toString(), flow = _uiState.value.selectedFlow,
                mood = _uiState.value.selectedMood, notes = _uiState.value.periodNotes))
        }
    }

    fun getInsights() {
        viewModelScope.launch {
            _uiState.update { it.copy(aiInsight = "", isLoading = true, isStreaming = true) }
            ollamaRepository.streamGenerate("Provide cycle health insights and tips based on menstrual tracking data.", "women")
                .collect { chunk -> _uiState.update { it.copy(aiInsight = chunk.full, isLoading = !chunk.done, isStreaming = !chunk.done) } }
        }
    }

    fun getPCOSInfo() {
        viewModelScope.launch {
            _uiState.update { it.copy(pcosInfo = "", isLoading = true) }
            ollamaRepository.streamGenerate("Provide comprehensive PCOS management guide including symptoms, diet tips, exercise, and lifestyle changes.", "women")
                .collect { chunk -> _uiState.update { it.copy(pcosInfo = chunk.full, isLoading = !chunk.done) } }
        }
    }

    fun getSkinInfo() {
        viewModelScope.launch {
            _uiState.update { it.copy(skinInfo = "", isLoading = true) }
            ollamaRepository.streamGenerate("Provide a personalized skincare routine including morning and night routines, product recommendations, and diet tips for healthy skin.", "women")
                .collect { chunk -> _uiState.update { it.copy(skinInfo = chunk.full, isLoading = !chunk.done) } }
        }
    }

    fun getDietInfo() {
        viewModelScope.launch {
            _uiState.update { it.copy(dietInfo = "", isLoading = true) }
            ollamaRepository.streamGenerate("Create a women-specific nutrition plan focusing on iron, calcium, hormonal balance, and energy. Include meals and supplements.", "women")
                .collect { chunk -> _uiState.update { it.copy(dietInfo = chunk.full, isLoading = !chunk.done) } }
        }
    }
}
