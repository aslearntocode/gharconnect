'use client';

import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiPlay, FiClock, FiShare } from 'react-icons/fi';

interface TestimonialVideo {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  duration?: string;
  source?: string;
}

const testimonialVideos: TestimonialVideo[] = [
  {
    id: '1',
    title: 'GharConnect Reviews - Why our customers love us',
    videoUrl: '/testimonial/User_1.mp4',
    duration: '2:45',
    source: 'YouTube'
  },
  // Add more testimonial videos here as needed
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialVideos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialVideos.length) % testimonialVideos.length);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="w-full bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Customers Love Us
          </h2>
        </div>

        {/* Video Carousel */}
        <div className="relative">
          {/* Main Video Player */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
              {/* Video Player */}
              <div className="relative aspect-video">
                {isPlaying ? (
                  <video
                    src={testimonialVideos[currentIndex].videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center relative overflow-hidden">
                    {/* Video Thumbnail Background */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url('/House_IMG.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {/* Overlay for better text readability */}
                      <div className="absolute inset-0 bg-black/40"></div>
                    </div>
                    
                    {/* Fallback gradient if image doesn't load */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-80"></div>
                    
                    {/* Play Button Overlay */}
                    <button
                      onClick={handlePlay}
                      className="absolute inset-0 w-full h-full flex items-center justify-center group"
                    >
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-red-700 transition-colors duration-200 group-hover:scale-110">
                        <FiPlay className="w-10 h-10 md:w-12 md:h-12 text-white ml-1" />
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Video Info Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">%</span>
                  </div>
                  <span className="text-white text-sm font-medium">
                    {testimonialVideos[currentIndex].title}
                  </span>
                </div>
              </div>

              {/* Video Source */}
              <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                <span className="text-white text-sm">Watch on</span>
                <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                  YouTube
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {testimonialVideos.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 md:p-3 transition-all duration-200"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 md:p-3 transition-all duration-200"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Text Testimonials Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mt-8">
          {[
            {
              name: 'Kritika Desai',
              rating: 5,
              headline: 'Helps us to find good properties',
              text: 'The site really helps us to find good properties in the least amount of time without any headache of brokerage. I was so scared in Mumbai due to the issues of high deposit as well as brokerage. But then I found GharConnect - its hassle free and easy to use.'
            },
            {
              name: 'Mona Singh',
              rating: 5,
              headline: "It's a nice experience",
              text: 'It was a nice experience with GharConnect. They helped me to find a new home to stay without any brokerage. Thankfully GharConnect helped me to get one with fully furnished rooms.'
            },
            {
              name: 'Rajesh Kumar',
              rating: 5,
              headline: 'Listed my property at GharConnect',
              text: 'The process to list was super easy and the team was professional. Gold package helped me get the property rented in no time.'
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <div className="flex items-center space-x-1 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <h5 className="font-bold text-gray-900 mb-2">{testimonial.headline}</h5>
              <p className="text-gray-600 text-sm leading-relaxed">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 