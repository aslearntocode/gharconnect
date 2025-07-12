"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle, Calendar, MapPin, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Header from "@/components/Header";

interface MarketplaceProduct {
  id: string;
  user_id: string;
  area: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  contact_phone: string;
  created_at: string;
  building_name?: string;
  event_date?: string;
  price_history?: {
    old_price: number;
    new_price: number;
    changed_at: string;
  }[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getPriceDropInfo(product: MarketplaceProduct) {
  if (!product.price_history || product.price_history.length === 0) {
    return null;
  }
  const latestPriceChange = product.price_history[0];
  if (
    latestPriceChange.old_price &&
    latestPriceChange.new_price < latestPriceChange.old_price
  ) {
    const priceDrop = latestPriceChange.old_price - latestPriceChange.new_price;
    const priceDropPercentage = Math.round(
      (priceDrop / latestPriceChange.old_price) * 100
    );
    return {
      oldPrice: latestPriceChange.old_price,
      newPrice: latestPriceChange.new_price,
      priceDrop,
      priceDropPercentage,
      changedAt: latestPriceChange.changed_at,
    };
  }
  return null;
}

function ImageModal({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
}: {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images.length, onClose]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center p-4">
      <div className="relative w-full h-full flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
        >
          <X className="w-6 h-6" />
        </button>
        {images.length > 1 && (
          <>
            <button
              onClick={() => {
                setCurrentIndex((prev) =>
                  prev > 0 ? prev - 1 : images.length - 1
                );
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-3"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                setCurrentIndex((prev) =>
                  prev < images.length - 1 ? prev + 1 : 0
                );
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-3"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
        <div
          className={`relative flex items-center justify-center w-full h-full ${
            images.length > 1 ? "overflow-x-auto snap-x snap-mandatory" : ""
          }`}
          style={{ maxWidth: "90vw", maxHeight: "80vh" }}
        >
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Product image ${idx + 1}`}
              className={`object-contain mx-auto ${
                images.length > 1 ? "snap-center" : ""
              } ${idx === currentIndex ? "block" : "hidden"}`}
              style={{ maxWidth: "90vw", maxHeight: "80vh" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-image.svg";
              }}
            />
          ))}
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 p-2 rounded-lg">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-white"
                    : "border-gray-600 hover:border-gray-400"
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-image.svg";
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MarketplaceItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageModal, setImageModal] = useState<{ isOpen: boolean; images: string[]; initialIndex: number }>({ isOpen: false, images: [], initialIndex: 0 });
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from("marketplace_products")
        .select(
          `*, price_history:marketplace_price_history(old_price, new_price, changed_at)`
        )
        .eq("id", id)
        .maybeSingle();
      if (error) {
        setProduct(null);
      } else {
        setProduct(data || null);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Item not found.</p>
        </div>
      </div>
    );
  }

  const priceDropInfo = getPriceDropInfo(product);
  const isItemFree = product.price === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Marketplace
        </Button>
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Images */}
            <div className="md:w-1/2 w-full flex flex-col items-center">
              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer group">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="object-contain w-full h-full max-h-64 transition-transform duration-300 group-hover:scale-105"
                      onClick={() => setImageModal({ isOpen: true, images: product.images, initialIndex: 0 })}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-image.svg";
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    {product.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                        +{product.images.length - 1}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ZoomIn className="w-10 h-10" />
                  </div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 mt-4 mb-6 w-full justify-center overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ maxWidth: '16rem' }}>
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border cursor-pointer flex-shrink-0"
                      onClick={() => setImageModal({ isOpen: true, images: product.images, initialIndex: idx })}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-image.svg";
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Details */}
            <div className="md:w-1/2 w-full flex flex-col">
              <CardTitle className="text-2xl font-bold mb-2">{product.title}</CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium rounded-full px-2 py-0.5 whitespace-nowrap flex-shrink-0 ${
                  product.condition === "New"
                    ? "bg-green-100 text-green-800"
                    : product.condition === "Like New"
                    ? "bg-blue-100 text-blue-800"
                    : product.condition === "Good"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {product.condition}
                </span>
                <span className="text-xs text-gray-500">{product.category}</span>
              </div>
              <CardDescription className="text-base text-gray-700 mb-4">
                {product.description}
              </CardDescription>
              {product.category === "Event or Movie Tickets" && product.event_date && (
                <div className="flex items-center gap-2 text-xs text-blue-700 mb-2">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span>Event Date: {formatDate(product.event_date)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">
                  {product.building_name
                    ? `${product.building_name}, ${product.area.charAt(0).toUpperCase() + product.area.slice(1)}, Mumbai`
                    : `${product.area.charAt(0).toUpperCase() + product.area.slice(1)}, Mumbai`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span>{formatDate(product.created_at)}</span>
              </div>
              <div className="flex flex-col mb-4">
                <div className="text-2xl font-bold text-green-600">
                  {isItemFree ? "Free" : formatPrice(product.price)}
                </div>
                {priceDropInfo && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(priceDropInfo.oldPrice)}
                    </span>
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                      -{priceDropInfo.priceDropPercentage}%
                    </span>
                  </div>
                )}
              </div>
              <Button
                onClick={() => {
                  const message = `Hi! I'm interested in your item "${product.title}" from the Mahalaxmi marketplace. Can you tell me more about it?`;
                  const encodedMessage = encodeURIComponent(message);
                  const whatsappUrl = `https://wa.me/${product.contact_phone}?text=${encodedMessage}`;
                  window.open(whatsappUrl, "_blank");
                }}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white text-base px-6 py-3 rounded-full font-semibold mt-auto"
              >
                <MessageCircle className="w-4 h-4 mr-2" /> Chat with Seller
              </Button>
            </div>
          </div>
        </Card>
      </div>
      {/* Image Modal */}
      {imageModal.isOpen && (
        <ImageModal
          images={imageModal.images}
          isOpen={imageModal.isOpen}
          onClose={() => setImageModal({ isOpen: false, images: [], initialIndex: 0 })}
          initialIndex={imageModal.initialIndex}
        />
      )}
    </div>
  );
} 