"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────
export type BannerMediaType = "image" | "video" | "animation" | "carousel";

export interface CarouselItem {
  type: "image" | "video";
  url: string;
}

export interface BannerMediaConfig {
  mediaType: BannerMediaType;
  // Single image
  imageUrl?: string;
  // Single video
  videoUrl?: string;
  // Lottie/CSS animation (HTML string or Lottie JSON URL)
  animationHtml?: string;
  // Carousel items (images and/or videos)
  carouselItems?: CarouselItem[];
  carouselInterval?: number; // ms between slides, default 5000
}

interface BannerMediaProps {
  config: BannerMediaConfig;
  className?: string;
}

// ─── Placeholder ────────────────────────────────────────────
// Solid color placeholder that matches the banner area so nothing
// bleeds outside or shows half-loaded content
function Placeholder() {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#052E39]" />
  );
}

// ─── Single Image (eager, no lazy-load) ─────────────────────
function BannerImage({
  src,
  onReady,
}: {
  src: string;
  onReady: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Preload the image eagerly
    const img = new Image();
    img.src = src;
    if (img.complete) {
      setLoaded(true);
      onReady();
    } else {
      img.onload = () => {
        setLoaded(true);
        onReady();
      };
      img.onerror = () => {
        setLoaded(true);
        onReady();
      };
    }
  }, [src, onReady]);

  return (
    <>
      {!loaded && <Placeholder />}
      <img
        src={src}
        alt="Banner"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        fetchPriority="high"
        decoding="sync"
      />
    </>
  );
}

// ─── Single Video (eager, no lazy-load) ─────────────────────
function BannerVideo({
  src,
  onReady,
}: {
  src: string;
  onReady: () => void;
}) {
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCanPlay = useCallback(() => {
    setReady(true);
    onReady();
  }, [onReady]);

  return (
    <>
      {!ready && <Placeholder />}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlayThrough={handleCanPlay}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}

// ─── Animation (HTML/CSS injected) ──────────────────────────
function BannerAnimation({
  html,
  onReady,
}: {
  html: string;
  onReady: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Give the iframe a tick to render, then signal ready
    const timer = setTimeout(() => {
      setLoaded(true);
      onReady();
    }, 100);
    return () => clearTimeout(timer);
  }, [html, onReady]);

  const wrappedHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden;background:#052E39}
</style></head><body>${html}</body></html>`;

  return (
    <>
      {!loaded && <Placeholder />}
      <iframe
        ref={iframeRef}
        srcDoc={wrappedHtml}
        title="Banner Animation"
        className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        sandbox="allow-scripts allow-same-origin"
        loading="eager"
      />
    </>
  );
}

// ─── Carousel ───────────────────────────────────────────────
function BannerCarousel({
  items,
  interval = 5000,
  onReady,
}: {
  items: CarouselItem[];
  interval?: number;
  onReady: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [preloaded, setPreloaded] = useState(false);
  const [readyItems, setReadyItems] = useState<Set<number>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  // Preload all carousel items before showing anything
  const markItemReady = useCallback(
    (index: number) => {
      setReadyItems((prev) => {
        const next = new Set(prev);
        next.add(index);
        // If first item is ready, we can show the carousel
        if (next.has(0) && !preloaded) {
          setPreloaded(true);
          onReady();
        }
        return next;
      });
    },
    [onReady, preloaded]
  );

  // Auto-advance slides
  useEffect(() => {
    if (!preloaded || items.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [preloaded, items.length, interval]);

  if (items.length === 0) {
    return <Placeholder />;
  }

  return (
    <>
      {!preloaded && <Placeholder />}

      {/* Render ALL items stacked, only the active one is visible */}
      {items.map((item, i) => (
        <div
          key={i}
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
            preloaded && i === activeIndex ? "opacity-100 z-[1]" : "opacity-0 z-0"
          }`}
        >
          {item.type === "image" ? (
            <CarouselImage src={item.url} onReady={() => markItemReady(i)} />
          ) : (
            <CarouselVideo src={item.url} onReady={() => markItemReady(i)} />
          )}
        </div>
      ))}

      {/* Dots indicator */}
      {preloaded && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[2] flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i);
                // Reset timer on manual navigation
                if (timerRef.current) clearInterval(timerRef.current);
                timerRef.current = setInterval(() => {
                  setActiveIndex((prev) => (prev + 1) % items.length);
                }, interval);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}

function CarouselImage({
  src,
  onReady,
}: {
  src: string;
  onReady: () => void;
}) {
  useEffect(() => {
    const img = new Image();
    img.src = src;
    if (img.complete) {
      onReady();
    } else {
      img.onload = onReady;
      img.onerror = onReady;
    }
  }, [src, onReady]);

  return (
    <img
      src={src}
      alt="Banner slide"
      className="absolute inset-0 w-full h-full object-cover"
      fetchPriority="high"
      decoding="sync"
    />
  );
}

function CarouselVideo({
  src,
  onReady,
}: {
  src: string;
  onReady: () => void;
}) {
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onCanPlayThrough={onReady}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

// ─── Main BannerMedia Component ─────────────────────────────
export default function BannerMedia({ config, className = "" }: BannerMediaProps) {
  const [mediaReady, setMediaReady] = useState(false);
  const [prevConfig, setPrevConfig] = useState<BannerMediaConfig | null>(null);
  const [swapping, setSwapping] = useState(false);

  const handleReady = useCallback(() => {
    setMediaReady(true);
    // If we were swapping, end the swap after the new media is ready
    if (swapping) {
      setSwapping(false);
    }
  }, [swapping]);

  // Detect config changes for seamless swapping
  useEffect(() => {
    if (prevConfig && JSON.stringify(prevConfig) !== JSON.stringify(config)) {
      // Config changed → begin swap: keep showing old content via placeholder
      setSwapping(true);
      setMediaReady(false);
    }
    setPrevConfig(config);
  }, [config]);

  const renderMedia = () => {
    switch (config.mediaType) {
      case "image":
        return (
          <BannerImage
            src={config.imageUrl || "/banner.jpg"}
            onReady={handleReady}
          />
        );
      case "video":
        return (
          <BannerVideo
            src={config.videoUrl || ""}
            onReady={handleReady}
          />
        );
      case "animation":
        return (
          <BannerAnimation
            html={config.animationHtml || ""}
            onReady={handleReady}
          />
        );
      case "carousel":
        return (
          <BannerCarousel
            items={config.carouselItems || []}
            interval={config.carouselInterval || 5000}
            onReady={handleReady}
          />
        );
      default:
        return <Placeholder />;
    }
  };

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
    >
      {/* Always show placeholder underneath until media is ready */}
      {(!mediaReady || swapping) && <Placeholder />}
      {renderMedia()}
    </div>
  );
}
