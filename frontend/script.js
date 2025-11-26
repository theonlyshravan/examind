document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const greetingEl = document.getElementById('greeting');
    const loadingText = document.getElementById('loading-text');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // 1. Set Dynamic Greeting
    const hour = new Date().getHours();
    let greeting = "Good evening";
    if (hour < 12) greeting = "Good morning";
    else if (hour < 18) greeting = "Good afternoon";
    greetingEl.textContent = `${greeting}, how can I help?`;
    greetingEl.className = "text-3xl font-medium text-white mb-8 tracking-tight";

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    });

    // Event Listeners
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Search Function
    // 2. Updated Search Logic
    async function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        // Hide Hero, Show Loader
        // document.getElementById('hero-text')?.classList.add('hidden'); // Hero text removed in HTML
        document.getElementById('results-area').classList.add('hidden');
        document.getElementById('loading-state').classList.remove('hidden');

        // Multi-step Loader Animation
        const steps = ["Searching knowledge base...", "Reading sources...", "Synthesizing answer..."];
        let stepIndex = 0;
        const interval = setInterval(() => {
            loadingText.textContent = steps[stepIndex % steps.length];
            stepIndex++;
        }, 700);

        try {
            // Hardcode num_results to 10
            const encodedQuery = encodeURIComponent(query);
            const response = await fetch(`http://127.0.0.1:5000/search?query=${encodedQuery}&num_results=10`);
            const data = await response.json();

            clearInterval(interval);
            document.getElementById('loading-state').classList.add('hidden');

            if (data.results && data.results.length > 0) {
                renderLayout(data.results);
            } else {
                alert("No results found.");
            }

        } catch (error) {
            clearInterval(interval);
            document.getElementById('loading-state').classList.add('hidden');
            console.error('Search failed:', error);
            alert("Connection failed.");
        }
    }

    // Render Results
    // 3. New Render Logic
    function renderLayout(results) {
        const sourcesList = document.getElementById('sources-list');
        const bestAnswer = document.getElementById('best-answer');
        const resultsList = document.getElementById('results-list');

        sourcesList.innerHTML = '';
        bestAnswer.innerHTML = '';
        resultsList.innerHTML = '';

        // Render Sources
        results.forEach(res => {
            let domain = '';
            try {
                domain = new URL(res.url).hostname.replace('www.', '');
            } catch (e) {
                domain = res.url;
            }
            const pill = document.createElement('a');
            pill.href = res.url;
            pill.target = "_blank";
            pill.rel = "noopener noreferrer";
            pill.className = "flex-shrink-0 bg-surface border border-white/10 px-3 py-2 rounded-md text-xs text-slate-400 hover:text-white hover:border-indigo-500 transition-colors flex items-center gap-2";
            pill.innerHTML = `<img src="https://www.google.com/s2/favicons?domain=${domain}" class="w-3 h-3 opacity-70"> ${domain.substring(0, 15)}`;
            sourcesList.appendChild(pill);
        });

        // Render "Quick Answer"
        const topRes = results[0];
        let summary = topRes.snippet || topRes.summary || topRes.text?.substring(0, 300) + "..." || "No summary available.";

        // simple formatter: turn **text** into <b>text</b> and - into bullets with newlines
        summary = summary
            .replace(/\*\*(.*?)\*\*/g, '<b class="text-white">$1</b>')
            .replace(/(?:\r\n|\r|\n)/g, '<br>') // handle existing newlines
            .replace(/- /g, '<br>• ');       // handle bullet points

        bestAnswer.innerHTML = `
            <div class="prose prose-invert max-w-none">
                <p class="text-lg text-slate-300 leading-relaxed">${summary}</p>
                <div class="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                    <span class="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-full">✨ Quick Answer (Synthesized)</span>
                    <a href="${topRes.url}" target="_blank" rel="noopener noreferrer" class="text-xs text-slate-500 hover:text-white ml-auto">Read source -></a>
                </div>
            </div>
        `;

        // Render Vertical List (Rest of results)
        results.slice(1).forEach(res => {
            let domain = '';
            try {
                domain = new URL(res.url).hostname;
            } catch (e) {
                domain = res.url;
            }
            const item = document.createElement('div');
            item.innerHTML = `
                <a href="${res.url}" target="_blank" rel="noopener noreferrer" class="block group mb-6">
                    <div class="text-xs text-slate-500 mb-1 flex items-center gap-2">
                        <img src="https://www.google.com/s2/favicons?domain=${domain}" class="w-3 h-3 grayscale group-hover:grayscale-0">
                        ${domain}
                    </div>
                    <h4 class="text-base font-medium text-indigo-400 group-hover:underline mb-1">${escapeHtml(res.title)}</h4>
                    <p class="text-sm text-slate-400 line-clamp-2">${escapeHtml(res.snippet || "")}</p>
                </a>`;
            resultsList.appendChild(item);
        });

        document.getElementById('results-area').classList.remove('hidden');
        setTimeout(() => document.getElementById('results-area').classList.remove('opacity-0'), 50);
    }

    // Helper Functions
    function hideAllStates() {
        loadingState.classList.add('hidden');
        errorState.classList.add('hidden');
        emptyState.classList.add('hidden');
        resultsArea.classList.add('hidden');
        resultsArea.classList.add('opacity-0');
    }

    function showLoading() {
        loadingState.classList.remove('hidden');
        loadingState.classList.add('flex');
    }

    function hideLoading() {
        loadingState.classList.add('hidden');
        loadingState.classList.remove('flex');
    }

    function showError(msg) {
        errorState.classList.remove('hidden');
        errorMessage.textContent = msg || 'Could not connect to the search engine.';
    }

    function showEmpty() {
        emptyState.classList.remove('hidden');
    }

    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
