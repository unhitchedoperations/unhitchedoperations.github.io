document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Load card components dynamically (with grid refresh fix)
  document.querySelectorAll('[data-load-cards]').forEach(grid => {
    const cardsToLoad = grid.dataset.loadCards.split(',');
    
    cardsToLoad.forEach((cardName, index) => {
      fetch(`components/${cardName}-card.html`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: components/${cardName}-card.html`);
          }
          return response.text();
        })
        .then(html => {
          grid.insertAdjacentHTML('beforeend', html);
          
          // Force grid re-layout after each card loads
          grid.style.display = 'none';
          grid.offsetHeight; // Trigger reflow
          grid.style.display = 'grid';
        })
        .catch(err => {
          console.error('Card load failed:', cardName, err);
        });
    });
  });
});
