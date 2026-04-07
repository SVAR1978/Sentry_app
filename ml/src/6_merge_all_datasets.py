import pandas as pd
import numpy as np
import re
import os

MAPPING_FILE   = "../datasets/delhipolicegeolocations/ps_name_mapping.csv"
CRIME_FILE     = "../datasets/crime/crime_processed.csv"
SAFETIPIN_FILE = "../datasets/safetipin/safetipin_processed.csv"
ACCIDENT_FILE  = "../datasets/accident/accident_processed.csv"
OSM_FILE       = "../datasets/osm/osm_features_preprocessed.csv"
SENTIMENT_FILE = "../datasets/reviews/sentiment_features.csv"
 
OUT_FEATURES   = "../datasets/features.csv"
OUT_LABEL      = "../datasets/risk_label.csv"
 
os.makedirs(os.path.dirname(OUT_FEATURES), exist_ok=True)

def normalize_name(s: str) -> str:
    s = str(s).lower().strip()
    s = s.replace("ps ", "").replace("p.s.", "")
    s = re.sub(r"[.\-/()\[\]]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s
 
 
def normalize_district(s: str) -> str:
    return re.sub(r"[\s\-]+", " ", str(s).strip().upper())
 
 
def minmax_normalize(series: pd.Series) -> pd.Series:
    mn, mx = series.min(), series.max()
    return (series - mn) / (mx - mn + 1e-9)

mapping = pd.read_csv(MAPPING_FILE)
 
all_boundaries = mapping["boundary_POL_STN_NM"].dropna().unique().tolist()
 
crime_to_bnd_multi: dict[str, list[str]] = {}
for _, r in mapping.iterrows():
    if pd.notna(r["crime_nm_pol"]) and pd.notna(r["boundary_POL_STN_NM"]):
        key = normalize_name(r["crime_nm_pol"])
        crime_to_bnd_multi.setdefault(key, []).append(r["boundary_POL_STN_NM"])
 
train_boundaries = set(
    mapping.loc[
        mapping["match_type"].isin(["exact", "manual", "split"]),
        "boundary_POL_STN_NM"
    ].tolist()
)

crime_raw = pd.read_csv(CRIME_FILE)
crime_raw["_key"] = crime_raw["nm_pol"].apply(normalize_name)
 
expanded_rows = []
unmapped_names = []
for _, row in crime_raw.iterrows():
    boundaries = crime_to_bnd_multi.get(row["_key"])
    if boundaries:
        for bnd in boundaries:
            new_row = row.copy()
            new_row["boundary"] = bnd
            expanded_rows.append(new_row)
    else:
        unmapped_names.append(row["nm_pol"])
 
if unmapped_names:
    for name in sorted(set(unmapped_names)):
        print(f"  INFO: '{name}' has no boundary polygon — excluded (intentional)")
 
crime_raw = pd.DataFrame(expanded_rows).reset_index(drop=True)
 
crime_raw = crime_raw.rename(columns={
    "assualt murders":    "assault_count",
    "sexual harassement": "sexual_harassment_count",
    "murder":             "murder_count",
    "rape":               "rape_count",
    "robbery":            "robbery_count",
    "theft":              "theft_count",
    "gangrape":           "gangrape_count",
    "area":               "area"
})
 
crime_2018 = crime_raw[crime_raw["year"] == 2018].copy()
crime_2019 = crime_raw[crime_raw["year"] == 2019].copy()
 
c18_tot = crime_2018.groupby("boundary")["totalcrime"].sum()
c19_tot = crime_2019.groupby("boundary")["totalcrime"].sum()
yoy = ((c19_tot - c18_tot) / c18_tot.replace(0, np.nan)
       ).fillna(0).clip(-1, 2).rename("crime_yoy_delta")


crime_feats = crime_2018.groupby("boundary").agg(
    murder_count            =("murder_count",            "sum"),
    rape_count              =("rape_count",               "sum"),
    robbery_count           =("robbery_count",            "sum"),
    theft_count             =("theft_count",              "sum"),
    assault_count           =("assault_count",            "sum"),
    sexual_harassment_count =("sexual_harassment_count",  "sum"),
    gangrape_count          =("gangrape_count",           "sum"),
    _crime_per_area         =("crime_per_area",           "mean"),
    _totalcrime             =("totalcrime",               "sum"),
    _district               =("district",                 "first"),
).join(yoy)
 

accident_raw = pd.read_csv(ACCIDENT_FILE)
accident_raw["_dn"] = accident_raw["Traffic_Districts"].apply(normalize_district)

accident_avg = (
    accident_raw.groupby("_dn")
    .agg(
        fatal_accidents_avg  =("Fatal_count",  "mean"),
        injury_accidents_avg =("Injury_count", "mean"),
    )
    .reset_index()
    .rename(columns={"_dn": "district_norm"})
)
 
crime_feats["_district_norm"] = crime_feats["_district"].apply(normalize_district)
crime_feats = (
    crime_feats.reset_index()
    .merge(accident_avg, left_on="_district_norm",
           right_on="district_norm", how="left")
    .set_index("boundary")
)
 
n_acc_missing = crime_feats["fatal_accidents_avg"].isna().sum()
if n_acc_missing:
    print(f"  WARNING: {n_acc_missing} boundaries missing accident data — filling with median")
 
crime_feats["fatal_accidents_avg"] = (
    crime_feats["fatal_accidents_avg"].fillna(crime_feats["fatal_accidents_avg"].median())
)
crime_feats["injury_accidents_avg"] = (
    crime_feats["injury_accidents_avg"].fillna(crime_feats["injury_accidents_avg"].median())
)
crime_feats["area"] = crime_raw["area"]

print(f"  Accident features joined: {len(crime_feats)} boundaries  (NaN: {crime_feats['fatal_accidents_avg'].isna().sum()})")

safe_raw = pd.read_csv(SAFETIPIN_FILE)
safe_raw = safe_raw.rename(columns={
    "Safety Score":  "safetipin_overall",
    "People":        "people_score",
    "Visibility":    "visibility_score",
    "Openness":      "openness_score",
    "Security":      "security_score",
    "Walkpath":      "walkpath_score",
    "Transport":     "transport_score",
    "Gender Usage":  "gender_usage_score",
    "Lighting":      "lighting_score",
    "Feeling":       "feeling_score",
    "Police_Station":"_ps_raw",
})
 
bnd_norm_map = {normalize_name(b.replace("PS ", "")): b for b in all_boundaries}
 
def safe_to_bnd(ps_name: str):
    n = normalize_name(ps_name)
    if n in crime_to_bnd_multi:
        return crime_to_bnd_multi[n][0]
    if n in bnd_norm_map:
        return bnd_norm_map[n]
    return None
 
safe_raw["boundary"] = safe_raw["_ps_raw"].apply(safe_to_bnd)
n_dropped = safe_raw["boundary"].isna().sum()
if n_dropped:
    dropped = safe_raw.loc[safe_raw["boundary"].isna(), "_ps_raw"].tolist()
    print(f"  {n_dropped} Safetipin rows dropped (no boundary polygon): {dropped}")
 
safe_raw = safe_raw.dropna(subset=["boundary"])
safe_feats = safe_raw.groupby("boundary")[[
    "safetipin_overall",
    "lighting_score", "visibility_score", "people_score",
    "security_score", "transport_score", "walkpath_score",
    "feeling_score", "gender_usage_score", "openness_score",
]].mean()

osm_raw = pd.read_csv(OSM_FILE).drop(columns=["Unnamed: 0"], errors="ignore")
osm_raw = osm_raw.set_index("ps_name")
 
print(f"  OSM features: {len(osm_raw)} boundaries")

sent_raw = pd.read_csv(SENTIMENT_FILE)
sent_raw = sent_raw.set_index("ps_name")
 
SENT_COLS = [
    "avg_sentiment_score", "pct_negative_reviews",
    "neg_keyword_rate",    "avg_star_rating",
]
low_cov = (sent_raw["review_count"] == 0)
if low_cov.sum():
    for col in SENT_COLS:
        median_val = sent_raw.loc[~low_cov, col].median()
        sent_raw.loc[low_cov, col] = median_val
 
sent_feats = sent_raw[SENT_COLS]

df = pd.DataFrame(index=all_boundaries)
df.index.name = "boundary_POL_STN_NM"
 
df = df.join(crime_feats,  how="left")
df = df.join(safe_feats,   how="left")
df = df.join(osm_raw,      how="left")
df = df.join(sent_feats,   how="left")
 
df["has_crime_data"] = df.index.isin(train_boundaries)

df_train = df[df["has_crime_data"]].copy()
 
df_train["_crime_density_norm"] = minmax_normalize(df_train["_crime_per_area"])

df_train["_violent_sum"] = (
    df_train["murder_count"] +
    df_train["rape_count"]   +
    df_train["robbery_count"]
)
df_train["_violent_norm"] = minmax_normalize(df_train["_violent_sum"])

safe_median = df_train["safetipin_overall"].median()
df_train["safetipin_overall"] = df_train["safetipin_overall"].fillna(safe_median)
df_train["_perception_norm"]  = minmax_normalize(df_train["safetipin_overall"])
df_train["_perception_inv"]   = 1 - df_train["_perception_norm"]
 
acc_median = df_train["fatal_accidents_avg"].median()
df_train["fatal_accidents_avg"] = df_train["fatal_accidents_avg"].fillna(acc_median)
df_train["_accident_norm"] = minmax_normalize(df_train["fatal_accidents_avg"])
 
df_train["risk_score"] = (
    0.35 * df_train["_crime_density_norm"] +
    0.25 * df_train["_violent_norm"]        +
    0.25 * df_train["_perception_inv"]      +
    0.15 * df_train["_accident_norm"]
) * 100
 
df_train["risk_score"] = df_train["risk_score"].round(2)
 
print(f"  Label range:  {df_train['risk_score'].min():.1f} – {df_train['risk_score'].max():.1f}")
print(f"  Label mean:   {df_train['risk_score'].mean():.1f}")
print(f"  Label median: {df_train['risk_score'].median():.1f}")

label_df = df_train[["risk_score"]].reset_index()
label_df.to_csv(OUT_LABEL, index=False)

LABEL_ONLY_COLS = [
    "_crime_per_area", "_totalcrime", "_district", "_district_norm",
    "district_norm", "safetipin_overall",
    "_crime_density_norm", "_violent_sum", "_violent_norm",
    "_perception_norm", "_perception_inv", "_accident_norm",
    "has_crime_data",
]
 
FEATURE_COLS = [
    "murder_count", "rape_count", "robbery_count", "theft_count",
    "assault_count", "sexual_harassment_count", "gangrape_count",
    "crime_yoy_delta", "area",
 
    "lighting_score", "visibility_score", "people_score",
    "security_score", "transport_score", "walkpath_score",
    "feeling_score", "gender_usage_score",
 
    "bus_stop_count", "hospital_count", "tourist_poi_count",
    "public_toilet_count", "nearest_metro_km", "nearest_hospital_km",
    "nearest_fire_stn_km", "nearest_poi_km", "nearest_police_stn_km",
 
    "fatal_accidents_avg", "injury_accidents_avg",
 
    "avg_sentiment_score", "pct_negative_reviews",
    "neg_keyword_rate", "avg_star_rating",
]
 
FEATURE_COLS = [c for c in FEATURE_COLS if c in df.columns]
missing_planned = [
    c for c in [
        "murder_count", "lighting_score", "bus_stop_count",
        "fatal_accidents_avg", "avg_sentiment_score"
    ] if c not in df.columns
]
if missing_planned:
    print(f"\nWARNING: Expected feature columns missing: {missing_planned}")
 
features_df = df[FEATURE_COLS].reset_index()
 
train_mask = features_df["boundary_POL_STN_NM"].isin(train_boundaries)
for col in FEATURE_COLS:
    if features_df[col].isna().any():
        fill_val = features_df.loc[train_mask, col].median()
        n_filled = features_df[col].isna().sum()
        features_df[col] = features_df[col].fillna(fill_val)
 
features_df.to_csv(OUT_FEATURES, index=False)


print(f"features.csv shape:   {features_df.shape}")
print(f"risk_label.csv shape: {label_df.shape}")
print(f"NaNs in features:     {features_df[FEATURE_COLS].isna().sum().sum()}")
print(f"NaNs in labels:       {label_df['risk_score'].isna().sum()}")