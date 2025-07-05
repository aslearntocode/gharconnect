"use client";

import { Talent } from '@/types/talent';
import { getProvidersBySociety, searchProviders } from '@/data/home-service-providers';
import { useState, useEffect } from 'react';
import { FiStar, FiMapPin, FiSearch, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import Header from '@/components/Header';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function JuhuNeighborhoodServiceProviderPage() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTalents, setFilteredTalents] = useState<Talent[]>([]);
  const [ratingsMap, setRatingsMap] = useState<Record<string, { avg: string, count: number }>>({});
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchTalents();
  }, []);

  useEffect(() => {
    filterTalents();
  }, [talents, searchTerm]);

  useEffect(() => {
    if (talents.length > 0) {
      fetchRatings();
    }
  }, [talents]);

  const fetchTalents = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const juhuTalents = getProvidersBySociety('juhu');
      setTalents(juhuTalents);
    } catch (error) {
      console.error('Error fetching talents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    const ids = talents.map(t => t.id);
    const { data, error } = await supabase
      .from('reviews')
      .select('card_id, rating')
      .in('card_id', ids);
    if (error) {
      console.error('Error fetching ratings:', error);
      return;
    }
    // Calculate avg/count per provider
    const map: Record<string, { avg: string, count: number }> = {};
    ids.forEach(id => {
      const reviews = (data || []).filter(r => r.card_id === id);
      const count = reviews.length;
      const avg = count > 0 ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / count).toFixed(1) : '';
      map[id] = { avg, count };
    });
    setRatingsMap(map);
  };

  const filterTalents = () => {
    let filtered = talents;
    if (searchTerm) {
      filtered = searchProviders(searchTerm, 'juhu');
    }
    setFilteredTalents(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Banner */}
      <div className="relative">
        <div className="w-full h-40 bg-indigo-600 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">🏠 Neighbors Providing Services</h1>
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
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {loading ? 'Loading talents...' : `Found ${filteredTalents.length} talented people in Juhu`}
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
                <Link href={`/juhu/home-service-provider/${talent.id}`} key={talent.id} className="block group">
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-indigo-200">
                    {/* Image */}
                    <div className="w-full h-48 overflow-hidden bg-white flex items-center justify-center">
                      <img
                        src={talent.main_image}
                        alt={talent.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {talent.name}
                        </h3>
                        <div className="flex items-center gap-1 text-yellow-500">
                          {ratingsMap[talent.id]?.count > 0 ? (
                            <>
                              <FiStar className="w-4 h-4 fill-current" />
                              <span className="text-sm font-medium">{ratingsMap[talent.id].avg}</span>
                              <span className="text-xs text-gray-500">({ratingsMap[talent.id].count})</span>
                            </>
                          ) : (
                            <span className="text-xs text-gray-500 italic">Not Rated Yet</span>
                          )}
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
                        <span className="text-indigo-600 font-medium">{talent.pricing}</span>
                        <span className="text-gray-500">{talent.experience} exp</span>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Available: {talent.availability}</span>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No talents found in Juhu</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse all categories
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                }}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
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