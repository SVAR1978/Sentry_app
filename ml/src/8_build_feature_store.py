import pandas as pd
import json
import joblib

xgb_model = joblib.load('../models/risk_model_xgb_v3.pkl')
lgb_model = joblib.load('../models/risk_model_lgb_v3.pkl')

features = pd.read_csv('../processed/features.csv')
metadata = json.load(open('../models/model_metadata_v3.json'))

feature_cols = metadata['feature_names']

X = features[feature_cols].values
xgb_pred = xgb_model.predict(X)
lgb_pred = lgb_model.predict(X)

base_scores = 0.5 * xgb_pred + 0.5 * lgb_pred

records = []
for i, row in features.iterrows():
    score = base_scores[i]
    if score < 26.98:
        category = 'Low'
    elif score < 39.68:
        category = 'Medium'
    else:
        category = 'High'
    
    record = {
        'area_id': row['boundary_POL_STN_NM'],
        'base_score': round(float(score), 2), 
        'risk_category': category
    }
    records.append(record)

with open('../processed/feature_store.json', 'w') as f:
    json.dump(records, f, indent=2)

print(f"{len(records)} areas with pre-computed scores")