'use client';
import React, { useState, useEffect } from 'react';
import { getProviderById } from '@/data/home-service-providers';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { FiStar, FiMapPin, FiPhone, FiMail, FiChevronLeft, FiHeart, FiShare2, FiZoomIn, FiX, FiChevronRight, FiChevronLeft as FiChevronLeftIcon } from 'react-icons/fi';

const HomeServiceProviderPage = ({ params }: { params: any }) => {
  const router = useRouter();
  const { id, society } = React.use(params) as { id: string; society: string };
  const [talent, setTalent] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  const categories = {
    music: 'Music & Arts',
    photography: 'Photography',
    writing: 'Writing & Content',
    tech: 'Technology',
    design: 'Design & Creative',
    education: 'Education & Tutoring',
    fitness: 'Health & Fitness',
    business: 'Business & Consulting',
  };

  const societyNames = {
    parel: 'Parel',
    worli: 'Worli',
    bandra: 'Bandra',
    powai: 'Powai',
    andheri: 'Andheri',
    malad: 'Malad',
    thane: 'Thane',
    juhu: 'Juhu',
  };

  useEffect(() => {
    setLoading(true);
    const talentData = getProviderById(id);
    if (!talentData) {
      router.push(`/${society}/home-service-provider`);
      return;
    }
    if (talentData.society !== society) {
      router.push(`/${talentData.society}/home-service-provider/${id}`);
      return;
    }
    setTalent(talentData);
    setReviews([
      {
        id: '1',
        talent_id: id,
        user_name: 'Rahul Kumar',
        rating: 5,
        comment: 'Excellent service! Very professional and skilled.',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
      },
      {
        id: '2',
        talent_id: id,
        user_name: 'Priya Singh',
        rating: 4,
        comment: 'Great experience, highly recommended!',
        created_at: '2024-01-18T14:30:00Z',
        updated_at: '2024-01-18T14:30:00Z',
      },
    ]);
    setLoading(false);
  }, [id, society, router]);

  const getBackLink = () => {
    if (!society) return '/';
    return `/${society}/home-service-provider`;
  };

  const getSocietyName = () => {
    if (!society) return '';
    return societyNames[society as keyof typeof societyNames] || society;
  };

  // Sample portfolio images - replace with actual data from talent.portfolio_images
  const portfolioImages = [
    '/portfolio/sample1.jpg',
    '/portfolio/sample2.jpg', 
    '/portfolio/sample3.jpg',
    '/portfolio/sample4.jpg',
    '/portfolio/sample5.jpg',
    '/portfolio/sample6.jpg'
  ];

  // Photo gallery functions
  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    setZoomLevel(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setZoomLevel(1);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % portfolioImages.length);
    setZoomLevel(1);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + portfolioImages.length) % portfolioImages.length);
    setZoomLevel(1);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in' && zoomLevel < 3) {
      setZoomLevel(prev => prev + 0.5);
    } else if (direction === 'out' && zoomLevel > 0.5) {
      setZoomLevel(prev => prev - 0.5);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isModalOpen) return;
    
    switch (e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case '+':
      case '=':
        handleZoom('in');
        break;
      case '-':
        handleZoom('out');
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 pb-12 px-4">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="w-full h-96 bg-gray-200 rounded-xl mb-8"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Provider not found</h1>
            <Link href={getBackLink()} className="text-indigo-600 hover:text-indigo-700">
              ← Back to {getSocietyName()} Home Service Providers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href={getBackLink()} className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6">
            <FiChevronLeft className="w-4 h-4" />
            Back to {getSocietyName()} Home Service Providers
          </Link>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden px-6 md:px-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 border-b border-gray-100">
              <div className="flex-shrink-0 flex items-center justify-center w-full md:w-auto mb-4 md:mb-0">
                <img
                  src={talent.main_image}
                  alt={talent.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-md"
                />
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 mr-2">{talent.name}</h1>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <FiStar className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-semibold text-lg text-gray-900">{talent.rating}</span>
                      <span className="text-gray-500 text-base">({talent.review_count} reviews)</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                      {categories[talent.category as keyof typeof categories]}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600">
                      <FiMapPin className="w-4 h-4" />
                      <span>{talent.contact.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-gray-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-100">
                      {talent.pricing}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-100">
                      {talent.experience} exp
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-100">
                      {talent.availability}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8 py-4 mb-2">
                {['about', 'portfolio', 'reviews', 'contact'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                      activeTab === tab
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            <div className="min-h-[400px] px-0 py-6">
              {activeTab === 'about' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 pt-2 pb-2 mt-4">About {talent.name}</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">{talent.about}</p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {talent.skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'portfolio' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 pt-2 pb-2 mt-4">Portfolio</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {portfolioImages.map((image, index) => (
                      <div 
                        key={index}
                        className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                        onClick={() => openModal(index)}
                      >
                        <img
                          src={image}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                          <FiZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 pt-2 pb-2 mt-4">Reviews</h3>
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.user_name}</span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No reviews yet.</p>
                  )}
                </div>
              )}
              {activeTab === 'contact' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 pt-2 pb-2 mt-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <FiPhone className="w-5 h-5 text-indigo-600" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold text-gray-900">{talent.contact.phone}</p>
                      </div>
                      <button
                        onClick={() => window.open(`tel:${talent.contact.phone}`)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Call Now
                      </button>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <FiMail className="w-5 h-5 text-indigo-600" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900">{talent.contact.email}</p>
                      </div>
                      <button
                        onClick={() => window.open(`mailto:${talent.contact.email}`)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Send Email
                      </button>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <FiMapPin className="w-5 h-5 text-indigo-600" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-semibold text-gray-900">{talent.contact.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Photo Gallery Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
            >
              <FiChevronLeftIcon className="w-6 h-6" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button
                onClick={() => handleZoom('out')}
                className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg hover:bg-opacity-70 transition-all duration-200"
              >
                -
              </button>
              <span className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => handleZoom('in')}
                className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg hover:bg-opacity-70 transition-all duration-200"
              >
                +
              </button>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
              {currentImageIndex + 1} / {portfolioImages.length}
            </div>

            {/* Main Image */}
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <img
                src={portfolioImages[currentImageIndex]}
                alt={`Portfolio ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeServiceProviderPage; 