from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from exa_py import Exa   # ✅ correct import

app = Flask(__name__)
CORS(app)

# Load API key
EXA_API_KEY = os.getenv("EXA_API_KEY", "your_exa_api_key_here")
exa_client = Exa(EXA_API_KEY)   # ✅ corrected

@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("query")
    num_results = int(request.args.get("num_results", 5))

    if not query:
        return jsonify({"error": "No query provided"}), 400

    try:
        response = exa_client.search(query, num_results=num_results)
        results = [{"title": r.title, "url": r.url} for r in response.results]
        return jsonify({"results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
