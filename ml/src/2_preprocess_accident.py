from pathlib import Path

import pandas as pd


# 1. Paths and loading
BASE_DIR = Path(__file__).resolve().parent.parent
INPUT_PATH = BASE_DIR / "datasets" / "raw" / "accident" / "delhi_accident_data.csv"
OUTPUT_PATH = (
    BASE_DIR / "datasets" / "processed" / "accident" / "accident_processed.csv"
)


def load_data() -> pd.DataFrame:
    try:
        return pd.read_csv(INPUT_PATH)
    except FileNotFoundError as exc:
        raise FileNotFoundError(f"Missing input file: {exc.filename}") from exc


# 2. Cleaning and processing
def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    total_cols = [col for col in df.columns if "Total_" in col]
    df["avg_total_accidents"] = df[total_cols].mean(axis=1)

    df = df[["Traffic_Districts", "avg_total_accidents"]].copy()
    df["Traffic_Districts"] = df["Traffic_Districts"].astype(str).str.strip().str.upper()
    return df


# 3. Save
def main() -> None:
    df = load_data()
    processed_df = preprocess_data(df)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    processed_df.to_csv(OUTPUT_PATH, index=False)
    print(f"Saved {len(processed_df)} rows to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
