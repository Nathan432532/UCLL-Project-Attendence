import json
import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import HuberRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_OUTPUT = os.path.normpath(os.path.join(BASE_DIR, "..", "UCLL_frontend", "public", "model-predictions.json"))

# 1. Load data
matches = pd.read_csv(os.path.join(BASE_DIR, "data", "gold_match.csv"))
promo = pd.read_csv(os.path.join(BASE_DIR, "data", "gold_match_context.csv"))
tickets = pd.read_csv(os.path.join(BASE_DIR, "data", "gold_match_ticket.csv"))

# 2. Merge and filter
df = pd.merge(matches, promo, on='match_id', how='left', suffixes=('', '_drop'))
df = pd.merge(df, tickets, on='match_id', how='left', suffixes=('', '_drop'))
df = df.filter(regex='^(?!.*_drop)')
df = df[df['is_home_match'] == True].copy()

# 3. Feature engineering from model.ipynb

df['hour'] = pd.to_datetime(df['kickoff_time_local']).dt.hour
df['match_date'] = pd.to_datetime(df['match_date'])
df = df.sort_values('match_date')

# home form

df['points_earned'] = np.where(df['goals_home_ft'] > df['goals_away_ft'], 3,
                               np.where(df['goals_home_ft'] == df['goals_away_ft'], 1, 0))
df['matchday_num'] = df.groupby('season').cumcount() + 1
df['season_max_day'] = df.groupby('season')['matchday_num'].transform('max')
df['season_intensity'] = (df['matchday_num'] - (df['season_max_day'] / 2)).abs()
df['season_intensity_sq'] = df['season_intensity'] ** 2

# home form recent with shift

df['home_form_recent'] = df.groupby('season')['points_earned'].transform(
    lambda x: x.rolling(window=3, min_periods=1).mean().shift(1)
).fillna(1.0)

# opponent tiers
train_idx = int(len(df) * 0.8)
avg_attendance = df.iloc[:train_idx]['tickets_scanned'].mean()
team_means = df.iloc[:train_idx].groupby('away_team')['tickets_scanned'].mean()

def get_tier(val):
    if val > avg_attendance * 1.1:
        return 3
    if val < avg_attendance * 0.9:
        return 1
    return 2

tier_map = team_means.apply(get_tier).to_dict()
df['opponent_tier'] = df['away_team'].map(tier_map).fillna(2)

df['weather_misery_index'] = df['weather_precipitation_mm'] * (20 - df['weather_temp_max_c']).clip(lower=1)
df['promo_ratio'] = df['promo_tickets_total'] / df['tickets_sold_total']
df['away_fan_proxy'] = df['opponent_tier'].map({1: 50, 2: 350, 3: 800})
df['match_hype'] = df['season_intensity_sq'] * df['home_form_recent']

big6 = ["Anderlecht", "Club Brugge", "Genk", "Antwerp", "Standard", "Mechelen"]
df['is_big6'] = df['away_team'].isin(big6).astype(int)

# model features
num_cols = ['tickets_sold_total', 'away_fan_proxy', 'match_hype']
bool_cols = ['is_big6']

X = df[num_cols + bool_cols]
y = df['tickets_scanned']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, shuffle=True)

model_pipeline = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler()),
    ('regressor', HuberRegressor())
])

model_pipeline.fit(X_train, y_train)

# Predictions
train_preds = model_pipeline.predict(X_train)
test_preds = model_pipeline.predict(X_test)

# Build test results and model summary
in_sample_error = np.abs(y_test - test_preds)
accuracy_pct = (1 - in_sample_error.sum() / y_test.sum()) * 100

summary = {
    'n_train': int(len(X_train)),
    'n_test': int(len(X_test)),
    'train_mae': float(np.round(np.mean(np.abs(y_train - train_preds)), 2)),
    'test_mae': float(np.round(np.mean(np.abs(y_test - test_preds)), 2)),
    'r2_cv': float(np.round(np.mean(cross_val_score(model_pipeline, X_train, y_train, cv=5, scoring='r2')), 3)),
    'accuracy_pct': float(np.round(accuracy_pct, 1))
}

plot_data = df.loc[X_test.index].copy()
plot_data['actual'] = y_test
plot_data['predicted'] = test_preds
plot_data = plot_data.sort_values('match_date')

history = []
for _, row in plot_data.iterrows():
    history.append({
        'date': row['match_date'].strftime('%Y-%m-%d'),
        'match': f"vs {row['away_team']}",
        'actual': int(round(row['actual'])),
        'predicted': int(round(row['predicted'])),
        'tickets_sold_total': int(row['tickets_sold_total']) if not pd.isna(row['tickets_sold_total']) else None,
        'weather_temp_max_c': float(row['weather_temp_max_c']) if not pd.isna(row['weather_temp_max_c']) else None,
        'weather_precipitation_mm': float(row['weather_precipitation_mm']) if not pd.isna(row['weather_precipitation_mm']) else None,
        'opponent_tier': int(row['opponent_tier']),
        'is_big6': bool(row['is_big6'])
    })

# pick latest test match as current
latest = history[-1] if history else None
if latest:
    trend_pct = 0
    if len(history) >= 2:
        trend_pct = round((latest['predicted'] - history[-2]['predicted']) / max(1, history[-2]['predicted']) * 100, 1)

payload = {
    'meta': summary,
    'history': history,
    'latest_prediction': {
        'match': latest['match'],
        'date': latest['date'],
        'predicted': latest['predicted'],
        'actual': latest['actual'],
        'trend_pct': trend_pct,
        'factors': {
            'opponent': latest['match'],
            'ticket_sales': latest['tickets_sold_total'],
            'weather': f"{latest['weather_temp_max_c']}°C, {latest['weather_precipitation_mm']}mm",
            'opponent_tier': latest['opponent_tier'],
            'big6': latest['is_big6']
        }
    }
}

# ensure output dir exists
os.makedirs(os.path.dirname(FRONTEND_OUTPUT), exist_ok=True)
with open(FRONTEND_OUTPUT, 'w', encoding='utf-8') as f:
    json.dump(payload, f, indent=2, ensure_ascii=False)

print(f"Model predictions exported to: {FRONTEND_OUTPUT}")
