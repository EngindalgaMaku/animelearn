"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import HeroSection from "./components/HeroSection";
import FeatureGrid from "./components/FeatureGrid";
import SocialProof from "./components/SocialProof";
import FinalCTA from "./components/FinalCTA";

interface PageStats {
  totalUsers: number;
  completionRate: number;
  totalChallenges: number;
}

export default function CleanHomepage() {
  const [stats, setStats] = useState<PageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Fetch real-time stats for social proof
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/homepage');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback stats
        setStats({
          totalUsers: 5000,
          completionRate: 89,
          totalChallenges: 50
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection isAuthenticated={isAuthenticated} />
      
      {/* Core Features */}
      <FeatureGrid />
      
      {/* Social Proof */}
      {stats && <SocialProof stats={stats} loading={loading} />}
      
      {/* Final CTA */}
      <FinalCTA isAuthenticated={isAuthenticated} />
    </div>
  );
}