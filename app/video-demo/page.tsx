'use client'

import React from 'react'
import VideoEmbed from '@/components/VideoEmbed'
import VideoPlayer from '@/components/VideoPlayer'
import UniversalVideoPlayer from '@/components/UniversalVideoPlayer'
import Header from '@/components/Header'

export default function VideoDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Video Embedding Options</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore different ways to embed videos on your homepage. Users can click to play without expanding the container.
          </p>
        </div>

        {/* YouTube Videos */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">YouTube Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <VideoEmbed
              videoId="Yj-uofiMN7Q"
              title="Your Specific Video"
              className="w-full h-48"
            />
            <VideoEmbed
              videoId="dQw4w9WgXcQ"
              title="Sample YouTube Video 1"
              className="w-full h-48"
            />
            <VideoEmbed
              videoId="jNQXAC9IVRw"
              title="Sample YouTube Video 2"
              className="w-full h-48"
            />
          </div>
        </section>

        {/* Self-Hosted Videos */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Self-Hosted Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VideoPlayer
              src="/videos/sample-video.mp4"
              poster="/images/video-thumbnail.jpg"
              title="Sample Self-Hosted Video"
              className="w-full h-64"
            />
            <VideoPlayer
              src="/videos/community-highlight.mp4"
              title="Community Highlight Video"
              className="w-full h-64"
            />
          </div>
        </section>

        {/* Universal Video Player */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Universal Video Player</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UniversalVideoPlayer
              src="https://www.youtube.com/watch?v=Yj-uofiMN7Q"
              title="Your Specific Video via Universal Player"
              platform="youtube"
              className="w-full h-48"
            />
            <UniversalVideoPlayer
              src="https://vimeo.com/148751763"
              title="Vimeo via Universal Player"
              platform="vimeo"
              className="w-full h-48"
            />
            <UniversalVideoPlayer
              src="/videos/sample-video.mp4"
              title="Self-Hosted via Universal Player"
              platform="self-hosted"
              className="w-full h-48"
            />
          </div>
        </section>

        {/* Usage Examples */}
        <section className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Usage Examples</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">YouTube Video</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<VideoEmbed
  videoId="Yj-uofiMN7Q"
  title="Your Video Title"
  className="w-full h-64"
/>`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Self-Hosted Video</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<VideoPlayer
  src="/videos/your-video.mp4"
  poster="/images/thumbnail.jpg"
  title="Your Video Title"
  className="w-full h-64"
/>`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Universal Player</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<UniversalVideoPlayer
  src="https://www.youtube.com/watch?v=Yj-uofiMN7Q"
  title="Your Video Title"
  platform="youtube"
  className="w-full h-64"
/>`}
              </pre>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-2xl mb-3">🎬</div>
              <h3 className="text-lg font-semibold mb-2">Click to Play</h3>
              <p className="text-gray-600">Videos show a thumbnail with play button. Click to start playing without expanding.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-2xl mb-3">📱</div>
              <h3 className="text-lg font-semibold mb-2">Responsive Design</h3>
              <p className="text-gray-600">All video components are fully responsive and work on mobile and desktop.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-purple-600 text-2xl mb-3">🔧</div>
              <h3 className="text-lg font-semibold mb-2">Multiple Platforms</h3>
              <p className="text-gray-600">Support for YouTube, Vimeo, and self-hosted videos with unified interface.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-orange-600 text-2xl mb-3">🎨</div>
              <h3 className="text-lg font-semibold mb-2">Customizable</h3>
              <p className="text-gray-600">Custom thumbnails, titles, and styling options available.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-red-600 text-2xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Performance Optimized</h3>
              <p className="text-gray-600">Lazy loading and optimized for fast page loads.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 text-2xl mb-3">♿</div>
              <h3 className="text-lg font-semibold mb-2">Accessible</h3>
              <p className="text-gray-600">Built with accessibility in mind, including keyboard navigation.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 