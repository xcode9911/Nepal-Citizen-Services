"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../css/hero.css"

// Import images
import slide1 from "../assets/slide1.png"
import slide2 from "../assets/slide2.png"
import slide3 from "../assets/slide3.png"
import slide4 from "../assets/slide4.png"

export default function Hero() {
  const navigate = useNavigate()
  const images = [slide1, slide2, slide3, slide4]
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length])

  const handleGetStarted = () => {
    console.log("Navigating to login page using React Router...")
    navigate("/login")
  }

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-grid">
          {/* Left side - Title and content */}
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Nepal Citizen
                <span className="hero-title-accent">Services</span>
              </h1>
              <p className="hero-description">
                Access government services digitally. Fast, secure, and convenient citizen services at your fingertips.
                Empowering Nepal's digital transformation.
              </p>
            </div>

            {/* Get Started Button */}
            <div className="hero-button-container">
              <button onClick={handleGetStarted} className="simple-get-started-button" type="button">
                <span>Get Started</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right side - Animated Image Slideshow */}
          <div className="hero-image-container">
            <div className="hero-image-wrapper">
              <div className="hero-slideshow">
                {images.map((image, index) => (
                  <div key={index} className={`hero-slide ${index === currentImageIndex ? "active" : ""}`}>
                    <img
                      src={image || "/placeholder.svg"}
                      width={600}
                      height={500}
                      alt={`Nepal Citizen Services Platform - Slide ${index + 1}`}
                      className="hero-image"
                    />
                  </div>
                ))}
              </div>

              {/* Slide indicators */}
              <div className="hero-indicators">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`hero-indicator ${index === currentImageIndex ? "active" : ""}`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Decorative elements */}
              <div className="hero-decoration-1"></div>
              <div className="hero-decoration-2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
