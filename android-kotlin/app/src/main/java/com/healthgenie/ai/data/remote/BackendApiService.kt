package com.healthgenie.ai.data.remote

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

// ━━━ Request Models ━━━
data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String
)

data class VerifyOtpRequest(
    val email: String,
    val otp: String
)

data class ResendOtpRequest(
    val email: String
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class AiChatRequest(
    val prompt: String,
    val context: String = "general",
    val options: Map<String, String> = emptyMap()
)

// ━━━ Response Models ━━━
data class AuthUser(
    val uid: String?,
    val name: String?,
    val email: String?,
    val age: Int? = null,
    val gender: String? = null,
    val height: Float? = null,
    val weight: Float? = null
)

data class AuthResponse(
    val message: String,
    val token: String? = null,
    val user: AuthUser? = null,
    val email: String? = null
)

data class HospitalItem(
    val id: String?,
    val name: String,
    val address: String?,
    val rating: Double?,
    val phone: String?,
    val type: String? = "General Hospital",
    val lat: Double? = null,
    val lng: Double? = null
)

data class DoctorItem(
    val id: String?,
    val name: String,
    val specialty: String?,
    val address: String?,
    val rating: Double?,
    val phone: String?
)

data class HealthCheckResponse(
    val status: String,
    val timestamp: String?,
    val providers: Map<String, Boolean>?
)

// ━━━ Retrofit Interface ━━━
interface BackendApiService {

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @POST("auth/verify-otp")
    suspend fun verifyOtp(@Body request: VerifyOtpRequest): Response<AuthResponse>

    @POST("auth/resend-otp")
    suspend fun resendOtp(@Body request: ResendOtpRequest): Response<AuthResponse>

    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @GET("hospitals/nearby")
    suspend fun getNearbyHospitals(
        @Query("lat") lat: Double = 28.6139,
        @Query("lng") lng: Double = 77.2090,
        @Query("radius") radius: Int = 5000
    ): Response<List<HospitalItem>>

    @GET("doctors/nearby")
    suspend fun getNearbyDoctors(
        @Query("lat") lat: Double = 28.6139,
        @Query("lng") lng: Double = 77.2090,
        @Query("specialty") specialty: String = ""
    ): Response<List<DoctorItem>>

    @POST("ai/chat")
    suspend fun aiChat(@Body request: AiChatRequest): Response<Map<String, Any>>

    @GET("health")
    suspend fun healthCheck(): Response<HealthCheckResponse>
}
