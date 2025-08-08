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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const reviewSchema = z.object({
  rating: z.number().min(1).max(10),
  comment: z.string().min(10, 'Comment must be at least 10 characters long'),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

interface AddReviewProps {
  cardId: string
  cardName: string
  onReviewAdded?: () => void
}

export function AddReview({ cardId, cardName, onReviewAdded }: AddReviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: '',
    },
  })

  const onSubmit = async (data: ReviewFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      if (userError || !currentUser) {
        throw new Error('You must be logged in to add a review')
      }

      // Generate anonymous ID for display
      const anonymousId = generateAnonymousId(currentUser.id)

      const { error } = await supabase.from('reviews').insert({
        user_id: currentUser.id,
        user_name: anonymousId, // Store anonymous ID instead of real name
        card_id: cardId,
        card_name: cardName,
        rating: data.rating,
        comment: data.comment,
      })

      if (error) throw error

      setIsOpen(false)
      form.reset()
      if (onReviewAdded) {
        onReviewAdded()
      }
    } catch (error) {
      console.error('Error adding review:', error)
      setError(error instanceof Error ? error.message : 'Failed to add review')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Write a Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Review {cardName}</DialogTitle>
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
                  <FormLabel>Rating (1-10)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
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
                      placeholder="Share your experience with this card..."
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
  )
} 