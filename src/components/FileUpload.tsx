import { useState } from "react";
import axios from "axios";
import "../styles/FileUpload.css";

interface UploadedImage {
  id: string;
  fileName: string;
  url: string;
  originalName: string;
  contentType: string;
  caption: string;
  uploadDate: string;
}

export const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setPreviewUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("caption", caption);

      const response = await axios.post<UploadedImage>(
        `${import.meta.env.VITE_API_BASE_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadedImage(response.data);
      setPreviewUrl(response.data.url);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!uploadedImage) return;

    try {
      setError("");
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/images/${uploadedImage.id}`);
      
      setUploadedImage(null);
      setPreviewUrl("");
      setSelectedFile(null);
      setCaption("");
    } catch (error) {
      console.error("Error deleting file:", error);
      setError("Failed to delete file. Please try again.");
    }
  };

  return (
    <div className="file-upload">
      <div className="file-upload-input-group">
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input"
          accept="image/*"
        />
      </div>

      <div className="file-upload-input-group">
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={handleCaptionChange}
          className="caption-input"
        />
      </div>

      {previewUrl && (
        <div className="image-preview">
          <img
            src={previewUrl}
            alt="Preview"
            className="preview-image"
          />
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="button-group">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="upload-btn"
          style={{ opacity: !selectedFile || isUploading ? 0.7 : 1 }}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        {uploadedImage && (
          <button
            onClick={handleDelete}
            className="delete-btn"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}; 