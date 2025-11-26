from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from exa_py import Exa
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Exa client with API key from environment variables
EXA_API_KEY = os.getenv("EXA_API_KEY")
exa_client = Exa(EXA_API_KEY)

@app.route("/search", methods=["GET"])
def search():
    """
    Handle search requests.
    Expects 'query' and optional 'num_results' in query parameters.
    Returns a JSON response with a synthesized best answer and a list of results.
    """
    query = request.args.get("query")
    num_results = int(request.args.get("num_results", 5))

    if not query:
        return jsonify({"error": "No query provided"}), 400

    try:
        # Perform a semantic search using the 'neural' type to retrieve relevant content.
        # We request both text and summary to generate a rich response.
        response = exa_client.search_and_contents(
            query,
            num_results=num_results,
            type="neural",
            text=True,
            summary=True
        )
        
        results = []
        # Attempt to extract a high-level summary or 'best answer' from the response.
        best_answer = getattr(response, "summary", None) or getattr(response, "best_answer", None)

        for r in response.results:
            # Determine the best available snippet: summary > text > snippet
            snippet = getattr(r, "summary", None) or getattr(r, "text", None) or getattr(r, "snippet", None)
            
            results.append({
                "title": getattr(r, "title", None),
                "url": getattr(r, "url", None),
                "snippet": snippet,
                "score": getattr(r, "score", None),
                "id": getattr(r, "id", None),
                "published_date": getattr(r, "published_date", None)
            })
            
        return jsonify({
            "best_answer": best_answer,
            "results": results
        })
    except Exception as e:
        # Log the error for debugging purposes
        print(f"Error during search: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
