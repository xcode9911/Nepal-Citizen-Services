"use client"

import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "../css/dashboard.css"
import Logo from "../assets/Logo.jpg"

// User interface based on API response
interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  fatherName: string;
  motherName: string;
  citizenshipNo: string;
  issueDate: string;
  dob: string;
  panNumber: string;
  panIssueDate: string;
  createdAt: string;
  updatedAt: string;
  is_active: boolean;
  salary: number | null;
}

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
const QRCodeDisplay = ({ data }: { data: string }) => {
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
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // New state variables for receipt management
  const [activeTab, setActiveTab] = useState("users")
  const [receipts, setReceipts] = useState(mockReceipts)
  const [receiptFilter, setReceiptFilter] = useState("All")

  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All")
  const [serviceFilter, setServiceFilter] = useState("All")
  const [dateRangeFilter, setDateRangeFilter] = useState("All")

  // New state variables for QR code scanning
  const [qrCodeInput, setQrCodeInput] = useState("")
  const [qrScanResult, setQrScanResult] = useState<any>(null)
  const [qrError, setQrError] = useState("")
  const [isScanning, setIsScanning] = useState(false)

  // Restore state and handlers for Create User modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    address: '',
    fatherName: '',
    motherName: '',
    dob: '',
    issueDate: '',
    panIssueDate: '',
  });
  const handleOpenAddUser = () => setShowAddUserModal(true);
  const handleCloseAddUser = () => setShowAddUserModal(false);
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      const data: any = await response.json();
      if (response.ok) {
        alert('User created successfully!');
        setNewUser({ name: '', email: '', address: '', fatherName: '', motherName: '', dob: '', issueDate: '', panIssueDate: '' });
        handleCloseAddUser();
        // Refresh user list
        fetchUsers();
      } else {
        alert(data.message || 'Failed to create user.');
      }
    } catch (err) {
      alert('An error occurred while creating user.');
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail")
    if (email) {
      setUserEmail(email)
      fetchUsers();
    } else {
      // If no email found, redirect to login
      navigate("/login")
    }
  }, [navigate])

  // Enhanced filter users based on search and multiple criteria
  useEffect(() => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.citizenshipNo.includes(searchTerm) ||
          user.panNumber.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by user status (active/inactive)
    if (statusFilter !== "All") {
      filtered = filtered.filter((user) => {
        if (statusFilter === "Active") return user.is_active;
        if (statusFilter === "Inactive") return !user.is_active;
        return true;
      })
    }

    // Filter by date range
    if (dateRangeFilter !== "All") {
      const now = new Date()

      filtered = filtered.filter((user) => {
        const userDate = new Date(user.createdAt)
        const timeDiff = now.getTime() - userDate.getTime();
        switch (dateRangeFilter) {
          case "Last 30 days":
            return timeDiff <= 30 * 24 * 60 * 60 * 1000
          case "Last 3 months":
            return timeDiff <= 90 * 24 * 60 * 60 * 1000
          case "Last 6 months":
            return timeDiff <= 180 * 24 * 60 * 60 * 1000
          default:
            return true
        }
      })
    }

    setFilteredUsers(filtered)
  }, [searchTerm, statusFilter, paymentStatusFilter, serviceFilter, dateRangeFilter, users])

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem("userEmail")
    // Navigate to hero page
    navigate("/hero")
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? "status-badge status-active" : "status-badge status-inactive";
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  // Receipt management functions
  const handleReceiptAction = (receiptId: number, action: string) => {
    setReceipts((prev) =>
      prev.map((receipt) =>
        receipt.id === receiptId ? { ...receipt, status: action === "approve" ? "Approved" : "Rejected" } : receipt,
      ),
    )
  }

  const getReceiptStatusBadge = (status: string) => {
    const statusClasses: { [key: string]: string } = {
      Pending: "status-badge status-pending",
      Approved: "status-badge status-approved",
      Rejected: "status-badge status-rejected",
    };
    return statusClasses[status] || "status-badge";
  }

  const filteredReceipts = receipts.filter((receipt) => receiptFilter === "All" || receipt.status === receiptFilter)

  // QR Code handling function
  const handleQrCodeScan = async (qrCode: string) => {
    setIsScanning(true);
    setQrError("");
    setQrScanResult(null);

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Parse QR code - expecting format like "USER:123" or just "123"
      let userId = qrCode.trim();
      if (userId.startsWith("USER:")) {
        userId = userId.substring(5);
      }

      // Find user by ID
      const user = users.find((u) => u.id === userId);
      if (!user) {
        throw new Error("User not found");
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
      ].filter(() => Math.random() > 0.3); // Randomly show some payments

      setQrScanResult({
        user,
        paymentHistory,
        scanTime: new Date().toLocaleString(),
      });
    } catch (error) {
      setQrError((error as Error).message);
    } finally {
      setIsScanning(false);
    }
  };

  const clearQrScan = () => {
    setQrCodeInput("")
    setQrScanResult(null)
    setQrError("")
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusClasses: { [key: string]: string } = {
      Paid: "status-badge status-paid",
      Pending: "status-badge status-pending",
      Overdue: "status-badge status-overdue",
      Unpaid: "status-badge status-unpaid",
      Partial: "status-badge status-partial",
    }
    return statusClasses[status] || "status-badge"
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <img src={Logo} alt="Nepal Government Logo" className="nepal-logo" width={60} height={60} />
            <div>
              <h1 className="dashboard-title">Nepal Citizen Service</h1>
              <p className="dashboard-subtitle">Manage citizen accounts and services</p>
            </div>
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
              <div className="dashboard-controls">
                <div className="controls-left">
                  <div className="search-box enhanced">
                    <SearchIcon />
                    <input
                      type="text"
                      placeholder="Search by name, email, citizenship number, or PAN number..."
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
                  
                  <div className="filters-row" style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <button className="add-user-btn" onClick={handleOpenAddUser} style={{ padding: '12px 28px', fontSize: '1.08rem', borderRadius: '8px', fontWeight: 700, background: '#10b981', color: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(16,185,129,0.12)', transition: 'background 0.2s', cursor: 'pointer' }}>
                        + Create User
                      </button>
                      <span className="user-count" style={{ marginTop: 4 }}>
                        Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading users...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <p>{error}</p>
                  <button onClick={fetchUsers} className="retry-button">Retry</button>
                </div>
              ) : (
                <>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <h3>Total Users</h3>
                      <p className="stat-number">{users.length}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Active Users</h3>
                      <p className="stat-number">{users.filter((u) => u.is_active).length}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Inactive Users</h3>
                      <p className="stat-number">{users.filter((u) => !u.is_active).length}</p>
                    </div>
                    <div className="stat-card">
                      <h3>New This Month</h3>
                      <p className="stat-number">{users.filter((u) => {
                        const userDate = new Date(u.createdAt);
                        const now = new Date();
                        return now.getTime() - userDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
                      }).length}</p>
                    </div>
                  </div>
                  
                  {/* Users Table */}
                  <div className="table-container">
                    <table className="users-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Citizenship Number</th>
                          <th>PAN Number</th>
                          <th>Address</th>
                          <th>Status</th>
                          <th>Registration Date</th>
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
                            <td className="user-citizenship-number">{user.citizenshipNo}</td>
                            <td className="user-pan-number">{user.panNumber}</td>
                            <td className="user-address">{user.address}</td>
                            <td>
                              <span className={getStatusBadge(user.is_active)}>
                                {user.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="user-date">{formatDate(user.createdAt)}</td>
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
                </>
              )}
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
              </div>
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
                      {users.slice(0, 3).map((user) => (
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
                          {qrScanResult.paymentHistory.map((payment: any) => (
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
                          {qrScanResult.user.servicesUsed.map((service: string, index: number) => (
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
                    </div>
                  </div>

                  <div className="user-details-list">
                    <div className="detail-item">
                      <label>Email Address</label>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Citizenship Number</label>
                      <span>{selectedUser.citizenshipNo}</span>
                    </div>
                    <div className="detail-item">
                      <label>Status</label>
                      <span>{selectedUser.is_active ? "Active" : "Inactive"}</span>
                    </div>
                    <div className="detail-item">
                      <label>Registration Date</label>
                      <span>{selectedUser.createdAt}</span>
                    </div>
                    <div className="detail-item">
                      <label>Last Login</label>
                      <span>{selectedUser.updatedAt}</span>
                    </div>
                                          <div className="detail-item">
                        <label>Father's Name</label>
                        <span>{selectedUser.fatherName}</span>
                      </div>
                      <div className="detail-item">
                        <label>Mother's Name</label>
                        <span>{selectedUser.motherName}</span>
                      </div>
                      <div className="detail-item">
                        <label>Date of Birth</label>
                        <span>{formatDate(selectedUser.dob)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Issue Date</label>
                        <span>{formatDate(selectedUser.issueDate)}</span>
                      </div>
                      <div className="detail-item">
                        <label>PAN Number</label>
                        <span>{selectedUser.panNumber}</span>
                      </div>
                      <div className="detail-item">
                        <label>PAN Issue Date</label>
                        <span>{formatDate(selectedUser.panIssueDate)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Address</label>
                        <span>{selectedUser.address}</span>
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
      {showAddUserModal && (
        <div className="modal-overlay" onClick={handleCloseAddUser}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ flexDirection: 'row', alignItems: 'center', gap: 14, justifyContent: 'flex-start', position: 'relative' }}>
              <img src={Logo} alt="Nepal Government Logo" style={{ width: 72, height: 72, borderRadius: '50%' }} />
              <h2 style={{ margin: 0 }}>Create User</h2>
              <button className="modal-close" onClick={handleCloseAddUser} style={{ position: 'absolute', top: 18, right: 18 }}>×</button>
            </div>
            <form className="add-user-form" onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={newUser.name} onChange={handleNewUserChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={newUser.email} onChange={handleNewUserChange} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input name="address" value={newUser.address} onChange={handleNewUserChange} required />
              </div>
              <div className="form-group">
                <label>Father's Name</label>
                <input name="fatherName" value={newUser.fatherName} onChange={handleNewUserChange} required />
              </div>
              <div className="form-group">
                <label>Mother's Name</label>
                <input name="motherName" value={newUser.motherName} onChange={handleNewUserChange} required />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input name="dob" type="date" value={newUser.dob} onChange={handleNewUserChange} required />
              </div>
              <div className="form-group">
                <label>Issue Date</label>
                <input name="issueDate" type="date" value={newUser.issueDate} onChange={handleNewUserChange} required />
              </div>
              <div className="form-group">
                <label>PAN Issue Date</label>
                <input name="panIssueDate" type="date" value={newUser.panIssueDate} onChange={handleNewUserChange} required />
              </div>
              <div className="form-actions">
                <button type="submit" className="action-btn primary">Create User</button>
                <button type="button" className="action-btn secondary" onClick={handleCloseAddUser}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
