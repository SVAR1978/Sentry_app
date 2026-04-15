# ML Pipeline

This folder contains the Python data pipeline used to build the tourist safety risk model for the Sentry app. It preprocesses Delhi datasets, merges them into a single feature table, trains the risk model, and exports a precomputed feature store for inference.

## What is inside

- `datasets/` - raw and processed training data, geojson boundaries, cached OSM results, review features, and generated CSV/JSON outputs
- `models/` - model metadata and feature importance artifacts
- `notebooks/` - exploratory and step-by-step notebook versions of the pipeline
- `src/` - executable Python scripts for preprocessing, training, and feature-store generation
- `requirements.txt` - Python dependencies for the ML workflow

## Pipeline overview

The pipeline is organized as a sequence of scripts:

1. `1_preprocess_crime.py` - cleans and aggregates crime data
2. `2_preprocess_accident.py` - processes accident statistics
3. `3_preprocess_safetipin.py` - normalizes Safetipin safety indicators
4. `4_preprocess_reviews.py` - builds review and sentiment features
5. `5_preprocess_osm.py` - extracts OpenStreetMap-based accessibility features
6. `6_merge_all_datasets.py` - joins all sources and creates `features.csv` and `risk_label.csv`
7. `7_train_model.py` - trains the risk model and evaluates performance
8. `8_build_feature_store.py` - exports precomputed area scores to `feature_store.json`

## Data sources

The merged feature set combines multiple Delhi safety signals, including:

- crime counts and year-over-year change
- Safetipin perception and lighting metrics
- accident severity and fatality signals
- OSM-derived accessibility features such as bus stops, hospitals, metro access, toilets, and tourist points
- sentiment and review-based indicators
- geospatial police-station boundary mappings

## Generated outputs

Common outputs produced by the pipeline include:

- `datasets/features.csv`
- `datasets/risk_label.csv`
- `datasets/all_area_scores.csv`
- `datasets/feature_store.json`
- `models/model_metadata.json`
- `models/feature_importance.csv`

## Environment setup

Use Python 3.10+.

```bash
cd ml
pip install -r requirements.txt
```

If you are running the scripts from `src/`, make sure the working directory is `ml/src` or adjust the relative paths in the scripts accordingly.

## Running the pipeline

Typical execution order:

```bash
python src/1_preprocess_crime.py
python src/2_preprocess_accident.py
python src/3_preprocess_safetipin.py
python src/4_preprocess_reviews.py
python src/5_preprocess_osm.py
python src/6_merge_all_datasets.py
python src/7_train_model.py
python src/8_build_feature_store.py
```

## Model notes

The training scripts in this folder use engineered features and tree-based models for area-level safety scoring. The exported feature store is consumed by the serverless risk API and the application backend for fast lookup during map and routing flows.

## Related app components

- The backend risk API reads precomputed scores from the generated feature store.
- The mobile app uses those scores to render risk zones and area-level safety feedback on the map.
