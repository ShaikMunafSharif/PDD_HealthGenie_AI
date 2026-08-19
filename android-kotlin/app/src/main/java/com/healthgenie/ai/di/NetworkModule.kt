package com.healthgenie.ai.di

import com.healthgenie.ai.data.remote.OllamaRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideOllamaRepository(client: OkHttpClient): OllamaRepository {
        return OllamaRepository(client)
    }
}
