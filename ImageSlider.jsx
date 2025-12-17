import React, { useEffect, useState } from "react";
import "./index.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function ImageSlider({ url, page = 1, limit = 5 }) {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchImage() {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${url}?page=${page}&limit=${limit}`);
      if (!res.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = await res.json();
      console.log(data);
      setImages(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }

  const handleNext = () => {
    if (currentImage === images.length - 1) return;
    setCurrentImage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentImage === 0) return;
    setCurrentImage((prev) => prev - 1);
  };

  const handleIndicatorClick = (index) => {
    setCurrentImage(index);
  };

  useEffect(() => {
    fetchImage();
  }, []);

  if (error) return <div className="error">Something went wrong! {error}</div>;
  if (isLoading) return <div className="loading">Loading...</div>;

  // Get only the current image to display
  const currentImageData = images[currentImage];

  return (
    <div className="container">
      {/* Previous arrow with click handler and disabled state */}
      <FaArrowLeft
        className={`arrow arrow-left ${currentImage === 0 ? "disabled" : ""}`}
        onClick={currentImage === 0 ? undefined : handlePrevious}
      />

      {/* Show only the current image */}
      {currentImageData && (
        <img
          src={currentImageData.download_url}
          alt={currentImageData.author || `Image ${currentImage + 1}`}
          className="current-image"
          key={currentImageData.id}
        />
      )}

      {/* Next arrow with click handler and disabled state */}
      <FaArrowRight
        className={`arrow arrow-right ${
          currentImage === images.length - 1 ? "disabled" : ""
        }`}
        onClick={currentImage === images.length - 1 ? undefined : handleNext}
      />

      {/* Indicators with click handlers */}
      <span className="circle-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`current-indicator ${
              index === currentImage ? "active" : ""
            }`}
            onClick={() => handleIndicatorClick(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </span>
    </div>
  );
}