const { ipcRenderer } = require('electron');

    let categoryStates = {};
    let groupYouTube = true; // Default state for grouping YouTube items
    let lastAppData = {};    // Cache data so toggle button updates instantly

    // Toggle button event listener
    document.getElementById('toggle-yt').addEventListener('click', () => {
      groupYouTube = !groupYouTube;
      const btn = document.getElementById('toggle-yt');
      btn.innerText = `Group YouTube Items: ${groupYouTube ? 'ON' : 'OFF'}`;
      btn.style.background = groupYouTube ? '#3498db' : '#95a5a6';
      
      // Instantly re-render with the cached data
      renderDashboard(lastAppData);
    });

    function formatTime(seconds) {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      if (hrs > 0) return `${hrs}h ${mins}m`;
      if (mins > 0) return `${mins}m ${secs}s`;
      return `${secs}s`;
    }

    function getCategory(title) {
      const lower = title.toLowerCase();
      if (lower.includes('youtube')) return 'YouTube'; // Renamed from YouTube Videos
      if (lower.includes('visual studio code') || lower.includes('main.js')) return 'VS Code / Coding';
      if (lower.includes('chrome') || lower.includes('edge') || lower.includes('brave') || lower.includes('download') || lower.includes('gemini') || lower.includes('google') || lower.includes('search') || lower.includes('new tab') || lower.includes('history')) {
        return 'Web Browsing';
      }
      if (lower.includes('roblox') || lower.includes('game')) return 'Games';
      return 'Other Applications';
    }

    function renderDashboard(appData) {
      lastAppData = appData; // Save to cache
      const listContainer = document.getElementById('tracker-list');

      // Save open/closed folder states
      listContainer.querySelectorAll('details').forEach(det => {
        let catName = det.getAttribute('data-category');
        if (catName) {
          categoryStates[catName] = det.open;
        }
      });

      listContainer.innerHTML = '';

      let categories = {};

      for (const [title, seconds] of Object.entries(appData)) {
        let cat = getCategory(title);
        if (!categories[cat]) {
          categories[cat] = { total: 0, items: [] };
        }
        categories[cat].total += seconds;
        categories[cat].items.push({ name: title, time: seconds });
      }

      // Special handling for YouTube grouping feature
      if (categories['YouTube'] && groupYouTube) {
        let ytShortsTime = 0;
        let ytVideosTime = 0;
        let rawYtItems = categories['YouTube'].items;

        rawYtItems.forEach(item => {
          if (item.name.toLowerCase().includes('shorts')) {
            ytShortsTime += item.time;
          } else {
            ytVideosTime += item.time;
          }
        });

        // Rebuild YouTube sub-items based on toggle
        categories['YouTube'].items = [];
        if (ytVideosTime > 0) {
          categories['YouTube'].items.push({ name: 'YouTube Videos', time: ytVideosTime });
        }
        if (ytShortsTime > 0) {
          categories['YouTube'].items.push({ name: 'YouTube Shorts', time: ytShortsTime });
        }
      }

      for (const [catName, data] of Object.entries(categories)) {
        let details = document.createElement('details');
        details.setAttribute('data-category', catName);
        details.open = categoryStates[catName] !== undefined ? categoryStates[catName] : true;

        let summary = document.createElement('summary');
        summary.innerHTML = `
          <span><span class="arrow">▶</span> 📁 ${catName}</span>
          <span class="group-total">${formatTime(data.total)}</span>
        `;
        details.appendChild(summary);

        data.items.sort((a, b) => b.time - a.time);

        data.items.forEach(item => {
          let subItem = document.createElement('div');
          subItem.className = 'sub-item';
          subItem.innerHTML = `
            <span class="sub-name">${item.name}</span>
            <span class="sub-time">${formatTime(item.time)}</span>
          `;
          details.appendChild(subItem);
        });

        listContainer.appendChild(details);
      }
    }

    ipcRenderer.on('tracker-update', (event, appData) => {
      renderDashboard(appData);
    });