"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Database,
  Zap,
  Star,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDiamonds } from "@/lib/utils";

interface DashboardStats {
  totalCards: number;
  analyzedCards: number;
  totalValue: number;
  pendingAnalysis: number;
  averageValue: number;
  series: number;
  recentAnalytics: Array<{
    id: string;
    cardName: string;
    analysisType: string;
    result: string;
    confidence: number;
    timestamp: string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
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
        fetchStats();
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
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Koleksiyonunuzun detaylı istatistikleri ve analiz sonuçları
        </p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border-l-4 border-blue-500 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kart</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalCards}
                </p>
              </div>
              <Database className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-green-500 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Analiz Edilmiş
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.analyzedCards}
                </p>
                <p className="text-sm text-gray-500">
                  %{Math.round((stats.analyzedCards / stats.totalCards) * 100)}{" "}
                  tamamlandı
                </p>
              </div>
              <Zap className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-purple-500 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Toplam Değer
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatDiamonds(stats.totalValue)}
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-500" />
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-yellow-500 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Ortalama Değer
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatDiamonds(stats.averageValue)}
                </p>
              </div>
              <Star className="h-12 w-12 text-yellow-500" />
            </div>
          </div>
        </div>
      )}

      {/* Progress Section */}
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Analiz İlerlemesi
          </h3>
          {stats && (
            <div>
              <div className="mb-2 flex justify-between text-sm text-gray-600">
                <span>Tamamlanan</span>
                <span>
                  {stats.analyzedCards}/{stats.totalCards}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                  style={{
                    width: `${(stats.analyzedCards / stats.totalCards) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                %{Math.round((stats.analyzedCards / stats.totalCards) * 100)}{" "}
                tamamlandı
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Koleksiyon Özeti
          </h3>
          {stats && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Farklı Seri Sayısı:</span>
                <span className="font-medium">{stats.series}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bekleyen Analiz:</span>
                <span className="font-medium text-yellow-600">
                  {stats.pendingAnalysis}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Analiz Oranı:</span>
                <span className="font-medium text-green-600">
                  %{Math.round((stats.analyzedCards / stats.totalCards) * 100)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={handleBulkAnalyze}
              disabled={!stats || stats.pendingAnalysis === 0}
              className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white transition-all hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Zap className="h-5 w-5" />
              <span>
                Toplu Analiz Başlat ({stats?.pendingAnalysis || 0} kart)
              </span>
            </button>

            <Link
              href="/admin/cards"
              className="flex w-full items-center justify-center space-x-2 rounded-lg bg-green-600 px-4 py-3 text-white transition-colors hover:bg-green-700"
            >
              <Database className="h-5 w-5" />
              <span>Kartları Yönet</span>
            </Link>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Sistem Durumu
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <span className="text-sm text-gray-600">
                AI Analiz Sistemi: Aktif
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <span className="text-sm text-gray-600">
                Veritabanı: Çevrimiçi
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <span className="text-sm text-gray-600">
                Dosya Sistemi: Normal
              </span>
            </div>
            <button
              onClick={() => fetchStats()}
              className="w-full rounded-lg bg-gray-600 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-700"
            >
              Verileri Yenile
            </button>
          </div>
        </div>
      </div>

      {/* Recent Analytics */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Son Analiz Sonuçları
        </h3>
        {stats?.recentAnalytics && stats.recentAnalytics.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Kart
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Analiz Türü
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Sonuç
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Güven Skoru
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {stats.recentAnalytics.map((item) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {item.cardName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {item.analysisType}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {item.result}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        %{Math.round(item.confidence * 100)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center">
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">Henüz analiz sonucu bulunmuyor</p>
            <p className="mt-1 text-sm text-gray-400">
              Kartları analiz ettikten sonra sonuçlar burada görüntülenecek
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
