"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { getSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, Plus, MessageCircle, Calendar, MapPin, ChevronDown, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import LoginModal from '@/components/LoginModal'
import Header from '@/components/Header'
import { toast } from 'sonner'
import Head from 'next/head'

interface MarketplaceProduct {
  id: string
  user_id: string
  area: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  images: string[]
  contact_phone: string
  created_at: string
  building_name?: string
  user_profile?: {
    society_name: string
    building_name: string
  }
}

const CATEGORIES = [
  'Electronics',
  'Furniture',
  'Books',
  'Clothing',
  'Sports',
  'Home & Garden',
  'Toys & Games',
  'Automotive',
  'Other'
]

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Used']

const PRICE_RANGES = [
  { value: '0-500', label: '< ₹500' },
  { value: '500-2500', label: '₹500 - ₹2500' },
  { value: '2500-5000', label: '₹2500 - ₹5000' },
  { value: '5000-10000', label: '₹5000 - ₹10000' },
  { value: '10000-99999999', label: '> ₹10000' },
]

// Image Modal Component
function ImageModal({ 
  images, 
  isOpen, 
  onClose, 
  initialIndex = 0 
}: { 
  images: string[]
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => prev > 0 ? prev - 1 : images.length - 1)
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : 0)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, images.length, onClose])

  if (!isOpen || images.length === 0) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center p-4">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => {
                setCurrentIndex(prev => prev > 0 ? prev - 1 : images.length - 1)
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-3"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : 0)
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-3"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Main image(s) with horizontal scroll if multiple */}
        <div className={`relative flex items-center justify-center w-full h-full ${images.length > 1 ? 'overflow-x-auto snap-x snap-mandatory' : ''}`} style={{ maxWidth: '90vw', maxHeight: '80vh' }}>
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Product image ${idx + 1}`}
              className={`object-contain mx-auto ${images.length > 1 ? 'snap-center' : ''} ${idx === currentIndex ? 'block' : 'hidden'}`}
              style={{ maxWidth: '90vw', maxHeight: '80vh' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/placeholder-image.svg'
              }}
            />
          ))}
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Thumbnail navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 p-2 rounded-lg">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-white' 
                    : 'border-gray-600 hover:border-gray-400'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder-image.svg'
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function Marketplace({ location }: { location: string }) {
  const [products, setProducts] = useState<MarketplaceProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  // Image modal state
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean
    images: string[]
    initialIndex: number
  }>({
    isOpen: false,
    images: [],
    initialIndex: 0
  })
  
  const router = useRouter()

  useEffect(() => {
    const handleAuthChange = async (user: any) => {
      setUser(user)
      fetchProducts()
    }

    const unsubscribe = auth.onAuthStateChanged(handleAuthChange)

    return () => unsubscribe()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const supabase = await getSupabaseClient()
      const { data, error } = await supabase
        .from('marketplace_products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        toast.error('Failed to load products')
        return
      }

      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
    const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(product.condition)
    
    const matchesPrice = selectedPriceRanges.length === 0 || selectedPriceRanges.some(range => {
      const [min, max] = range.split('-').map(Number)
      return product.price >= min && product.price <= max
    })

    // Debug logging
    if (selectedCategories.length > 0 || selectedConditions.length > 0 || selectedPriceRanges.length > 0) {
      console.log('Filtering product:', {
        title: product.title,
        category: product.category,
        condition: product.condition,
        price: product.price,
        matchesCategory,
        matchesCondition,
        matchesPrice,
        selectedCategories,
        selectedConditions,
        selectedPriceRanges
      })
    }

    return matchesCategory && matchesCondition && matchesPrice
  })
  
  const handleFilterChange = (setter: Function, value: string, currentValues: string[]) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    setter(newValues)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedConditions([])
    setSelectedPriceRanges([])
  }

  const handleWhatsAppChat = (phone: string, title: string) => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    const message = `Hi! I'm interested in your item "${title}" from the ${location} marketplace. Can you tell me more about it?`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  const handleSellItem = () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    router.push(`/${location.toLowerCase()}/marketplace/sell`)
  }

  // Image modal handlers
  const openImageModal = (images: string[], initialIndex: number = 0) => {
    setImageModal({
      isOpen: true,
      images,
      initialIndex
    })
  }

  const closeImageModal = () => {
    setImageModal({
      isOpen: false,
      images: [],
      initialIndex: 0
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Calculate total active filters
  const totalActiveFilters = selectedCategories.length + selectedConditions.length + selectedPriceRanges.length

  return (
    <>
      <Head>
        <title>{`${location} Marketplace | GharConnect`}</title>
        <meta name="description" content={`Buy and sell items in ${location} with GharConnect's trusted community marketplace.`} />
        <meta property="og:title" content={`${location} Marketplace | GharConnect`} />
        <meta property="og:description" content={`Buy and sell items in ${location} with GharConnect's trusted community marketplace.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://gharconnect.com/${location.toLowerCase()}/marketplace`} />
        <meta property="og:site_name" content="GharConnect" />
        <meta property="og:image" content="/GC_Logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${location} Marketplace | GharConnect`} />
        <meta name="twitter:description" content={`Buy and sell items in ${location} with GharConnect's trusted community marketplace.`} />
        <meta name="twitter:image" content="/GC_Logo.png" />
        <link rel="canonical" href={`https://gharconnect.com/${location.toLowerCase()}/marketplace`} />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Indigo Banner */}
        <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{location} Marketplace</h1>
        </div>

        {/* SEO/Keyword Intro Paragraph */}
        <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-base md:text-lg text-gray-700 max-w-5xl mx-auto">
            Buy and sell used electronics, furniture, books, clothing, sports equipment, home & garden items, toys, automotive goods, and more in {location}. Find great deals on secondhand items or list your own for sale in the trusted GharConnect community marketplace. Perfect for anyone looking to buy or sell pre-owned items locally.
          </p>
        </div>

        {/* Main Content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex justify-between">
                      <span>Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {CATEGORIES.map(category => (
                      <DropdownMenuItem key={category} onSelect={(e) => e.preventDefault()}>
                        <Checkbox
                          id={`cat-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleFilterChange(setSelectedCategories, category, selectedCategories)}
                          className="mr-2"
                        />
                        <label htmlFor={`cat-${category}`} className="w-full">{category}</label>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Condition Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex justify-between">
                      <span>Condition {selectedConditions.length > 0 && `(${selectedConditions.length})`}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filter by Condition</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {CONDITIONS.map(condition => (
                      <DropdownMenuItem key={condition} onSelect={(e) => e.preventDefault()}>
                         <Checkbox
                          id={`con-${condition}`}
                          checked={selectedConditions.includes(condition)}
                          onCheckedChange={() => handleFilterChange(setSelectedConditions, condition, selectedConditions)}
                          className="mr-2"
                        />
                        <label htmlFor={`con-${condition}`} className="w-full">{condition}</label>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Price Range Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex justify-between">
                      <span>Price Range {selectedPriceRanges.length > 0 && `(${selectedPriceRanges.length})`}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filter by Price</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {PRICE_RANGES.map(range => (
                      <DropdownMenuItem key={range.value} onSelect={(e) => e.preventDefault()}>
                        <Checkbox
                          id={`pr-${range.value}`}
                          checked={selectedPriceRanges.includes(range.value)}
                          onCheckedChange={() => handleFilterChange(setSelectedPriceRanges, range.value, selectedPriceRanges)}
                          className="mr-2"
                        />
                        <label htmlFor={`pr-${range.value}`} className="w-full">{range.label}</label>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                  disabled={totalActiveFilters === 0}
                >
                  <Filter className="w-4 h-4" />
                  Clear Filters {totalActiveFilters > 0 && `(${totalActiveFilters})`}
                </Button>
              </div>

              {/* Filter Summary */}
              {totalActiveFilters > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Active Filters ({totalActiveFilters}):
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedCategories.map(category => (
                      <span key={category} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Category: {category}
                        <button
                          onClick={() => handleFilterChange(setSelectedCategories, category, selectedCategories)}
                          className="hover:text-blue-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {selectedConditions.map(condition => (
                      <span key={condition} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Condition: {condition}
                        <button
                          onClick={() => handleFilterChange(setSelectedConditions, condition, selectedConditions)}
                          className="hover:text-blue-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {selectedPriceRanges.map(range => {
                      const rangeLabel = PRICE_RANGES.find(r => r.value === range)?.label || range
                      return (
                        <span key={range} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Price: {rangeLabel}
                          <button
                            onClick={() => handleFilterChange(setSelectedPriceRanges, range, selectedPriceRanges)}
                            className="hover:text-blue-600"
                          >
                            ×
                          </button>
                        </span>
                      )
                    })}
                  </div>
                  <div className="mt-2 text-xs text-blue-600">
                    Showing {filteredProducts.length} of {products.length} items
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <Card key={i} className="animate-pulse flex flex-col">
                    <div className="bg-gray-200 rounded-t-lg h-32"></div>
                    <CardContent className="p-3 flex-grow flex flex-col">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="flex-grow"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600">
                  {selectedCategories.length > 0 || selectedConditions.length > 0 || selectedPriceRanges.length > 0
                    ? 'Try adjusting your search or filters'
                    : `Be the first to list an item in ${location} marketplace!`
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow duration-200 flex flex-col">
                    <div className="bg-gray-100 rounded-t-lg overflow-hidden relative group cursor-pointer h-32 flex items-center justify-center">
                      {product.images && product.images.length > 0 ? (
                        <>
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-full w-auto max-w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/placeholder-image.svg'
                            }}
                            loading="lazy"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              openImageModal(product.images, 0)
                            }}
                          />
                          {/* Zoom indicator overlay */}
                          <div 
                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center pointer-events-none"
                          >
                            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          {product.images.length > 1 && (
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                              +{product.images.length - 1}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Search className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-3 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-1">
                        <CardTitle className="text-base font-semibold line-clamp-2">
                          {product.title}
                        </CardTitle>
                        <span className={`text-xs font-medium rounded-full px-2 py-0.5 whitespace-nowrap flex-shrink-0 ml-2 ${
                          product.condition === 'New' 
                            ? 'bg-green-100 text-green-800' 
                            : product.condition === 'Like New'
                            ? 'bg-blue-100 text-blue-800'
                            : product.condition === 'Good'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.condition}
                        </span>
                      </div>
                      
                      <CardDescription className="text-xs text-gray-600 mb-2">
                        {product.description}
                      </CardDescription>
                      
                      <div className="flex-grow"></div>

                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {product.building_name
                            ? `${product.building_name}, ${product.area.charAt(0).toUpperCase() + product.area.slice(1)}, Mumbai`
                            : `${product.area.charAt(0).toUpperCase() + product.area.slice(1)}, Mumbai`
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span>{formatDate(product.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-green-600">
                          {formatPrice(product.price)}
                        </div>
                        <Button
                          onClick={() => handleWhatsAppChat(product.contact_phone, product.title)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-auto flex-shrink-0"
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Floating Sell Button */}
        <Button 
          onClick={handleSellItem}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg px-6 py-4 flex items-center justify-center z-50"
        >
          <Plus className="w-6 h-6 mr-2" />
          <span className="font-semibold">Sell Item</span>
        </Button>

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
            setShowLoginModal(false)
            toast.success('Successfully logged in!')
          }}
        />

        {/* Image Modal */}
        {imageModal.isOpen && (
          <ImageModal
            images={imageModal.images}
            isOpen={imageModal.isOpen}
            onClose={closeImageModal}
            initialIndex={imageModal.initialIndex}
          />
        )}
      </div>
    </>
  )
} 