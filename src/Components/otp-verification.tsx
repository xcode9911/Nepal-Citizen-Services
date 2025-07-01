"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../css/otp-verification.css"
import { jwtDecode } from "jwt-decode"

export default function OtpVerification() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Get email from sessionStorage
  useEffect(() => {
    const email = sessionStorage.getItem("userEmail")
    if (email) {
      setUserEmail(email)
    } else {
      // If no email found, redirect to login
      navigate("/login")
    }
  }, [navigate])

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Clear error when user starts typing
    if (error) setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newOtp = [...otp]

    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }

    setOtp(newOtp)

    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const otpString = otp.join("")
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Get JWT token and decode adminId
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Session expired. Please login again.");
        return;
      }
      let adminId;
      try {
        const decoded: any = jwtDecode(token);
        adminId = decoded.id;
      } catch (decodeError) {
        setError("Invalid session. Please login again.");
        return;
      }

      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId,
          otp: otpString,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleResendOtp = async () => {
    setCanResend(false)
    setTimeLeft(300)
    setError("")

    // Simulate resend API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Show success message or handle resend logic
    } catch (error) {
      setError("Failed to resend OTP. Please try again.")
    }
  }

  return (
    <div className="otp-container">
      <div className="otp-card">
        <div className="otp-header">
          <div className="otp-icon">🔐</div>
          <h1 className="otp-title">Verify Your Identity</h1>
          <p className="otp-subtitle">
            We've sent a 6-digit verification code to
            <br />
            <strong>{userEmail}</strong>
          </p>
        </div>

        <form className="otp-form" onSubmit={handleSubmit}>
          <div className="otp-input-group">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`otp-input ${error ? "error" : ""}`}
                disabled={isLoading}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="otp-timer">
            {timeLeft > 0 ? (
              <p>
                Code expires in <strong>{formatTime(timeLeft)}</strong>
              </p>
            ) : (
              <p className="expired">Code has expired</p>
            )}
          </div>

          <button
            type="submit"
            className={`otp-verify-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading || otp.join("").length !== 6}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>

          <div className="otp-actions">
            <button
              type="button"
              className="resend-button"
              onClick={handleResendOtp}
              disabled={!canResend || isLoading}
            >
              {canResend ? "Resend Code" : `Resend in ${formatTime(timeLeft)}`}
            </button>

            <button type="button" className="back-button" onClick={() => navigate("/login")} disabled={isLoading}>
              Back to Login
            </button>
          </div>
        </form>

       
      </div>
    </div>
  )
}
