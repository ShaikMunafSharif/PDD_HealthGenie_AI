package com.healthgenie.ai.ui.viewmodels

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.healthgenie.ai.data.local.dao.EmergencyContactDao
import com.healthgenie.ai.data.local.entity.EmergencyContactEntity
import com.healthgenie.ai.data.remote.BackendApiService
import com.healthgenie.ai.data.remote.HospitalItem
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class EmergencyUiState(
    val contacts: List<EmergencyContactEntity> = emptyList(),
    val nearbyHospitals: List<HospitalItem> = emptyList(),
    val isLoadingHospitals: Boolean = false,
    val isSOSActive: Boolean = false,
    val sosCountdown: Int = 5,
    // Add contact form
    val contactName: String = "",
    val contactPhone: String = "",
    val contactType: String = "personal",
    val isPrimary: Boolean = false,
)

@HiltViewModel
class EmergencyViewModel @Inject constructor(
    private val emergencyContactDao: EmergencyContactDao,
    private val backendApiService: BackendApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow(EmergencyUiState())
    val uiState: StateFlow<EmergencyUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            emergencyContactDao.getAll().collect { contacts ->
                _uiState.update { it.copy(contacts = contacts) }
            }
        }
        fetchNearbyHospitals()
    }

    fun fetchNearbyHospitals(lat: Double = 28.6139, lng: Double = 77.2090) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoadingHospitals = true) }
            try {
                val response = backendApiService.getNearbyHospitals(lat, lng)
                if (response.isSuccessful && response.body() != null) {
                    _uiState.update { it.copy(nearbyHospitals = response.body()!!, isLoadingHospitals = false) }
                } else {
                    _uiState.update { it.copy(isLoadingHospitals = false) }
                }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoadingHospitals = false) }
            }
        }
    }

    fun updateContactName(value: String) = _uiState.update { it.copy(contactName = value) }
    fun updateContactPhone(value: String) = _uiState.update { it.copy(contactPhone = value) }
    fun updateContactType(value: String) = _uiState.update { it.copy(contactType = value) }
    fun togglePrimary() = _uiState.update { it.copy(isPrimary = !it.isPrimary) }

    fun saveContact() {
        viewModelScope.launch {
            val state = _uiState.value
            if (state.contactName.isNotBlank() && state.contactPhone.isNotBlank()) {
                emergencyContactDao.insert(
                    EmergencyContactEntity(
                        name = state.contactName,
                        phone = state.contactPhone,
                        type = state.contactType,
                        isPrimary = state.isPrimary
                    )
                )
                _uiState.update { it.copy(contactName = "", contactPhone = "", isPrimary = false) }
            }
        }
    }

    fun deleteContact(contact: EmergencyContactEntity) {
        viewModelScope.launch {
            emergencyContactDao.delete(contact)
        }
    }

    fun activateSOS() {
        _uiState.update { it.copy(isSOSActive = true, sosCountdown = 5) }
    }

    fun updateCountdown(value: Int) {
        _uiState.update { it.copy(sosCountdown = value) }
    }

    fun cancelSOS() {
        _uiState.update { it.copy(isSOSActive = false, sosCountdown = 5) }
    }

    fun callEmergency(context: Context) {
        val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:112"))
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        context.startActivity(intent)
    }
}
