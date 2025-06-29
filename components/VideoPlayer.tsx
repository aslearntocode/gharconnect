'use client'

import React, { useState, useRef } from 'react'

interface VideoPlayerProps {
  src: string
  poster?: string
  title: string
  width?: string
  height?: string
  className?: string
  controls?: boolean
}

export default function VideoPlayer({ 
  src, 
  poster, 
  title, 
  width = "100%", 
  height = "315",
  className = "",
  controls = true
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={controls}
        className="w-full h-full object-cover rounded-lg"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        Your browser does not support the video tag.
      </video>
      
      {!isPlaying && (
        <div 
          className="absolute inset-0 cursor-pointer group"
          onClick={handlePlay}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
            <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:bg-opacity-100 transition-all duration-300">
              <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg font-semibold drop-shadow-lg">{title}</h3>
            <p className="text-sm opacity-90">Click to play</p>
          </div>
        </div>
      )}
    </div>
  )
} 