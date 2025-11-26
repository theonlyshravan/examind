from exa_py import Exa
import os
from dotenv import load_dotenv

load_dotenv()
exa = Exa(os.getenv("EXA_API_KEY"))

try:
    print("Testing contents={'text': True, 'summary': True}...")
    res = exa.search_and_contents("test", type="neural", num_results=1, text=True, summary=True)
    print("Success search_and_contents")
    print(res.results[0].summary)
except Exception as e:
    print(f"Error search_and_contents: {e}")

try:
    print("Testing search with contents dict...")
    res = exa.search("test", type="neural", num_results=1, contents={"text": True, "summary": True})
    print("Success search with contents")
    # Check if we got summary
    if hasattr(res.results[0], 'summary'):
        print("Got summary via search")
    else:
        print("No summary via search")
except Exception as e:
    print(f"Error search with contents: {e}")
