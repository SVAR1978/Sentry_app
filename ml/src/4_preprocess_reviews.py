import time
import re
import csv
import os
import requests
import numpy as np
from tqdm import tqdm
from dotenv import load_dotenv

load_dotenv() 
GOOGLE_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")

BOUNDARY_FILE = "../datasets/delhipolicegeolocations/Police Station Boundary.geojson"
OUTPUT_FILE   = "../datasets/reviews/sentiment_features.csv"
CACHE_FILE    = "../datasets/reviews/places_cache.json"

SEARCH_RADIUS_M    = 800
MAX_PLACES_PER_AREA = 10
MIN_REVIEW_LENGTH  = 15    
MIN_REVIEW_TOKENS  = 3     

PLACE_TYPES = [
    "tourist_attraction",
    "restaurant",
    "lodging",
    "shopping_mall",
    "park",
]

EMOJI_RE = re.compile(
    "["
    "\U0001F600-\U0001F64F"
    "\U0001F300-\U0001F5FF"
    "\U0001F680-\U0001F6FF"
    "\U0001F1E0-\U0001F1FF"
    "\U00002702-\U000027B0"
    "\U000024C2-\U0001F251"
    "\u2600-\u26FF"
    "\u2700-\u27BF"
    "\uFE0F"
    "]+",
    flags=re.UNICODE,
)
 
QUOTE_MAP = str.maketrans({
    "\u2018": "'", "\u2019": "'",
    "\u201C": '"', "\u201D": '"',
    "\u2014": " ", "\u2013": " ",
})

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
 
    text = text.translate(QUOTE_MAP)
 
    text = EMOJI_RE.sub(" ", text)
 
    text = re.sub(r"[\r\n]+", " ", text)
    text = re.sub(r"\s{2,}", " ", text)
 
    text = text.strip(" !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~")

    if len(text) < MIN_REVIEW_LENGTH:
        return ""
    if len(text.split()) < MIN_REVIEW_TOKENS:
        return ""
 
    return text

FOOD_SIGNALS = {
    "pizza", "momos", "biryani", "burger", "pasta", "food", "eat",
    "taste", "tasty", "delicious", "yummy", "restaurant", "menu",
    "price", "cheap", "order", "dish", "meal", "chaap", "paneer",
    "tikka", "samosa", "chowmein", "noodles", "sweet", "shop",
    "breakfast", "lunch", "dinner", "snack", "cafe", "dhaba",
    "rasoi", "khana", "mocktail", "juice", "curry", "roti",
}
 
SAFETY_SIGNALS = {
    # English
    "unsafe", "dangerous", "danger", "threat", "theft", "robbery",
    "robbed", "stolen", "steal", "scam", "scammed", "harass",
    "harassment", "eve teasing", "stalking", "stalk", "avoid",
    "scary", "scared", "threatened", "pickpocket", "assault",
    "assaulted", "drunk", "dark", "isolated", "aggressive",
    "beggar", "begging", "suspicious", "sketchy", "shady",
    "not safe", "crime", "criminal", "thief", "mugger", "mugged",
    "loot", "looted", "fight", "violence", "violent", "police",
    "crowded", "dirty", "filthy", "garbage", "encroach",
    # Hindi
    "wahiyaat", "ganda", "gandagi", "khatra", "khatarnak",
    "chori", "loot", "darr", "dara", "badmash", "gunda",
    "asuraksit", "suraksha", "bachao", "andha", "andhera",
    "bheed", "bhir", "naali", "sarak", "sadak kharab",
}

SAFETY_NEGATIVE_KEYWORDS = list(SAFETY_SIGNALS)

def compute_centroids(boundary_file: str) -> list[dict]:
    with open(boundary_file) as f:
        bnd = json.load(f)

    centroids = []
    for feat in bnd["features"]:
        name     = feat["properties"]["POL_STN_NM"].strip()
        geom     = feat["geometry"]
        geom_type = geom["type"]

        if geom_type == "Polygon":
            ring = geom["coordinates"][0]

        elif geom_type == "MultiPolygon":
            ring = []
            for polygon in geom["coordinates"]:
                ring.extend(polygon[0])   

        else:
            print(f" Unknown geometry type '{geom_type}' for {name} — skipping")
            continue

        lons = [c[0] for c in ring]
        lats = [c[1] for c in ring]

        centroids.append({
            "ps_name": name,
            "lat":     round(sum(lats) / len(lats), 6),
            "lon":     round(sum(lons) / len(lons), 6),
        })

    return centroids

import time
import random

def nearby_search(lat, lon, place_type, radius, max_retries=2):
    url = "https://places.googleapis.com/v1/places:searchNearby"
    payload = {
        "includedTypes": [place_type],
        "maxResultCount": 15,
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lon},
                "radius": float(radius),
            }
        },
    }
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "places.id",
    }

    for attempt in range(max_retries):
        try:
            r = requests.post(url, json=payload, headers=headers, timeout=30)

            if r.status_code == 200:
                return [p["id"] for p in r.json().get("places", []) if "id" in p]

            elif r.status_code == 429:
                print(f"  429 — quota exhausted, stopping pipeline")
                return None   # signal upstream to stop cleanly

            elif r.status_code in (503, 500, 502, 504):
                wait = (2 ** attempt) + random.uniform(0, 1)
                print(f"  {r.status_code} — server error, retrying in {wait:.1f}s")
                time.sleep(wait)

            else:
                print(f"  API error {r.status_code}: {r.text[:200]}")
                return []

        except requests.exceptions.Timeout:
            wait = (2 ** attempt) + random.uniform(0, 1)
            print(f"  Timeout — retrying in {wait:.1f}s")
            time.sleep(wait)

        except Exception as e:
            print(f"  Request error: {e}")
            return []

    print(f"  Failed after {max_retries} retries — skipping")
    return []

def get_place_details(place_id, max_retries=1):
    url = f"https://places.googleapis.com/v1/places/{place_id}"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "id,displayName,rating,reviews",
    }

    for attempt in range(max_retries):
        try:
            r = requests.get(url, headers=headers, timeout=30)

            if r.status_code == 200:
                result  = r.json()
                reviews = [
                    rev.get("text", {}).get("text", "")
                    for rev in result.get("reviews", [])
                    if rev.get("text", {}).get("text", "")
                ]
                return {
                    "name":    result.get("displayName", {}).get("text", ""),
                    "rating":  result.get("rating"),
                    "reviews": reviews,
                }

            elif r.status_code == 429:
                print(f"  429 — quota exhausted, stopping pipeline")
                return None   # signal upstream to stop cleanly

            elif r.status_code in (503, 500, 502, 504):
                wait = (2 ** attempt) + random.uniform(0, 1)
                print(f"  {r.status_code} — server error, retrying in {wait:.1f}s")
                time.sleep(wait)

            else:
                return {"name": "", "rating": None, "reviews": []}

        except requests.exceptions.Timeout:
            wait = (2 ** attempt) + random.uniform(0, 1)
            print(f"  Timeout — retrying in {wait:.1f}s")
            time.sleep(wait)

        except Exception as e:
            print(f"  Request error: {e}")
            return {"name": "", "rating": None, "reviews": []}

    return {"name": "", "rating": None, "reviews": []}

def collect_reviews_for_area(ps_name: str, lat: float, lon: float,
                              cache: dict) -> dict:
    if ps_name in cache:
        return cache[ps_name]

    all_place_ids = set()
    for ptype in PLACE_TYPES:
        ids = nearby_search(lat, lon, ptype, SEARCH_RADIUS_M)
        all_place_ids.update(ids)
        time.sleep(0.3)

    place_ids = sorted(all_place_ids)[:MAX_PLACES_PER_AREA]

    all_reviews = []
    all_ratings = []

    for pid in place_ids:
        details = get_place_details(pid)

        if details.get("rating"):
            all_ratings.append(details["rating"])

        for rev in details.get("reviews", []):
            if isinstance(rev, str):
                text = rev.strip()
            elif isinstance(rev, dict):
                text = rev.get("text", "").strip()
            else:
                continue

            if text and len(text) > 10:
                all_reviews.append(text)

    result = {
        "ps_name":     ps_name,
        "place_count": len(place_ids),
        "reviews":     all_reviews,
        "ratings":     all_ratings,
    }
    cache[ps_name] = result
    return result

def load_sentiment_model():
    from transformers import pipeline 
    model = pipeline(
        "text-classification",
        model="lxyuan/distilbert-base-multilingual-cased-sentiments-student",
        device=-1,       
        truncation=True,
        max_length=128,
        batch_size=16,
        top_k=None,      
    )
    return model
 

def score_from_result(result: list[dict]) -> float:
    label_weight = {"positive": 1.0, "neutral": 0.0, "negative": -1.0}
    score = sum(
        label_weight.get(r["label"].lower(), 0) * r["score"]
        for r in result
    )
    return round(score, 4)

# %%
def safety_relevance(text: str) -> float:
    words = set(text.lower().split())
 
    food_hit   = len(words & FOOD_SIGNALS)
    safety_hit = len(words & SAFETY_SIGNALS)
 
    if safety_hit > 0:
        return 1.0
    if food_hit > 0 and safety_hit == 0:
        return 0.3   
    return 0.7       

def compute_sentiment_features(
    raw_reviews: list[str],
    ratings: list[float],
    model,
) -> dict:

    fallback = {
        "avg_sentiment_score":  0.0,
        "pct_negative_reviews": 0.0,
        "neg_keyword_rate":     0.0,
        "avg_star_rating":      3.0,
        "review_count":         0,
        "raw_review_count":     len(raw_reviews),
    }
 
    cleaned = [clean_text(r) for r in raw_reviews]
    cleaned = [r for r in cleaned if r]   # drop empties
 
    seen = set()
    deduped = []
    for r in cleaned:
        key = r.lower().strip()
        if key not in seen:
            seen.add(key)
            deduped.append(r)
 
    if not deduped:
        return fallback
 
    raw_results = model(deduped)
 
    scores = [score_from_result(r) for r in raw_results]

    neg_count = sum(1 for s in scores if s < -0.1)
 
    relevance_weights = [safety_relevance(r) for r in deduped]
    total_weight = sum(relevance_weights)
 
    kw_hits_weighted = sum(
        w for text, w in zip(deduped, relevance_weights)
        if any(kw in text.lower() for kw in SAFETY_NEGATIVE_KEYWORDS)
    )
 
    neg_keyword_rate = (
        round(kw_hits_weighted / total_weight, 4)
        if total_weight > 0 else 0.0
    )
 
    return {
        "avg_sentiment_score":  round(sum(scores) / len(scores), 4),
        "pct_negative_reviews": round(neg_count / len(scores), 4),
        "neg_keyword_rate":     neg_keyword_rate,
        "avg_star_rating":      round(sum(ratings) / len(ratings), 2)
                                if ratings else 3.0,
        "review_count":         len(deduped),
        "raw_review_count":     len(raw_reviews),
    }

def run_pipeline():
    centroids = compute_centroids(BOUNDARY_FILE)
 
    # Load cache
    cache = {}
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE) as f:
                cache = json.load(f)
            print(f"Resumed from cache — {len(cache)} areas collected")
        except json.JSONDecodeError:
            print("Cache corrupted — starting fresh")
 
    # Collect reviews
    for area in tqdm(centroids):
        collect_reviews_for_area(
            area["ps_name"], area["lat"], area["lon"], cache
        )
        with open(CACHE_FILE, "w") as f:
            json.dump(cache, f)
 
    # Load model
    model = load_sentiment_model()
 
    # Compute features
    rows = []
    for area in tqdm(centroids):
        data  = cache.get(area["ps_name"], {})
        feats = compute_sentiment_features(
            data.get("reviews", []),
            data.get("ratings", []),
            model,
        )
        feats["ps_name"] = area["ps_name"]
        rows.append(feats)
 
    # Save
    fieldnames = [
        "ps_name", "avg_sentiment_score", "pct_negative_reviews",
        "neg_keyword_rate", "avg_star_rating",
        "review_count", "raw_review_count",
    ]
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames,
                                extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)
 
 
    import statistics
    counts      = [r["review_count"] for r in rows]
    raw_counts  = [r["raw_review_count"] for r in rows]
    dropped     = sum(r - c for r, c in zip(raw_counts, counts))
    low_cov     = [r["ps_name"] for r in rows if r["review_count"] < 5]
 
    print(f"\nReview stats after cleaning:")
    print(f"  Raw total: {sum(raw_counts)}")
    print(f"  After cleaning: {sum(counts)}  ({dropped} dropped)")
    print(f"  Mean per area: {statistics.mean(counts):.1f}")
    print(f"  Median per area: {statistics.median(counts):.1f}")
    print(f"  Areas with < 5: {len(low_cov)}")
 
    if low_cov:
        for name in low_cov:
            print(f"  {name}")

if __name__ == "__main__":
    if GOOGLE_API_KEY == "YOUR_GOOGLE_PLACES_API_KEY":
        print("ERROR: Set your GOOGLE_API_KEY at the top of the script")
    else:
        run_pipeline()