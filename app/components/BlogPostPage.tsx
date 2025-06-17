import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import { getBlogPost, getRelatedPosts } from '@/lib/blog';
import BlogLayout from './BlogLayout';
import ReactMarkdown from 'react-markdown';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
  society: string;
}

export function generateMetadata(props: { params: { slug: string }, society: string }): Metadata {
  const { params, society } = props;
  const post = getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found - GharConnect',
    };
  }

  return {
    title: `${post.title} - GharConnect Blog`,
    description: post.excerpt,
    keywords: `${post.category.toLowerCase()}, real estate, property, community living, gharconnect`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://gharconnect.in/${society}/blog/${post.slug}`,
      authors: [post.author],
      publishedTime: post.date,
    },
  };
}

export default function BlogPostPage({ params, society }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug, 2);

  return (
    <BlogLayout>
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href={`/${society}/blog`} 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-2">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              {post.excerpt}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-t pt-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <div className="prose prose-lg max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed">
              <ReactMarkdown>
                {post.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.slug} 
                    href={`/${society}/blog/${relatedPost.slug}`}
                    className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{relatedPost.category}</span>
                      <span>{relatedPost.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </BlogLayout>
  );
} 