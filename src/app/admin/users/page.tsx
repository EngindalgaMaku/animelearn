"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Trash2,
  Star,
  X,
  CheckCircle,
  Plus,
  Edit,
  Shield,
  ShieldCheck,
  Crown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  User,
  Mail,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  username: string | null;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: string;
  level: number;
  experience: number;
  currentDiamonds: number;
  totalDiamonds: number;
  isActive: boolean;
  isPremium: boolean;
  premiumExpiresAt?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginDate: string | null;
  loginStreak: number;
  _count?: {
    userCards: number;
    lessonProgress: number;
    quizAttempts: number;
    badges: number;
  };
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  userUsers: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<"email" | "date" | "role" | "activity">("date");
  const [filterRole, setFilterRole] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // User form states
  const [userForm, setUserForm] = useState({
    email: "",
    username: "",
    role: "user",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);

  // Stats
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    userUsers: 0,
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterRole, filterStatus, sortBy]);

  const fetchUsers = async (page = currentPage) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(filterRole && { role: filterRole }),
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(sortBy && { sortBy: sortBy }),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setPagination(data.pagination || {});
      }
    } catch (error) {
      console.error("Users fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/users/stats");
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalUsers: data.overview?.totalUsers || 0,
          activeUsers: data.overview?.activeUsers || 0,
          adminUsers: data.distribution?.roles?.find((r: any) => r.role === 'admin')?.count || 0,
          userUsers: data.distribution?.roles?.find((r: any) => r.role === 'user')?.count || 0,
        });
      }
    } catch (error) {
      console.error("Stats fetch failed:", error);
    }
  };

  const createUser = async () => {
    if (!userForm.email || !userForm.password) {
      alert("Email and password are required");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });

      if (response.ok) {
        setShowCreateUserModal(false);
        setUserForm({
          email: "",
          username: "",
          role: "user",
          firstName: "",
          lastName: "",
          password: "",
        });
        fetchUsers();
        fetchStats();
        showSuccess("User created successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to create user: ${error.error}`);
      }
    } catch (error) {
      console.error("User creation failed:", error);
      alert("Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;

    setEditing(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          username: userForm.username,
          role: userForm.role,
          firstName: userForm.firstName,
          lastName: userForm.lastName,
        }),
      });

      if (response.ok) {
        setShowEditUserModal(false);
        setSelectedUser(null);
        fetchUsers();
        fetchStats();
        showSuccess("User updated successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to update user: ${error.error}`);
      }
    } catch (error) {
      console.error("User update failed:", error);
      alert("Failed to update user");
    } finally {
      setEditing(false);
    }
  };

  const deleteUser = async (userId: string, userEmail: string, userRole: string) => {
    if (userRole === 'admin') {
      alert("Admin user cannot be deleted!");
      return;
    }

    if (!confirm(`Are you sure you want to delete user "${userEmail}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchUsers();
        fetchStats();
        showSuccess("User deleted successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to delete user: ${error.error}`);
      }
    } catch (error) {
      console.error("User deletion failed:", error);
      alert("Failed to delete user");
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !isActive }),
      });

      if (response.ok) {
        fetchUsers();
        fetchStats();
        showSuccess(`User ${!isActive ? "activated" : "deactivated"} successfully!`);
      } else {
        const error = await response.json();
        alert(`Failed to update user status: ${error.error}`);
      }
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Failed to update user status");
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setUserForm({
      email: user.email,
      username: user.username || "",
      role: user.role,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      password: "",
    });
    setShowEditUserModal(true);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchUsers(newPage);
  };

  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      handlePageChange(currentPage + 1);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case "moderator":
        return <ShieldCheck className="h-4 w-4 text-purple-600" />;
      default:
        return <User className="h-4 w-4 text-blue-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "moderator":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">
            {stats.totalUsers} users • {stats.activeUsers} active
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Stats Cards */}
          <div className="flex space-x-4">
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <div className="text-sm font-medium text-blue-600">Total</div>
              <div className="text-xl font-bold text-blue-900">{stats.totalUsers}</div>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-center">
              <div className="text-sm font-medium text-green-600">Active</div>
              <div className="text-xl font-bold text-green-900">{stats.activeUsers}</div>
            </div>
            <div className="rounded-lg bg-yellow-50 p-3 text-center">
              <div className="text-sm font-medium text-yellow-600">Admins</div>
              <div className="text-xl font-bold text-yellow-900">{stats.adminUsers}</div>
            </div>
          </div>

          <button
            onClick={() => setShowCreateUserModal(true)}
            className="flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-5 w-5" />
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="date">Date Created</option>
              <option value="email">Email</option>
              <option value="role">Role</option>
              <option value="activity">Last Activity</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            Showing {users.length} of {pagination.total} users
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-2 ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md p-2 ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Users Grid/List */}
      {users.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-gray-400">
            <User className="mx-auto h-16 w-16" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">No users found</h3>
          <p className="text-gray-600">Adjust your search criteria or create a new user</p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-4"
          }
        >
          {users.map((user) => (
            <div
              key={user.id}
              className={
                viewMode === "grid"
                  ? "rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
                  : "flex items-center space-x-4 rounded-lg bg-white p-4 shadow"
              }
            >
              {viewMode === "grid" ? (
                // Grid View
                <div className="space-y-4">
                  {/* Avatar and Basic Info */}
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.email}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold">
                          {(user.firstName || user.email).charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.username || user.email}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Role and Status */}
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center space-x-1 rounded-full border px-2 py-1 text-xs font-medium ${getRoleBadge(user.role)}`}
                    >
                      {getRoleIcon(user.role)}
                      <span>{user.role}</span>
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Stats */}
                  {user._count && (
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{user._count.userCards}</div>
                        <div className="text-xs text-gray-600">Cards</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">{user._count.badges}</div>
                        <div className="text-xs text-gray-600">Badges</div>
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>Created: {formatDate(new Date(user.createdAt))}</p>
                    {user.lastLoginDate && (
                      <p>Last login: {formatDate(new Date(user.lastLoginDate))}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                        className={`flex-1 rounded-md px-3 py-2 text-xs font-medium ${
                          user.isActive
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    )}
                    {user.role !== 'admin' ? (
                      <button
                        onClick={() => deleteUser(user.id, user.email, user.role)}
                        className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <div className="rounded-md bg-gray-300 p-2 text-gray-500" title="Admin cannot be deleted">
                        <Trash2 className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // List View
                <>
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.email}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold">
                          {(user.firstName || user.email).charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.username || "No name"}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </p>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`inline-flex items-center space-x-1 rounded-full border px-2 py-1 text-xs font-medium ${getRoleBadge(user.role)}`}
                        >
                          {getRoleIcon(user.role)}
                          <span>{user.role}</span>
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Created: {formatDate(new Date(user.createdAt))}</span>
                      </p>
                    </div>
                  </div>

                  {user._count && (
                    <div className="flex space-x-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{user._count.userCards}</div>
                        <div className="text-xs text-gray-600">Cards</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">{user._count.badges}</div>
                        <div className="text-xs text-gray-600">Badges</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                        className={`rounded-md p-2 text-white ${
                          user.isActive
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                        title={user.isActive ? "Deactivate" : "Activate"}
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                    )}
                    {user.role !== 'admin' ? (
                      <button
                        onClick={() => deleteUser(user.id, user.email, user.role)}
                        className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <div className="rounded-md bg-gray-300 p-2 text-gray-500" title="Admin cannot be deleted">
                        <Trash2 className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={!pagination.hasPrev}
            className={`flex items-center rounded-lg px-4 py-2 ${
              pagination.hasPrev
                ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                : "cursor-not-allowed bg-gray-100 text-gray-400"
            }`}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => {
                const shouldShowPage =
                  page === 1 ||
                  page === pagination.totalPages ||
                  Math.abs(page - pagination.page) <= 1;

                if (!shouldShowPage) {
                  if (
                    page === pagination.page - 2 ||
                    page === pagination.page + 2
                  ) {
                    return (
                      <span key={page} className="px-3 py-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`rounded-lg px-3 py-2 ${
                      page === pagination.page
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
            )}
          </div>

          <button
            onClick={handleNextPage}
            disabled={!pagination.hasNext}
            className={`flex items-center rounded-lg px-4 py-2 ${
              pagination.hasNext
                ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                : "cursor-not-allowed bg-gray-100 text-gray-400"
            }`}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={userForm.firstName}
                    onChange={(e) =>
                      setUserForm({ ...userForm, firstName: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={userForm.lastName}
                    onChange={(e) =>
                      setUserForm({ ...userForm, lastName: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={userForm.username}
                  onChange={(e) =>
                    setUserForm({ ...userForm, username: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({ ...userForm, role: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 border-t p-6">
              <button
                onClick={() => setShowCreateUserModal(false)}
                disabled={creating}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={createUser}
                disabled={creating}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Creating...
                  </div>
                ) : (
                  "Create User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
              <button
                onClick={() => setShowEditUserModal(false)}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={userForm.firstName}
                    onChange={(e) =>
                      setUserForm({ ...userForm, firstName: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={userForm.lastName}
                    onChange={(e) =>
                      setUserForm({ ...userForm, lastName: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  disabled
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={userForm.username}
                  onChange={(e) =>
                    setUserForm({ ...userForm, username: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                {selectedUser?.role === 'admin' ? (
                  <div>
                    <input
                      type="text"
                      value="Admin"
                      disabled
                      className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">Admin role cannot be changed</p>
                  </div>
                ) : (
                  <select
                    value={userForm.role}
                    onChange={(e) =>
                      setUserForm({ ...userForm, role: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                  </select>
                )}
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h4 className="font-medium text-blue-900">Current Status</h4>
                <div className="mt-2 space-y-2 text-sm text-blue-800">
                  <p>Status: {selectedUser.isActive ? "Active" : "Inactive"}</p>
                  <p>Created: {formatDate(new Date(selectedUser.createdAt))}</p>
                  {selectedUser.lastLoginDate && (
                    <p>Last login: {formatDate(new Date(selectedUser.lastLoginDate))}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 border-t p-6">
              <button
                onClick={() => setShowEditUserModal(false)}
                disabled={editing}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={updateUser}
                disabled={editing}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editing ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Updating...
                  </div>
                ) : (
                  "Update User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="animate-in fade-in zoom-in mx-4 transform rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">Success!</h3>
              <p className="text-gray-600">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}