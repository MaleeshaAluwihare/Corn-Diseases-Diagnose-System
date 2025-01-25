import React, { useState } from "react";
import axios from "axios";

export default function UploadForm() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const API_URL = `${API_BASE_URL}/predict/`;

  // Handle image selection
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  // Handle image upload and prediction
  const handleUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { predicted_class, confidence } = response.data;
      setDiagnosis({ predicted_class, confidence });

    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error processing image.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Upload an Image</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-green-500 text-white p-2 rounded mt-4"
      >
        Diagnose
      </button>

      {diagnosis && (
        <div className="mt-4">
          <h3 className="text-md font-semibold">Diagnosis Results:</h3>
          <p>
            <strong>Disease:</strong> {diagnosis.predicted_class}
          </p>
          <p>
            <strong>Confidence:</strong>{" "}
            {(diagnosis.confidence * 100).toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
}
