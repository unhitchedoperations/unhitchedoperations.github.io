document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Load card components dynamically
  document.querySelectorAll('[data-load-cards]').forEach(grid => {
    const cardsToLoad = grid.dataset.loadCards.split(',');
    
    cardsToLoad.forEach(cardName => {
      fetch(`components/${cardName}-card.html`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${cardName}-card.html`);
          }
          return response.text();
        })
        .then(html => {
          grid.insertAdjacentHTML('beforeend', html);
        })
        .catch(err => {
          console.error('Card load failed:', cardName, err);
        });
    });
  });
});
