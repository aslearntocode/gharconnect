import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase-auth';

const firstTimeLoginSchema = z.object({
  societyName: z.string().min(1, 'Society name is required'),
  buildingName: z.string().min(1, 'Building name is required'),
  apartmentNumber: z.string().min(1, 'Apartment number is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

type FirstTimeLoginFormValues = z.infer<typeof firstTimeLoginSchema>;

interface FirstTimeLoginFormProps {
  onComplete: () => void;
}

export function FirstTimeLoginForm({ onComplete }: FirstTimeLoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  ;

  const form = useForm<FirstTimeLoginFormValues>({
    resolver: zodResolver(firstTimeLoginSchema),
    defaultValues: {
      societyName: '',
      buildingName: '',
      apartmentNumber: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (data: FirstTimeLoginFormValues) => {
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
          society_name: data.societyName,
          building_name: data.buildingName,
          apartment_number: data.apartmentNumber,
          email: data.email,
          phone: data.phone || null,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw new Error(error.message);
      }
      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while saving your profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
          {error}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="societyName"
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
            name="buildingName"
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
            name="apartmentNumber"
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
            {isLoading ? 'Saving...' : 'Complete Profile'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 