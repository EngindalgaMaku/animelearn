"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn, formatFileSize, validateImageFile } from "@/lib/utils";

interface UploadedFile {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  id?: string;
}

interface DuplicateCard {
  fileName: string;
  existingCard: {
    id: string;
    name: string;
    imageUrl: string;
    uploadDate: string;
    series?: string;
    character?: string;
    estimatedValue?: number;
  };
  message: string;
}

interface CardUploadProps {
  onUploadComplete?: (cards: any[], duplicates?: DuplicateCard[]) => void;
}

export default function CardUpload({ onUploadComplete }: CardUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [duplicates, setDuplicates] = useState<DuplicateCard[]>([]);
  const [showDuplicates, setShowDuplicates] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => {
      const validationError = validateImageFile(file);
      return {
        file,
        preview: URL.createObjectURL(file),
        status: validationError ? ("error" as const) : ("pending" as const),
        error: validationError || undefined,
      };
    });

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      const validFiles = files.filter((f) => f.status === "pending");

      validFiles.forEach((fileObj) => {
        formData.append("files", fileObj.file);
      });

      // Update status to uploading
      setFiles((prev) =>
        prev.map((f) =>
          f.status === "pending" ? { ...f, status: "uploading" as const } : f
        )
      );

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // Update status to success
        setFiles((prev) =>
          prev.map((f, index) =>
            f.status === "uploading"
              ? {
                  ...f,
                  status: "success" as const,
                  id: result.cards[index]?.id,
                }
              : f
          )
        );

        // Handle duplicates
        if (result.duplicates && result.duplicates.length > 0) {
          setDuplicates(result.duplicates);
          setShowDuplicates(true);
        }

        onUploadComplete?.(result.cards, result.duplicates || []);
      } else {
        // Update status to error
        setFiles((prev) =>
          prev.map((f) =>
            f.status === "uploading"
              ? { ...f, status: "error" as const, error: result.error }
              : f
          )
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      setFiles((prev) =>
        prev.map((f) =>
          f.status === "uploading"
            ? {
                ...f,
                status: "error" as const,
                error: "Error occurred during upload",
              }
            : f
        )
      );
    } finally {
      setIsUploading(false);
    }
  };

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setDuplicates([]);
    setShowDuplicates(false);
  };

  const pendingFiles = files.filter((f) => f.status === "pending");
  const hasValidFiles = pendingFiles.length > 0;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <p className="mb-2 text-lg font-medium text-gray-900">
          {isDragActive ? "Drop files here..." : "Upload your cards"}
        </p>
        <p className="text-sm text-gray-500">
          JPEG, PNG, WebP or GIF formats, maximum 10MB
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              Yüklenecek Dosyalar ({files.length})
            </h3>
            <div className="space-x-2">
              {hasValidFiles && (
                <button
                  onClick={uploadFiles}
                  disabled={isUploading}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUploading
                    ? "Yükleniyor..."
                    : `${pendingFiles.length} Dosyayı Yükle`}
                </button>
              )}
              <button
                onClick={clearAll}
                disabled={isUploading}
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                Temizle
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {files.map((fileObj, index) => (
              <div
                key={index}
                className="relative space-y-3 rounded-lg border p-4"
              >
                {/* Preview Image */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={fileObj.preview}
                    alt={fileObj.file.name}
                    className="h-full w-full object-cover"
                  />

                  {/* Status Icon */}
                  <div className="absolute right-2 top-2">
                    {fileObj.status === "success" && (
                      <CheckCircle className="h-6 w-6 rounded-full bg-white text-green-500" />
                    )}
                    {fileObj.status === "error" && (
                      <AlertCircle className="h-6 w-6 rounded-full bg-white text-red-500" />
                    )}
                    {fileObj.status === "uploading" && (
                      <div className="h-6 w-6 animate-pulse rounded-full bg-blue-500" />
                    )}
                  </div>

                  {/* Remove Button */}
                  {fileObj.status === "pending" && (
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute left-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* File Info */}
                <div className="space-y-1">
                  <p
                    className="truncate text-sm font-medium"
                    title={fileObj.file.name}
                  >
                    {fileObj.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(fileObj.file.size)}
                  </p>

                  {/* Status & Error */}
                  {fileObj.status === "error" && fileObj.error && (
                    <p className="text-xs text-red-600">{fileObj.error}</p>
                  )}
                  {fileObj.status === "success" && (
                    <p className="text-xs text-green-600">Başarıyla yüklendi</p>
                  )}
                  {fileObj.status === "uploading" && (
                    <p className="text-xs text-blue-600">Yükleniyor...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Duplicate Cards Modal */}
      {showDuplicates && duplicates.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg bg-white">
            <div className="flex items-center justify-between border-b p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Zaten Mevcut Kartlar ({duplicates.length})
              </h3>
              <button
                onClick={() => setShowDuplicates(false)}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <p className="text-sm text-gray-600">
                Aşağıdaki kartlar daha önce sisteme yüklenmiş olduğu için tekrar
                yüklenmedi:
              </p>

              <div className="space-y-4">
                {duplicates.map((duplicate, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4"
                  >
                    {/* Uploaded file info */}
                    <div className="flex-shrink-0">
                      <div className="flex h-20 w-16 items-center justify-center rounded border bg-gray-200">
                        <span className="px-1 text-center text-xs text-gray-500">
                          {duplicate.fileName}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="mb-1 font-medium text-gray-900">
                        Yüklemeye Çalışılan: {duplicate.fileName}
                      </h4>
                      <p className="mb-2 text-sm text-yellow-700">
                        {duplicate.message}
                      </p>

                      <div className="rounded border bg-white p-3">
                        <h5 className="mb-2 text-sm font-medium text-gray-700">
                          Sistemdeki Kart:
                        </h5>
                        <div className="flex items-center space-x-3">
                          {duplicate.existingCard.imageUrl && (
                            <img
                              src={duplicate.existingCard.imageUrl}
                              alt={duplicate.existingCard.name}
                              className="h-16 w-12 rounded border object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {duplicate.existingCard.name}
                            </p>
                            {duplicate.existingCard.series && (
                              <p className="text-xs text-gray-600">
                                Seri: {duplicate.existingCard.series}
                              </p>
                            )}
                            {duplicate.existingCard.character && (
                              <p className="text-xs text-gray-600">
                                Karakter: {duplicate.existingCard.character}
                              </p>
                            )}
                            {duplicate.existingCard.estimatedValue && (
                              <p className="text-xs text-green-600">
                                Değer: ₺
                                {duplicate.existingCard.estimatedValue.toLocaleString()}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              Yükleme:{" "}
                              {new Date(
                                duplicate.existingCard.uploadDate
                              ).toLocaleDateString("tr-TR")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end border-t pt-4">
                <button
                  onClick={() => setShowDuplicates(false)}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  Tamam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
