'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apartmentFormSchema, ApartmentFormData } from '@/lib/apartment-schema';
import { createApartment } from '@/lib/apartment-utils';
import { 
  APARTMENT_TYPES, 
  FURNISHING_STATUS, 
  PARKING_TYPES, 
  PREFERRED_TENANT_TYPES,
  AMENITIES_OPTIONS 
} from '@/types/apartment';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { 
  HomeIcon, 
  MapPinIcon, 
  CurrencyRupeeIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  PhotoIcon,
  CheckIcon,
  XMarkIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import SuccessPage from '@/components/SuccessPage';
import { Button } from '@/components/ui/button';
import { HiMagnifyingGlassCircle, HiFaceSmile, HiDocumentText } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';

export default function RentApartmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<ApartmentFormData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const pathname = usePathname();
  const location = pathname.split('/')[1]?.charAt(0).toUpperCase() + pathname.split('/')[1]?.slice(1) || 'Location';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<ApartmentFormData>({
    resolver: zodResolver(apartmentFormSchema),
    defaultValues: {
      parking_available: false,
      pet_friendly: false,
      bachelor_allowed: true,
      amenities: [],
    }
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      setUser(user);
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  const parkingAvailable = watch('parking_available');
  const petFriendly = watch('pet_friendly');

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => {
      if (prev.includes(amenity)) {
        const newAmenities = prev.filter(a => a !== amenity);
        setValue('amenities', newAmenities);
        return newAmenities;
      } else {
        if (prev.length >= 10) {
          toast.error('You can select a maximum of 10 amenities');
          return prev;
        }
        const newAmenities = [...prev, amenity];
        setValue('amenities', newAmenities);
        return newAmenities;
      }
    });
  };

  const onSubmit = async (data: ApartmentFormData) => {
    if (!user) {
      toast.error('Please login to create an apartment listing.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await createApartment(data, user.uid, location);
      
      if (result.success) {
        setSubmittedData(data);
        setSubmissionSuccess(true);
        reset();
        setSelectedAmenities([]);
        toast.success('Property listed successfully!');
      } else {
        toast.error(result.error || 'Failed to create apartment listing');
      }
    } catch (error) {
      console.error('Error creating apartment:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleListAnother = () => {
    setSubmissionSuccess(false);
    setSubmittedData(null);
  };

  const onFormError = (errors: any) => {
    const fieldNameMap: { [key: string]: string } = {
      title: 'Listing Title',
      description: 'Description',
      building_name: 'Building Name',
      street_name: 'Street Name',
      tower: 'Tower',
      apartment_number: 'Apartment Number',
      city: 'City',
      state: 'State',
      pincode: 'Pincode',
      apartment_type: 'Apartment Type',
      floor_number: 'Floor Number',
      carpet_area: 'Carpet Area',
      rent_amount: 'Rent Amount',
      security_deposit: 'Security Deposit',
      available_from: 'Available From',
      contact_name: 'Contact Name',
      contact_phone: 'Contact Phone',
      contact_email: 'Contact Email',
    };

    const errorFields = Object.keys(errors).map(field => fieldNameMap[field] || field);
    
    if (errorFields.length > 0) {
      const errorMessage = `Please correct the following fields: ${errorFields.join(', ')}`;
      toast.error(errorMessage);
    } else {
      toast.error('Please fill all mandatory fields and correct any errors.');
    }
  };

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (submissionSuccess && submittedData) {
    return <SuccessPage apartmentData={submittedData} onListAnother={handleListAnother} />;
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">List Your Property for Rent in Parel</h1>
          <p className="text-gray-600 mb-8">Please login to create your property listing.</p>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Login to Continue
          </button>
        </div>
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={() => {
            setIsLoginModalOpen(false);
            toast.success('Logged in successfully!');
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <HomeIcon className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">List Your Apartment for Rent in Parel</h1>
                <p className="text-blue-100 mt-1">Fill in the details below to create your rental listing</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit, onFormError)} className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <HomeIcon className="h-5 w-5 mr-2" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    {...register('title')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Beautiful 2BHK in Parel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apartment Type *
                  </label>
                  <select
                    {...register('apartment_type')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select apartment type</option>
                    {APARTMENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your apartment, its features, and what makes it special..."
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                Location Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Building Name *
                  </label>
                  <input
                    type="text"
                    {...register('building_name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Sunshine Apartments"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Name *
                  </label>
                  <input
                    type="text"
                    {...register('street_name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Parel Station Road"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tower *
                  </label>
                  <input
                    type="text"
                    {...register('tower')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Tower A, Block 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apartment Number *
                  </label>
                  <input
                    type="text"
                    {...register('apartment_number')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 502, A-15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    {...register('city')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    {...register('state')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Maharashtra"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    {...register('pincode')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor Number
                  </label>
                  <input
                    type="number"
                    {...register('floor_number')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 5"
                    min={0}
                  />
                </div>
              </div>
            </div>

            {/* Area & Pricing */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CurrencyRupeeIcon className="h-5 w-5 mr-2" />
                Area & Pricing
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carpet Area (sq ft) *
                  </label>
                  <input
                    type="number"
                    {...register('carpet_area')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 800"
                    min={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent (₹) *
                  </label>
                  <input
                    type="number"
                    {...register('rent_amount')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 25000"
                    min={1000}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Deposit (₹) *
                  </label>
                  <input
                    type="number"
                    {...register('security_deposit')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 50000"
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available From
                  </label>
                  <input
                    type="date"
                    {...register('available_from')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Furnishing & Parking */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Furnishing & Parking</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Furnishing Status
                  </label>
                  <select
                    {...register('furnishing_status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select furnishing status</option>
                    {FURNISHING_STATUS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parking Available
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('parking_available')}
                        value="true"
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('parking_available')}
                        value="false"
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>

                {parkingAvailable && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parking Type
                    </label>
                    <select
                      {...register('parking_type')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select parking type</option>
                      {PARKING_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Amenities <span className="text-sm font-normal text-gray-500">(select up to 10)</span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {AMENITIES_OPTIONS.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tenant Preferences */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Tenant Preferences</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet Friendly
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('pet_friendly')}
                        value="true"
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('pet_friendly')}
                        value="false"
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Tenant Type
                  </label>
                  <select
                    {...register('preferred_tenant_type')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select preferred tenant type</option>
                    {PREFERRED_TENANT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bachelor Allowed
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('bachelor_allowed')}
                        value="true"
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('bachelor_allowed')}
                        value="false"
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    {...register('contact_name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    {...register('contact_phone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    {...register('contact_email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                  />
                  {errors.contact_email && <p className="mt-1 text-sm text-red-600">{errors.contact_email.message}</p>}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <PhotoIcon className="h-5 w-5 mr-2" />
                Apartment Photos
              </h2>
              <div className="rounded-md bg-indigo-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Next Step: Send Photos</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>After creating the listing, please WhatsApp your apartment photos to <strong className="font-semibold">+91 9321314553</strong>. Make sure to send them from the same phone number you've provided in the contact details.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setSelectedAmenities([]);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loadingUser}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Listing...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    <span>Create Listing</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 