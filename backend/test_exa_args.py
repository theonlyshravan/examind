from exa_py import Exa
import os
from dotenv import load_dotenv

load_dotenv()
exa = Exa(os.getenv("EXA_API_KEY"))

try:
    print("Testing type='neural'...")
    res = exa.search("test", type="neural", num_results=1)
    print("Success type='neural'")
except Exception as e:
    print(f"Error type='neural': {e}")

try:
    print("Testing type='semantic'...")
    res = exa.search("test", type="semantic", num_results=1)
    print("Success type='semantic'")
except Exception as e:
    print(f"Error type='semantic': {e}")

try:
    print("Testing use_autoprompt=True...")
    res = exa.search("test", use_autoprompt=True, num_results=1)
    print("Success use_autoprompt=True")
except Exception as e:
    print(f"Error use_autoprompt=True: {e}")
