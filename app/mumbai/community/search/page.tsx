'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FiSearch, FiHome, FiTool, FiTruck, FiMapPin, FiStar, FiDollarSign } from 'react-icons/fi'
import { FaBuilding } from 'react-icons/fa'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useRouter } from 'next/navigation'

// Import vendor data directly
import { vendors as plumberVendors } from '@/app/mumbai/community/data/services/plumber'
import { vendors as carpenterVendors } from '@/app/mumbai/community/data/services/carpenter'
import { vendors as electricianVendors } from '@/app/mumbai/community/data/services/electrician'
import { doctors } from '@/app/mumbai/community/data/services/doctors'

// Import delivery data
import { vendors as dairyVendors } from '@/app/mumbai/community/data/delivery/dairy'
import { vendors as flowersVendors } from '@/app/mumbai/community/data/delivery/flowers'
import { vendors as eggsVendors } from '@/app/mumbai/community/data/delivery/eggs'
import { vendors as fruitsVendors } from '@/app/mumbai/community/data/delivery/fruits'
import { vendors as vegetablesVendors } from '@/app/mumbai/community/data/delivery/vegetables'
import { vendors as meatVendors } from '@/app/mumbai/community/data/delivery/meat'
import { vendors as dryFruitsVendors } from '@/app/mumbai/community/data/delivery/dry-fruits'
import { vendors as pharmacyVendors } from '@/app/mumbai/community/data/delivery/pharmacy'

// Import apartment data
import { rentApartments } from '@/app/mumbai/community/data/rentApartments'
import { sellApartments } from '@/app/mumbai/community/data/sellApartments'

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'service' | 'delivery' | 'rent' | 'landlord' | 'vendor' | 'apartment'
  url: string
  category?: string
  rating?: number
  price?: string
  location?: string
  vendorName?: string
  apartmentType?: string
  buildingName?: string
  tags?: string[]
  mobile?: string
  relevanceScore?: number
}

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const router = useRouter()

  // Fuzzy search function
  const fuzzySearch = (searchTerm: string, text: string): boolean => {
    if (!searchTerm || !text) return false
    
    const normalizedSearch = searchTerm.toLowerCase().replace(/\s+/g, '')
    const normalizedText = text.toLowerCase().replace(/\s+/g, '')
    
    // Direct match
    if (normalizedText.includes(normalizedSearch)) return true
    
    // Handle common variations
    const variations = [
      searchTerm.toLowerCase(),
      searchTerm.toLowerCase().replace(/\s+/g, ''),
      searchTerm.toLowerCase().replace(/\s+/g, ' '),
      searchTerm.toLowerCase().replace(/\s+/g, '-'),
      searchTerm.toLowerCase().replace(/\s+/g, '_')
    ]
    
    return variations.some(variation => 
      text.toLowerCase().includes(variation) ||
      text.toLowerCase().replace(/\s+/g, '').includes(variation)
    )
  }

  // Calculate relevance score for search results
  const calculateRelevanceScore = (searchQuery: string, item: SearchResult): number => {
    const query = searchQuery.toLowerCase()
    let score = 0
    
    // Special handling for apartment searches
    if (item.type === 'apartment') {
      // Handle "2 BHK" or "2bhk" searches
      if (query.match(/\d+\s*bhk/i)) {
        const bhkMatch = query.match(/(\d+)\s*bhk/i)
        if (bhkMatch) {
          const bedroomCount = bhkMatch[1]
          if (item.apartmentType?.includes(`${bedroomCount} BHK`)) {
            score += 200 // Very high priority for exact BHK match
          }
          if (item.tags?.some(tag => tag.includes(`${bedroomCount}bhk`) || tag.includes(`${bedroomCount} bhk`))) {
            score += 150
          }
        }
      }
      
      // Handle "apartment" searches
      if (query.includes('apartment')) {
        if (item.title.toLowerCase().includes('apartment')) {
          score += 120
        }
        if (item.tags?.some(tag => tag.includes('apartment'))) {
          score += 100
        }
      }
      
      // Handle "flat" searches
      if (query.includes('flat')) {
        if (item.title.toLowerCase().includes('flat')) {
          score += 120
        }
        if (item.tags?.some(tag => tag.includes('flat'))) {
          score += 100
        }
      }
    }
    
    // Exact title match (highest priority)
    if (item.title.toLowerCase().includes(query)) {
      score += 100
    }
    
    // Exact apartment type match
    if (item.apartmentType && item.apartmentType.toLowerCase().includes(query)) {
      score += 90
    }
    
    // Exact category match
    if (item.category && item.category.toLowerCase().includes(query)) {
      score += 80
    }
    
    // Exact tag match
    if (item.tags) {
      const tagMatches = item.tags.filter(tag => tag.toLowerCase().includes(query))
      score += tagMatches.length * 70
    }
    
    // Partial title match
    const titleWords = item.title.toLowerCase().split(' ')
    const queryWords = query.split(' ')
    const titleMatches = queryWords.filter(word => 
      titleWords.some(titleWord => titleWord.includes(word))
    )
    score += titleMatches.length * 60
    
    // Description match
    if (item.description && item.description.toLowerCase().includes(query)) {
      score += 50
    }
    
    // Vendor name match
    if (item.vendorName && item.vendorName.toLowerCase().includes(query)) {
      score += 40
    }
    
    // Location match
    if (item.location && item.location.toLowerCase().includes(query)) {
      score += 30
    }
    
    // Building name match
    if (item.buildingName && item.buildingName.toLowerCase().includes(query)) {
      score += 20
    }
    
    // Fuzzy match (lowest priority)
    if (fuzzySearch(searchQuery, item.title) || 
        fuzzySearch(searchQuery, item.description || '') ||
        fuzzySearch(searchQuery, item.category || '')) {
      score += 10
    }
    
    return score
  }

  // Enhanced search function with relevance scoring
  const enhancedSearch = (searchQuery: string, item: SearchResult): { matches: boolean, score: number } => {
    const score = calculateRelevanceScore(searchQuery, item)
    const matches = score > 0
    
    return { matches, score }
  }

  // Generate search data
  const generateSearchData = (): SearchResult[] => {
    const results: SearchResult[] = []
    let idCounter = 1

    // Helper function to generate tags for a vendor
    const generateTags = (vendorName: string, serviceName: string, description: string): string[] => {
      const nameParts = vendorName.toLowerCase().split(' ')
      const serviceParts = serviceName.toLowerCase().split(' ')
      const descParts = description.toLowerCase().split(' ')
      
      return [
        ...nameParts,
        ...serviceParts,
        ...descParts.filter(word => word.length > 2),
        vendorName.toLowerCase(),
        serviceName.toLowerCase()
      ]
    }

    // Add plumber vendors
    plumberVendors.forEach((vendor: any) => {
      vendor.services?.forEach((service: any) => {
        results.push({
          id: `plumber-${idCounter++}`,
          title: `${vendor.name} - ${service.name}`,
          description: service.description,
          type: 'vendor',
          url: '/mumbai/community/services/plumber',
          category: 'Plumbing',
          rating: 4.6,
          price: typeof service.price === 'number' ? `₹${service.price}` : service.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          tags: generateTags(vendor.name, service.name, service.description)
        })
      })
    })

    // Add carpenter vendors
    carpenterVendors.forEach((vendor: any) => {
      vendor.products?.forEach((product: any) => {
        results.push({
          id: `carpenter-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'vendor',
          url: '/mumbai/community/services/carpenter',
          category: 'Carpentry',
          rating: 4.5,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Add electrician vendors
    electricianVendors.forEach((vendor: any) => {
      vendor.services?.forEach((service: any) => {
        results.push({
          id: `electrician-${idCounter++}`,
          title: `${vendor.name} - ${service.name}`,
          description: service.description,
          type: 'vendor',
          url: '/mumbai/community/services/electrician',
          category: 'Electrical',
          rating: 4.5,
          price: typeof service.price === 'number' ? `₹${service.price}` : service.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          tags: generateTags(vendor.name, service.name, service.description)
        })
      })
    })

    // Add doctors
    doctors.forEach((doctor: any) => {
      results.push({
        id: `doctor-${idCounter++}`,
        title: doctor.name,
        description: `${doctor.specialization} - ${doctor.qualification}`,
        type: 'vendor',
        url: '/mumbai/community/services/doctors',
        category: 'Medical',
        rating: 4.7,
        price: doctor.consultationFee,
        vendorName: doctor.name,
        mobile: doctor.phone,
        tags: generateTags(doctor.name, doctor.specialization, doctor.qualification)
      })
    })

    // Add rental pages
    results.push(
      {
        id: `rent-${idCounter++}`,
        title: 'Find Rental Properties',
        description: 'Browse and find rental properties in your area',
        type: 'rent',
        url: '/mumbai/community/rent',
        category: 'Rental Search',
        rating: 4.5,
        tags: ['rent', 'rental', 'properties', 'apartments', 'houses', 'search']
      },
      {
        id: `landlord-${idCounter++}`,
        title: 'List Your Property',
        description: 'List your property for rent as a landlord',
        type: 'landlord',
        url: '/mumbai/community/rent-apartment',
        category: 'Property Listing',
        rating: 4.4,
        tags: ['list property', 'landlord', 'rent out', 'property listing', 'advertise']
      }
    )

    // Add delivery vendors
    // Dairy vendors
    dairyVendors.forEach((vendor: any) => {
      vendor.products?.forEach((product: any) => {
        results.push({
          id: `dairy-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'delivery',
          url: '/mumbai/community/delivery/dairy',
          category: 'Dairy',
          rating: 4.6,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          location: vendor.areaServed?.join(', '),
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Flowers vendors
    flowersVendors.forEach((vendor: any) => {
      vendor.products?.forEach((product: any) => {
        results.push({
          id: `flowers-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'delivery',
          url: '/mumbai/community/delivery/flowers',
          category: 'Flowers',
          rating: 4.5,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          location: vendor.areaServed?.join(', '),
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Eggs vendors
    eggsVendors.forEach((vendor: any) => {
      vendor.products?.forEach((product: any) => {
        results.push({
          id: `eggs-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'delivery',
          url: '/mumbai/community/delivery/eggs',
          category: 'Eggs',
          rating: 4.5,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          location: vendor.areaServed?.join(', '),
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Fruits vendors
    fruitsVendors.forEach((vendor: any) => {
      vendor.products?.forEach((product: any) => {
        results.push({
          id: `fruits-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'delivery',
          url: '/mumbai/community/delivery/fruits',
          category: 'Fruits',
          rating: 4.5,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          location: vendor.areaServed?.join(', '),
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Vegetables vendors
    vegetablesVendors.forEach((vendor: any) => {
      vendor.products?.forEach((product: any) => {
        results.push({
          id: `vegetables-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'delivery',
          url: '/mumbai/community/delivery/vegetables',
          category: 'Vegetables',
          rating: 4.5,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          location: vendor.areaServed?.join(', '),
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Meat vendors
    meatVendors.forEach((vendor: any) => {
      vendor.products?.forEach((product: any) => {
        results.push({
          id: `meat-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'delivery',
          url: '/mumbai/community/delivery/meat',
          category: 'Meat',
          rating: 4.5,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          location: vendor.areaServed?.join(', '),
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Dry fruits vendors
    dryFruitsVendors.forEach((vendor: any) => {
      vendor.products?.forEach((product: any) => {
        results.push({
          id: `dry-fruits-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'delivery',
          url: '/mumbai/community/delivery/dry-fruits',
          category: 'Dry Fruits',
          rating: 4.5,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          location: vendor.areaServed?.join(', '),
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Pharmacy vendors
    pharmacyVendors.forEach((vendor: any) => {
      vendor.products?.forEach((product: any) => {
        results.push({
          id: `pharmacy-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'delivery',
          url: '/mumbai/community/delivery/pharmacy',
          category: 'Pharmacy',
          rating: 4.5,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          location: vendor.areaServed?.join(', '),
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Add rental apartments
    rentApartments.forEach((apartment: any) => {
      const bhkText = `${apartment.bedrooms} BHK`
      const locationText = apartment.tower || 'Mumbai'
      const priceText = `₹${apartment.monthlyRent.toLocaleString()}/month`
      
      results.push({
        id: `rent-apt-${idCounter++}`,
        title: `${bhkText} Apartment for Rent - ${locationText}`,
        description: apartment.description,
        type: 'apartment',
        url: '/mumbai/community/rent',
        category: bhkText,
        rating: 4.4,
        price: priceText,
        apartmentType: bhkText,
        buildingName: apartment.tower,
        location: locationText,
        tags: [
          'apartment', 'rent', 'mumbai', locationText.toLowerCase(),
          `${apartment.bedrooms}bhk`, `${apartment.bedrooms} bhk`,
          'flat', 'property', 'rental', 'accommodation',
          apartment.furnishingStatus, apartment.facing?.toLowerCase(),
          `floor ${apartment.floor}`, apartment.type.toLowerCase()
        ]
      })
    })

    // Add sale apartments
    sellApartments.forEach((apartment: any) => {
      const bhkText = `${apartment.bedrooms} BHK`
      const locationText = apartment.tower || 'Mumbai'
      const priceText = `₹${apartment.price.toLocaleString()}`
      
      results.push({
        id: `sale-apt-${idCounter++}`,
        title: `${bhkText} Apartment for Sale - ${locationText}`,
        description: apartment.description,
        type: 'apartment',
        url: '/mumbai/community/sell',
        category: bhkText,
        rating: 4.4,
        price: priceText,
        apartmentType: bhkText,
        buildingName: apartment.tower,
        location: locationText,
        tags: [
          'apartment', 'sale', 'buy', 'mumbai', locationText.toLowerCase(),
          `${apartment.bedrooms}bhk`, `${apartment.bedrooms} bhk`,
          'flat', 'property', 'purchase', 'real estate',
          `floor ${apartment.floor}`, apartment.type.toLowerCase()
        ]
      })
    })

    return results
  }

  const searchData = generateSearchData()

  useEffect(() => {
    if (query.trim()) {
      performSearch(query)
    } else {
      setResults([])
    }
  }, [query])

  const performSearch = (searchQuery: string) => {
    setLoading(true)
    
    // Check for direct redirects first
    const query = searchQuery.toLowerCase().trim()
    
    // Apartment-related searches - redirect to rent page
    if (query.includes('apartment') || query.includes('flat') || query.includes('rent') || 
        query.includes('bhk') || query.includes('property') || query.includes('house')) {
      router.push('/mumbai/rent/apartment')
      return
    }
    
    // Delivery-related searches - redirect to delivery pages
    if (query.includes('coconut')) {
      router.push('/mumbai/community/delivery/fruits')
      return
    }
    if (query.includes('flower')) {
      router.push('/mumbai/community/delivery/flowers')
      return
    }
    if (query.includes('milk') || query.includes('dairy')) {
      router.push('/mumbai/community/delivery/dairy')
      return
    }
    if (query.includes('egg')) {
      router.push('/mumbai/community/delivery/eggs')
      return
    }
    if (query.includes('fruit')) {
      router.push('/mumbai/community/delivery/fruits')
      return
    }
    if (query.includes('vegetable')) {
      router.push('/mumbai/community/delivery/vegetables')
      return
    }
    if (query.includes('meat') || query.includes('chicken')) {
      router.push('/mumbai/community/delivery/meat')
      return
    }
    if (query.includes('dry fruit') || query.includes('nut')) {
      router.push('/mumbai/community/delivery/dry-fruits')
      return
    }
    if (query.includes('medicine') || query.includes('pharmacy')) {
      router.push('/mumbai/community/delivery/pharmacy')
      return
    }
    
    // Service-related searches - redirect to service pages
    if (query.includes('plumber')) {
      router.push('/mumbai/community/services/plumber')
      return
    }
    if (query.includes('electrician')) {
      router.push('/mumbai/community/services/electrician')
      return
    }
    if (query.includes('carpenter')) {
      router.push('/mumbai/community/services/carpenter')
      return
    }
    if (query.includes('doctor')) {
      router.push('/mumbai/community/services/doctors')
      return
    }
    
    // If no direct redirect, show search results
    setTimeout(() => {
      const searchResults = searchData.map(item => ({
        ...item,
        relevanceScore: calculateRelevanceScore(searchQuery, item)
      }))
      
      const filteredResults = searchResults
        .filter(item => item.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)

      setResults(filteredResults)
      setLoading(false)
    }, 300)
  }

  const getFilteredResults = () => {
    if (activeFilter === 'all') return results
    return results.filter(result => result.type === activeFilter)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'building':
        return <FaBuilding className="w-5 h-5 text-blue-600" />
      case 'service':
        return <FiTool className="w-5 h-5 text-green-600" />
      case 'delivery':
        return <FiTruck className="w-5 h-5 text-orange-600" />
      case 'rent':
        return <FiHome className="w-5 h-5 text-purple-600" />
      case 'landlord':
        return <FiDollarSign className="w-5 h-5 text-yellow-600" />
      case 'vendor':
        return <FiTool className="w-5 h-5 text-green-600" />
      case 'apartment':
        return <FiHome className="w-5 h-5 text-purple-600" />
      default:
        return <FiSearch className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'building':
        return 'Building'
      case 'service':
        return 'Service'
      case 'delivery':
        return 'Delivery'
      case 'rent':
        return 'Rent'
      case 'landlord':
        return 'Landlord'
      case 'vendor':
        return 'Vendor'
      case 'apartment':
        return 'Apartment'
      default:
        return 'Other'
    }
  }

  const filteredResults = getFilteredResults()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600">
              Showing results for "{query}"
            </p>
          )}
        </div>

        {/* Filters */}
        {results.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                All ({results.length})
              </button>
              {['building', 'service', 'delivery', 'rent', 'landlord', 'vendor', 'apartment'].map(type => {
                const count = results.filter(r => r.type === type).length
                if (count === 0) return null
                return (
                  <button
                    key={type}
                    onClick={() => setActiveFilter(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeFilter === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {getTypeIcon(type)}
                    {getTypeLabel(type)} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* No Results */}
        {!loading && query && filteredResults.length === 0 && (
          <div className="text-center py-12">
            <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600">
              Try searching with different keywords or browse our categories
            </p>
          </div>
        )}

        {/* Search Results */}
        {!loading && filteredResults.length > 0 && (
          <div className="grid gap-6">
            {filteredResults.map((result) => (
              <Link
                key={result.id}
                href={result.url}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {result.title}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-blue-800">
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">
                      {result.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {result.category && (
                        <span className="flex items-center gap-1">
                          <FiMapPin className="w-4 h-4" />
                          {result.category}
                        </span>
                      )}
                      {result.location && (
                        <span className="flex items-center gap-1">
                          <FiMapPin className="w-4 h-4" />
                          {result.location}
                        </span>
                      )}
                      {result.rating && (
                        <span className="flex items-center gap-1">
                          <FiStar className="w-4 h-4 text-yellow-400" />
                          {result.rating}
                        </span>
                      )}
                      {result.price && (
                        <span className="flex items-center gap-1">
                          <FiDollarSign className="w-4 h-4" />
                          {result.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !query && (
          <div className="text-center py-12">
            <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start searching
            </h3>
            <p className="text-gray-600">
              Search for buildings, services, delivery options, or rental properties
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }>
        <SearchContent />
      </Suspense>
      <Footer />
    </>
  )
} 