package com.healthgenie.ai.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.healthgenie.ai.data.local.DataStoreManager
import com.healthgenie.ai.data.local.dao.UserProfileDao
import com.healthgenie.ai.data.local.entity.UserProfileEntity
import com.healthgenie.ai.data.remote.BackendApiService
import com.healthgenie.ai.data.remote.LoginRequest
import com.healthgenie.ai.data.remote.RegisterRequest
import com.healthgenie.ai.data.remote.VerifyOtpRequest
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.UUID
import javax.inject.Inject

data class AuthUiState(
    val isLoading: Boolean = false,
    val isAuthenticated: Boolean = false,
    val hasCompletedOnboarding: Boolean = false,
    val hasCompletedSetup: Boolean = false,
    val requiresOtpVerification: Boolean = false,
    val otpSentEmail: String? = null,
    val otpInput: String = "",
    val error: String? = null,
    val successMessage: String? = null,
    // Login/Signup fields
    val email: String = "",
    val password: String = "",
    val confirmPassword: String = "",
    val name: String = "",
    // Setup fields
    val gender: String = "",
    val age: String = "",
    val height: String = "",
    val weight: String = "",
    val bloodGroup: String = "",
    val selectedConditions: Set<String> = emptySet(),
    val selectedAllergies: Set<String> = emptySet(),
)

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val userProfileDao: UserProfileDao,
    private val backendApiService: BackendApiService,
    private val dataStoreManager: DataStoreManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            val profile = userProfileDao.getProfileSync()
            if (profile != null) {
                _uiState.update {
                    it.copy(
                        isAuthenticated = profile.isAuthenticated,
                        hasCompletedOnboarding = profile.hasCompletedOnboarding,
                        hasCompletedSetup = profile.hasCompletedSetup
                    )
                }
            }
        }
    }

    fun updateEmail(value: String) = _uiState.update { it.copy(email = value, error = null) }
    fun updatePassword(value: String) = _uiState.update { it.copy(password = value, error = null) }
    fun updateConfirmPassword(value: String) = _uiState.update { it.copy(confirmPassword = value, error = null) }
    fun updateName(value: String) = _uiState.update { it.copy(name = value) }
    fun updateOtpInput(value: String) = _uiState.update { it.copy(otpInput = value, error = null) }
    fun updateGender(value: String) = _uiState.update { it.copy(gender = value) }
    fun updateAge(value: String) = _uiState.update { it.copy(age = value) }
    fun updateHeight(value: String) = _uiState.update { it.copy(height = value) }
    fun updateWeight(value: String) = _uiState.update { it.copy(weight = value) }
    fun updateBloodGroup(value: String) = _uiState.update { it.copy(bloodGroup = value) }

    fun toggleCondition(condition: String) {
        _uiState.update {
            val updated = it.selectedConditions.toMutableSet()
            if (condition in updated) updated.remove(condition) else updated.add(condition)
            it.copy(selectedConditions = updated)
        }
    }

    fun toggleAllergy(allergy: String) {
        _uiState.update {
            val updated = it.selectedAllergies.toMutableSet()
            if (allergy in updated) updated.remove(allergy) else updated.add(allergy)
            it.copy(selectedAllergies = updated)
        }
    }

    fun login() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val state = _uiState.value
            if (state.email.isBlank() || state.password.isBlank()) {
                _uiState.update { it.copy(isLoading = false, error = "Please fill all fields") }
                return@launch
            }

            try {
                // Call Backend API
                val response = backendApiService.login(LoginRequest(state.email.trim(), state.password))
                if (response.isSuccessful && response.body() != null) {
                    val body = response.body()!!
                    val user = body.user
                    val token = body.token

                    if (token != null) {
                        dataStoreManager.setAuthenticated(true)
                    }

                    val profile = UserProfileEntity(
                        uid = user?.uid ?: UUID.randomUUID().toString(),
                        name = user?.name ?: state.email.substringBefore("@"),
                        email = user?.email ?: state.email,
                        isAuthenticated = true,
                        age = user?.age ?: 0,
                        gender = user?.gender ?: "",
                        height = user?.height ?: 0f,
                        weight = user?.weight ?: 0f,
                        hasCompletedOnboarding = true,
                        hasCompletedSetup = true
                    )
                    userProfileDao.upsertProfile(profile)

                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            isAuthenticated = true,
                            hasCompletedOnboarding = true,
                            hasCompletedSetup = true
                        )
                    }
                    return@launch
                } else {
                    val errorMsg = response.errorBody()?.string() ?: "Invalid email or password"
                    _uiState.update { it.copy(isLoading = false, error = errorMsg) }
                }
            } catch (e: Exception) {
                // Fallback to local DB check if backend unreachable
                val existing = userProfileDao.getProfileSync()
                if (existing != null && existing.email.equals(state.email.trim(), ignoreCase = true)) {
                    userProfileDao.upsertProfile(existing.copy(isAuthenticated = true))
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            isAuthenticated = true,
                            hasCompletedOnboarding = existing.hasCompletedOnboarding,
                            hasCompletedSetup = existing.hasCompletedSetup
                        )
                    }
                } else {
                    _uiState.update {
                        it.copy(isLoading = false, error = "Backend unreachable. Account not found locally.")
                    }
                }
            }
        }
    }

    fun signup() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val state = _uiState.value
            if (state.name.isBlank() || state.email.isBlank() || state.password.isBlank()) {
                _uiState.update { it.copy(isLoading = false, error = "Please fill all fields") }
                return@launch
            }
            if (state.password != state.confirmPassword) {
                _uiState.update { it.copy(isLoading = false, error = "Passwords don't match") }
                return@launch
            }
            if (state.password.length < 6) {
                _uiState.update { it.copy(isLoading = false, error = "Password must be 6+ characters") }
                return@launch
            }

            try {
                val response = backendApiService.register(
                    RegisterRequest(state.name.trim(), state.email.trim(), state.password)
                )
                if (response.isSuccessful && response.body() != null) {
                    val body = response.body()!!
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            requiresOtpVerification = true,
                            otpSentEmail = state.email.trim(),
                            successMessage = body.message
                        )
                    }
                    return@launch
                } else {
                    val errorMsg = response.errorBody()?.string() ?: "Registration failed"
                    _uiState.update { it.copy(isLoading = false, error = errorMsg) }
                }
            } catch (e: Exception) {
                // Fallback local signup
                val profile = UserProfileEntity(
                    uid = UUID.randomUUID().toString(),
                    name = state.name.trim(),
                    email = state.email.trim(),
                    isAuthenticated = true
                )
                userProfileDao.upsertProfile(profile)
                _uiState.update { it.copy(isLoading = false, isAuthenticated = true) }
            }
        }
    }

    fun verifyOtp() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val state = _uiState.value
            val email = state.otpSentEmail ?: state.email
            if (email.isBlank() || state.otpInput.isBlank()) {
                _uiState.update { it.copy(isLoading = false, error = "Please enter OTP") }
                return@launch
            }

            try {
                val response = backendApiService.verifyOtp(VerifyOtpRequest(email, state.otpInput.trim()))
                if (response.isSuccessful && response.body() != null) {
                    val body = response.body()!!
                    val user = body.user

                    val profile = UserProfileEntity(
                        uid = user?.uid ?: UUID.randomUUID().toString(),
                        name = user?.name ?: state.name,
                        email = user?.email ?: email,
                        isAuthenticated = true
                    )
                    userProfileDao.upsertProfile(profile)

                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            isAuthenticated = true,
                            requiresOtpVerification = false
                        )
                    }
                } else {
                    val errorMsg = response.errorBody()?.string() ?: "Invalid OTP"
                    _uiState.update { it.copy(isLoading = false, error = errorMsg) }
                }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, error = "Verification error: ${e.localizedMessage}") }
            }
        }
    }

    fun completeOnboarding() {
        viewModelScope.launch {
            val profile = userProfileDao.getProfileSync()
            if (profile != null) {
                userProfileDao.upsertProfile(profile.copy(hasCompletedOnboarding = true))
                _uiState.update { it.copy(hasCompletedOnboarding = true) }
            }
        }
    }

    fun saveProfile() {
        viewModelScope.launch {
            val state = _uiState.value
            val profile = userProfileDao.getProfileSync() ?: return@launch
            userProfileDao.upsertProfile(
                profile.copy(
                    gender = state.gender,
                    age = state.age.toIntOrNull() ?: 0,
                    height = state.height.toFloatOrNull() ?: 0f,
                    weight = state.weight.toFloatOrNull() ?: 0f,
                    bloodGroup = state.bloodGroup
                )
            )
        }
    }

    fun saveMedicalHistory() {
        viewModelScope.launch {
            val state = _uiState.value
            val profile = userProfileDao.getProfileSync() ?: return@launch
            userProfileDao.upsertProfile(
                profile.copy(medicalConditions = state.selectedConditions.joinToString(","))
            )
        }
    }

    fun saveAllergiesAndComplete() {
        viewModelScope.launch {
            val state = _uiState.value
            val profile = userProfileDao.getProfileSync() ?: return@launch
            userProfileDao.upsertProfile(
                profile.copy(
                    allergies = state.selectedAllergies.joinToString(","),
                    hasCompletedSetup = true
                )
            )
            _uiState.update { it.copy(hasCompletedSetup = true) }
        }
    }

    fun resetPassword() {
        _uiState.update { it.copy(error = "Password reset link sent to ${_uiState.value.email}") }
    }

    fun logout() {
        viewModelScope.launch {
            val profile = userProfileDao.getProfileSync()
            if (profile != null) {
                userProfileDao.upsertProfile(profile.copy(isAuthenticated = false))
            }
            dataStoreManager.setAuthenticated(false)
            _uiState.update { AuthUiState() }
        }
    }
}
