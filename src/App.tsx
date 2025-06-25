import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Hero from "../src/Components/hero"
import Login from "../src/Components/login"
import OtpVerification from "../src/Components/otp-verification"
import Dashboard from "../src/Components/dashboard"
import "./index.css"

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to hero */}
        <Route path="/" element={<Navigate to="/hero" replace />} />

        {/* Main routes */}
        <Route path="/hero" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Catch all route - redirect to hero */}
        <Route path="*" element={<Navigate to="/hero" replace />} />
      </Routes>
    </Router>
  )
}

export default App
