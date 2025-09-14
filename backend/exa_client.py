import os
import requests
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
EXA_API_KEY = os.getenv("EXA_API_KEY")

BASE_URL = "https://api.exa.ai/search"

def search_exa(query: str, num_results: int = 5):
    """Send a query to Exa API and return search results."""
    headers = {
        "Authorization": f"Bearer {EXA_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "query": query,
        "numResults": num_results
    }

    response = requests.post(BASE_URL, headers=headers, json=data)

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error {response.status_code}: {response.text}")
