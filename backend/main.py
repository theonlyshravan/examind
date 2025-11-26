from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from exa_py import Exa   # ✅ correct import
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load API key
EXA_API_KEY = os.getenv("EXA_API_KEY")
exa_client = Exa(EXA_API_KEY)

@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("query")
    num_results = int(request.args.get("num_results", 5))

    if not query:
        return jsonify({"error": "No query provided"}), 400

    try:
        # Use search_and_contents to get text and summary
        # type="neural" for semantic search
        response = exa_client.search_and_contents(
            query,
            num_results=num_results,
            type="neural",
            text=True,
            summary=True
        )
        
        results = []
        # Try to get best answer from top-level response if available, otherwise None
        best_answer = getattr(response, "summary", None) or getattr(response, "best_answer", None)

        for r in response.results:
            # Prioritize summary, then text, then snippet
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
        print(f"Error during search: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
