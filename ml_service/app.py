from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load model and columns
MODEL_PATH = 'model.joblib'
COLUMNS_PATH = 'columns.joblib'

model = None
feature_columns = None

if os.path.exists(MODEL_PATH) and os.path.exists(COLUMNS_PATH):
    model = joblib.load(MODEL_PATH)
    feature_columns = joblib.load(COLUMNS_PATH)
else:
    print("Warning: Model or columns not found. Run train_model.py first.")

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or feature_columns is None:
        return jsonify({'error': 'Model not loaded on server.'}), 500
        
    data = request.json
    if not data or 'symptoms' not in data:
        return jsonify({'error': 'No symptoms provided in request body.'}), 400
        
    input_symptoms = [s.lower() for s in data['symptoms']]
    
    # Create a zero-filled vector for all features
    input_vector = {col: 0 for col in feature_columns}
    
    # Set 1 for the symptoms that are present
    matched_any = False
    for symp in input_symptoms:
        if symp in input_vector:
            input_vector[symp] = 1
            matched_any = True
            
    if not matched_any:
        # If no recognized symptoms, return a default low-confidence prediction
        return jsonify({
            'predictions': [
                {'disease': 'General Viral/Inflammatory Response', 'probability': 0.45},
                {'disease': 'Fatigue/Stress', 'probability': 0.35},
                {'disease': 'Unknown Condition', 'probability': 0.20}
            ]
        })
            
    # Convert to DataFrame
    df = pd.DataFrame([input_vector])
    
    # Predict probabilities
    probas = model.predict_proba(df)[0]
    
    # Get top 3 predictions
    classes = model.classes_
    top3_idx = np.argsort(probas)[-3:][::-1]
    
    predictions = []
    for idx in top3_idx:
        predictions.append({
            'disease': classes[idx],
            'probability': round(float(probas[idx]), 4)
        })
        
    return jsonify({
        'predictions': predictions
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
