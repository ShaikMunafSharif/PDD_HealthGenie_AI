package com.healthgenie.ai.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.healthgenie.ai.data.remote.OllamaRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class DietUiState(
    val mealPlan: String = "",
    val isLoading: Boolean = false,
    val isStreaming: Boolean = false,
    val selectedMeal: String = "",
    val mealDetail: String = "",
    val isLoadingDetail: Boolean = false,
)

@HiltViewModel
class DietViewModel @Inject constructor(
    private val ollamaRepository: OllamaRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(DietUiState())
    val uiState: StateFlow<DietUiState> = _uiState.asStateFlow()

    fun generateMealPlan() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, mealPlan = "", isStreaming = true) }
            val prompt = "Create a detailed daily meal plan with breakfast, morning snack, lunch, afternoon snack, dinner, and evening snack. Include specific foods, portions, and calorie estimates."
            ollamaRepository.streamGenerate(prompt, "diet").collect { chunk ->
                _uiState.update {
                    it.copy(mealPlan = chunk.full, isLoading = !chunk.done, isStreaming = !chunk.done)
                }
            }
        }
    }

    fun getMealDetails(meal: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(selectedMeal = meal, mealDetail = "", isLoadingDetail = true) }
            val prompt = "Give detailed nutritional information for: $meal. Include calories, protein, carbs, fats, vitamins, and preparation tips."
            ollamaRepository.streamGenerate(prompt, "diet").collect { chunk ->
                _uiState.update {
                    it.copy(mealDetail = chunk.full, isLoadingDetail = !chunk.done)
                }
            }
        }
    }
}
