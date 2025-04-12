import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ImageGallery.css";

interface Image {
  id: string;
  fileName: string;
  url: string;
  originalName: string;
  contentType: string;
  caption: string;
  uploadDate: string;
}

export const ImageGallery = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get<Image[]>(`${import.meta.env.VITE_API_BASE_URL}/images`);
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("Failed to load images. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/images/${id}`);
      setImages(images.filter(image => image.id !== id));
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  if (loading) {
    return <div className="gallery-loading">Loading images...</div>;
  }

  if (error) {
    return (
      <div className="gallery-error">
        <p>{error}</p>
        <button 
          onClick={fetchImages}
          className="retry-btn"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (images.length === 0) {
    return <div className="empty-gallery">No images have been uploaded yet.</div>;
  }

  return (
    <div className="gallery-container">
      {images.map((image) => (
        <div key={image.id} className="image-card">
          <img 
            src={image.url} 
            alt={image.caption || image.originalName} 
            className="card-image"
          />
          <div className="card-content">
            <h3 className="card-title">{image.originalName}</h3>
            {image.caption && <p className="card-caption">{image.caption}</p>}
            <p className="card-date">
              {new Date(image.uploadDate).toLocaleDateString()}
            </p>
            <button
              onClick={() => handleDelete(image.id)}
              className="delete-image-btn"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; 