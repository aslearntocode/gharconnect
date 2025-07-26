"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseClient } from '@/lib/supabase';
import { Apartment } from '@/types/apartment';
import PropertyDetailGrid from '@/components/PropertyDetailGrid';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import PropertyInquiryModal from '@/components/PropertyInquiryModal';
import { FiMapPin, FiPhone, FiArrowLeft, FiHeart, FiShare2 } from 'react-icons/fi';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function BangalorePGPropertyPage() {
  const { propertyId } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true);
      setError(null);
      try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
          .from('apartments')
          .select('*')
          .eq('id', propertyId)
          .eq('city', 'Bangalore')
          .eq('accommodation_type', 'PG')
          .single();
        if (error) throw error;
        setProperty(data);
      } catch (err: any) {
        setError("Property not found or failed to load.");
      } finally {
        setLoading(false);
      }
    }
    if (propertyId) fetchProperty();
  }, [propertyId]);

  const getMediaSlides = (media: string[] = []) =>
    media.map(url =>
      url.match(/\.(mp4|mov|avi)$/i)
        ? { src: url, type: "video" }
        : { src: url }
    );

  // Helper to format description as bullet points
  const formatDescriptionAsBullets = (description: string): string[] => {
    if (!description) return [];
    return description
      .split(/[,;•\n]/)
      .map(feature => feature.trim())
      .filter(feature => feature.length > 0)
      .map(feature => feature.replace(/^[-•*]\s*/, ''));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Property not found'}</p>
            <Link href="/bangalore/rent/pg" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Back to Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const galleryImages = property.images && property.images.length > 0 ? property.images : ['/default-apartment.jpg'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* Navigation and Action Buttons */}
      <div className="bg-white shadow-sm border-b pt-8 md:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/bangalore/rent/pg"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back to Properties</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
              >
                <FiHeart className={`w-5 h-5 ${isFavorite ? 'text-pink-500 fill-pink-500' : ''}`} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Images */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="relative">
                <img
                  src={galleryImages[0]}
                  alt="Property"
                  className="w-full h-64 md:h-80 object-cover cursor-zoom-in"
                  onClick={() => { setLightboxOpen(true); setLightboxIndex(0); }}
                />
                {/* Image count overlay */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  {galleryImages.length} Photo{galleryImages.length > 1 ? 's' : ''}
                </div>
              </div>
              
              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {galleryImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Thumbnail ${i+1}`}
                      className={`w-20 h-16 object-cover rounded cursor-pointer border-2 ${
                        lightboxIndex === i ? 'border-indigo-500' : 'border-gray-200'
                      }`}
                      onClick={() => { setLightboxOpen(true); setLightboxIndex(i); }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Property Details Grid */}
            <PropertyDetailGrid apartment={property} />

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <div className="text-gray-700 space-y-2">
                  {formatDescriptionAsBullets(property.description).map((bullet, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Floating on desktop, normal on mobile */}
          <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-center mb-6">
                {property.status === 'inactive' ? (
                  <span className="inline-block w-32 h-9 bg-gray-200 rounded animate-pulse mb-2" />
                ) : (
                  <div className="text-3xl font-bold text-gray-900">
                    ₹{property.rent_amount.toLocaleString()}
                  </div>
                )}
                <div className="text-gray-500">per month</div>
              </div>
              
              {property.security_deposit && (
                property.status === 'inactive' ? (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <span className="inline-block w-28 h-6 bg-gray-200 rounded animate-pulse" />
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Security Deposit</div>
                    <div className="font-semibold text-gray-900">
                      ₹{property.security_deposit.toLocaleString()}
                    </div>
                  </div>
                )
              )}

              <div className="space-y-3">
                {property.status === 'inactive' ? (
                  <span className="w-full bg-gray-300 text-gray-600 py-3 px-4 rounded-lg font-semibold text-center cursor-not-allowed select-none block text-xs">
                    Already Rented
                  </span>
                ) : (
                  <button
                    onClick={() => setInquiryModalOpen(true)}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Get Owner Details
                  </button>
                )}
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FiMapPin className="text-gray-400 w-5 h-5" />
                  <div>
                    <div className="font-medium text-gray-900">{property.building_name}</div>
                    {property.tower && (
                      <div className="text-sm text-gray-600">Tower: {property.tower}</div>
                    )}
                    <div className="text-sm text-gray-500">{property.street_name}, {property.city}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Inquiry Modal */}
      <PropertyInquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        apartment={property}
      />

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={getMediaSlides(galleryImages) as any}
        index={lightboxIndex}
        plugins={[Thumbnails, Zoom]}
        render={{
          slide: ({ slide }) =>
            (slide as any).type === "video" ? (
              <video
                src={slide.src}
                controls
                style={{ width: "100%", height: "100%", background: "#000" }}
              />
            ) : undefined,
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
} 