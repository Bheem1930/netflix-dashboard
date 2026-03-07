from flask import Flask, render_template, request
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
import os

app = Flask(__name__)

df = pd.read_csv("netflix.csv")

df.fillna({
    'director': "Unknown",
    'cast': "Unknown",
    'country': "Unknown",
    'rating': "Not Rated"
}, inplace=True)

df['date_added'] = df['date_added'].astype(str).str.strip()
df['date_added'] = pd.to_datetime(df['date_added'], errors='coerce')
df.dropna(subset=['date_added'], inplace=True)
df['year_added'] = df['date_added'].dt.year

df['duration'] = df['duration'].astype(str).str.extract(r'(\d+)')
df['duration'] = pd.to_numeric(df['duration'], errors='coerce')
df['duration'] = df['duration'].fillna(0)


if not os.path.exists("static/charts"):
    os.makedirs("static/charts")

plt.style.use('dark_background')

# ==============================
# CREATE CHARTS
# ==============================

def create_charts():

  
    plt.figure(figsize=(6,4))
    counts = df['type'].value_counts()
    bars = plt.bar(counts.index, counts.values,
                   color=['#E50914', '#1DB954'])
    plt.title("Movie vs TV Show Distribution", fontsize=14, fontweight='bold')
    plt.xlabel("Content Type")
    plt.ylabel("Count")
    plt.grid(axis='y', linestyle='--', alpha=0.3)

    for bar in bars:
        yval = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2, yval,
                 int(yval), ha='center', va='bottom')

    plt.tight_layout()
    plt.savefig("static/charts/type.png")
    plt.close()

   
    plt.figure(figsize=(6,4))
    year_counts = df['year_added'].value_counts().sort_index()
    plt.plot(year_counts.index, year_counts.values,
             marker='o', color='#00FFFF', linewidth=2)
    plt.title("Content Added Per Year", fontsize=14, fontweight='bold')
    plt.xlabel("Year")
    plt.ylabel("Number of Titles")
    plt.grid(True, linestyle='--', alpha=0.3)
    plt.tight_layout()
    plt.savefig("static/charts/year.png")
    plt.close()

    

    plt.figure(figsize=(6,4))

    country_data = df['country'].dropna()
    country_data = country_data[country_data != "Unknown"]
    country_data = country_data.str.split(',').explode()
    country_data = country_data.str.strip()
    top_countries = country_data.value_counts().head(10)
    bars = plt.barh(top_countries.index, top_countries.values,
                    color='#FFA500')

    plt.title("Top 10 Countries", fontsize=14, fontweight='bold')
    plt.xlabel("Number of Titles")

    plt.gca().invert_yaxis()
    plt.grid(axis='x', linestyle='--', alpha=0.3)

    for bar in bars:
        width = bar.get_width()
        plt.text(width + 5, bar.get_y() + bar.get_height()/2,
                 int(width), va='center')

    plt.tight_layout()
    plt.savefig("static/charts/country.png")
    plt.close()


    plt.figure(figsize=(6,4))
    genre = df['listed_in'].str.split(',').explode()
    top_genres = genre.value_counts().head(10)

    bars = plt.bar(top_genres.index, top_genres.values,
                   color='#8A2BE2')

    plt.title("Top 10 Genres", fontsize=14, fontweight='bold')
    plt.xticks(rotation=45, ha='right')
    plt.ylabel("Count")
    plt.grid(axis='y', linestyle='--', alpha=0.3)

    for bar in bars:
        yval = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2, yval,
                 int(yval), ha='center', va='bottom')

    plt.tight_layout()
    plt.savefig("static/charts/genre.png")
    plt.close()

create_charts()

# ==============================
# MACHINE LEARNING
# ==============================

le = LabelEncoder()
df['rating_encoded'] = le.fit_transform(df['rating'])

X = df[['release_year', 'duration', 'rating_encoded']]
y = df['type']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

accuracy = round(model.score(X_test, y_test) * 100, 2)


total_content = len(df)
total_movies = len(df[df['type'] == "Movie"])
total_shows = len(df[df['type'] == "TV Show"])


@app.route('/')
def home():
    return render_template("index.html",
                           total=total_content,
                           movies=total_movies,
                           shows=total_shows,
                           accuracy=accuracy)

@app.route('/predict', methods=['POST'])
def predict():

    try:
        release_year = int(request.form['release_year'])
        duration = int(request.form['duration'])
        rating = request.form['rating']

        results = df[
            (df['release_year'] == release_year) &
            (df['duration'] >= duration) &
            (df['rating'] == rating)
        ]

        results = results.head(10)

        table_data = results[[
            'title',
            'type',
            'director',
            'country',
            'release_year',
            'rating',
            'duration',
            'listed_in'
        ]].to_dict(orient='records')

    except:
        table_data = []

    return render_template(
        "index.html",
        table_data=table_data,
        total=total_content,
        movies=total_movies,
        shows=total_shows,
        accuracy=accuracy
    )

if __name__ == "__main__":
    app.run(debug=True)