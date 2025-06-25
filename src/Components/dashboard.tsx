"use client"

import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "../css/dashboard.css"

// Mock user data with payment status
const mockUsers = [
  {
    id: 1,
    name: "Ram Bahadur Thapa",
    email: "ram.thapa@citizen.gov.np",
    phone: "+977-9841234567",
    status: "Active",
    role: "Citizen",
    registeredDate: "2024-01-15",
    lastLogin: "2024-12-20",
    paymentStatus: "Paid",
    lastPayment: "2024-12-15",
    totalPaid: 1500,
    pendingAmount: 0,
    servicesUsed: ["Birth Certificate", "Tax Payment"],
  },
  {
    id: 2,
    name: "Sita Kumari Sharma",
    email: "sita.sharma@citizen.gov.np",
    phone: "+977-9851234568",
    status: "Active",
    role: "Citizen",
    registeredDate: "2024-02-10",
    lastLogin: "2024-12-19",
    paymentStatus: "Pending",
    lastPayment: "2024-11-20",
    totalPaid: 500,
    pendingAmount: 1000,
    servicesUsed: ["Citizenship Certificate"],
  },
  {
    id: 3,
    name: "Hari Prasad Poudel",
    email: "hari.poudel@citizen.gov.np",
    phone: "+977-9861234569",
    status: "Inactive",
    role: "Citizen",
    registeredDate: "2024-01-28",
    lastLogin: "2024-12-10",
    paymentStatus: "Overdue",
    lastPayment: "2024-10-15",
    totalPaid: 750,
    pendingAmount: 2500,
    servicesUsed: ["Tax Payment", "Land Registration"],
  },
  {
    id: 4,
    name: "Maya Devi Gurung",
    email: "maya.gurung@citizen.gov.np",
    phone: "+977-9871234570",
    status: "Active",
    role: "Citizen",
    registeredDate: "2024-03-05",
    lastLogin: "2024-12-20",
    paymentStatus: "Paid",
    lastPayment: "2024-12-18",
    totalPaid: 2250,
    pendingAmount: 0,
    servicesUsed: ["Marriage Certificate", "Birth Certificate"],
  },
  {
    id: 5,
    name: "Krishna Kumar Shrestha",
    email: "krishna.shrestha@citizen.gov.np",
    phone: "+977-9881234571",
    status: "Pending",
    role: "Citizen",
    registeredDate: "2024-12-18",
    lastLogin: "Never",
    paymentStatus: "Unpaid",
    lastPayment: "Never",
    totalPaid: 0,
    pendingAmount: 500,
    servicesUsed: ["Citizenship Certificate"],
  },
  {
    id: 6,
    name: "Gita Rani Maharjan",
    email: "gita.maharjan@citizen.gov.np",
    phone: "+977-9891234572",
    status: "Active",
    role: "Citizen",
    registeredDate: "2024-02-20",
    lastLogin: "2024-12-19",
    paymentStatus: "Partial",
    lastPayment: "2024-12-10",
    totalPaid: 1000,
    pendingAmount: 750,
    servicesUsed: ["Tax Payment", "Marriage Certificate"],
  },
]

// Mock receipts data
const mockReceipts = [
  {
    id: 1,
    receiptNumber: "RCP-2024-001",
    userName: "Ram Bahadur Thapa",
    userEmail: "ram.thapa@citizen.gov.np",
    serviceName: "Birth Certificate",
    amount: 500,
    currency: "NPR",
    uploadDate: "2024-12-20",
    status: "Pending",
    receiptImage: "/placeholder.svg?height=400&width=300",
    paymentMethod: "eSewa",
    transactionId: "ESW123456789",
  },
  {
    id: 2,
    receiptNumber: "RCP-2024-002",
    userName: "Sita Kumari Sharma",
    userEmail: "sita.sharma@citizen.gov.np",
    serviceName: "Citizenship Certificate",
    amount: 1000,
    currency: "NPR",
    uploadDate: "2024-12-19",
    status: "Approved",
    receiptImage: "/placeholder.svg?height=400&width=300",
    paymentMethod: "Khalti",
    transactionId: "KHL987654321",
  },
  {
    id: 3,
    receiptNumber: "RCP-2024-003",
    userName: "Hari Prasad Poudel",
    userEmail: "hari.poudel@citizen.gov.np",
    serviceName: "Tax Payment",
    amount: 2500,
    currency: "NPR",
    uploadDate: "2024-12-18",
    status: "Rejected",
    receiptImage: "/placeholder.svg?height=400&width=300",
    paymentMethod: "Bank Transfer",
    transactionId: "BNK456789123",
  },
  {
    id: 4,
    receiptNumber: "RCP-2024-004",
    userName: "Maya Devi Gurung",
    userEmail: "maya.gurung@citizen.gov.np",
    serviceName: "Marriage Certificate",
    amount: 750,
    currency: "NPR",
    uploadDate: "2024-12-17",
    status: "Pending",
    receiptImage: "/placeholder.svg?height=400&width=300",
    paymentMethod: "eSewa",
    transactionId: "ESW789123456",
  },
  {
    id: 5,
    receiptNumber: "RCP-2024-005",
    userName: "Krishna Kumar Shrestha",
    userEmail: "krishna.shrestha@citizen.gov.np",
    serviceName: "Land Registration",
    amount: 5000,
    currency: "NPR",
    uploadDate: "2024-12-16",
    status: "Pending",
    receiptImage: "/placeholder.svg?height=400&width=300",
    paymentMethod: "IME Pay",
    transactionId: "IME321654987",
  },
]

// Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon
      points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="19" cy="12" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5" cy="12" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="16,17 21,12 16,7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="21"
      y1="12"
      x2="9"
      y2="12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// QR Code component (simple representation)
const QRCodeDisplay = ({ data }) => {
  // Simple QR code pattern representation
  const qrPattern = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  ]

  return (
    <div className="qr-code-container">
      <div className="qr-code">
        {qrPattern.map((row, i) => (
          <div key={i} className="qr-row">
            {row.map((cell, j) => (
              <div key={j} className={`qr-cell ${cell ? "filled" : "empty"}`} />
            ))}
          </div>
        ))}
      </div>
      <p className="qr-data">User ID: {data}</p>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // New state variables for receipt management
  const [activeTab, setActiveTab] = useState("users")
  const [receipts, setReceipts] = useState(mockReceipts)
  const [receiptFilter, setReceiptFilter] = useState("All")

  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All")
  const [serviceFilter, setServiceFilter] = useState("All")
  const [dateRangeFilter, setDateRangeFilter] = useState("All")

  // New state variables for QR code scanning
  const [qrCodeInput, setQrCodeInput] = useState("")
  const [qrScanResult, setQrScanResult] = useState(null)
  const [qrError, setQrError] = useState("")
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail")
    if (email) {
      setUserEmail(email)
    } else {
      // If no email found, redirect to login
      navigate("/login")
    }
  }, [navigate])

  // Enhanced filter users based on search and multiple criteria
  useEffect(() => {
    let filtered = mockUsers

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm) ||
          user.servicesUsed.some((service) => service.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by user status
    if (statusFilter !== "All") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    // Filter by payment status
    if (paymentStatusFilter !== "All") {
      filtered = filtered.filter((user) => user.paymentStatus === paymentStatusFilter)
    }

    // Filter by service
    if (serviceFilter !== "All") {
      filtered = filtered.filter((user) => user.servicesUsed.includes(serviceFilter))
    }

    // Filter by date range
    if (dateRangeFilter !== "All") {
      const now = new Date()

      filtered = filtered.filter((user) => {
        const userDate = new Date(user.registeredDate)
        switch (dateRangeFilter) {
          case "Last 30 days":
            return now - userDate <= 30 * 24 * 60 * 60 * 1000
          case "Last 3 months":
            return now - userDate <= 90 * 24 * 60 * 60 * 1000
          case "Last 6 months":
            return now - userDate <= 180 * 24 * 60 * 60 * 1000
          default:
            return true
        }
      })
    }

    setFilteredUsers(filtered)
  }, [searchTerm, statusFilter, paymentStatusFilter, serviceFilter, dateRangeFilter])

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem("userEmail")
    // Navigate to hero page
    navigate("/hero")
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      Active: "status-badge status-active",
      Inactive: "status-badge status-inactive",
      Pending: "status-badge status-pending",
    }
    return statusClasses[status] || "status-badge"
  }

  const handleUserClick = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  // Receipt management functions
  const handleReceiptAction = (receiptId, action) => {
    setReceipts((prev) =>
      prev.map((receipt) =>
        receipt.id === receiptId ? { ...receipt, status: action === "approve" ? "Approved" : "Rejected" } : receipt,
      ),
    )
  }

  const getReceiptStatusBadge = (status) => {
    const statusClasses = {
      Pending: "status-badge status-pending",
      Approved: "status-badge status-approved",
      Rejected: "status-badge status-rejected",
    }
    return statusClasses[status] || "status-badge"
  }

  const filteredReceipts = receipts.filter((receipt) => receiptFilter === "All" || receipt.status === receiptFilter)

  // QR Code handling function
  const handleQrCodeScan = async (qrCode) => {
    setIsScanning(true)
    setQrError("")
    setQrScanResult(null)

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Parse QR code - expecting format like "USER:123" or just "123"
      let userId = qrCode.trim()
      if (userId.startsWith("USER:")) {
        userId = userId.substring(5)
      }

      const userIdNum = Number.parseInt(userId)
      if (isNaN(userIdNum)) {
        throw new Error("Invalid QR code format")
      }

      // Find user by ID
      const user = mockUsers.find((u) => u.id === userIdNum)
      if (!user) {
        throw new Error("User not found")
      }

      // Get user's payment history (mock data)
      const paymentHistory = [
        {
          id: 1,
          date: "2024-12-20",
          service: "Birth Certificate",
          amount: 500,
          method: "eSewa",
          status: "Completed",
          transactionId: "ESW123456789",
        },
        {
          id: 2,
          date: "2024-11-15",
          service: "Tax Payment",
          amount: 1000,
          method: "Khalti",
          status: "Completed",
          transactionId: "KHL987654321",
        },
        {
          id: 3,
          date: "2024-12-22",
          service: "Citizenship Certificate",
          amount: 1000,
          method: "Bank Transfer",
          status: "Pending",
          transactionId: "BNK456789123",
        },
      ].filter(() => Math.random() > 0.3) // Randomly show some payments

      setQrScanResult({
        user,
        paymentHistory,
        scanTime: new Date().toLocaleString(),
      })
    } catch (error) {
      setQrError(error.message)
    } finally {
      setIsScanning(false)
    }
  }

  const clearQrScan = () => {
    setQrCodeInput("")
    setQrScanResult(null)
    setQrError("")
  }

  const getPaymentStatusBadge = (status) => {
    const statusClasses = {
      Paid: "status-badge status-paid",
      Pending: "status-badge status-pending",
      Overdue: "status-badge status-overdue",
      Unpaid: "status-badge status-unpaid",
      Partial: "status-badge status-partial",
    }
    return statusClasses[status] || "status-badge"
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">User Management</h1>
            <p className="dashboard-subtitle">Manage citizen accounts and services</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <UserIcon />
              <span className="user-email">{userEmail}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              <LogoutIcon />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <UserIcon />
              User Management
            </button>
            <button
              className={`tab-button ${activeTab === "receipts" ? "active" : ""}`}
              onClick={() => setActiveTab("receipts")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="14,2 14,8 20,8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="16"
                  y1="13"
                  x2="8"
                  y2="13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="16"
                  y1="17"
                  x2="8"
                  y2="17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="10,9 9,9 8,9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Payment Receipts
            </button>
            <button
              className={`tab-button ${activeTab === "qr-scanner" ? "active" : ""}`}
              onClick={() => setActiveTab("qr-scanner")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect
                  x="3"
                  y="3"
                  width="5"
                  height="5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="16"
                  y="3"
                  width="5"
                  height="5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="3"
                  y="16"
                  width="5"
                  height="5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="21"
                  y1="16"
                  x2="16"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="21"
                  y1="21"
                  x2="16"
                  y2="21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="16"
                  y1="16"
                  x2="16"
                  y2="21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="21"
                  y1="16"
                  x2="21"
                  y2="21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              QR Payment Checker
            </button>
          </div>

          {/* Users Tab Content */}
          {activeTab === "users" && (
            <>
              {/* Enhanced Controls */}
              <div className="dashboard-controls">
                <div className="controls-left">
                  <div className="search-box enhanced">
                    <SearchIcon />
                    <input
                      type="text"
                      placeholder="Search by name, email, phone, or service..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    {searchTerm && (
                      <button className="clear-search" onClick={() => setSearchTerm("")} title="Clear search">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <line
                            x1="18"
                            y1="6"
                            x2="6"
                            y2="18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="6"
                            y1="6"
                            x2="18"
                            y2="18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="filters-row">
                    <div className="filter-box">
                      <FilterIcon />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-select"
                      >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>

                    <div className="filter-box">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 1v6m0 6v6" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <select
                        value={paymentStatusFilter}
                        onChange={(e) => setPaymentStatusFilter(e.target.value)}
                        className="filter-select"
                      >
                        <option value="All">All Payments</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Unpaid">Unpaid</option>
                        <option value="Partial">Partial</option>
                      </select>
                    </div>

                    <div className="filter-box">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <select
                        value={serviceFilter}
                        onChange={(e) => setServiceFilter(e.target.value)}
                        className="filter-select"
                      >
                        <option value="All">All Services</option>
                        <option value="Birth Certificate">Birth Certificate</option>
                        <option value="Citizenship Certificate">Citizenship Certificate</option>
                        <option value="Marriage Certificate">Marriage Certificate</option>
                        <option value="Tax Payment">Tax Payment</option>
                        <option value="Land Registration">Land Registration</option>
                      </select>
                    </div>

                    <div className="filter-box">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <select
                        value={dateRangeFilter}
                        onChange={(e) => setDateRangeFilter(e.target.value)}
                        className="filter-select"
                      >
                        <option value="All">All Time</option>
                        <option value="Last 30 days">Last 30 days</option>
                        <option value="Last 3 months">Last 3 months</option>
                        <option value="Last 6 months">Last 6 months</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="controls-right">
                  <div className="filter-summary">
                    <span className="user-count">
                      Showing <strong>{filteredUsers.length}</strong> of <strong>{mockUsers.length}</strong> users
                    </span>
                    {(searchTerm ||
                      statusFilter !== "All" ||
                      paymentStatusFilter !== "All" ||
                      serviceFilter !== "All" ||
                      dateRangeFilter !== "All") && (
                      <button
                        className="clear-filters"
                        onClick={() => {
                          setSearchTerm("")
                          setStatusFilter("All")
                          setPaymentStatusFilter("All")
                          setServiceFilter("All")
                          setDateRangeFilter("All")
                        }}
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Payment Status</th>
                      <th>Total Paid</th>
                      <th>Pending</th>
                      <th>Last Payment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} onClick={() => handleUserClick(user)} className="clickable-row">
                        <td className="user-name">
                          <div className="name-cell">
                            <div className="user-avatar">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)}
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td className="user-email">{user.email}</td>
                        <td className="user-phone">{user.phone}</td>
                        <td>
                          <span className={getStatusBadge(user.status)}>{user.status}</span>
                        </td>
                        <td>
                          <span className={getPaymentStatusBadge(user.paymentStatus)}>{user.paymentStatus}</span>
                        </td>
                        <td className="user-amount">NPR {user.totalPaid.toLocaleString()}</td>
                        <td className="user-amount pending">
                          {user.pendingAmount > 0 ? `NPR ${user.pendingAmount.toLocaleString()}` : "-"}
                        </td>
                        <td className="user-date">{user.lastPayment}</td>
                        <td>
                          <button className="action-button" title="More actions">
                            <MoreIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="no-results">
                    <p>No users found matching your criteria.</p>
                  </div>
                )}
              </div>

              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Users</h3>
                  <p className="stat-number">{mockUsers.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Active Users</h3>
                  <p className="stat-number">{mockUsers.filter((u) => u.status === "Active").length}</p>
                </div>
                <div className="stat-card">
                  <h3>Pending Users</h3>
                  <p className="stat-number">{mockUsers.filter((u) => u.status === "Pending").length}</p>
                </div>
                <div className="stat-card">
                  <h3>Inactive Users</h3>
                  <p className="stat-number">{mockUsers.filter((u) => u.status === "Inactive").length}</p>
                </div>
              </div>
            </>
          )}

          {/* Receipts Tab Content */}
          {activeTab === "receipts" && (
            <>
              {/* Receipt Controls */}
              <div className="dashboard-controls">
                <div className="controls-left">
                  <div className="filter-box">
                    <FilterIcon />
                    <select
                      value={receiptFilter}
                      onChange={(e) => setReceiptFilter(e.target.value)}
                      className="filter-select"
                    >
                      <option value="All">All Receipts</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div className="controls-right">
                  <div className="user-count">
                    Total Receipts: <strong>{filteredReceipts.length}</strong>
                  </div>
                </div>
              </div>

              {/* Receipts Grid */}
              <div className="receipts-grid">
                {filteredReceipts.map((receipt) => (
                  <div key={receipt.id} className="receipt-card">
                    <div className="receipt-header">
                      <div className="receipt-info">
                        <h3 className="receipt-number">{receipt.receiptNumber}</h3>
                        <span className={getReceiptStatusBadge(receipt.status)}>{receipt.status}</span>
                      </div>
                      <div className="receipt-amount">
                        <span className="amount">
                          {receipt.currency} {receipt.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="receipt-body">
                      <div className="receipt-image">
                        <img
                          src={receipt.receiptImage || "/placeholder.svg"}
                          alt={`Receipt ${receipt.receiptNumber}`}
                          className="receipt-preview"
                        />
                      </div>

                      <div className="receipt-details">
                        <div className="detail-row">
                          <span className="label">User:</span>
                          <span className="value">{receipt.userName}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Service:</span>
                          <span className="value">{receipt.serviceName}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Payment Method:</span>
                          <span className="value">{receipt.paymentMethod}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Transaction ID:</span>
                          <span className="value">{receipt.transactionId}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Upload Date:</span>
                          <span className="value">{receipt.uploadDate}</span>
                        </div>
                      </div>
                    </div>

                    {receipt.status === "Pending" && (
                      <div className="receipt-actions">
                        <button className="approve-button" onClick={() => handleReceiptAction(receipt.id, "approve")}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <polyline
                              points="20,6 9,17 4,12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Approve
                        </button>
                        <button className="reject-button" onClick={() => handleReceiptAction(receipt.id, "reject")}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <line
                              x1="18"
                              y1="6"
                              x2="6"
                              y2="18"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <line
                              x1="6"
                              y1="6"
                              x2="18"
                              y2="18"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredReceipts.length === 0 && (
                <div className="no-results">
                  <p>No receipts found matching your criteria.</p>
                </div>
              )}

              {/* Receipt Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Receipts</h3>
                  <p className="stat-number">{receipts.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Pending</h3>
                  <p className="stat-number">{receipts.filter((r) => r.status === "Pending").length}</p>
                </div>
                <div className="stat-card">
                  <h3>Approved</h3>
                  <p className="stat-number">{receipts.filter((r) => r.status === "Approved").length}</p>
                </div>
                <div className="stat-card">
                  <h3>Rejected</h3>
                  <p className="stat-number">{receipts.filter((r) => r.status === "Rejected").length}</p>
                </div>
              </div>
            </>
          )}

          {/* QR Scanner Tab Content */}
          {activeTab === "qr-scanner" && (
            <>
              <div className="qr-scanner-container">
                <div className="qr-scanner-header">
                  <h2>Payment Status Checker</h2>
                  <p>Scan or enter a citizen QR code to check payment status and history</p>
                </div>

                <div className="qr-input-section">
                  <div className="qr-input-container">
                    <div className="qr-input-box">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="5" height="5" stroke="currentColor" strokeWidth="2" />
                        <rect x="16" y="3" width="5" height="5" stroke="currentColor" strokeWidth="2" />
                        <rect x="3" y="16" width="5" height="5" stroke="currentColor" strokeWidth="2" />
                        <line x1="21" y1="16" x2="16" y2="16" stroke="currentColor" strokeWidth="2" />
                        <line x1="21" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" />
                        <line x1="16" y1="16" x2="16" y2="21" stroke="currentColor" strokeWidth="2" />
                        <line x1="21" y1="16" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Enter QR code data (e.g., USER:1 or just 1)"
                        value={qrCodeInput}
                        onChange={(e) => setQrCodeInput(e.target.value)}
                        className="qr-input"
                        disabled={isScanning}
                      />
                      {qrCodeInput && (
                        <button className="clear-qr-input" onClick={() => setQrCodeInput("")} disabled={isScanning}>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
                            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="qr-actions">
                      <button
                        className="scan-button primary"
                        onClick={() => handleQrCodeScan(qrCodeInput)}
                        disabled={!qrCodeInput || isScanning}
                      >
                        {isScanning ? (
                          <>
                            <div className="loading-spinner-small"></div>
                            Checking...
                          </>
                        ) : (
                          <>
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            Check Payment Status
                          </>
                        )}
                      </button>

                      {(qrScanResult || qrError) && (
                        <button className="scan-button secondary" onClick={clearQrScan} disabled={isScanning}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M3 6h18l-2 13H5L3 6z" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          Clear Results
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sample QR Codes */}
                  <div className="sample-qr-codes">
                    <h4>Sample QR Codes:</h4>
                    <div className="sample-codes">
                      {mockUsers.slice(0, 3).map((user) => (
                        <button
                          key={user.id}
                          className="sample-code-button"
                          onClick={() => setQrCodeInput(`USER:${user.id}`)}
                          disabled={isScanning}
                        >
                          USER:{user.id} ({user.name.split(" ")[0]})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {qrError && (
                  <div className="qr-error">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
                      <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>{qrError}</span>
                  </div>
                )}

                {/* Scan Results */}
                {qrScanResult && (
                  <div className="qr-results">
                    <div className="result-header">
                      <div className="result-info">
                        <h3>Payment Status for {qrScanResult.user.name}</h3>
                        <p>Scanned at: {qrScanResult.scanTime}</p>
                      </div>
                      <div className="result-status">
                        <span className={getPaymentStatusBadge(qrScanResult.user.paymentStatus)}>
                          {qrScanResult.user.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="payment-overview">
                      <div className="payment-stats">
                        <div className="payment-stat">
                          <div className="stat-icon paid">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" />
                            </svg>
                          </div>
                          <div className="stat-details">
                            <span className="stat-label">Total Paid</span>
                            <span className="stat-value paid">NPR {qrScanResult.user.totalPaid.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="payment-stat">
                          <div className="stat-icon pending">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                              <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" />
                            </svg>
                          </div>
                          <div className="stat-details">
                            <span className="stat-label">Pending Amount</span>
                            <span className="stat-value pending">
                              {qrScanResult.user.pendingAmount > 0
                                ? `NPR ${qrScanResult.user.pendingAmount.toLocaleString()}`
                                : "None"}
                            </span>
                          </div>
                        </div>

                        <div className="payment-stat">
                          <div className="stat-icon services">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" />
                              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" />
                              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" />
                            </svg>
                          </div>
                          <div className="stat-details">
                            <span className="stat-label">Services Used</span>
                            <span className="stat-value services">
                              {qrScanResult.user.servicesUsed.length} Services
                            </span>
                          </div>
                        </div>

                        <div className="payment-stat">
                          <div className="stat-icon date">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
                            </svg>
                          </div>
                          <div className="stat-details">
                            <span className="stat-label">Last Payment</span>
                            <span className="stat-value date">{qrScanResult.user.lastPayment}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment History */}
                    {qrScanResult.paymentHistory.length > 0 && (
                      <div className="payment-history">
                        <h4>Recent Payment History</h4>
                        <div className="payment-transactions">
                          {qrScanResult.paymentHistory.map((payment) => (
                            <div key={payment.id} className="transaction-item">
                              <div className="transaction-icon">
                                <div className={`transaction-status ${payment.status.toLowerCase()}`}>
                                  {payment.status === "Completed" ? (
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                  ) : (
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                      <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                  )}
                                </div>
                              </div>

                              <div className="transaction-details">
                                <div className="transaction-main">
                                  <span className="transaction-service">{payment.service}</span>
                                  <span className="transaction-amount">NPR {payment.amount.toLocaleString()}</span>
                                </div>
                                <div className="transaction-meta">
                                  <span className="transaction-date">{payment.date}</span>
                                  <span className="transaction-method">{payment.method}</span>
                                  <span className="transaction-id">{payment.transactionId}</span>
                                </div>
                              </div>

                              <div className="transaction-status-badge">
                                <span className={`status-badge status-${payment.status.toLowerCase()}`}>
                                  {payment.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {qrScanResult.paymentHistory.length === 0 && (
                      <div className="no-payment-history">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <h4>No Payment History</h4>
                        <p>This user has not made any payments yet.</p>
                      </div>
                    )}

                    {/* User Services */}
                    <div className="user-services">
                      <h4>Services Used</h4>
                      <div className="services-list">
                        {qrScanResult.user.servicesUsed.map((service, index) => (
                          <div key={index} className="service-item">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="modal-close" onClick={closeModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line
                    x1="18"
                    y1="6"
                    x2="6"
                    y2="18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="6"
                    y1="6"
                    x2="18"
                    y2="18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="user-details-grid">
                {/* Left Column - User Info */}
                <div className="user-info-section">
                  <div className="user-profile">
                    <div className="user-avatar-large">
                      {selectedUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </div>
                    <div className="user-basic-info">
                      <h3>{selectedUser.name}</h3>
                      <p className="user-id">ID: #{selectedUser.id.toString().padStart(6, "0")}</p>
                      <span className={getStatusBadge(selectedUser.status)}>{selectedUser.status}</span>
                    </div>
                  </div>

                  <div className="user-details-list">
                    <div className="detail-item">
                      <label>Email Address</label>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone Number</label>
                      <span>{selectedUser.phone}</span>
                    </div>
                    <div className="detail-item">
                      <label>Role</label>
                      <span>{selectedUser.role}</span>
                    </div>
                    <div className="detail-item">
                      <label>Registration Date</label>
                      <span>{selectedUser.registeredDate}</span>
                    </div>
                    <div className="detail-item">
                      <label>Last Login</label>
                      <span>{selectedUser.lastLogin}</span>
                    </div>
                    <div className="detail-item">
                      <label>Services Accessed</label>
                      <span>{selectedUser.servicesUsed.join(", ")}</span>
                    </div>
                    <div className="detail-item">
                      <label>Documents Submitted</label>
                      <span>3 Documents Verified</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - QR Code */}
                <div className="qr-section">
                  <h4>Citizen QR Code</h4>
                  <QRCodeDisplay data={selectedUser.id.toString()} />
                  <div className="qr-info">
                    <p>Scan this QR code to verify citizen identity and access services.</p>
                    <div className="qr-actions">
                      <button className="qr-download-btn">Download QR</button>
                      <button className="qr-print-btn">Print</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="action-btn primary">Edit User</button>
                <button className="action-btn secondary">Send Message</button>
                <button className="action-btn danger">Deactivate</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
