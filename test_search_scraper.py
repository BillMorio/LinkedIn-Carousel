import os
import json
from apify_client import ApifyClient

# Configuration
APIFY_TOKEN = os.getenv("APIFY_TOKEN")
if not APIFY_TOKEN:
    raise ValueError("APIFY_TOKEN environment variable not set")
client = ApifyClient(APIFY_TOKEN)

def run_search_scraper():
    print("🚀 Starting LinkedIn Search Scraper...")
    
    # Prepare the Actor input
    run_input = {
        "query": "OpenClaw",
        "maxResults": 20,
        "content_type": "documents",
        "sort_by": "date_posted"
    }

    # Run the Actor and wait for it to finish
    run = client.actor("powerai/linkedin-posts-search-scraper").call(run_input=run_input)

    # Fetch and print Actor results from the run's default dataset
    results = []
    print("📊 Fetching results...")
    for item in client.dataset(run["defaultDatasetId"]).iterate_items():
        results.append(item)
    
    # Save results to a file for analysis
    with open("search_scraper_analysis.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4)
        
    print(f"✅ Scrape complete. Saved {len(results)} items to search_scraper_analysis.json")

if __name__ == "__main__":
    run_search_scraper()
