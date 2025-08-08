import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center animate-in fade-in duration-700">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            404
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
          
          <Link
            href="/shop"
            className="flex items-center space-x-2 bg-white text-gray-700 font-bold py-4 px-8 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Search className="h-5 w-5" />
            <span>Browse Cards</span>
          </Link>
          
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-gray-600 font-medium py-4 px-6 rounded-xl hover:text-gray-800 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <Link
              href="/dashboard"
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/learn"
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              Learn Python
            </Link>
            <Link
              href="/badges"
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              Badges
            </Link>
            <Link
              href="/my-cards"
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              My Cards
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}