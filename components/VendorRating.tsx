"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase-auth'
import { generateAnonymousId } from '@/lib/anonymousId'
import { checkProfileCompletion } from '@/lib/profileUtils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import LoginModal from '@/components/LoginModal'
import { ProfileCompletionModal } from '@/components/ProfileCompletionModal'

const ratingSchema = z.object({
  rating: z.number().min(1).max(10),
  comment: z.string().min(10, 'Comment must be at least 10 characters long'),
})

type RatingFormValues = z.infer<typeof ratingSchema>

interface VendorRatingProps {
  vendorId: string
  vendorName: string
  vendorType: 'service' | 'delivery'
  onRatingAdded?: () => void
}

export function VendorRating({ vendorId, vendorName, vendorType, onRatingAdded }: VendorRatingProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [missingFields, setMissingFields] = useState<string[]>([])
  const [loginMessage, setLoginMessage] = useState('')
  

  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: 5,
      comment: '',
    },
  })

  // Use the same vendor ID generation logic as VendorCard
  const generateVendorId = (vendorId: string | null | undefined): string => {
    console.log('VendorRating: Generating vendor ID for:', { vendorId, vendorName, type: typeof vendorId });
    
    // If vendorId is a valid string, use it
    if (vendorId && typeof vendorId === 'string' && vendorId.trim() !== '') {
      console.log('VendorRating: Using provided vendorId:', vendorId);
      return vendorId;
    }
    
    // If vendorId is null/undefined/empty, use vendorName as fallback
    if (vendorName && typeof vendorName === 'string' && vendorName.trim() !== '') {
      console.log('VendorRating: Using vendorName as ID:', vendorName);
      return vendorName;
    }
    
    // Final fallback
    const fallbackId = `vendor_fallback_${Date.now()}`;
    console.log('VendorRating: Using fallback ID:', fallbackId);
    return fallbackId;
  };

  const checkProfileAndProceed = async () => {
    try {
      const { isComplete, missingFields: fields } = await checkProfileCompletion()
      
      if (!isComplete) {
        setMissingFields(fields)
        setShowProfileModal(true)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Error checking profile completion:', error)
      setError('Failed to check profile completion')
      return false
    }
  }

  const onSubmit = async (data: RatingFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      if (userError || !currentUser) {
        setError('Please log in to rate this vendor')
        setIsLoading(false)
        return
      }

      // Check profile completion before proceeding
      const profileComplete = await checkProfileAndProceed();
      if (!profileComplete) {
        setIsLoading(false)
        return;
      }

      // Debug logging
      console.log('Submitting rating for vendor:', { vendorId, vendorName, currentUser: currentUser.id, vendorIdType: typeof vendorId });

      // Use the same logic as VendorCard to generate a stable vendor ID
      let finalVendorId = generateVendorId(vendorId);

      // Validate vendorId is not null, empty, or invalid
      if (!finalVendorId || 
          typeof finalVendorId !== 'string' || 
          finalVendorId.trim() === '' || 
          finalVendorId === 'unknown' || 
          finalVendorId === 'undefined' ||
          finalVendorId === 'null') {
        console.error('Invalid vendor ID received:', { vendorId, finalVendorId, vendorName, type: typeof vendorId });
        // Generate a fallback ID instead of showing error
        finalVendorId = generateVendorId(null);
        console.log('Generated fallback vendor ID:', finalVendorId);
      }

      console.log('Final vendor ID for rating submission:', finalVendorId);

      // First check if user has already rated this vendor
      const { data: existingRating, error: checkError } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('card_id', finalVendorId)
        .maybeSingle()

      if (checkError) {
        console.error('Error checking existing rating:', checkError)
        throw new Error(`Failed to check existing rating: ${checkError.message}`)
      }

      if (existingRating) {
        setError('You have already rated this vendor')
        setIsLoading(false)
        return
      }

      // Generate anonymous ID for display
      const anonymousId = generateAnonymousId(currentUser.id)

      // Proceed with inserting the new rating with anonymous display name
      const { error: insertError } = await supabase.from('reviews').insert({
        user_id: currentUser.id,
        user_name: anonymousId, // Store anonymous ID instead of real name
        card_id: finalVendorId,
        card_name: vendorName,
        rating: data.rating,
        comment: data.comment,
      })

      if (insertError) {
        console.error('Error inserting rating:', insertError)
        if (insertError.code === '23505') { // Unique violation
          setError('You have already rated this vendor')
        } else if (insertError.code === '42501') { // Permission denied
          setError('You do not have permission to rate this vendor')
        } else {
          setError(`Failed to add rating: ${insertError.message}`)
        }
        setIsLoading(false)
        return
      }

      setIsOpen(false)
      form.reset()
      if (onRatingAdded) {
        onRatingAdded()
      }
    } catch (error) {
      console.error('Error in rating submission:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        setError(String(error.message))
      } else {
        setError('An unexpected error occurred while adding your rating')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 10 }).map((_, index) => {
      const ratingValue = index + 1
      return (
        <button
          key={ratingValue}
          type="button"
          className="focus:outline-none"
          onMouseEnter={() => setHoverRating(ratingValue)}
          onMouseLeave={() => setHoverRating(null)}
          onClick={() => form.setValue('rating', ratingValue)}
        >
          {ratingValue <= (hoverRating || form.watch('rating')) ? (
            <StarIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <StarOutlineIcon className="h-6 w-6 text-yellow-400" />
          )}
        </button>
      )
    })
  }

  const handleRateClick = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsOpen(false)
      setLoginMessage('Login for rating the vendor')
      setShowLoginModal(true)
      return
    }

    // Check profile completion before opening rating dialog
    const profileComplete = await checkProfileAndProceed();
    if (profileComplete) {
      setIsOpen(true);
    }
  }

  const handleProfileComplete = () => {
    setShowProfileModal(false)
    setIsOpen(true)
  }

  return (
    <>
      {!showLoginModal && !showProfileModal && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-7" onClick={handleRateClick}>
              Rate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Rate {vendorName}</DialogTitle>
            </DialogHeader>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
                {error}
              </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <div className="flex gap-1">
                          {renderStars(field.value)}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Review</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your experience with this vendor..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit Rating'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
      
      {showLoginModal && (
        <>
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm text-center">
            {loginMessage}
          </div>
          <LoginModal 
            isOpen={showLoginModal} 
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={() => {
              setShowLoginModal(false);
              setIsOpen(true);
            }}
          />
        </>
      )}

      {showProfileModal && (
        <ProfileCompletionModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onProfileComplete={handleProfileComplete}
          missingFields={missingFields}
        />
      )}
    </>
  )
} 