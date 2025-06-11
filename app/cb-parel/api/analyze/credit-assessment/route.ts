import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/app/config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Use config if available, else fallback to env
    const baseUrl = config?.backendUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const backendUrl = baseUrl.replace(/\/$/, '') + '/assess-credit';
    console.log('Proxying to:', backendUrl);
    console.log('Request body:', body);
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response format',
          details: 'The server returned an invalid response format (not JSON)',
          raw: responseText.slice(0, 300)
        },
        { status: 500 }
      );
    }
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: responseData.error || 'Failed to assess credit',
          details: responseData.details || responseData.message || 'The server was unable to process the request',
        },
        { status: response.status }
      );
    }
    // Accept both { assessment: ... } and plain string
    if (typeof responseData === 'string') {
      return NextResponse.json({ success: true, assessment: responseData });
    }
    if (!responseData.assessment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response format',
          details: 'The server returned an invalid data structure',
          raw: JSON.stringify(responseData).slice(0, 300)
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, assessment: responseData.assessment });
  } catch (error) {
    console.error('Credit assessment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to assess credit',
        details: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'This endpoint only accepts POST requests' },
    { status: 405 }
  );
} 