'use client'

import React, { useState } from 'react'

interface UniversalVideoPlayerProps {
  src: string
  title: string
  thumbnail?: string
  width?: string
  height?: string
  className?: string
  platform?: 'youtube' | 'vimeo' | 'self-hosted'
}

export default function UniversalVideoPlayer({ 
  src, 
  title, 
  thumbnail, 
  width = "100%", 
  height = "315",
  className = "",
  platform = 'youtube'
}: UniversalVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  // Extract video ID from different URL formats
  const getVideoId = (url: string, platform: string) => {
    if (platform === 'youtube') {
      const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
      return match ? match[1] : null
    }
    if (platform === 'vimeo') {
      const match = url.match(/vimeo\.com\/(\d+)/)
      return match ? match[1] : null
    }
    return null
  }

  const videoId = getVideoId(src, platform)
  
  const getThumbnail = () => {
    if (thumbnail) return thumbnail
    
    if (platform === 'youtube' && videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
    if (platform === 'vimeo' && videoId) {
      // Vimeo requires API call for thumbnails, using placeholder for now
      return `https://vumbnail.com/${videoId}.jpg`
    }
    return '/images/video-placeholder.jpg'
  }

  const getEmbedUrl = () => {
    if (platform === 'youtube' && videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    }
    if (platform === 'vimeo' && videoId) {
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`
    }
    return src
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  if (isPlaying) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        {platform === 'self-hosted' ? (
          <video
            src={src}
            poster={thumbnail}
            controls
            autoPlay
            className="w-full h-full object-cover rounded-lg"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            width="100%"
            height="100%"
            src={getEmbedUrl()}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        )}
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
        src={getThumbnail()}
        alt={title}
        className="w-full h-full object-cover rounded-lg"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = '/images/video-placeholder.jpg'
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
      {platform !== 'self-hosted' && (
        <div className="absolute top-4 right-4">
          <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
            {platform === 'youtube' ? 'YouTube' : 'Vimeo'}
          </div>
        </div>
      )}
    </div>
  )
} 