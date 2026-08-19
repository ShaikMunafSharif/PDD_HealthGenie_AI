import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score
import joblib
import os

def train_and_evaluate():
    # Load dataset
    data_path = 'data/symptom_dataset.csv'
    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found. Run generate_dataset.py first.")
        return

    df = pd.read_csv(data_path)
    
    # Separate features and target
    X = df.drop('Disease', axis=1)
    y = df['Disease']
    
    # Save column names for inference
    feature_columns = X.columns.tolist()
    joblib.dump(feature_columns, 'columns.joblib')
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Define models
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "Support Vector Machine": SVC(probability=True, random_state=42),
        "Naive Bayes": MultinomialNB()
    }
    
    best_model = None
    best_accuracy = 0
    best_name = ""
    
    print("Training and evaluating models...\n")
    for name, model in models.items():
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)
        acc = accuracy_score(y_test, predictions)
        print(f"{name} Accuracy: {acc:.4f}")
        
        if acc > best_accuracy:
            best_accuracy = acc
            best_model = model
            best_name = name
            
    print(f"\nBest Model: {best_name} with Accuracy: {best_accuracy:.4f}")
    
    # Save the best model
    joblib.dump(best_model, 'model.joblib')
    print("Best model saved to model.joblib")
    
if __name__ == "__main__":
    train_and_evaluate()
