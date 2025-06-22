'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { supabase, updateSupabaseAuth } from '@/lib/supabase'
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
import { Search, Filter, Plus, MessageCircle, Calendar, MapPin, ChevronDown } from 'lucide-react'
import LoginModal from '@/components/LoginModal'
import Header from '@/components/Header'
import { toast } from 'sonner'

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

export default function MarketplacePage() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const handleAuthChange = async (user: any) => {
      setUser(user)
      if (user) {
        await updateSupabaseAuth()
      }
      fetchProducts()
    }

    const unsubscribe = auth.onAuthStateChanged(handleAuthChange)

    return () => unsubscribe()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('marketplace_products')
        .select(`
          *,
          user_profile:user_profiles(society_name, building_name)
        `)
        .eq('area', 'worli')
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

    const message = `Hi! I'm interested in your item "${title}" from the Worli marketplace. Can you tell me more about it?`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  const handleSellItem = () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    router.push('/worli/marketplace/sell')
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Indigo Banner */}
      <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Worli Marketplace</h1>
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
              >
                <Filter className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <Card key={i} className="animate-pulse flex flex-col">
                  <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
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
                  : 'Be the first to list an item in Worli marketplace!'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow duration-200 flex flex-col">
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
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
                      <span className={`text-xs font-medium rounded-full px-2 py-0.5 whitespace-nowrap ${
                        product.condition === 'New' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.condition}
                      </span>
                    </div>
                    
                    <CardDescription className="text-xs text-gray-600 mb-2 line-clamp-1">
                      {product.description}
                    </CardDescription>
                    
                    <div className="flex-grow"></div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">
                        {product.user_profile?.society_name}, {product.user_profile?.building_name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(product.created_at)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-green-600">
                        {formatPrice(product.price)}
                      </div>
                      <Button
                        onClick={() => handleWhatsAppChat(product.contact_phone, product.title)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-auto"
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
    </div>
  )
}
