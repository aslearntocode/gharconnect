"use client";
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter, useParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase'
import { supabase } from '@/lib/supabase-auth';
import { generateAnonymousId } from '@/lib/anonymousId';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Link from 'next/link';
import Head from 'next/head';
import ImageModal from '@/components/ImageModal';
import { FiHeart, FiShare2 } from 'react-icons/fi';
import LoginModal from '@/components/LoginModal';

interface Post {
  id: string;
  title: string;
  body: string;
  user_id: string;
  created_at: string;
  category?: string;
  images?: string[];
  likes?: number;
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
  // Add state to track likes loading
  const [likesLoading, setLikesLoading] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userLikedComments, setUserLikedComments] = useState<{ [commentId: string]: boolean }>({});
  const [userLikedPosts, setUserLikedPosts] = useState<{ [postId: string]: boolean }>({});
  const [collapsedComments, setCollapsedComments] = useState<{ [commentId: string]: boolean }>({});
  const [imageModal, setImageModal] = useState<{ isOpen: boolean; imageUrl: string; alt: string; currentIndex: number }>({
    isOpen: false,
    imageUrl: '',
    alt: '',
    currentIndex: 0
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => setUser(session?.user || null));
    fetchPostAndComments();
    return () => subscription.unsubscribe();
  }, [postId]);

  useEffect(() => {
    if (!user) return;
    const fetchLikedComments = async () => {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('user_id', user.id);
      if (!error && data) {
        const liked: Record<string, boolean> = {};
        data.forEach((row: { comment_id: string }) => { liked[row.comment_id] = true; });
        setUserLikedComments(liked);
      }
    };
    fetchLikedComments();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchLikedPosts = async () => {
      const supabase = await getSupabaseClient();
      const userId = user.id;
      const { data, error } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', userId);
      if (!error && data) {
        const liked: Record<string, boolean> = {};
        data.forEach((row: { post_id: string }) => { liked[row.post_id] = true; });
        setUserLikedPosts(liked);
      }
    };
    fetchLikedPosts();
  }, [user]);

  const fetchPostAndComments = async () => {
    setLoading(true);
    const supabase = await getSupabaseClient();
    const { data: postData } = await supabase.from('posts').select('*').eq('id', postId).single();
    const { data: commentsData } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: false });
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
    const userId = user.id;
    const { error } = await supabase.from('comments').insert([
      {
        post_id: post.id,
        body: newComment,
        user_id: userId,
        parent_comment_id: parentId || null,
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
  async function handleLikePost(postId: string) {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    setLikesLoading(postId);
    try {
      const supabase = await getSupabaseClient();
      const userId = user.id;

      // Check if user already liked the post
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike the post
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        // Decrease likes count
        if (post) {
          await supabase
            .from('posts')
            .update({ likes: (post.likes || 1) - 1 })
            .eq('id', postId);

          setUserLikedPosts(prev => ({ ...prev, [postId]: false }));
          setPost(prev => prev ? { ...prev, likes: (prev.likes || 1) - 1 } : null);
        }
      } else {
        // Like the post
        await supabase
          .from('post_likes')
          .insert([{ post_id: postId, user_id: userId }]);

        // Increase likes count
        if (post) {
          await supabase
            .from('posts')
            .update({ likes: (post.likes || 0) + 1 })
            .eq('id', postId);

          setUserLikedPosts(prev => ({ ...prev, [postId]: true }));
          setPost(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLikesLoading(null);
    }
  }

  async function handleLikeComment(commentId: string) {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    setLikesLoading(commentId);
    try {
      const supabase = await getSupabaseClient();
      const userId = user.id;

      // Check if user already liked the post
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike the post
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        // Decrease likes count
        if (post) {
          await supabase
            .from('posts')
            .update({ likes: (post.likes || 1) - 1 })
            .eq('id', postId);

          setUserLikedPosts(prev => ({ ...prev, [postId]: false }));
          setPost(prev => prev ? { ...prev, likes: (prev.likes || 1) - 1 } : null);
        }
      } else {
        // Like the post
        await supabase
          .from('post_likes')
          .insert([{ post_id: postId, user_id: userId }]);

        // Increase likes count
        if (post) {
          await supabase
            .from('posts')
            .update({ likes: (post.likes || 0) + 1 })
            .eq('id', postId);

          setUserLikedPosts(prev => ({ ...prev, [postId]: true }));
          setPost(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLikesLoading(null);
    }
  }

  const handleSharePost = () => {
    const currentUrl = window.location.href;
    const shareText = post ? `Check out this post: "${post.title}"` : 'Check out this post';
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${currentUrl}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Handle successful login - keep user on current post
  const handleLoginSuccess = () => {
    // User stays on the current post, no redirect needed
    console.log('User logged in successfully, staying on current post');
  };

  // Helper to recursively render comments
  function renderComments(
    grouped: { [key: string]: Comment[] },
    parentId: string,
    level: number = 0
  ) {
    // For root level, always show comments. For nested levels, default to collapsed
    const isCollapsed = level === 0 ? false : (collapsedComments[parentId] !== false);
    const commentsToRender = isCollapsed ? [] : grouped[parentId];
    const hasReplies = grouped[parentId]?.length > 0;

    return (
      <ul className={level === 0 ? 'mb-2 space-y-2' : `ml-${Math.min(level * 4, 24)} mt-2 space-y-2`}>
        {commentsToRender?.map(comment => (
          <li key={comment.id} className={`bg-white p-3 rounded shadow-sm border border-gray-100 relative` + (level > 0 ? ' mt-2' : '')}>
            <article>
              <div className="flex items-start gap-3">
                {/* Expand/Collapse Button - Only show if there are actual replies */}
                {grouped[comment.id]?.length > 0 && (
                  <div className="flex flex-col items-center mt-1">
                    <button
                      onClick={() => setCollapsedComments(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                      className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                      aria-label={collapsedComments[comment.id] !== false ? 'Expand replies' : 'Collapse replies'}
                    >
                      {collapsedComments[comment.id] !== false ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      )}
                    </button>
                    {/* Vertical line connecting to replies */}
                    {collapsedComments[comment.id] === false && grouped[comment.id]?.length > 0 && (
                      <div className="w-px h-full bg-gray-200 mt-2 flex-1"></div>
                    )}
                  </div>
                )}
                
                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-indigo-700">{generateAnonymousId(comment.user_id)}</span>
                    <time className="text-xs text-gray-400" dateTime={comment.created_at}>
                      {new Date(comment.created_at).toLocaleString()}
                    </time>
                  </div>
                  <p className="text-gray-800 text-sm mb-2">{comment.body}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <button
                      className={`flex items-center gap-1 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 font-semibold ${(comment.likes || 0) > 0 ? 'text-red-500' : 'text-gray-700'} ${likesLoading === comment.id ? 'opacity-50 cursor-wait' : ''}`}
                      onClick={() => handleLikeComment(comment.id)}
                      disabled={userLikedComments[comment.id] || likesLoading === comment.id}
                    >
                      <svg className="w-5 h-5" fill={(comment.likes || 0) > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      {comment.likes || 0}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-600 focus:outline-none" onClick={() => setReplyTo(comment.id)} aria-label="Reply to comment">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 10h7V6l7 7-7 7v-4H3z"/></svg>
                      Reply
                    </button>
                  </div>
                  {/* Reply input */}
                  {replyTo === comment.id && (
                    user ? (
                      <form
                        onSubmit={e => handleNewComment(e, comment.id)}
                        className="flex gap-2 mt-2"
                      >
                        <textarea
                          className="flex-1 border rounded p-2 resize-none min-h-[40px] max-h-32 overflow-y-auto"
                          placeholder="Reply..."
                          value={newComment}
                          onChange={e => {
                            setNewComment(e.target.value);
                            // Auto-resize textarea
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleNewComment(e, comment.id);
                            }
                          }}
                          required
                          aria-label="Reply to comment"
                          rows={1}
                        />
                        <Button type="submit" disabled={commentLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                          {commentLoading ? 'Posting...' : 'Reply'}
                        </Button>
                        <Button type="button" onClick={() => setReplyTo(null)} className="bg-gray-200 text-gray-700">
                          Cancel
                        </Button>
                      </form>
                    ) : (
                      <div className="text-center my-6">
                        <button
                          onClick={() => setIsLoginModalOpen(true)}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Login to Comment
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
              
              {/* Show expand button if comment is collapsed and has replies */}
              {collapsedComments[comment.id] !== false && grouped[comment.id]?.length > 0 && (
                <div className="mt-2 ml-9">
                  <button
                    onClick={() => setCollapsedComments(prev => ({ ...prev, [comment.id]: false }))}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <div className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span>{grouped[comment.id]?.length || 0} more replies</span>
                  </button>
                </div>
              )}
              
              {/* Render replies recursively */}
              {collapsedComments[comment.id] === false && grouped[comment.id]?.length > 0 && renderComments(grouped, comment.id, level + 1)}
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
    "url": `https://gharconnect.in/bangalore/connect/${post.id}`,
    "publisher": {
      "@type": "Organization",
      "name": "GharConnect",
      "url": "https://gharconnect.in"
    }
  } : null;

  return (
    <>
      <Head>
        <title>{post ? `${post.title} - Bangalore Community Discussion | GharConnect` : 'Community Discussion - Bangalore | GharConnect'}</title>
        <meta name="description" content={post ? `Join the discussion about "${post.title}" in the Bangalore community. Read comments, share your thoughts, and connect with neighbors in Bangalore.` : 'Join community discussions in Bangalore. Share thoughts, ask questions, and connect with neighbors.'} />
        <meta name="keywords" content="Bangalore community discussion, neighborhood forum, local discussions Bangalore, community posts, Bangalore residents forum" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={post ? `${post.title} - Bangalore Community Discussion | GharConnect` : 'Community Discussion - Bangalore | GharConnect'} />
        <meta property="og:description" content={post ? `Join the discussion about "${post.title}" in the Bangalore community. Read comments, share your thoughts, and connect with neighbors in Bangalore.` : 'Join community discussions in Bangalore. Share thoughts, ask questions, and connect with neighbors.'} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://gharconnect.in/bangalore/connect/${postId}`} />
        <meta property="og:site_name" content="GharConnect" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post ? `${post.title} - Bangalore Community Discussion | GharConnect` : 'Community Discussion - Bangalore | GharConnect'} />
        <meta name="twitter:description" content={post ? `Join the discussion about "${post.title}" in the Bangalore community.` : 'Join community discussions in Bangalore.'} />
        <link rel="canonical" href={`https://gharconnect.in/bangalore/connect/${postId}`} />
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData)
            }}
          />
        )}
      </Head>
      <main className="min-h-screen bg-gray-50 lg:pt-16">
        <Header />
        <div className="max-w-2xl mx-auto py-8 px-4">
          <nav aria-label="Breadcrumb">
            <Link href="/bangalore/community/connect" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to all posts</Link>
          </nav>
          {loading ? (
            <div>Loading...</div>
          ) : !post ? (
            <div className="text-gray-500">Post not found.</div>
          ) : (
            <>
              <article className="bg-white p-4 rounded shadow mb-6">
                <header>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm text-gray-600">{post.category || 'gc/bangalore'}</span>
                  </div>
                  <h1 className="font-semibold text-lg mb-1">{post.title}</h1>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm text-indigo-700">{generateAnonymousId(post.user_id)}</span>
                    <time className="text-xs text-gray-400" dateTime={post.created_at}>
                      {new Date(post.created_at).toLocaleString()}
                    </time>
                  </div>
                  <div className="text-gray-700 mb-2 whitespace-pre-line">{post.body}</div>
                  
                  {/* Images Display */}
                  {post.images && post.images.length > 0 && (
                    <div className="mt-4">
                      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                        {post.images.map((imageUrl, index) => (
                          <div key={index} className="relative">
                            <img
                              src={imageUrl}
                              alt={`Post image ${index + 1}`}
                              className="w-full h-20 md:h-48 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => {
                                setImageModal({ isOpen: true, imageUrl: imageUrl, alt: `Post image ${index + 1}`, currentIndex: index });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Like Button */}
                  <div className="flex gap-2 mt-4">
                    <button
                      className={`flex items-center gap-1 px-2 md:px-4 py-1.5 md:py-2 rounded-full bg-gray-100 hover:bg-gray-200 font-semibold text-sm md:text-sm ${(post.likes || 0) > 0 ? 'text-red-500' : 'text-gray-700'} ${likesLoading === post.id ? 'opacity-50 cursor-wait' : ''}`}
                      onClick={() => handleLikePost(post.id)}
                      disabled={userLikedPosts[post.id] || likesLoading === post.id}
                      aria-label={userLikedPosts[post.id] ? 'Liked' : 'Like'}
                    >
                      <FiHeart fill={(post.likes || 0) > 0 ? 'currentColor' : 'none'} />
                      {post.likes || 0}
                    </button>
                    <button
                      className="flex items-center gap-1 px-2 md:px-4 py-1.5 md:py-2 rounded-full bg-gray-100 hover:bg-gray-200 font-semibold text-sm md:text-sm text-gray-700"
                      onClick={handleSharePost}
                      aria-label="Share on WhatsApp"
                    >
                      <FiShare2 />
                      Share
                    </button>
                  </div>
                </header>
              </article>
              
              {/* Add Comment Section - moved here to appear right after post */}
              {replyTo === null && (
                user ? (
                  <section className="bg-white p-4 rounded shadow mb-6">
                    <h3 className="mb-2 font-semibold">Add a Comment</h3>
                    <form onSubmit={e => handleNewComment(e, null)} className="flex gap-2 mt-2">
                      <textarea
                        className="flex-1 border rounded p-2 resize-none min-h-[40px] max-h-32 overflow-y-auto"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={e => {
                          setNewComment(e.target.value);
                          // Auto-resize textarea
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleNewComment(e, null);
                          }
                        }}
                        required
                        aria-label="Add a comment"
                        rows={1}
                      />
                      <Button type="submit" disabled={commentLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        {commentLoading ? 'Posting...' : 'Comment'}
                      </Button>
                    </form>
                  </section>
                ) : (
                  <div className="bg-white p-4 rounded shadow mb-6 text-center">
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Login to Comment
                    </button>
                  </div>
                )
              )}
              
              <section>
                <div className="mb-2">
                  <h2 className="font-semibold">Comments ({comments.length})</h2>
                </div>
                {grouped['root']?.length === 0 ? (
                  <div className="text-gray-500 mb-2">No comments yet.</div>
                ) : (
                  renderComments(grouped, 'root', 0)
                )}
              </section>
            </>
          )}
        </div>
      </main>
      <ImageModal
        isOpen={imageModal.isOpen}
        onClose={() => setImageModal({ ...imageModal, isOpen: false })}
        imageUrl={post?.images?.[imageModal.currentIndex] || imageModal.imageUrl}
        alt={imageModal.alt}
        allImages={post?.images || []}
        currentIndex={imageModal.currentIndex}
        onImageChange={(index) => setImageModal(prev => ({ ...prev, currentIndex: index }))}
      />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
} 