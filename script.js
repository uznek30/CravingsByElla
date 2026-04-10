/* =========================================================
   CRAVINGS BY ELLA — script.js  (v2 — Full Cart System)
   ========================================================= */

'use strict';

/* ─────────────────────────────────────────────────────────
   1. DATA — Cookie catalogue with prices
   ───────────────────────────────────────────────────────── */
const COOKIES = [
  {
    id: 'red-velvet',
    name: 'Red Velvet Cheesecake',
    price: 65,
    image: 'images/red-velvet.jpg', // Palitan ito ng tamang file name
    badge: 'Fan Fave',
    badgeClass: '',
    desc: 'Mapula\'t masarap — classic red velvet meets creamy cheesecake filling.',
  },
  {
    id: 'matcha',
    name: 'Matcha Cheesecake',
    price: 65,
    image: 'images/Matcha Cheesecake.jpg',
    badge: 'New!',
    badgeClass: 'new-badge',
    desc: 'Para sa mga matcha lovers! Earthy green tea flavor na pinagsama sa creamy cheesecake.',
  },
  {
    id: 'midnight',
    name: 'Midnight Cheesecake',
    price: 65,
    image: 'images/Midnight Cheesecake.jpg',
    badge: 'Mystery',
    badgeClass: 'dark-badge',
    desc: 'Dark chocolate cookie na puno ng cheesecake goodness.',
  },
  {
    id: 'smores',
    name: "S'mores",
    price: 50,
    image: 'images/Smores.jpg',
    badge: null,
    badgeClass: '',
    desc: "Campfire vibes sa bawat kagat! Graham cracker base at toasted marshmallow.",
  },
  {
    id: 'og-classic',
    name: 'OG Classic',
    price: 60,
    image: 'images/Og.jpg',
    badge: 'OG',
    badgeClass: 'og-badge',
    desc: 'Walang kupas na classic. Buttery, chewy, at puno ng chocolate chips.',
  },
  {
    id: 'biscoff',
    name: 'Biscoff',
    price: 60,
    image: 'images/Biscoff.jpg',
    badge: 'Bestseller',
    badgeClass: '',
    desc: 'Caramelized, spiced, at absolutely irresistible Biscoff swirl.',
  },
  {
    id: 'double-choco',
    name: 'Double Chocolate Chip',
    price: 60,
    image: 'images/Double Chocolate Chip.jpg',
    badge: '🍫 Rich',
    badgeClass: 'choco-badge',
    desc: 'Double the chocolate, double the happiness para sa mga chocoholics.',
  },
]

/* ─────────────────────────────────────────────────────────
   2. CART STATE
   ───────────────────────────────────────────────────────── */
/** @type {{ id: string, name: string, price: number, emoji: string, qty: number }[]} */
let cart = [];

/* ─────────────────────────────────────────────────────────
   3. RENDER MENU CARDS
   ───────────────────────────────────────────────────────── */
function renderMenu() {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  grid.innerHTML = COOKIES.map(cookie => `
    <article class="cookie-card" id="card-${cookie.id}">
      <div class="card-img-wrap">
        <img src="${cookie.image}" alt="${cookie.name}" class="cookie-card-img">
        
        ${cookie.badge 
          ? `<div class="card-badge ${cookie.badgeClass}">${cookie.badge}</div>` 
          : ''}
      </div>
      <div class="card-body">
        <h3 class="card-name">${cookie.name}</h3>
        <p class="card-price">₱${cookie.price.toFixed(2)}</p>
        <p class="card-desc">${cookie.desc}</p>
        <div class="card-footer">
          <button 
            class="btn-add" 
            id="btn-${cookie.id}" 
            onclick="addToCart('${cookie.id}')"
          >Add to Cart 🛒</button>
        </div>
      </div>
    </article>
  `).join('');

}

/* ─────────────────────────────────────────────────────────
   4. CART OPERATIONS
   ───────────────────────────────────────────────────────── */

/**
 * Add a cookie to the cart (or increment qty if already there).
 * @param {string} cookieId
 */
function addToCart(cookieId) {
  const cookie = COOKIES.find(c => c.id === cookieId);
  if (!cookie) return;

  const existing = cart.find(item => item.id === cookieId);
  if (existing) {
    existing.qty++;
  } else {
    // SIGURADUHIN NA MAY image: cookie.image DITO
    cart.push({ 
      id: cookie.id, 
      name: cookie.name, 
      price: cookie.price, 
      image: cookie.image, // Ito ang kailangang idagdag
      qty: 1 
    });
  }

  updateCartUI();
  // ... (rest of the code)
}

/**
 * Change the quantity of a cart item by delta (+1 or -1).
 * Removes the item if qty reaches 0.
 * @param {string} cookieId
 * @param {number} delta
 */
function changeQty(cookieId, delta) {
  const item = cart.find(i => i.id === cookieId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(cookieId);
    return;
  }
  updateCartUI();
}

/**
 * Remove an item entirely from the cart.
 * @param {string} cookieId
 */
function removeFromCart(cookieId) {
  cart = cart.filter(i => i.id !== cookieId);
  updateCartUI();
  showToast('Item removed from your bag.');
}

/** Empty the entire cart. */
function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  updateCartUI();
  showToast('Cart cleared! Start fresh 🍪');
}

/* ─────────────────────────────────────────────────────────
   5. UI RENDERING
   ───────────────────────────────────────────────────────── */

/** Master function — call after any cart change to re-render everything. */
function updateCartUI() {
  renderCartItems();
  updateCartCount();
  updateTotals();
  toggleEmptyState();
}

/** Render the list of line-items inside the modal. */
function renderCartItems() {
  const list = document.getElementById('cart-items-list');
  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = '';
    return;
  }

  list.innerHTML = cart.map(item => `
    <li class="cart-item" id="item-${item.id}">
      <div class="item-thumb-container">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      </div>

      <div class="item-info">
        <p class="item-name" title="${item.name}">${item.name}</p>
        <p class="item-price-unit">₱${item.price.toFixed(2)} each</p>
      </div>

      <div class="item-controls">
        <span class="item-line-total">₱${(item.price * item.qty).toFixed(2)}</span>
        <div class="qty-group">
          <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}', +1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
      </div>
    </li>
  `).join('');
}

/** Update the navbar badge count. */
function updateCartCount() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = total;
}

/** Recalculate and display subtotal/total. */
function updateTotals() {
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const subtotalEl = document.getElementById('subtotal-val');
  const totalEl    = document.getElementById('total-val');
  if (subtotalEl) subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
  if (totalEl)    totalEl.textContent    = `₱${subtotal.toFixed(2)}`;

  // Update item count subtitle
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const subtitle  = document.getElementById('modal-subtitle');
  if (subtitle) subtitle.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''} in your bag`;
}

/** Show or hide the empty-state message and modal footer. */
function toggleEmptyState() {
  const emptyEl  = document.getElementById('cart-empty');
  const listEl   = document.getElementById('cart-items-list');
  const footerEl = document.getElementById('modal-footer');

  const isEmpty = cart.length === 0;
  if (emptyEl)  emptyEl.style.display  = isEmpty ? 'flex'  : 'none';
  if (listEl)   listEl.style.display   = isEmpty ? 'none'  : 'block';
  if (footerEl) footerEl.style.display = isEmpty ? 'none'  : 'flex';
}

/* ─────────────────────────────────────────────────────────
   6. MODAL OPEN / CLOSE
   ───────────────────────────────────────────────────────── */
function openModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  updateCartUI(); // always refresh on open
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ─────────────────────────────────────────────────────────
   7. CHECKOUT — WhatsApp & Messenger
   ───────────────────────────────────────────────────────── */

/** Build a human-readable order message. */
function buildOrderMessage() {
  if (cart.length === 0) return '';
  
  // Kukunin nito ang input mula sa textbox ng special request (dapat may id na 'order-note' sa HTML mo)
  const note = document.getElementById('order-note')?.value?.trim();
  
  const itemLines = cart.map(i => `• ${i.qty}x ${i.name} (₱${(i.price * i.qty).toFixed(2)})`).join('\n');
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  
  const noteSection = note ? `\n\n📝 Special Request: ${note}` : '';

  return (
    `✨ ORDER SUMMARY — Cravings By Ella ✨\n\n` +
    `${itemLines}\n\n` +
    `💰 TOTAL AMOUNT: ₱${total.toFixed(2)}` +
    noteSection +
    `\n\nThank you! 😊`
  );
}

function checkoutWhatsApp() {
  if (cart.length === 0) return;

  const msg = encodeURIComponent(buildOrderMessage());
  const phone = '639123456789'; // Palitan ng totoong number mo (dapat 63 sa unahan)

  // Sa WhatsApp, lalabas agad ang text sa typing area nila
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
}

function checkoutMessenger() {
  if (cart.length === 0) {
    showToast('Your bag is empty! 🍪');
    return;
  }

  const msg = buildOrderMessage();

  // 1. Automatic na iko-copy ang buong order details
  navigator.clipboard.writeText(msg).then(() => {
    // 2. Sasabihan ang user na i-paste na lang
    showToast('Order details copied! Paste & Send mo na lang sa Messenger. 📋');

    // 3. Bubukas ang Messenger sa bagong tab
    // Palitan ang 'CravingsByElla' ng actual username ng FB Page mo
    setTimeout(() => {
      window.open('https://m.me/CravingsByElla', '_blank');
    }, 1200);
  }).catch(err => {
    showToast('Failed to copy. Please try again.');
  });
}

/* ─────────────────────────────────────────────────────────
   8. MICRO-INTERACTIONS
   ───────────────────────────────────────────────────────── */
function animateCartButton() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  badge.classList.remove('bump');
  void badge.offsetWidth; // force reflow
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 400);
}

/** Briefly flash the "Add to Cart" button green as confirmation. */
function flashAddButton(cookieId) {
  const btn = document.getElementById(`btn-${cookieId}`);
  if (!btn) return;
  btn.classList.add('added');
  btn.textContent = 'Added! ✓';
  setTimeout(() => {
    btn.classList.remove('added');
    btn.textContent = 'Add to Cart 🛒';
  }, 1400);
}

/* ─────────────────────────────────────────────────────────
   9. TOAST NOTIFICATION
   ───────────────────────────────────────────────────────── */
let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  if (toastTimer) clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ─────────────────────────────────────────────────────────
   10. NAVBAR — scroll shadow
   ───────────────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ─────────────────────────────────────────────────────────
   11. HAMBURGER — mobile nav
   ───────────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});

navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  });
});

/* ─────────────────────────────────────────────────────────
   12. MODAL EVENT LISTENERS
   ───────────────────────────────────────────────────────── */
document.getElementById('cart-btn')?.addEventListener('click', openModal);
document.getElementById('modal-close')?.addEventListener('click', closeModal);
document.getElementById('clear-cart-btn')?.addEventListener('click', clearCart);
document.getElementById('checkout-wa')?.addEventListener('click', checkoutWhatsApp);
document.getElementById('checkout-msg')?.addEventListener('click', checkoutMessenger);

// Close on overlay background click
document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ─────────────────────────────────────────────────────────
   13. SMOOTH SCROLL
   ───────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = document.getElementById('navbar')?.offsetHeight ?? 72;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────────────────────────
   14. SCROLL-REVEAL for cards
   ───────────────────────────────────────────────────────── */
function initReveal() {
  const targets = document.querySelectorAll('.cookie-card, .testimonial-card, .about-inner');
  targets.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(32px)';
    el.style.transition = 'opacity .6s ease, transform .6s cubic-bezier(0.34,1.4,0.64,1)';
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 70);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  targets.forEach(el => io.observe(el));
}

/* ─────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────── */
function getGradient(cookieId) {
  return COOKIES.find(c => c.id === cookieId)?.gradient ?? '#FDF5E6';
}

/* ─────────────────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();          // build all product cards from data
  updateCartUI();        // set initial empty state
  initReveal();          // scroll-based fade-in
});