from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Configuration

SOLR_URL = "http://localhost:8984/solr/dsjArticles/select"
ALLOWED_FIELDS = ["category", "title", "published", "author"]


@app.route("/search")
def search():
    query = request.args.get("q", "")
    field = request.args.get("field", "title")

    if not query or field not in ALLOWED_FIELDS:
        return jsonify({"error": "Invalid query or field"}), 400

    solr_query = {
        "q": f"{field}:{query}*",
        "wt": "json",
        "rows": 20,
    }

    try:
        response = requests.get(SOLR_URL, params=solr_query)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        print("Solr request failed:", e)
        return jsonify({"error": "Solr request failed"}), 500

if __name__ == "__main__":
    app.run(debug=True)
