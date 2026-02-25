"use client";

import { useState, useRef } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (base64: string) => void;
  currentImage?: string;
  title?: string;
}

/** Compress an image via canvas. Returns a JPEG/WebP base64 string ≤ maxKB. */
function compressImage(
  file: File,
  maxWidth = 1920,
  maxKB = 300
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.onload = () => {
        // Scale down if wider than maxWidth
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first (smaller), fall back to JPEG
        const formats: [string, string][] = [
          ["image/webp", "webp"],
          ["image/jpeg", "jpeg"],
        ];

        for (const [mime] of formats) {
          // Start at quality 0.85, step down until under maxKB
          for (let q = 0.85; q >= 0.3; q -= 0.1) {
            const dataUrl = canvas.toDataURL(mime, q);
            const sizeKB = (dataUrl.length * 0.75) / 1024; // base64 → bytes approx
            if (sizeKB <= maxKB) {
              resolve(dataUrl);
              return;
            }
          }
        }

        // If still too large at lowest quality, return lowest JPEG anyway
        resolve(canvas.toDataURL("image/jpeg", 0.3));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
  currentImage,
  title = "Upload Image",
}: ImageUploadModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [previewSizeKB, setPreviewSizeKB] = useState<number>(0);
  const [error, setError] = useState("");
  const [compressing, setCompressing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // Validate file size (10MB raw limit — compression will handle the rest)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }

    setCompressing(true);
    try {
      const compressed = await compressImage(file, 1920, 300);
      const sizeKB = Math.round((compressed.length * 0.75) / 1024);
      setPreview(compressed);
      setPreviewSizeKB(sizeKB);
    } catch {
      setError("Failed to process image. Try a different file.");
    } finally {
      setCompressing(false);
    }
  };

  const handleConfirm = () => {
    if (preview) {
      onUpload(preview);
      setPreview(null);
      setPreviewSizeKB(0);
      onClose();
    }
  };

  const handleClose = () => {
    setPreview(null);
    setPreviewSizeKB(0);
    setError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current image */}
          {currentImage && !preview && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Current Image</p>
              <img
                src={currentImage}
                alt="Current"
                className="w-full h-40 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500">Compressed Preview</p>
                <span className="text-xs text-gray-400">{previewSizeKB}KB</span>
              </div>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          {/* Compressing indicator */}
          {compressing && (
            <div className="mb-4 text-center py-4">
              <div className="inline-block w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 mt-2">Compressing image...</p>
            </div>
          )}

          {/* Upload area */}
          {!compressing && (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-teal-400 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <FaUpload className="mx-auto text-gray-400 mb-2" size={24} />
              <p className="text-sm text-gray-600">
                Click to select an image
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG, WebP supported. Auto-compressed for storage.
              </p>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!preview || compressing}
            className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
