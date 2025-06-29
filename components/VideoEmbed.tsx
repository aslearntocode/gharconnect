'use client'

import React, { useState } from 'react'

interface VideoEmbedProps {
  videoId: string
  title: string
  thumbnail?: string
  width?: string
  height?: string
  className?: string
}

export default function VideoEmbed({ 
  videoId, 
  title, 
  thumbnail, 
  width = "100%", 
  height = "315",
  className = ""
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const defaultThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  const fallbackThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  const handlePlay = () => {
    setIsPlaying(true)
  }

  if (isPlaying) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>
    )
  }

  return (
    <div 
      className={`relative cursor-pointer group ${className}`} 
      style={{ width, height }}
      onClick={handlePlay}
    >
      <img
        src={thumbnail || defaultThumbnail}
        alt={title}
        className="w-full h-full object-cover rounded-lg"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          if (target.src !== fallbackThumbnail) {
            target.src = fallbackThumbnail
          }
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
        <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:bg-opacity-100 transition-all duration-300">
          <svg className="w-8 h-8 text-red-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="text-lg font-semibold drop-shadow-lg">{title}</h3>
        <p className="text-sm opacity-90">Click to play</p>
      </div>
    </div>
  )
} 