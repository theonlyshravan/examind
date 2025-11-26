# ExaMind V1

ExaMind is a semantic search engine that uses the Exa API to provide rich, context-aware search results with a Perplexity-style interface. It features a Flask backend for semantic processing and a modern, responsive frontend.

## Quick Start

### Backend
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Create a `.env` file and add your Exa API key:
    ```
    EXA_API_KEY=your_api_key_here
    ```
4.  Run the server:
    ```bash
    python main.py
    ```

### Frontend
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Open `index.html` in your browser.

## Tech Stack
-   **Backend**: Python, Flask, Exa SDK (Semantic Search)
-   **Frontend**: HTML, JavaScript, TailwindCSS (via CDN)
