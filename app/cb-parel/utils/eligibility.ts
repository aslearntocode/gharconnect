export interface EligibilityInput {
  monthlyIncome: number
  employmentType: 'salaried' | 'self-employed' | 'business'
  creditScore: number
  existingLoans: number
  currentEmi: number
  loanAmount: number
  loanTenure: number
}

export interface EligibilityResult {
  eligibleFor: 'incred' | 'banks' | 'none' | 'no_offers'
  reasons: string[]
}

export function checkEligibility(input: EligibilityInput): EligibilityResult {
  const reasons: string[] = []
  let eligibleFor: 'incred' | 'banks' | 'none' | 'no_offers' = 'none'

  // Helper function to add reasons
  const addReason = (reason: string) => reasons.push(reason)

  // Check base criteria that would make someone ineligible for any offer
  if (input.monthlyIncome < 20000) {
    return {
      eligibleFor: 'no_offers',
      reasons: ['Monthly income below ₹20,000']
    }
  }

  if (input.currentEmi >= input.monthlyIncome * 0.75) {
    return {
      eligibleFor: 'no_offers',
      reasons: ['Current EMI exceeds 75% of monthly income']
    }
  }

  if (input.creditScore < 680) {
    return {
      eligibleFor: 'no_offers',
      reasons: ['Credit score below 680']
    }
  }

  // Check InCred Finance eligibility
  const isIncredEligible = 
    input.monthlyIncome >= 25000 &&
    input.creditScore >= 650 &&
    input.creditScore < 750 &&
    input.currentEmi <= input.monthlyIncome * 0.5 &&
    input.loanAmount >= 25000 &&
    input.loanAmount <= 1500000 &&
    input.loanTenure >= 12 &&
    input.loanTenure <= 48

  if (isIncredEligible) {
    eligibleFor = 'incred'
  } else {
    if (input.monthlyIncome < 25000) addReason('Monthly income below ₹25,000 for InCred Finance')
    if (input.creditScore < 650) addReason('Credit score below 650 for InCred Finance')
    if (input.currentEmi > input.monthlyIncome * 0.5) addReason('Current EMI exceeds 50% of monthly income for InCred Finance')
    if (input.loanAmount < 25000 || input.loanAmount > 1500000) addReason('Loan amount outside InCred Finance range (₹25,000 - ₹15 lakhs)')
    if (input.loanTenure < 12 || input.loanTenure > 48) addReason('Loan tenure outside InCred Finance range (12-48 months)')
  }

  // Check bank eligibility
  const isBankEligible = 
    input.monthlyIncome >= 50000 &&
    input.creditScore >= 700 &&
    input.currentEmi <= input.monthlyIncome * 0.6 &&
    input.loanAmount >= 50000 &&
    input.loanAmount <= 4000000 &&
    input.loanTenure >= 12 &&
    input.loanTenure <= 60

  if (isBankEligible) {
    if (eligibleFor === 'none') {
      eligibleFor = 'banks'
    }
  } else {
    if (input.monthlyIncome < 50000) addReason('Monthly income below ₹50,000 for banks')
    if (input.creditScore < 700) addReason('Credit score below 700 for banks')
    if (input.currentEmi > input.monthlyIncome * 0.6) addReason('Current EMI exceeds 60% of monthly income for banks')
    if (input.loanAmount < 50000 || input.loanAmount > 4000000) addReason('Loan amount outside bank range (₹50,000 - ₹40 lakhs)')
    if (input.loanTenure < 12 || input.loanTenure > 60) addReason('Loan tenure outside bank range (12-60 months)')
  }

  return {
    eligibleFor,
    reasons
  }
} 