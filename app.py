import streamlit as st
from PIL import Image
import io
from ultralytics import YOLO

# Load YOLO model
model = YOLO("best_yolov8n_garbage.pt")

# Define class names
class_names = [
    'metal', 'clothes', 'glass', 'cardboard', 'paper',
    'plastic', 'biological', 'shoes', 'battery', 'trash'
]

# Set up Streamlit app layout
st.title("Image Classifier - Garbage Sorting")
st.write("Upload an image, and the model will predict the garbage type.")

# File upload widget
uploaded_file = st.file_uploader("Choose an image...", type="jpg")

# If file is uploaded, display and predict
if uploaded_file is not None:
    # Read image and display it
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Image", use_column_width=True)

    # Process the image with YOLO model
    st.write("Processing...")
    results = model(image)

    # Extract predictions
    predictions = []
    for result in results[0].boxes.data:
        class_id = int(result[5])  # Class ID
        confidence = float(result[4])  # Confidence
        predictions.append({
            "class_name": class_names[class_id],
            "confidence": f"{confidence * 100:.2f}%"
        })

    # Display the predictions
    if predictions:
        st.write("Predictions:")
        for pred in predictions:
            st.write(f"{pred['class_name']}: {pred['confidence']}")
    else:
        st.write("No objects detected.")
