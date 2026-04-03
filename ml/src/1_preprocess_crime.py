from pathlib import Path

import pandas as pd


# 1. Paths and loading
BASE_DIR = Path(__file__).resolve().parent.parent
CRIME_INPUT_PATH = BASE_DIR / "datasets" / "raw" / "crime" / "crime_delhi.csv"
DISTRICT_INPUT_PATH = (
    BASE_DIR / "datasets" / "raw" / "crime" / "delhi_ps_district_mapping.csv"
)
OUTPUT_PATH = BASE_DIR / "datasets" / "processed" / "crime" / "crime_processed.csv"


def load_data() -> tuple[pd.DataFrame, pd.DataFrame]:
    try:
        crime_df = pd.read_csv(CRIME_INPUT_PATH)
        district_df = pd.read_csv(DISTRICT_INPUT_PATH)
        return crime_df, district_df
    except FileNotFoundError as exc:
        raise FileNotFoundError(f"Missing input file: {exc.filename}") from exc


# 2. Cleaning and feature engineering
def preprocess_data(crime_df: pd.DataFrame, district_df: pd.DataFrame) -> pd.DataFrame:
    district_df["Police_Station_Area"] = (
        district_df["Police_Station_Area"].astype(str).str.strip().str.lower()
    )

    crime_df = crime_df.merge(
        district_df,
        left_on="nm_pol",
        right_on="Police_Station_Area",
        how="left",
    )
    crime_df = crime_df.drop(columns=["Police_Station_Area"], errors="ignore")

    if "crime/area" in crime_df.columns:
        crime_df["crime_per_area"] = crime_df["crime/area"]
    else:
        crime_df["crime_per_area"] = crime_df["totalcrime"] / (crime_df["area"] + 1e-8)

    crime_df["nm_pol"] = crime_df["nm_pol"].astype(str).str.strip().str.upper()

    cols_to_keep = [
        "nm_pol",
        "totalcrime",
        "crime_per_area",
        "murder",
        "rape",
        "robbery",
        "theft",
        "District",
    ]
    return crime_df[cols_to_keep]


# 3. Save
def main() -> None:
    crime_df, district_df = load_data()
    processed_df = preprocess_data(crime_df, district_df)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    processed_df.to_csv(OUTPUT_PATH, index=False)
    print(f"Saved {len(processed_df)} rows to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
