'use client';

import { supabase } from '@/lib/supabase-auth'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { FiStar, FiMapPin, FiPhone, FiMail, FiChevronLeft, FiChevronRight, FiX, FiHeart, FiShare2, FiMessageCircle } from 'react-icons/fi';
import { Talent, Review } from '@/types/talent';

export default function ParelTalentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [talent, setTalent] = useState<Talent | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  ;

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

  useEffect(() => {
    if (params.id) {
      fetchTalentDetails(params.id as string);
    }
  }, [params.id]);

  const fetchTalentDetails = async (id: string) => {
    try {
      setLoading(true);
      
      const { data: talentData, error: talentError } = await supabase
        .from('talents')
        .select('*')
        .eq('id', id)
        .eq('society', 'parel')
        .eq('is_active', true)
        .single();

      if (talentError || !talentData) {
        router.push('/parel/talent');
        return;
      }

      setTalent(talentData);

      const { data: reviewsData } = await supabase
        .from('talent_reviews')
        .select('*')
        .eq('talent_id', id)
        .order('created_at', { ascending: false });

      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 lg:pt-16">
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
      <div className="min-h-screen bg-gray-50 lg:pt-16">
        <Header />
        <div className="pt-20 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Talent not found</h1>
            <Link href="/mumbai/community/talent" className="text-purple-600 hover:text-purple-700">
              ← Back to Parel Talents
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:pt-16">
      <Header />
      
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          <Link href="/mumbai/community/talent" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
            <FiChevronLeft className="w-4 h-4" />
            Back to Parel Talents
          </Link>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            
            <div className="relative">
              <div className="w-full h-96 overflow-hidden bg-gray-100">
                <img
                  src={talent.main_image}
                  alt={talent.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="p-8">
              
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{talent.name}</h1>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      {categories[talent.category as keyof typeof categories]}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <FiMapPin className="w-4 h-4" />
                      <span>{talent.contact.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{talent.rating}</span>
                      <span className="text-gray-500">({talent.review_count} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 lg:mt-0">
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <FiHeart className="w-4 h-4" />
                    Save
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <FiShare2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-purple-600 font-bold">₹</span>
                  <div>
                    <p className="text-sm text-gray-600">Pricing</p>
                    <p className="font-semibold text-gray-900">{talent.pricing}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-purple-600 font-bold">👤</span>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-semibold text-gray-900">{talent.experience}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-purple-600 font-bold">⏰</span>
                  <div>
                    <p className="text-sm text-gray-600">Availability</p>
                    <p className="font-semibold text-gray-900">{talent.availability}</p>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {['about', 'portfolio', 'reviews', 'contact'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="min-h-[400px]">
                {activeTab === 'about' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">About {talent.name}</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">{talent.about}</p>
                    
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Skills & Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {talent.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <FiPhone className="w-5 h-5 text-purple-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-semibold text-gray-900">{talent.contact.phone}</p>
                        </div>
                        <button
                          onClick={() => window.open(`tel:${talent.contact.phone}`)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Call Now
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <FiMail className="w-5 h-5 text-purple-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-semibold text-gray-900">{talent.contact.email}</p>
                        </div>
                        <button
                          onClick={() => window.open(`mailto:${talent.contact.email}`)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Send Email
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <FiMapPin className="w-5 h-5 text-purple-600" />
                        <div>
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
        </div>
      </main>
    </div>
  );
} 