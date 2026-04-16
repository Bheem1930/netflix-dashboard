import matplotlib
import pandas as pd
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

matplotlib.use("Agg")
import os
import re
import warnings

import matplotlib.pyplot as plt
import numpy as np
from scipy.sparse import csr_matrix, hstack
from sklearn.calibration import CalibratedClassifierCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.svm import LinearSVC

warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

df = pd.read_csv("netflix.csv")

if not os.path.exists("images"):
    os.makedirs("images")

df["date_added"] = pd.to_datetime(df["date_added"], errors="coerce")
df["year_added"] = df["date_added"].dt.year
plt.style.use("dark_background")


# CHARTS
@app.route("/")
def home():
    return "Streaming Analytics API Running"


def create_charts():
    plt.figure(figsize=(6, 4))
    counts = df["type"].value_counts()
    bars = plt.bar(counts.index, counts.values, color=["#E50914", "#1DB954"])
    plt.title("Movie vs TV Show Distribution", fontsize=14, fontweight="bold")
    plt.xlabel("Content Type")
    plt.ylabel("Count")
    plt.grid(axis="y", linestyle="--", alpha=0.3)
    for bar in bars:
        yval = bar.get_height()
        plt.text(
            bar.get_x() + bar.get_width() / 2, yval, int(yval), ha="center", va="bottom"
        )
    plt.tight_layout()
    plt.savefig("images/type.png")
    plt.close()

    plt.figure(figsize=(6, 4))
    year_counts = df["year_added"].value_counts().sort_index()
    plt.plot(
        year_counts.index, year_counts.values, marker="o", color="#00FFFF", linewidth=2
    )
    plt.title("Content Added Per Year", fontsize=14, fontweight="bold")
    plt.xlabel("Year")
    plt.ylabel("Number of Titles")
    plt.grid(True, linestyle="--", alpha=0.3)
    plt.tight_layout()
    plt.savefig("images/year.png")
    plt.close()

    plt.figure(figsize=(6, 4))
    country_data = df["country"].dropna()
    country_data = country_data[country_data != "Unknown"]
    country_data = country_data.str.split(",").explode().str.strip()
    top_countries = country_data.value_counts().head(10)
    bars = plt.barh(top_countries.index, top_countries.values, color="#FFA500")
    plt.title("Top 10 Countries", fontsize=14, fontweight="bold")
    plt.xlabel("Number of Titles")
    plt.gca().invert_yaxis()
    plt.grid(axis="x", linestyle="--", alpha=0.3)
    for bar in bars:
        width = bar.get_width()
        plt.text(width + 5, bar.get_y() + bar.get_height() / 2, int(width), va="center")
    plt.tight_layout()
    plt.savefig("images/country.png")
    plt.close()

    plt.figure(figsize=(6, 4))
    genre = df["listed_in"].str.split(",").explode()
    top_genres = genre.value_counts().head(10)
    bars = plt.bar(top_genres.index, top_genres.values, color="#8A2BE2")
    plt.title("Top 10 Genres", fontsize=14, fontweight="bold")
    plt.xticks(rotation=45, ha="right")
    plt.ylabel("Count")
    plt.grid(axis="y", linestyle="--", alpha=0.3)
    for bar in bars:
        yval = bar.get_height()
        plt.text(
            bar.get_x() + bar.get_width() / 2, yval, int(yval), ha="center", va="bottom"
        )
    plt.tight_layout()
    plt.savefig("images/genre.png")
    plt.close()

    plt.figure(figsize=(6, 4))
    rating_counts = df["rating"].dropna().value_counts().head(10)
    bars = plt.bar(rating_counts.index, rating_counts.values, color="#FFD700")
    plt.title("Rating Distribution", fontsize=14, fontweight="bold")
    plt.xlabel("Rating")
    plt.ylabel("Number of Titles")
    plt.grid(axis="y", linestyle="--", alpha=0.3)
    for bar in bars:
        yval = bar.get_height()
        plt.text(
            bar.get_x() + bar.get_width() / 2, yval, int(yval), ha="center", va="bottom"
        )
    plt.tight_layout()
    plt.savefig("images/rating.png")
    plt.close()


create_charts()


@app.route("/type-distribution")
def type_chart():
    return send_file("images/type.png", mimetype="image/png")


@app.route("/release-trend")
def year_chart():
    return send_file("images/year.png", mimetype="image/png")


@app.route("/country-chart")
def country_chart():
    return send_file("images/country.png", mimetype="image/png")


@app.route("/genre-chart")
def genre_chart():
    return send_file("images/genre.png", mimetype="image/png")


@app.route("/rating-distribution")
def rating_chart():
    return send_file("images/rating.png", mimetype="image/png")


@app.route("/stats")
def stats():
    total = len(df)
    movies = int((df["type"] == "Movie").sum())
    tv_shows = int((df["type"] == "TV Show").sum())
    return jsonify({"total_titles": total, "movies": movies, "tv_shows": tv_shows})


# DATA PREP
df_raw = df.copy()

# Remove rows where rating column has duration values
df = df[~df["rating"].isin(["74 min", "84 min", "66 min"])]

# Valid real ratings to predict
VALID_RATINGS = [
    "TV-MA",
    "TV-14",
    "TV-PG",
    "PG-13",
    "R",
    "PG",
    "TV-Y",
    "TV-Y7",
    "TV-G",
    "G",
    "NC-17",
    "NR",
    "UR",
    "TV-Y7-FV",
]
df = df[df["rating"].isin(VALID_RATINGS)]
df["country"] = df["country"].fillna("Unknown")

# Group mapping
rating_group_map = {
    "TV-MA": "Mature",
    "NC-17": "Mature",
    "NR": "Mature",
    "UR": "Mature",
    "TV-14": "Mature",
    "R": "Mature",
    "PG-13": "Mature",
    "TV-PG": "Family",
    "PG": "Family",
    "TV-Y": "Kids",
    "TV-Y7": "Kids",
    "TV-Y7-FV": "Kids",
    "TV-G": "Kids",
    "G": "Kids",
}

data = (
    df[
        [
            "listed_in",
            "duration",
            "description",
            "country",
            "release_year",
            "rating",
            "type",
        ]
    ]
    .dropna()
    .copy()
)

# Feature engineering
data["dur_num"] = data["duration"].str.extract(r"(\d+)").astype(float)
data["dur_num"] = data["dur_num"].fillna(data["dur_num"].median())
data["is_movie"] = (data["type"] == "Movie").astype(int)
data["is_tv"] = (data["type"] == "TV Show").astype(int)
data["dur_short"] = (data["dur_num"] < 20).astype(int)
data["dur_long"] = (data["dur_num"] > 80).astype(int)

# Genre binary flags
genre_flags = {
    "has_kids_tv": "Kids' TV",
    "has_children": "Children",
    "has_standup": "Stand-Up",
    "has_horror": "Horror",
    "has_crime_tv": "Crime TV",
    "has_romantic": "Romantic",
    "has_reality": "Reality",
    "has_docuseries": "Docuseries",
    "has_anime": "Anime",
    "has_scifi": "Sci-Fi",
    "has_faith": "Faith",
    "has_music": "Music",
    "has_sports": "Sports",
    "has_intl": "International",
    "has_tvdrama": "TV Drama",
    "has_tvcomedy": "TV Comed",
    "has_comedies": "Comed",
    "has_dramas": "Drama",
    "has_action": "Action",
    "has_thriller": "Thrill",
    "has_family": "Family",
    "has_documentary": "Document",
}
for col, tag in genre_flags.items():
    data[col] = data["listed_in"].str.contains(tag, case=False).astype(int)

# Encoders
genre_encoder = LabelEncoder()
country_encoder = LabelEncoder()
data["genre_enc"] = genre_encoder.fit_transform(
    data["listed_in"].str.split(",").str[0].str.strip()
)
data["country_enc"] = country_encoder.fit_transform(
    data["country"].str.split(",").str[0].str.strip()
)

flag_cols = [
    c for c in data.columns if c.startswith("has_") or c in ["dur_short", "dur_long"]
]
numeric_cols = [
    "genre_enc",
    "country_enc",
    "dur_num",
    "release_year",
    "is_movie",
    "is_tv",
] + flag_cols

# Combined text: genre + description (genre carries strong rating signal)
data["combined"] = data["listed_in"] + " " + data["description"]

tfidf = TfidfVectorizer(
    max_features=12000,
    ngram_range=(1, 3),
    stop_words="english",
    sublinear_tf=True,
    min_df=2,
)
tfidf.fit(data["combined"])


def make_X(df_sub):
    return hstack(
        [
            csr_matrix(df_sub[numeric_cols].values.astype(float)),
            tfidf.transform(df_sub["combined"]),
        ]
    )


# Encode the real rating labels
rating_encoder = LabelEncoder()
data["rating_enc"] = rating_encoder.fit_transform(data["rating"])
all_rating_classes = list(rating_encoder.classes_)

# Print class distribution before balancing
print("Rating distribution (before balancing):")
for r, c in data["rating"].value_counts().items():
    print(f"  {r}: {c}")

# Filter out ratings with too few samples
rating_counts = data["rating"].value_counts()
valid_for_train = rating_counts[rating_counts >= 6].index
data_filtered = data[data["rating"].isin(valid_for_train)].copy()

# Balance the dataset by downsampling majority classes
min_class_size = data_filtered["rating"].value_counts().min()
# Use median class size as target — big enough to learn, small enough to balance
median_size = int(data_filtered["rating"].value_counts().median())
sample_size = min(median_size, 300)  # cap at 300 max per class

balanced_parts = []
for rating_val in data_filtered["rating"].unique():
    subset = data_filtered[data_filtered["rating"] == rating_val]
    if len(subset) > sample_size:
        balanced_parts.append(subset.sample(n=sample_size, random_state=42))
    else:
        # Oversample tiny classes to at least 50% of sample_size
        if len(subset) < sample_size // 2 and len(subset) >= 6:
            oversampled = subset.sample(
                n=sample_size // 2, replace=True, random_state=42
            )
            balanced_parts.append(oversampled)
        else:
            balanced_parts.append(subset)

data_balanced = pd.concat(balanced_parts, ignore_index=True)

print(f"\nBalanced dataset: {len(data_balanced)} samples")
print("Rating distribution (after balancing):")
for r, c in data_balanced["rating"].value_counts().items():
    print(f"  {r}: {c}")

X_all = make_X(data_balanced)
y_all = data_balanced["rating"].values

X_tr, X_te, y_tr, y_te = train_test_split(
    X_all, y_all, test_size=0.2, random_state=42, stratify=y_all
)

clf = CalibratedClassifierCV(
    LinearSVC(C=1.0, max_iter=5000, class_weight="balanced"), cv=3
)
clf.fit(X_tr, y_tr)

preds = clf.predict(X_te)
accuracy = accuracy_score(y_te, preds)
print(f"\nFinal accuracy: {round(accuracy * 100, 2)}%")
print(f"  Classes: {list(clf.classes_)}")


# PREDICT ROUTE


def _build_row_df(payload):
    raw_genre = payload.get("listed_in", "").strip()
    raw_duration = payload.get("duration", "")
    description = payload.get("description", "")
    raw_country = payload.get("country", "").strip().split(",")[0].strip()
    release_year = int(payload.get("release_year", 2020))

    is_movie = 1 if re.search(r"\d+\s*min", raw_duration, re.IGNORECASE) else 0
    is_tv = 1 - is_movie
    match = re.search(r"(\d+)", raw_duration)
    dur_num = float(match.group(1)) if match else 90.0
    dur_short = int(dur_num < 20)
    dur_long = int(dur_num > 80)

    primary_genre = raw_genre.split(",")[0].strip()
    genre_enc = (
        int(genre_encoder.transform([primary_genre])[0])
        if primary_genre in genre_encoder.classes_
        else int(genre_encoder.transform([genre_encoder.classes_[0]])[0])
    )

    country_enc = (
        int(country_encoder.transform([raw_country])[0])
        if raw_country in country_encoder.classes_
        else int(country_encoder.transform([country_encoder.classes_[0]])[0])
    )

    flag_values = {
        col: int(re.search(tag, raw_genre, re.IGNORECASE) is not None)
        for col, tag in genre_flags.items()
    }

    combined_text = raw_genre + " " + description

    row_dict = {
        "genre_enc": genre_enc,
        "country_enc": country_enc,
        "dur_num": dur_num,
        "release_year": release_year,
        "is_movie": is_movie,
        "is_tv": is_tv,
        "dur_short": dur_short,
        "dur_long": dur_long,
        **flag_values,
        "combined": combined_text,
    }
    return pd.DataFrame([row_dict])


@app.route("/predict-rating", methods=["POST"])
def predict_rating():
    payload = request.json
    row_df = _build_row_df(payload)
    X = make_X(row_df)

    # Multi-class prediction with probabilities
    predicted = clf.predict(X)[0]
    proba = clf.predict_proba(X)[0]
    classes = list(clf.classes_)

    # Build confidence dict: all ratings sorted by probability
    confidence = {}
    for i, cls in enumerate(classes):
        confidence[cls] = round(float(proba[i]) * 100, 1)

    # Top 5 predictions sorted by confidence
    top5 = sorted(confidence.items(), key=lambda x: x[1], reverse=True)[:5]

    return jsonify(
        {
            "predicted_rating": predicted,
            "confidence": confidence,
            "top_predictions": [{"rating": r, "confidence": c} for r, c in top5],
        }
    )


@app.route("/model-info")
def model_info():
    return jsonify(
        {
            "total_dataset": len(df),
            "training_samples": len(data_balanced),
            "num_classes": len(clf.classes_),
            "classes": list(clf.classes_),
        }
    )


if __name__ == "__main__":
    app.run(debug=True)
