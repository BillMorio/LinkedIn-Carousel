from apify_client import ApifyClient
import json
import os
from dotenv import load_dotenv
from pathlib import Path

# Load env from backend/.env
env_path = Path(__file__).parent / "backend" / ".env"
load_dotenv(dotenv_path=env_path)

def analyze_scraper():
    client = ApifyClient(os.getenv("APIFY_TOKEN"))
    
    run_input = {
        "includeQuotePosts": True,
        "includeReposts": True,
        "maxComments": 5,
        "maxPosts": 10,
        "maxReactions": 5,
        "postedLimit": "week",
        "scrapeComments": True,
        "scrapeReactions": True,
        "targetUrls": [
            "https://www.linkedin.com/in/rhys-mckay-founder-luminaclipping/"
        ]
    }

    print("🚀 Starting Apify scraper run...")
    run = client.actor("harvestapi/linkedin-profile-posts").call(run_input=run_input)

    print(f"✅ Run finished. Fetching dataset items from {run['defaultDatasetId']}...")
    items = list(client.dataset(run["defaultDatasetId"]).iterate_items())

    output_path = "scraper_analysis.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=4)
    
    print(f"📁 Data saved to {output_path}")
    print(f"📊 Total items fetched: {len(items)}")
    
    if items:
        print("\n--- SAMPLE ITEM KEYS ---")
        print(list(items[0].keys()))
        print("\n--- SAMPLE CONTENT PREVIEW ---")
        print(items[0].get("text", "No text found")[:200])

if __name__ == "__main__":
    analyze_scraper()
