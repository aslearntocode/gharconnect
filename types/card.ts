export interface Card {
  id: string;
  name: string;
  bank: string;
  image: string;
  apr: string;
  annualFee: string;
  joiningFee: string;
  rupay: boolean;
  feedback: {
    comment: string;
    rating: number;
    date: string;
  }[];
  additionalDetails?: {
    rewardsProgram?: string;
    welcomeBonus?: string;
    milestoneBenefits?: string[];
    airportLounge?: string;
    insuranceCover?: string[];
    movieBenefits?: string;
    diningPrivileges?: string[];
    minimumSpend?: string;
    creditLimit?: string;
    domesticTransactionFee?: string;
    internationalTransactionFee?: string;
    interestRate?: string;
    emiOptions?: string;
    additionalServices?: string;
    idealFor?: string[];
    notIdealFor?: string[];
    summary?: string;
    redemptionOptions?: string;
  };
  value?: number; // Added for calculator results
} 