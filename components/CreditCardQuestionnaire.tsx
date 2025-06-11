'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { creditCards, type CreditCard } from '@/app/data/creditCards';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
  }[];
  multiple?: boolean;
  maxSelections?: number;
}

const questions: Question[] = [
  {
    id: 'score',
    text: 'What is your current credit score (approximate)?',
    options: [
      { value: '<600', label: 'Below 650' },
      { value: '650-699', label: '650 - 699' },
      { value: '700+', label: '700 - 749' },
      { value: '750+', label: '750 or above' }
    ]
  },
  {
    id: 'brands',
    text: 'Which credit card brands do you prefer? (Select up to 3)',
    options: [
      { value: 'hdfc', label: 'HDFC Bank' },
      { value: 'axis', label: 'Axis Bank' },
      { value: 'icici', label: 'ICICI Bank' },
      { value: 'hsbc', label: 'HSBC Bank' },
      { value: 'sbi', label: 'State Bank of India' },
      { value: 'bob', label: 'Bank of Baroda' },
      { value: 'yes', label: 'YES BANK' },
      { value: 'idfc', label: 'IDFC FIRST Bank' },
      { value: 'citi', label: 'Citi Bank' },
      { value: 'kotak', label: 'Kotak Mahindra Bank' },
      { value: 'standard', label: 'Standard Chartered Bank' },
      { value: 'indusind', label: 'IndusInd Bank' },
      { value: 'bank-of-maharashtra', label: 'Bank of Maharashtra' },
      { value: 'bank-of-rajasthan', label: 'Bank of Rajasthan' },
      { value: 'bank-of-india', label: 'Bank of India' }
    ],
    multiple: true,
    maxSelections: 3
  },
  {
    id: 'fee',
    text: 'What type of credit card fee structure are you looking for?',
    options: [
      { value: 'lifetime-free', label: 'Lifetime Free' },
      { value: 'low-fee', label: 'Annual Fee < ₹2,500' },
      { value: 'mid-fee', label: 'Annual Fee < ₹5,000' },
      { value: 'high-fee', label: 'Annual Fee > ₹5,000' }
    ]
  },
  {
    id: 'annual-spend',
    text: 'What is your expected annual credit card spend?',
    options: [
      { value: 'less-than-1L', label: 'Less than ₹1 Lakh' },
      { value: '1L-1.5L', label: '₹1 Lakh - ₹1.5 Lakhs' },
      { value: '1.5L-2.5L', label: '₹1.5 Lakhs - ₹2.5 Lakhs' },
      { value: '2.5L-5L', label: '₹2.5 Lakhs - ₹5 Lakhs' },
      { value: 'more-than-5L', label: 'More than ₹5 Lakhs' }
    ]
  },
  {
    id: 'spending',
    text: 'Select your top 2 spending categories',
    options: [
      { value: 'online', label: 'Online Shopping' },
      { value: 'travel', label: 'Travel' },
      { value: 'dining', label: 'Dining & Entertainment' },
      { value: 'fuel', label: 'Fuel' },
      { value: 'groceries', label: 'Groceries' }
    ],
    multiple: true,
    maxSelections: 2
  },
  {
    id: 'travel',
    text: 'How often do you travel? (Select up to 2)',
    options: [
      { value: 'never', label: 'Rarely' },
      { value: 'domestic', label: 'Domestic (Few times a year)' },
      { value: 'international', label: 'International (Few times a year)' },
      { value: 'frequent', label: 'Frequent Traveler' }
    ],
    multiple: true,
    maxSelections: 2
  },
  {
    id: 'preferences',
    text: 'What benefits are most important to you? (Select up to 2)',
    options: [
      { value: 'rewards', label: 'Reward Points' },
      { value: 'cashback', label: 'Cashback' },
      { value: 'domestic-lounge', label: 'Domestic Lounge Access' },
      { value: 'international-lounge', label: 'International Lounge Access' },
      { value: 'fuel-surcharge', label: 'Fuel Surcharge Waiver' },
      { value: 'travel', label: 'Travel Benefits' }
    ],
    multiple: true,
    maxSelections: 2
  }
];

export default function CreditCardQuestionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const handleAnswer = (value: string) => {
    const currentQ = questions[currentQuestion];
    
    // If answering the score question and score is less than 700, show results immediately
    if (currentQ.id === 'score' && (value === '<600' || value === '600-650' || value === '650-699')) {
      setAnswers(prev => ({
        ...prev,
        [currentQ.id]: value
      }));
      setShowResults(true);
      return;
    }

    if (currentQ.multiple) {
      const currentAnswers = (answers[currentQ.id] as string[]) || [];
      
      if (currentAnswers.includes(value)) {
        // Remove if already selected
        setAnswers(prev => ({
          ...prev,
          [currentQ.id]: currentAnswers.filter(v => v !== value)
        }));
      } else if (currentAnswers.length < (currentQ.maxSelections || 2)) {
        // Add if under max selections
        setAnswers(prev => ({
          ...prev,
          [currentQ.id]: [...currentAnswers, value]
        }));
      }
    } else {
      setAnswers(prev => ({
        ...prev,
        [currentQ.id]: value
      }));

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setShowResults(true);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const getRecommendedCards = () => {
    let recommendedCards = [...creditCards];
    const score = answers.score;

    // If score is less than 700, suggest secured cards and show analysis link
    if (score === '<600' || score === '600-650' || score === '650-699') {
      return { type: 'low-score', cards: [] };
    }

    // Filter based on brand preferences
    const selectedBrands = answers.brands as string[];
    if (selectedBrands && selectedBrands.length > 0) {
      recommendedCards = recommendedCards.filter(card => {
        const bankName = card.bank.toLowerCase();
        return selectedBrands.some(brand => bankName.includes(brand.toLowerCase()));
      });
    }

    // Filter based on fee structure
    if (answers.fee === 'lifetime-free') {
      recommendedCards = recommendedCards.filter(card => 
        card.categories.includes('lifetime-free')
      );
    } else if (answers.fee === 'low-fee') {
      recommendedCards = recommendedCards.filter(card => {
        const annualFee = parseInt(card.annualFee.replace(/[^0-9]/g, ''));
        return annualFee < 2500 && !card.categories.includes('lifetime-free');
      });
    } else if (answers.fee === 'mid-fee') {
      recommendedCards = recommendedCards.filter(card => {
        const annualFee = parseInt(card.annualFee.replace(/[^0-9]/g, ''));
        return annualFee >= 2500 && annualFee < 5000 && !card.categories.includes('lifetime-free');
      });
    } else if (answers.fee === 'high-fee') {
      recommendedCards = recommendedCards.filter(card => {
        const annualFee = parseInt(card.annualFee.replace(/[^0-9]/g, ''));
        return annualFee >= 5000 && !card.categories.includes('lifetime-free');
      });
    }

    // Filter based on annual spend
    if (answers['annual-spend'] === 'less-than-1L') {
      recommendedCards = recommendedCards.filter(card => 
        !card.categories.includes('premium') &&
        !card.categories.includes('ultra-premium')
      );
    } else if (answers['annual-spend'] === '1L-2.5L') {
      recommendedCards = recommendedCards.filter(card => 
        !card.categories.includes('ultra-premium')
      );
    } else if (answers['annual-spend'] === '2.5L-5L') {
      recommendedCards = recommendedCards.filter(card => 
        !card.categories.includes('ultra-premium') ||
        card.categories.includes('premium')
      );
    }

    // Filter based on spending categories
    const spendingCategories = answers.spending as string[];
    if (spendingCategories && spendingCategories.length > 0) {
      recommendedCards = recommendedCards.filter(card => {
        return spendingCategories.some(category => {
          if (category === 'online') {
            return card.categories.includes('shopping') || 
                   card.categories.includes('cashback') ||
                   card.categories.includes('lifestyle');
          } else if (category === 'travel') {
            return card.categories.includes('travel') || 
                   card.categories.includes('airlines') ||
                   card.categories.includes('hotels');
          } else if (category === 'fuel') {
            return card.categories.includes('fuel');
          } else if (category === 'dining') {
            return card.categories.includes('lifestyle') ||
                   card.categories.includes('rewards');
          } else if (category === 'groceries') {
            return card.categories.includes('cashback') ||
                   card.categories.includes('rewards');
          }
          return false;
        });
      });
    }

    // Filter based on travel frequency
    const travelFrequency = answers.travel as string[];
    if (travelFrequency && travelFrequency.length > 0) {
      recommendedCards = recommendedCards.filter(card => {
        return travelFrequency.some(freq => {
          if (freq === 'never') {
            return !card.categories.includes('international-travel') &&
                   !card.categories.includes('domestic-lounge');
          } else if (freq === 'domestic') {
            return card.categories.includes('domestic-lounge') ||
                   card.categories.includes('travel');
          } else if (freq === 'international' || freq === 'frequent') {
            return card.categories.includes('international-travel') ||
                   card.categories.includes('international-lounge') ||
                   card.categories.includes('airlines');
          }
          return false;
        });
      });
    }

    // Filter based on preferences (multiple selection)
    const preferences = answers.preferences as string[];
    const annualSpend = answers['annual-spend'];
    let kiwiCard: CreditCard | undefined = undefined;
    let idfcCard: CreditCard | undefined = undefined;
    let hsbcTravelOneCard: CreditCard | undefined = undefined;

    // Check for HSBC TravelOne card inclusion
    const hasLoungeAccess = preferences && (preferences.includes('domestic-lounge') || preferences.includes('international-lounge'));
    const hasTravelFrequency = answers.travel && (answers.travel as string[]).some(freq => ['domestic', 'international'].includes(freq));
    const hasHighSpend = answers['annual-spend'] === '2.5L-5L' || answers['annual-spend'] === 'more-than-5L';
    const hasHighScore = answers.score === '700+';
    const hasHighFee = answers.fee === 'mid-fee' || answers.fee === 'high-fee';

    if (hasHighScore && hasHighFee && hasLoungeAccess && hasTravelFrequency && hasHighSpend) {
      hsbcTravelOneCard = creditCards.find(card => 
        card.name.toLowerCase().includes('hsbc') && 
        card.name.toLowerCase().includes('travelone')
      );
      
      // Add to recommendations immediately if found
      if (hsbcTravelOneCard) {
        recommendedCards.unshift(hsbcTravelOneCard);
      }
    }

    // Check for IDFC card inclusion
    if (preferences && 
        preferences.some(pref => ['rewards', 'domestic-lounge', 'international-lounge', 'travel'].includes(pref))) {
      if (answers.fee === 'high-fee') {
        // For fees > 5K, suggest Mayura
        idfcCard = creditCards.find(card => 
          card.name.toLowerCase().includes('idfc') && 
          card.name.toLowerCase().includes('mayura')
        );
      } else if (answers.fee === 'mid-fee') {
        // For fees < 5K, suggest Ashva
        idfcCard = creditCards.find(card => 
          card.name.toLowerCase().includes('idfc') && 
          card.name.toLowerCase().includes('ashva')
        );
      }
    }

    if (preferences && preferences.includes('cashback') && (
      annualSpend === '1.5L-2.5L' || annualSpend === '2.5L-5L' || annualSpend === 'more-than-5L')
    ) {
      kiwiCard = creditCards.find(card => card.name.toLowerCase().includes('kiwi') && card.name.toLowerCase().includes('neon'));
    }

    if (preferences && preferences.length > 0) {
      recommendedCards = recommendedCards.filter(card => {
        return preferences.some(pref => {
          if (pref === 'rewards') return card.categories.includes('rewards');
          if (pref === 'cashback') return card.categories.includes('cashback');
          if (pref === 'domestic-lounge') return card.categories.includes('domestic-lounge');
          if (pref === 'international-lounge') return card.categories.includes('international-lounge');
          if (pref === 'fuel-surcharge') return card.categories.includes('fuel');
          if (pref === 'travel') return card.categories.includes('travel') || card.categories.includes('airlines') || card.categories.includes('hotels');
          return false;
        });
      });
    }

    // Always include Kiwi Credit Card if the above condition is met
    if (kiwiCard && !recommendedCards.some(card => card.id === kiwiCard!.id)) {
      recommendedCards.unshift(kiwiCard);
    }

    // Always include IDFC card if the above condition is met
    if (idfcCard && !recommendedCards.some(card => card.id === idfcCard!.id)) {
      recommendedCards.unshift(idfcCard);
    }

    // Exclude Axis IOCL Credit Card from all recommendations
    recommendedCards = recommendedCards.filter(card => card.name.toLowerCase() !== 'axis iocl credit card');

    // If 'fuel' is selected, prioritize fuel cards that also match other selected categories
    if (spendingCategories && spendingCategories.includes('fuel')) {
      // List of fuel cards (excluding Axis IOCL)
      const fuelCards = creditCards.filter(card =>
        card.categories.includes('fuel') && card.name.toLowerCase() !== 'axis iocl credit card'
      );
      // Find fuel cards that also match other selected categories (groceries, rewards, cashback, etc.)
      const otherCategories = [
        ...(spendingCategories.filter(cat => cat !== 'fuel') || []),
        ...(preferences || [])
      ];
      const prioritizedFuelCards = fuelCards.filter(card => {
        // Check if card matches any other selected category
        return otherCategories.some(cat => {
          if (cat === 'groceries') return card.categories.includes('groceries');
          if (cat === 'rewards') return card.categories.includes('rewards');
          if (cat === 'cashback') return card.categories.includes('cashback');
          if (cat === 'domestic-lounge') return card.categories.includes('domestic-lounge');
          if (cat === 'international-lounge') return card.categories.includes('international-lounge');
          if (cat === 'fuel-surcharge') return card.categories.includes('fuel');
          if (cat === 'travel') return card.categories.includes('travel') || card.categories.includes('airlines') || card.categories.includes('hotels');
          return false;
        });
      });
      // Add prioritized fuel cards to the top of the recommendations if not already present
      prioritizedFuelCards.forEach(fuelCard => {
        if (!recommendedCards.some(card => card.id === fuelCard.id)) {
          recommendedCards.unshift(fuelCard);
        }
      });
    }

    // If no cards match all criteria, return some general recommendations
    if (recommendedCards.length === 0) {
      recommendedCards = creditCards.filter(card => 
        !card.categories.includes('ultra-premium') &&
        !card.categories.includes('secured')
      );
    }

    // Ensure we have at least 3 cards by adding more general recommendations if needed
    if (recommendedCards.length < 3) {
      const additionalCards = creditCards
        .filter(card => 
          !recommendedCards.some(rec => rec.id === card.id) && // Don't add cards we already have
          !card.categories.includes('ultra-premium') &&
          !card.categories.includes('secured')
        )
        .slice(0, 3 - recommendedCards.length); // Only take as many as we need
      
      recommendedCards = [...recommendedCards, ...additionalCards];
    }

    // Sort by relevance and return top 3
    return { type: 'normal', cards: recommendedCards.slice(0, 3) };
  };

  const resetQuestionnaire = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const result = getRecommendedCards();
    if (
      answers.score === '<600' ||
      answers.score === '600-650' ||
      answers.score === '650-699'
    ) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Improve Your Credit Health</h2>
          <div className="mb-10 text-gray-700 text-lg text-center">
            Based on your credit score selection, we recommend the following next steps:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Secured Credit Cards Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col items-center p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.104.896-2 2-2h4a2 2 0 012 2v6a2 2 0 01-2 2h-4a2 2 0 01-2-2v-6zM6 11V7a2 2 0 012-2h4a2 2 0 012 2v4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secured Credit Cards</h3>
              <p className="text-gray-600 mb-4">Build or repair your credit score with cards backed by a fixed deposit. Approval is easier, and responsible use helps improve your score.</p>
              <a
                href="https://www.financialhealth.co.in/credit?category=secured"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
              >
                Explore Secured Cards
              </a>
            </div>
            {/* Credit Score Analysis Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col items-center p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Credit Score Analysis</h3>
              <p className="text-gray-600 mb-4">Analyze your credit score, get actionable tips, and learn how to improve your financial health for better credit opportunities.</p>
              <a
                href="https://www.financialhealth.co.in/credit-score-main/score"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
              >
                Analyze Your Credit Score
              </a>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Button 
              onClick={resetQuestionnaire}
              variant="outline"
              className="px-6"
            >
              Start Over
            </Button>
          </div>
        </div>
      );
    }
    const recommendedCards = result.cards;
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Credit Cards for You</h2>
        {recommendedCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCards.map((card, index) => (
              <div key={`${card.id}-${index}`} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <img src={card.image} alt={card.name} className="h-12 object-contain" />
                    <span className="text-sm font-medium text-gray-500">{card.bank}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.name}</h3>
                  <div className="space-y-2 mb-4 flex-grow">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Annual Fee: {card.annualFee}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      {card.categories.includes('lifetime-free') ? 'Lifetime Free' : 'Annual Fee Card'}
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.open(`/credit/${card.id}`, '_blank', 'noopener,noreferrer')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-auto"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Perfect Match Found</h3>
            <p className="text-gray-600 mb-6">We couldn't find any cards matching your exact criteria.</p>
            <Button 
              onClick={resetQuestionnaire}
              variant="outline"
              className="px-6"
            >
              Start Over
            </Button>
          </div>
        )}
        {recommendedCards.length > 0 && (
          <div className="mt-8 text-center space-y-4">
            <Button 
              onClick={() => {
                const cardIds = recommendedCards.map(card => card.id).join(',');
                router.push(`/credit/compare?cards=${cardIds}`);
              }}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Compare Recommended Cards
            </Button>
            <div>
              <Button 
                onClick={resetQuestionnaire}
                variant="outline"
                className="px-6"
              >
                Start Over
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const selectedAnswers = (answers[currentQ.id] as string[]) || [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Find Your Perfect Credit Card</h2>
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {currentQ.text}
        </h3>
        <div className="grid gap-3">
          {currentQ.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={`w-full flex items-center justify-between text-left px-3 md:px-4 py-3 md:py-4 border rounded-lg transition-colors ${
                selectedAnswers.includes(option.value)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <span className="text-sm md:text-base">{option.label}</span>
              {currentQ.multiple && selectedAnswers.includes(option.value) && (
                <span className="text-blue-500 text-lg md:text-base ml-2">✓</span>
              )}
            </button>
          ))}
        </div>
        {currentQ.multiple && (
          <div className="mt-4 text-sm text-gray-500">
            Selected {selectedAnswers.length} of {currentQ.maxSelections} categories
          </div>
        )}
      </div>

      {currentQ.multiple && (
        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            disabled={selectedAnswers.length === 0}
            className="px-6"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
} 