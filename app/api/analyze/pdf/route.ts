import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/app/config'

// Define the expected response type from the backend
interface CreditReportResponse {
  report_created_date: string;
  credit_score: number;
  total_accounts: number;
  active_accounts: Array<{
    account_type: string;
    lender: string;
    credit_limit: number;
    balance: number;
    date_opened: string;
  }>;
  credit_limit: number;
  closed_accounts: number;
  current_balance: number;
  overdue_accounts: Array<{
    account_type: string;
    lender: string;
    overdue_amount: number;
  }>;
  written_off_accounts: any[];
  enquiries: Array<{
    enquiry_date: string;
    enquiry_type: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('pdf_file')
    const password = formData.get('password')
    
    // Log all FormData entries
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`FormData field: ${key}, File name: ${value.name}, type: ${value.type}, size: ${value.size}`);
      } else {
        console.log(`FormData field: ${key}, Value: ${value}`);
      }
    }

    // Check if file exists and is a File object
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: 'No PDF file provided',
          details: 'Please ensure a PDF file is selected',
        },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type',
          details: 'File must be a PDF',
        },
        { status: 400 }
      )
    }

    // Create FormData for the backend request
    const apiFormData = new FormData()
    apiFormData.append('pdf_file', file)
    if (password) {
      apiFormData.append('password', password)
    }

    // Send request to backend
    const backendUrl = `${config.backendUrl}${config.apiEndpoints.parsePdf}`;
    console.log('Proxying PDF to:', backendUrl);
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: apiFormData,
    })
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('Parsed backend responseData:', responseData);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response format',
          details: 'The server returned an invalid response format (not JSON)',
          raw: responseText.slice(0, 300),
        },
        { status: 500 }
      );
    }
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: responseData.error || 'Failed to analyze PDF',
          details: responseData.details || responseData.message || 'The server was unable to process the PDF',
        },
        { status: response.status }
      );
    }
    // Accept both { data: ... } and plain string
    if (typeof responseData === 'string') {
      return NextResponse.json({ success: true, data: responseData });
    }
    if (!responseData.data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response format',
          details: 'The server returned an invalid data structure',
          raw: JSON.stringify(responseData).slice(0, 300),
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, data: responseData.data });
  } catch (error) {
    console.error('PDF analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze PDF',
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'This endpoint only accepts POST requests' },
    { status: 405 }
  )
} 