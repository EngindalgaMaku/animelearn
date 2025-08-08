"use client";

import React, { useState } from "react";
import {
  SkipLinks,
  ScreenReaderOnly,
  LiveRegion,
  AccessibleButton,
  AccessibleField,
  HighContrastToggle,
  TextSizeControls,
  KeyboardShortcutsHelp,
  AccessibleModal,
  AccessibleProgress,
  useKeyboardNavigation,
  useScreenReader,
  useColorPreferences,
  useFormAccessibility,
  accessibility,
} from "@/lib/accessibility";
import { Container } from "@/lib/responsive";
import { FadeIn, ScaleIn } from "@/lib/animations";

export default function AccessibilityDemo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [progress, setProgress] = useState(0);
  const [demoFormData, setDemoFormData] = useState({
    email: "",
    password: "",
    message: "",
  });

  const isKeyboardUser = useKeyboardNavigation();
  const { announce, announcements } = useScreenReader();
  const colorPreferences = useColorPreferences();
  const formAccessibility = useFormAccessibility();

  const handleAnnouncement = (
    message: string,
    priority: "polite" | "assertive" = "polite"
  ) => {
    setAnnouncement(message);
    announce(message, priority);
    setTimeout(() => setAnnouncement(""), 3000);
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleAnnouncement("İşlem tamamlandı!", "polite");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const validateForm = () => {
    let hasErrors = false;

    if (!demoFormData.email) {
      formAccessibility.addError("email", "E-posta adresi gereklidir");
      hasErrors = true;
    } else {
      formAccessibility.removeError("email");
    }

    if (!demoFormData.password || demoFormData.password.length < 6) {
      formAccessibility.addError(
        "password",
        "Şifre en az 6 karakter olmalıdır"
      );
      hasErrors = true;
    } else {
      formAccessibility.removeError("password");
    }

    if (hasErrors) {
      handleAnnouncement("Formda hatalar var, lütfen düzeltin", "assertive");
    } else {
      handleAnnouncement("Form başarıyla gönderildi!", "polite");
    }
  };

  // Demo data for interactive elements
  const demoCards = [
    {
      id: 1,
      title: "Python Temelleri",
      progress: 75,
      description: "Temel programlama kavramları",
    },
    {
      id: 2,
      title: "Veri Yapıları",
      progress: 45,
      description: "Liste, sözlük ve tuple kullanımı",
    },
    {
      id: 3,
      title: "Fonksiyonlar",
      progress: 90,
      description: "Fonksiyon tanımlama ve kullanma",
    },
    {
      id: 4,
      title: "Sınıflar",
      progress: 30,
      description: "Nesne yönelimli programlama",
    },
  ];

  const contrastExamples = [
    {
      bg: "#ffffff",
      text: "#000000",
      ratio: 21,
      level: "AAA",
      label: "Mükemmel Kontrast",
    },
    {
      bg: "#0066cc",
      text: "#ffffff",
      ratio: 7.2,
      level: "AAA",
      label: "Mavi & Beyaz",
    },
    {
      bg: "#666666",
      text: "#ffffff",
      ratio: 5.74,
      level: "AA",
      label: "Gri & Beyaz",
    },
    {
      bg: "#ffcc00",
      text: "#000000",
      ratio: 4.6,
      level: "AA",
      label: "Sarı & Siyah",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip Links */}
      <SkipLinks />

      {/* Live Region for Announcements */}
      <LiveRegion announcement={announcement} priority="polite" />

      <Container size="2xl" className="py-8">
        <div className="space-y-12">
          {/* Header */}
          <FadeIn>
            <header>
              <h1
                id="main-title"
                className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800"
              >
                ♿ Accessibility Demo
              </h1>
              <p className="text-center text-gray-600 text-lg mb-6">
                WCAG 2.1 AA uyumlu erişilebilirlik özellikleri showcase
              </p>

              {/* Accessibility Controls */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <HighContrastToggle />
                <TextSizeControls />
                <AccessibleButton
                  onClick={() => setShowShortcuts(!showShortcuts)}
                  variant="outline"
                  aria-expanded={showShortcuts}
                  aria-controls="shortcuts-panel"
                >
                  ⌨️ Klavye Kısayolları
                </AccessibleButton>
                <AccessibleButton
                  onClick={() => handleAnnouncement("Test duyurusu yapıldı")}
                  variant="secondary"
                >
                  📢 Test Duyuru
                </AccessibleButton>
              </div>

              {showShortcuts && (
                <div id="shortcuts-panel" className="max-w-md mx-auto mb-8">
                  <KeyboardShortcutsHelp />
                </div>
              )}
            </header>
          </FadeIn>

          {/* Current Accessibility Status */}
          <ScaleIn>
            <section
              className="bg-white rounded-2xl p-6 shadow-lg border"
              aria-labelledby="status-title"
            >
              <h2 id="status-title" className="text-2xl font-semibold mb-4">
                📊 Mevcut Erişilebilirlik Durumu
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  className={`p-4 rounded-lg border ${
                    isKeyboardUser
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">⌨️</span>
                    <div>
                      <div className="font-medium">Klavye Kullanımı</div>
                      <div className="text-sm text-gray-600">
                        {isKeyboardUser ? "Aktif" : "Pasif"}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg border ${
                    colorPreferences.highContrast
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">🔆</span>
                    <div>
                      <div className="font-medium">Yüksek Kontrast</div>
                      <div className="text-sm text-gray-600">
                        {colorPreferences.highContrast ? "Açık" : "Kapalı"}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg border ${
                    colorPreferences.reducedMotion
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">🎭</span>
                    <div>
                      <div className="font-medium">Azaltılmış Hareket</div>
                      <div className="text-sm text-gray-600">
                        {colorPreferences.reducedMotion ? "Açık" : "Kapalı"}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg border ${
                    colorPreferences.darkMode
                      ? "bg-purple-50 border-purple-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">🌙</span>
                    <div>
                      <div className="font-medium">Karanlık Mod</div>
                      <div className="text-sm text-gray-600">
                        {colorPreferences.darkMode ? "Açık" : "Kapalı"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </ScaleIn>

          {/* Screen Reader Announcements */}
          <section
            className="bg-white rounded-2xl p-6 shadow-lg border"
            aria-labelledby="announcements-title"
          >
            <h2
              id="announcements-title"
              className="text-2xl font-semibold mb-4"
            >
              📢 Ekran Okuyucu Duyuruları
            </h2>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <AccessibleButton
                  onClick={() => handleAnnouncement("Bilgi mesajı", "polite")}
                  variant="outline"
                >
                  ℹ️ Bilgi Duyurusu
                </AccessibleButton>
                <AccessibleButton
                  onClick={() =>
                    handleAnnouncement("Uyarı mesajı!", "assertive")
                  }
                  variant="secondary"
                >
                  ⚠️ Uyarı Duyurusu
                </AccessibleButton>
                <AccessibleButton
                  onClick={() => handleAnnouncement("Başarılı işlem", "polite")}
                  variant="primary"
                >
                  ✅ Başarı Duyurusu
                </AccessibleButton>
              </div>

              {announcements.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Son Duyurular:</h3>
                  <ul className="space-y-1">
                    {announcements.map((msg, index) => (
                      <li key={index} className="text-sm text-blue-800">
                        "{msg}"
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Keyboard Navigation Demo */}
          <section
            className="bg-white rounded-2xl p-6 shadow-lg border"
            aria-labelledby="keyboard-title"
          >
            <h2 id="keyboard-title" className="text-2xl font-semibold mb-4">
              ⌨️ Klavye Navigasyonu
            </h2>

            <div className="space-y-4">
              <p className="text-gray-600">
                Tab tuşu ile gezinip Space/Enter ile aktifleştirin:
              </p>

              <div
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                role="grid"
                aria-label="Öğrenme kartları"
              >
                {demoCards.map((card, index) => (
                  <div
                    key={card.id}
                    role="gridcell"
                    tabIndex={0}
                    className="p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:shadow-md transition-shadow"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleAnnouncement(`${card.title} kartı seçildi`);
                      }
                    }}
                    aria-label={`${card.title}, %${card.progress} tamamlandı`}
                  >
                    <h3 className="font-medium mb-2">{card.title}</h3>
                    <AccessibleProgress
                      value={card.progress}
                      label="İlerleme"
                      showValue={false}
                      className="mb-2"
                    />
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Form Accessibility */}
          <section
            className="bg-white rounded-2xl p-6 shadow-lg border"
            aria-labelledby="form-title"
          >
            <h2 id="form-title" className="text-2xl font-semibold mb-4">
              📝 Form Erişilebilirliği
            </h2>

            <form
              className="max-w-md space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                validateForm();
              }}
              aria-label="Demo form"
            >
              <AccessibleField
                label="E-posta"
                name="email"
                type="email"
                required
                error={formAccessibility.errors.email}
                description="Giriş yapmak için kullanacağınız e-posta adresi"
              >
                <input
                  type="email"
                  value={demoFormData.email}
                  onChange={(e) =>
                    setDemoFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  aria-invalid={!!formAccessibility.errors.email}
                  onBlur={() => formAccessibility.markTouched("email")}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </AccessibleField>

              <AccessibleField
                label="Şifre"
                name="password"
                type="password"
                required
                error={formAccessibility.errors.password}
                description="En az 6 karakter olmalıdır"
              >
                <input
                  type="password"
                  value={demoFormData.password}
                  onChange={(e) =>
                    setDemoFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  aria-invalid={!!formAccessibility.errors.password}
                  onBlur={() => formAccessibility.markTouched("password")}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </AccessibleField>

              <AccessibleField
                label="Mesaj"
                name="message"
                description="İsteğe bağlı ek bilgiler"
              >
                <textarea
                  rows={3}
                  value={demoFormData.message}
                  onChange={(e) =>
                    setDemoFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </AccessibleField>

              <AccessibleButton type="submit" variant="primary">
                📤 Form Gönder
              </AccessibleButton>
            </form>
          </section>

          {/* Progress and Loading States */}
          <section
            className="bg-white rounded-2xl p-6 shadow-lg border"
            aria-labelledby="progress-title"
          >
            <h2 id="progress-title" className="text-2xl font-semibold mb-4">
              📊 İlerleme ve Yükleme Durumları
            </h2>

            <div className="space-y-6">
              <AccessibleProgress
                value={progress}
                label="Simülasyon İlerlemesi"
                className="mb-4"
              />

              <AccessibleButton
                onClick={simulateProgress}
                disabled={progress > 0 && progress < 100}
                isLoading={progress > 0 && progress < 100}
                loadingText="İşleniyor..."
              >
                🚀 İşlemi Başlat
              </AccessibleButton>
            </div>
          </section>

          {/* Color Contrast Examples */}
          <section
            className="bg-white rounded-2xl p-6 shadow-lg border"
            aria-labelledby="contrast-title"
          >
            <h2 id="contrast-title" className="text-2xl font-semibold mb-4">
              🎨 Renk Kontrastı Örnekleri
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {contrastExamples.map((example, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border"
                  style={{ backgroundColor: example.bg, color: example.text }}
                >
                  <h3 className="font-medium mb-2">{example.label}</h3>
                  <p className="text-sm mb-1">
                    Oran: {example.ratio.toFixed(1)}:1
                  </p>
                  <p className="text-xs">WCAG: {example.level}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Modal Demo */}
          <section
            className="bg-white rounded-2xl p-6 shadow-lg border"
            aria-labelledby="modal-title"
          >
            <h2 id="modal-title" className="text-2xl font-semibold mb-4">
              🪟 Modal Erişilebilirliği
            </h2>

            <AccessibleButton
              onClick={() => setModalOpen(true)}
              variant="primary"
            >
              🔓 Modal Aç
            </AccessibleButton>
          </section>

          {/* Screen Reader Only Content Demo */}
          <section
            className="bg-white rounded-2xl p-6 shadow-lg border"
            aria-labelledby="sr-title"
          >
            <h2 id="sr-title" className="text-2xl font-semibold mb-4">
              👁️ Ekran Okuyucu İçeriği
            </h2>

            <div className="space-y-4">
              <p>
                Bu içerik herkes tarafından görülebilir.
                <ScreenReaderOnly>
                  Bu içerik sadece ekran okuyucular tarafından okunur.
                </ScreenReaderOnly>
              </p>

              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="mb-2">
                  <strong>Görsel:</strong> Python kod örneği
                </p>
                <ScreenReaderOnly>
                  Alt metin: print("Merhaba Dünya") komutunu gösteren Python kod
                  bloğu
                </ScreenReaderOnly>
                <div className="bg-black text-green-400 p-3 rounded font-mono text-sm">
                  print("Merhaba Dünya")
                </div>
              </div>
            </div>
          </section>
        </div>
      </Container>

      {/* Accessible Modal */}
      <AccessibleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Erişilebilir Modal"
      >
        <div className="space-y-4">
          <p>Bu modal WCAG 2.1 standartlarına uygun olarak tasarlanmıştır:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Focus trap (odak tuzağı) aktif</li>
            <li>Escape tuşu ile kapatılabilir</li>
            <li>Açıldığında ekran okuyucuya duyurulur</li>
            <li>Proper ARIA attributes kullanılır</li>
            <li>Keyboard navigation desteklenir</li>
          </ul>
          <div className="flex gap-2">
            <AccessibleButton
              onClick={() => setModalOpen(false)}
              variant="primary"
            >
              Kapat
            </AccessibleButton>
            <AccessibleButton
              onClick={() => handleAnnouncement("Modal içinde aksiyon alındı")}
              variant="outline"
            >
              Test Aksiyonu
            </AccessibleButton>
          </div>
        </div>
      </AccessibleModal>
    </div>
  );
}
