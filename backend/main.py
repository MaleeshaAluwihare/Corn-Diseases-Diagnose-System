from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import tensorflow as tf
from PIL import Image
import numpy as np
import os

app = FastAPI()

# Allow CORS for the frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  #frontend's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR,"model","best_model.keras")

def load_model():
    return tf.keras.models.load_model(MODEL_PATH)

model = load_model()

class_names = ['Blight', 'Common_Rust', 'Gray_Leaf_Spot', 'Healthy']

IMAGE_SIZE = 256

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        image = Image.open(file.file)
        image = image.convert("RGB")

        # Preprocess the image
        image = image.resize((IMAGE_SIZE, IMAGE_SIZE))  # Resize to model input size
        image_array = img_to_array(image)  # Convert to numpy array
        # image_array = image_array / 255.0  # Normalize pixel values
        image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension

        # Make prediction
        predictions = model.predict(image_array)
        predicted_class = class_names[np.argmax(predictions[0])]
        confidence = float(np.max(predictions[0])) 

        # Return prediction
        return JSONResponse(
            content={
                "predicted_class": predicted_class,
                "confidence": confidence
            }
        )
    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )
