'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationSchema, ApplicationFormData } from '@/lib/application-schema';
import { createRentalApplication } from '@/lib/actions';
import { getSupabaseClient } from '@/lib/supabase';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import { toast, Toaster } from 'sonner';
import { Apartment } from '@/types/apartment';
import ConfirmationPage from '@/components/ConfirmationPage';
import LoginModal from '@/components/LoginModal';
import { Button } from '@/components/ui/button';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function ApplyForRentPage() {
  const [user, setUser] = useState<User | null>(null);
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const apartmentId = params.id as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoadingUser(false);
      if (user) {
        setValue('name', user.displayName || '');
        setValue('email', user.email || '');
      }
    });

    return () => unsubscribe();
  }, [setValue]);

  useEffect(() => {
    if (!apartmentId) return;

    const fetchApartment = async () => {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from('apartments')
        .select('*')
        .eq('id', apartmentId)
        .single();

      if (error || !data) {
        toast.error('Failed to load apartment details.');
        console.error('Error fetching apartment:', error);
        router.push('/worli/rent');
      } else {
        setApartment(data);
      }
    };

    fetchApartment();
  }, [apartmentId, router]);

  const onFormError = (errors: any) => {
    const errorFields = Object.keys(errors);
    toast.error(`Please correct the following fields: ${errorFields.join(', ')}`);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!user || !apartment) {
      toast.error('User or apartment data is missing.');
      console.error('Missing data:', { user: !!user, apartment: !!apartment });
      return;
    }
    
    console.log('Submitting application with data:', {
      formData: data,
      apartmentId: apartment.id,
      landlordUserId: apartment.user_id,
      applicantUserId: user.uid
    });
    
    setIsSubmitting(true);
    try {
      const result = await createRentalApplication(data, apartment.id!, apartment.user_id, user.uid);
      console.log('Submission result:', result);
      
      if (result.success) {
        setSubmissionSuccess(true);
      } else {
        console.error('Submission failed:', result.error);
        toast.error(`Failed to submit application: ${result.error}`);
      }
    } catch (error) {
      console.error('Unexpected error during submission:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (submissionSuccess) {
    return (
      <ConfirmationPage
        title="Application Submitted!"
        message="Your application has been sent to the landlord. They will contact you shortly to schedule a visit."
        buttonText="Back to Worli Rentals"
        buttonLink="/worli/rent"
      />
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={() => {
            setIsLoginModalOpen(false);
            toast.success('Logged in successfully!');
          }}
        />
        <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <HomeIcon className="mx-auto h-12 w-12 text-blue-500" />
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Schedule a Visit
            </h2>
            <p className="mt-2 text-gray-600">
              Please log in or create an account to schedule a visit for this property.
            </p>
            <Button
              onClick={() => setIsLoginModalOpen(true)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Login / Register
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Indigo Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Schedule a Visit</h1>
        </div>
      </div>
      <Toaster richColors position="top-center" />
      <div className="container mx-auto max-w-2xl py-6 px-4">
        <p className="text-gray-600 mb-4">Submit your details to schedule a visit for the property at <span className="font-semibold">{apartment?.building_name}</span>
        Our representative will contact you shortly.</p>
        
        <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" {...register('name')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" {...register('email')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="mobile_no" className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input type="text" {...register('mobile_no')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            {errors.mobile_no && <p className="text-red-500 text-sm mt-1">{errors.mobile_no.message}</p>}
          </div>

          <div>
            <label htmlFor="family_members" className="block text-sm font-medium text-gray-700">Number of Family Members</label>
            <input type="number" {...register('family_members')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            {errors.family_members && <p className="text-red-500 text-sm mt-1">{errors.family_members.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Any Pets?</label>
            <div className="flex items-center space-x-4">
              <label><input type="radio" {...register('has_pets')} value="true" className="mr-2" /> Yes</label>
              <label><input type="radio" {...register('has_pets')} value="false" className="mr-2" /> No</label>
            </div>
            {errors.has_pets && <p className="text-red-500 text-sm mt-1">{errors.has_pets.message}</p>}
          </div>

          <div>
            <label htmlFor="employment_status" className="block text-sm font-medium text-gray-700">Employment Status</label>
            <input type="text" {...register('employment_status')} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Salaried, Self-employed" />
            {errors.employment_status && <p className="text-red-500 text-sm mt-1">{errors.employment_status.message}</p>}
          </div>

          <div>
            <label htmlFor="current_city" className="block text-sm font-medium text-gray-700">Current City</label>
            <input type="text" {...register('current_city')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            {errors.current_city && <p className="text-red-500 text-sm mt-1">{errors.current_city.message}</p>}
          </div>

          <div>
            <label htmlFor="current_state" className="block text-sm font-medium text-gray-700">Current State</label>
            <input type="text" {...register('current_state')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            {errors.current_state && <p className="text-red-500 text-sm mt-1">{errors.current_state.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
} 