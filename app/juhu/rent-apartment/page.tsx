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
import LoginModal from '@/components/LoginModal';
import SuccessPage from '@/components/SuccessPage';
import { Button } from '@/components/ui/button';
import { HiMagnifyingGlassCircle, HiFaceSmile, HiDocumentText } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

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
      if (prev.includes(amenity)) {
        // If amenity is already selected, remove it
        const newAmenities = prev.filter(a => a !== amenity);
        setValue('amenities', newAmenities);
        return newAmenities;
      } else {
        // If trying to add a new amenity, check if we're at the limit
        if (prev.length >= 10) {
          toast.error('You can select a maximum of 10 amenities');
          return prev;
        }
        // Add the new amenity
        const newAmenities = [...prev, amenity];
        setValue('amenities', newAmenities);
        return newAmenities;
      }
    });
  };

  const onSubmit = async (data: ApartmentFormData) => {
    console.log('Create listing button clicked. Starting submission process...');
    console.log('Form data:', data);
    console.log('Form data type:', typeof data);
    console.log('Form data keys:', Object.keys(data));
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

      console.log('Saving apartment data to Supabase...');
      const result = await createApartment(data, user.uid, location);
      
      if (result.success) {
        console.log('Apartment created successfully:', result.data);
        setSubmittedData(data);
        setSubmissionSuccess(true);
        reset();
        setSelectedAmenities([]);
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

  const handleListAnother = () => {
    setSubmissionSuccess(false);
    setSubmittedData(null);
  };

  const onFormError = (errors: any) => {
    console.error('Form validation failed. Errors:', errors);
    console.error('Errors type:', typeof errors);
    console.error('Errors keys:', Object.keys(errors));
    
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

  // Info Banner and Cards (always visible)
  const InfoBannerAndCards = (
    <>
      {/* Indigo Info Banner */}
      <div className="w-full bg-indigo-600 flex flex-col items-center justify-center py-8 mb-4 rounded-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center md:text-left">List Your Property for Rent in {location}</h1>
        <p className="text-indigo-100 text-base md:text-lg mt-2 text-center max-w-5xl">
          Find trusted tenants for your property.
        </p>
      </div>
    </>
  );

  // Info Cards Section
  const InfoCards = (
    <section className="bg-white">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 px-2 sm:px-4">
        {/* Card 1: Icon Left, Text Right */}
        <motion.div
          className="flex flex-col md:flex-row items-center bg-gray-50 rounded-2xl shadow-lg p-10 md:p-16 min-h-[260px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="flex-shrink-0 flex justify-center md:justify-start mb-4 md:mb-0 md:mr-8 w-full md:w-1/3">
            <span className="inline-flex items-center justify-center rounded-full bg-indigo-100" style={{ width: 110, height: 110 }}>
              <HiMagnifyingGlassCircle className="text-indigo-500" size={80} />
            </span>
          </div>
          <div className="md:w-2/3 text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Eliminate the struggle of marketing your property</h3>
            <p className="text-gray-700 text-lg leading-relaxed">We market your property to our community of tenants who are looking for a new home. We are present at various events that are organized in your areas.</p>
          </div>
        </motion.div>
        {/* Card 2: Icon Right, Text Left */}
        <motion.div
          className="flex flex-col md:flex-row-reverse items-center bg-gray-50 rounded-2xl shadow-lg p-10 md:p-16 min-h-[260px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
        >
          <div className="flex-shrink-0 flex justify-center md:justify-end mb-4 md:mb-0 md:ml-8 w-full md:w-1/3">
            <span className="inline-flex items-center justify-center rounded-full bg-green-100" style={{ width: 110, height: 110 }}>
              <HiFaceSmile className="text-green-500" size={80} />
            </span>
          </div>
          <div className="md:w-2/3 text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Property Management Services</h3>
            <p className="text-gray-700 text-lg leading-relaxed">Our property management services include move-in/move-out audits, quarterly inspections, maintenance support, and a designated property manager. We provide these services to help owners manage their properties more effectively.</p>
          </div>
        </motion.div>
        {/* Card 3: Icon Left, Text Right */}
        <motion.div
          className="flex flex-col md:flex-row items-center bg-gray-50 rounded-2xl shadow-lg p-10 md:p-16 min-h-[260px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
        >
          <div className="flex-shrink-0 flex justify-center md:justify-start mb-4 md:mb-0 md:mr-8 w-full md:w-1/3">
            <span className="inline-flex items-center justify-center rounded-full bg-pink-100" style={{ width: 110, height: 110 }}>
              <HiDocumentText className="text-pink-500" size={80} />
            </span>
          </div>
          <div className="md:w-2/3 text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Seamless Paperwork</h3>
            <p className="text-gray-700 text-lg leading-relaxed">The rental process involves a lot of paperwork, including rental agreements, security deposits, and utility bills. We handle all the paperwork for you, ensuring that it is completed accurately and in a timely manner.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );

  // Floating Login/WhatsApp Box
  const FloatingLoginBox = (
    <div className="sticky top-4 bg-white rounded-lg shadow-xl p-8 max-w-md w-full h-fit">
      <HomeIcon className="mx-auto h-12 w-12 text-blue-500" />
      <h2 className="mt-6 text-2xl font-bold text-gray-900 text-center">
        List Your Property
      </h2>
      <p className="mt-2 text-gray-600 text-center">
        Please log in or create an account to start listing your apartment for rent.
      </p>
      <Button
        onClick={() => setIsLoginModalOpen(true)}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        Login / Register
      </Button>
      <div className="mt-4 text-center text-sm text-gray-500">
        or
      </div>
      <a
        href="https://wa.me/919321314553?text=I'm%20interested%20in%20listing%20my%20property%20for%20rent%20in%20Parel"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp at +91 9321314553
      </a>
    </div>
  );

  if (loadingUser) {
    return (
      <div>
        {InfoBannerAndCards}
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (submissionSuccess && submittedData) {
    return <SuccessPage apartmentData={submittedData} onListAnother={handleListAnother} />;
  }

  if (!user) {
    return (
      <>
        {InfoBannerAndCards}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={() => {
            setIsLoginModalOpen(false);
            toast.success('Logged in successfully!');
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Info Cards */}
            <div className="lg:col-span-2">
              {InfoCards}
            </div>
            {/* Right Column - Floating Login Box */}
            <div className="lg:col-span-1">
              {FloatingLoginBox}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      {InfoBannerAndCards}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          {/* <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <HomeIcon className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">List Your Apartment for Rent in {location}</h1>
                <p className="text-blue-100 mt-1">Fill in the details below to create your rental listing in {location}</p>
              </div>
            </div>
          </div> */}

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
                    placeholder="e.g., Marine Drive, Bandra West"
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