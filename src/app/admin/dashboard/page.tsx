"use client";

import { useState, useEffect, useRef } from "react";
import { TrendingUp, Database, Zap, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatDiamonds } from "@/lib/utils";

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
  const [refreshing, setRefreshing] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchStats();
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const safePercent = (num: number, denom: number) =>
    denom > 0 ? Math.round((num / denom) * 100) : 0;

  const safeWidth = (num: number, denom: number) =>
    `${denom > 0 ? (num / denom) * 100 : 0}%`;

  const fetchStats = async () => {
    setMessage(null);
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const { signal } = controller;

    try {
      if (!loading) setRefreshing(true);
      // Try primary endpoint
      let response = await fetch("/api/dashboard", { signal });
      if (!response.ok) {
        // Fallback to an alternative endpoint used elsewhere in the app
        const fallback = await fetch("/api/dashboard/stats", { signal });
        if (fallback.ok) {
          response = fallback;
        } else {
          throw new Error(
            `Dashboard API unavailable: ${response.status} / ${fallback.status}`
          );
        }
      }
      const data = await response.json();
      setStats(data);
    } catch (error: any) {
      if (error?.name === "AbortError") return;
      console.error("Stats fetch failed:", error);
      setMessage({
        type: "error",
        text: "Veriler yüklenirken bir hata oluştu.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleBulkAnalyze = async () => {
    if (!stats || stats.pendingAnalysis === 0) return;
    setBulkLoading(true);
    setMessage(null);
    try {
      // Primary endpoint
      let response = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulkAnalyze" }),
      });

      if (!response.ok) {
        // Fallback to existing admin route
        const alt = await fetch("/api/admin/bulk-reanalyze", {
          method: "POST",
        });
        if (!alt.ok) {
          throw new Error(
            `Bulk analyze failed: ${response.status} / ${alt.status}`
          );
        }
      }

      setMessage({
        type: "success",
        text: "Toplu analiz başlatıldı. Bu işlem birkaç dakika sürebilir.",
      });
      fetchStats();
    } catch (error) {
      console.error("Bulk analyze failed:", error);
      setMessage({
        type: "error",
        text: "Toplu analiz başlatılırken bir hata oluştu.",
      });
    } finally {
      setBulkLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent sm:h-16 sm:w-16"></div>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            Kontrol paneli yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Analiz Kontrol Paneli
        </h1>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Koleksiyonunuzun detaylı istatistikleri ve analiz sonuçları
        </p>
      </div>

      {/* Inline feedback banner */}
      {message && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-6 rounded-lg border p-3 text-sm sm:p-4 sm:text-base ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : message.type === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-blue-200 bg-blue-50 text-blue-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          <div className="rounded-xl border-l-4 border-blue-500 bg-white p-5 shadow-lg sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 sm:text-sm">
                  Toplam Kart
                </p>
                <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {stats.totalCards}
                </p>
              </div>
              <Database className="h-10 w-10 text-blue-500 sm:h-12 sm:w-12" />
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-green-500 bg-white p-5 shadow-lg sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 sm:text-sm">
                  Analiz Edilmiş
                </p>
                <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {stats.analyzedCards}
                </p>
                <p className="text-xs text-gray-500 sm:text-sm">
                  %{safePercent(stats.analyzedCards, stats.totalCards)}{" "}
                  tamamlandı
                </p>
              </div>
              <Zap className="h-10 w-10 text-green-500 sm:h-12 sm:w-12" />
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-purple-500 bg-white p-5 shadow-lg sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 sm:text-sm">
                  Toplam Değer
                </p>
                <p className="text-2xl font-bold text-purple-600 sm:text-3xl">
                  {formatDiamonds(stats.totalValue)}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-500 sm:h-12 sm:w-12" />
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-yellow-500 bg-white p-5 shadow-lg sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 sm:text-sm">
                  Ortalama Değer
                </p>
                <p className="text-2xl font-bold text-purple-600 sm:text-3xl">
                  {formatDiamonds(stats.averageValue)}
                </p>
              </div>
              <Star className="h-10 w-10 text-yellow-500 sm:h-12 sm:w-12" />
            </div>
          </div>
        </div>
      )}

      {/* Progress Section */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:mb-8 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-lg sm:p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">
            Analiz İlerlemesi
          </h3>
          {stats && (
            <div>
              <div className="mb-2 flex justify-between text-xs text-gray-600 sm:text-sm">
                <span>Tamamlanan</span>
                <span>
                  {stats.analyzedCards}/{stats.totalCards}
                </span>
              </div>
              <div
                className="h-3 w-full rounded-full bg-gray-200"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={safePercent(
                  stats.analyzedCards,
                  stats.totalCards
                )}
                aria-label="Analiz ilerlemesi"
              >
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                  style={{
                    width: safeWidth(stats.analyzedCards, stats.totalCards),
                  }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                %{safePercent(stats.analyzedCards, stats.totalCards)} tamamlandı
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-5 shadow-lg sm:p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">
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
                <span className="font-medium text-yellow-700">
                  {stats.pendingAnalysis}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Analiz Oranı:</span>
                <span className="font-medium text-green-700">
                  %{safePercent(stats.analyzedCards, stats.totalCards)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6">
        <div className="rounded-xl bg-white p-5 shadow-lg sm:p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">
            Hızlı İşlemler
          </h3>
          <div className="space-y-3">
            <button
              onClick={handleBulkAnalyze}
              disabled={!stats || stats.pendingAnalysis === 0 || bulkLoading}
              aria-busy={bulkLoading}
              className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white transition-all hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bulkLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              ) : (
                <Zap className="h-5 w-5" />
              )}
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

        <div className="rounded-xl bg-white p-5 shadow-lg sm:p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">
            Sistem Durumu
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div
                className="h-3 w-3 rounded-full bg-green-500"
                aria-label="AI Analiz Sistemi: Aktif"
              ></div>
              <span className="text-sm text-gray-600">
                AI Analiz Sistemi: Aktif
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="h-3 w-3 rounded-full bg-green-500"
                aria-label="Veritabanı: Çevrimiçi"
              ></div>
              <span className="text-sm text-gray-600">
                Veritabanı: Çevrimiçi
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="h-3 w-3 rounded-full bg-green-500"
                aria-label="Dosya Sistemi: Normal"
              ></div>
              <span className="text-sm text-gray-600">
                Dosya Sistemi: Normal
              </span>
            </div>
            <button
              onClick={() => fetchStats()}
              disabled={refreshing}
              aria-busy={refreshing}
              className="flex w-full items-center justify-center rounded-lg bg-gray-600 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {refreshing ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              ) : null}
              <span className={refreshing ? "ml-2" : ""}>Verileri Yenile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Analytics */}
      <div className="rounded-xl bg-white p-5 shadow-lg sm:p-6">
        <h3 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">
          Son Analiz Sonuçları
        </h3>
        {stats?.recentAnalytics && stats.recentAnalytics.length > 0 ? (
          <>
            {/* Mobile list */}
            <div className="md:hidden">
              <ul className="space-y-3">
                {stats.recentAnalytics.map((item) => (
                  <li key={item.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {item.cardName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Analiz:</span>{" "}
                        <span className="text-gray-900">
                          {item.analysisType}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Güven:</span>{" "}
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          %{Math.round(item.confidence * 100)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500">Sonuç:</span>{" "}
                      <span className="break-words text-gray-900">
                        {item.result}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Kart
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Analiz Türü
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Sonuç
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Güven Skoru
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
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
            </div>
          </>
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
