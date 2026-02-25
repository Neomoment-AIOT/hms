"use client";

import { useState, useEffect, useRef } from "react";
import { FaImage, FaUndo, FaVideo, FaCode, FaImages, FaPlus, FaTimes, FaArrowUp, FaArrowDown } from "react-icons/fa";
import ImageUploadModal from "../../_components/ImageUploadModal";
import {
  getAdminData,
  setAdminData,
  removeAdminData,
  getLocalStorageUsageMB,
  STORAGE_KEYS,
} from "../../_lib/adminStorage";

type MediaType = "image" | "video" | "animation" | "carousel";

interface CarouselItem {
  type: "image" | "video";
  url: string;
}

interface BannerData {
  mediaType: MediaType;
  imageUrl: string;
  videoUrl: string;
  animationHtml: string;
  carouselItems: CarouselItem[];
  carouselInterval: number;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
}

const defaultBanner: BannerData = {
  mediaType: "image",
  imageUrl: "/banner.jpg",
  videoUrl: "",
  animationHtml: "",
  carouselItems: [],
  carouselInterval: 5000,
  titleEn: "Book Your Hotel With Ease Today.",
  titleAr: "احجز فندقك بسهولة اليوم.",
  subtitleEn:
    "Let us help you find the perfect stay for your Hajj and Umrah journey.",
  subtitleAr:
    "دعنا نساعدك في العثور على الإقامة المثالية لرحلة حجك وعمرتك.",
};

const mediaTypeOptions: { value: MediaType; label: string; icon: typeof FaImage; desc: string }[] = [
  { value: "image", label: "Image", icon: FaImage, desc: "A single static banner image" },
  { value: "video", label: "Video", icon: FaVideo, desc: "A looping background video" },
  { value: "animation", label: "Animation", icon: FaCode, desc: "Custom HTML/CSS animation" },
  { value: "carousel", label: "Carousel", icon: FaImages, desc: "Slideshow of images and/or videos" },
];

export default function BannerManagementPage() {
  const [banner, setBanner] = useState<BannerData>(defaultBanner);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<"banner" | number>("banner");
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [storageMB, setStorageMB] = useState(0);
  const carouselVideoRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const refreshStorageUsage = () => setStorageMB(getLocalStorageUsageMB());

  useEffect(() => {
    const stored = getAdminData(STORAGE_KEYS.GLOBAL_BANNER, defaultBanner);
    // Merge with defaults so every field is always defined (never undefined)
    // This prevents uncontrolled → controlled input warnings
    setBanner({ ...defaultBanner, ...stored });
    refreshStorageUsage();
  }, []);

  /** Strip unused media blobs before saving to minimize localStorage footprint */
  const buildSavePayload = (): BannerData => {
    const data = { ...banner };
    // Only keep the media data for the active type
    if (data.mediaType !== "image") {
      data.imageUrl = data.imageUrl.startsWith("data:") ? "" : data.imageUrl; // keep URL paths like "/banner.jpg", strip base64
    }
    if (data.mediaType !== "video") {
      data.videoUrl = "";
    }
    if (data.mediaType !== "animation") {
      data.animationHtml = "";
    }
    if (data.mediaType !== "carousel") {
      data.carouselItems = [];
    }
    return data;
  };

  const handleSave = () => {
    setSaveError("");
    const payload = buildSavePayload();
    const result = setAdminData(STORAGE_KEYS.GLOBAL_BANNER, payload);
    if (result.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setSaveError(result.error);
    }
    refreshStorageUsage();
  };

  const handleReset = () => {
    removeAdminData(STORAGE_KEYS.GLOBAL_BANNER);
    setBanner(defaultBanner);
    setSaveError("");
    refreshStorageUsage();
  };

  const handleImageUpload = (base64: string) => {
    if (uploadTarget === "banner") {
      setBanner((prev) => ({ ...prev, imageUrl: base64 }));
    } else {
      // Carousel image upload
      const index = uploadTarget as number;
      setBanner((prev) => {
        const items = [...prev.carouselItems];
        items[index] = { type: "image", url: base64 };
        return { ...prev, carouselItems: items };
      });
    }
  };

  const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>, target: "banner" | number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setSaveError("Please select a video file.");
      return;
    }
    // Videos are very large as base64 — strongly limit size
    if (file.size > 2 * 1024 * 1024) {
      setSaveError(
        "Video file too large for storage (" +
          (file.size / (1024 * 1024)).toFixed(1) +
          "MB). Use a hosted URL instead of uploading, or use a video under 2MB."
      );
      return;
    }
    setSaveError("");
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (target === "banner") {
        setBanner((prev) => ({ ...prev, videoUrl: base64 }));
      } else {
        const index = target as number;
        setBanner((prev) => {
          const items = [...prev.carouselItems];
          items[index] = { type: "video", url: base64 };
          return { ...prev, carouselItems: items };
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const addCarouselItem = (type: "image" | "video") => {
    setBanner((prev) => ({
      ...prev,
      carouselItems: [...prev.carouselItems, { type, url: "" }],
    }));
  };

  const removeCarouselItem = (index: number) => {
    setBanner((prev) => ({
      ...prev,
      carouselItems: prev.carouselItems.filter((_, i) => i !== index),
    }));
  };

  const moveCarouselItem = (index: number, direction: "up" | "down") => {
    setBanner((prev) => {
      const items = [...prev.carouselItems];
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= items.length) return prev;
      [items[index], items[newIndex]] = [items[newIndex], items[index]];
      return { ...prev, carouselItems: items };
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Homepage Banner
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the hero banner media and text on the homepage.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          <FaUndo size={12} />
          Reset to Default
        </button>
      </div>

      {/* ─── Media Type Selector ─────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Banner Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mediaTypeOptions.map((opt) => {
            const Icon = opt.icon;
            const active = banner.mediaType === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setBanner((prev) => ({ ...prev, mediaType: opt.value }))}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all text-center ${
                  active
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{opt.label}</span>
                <span className="text-xs text-gray-400">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Media Content ───────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        {/* IMAGE */}
        {banner.mediaType === "image" && (
          <div>
            <div className="relative h-64">
              <img
                src={banner.imageUrl}
                alt="Banner Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button
                  onClick={() => {
                    setUploadTarget("banner");
                    setUploadOpen(true);
                  }}
                  className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-white transition-colors shadow"
                >
                  <FaImage size={14} />
                  Replace Image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIDEO */}
        {banner.mediaType === "video" && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video URL
              </label>
              <input
                type="text"
                value={banner.videoUrl || ""}
                onChange={(e) => setBanner((prev) => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="https://example.com/banner-video.mp4"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="text-center text-sm text-gray-400">or</div>
            <div>
              <button
                onClick={() => videoInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-teal-400 transition-colors"
              >
                <FaVideo size={14} />
                Upload Video File (max 2MB)
              </button>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoFile(e, "banner")}
                className="hidden"
              />
            </div>
            {banner.videoUrl && (
              <div className="relative h-48 bg-black rounded-lg overflow-hidden">
                <video
                  src={banner.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* ANIMATION */}
        {banner.mediaType === "animation" && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Animation HTML/CSS
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Paste custom HTML with inline CSS. It will render inside the banner placeholder. Use full width/height styling.
              </p>
              <textarea
                value={banner.animationHtml || ""}
                onChange={(e) => setBanner((prev) => ({ ...prev, animationHtml: e.target.value }))}
                placeholder={`<div style="width:100%;height:100%;background:linear-gradient(135deg,#1F8593,#052E39);display:flex;align-items:center;justify-content:center">\n  <h1 style="color:white;font-size:3rem;animation:pulse 2s infinite">Welcome</h1>\n</div>\n<style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}</style>`}
                rows={10}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            {banner.animationHtml && (
              <div className="relative h-48 bg-gray-900 rounded-lg overflow-hidden">
                <iframe
                  srcDoc={`<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;overflow:hidden}</style></head><body>${banner.animationHtml}</body></html>`}
                  title="Animation Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts"
                />
              </div>
            )}
          </div>
        )}

        {/* CAROUSEL */}
        {banner.mediaType === "carousel" && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Carousel Items</h3>
                <p className="text-xs text-gray-400 mt-0.5">Add images and/or videos that will auto-rotate.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => addCarouselItem("image")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium hover:bg-teal-100 transition-colors"
                >
                  <FaPlus size={10} />
                  Add Image
                </button>
                <button
                  onClick={() => addCarouselItem("video")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                >
                  <FaPlus size={10} />
                  Add Video
                </button>
              </div>
            </div>

            {/* Interval */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Slide Interval (ms)
              </label>
              <input
                type="number"
                value={banner.carouselInterval}
                onChange={(e) => setBanner((prev) => ({ ...prev, carouselInterval: Math.max(1000, parseInt(e.target.value) || 5000) }))}
                min={1000}
                step={500}
                className="w-32 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Items List */}
            {banner.carouselItems.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                No carousel items yet. Add images or videos above.
              </div>
            )}

            <div className="space-y-3">
              {banner.carouselItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  {/* Thumbnail / Preview */}
                  <div className="w-32 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    {item.url ? (
                      item.type === "image" ? (
                        <img src={item.url} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <video src={item.url} muted className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No media
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${item.type === "image" ? "bg-teal-100 text-teal-700" : "bg-blue-100 text-blue-700"}`}>
                        {item.type === "image" ? "Image" : "Video"}
                      </span>
                      <span className="text-xs text-gray-400">Slide {i + 1}</span>
                    </div>

                    {item.type === "image" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setUploadTarget(i);
                            setUploadOpen(true);
                          }}
                          className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          {item.url ? "Replace" : "Upload"} Image
                        </button>
                        <input
                          type="text"
                          value={item.url || ""}
                          onChange={(e) => {
                            setBanner((prev) => {
                              const items = [...prev.carouselItems];
                              items[i] = { ...items[i], url: e.target.value };
                              return { ...prev, carouselItems: items };
                            });
                          }}
                          placeholder="or paste image URL..."
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "video/*";
                            input.onchange = (e) => handleVideoFile(e as unknown as React.ChangeEvent<HTMLInputElement>, i);
                            input.click();
                          }}
                          className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          {item.url ? "Replace" : "Upload"} Video
                        </button>
                        <input
                          type="text"
                          value={item.url || ""}
                          onChange={(e) => {
                            setBanner((prev) => {
                              const items = [...prev.carouselItems];
                              items[i] = { ...items[i], url: e.target.value };
                              return { ...prev, carouselItems: items };
                            });
                          }}
                          placeholder="or paste video URL..."
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Reorder & Delete */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveCarouselItem(i, "up")}
                      disabled={i === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <FaArrowUp size={10} />
                    </button>
                    <button
                      onClick={() => moveCarouselItem(i, "down")}
                      disabled={i === banner.carouselItems.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <FaArrowDown size={10} />
                    </button>
                    <button
                      onClick={() => removeCarouselItem(i)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Text Fields ─────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (English)
            </label>
            <input
              type="text"
              value={banner.titleEn}
              onChange={(e) =>
                setBanner((prev) => ({ ...prev, titleEn: e.target.value }))
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (Arabic)
            </label>
            <input
              type="text"
              value={banner.titleAr}
              onChange={(e) =>
                setBanner((prev) => ({ ...prev, titleAr: e.target.value }))
              }
              dir="rtl"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle (English)
            </label>
            <input
              type="text"
              value={banner.subtitleEn}
              onChange={(e) =>
                setBanner((prev) => ({
                  ...prev,
                  subtitleEn: e.target.value,
                }))
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle (Arabic)
            </label>
            <input
              type="text"
              value={banner.subtitleAr}
              onChange={(e) =>
                setBanner((prev) => ({
                  ...prev,
                  subtitleAr: e.target.value,
                }))
              }
              dir="rtl"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Storage usage indicator */}
        <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
          <span>Storage used: {storageMB}MB / ~5MB</span>
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-xs">
            <div
              className={`h-full rounded-full transition-all ${
                storageMB > 4 ? "bg-red-500" : storageMB > 3 ? "bg-amber-500" : "bg-teal-500"
              }`}
              style={{ width: `${Math.min(100, (storageMB / 5) * 100)}%` }}
            />
          </div>
        </div>

        {/* Save error */}
        {saveError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            <strong>Save failed:</strong> {saveError}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            Save Changes
          </button>
          {saved && (
            <span className="text-sm text-green-600">Saved successfully!</span>
          )}
        </div>
      </div>

      <ImageUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleImageUpload}
        currentImage={
          uploadTarget === "banner"
            ? banner.imageUrl
            : banner.carouselItems[uploadTarget as number]?.url || undefined
        }
        title={uploadTarget === "banner" ? "Replace Banner Image" : `Upload Carousel Image (Slide ${(uploadTarget as number) + 1})`}
      />
    </div>
  );
}
