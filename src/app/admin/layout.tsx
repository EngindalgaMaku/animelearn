"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {
  User,
  LogOut,
  Settings,
  Crown,
  Menu,
  X,
  Diamond,
  Star,
  Users,
  BarChart3,
  Package,
  Gamepad2,
  Home,
  ChevronLeft,
  Shield,
  Tag,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Zap,
  DollarSign,
  Palette,
  Search,
  BookOpen,
  GraduationCap,
  FileText,
  Edit3,
  Globe,
  Code,
  Brain,
  Calendar,
} from "lucide-react";

const adminNavigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BarChart3,
    color: "text-red-600",
  },
  {
    name: "Card Management",
    icon: Package,
    color: "text-purple-600",
    submenu: [
      {
        name: "Shop Cards",
        href: "/admin/cards",
        icon: CreditCard,
        description: "Manage shop cards for purchase",
      },
      {
        name: "Categories",
        href: "/admin/categories",
        icon: Tag,
        description: "Manage card categories",
      },
      {
        name: "Rarities",
        href: "/admin/rarities",
        icon: Star,
        description: "Configure rarity levels & styles",
      },
      {
        name: "Elements",
        href: "/admin/elements",
        icon: Zap,
        description: "Manage card elements & effects",
      },
      {
        name: "Card Styles",
        href: "/admin/card-styles",
        icon: Palette,
        description: "Customize card appearances",
      },
      {
        name: "Card Analysis",
        href: "/admin/analysis",
        icon: Search,
        description: "Configure AI analysis & pricing",
      },
      {
        name: "Diamond Packages",
        href: "/admin/diamond-packages",
        icon: Diamond,
        description: "Manage store diamond packages",
      },
    ],
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: Users,
    color: "text-blue-600",
  },
  {
    name: "Blog Management",
    icon: FileText,
    color: "text-indigo-600",
    submenu: [
      {
        name: "Manage Posts",
        href: "/admin/blog",
        icon: Edit3,
        description: "Create, edit, and publish blog posts",
      },
      {
        name: "Blog Settings",
        href: "/admin/blog/settings",
        icon: Globe,
        description: "Manage categories and blog settings",
      },
    ],
  },
  {
    name: "Python Tips",
    icon: Code,
    color: "text-yellow-600",
    submenu: [
      {
        name: "Manage Tips",
        href: "/admin/python-tips",
        icon: Brain,
        description: "Create, edit, and manage Python tips",
      },
      {
        name: "Categories",
        href: "/admin/python-tips/categories",
        icon: Tag,
        description: "Manage tip categories",
      },
      {
        name: "Daily Tips",
        href: "/admin/python-tips/daily",
        icon: Calendar,
        description: "Schedule and manage daily tips",
      },
    ],
  },
  {
    name: "Learning System",
    icon: GraduationCap,
    color: "text-green-600",
    submenu: [
      {
        name: "Learning Activities",
        href: "/admin/learning-activities",
        icon: Gamepad2,
        description: "Create interactive games & activities",
      },
    ],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    color: "text-gray-600",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  // Auto-expand menu if current page is in submenu
  useEffect(() => {
    adminNavigation.forEach((item) => {
      if (item.submenu) {
        const hasActiveSubmenu = item.submenu.some((sub) =>
          pathname.startsWith(sub.href)
        );
        if (hasActiveSubmenu) {
          setExpandedMenus((prev) => new Set([...prev, item.name]));
        }
      }
    });
  }, [pathname]);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(menuName)) {
        newSet.delete(menuName);
      } else {
        newSet.add(menuName);
      }
      return newSet;
    });
  };

  // Handle responsive sidebar - close on mobile, open on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state based on screen size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (isAuthenticated && user && user.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, loading, router, user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Show loading spinner during loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated after loading
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Wait if user info hasn't loaded yet
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  // Redirect to homepage if not admin
  if (user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">
            Insufficient permissions, redirecting to homepage...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-xl transition-all duration-300 ease-in-out md:static ${
          sidebarOpen
            ? "w-64 translate-x-0 md:w-64"
            : "w-64 -translate-x-full md:w-0 md:translate-x-0"
        } admin-sidebar overflow-hidden`}
        style={{
          zIndex: 99999,
          pointerEvents: "auto",
        }}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-orange-600">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-lg font-bold text-transparent">
                Zumenzu
              </span>
              <div className="text-xs text-gray-500">Admin Panel</div>
            </div>
          </Link>
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <User className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 font-medium text-gray-900">
                <span className="truncate">{user.username}</span>
                <Shield className="h-4 w-4 text-red-600" />
              </div>
              <div className="truncate text-sm text-gray-500">{user.email}</div>
              <div className="mt-2 flex items-center space-x-3">
                <div className="flex items-center space-x-1 text-xs">
                  <Diamond className="h-3 w-3 text-yellow-500" />
                  <span className="text-gray-600">{user.currentDiamonds}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <Star className="h-3 w-3 text-blue-500" />
                  <span className="text-gray-600">Lv.{user.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="admin-nav relative flex-1 space-y-2 p-4"
          style={{
            zIndex: 100000,
            pointerEvents: "auto",
          }}
        >
          {adminNavigation.map((item) => {
            const IconComponent = item.icon;
            const isExpanded = expandedMenus.has(item.name);

            // If item has submenu
            if (item.submenu) {
              const hasActiveSubmenu = item.submenu.some((sub) =>
                pathname.startsWith(sub.href)
              );

              return (
                <div key={item.name} className="space-y-1">
                  {/* Parent Menu Item */}
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 font-medium transition-colors ${
                      hasActiveSubmenu
                        ? "bg-gradient-to-r from-red-100 to-orange-100 text-red-700 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent
                        className={`h-5 w-5 ${item.color || "text-current"}`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  {/* Submenu Items */}
                  {isExpanded && (
                    <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                      {item.submenu.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        const SubIconComponent = subItem.icon;

                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => {
                              if (window.innerWidth < 768) {
                                setSidebarOpen(false);
                              }
                            }}
                            className={`flex items-start space-x-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                              isSubActive
                                ? "bg-red-50 font-medium text-red-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <SubIconComponent className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="font-medium">{subItem.name}</div>
                              <div className="mt-0.5 text-xs text-gray-500">
                                {subItem.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular menu item without submenu
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex items-center space-x-3 rounded-lg px-4 py-3 font-medium transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-red-100 to-orange-100 text-red-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <IconComponent
                  className={`h-5 w-5 ${item.color || "text-current"}`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Separator */}
          <div className="my-6 border-t border-gray-200"></div>

          {/* User Panel */}
          <Link
            href="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center space-x-3 rounded-lg border border-blue-200 px-4 py-3 font-medium text-blue-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            <Gamepad2 className="h-5 w-5" />
            <span>User Panel</span>
            <ChevronLeft className="ml-auto h-4 w-4" />
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="space-y-2 border-t border-gray-200 p-4">
          <Link
            href="/profile"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <Settings className="h-5 w-5" />
            <span>Profile Settings</span>
          </Link>
          <button
            onClick={() => {
              setSidebarOpen(false);
              handleLogout();
            }}
            className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`min-h-screen bg-gray-50 transition-all duration-300 ${
          sidebarOpen ? "flex-1 md:max-w-[calc(100vw-256px)]" : "flex-1"
        }`}
      >
        {/* Top Bar with Toggle */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              title={sidebarOpen ? "Menüyü Kapat" : "Menüyü Aç"}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                title="Ana Sayfaya Git"
              >
                <Home className="h-4 w-4" />
                <span className="hidden text-sm sm:inline">Homepage</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
