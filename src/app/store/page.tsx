"use client";

import { useState, useEffect } from "react";
import {
  Diamond,
  CreditCard,
  Shield,
  Zap,
  Star,
  Crown,
  Gift,
  CheckCircle,
  Lock,
  Sparkles,
  Trophy,
  Target,
  Flame,
  ArrowRight,
  X,
  Heart,
  Mail,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface DiamondPackage {
  id: string;
  name: string;
  diamonds: number;
  price: number;
  originalPrice?: number;
  bonus?: number;
  popular?: boolean;
  bestValue?: boolean;
  level: number;
  icon: React.ReactNode;
  features: string[];
  badge: string;
  color: string;
  glow: string;
  packageType: string;
}

// Icon mapping function
const getIconByName = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    Diamond: <Diamond className="h-8 w-8" />,
    Star: <Star className="h-8 w-8" />,
    Crown: <Crown className="h-8 w-8" />,
    Zap: <Zap className="h-8 w-8" />,
    Gift: <Gift className="h-8 w-8" />,
  };
  return iconMap[iconName] || <Diamond className="h-8 w-8" />;
};

// Floating particles animation
function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: [0, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5,
          }}
        >
          <Diamond className="h-4 w-4 text-purple-300 opacity-20" />
        </motion.div>
      ))}
    </div>
  );
}

export default function StorePage() {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<DiamondPackage | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [diamondPackages, setDiamondPackages] = useState<DiamondPackage[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchDiamondPackages();
  }, []);

  const fetchDiamondPackages = async () => {
    try {
      setPackagesLoading(true);
      const response = await fetch('/api/diamond-packages');
      const data = await response.json();

      if (data.success) {
        // Convert database packages to component format
        const formattedPackages: DiamondPackage[] = data.packages.map((pkg: any) => ({
          id: pkg.packageType,
          name: pkg.name,
          diamonds: pkg.diamonds,
          price: pkg.price,
          originalPrice: pkg.originalPrice,
          bonus: pkg.bonus,
          popular: pkg.popular,
          bestValue: pkg.bestValue,
          level: pkg.level,
          badge: pkg.badge,
          color: pkg.color,
          glow: pkg.glow,
          icon: getIconByName(pkg.icon),
          features: typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features,
          packageType: pkg.packageType,
        }));
        setDiamondPackages(formattedPackages);
      }
    } catch (error) {
      console.error("Failed to fetch diamond packages:", error);
    } finally {
      setPackagesLoading(false);
    }
  };

  const handlePurchase = async (pkg: DiamondPackage) => {
    setShowModal(true);
  };

  // Modal Component
  const PlatformModal = () => (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowModal(false)}
        >
          <motion.div
            className="relative w-full max-w-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-8 shadow-2xl border border-purple-500/30"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Heart className="h-8 w-8 text-pink-400" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Thank You for Your Interest!
                </h2>
                <Sparkles className="h-8 w-8 text-purple-400" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 text-white/90 leading-relaxed">
              <p className="text-lg text-center">
                Our platform is designed to create a beautiful and engaging learning experience,
                especially for students, by combining education with entertainment and contributing
                to programming education.
              </p>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Gift className="h-6 w-6 text-yellow-400" />
                  <h3 className="text-xl font-semibold text-yellow-400">Currently Free!</h3>
                </div>
                <p>
                  We're planning to keep the platform <strong>completely free</strong> for the time being
                  while we continue developing and improving the experience. We hope the rewards you earn
                  from completing activities will be sufficient for your learning journey!
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="h-6 w-6 text-blue-400" />
                  <h3 className="text-xl font-semibold text-blue-400">Want to Help?</h3>
                </div>
                <p className="mb-4">
                  If you'd like to contribute to the platform's development or have any questions,
                  we'd love to hear from you!
                </p>
                <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                  <Mail className="h-5 w-5 text-purple-400" />
                  <a
                    href="mailto:mackaengin@gmail.com"
                    className="text-purple-300 hover:text-purple-100 transition-colors font-medium"
                  >
                    mackaengin@gmail.com
                  </a>
                </div>
              </div>

              <div className="text-center">
                <p className="text-purple-200 font-medium">
                  Thank you for your understanding and support! 🎓
                </p>
                <p className="text-sm text-purple-300 mt-2">
                  Enjoy your learning adventure! ✨
                </p>
              </div>
            </div>

            {/* Footer Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Continue Learning
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
      {/* Animated Background */}
      {isClient && <FloatingParticles />}
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          className="bg-black/20 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-20"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Diamond className="h-12 w-12 text-purple-400" />
                </motion.div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Diamond Store
                </h1>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-12 w-12 text-pink-400" />
                </motion.div>
              </div>
              <p className="text-purple-200 text-lg max-w-2xl mx-auto">
                🎮 Power up your gaming experience with premium diamonds! 
                Unlock exclusive cards, boost your collection, and become a legend! ⚡
              </p>
              
            </div>
          </div>
        </motion.div>

        {/* Diamond Packages */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              ⚡ Choose Your Power Level ⚡
            </h2>
            <p className="text-purple-200 text-lg">
              Each package unlocks new achievements and exclusive rewards!
            </p>
          </motion.div>

          {packagesLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-purple-200 text-lg">Loading diamond packages...</p>
              </div>
            </div>
          ) : diamondPackages.length === 0 ? (
            <div className="text-center py-12">
              <Diamond className="h-16 w-16 text-purple-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-white text-xl font-semibold mb-2">No packages available</h3>
              <p className="text-purple-200">Diamond packages will appear here once they're added.</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center max-w-7xl">
              {diamondPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Package Card */}
                <div className={`
                  relative overflow-hidden rounded-xl bg-gradient-to-br ${pkg.color} p-4
                  shadow-xl ${pkg.glow} hover:shadow-2xl transition-all duration-300
                  border border-white/20 h-full
                `}>
                  {/* Popular/Best Value Badge */}
                  {(pkg.popular || pkg.bestValue) && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full transform rotate-12 shadow-lg">
                      {pkg.popular ? "🔥 POPULAR" : "💰 BEST VALUE"}
                    </div>
                  )}

                  {/* Level Badge */}
                  <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-xs font-medium">LVL {pkg.level}</span>
                  </div>

                  {/* Package Icon */}
                  <div className="text-center mb-3">
                    <motion.div
                      className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full mb-2"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-white">
                        <Diamond className="h-6 w-6" />
                      </div>
                    </motion.div>
                    <h3 className="text-white text-lg font-bold">{pkg.name}</h3>
                    <p className="text-white/80 text-xs">{pkg.badge} Package</p>
                  </div>

                  {/* Diamond Count */}
                  <div className="text-center mb-3">
                    <div className="text-white text-2xl font-bold">
                      💎 {pkg.diamonds.toLocaleString()}
                    </div>
                    {pkg.bonus && (
                      <div className="text-yellow-300 text-sm font-medium">
                        +{pkg.bonus} Bonus! 🎁
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-center mb-4">
                    {pkg.originalPrice && (
                      <div className="text-white/60 line-through text-sm">
                        ${pkg.originalPrice}
                      </div>
                    )}
                    <div className="text-white text-xl font-bold">
                      ${pkg.price}
                    </div>
                    {pkg.originalPrice && (
                      <div className="text-green-300 text-xs font-medium">
                        Save ${(pkg.originalPrice - pkg.price).toFixed(2)}!
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-1 mb-4">
                    {pkg.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2 text-white/90 text-xs">
                        <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                    {pkg.features.length > 3 && (
                      <div className="text-white/60 text-xs text-center">
                        +{pkg.features.length - 3} more features
                      </div>
                    )}
                  </div>

                  {/* Purchase Button */}
                  <motion.button
                    onClick={() => handlePurchase(pkg)}
                    disabled={loading && selectedPackage?.id === pkg.id}
                    className="w-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40 group text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading && selectedPackage?.id === pkg.id ? (
                      <div className="flex items-center justify-center space-x-1">
                        <motion.div
                          className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-1">
                        <CreditCard className="h-4 w-4" />
                        <span>Purchase Now</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </motion.button>
                </div>
              </motion.div>
              ))}
             </div>
           </div>
          )}

          {/* Security & Trust Section */}
          <motion.div
            className="mt-16 bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">🔒 Secure & Trusted Payment</h3>
              <p className="text-purple-200">
                Your transactions are protected by industry-leading security powered by Lemonsqueezy
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Shield className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <h4 className="text-white font-semibold mb-2">SSL Encrypted</h4>
                <p className="text-purple-200 text-sm">All payments are secured with 256-bit SSL encryption</p>
              </div>
              <div className="text-center">
                <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                <h4 className="text-white font-semibold mb-2">Instant Delivery</h4>
                <p className="text-purple-200 text-sm">Diamonds are added to your account immediately</p>
              </div>
              <div className="text-center">
                <Target className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                <h4 className="text-white font-semibold mb-2">24/7 Support</h4>
                <p className="text-purple-200 text-sm">Our team is here to help you anytime</p>
              </div>
            </div>
          </motion.div>

          {/* Login Prompt */}
          {!isAuthenticated && (
            <motion.div 
              className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Lock className="h-16 w-16 text-white mx-auto mb-4" />
              <h3 className="text-white text-2xl font-bold mb-4">Ready to Power Up?</h3>
              <p className="text-purple-100 mb-6">
                Create an account or sign in to start purchasing diamonds and unlock exclusive content!
              </p>
              <div className="flex justify-center space-x-4">
                <Link 
                  href="/login"
                  className="bg-white text-purple-600 font-bold py-3 px-8 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register"
                  className="bg-purple-800 text-white font-bold py-3 px-8 rounded-xl hover:bg-purple-700 transition-colors border border-purple-500"
                >
                  Create Account
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Modal */}
      <PlatformModal />
    </div>
  );
}