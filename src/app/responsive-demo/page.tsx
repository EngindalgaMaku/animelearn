"use client";

import React from "react";
import {
  Container,
  Grid,
  Flex,
  Stack,
  Show,
  Hide,
  Spacer,
  Padding,
  useBreakpoint,
  useDeviceCapabilities,
  useWindowSize,
  useOrientation,
  useResponsiveValue,
  responsive,
} from "@/lib/responsive";

export default function ResponsiveDemo() {
  const breakpointInfo = useBreakpoint();
  const deviceCapabilities = useDeviceCapabilities();
  const windowSize = useWindowSize();
  const orientation = useOrientation();

  // Responsive values examples
  const responsiveText = useResponsiveValue({
    xs: "Mobil Görünüm",
    sm: "Küçük Ekran",
    md: "Tablet Görünüm",
    lg: "Masaüstü",
    xl: "Büyük Ekran",
    "2xl": "Ultra Geniş",
  });

  const responsivePadding = useResponsiveValue({
    xs: "1rem",
    md: "2rem",
    lg: "3rem",
  });

  const responsiveColumns = useResponsiveValue({
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Container size="2xl">
        <Padding p={{ xs: "1rem", md: "2rem", lg: "3rem" }}>
          {/* Header */}
          <Stack spacing={{ xs: "1rem", md: "2rem" }}>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                📱 Responsive System Demo
              </h1>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                Mobile-first responsive design sistemi test alanı
              </p>
            </div>

            {/* Current Breakpoint Info */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
                🎯 Aktif Breakpoint Bilgileri
              </h2>
              <Grid
                cols={{ xs: 1, md: 2, lg: 3 }}
                gap={{ xs: "1rem", md: "1.5rem" }}
              >
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Breakpoint
                  </h3>
                  <div className="text-2xl font-bold text-blue-600">
                    {breakpointInfo.current.toUpperCase()}
                  </div>
                  <div className="text-sm text-blue-700 mt-1">
                    {responsiveText}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">
                    Ekran Boyutu
                  </h3>
                  <div className="text-lg font-bold text-green-600">
                    {windowSize.width} × {windowSize.height}
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    {orientation}
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">
                    Cihaz Özellikleri
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div
                      className={`${
                        deviceCapabilities.hasTouch
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      📱 Touch: {deviceCapabilities.hasTouch ? "Var" : "Yok"}
                    </div>
                    <div
                      className={`${
                        deviceCapabilities.hasHover
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      🖱️ Hover: {deviceCapabilities.hasHover ? "Var" : "Yok"}
                    </div>
                    <div
                      className={`${
                        deviceCapabilities.isRetina
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      ✨ Retina: {deviceCapabilities.isRetina ? "Var" : "Yok"}
                    </div>
                  </div>
                </div>
              </Grid>
            </div>

            {/* Breakpoint Indicators */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
                🎨 Breakpoint Göstergeleri
              </h2>
              <Flex
                direction={{ xs: "col", md: "row" }}
                gap={{ xs: "0.5rem", md: "1rem" }}
                wrap
              >
                <Show only="xs">
                  <div className="bg-red-100 text-red-800 px-3 py-2 rounded-lg font-medium">
                    📱 XS Aktif (320px+)
                  </div>
                </Show>
                <Show only="sm">
                  <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg font-medium">
                    📱 SM Aktif (640px+)
                  </div>
                </Show>
                <Show only="md">
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg font-medium">
                    📱 MD Aktif (768px+)
                  </div>
                </Show>
                <Show only="lg">
                  <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg font-medium">
                    💻 LG Aktif (1024px+)
                  </div>
                </Show>
                <Show only="xl">
                  <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium">
                    💻 XL Aktif (1280px+)
                  </div>
                </Show>
                <Show only="2xl">
                  <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg font-medium">
                    🖥️ 2XL Aktif (1536px+)
                  </div>
                </Show>
              </Flex>
            </div>

            {/* Responsive Grid Demo */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
                🎲 Responsive Grid Sistemi
              </h2>
              <div className="space-y-6">
                {/* Auto Grid */}
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-700">
                    Otomatik Grid (1→2→3→4 sütun)
                  </h3>
                  <Grid
                    cols={{ xs: 1, sm: 2, md: 3, lg: 4 }}
                    gap={{ xs: "1rem", md: "1.5rem" }}
                  >
                    {Array.from({ length: 8 }, (_, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg p-4 text-white text-center font-semibold"
                      >
                        Kart {i + 1}
                      </div>
                    ))}
                  </Grid>
                </div>

                {/* Custom Grid */}
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-700">
                    Özel Grid Düzeni
                  </h3>
                  <Grid
                    cols={{ xs: 2, md: 3, lg: 5 }}
                    gap={{ xs: "0.5rem", md: "1rem" }}
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-green-400 to-blue-500 rounded-lg p-3 text-white text-center text-sm font-medium"
                      >
                        #{i + 1}
                      </div>
                    ))}
                  </Grid>
                </div>
              </div>
            </div>

            {/* Responsive Typography */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
                ✍️ Responsive Typography
              </h2>
              <Stack spacing={{ xs: "1rem", md: "1.5rem" }}>
                <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600">
                  Bu metin her breakpoint'te farklı boyutta görünür
                </div>
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Responsive Başlık
                </div>
                <div className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bu
                  paragraf da responsive şekilde boyutlanır ve mobile'da daha
                  küçük, desktop'ta daha büyük görünür.
                </div>
              </Stack>
            </div>

            {/* Show/Hide Demo */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
                👁️ Show/Hide Components
              </h2>
              <Stack spacing={{ xs: "1rem", md: "1.5rem" }}>
                <Show below="md">
                  <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-red-800">
                    📱 Bu mesaj sadece mobil ve tablet'te görünür (MD altında)
                  </div>
                </Show>

                <Show above="md">
                  <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-green-800">
                    💻 Bu mesaj sadece masaüstünde görünür (MD üstünde)
                  </div>
                </Show>

                <Show only="md">
                  <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 text-yellow-800">
                    📱 Bu mesaj sadece tablet boyutunda görünür (sadece MD)
                  </div>
                </Show>

                <Flex
                  direction={{ xs: "col", lg: "row" }}
                  gap={{ xs: "1rem", lg: "2rem" }}
                >
                  <div className="flex-1 bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Mobilde Dikey
                    </h3>
                    <p className="text-blue-700 text-sm">
                      Bu layout mobilde dikey, masaüstünde yataydır
                    </p>
                  </div>
                  <div className="flex-1 bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-800 mb-2">
                      Desktop'ta Yatay
                    </h3>
                    <p className="text-purple-700 text-sm">
                      Responsive Flex düzeni örneği
                    </p>
                  </div>
                </Flex>
              </Stack>
            </div>

            {/* Responsive Spacing */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
                📏 Responsive Spacing
              </h2>
              <div className="space-y-4">
                <Padding p={{ xs: "0.5rem", md: "1rem", lg: "2rem" }}>
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border-2 border-dashed border-blue-300">
                    <div className="p-4 text-center text-blue-800 font-medium">
                      Bu container'ın padding'i responsive (0.5rem → 1rem →
                      2rem)
                    </div>
                  </div>
                </Padding>

                <div className="flex flex-col items-center">
                  <div className="bg-green-200 p-2 rounded">Üst Element</div>
                  <Spacer size={{ xs: "1rem", md: "2rem", lg: "3rem" }} />
                  <div className="bg-green-200 p-2 rounded">Alt Element</div>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Aralarındaki boşluk responsive (1rem → 2rem → 3rem)
                  </p>
                </div>
              </div>
            </div>

            {/* Device Type Indicators */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
                📱 Cihaz Tipi Göstergeleri
              </h2>
              <Flex
                direction={{ xs: "col", md: "row" }}
                gap={{ xs: "1rem", md: "2rem" }}
              >
                <div
                  className={`p-4 rounded-lg border-2 ${
                    breakpointInfo.isMobile
                      ? "bg-blue-100 border-blue-300 text-blue-800"
                      : "bg-gray-100 border-gray-300 text-gray-600"
                  }`}
                >
                  <div className="text-2xl mb-2">📱</div>
                  <div className="font-semibold">Mobil</div>
                  <div className="text-sm">
                    {breakpointInfo.isMobile ? "Aktif" : "Pasif"}
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg border-2 ${
                    breakpointInfo.isTablet
                      ? "bg-green-100 border-green-300 text-green-800"
                      : "bg-gray-100 border-gray-300 text-gray-600"
                  }`}
                >
                  <div className="text-2xl mb-2">📱</div>
                  <div className="font-semibold">Tablet</div>
                  <div className="text-sm">
                    {breakpointInfo.isTablet ? "Aktif" : "Pasif"}
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg border-2 ${
                    breakpointInfo.isDesktop
                      ? "bg-purple-100 border-purple-300 text-purple-800"
                      : "bg-gray-100 border-gray-300 text-gray-600"
                  }`}
                >
                  <div className="text-2xl mb-2">💻</div>
                  <div className="font-semibold">Desktop</div>
                  <div className="text-sm">
                    {breakpointInfo.isDesktop ? "Aktif" : "Pasif"}
                  </div>
                </div>
              </Flex>
            </div>

            {/* Technical Info */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 md:p-6 text-white">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">
                🔧 Teknik Bilgiler
              </h2>
              <Grid cols={{ xs: 1, md: 2 }} gap={{ xs: "1rem", md: "2rem" }}>
                <div>
                  <h3 className="font-semibold mb-3 text-gray-300">
                    Breakpoint Durumları
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>isXs: {breakpointInfo.isXs ? "✅" : "❌"}</div>
                    <div>isSm: {breakpointInfo.isSm ? "✅" : "❌"}</div>
                    <div>isMd: {breakpointInfo.isMd ? "✅" : "❌"}</div>
                    <div>isLg: {breakpointInfo.isLg ? "✅" : "❌"}</div>
                    <div>isXl: {breakpointInfo.isXl ? "✅" : "❌"}</div>
                    <div>is2Xl: {breakpointInfo.is2Xl ? "✅" : "❌"}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-gray-300">
                    Responsive Değerler
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>Current Columns: {responsiveColumns}</div>
                    <div>Current Padding: {responsivePadding}</div>
                    <div>
                      Prefers Dark:{" "}
                      {deviceCapabilities.prefersDarkMode ? "✅" : "❌"}
                    </div>
                    <div>
                      Reduced Motion:{" "}
                      {deviceCapabilities.prefersReducedMotion ? "✅" : "❌"}
                    </div>
                  </div>
                </div>
              </Grid>
            </div>
          </Stack>
        </Padding>
      </Container>
    </div>
  );
}
