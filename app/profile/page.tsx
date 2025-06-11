'use client';

import { useEffect, useState } from 'react';
import { ProfileEdit } from '@/components/ProfileEdit';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { creditCards } from '@/app/data/creditCards';
import { UserFeedback } from '@/app/data/creditCards';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userReviews, setUserReviews] = useState<UserFeedback[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Find all reviews by this user
        const reviews = creditCards.flatMap(card => 
          card.feedback.filter(review => review.userId === currentUser.uid)
        );
        setUserReviews(reviews);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <p>Please sign in to view your profile</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-6">
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <Link href="/" passHref>
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200 p-4">
              <h1 className="text-2xl font-bold">Profile Settings</h1>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={user.photoURL || '/default-avatar.png'}
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold">{user.displayName || 'User'}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <ProfileEdit />
                </div>

                {/* User Reviews Section */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Your Reviews</h3>
                  {userReviews.length === 0 ? (
                    <p className="text-gray-600">You haven't reviewed any credit cards yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {userReviews.map((review, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <Link 
                                href={`/credit/${review.cardId}`}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                {review.cardName}
                              </Link>
                              <div className="flex items-center mt-1">
                                <span className="text-yellow-500">
                                  {'★'.repeat(Math.floor(review.rating))}
                                  {'☆'.repeat(10 - Math.floor(review.rating))}
                                </span>
                                <span className="ml-2 text-gray-600">{review.rating}/10</span>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-2 text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                  <Link href="/" passHref>
                    <Button variant="outline">Cancel</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 