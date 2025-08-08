'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, Check, X, Loader2, FileImage } from 'lucide-react';
import { ElementType, RarityTier } from '@/types/battle/core';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
  cardData?: {
    name: string;
    element: ElementType;
    rarity: RarityTier;
    imageUrl: string;
    thumbnailUrl: string;
  };
}

interface CollectionCardUploadProps {
  onUploadComplete: (cardData: any) => void;
  element: ElementType;
  rarity: RarityTier;
}

export const CollectionCardUpload: React.FC<CollectionCardUploadProps> = ({
  onUploadComplete,
  element,
  rarity
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Generate automatic card name based on element and rarity
  const generateCardName = (element: ElementType, rarity: RarityTier): string => {
    const elementPrefixes = {
      [ElementType.FIRE]: ['Blazing', 'Infernal', 'Crimson', 'Scorching', 'Ember'],
      [ElementType.WATER]: ['Azure', 'Crystal', 'Tidal', 'Flowing', 'Mystic'],
      [ElementType.EARTH]: ['Ancient', 'Stone', 'Verdant', 'Mountain', 'Forest'],
      [ElementType.AIR]: ['Wind', 'Storm', 'Sky', 'Celestial', 'Ethereal'],
      [ElementType.LIGHT]: ['Divine', 'Radiant', 'Golden', 'Blessed', 'Sacred'],
      [ElementType.SHADOW]: ['Dark', 'Void', 'Shadow', 'Mystical', 'Obsidian'],
      [ElementType.NEUTRAL]: ['Balanced', 'Harmonic', 'Universal', 'Elemental', 'Pure']
    };

    const rarityTypes = {
      [RarityTier.COMMON]: ['Warrior', 'Guardian', 'Spirit', 'Keeper', 'Wanderer'],
      [RarityTier.UNCOMMON]: ['Knight', 'Mage', 'Hunter', 'Sage', 'Defender'],
      [RarityTier.RARE]: ['Champion', 'Sorcerer', 'Master', 'Lord', 'Paladin'],
      [RarityTier.EPIC]: ['Hero', 'Archmage', 'Warlord', 'Elder', 'Sentinel'],
      [RarityTier.LEGENDARY]: ['Legend', 'Overlord', 'Grandmaster', 'Avatar', 'Emperor'],
      [RarityTier.MYTHIC]: ['Mythical', 'Primordial', 'Ancient One', 'Titan', 'Deity'],
      [RarityTier.DIVINE]: ['Divine Being', 'Cosmic Entity', 'Supreme', 'Omnipotent', 'Creator']
    };

    const prefix = elementPrefixes[element][Math.floor(Math.random() * elementPrefixes[element].length)];
    const type = rarityTypes[rarity][Math.floor(Math.random() * rarityTypes[rarity].length)];
    
    return `${prefix} ${type}`;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.bmp', '.tiff']
    },
    multiple: true
  });

  const uploadFile = async (uploadFile: UploadedFile) => {
    setFiles(prev => prev.map(f => 
      f.id === uploadFile.id ? { ...f, uploading: true } : f
    ));

    try {
      const formData = new FormData();
      formData.append('file', uploadFile.file);
      formData.append('element', element);
      formData.append('rarity', rarity);
      formData.append('type', 'collection'); // Specify this is for collection cards
      
      const response = await fetch('/api/upload/collection-card', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Generate automatic card name
      const cardName = generateCardName(element, rarity);
      
      const cardData = {
        name: cardName,
        element,
        rarity,
        imageUrl: result.imageUrl,
        thumbnailUrl: result.thumbnailUrl,
        description: `A powerful ${rarity.toLowerCase()} ${element.toLowerCase()} card with mystical abilities.`,
        story: `The legendary tale of ${cardName} echoes through the ages, inspiring both fear and respect among those who witness its power.`,
        lore: `In ancient times, ${cardName} was known as one of the most formidable entities in the realm of ${element.toLowerCase()}. Its ${rarity.toLowerCase()} essence grants it abilities beyond mortal comprehension.`,
        isAnimated: rarity === RarityTier.LEGENDARY || rarity === RarityTier.MYTHIC || rarity === RarityTier.DIVINE,
        isHolographic: rarity === RarityTier.MYTHIC || rarity === RarityTier.DIVINE,
        collectionNumber: Date.now() // Temporary, should be managed by backend
      };

      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, uploading: false, uploaded: true, cardData }
          : f
      ));

      onUploadComplete(cardData);

    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, uploading: false, error: 'Upload failed' }
          : f
      ));
    }
  };

  const uploadAllFiles = async () => {
    setIsUploading(true);
    const unuploadedFiles = files.filter(f => !f.uploaded && !f.uploading);
    
    for (const file of unuploadedFiles) {
      await uploadFile(file);
    }
    
    setIsUploading(false);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const getElementColor = (element: ElementType) => {
    const colors = {
      [ElementType.FIRE]: 'border-red-300 bg-red-50',
      [ElementType.WATER]: 'border-blue-300 bg-blue-50',
      [ElementType.EARTH]: 'border-green-300 bg-green-50',
      [ElementType.AIR]: 'border-gray-300 bg-gray-50',
      [ElementType.LIGHT]: 'border-yellow-300 bg-yellow-50',
      [ElementType.SHADOW]: 'border-purple-300 bg-purple-50',
      [ElementType.NEUTRAL]: 'border-gray-300 bg-gray-50'
    };
    return colors[element];
  };

  const getRarityColor = (rarity: RarityTier) => {
    const colors = {
      [RarityTier.COMMON]: 'text-gray-600',
      [RarityTier.UNCOMMON]: 'text-green-600',
      [RarityTier.RARE]: 'text-blue-600',
      [RarityTier.EPIC]: 'text-purple-600',
      [RarityTier.LEGENDARY]: 'text-orange-600',
      [RarityTier.MYTHIC]: 'text-red-600',
      [RarityTier.DIVINE]: 'text-yellow-600'
    };
    return colors[rarity];
  };

  return (
    <div className="space-y-6">
      {/* Upload Info */}
      <div className={`rounded-lg border-2 p-4 ${getElementColor(element)}`}>
        <h3 className="font-semibold text-gray-900 mb-2">Upload Configuration</h3>
        <div className="flex items-center space-x-4 text-sm">
          <span className="font-medium">Element: <span className="capitalize">{element}</span></span>
          <span className={`font-medium ${getRarityColor(rarity)}`}>
            Rarity: <span className="capitalize">{rarity}</span>
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Cards will be automatically named and processed for the collection system.
        </p>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-purple-400 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-lg font-medium text-purple-600">Drop the images here...</p>
        ) : (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop card images here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports: JPEG, PNG, WebP, GIF, BMP, TIFF (will be converted to JPEG)
            </p>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Uploaded Files ({files.length})
            </h3>
            {files.some(f => !f.uploaded && !f.uploading) && (
              <button
                onClick={uploadAllFiles}
                disabled={isUploading}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span>{isUploading ? 'Uploading...' : 'Upload All'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="relative border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
              >
                {/* Preview Image */}
                <div className="aspect-w-4 aspect-h-3 mb-3">
                  <img
                    src={file.preview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>

                {/* File Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {file.file.name}
                    </span>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-xs text-gray-500">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </div>

                  {/* Status */}
                  <div className="flex items-center space-x-2">
                    {file.uploading && (
                      <>
                        <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                        <span className="text-sm text-blue-600">Uploading...</span>
                      </>
                    )}
                    {file.uploaded && (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Uploaded</span>
                      </>
                    )}
                    {file.error && (
                      <>
                        <X className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600">{file.error}</span>
                      </>
                    )}
                    {!file.uploading && !file.uploaded && !file.error && (
                      <>
                        <FileImage className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Ready</span>
                      </>
                    )}
                  </div>

                  {/* Generated Card Info */}
                  {file.cardData && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-xs font-medium text-green-800">
                        Generated: {file.cardData.name}
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        {file.cardData.element} • {file.cardData.rarity}
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  {!file.uploaded && !file.uploading && (
                    <button
                      onClick={() => uploadFile(file)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors"
                    >
                      Upload & Process
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionCardUpload;