"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Upload,
  Eye,
  TrendingUp,
  Settings,
  Database,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { formatDiamonds } from "@/lib/utils";
import CardUpload from "@/components/upload/card-upload";

interface DashboardStats {
  totalCards: number;
  analyzedCards: number;
  totalValue: number;
  pendingAnalysis: number;
  averageValue: number;
  seriesCount: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.stats) {
          // API'den gelen stats objesi ile dashboard stats'ı oluştur
          const dashboardStats: DashboardStats = {
            totalCards: data.stats.totalCards || 0,
            analyzedCards: data.stats.analyzedCards || 0,
            totalValue: data.stats.totalValue || 0,
            averageValue: data.stats.averageValue || 0,
            seriesCount: data.stats.seriesCount || 0,
            pendingAnalysis:
              (data.stats.totalCards || 0) - (data.stats.analyzedCards || 0),
          };
          setStats(dashboardStats);
        }
      }
    } catch (error) {
      console.error("Stats fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAnalyze = async () => {
    try {
      const response = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulkAnalyze" }),
      });

      if (response.ok) {
        alert("Toplu analiz başlatıldı! Bu işlem birkaç dakika sürebilir.");
        fetchStats(); // Stats'ları yenile
      }
    } catch (error) {
      console.error("Bulk analyze failed:", error);
      alert("Toplu analiz başlatılırken bir hata oluştu.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Zumenzu platformunu yönetin, istatistikleri görün ve sistem ayarlarını
          kontrol edin
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Toplam Kart</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalCards}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Analiz Edilmiş
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.analyzedCards}/{stats.totalCards}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Toplam Değer
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatDiamonds(stats.totalValue || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Ortalama Değer
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatDiamonds(stats.averageValue || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center">
            <Upload className="mr-2 h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Yeni Kart Ekle
            </h3>
          </div>
          <p className="mb-4 text-gray-600">
            Koleksiyonunuza yeni anime kartları ekleyin
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Kart Yükle
          </button>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center">
            <Eye className="mr-2 h-6 w-6 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Kartları Yönet
            </h3>
          </div>
          <p className="mb-4 text-gray-600">
            Mevcut kartları görüntüleyin, düzenleyin ve silin
          </p>
          <Link
            href="/admin/cards"
            className="block w-full rounded-md bg-green-600 px-4 py-2 text-center text-white transition-colors hover:bg-green-700"
          >
            Kartları Görüntüle
          </Link>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center">
            <BarChart3 className="mr-2 h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900">Analitik</h3>
          </div>
          <p className="mb-4 text-gray-600">
            Detaylı istatistikler ve analiz raporları
          </p>
          <Link
            href="/admin/dashboard"
            className="block w-full rounded-md bg-purple-600 px-4 py-2 text-center text-white transition-colors hover:bg-purple-700"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Toplu İşlemler
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <button
            onClick={handleBulkAnalyze}
            disabled={!stats || stats.pendingAnalysis === 0}
            className="flex items-center justify-center space-x-2 rounded-md bg-yellow-600 px-6 py-3 text-white transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Zap className="h-5 w-5" />
            <span>
              Tüm Kartları Analiz Et ({stats?.pendingAnalysis || 0} beklemede)
            </span>
          </button>

          <button
            onClick={() => fetchStats()}
            className="flex items-center justify-center space-x-2 rounded-md bg-gray-600 px-6 py-3 text-white transition-colors hover:bg-gray-700"
          >
            <Settings className="h-5 w-5" />
            <span>İstatistikleri Yenile</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Son Aktiviteler
        </h3>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <div className="mr-3 h-2 w-2 rounded-full bg-green-400"></div>
            <span>Sistem başarıyla başlatıldı</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="mr-3 h-2 w-2 rounded-full bg-blue-400"></div>
            <span>Admin paneline giriş yapıldı</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="mr-3 h-2 w-2 rounded-full bg-purple-400"></div>
            <span>Koleksiyon istatistikleri güncellendi</span>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Yeni Kart Yükle
              </h2>
              <button
                onClick={() => setShowUpload(false)}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <CardUpload
                onUploadComplete={() => {
                  setShowUpload(false);
                  fetchStats();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
