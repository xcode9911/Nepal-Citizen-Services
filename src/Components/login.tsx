"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/login.css"

// Nepal Government Logo SVG Component
const NepalLogo = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="nepal-logo"
  >
    {/* Outer Circle */}
    <circle cx="50" cy="50" r="48" fill="#10b981" stroke="#059669" strokeWidth="2" />

    {/* Inner Mountain Silhouette */}
    <path d="M20 65 L35 45 L50 55 L65 40 L80 60 L80 75 L20 75 Z" fill="white" opacity="0.9" />

    {/* Sun */}
    <circle cx="70" cy="30" r="8" fill="#fbbf24" />
    <path
      d="M70 18 L72 22 L76 20 L74 24 L78 26 L74 28 L76 32 L72 30 L70 34 L68 30 L64 32 L66 28 L62 26 L66 24 L64 20 L68 22 Z"
      fill="#fbbf24"
      opacity="0.8"
    />

    {/* Nepal Text Curve */}
    <path id="textcircle" d="M 20 50 A 30 30 0 0 1 80 50" fill="none" stroke="none" />
    <text fontSize="10" fill="white" fontWeight="600">
      <textPath href="#textcircle" startOffset="25%">
        NEPAL GOV
      </textPath>
    </text>
  </svg>
)

// Eye Icon for password visibility toggle
const EyeIcon = ({ isVisible }: { isVisible: boolean }) => (
  <svg
    className="password-toggle-icon"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {isVisible ? (
      <>
        <path
          d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ) : (
      <>
        <path d="m15 18-.722-3.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m2 2 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m9 9-.637 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m15 15-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
  </svg>
)

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Access the base URL from Vite's environment variables
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful, navigating to OTP...")
        // Store adminId and email in sessionStorage for OTP page
        sessionStorage.setItem("adminId", data.adminId);
        sessionStorage.setItem("userEmail", formData.email)
        navigate("/otp")
      } else {
        setErrors({
          email: "",
          password: data.message || "Invalid email or password",
        })
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        email: "",
        password: "Login failed. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header with Logo */}
        <div className="login-header">
          <div className="login-logo">
            <NepalLogo />
            <div className="login-title-section">
              <h1 className="login-title">Nepal Citizen Services</h1>
              <p className="login-subtitle">Admin Portal</p>
            </div>
          </div>
          <div className="login-welcome">
            <h2 className="welcome-text">Welcome Back</h2>
            <p className="welcome-description">Please sign in to your account</p>
          </div>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon isVisible={showPassword} />
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button type="submit" className={`login-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Verifying...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="login-footer">
          <div className="demo-credentials">
            <p className="demo-title">Demo Credentials:</p>
            <div className="demo-info">
              <p>
                <strong>Email:</strong> admin@nepal.gov.np
              </p>
              <p>
                <strong>Password:</strong> admin123
              </p>
            </div>
          </div>

          {/* Back to Hero Button */}
          <button onClick={() => navigate("/hero")} className="back-to-hero-button" disabled={isLoading}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
