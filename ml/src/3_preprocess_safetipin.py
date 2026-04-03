from pathlib import Path

import pandas as pd


# 1. Paths and loading
BASE_DIR = Path(__file__).resolve().parent.parent
INPUT_PATH = BASE_DIR / "datasets" / "raw" / "safetipin" / "safetipin_165_rows.csv"
OUTPUT_PATH = (
    BASE_DIR / "datasets" / "processed" / "safetipin" / "safetipin_processed.csv"
)


def load_data() -> pd.DataFrame:
    try:
        return pd.read_csv(INPUT_PATH)
    except FileNotFoundError as exc:
        raise FileNotFoundError(f"Missing input file: {exc.filename}") from exc


# 2. Cleaning and processing
def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    df["Police_Station"] = df["Police_Station"].astype(str).str.strip().str.upper()

    selected_cols = [
        "Police_Station",
        "Safety Score",
        "Lighting",
        "Visibility",
        "Openness",
        "Security",
    ]
    return df[selected_cols].copy()


# 3. Save
def main() -> None:
    df = load_data()
    processed_df = preprocess_data(df)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    processed_df.to_csv(OUTPUT_PATH, index=False)
    print(f"Saved {len(processed_df)} rows to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
