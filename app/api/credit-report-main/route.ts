import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get the URL parameters from the request
    const { searchParams } = new URL(request.url)
    
    // Log the incoming request parameters
    console.log('Incoming request parameters:', Object.fromEntries(searchParams.entries()))
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
    
    // Forward the request to the actual API
    const response = await fetch(
      `http://172.210.82.112:5001/analyze?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      }
    )

    // Clear the timeout
    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Proxy error details:', {
      name: error.name,
      message: error.message,
      cause: error.cause,
      stack: error.stack
    })

    // Handle specific error types
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timed out. Please try again.' },
        { status: 504 }
      )
    }

    if (error.message.includes('Failed to fetch')) {
      return NextResponse.json(
        { error: 'Unable to connect to the credit report service. Please try again later.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch credit report',
        details: error.message
      },
      { status: 500 }
    )
  }
} 