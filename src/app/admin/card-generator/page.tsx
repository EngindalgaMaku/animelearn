'use client';

import React from 'react';
import { CardImageGenerator } from '../../../components/admin/CardImageGenerator';

export default function CardGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🎨 Card Image Generator</h1>
              <p className="text-gray-400">Generate professional artwork for Elements of Legends cards using Google Imagen</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Google Imagen 3.0
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Generator Component */}
      <CardImageGenerator />
    </div>
  );
}