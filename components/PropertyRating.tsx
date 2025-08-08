"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase-auth'
import { generateAnonymousId } from '@/lib/anonymousId'
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

const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters long'),
})

type RatingFormValues = z.infer<typeof ratingSchema>

interface PropertyRatingProps {
  propertyId: string
  propertyName: string
  onRatingAdded?: () => void
}

export function PropertyRating({ propertyId, propertyName, onRatingAdded }: PropertyRatingProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginMessage, setLoginMessage] = useState('')
  

  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: 5,
      comment: '',
    },
  })

  const onSubmit = async (data: RatingFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      if (userError || !currentUser) {
        setError('Please log in to rate this property')
        setIsLoading(false)
        return
      }

      // First check if user has already rated this property
      const { data: existingRating, error: checkError } = await supabase
        .from('property_reviews')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('property_id', propertyId)
        .maybeSingle()

      if (checkError) {
        console.error('Error checking existing rating:', checkError)
        throw new Error(`Failed to check existing rating: ${checkError.message}`)
      }

      if (existingRating) {
        setError('You have already rated this property')
        setIsLoading(false)
        return
      }

      // Generate anonymous ID for display
      const anonymousId = generateAnonymousId(currentUser.id)

      // Proceed with inserting the new rating with anonymous display name
      const { error: insertError } = await supabase.from('property_reviews').insert({
        user_id: currentUser.id,
        user_name: anonymousId, // Store anonymous ID instead of real name
        property_id: propertyId,
        property_name: propertyName,
        rating: data.rating,
        comment: data.comment,
      })

      if (insertError) {
        console.error('Error inserting rating:', insertError)
        if (insertError.code === '23505') { // Unique violation
          setError('You have already rated this property')
        } else if (insertError.code === '42501') { // Permission denied
          setError('You do not have permission to rate this property')
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
    return Array.from({ length: 5 }).map((_, index) => {
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

  const handleRateClick = () => {
    const { data: { user } } = await supabase.auth.getUser(); if (!user) {
      setIsOpen(false)
      setLoginMessage('Login to rate this property')
      setShowLoginModal(true)
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      {!showLoginModal && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs px-4 py-2" onClick={handleRateClick}>
              Write a Review
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Rate {propertyName}</DialogTitle>
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
                          placeholder="Share your experience with this property..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit Review'}
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
    </>
  )
} 