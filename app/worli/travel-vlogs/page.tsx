'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { properties, getPropertyLink } from '@/app/data/travel-vlogs'
import { FiStar, FiMapPin, FiPhone, FiMail, FiGlobe, FiHeart, FiShare2, FiWifi, FiCoffee, FiTruck, FiUsers, FiZap } from 'react-icons/fi'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

function PropertyShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'name'>('rating')
  const pathname = usePathname()
  const supabase = createClientComponentClient()
  const [propertyReviews, setPropertyReviews] = useState<Record<string, { rating: number; count: number }>>({})
  
  // Extract society from pathname
  const getSocietyFromPath = () => {
    const pathParts = pathname.split('/')
    return pathParts[1] || 'worli'
  }

  const currentSociety = getSocietyFromPath()
  
  // Get unique categories from properties
  const uniqueCategories = Array.from(new Set(properties.map(property => property.category)));
  const categories = ['all', ...uniqueCategories];
  
  const filteredProperties = properties
    .filter(property => {
      const matchesCategory = selectedCategory === 'all' || property.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, ''));
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Fetch review data for all properties
  useEffect(() => {
    const fetchAllReviews = async () => {
      const { data, error } = await supabase
        .from('property_reviews')
        .select('property_id, rating')
      if (!error && data) {
        const reviewMap: Record<string, { rating: number; count: number }> = {}
        data.forEach((review: any) => {
          if (!reviewMap[review.property_id]) {
            reviewMap[review.property_id] = { rating: 0, count: 0 }
          }
          reviewMap[review.property_id].rating += review.rating
          reviewMap[review.property_id].count += 1
        })
        // Calculate average
        Object.keys(reviewMap).forEach(pid => {
          reviewMap[pid].rating = reviewMap[pid].rating / reviewMap[pid].count
        })
        setPropertyReviews(reviewMap)
      }
    }
    fetchAllReviews()
  }, [supabase])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${
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
    if (amenity.toLowerCase().includes('wifi')) return <FiWifi className="w-4 h-4" />;
    if (amenity.toLowerCase().includes('restaurant') || amenity.toLowerCase().includes('dining')) return <FiCoffee className="w-4 h-4" />;
    if (amenity.toLowerCase().includes('parking')) return <FiTruck className="w-4 h-4" />;
    if (amenity.toLowerCase().includes('pool') || amenity.toLowerCase().includes('spa')) return <FiUsers className="w-4 h-4" />;
    return <FiZap className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-[200px] md:h-[140px] bg-indigo-600" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6">
            <div className="text-center pt-4">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 font-serif tracking-wide">
                Explore Places Your Neighbors Love
              </h1>
              <p className="text-indigo-100 text-lg mb-6">
                Discover amazing properties rated by our community
              </p>
              
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search properties by name, location, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900"
                  />
                  <svg
                    className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${selectedCategory === category
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }
                  `}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="sm:ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="rating">Highest Rated</option>
                <option value="price">Price: Low to High</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <Link href={getPropertyLink(currentSociety, property.id, property.category)} key={property.id}>
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x250/f3f4f6/6b7280?text=Property+Image';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-medium">
                        {property.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                        <FiHeart className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                        <FiShare2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="text-xl font-bold text-white drop-shadow-lg">
                        {property.price}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    {/* Title and Rating */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {propertyReviews[property.id] && propertyReviews[property.id].count > 0 && (
                          <>
                            {renderStars(propertyReviews[property.id].rating)}
                            <span className="text-xs text-gray-600 ml-1">
                              ({propertyReviews[property.id].count})
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-2 mb-3 text-gray-600">
                      <FiMapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span className="text-sm line-clamp-1">{property.address}</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                      {property.description}
                    </p>

                    {/* Highlights */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {property.highlights.slice(0, 2).map((highlight, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-900 mb-2">Key Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.slice(0, 3).map((amenity, index) => (
                          <div key={index} className="flex items-center gap-1 text-gray-600">
                            {getAmenityIcon(amenity)}
                            <span className="text-xs">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-gray-600">
                          <FiPhone className="w-3 h-3" />
                          <span className="text-xs">{property.contactInfo.phone}</span>
                        </div>
                      </div>
                      <div className="text-sm text-indigo-600 font-medium">
                        View Details →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default PropertyShowcase 