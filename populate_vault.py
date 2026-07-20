import requests
import json

BASE_URL = "http://localhost:8000/api"

def populate_and_verify():
    print("Populating Vault with 'AI Agents' search...")
    try:
        # Simulate a search
        res = requests.post(f"{BASE_URL}/search", json={
            "query": "AI Agents",
            "maxResults": 2,
            "content_type": "",
            "sort_by": "date_posted"
        })
        print(f"Search Status: {res.status_code}")
        
        # Verify Keywords
        print("\nVerifying Keywords List...")
        res_kw = requests.get(f"{BASE_URL}/discovery/keywords")
        print(json.dumps(res_kw.json(), indent=2))
        
        if res_kw.json():
            print("\nSUCCESS: Keyword persisted to vault.")
        else:
            print("\nFAILURE: Keyword not persisted.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    populate_and_verify()
