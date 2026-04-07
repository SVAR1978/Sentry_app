import pandas as pd
import numpy as np
import json
import joblib
import os
import warnings
import lightgbm as lgb 
from sklearn.model_selection import GroupKFold
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.linear_model import Ridge
from xgboost import XGBRegressor
import optuna

FEATURES_FILE = "../datasets/features.csv"
LABEL_FILE    = "../datasets/risk_label.csv"
MODEL_DIR     = "../models/"
OUT_SCORES    = "../datasets/all_area_scores.csv"

os.makedirs(MODEL_DIR, exist_ok=True)

N_FOLDS         = 3     
OPTUNA_TRIALS   = 100
RANDOM_STATE    = 42

features_df = pd.read_csv(FEATURES_FILE)
label_df    = pd.read_csv(LABEL_FILE)
 
df = features_df.merge(label_df, on="boundary_POL_STN_NM", how="left")
 
df_train   = df[df["risk_score"].notna()].copy().reset_index(drop=True)
df_predict = df[df["risk_score"].isna()].copy().reset_index(drop=True)

EXCLUDE = {"boundary_POL_STN_NM", "risk_score"}
BASE_FEATURES = [
    c for c in features_df.columns
    if c not in EXCLUDE
    and features_df[c].dtype in [np.float64, np.int64, float, int]
]

def engineer_features(df: pd.DataFrame,
                      fit_df: pd.DataFrame = None) -> pd.DataFrame:

    df = df.copy()
    ref = fit_df if fit_df is not None else df
 
    df["violent_crime_ratio"] = (
        (df["murder_count"] + df["rape_count"] +
         df["robbery_count"] + df["assault_count"])
        / (df["murder_count"] + df["rape_count"] + df["robbery_count"] +
           df["assault_count"] + df["sexual_harassment_count"] +
           df["gangrape_count"] + df["theft_count"] + 1e-9)
    )
 

    df["severity_crime_score"] = (
        df["murder_count"]             * 10.0 +
        df["rape_count"]               *  8.0 +
        df["gangrape_count"]           *  8.0 +
        df["robbery_count"]            *  5.0 +
        df["assault_count"]            *  4.0 +
        df["sexual_harassment_count"]  *  3.0 +
        df["theft_count"]              *  1.0
    )
 
    df["fatal_accident_ratio"] = (
        df["fatal_accidents_avg"]
        / (df["fatal_accidents_avg"] + df["injury_accidents_avg"] + 1e-9)
    )
 
    df["metro_accessibility"]    = 1.0 / (df["nearest_metro_km"]    + 0.5)
    df["hospital_accessibility"] = 1.0 / (df["nearest_hospital_km"] + 0.5)
    df["fire_accessibility"]     = 1.0 / (df["nearest_fire_stn_km"] + 0.5)
 
    df["emergency_access_score"] = (
        df["metro_accessibility"] +
        df["hospital_accessibility"] +
        df["fire_accessibility"]
    ) / 3.0
 
    df["safety_perception_score"] = (
        df["lighting_score"]     * 0.30 +
        df["security_score"]     * 0.25 +
        df["people_score"]       * 0.20 +
        df["gender_usage_score"] * 0.15 +
        df["walkpath_score"]     * 0.10
    )
 
    rape_max       = ref["rape_count"].max() + 1e-9
    harassment_max = ref["sexual_harassment_count"].max() + 1e-9
 
    df["women_safety_score"] = (
        (1 - df["rape_count"]              / rape_max)       * 0.40 +
        (1 - df["sexual_harassment_count"] / harassment_max) * 0.35 +
        (df["gender_usage_score"] / 5.0)                     * 0.25
    )

    df["tourist_exposure"] = (
        np.log1p(df["tourist_poi_count"]) * 0.6 +
        df["metro_accessibility"]          * 0.4
    )

    df["crime_x_darkness"] = (
        df["severity_crime_score"] * (5.0 - df["lighting_score"])
    )
 
    return df

df_train_eng   = engineer_features(df_train,   fit_df=df_train)
df_predict_eng = engineer_features(df_predict, fit_df=df_train)
 
ALL_FEATURES = [
    c for c in df_train_eng.columns
    if c not in EXCLUDE
    and df_train_eng[c].dtype in [np.float64, np.int64, float, int]
]
 
print(f"Engineered features: {len(ALL_FEATURES)}")
 
X_full = df_train_eng[ALL_FEATURES].values
y      = df_train["risk_score"].values
groups = df_train["boundary_POL_STN_NM"].values

print(df_train_eng.columns)

print(df_train_eng.drop(columns = ['boundary_POL_STN_NM']).corr())

def xgb_oof_rmse(params: dict, X: np.ndarray, y: np.ndarray,
                 groups: np.ndarray, df_for_eng: pd.DataFrame) -> float:
    gkf      = GroupKFold(n_splits=N_FOLDS)
    oof      = np.zeros(len(y))
    feat_idx = None   # computed once from first fold
 
    for train_idx, val_idx in gkf.split(X, y, groups=groups):
        fold_train_df = df_for_eng.iloc[train_idx].copy()
        fold_val_df   = df_for_eng.iloc[val_idx].copy()
 
        fold_train_eng = engineer_features(fold_train_df, fit_df=fold_train_df)
        fold_val_eng   = engineer_features(fold_val_df,   fit_df=fold_train_df)
 
        fold_feats = [
            c for c in fold_train_eng.columns
            if c not in EXCLUDE
            and fold_train_eng[c].dtype in [np.float64, np.int64, float, int]
        ]
 
        X_tr = fold_train_eng[fold_feats].values
        X_vl = fold_val_eng[fold_feats].values
        y_tr = y[train_idx]
        y_vl = y[val_idx]
 
        model = XGBRegressor(
            **params,
            early_stopping_rounds=30,
            random_state=RANDOM_STATE,
            n_jobs=-1,
            verbosity=0,
        )
        model.fit(X_tr, y_tr, eval_set=[(X_vl, y_vl)], verbose=False)
        preds = np.clip(model.predict(X_vl), 0, 100)
        oof[val_idx] = preds
 
    return float(np.sqrt(mean_squared_error(y, oof)))

def objective(trial):
    params = {
        "n_estimators":    trial.suggest_int("n_estimators", 200, 800),
        "max_depth":       trial.suggest_int("max_depth", 3, 6),
        "learning_rate":   trial.suggest_float("learning_rate", 0.01, 0.1, log=True),
        "subsample":       trial.suggest_float("subsample", 0.5, 1.0),
        "colsample_bytree":trial.suggest_float("colsample_bytree", 0.4, 1.0),
        "min_child_weight":trial.suggest_int("min_child_weight", 2, 10),
        "reg_alpha":       trial.suggest_float("reg_alpha", 0.0, 2.0),
        "reg_lambda":      trial.suggest_float("reg_lambda", 0.3, 3.0),
    }
    return xgb_oof_rmse(params, X_full, y, groups, df_train)

study = optuna.create_study(direction="minimize",
                            sampler=optuna.samplers.TPESampler(seed=RANDOM_STATE))
study.optimize(objective, n_trials=OPTUNA_TRIALS, show_progress_bar=True)

BEST_XGB_PARAMS = study.best_params
print(f"\nBest OOF RMSE: {study.best_value:.4f}")
print(f"Best params:   {json.dumps(BEST_XGB_PARAMS, indent=2)}")

gkf = GroupKFold(n_splits=N_FOLDS)
oof_xgb  = np.zeros(len(df_train))
oof_lgb  = np.zeros(len(df_train)) 
fold_scores = []

for fold, (train_idx, val_idx) in enumerate(
    gkf.split(X_full, y, groups=groups), 1
):
    fold_train_df  = df_train.iloc[train_idx].copy()
    fold_val_df    = df_train.iloc[val_idx].copy()
    fold_train_eng = engineer_features(fold_train_df, fit_df=fold_train_df)
    fold_val_eng   = engineer_features(fold_val_df,   fit_df=fold_train_df)
 
    fold_feats = [
        c for c in fold_train_eng.columns
        if c not in EXCLUDE
        and fold_train_eng[c].dtype in [np.float64, np.int64, float, int]
    ]
 
    X_tr = fold_train_eng[fold_feats].values
    X_vl = fold_val_eng[fold_feats].values
    y_tr = y[train_idx]
    y_vl = y[val_idx]
 
    xgb_model = XGBRegressor(
        **BEST_XGB_PARAMS,
        early_stopping_rounds=30,
        random_state=RANDOM_STATE, n_jobs=-1, verbosity=0,
    )
    xgb_model.fit(X_tr, y_tr, eval_set=[(X_vl, y_vl)], verbose=False)
    xgb_preds = np.clip(xgb_model.predict(X_vl), 0, 100)
    oof_xgb[val_idx] = xgb_preds

    lgb_params = {
        "n_estimators":     BEST_XGB_PARAMS.get("n_estimators", 500),
        "max_depth":        BEST_XGB_PARAMS.get("max_depth", 4),
        "learning_rate":    BEST_XGB_PARAMS.get("learning_rate", 0.03),
        "subsample":        BEST_XGB_PARAMS.get("subsample", 0.8),
        "colsample_bytree": BEST_XGB_PARAMS.get("colsample_bytree", 0.8),
        "min_child_samples":max(5, BEST_XGB_PARAMS.get("min_child_weight", 3)),
        "reg_alpha":        BEST_XGB_PARAMS.get("reg_alpha", 0.1),
        "reg_lambda":       BEST_XGB_PARAMS.get("reg_lambda", 1.5),
        "random_state":     RANDOM_STATE,
        "n_jobs":           -1,
        "verbose":          -1,
    }
    lgb_model = lgb.LGBMRegressor(**lgb_params)
    lgb_model.fit(
        X_tr, y_tr,
        eval_set=[(X_vl, y_vl)],
        callbacks=[lgb.early_stopping(30, verbose=False),
                    lgb.log_evaluation(-1)],
    )
    lgb_preds = np.clip(lgb_model.predict(X_vl), 0, 100)
    oof_lgb[val_idx] = lgb_preds
    ensemble_preds = 0.5 * xgb_preds + 0.5 * lgb_preds

    fold_r2   = r2_score(y_vl, ensemble_preds)
    fold_rmse = np.sqrt(mean_squared_error(y_vl, ensemble_preds))
    fold_mae  = mean_absolute_error(y_vl, ensemble_preds)
    fold_scores.append({"r2": fold_r2, "rmse": fold_rmse, "mae": fold_mae})
 
    val_areas = groups[val_idx]


oof_ensemble = 0.6 * oof_xgb + 0.4 * oof_lgb
oof_r2   = r2_score(y, oof_ensemble)
oof_rmse = np.sqrt(mean_squared_error(y, oof_ensemble))
oof_mae  = mean_absolute_error(y, oof_ensemble)

def categorize(scores):
    LOW_THRESH = np.percentile(scores, 50)   
    HIGH_THRESH = np.percentile(scores, 85)  
    return pd.cut(scores, bins=[-np.inf, LOW_THRESH, HIGH_THRESH, np.inf],
                  labels=["Low", "Medium", "High"])
 
actual_cat    = categorize(y)
predicted_cat = categorize(oof_ensemble)
cat_acc       = (actual_cat == predicted_cat).mean()
critical_err  = ((actual_cat == "High") & (predicted_cat == "Low")).sum()
 
print(f"Category accuracy : {cat_acc:.3f}")
print(f"Critical errors   : {critical_err}  (High predicted as Low)")
 
print("\nConfusion matrix:")
print(pd.crosstab(actual_cat, predicted_cat,
                  rownames=["Actual"], colnames=["Predicted"]))
 
# Residual analysis
residuals = y - oof_ensemble
error_df = pd.DataFrame({
    "area":      groups,
    "actual":    y,
    "predicted": oof_ensemble,
    "error":     residuals,
    "abs_error": np.abs(residuals),
}).sort_values("abs_error", ascending=False)

print("\nTop 10 worst predictions:")
print(error_df.head(10)[["area","actual","predicted","error"]].to_string(index=False))

df_train_final = engineer_features(df_train, fit_df=df_train)
final_feats = [
    c for c in df_train_final.columns
    if c not in EXCLUDE
    and df_train_final[c].dtype in [np.float64, np.int64, float, int]
]
X_train_final = df_train_final[final_feats].values
 
final_xgb = XGBRegressor(
    **{k: v for k, v in BEST_XGB_PARAMS.items()},
    random_state=RANDOM_STATE, n_jobs=-1, verbosity=0,
)
final_xgb.fit(X_train_final, y)

lgb_final_params = {
        k: (max(5, v) if k == "min_child_weight" else v)
        for k, v in BEST_XGB_PARAMS.items()
    }
lgb_final_params["min_child_samples"] = lgb_final_params.pop(
    "min_child_weight", 5)
lgb_final_params.update({
    "random_state": RANDOM_STATE, "n_jobs": -1, "verbose": -1
})
final_lgb = lgb.LGBMRegressor(**lgb_final_params)
final_lgb.fit(X_train_final, y)

importance_df = pd.DataFrame({
    "feature":    final_feats,
    "importance": final_xgb.feature_importances_,
}).sort_values("importance", ascending=False)

zero_imp = importance_df[importance_df["importance"] < 0.005]

if len(zero_imp):
    for _, row in zero_imp.iterrows():
        print(f"  {row['feature']:<35} {row['importance']:.4f}")

selected_features = [
    c for c in final_feats
    if c not in zero_imp["feature"].values
]
print(f"Selected features after importance pruning: {len(selected_features)}")

X_new = df_train_eng[selected_features].values
print(f"X_new shape: {X_new.shape}")

oof_xgb  = np.zeros(len(df_train))
oof_lgb  = np.zeros(len(df_train))
fold_scores = []

for fold, (train_idx, val_idx) in enumerate(
    gkf.split(X_new, y, groups=groups), 1
):
    fold_train_df  = df_train.iloc[train_idx].copy()
    fold_val_df    = df_train.iloc[val_idx].copy()
    fold_train_eng = engineer_features(fold_train_df, fit_df=fold_train_df)
    fold_val_eng   = engineer_features(fold_val_df,   fit_df=fold_train_df)
 
    fold_feats = [c for c in selected_features if c in fold_train_eng.columns]
 
    X_tr = fold_train_eng[fold_feats].values
    X_vl = fold_val_eng[fold_feats].values
    y_tr = y[train_idx]
    y_vl = y[val_idx]
 
    xgb_model = XGBRegressor(
        **BEST_XGB_PARAMS,
        early_stopping_rounds=30,
        random_state=RANDOM_STATE, n_jobs=-1, verbosity=0,
    )
    xgb_model.fit(X_tr, y_tr, eval_set=[(X_vl, y_vl)], verbose=False)
    xgb_preds = np.clip(xgb_model.predict(X_vl), 0, 100)
    oof_xgb[val_idx] = xgb_preds

    lgb_params = {
        "n_estimators":     BEST_XGB_PARAMS.get("n_estimators", 500),
        "max_depth":        BEST_XGB_PARAMS.get("max_depth", 4),
        "learning_rate":    BEST_XGB_PARAMS.get("learning_rate", 0.03),
        "subsample":        BEST_XGB_PARAMS.get("subsample", 0.8),
        "colsample_bytree": BEST_XGB_PARAMS.get("colsample_bytree", 0.8),
        "min_child_samples":max(5, BEST_XGB_PARAMS.get("min_child_weight", 3)),
        "reg_alpha":        BEST_XGB_PARAMS.get("reg_alpha", 0.1),
        "reg_lambda":       BEST_XGB_PARAMS.get("reg_lambda", 1.5),
        "random_state":     RANDOM_STATE,
        "n_jobs":           -1,
        "verbose":          -1,
    }
    lgb_model = lgb.LGBMRegressor(**lgb_params)
    lgb_model.fit(
        X_tr, y_tr,
        eval_set=[(X_vl, y_vl)],
        callbacks=[lgb.early_stopping(30, verbose=False),
                    lgb.log_evaluation(-1)],
    )
    lgb_preds = np.clip(lgb_model.predict(X_vl), 0, 100)
    oof_lgb[val_idx] = lgb_preds
    ensemble_preds = 0.6 * xgb_preds + 0.4 * lgb_preds

    fold_r2   = r2_score(y_vl, ensemble_preds)
    fold_rmse = np.sqrt(mean_squared_error(y_vl, ensemble_preds))
    fold_mae  = mean_absolute_error(y_vl, ensemble_preds)
    fold_scores.append({"r2": fold_r2, "rmse": fold_rmse, "mae": fold_mae})

oof_ensemble = 0.6 * oof_xgb + 0.4 * oof_lgb
oof_r2   = r2_score(y, oof_ensemble)
oof_rmse = np.sqrt(mean_squared_error(y, oof_ensemble))
oof_mae  = mean_absolute_error(y, oof_ensemble)

actual_cat    = categorize(y)
predicted_cat = categorize(oof_ensemble)
cat_acc       = (actual_cat == predicted_cat).mean()
critical_err  = ((actual_cat == "High") & (predicted_cat == "Low")).sum()

print(f"Selected-feature OOF -> R2: {oof_r2:.4f}, RMSE: {oof_rmse:.4f}, MAE: {oof_mae:.4f}")
print(f"Category accuracy : {cat_acc:.3f}")
print(f"Critical errors   : {critical_err}  (High predicted as Low)")

df_train_final = engineer_features(df_train, fit_df=df_train)
final_feats = selected_features.copy()
X_train_final = df_train_final[final_feats].values
 
final_xgb = XGBRegressor(
    **{k: v for k, v in BEST_XGB_PARAMS.items()},
    random_state=RANDOM_STATE, n_jobs=-1, verbosity=0,
 )
final_xgb.fit(X_train_final, y)

lgb_final_params = {
        k: (max(5, v) if k == "min_child_weight" else v)
        for k, v in BEST_XGB_PARAMS.items()
    }
lgb_final_params["min_child_samples"] = lgb_final_params.pop(
    "min_child_weight", 5)
lgb_final_params.update({
    "random_state": RANDOM_STATE, "n_jobs": -1, "verbose": -1
})
final_lgb = lgb.LGBMRegressor(**lgb_final_params)
final_lgb.fit(X_train_final, y)

print(X_train_final.shape)

train_scores = pd.DataFrame({
    "boundary_POL_STN_NM": groups,
    "base_score":          np.clip(oof_ensemble, 0, 100).round(2),
    "source":              "oof_prediction",
})
 
if len(df_predict) > 0:
    df_pred_eng   = engineer_features(df_predict, fit_df=df_train)
    X_pred_final  = df_pred_eng[final_feats].values
 
    xgb_pred_scores = np.clip(final_xgb.predict(X_pred_final), 0, 100)
    lgb_pred_scores = np.clip(final_lgb.predict(X_pred_final), 0, 100)
    pred_scores = 0.6 * xgb_pred_scores + 0.4 * lgb_pred_scores

 
    pred_df = pd.DataFrame({
        "boundary_POL_STN_NM": df_predict["boundary_POL_STN_NM"].values,
        "base_score":          pred_scores.round(2),
        "source":              "model_prediction",
    })
else:
    pred_df = pd.DataFrame()

all_scores = pd.concat([train_scores, pred_df], ignore_index=True)
all_scores["risk_category"] = categorize(all_scores["base_score"])
all_scores = all_scores.sort_values("base_score", ascending=False)
all_scores.to_csv(OUT_SCORES, index=False)
 
print(f"\nRisk distribution (all 180 areas):")
print(all_scores["risk_category"].value_counts().to_string())
print(f"\nTop 10 highest risk areas:")
print(all_scores.head(10)[
    ["boundary_POL_STN_NM","base_score","risk_category","source"]
].to_string(index=False))

joblib.dump(final_xgb, os.path.join(MODEL_DIR, "risk_model_xgb.pkl"))
joblib.dump(final_lgb, os.path.join(MODEL_DIR, "risk_model_lgb.pkl"))
 
metadata = {
    "version":            "v1",
    "feature_names":      final_feats,
    "base_features":      BASE_FEATURES,
    "oof_r2":             round(oof_r2,   4),
    "oof_rmse":           round(oof_rmse, 4),
    "oof_mae":            round(oof_mae,  4),
    "category_accuracy":  round(float(cat_acc), 4),
    "critical_errors":    int(critical_err),
    "n_training_areas":   len(df_train),
    "n_folds":            N_FOLDS,
    "ensemble":           "XGBoost+LightGBM (0.6/0.4)",
    "best_xgb_params":    BEST_XGB_PARAMS,
    "optuna_trials":      OPTUNA_TRIALS,
}
with open(os.path.join(MODEL_DIR, "model_metadata.json"), "w") as f:
    json.dump(metadata, f, indent=2)
 
importance_df.to_csv(
    os.path.join(MODEL_DIR, "feature_importance.csv"), index=False)