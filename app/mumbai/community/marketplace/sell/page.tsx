'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase-auth'
import { getSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  price: z.number().min(1, 'Price must be at least ₹1').max(50000000, 'Price must be less than ₹50,00,000'),
  category: z.string().min(1, 'Category is required'),
  condition: z.string().min(1, 'Condition is required'),
  contact_phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number must be less than 15 digits'),
  building_name: z.string().min(1, 'Building name is required').max(100, 'Building name must be less than 100 characters'),
  event_date: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const CATEGORIES = [
  'Electronics',
  'Furniture',
  'Books',
  'Clothing',
  'Sports',
  'Home & Garden',
  'Toys & Games',
  'Automotive',
  'Event or Movie Tickets',
  'Other'
]

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Used']

export default function SellPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      if (user) {
        setUser(user)
        // Sync Firebase token to Supabase session
        const token = await user.getIdToken();
        const supabase = await getSupabaseClient();
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: token, // or null if you don't have a refresh token
        });
        console.log('Supabase session set');
        setLoading(false)
      } else {
        setLoading(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [router])

  const onSubmit = async (data: FormData) => {
    console.log('onSubmit called', data, user);
    if (!user) {
      router.push('/parel/login?redirect=/parel/marketplace/sell')
      return
    }

    setSubmitting(true)

    try {
      const supabase = await getSupabaseClient()
      
      // Create the product listing with images set to null
      const insertPayload = {
        user_id: user.id,
        area: 'parel',
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        condition: data.condition,
        images: null,
        contact_phone: data.contact_phone,
        building_name: data.building_name,
        is_active: true,
        event_date: data.category === 'Event or Movie Tickets' ? data.event_date : null,
      };
      console.log('Insert payload:', insertPayload);
      const { error, data: insertData } = await supabase
        .from('marketplace_products')
        .insert(insertPayload)
      console.log('Supabase insert result', insertData, error);
      if (error) {
        console.error('Error creating listing:', error)
        toast.error('Failed to create listing')
        return
      }

      toast.success('Your item has been listed successfully! Please send your images to +91 9321314553 on WhatsApp.')
      router.push('/parel/marketplace')
    } catch (error: any) {
      console.error('Error creating listing:', error)
      toast.error(error.message || 'Failed to create listing')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedCategory = watch('category');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 lg:pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:pt-16">
      <Header />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sell Your Item</h1>
              <p className="text-gray-600">List your item in the marketplace</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>
              Fill in the details about the item you want to sell
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Item Title *
                </label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g., iPhone 12 Pro Max, Wooden Dining Table"
                  className={errors.title ? 'border-red-500' : ''}
                  onFocus={() => {
                    if (!user) {
                      router.push('/parel/login?redirect=/parel/marketplace/sell')
                    }
                  }}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe your item in detail. Include brand, model, age, any defects, etc."
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                  onFocus={() => {
                    if (!user) {
                      router.push('/parel/login?redirect=/parel/marketplace/sell')
                    }
                  }}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <Input
                  id="price"
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="1000"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              {/* Category and Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <Select onValueChange={(value) => setValue('category', value)}>
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                    Condition *
                  </label>
                  <Select onValueChange={(value) => setValue('condition', value)}>
                    <SelectTrigger className={errors.condition ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITIONS.map(condition => (
                        <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.condition && (
                    <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
                  )}
                </div>
              </div>

              {/* Event Date (only for Event or Movie Tickets) */}
              {selectedCategory === 'Event or Movie Tickets' && (
                <div>
                  <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <Input
                    id="event_date"
                    type="date"
                    {...register('event_date', { required: true })}
                    className={errors.event_date ? 'border-red-500' : ''}
                  />
                  {errors.event_date && (
                    <p className="mt-1 text-sm text-red-600">Event date is required for tickets</p>
                  )}
                </div>
              )}

              {/* Contact Phone */}
              <div>
                <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone Number *
                </label>
                <Input
                  id="contact_phone"
                  {...register('contact_phone')}
                  placeholder="9876543210"
                  className={errors.contact_phone ? 'border-red-500' : ''}
                />
                {errors.contact_phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.contact_phone.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  This number will be used for WhatsApp chat. It won't be displayed publicly.
                </p>
              </div>

              {/* Building Name */}
              <div>
                <label htmlFor="building_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Building Name *
                </label>
                <Input
                  id="building_name"
                  {...register('building_name')}
                  placeholder="e.g., Crescent Bay, Lodha World One"
                  className={errors.building_name ? 'border-red-500' : ''}
                />
                {errors.building_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.building_name.message}</p>
                )}
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images
                </label>
                <div className="bg-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-blue-900">
                        WhatsApp us up to 10 images
                      </h3>
                      <p className="mt-1 text-sm text-blue-700">
                        Send your product images to <span className="font-semibold">+91 9321314553</span> on WhatsApp
                      </p>
                      <p className="mt-2 text-xs text-blue-600">
                        Make sure to mention your item title when sending images for easy identification
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {submitting ? 'Creating Listing...' : 'Create Listing'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 