// Test script to check database access
// Run with: node scripts/test-database-access.js

const { createClient } = require('@supabase/supabase-js')

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.log('Please set:')
  console.log('NEXT_PUBLIC_SUPABASE_URL')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDatabaseAccess() {
  console.log('Testing Supabase database access...')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseAnonKey.substring(0, 20) + '...')
  
  try {
    // Test 1: Basic connection
    console.log('\n1. Testing basic connection...')
    const { data: testData, error: testError } = await supabase
      .from('apartments')
      .select('id')
      .limit(1)
    
    if (testError) {
      console.error('❌ Basic connection failed:', testError)
    } else {
      console.log('✅ Basic connection successful')
      console.log('Sample data:', testData)
    }

    // Test 2: Apartments table
    console.log('\n2. Testing apartments table...')
    const { data: apartments, error: apartmentsError } = await supabase
      .from('apartments')
      .select('*')
      .limit(5)
    
    if (apartmentsError) {
      console.error('❌ Apartments query failed:', apartmentsError)
    } else {
      console.log('✅ Apartments query successful')
      console.log('Found', apartments?.length || 0, 'apartments')
    }

    // Test 3: Reviews table
    console.log('\n3. Testing reviews table...')
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .limit(5)
    
    if (reviewsError) {
      console.error('❌ Reviews query failed:', reviewsError)
    } else {
      console.log('✅ Reviews query successful')
      console.log('Found', reviews?.length || 0, 'reviews')
    }

    // Test 4: Property reviews table
    console.log('\n4. Testing property_reviews table...')
    const { data: propertyReviews, error: propertyReviewsError } = await supabase
      .from('property_reviews')
      .select('*')
      .limit(5)
    
    if (propertyReviewsError) {
      console.error('❌ Property reviews query failed:', propertyReviewsError)
    } else {
      console.log('✅ Property reviews query successful')
      console.log('Found', propertyReviews?.length || 0, 'property reviews')
    }

    // Test 5: Posts table (for social features)
    console.log('\n5. Testing posts table...')
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .limit(5)
    
    if (postsError) {
      console.error('❌ Posts query failed:', postsError)
    } else {
      console.log('✅ Posts query successful')
      console.log('Found', posts?.length || 0, 'posts')
    }

    // Test 6: Comments table
    console.log('\n6. Testing comments table...')
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .limit(5)
    
    if (commentsError) {
      console.error('❌ Comments query failed:', commentsError)
    } else {
      console.log('✅ Comments query successful')
      console.log('Found', comments?.length || 0, 'comments')
    }

    // Test 7: Insert a test review (anonymous)
    console.log('\n7. Testing anonymous review insertion...')
    const testReview = {
      user_id: `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_name: `Anonymous_${Math.random().toString(36).substr(2, 6)}`,
      card_id: 'test_vendor',
      card_name: 'Test Vendor',
      rating: 5,
      comment: 'Test review from script'
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('reviews')
      .insert([testReview])
      .select()
    
    if (insertError) {
      console.error('❌ Review insertion failed:', insertError)
    } else {
      console.log('✅ Review insertion successful')
      console.log('Inserted review ID:', insertData?.[0]?.id)
      
      // Clean up test review
      if (insertData?.[0]?.id) {
        await supabase
          .from('reviews')
          .delete()
          .eq('id', insertData[0].id)
        console.log('🧹 Cleaned up test review')
      }
    }

  } catch (error) {
    console.error('❌ Test failed with exception:', error)
  }
}

// Run the test
testDatabaseAccess()
  .then(() => {
    console.log('\n🏁 Database access test completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }) 