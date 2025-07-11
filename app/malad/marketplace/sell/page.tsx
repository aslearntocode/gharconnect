'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { auth } from '@/lib/firebase'
import { getSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Upload, X, Plus, Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import StorageDebug from '@/components/StorageDebug'

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

// Image compression utility
const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          })
          resolve(compressedFile)
        } else {
          resolve(file)
        }
      }, file.type, quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export default function SellPage() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([])
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
        setUser(user)
        await fetchUserProfile(user.uid)
      } else {
        router.push('/parel/login?redirect=/parel/marketplace/sell')
      }
    })

    return () => unsubscribe()
  }, [router])

  const fetchUserProfile = async (userId: string) => {
    try {
      const supabase = await getSupabaseClient()
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newImageFiles: File[] = [...imageFiles]
    const newImagePreviews: string[] = [...imagePreviews]
    const newUploadingImages: boolean[] = [...uploadingImages]
    const maxImages = 5

    for (let i = 0; i < files.length; i++) {
      if (newImageFiles.length >= maxImages) {
        toast.warning(`You can only upload a maximum of ${maxImages} images.`)
        break
      }

      const file = files[i]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file.`)
        continue
      }
      
      // Validate file size (10MB limit before compression)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Image ${file.name} is too large. Maximum size is 10MB.`)
        continue
      }

      try {
        // Add loading state for this image
        newUploadingImages.push(true)
        setUploadingImages([...newUploadingImages])
        
        // Compress image
        const compressedFile = await compressImage(file)
        
        newImageFiles.push(compressedFile)
        newImagePreviews.push(URL.createObjectURL(compressedFile))
        newUploadingImages[newUploadingImages.length - 1] = false
        
        setImageFiles(newImageFiles)
        setImagePreviews(newImagePreviews)
        setUploadingImages([...newUploadingImages])
        
        toast.success(`Image ${file.name} processed successfully`)
      } catch (error) {
        console.error('Error processing image:', error)
        toast.error(`Failed to process image ${file.name}`)
        newUploadingImages[newUploadingImages.length - 1] = false
        setUploadingImages([...newUploadingImages])
      }
    }
  }

  const removeImage = (index: number) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index)
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index)
    const newUploadingImages = uploadingImages.filter((_, i) => i !== index)
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index])

    setImageFiles(newImageFiles)
    setImagePreviews(newImagePreviews)
    setUploadingImages(newUploadingImages)
  }

  const uploadImagesToSupabase = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return []

    const supabase = await getSupabaseClient()
    const imageUrls: string[] = []
    
    // Ensure user is authenticated
    if (!user) {
      throw new Error('User must be authenticated to upload images')
    }
    
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      const fileExtension = file.name.split('.').pop()
      let fileName = `${user.uid}/${uuidv4()}.${fileExtension}`
      
      try {
        // Simplified approach - try multiple methods
        let uploadSuccess = false
        let uploadError: any = null
        
        // Method 1: Standard upload
        try {
          const { data: uploadData, error: error1 } = await supabase.storage
            .from('product-images')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            })
          
          if (!error1) {
            uploadSuccess = true
          } else {
            uploadError = error1
          }
        } catch (e) {
          uploadError = e
        }
        
        // Method 2: Try with different path if Method 1 fails
        if (!uploadSuccess) {
          try {
            const alternativeFileName = `public/${user.uid}/${uuidv4()}.${fileExtension}`
            const { data: uploadData2, error: error2 } = await supabase.storage
              .from('product-images')
              .upload(alternativeFileName, file, {
                cacheControl: '3600',
                upsert: false
              })
            
            if (!error2) {
              fileName = alternativeFileName
              uploadSuccess = true
            } else {
              uploadError = error2
            }
          } catch (e) {
            uploadError = e
          }
        }
        
        // Method 3: Try with upsert if both methods fail
        if (!uploadSuccess) {
          try {
            const finalFileName = `uploads/${user.uid}/${uuidv4()}.${fileExtension}`
            const { data: uploadData3, error: error3 } = await supabase.storage
              .from('product-images')
              .upload(finalFileName, file, {
                cacheControl: '3600',
                upsert: true // Try with upsert
              })
            
            if (!error3) {
              fileName = finalFileName
              uploadSuccess = true
            } else {
              uploadError = error3
            }
          } catch (e) {
            uploadError = e
          }
        }
        
        if (!uploadSuccess) {
          console.error('All upload methods failed:', uploadError)
          throw new Error(`Failed to upload image ${file.name}. Please check your Supabase storage configuration. Error: ${uploadError?.message || 'Unknown error'}`)
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)
        
        imageUrls.push(urlData.publicUrl)
        toast.success(`Image ${i + 1} uploaded successfully`)
      } catch (error: any) {
        console.error('Error uploading image:', error)
        
        // Provide clear guidance
        if (error.message.includes('row-level security policy')) {
          throw new Error(`Storage access denied. You need to configure your Supabase storage bucket. Go to Supabase Dashboard → Storage → Buckets → product-images → Settings → Disable Row Level Security (for testing) or set up proper RLS policies.`)
        }
        
        throw new Error(`Failed to upload image ${file.name}: ${error.message}`)
      }
    }
    
    return imageUrls
  }

  const onSubmit = async (data: FormData) => {
    if (!user || !userProfile) {
      toast.error('Please log in to submit your listing')
      return
    }

    setSubmitting(true)

    try {
      const supabase = await getSupabaseClient()
      
      // Upload images first
      let imageUrls: string[] = []
      if (imageFiles.length > 0) {
        imageUrls = await uploadImagesToSupabase()
      }

      // Create the product listing
      const { error } = await supabase
        .from('marketplace_products')
        .insert({
          user_id: user.uid,
          area: 'parel',
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          condition: data.condition,
          images: imageUrls,
          contact_phone: data.contact_phone,
          is_active: true,
        })

      if (error) {
        console.error('Error creating listing:', error)
        toast.error('Failed to create listing')
        
        // Clean up uploaded images if database insert fails
        if (imageUrls.length > 0) {
          try {
            const fileNames = imageUrls.map(url => {
              const urlParts = url.split('/')
              return urlParts[urlParts.length - 1]
            })
            await supabase.storage.from('product-images').remove(fileNames)
          } catch (cleanupError) {
            console.error('Error cleaning up images:', cleanupError)
          }
        }
        return
      }

      toast.success('Your item has been listed successfully!')
      router.push('/parel/marketplace')
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
            onClick={() => router.push('/parel')}
            className="mt-4"
          >
            Go to Parel Homepage
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
              <p className="text-gray-600">List your item in the marketplace</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Temporary Debug Component */}
        <div className="mb-6">
          <StorageDebug />
        </div>
        
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
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB each (max 5 images)</p>
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
                        <div key={index} className="relative group">
                          {uploadingImages[index] ? (
                            <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                            </div>
                          ) : (
                            <>
                              <img
                                src={image}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = '/placeholder-image.svg' // Fallback image
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                title="Remove image"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {imageFiles.length > 0 && (
                    <div className="text-sm text-gray-500">
                      {imageFiles.length} of 5 images selected
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