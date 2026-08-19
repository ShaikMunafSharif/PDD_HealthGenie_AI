package com.healthgenie.ai.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.healthgenie.ai.data.local.dao.HealthScoreDao
import com.healthgenie.ai.data.local.entity.HealthScoreEntity
import com.healthgenie.ai.data.remote.OllamaRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HealthUiState(
    val overallScore: Int = 72,
    val fitness: Int = 65,
    val diet: Int = 70,
    val sleep: Int = 80,
    val hydration: Int = 60,
    val vitals: Int = 75,
    val aiInsight: String = "",
    val isLoadingInsight: Boolean = false,
    val history: List<HealthScoreEntity> = emptyList(),
)

@HiltViewModel
class HealthViewModel @Inject constructor(
    private val healthScoreDao: HealthScoreDao,
    private val ollamaRepository: OllamaRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(HealthUiState())
    val uiState: StateFlow<HealthUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            healthScoreDao.getLatestScore().collect { score ->
                if (score != null) {
                    _uiState.update {
                        it.copy(
                            overallScore = score.overallScore,
                            fitness = score.fitness,
                            diet = score.diet,
                            sleep = score.sleep,
                            hydration = score.hydration,
                            vitals = score.vitals
                        )
                    }
                }
            }
        }
        viewModelScope.launch {
            healthScoreDao.getHistory(30).collect { history ->
                _uiState.update { it.copy(history = history) }
            }
        }
    }

    fun fetchAIInsight() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoadingInsight = true, aiInsight = "") }
            val state = _uiState.value
            val prompt = "My health scores: Overall ${state.overallScore}/100, Fitness ${state.fitness}, Diet ${state.diet}, Sleep ${state.sleep}, Hydration ${state.hydration}, Vitals ${state.vitals}. Give me personalized tips."
            ollamaRepository.streamGenerate(prompt, "healthScore").collect { chunk ->
                _uiState.update {
                    it.copy(aiInsight = chunk.full, isLoadingInsight = !chunk.done)
                }
            }
        }
    }
}
