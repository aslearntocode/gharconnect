"use client";

import { Talent } from '@/types/talent';
import { getProvidersBySociety, searchProviders } from '@/data/home-service-providers';
import { useState, useEffect } from 'react';
import { FiStar, FiMapPin } from 'react-icons/fi';
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

  // ...rest of the file...
  // In the card rating display:
  // Replace the static rating/review_count with:
  // <div className="flex items-center gap-1 text-yellow-500">
  //   {ratingsMap[talent.id]?.count > 0 ? (
  //     <>
  //       <FiStar className="w-4 h-4 fill-current" />
  //       <span className="text-sm font-medium">{ratingsMap[talent.id].avg}</span>
  //       <span className="text-xs text-gray-500">({ratingsMap[talent.id].count})</span>
  //     </>
  //   ) : (
  //     <span className="text-xs text-gray-500 italic">Not Rated Yet</span>
  //   )}
  // </div>
} 