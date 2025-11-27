![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Exa API](https://img.shields.io/badge/Exa_API-Neural_Search-FF6B6B?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)


🔎 ExaMind – Semantic Search Engine (V1)

🚀 What is ExaMind?

ExaMind is a lightweight, intelligent semantic search engine designed to mimic modern AI search experiences like Perplexity. It leverages the Exa API for neural search capabilities, providing synthesized answers rather than just a list of links.

This Version 1 (MVP) is designed for academic submission and demonstration. It retrieves web content, extracts summaries, and displays a clean, AI-like answer along with sources—all without heavy frontend frameworks or build tools.

✨ Key Features

🔍 Semantic Search – Powered by Exa’s neural search engine for high-relevance results.

🧠 AI-style Quick Answer – Displays a synthetic summary fallback for immediate insights.

📚 Source Pills – Visual citations with favicons for credibility.

⚡ Fast Flask API – Lightweight backend with CORS enabled for smooth data fetching.

🎨 Perplexity-style UI – Modern, clean interface built with TailwindCSS.

📱 Fully Responsive – Optimized for both desktop and mobile devices.

🖥️ Zero Build Tools – Pure Vanilla JS and HTML; runs instantly without npm install.

🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| Python 3.x | Core backend logic |
| Flask & Flask-CORS | Exposes the /search endpoint |
| Exa API | Handles Semantic + Neural search & summarization |
| HTML5 | Structural frontend markup |
| TailwindCSS (CDN) | Styling and responsive UI design |
| Vanilla JS | DOM manipulation and API fetching |
| python-dotenv | Secure API key management |

📁 Project Structure

```
exa_search_engine/
│
├── backend/
│   ├── main.py              # Flask server entry point
│   ├── requirements.txt     # Python dependencies
│   ├── tests/               # API verification scripts
│   │   ├── test_exa_args.py
│   │   └── test_exa_contents.py
│   └── .env                 # API Key (Not in Git)
│
├── frontend/
│   ├── index.html           # Main UI
│   ├── script.js            # Frontend logic
│   └── assets/
│       └── logo.png         # Project branding
│
└── README.md
```


💻 How to Run

1️⃣ Backend Setup (Flask + Exa)

Navigate to the backend folder and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```


Create a .env file inside the /backend folder and add your key:

```
EXA_API_KEY=your_api_key_here
```


Run the Flask server:

```bash
python3 main.py
```


Your backend is now running at http://127.0.0.1:5000/search

2️⃣ Frontend Setup

Since there are no build tools (React/Vue/Angular), you can run the frontend instantly.

Simply open the file in your browser:

```bash
# On Mac/Linux
open frontend/index.html

# On Windows
start frontend/index.html
```


🌐 API Endpoint

The backend exposes a single GET endpoint for retrieving search results.

Endpoint: GET /search

Query Parameters:
| Parameter | Type | Description |
|---|---|---|
| query | string | The user's search term |
| num_results | int | Number of results to fetch (Default: 10) |

Example Request:

GET [http://127.0.0.1:5000/search?query=ai+agents&num_results=5](http://127.0.0.1:5000/search?query=ai+agents&num_results=5)


🧪 Testing Exa API

Included scripts allow you to verify the Exa API connection before running the full app.

```bash
cd backend/tests
python3 test_exa_args.py      # Verifies argument parsing
python3 test_exa_contents.py  # Verifies content retrieval
```


🚧 Future Enhancements (V2)

🔌 User Authentication – Secure login for personalized history.

📊 Search History – Save and organize past queries.

🤖 Local LLM Integration – Rewriting summaries using a local model for better synthesis.

☁ Cloud Deployment – Deploy backend to Render or Railway.

📄 License

MIT License © Shravan Kumar Satapathy

Feel free to fork this repository, submit PRs, or open issues to help improve ExaMind!
