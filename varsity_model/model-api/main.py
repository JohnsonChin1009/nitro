from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import json
from xgboost import XGBClassifier
import uvicorn

# 1️⃣ Create the app
app = FastAPI()

# 2️⃣ Add CORS middleware BEFORE any @app.post or @app.get
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js origin
    allow_credentials=True,
    allow_methods=["*"],                      # allow all methods including OPTIONS
    allow_headers=["*"],                      # allow all headers
)

# 3️⃣ Load model and feature_columns
with open("feature_columns.json","r") as f:
    feature_columns = json.load(f)

model = XGBClassifier()
model.load_model("risk_model.json")

class BorrowerProfile(BaseModel):
    features: dict

# 4️⃣ Health‑check GET so you can see something at /
@app.get("/")
def health_check():
    return {"status":"up"}

# 5️⃣ Your real endpoint
@app.post("/predict")
def predict_risk(profile: BorrowerProfile):
    try:
        arr = np.array([ profile.features.get(col, 0) for col in feature_columns ]).reshape(1,-1)
        score = model.predict(arr)[0] + 1
        return {"predicted_score": int(score)}
    except Exception as e:
        import traceback; traceback.print_exc()   # <-- print full stack
        raise HTTPException(status_code=500, detail=str(e))

if __name__=="__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
