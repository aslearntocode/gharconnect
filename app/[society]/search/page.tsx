'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FiSearch, FiHome, FiTool, FiTruck, FiMapPin, FiStar, FiDollarSign } from 'react-icons/fi'
import { FaBuilding } from 'react-icons/fa'

// Import actual vendor data
import { vendors as plumberVendors } from '@/app/parel/data/services/plumber'
import { vendors as physicalTrainingVendors } from '@/app/parel/data/services/physical-training'
import { vendors as yogaVendors } from '@/app/parel/data/services/yoga'
import { vendors as laundryVendors } from '@/app/parel/data/services/laundry'
import { vendors as carpenterVendors } from '@/app/parel/data/services/carpenter'
import { vendors as electricianVendors } from '@/app/parel/data/services/electrician'
import { doctors } from '@/app/parel/data/services/doctors'

// Import delivery vendors
import { vendors as dairyVendors } from '@/app/parel/data/delivery/dairy'
import { vendors as meatVendors } from '@/app/parel/data/delivery/meat'
import { vendors as vegetablesVendors } from '@/app/parel/data/delivery/vegetables'
import { vendors as fruitsVendors } from '@/app/parel/data/delivery/fruits'
import { vendors as dryFruitsVendors } from '@/app/parel/data/delivery/dry-fruits'
import { vendors as pharmacyVendors } from '@/app/parel/data/delivery/pharmacy'

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
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  // Get the society from the URL path
  const getSocietyFromPath = () => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/')
      return pathParts[1] || 'parel' // Default to parel if no society in path
    }
    return 'parel'
  }

  const currentSociety = getSocietyFromPath()

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

  // Generate search data dynamically from actual vendor data
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
    plumberVendors.forEach(vendor => {
      vendor.services?.forEach(service => {
        results.push({
          id: `plumber-${idCounter++}`,
          title: `${vendor.name} - ${service.name}`,
          description: service.description,
          type: 'vendor',
          url: '/[society]/services/plumber',
          category: 'Plumbing',
          rating: 4.6,
          price: typeof service.price === 'number' ? `₹${service.price}` : service.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          tags: generateTags(vendor.name, service.name, service.description)
        })
      })
    })

    // Add physical training vendors
    physicalTrainingVendors.forEach(vendor => {
      vendor.products?.forEach(product => {
        results.push({
          id: `pt-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'vendor',
          url: '/[society]/services/physical-training',
          category: 'Physical Training',
          rating: 4.7,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Add yoga vendors
    yogaVendors.forEach(vendor => {
      vendor.products?.forEach(product => {
        results.push({
          id: `yoga-${idCounter++}`,
          title: vendor.name,
          description: product.description,
          type: 'vendor',
          url: '/[society]/services/yoga',
          category: 'Yoga',
          rating: 4.6,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Add laundry vendors
    laundryVendors.forEach(vendor => {
      vendor.services?.forEach(service => {
        results.push({
          id: `laundry-${idCounter++}`,
          title: `${vendor.name} - ${service.name}`,
          description: service.description,
          type: 'vendor',
          url: '/[society]/services/laundry',
          category: 'Laundry',
          rating: 4.4,
          price: typeof service.price === 'number' ? `₹${service.price}` : service.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          tags: generateTags(vendor.name, service.name, service.description)
        })
      })
    })

    // Add carpenter vendors
    carpenterVendors.forEach(vendor => {
      vendor.products?.forEach(product => {
        results.push({
          id: `carpenter-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'vendor',
          url: '/[society]/services/carpenter',
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
    electricianVendors.forEach(vendor => {
      vendor.services?.forEach(service => {
        results.push({
          id: `electrician-${idCounter++}`,
          title: `${vendor.name} - ${service.name}`,
          description: service.description,
          type: 'vendor',
          url: '/[society]/services/electrician',
          category: 'Electrical',
          rating: 4.6,
          price: typeof service.price === 'number' ? `₹${service.price}` : service.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          tags: generateTags(vendor.name, service.name, service.description)
        })
      })
    })

    // Add doctors
    doctors.forEach(doctor => {
      results.push({
        id: `doctor-${idCounter++}`,
        title: doctor.name,
        description: `${doctor.specialization} - ${doctor.qualification}`,
        type: 'vendor',
        url: '/[society]/services/doctors',
        category: 'Medical',
        rating: 4.7,
        price: doctor.consultationFee,
        vendorName: doctor.name,
        mobile: doctor.phone,
        tags: generateTags(doctor.name, doctor.specialization, doctor.qualification)
      })
    })

    // Add delivery vendors
    // Dairy vendors
    dairyVendors.forEach(vendor => {
      vendor.products?.forEach(product => {
        results.push({
          id: `dairy-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'vendor',
          url: '/[society]/delivery/dairy',
          category: 'Dairy',
          rating: 4.6,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Meat vendors
    meatVendors.forEach(vendor => {
      vendor.products?.forEach(product => {
        results.push({
          id: `meat-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'vendor',
          url: '/[society]/delivery/meat',
          category: 'Meat',
          rating: 4.5,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Vegetables vendors (includes Krishna Gupta Groceries)
    vegetablesVendors.forEach(vendor => {
      vendor.products?.forEach(product => {
        results.push({
          id: `vegetables-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'vendor',
          url: '/[society]/delivery/vegetables',
          category: 'Vegetables',
          rating: 4.4,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Fruits vendors
    fruitsVendors.forEach(vendor => {
      vendor.products?.forEach(product => {
        results.push({
          id: `fruits-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'vendor',
          url: '/[society]/delivery/fruits',
          category: 'Fruits',
          rating: 4.3,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Dry fruits vendors
    dryFruitsVendors.forEach(vendor => {
      vendor.products?.forEach(product => {
        results.push({
          id: `dryfruits-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'vendor',
          url: '/[society]/delivery/dry-fruits',
          category: 'Dry Fruits',
          rating: 4.6,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Pharmacy vendors
    pharmacyVendors.forEach(vendor => {
      vendor.products?.forEach(product => {
        results.push({
          id: `pharmacy-${idCounter++}`,
          title: `${vendor.name} - ${product.name}`,
          description: product.description,
          type: 'vendor',
          url: '/[society]/delivery/pharmacy',
          category: 'Pharmacy',
          rating: 4.8,
          price: typeof product.price === 'number' ? `₹${product.price}` : product.price,
          vendorName: vendor.name,
          mobile: vendor.mobile,
          tags: generateTags(vendor.name, product.name, product.description)
        })
      })
    })

    // Add general services
    const generalServices = [
      {
        title: 'Electrician',
        description: 'Certified electrician for all electrical work and repairs',
        url: '/[society]/services/electrician',
        category: 'Electrical',
        tags: ['electrician', 'electrical', 'wiring', 'repair', 'installation', 'power', 'lights']
      },
      {
        title: 'Carpenter',
        description: 'Skilled carpenter for furniture and woodwork',
        url: '/[society]/services/carpenter',
        category: 'Carpentry',
        tags: ['carpenter', 'carpentry', 'furniture', 'woodwork', 'repair', 'installation']
      },
      {
        title: 'AC Service',
        description: 'Professional AC installation, repair and maintenance',
        url: '/[society]/services/ac-service',
        category: 'HVAC',
        tags: ['ac', 'air conditioning', 'hvac', 'cooling', 'repair', 'maintenance', 'installation']
      },
      {
        title: 'Pest Control',
        description: 'Effective pest control and extermination services',
        url: '/[society]/services/pest-control',
        category: 'Pest Control',
        tags: ['pest control', 'extermination', 'insects', 'rodents', 'cleaning', 'hygiene']
      },
      {
        title: 'Domestic Help & Drivers',
        description: 'Reliable domestic help and professional drivers',
        url: '/[society]/services/domestic-help',
        category: 'Domestic',
        tags: ['domestic help', 'drivers', 'housekeeping', 'cleaning', 'transport', 'maid']
      },
      {
        title: 'Car Clean',
        description: 'Professional car cleaning and detailing services',
        url: '/[society]/services/car-clean',
        category: 'Automotive',
        tags: ['car clean', 'car wash', 'detailing', 'automotive', 'cleaning', 'vehicle']
      },
      {
        title: 'Painter',
        description: 'Professional painting services for homes and offices',
        url: '/[society]/services/painter',
        category: 'Painting',
        tags: ['painter', 'painting', 'interior', 'exterior', 'wall paint', 'decor']
      },
      {
        title: 'Gardener',
        description: 'Professional gardening and landscaping services',
        url: '/[society]/services/gardener',
        category: 'Gardening',
        tags: ['gardener', 'gardening', 'landscaping', 'plants', 'lawn', 'maintenance']
      },
      {
        title: 'Laptop Repair',
        description: 'Expert laptop repair and maintenance services',
        url: '/[society]/services/laptop-repair',
        category: 'Electronics',
        tags: ['laptop repair', 'computer', 'electronics', 'repair', 'maintenance', 'hardware']
      },
      {
        title: 'Electronics Repair',
        description: 'Professional electronics repair and maintenance',
        url: '/[society]/services/electronics-repair',
        category: 'Electronics',
        tags: ['electronics repair', 'repair', 'maintenance', 'gadgets', 'devices']
      },
      {
        title: 'Notary',
        description: 'Professional notary services for document verification',
        url: '/[society]/services/notary',
        category: 'Legal',
        tags: ['notary', 'legal', 'document', 'verification', 'stamp', 'certification']
      },
      {
        title: 'Pigeon Net',
        description: 'Professional pigeon net installation services',
        url: '/[society]/services/piegon-net',
        category: 'Installation',
        tags: ['pigeon net', 'installation', 'balcony', 'terrace', 'protection', 'mesh']
      },
      {
        title: 'Kids Classes',
        description: 'Educational and fun classes for children',
        url: '/[society]/services/kids-classes',
        category: 'Education',
        tags: ['kids classes', 'education', 'children', 'learning', 'tuition', 'activities']
      }
    ]

    generalServices.forEach(service => {
      results.push({
        id: `service-${idCounter++}`,
        title: service.title,
        description: service.description,
        type: 'service',
        url: service.url,
        category: service.category,
        rating: 4.5,
        price: 'Call for price',
        tags: service.tags
      })
    })

    // Add rental pages
    results.push(
      {
        id: `rent-${idCounter++}`,
        title: 'Find Rental Properties',
        description: 'Browse and find rental properties in your area',
        type: 'rent',
        url: '/[society]/rent',
        category: 'Rental Search',
        rating: 4.5,
        tags: ['rent', 'rental', 'properties', 'apartments', 'houses', 'search']
      },
      {
        id: `landlord-${idCounter++}`,
        title: 'List Your Property',
        description: 'List your property for rent as a landlord',
        type: 'landlord',
        url: '/[society]/rent-apartment',
        category: 'Property Listing',
        rating: 4.4,
        tags: ['list property', 'landlord', 'rent out', 'property listing', 'advertise']
      }
    )

    // Add apartment types
    const apartmentTypes = [
      {
        title: '2 BHK Apartment',
        description: 'Spacious 2 bedroom apartment available for rent',
        category: '2 BHK',
        price: '₹45,000/month',
        apartmentType: '2 BHK',
        tags: ['2 bhk', '2bhk', '2 bedroom', 'apartment', 'rent', 'spacious']
      },
      {
        title: '3 BHK Apartment',
        description: 'Large 3 bedroom apartment with modern amenities',
        category: '3 BHK',
        price: '₹65,000/month',
        apartmentType: '3 BHK',
        tags: ['3 bhk', '3bhk', '3 bedroom', 'apartment', 'rent', 'large']
      },
      {
        title: '1 BHK Apartment',
        description: 'Compact 1 bedroom apartment perfect for singles or couples',
        category: '1 BHK',
        price: '₹25,000/month',
        apartmentType: '1 BHK',
        tags: ['1 bhk', '1bhk', '1 bedroom', 'apartment', 'rent', 'compact']
      },
      {
        title: 'Studio Apartment',
        description: 'Modern studio apartment with all amenities',
        category: 'Studio',
        price: '₹20,000/month',
        apartmentType: 'Studio',
        tags: ['studio', 'apartment', 'rent', 'modern', 'compact', 'single room']
      }
    ]

    apartmentTypes.forEach(apt => {
      results.push({
        id: `apartment-${idCounter++}`,
        title: apt.title,
        description: apt.description,
        type: 'apartment',
        url: '/[society]/rent',
        category: apt.category,
        rating: 4.4,
        price: apt.price,
        apartmentType: apt.apartmentType,
        buildingName: 'Various Buildings',
        tags: apt.tags
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
    
    // Simulate API delay
    setTimeout(() => {
      const filteredResults = searchData.filter(item => {
        const searchTerm = searchQuery.toLowerCase()
        
        // Search in multiple fields with fuzzy logic
        const searchableText = [
          item.title,
          item.description,
          item.category,
          item.location,
          item.vendorName,
          item.apartmentType,
          item.buildingName,
          ...(item.tags || []) // Include tags in search
        ].filter(Boolean).join(' ').toLowerCase()
        
        // Use fuzzy search for better matching
        return fuzzySearch(searchQuery, searchableText) ||
               fuzzySearch(searchQuery, item.title) ||
               fuzzySearch(searchQuery, item.description) ||
               fuzzySearch(searchQuery, item.category || '') ||
               fuzzySearch(searchQuery, item.vendorName || '') ||
               fuzzySearch(searchQuery, item.apartmentType || '') ||
               // Search in tags specifically
               (item.tags && item.tags.some(tag => fuzzySearch(searchQuery, tag)))
      }).map(item => ({
        ...item,
        url: item.url.replace('[society]', currentSociety)
      }))

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
                    ? 'bg-blue-600 text-white'
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
                        ? 'bg-blue-600 text-white'
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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