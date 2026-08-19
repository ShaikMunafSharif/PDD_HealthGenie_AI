package com.healthgenie.ai.data.remote

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

data class StreamChunk(
    val token: String,
    val full: String,
    val done: Boolean
)

data class OllamaStatus(
    val available: Boolean,
    val models: List<String> = emptyList()
)

@Singleton
class OllamaRepository @Inject constructor(
    private val client: OkHttpClient
) {
    companion object {
        // Default to emulator localhost; change for physical device
        var baseUrl = "http://10.0.2.2:11434"
        const val DEFAULT_MODEL = "llama3.1:8b"

        // ━━━ SYSTEM PROMPTS (from web app backend) ━━━
        val SYSTEM_PROMPTS = mapOf(
            "general" to "You are HealthGenie AI, a professional health assistant. Provide helpful, accurate health information while always recommending professional medical consultation for serious concerns. Be conversational, supportive, and informative. Keep responses concise (3-4 paragraphs max).",
            "symptoms" to "You are HealthGenie AI, a symptom analysis specialist. When given symptoms, provide possible conditions (ranked by likelihood), severity assessment, recommended actions, and when to seek emergency care. Always include a medical disclaimer.",
            "diet" to "You are HealthGenie AI, a nutrition specialist. Provide personalized meal plans, nutritional advice, and dietary recommendations. Consider common dietary needs and restrictions. Include specific meals, portions, and nutritional benefits.",
            "exercise" to "You are HealthGenie AI, a fitness specialist. Recommend exercises based on user goals and fitness level. Include proper form descriptions, sets/reps, and safety precautions. Suggest alternatives for different fitness levels.",
            "women" to "You are HealthGenie AI, a women's health specialist. Provide information about menstrual health, hormonal balance, PCOS management, and women-specific wellness topics. Be sensitive, supportive, and medically accurate.",
            "pregnancy" to "You are HealthGenie AI, a pregnancy care specialist. Provide trimester-specific advice, safe practices, nutrition guidance, and emotional support for expecting mothers. Always recommend regular prenatal care.",
            "doctor" to "You are HealthGenie AI, a medical referral assistant. Help users understand what type of doctor or specialist they might need based on their symptoms or health concerns. Explain the roles of different specialists.",
            "firstAid" to "You are HealthGenie AI, a first aid specialist. Provide clear, step-by-step emergency and first aid instructions. Prioritize life-threatening situations and always recommend calling emergency services when appropriate.",
            "healthScore" to "You are HealthGenie AI, a health analytics specialist. Analyze health metrics and scores to provide personalized improvement tips, identify areas needing attention, and celebrate progress."
        )

        // ━━━ FALLBACK RESPONSES (from web app) ━━━
        val FALLBACK_RESPONSES = mapOf(
            "general" to "I'm currently unable to connect to my AI engine. Here are some general health tips:\n\n• Stay hydrated — aim for 8 glasses of water daily\n• Get 7-9 hours of quality sleep\n• Incorporate 30 minutes of moderate exercise daily\n• Eat a balanced diet rich in fruits and vegetables\n• Practice stress management through meditation or deep breathing\n\n⚠\uFE0F For specific health concerns, please consult a healthcare professional.",
            "symptoms" to "I'm unable to analyze your symptoms right now. Please try again later, or consult a healthcare professional if symptoms are severe.",
            "diet" to "I'm unable to generate a meal plan right now. In the meantime:\n\n• Eat a variety of fruits and vegetables\n• Choose whole grains over refined carbs\n• Include lean protein with each meal\n• Stay hydrated throughout the day",
            "exercise" to "I'm unable to generate exercise recommendations right now. General guidelines:\n\n• Aim for 150 minutes of moderate exercise weekly\n• Include strength training 2-3 days per week\n• Stretch before and after workouts\n• Listen to your body and rest when needed",
            "healthScore" to "I'm currently unable to provide AI-powered insights. Here are some general health tips:\n\n• Stay hydrated — aim for 8 glasses of water daily\n• Get 7-9 hours of quality sleep\n• Incorporate 30 minutes of moderate exercise daily\n• Eat a balanced diet rich in fruits and vegetables"
        )
    }

    // ━━━ CHECK STATUS ━━━
    suspend fun checkStatus(): OllamaStatus {
        return try {
            val request = Request.Builder()
                .url("$baseUrl/api/tags")
                .get()
                .build()
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: ""
                val json = JSONObject(body)
                val models = json.optJSONArray("models")
                val modelList = mutableListOf<String>()
                if (models != null) {
                    for (i in 0 until models.length()) {
                        modelList.add(models.getJSONObject(i).optString("name", ""))
                    }
                }
                OllamaStatus(available = true, models = modelList)
            } else {
                OllamaStatus(available = false)
            }
        } catch (e: Exception) {
            OllamaStatus(available = false)
        }
    }

    // ━━━ STREAMING GENERATE ━━━
    fun streamGenerate(
        prompt: String,
        context: String = "general",
        model: String = DEFAULT_MODEL,
        temperature: Float = 0.7f,
        topP: Float = 0.9f,
        numPredict: Int = 500
    ): Flow<StreamChunk> = flow {
        val systemPrompt = SYSTEM_PROMPTS[context] ?: SYSTEM_PROMPTS["general"]!!
        val fullPrompt = "$systemPrompt\n\nUser: $prompt"

        val jsonBody = JSONObject().apply {
            put("model", model)
            put("prompt", fullPrompt)
            put("stream", true)
            put("options", JSONObject().apply {
                put("temperature", temperature.toDouble())
                put("top_p", topP.toDouble())
                put("num_predict", numPredict)
            })
        }

        val request = Request.Builder()
            .url("$baseUrl/api/generate")
            .post(jsonBody.toString().toRequestBody("application/json".toMediaType()))
            .build()

        try {
            val response = client.newCall(request).execute()
            if (!response.isSuccessful) {
                emit(StreamChunk(
                    token = getFallback(context),
                    full = getFallback(context),
                    done = true
                ))
                return@flow
            }

            val source = response.body?.source() ?: return@flow
            val accumulated = StringBuilder()

            while (!source.exhausted()) {
                val line = source.readUtf8Line() ?: continue
                if (line.isBlank()) continue

                try {
                    val json = JSONObject(line)
                    val token = json.optString("response", "")
                    val done = json.optBoolean("done", false)

                    if (token.isNotEmpty()) {
                        accumulated.append(token)
                        emit(StreamChunk(
                            token = token,
                            full = accumulated.toString(),
                            done = done
                        ))
                    }

                    if (done) break
                } catch (e: Exception) {
                    // Skip malformed JSON lines
                }
            }
            response.close()
        } catch (e: IOException) {
            emit(StreamChunk(
                token = getFallback(context),
                full = getFallback(context),
                done = true
            ))
        }
    }.flowOn(Dispatchers.IO)

    // ━━━ NON-STREAMING ━━━
    suspend fun generate(
        prompt: String,
        context: String = "general"
    ): String {
        val builder = StringBuilder()
        streamGenerate(prompt, context).collect { chunk ->
            if (chunk.done) {
                builder.clear()
                builder.append(chunk.full)
            }
        }
        return builder.toString().ifEmpty { getFallback(context) }
    }

    private fun getFallback(context: String): String {
        return FALLBACK_RESPONSES[context] ?: FALLBACK_RESPONSES["general"]!!
    }
}
