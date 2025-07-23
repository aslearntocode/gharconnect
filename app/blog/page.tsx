import { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, Clock, User } from 'lucide-react';
import { getBlogPosts } from '@/lib/blog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Blog - GharConnect | Real Estate Insights & Community Living Tips',
  description: 'Discover insights on real estate trends, community living tips, property investment advice, and neighborhood guides. Stay informed with GharConnect\'s expert blog.',
  keywords: 'real estate blog, property investment, community living, neighborhood guides, real estate trends, property tips',
  openGraph: {
    title: 'Blog - GharConnect | Real Estate Insights & Community Living Tips',
    description: 'Discover insights on real estate trends, community living tips, property investment advice, and neighborhood guides.',
    type: 'website',
    url: 'https://gharconnect.in/blog',
  },
};

export default function BlogPage() {
  const blogPosts = getBlogPosts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Content with top padding for fixed header */}
      <div className="pt-16">
        {/* Blue Banner */}
        <div className="relative">
          <div className="w-full h-40 bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Blogs by GharConnect</h1>
              <p className="text-indigo-100 text-base">Expert insights for better community living</p>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <article key={post.slug} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-indigo-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{post.author}</span>
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
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-medium">{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 text-center border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Updated with Our Latest Insights
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get the latest real estate trends, community living tips, and neighborhood updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md hover:shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 