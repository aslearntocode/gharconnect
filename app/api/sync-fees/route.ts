import { NextResponse } from 'next/server';
import { creditCards } from '@/app/data/creditCards';
import fs from 'fs';
import path from 'path';

interface CreditFee {
  card_name: string;
  joining_fee: number;
  annual_fee: number;
  annual_fee_waiver_criteria: number;
  is_lifetime_free: number;
}

export async function POST() {
  try {
    const fees: CreditFee[] = creditCards.map(card => {
      // Extract numeric values from fee strings (e.g., "₹2,500 + GST" -> 2500)
      const extractNumericValue = (feeStr: string): number => {
        if (!feeStr || feeStr === '₹0' || feeStr === 'NA') return 0;
        const match = feeStr.match(/₹([\d,]+)/);
        return match ? parseInt(match[1].replace(/,/g, '')) : 0;
      };

      // Extract waiver criteria from minimumSpend if available
      const extractWaiverCriteria = (card: any): number => {
        if (!card.additionalDetails?.minimumSpend) return 0;
        const match = card.additionalDetails.minimumSpend.match(/₹([\d,]+)/);
        return match ? parseInt(match[1].replace(/,/g, '')) : 0;
      };

      // Determine if card is lifetime free
      const isLifetimeFree = card.annualFee === '₹0' && card.joiningFee === '₹0' ? 1 : 0;

      return {
        card_name: card.name,
        joining_fee: extractNumericValue(card.joiningFee),
        annual_fee: extractNumericValue(card.annualFee),
        annual_fee_waiver_criteria: extractWaiverCriteria(card),
        is_lifetime_free: isLifetimeFree
      };
    });

    // Write to credit_fees.json
    const filePath = path.join(process.cwd(), 'credit_fees.json');
    fs.writeFileSync(filePath, JSON.stringify(fees, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error syncing fees:', error);
    return NextResponse.json({ success: false, error: 'Failed to sync fees' }, { status: 500 });
  }
} 