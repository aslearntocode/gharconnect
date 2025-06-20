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
import { supabase } from '@/lib/supabaseClient';
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
import LoginModal from '@/components/LoginModal';
import { Button } from '@/components/ui/button';

export default function RentApartmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
      images: []
    }
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  const parkingAvailable = watch('parking_available');
  const petFriendly = watch('pet_friendly');

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => {
      const newAmenities = prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity];
      
      setValue('amenities', newAmenities);
      return newAmenities;
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalImages = uploadedImages.length + newFiles.length;

    if (totalImages > 10) {
      toast.error('You can upload a maximum of 10 images');
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = newFiles.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Please upload only JPEG, PNG, or WebP images');
      return;
    }

    // Validate file sizes (max 5MB each)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = newFiles.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast.error('Each image must be less than 5MB');
      return;
    }

    setUploadedImages(prev => [...prev, ...newFiles]);

    // Create preview URLs
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToSupabase = async (userId: string): Promise<string[]> => {
    if (uploadedImages.length === 0) return [];

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < uploadedImages.length; i++) {
        const file = uploadedImages[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${i}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('rental-apartment-photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Error uploading image:', error);
          throw new Error(`Failed to upload image ${i + 1}: ${error.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('rental-apartment-photos')
          .getPublicUrl(fileName);

        uploadedUrls.push(urlData.publicUrl);
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ApartmentFormData) => {
    console.log('Create listing button clicked. Starting submission process...');
    console.log('Form data:', data);
    setIsSubmitting(true);
    
    try {
      // Get current user
      console.log('Checking for logged-in user...');
      if (loadingUser) {
        toast.error("Still checking user session, please wait...");
        setIsSubmitting(false);
        return;
      }
      
      if (!user) {
        console.error('Authentication Error: User is not logged in with Firebase.');
        toast.error('Please login to create an apartment listing.');
        setIsSubmitting(false);
        return;
      }
      console.log('User found:', user.uid);

      // Upload images first
      let imageUrls: string[] = [];
      if (uploadedImages.length > 0) {
        try {
          console.log('Uploading images to Supabase Storage...');
          imageUrls = await uploadImagesToSupabase(user.uid);
          console.log('Image URLs received:', imageUrls);
          toast.success(`Successfully uploaded ${imageUrls.length} images`);
        } catch (error) {
          console.error('Image upload failed:', error);
          toast.error('Failed to upload images. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      // Add image URLs to form data
      const formDataWithImages = {
        ...data,
        images: imageUrls
      };

      console.log('Saving apartment data to Supabase...');
      const result = await createApartment(formDataWithImages, user.uid);
      
      if (result.success) {
        console.log('Apartment created successfully:', result.data);
        toast.success('Apartment listing created successfully!');
        reset();
        setSelectedAmenities([]);
        setUploadedImages([]);
        setImagePreviewUrls([]);
      } else {
        console.error('Failed to create apartment:', result.error);
        toast.error(result.error || 'Failed to create apartment listing');
      }
    } catch (error) {
      console.error('An unexpected error occurred during submission:', error);
      toast.error('An unexpected error occurred. Check the console for details.');
    } finally {
      setIsSubmitting(false);
      console.log('Submission process finished.');
    }
  };

  const onFormError = (errors: any) => {
    console.error('Form validation failed. Errors:', errors);
    toast.error('Please check the form for errors.');
  };

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
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
              List Your Property
            </h2>
            <p className="mt-2 text-gray-600">
              Please log in or create an account to start listing your apartment for rent.
            </p>
            <Button
              onClick={() => setIsLoginModalOpen(true)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Login / Register
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <HomeIcon className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">List Your Apartment for Rent</h1>
                <p className="text-blue-100 mt-1">Fill in the details below to create your rental listing</p>
              </div>
            </div>
          </div>

          {/* Form */}
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
                    placeholder="e.g., Beautiful 2BHK in Bandra West"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
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
                  {errors.apartment_type && (
                    <p className="text-red-500 text-sm mt-1">{errors.apartment_type.message}</p>
                  )}
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
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
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
                  {errors.building_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.building_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Name *
                  </label>
                  <input
                    type="text"
                    {...register('street_name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Marine Drive, Bandra West"
                  />
                  {errors.street_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.street_name.message}</p>
                  )}
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
                  {errors.tower && (
                    <p className="text-red-500 text-sm mt-1">{errors.tower.message}</p>
                  )}
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
                  {errors.apartment_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.apartment_number.message}</p>
                  )}
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
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
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
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                  )}
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
                  {errors.pincode && (
                    <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor Number
                  </label>
                  <input
                    type="number"
                    {...register('floor_number', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 5"
                    min={0}
                  />
                  {errors.floor_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.floor_number.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Floors
                  </label>
                  <input
                    type="number"
                    {...register('total_floors', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 20"
                    min={1}
                  />
                  {errors.total_floors && (
                    <p className="text-red-500 text-sm mt-1">{errors.total_floors.message}</p>
                  )}
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
                    {...register('carpet_area', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 800"
                    min={100}
                  />
                  {errors.carpet_area && (
                    <p className="text-red-500 text-sm mt-1">{errors.carpet_area.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent (₹) *
                  </label>
                  <input
                    type="number"
                    {...register('rent_amount', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 25000"
                    min={1000}
                  />
                  {errors.rent_amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.rent_amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Deposit (₹) *
                  </label>
                  <input
                    type="number"
                    {...register('security_deposit', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 50000"
                    min={0}
                  />
                  {errors.security_deposit && (
                    <p className="text-red-500 text-sm mt-1">{errors.security_deposit.message}</p>
                  )}
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
                  {errors.available_from && (
                    <p className="text-red-500 text-sm mt-1">{errors.available_from.message}</p>
                  )}
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
                  {errors.furnishing_status && (
                    <p className="text-red-500 text-sm mt-1">{errors.furnishing_status.message}</p>
                  )}
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
                  {errors.parking_available && (
                    <p className="text-red-500 text-sm mt-1">{errors.parking_available.message}</p>
                  )}
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
                    {errors.parking_type && (
                      <p className="text-red-500 text-sm mt-1">{errors.parking_type.message}</p>
                    )}
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
              {errors.amenities && (
                <p className="text-red-500 text-sm mt-1">{errors.amenities.message}</p>
              )}
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
                  {errors.pet_friendly && (
                    <p className="text-red-500 text-sm mt-1">{errors.pet_friendly.message}</p>
                  )}
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
                  {errors.preferred_tenant_type && (
                    <p className="text-red-500 text-sm mt-1">{errors.preferred_tenant_type.message}</p>
                  )}
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
                  {errors.bachelor_allowed && (
                    <p className="text-red-500 text-sm mt-1">{errors.bachelor_allowed.message}</p>
                  )}
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
                  {errors.contact_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.contact_name.message}</p>
                  )}
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
                  {errors.contact_phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.contact_phone.message}</p>
                  )}
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
                  {errors.contact_email && (
                    <p className="text-red-500 text-sm mt-1">{errors.contact_email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <PhotoIcon className="h-5 w-5 mr-2" />
                Images (Optional)
              </h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-semibold text-gray-900">
                        Upload Photos
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PNG, JPG, WebP up to 5MB each
                      </span>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
                
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Apartment image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="text-sm text-gray-500">
                  You can upload up to 10 images. Each image should be less than 5MB.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setSelectedAmenities([]);
                  setUploadedImages([]);
                  setImagePreviewUrls([]);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading || loadingUser}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting || isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{isUploading ? 'Uploading Images...' : 'Creating Listing...'}</span>
                  </>
                ) : loadingUser ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Loading...</span>
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