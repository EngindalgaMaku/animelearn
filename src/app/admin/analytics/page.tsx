"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ArrowUpDown,
  Info,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

interface AnalyticsData {
  id: string;
  cardId: string;
  date: string;
  estimatedValue: number | null;
  marketValue: number | null;
  priceChange: number;
  views: number;
  searches: number;
  card: {
    id: string;
    name: string | null;
    series: string | null;
    character: string | null;
    rarity: string | null;
    category: string | null;
    diamondPrice: number | null;
    thumbnailUrl: string | null;
  };
}

interface AnalyticsResponse {
  analytics: AnalyticsData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalViews: number;
    totalSearches: number;
    averageEstimatedValue: number;
    averageMarketValue: number;
    averagePriceChange: number;
    totalRecords: number;
  };
  topViewedCards: Array<{
    cardId: string;
    _sum: {
      views: number;
      searches: number;
    };
    card: {
      id: string;
      name: string | null;
      series: string | null;
      character: string | null;
      rarity: string | null;
      thumbnailUrl: string | null;
    };
  }>;
  timeline: Array<{
    date: string;
    _sum: {
      views: number;
      searches: number;
    };
    _avg: {
      estimatedValue: number;
      marketValue: number;
    };
  }>;
  rarityDistribution: Record<string, number>;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [cardId, setCardId] = useState("");

  // Notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const showNotification = (
    type: "success" | "error" | "warning",
    message: string
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);
      if (cardId) params.append("cardId", cardId);

      const response = await fetch(`/api/admin/analytics?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      showNotification("error", "Analytics verileri yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [page, dateFrom, dateTo, cardId]);

  const handleRefresh = () => {
    fetchAnalytics();
  };

  const handleClearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setCardId("");
    setPage(1);
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return "N/A";
    return `${value.toFixed(2)} ₺`;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("tr-TR").format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRarityColor = (rarity: string | null) => {
    const colors: Record<string, string> = {
      common: "bg-gray-100 text-gray-800",
      rare: "bg-blue-100 text-blue-800",
      epic: "bg-purple-100 text-purple-800",
      legendary: "bg-yellow-100 text-yellow-800",
      mythic: "bg-red-100 text-red-800",
    };
    return colors[rarity?.toLowerCase() || ""] || "bg-gray-100 text-gray-800";
  };

  if (loading && !analyticsData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Analytics verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 Analytics</h1>
              <p className="mt-2 text-gray-600">
                Kart görüntülenme ve performans analitikleri
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Yenile
              </button>
              <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500">
                <Download className="mr-2 h-4 w-4" />
                Dışa Aktar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed right-4 top-4 z-50 rounded-lg p-4 shadow-lg ${
            notification.type === "success"
              ? "border border-green-200 bg-green-50"
              : notification.type === "error"
                ? "border border-red-200 bg-red-50"
                : "border border-yellow-200 bg-yellow-50"
          }`}
        >
          <div className="flex items-center space-x-3">
            {notification.type === "success" && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            {notification.type === "error" && (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            {notification.type === "warning" && (
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            )}
            <p
              className={`text-sm font-medium ${
                notification.type === "success"
                  ? "text-green-800"
                  : notification.type === "error"
                    ? "text-red-800"
                    : "text-yellow-800"
              }`}
            >
              {notification.message}
            </p>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Filters */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Filter className="h-5 w-5" />
              Filtreler
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Kart ID
                </label>
                <input
                  placeholder="Kart ID girin..."
                  value={cardId}
                  onChange={(e) => setCardId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleClearFilters}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  Filtreleri Temizle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {analyticsData && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Toplam Görüntülenme
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(analyticsData.summary.totalViews)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-100 p-2">
                  <Search className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Toplam Arama
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(analyticsData.summary.totalSearches)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="rounded-lg bg-purple-100 p-2">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Ortalama Pazar Değeri
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(analyticsData.summary.averageMarketValue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="rounded-lg bg-orange-100 p-2">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Toplam Kayıt
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(analyticsData.summary.totalRecords)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Viewed Cards */}
        {analyticsData && analyticsData.topViewedCards.length > 0 && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <TrendingUp className="h-5 w-5" />
                En Çok Görüntülenen Kartlar
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                {analyticsData.topViewedCards.slice(0, 5).map((item, index) => (
                  <div
                    key={item.cardId}
                    className="rounded-lg border p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                        #{index + 1}
                      </div>
                      {item.card?.thumbnailUrl && (
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                          <Image
                            src={item.card.thumbnailUrl}
                            alt={item.card.name || "Card"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <h4 className="mb-2 line-clamp-2 text-sm font-medium">
                      {item.card?.name || "İsimsiz Kart"}
                    </h4>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Görüntülenme:</span>
                        <span className="font-medium">
                          {formatNumber(item._sum.views)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Arama:</span>
                        <span className="font-medium">
                          {formatNumber(item._sum.searches)}
                        </span>
                      </div>
                      {item.card?.rarity && (
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRarityColor(item.card.rarity)}`}
                        >
                          {item.card.rarity}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rarity Distribution */}
        {analyticsData &&
          Object.keys(analyticsData.rarityDistribution).length > 0 && (
            <div className="mb-8 rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <BarChart3 className="h-5 w-5" />
                  Nadir Seviye Dağılımı (Görüntülenme)
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                  {Object.entries(analyticsData.rarityDistribution).map(
                    ([rarity, views]) => (
                      <div
                        key={rarity}
                        className="rounded-lg border p-4 text-center"
                      >
                        <span
                          className={`mb-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRarityColor(rarity)}`}
                        >
                          {rarity}
                        </span>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatNumber(views)}
                        </div>
                        <div className="text-sm text-gray-600">
                          görüntülenme
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

        {/* Analytics Data Table */}
        {analyticsData && (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <ArrowUpDown className="h-5 w-5" />
                Analytics Verileri
              </h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-left font-medium">Kart</th>
                      <th className="p-3 text-left font-medium">Tarih</th>
                      <th className="p-3 text-left font-medium">
                        Görüntülenme
                      </th>
                      <th className="p-3 text-left font-medium">Arama</th>
                      <th className="p-3 text-left font-medium">
                        Pazar Değeri
                      </th>
                      <th className="p-3 text-left font-medium">
                        Fiyat Değişimi
                      </th>
                      <th className="p-3 text-left font-medium">
                        Nadir Seviye
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.analytics.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            {item.card.thumbnailUrl && (
                              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                                <Image
                                  src={item.card.thumbnailUrl}
                                  alt={item.card.name || "Card"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="truncate font-medium">
                                {item.card.name || "İsimsiz Kart"}
                              </div>
                              <div className="truncate text-sm text-gray-600">
                                {item.card.series} - {item.card.character}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm">{formatDate(item.date)}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <span>{formatNumber(item.views)}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Search className="h-4 w-4 text-gray-400" />
                            <span>{formatNumber(item.searches)}</span>
                          </div>
                        </td>
                        <td className="p-3 text-sm">
                          {formatCurrency(item.marketValue)}
                        </td>
                        <td className="p-3">
                          <div
                            className={`flex items-center gap-1 ${
                              item.priceChange > 0
                                ? "text-green-600"
                                : item.priceChange < 0
                                  ? "text-red-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {item.priceChange > 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : item.priceChange < 0 ? (
                              <TrendingDown className="h-4 w-4" />
                            ) : null}
                            <span>
                              {item.priceChange > 0 ? "+" : ""}
                              {item.priceChange.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          {item.card.rarity && (
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRarityColor(item.card.rarity)}`}
                            >
                              {item.card.rarity}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Toplam {analyticsData.pagination.total} kayıttan{" "}
                  {(analyticsData.pagination.page - 1) *
                    analyticsData.pagination.limit +
                    1}
                  -
                  {Math.min(
                    analyticsData.pagination.page *
                      analyticsData.pagination.limit,
                    analyticsData.pagination.total
                  )}{" "}
                  arası gösteriliyor
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    Önceki
                  </button>
                  <span className="text-sm">
                    Sayfa {page} / {analyticsData.pagination.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage(
                        Math.min(analyticsData.pagination.totalPages, page + 1)
                      )
                    }
                    disabled={page === analyticsData.pagination.totalPages}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
