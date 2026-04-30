"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Images } from "lucide-react"
import Image from "next/image"

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
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_120px]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-muted shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <Image
          key={allImages[currentIndex]}
          src={allImages[currentIndex]}
          alt={`${title} - imagen ${currentIndex + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="h-full w-full object-cover animate-in fade-in duration-500"
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/75 to-transparent" />

        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-background/75 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
          <Images className="h-3.5 w-3.5 text-primary" />
          {currentIndex + 1} / {allImages.length}
        </div>

        {allImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-sm transition-all hover:border-primary hover:text-primary"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-sm transition-all hover:border-primary hover:text-primary"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 lg:max-h-[min(620px,64vw)] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 lg:pr-1">
          {allImages.map((img, i) => (
            <button
              key={img}
              onClick={() => setCurrentIndex(i)}
              className={`relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg border transition-all duration-200 lg:h-20 lg:w-full ${
                i === currentIndex
                  ? "border-primary shadow-[0_0_16px_rgba(0,194,122,0.35)]"
                  : "border-border opacity-70 hover:border-primary/60 hover:opacity-100"
              }`}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${title} - miniatura ${i + 1}`}
                fill
                sizes="120px"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
