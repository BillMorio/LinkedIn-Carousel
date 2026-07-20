
import requests
import json

URL = "http://localhost:8000/api/search"
PAYLOAD = {
    "query": "OpenClaw",
    "content_type": "documents",
    "maxResults": 5,
    "sort_by": "relevance"
}

try:
    response = requests.post(URL, json=PAYLOAD)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
