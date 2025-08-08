"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { supabase } from '@/lib/supabase-auth'

const profileSchema = z.object({
  society_name: z.string().min(1, "Society name is required"),
  building_name: z.string().min(1, "Building name is required"),
  apartment_number: z.string().min(1, "Apartment number is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface UserProfile {
  user_id: string;
  society_name: string;
  building_name: string;
  apartment_number: string;
  email: string;
  phone?: string;
  updated_at?: string;
}

interface ProfileEditProps {
  initialProfile?: UserProfile | null;
}

export function ProfileEdit({ initialProfile }: ProfileEditProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  

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
        // If initialProfile is provided, use it
        if (initialProfile) {
          form.reset({
            society_name: initialProfile.society_name || "",
            building_name: initialProfile.building_name || "",
            apartment_number: initialProfile.apartment_number || "",
            email: initialProfile.email || "",
            phone: initialProfile.phone || "",
          });
          return;
        }

        // Otherwise fetch from database
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        if (userError || !currentUser) {
          setError("No user found. Please try logging in again.");
          return;
        }

        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No rows returned - this is expected for new users
            return;
          }
          console.error('Error fetching profile:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
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
  }, [isOpen, form, supabase, initialProfile]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        throw new Error('No user found. Please try logging in again.');
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: currentUser.id,
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
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error instanceof Error ? error.message : 'An error occurred while saving your profile');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
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
              name="society_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Society Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your society name" {...field} />
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
                  <FormLabel>Building Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your building name" {...field} />
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
                  <FormLabel>Apartment Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your apartment number" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 