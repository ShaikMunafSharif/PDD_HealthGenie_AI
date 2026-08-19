package com.healthgenie.ai.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.healthgenie.ai.data.remote.OllamaRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class FirstAidUiState(
    val selectedCategory: String = "",
    val instructions: String = "",
    val isLoading: Boolean = false,
    val isStreaming: Boolean = false,
)

@HiltViewModel
class FirstAidViewModel @Inject constructor(
    private val ollamaRepository: OllamaRepository,
) : ViewModel() {
    private val _uiState = MutableStateFlow(FirstAidUiState())
    val uiState: StateFlow<FirstAidUiState> = _uiState.asStateFlow()

    fun getInstructions(category: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(selectedCategory = category, instructions = "", isLoading = true, isStreaming = true) }
            val prompt = "Provide step-by-step first aid instructions for: $category. Include what to do, what NOT to do, when to call emergency services, and what supplies are needed."
            ollamaRepository.streamGenerate(prompt, "firstAid").collect { chunk ->
                _uiState.update { it.copy(instructions = chunk.full, isLoading = !chunk.done, isStreaming = !chunk.done) }
            }
        }
    }
}

data class DoctorUiState(
    val recommendation: String = "",
    val isLoading: Boolean = false,
    val isStreaming: Boolean = false,
    val selectedSpecialist: String = "",
    val specialistInfo: String = "",
    val isLoadingSpecialist: Boolean = false,
)

@HiltViewModel
class DoctorViewModel @Inject constructor(
    private val ollamaRepository: OllamaRepository,
) : ViewModel() {
    private val _uiState = MutableStateFlow(DoctorUiState())
    val uiState: StateFlow<DoctorUiState> = _uiState.asStateFlow()

    fun getRecommendation(symptoms: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(recommendation = "", isLoading = true, isStreaming = true) }
            val prompt = "Based on these symptoms: $symptoms, recommend what type of doctor or specialist to see. Explain why and what to expect at the appointment."
            ollamaRepository.streamGenerate(prompt, "doctor").collect { chunk ->
                _uiState.update { it.copy(recommendation = chunk.full, isLoading = !chunk.done, isStreaming = !chunk.done) }
            }
        }
    }

    fun getSpecialistInfo(specialist: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(selectedSpecialist = specialist, specialistInfo = "", isLoadingSpecialist = true) }
            val prompt = "Explain what a $specialist does, what conditions they treat, when to see one, and what to expect during a visit."
            ollamaRepository.streamGenerate(prompt, "doctor").collect { chunk ->
                _uiState.update { it.copy(specialistInfo = chunk.full, isLoadingSpecialist = !chunk.done) }
            }
        }
    }
}
