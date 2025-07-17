'use client';

import React, { useState } from 'react';
import { FiX, FiPhone, FiMail, FiUser, FiHome } from 'react-icons/fi';
import { getSupabaseClient } from '@/lib/supabase';
import { Apartment } from '@/types/apartment';

interface PropertyInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartment: Apartment | null;
}

interface OwnerDetails {
  contact_phone: string;
  name?: string;
  email?: string;
}

export default function PropertyInquiryModal({ isOpen, onClose, apartment }: PropertyInquiryModalProps) {
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);
  const [ownerDetails, setOwnerDetails] = useState<OwnerDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mobile.trim()) {
      setError('Mobile number is required');
      return;
    }

    if (!apartment) {
      setError('Apartment information not available');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Get shared Supabase client
      const supabase = await getSupabaseClient();
      
      // Save inquiry to database
      const { error: insertError } = await supabase
        .from('property_inquiries')
        .insert({
          apartment_id: apartment.id,
          user_mobile: mobile.trim(),
          user_email: email.trim() || null,
          owner_contact_phone: apartment.contact_phone,
          owner_name: apartment.contact_name,
          owner_email: apartment.contact_email
        });

      if (insertError) {
        console.error('Error saving inquiry:', insertError);
        setError('Failed to save inquiry. Please try again.');
        return;
      }

      // Set owner details to show
      setOwnerDetails({
        contact_phone: apartment.contact_phone || '',
        name: apartment.contact_name,
        email: apartment.contact_email
      });

      setShowOwnerDetails(true);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setMobile('');
    setEmail('');
    setError(null);
    setShowOwnerDetails(false);
    setOwnerDetails(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FiHome className="text-indigo-600 w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-900">
              {showOwnerDetails ? 'Owner Details' : 'Get Owner Details'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showOwnerDetails ? (
            // Inquiry Form
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter your mobile number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-gray-500">(Optional)</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !mobile.trim()}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Getting Details...' : 'Get Owner Details'}
                </button>
              </div>
            </form>
          ) : (
            // Owner Details
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  ✅ Your inquiry has been saved. Here are the owner details:
                </p>
              </div>

              <div className="space-y-3">
                {ownerDetails?.name && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiUser className="text-indigo-600 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-600">Owner Name</p>
                      <p className="font-medium">{ownerDetails.name}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiPhone className="text-indigo-600 w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-600">Contact Number</p>
                    <a 
                      href="tel:9321314553"
                      className="font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      9321314553
                    </a>
                  </div>
                </div>

                {ownerDetails?.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiMail className="text-indigo-600 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-600">Email Address</p>
                      <a 
                        href={`mailto:${ownerDetails.email}`}
                        className="font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        {ownerDetails.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 