"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Link from 'next/link';
import Head from 'next/head';

interface Post {
  id: string;
  title: string;
  body: string;
  user_id: string;
  created_at: string;
}

interface Comment {
  id: string;
  post_id: string;
  body: string;
  user_id: string;
  created_at: string;
  parent_comment_id?: string;
  likes?: number; // Added likes to the interface
}

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.postId as string;
  const [user, setUser] = useState<any>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  // Add state to track likes loading
  const [likesLoading, setLikesLoading] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userLikedComments, setUserLikedComments] = useState<{ [commentId: string]: boolean }>({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
    fetchPostAndComments();
    return () => unsubscribe();
  }, [postId]);

  useEffect(() => {
    if (!user) return;
    const fetchLikedComments = async () => {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('user_id', user.uid);
      if (!error && data) {
        const liked: Record<string, boolean> = {};
        data.forEach((row: { comment_id: string }) => { liked[row.comment_id] = true; });
        setUserLikedComments(liked);
      }
    };
    fetchLikedComments();
  }, [user]);

  const fetchPostAndComments = async () => {
    setLoading(true);
    const supabase = await getSupabaseClient();
    const { data: postData } = await supabase.from('posts').select('*').eq('id', postId).single();
    const { data: commentsData } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
    setPost(postData || null);
    setComments(commentsData || []);
    setLoading(false);
  };

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
    if (!user || !post) return;
    setCommentLoading(true);
    const supabase = await getSupabaseClient();
    const firebaseUid = user.uid;
    const uuidFromFirebase = firebaseUid.replace(/-/g, '').padEnd(32, '0').substring(0, 32);
    const formattedUuid = `${uuidFromFirebase.substring(0, 8)}-${uuidFromFirebase.substring(8, 12)}-${uuidFromFirebase.substring(12, 16)}-${uuidFromFirebase.substring(16, 20)}-${uuidFromFirebase.substring(20, 32)}`;
    const { error } = await supabase.from('comments').insert([
      {
        post_id: post.id,
        body: newComment,
        user_id: formattedUuid,
        parent_comment_id: parentId || null,
        area: 'Worli',
      },
    ]);
    setCommentLoading(false);
    if (!error) {
      setNewComment('');
      setReplyTo(null);
      fetchPostAndComments();
    } else {
      console.error('Error creating comment:', error);
    }
  };

  // Add handler to like a comment (per-user)
  async function handleLikeComment(commentId: string) {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    setLikesLoading(commentId);
    const supabase = await getSupabaseClient();
    const firebaseUid = user.uid;
    // Check if already liked
    const { data: likeRows, error: likeError } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('user_id', firebaseUid)
      .eq('comment_id', commentId);
    if (likeRows && likeRows.length > 0) {
      setLikesLoading(null);
      return; // Already liked
    }
    // Insert like
    const { error: insertError } = await supabase
      .from('comment_likes')
      .insert([{ user_id: firebaseUid, comment_id: commentId }]);
    if (!insertError) {
      // Increment comment likes
      const currentComment = comments.find(c => c.id === commentId);
      const currentLikes = currentComment?.likes || 0;
      await supabase
        .from('comments')
        .update({ likes: currentLikes + 1 })
        .eq('id', commentId);
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c));
      setUserLikedComments(prev => ({ ...prev, [commentId]: true }));
    }
    setLikesLoading(null);
  }

  // Helper to recursively render comments
  function renderComments(
    grouped: { [key: string]: Comment[] },
    parentId: string,
    level: number = 0
  ) {
    return (
      <ul className={level === 0 ? 'mb-2 space-y-2' : `ml-${Math.min(level * 4, 24)} mt-2 space-y-2`}>
        {grouped[parentId]?.map(comment => (
          <li key={comment.id} className={`bg-white p-3 rounded shadow-sm border border-gray-100 relative` + (level > 0 ? ' mt-2' : '')}>
            <article>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-indigo-700">User</span>
                <time className="text-xs text-gray-400" dateTime={comment.created_at}>
                  {new Date(comment.created_at).toLocaleString()}
                </time>
              </div>
              <p className="text-gray-800 text-sm mb-2">{comment.body}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <button
                  className={`flex items-center gap-1 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 font-semibold ${userLikedComments[comment.id] ? 'text-red-500' : 'text-gray-700'} ${likesLoading === comment.id ? 'opacity-50 cursor-wait' : ''}`}
                  onClick={() => handleLikeComment(comment.id)}
                  disabled={userLikedComments[comment.id] || likesLoading === comment.id}
                >
                  <svg className="w-5 h-5" fill={userLikedComments[comment.id] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  {comment.likes || 0}
                </button>
                <button className="flex items-center gap-1 hover:text-blue-600 focus:outline-none" onClick={() => setReplyTo(comment.id)} aria-label="Reply to comment">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 10h7V6l7 7-7 7v-4H3z"/></svg>
                  Reply
                </button>
                <button className="flex items-center gap-1 hover:text-gray-700 focus:outline-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405M19 17V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h8"/></svg>
                  Share
                </button>
              </div>
              {/* Reply input */}
              {replyTo === comment.id && (
                user ? (
                  <form
                    onSubmit={e => handleNewComment(e, comment.id)}
                    className="flex gap-2 mt-2"
                  >
                    <input
                      className="flex-1 border rounded p-2"
                      placeholder="Reply..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      required
                      aria-label="Reply to comment"
                    />
                    <Button type="submit" disabled={commentLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      {commentLoading ? 'Posting...' : 'Reply'}
                    </Button>
                    <Button type="button" onClick={() => setReplyTo(null)} className="bg-gray-200 text-gray-700">
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <div className="text-center text-gray-600 my-2 font-semibold">Login to View or Post Comments</div>
                )
              )}
              {/* Render replies recursively */}
              {grouped[comment.id]?.length > 0 && renderComments(grouped, comment.id, level + 1)}
            </article>
          </li>
        ))}
      </ul>
    );
  }

  // Structured data for the post
  const structuredData = post ? {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "headline": post.title,
    "text": post.body,
    "datePublished": post.created_at,
    "dateModified": post.created_at,
    "author": {
      "@type": "Person",
      "name": "Community Member"
    },
    "commentCount": comments.length,
    "url": `https://gharconnect.in/worli/connect/${post.id}`,
    "publisher": {
      "@type": "Organization",
      "name": "GharConnect",
      "url": "https://gharconnect.in"
    }
  } : null;

  return (
    <>
      <Head>
        <title>{post ? `${post.title} - Worli Community Discussion | GharConnect` : 'Community Discussion - Worli | GharConnect'}</title>
        <meta name="description" content={post ? `Join the discussion about "${post.title}" in the Worli community. Read comments, share your thoughts, and connect with neighbors in Worli.` : 'Join community discussions in Worli. Share thoughts, ask questions, and connect with neighbors.'} />
        <meta name="keywords" content="Worli community discussion, neighborhood forum, local discussions Worli, community posts, Worli residents forum" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={post ? `${post.title} - Worli Community Discussion | GharConnect` : 'Community Discussion - Worli | GharConnect'} />
        <meta property="og:description" content={post ? `Join the discussion about "${post.title}" in the Worli community. Read comments, share your thoughts, and connect with neighbors in Worli.` : 'Join community discussions in Worli. Share thoughts, ask questions, and connect with neighbors.'} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://gharconnect.in/worli/connect/${postId}`} />
        <meta property="og:site_name" content="GharConnect" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post ? `${post.title} - Worli Community Discussion | GharConnect` : 'Community Discussion - Worli | GharConnect'} />
        <meta name="twitter:description" content={post ? `Join the discussion about "${post.title}" in the Worli community.` : 'Join community discussions in Worli.'} />
        <link rel="canonical" href={`https://gharconnect.in/worli/connect/${postId}`} />
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData)
            }}
          />
        )}
      </Head>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto py-8 px-4">
          <nav aria-label="Breadcrumb">
            <Link href="/worli/connect" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to all posts</Link>
          </nav>
          {loading ? (
            <div>Loading...</div>
          ) : !post ? (
            <div className="text-gray-500">Post not found.</div>
          ) : (
            <>
              <article className="bg-white p-4 rounded shadow mb-6">
                <header>
                  <h1 className="font-semibold text-lg mb-1">{post.title}</h1>
                  <div className="text-gray-700 mb-2 whitespace-pre-line">{post.body}</div>
                  <time className="text-xs text-gray-400" dateTime={post.created_at}>
                    {new Date(post.created_at).toLocaleString()}
                  </time>
                </header>
              </article>
              <section>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                  <h2 className="font-semibold">Comments ({comments.length})</h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search comments..."
                      className="border rounded px-2 py-1 text-sm"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                    <select className="border rounded px-2 py-1 text-sm">
                      <option>Sort by Best</option>
                      <option>Sort by Newest</option>
                      <option>Sort by Oldest</option>
                    </select>
                  </div>
                </div>
                {grouped['root']?.length === 0 ? (
                  <div className="text-gray-500 mb-2">No comments yet.</div>
                ) : (
                  renderComments(grouped, 'root', 0)
                )}
              </section>
              {/* Top-level comment input */}
              {replyTo === null && (
                user ? (
                  <section>
                    <h3 className="mb-2 font-semibold">Add a Comment</h3>
                    <form onSubmit={e => handleNewComment(e, null)} className="flex gap-2 mt-2">
                      <input
                        className="flex-1 border rounded p-2"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        required
                        aria-label="Add a comment"
                      />
                      <Button type="submit" disabled={commentLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        {commentLoading ? 'Posting...' : 'Comment'}
                      </Button>
                    </form>
                  </section>
                ) : (
                  <div className="text-center text-gray-600 my-6 font-semibold">Login to View or Post Comments</div>
                )
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
} 