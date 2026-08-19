package com.healthgenie.ai.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.healthgenie.ai.data.local.dao.ExerciseLogDao
import com.healthgenie.ai.data.local.entity.ExerciseLogEntity
import com.healthgenie.ai.data.remote.OllamaRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import javax.inject.Inject

data class ExerciseUiState(
    val recommendations: String = "",
    val isLoading: Boolean = false,
    val isStreaming: Boolean = false,
    val selectedExercise: String = "",
    val exerciseDetail: String = "",
    val isLoadingDetail: Boolean = false,
    val painArea: String = "",
    val painRelief: String = "",
    val isLoadingRelief: Boolean = false,
)

@HiltViewModel
class ExerciseViewModel @Inject constructor(
    private val exerciseLogDao: ExerciseLogDao,
    private val ollamaRepository: OllamaRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(ExerciseUiState())
    val uiState: StateFlow<ExerciseUiState> = _uiState.asStateFlow()

    fun getRecommendations() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, recommendations = "", isStreaming = true) }
            val prompt = "Recommend a balanced exercise routine for today. Include warm-up, main exercises (cardio + strength), and cool-down. Provide sets, reps, and duration for each."
            ollamaRepository.streamGenerate(prompt, "exercise").collect { chunk ->
                _uiState.update {
                    it.copy(recommendations = chunk.full, isLoading = !chunk.done, isStreaming = !chunk.done)
                }
            }
        }
    }

    fun getExerciseDetails(exercise: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(selectedExercise = exercise, exerciseDetail = "", isLoadingDetail = true) }
            val prompt = "Provide detailed instructions for: $exercise. Include proper form, sets/reps, common mistakes, modifications for beginners and advanced, and safety precautions."
            ollamaRepository.streamGenerate(prompt, "exercise").collect { chunk ->
                _uiState.update {
                    it.copy(exerciseDetail = chunk.full, isLoadingDetail = !chunk.done)
                }
            }
        }
    }

    fun getPainRelief(area: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(painArea = area, painRelief = "", isLoadingRelief = true) }
            val prompt = "Suggest stretches and exercises for $area pain relief. Include gentle stretches, strengthening exercises, and precautions. Format with clear steps."
            ollamaRepository.streamGenerate(prompt, "exercise").collect { chunk ->
                _uiState.update {
                    it.copy(painRelief = chunk.full, isLoadingRelief = !chunk.done)
                }
            }
        }
    }

    fun logExercise(name: String, duration: Int, calories: Int) {
        viewModelScope.launch {
            exerciseLogDao.insert(
                ExerciseLogEntity(
                    exerciseName = name,
                    duration = duration,
                    caloriesBurned = calories,
                    date = LocalDate.now().toString()
                )
            )
        }
    }
}
