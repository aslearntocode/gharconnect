'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { FiSearch, FiStar, FiMapPin, FiPhone, FiMail, FiUser, FiAward, FiMusic, FiCamera, FiEdit3, FiCode, FiImage, FiBookOpen, FiHeart, FiTrendingUp } from 'react-icons/fi';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Talent, TalentCategory } from '@/types/talent';

export default function WorliTalentPage() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const supabase = createClientComponentClient();

  const categories: TalentCategory[] = [
    { id: 'all', name: 'All Talents', icon: FiStar },
    { id: 'music', name: 'Music & Arts', icon: FiMusic },
    { id: 'photography', name: 'Photography', icon: FiCamera },
    { id: 'writing', name: 'Writing & Content', icon: FiEdit3 },
    { id: 'tech', name: 'Technology', icon: FiCode },
    { id: 'design', name: 'Design & Creative', icon: FiImage },
    { id: 'education', name: 'Education & Tutoring', icon: FiBookOpen },
    { id: 'fitness', name: 'Health & Fitness', icon: FiHeart },
    { id: 'business', name: 'Business & Consulting', icon: FiTrendingUp },
  ];

  useEffect(() => {
    fetchTalents();
  }, []);

  const fetchTalents = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('talents')
        .select('*')
        .eq('society', 'worli')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching talents:', error);
        return;
      }

      setTalents(data || []);
    } catch (error) {
      console.error('Error fetching talents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTalents = talents.filter(talent => {
    const matchesSearch = talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talent.contact.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || talent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Banner */}
      <div className="relative">
        <div className="w-full h-40 bg-indigo-600 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">🏠 Home Talent in Worli</h1>
            <p className="text-indigo-100 text-lg">Discover amazing local talent in your community</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-7 w-full max-w-2xl z-10">
          <div className="bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 gap-2">
            <FiSearch className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for talent, skills, or location..."
              className="flex-1 outline-none bg-transparent text-gray-700 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Category Filters */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {loading ? 'Loading talents...' : `Found ${filteredTalents.length} talented people in Worli`}
            </p>
          </div>

          {/* Talent Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTalents.map((talent) => (
                <Link href={`/worli/talent/${talent.id}`} key={talent.id} className="block group">
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-purple-200">
                    {/* Image */}
                    <div className="w-full h-48 overflow-hidden bg-gray-100">
                      <img
                        src={talent.main_image}
                        alt={talent.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {talent.name}
                        </h3>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <FiStar className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{talent.rating}</span>
                          <span className="text-xs text-gray-500">({talent.review_count})</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {talent.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <FiMapPin className="w-4 h-4" />
                        <span>{talent.contact.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-600 font-medium">{talent.pricing}</span>
                        <span className="text-gray-500">{talent.experience} exp</span>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Available: {talent.availability}</span>
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                            {categories.find(c => c.id === talent.category)?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredTalents.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUser className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No talents found in Worli</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse all categories
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                View All Talents
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 