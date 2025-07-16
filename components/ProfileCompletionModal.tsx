"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { auth } from '@/lib/firebase'
import { UserProfile } from '@/lib/profileUtils'

const profileSchema = z.object({
  society_name: z.string().min(1, "Society name is required"),
  building_name: z.string().min(1, "Building name is required"),
  apartment_number: z.string().min(1, "Apartment number is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileCompletionModalProps {
  isOpen: boolean
  onClose: () => void
  onProfileComplete: () => void
  missingFields: string[]
}

export function ProfileCompletionModal({ 
  isOpen, 
  onClose, 
  onProfileComplete, 
  missingFields 
}: ProfileCompletionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      society_name: "",
      building_name: "",
      apartment_number: "",
      email: "",
      phone: "",
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setError("No user found. Please try logging in again.");
          return;
        }

        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', currentUser.uid)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          setError('Failed to load profile information');
          return;
        }

        if (profile) {
          form.reset({
            society_name: profile.society_name || "",
            building_name: profile.building_name || "",
            apartment_number: profile.apartment_number || "",
            email: profile.email || "",
            phone: profile.phone || "",
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile information');
      }
    };

    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen, form, supabase]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user found. Please try logging in again.');
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: currentUser.uid,
          society_name: data.society_name,
          building_name: data.building_name,
          apartment_number: data.apartment_number,
          email: data.email,
          phone: data.phone || null,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw new Error(error.message);
      }
      
      onProfileComplete();
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error instanceof Error ? error.message : 'An error occurred while saving your profile');
    } finally {
      setIsLoading(false);
    }
  }

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      society_name: "Society Name",
      building_name: "Building Name", 
      apartment_number: "Apartment Number",
      email: "Email",
      phone: "Phone"
    }
    return labels[field] || field
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
          <p className="font-medium mb-2">Please complete your profile before rating vendors.</p>
          <p className="text-xs">This helps us maintain the quality of reviews in our community.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="society_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={missingFields.includes('society_name') ? 'text-red-600' : ''}>
                    Society Name *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your society name" 
                      {...field} 
                      className={missingFields.includes('society_name') ? 'border-red-500' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="building_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={missingFields.includes('building_name') ? 'text-red-600' : ''}>
                    Building Name *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your building name" 
                      {...field} 
                      className={missingFields.includes('building_name') ? 'border-red-500' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apartment_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={missingFields.includes('apartment_number') ? 'text-red-600' : ''}>
                    Apartment Number *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your apartment number" 
                      {...field} 
                      className={missingFields.includes('apartment_number') ? 'border-red-500' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={missingFields.includes('email') ? 'text-red-600' : ''}>
                    Email *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      {...field} 
                      className={missingFields.includes('email') ? 'border-red-500' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Saving..." : "Complete Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 