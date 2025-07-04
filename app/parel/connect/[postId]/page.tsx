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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
    fetchPostAndComments();
    return () => unsubscribe();
  }, [postId]);

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
    "url": `https://gharconnect.in/parel/connect/${post.id}`,
    "publisher": {
      "@type": "Organization",
      "name": "GharConnect",
      "url": "https://gharconnect.in"
    }
  } : null;

  return (
    <>
      <Head>
        <title>{post ? `${post.title} - Parel Community Discussion | GharConnect` : 'Community Discussion - Parel | GharConnect'}</title>
        <meta name="description" content={post ? `Join the discussion about "${post.title}" in the Parel community. Read comments, share your thoughts, and connect with neighbors in Parel.` : 'Join community discussions in Parel. Share thoughts, ask questions, and connect with neighbors.'} />
        <meta name="keywords" content="Parel community discussion, neighborhood forum, local discussions Parel, community posts, Parel residents forum" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={post ? `${post.title} - Parel Community Discussion | GharConnect` : 'Community Discussion - Parel | GharConnect'} />
        <meta property="og:description" content={post ? `Join the discussion about "${post.title}" in the Parel community. Read comments, share your thoughts, and connect with neighbors in Parel.` : 'Join community discussions in Parel. Share thoughts, ask questions, and connect with neighbors.'} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://gharconnect.in/parel/connect/${postId}`} />
        <meta property="og:site_name" content="GharConnect" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post ? `${post.title} - Parel Community Discussion | GharConnect` : 'Community Discussion - Parel | GharConnect'} />
        <meta name="twitter:description" content={post ? `Join the discussion about "${post.title}" in the Parel community.` : 'Join community discussions in Parel.'} />
        <link rel="canonical" href={`https://gharconnect.in/parel/connect/${postId}`} />
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
            <Link href="/parel/connect" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to all posts</Link>
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
                  <p className="text-gray-700 mb-2">{post.body}</p>
                  <time className="text-xs text-gray-400" dateTime={post.created_at}>
                    {new Date(post.created_at).toLocaleString()}
                  </time>
                </header>
              </article>
              <section>
                <h2 className="mb-2 font-semibold">Comments ({comments.length})</h2>
                {grouped['root']?.length === 0 ? (
                  <div className="text-gray-500 mb-2">No comments yet.</div>
                ) : (
                  <ul className="mb-2 space-y-2">
                    {grouped['root']?.map(comment => (
                      <li key={comment.id} className="bg-gray-50 p-2 rounded">
                        <article>
                          <p className="text-gray-800 text-sm">{comment.body}</p>
                          <time className="text-xs text-gray-400" dateTime={comment.created_at}>
                            {new Date(comment.created_at).toLocaleString()}
                          </time>
                          <button
                            className="text-xs text-blue-600 mt-1 hover:underline"
                            onClick={() => setReplyTo(comment.id)}
                            aria-label={`Reply to comment`}
                          >
                            Reply
                          </button>
                          {/* Replies */}
                          {grouped[comment.id]?.length > 0 && (
                            <ul className="ml-4 mt-2 space-y-2">
                              {grouped[comment.id].map(reply => (
                                <li key={reply.id} className="bg-gray-100 p-2 rounded">
                                  <article>
                                    <p className="text-gray-800 text-sm">{reply.body}</p>
                                    <time className="text-xs text-gray-400" dateTime={reply.created_at}>
                                      {new Date(reply.created_at).toLocaleString()}
                                    </time>
                                  </article>
                                </li>
                              ))}
                            </ul>
                          )}
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
                        </article>
                      </li>
                    ))}
                  </ul>
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