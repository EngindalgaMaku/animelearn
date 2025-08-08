"use client";

import React, { useState } from "react";
import {
  FadeIn,
  ScaleIn,
  SlideIn,
  StaggerChildren,
  AnimatedButton,
  AnimatedCard,
  AnimatedIcon,
  MagicalAppear,
  PowerUp,
  Floating,
  Pulse,
  Shake,
  Presence,
  useMotionPreference,
  animations,
  sequences,
} from "@/lib/animations";
import { Container } from "@/lib/responsive";

export default function AnimationsDemo() {
  const [showDemo, setShowDemo] = useState(true);
  const [shakeError, setShakeError] = useState(false);
  const [selectedAnimation, setSelectedAnimation] = useState<string>("fadeIn");
  const { shouldAnimate, prefersReducedMotion } = useMotionPreference();

  const triggerShake = () => {
    setShakeError(true);
    setTimeout(() => setShakeError(false), 500);
  };

  const animationExamples = [
    {
      key: "fadeIn",
      name: "Fade In",
      description: "Yumuşak görünme animasyonu",
    },
    { key: "scaleIn", name: "Scale In", description: "Büyüyerek görünme" },
    {
      key: "slideLeft",
      name: "Slide Left",
      description: "Soldan kayarak gelme",
    },
    {
      key: "slideRight",
      name: "Slide Right",
      description: "Sağdan kayarak gelme",
    },
    { key: "slideUp", name: "Slide Up", description: "Alttan yukarı kayma" },
    { key: "slideDown", name: "Slide Down", description: "Üstten aşağı kayma" },
    {
      key: "magical",
      name: "Magical Appear",
      description: "Sihirli görünme efekti",
    },
    { key: "powerUp", name: "Power Up", description: "Güçlenme animasyonu" },
  ];

  const microInteractionExamples = [
    { name: "Button Hover", color: "bg-blue-500 hover:bg-blue-600 text-white" },
    {
      name: "Success Button",
      color: "bg-green-500 hover:bg-green-600 text-white",
    },
    {
      name: "Warning Button",
      color: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
    { name: "Danger Button", color: "bg-red-500 hover:bg-red-600 text-white" },
  ];

  const renderAnimationExample = (key: string) => {
    const content = (
      <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl p-6 text-white text-center">
        <div className="text-2xl mb-2">🎭</div>
        <h3 className="font-semibold mb-1">Anime Karakter</h3>
        <p className="text-sm opacity-90">Demo animasyon</p>
      </div>
    );

    switch (key) {
      case "fadeIn":
        return <FadeIn key={showDemo ? "show" : "hide"}>{content}</FadeIn>;
      case "scaleIn":
        return <ScaleIn key={showDemo ? "show" : "hide"}>{content}</ScaleIn>;
      case "slideLeft":
        return (
          <SlideIn key={showDemo ? "show" : "hide"} direction="left">
            {content}
          </SlideIn>
        );
      case "slideRight":
        return (
          <SlideIn key={showDemo ? "show" : "hide"} direction="right">
            {content}
          </SlideIn>
        );
      case "slideUp":
        return (
          <SlideIn key={showDemo ? "show" : "hide"} direction="up">
            {content}
          </SlideIn>
        );
      case "slideDown":
        return (
          <SlideIn key={showDemo ? "show" : "hide"} direction="down">
            {content}
          </SlideIn>
        );
      case "magical":
        return (
          <MagicalAppear key={showDemo ? "show" : "hide"}>
            {content}
          </MagicalAppear>
        );
      case "powerUp":
        return <PowerUp key={showDemo ? "show" : "hide"}>{content}</PowerUp>;
      default:
        return <FadeIn key={showDemo ? "show" : "hide"}>{content}</FadeIn>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Container size="2xl" className="py-8">
        <div className="space-y-12">
          {/* Header */}
          <FadeIn>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                ✨ Animations Demo
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                Anime-themed animation system showcase
              </p>

              {/* Motion Preference Status */}
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  prefersReducedMotion
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {prefersReducedMotion
                  ? "⚠️ Reduced Motion Mode"
                  : "✅ Full Animation Mode"}
              </div>
            </div>
          </FadeIn>

          {/* Basic Animations Section */}
          <ScaleIn>
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
                🎬 Temel Animasyonlar
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Animation Selector */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-700">
                    Animasyon Seçici
                  </h3>
                  <div className="space-y-2 mb-6">
                    {animationExamples.map((example) => (
                      <button
                        key={example.key}
                        onClick={() => setSelectedAnimation(example.key)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedAnimation === example.key
                            ? "border-blue-500 bg-blue-50 text-blue-800"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="font-medium">{example.name}</div>
                        <div className="text-sm opacity-75">
                          {example.description}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <AnimatedButton
                      onClick={() => setShowDemo(!showDemo)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      🔄 Tekrar Oynat
                    </AnimatedButton>

                    <AnimatedButton
                      onClick={triggerShake}
                      variant="subtle"
                      className="border border-red-300 text-red-600 hover:bg-red-50"
                    >
                      💥 Shake Test
                    </AnimatedButton>
                  </div>
                </div>

                {/* Animation Preview */}
                <div className="flex items-center justify-center min-h-[300px]">
                  <Shake trigger={shakeError}>
                    <Presence show={showDemo}>
                      {renderAnimationExample(selectedAnimation)}
                    </Presence>
                  </Shake>
                </div>
              </div>
            </section>
          </ScaleIn>

          {/* Stagger Animation Section */}
          <SlideIn direction="up">
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
                🎭 Stagger Animasyonları
              </h2>

              <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <AnimatedCard key={i} className="p-4 text-center">
                    <div className="text-2xl mb-2">🎌</div>
                    <h3 className="font-medium text-gray-800">Öğe {i + 1}</h3>
                    <p className="text-sm text-gray-600">Sıralı animasyon</p>
                  </AnimatedCard>
                ))}
              </StaggerChildren>
            </section>
          </SlideIn>

          {/* Micro-interactions Section */}
          <SlideIn direction="left">
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
                🖱️ Micro-interactions
              </h2>

              <div className="space-y-8">
                {/* Buttons */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-700">
                    Animated Buttons
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {microInteractionExamples.map((example, index) => (
                      <AnimatedButton
                        key={index}
                        className={example.color}
                        variant={index % 2 === 0 ? "default" : "subtle"}
                      >
                        {example.name}
                      </AnimatedButton>
                    ))}
                  </div>
                </div>

                {/* Cards */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-700">
                    Animated Cards
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        title: "Python Temelleri",
                        icon: "🐍",
                        color: "from-green-400 to-blue-500",
                      },
                      {
                        title: "Anime Characters",
                        icon: "👘",
                        color: "from-pink-400 to-purple-500",
                      },
                      {
                        title: "Code Challenge",
                        icon: "⚔️",
                        color: "from-yellow-400 to-red-500",
                      },
                    ].map((card, index) => (
                      <AnimatedCard
                        key={index}
                        className="p-6 bg-gradient-to-br"
                      >
                        <div
                          className={`bg-gradient-to-br ${card.color} rounded-lg p-4 text-white`}
                        >
                          <div className="text-3xl mb-2">{card.icon}</div>
                          <h4 className="font-semibold">{card.title}</h4>
                          <p className="text-sm opacity-90">
                            Hover efekti test edin
                          </p>
                        </div>
                      </AnimatedCard>
                    ))}
                  </div>
                </div>

                {/* Icons */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-700">
                    Animated Icons
                  </h3>
                  <div className="flex gap-4">
                    {["⚙️", "❤️", "🌟", "🔥", "💎", "🏆"].map((icon, index) => (
                      <AnimatedIcon
                        key={index}
                        className="text-3xl p-3 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        {icon}
                      </AnimatedIcon>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </SlideIn>

          {/* Special Effects Section */}
          <SlideIn direction="right">
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
                🎨 Özel Efektler
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Floating */}
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-4 text-gray-700">
                    Floating Effect
                  </h3>
                  <Floating amplitude={10} duration={3}>
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl">
                      🎈
                    </div>
                  </Floating>
                  <p className="text-sm text-gray-600 mt-2">
                    Sürekli yüzen efekt
                  </p>
                </div>

                {/* Pulse */}
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-4 text-gray-700">
                    Pulse Effect
                  </h3>
                  <Pulse scale={1.1} duration={2}>
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                      💗
                    </div>
                  </Pulse>
                  <p className="text-sm text-gray-600 mt-2">
                    Nabız atışı efekti
                  </p>
                </div>

                {/* Magical Appear */}
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-4 text-gray-700">
                    Magical Entry
                  </h3>
                  <MagicalAppear>
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl">
                      ✨
                    </div>
                  </MagicalAppear>
                  <p className="text-sm text-gray-600 mt-2">Sihirli görünme</p>
                </div>
              </div>
            </section>
          </SlideIn>

          {/* Performance Info */}
          <FadeIn>
            <section className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                📊 Performance & Accessibility
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-green-300">
                    ✅ GPU Accelerated
                  </h3>
                  <p className="text-sm opacity-90">
                    Transform ve opacity kullanarak GPU hızlandırması
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-blue-300">
                    ♿ Accessibility
                  </h3>
                  <p className="text-sm opacity-90">
                    prefers-reduced-motion desteği
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-purple-300">
                    🎯 Optimized
                  </h3>
                  <p className="text-sm opacity-90">
                    Framer Motion ve performans odaklı
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <h3 className="font-semibold mb-2">Current Settings:</h3>
                <div className="text-sm space-y-1">
                  <div>
                    Animation Support:{" "}
                    {shouldAnimate ? "✅ Enabled" : "❌ Disabled"}
                  </div>
                  <div>
                    Reduced Motion:{" "}
                    {prefersReducedMotion ? "✅ Requested" : "❌ Not Requested"}
                  </div>
                  <div>
                    Browser Support: ✅ Modern browsers with Framer Motion
                  </div>
                </div>
              </div>
            </section>
          </FadeIn>

          {/* Code Examples */}
          <SlideIn direction="up">
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
                💻 Kullanım Örnekleri
              </h2>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-gray-800">
                    Basic Usage:
                  </h3>
                  <pre className="text-sm text-gray-700 overflow-x-auto">
                    <code>{`import { FadeIn, ScaleIn, AnimatedButton } from '@/lib/animations';

<FadeIn delay={0.2}>
  <h1>Anime Python Learning</h1>
</FadeIn>

<AnimatedButton className="bg-blue-500 text-white">
  Start Learning
</AnimatedButton>`}</code>
                  </pre>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-gray-800">
                    Advanced Usage:
                  </h3>
                  <pre className="text-sm text-gray-700 overflow-x-auto">
                    <code>{`import { StaggerChildren, MagicalAppear } from '@/lib/animations';

<StaggerChildren staggerDelay={0.1}>
  {lessons.map(lesson => (
    <MagicalAppear key={lesson.id}>
      <LessonCard lesson={lesson} />
    </MagicalAppear>
  ))}
</StaggerChildren>`}</code>
                  </pre>
                </div>
              </div>
            </section>
          </SlideIn>
        </div>
      </Container>
    </div>
  );
}
