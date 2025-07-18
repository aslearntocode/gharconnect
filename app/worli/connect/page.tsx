"use client";
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { auth } from '@/lib/firebase';
import { generateAnonymousId } from '@/lib/anonymousId';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import { FiHeart } from 'react-icons/fi';
import Head from 'next/head';
import LoginModal from '@/components/LoginModal'
import { usePathname } from 'next/navigation'

interface Post {
  id: string;
  title: string;
  body: string;
  user_id: string;
  created_at: string;
  comment_count?: number;
  likes?: number;
  category?: string;
}

interface Comment {
  id: string;
  post_id: string;
  body: string;
  user_id: string;
  created_at: string;
  parent_comment_id?: string;
}

export default function WorliConnectPage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: '', body: '', category: 'gc/worli' });
  const [submitting, setSubmitting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const pathname = usePathname();
  const [likesLoading, setLikesLoading] = useState<string | null>(null);
  const [userLikedPosts, setUserLikedPosts] = useState<{ [postId: string]: boolean }>({});
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  // Available communities for Worli
  const worliCommunities = [
    { value: 'gc/worli', label: 'gc/worli (General)' },
    { value: 'gc/worli/education', label: 'gc/worli/education' },
    { value: 'gc/worli/food', label: 'gc/worli/food' },
    { value: 'gc/worli/travel', label: 'gc/worli/travel' },
    { value: 'gc/worli/safety', label: 'gc/worli/safety' },
    { value: 'gc/worli/events', label: 'gc/worli/events' },
    { value: 'gc/worli/services', label: 'gc/worli/services' },
    { value: 'gc/worli/health', label: 'gc/worli/health' },
    { value: 'gc/worli/governance', label: 'gc/worli/governance' },
    { value: 'gc/worli/crime', label: 'gc/worli/crime' },
    { value: 'gc/worli/environment', label: 'gc/worli/environment' },
    { value: 'gc/worli/entertainment', label: 'gc/worli/entertainment' },
    { value: 'gc/worli/religion', label: 'gc/worli/religion' },
    { value: 'gc/worli/cleanliness', label: 'gc/worli/cleanliness' },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        // Fetch liked posts for this user from Supabase
        const supabase = await getSupabaseClient();
        // Convert Firebase UID to UUID format
        const firebaseUid = user.uid;
        const uuidFromFirebase = firebaseUid.replace(/-/g, '').padEnd(32, '0').substring(0, 32);
        const formattedUuid = `${uuidFromFirebase.substring(0, 8)}-${uuidFromFirebase.substring(8, 12)}-${uuidFromFirebase.substring(12, 16)}-${uuidFromFirebase.substring(16, 20)}-${uuidFromFirebase.substring(20, 32)}`;
        const { data, error } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', formattedUuid);
        if (!error && data) {
          const liked: Record<string, boolean> = {};
          data.forEach((row: { post_id: string }) => { liked[row.post_id] = true; });
          setUserLikedPosts(liked);
        }
      }
    });
    fetchPosts();
    return () => unsubscribe();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        comment_count:comments(count)
      `)
      .eq('area', 'Worli')
      .order('created_at', { ascending: false });
    if (!error) {
      // Transform the data to flatten the comment_count
      const transformedData = (data || []).map(post => ({
        ...post,
        comment_count: post.comment_count?.[0]?.count || 0
      }));
      setPosts(transformedData);
    }
    setLoading(false);
  };

  const handleNewPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.log('No user found');
      return;
    }
    console.log('Submitting post:', newPost);
    console.log('User UID:', user.uid);
    setSubmitting(true);
    const supabase = await getSupabaseClient();
    
    // Test if we can access the posts table
    console.log('Testing posts table access...');
    const { data: testData, error: testError } = await supabase
      .from('posts')
      .select('id')
      .limit(1);
    console.log('Test query result:', { testData, testError });
    
    // Convert Firebase UID to UUID format
    // Firebase UIDs are 28 characters, we need to make it 32 characters for UUID
    const firebaseUid = user.uid;
    const uuidFromFirebase = firebaseUid.replace(/-/g, '').padEnd(32, '0').substring(0, 32);
    const formattedUuid = `${uuidFromFirebase.substring(0, 8)}-${uuidFromFirebase.substring(8, 12)}-${uuidFromFirebase.substring(12, 16)}-${uuidFromFirebase.substring(16, 20)}-${uuidFromFirebase.substring(20, 32)}`;
    
    const postData = {
      title: newPost.title,
      body: newPost.body,
      user_id: formattedUuid,
      area: "Worli",
      category: newPost.category,
    };
    console.log('Inserting post data:', postData);
    console.log('Formatted UUID:', formattedUuid);
    console.log('UUID length:', formattedUuid.length);
    
    const { data, error } = await supabase.from('posts').insert([postData]);
    console.log('Post insert result:', { data, error });
    if (error) {
      console.error('Error creating post - details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: JSON.stringify(error, null, 2)
      });
    }
    setSubmitting(false);
    if (!error) {
      setNewPost({ title: '', body: '', category: 'gc/worli' });
      fetchPosts();
    } else {
      console.error('Error creating post:', error);
    }
  };

  const handleSelectPost = async (post: Post) => {
    setSelectedPost(post);
    setCommentLoading(true);
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });
    if (!error) setComments(data || []);
    setCommentLoading(false);
  };

  // Group comments by parent_comment_id
  function groupComments(comments: Comment[]) {
    const map: { [key: string]: Comment[] } = {};
    comments.forEach((c) => {
      const parent = c.parent_comment_id || 'root';
      if (!map[parent]) map[parent] = [];
      map[parent].push(c);
    });
    return map;
  }
  const grouped = groupComments(comments);

  const handleNewComment = async (e: React.FormEvent, parentId?: string | null) => {
    e.preventDefault();
    if (!user || !selectedPost) return;
    setCommentLoading(true);
    const supabase = await getSupabaseClient();
    const firebaseUid = user.uid;
    const uuidFromFirebase = firebaseUid.replace(/-/g, '').padEnd(32, '0').substring(0, 32);
    const formattedUuid = `${uuidFromFirebase.substring(0, 8)}-${uuidFromFirebase.substring(8, 12)}-${uuidFromFirebase.substring(12, 16)}-${uuidFromFirebase.substring(16, 20)}-${uuidFromFirebase.substring(20, 32)}`;
    const commentData = {
      post_id: selectedPost.id,
      body: newComment,
      user_id: formattedUuid,
      parent_comment_id: parentId || null,
      area: "Worli",
    };
    const { error } = await supabase.from('comments').insert([commentData]);
    setCommentLoading(false);
    if (!error) {
      setNewComment('');
      setReplyTo(null);
      handleSelectPost(selectedPost);
    } else {
      console.error('Error creating comment:', error);
    }
  };

  // Add handler to like a post (per-user)
  async function handleLikePost(postId: string) {
    console.log('handleLikePost called with postId:', postId);
    console.log('user:', user);
    
    if (!user) {
      console.log('No user found, opening login modal');
      setIsLoginModalOpen(true);
      return;
    }
    
    if (userLikedPosts[postId]) {
      console.log('User already liked this post');
      return;
    }
    
    setLikesLoading(postId);
    const supabase = await getSupabaseClient();
    
    // Test if post_likes table exists and show its structure
    console.log('Testing post_likes table...');
    const { data: tableTest, error: tableError } = await supabase
      .from('post_likes')
      .select('*')
      .limit(1);
    console.log('post_likes table test:', { tableTest, tableError });
    
    // Convert Firebase UID to UUID format
    const firebaseUid = user.uid;
    console.log('Firebase UID:', firebaseUid);
    const uuidFromFirebase = firebaseUid.replace(/-/g, '').padEnd(32, '0').substring(0, 32);
    const formattedUuid = `${uuidFromFirebase.substring(0, 8)}-${uuidFromFirebase.substring(8, 12)}-${uuidFromFirebase.substring(12, 16)}-${uuidFromFirebase.substring(16, 20)}-${uuidFromFirebase.substring(20, 32)}`;
    console.log('Formatted UUID:', formattedUuid);
    
    try {
      // Check if already liked in DB
      const { data: likeRows, error: likeError } = await supabase
        .from('post_likes')
        .select('id')
        .eq('user_id', formattedUuid)
        .eq('post_id', postId);
      
      console.log('Check like result:', { likeRows, likeError });
      
      if (likeRows && likeRows.length > 0) {
        console.log('User already liked this post in DB');
        setUserLikedPosts(prev => ({ ...prev, [postId]: true }));
        setLikesLoading(null);
        return;
      }
      
      // Insert like
      const { error: insertError } = await supabase
        .from('post_likes')
        .insert([{ user_id: formattedUuid, post_id: postId }]);
      
      console.log('Insert like result:', { insertError });
      console.log('Full insert error details:', JSON.stringify(insertError, null, 2));
      
      if (!insertError) {
        // Increment post likes
        const currentPost = posts.find(p => p.id === postId);
        const currentLikes = currentPost?.likes || 0;
        console.log('Current likes:', currentLikes);
        
        const { error: updateError } = await supabase
          .from('posts')
          .update({ likes: currentLikes + 1 })
          .eq('id', postId);
        
        console.log('Update post result:', { updateError });
        
        if (!updateError) {
          setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p));
          setUserLikedPosts(prev => ({ ...prev, [postId]: true }));
          console.log('Successfully liked post');
        } else {
          console.error('Error updating post likes:', updateError);
        }
      } else {
        console.error('Error inserting like:', insertError);
      }
    } catch (error) {
      console.error('Error in handleLikePost:', error);
    }
    
    setLikesLoading(null);
  }

  // Filter posts by search and active filter
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
                         post.body.toLowerCase().includes(search.toLowerCase());
    
    if (activeFilter === 'All') {
      return matchesSearch;
    }
    
    // Map filter names to category values
    const filterToCategory: { [key: string]: string } = {
      'Cleanliness': 'gc/worli/cleanliness',
      'Food': 'gc/worli/food',
      'Travel': 'gc/worli/travel',
      'Safety': 'gc/worli/safety',
      'Events': 'gc/worli/events',
      'Services': 'gc/worli/services',
      'Health': 'gc/worli/health',
      'Governance': 'gc/worli/governance',
      'Crime': 'gc/worli/crime',
      'Education': 'gc/worli/education',
      'Environment': 'gc/worli/environment',
      'Entertainment': 'gc/worli/entertainment',
      'Religion': 'gc/worli/religion',
    };
    
    const targetCategory = filterToCategory[activeFilter];
    const matchesFilter = targetCategory ? post.category === targetCategory : false;
    
    return matchesSearch && matchesFilter;
  });

  // Compute top liked and top commented posts
  const topLikedPosts = [...filteredPosts]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 2);
  const topCommentedPosts = [...filteredPosts]
    .sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0))
    .slice(0, 2);

  // Helper to get time ago
  function timeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff} sec. ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min. ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr. ago`;
    return date.toLocaleDateString();
  }

  // Structured data for FAQ
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How can I connect with neighbors in Worli?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Join our community discussion forum to share thoughts, ask questions, and get to know your neighbors in Worli. You can post about local events, recommendations, or any community-related topics."
        }
      },
      {
        "@type": "Question",
        "name": "What topics can I discuss in the Worli community forum?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can discuss local events, recommendations, community issues, neighborhood updates, local services, and any topics relevant to the Worli community."
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <title>Community Discussions & Connect with Neighbors in Worli | GharConnect</title>
        <meta name="description" content="Join the Worli community discussion forum. Share thoughts, ask questions, and connect with neighbors. Find local recommendations, events, and community updates in Worli." />
        <meta name="keywords" content="Worli community, neighborhood discussions, local events Worli, community forum, connect with neighbors, Worli residents, local recommendations" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Community Discussions & Connect with Neighbors in Worli | GharConnect" />
        <meta property="og:description" content="Join the Worli community discussion forum. Share thoughts, ask questions, and connect with neighbors. Find local recommendations, events, and community updates in Worli." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gharconnect.in/worli/connect" />
        <meta property="og:site_name" content="GharConnect" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Community Discussions & Connect with Neighbors in Worli | GharConnect" />
        <meta name="twitter:description" content="Join the Worli community discussion forum. Share thoughts, ask questions, and connect with neighbors." />
        <link rel="canonical" href="https://gharconnect.in/worli/connect" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </Head>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} redirectPath={pathname} />
      <main className="min-h-screen bg-gray-50 lg:pt-16">
        <Header />
        {/* Indigo Banner */}
        <section className="w-full h-32 bg-indigo-600 flex flex-col items-center justify-center text-center mb-4">
          <h1 className="text-xl md:text-3xl font-bold text-white mb-1">👋 Welcome to Worli's Own Social Network</h1>
          <p className="text-white text-sm md:text-lg mb-3">Your Identity is Always Anonymous</p>
        </section>
        {/* Overlapping Search Box */}
        <div className="w-full flex justify-center -mt-8 mb-6 px-4 md:px-0">
          <div className="flex items-center w-full max-w-xl bg-white rounded-full shadow-lg px-6 py-3">
            <FiSearch className="text-xl md:text-2xl text-gray-400 mr-3" />
            <input
              className="flex-1 bg-transparent outline-none text-sm md:text-lg placeholder-gray-400"
              placeholder="Search for discussions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search community discussions"
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto py-8 px-2 lg:px-4 flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Mobile Filter Dropdown */}
          <div className="lg:hidden mb-4">
            <div className="relative">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="w-full bg-white rounded-lg shadow border border-gray-200 px-4 py-3 text-left flex items-center justify-between"
              >
                <span className="text-sm font-medium text-gray-700">
                  Filter: {activeFilter}
                </span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isFilterDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-2 max-h-64 overflow-y-auto space-y-1">
                    {['All', 'Cleanliness', 'Food', 'Travel', 'Safety', 'Events', 'Services', 'Health', 'Governance', 'Crime', 'Education', 'Environment', 'Entertainment', 'Religion'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => {
                          setActiveFilter(filter);
                          setIsFilterDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                          activeFilter === filter
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Floating Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-8 self-start">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
              <h3 className="text-lg font-bold mb-4 text-indigo-700">Filter by Topic</h3>
              <div className="space-y-2">
                {['All', 'Cleanliness', 'Food', 'Travel', 'Safety', 'Events', 'Services', 'Health', 'Governance', 'Crime', 'Education', 'Environment', 'Entertainment', 'Religion'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === filter
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <div className="flex-1">
          {/* SEO Content Section */}
          <section className="sr-only mb-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Welcome to Worli Community Discussions</h2>
            <div className="sr-only">
              <p className="text-gray-700 mb-4">
                Join our vibrant community forum where residents share local insights, recommendations, and reach out for urgent help. 
                Whether you're looking for local service recommendations, or want to discuss community events, 
                this is the perfect place to engage with the Worli community.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-indigo-50 p-3 rounded">
                  <h3 className="font-semibold text-indigo-800 mb-1">Local Recommendations</h3>
                  <p className="text-indigo-700">Share and discover the best local restaurants, services, and hidden gems in Worli.</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <h3 className="font-semibold text-green-800 mb-1">Community Events</h3>
                  <p className="text-green-700">Stay updated on local events, festivals, and community gatherings in Worli.</p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <h3 className="font-semibold text-purple-800 mb-1">Urgent Help</h3>
                  <p className="text-purple-700">Use the community to get help with urgent needs. Together we can make a difference.</p>
                </div>
              </div>
            </div>
          </section>
          {/* New Post Form */}
          {user ? (
              <section className="mb-8 bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                {!isPostFormOpen ? (
                  <button
                    onClick={() => setIsPostFormOpen(true)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-base md:text-lg font-semibold text-gray-900">Start a New Discussion</h2>
                        <p className="text-sm text-gray-500">Share your thoughts with the community</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base md:text-lg font-semibold text-gray-900">Start a New Discussion</h2>
                      <button
                        onClick={() => {
                          setIsPostFormOpen(false);
                          setNewPost({ title: '', body: '', category: 'gc/worli' });
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
              <form onSubmit={handleNewPost}>
                <input
                        className="w-full border rounded-lg p-3 mb-3 text-sm md:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Title"
                  value={newPost.title}
                  onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                  required
                  aria-label="Post title"
                />
                <select
                  className="w-full border rounded-lg p-3 mb-3 text-sm md:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newPost.category}
                  onChange={e => setNewPost({ ...newPost, category: e.target.value })}
                  required
                  aria-label="Select community"
                >
                  {worliCommunities.map(community => (
                    <option key={community.value} value={community.value}>
                      {community.label}
                    </option>
                  ))}
                </select>
                <textarea
                        className="w-full border rounded-lg p-3 mb-4 text-sm md:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="What's on your mind?"
                  value={newPost.body}
                  onChange={e => setNewPost({ ...newPost, body: e.target.value })}
                  required
                  aria-label="Post content"
                  rows={4}
                />
                      <div className="flex gap-3">
                        <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm md:text-base px-6 py-2">
                  {submitting ? 'Posting...' : 'Post'}
                </Button>
                        <Button 
                          type="button" 
                          onClick={() => {
                            setIsPostFormOpen(false);
                            setNewPost({ title: '', body: '', category: 'gc/worli' });
                          }}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm md:text-base px-6 py-2"
                        >
                          Cancel
                        </Button>
                      </div>
              </form>
                  </div>
                )}
            </section>
          ) : (
            <div className="mb-8 text-center">
                <Button onClick={() => setIsLoginModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-base md:text-lg px-6 py-3 rounded">
                Login to post or comment
              </Button>
            </div>
          )}
          {/* Posts List */}
          <section>
              <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Discussions</h2>
            {loading ? (
              <div>Loading posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-gray-500">No results found.</div>
            ) : (
                <ul className="flex flex-col gap-6">
                {filteredPosts.map(post => (
                    <li key={post.id} className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col gap-2">
                      {/* Top row: area, avatar, time */}
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-1">
                        <img src="/GC_Logo.png" alt="avatar" className="w-8 h-8 rounded-full border object-cover" />
                        <span className="font-semibold text-gray-800">{post.category || 'gc/worli'}</span>
                        <span className="mx-1">•</span>
                        <span>{generateAnonymousId(post.user_id)}</span>
                        <span className="mx-1">•</span>
                        <span>{timeAgo(post.created_at)}</span>
                      </div>
                      {/* Title and body */}
                      <div>
                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">{post.title}</h3>
                        <p className="text-gray-800 text-sm md:text-base mb-2 line-clamp-4 whitespace-pre-line">
                          {(() => {
                            // Split by line breaks, show only first 2-3 lines/paragraphs
                            const lines = post.body.split(/\r?\n/).filter(l => l.trim() !== '');
                            return lines.slice(0, 3).join('\n') + (lines.length > 3 ? '...' : '');
                          })()}
                        </p>
                    </div>
                      {/* Action row: like, comment, read more */}
                      <div className="flex gap-3 mt-2">
                        <button
                          className={`flex items-center gap-1 px-3 md:px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 font-semibold text-xs md:text-sm ${(post.likes || 0) > 0 ? 'text-red-500' : 'text-gray-700'} ${likesLoading === post.id ? 'opacity-50 cursor-wait' : ''}`}
                          onClick={() => handleLikePost(post.id)}
                          disabled={userLikedPosts[post.id] || likesLoading === post.id}
                          aria-label={userLikedPosts[post.id] ? 'Liked' : 'Like'}
                        >
                          <FiHeart fill={(post.likes || 0) > 0 ? 'currentColor' : 'none'} />
                          {post.likes || 0}
                        </button>
                        <Link href={`/worli/connect/${post.id}`} className="flex items-center gap-1 px-3 md:px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs md:text-sm">
                          {/* Speech bubble icon */}
                          <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                          {post.comment_count || 0}
                        </Link>
                        <Link href={`/worli/connect/${post.id}`} className="flex items-center gap-1 px-3 md:px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs md:text-sm">
                          {/* Arrow right icon */}
                          <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                          Read More
                        </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
          </div>
          {/* Right Sidebar (Desktop only) */}
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-8 self-start">
            <div className="bg-white rounded-xl shadow border border-gray-100 p-4 mb-6">
              <h3 className="text-lg font-bold mb-3 text-indigo-700">Top Liked Posts</h3>
              <ul className="space-y-3">
                {topLikedPosts.map(post => (
                  <li key={post.id} className="flex items-center justify-between">
                    <Link href={`/worli/connect/${post.id}`} className="text-blue-700 font-medium hover:underline line-clamp-1 flex-1">{post.title}</Link>
                    <span className="ml-2 flex items-center text-gray-500 text-sm"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>{post.likes || 0}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
              <h3 className="text-lg font-bold mb-3 text-indigo-700">Top Commented Posts</h3>
              <ul className="space-y-3">
                {topCommentedPosts.map(post => (
                  <li key={post.id} className="flex items-center justify-between">
                    <Link href={`/worli/connect/${post.id}`} className="text-blue-700 font-medium hover:underline line-clamp-1 flex-1">{post.title}</Link>
                    <span className="ml-2 flex items-center text-gray-500 text-sm"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>{post.comment_count || 0}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
} 