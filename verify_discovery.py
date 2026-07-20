import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_discovery():
    print("Testing Discovery Keywords...")
    try:
        res = requests.get(f"{BASE_URL}/discovery/keywords")
        print(f"Keywords: {res.status_code}")
        print(json.dumps(res.json(), indent=2))
        
        if res.json():
            keyword = res.json()[0]['keyword']
            print(f"\nTesting Results retrieval for '{keyword}'...")
            res_results = requests.get(f"{BASE_URL}/discovery/results/{keyword}")
            print(f"Results Status: {res_results.status_code}")
            print(f"Results Count: {len(res_results.json())}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_discovery()
