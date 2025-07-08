// Test script to demonstrate free item functionality
// Run this in your browser console or as a Node.js script

const { createClient } = require('@supabase/supabase-js')

// Replace with your Supabase URL and anon key
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testFreeItem() {
  try {
    // Step 1: Create a test product with initial price
    console.log('Creating test product...')
    const { data: product, error: createError } = await supabase
      .from('marketplace_products')
      .insert({
        user_id: 'test-user-id',
        area: 'parel',
        title: 'Test Books Collection',
        description: 'Collection of novels and textbooks in good condition',
        price: 1500, // Initial price: ₹1,500
        category: 'Books',
        condition: 'Good',
        images: [],
        contact_phone: '9876543210',
        building_name: 'Test Building',
        is_active: true
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating product:', createError)
      return
    }

    console.log('Product created with ID:', product.id)
    console.log('Initial price:', product.price)

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Step 2: Update the price to 0 to make it free
    console.log('Updating price to make item free...')
    const { data: updatedProduct, error: updateError } = await supabase
      .from('marketplace_products')
      .update({ price: 0 }) // New price: ₹0 (Free!)
      .eq('id', product.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating product:', updateError)
      return
    }

    console.log('Price updated to:', updatedProduct.price)

    // Step 3: Check the price history
    console.log('Checking price history...')
    const { data: priceHistory, error: historyError } = await supabase
      .from('marketplace_price_history')
      .select('*')
      .eq('product_id', product.id)
      .order('changed_at', { ascending: false })

    if (historyError) {
      console.error('Error fetching price history:', historyError)
      return
    }

    console.log('Price history:', priceHistory)

    // Step 4: Fetch the product with price history to see how it appears in the marketplace
    const { data: productWithHistory, error: fetchError } = await supabase
      .from('marketplace_products')
      .select(`
        *,
        price_history:marketplace_price_history(
          old_price,
          new_price,
          changed_at
        )
      `)
      .eq('id', product.id)
      .single()

    if (fetchError) {
      console.error('Error fetching product with history:', fetchError)
      return
    }

    console.log('Product with price history:', productWithHistory)

    // Calculate price drop info
    const priceDrop = product.price - updatedProduct.price
    const priceDropPercentage = Math.round((priceDrop / product.price) * 100)
    
    console.log('\n=== FREE ITEM SUMMARY ===')
    console.log(`Original Price: ₹${product.price.toLocaleString()}`)
    console.log(`New Price: Free!`)
    console.log(`Price Drop: ₹${priceDrop.toLocaleString()}`)
    console.log(`Percentage Drop: ${priceDropPercentage}%`)
    console.log('==========================')

  } catch (error) {
    console.error('Test failed:', error)
  }
}

// Run the test
testFreeItem() 