package com.healthgenie.ai.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.healthgenie.ai.data.local.dao.DailyWaterTotal
import com.healthgenie.ai.data.local.dao.WaterLogDao
import com.healthgenie.ai.data.local.entity.WaterLogEntity
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import javax.inject.Inject

data class WaterUiState(
    val todayMl: Int = 0,
    val goalMl: Int = 2500,
    val weeklyData: List<DailyWaterTotal> = emptyList(),
    val lastAddedMl: Int = 0,
)

@HiltViewModel
class WaterViewModel @Inject constructor(
    private val waterLogDao: WaterLogDao,
) : ViewModel() {

    private val _uiState = MutableStateFlow(WaterUiState())
    val uiState: StateFlow<WaterUiState> = _uiState.asStateFlow()

    private val today = LocalDate.now().toString()

    init {
        viewModelScope.launch {
            waterLogDao.getTotalForDate(today).collect { total ->
                _uiState.update { it.copy(todayMl = total) }
            }
        }
        viewModelScope.launch {
            waterLogDao.getDailyTotals(7).collect { data ->
                _uiState.update { it.copy(weeklyData = data) }
            }
        }
    }

    fun addWater(ml: Int) {
        viewModelScope.launch {
            waterLogDao.insert(WaterLogEntity(amountMl = ml, date = today))
            _uiState.update { it.copy(lastAddedMl = ml) }
        }
    }
}
