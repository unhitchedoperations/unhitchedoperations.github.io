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
  const closeBtnText = document.getElementById("modal-close-btn");
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

  if (closeBtnText) {
    closeBtnText.addEventListener("click", closeModal);
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

  // Rental Agreement Modal functionality
  const agreementModal = document.getElementById("agreement-modal");
  const agreementCloseBtn = document.getElementById("agreement-modal-close");

  if (agreementCloseBtn) {
    agreementCloseBtn.addEventListener("click", () => {
      agreementModal.style.display = "none";
      document.body.style.overflow = "";
    });
  }

  // Handle rental agreement modal overlay click
  if (agreementModal) {
    agreementModal.addEventListener("click", (e) => {
      if (e.target === agreementModal) {
        agreementModal.style.display = "none";
        document.body.style.overflow = "";
      }
    });
  }

  // Handle rental agreement links
  document.addEventListener("click", (e) => {
    if (e.target.textContent.includes("View Agreement") || e.target.closest('[onclick*="openAgreement"]')) {
      e.preventDefault();
      if (agreementModal) {
        agreementModal.style.display = "flex";
        document.body.style.overflow = "hidden";
      }
    }
  });

  // Load card components dynamically (with grid refresh fix)
  document.querySelectorAll('[data-load-cards]').forEach(grid => {
    const cardsToLoad = grid.dataset.loadCards.split(',');
    
    // Fetch all cards in parallel, but maintain order
    Promise.all(cardsToLoad.map(cardName => 
      fetch(`components/${cardName}-card.html`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: components/${cardName}-card.html`);
          }
          return response.text();
        })
        .then(html => ({ cardName, html }))
        .catch(err => {
          console.error('Card load failed:', cardName, err);
          return null;
        })
    ))
    .then(results => {
      // Insert all cards in the correct order
      results.forEach(item => {
        if (item && item.html) {
          grid.insertAdjacentHTML('beforeend', item.html);
        }
      });
      
      // Force grid re-layout after all cards load
      grid.style.display = 'none';
      grid.offsetHeight; // Trigger reflow
      grid.style.display = 'grid';
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
        const serviceTypeSelect = document.getElementById('service-type');
        const gravelFields = document.getElementById('gravel-fields');
        const dumpsterFields = document.getElementById('dumpster-fields');
        const productSelect = document.getElementById('product');
        const tonnageSelect = document.getElementById('tonnage');
        const durationSelect = document.getElementById('duration');
        const priceResult = document.getElementById('price-result');
        const calcNote = document.getElementById('calc-note');
        
        if (!serviceTypeSelect || !productSelect || !tonnageSelect || !priceResult) return;
        
        // Function to update fields and products based on service type
        function updateFields() {
          const serviceType = serviceTypeSelect.value;
          const serviceInfo = pricingData.serviceTypes[serviceType];
          
          if (serviceType === 'gravel') {
            // Show gravel fields, hide dumpster
            gravelFields.style.display = 'grid';
            dumpsterFields.style.display = 'none';
            
            // Update products dropdown for gravel only
            productSelect.innerHTML = `<option value="">Select product</option>`;
            Object.keys(pricingData.products).forEach(key => {
              const product = pricingData.products[key];
              if (product.type === 'gravel') {
                productSelect.innerHTML += `<option value="${key}">${product.name}</option>`;
              }
            });
            
            calcNote.innerHTML = '<strong>Includes:</strong> Material • Delivery • Tailgate spreading • Light raking';
            
          } else if (serviceType === 'dumpster') {
            // Hide gravel fields, show dumpster
            gravelFields.style.display = 'none';
            dumpsterFields.style.display = 'grid';
            
            calcNote.innerHTML = '<strong>Includes:</strong> 18-yard dumpster (14\' L x 7\' W x 5\' H) • 1 ton included • Drop-off & pick-up • Flexible scheduling';
          }
          
          calculatePrice();
        }
        
        // Calculate price function
        function calculatePrice() {
          const serviceType = serviceTypeSelect.value;
          let basePrice = 0;
          
          if (serviceType === 'gravel') {
            const tonnage = tonnageSelect.value;
            const productKey = productSelect.value;
            
            if (tonnage && productKey && pricingData.products[productKey]?.prices[tonnage]) {
              basePrice = pricingData.products[productKey].prices[tonnage];
            }
          } else if (serviceType === 'dumpster') {
            const duration = durationSelect.value;
            const dumpsterProduct = pricingData.products['dumpster'];
            
            if (duration && dumpsterProduct?.prices[duration]) {
              basePrice = dumpsterProduct.prices[duration];
            }
          }
          
          priceResult.textContent = `$${basePrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }
        
        // Event listeners
        serviceTypeSelect.addEventListener('change', updateFields);
        tonnageSelect.addEventListener('change', calculatePrice);
        productSelect.addEventListener('change', calculatePrice);
        durationSelect.addEventListener('change', calculatePrice);
        
        // Initial load
        updateFields();
      })
      .catch(err => {
        console.error('Pricing calculator failed:', err);
      });
  }
  
  // Load Google Reviews widget - Option 3: Enhanced Branded Style
  function loadGoogleReviewsWidget() {
    const container = document.getElementById('reviews-widget-container');
    if (!container) return;
    
    // Create an eye-catching branded review showcase
    const reviewsHTML = `
      <div style="background: linear-gradient(135deg, var(--brand-accent), #e06a11); border-radius: 8px; padding: 1.25rem; text-align: center; margin: 1rem 0; box-shadow: 0 6px 16px rgba(204, 92, 0, 0.25);">
        <div style="color: #111827; font-weight: 700; font-size: 1.2rem; margin-bottom: 0.5rem;">
          ⭐⭐⭐⭐⭐
        </div>
        <div style="color: #111827; font-size: 0.95rem; font-weight: 600; margin-bottom: 0.75rem;">
          Trusted by our customers
        </div>
        <div style="color: rgba(17, 24, 39, 0.9); font-size: 0.85rem; margin-bottom: 1rem; line-height: 1.4;">
          5.0 rating on Google <br>from real local customers
        </div>
        <a href="https://share.google/9Btdw8NdSloQwtBwG" target="_blank" style="display: inline-block; padding: 0.65rem 1.5rem; background: #111827; color: var(--brand-accent); border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 0.9rem; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2); transition: all 0.2s ease; border: 2px solid #111827;" onmouseover="this.style.background='rgba(17, 24, 39, 0.9)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(0, 0, 0, 0.3)';" onmouseout="this.style.background='#111827'; this.style.transform='translateY(0)'; this.style.boxShadow='0 3px 8px rgba(0, 0, 0, 0.2)';">
          Read reviews on Google →
        </a>
      </div>
    `;
    container.innerHTML = reviewsHTML;
  }
  
  initCalculator();
  loadGoogleReviewsWidget();
});
