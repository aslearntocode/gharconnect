import { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, Clock, User } from 'lucide-react';
import { getBlogPosts } from '@/lib/blog';
import BlogLayout from './BlogLayout';

interface BlogPageProps {
  society: string;
}

export function generateMetadata({ society }: BlogPageProps): Metadata {
  return {
    title: 'Blog - GharConnect | Real Estate Insights & Community Living Tips',
    description: 'Discover insights on real estate trends, community living tips, property investment advice, and neighborhood guides. Stay informed with GharConnect\'s expert blog.',
    keywords: 'real estate blog, property investment, community living, neighborhood guides, real estate trends, property tips',
    openGraph: {
      title: 'Blog - GharConnect | Real Estate Insights & Community Living Tips',
      description: 'Discover insights on real estate trends, community living tips, property investment advice, and neighborhood guides.',
      type: 'website',
      url: `https://gharconnect.in/${society}/blog`,
    },
  };
}

export default function BlogPage({ society }: BlogPageProps) {
  const blogPosts = getBlogPosts();

  return (
    <BlogLayout>
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Blogs by GharConnect</h1>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-xl text-gray-600 mb-8">
            Insights, tips, and guides for better community living and real estate decisions
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm">
              Real Estate
            </span>
            <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm">
              Community Living
            </span>
            <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm">
              Investment Tips
            </span>
            <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm">
              Neighborhood Guides
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {post.category}
                  </span>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  <Link href={`/${society}/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Stay Updated with Our Latest Insights
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get the latest real estate trends, community living tips, and neighborhood updates delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
} 