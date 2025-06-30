'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { User } from 'firebase/auth'
import { getSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { FiCheck, FiUsers, FiBarChart } from 'react-icons/fi'
import LoginModal from '@/components/LoginModal'
import Head from 'next/head'

interface PollOption {
  id: string
  text: string
  votes: number
}

interface PollData {
  id: string
  question: string
  options: PollOption[]
  total_votes: number
  user_vote?: string
}

interface PollProps {
  location: string // e.g., 'parel', 'worli', 'andheri', etc.
}

export default function Poll({ location }: PollProps) {
  const [user, setUser] = useState<User | null>(null)
  const [pollData, setPollData] = useState<PollData>({
    id: `${location}-community-poll-1`,
    question: 'What is the main pain point in your area?',
    options: [
      { id: 'option1', text: 'Bad Walkability', votes: 0 },
      { id: 'option2', text: 'Bad Connectivity', votes: 0 },
      { id: 'option3', text: 'Bad Security', votes: 0 },
      { id: 'option4', text: 'Taxi Parking On Road', votes: 0 },
      { id: 'option5', text: 'Noise Levels post 9pm', votes: 0 },
      { id: 'option6', text: 'Fewer Eating Places', votes: 0 }
    ],
    total_votes: 0
  })
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLoadingPoll, setIsLoadingPoll] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      if (user) {
        checkUserVote(user.uid)
      }
    })

    // Fetch poll data on component mount
    fetchPollData()

    return () => unsubscribe()
  }, [location])

  const fetchPollData = async () => {
    try {
      setIsLoadingPoll(true)
      const supabase = await getSupabaseClient()
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .eq('id', `${location}-community-poll-1`)
        .eq('is_active', true)
        .single()

      if (data) {
        const options = data.options as PollOption[]
        const totalVotes = options.reduce((sum, option) => sum + option.votes, 0)
        
        setPollData({
          id: data.id,
          question: data.question,
          options: options,
          total_votes: totalVotes
        })
      } else {
        // If poll doesn't exist, create it
        await createDefaultPoll()
      }
    } catch (error) {
      console.error('Error fetching poll data:', error)
      // If poll doesn't exist, create it
      await createDefaultPoll()
    } finally {
      setIsLoadingPoll(false)
    }
  }

  const createDefaultPoll = async () => {
    try {
      const supabase = await getSupabaseClient()
      const defaultPoll = {
        id: `${location}-community-poll-1`,
        question: 'What is the main pain point in your area?',
        options: [
          { id: 'option1', text: 'Bad Walkability', votes: 0 },
          { id: 'option2', text: 'Bad Connectivity', votes: 0 },
          { id: 'option3', text: 'Bad Security', votes: 0 },
          { id: 'option4', text: 'Taxi Parking On Road', votes: 0 },
          { id: 'option5', text: 'Noise Levels post 9pm', votes: 0 },
          { id: 'option6', text: 'Fewer Eating Places', votes: 0 }
        ],
        location: location,
        is_active: true
      }

      const { data, error } = await supabase
        .from('polls')
        .insert(defaultPoll)
        .select()
        .single()

      if (data) {
        setPollData({
          id: data.id,
          question: data.question,
          options: data.options,
          total_votes: 0
        })
      }
    } catch (error) {
      console.error('Error creating default poll:', error)
    }
  }

  const checkUserVote = async (userId: string) => {
    try {
      const supabase = await getSupabaseClient()
      const { data, error } = await supabase
        .from('poll_votes')
        .select('option_id')
        .eq('poll_id', `${location}-community-poll-1`)
        .eq('user_id', userId)
        .single()

      if (data) {
        setHasVoted(true)
        setSelectedOption(data.option_id)
        setShowResults(true)
      }
    } catch (error) {
      console.error('Error checking user vote:', error)
    }
  }

  const updatePollVoteCounts = async () => {
    try {
      const supabase = await getSupabaseClient()
      const { data, error } = await supabase
        .from('poll_votes')
        .select('option_id')
        .eq('poll_id', `${location}-community-poll-1`)

      if (data) {
        const voteCounts: { [key: string]: number } = {}
        let totalVotes = 0

        data.forEach((vote) => {
          voteCounts[vote.option_id] = (voteCounts[vote.option_id] || 0) + 1
          totalVotes++
        })

        // Update the poll options with new vote counts
        const updatedOptions = pollData.options.map(option => ({
          ...option,
          votes: voteCounts[option.id] || 0
        }))

        setPollData(prev => ({
          ...prev,
          options: updatedOptions,
          total_votes: totalVotes
        }))

        // Update the poll in the database
        await supabase
          .from('polls')
          .update({ 
            options: updatedOptions,
            updated_at: new Date().toISOString()
          })
          .eq('id', `${location}-community-poll-1`)
      }
    } catch (error) {
      console.error('Error updating poll vote counts:', error)
    }
  }

  const handleVote = async () => {
    if (!user || !selectedOption) return

    setIsLoading(true)
    try {
      const supabase = await getSupabaseClient()
      const { error } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: `${location}-community-poll-1`,
          user_id: user.uid,
          option_id: selectedOption,
          created_at: new Date().toISOString()
        })

      if (error) throw error

      setHasVoted(true)
      setShowResults(true)
      await updatePollVoteCounts()
    } catch (error) {
      console.error('Error submitting vote:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptionClick = (optionId: string) => {
    if (!user) {
      setSelectedOption(optionId)
      setIsLoginModalOpen(true)
      return
    }
    setSelectedOption(optionId)
  }

  const handleSubmitVote = () => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }
    handleVote()
  }

  const getPercentage = (votes: number) => {
    if (pollData.total_votes === 0) return 0
    return Math.round((votes / pollData.total_votes) * 100)
  }

  if (isLoadingPoll) {
    return (
      <div className="bg-white py-4 md:py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-4 md:p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading poll...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Community Poll: {pollData.question} | GharConnect</title>
        <meta name="description" content={`Vote in the community poll for ${location}. Question: ${pollData.question}. Options: ${pollData.options.map(o => o.text).join(', ')}. See what your neighbors think!`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Question',
          'name': pollData.question,
          'text': pollData.question,
          'upvoteCount': pollData.total_votes,
          'suggestedAnswer': pollData.options.map(option => ({
            '@type': 'Answer',
            'text': option.text,
            'upvoteCount': option.votes
          }))
        }) }} />
      </Head>
      <section aria-label="Community Poll" itemScope itemType="https://schema.org/Question">
        <div className="bg-white py-4 md:py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-4 md:p-6">
              <div className="text-center mb-4">
                <FiBarChart className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2" itemProp="name">Community Poll: {pollData.question}</h2>
                <p className="text-base text-gray-600 mb-1" itemProp="text">{pollData.question}</p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <FiUsers className="w-4 h-4" />
                  <span>{pollData.total_votes} votes</span>
                </div>
              </div>

              {!hasVoted ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pollData.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleOptionClick(option.id)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                          selectedOption === option.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-25'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 text-sm">{option.text}</span>
                          {selectedOption === option.id && (
                            <FiCheck className="w-4 h-4 text-indigo-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="text-center pt-2">
                    <Button
                      onClick={handleSubmitVote}
                      disabled={!selectedOption || isLoading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isLoading ? 'Submitting...' : 'Submit Vote'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pollData.options.map((option) => {
                      const percentage = getPercentage(option.votes)
                      const isUserVote = selectedOption === option.id
                      
                      return (
                        <div
                          key={option.id}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            isUserVote ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900 text-sm">{option.text}</span>
                            {isUserVote && <FiCheck className="w-4 h-4 text-indigo-600" />}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                isUserVote ? 'bg-indigo-600' : 'bg-gray-400'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center mt-1 text-xs">
                            <span className="text-gray-600">{option.votes} votes</span>
                            <span className="font-semibold text-gray-900">{percentage}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="text-center pt-2">
                    <p className="text-indigo-600 font-medium text-sm">Thank you for voting!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoginModalOpen(false)
          // If user had selected an option before login, submit the vote
          if (selectedOption) {
            handleVote()
          }
        }}
      />
    </>
  )
} 