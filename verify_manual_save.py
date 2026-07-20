import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_manual_save():
    keyword = "ManualTestKeyword"
    print(f"1. Searching for '{keyword}' (should NOT auto-save)...")
    requests.post(f"{BASE_URL}/search", json={
        "query": keyword,
        "maxResults": 1,
        "content_type": "",
        "sort_by": "date_posted"
    })
    
    res_kw = requests.get(f"{BASE_URL}/discovery/keywords")
    saved_keywords = [k['keyword'] for k in res_kw.json()]
    print(f"Current Vault: {saved_keywords}")
    
    if keyword in saved_keywords:
        print("FAILURE: Keyword auto-saved!")
        return

    print(f"\n2. Manually saving '{keyword}'...")
    res_save = requests.post(f"{BASE_URL}/discovery/save", json={"keyword": keyword})
    print(f"Save Status: {res_save.status_code}")
    
    res_kw_final = requests.get(f"{BASE_URL}/discovery/keywords")
    final_keywords = [k['keyword'] for k in res_kw_final.json()]
    print(f"Final Vault: {final_keywords}")
    
    if keyword in final_keywords:
        print("\nSUCCESS: Manual save verified.")
    else:
        print("\nFAILURE: Manual save did not persist.")

if __name__ == "__main__":
    test_manual_save()
