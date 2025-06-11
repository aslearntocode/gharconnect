import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Received data:', data)

    const {
      firebase_user_id,
      email,
      name,
      gender,
      has_college_letter
    } = data

    // First, get the user_id from the users table
    console.log('Fetching user with firebase_user_id:', firebase_user_id)
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_user_id', firebase_user_id)

    if (userError) {
      console.error('Error fetching user:', {
        error: userError,
        code: userError.code,
        message: userError.message,
        details: userError.details
      })
      return NextResponse.json(
        { error: 'Error fetching user', details: userError.message },
        { status: 500 }
      )
    }

    if (!userData || userData.length === 0) {
      if (!email) {
        return NextResponse.json(
          { error: 'User email is required' },
          { status: 400 }
        )
      }

      // Create a new user record if it doesn't exist
      console.log('User not found, creating new user record')
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          firebase_user_id,
          first_name: name?.split(' ')[0] || 'User', // Use first part of name or default
          last_name: name?.split(' ').slice(1).join(' ') || '', // Use rest of name or empty
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating user:', createError)
        return NextResponse.json(
          { error: 'Failed to create user', details: createError.message },
          { status: 500 }
        )
      }

      if (!newUser) {
        console.error('No user data returned after creation')
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        )
      }

      userData = [newUser]
    }

    const user_id = userData[0].id
    console.log('Using user_id:', user_id)

    // Insert the education loan data
    const insertData = {
      user_id,
      firebase_user_id,
      name,
      gender,
      has_college_letter,
      created_at: new Date().toISOString()
    }
    console.log('Inserting data:', insertData)

    const { data: result, error: insertError } = await supabase
      .from('education_loans')
      .insert(insertData)
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting education loan:', {
        error: insertError,
        code: insertError.code,
        message: insertError.message,
        details: insertError.details
      })
      return NextResponse.json(
        { error: 'Failed to save education loan data', details: insertError.message },
        { status: 500 }
      )
    }

    console.log('Successfully inserted data:', result)
    return NextResponse.json({
      success: true,
      id: result.id
    })
  } catch (error) {
    console.error('Unexpected error in education loan:', error)
    return NextResponse.json(
      { error: 'Failed to save education loan data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 