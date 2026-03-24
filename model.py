import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, VotingRegressor
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import root_mean_squared_error, mean_absolute_error, r2_score
from xgboost import XGBRFRegressor
from sklearn.impute import SimpleImputer

# 1. Load Data
df_matches = pd.read_csv("./data/gold_match.csv")
df_promo = pd.read_csv("./data/gold_match_context.csv")

# 2. Merge and Filter
df = pd.merge(df_matches, df_promo, on='match_id', how='left', suffixes=('', '_drop'))
df = df.filter(regex='^(?!.*_drop)')
df = df[df['is_home_match'] == True].copy()

# 3. Basic Feature Engineering
df['match_date'] = pd.to_datetime(df['match_date'])
df['day_number'] = df['match_date'].dt.dayofweek
df['hour'] = pd.to_datetime(df['kickoff_time_local']).dt.hour
df = df.sort_values('match_date')

# Days since last home game
df['days_since_last_home'] = df['match_date'].diff().dt.days
df['days_since_last_home'] = df['days_since_last_home'].fillna(14)

# 4. SPLIT FIRST (To prevent data leakage in tiered groups)
# We split the dataframe itself so we can calculate stats on the training portion
df_train, df_test = train_test_split(df, test_size=0.2, random_state=42, shuffle=False)

# 5. TIERED TEAMS LOGIC (Calculated on df_train ONLY)
team_stats = df_train.groupby("away_team")["tickets_scanned"].mean()
sorted_teams = team_stats.sort_values(ascending=False).index.tolist()

top_6_teams = sorted_teams[:6]
middle_6_teams = sorted_teams[6:12]

def get_team_tier(team_name):
    if team_name in top_6_teams:
        return team_name # Keep individual name for top draws
    elif team_name in middle_6_teams:
        return "Tier_Middle"
    else:
        return "Tier_Bottom"

# Apply the mapping to both sets
df_train = df_train.copy()
df_test = df_test.copy()
df_train['opponent_tier'] = df_train['away_team'].apply(get_team_tier)
df_test['opponent_tier'] = df_test['away_team'].apply(get_team_tier)

# 6. Define Column Groups
cat_cols = ['opponent_tier', 'school_holiday_name']
num_cols = ['days_since_last_home', 'promo_tickets_total']
bool_cols = ['has_promotion', 'is_public_holiday', 'is_school_holiday_flanders', 'is_weekend']

# Convert booleans to int to avoid SimpleImputer errors
for col in bool_cols:
    df_train[col] = df_train[col].astype(int)
    df_test[col] = df_test[col].astype(int)

# 7. Final X and y assignment
X_train = df_train[cat_cols + num_cols + bool_cols]
y_train = df_train['tickets_scanned']
X_test = df_test[cat_cols + num_cols + bool_cols]
y_test = df_test['tickets_scanned']

# 8. Pipeline Setup
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', Pipeline([
            ('impute', SimpleImputer(strategy='constant', fill_value='missing')),
            ('ohe', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
        ]), cat_cols),
        ('num', Pipeline([
            ('impute', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())
        ]), num_cols),
        ('bool', SimpleImputer(strategy='constant', fill_value=0), bool_cols)
    ]
)

ensemble = VotingRegressor(
    estimators=[
        ('rf', RandomForestRegressor(n_estimators=100, random_state=42)),
        ('xgb', XGBRFRegressor(n_estimators=100, learning_rate=0.01, max_depth=7, random_state=42))
    ]
)

model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', ensemble)
])

# 9. Train and Evaluate
model_pipeline.fit(X_train, y_train)
preds = model_pipeline.predict(X_test)

rmse = root_mean_squared_error(y_test, preds)
mae = mean_absolute_error(y_test, preds)
r2 = r2_score(y_test, preds)

print(f"RMSE: {rmse:.2f}")
print(f"MAE:  {mae:.2f}")
print(f"R2 Score: {r2:.2f}")