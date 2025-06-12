"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { auth } from '@/lib/firebase'
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
  const supabase = createClientComponentClient()

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
      const currentUser = auth.currentUser
      if (!currentUser) {
        setError('Please log in to rate this vendor')
        setIsLoading(false)
        return
      }

      // First check if user has already rated this vendor
      const { data: existingRating, error: checkError } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', currentUser.uid)
        .eq('card_id', vendorId)
        .maybeSingle()

      if (checkError) {
        console.error('Error checking existing rating:', checkError)
        throw new Error(`Failed to check existing rating: ${checkError.message}`)
      }

      if (existingRating) {
        throw new Error('You have already rated this vendor')
      }

      // Proceed with inserting the new rating
      const { error: insertError } = await supabase.from('reviews').insert({
        user_id: currentUser.uid,
        user_name: currentUser.displayName || currentUser.email,
        card_id: vendorId,
        card_name: vendorName,
        rating: data.rating,
        comment: data.comment,
      })

      if (insertError) {
        console.error('Error inserting rating:', insertError)
        if (insertError.code === '23505') { // Unique violation
          throw new Error('You have already rated this vendor')
        } else if (insertError.code === '42501') { // Permission denied
          throw new Error('You do not have permission to rate this vendor')
        } else {
          throw new Error(`Failed to add rating: ${insertError.message}`)
        }
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-7">
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
  )
} 