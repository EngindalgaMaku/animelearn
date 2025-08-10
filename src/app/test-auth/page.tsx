"use client";

import { useSession, signOut } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function TestAuthPage() {
  const { data: session, status } = useSession();
  const { user, isAuthenticated, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">🔐 Authentication Test Page</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* NextAuth Session */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-blue-600">
            NextAuth Session
          </h2>
          <div className="space-y-2">
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`rounded px-2 py-1 text-sm ${
                  status === "loading"
                    ? "bg-yellow-100 text-yellow-800"
                    : status === "authenticated"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {status}
              </span>
            </p>

            {session?.user && (
              <div className="mt-4 space-y-2">
                <p>
                  <strong>ID:</strong> {session.user.id || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {session.user.email || "N/A"}
                </p>
                <p>
                  <strong>Username:</strong> {session.user.username || "N/A"}
                </p>
                <p>
                  <strong>Role:</strong>{" "}
                  <span
                    className={`rounded px-2 py-1 text-sm ${
                      session.user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {session.user.role || "N/A"}
                  </span>
                </p>
                <p>
                  <strong>Level:</strong> {session.user.level || "N/A"}
                </p>
                <p>
                  <strong>Diamonds:</strong>{" "}
                  {session.user.currentDiamonds || "N/A"}
                </p>
                <p>
                  <strong>Premium:</strong>{" "}
                  {session.user.isPremium ? "✅" : "❌"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AuthContext */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-green-600">
            AuthContext
          </h2>
          <div className="space-y-2">
            <p>
              <strong>Loading:</strong>{" "}
              <span
                className={`rounded px-2 py-1 text-sm ${
                  loading
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {loading ? "Yes" : "No"}
              </span>
            </p>

            <p>
              <strong>Authenticated:</strong>{" "}
              <span
                className={`rounded px-2 py-1 text-sm ${
                  isAuthenticated
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isAuthenticated ? "Yes" : "No"}
              </span>
            </p>

            {user && (
              <div className="mt-4 space-y-2">
                <p>
                  <strong>ID:</strong> {user.id || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {user.email || "N/A"}
                </p>
                <p>
                  <strong>Username:</strong> {user.username || "N/A"}
                </p>
                <p>
                  <strong>Role:</strong>{" "}
                  <span
                    className={`rounded px-2 py-1 text-sm ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role || "N/A"}
                  </span>
                </p>
                <p>
                  <strong>Level:</strong> {user.level || "N/A"}
                </p>
                <p>
                  <strong>Diamonds:</strong> {user.currentDiamonds || "N/A"}
                </p>
                <p>
                  <strong>Premium:</strong> {user.isPremium ? "✅" : "❌"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          🔄 Refresh Page
        </button>

        {session && (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
          >
            🚪 Sign Out
          </button>
        )}

        {!session && (
          <a
            href="/login"
            className="inline-block rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
          >
            🔑 Go to Login
          </a>
        )}

        {session?.user?.role === "admin" && (
          <a
            href="/admin"
            className="inline-block rounded-lg bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600"
          >
            👑 Admin Panel
          </a>
        )}
      </div>

      {/* Debug Info */}
      <div className="mt-8 rounded-lg bg-gray-100 p-6">
        <h3 className="mb-4 text-lg font-semibold">🐛 Debug Information</h3>
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 font-medium">NextAuth Session Object:</h4>
            <pre className="max-h-48 overflow-auto rounded bg-gray-800 p-4 text-sm text-green-400">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          <div>
            <h4 className="mb-2 font-medium">AuthContext User Object:</h4>
            <pre className="max-h-48 overflow-auto rounded bg-gray-800 p-4 text-sm text-green-400">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
