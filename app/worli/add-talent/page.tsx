'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { FiUpload, FiUser, FiMapPin, FiPhone, FiMail, FiAward, FiMusic, FiCamera, FiEdit3, FiCode, FiImage, FiBookOpen, FiHeart, FiTrendingUp } from 'react-icons/fi';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface TalentFormData {
  name: string;
  description: string;
  category: string;
  experience: string;
  pricing: string;
  availability: string;
  main_image: string;
  contact: {
    phone: string;
    email: string;
    location: string;
  };
  services: string[];
  skills: string[];
  education: string;
  certifications: string[];
  portfolio_url: string;
  social_media: {
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
}

const categories = [
  { id: 'music', name: 'Music & Arts', icon: FiMusic },
  { id: 'photography', name: 'Photography', icon: FiCamera },
  { id: 'writing', name: 'Writing & Content', icon: FiEdit3 },
  { id: 'tech', name: 'Technology', icon: FiCode },
  { id: 'design', name: 'Design & Creative', icon: FiImage },
  { id: 'education', name: 'Education & Tutoring', icon: FiBookOpen },
  { id: 'fitness', name: 'Health & Fitness', icon: FiHeart },
  { id: 'business', name: 'Business & Consulting', icon: FiTrendingUp },
];

export default function AddTalentPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TalentFormData>({
    name: '',
    description: '',
    category: '',
    experience: '',
    pricing: '',
    availability: '',
    main_image: '',
    contact: {
      phone: '',
      email: '',
      location: '',
    },
    services: [],
    skills: [],
    education: '',
    certifications: [],
    portfolio_url: '',
    social_media: {},
  });

  const [newService, setNewService] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: value
      }
    }));
  };

  const addService = () => {
    if (newService.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('talents')
        .insert([
          {
            ...formData,
            society: 'worli',
            rating: 0,
            review_count: 0,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select();

      if (error) {
        console.error('Error adding talent:', error);
        alert('Error adding talent. Please try again.');
        return;
      }

      alert('Talent added successfully!');
      router.push('/worli/neighborhood-service-provider');
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding talent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Banner */}
      <div className="w-full h-40 bg-indigo-600 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">🌟 Add Your Talent</h1>
          <p className="text-indigo-100 text-lg">Share your skills with the Worli community</p>
        </div>
      </div>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
            
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiUser className="w-6 h-6 text-indigo-600" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Tell us about your talent, experience, and what you offer..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., 5 years, 2+ years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pricing *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pricing}
                    onChange={(e) => handleInputChange('pricing', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., ₹500/hour, ₹2000/session"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Weekdays 6-9 PM, Weekends"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.main_image}
                    onChange={(e) => handleInputChange('main_image', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://example.com/your-image.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiMapPin className="w-6 h-6 text-indigo-600" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contact.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contact.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location in Worli *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact.location}
                    onChange={(e) => handleContactChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Worli Naka, Worli Sea Face, Lower Parel"
                  />
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiAward className="w-6 h-6 text-indigo-600" />
                Services Offered
              </h2>
              
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Add a service you offer"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                  />
                  <button
                    type="button"
                    onClick={addService}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {formData.services.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.services.map((service, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {service}
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="text-indigo-500 hover:text-indigo-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Skills & Expertise</h2>
              
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Add a skill or expertise"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-green-500 hover:text-green-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Additional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Bachelor's in Music, Self-taught"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={formData.portfolio_url}
                    onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://your-portfolio.com"
                  />
                </div>
              </div>

              {/* Certifications */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications
                </label>
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Add a certification"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                    />
                    <button
                      type="button"
                      onClick={addCertification}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {formData.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"
                      >
                        {cert}
                        <button
                          type="button"
                          onClick={() => removeCertification(index)}
                          className="text-yellow-500 hover:text-yellow-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Social Media */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Media Links
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="url"
                    value={formData.social_media.instagram || ''}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Instagram URL"
                  />
                  <input
                    type="url"
                    value={formData.social_media.linkedin || ''}
                    onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="LinkedIn URL"
                  />
                  <input
                    type="url"
                    value={formData.social_media.website || ''}
                    onChange={(e) => handleSocialMediaChange('website', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Website URL"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <FiUpload className="w-4 h-4" />
                    Add My Talent
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 