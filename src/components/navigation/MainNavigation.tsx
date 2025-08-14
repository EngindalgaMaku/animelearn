"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Book,
  BookOpen,
  ShoppingBag,
  Award,
  Target,
  User,
  CreditCard,
  LogIn,
  LogOut,
  Menu,
  X,
  Diamond,
  Star,
  Zap,
  Settings,
  Crown,
  Gamepad2,
  ChevronDown,
  Sparkles,
  Brain,
} from "lucide-react";

const navigation = [
  {
    name: "Home",
    href: "/",
    icon: Home,
    requireAuth: false,
    hideForAuth: true, // Hide when user is logged in - moved to More dropdown
  },
  {
    name: "Blog",
    href: "/blog",
    icon: Book,
    requireAuth: false,
    hideForAuth: false,
    moveToMore: true, // Move to More dropdown
    color: "text-blue-600",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Gamepad2,
    requireAuth: true,
    color: "text-indigo-600",
  },
  {
    name: "Learn",
    href: "/learn",
    icon: BookOpen,
    requireAuth: false,
    color: "text-emerald-600",
    description: "Step-by-step programming lessons",
  },
  {
    name: "Code Arena",
    href: "/code-arena",
    icon: Book,
    requireAuth: false,
    color: "text-blue-600",
  },
  {
    name: "Quiz Arena",
    href: "/quiz-arena",
    icon: Brain,
    requireAuth: false,
    moveToMore: true, // Move to More dropdown
    color: "text-purple-600",
  },
  {
    name: "Shop",
    href: "/shop",
    icon: Sparkles,
    requireAuth: false,
    color: "text-purple-600",
    special: true, // Special styling for attractive appearance
  },
  {
    name: "Diamond Store",
    href: "/store",
    icon: Diamond,
    requireAuth: false,
    hideForAuth: false,
    moveToMore: true, // Move to More dropdown
    color: "text-yellow-600",
    special: true, // Special styling for store
  },
  {
    name: "My Cards",
    href: "/my-cards",
    icon: CreditCard,
    requireAuth: true,
    hideForAuth: true, // Hide when user is logged in - moved to More dropdown
    color: "text-green-600",
  },
];

export default function MainNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user, logout, loading } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch by ensuring component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Admin kontrolü - role ve email üzerinden
  const isAdmin =
    user &&
    (user.role === "admin" ||
      user.role === "ADMIN" ||
      user.email === "admin@zumenzu.com");
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        moreDropdownRef.current &&
        !moreDropdownRef.current.contains(event.target as Node)
      ) {
        setMoreDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // No need for router.push("/") since logout() now handles redirect
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Don't show navigation on admin pages or login page
  if (pathname?.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  // Prevent hydration mismatch during SSR
  if (!mounted || loading) {
    return (
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                  Zumenzu
                </span>
                <div className="text-xs text-gray-500">Level Up Learning</div>
              </div>
            </Link>

            {/* Static navigation for SSR - show default items */}
            <div className="hidden items-center space-x-1 md:flex">
              <div className="flex items-center space-x-1">
                <Link
                  href="/"
                  className="relative flex items-center space-x-2 rounded-lg px-3 py-2 font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Home className="h-4 w-4" />
                  <span className="hidden text-sm lg:block">Home</span>
                </Link>
                <Link
                  href="/blog"
                  className="relative flex items-center space-x-2 rounded-lg px-3 py-2 font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Book className="h-4 w-4 text-blue-600" />
                  <span className="hidden text-sm lg:block">Blog</span>
                </Link>
                <Link
                  href="/shop"
                  className="relative flex items-center space-x-2 rounded-lg px-3 py-2 font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span className="hidden text-sm lg:block">Shop</span>
                </Link>
              </div>
            </div>

            {/* Loading skeleton */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <Gamepad2 className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                Zumenzu
              </span>
              <div className="text-xs text-gray-500">Level Up Learning</div>
            </div>
          </Link>

          {/* Desktop & Tablet Navigation */}
          <div className="hidden items-center space-x-1 md:flex">
            {/* Primary Navigation - Always visible on tablet+ */}
            <div className="flex items-center space-x-1">
              {navigation
                .filter((item) => {
                  if (item.requireAuth && !isAuthenticated) return false;
                  if (item.hideForAuth && isAuthenticated) return false;
                  // Show primary items on tablet: Dashboard, Learn, Code Arena, Shop for authenticated users
                  // Show Home, Learn, Code Arena, Shop for non-authenticated users (Blog moved to More)
                  if (item.moveToMore) return false; // Exclude items marked for More dropdown
                  if (isAuthenticated) {
                    return [
                      "Dashboard",
                      "Learn",
                      "Code Arena",
                      "Shop",
                    ].includes(item.name);
                  } else {
                    return ["Home", "Learn", "Code Arena", "Shop"].includes(
                      item.name
                    );
                  }
                })
                .map((item) => {
                  const isActive = pathname === item.href;
                  const IconComponent = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative flex items-center space-x-2 rounded-lg px-3 py-2 font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <IconComponent
                        className={`h-4 w-4 ${
                          isActive ? "text-white" : item.color || "text-current"
                        }`}
                      />
                      <span className="hidden text-sm lg:block">
                        {item.name}
                      </span>
                      <span className="block text-xs lg:hidden">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
            </div>

            {/* Secondary Navigation - Dropdown for smaller screens */}
            <div className="relative">
              {/* Large screens - show remaining items but exclude hidden ones for authenticated users */}
              {!isAuthenticated && (
                <div className="hidden lg:flex lg:items-center lg:space-x-1">
                  {/* Show remaining items normally on large screens for non-authenticated users only */}
                  {navigation
                    .filter((item) => {
                      if (item.requireAuth && !isAuthenticated) return false;
                      if (item.hideForAuth && isAuthenticated) return false;
                      // For non-authenticated users
                      const isPrimaryNav = [
                        "Home",
                        "Learn",
                        "Code Arena",
                        "Shop",
                      ].includes(item.name);
                      return !isPrimaryNav && !item.moveToMore;
                    })
                    .map((item) => {
                      const isActive = pathname === item.href;
                      const IconComponent = item.icon;

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`relative flex items-center space-x-2 rounded-lg px-3 py-2 font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-blue-600 text-white shadow-md"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <IconComponent
                            className={`h-4 w-4 ${
                              isActive
                                ? "text-white"
                                : item.color || "text-current"
                            }`}
                          />
                          <span className="text-sm">{item.name}</span>
                        </Link>
                      );
                    })}
                </div>
              )}

              {/* More dropdown - simplified logic */}
              <div className="relative" ref={moreDropdownRef}>
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className="flex items-center space-x-1 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Menu className="h-4 w-4" />
                  <span className="text-sm">More</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    {navigation
                      .filter((item) => {
                        // Always include items marked for More dropdown
                        if (item.moveToMore) return true;
                        // Include items hidden for authenticated users (except Home) - only for authenticated users
                        if (
                          isAuthenticated &&
                          item.hideForAuth === true &&
                          item.name !== "Home"
                        )
                          return true;
                        return false;
                      })
                      .map((item) => {
                        const isActive = pathname === item.href;
                        const IconComponent = item.icon;

                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMoreDropdownOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                              isActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <IconComponent
                              className={`h-4 w-4 ${
                                isActive
                                  ? "text-blue-600"
                                  : item.color || "text-current"
                              }`}
                            />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-3">
            {loading ? (
              // Loading sırasında spinner göster
              <div className="flex h-8 w-20 items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
              </div>
            ) : isAuthenticated && user ? (
              <>
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-2 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="h-7 w-7 rounded-full"
                        />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="hidden text-left sm:block">
                      <div className="text-sm font-medium leading-tight text-gray-900">
                        {user.username}
                      </div>
                    </div>
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                      {/* User Info Header */}
                      <div className="border-b border-gray-100 px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.username}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <User className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                            <div className="truncate text-xs text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>

                        {/* Stats in Dropdown for Mobile/Small screens */}
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <Diamond className="h-3 w-3 text-yellow-600" />
                            <span className="font-medium text-yellow-700">
                              {user.currentDiamonds}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-blue-600" />
                            <span className="font-medium text-blue-700">
                              Level {user.level}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap className="h-3 w-3 text-purple-600" />
                            <span className="font-medium text-purple-700">
                              {user.experience} XP
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <Settings className="h-4 w-4 text-gray-400" />
                          <span>Profile Settings</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                          >
                            <Crown className="h-4 w-4" />
                            <span>Admin Panel</span>
                          </Link>
                        )}

                        <div className="my-1 border-t border-gray-100"></div>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex w-full items-center space-x-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white shadow-sm transition-all hover:from-blue-700 hover:to-purple-700"
              >
                <LogIn className="h-4 w-4" />
                <span className="text-sm font-medium">Sign In</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 border-t border-gray-200 bg-white px-2 pb-3 pt-2">
              {/* User Stats - Mobile */}
              {isAuthenticated && user && (
                <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-3 flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-gray-900">
                        {user.username}
                      </div>
                      <div className="truncate text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Compact stats display for mobile */}
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <Diamond className="h-3 w-3 text-yellow-600" />
                      <span className="font-medium text-yellow-700">
                        {user.currentDiamonds}
                      </span>
                    </div>
                    <div className="h-3 w-px bg-gray-300"></div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-blue-600" />
                      <span className="font-medium text-blue-700">
                        Level {user.level}
                      </span>
                    </div>
                    <div className="h-3 w-px bg-gray-300"></div>
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3 text-purple-600" />
                      <span className="font-medium text-purple-700">
                        {user.experience} XP
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links - Mobile */}
              {/* Primary navigation items */}
              {navigation
                .filter((item) => {
                  if (item.requireAuth && !isAuthenticated) return false;
                  if (item.hideForAuth && isAuthenticated) return false;

                  // Show main navigation items (excluding moveToMore items in mobile)
                  if (item.moveToMore) return false; // Exclude moveToMore items from primary mobile nav
                  if (isAuthenticated) {
                    return [
                      "Dashboard",
                      "Learn",
                      "Code Arena",
                      "Shop",
                    ].includes(item.name);
                  } else {
                    return ["Home", "Learn", "Code Arena", "Shop"].includes(
                      item.name
                    );
                  }
                })
                .map((item) => {
                  const isActive = pathname === item.href;
                  const IconComponent = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 rounded-lg px-3 py-3 font-medium transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <IconComponent
                        className={`h-5 w-5 ${
                          isActive ? "text-white" : item.color || "text-current"
                        }`}
                      />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

              {/* More items - shown in mobile as regular links */}
              {navigation
                .filter((item) => {
                  // Include moveToMore items for all users
                  if (item.moveToMore) return true;
                  // Include hideForAuth items for authenticated users only (except Home)
                  if (
                    isAuthenticated &&
                    item.hideForAuth === true &&
                    item.name !== "Home"
                  )
                    return true;
                  return false;
                })
                .map((item) => {
                  const isActive = pathname === item.href;
                  const IconComponent = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 rounded-lg px-3 py-3 font-medium transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <IconComponent
                        className={`h-5 w-5 ${
                          isActive ? "text-white" : item.color || "text-current"
                        }`}
                      />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

              {/* Remaining items for non-authenticated users (if any) */}
              {!isAuthenticated &&
                navigation
                  .filter((item) => {
                    if (item.requireAuth && !isAuthenticated) return false;
                    if (item.hideForAuth) return false;
                    if (item.moveToMore) return false; // Already handled above
                    return !["Home", "Learn", "Code Arena", "Shop"].includes(
                      item.name
                    );
                  })
                  .map((item) => {
                    const isActive = pathname === item.href;
                    const IconComponent = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 rounded-lg px-3 py-3 font-medium transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <IconComponent
                          className={`h-5 w-5 ${
                            isActive
                              ? "text-white"
                              : item.color || "text-current"
                          }`}
                        />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}

              {/* Mobile Auth Actions */}
              {loading ? (
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-center py-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  </div>
                </div>
              ) : isAuthenticated ? (
                <div className="space-y-1 border-t border-gray-200 pt-3">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 rounded-lg px-3 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Profile Settings</span>
                  </Link>

                  {/* Admin Panel Link - Mobile */}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 rounded-lg px-3 py-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Crown className="h-5 w-5" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center space-x-3 rounded-lg px-3 py-3 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-medium text-white"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
