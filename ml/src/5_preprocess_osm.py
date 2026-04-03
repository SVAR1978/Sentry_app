import pandas as pd
import json
import math
import time
import csv
import os
import random
import requests
from tqdm import tqdm

BOUNDARY_FILE = "../datasets/delhipolicegeolocations/Police Station Boundary.geojson"
OUTPUT_FILE   = "../datasets/osm/osm_features.csv"
CACHE_DIR     = "../datasets/osm/cache"
 
OVERPASS_URL  = "https://overpass-api.de/api/interpreter"
DELHI_BBOX = (28.4043, 76.8388, 28.8835, 77.3475)
 
os.makedirs(CACHE_DIR, exist_ok=True)

def overpass_query(query: str, cache_key: str,
                   max_retries: int = 5) -> dict | None:
    cache_path = os.path.join(CACHE_DIR, f"{cache_key}.json")
 
    if os.path.exists(cache_path):
        with open(cache_path) as f:
            return json.load(f)
 
    for attempt in range(max_retries):
        try:
            r = requests.post(
                OVERPASS_URL,
                data={"data": query},
                timeout=120,  
                headers={"User-Agent": "Delhi-PS-Risk-Model/1.0"}
            )
 
            if r.status_code == 200:
                data = r.json()
                with open(cache_path, "w") as f:
                    json.dump(data, f)
                return data
 
            elif r.status_code in (429, 503, 504):
                wait = (2 ** attempt) + random.uniform(1, 3)
                print(f"  {r.status_code} — retry in {wait:.0f}s "
                      f"(attempt {attempt+1}/{max_retries})")
                time.sleep(wait)
 
            else:
                print(f"  Overpass error {r.status_code}: {r.text[:300]}")
                return None
 
        except requests.exceptions.Timeout:
            wait = (2 ** attempt) + random.uniform(1, 3)
            print(f"  Timeout — retry in {wait:.0f}s")
            time.sleep(wait)
 
        except Exception as e:
            print(f"  Error: {e}")
            return None
 
    print(f"  Failed after {max_retries} retries")
    return None

def bbox_str(bbox: tuple) -> str:
    return f"{bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]}"

DELHI_BBOX_STR = bbox_str(DELHI_BBOX)
 
NODE_FEATURE_QUERIES = {
 
    "metro": (
        f'[out:json][timeout:60];'
        f'node["station"="subway"]({DELHI_BBOX_STR});'
        f'out body;',
        "metro"
    ),
    "bus_stop": (
        f'[out:json][timeout:60];'
        f'node["highway"="bus_stop"]({DELHI_BBOX_STR});'
        f'out body;',
        "bus_stop"
    ),
    "auto_stand": (
        f'[out:json][timeout:60];'
        f'(node["amenity"="taxi"]({DELHI_BBOX_STR});'
        f'node["amenity"="auto_rickshaw"]({DELHI_BBOX_STR}););'
        f'out body;',
        "auto_stand"
    ),
 
    "hospital": (
        f'[out:json][timeout:60];'
        f'(node["amenity"="hospital"]({DELHI_BBOX_STR});'
        f'node["amenity"="clinic"]({DELHI_BBOX_STR});'
        f'node["amenity"="doctors"]({DELHI_BBOX_STR}););'
        f'out body;',
        "hospital"
    ),
    "fire_station": (
        f'[out:json][timeout:60];'
        f'node["amenity"="fire_station"]({DELHI_BBOX_STR});'
        f'out body;',
        "fire_station"
    ),
 
    "tourist_poi": (
        f'[out:json][timeout:90];'
        f'(node["tourism"]({DELHI_BBOX_STR});'
        f'node["historic"]({DELHI_BBOX_STR});'
        f'node["leisure"="park"]({DELHI_BBOX_STR}););'
        f'out body;',
        "tourist_poi"
    ),
 
    "nightlife": (
        f'[out:json][timeout:60];'
        f'(node["amenity"="bar"]({DELHI_BBOX_STR});'
        f'node["amenity"="pub"]({DELHI_BBOX_STR});'
        f'node["amenity"="nightclub"]({DELHI_BBOX_STR}););'
        f'out body;',
        "nightlife"
    ),
 
    "atm": (
        f'[out:json][timeout:60];'
        f'node["amenity"="atm"]({DELHI_BBOX_STR});'
        f'out body;',
        "atm"
    ),
 
    "street_lamp": (
        f'[out:json][timeout:120];'
        f'node["highway"="street_lamp"]({DELHI_BBOX_STR});'
        f'out body;',
        "street_lamp"
    ),
    "public_toilet": (
        f'[out:json][timeout:60];'
        f'node["amenity"="toilets"]({DELHI_BBOX_STR});'
        f'out body;',
        "public_toilet"
    ),
}

ROAD_QUERY = (
    f'[out:json][timeout:180];'
    f'way["highway"]({DELHI_BBOX_STR});'
    f'out body;',
    "roads"
)
 
NARROW_ROAD_TYPES = {
    "footway", "path", "steps", "alley",
    "service", "track", "pedestrian",
    "living_street",
}
 
ALL_ROAD_TYPES = {
    "motorway", "trunk", "primary", "secondary", "tertiary",
    "unclassified", "residential", "service", "motorway_link",
    "trunk_link", "primary_link", "secondary_link", "tertiary_link",
    "living_street", "pedestrian", "track", "footway",
    "path", "steps", "alley", "cycleway",
}

def haversine_km(lat1: float, lon1: float,
                 lat2: float, lon2: float) -> float:
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi       = math.radians(lat2 - lat1)
    dlambda    = math.radians(lon2 - lon1)
    a = (math.sin(dphi / 2) ** 2
         + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2)
    return round(R * 2 * math.asin(math.sqrt(a)), 4)

def point_in_polygon(lat: float, lon: float,
                     polygon: list[list[float]]) -> bool:

    x, y = lon, lat
    n     = len(polygon)
    inside = False
    j      = n - 1
    for i in range(n):
        xi, yi = polygon[i][0], polygon[i][1]
        xj, yj = polygon[j][0], polygon[j][1]
        if ((yi > y) != (yj > y)) and (
            x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi
        ):
            inside = not inside
        j = i
    return inside

def build_areas(boundary_file: str) -> list[dict]:

    with open(boundary_file) as f:
        bnd = json.load(f)
 
    areas = []
    for feat in bnd["features"]:
        name   = feat["properties"]["POL_STN_NM"].strip()
        ring   = feat["geometry"]["coordinates"][0]
        lons   = [c[0] for c in ring]
        lats   = [c[1] for c in ring]
        clat   = sum(lats) / len(lats)
        clon   = sum(lons) / len(lons)
 
        areas.append({
            "name":   name,
            "clat":   clat,
            "clon":   clon,
            "ring":   ring,
            # Pre-computed bbox for fast rejection
            "min_lat": min(lats),
            "max_lat": max(lats),
            "min_lon": min(lons),
            "max_lon": max(lons),
        })
 
    return areas
 

def assign_nodes_to_areas(nodes: list[dict],
                           areas: list[dict]) -> dict[str, list]:

    assignments = {a["name"]: [] for a in areas}
 
    for node in nodes:
        nlat = node.get("lat")
        nlon = node.get("lon")
        if nlat is None or nlon is None:
            continue
 
        for area in areas:
            if not (area["min_lat"] <= nlat <= area["max_lat"] and
                    area["min_lon"] <= nlon <= area["max_lon"]):
                continue
            if point_in_polygon(nlat, nlon, area["ring"]):
                assignments[area["name"]].append(node)
                break   
 
    return assignments

 
def nearest_km(clat: float, clon: float,
               nodes: list[dict]) -> float:

    if not nodes:
        return 99.0
    dists = [haversine_km(clat, clon, n["lat"], n["lon"]) for n in nodes]
    return min(dists)

def build_way_bbox_index(ways: list[dict]) -> list[dict]:

    result = []
    for way in ways:
        highway = way.get("tags", {}).get("highway", "")
        if not highway:
            continue
        center = way.get("center")
        if center:
            result.append({
                "lat":     center["lat"],
                "lon":     center["lon"],
                "highway": highway,
            })
    return result

ROAD_QUERY_CENTER = (
    f'[out:json][timeout:180];'
    f'way["highway"]({DELHI_BBOX_STR});'
    f'out center;',   
    "roads_center"
)
 
 
def compute_narrow_ratio(ways_in_area: list[dict]) -> float:

    if not ways_in_area:
        return 0.0
    narrow = sum(
        1 for w in ways_in_area
        if w.get("highway", "") in NARROW_ROAD_TYPES
    )
    return round(narrow / len(ways_in_area), 4)

def compute_nearest_ps_km(areas: list[dict]) -> dict[str, float]:

    result = {}
    for i, a in enumerate(areas):
        min_dist = float("inf")
        for j, b in enumerate(areas):
            if i == j:
                continue
            d = haversine_km(a["clat"], a["clon"], b["clat"], b["clon"])
            if d < min_dist:
                min_dist = d
        result[a["name"]] = round(min_dist, 4)
    return result

def run():

 

    areas = build_areas(BOUNDARY_FILE)
 
    nearest_ps = compute_nearest_ps_km(areas)
 
    node_data = {}
    for feat_name, (query, cache_key) in NODE_FEATURE_QUERIES.items():
        print(f"  Fetching: {feat_name}...", end=" ", flush=True)
        result = overpass_query(query, cache_key)
        if result:
            nodes = [e for e in result.get("elements", [])
                     if e.get("type") == "node"
                     and "lat" in e and "lon" in e]
            node_data[feat_name] = nodes
            print(f"→ {len(nodes)} nodes")
        else:
            node_data[feat_name] = []
        time.sleep(2)   
    print(f"\n  Fetching: roads (for narrow_lane_ratio)...", end=" ", flush=True)
    road_query, road_cache = ROAD_QUERY_CENTER
    road_result = overpass_query(road_query, road_cache)
    if road_result:
        raw_ways = [e for e in road_result.get("elements", [])
                    if e.get("type") == "way"]
        road_ways = build_way_bbox_index(raw_ways)
        print(f"→ {len(road_ways)} ways with centers")
    else:
        road_ways = []
    time.sleep(2)
 
    assigned = {}
    for feat_name, nodes in tqdm(node_data.items(), desc="  Features"):
        assigned[feat_name] = assign_nodes_to_areas(nodes, areas)
 
    assigned["roads"] = assign_nodes_to_areas(road_ways, areas)
 
    rows = []
 
    for area in tqdm(areas, desc="  Areas"):
        name = area["name"]
        clat = area["clat"]
        clon = area["clon"]
 
        metro_nodes    = assigned["metro"][name]
        bus_nodes      = assigned["bus_stop"][name]
        auto_nodes     = assigned["auto_stand"][name]
        hospital_nodes = assigned["hospital"][name]
        fire_nodes     = assigned["fire_station"][name]
        poi_nodes      = assigned["tourist_poi"][name]
        night_nodes    = assigned["nightlife"][name]
        atm_nodes      = assigned["atm"][name]
        lamp_nodes     = assigned["street_lamp"][name]
        toilet_nodes   = assigned["public_toilet"][name]
        road_ways_area = assigned["roads"][name]
 
        all_metro   = node_data["metro"]
        all_hosp    = node_data["hospital"]
        all_fire    = node_data["fire_station"]
        all_poi     = node_data["tourist_poi"]
 
        row = {
            "ps_name": name,
 
            "metro_count":        len(metro_nodes),
            "bus_stop_count":     len(bus_nodes),
            "auto_stand_count":   len(auto_nodes),
            "hospital_count":     len(hospital_nodes),
            "tourist_poi_count":  len(poi_nodes),
            "nightlife_count":    len(night_nodes),
            "atm_count":          len(atm_nodes),
            "street_lamp_count":  len(lamp_nodes),
            "public_toilet_count": len(toilet_nodes),
 

            "nearest_metro_km":      nearest_km(clat, clon, all_metro),
            "nearest_hospital_km":   nearest_km(clat, clon, all_hosp),
            "nearest_fire_stn_km":   nearest_km(clat, clon, all_fire),
            "nearest_poi_km":        nearest_km(clat, clon, all_poi),
            "nearest_police_stn_km": nearest_ps[name],
 
            "narrow_lane_ratio": compute_narrow_ratio(road_ways_area),
        }
        rows.append(row)
 
    fieldnames = [
        "ps_name",
        "metro_count", "bus_stop_count", "auto_stand_count",
        "hospital_count", "tourist_poi_count", "nightlife_count",
        "atm_count", "street_lamp_count", "public_toilet_count",
        "nearest_metro_km", "nearest_hospital_km",
        "nearest_fire_stn_km", "nearest_poi_km",
        "nearest_police_stn_km",
        "narrow_lane_ratio",
    ]
 
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
 
    print(f"\n Saved {len(rows)} rows {OUTPUT_FILE}")
 
    print("\nFeature coverage summary:")
    print(f"  {'Feature':<25} {'Zeros':>6}  {'Mean':>8}  {'Max':>8}")
    print(f"  {'-'*50}")
    count_cols = [
        "metro_count", "bus_stop_count", "auto_stand_count",
        "hospital_count", "tourist_poi_count", "nightlife_count",
        "atm_count", "street_lamp_count", "public_toilet_count",
    ]
    for col in count_cols:
        vals   = [r[col] for r in rows]
        zeros  = sum(1 for v in vals if v == 0)
        mean   = sum(vals) / len(vals)
        maxval = max(vals)
        print(f"  {col:<25} {zeros:>6}  {mean:>8.1f}  {maxval:>8}")
 
    dist_cols = [
        "nearest_metro_km", "nearest_hospital_km",
        "nearest_fire_stn_km", "nearest_poi_km", "nearest_police_stn_km",
    ]
    print()
    for col in dist_cols:
        vals = [r[col] for r in rows]
        nf   = sum(1 for v in vals if v == 99.0)
        mean = sum(v for v in vals if v < 99) / max(1, sum(1 for v in vals if v < 99))
        print(f"  {col:<25} no_data={nf:>3}  mean={mean:.2f}km")
 
    narrow = [r["narrow_lane_ratio"] for r in rows]
    print(f"\n  narrow_lane_ratio: mean={sum(narrow)/len(narrow):.3f}  "
          f"zeros={sum(1 for v in narrow if v==0)}")
 


if __name__ == "__main__":
    run()

df = pd.read_csv(OUTPUT_FILE)

print(df.columns)

df = df.drop(columns=['metro_count', 'auto_stand_count', 'nightlife_count', 'atm_count', 'street_lamp_count', 'narrow_lane_ratio'])

df.to_csv('..\\datasets\\osm\\osm_features_preprocessed.csv')