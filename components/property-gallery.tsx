"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"

interface PropertyGalleryProps {
  images: string[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const allImages = images?.length > 0 ? images : [DEFAULT_IMAGE]
  const [currentIndex, setCurrentIndex] = useState(0)

  const prev = () => setCurrentIndex((i) => (i === 0 ? allImages.length - 1 : i - 1))
  const next = () => setCurrentIndex((i) => (i === allImages.length - 1 ? 0 : i + 1))

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-muted">
        <img
          src={allImages[currentIndex]}
          alt={`${title} - imagen ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {allImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs text-foreground">
              {currentIndex + 1} / {allImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                i === currentIndex
                  ? "border-primary shadow-[0_0_10px_rgba(0,194,122,0.4)]"
                  : "border-border hover:border-primary/50"
              }`}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <img
                src={img}
                alt={`${title} - miniatura ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
