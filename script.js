const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const resultDiv = document.getElementById('result');

// Preview the image when the file input changes
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block"; // Show the image
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = "none"; // Hide the image if no file is selected
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = fileInput.files[0];

    if (!file) {
        resultDiv.innerText = "Please upload an image.";
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    resultDiv.innerText = "Processing...";

    try {
        const response = await fetch("http://127.0.0.1:8000/predict/", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            const predictions = data.predictions;

            if (predictions && predictions.length > 0) {
                resultDiv.innerHTML = predictions.map(
                    (pred) => `${pred.class_name}: ${pred.confidence}`
                ).join("<br>");
            } else {
                resultDiv.innerText = "No predictions found.";
            }
        } else {
            resultDiv.innerText = "Error processing image.";
        }
    } catch (error) {
        resultDiv.innerText = "Error connecting to the server.";
        console.error(error);
    }
});
