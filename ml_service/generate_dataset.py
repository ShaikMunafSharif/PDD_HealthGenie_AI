import pandas as pd
import numpy as np
import random
import os

def generate_symptom_dataset(num_samples=1000):
    # Define common symptoms (matching the frontend's common list and body parts)
    symptoms = [
        'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Dizziness',
        'Body Ache', 'Sore Throat', 'Chest Pain', 'Shortness of Breath',
        'Stomach Pain', 'Diarrhea', 'Back Pain', 'Joint Pain', 'Rash',
        'Insomnia', 'Anxiety', 'Loss of Appetite', 'Swelling', 'Numbness',
        'Head', 'Throat', 'Chest', 'Stomach', 'Left Arm', 'Right Arm',
        'Back', 'Hip', 'Left Leg', 'Right Leg', 'Left Knee', 'Right Knee'
    ]
    symptoms = [s.lower() for s in symptoms]
    
    # Define diseases and their typical symptoms
    diseases = {
        'Viral Infection': ['fever', 'fatigue', 'body ache', 'sore throat', 'cough'],
        'Migraine': ['headache', 'head', 'nausea', 'dizziness'],
        'Gastroenteritis': ['nausea', 'stomach pain', 'stomach', 'diarrhea', 'fever', 'loss of appetite'],
        'COVID-19': ['fever', 'cough', 'fatigue', 'shortness of breath', 'body ache', 'loss of appetite', 'chest', 'throat'],
        'Bronchitis': ['cough', 'chest pain', 'chest', 'fatigue', 'shortness of breath', 'throat'],
        'Seasonal Allergies': ['sore throat', 'headache', 'fatigue', 'rash'],
        'Tension Headache': ['headache', 'head', 'fatigue', 'back pain', 'back'],
        'Arthritis': ['joint pain', 'swelling', 'left knee', 'right knee', 'left leg', 'right leg', 'hip'],
        'Food Poisoning': ['nausea', 'diarrhea', 'stomach pain', 'stomach', 'fever', 'loss of appetite'],
        'Strep Throat': ['sore throat', 'throat', 'fever', 'headache', 'swelling'],
        'Sciatica': ['back pain', 'back', 'left leg', 'right leg', 'numbness'],
        'Anxiety Disorder': ['anxiety', 'insomnia', 'chest pain', 'dizziness', 'shortness of breath'],
        'Hypertension': ['headache', 'dizziness', 'chest pain', 'chest', 'fatigue']
    }
    
    data = []
    
    for _ in range(num_samples):
        # Pick a disease
        disease, typical_symptoms = random.choice(list(diseases.items()))
        
        # Start with empty symptom vector
        row = {symp: 0 for symp in symptoms}
        row['Disease'] = disease
        
        # Add typical symptoms with high probability
        for symp in typical_symptoms:
            if random.random() > 0.1: # 90% chance to have a typical symptom
                row[symp] = 1
                
        # Add some random noise (other symptoms) with low probability
        for symp in symptoms:
            if symp not in typical_symptoms and random.random() < 0.05: # 5% chance for noise
                row[symp] = 1
                
        # Only keep rows that have at least one symptom
        if sum(row[s] for s in symptoms) > 0:
            data.append(row)
            
    df = pd.DataFrame(data)
    
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/symptom_dataset.csv', index=False)
    print(f"Dataset generated successfully with {len(df)} samples at data/symptom_dataset.csv")

if __name__ == '__main__':
    generate_symptom_dataset(1500)
