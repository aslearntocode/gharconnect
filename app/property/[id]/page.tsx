"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseClient } from '@/lib/supabase';
import { Apartment } from '@/types/apartment';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import PropertyInquiryModal from '@/components/PropertyInquiryModal';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true);
      setError(null);
      try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
          .from('apartments')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        setProperty(data);
      } catch (err: any) {
        setError("Property not found or failed to load.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProperty();
  }, [id]);

  const getMediaSlides = (media: string[] = []) =>
    media.map(url =>
      url.match(/\.(mp4|mov|avi)$/i)
        ? { src: url, type: "video" }
        : { src: url }
    );

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error || !property) return <div className="min-h-screen flex items-center justify-center text-red-600">{error || "Property not found."}</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg mt-8 p-4 md:p-8">
        <button
          className="mb-4 text-indigo-600 hover:underline text-sm font-medium"
          onClick={() => router.back()}
        >
          ← Back
        </button>
        {/* Gallery on top, text below */}
        <div className="w-full mb-6">
          {property.images && property.images.length > 0 ? (
            <>
              <img
                src={property.images[lightboxIndex]}
                alt="Property"
                className="w-full h-64 object-cover rounded-lg cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
              />
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                {property.images.slice(0, 6).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Thumb ${i+1}`}
                    className={`w-20 h-20 object-cover rounded border-2 ${lightboxIndex === i ? 'border-indigo-500' : 'border-white'} cursor-pointer flex-shrink-0`}
                    onClick={() => setLightboxIndex(i)}
                  />
                ))}
                {property.images.length > 6 && (
                  <span className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded text-xs font-semibold">+{property.images.length - 6} more</span>
                )}
              </div>
              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={getMediaSlides(property.images) as any}
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
            </>
          ) : (
            <img src="/default-apartment.jpg" alt="Property" className="w-full h-64 object-cover rounded-lg" />
          )}
        </div>
        {/* Details below gallery */}
        <div className="w-full flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{property.building_name || 'Property'}</h1>
          <div className="text-blue-700 font-medium mb-1">{property.location}</div>
          <div className="text-gray-700 mb-1">{property.street_name}, {property.city}, {property.state} - {property.pincode}</div>
          <div className="flex flex-wrap gap-2 mb-1">
            <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">{property.apartment_type}</span>
            <span className="bg-cyan-100 text-cyan-700 text-xs font-semibold px-3 py-1 rounded-full">{property.carpet_area} sq.ft</span>
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">{property.furnishing_status}</span>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-1">₹ {property.rent_amount?.toLocaleString()} <span className="text-base font-normal text-gray-500">/mo</span></div>
          <div className="text-gray-700 mb-1">Deposit: <span className="font-semibold">₹{property.security_deposit?.toLocaleString()}</span></div>
          <div className="text-gray-700 mb-1">Available From: <span className="font-semibold">{property.available_from ? new Date(property.available_from).toLocaleDateString() : '-'}</span></div>
          <div className="text-gray-700 mb-1">Status: <span className="font-semibold capitalize">{property.status}</span></div>
          {property.description && (
            <div className="mt-2">
              <div className="font-semibold mb-1">Description:</div>
              <div className="text-gray-700 whitespace-pre-line text-sm">{property.description}</div>
            </div>
          )}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mt-2">
              <div className="font-semibold mb-1">Amenities:</div>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {property.amenities.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}
          <div className="mt-6 flex flex-col gap-2">
            {property.status === 'inactive' ? (
              <span
                className="w-full bg-gray-300 text-gray-600 px-3 py-2 rounded-lg font-semibold text-sm text-center cursor-not-allowed select-none"
              >
                Already Rented
              </span>
            ) : (
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-semibold text-sm text-center cursor-pointer"
                onClick={() => setInquiryModalOpen(true)}
              >
                Get Owner's Contact
              </button>
            )}
          </div>
        </div>
        <PropertyInquiryModal
          isOpen={inquiryModalOpen}
          onClose={() => setInquiryModalOpen(false)}
          apartment={property}
        />
      </div>
    </div>
  );
} 