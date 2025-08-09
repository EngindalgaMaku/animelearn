"use client";

import Link from "next/link";
import { ArrowRight, Code, Trophy, Users } from "lucide-react";

interface FinalCTAProps {
  isAuthenticated: boolean;
}

export default function FinalCTA({ isAuthenticated }: FinalCTAProps) {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to start your Python journey?
          </h2>
          <p className="mt-6 text-lg leading-8 text-blue-100">
            Join thousands of developers who are mastering Python through our interactive, 
            gamified learning platform. Start coding today!
          </p>

          {/* Benefits */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-white">
            <div className="flex items-center">
              <Code className="mr-2 h-5 w-5" />
              <span>Interactive Challenges</span>
            </div>
            <div className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              <span>Earn Rewards</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              <span>Join Community</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-10">
            <Link
              href={isAuthenticated ? "/dashboard" : "/register"}
              className="group inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
            >
              {isAuthenticated ? "Continue Learning" : "Join Thousands Learning Python"}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Support Text */}
          <p className="mt-6 text-sm text-blue-200">
            Free to start • No credit card required • 5,000+ active learners
          </p>
        </div>
      </div>
    </section>
  );
}