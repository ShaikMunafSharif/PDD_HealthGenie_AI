package com.healthgenie.ai.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.healthgenie.ai.data.local.dao.SymptomLogDao
import com.healthgenie.ai.data.local.entity.SymptomLogEntity
import com.healthgenie.ai.data.remote.OllamaRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import javax.inject.Inject

data class SymptomUiState(
    val selectedBodyParts: Set<String> = emptySet(),
    val selectedSymptoms: Set<String> = emptySet(),
    val severity: Float = 5f,
    val duration: String = "1-3 days",
    val frequency: String = "Occasional",
    val notes: String = "",
    // Processing / Results
    val isProcessing: Boolean = false,
    val analysisResult: String = "",
    val isStreaming: Boolean = false,
    val currentLogId: Long = -1,
)

val bodyPartOptions = listOf(
    "Head", "Eyes", "Ears", "Nose", "Throat", "Neck",
    "Chest", "Back", "Abdomen", "Arms", "Hands",
    "Legs", "Feet", "Skin", "Joints", "General"
)

val symptomOptions = mapOf(
    "Head" to listOf("Headache", "Dizziness", "Migraine", "Blurred Vision", "Confusion"),
    "Chest" to listOf("Chest Pain", "Shortness of Breath", "Palpitations", "Cough"),
    "Abdomen" to listOf("Nausea", "Vomiting", "Diarrhea", "Bloating", "Cramps"),
    "General" to listOf("Fever", "Fatigue", "Weight Loss", "Weakness", "Insomnia", "Anxiety"),
    "Throat" to listOf("Sore Throat", "Difficulty Swallowing", "Hoarseness"),
    "Back" to listOf("Lower Back Pain", "Upper Back Pain", "Stiffness"),
    "Skin" to listOf("Rash", "Itching", "Swelling", "Bruising"),
    "Joints" to listOf("Joint Pain", "Swelling", "Stiffness", "Reduced Range"),
)

val durationOptions = listOf("< 24 hours", "1-3 days", "3-7 days", "1-2 weeks", "2+ weeks")
val frequencyOptions = listOf("Constant", "Frequent", "Occasional", "Rare")

@HiltViewModel
class SymptomViewModel @Inject constructor(
    private val symptomLogDao: SymptomLogDao,
    private val ollamaRepository: OllamaRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(SymptomUiState())
    val uiState: StateFlow<SymptomUiState> = _uiState.asStateFlow()

    fun toggleBodyPart(part: String) {
        _uiState.update {
            val updated = it.selectedBodyParts.toMutableSet()
            if (part in updated) updated.remove(part) else updated.add(part)
            it.copy(selectedBodyParts = updated)
        }
    }

    fun toggleSymptom(symptom: String) {
        _uiState.update {
            val updated = it.selectedSymptoms.toMutableSet()
            if (symptom in updated) updated.remove(symptom) else updated.add(symptom)
            it.copy(selectedSymptoms = updated)
        }
    }

    fun updateSeverity(value: Float) = _uiState.update { it.copy(severity = value) }
    fun updateDuration(value: String) = _uiState.update { it.copy(duration = value) }
    fun updateFrequency(value: String) = _uiState.update { it.copy(frequency = value) }
    fun updateNotes(value: String) = _uiState.update { it.copy(notes = value) }

    fun startAnalysis() {
        viewModelScope.launch {
            _uiState.update { it.copy(isProcessing = true, analysisResult = "", isStreaming = true) }
            val state = _uiState.value

            // Save to database
            val logId = symptomLogDao.insert(
                SymptomLogEntity(
                    bodyParts = state.selectedBodyParts.joinToString(","),
                    symptoms = state.selectedSymptoms.joinToString(","),
                    severity = state.severity.toInt(),
                    duration = state.duration,
                    frequency = state.frequency,
                    notes = state.notes,
                    date = LocalDate.now().toString()
                )
            )
            _uiState.update { it.copy(currentLogId = logId) }

            // AI Analysis
            val prompt = buildString {
                append("Analyze these symptoms:\n")
                append("Body areas: ${state.selectedBodyParts.joinToString(", ")}\n")
                append("Symptoms: ${state.selectedSymptoms.joinToString(", ")}\n")
                append("Severity: ${state.severity.toInt()}/10\n")
                append("Duration: ${state.duration}\n")
                append("Frequency: ${state.frequency}\n")
                if (state.notes.isNotBlank()) append("Additional notes: ${state.notes}\n")
                append("\nProvide: 1) Possible conditions 2) Severity assessment 3) Recommended actions 4) When to seek emergency care")
            }

            ollamaRepository.streamGenerate(prompt, "symptoms").collect { chunk ->
                _uiState.update {
                    it.copy(
                        analysisResult = chunk.full,
                        isStreaming = !chunk.done,
                        isProcessing = !chunk.done
                    )
                }
            }

            // Save analysis result
            val log = symptomLogDao.getById(logId)
            if (log != null) {
                symptomLogDao.insert(log.copy(analysisResult = _uiState.value.analysisResult))
            }
        }
    }

    fun reset() {
        _uiState.value = SymptomUiState()
    }
}
