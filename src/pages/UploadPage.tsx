import { FileUpload } from "../components/FileUpload";
import { ImageGallery } from "../components/ImageGallery";
import { Navbar } from "../components/Navbar";
import { useState } from "react";
import "../styles/Pages.css";

export const UploadPage = () => {
  const [activeTab, setActiveTab] = useState<"upload" | "gallery">("upload");

  return (
    <div>
      <Navbar currentPath="/upload" />
      <div className="page-container">
        <div className="page-content">
          <h1 className="page-title">S3 Image Management</h1>
          
          <div className="upload-page-container">
            <div className="tabs-container">
              <button
                className={`tab-button ${activeTab === "upload" ? "active" : ""}`}
                onClick={() => setActiveTab("upload")}
              >
                Upload
              </button>
              <button
                className={`tab-button ${activeTab === "gallery" ? "active" : ""}`}
                onClick={() => setActiveTab("gallery")}
              >
                Gallery
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === "upload" ? <FileUpload /> : <ImageGallery />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 