'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { articles, getArticleLink } from '@/app/data/travel-vlogs'

function LearningCenter() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  
  // Extract society from pathname
  const getSocietyFromPath = () => {
    const pathParts = pathname.split('/')
    // Assuming URL structure is /society-name/...
    return pathParts[1] || 'cb-parel' // Default to cb-parel if no society in path
  }

  const currentSociety = getSocietyFromPath()
  
  // Get unique categories from articles
  const uniqueCategories = Array.from(new Set(articles.map(article => article.category)));
  const categories = ['all', ...uniqueCategories];
  
  const filteredArticles = articles
    .filter(article => {
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-r from-blue-600 to-blue-700" />
          
          <div className="relative max-w-7xl mx-auto px-1 sm:px-2 lg:px-4 pt-4 pb-4">
            <div className="text-center pt-4">
              <h1 className="text-3xl font-bold text-white mb-4 font-serif tracking-wide">
                Travel Vlogs
              </h1>
              
              <div className="max-w-2xl mx-auto mt-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search travel vlogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <svg
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Category Menu Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-between w-full px-4 py-3 bg-white rounded-lg shadow-sm"
              >
                <span className="text-gray-700 font-medium">
                  {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Mobile Category Menu Dropdown */}
              {isMobileMenuOpen && (
                <div className="absolute z-50 mt-2 w-[calc(100%-2rem)] bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`
                        w-full px-4 py-3 text-left transition-colors duration-200
                        ${selectedCategory === category
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Category Sidebar */}
            <div className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
                <div className="flex flex-col gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        px-4 py-3 rounded-lg text-left transition-all duration-200
                        ${selectedCategory === category
                          ? 'bg-blue-600 text-white shadow-md transform translate-x-2'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                        }
                        ${selectedCategory === category ? 'font-medium' : 'font-normal'}
                      `}
                    >
                      {category === 'all' ? 'All Categories' : category}
                      {selectedCategory === category && (
                        <span className="float-right">→</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredArticles.map(article => (
                  <Link href={getArticleLink(currentSociety, article.id, article.category)} key={article.id}>
                    <div className="bg-white border rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                            {article.category}
                          </span>
                          <span className="text-gray-500 text-sm">{article.readTime}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h3>
                        <p className="text-gray-600">{article.description}</p>
                      </div>
                      {article.author && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-500">By {article.author}</p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LearningCenter 