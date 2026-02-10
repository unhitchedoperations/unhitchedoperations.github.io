// Simple example: keep footer year current
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

// Load card components dynamically
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-load-cards]').forEach(grid => {
    const cardsToLoad = grid.dataset.loadCards.split(',');
    const gridElement = grid;
    
    cardsToLoad.forEach(cardName => {
      fetch(`components/${cardName}-card.html`)
        .then(response => response.text())
        .then(html => {
          gridElement.insertAdjacentHTML('beforeend', html);
        })
        .catch(err => console.error('Card load failed:', cardName));
    });
  });
  
  // Footer year (existing)
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
