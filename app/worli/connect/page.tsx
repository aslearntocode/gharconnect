"use client";
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import Head from 'next/head';
import { usePathname } from 'next/navigation'
import LoginModal from '@/components/LoginModal';

interface Post {
  id: string;
  title: string;
  body: string;
  user_id: string;
  created_at: string;
  comment_count: number;
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
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
    });
    fetchPosts();
    return () => unsubscribe();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('posts')
      .select(`*, comment_count:comments(count)`)
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
      setNewPost({ title: '', body: '' });
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

  // Filter posts by search
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.body.toLowerCase().includes(search.toLowerCase())
  );

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
      <main className="min-h-screen bg-gray-50">
        <Header />
        {/* Indigo Banner */}
        <section className="w-full bg-indigo-600 py-1 md:py-4 flex flex-col items-center justify-center text-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Connect with your neighbors</h1>
          <p className="text-white text-base md:text-lg mb-3">Share your thoughts, ask questions, and get to know your neighbors</p>
        </section>
        {/* Overlapping Search Box */}
        <div className="w-full flex justify-center -mt-8 mb-6">
          <div className="flex items-center w-full max-w-xl bg-white rounded-full shadow-lg px-6 py-3">
            <FiSearch className="text-2xl text-gray-400 mr-3" />
            <input
              className="flex-1 bg-transparent outline-none text-base md:text-lg placeholder-gray-400"
              placeholder="Search for discussions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search community discussions"
            />
          </div>
        </div>
        <div className="max-w-6xl mx-auto py-8 px-4">
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
            <section className="mb-8 space-y-2 bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-3">Start a New Discussion</h2>
              <form onSubmit={handleNewPost}>
                <input
                  className="w-full border rounded p-2 mb-2"
                  placeholder="Title"
                  value={newPost.title}
                  onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                  required
                  aria-label="Post title"
                />
                <textarea
                  className="w-full border rounded p-2 mb-2"
                  placeholder="What's on your mind?"
                  value={newPost.body}
                  onChange={e => setNewPost({ ...newPost, body: e.target.value })}
                  required
                  aria-label="Post content"
                  rows={4}
                />
                <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {submitting ? 'Posting...' : 'Post'}
                </Button>
              </form>
            </section>
          ) : (
            <div className="mb-8 text-center">
              <Button onClick={() => setIsLoginModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-6 py-3 rounded">
                Login to post or comment
              </Button>
            </div>
          )}
          {/* Posts List */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Discussions</h2>
            {loading ? (
              <div>Loading posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-gray-500">No results found.</div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {filteredPosts.map(post => (
                  <li key={post.id} className="bg-white p-4 rounded shadow h-full flex flex-col justify-between relative">
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-semibold text-lg break-words flex-1">{post.title}</h3>
                        <span className="inline-flex items-center px-2 py-1 bg-indigo-100 text-blue-600 text-xs font-semibold rounded-full whitespace-nowrap">
                          {post.comment_count && post.comment_count > 0 ? `${post.comment_count} comments` : 'No Comment Yet'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3 line-clamp-2">{post.body}</p>
                      <time className="text-xs text-gray-400" dateTime={post.created_at}>
                        {new Date(post.created_at).toLocaleString()}
                      </time>
                    </div>
                    <div className="mt-4 flex-shrink-0">
                      <Button size="sm" asChild className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">
                        <Link href={`/worli/connect/${post.id}`}>Read More</Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
} 