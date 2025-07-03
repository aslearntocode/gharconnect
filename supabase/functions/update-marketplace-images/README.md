# Update Marketplace Images Edge Function

This Supabase Edge Function fetches all images from the `storage/product-images/{contact_phone}` folder and updates the `images` column in the `marketplace_products` table.

## How to Deploy

1. **Navigate to your Supabase project dashboard**
2. **Go to Edge Functions section**
3. **Create a new function** with the name `update-marketplace-images`
4. **Copy the code** from `index.ts` into the function editor
5. **Deploy the function**

## How to Use

### Via Supabase Dashboard (SQL Editor)

```sql
-- Call the function for a specific contact phone
SELECT
  net.http_post(
    url := 'https://your-project-ref.supabase.co/functions/v1/update-marketplace-images',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer your-anon-key"}',
    body := '{"contact_phone": "9876543210"}'
  );
```

### Via JavaScript/TypeScript

```javascript
const { data, error } = await supabase.functions.invoke('update-marketplace-images', {
  body: {
    contact_phone: '9876543210'
  }
})

if (error) {
  console.error('Error:', error)
} else {
  console.log('Success:', data)
}
```

### Via cURL

```bash
curl -X POST 'https://your-project-ref.supabase.co/functions/v1/update-marketplace-images' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"contact_phone": "9876543210"}'
```

## What the Function Does

1. **Receives a contact phone number** in the request body
2. **Cleans the phone number** (removes special characters)
3. **Lists all files** in the `product-images/{clean_phone}` folder
4. **Filters for image files** (.jpg, .jpeg, .png, .webp)
5. **Generates public URLs** for all images
6. **Updates the marketplace_products table** where:
   - `contact_phone` matches the provided number
   - `images` column is currently `null`
7. **Returns success response** with image count and URLs

## Response Format

### Success Response
```json
{
  "message": "Images updated successfully",
  "contact_phone": "9876543210",
  "images_count": 3,
  "image_urls": [
    "https://your-project.supabase.co/storage/v1/object/public/product-images/9876543210/image1.jpg",
    "https://your-project.supabase.co/storage/v1/object/public/product-images/9876543210/image2.png"
  ],
  "updated_products": [...]
}
```

### Error Response
```json
{
  "error": "Contact phone is required"
}
```

## Storage Structure

The function expects images to be stored in this structure:
```
product-images/
├── 9876543210/
│   ├── image1.jpg
│   ├── image2.png
│   └── image3.webp
├── 9876543211/
│   ├── photo1.jpg
│   └── photo2.png
```

## Notes

- Only updates products where `images` is currently `null`
- Supports common image formats: .jpg, .jpeg, .png, .webp
- Automatically cleans phone numbers by removing non-numeric characters
- Includes CORS headers for cross-origin requests
- Updates the `updated_at` timestamp when images are added 