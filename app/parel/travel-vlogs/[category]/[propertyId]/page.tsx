'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { properties } from '@/app/data/travel-vlogs'
import { PropertyRating } from '@/components/PropertyRating'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { FiStar, FiMapPin, FiPhone, FiMail, FiGlobe, FiHeart, FiShare2, FiWifi, FiCoffee, FiTruck, FiUsers, FiZap, FiArrowLeft, FiCalendar, FiClock, FiDollarSign, FiUser, FiMessageCircle } from 'react-icons/fi'

interface Review {
  id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

function PropertyDetail() {
  const params = useParams()
  const pathname = usePathname()
  const [selectedImage, setSelectedImage] = useState(0)
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'things-to-do' | 'amenities'>('overview')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isZoomed, setIsZoomed] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [propertyRating, setPropertyRating] = useState<{ rating: number; count: number } | null>(null)
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)
  const supabase = createClientComponentClient()
  
  // Extract society from pathname
  const getSocietyFromPath = () => {
    const pathParts = pathname.split('/')
    return pathParts[1] || 'parel'
  }

  const currentSociety = getSocietyFromPath()
  const propertyId = params.propertyId as string
  
  // Find the property
  const property = properties.find(p => p.id === propertyId)

  // Fetch reviews and rating from Supabase
  useEffect(() => {
    const fetchReviews = async () => {
      if (!property) return
      
      setIsLoadingReviews(true)
      try {
        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('property_reviews')
          .select('*')
          .eq('property_id', propertyId)
          .order('created_at', { ascending: false })

        if (false) {
          // console.error('Error fetching reviews:', reviewsError)
        } else if (reviewsData) {
          setReviews(reviewsData)
        }

        // Calculate average rating
        if (reviewsData && reviewsData.length > 0) {
          const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0)
          setPropertyRating({
            rating: totalRating / reviewsData.length,
            count: reviewsData.length
          })
        } else {
          setPropertyRating(null)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setIsLoadingReviews(false)
      }
    }

    fetchReviews()
  }, [propertyId, property, supabase])

  const handleReviewAdded = () => {
    // Refresh reviews after a new review is added
    const fetchReviews = async () => {
      try {
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('property_reviews')
          .select('*')
          .eq('property_id', propertyId)
          .order('created_at', { ascending: false })

        if (!reviewsError && reviewsData) {
          setReviews(reviewsData)
          
          // Update rating
          if (reviewsData.length > 0) {
            const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0)
            setPropertyRating({
              rating: totalRating / reviewsData.length,
              count: reviewsData.length
            })
          }
        }
      } catch (error) {
        console.error('Error refreshing reviews:', error)
      }
    }

    fetchReviews()
  }
  
  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h1>
            <Link href={`/${currentSociety}/travel-vlogs`} className="text-indigo-600 hover:text-indigo-500">
              ← Back to Properties
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Keyboard navigation for photo modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showAllPhotos) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (!isZoomed) {
            setSelectedImage(selectedImage === 0 ? property.images.length - 1 : selectedImage - 1);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (!isZoomed) {
            setSelectedImage(selectedImage === property.images.length - 1 ? 0 : selectedImage + 1);
          }
          break;
        case 'Escape':
          event.preventDefault();
          if (isZoomed) {
            setZoomLevel(1);
            setIsZoomed(false);
          } else {
            setShowAllPhotos(false);
          }
          break;
        case '+':
        case '=':
          event.preventDefault();
          if (zoomLevel < 3) {
            setZoomLevel(zoomLevel + 0.5);
            setIsZoomed(true);
          }
          break;
        case '-':
          event.preventDefault();
          if (zoomLevel > 1) {
            setZoomLevel(zoomLevel - 0.5);
            setIsZoomed(zoomLevel - 0.5 > 1);
          }
          break;
      }
    };

    if (showAllPhotos) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset'; // Restore scrolling
    };
  }, [showAllPhotos, selectedImage, property?.images.length, zoomLevel, isZoomed]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
              ? 'text-yellow-400 fill-current opacity-50' 
              : 'text-gray-300'
        }`}
      />
    ));
  };

  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes('wifi')) return <FiWifi className="w-5 h-5" />;
    if (amenity.toLowerCase().includes('restaurant') || amenity.toLowerCase().includes('dining')) return <FiCoffee className="w-5 h-5" />;
    if (amenity.toLowerCase().includes('parking')) return <FiTruck className="w-5 h-5" />;
    if (amenity.toLowerCase().includes('pool') || amenity.toLowerCase().includes('spa')) return <FiUsers className="w-5 h-5" />;
    return <FiZap className="w-5 h-5" />;
  };

  const handleImageClick = () => {
    console.log('Image clicked, current zoom level:', zoomLevel, 'isZoomed:', isZoomed);
    if (isZoomed) {
      setZoomLevel(1);
      setIsZoomed(false);
    } else {
      setZoomLevel(2);
      setIsZoomed(true);
    }
  };

  const handleZoomIn = () => {
    console.log('Zoom in clicked, current level:', zoomLevel);
    if (zoomLevel < 3) {
      setZoomLevel(zoomLevel + 0.5);
      setIsZoomed(true);
    }
  };

  const handleZoomOut = () => {
    console.log('Zoom out clicked, current level:', zoomLevel);
    if (zoomLevel > 1) {
      setZoomLevel(zoomLevel - 0.5);
      setIsZoomed(zoomLevel - 0.5 > 1);
    }
  };

  const resetZoom = () => {
    console.log('Resetting zoom');
    setZoomLevel(1);
    setIsZoomed(false);
  };

  const openPhotoModal = () => {
    console.log('Opening photo modal, showAllPhotos:', showAllPhotos);
    setShowAllPhotos(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href={`/${currentSociety}/travel-vlogs`} className="hover:text-indigo-600">
                Properties
              </Link>
              <span>→</span>
              <Link href={`/${currentSociety}/travel-vlogs/${property.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-indigo-600">
                {property.category}
              </Link>
              <span>→</span>
              <span className="text-gray-900 font-medium">{property.title}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Property Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    {propertyRating && typeof propertyRating.count === 'number' && propertyRating.count > 0 && (
                      <>
                        {renderStars(propertyRating.rating)}
                        <span className="text-lg font-semibold text-gray-900">{propertyRating.rating.toFixed(1)}</span>
                        <span className="text-gray-600">({propertyRating.count} reviews)</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiMapPin className="w-5 h-5" />
                    <span>{property.address}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                  <FiHeart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                  <FiShare2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FiDollarSign className="w-4 h-4" />
                <span className="font-semibold text-lg text-gray-900">{property.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="w-4 h-4" />
                <span>{property.availability}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="w-4 h-4" />
                <span>{property.propertyType}</span>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <div 
                  className="relative h-96 rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => {
                    console.log('Main image container clicked');
                    openPhotoModal();
                  }}
                >
                  <img 
                    src={property.images[selectedImage]} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                    onError={(e) => {
                      console.log('Image failed to load:', e.currentTarget.src);
                      e.currentTarget.src = 'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Property+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-lg font-medium">
                      Click to view gallery
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {property.images.slice(1, 5).map((image, index) => (
                  <div 
                    key={index} 
                    className="relative h-44 rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => {
                      console.log('Thumbnail container clicked, index:', index + 1);
                      setSelectedImage(index + 1);
                      openPhotoModal();
                    }}
                  >
                    <img 
                      src={image} 
                      alt={`${property.title} ${index + 2}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                      onError={(e) => {
                        console.log('Thumbnail failed to load:', e.currentTarget.src);
                        e.currentTarget.src = 'https://via.placeholder.com/400x300/f3f4f6/6b7280?text=Property+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium">
                        View
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'reviews', label: `Reviews (${propertyRating?.count || 0})` },
                  { id: 'things-to-do', label: 'Things to Do' },
                  { id: 'amenities', label: 'Amenities' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About this property</h2>
                  <p className="text-gray-700 mb-6 leading-relaxed">{property.description}</p>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {property.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Property Type:</span>
                        <span className="ml-2 font-medium">{property.propertyType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Size:</span>
                        <span className="ml-2 font-medium">{property.size}</span>
                      </div>
                      {property.bedrooms && (
                        <div>
                          <span className="text-gray-600">Bedrooms:</span>
                          <span className="ml-2 font-medium">{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div>
                          <span className="text-gray-600">Bathrooms:</span>
                          <span className="ml-2 font-medium">{property.bathrooms}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Community Reviews</h2>
                    <PropertyRating
                      propertyId={propertyId}
                      propertyName={property.title}
                      onRatingAdded={handleReviewAdded}
                    />
                  </div>
                  
                  {isLoadingReviews ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading reviews...</p>
                    </div>
                  ) : reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-200 pb-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                              <FiUser className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                                <div className="flex items-center gap-1">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.created_at).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              <p className="text-gray-700 mb-3">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-6xl mb-4">💬</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
                      <p className="text-gray-600">Be the first to review this property!</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'things-to-do' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Things to Do</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.thingsToDo.map((activity, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FiZap className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{activity}</h4>
                            <p className="text-sm text-gray-600">Available on-site</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'amenities' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities & Services</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        {getAmenityIcon(amenity)}
                        <span className="font-medium text-gray-900">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{property.price}</div>
                  <div className="text-sm text-gray-600">per night</div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    Book Now
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    Contact Host
                  </button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiPhone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{property.contactInfo.phone}</span>
                    </div>
                    {property.contactInfo.email && (
                      <div className="flex items-center gap-3">
                        <FiMail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{property.contactInfo.email}</span>
                      </div>
                    )}
                    {property.contactInfo.website && (
                      <div className="flex items-center gap-3">
                        <FiGlobe className="w-4 h-4 text-gray-500" />
                        <a href={`https://${property.contactInfo.website}`} className="text-sm text-indigo-600 hover:text-indigo-500">
                          {property.contactInfo.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <FiMapPin className="w-5 h-5 text-indigo-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-700">{property.address}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Coordinates: {property.location.latitude}, {property.location.longitude}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full text-indigo-600 text-sm font-medium hover:text-indigo-500">
                    View on Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Modal */}
        {showAllPhotos && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-[9999] flex items-center justify-center p-4">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button - Always visible */}
              <button 
                onClick={() => {
                  console.log('Close button clicked');
                  setShowAllPhotos(false);
                  resetZoom();
                }}
                className="absolute top-6 right-6 z-50 text-white hover:text-gray-300 transition-colors bg-red-600 hover:bg-red-700 p-3 rounded-full shadow-lg"
                style={{ minWidth: '48px', minHeight: '48px' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Photo Counter */}
              <div className="absolute top-6 left-6 z-20 text-white text-sm font-medium bg-black/70 p-3 rounded-lg">
                {selectedImage + 1} of {property.images.length}
              </div>

              {/* Zoom Controls */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2 bg-black/70 rounded-lg px-4 py-3">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="text-white hover:text-gray-300 transition-colors disabled:text-gray-500 disabled:cursor-not-allowed p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-white text-sm font-medium min-w-[3rem] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="text-white hover:text-gray-300 transition-colors disabled:text-gray-500 disabled:cursor-not-allowed p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                {isZoomed && (
                  <button
                    onClick={resetZoom}
                    className="text-white hover:text-gray-300 transition-colors ml-2 p-1"
                    title="Reset zoom"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Main Image */}
              <div className="relative max-w-4xl w-full h-full flex items-center justify-center overflow-hidden">
                <img 
                  src={property.images[selectedImage]} 
                  alt={`${property.title} ${selectedImage + 1}`}
                  className={`transition-transform duration-300 cursor-zoom-in ${isZoomed ? 'cursor-zoom-out' : ''}`}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    maxWidth: isZoomed ? 'none' : '100%',
                    maxHeight: isZoomed ? 'none' : '100%',
                    objectFit: isZoomed ? 'none' : 'contain'
                  }}
                  onClick={handleImageClick}
                  onError={(e) => {
                    console.log('Modal image failed to load:', e.currentTarget.src);
                    e.currentTarget.src = 'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Property+Image';
                  }}
                />
              </div>

              {/* Navigation Arrows - Only show when not zoomed */}
              {!isZoomed && (
                <>
                  <button 
                    onClick={() => {
                      setSelectedImage(selectedImage === 0 ? property.images.length - 1 : selectedImage - 1);
                      resetZoom();
                    }}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 text-white hover:text-gray-300 transition-colors p-3 bg-black/70 rounded-full"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button 
                    onClick={() => {
                      setSelectedImage(selectedImage === property.images.length - 1 ? 0 : selectedImage + 1);
                      resetZoom();
                    }}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 text-white hover:text-gray-300 transition-colors p-3 bg-black/70 rounded-full"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Thumbnail Navigation - Only show when not zoomed */}
              {!isZoomed && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="flex gap-2">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImage(index);
                          resetZoom();
                        }}
                        className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          selectedImage === index 
                            ? 'border-white' 
                            : 'border-transparent hover:border-white/50'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/64x48/f3f4f6/6b7280?text=Image';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Zoom Instructions */}
              {!isZoomed && (
                <div className="absolute bottom-6 right-6 z-20 text-white/70 text-sm bg-black/70 p-3 rounded-lg">
                  Click image to zoom • Use + / - keys
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default PropertyDetail 