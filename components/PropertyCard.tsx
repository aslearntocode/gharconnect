import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { FiHeart, FiMapPin, FiUser, FiUsers, FiPhone, FiChevronDown } from 'react-icons/fi';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { useRouter } from 'next/navigation';

interface PropertyCardProps {
  image: string;
  images?: string[];
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  genderTag?: string;
  code: string;
  address: string;
  location: string;
  occupancy: string[];
  highlights?: string[];
  rent: number;
  deposit?: string;
  lockin?: string;
  onBook?: () => void;
  onCall?: () => void;
  expandedContent?: React.ReactNode;
  tags?: string[];
  onClick?: () => void;
  isExpanded?: boolean;
  propertyId: string;
  status?: string;
  availableFrom?: string;
  petFriendly?: boolean;
  vegNonVegAllowed?: boolean;
  furnishingStatus?: string;
}

const occupancyIcons: Record<string, React.ReactNode> = {
  'Twin Sharing': <FiUsers className="inline mr-1" />,
  'Triple Sharing': <FiUsers className="inline mr-1" />,
  'Single': <FiUser className="inline mr-1" />,
  'Double': <FiUsers className="inline mr-1" />,
  'Triple': <FiUsers className="inline mr-1" />,
  'Dormitory': <FiUsers className="inline mr-1" />,
};

export default function PropertyCard({
  image,
  images = [],
  isFavorite,
  onFavoriteToggle,
  genderTag,
  code,
  address,
  location,
  occupancy,
  highlights = [],
  rent,
  deposit,
  lockin,
  onBook,
  onCall,
  expandedContent,
  tags = [],
  onClick,
  isExpanded = false,
  propertyId,
  status,
  availableFrom,
  petFriendly,
  vegNonVegAllowed,
  furnishingStatus,
}: PropertyCardProps) {
  const [expanded, setExpanded] = useState(isExpanded);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const router = useRouter();

  // Helper to include both images and videos for the lightbox
  const getMediaSlides = (media: string[] = []) =>
    media.map(url =>
      url.match(/\.(mp4|mov|avi)$/i)
        ? { src: url, type: "video" }
        : { src: url }
    );

  // Helper to format availability date
  const getAvailabilityText = (availableFrom?: string) => {
    if (!availableFrom) return 'Immediate Possession';
    
    const availableDate = new Date(availableFrom);
    const today = new Date();
    
    // If the date has already passed, show immediate possession
    if (availableDate <= today) {
      return 'Immediate Possession';
    }
    
    // Otherwise show the formatted date
    return availableDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const galleryImages = images.length > 0 ? images : [image];

  return (
    <Card
      className="flex flex-col md:flex-row items-stretch w-full shadow-lg rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-shadow duration-200 cursor-pointer relative group min-h-[220px]"
      onClick={() => router.push(`/property/${propertyId}`)}
    >
      {/* Image + Favorite */}
      <div className="relative w-full md:w-56 h-40 md:h-auto flex-shrink-0">
        <img
          src={galleryImages[0]}
          alt="Property"
          className="object-cover w-full h-full md:rounded-l-2xl md:rounded-r-none rounded-t-2xl md:rounded-t-none cursor-zoom-in"
          onClick={e => { e.stopPropagation(); setLightboxOpen(true); setLightboxIndex(0); }}
        />
        {/* Overlay for photo count */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded shadow">
          {images && images.length > 0
            ? `${images.length} Photo${images.length > 1 ? 's' : ''}`
            : '1 Photo'}
        </div>
        {/* Thumbnails */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {galleryImages.slice(0, 4).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Thumb ${i+1}`}
                className={`w-7 h-7 object-cover rounded border-2 ${lightboxIndex === i ? 'border-indigo-500' : 'border-white'} cursor-pointer`}
                onClick={e => { e.stopPropagation(); setLightboxOpen(true); setLightboxIndex(i); }}
              />
            ))}
            {galleryImages.length > 4 && (
              <span className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded text-xs font-semibold">+{galleryImages.length - 4}</span>
            )}
          </div>
        )}
        <button
          className="absolute top-2 left-2 bg-white/80 rounded-full p-1.5 shadow hover:bg-white z-10"
          onClick={e => { e.stopPropagation(); onFavoriteToggle && onFavoriteToggle(); }}
        >
          <FiHeart className={`w-5 h-5 ${isFavorite ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}`} />
        </button>
        {genderTag && (
          <span className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">{genderTag}</span>
        )}
        {/* Lightbox for zoom/preview */}
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
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between p-3 md:p-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block w-1 h-4 bg-indigo-500 rounded-full"></span>
            <span className="font-bold text-base md:text-lg text-gray-900">{code}</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <FiMapPin className="text-blue-500 w-4 h-4" />
            <span className="text-blue-600 font-medium text-xs md:text-sm hover:underline">{address}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-1 mb-1">
            {occupancy.map(type => (
              <span key={type} className="inline-flex items-center bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {occupancyIcons[type] || <FiUsers className="inline mr-1" />} {type}
              </span>
            ))}
          </div>
          {/* Highlights/description removed from collapsed card */}
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-1 gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-xl md:text-2xl font-bold text-gray-900">₹ {rent.toLocaleString()}
              <span className="text-xs font-normal text-gray-500 ml-1">/mo</span>
            </span>
            <div className="flex gap-3 mt-0.5 text-xs text-gray-700">
              {deposit && (
                <span className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center mr-1">🎲</span>{deposit} Deposit only</span>
              )}
              {lockin && (
                <span className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center mr-1">📝</span>{lockin} Lock-in</span>
              )}
            </div>
          </div>
          {/* Availability Button */}
          <div className="flex items-center gap-2 mt-1 md:mt-0">
            {status === 'inactive' ? (
              <span className="w-full sm:w-auto flex-grow text-center px-4 py-2 bg-gray-300 text-gray-600 font-medium text-xs leading-normal uppercase rounded shadow-md cursor-not-allowed select-none">
                Already Rented
              </span>
            ) : (
              <span className="w-full sm:w-auto flex-grow text-center px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md select-none">
                Available
              </span>
            )}
          </div>
        </div>
        {/* Expand/Collapse */}
        {expanded && expandedContent && (
          <div className="mt-3 border-t pt-3 text-xs text-gray-700">
            {expandedContent}
          </div>
        )}
        
        {/* Additional Property Details */}
        {(availableFrom || petFriendly !== undefined || vegNonVegAllowed !== undefined || furnishingStatus) && (
          <div className="mt-3 border-t pt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {availableFrom && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📅 Available:</span>
                  <span className="font-medium text-green-600">{getAvailabilityText(availableFrom)}</span>
                </div>
              )}
              
              {petFriendly !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">🐕 Pets:</span>
                  <span className={`font-medium ${petFriendly ? 'text-green-600' : 'text-red-600'}`}>
                    {petFriendly ? 'Allowed' : 'Not Allowed'}
                  </span>
                </div>
              )}
              
              {vegNonVegAllowed !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">🍽️ Food:</span>
                  <span className={`font-medium ${vegNonVegAllowed ? 'text-green-600' : 'text-orange-600'}`}>
                    {vegNonVegAllowed ? 'Non-Veg Allowed' : 'Veg Only'}
                  </span>
                </div>
              )}
              
              {furnishingStatus && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">🪑 Furnishing:</span>
                  <span className="font-medium text-blue-600">
                    {furnishingStatus}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 