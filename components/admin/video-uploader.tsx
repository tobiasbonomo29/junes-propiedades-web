"use client"

import { useEffect, useRef, useState } from "react"
import { Video, X } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

const MAX_VIDEO_SIZE = 50 * 1024 * 1024

interface VideoItem {
  url: string
  keep: boolean
}

interface VideoUploaderProps {
  initialVideos: string[]
}

export function VideoUploader({ initialVideos }: VideoUploaderProps) {
  const [videos, setVideos] = useState<VideoItem[]>(
    initialVideos.map((url) => ({ url, keep: true })),
  )
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const form = rootRef.current?.closest("form")
    if (!form) return

    const preventSubmitWhileUploading = (event: SubmitEvent) => {
      if (!isUploading) return
      event.preventDefault()
      setError("Esperá a que termine de subir el video antes de guardar.")
    }

    form.addEventListener("submit", preventSubmitWhileUploading)
    return () => form.removeEventListener("submit", preventSubmitWhileUploading)
  }, [isUploading])

  async function uploadVideos(files: FileList | null) {
    if (!files?.length) return

    setError(null)
    setIsUploading(true)

    try {
      const supabase = createClient()
      const uploadedVideos: VideoItem[] = []

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("video/")) {
          throw new Error("Solo se permiten archivos de video.")
        }

        if (file.size > MAX_VIDEO_SIZE) {
          throw new Error("Cada video debe pesar 50 MB como máximo.")
        }

        const ext = file.name.split(".").pop() || "mp4"
        const filename = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { data, error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(filename, file)

        if (uploadError) throw new Error(uploadError.message)

        const {
          data: { publicUrl },
        } = supabase.storage.from("property-images").getPublicUrl(data.path)

        uploadedVideos.push({ url: publicUrl, keep: true })
      }

      setVideos((current) => [...current, ...uploadedVideos])
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el video.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div ref={rootRef} className="space-y-4">
      <h2 className="text-base font-semibold text-foreground">
        Videos
        {videos.length ? (
          <span className="ml-2 text-sm font-normal text-muted-foreground">({videos.length})</span>
        ) : null}
      </h2>

      <label
        htmlFor="videos_upload"
        className="block cursor-pointer rounded-xl border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/10"
      >
        <Video className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        <span className="block text-sm font-medium text-foreground">
          {isUploading ? "Subiendo video..." : "Hacé clic para seleccionar videos"}
        </span>
        <span className="mt-1 block text-xs text-muted-foreground">
          MP4, WebM o MOV - máximo 50 MB por video
        </span>
      </label>
      <input
        id="videos_upload"
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        multiple
        disabled={isUploading}
        onChange={(event) => uploadVideos(event.currentTarget.files)}
        className="block w-full rounded-md border border-border bg-background p-2 text-sm text-foreground"
      />

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {videos.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {videos.map((video, index) => (
            <div
              key={video.url}
              className="relative overflow-hidden rounded-lg border border-border bg-background"
            >
              {video.keep ? <input type="hidden" name="existing_videos" value={video.url} /> : null}
              <video
                src={video.url}
                controls
                preload="metadata"
                className="aspect-video w-full bg-black object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  setVideos((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, keep: !item.keep } : item,
                    ),
                  )
                }
                className={`absolute right-2 top-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                  video.keep
                    ? "bg-black/75 text-white hover:bg-destructive"
                    : "bg-destructive text-destructive-foreground"
                }`}
              >
                <X className="h-3.5 w-3.5" />
                {video.keep ? "Quitar" : "Quitado"}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
