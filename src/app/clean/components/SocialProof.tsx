"use client";

import { Users, Award, CheckCircle } from "lucide-react";

interface SocialProofProps {
  stats: {
    totalUsers: number;
    completionRate: number;
    totalChallenges: number;
  };
  loading: boolean;
}

export default function SocialProof({ stats, loading }: SocialProofProps) {
  if (loading) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalUsers.toLocaleString()}+
            </div>
            <div className="text-gray-600">Active Learners</div>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.completionRate}%
            </div>
            <div className="text-gray-600">Completion Rate</div>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalChallenges}+
            </div>
            <div className="text-gray-600">Coding Challenges</div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-16 mx-auto max-w-2xl text-center">
          <blockquote className="text-lg italic text-gray-700">
            "Zumenzu made learning Python fun and engaging. The gamification keeps me motivated, 
            and the interactive challenges helped me build real coding skills."
          </blockquote>
          <div className="mt-4">
            <div className="font-semibold text-gray-900">Sarah Chen</div>
            <div className="text-gray-600">Software Developer</div>
          </div>
        </div>
      </div>
    </section>
  );
}