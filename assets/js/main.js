document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Modal functionality
  const modal = document.getElementById("calculator-modal");
  const trigger = document.getElementById("calculator-trigger");
  const closeBtn = document.getElementById("modal-close");
  const overlay = document.querySelector(".modal-overlay");

  if (trigger) {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (overlay) {
    overlay.addEventListener("click", closeModal);
  }

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

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

  // Pricing calculator
  function initCalculator() {
    fetch('data/pricing.json')
      .then(response => {
        if (!response.ok) throw new Error('Pricing data not found');
        return response.json();
      })
      .then(pricingData => {
        const productSelect = document.getElementById('product');
        const tonnageSelect = document.getElementById('tonnage');
        const priceResult = document.getElementById('price-result');
        
        if (!productSelect || !tonnageSelect || !priceResult) return;
        
        // Populate products dropdown
        productSelect.innerHTML = '<option value="">Select product</option>';
        Object.keys(pricingData.products).forEach(key => {
          const product = pricingData.products[key];
          productSelect.innerHTML += `<option value="${key}">${product.name}</option>`;
        });
        
        // Calculate price function
        function calculatePrice() {
          const tonnage = tonnageSelect.value;
          const productKey = productSelect.value;
          
          if (tonnage && productKey && pricingData.products[productKey]?.prices[tonnage]) {
            const price = pricingData.products[productKey].prices[tonnage];
            priceResult.textContent = `$${price.toLocaleString()}`;
          } else {
            priceResult.textContent = '$0.00';
          }
        }
        
        // Event listeners
        tonnageSelect.addEventListener('change', calculatePrice);
        productSelect.addEventListener('change', calculatePrice);
      })
      .catch(err => {
        console.error('Pricing calculator failed:', err);
      });
  }
  
  initCalculator();
});
