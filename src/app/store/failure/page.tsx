"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  XCircle,
  RefreshCw,
  Home,
  CreditCard,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchPaymentData();
    }
  }, [orderId]);

  const fetchPaymentData = async () => {
    try {
      const response = await fetch(`/api/shopier/payment-status?order=${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setPaymentData(data.payment);
      }
    } catch (error) {
      console.error("Failed to fetch payment data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600">Checking payment status...</p>
        </div>
      </div>
    );
  }

  const getFailureMessage = (reason?: string) => {
    switch (reason) {
      case "payment_cancelled":
        return "Payment was cancelled by user";
      case "payment_timeout":
        return "Payment session timed out";
      case "insufficient_funds":
        return "Insufficient funds";
      case "card_declined":
        return "Card was declined";
      default:
        return "Payment could not be completed";
    }
  };

  const getFailureAdvice = (reason?: string) => {
    switch (reason) {
      case "payment_cancelled":
        return "You can try again anytime. Your cart is still saved.";
      case "payment_timeout":
        return "Please try the payment process again.";
      case "insufficient_funds":
        return "Please check your account balance and try again.";
      case "card_declined":
        return "Please check your card details or try a different payment method.";
      default:
        return "Please try again or contact our support team if the issue persists.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
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
              delay: i * 0.3,
            }}
          >
            <AlertTriangle className="h-5 w-5 text-orange-300 opacity-20" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="max-w-2xl w-full bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center border border-red-200"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Failure Icon */}
          <motion.div
            className="mx-auto mb-6 w-24 h-24 bg-red-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          >
            <XCircle className="h-12 w-12 text-white" />
          </motion.div>

          {/* Failure Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              😞 Payment Failed
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              {getFailureMessage(paymentData?.failureReason)}
            </p>
            <p className="text-gray-500 mb-8">
              {getFailureAdvice(paymentData?.failureReason)}
            </p>
          </motion.div>

          {/* Payment Details */}
          {paymentData && (
            <motion.div
              className="bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl p-6 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="font-bold text-gray-900 text-lg mb-4">Order Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Package</p>
                  <p className="font-medium text-gray-900">{paymentData.packageName}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Amount</p>
                  <p className="font-medium text-gray-900">${paymentData.price}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Diamonds</p>
                  <p className="font-medium text-gray-900">💎 {paymentData.diamonds?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="font-medium text-red-600">Failed</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Help Section */}
          <motion.div
            className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="font-bold text-gray-900 text-lg mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              If you continue to experience issues, please contact our support team with your order ID.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs">24/7 Support</span>
              <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs">Secure Payments</span>
              <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs">Instant Refund</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <Link
              href="/store"
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-4 px-8 rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Try Again</span>
            </Link>
            
            <Link
              href="/shop"
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <CreditCard className="h-5 w-5" />
              <span>Browse Cards</span>
            </Link>
            
            <Link
              href="/dashboard"
              className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 font-bold py-4 px-8 rounded-xl hover:bg-gray-200 transition-all duration-300 border border-gray-300"
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </motion.div>

          {/* Order Info */}
          {orderId && (
            <motion.div
              className="mt-8 pt-6 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <p className="text-gray-500 text-sm mb-2">
                Order ID: <span className="font-mono">{orderId}</span>
              </p>
              <p className="text-gray-400 text-xs">
                Keep this ID for support inquiries
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentFailureContent />
    </Suspense>
  );
}