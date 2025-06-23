'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { auth } from '@/lib/firebase'
import { supabase, updateSupabaseAuth } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Upload, X, Plus } from 'lucide-react'
import Header from '@/components/Header'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  price: z.number().min(1, 'Price must be at least ₹1').max(1000000, 'Price must be less than ₹10,00,000'),
  category: z.string().min(1, 'Category is required'),
  condition: z.string().min(1, 'Condition is required'),
  contact_phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number must be less than 15 digits'),
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
  'Other'
]

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Used']

export default function SellPage() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
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
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await updateSupabaseAuth() // Update token before any action
        setUser(user)
        await fetchUserProfile(user.uid)
      } else {
        router.push('/worli/login?redirect=/worli/marketplace/sell')
      }
    })

    return () => unsubscribe()
  }, [router])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        toast.error('Failed to load user profile')
        return
      }

      setUserProfile(data)
      // Pre-fill contact phone if available
      if (data?.phone) {
        setValue('contact_phone', data.phone)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      toast.error('Failed to load user profile')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newImageFiles: File[] = [...imageFiles]
    const newImagePreviews: string[] = [...imagePreviews]
    const maxImages = 5

    for (let i = 0; i < files.length; i++) {
      if (newImageFiles.length >= maxImages) {
        toast.warning(`You can only upload a maximum of ${maxImages} images.`)
        break
      }

      const file = files[i]
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`Image ${file.name} is too large. Maximum size is 5MB.`)
        continue
      }
      
      newImageFiles.push(file)
      newImagePreviews.push(URL.createObjectURL(file))
    }
    
    setImageFiles(newImageFiles)
    setImagePreviews(newImagePreviews)
  }

  const removeImage = (index: number) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index)
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index)
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index])

    setImageFiles(newImageFiles)
    setImagePreviews(newImagePreviews)
  }

  const onSubmit = async (data: FormData) => {
    if (!user || !userProfile) {
      toast.error('Please log in to submit your listing')
      return
    }

    setSubmitting(true)

    try {
      const imageUrls: string[] = []
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const filePath = `${user.uid}/${uuidv4()}-${file.name}`
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file)

          if (uploadError) {
            throw uploadError
          }

          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath)
          
          imageUrls.push(urlData.publicUrl)
        }
      }

      const { error } = await supabase
        .from('marketplace_products')
        .insert({
          user_id: user.uid,
          area: 'worli',
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          condition: data.condition,
          images: imageUrls,
          contact_phone: data.contact_phone,
        })

      if (error) {
        console.error('Error creating listing:', error)
        toast.error('Failed to create listing')
        // Attempt to clean up uploaded images if db insert fails
        if (imageUrls.length > 0) {
          const filePaths = imageUrls.map(url => url.split('/').slice(-2).join('/'))
          await supabase.storage.from('product-images').remove(filePaths)
        }
        return
      }

      toast.success('Your item has been listed successfully!')
      router.push('/worli/marketplace')
    } catch (error: any) {
      console.error('Error creating listing:', error)
      toast.error(error.message || 'Failed to create listing')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">Error</p>
          <p className="mt-2 text-gray-600">
            Could not load user profile. You may need to complete your profile before you can sell items.
          </p>
          <Button
            onClick={() => router.push('/worli')}
            className="mt-4"
          >
            Go to Worli Homepage
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <p className="text-gray-600">List your item in the Worli marketplace</p>
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

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images (Optional)
                </label>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB each (max 5 images)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={imageFiles.length >= 5}
                      />
                    </label>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {imagePreviews.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                            onLoad={() => URL.revokeObjectURL(image)} // Clean up after load
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                  className="bg-blue-600 hover:bg-blue-700"
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