import json
import os
import pickle
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import HuberRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline

# Paths
BASE_DIR        = os.path.dirname(os.path.abspath(__file__))
FRONTEND_OUTPUT = os.path.normpath(os.path.join(BASE_DIR, "..", "UCLL_frontend", "public", "model-predictions.json"))
cleaned_path    = os.path.join(BASE_DIR, "data", "cleaned_matches.csv")
model_save_path = os.path.join(BASE_DIR, "model", "model.pkl")
os.makedirs(os.path.dirname(FRONTEND_OUTPUT), exist_ok=True)
FORCE_RETRAIN = False

# ── SHARED PREPROCESSING FUNCTION ──────────────────────────────
# Used by both paths so logic is never duplicated
def preprocess(df, tier_map, big6):
    df = df.copy()

    # 1. Force numeric types (important when loading from CSV)
    # 'coerce' turns non-numeric garbage into NaN instead of crashing
    df['ohl_standing'] = pd.to_numeric(df['ohl_standing'], errors='coerce')
    df['away_standing'] = pd.to_numeric(df['away_standing'], errors='coerce')
    df['match_day'] = pd.to_numeric(df['match_day'], errors='coerce')
    df['total_days'] = pd.to_numeric(df['total_days'], errors='coerce')

    # 2. Fill missing values so math doesn't result in NaN
    df['ohl_standing'] = df['ohl_standing'].fillna(10) # Default to mid-table
    df['away_standing'] = df['away_standing'].fillna(10)
    df['match_day'] = df['match_day'].fillna(1)
    df['total_days'] = df['total_days'].fillna(34) # Default Belgian league season

    # 3. Calculations
    df['opponent_tier'] = df['away_team'].map(tier_map).fillna(2)
    df['away_fan_proxy'] = df['opponent_tier'].map({1: 50, 2: 350, 3: 800})
    
    # Now this won't crash even if a value was missing
    df['position_gap'] = (df['ohl_standing'] - df['away_standing']).abs()
    
    # Calculate season phase
    season_pct = df['match_day'] / df['total_days']
    df['phase_of_season_num'] = np.where(season_pct < 0.33, 1,
                                np.where(season_pct < 0.66, 2, 3))
    
    # Ensure away_team is a string for the isin check
    df['is_big6'] = df['away_team'].astype(str).isin(big6).astype(int)
    
    return df

# ── FAST PATH ──────────────────────────────────────────────────
if os.path.exists(cleaned_path) and os.path.exists(model_save_path) and not FORCE_RETRAIN:
    print("Fast path: loading saved model and data...")

    df = pd.read_csv(cleaned_path)

    with open(model_save_path, 'rb') as f:
        saved = pickle.load(f)
    model_pipeline = saved['pipeline']
    tier_map       = saved['tier_map']
    avg_attendance = saved['avg_attendance']
    big6           = saved['big6']

    df = preprocess(df, tier_map, big6)

    # Split historical vs future rows
    historical = df[df['tickets_scanned'].notna()].copy()
    future     = df[df['tickets_scanned'].isna()].copy()

    # Reuse saved model — no retraining
    summary = saved.get('summary', {})

# ── SLOW PATH ──────────────────────────────────────────────────
else:
    print("Slow path: retraining from scratch...")

    matches = pd.read_csv(os.path.join(BASE_DIR, "data", "gold_match.csv"))
    promo   = pd.read_csv(os.path.join(BASE_DIR, "data", "gold_match_context.csv"))
    tickets = pd.read_csv(os.path.join(BASE_DIR, "data", "gold_match_ticket.csv"))
    extra   = pd.read_csv(os.path.join(BASE_DIR, "data", "Livro2.csv"))

    df = pd.merge(matches, promo,   on='match_id', how='left', suffixes=('', '_drop'))
    df = pd.merge(df,      tickets, on='match_id', how='left', suffixes=('', '_drop'))
    df = pd.merge(df,      extra,   on='match_id', how='left', suffixes=('', '_drop'))
    df = df.filter(regex='^(?!.*_drop)')
    df = df[df['is_home_match'] == True].copy()

    df['match_date'] = pd.to_datetime(df['match_date'])
    df = df.sort_values('match_date')

    # Build tier_map from training portion
    train_idx      = int(len(df) * 0.8)
    avg_attendance = df.iloc[:train_idx]['tickets_scanned'].mean()
    team_means     = df.iloc[:train_idx].groupby('away_team')['tickets_scanned'].mean()

    def get_tier(val):
        if val > avg_attendance * 1.1: return 3
        if val < avg_attendance * 0.9: return 1
        return 2

    tier_map = team_means.apply(get_tier).to_dict()
    big6     = ["Anderlecht", "Club Brugge", "Genk", "Antwerp", "Standard", "Mechelen"]

    # Map gold CSV columns to cleaned CSV column names
    df['away_standing'] = df['opponent_position']
    df['ohl_standing']  = df['our_position']
    df['match_day']     = df.groupby('season').cumcount() + 1
    df['total_days']    = df.groupby('season')['match_day'].transform('max')

    # Preprocess using shared function
    df = preprocess(df, tier_map, big6)

    # Save cleaned CSV — only the raw columns needed
    df_save = df[['away_team', 'away_standing', 'ohl_standing', 'match_day', 'total_days', 'tickets_scanned']]
    if os.path.exists(cleaned_path):
        existing_df = pd.read_csv(cleaned_path)
        # Combine them, keeping the newly processed ones but not losing frontend ones
        df_save = pd.concat([df_save, existing_df]).drop_duplicates(
            subset=['away_team', 'match_day', 'total_days'], keep='first'
        )

    # 3. Save it back
    df_save.to_csv(cleaned_path, index=False)
    print(f"Cleaned data saved: {len(df_save)} rows")

    historical = df[df['tickets_scanned'].notna()].copy()
    future     = df[df['tickets_scanned'].isna()].copy()

    # Train
    num_cols  = ['away_fan_proxy', 'phase_of_season_num', 'position_gap']
    bool_cols = ['is_big6']
    X = historical[num_cols + bool_cols]
    y = historical['tickets_scanned']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, shuffle=True)

    model_pipeline = Pipeline(steps=[
        ('imputer',   SimpleImputer(strategy='median')),
        ('scaler',    StandardScaler()),
        ('regressor', HuberRegressor())
    ])
    model_pipeline.fit(X_train, y_train)

    train_preds     = model_pipeline.predict(X_train)
    test_preds      = model_pipeline.predict(X_test)
    in_sample_error = np.abs(y_test - test_preds)
    accuracy_pct    = (1 - in_sample_error.sum() / y_test.sum()) * 100

    summary = {
        'n_train':      int(len(X_train)),
        'n_test':       int(len(X_test)),
        'train_mae':    float(np.round(np.mean(np.abs(y_train - train_preds)), 2)),
        'test_mae':     float(np.round(np.mean(np.abs(y_test  - test_preds)),  2)),
        'r2_cv':        float(np.round(np.mean(cross_val_score(model_pipeline, X_train, y_train, cv=5, scoring='r2')), 3)),
        'accuracy_pct': float(np.round(accuracy_pct, 1))
    }

    # Save model + summary so fast path can reuse it
    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
    with open(model_save_path, 'wb') as f:
        pickle.dump({
            'pipeline':      model_pipeline,
            'tier_map':      tier_map,
            'avg_attendance': avg_attendance,
            'big6':          big6,
            'summary':       summary,
        }, f)
    print("Model saved to model.pkl")

# ── SHARED: build output JSON ───────────────────────────────────

# Predict future rows (form submissions — no tickets_scanned)
num_cols  = ['away_fan_proxy', 'phase_of_season_num', 'position_gap']
bool_cols = ['is_big6']

future_predictions = []
for _, row in future.iterrows():
    X_new = pd.DataFrame([{
        'away_fan_proxy':      row['away_fan_proxy'],
        'phase_of_season_num': row['phase_of_season_num'],
        'position_gap':        row['position_gap'],
        'is_big6':             row['is_big6'],
    }])
    predicted = int(round(float(model_pipeline.predict(X_new)[0])))
    future_predictions.append({
        'match':         f"vs {row['away_team']}",
        'predicted':     predicted,
        'opponent_tier': int(row['opponent_tier']),
        'is_big6':       bool(row['is_big6']),
        'position_gap':  int(row['position_gap']),
        'phase_num':     int(row['phase_of_season_num']),
    })
    print(f"Predicted attendance for {row['away_team']}: {predicted}")

# Build history from historical rows
X_hist      = historical[num_cols + bool_cols]
hist_preds  = model_pipeline.predict(X_hist)
history     = []

for i, (_, row) in enumerate(historical.iterrows()):
    history.append({
        'match':       f"vs {row['away_team']}",
        'actual':      int(round(row['tickets_scanned'])),
        'predicted':   int(round(hist_preds[i])),
        'is_big6':     bool(row['is_big6']),
        'position_gap': int(row['position_gap']),
    })

latest    = history[-1] if history else None
trend_pct = 0
if latest and len(history) >= 2:
    trend_pct = round(
        (latest['predicted'] - history[-2]['predicted']) / max(1, history[-2]['predicted']) * 100, 1
    )

# Create the prediction for the row you just added from the frontend
# (This assumes the new match is the last row in the 'future' dataframe)
latest_future = future.iloc[-1] if not future.empty else None

if latest_future is not None:
    X_new = pd.DataFrame([{
        'away_fan_proxy':      latest_future['away_fan_proxy'],
        'phase_of_season_num': latest_future['phase_of_season_num'],
        'position_gap':        latest_future['position_gap'],
        'is_big6':             latest_future['is_big6'],
    }])
    pred_val = int(round(float(model_pipeline.predict(X_new)[0])))

    latest_prediction_data = {
        'match':     f"vs {latest_future['away_team']}",
        'predicted': pred_val,
        'actual':    None,
        'trend_pct': trend_pct,
        'factors': {
            'opponent':      latest_future['away_team'],
            'opponent_tier': int(latest_future['opponent_tier']),
            'is_big6':       bool(latest_future['is_big6']),
            'position_gap':  int(latest_future['position_gap']),
            'weather':       "Cloudy", # Or a default value
            'phase_of_season': int(latest_future['phase_of_season_num'])
        }
    }
else:
    # Fallback to the last historical match if no future matches exist
    latest_prediction_data = {
        'match': latest['match'] if latest else None,
        'predicted': latest['predicted'] if latest else None,
        'actual': latest['actual'] if latest else None,
        'trend_pct': trend_pct,
        'factors': None 
    }

payload = {
    'meta': summary,
    'history': history,
    'future_predictions': future_predictions,
    'latest_prediction': latest_prediction_data
}

os.makedirs(os.path.dirname(FRONTEND_OUTPUT), exist_ok=True)
with open(FRONTEND_OUTPUT, 'w', encoding='utf-8') as f:
    json.dump(payload, f, indent=2, ensure_ascii=False)

print(f"Model predictions exported to: {FRONTEND_OUTPUT}")