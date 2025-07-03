import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

serve(async (_req) => {
  console.log('Marketplace images edge function started');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  console.log('Env vars:', supabaseUrl, !!serviceRoleKey);
  
  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });
  console.log('Supabase client created');
  
  // Fetch marketplace products
  const { data: products, error: productError } = await client.from('marketplace_products').select('id, contact_phone, images');
  if (productError) {
    console.log('Marketplace products fetch error:', productError.message);
    return new Response(JSON.stringify({
      error: productError.message
    }), {
      status: 500
    });
  }
  
  if (!products) {
    console.log('No marketplace products found!');
    return new Response(JSON.stringify({
      error: 'No marketplace products found'
    }), {
      status: 404
    });
  }
  
  console.log('Fetched marketplace products:', products);
  let updatedCount = 0;
  
  for (const product of products) {
    console.log(`\n--- Processing product ${product.id} ---`);
    console.log(`Contact phone: ${product.contact_phone}`);
    console.log(`Current images: ${product.images}`);
    
    if (!product.contact_phone) {
      console.log(`Product ${product.id} has no contact_phone`);
      continue;
    }
    
    // Clean the phone number (remove special characters)
    const folderName = product.contact_phone.replace(/[^0-9]/g, '');
    console.log(`Looking for files in folder: ${folderName}`);
    
    // First, let's check if the bucket exists and list all folders
    const { data: allFolders, error: bucketError } = await client.storage.from('product-images').list('', {
      limit: 100
    });
    
    if (bucketError) {
      console.log(`Bucket list error:`, bucketError.message);
      continue;
    }
    
    console.log(`Available folders in bucket:`, allFolders?.map(f => f.name));
    
    const { data: files, error: filesError } = await client.storage.from('product-images').list(folderName, {
      limit: 100
    });
    
    if (filesError) {
      console.log(`Files list error for folder ${folderName}:`, filesError.message);
      continue;
    }
    
    if (!files || files.length === 0) {
      console.log(`No files found in folder ${folderName}`);
      continue;
    }
    
    console.log(`Found ${files.length} files in folder ${folderName}:`, files.map(f => f.name));
    
    // Filter for image files and generate URLs
    const imageFiles = files.filter((f) => f.name && (f.name.endsWith('.jpg') || f.name.endsWith('.jpeg') || f.name.endsWith('.png') || f.name.endsWith('.webp')));
    console.log(`Image files found:`, imageFiles.map(f => f.name));
    
    const urls = imageFiles.map((f) => {
      const url = client.storage.from('product-images').getPublicUrl(`${folderName}/${f.name}`).data.publicUrl;
      console.log(`Generated URL for ${f.name}: ${url}`);
      return url;
    });
    
    console.log(`Total URLs generated: ${urls.length}`);
    console.log(`URLs:`, urls);
    
    if (urls.length > 0) {
      console.log(`Updating product ${product.id} with images:`, urls);
      
      const { data: updateData, error: updateError } = await client.from('marketplace_products').update({
        images: urls,
        updated_at: new Date().toISOString()
      }).eq('id', product.id).select();
      
      if (updateError) {
        console.log(`Update error for product ${product.id}:`, updateError.message);
      } else {
        console.log(`Successfully updated product ${product.id}`);
        console.log(`Update result:`, updateData);
        updatedCount++;
      }
    } else {
      console.log(`No image URLs generated for product ${product.id}`);
    }
  }
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total products processed: ${products.length}`);
  console.log(`Products updated: ${updatedCount}`);
  
  return new Response(JSON.stringify({
    status: 'done',
    total_products: products.length,
    updated_products: updatedCount
  }), {
    status: 200
  });
}); 