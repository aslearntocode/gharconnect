# Yes Bank Credit Card Scraper

This script scrapes credit card information from Yes Bank's website and stores it in a Supabase database.

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Create a Supabase project and get your project URL and API key.

3. Create a `.env` file in the project root and add your Supabase credentials:
```
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
```

## Usage

Run the script:
```bash
python yes_bank_scraper.py
```

The script will:
1. Scrape credit card information from Yes Bank's website
2. Create a `credit_cards` table in your Supabase database if it doesn't exist
3. Store the scraped data in the table

## Data Structure

The script stores the following information for each credit card:
- Card name
- Card image URL
- Features list
- Benefits list

## Note

Make sure you have proper permissions to scrape the website and comply with Yes Bank's terms of service.
