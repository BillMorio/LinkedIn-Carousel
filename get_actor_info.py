import os
from apify_client import ApifyClient

# Configuration
APIFY_TOKEN = os.getenv("APIFY_TOKEN")
if not APIFY_TOKEN:
    raise ValueError("APIFY_TOKEN environment variable not set")
client = ApifyClient(APIFY_TOKEN)

def get_actor_info():
    print("🚀 Fetching Actor Info...")
    actor = client.actor("powerai/linkedin-posts-search-scraper").get()
    print(actor)

if __name__ == "__main__":
    get_actor_info()
