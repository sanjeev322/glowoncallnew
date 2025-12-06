// Global state
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentSection = 'home';
let bookedSlots = JSON.parse(localStorage.getItem('bookedSlots')) || {};
let previousSection = 'home';

// Define available services (everything else will show "Coming Soon")
const availableServices = [
    'hydrafacial',
    'dermaplaning-facial',
     'collagen-renewal',
     'vitamin-c-glow',
     'charcoal-detox',
     'golden-glow',
    'classic-lash',
    'combo-hydra-classic-derma',
    'combo-vitamin-c-classic-derma',
    'combo-charcoal-classic-derma',
    'combo-golden-classic-derma',
    'combo-collagen-classic-derma',
    'brow-tint',
    'eyebrow-lamination',
    'products',
    'hybrid-lash',
    'microblading',
    'lip-blush',
    'combo-microblading-lip-blush'
];

// Function to check if a service is available
function isServiceAvailable(serviceId) {
    return availableServices.includes(serviceId);
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
    populateServiceSections();
    populateHomepageServices();
    setupEventListeners();
    setupFilterButtons();
    setupModernFilters();
    setupMobileMenu();
    setupCarouselAutoHide();

    // Initialize with facial services (default active filter)
    populateFilteredServices('facials');

    // Setup product filter buttons
    setupProductFilterButtons();
});

// Event Listeners
function setupEventListeners() {
    // Search functionality for desktop
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Search functionality for mobile is handled in setupMobileMenu

    // Copy coupon codes
    document.addEventListener('click', function(e) {
        if (e.target.classList && (e.target.classList.contains('copy-btn') || (e.target.parentElement && e.target.parentElement.classList.contains('copy-btn')))) {
            const couponElement = e.target.closest('.coupon-code');
            if (couponElement) {
                const strongElement = couponElement.querySelector('strong');
                if (strongElement) {
                    copyToClipboard(strongElement.textContent);
                }
            }
        }
    });

    // Checkout button
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('checkout-btn')) {
            handleCheckout();
        }
    });

    // Book Now button
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('cta-button') || e.target.closest('.cta-button')) {
            showSection('services');
        }
    });
}

// Setup modern filter buttons
function setupModernFilters() {
    const modernFilterBtns = document.querySelectorAll('.modern-filter-btn');
    modernFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all modern filter buttons
            modernFilterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get category and populate services
            const category = this.dataset.category;
            populateFilteredServices(category);
        });
    });
}

// Navigation functions
function showSection(sectionId) {
    // Store previous section for back navigation
    if (currentSection !== sectionId) {
        previousSection = currentSection;
    }
    
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // If showing products section, load default category
        if (sectionId === 'products') {
            populateProductsSection('hair-products');
        }
    }
    
    // Update bottom navigation
    updateBottomNav(sectionId);
}

function goBack() {
    showSection(previousSection);
}

function showCategory(categoryId) {
    showSection(categoryId);
}

function updateBottomNav(activeSection) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`.nav-item[onclick*="${activeSection}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
}

// Populate homepage featured services
function populateHomepageServices() {
    const container = document.getElementById('featured-services-container');
    if (!container) return;
    
    // Get top services from each category
    const topServices = [
        servicesData.facials[0], // HydraFacial
        servicesData.facials[3], // Korean Glass Skin
        servicesData['lash-extensions'][0], // Classic Lash
        servicesData.combos[0] // Top combo
    ];
    
    container.innerHTML = topServices.map(service => createFeaturedServiceCard(service)).join('');
}

function createFeaturedServiceCard(service) {
    const discountPercent = Math.round((1 - service.discountedPrice/service.originalPrice) * 100);
    
    return `
        <div class="featured-service-card">
            <div class="featured-card-image">
                <img src="${service.image}" alt="${service.name}" loading="lazy" />
                <div class="featured-service-label">${service.category.charAt(0).toUpperCase() + service.category.slice(1)}</div>
                ${discountPercent > 0 ? `<div class="featured-discount-badge">${discountPercent}% OFF</div>` : ''}
            </div>
            <div class="featured-card-content">
                <h3 class="featured-card-title">${service.name}</h3>
                <div class="featured-card-details">
                    <div class="featured-duration">
                        <i class="fas fa-clock"></i>
                        <span>${service.duration} mins</span>
                    </div>
                    <div class="featured-pricing">
                        <span class="featured-current-price">₹${service.discountedPrice}</span>
                        ${service.originalPrice !== service.discountedPrice ? 
                            `<span class="featured-original-price">₹${service.originalPrice}</span>` : ''}
                    </div>
                </div>
                <div class="featured-card-actions">
                    <button class="featured-view-btn" onclick="showServiceDetail('${service.id}')">
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                    <button class="featured-add-btn" onclick="addToCart('${service.id}')">
                        <i class="fas fa-plus"></i>
                        Add
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Populate service sections
function populateServiceSections() {
    populateServiceCategory('facials');
    populateServiceCategory('lash-extensions');
    populateServiceCategory('eyebrows');
    populateServiceCategory('other-services');
    populateServiceCategory('combos');
}

function populateServiceCategory(categoryId) {
    const container = document.getElementById(`${categoryId}-content`);
    if (!container) return;
    
    const services = getServicesByCategory(categoryId);
    
    if (services.length === 0) {
        container.innerHTML = '<p class="no-services">No services available in this category.</p>';
        return;
    }
    
    container.innerHTML = services.map(service => createServiceCard(service)).join('');
}

function createServiceCard(service) {
    const discount = service.originalPrice - service.discountedPrice;
    const discountPercent = Math.round((discount / service.originalPrice) * 100);
    const isAvailable = isServiceAvailable(service.id);
    
    return `
        <div class="service-card-wrapper ${!isAvailable ? 'coming-soon-card' : ''}">
            <div class="service-card-image">
                <img src="${service.image}" alt="${service.name}" loading="lazy" />
                ${service.isAddon ? '<div class="service-badge addon">ADD ON</div>' : ''}
                ${service.services ? '<div class="service-badge combo">COMBO</div>' : ''}
                ${discountPercent > 0 ? `<div class="discount-badge">${discountPercent}% OFF</div>` : ''}
                ${!isAvailable ? '<div class="coming-soon-overlay">COMING SOON</div>' : ''}
            </div>
            
            <div class="service-card-content">
                <div class="service-card-header">
                    <h3 class="service-card-title">${service.name}</h3>
                    <p class="service-card-description">${service.description}</p>
                    ${service.services ? `<div class="combo-services">Includes: ${service.services.join(' + ')}</div>` : ''}
                </div>
                
                <div class="service-card-details">
                    <div class="service-duration-card">
                        <i class="fas fa-clock"></i>
                        <span>${service.duration} mins</span>
                    </div>
                    <div class="service-card-pricing">
                        <span class="service-current-price">₹${service.discountedPrice}</span>
                        ${service.originalPrice !== service.discountedPrice ? 
                            `<span class="service-original-price">₹${service.originalPrice}</span>` : ''}
                    </div>
                </div>
                
                <div class="service-card-actions">
                    <button class="service-view-btn" onclick="showServiceDetail('${service.id}')" ${!isAvailable ? 'disabled' : ''}>
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                    <button class="service-add-btn" onclick="addToCart('${service.id}')" ${!isAvailable ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileNavCenter = document.getElementById('mobileNavCenter');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const body = document.body;
    
    if (mobileNavCenter && mobileToggle) {
        const isActive = mobileNavCenter.classList.contains('active');
        
        mobileNavCenter.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        
        // Toggle scroll lock and ARIA attributes
        if (!isActive) {
            body.classList.add('menu-open');
            mobileToggle.setAttribute('aria-expanded', 'true');
            mobileToggle.setAttribute('aria-controls', 'mobileNavCenter');
            
            // Focus first interactive element in menu
            const firstInput = mobileNavCenter.querySelector('input, button, a');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        } else {
            body.classList.remove('menu-open');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.focus();
        }
    }
}

// Setup mobile menu functionality
function setupMobileMenu() {
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileNavCenter = document.getElementById('mobileNavCenter');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (mobileNavCenter && mobileToggle && 
            !mobileNavCenter.contains(e.target) && 
            !mobileToggle.contains(e.target) && 
            mobileNavCenter.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
    
    // Close mobile menu when navigating
    document.addEventListener('click', function(e) {
        if (e.target.closest('.mobile-cta-button, .mobile-phone-btn, .mobile-whatsapp-btn')) {
            const mobileNavCenter = document.getElementById('mobileNavCenter');
            
            if (mobileNavCenter && mobileNavCenter.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
    
    // Keyboard accessibility - close menu on Escape
    document.addEventListener('keydown', function(e) {
        const mobileNavCenter = document.getElementById('mobileNavCenter');
        if (e.key === 'Escape' && mobileNavCenter && mobileNavCenter.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
    
    // Focus trap for mobile menu
    document.addEventListener('keydown', function(e) {
        const mobileNavCenter = document.getElementById('mobileNavCenter');
        if (!mobileNavCenter || !mobileNavCenter.classList.contains('active')) return;
        
        if (e.key === 'Tab') {
            const focusableElements = mobileNavCenter.querySelectorAll(
                'input, button, a, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
    
    // Setup mobile search functionality
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', handleSearch);
    }
}

// Enhanced Scrolling functionality for Featured Services
function scrollServices(direction) {
    const container = document.getElementById('featured-services-container');
    if (!container) return;
    
    const cardWidth = container.querySelector('.modern-service-card')?.offsetWidth || 220;
    const gap = 16;
    const scrollAmount = cardWidth + gap;
    
    if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// Setup carousel auto-hide navigation on mobile
function setupCarouselAutoHide() {
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const container = document.getElementById('featured-services-container');
    
    if (!container || !prevBtn || !nextBtn) return;
    
    function updateNavigationVisibility() {
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        // Hide navigation entirely if no scrollable content
        if (maxScroll <= 0) {
            prevBtn.classList.add('hidden');
            nextBtn.classList.add('hidden');
            prevBtn.setAttribute('aria-hidden', 'true');
            nextBtn.setAttribute('aria-hidden', 'true');
            return;
        } else {
            prevBtn.classList.remove('hidden');
            nextBtn.classList.remove('hidden');
            prevBtn.setAttribute('aria-hidden', 'false');
            nextBtn.setAttribute('aria-hidden', 'false');
        }
        
        // Update navigation buttons based on scroll position
        const atStart = scrollLeft <= 0;
        const atEnd = scrollLeft >= maxScroll - 5;
        
        prevBtn.style.opacity = atStart ? '0.5' : '1';
        prevBtn.style.pointerEvents = atStart ? 'none' : 'auto';
        prevBtn.setAttribute('aria-disabled', atStart.toString());
        
        nextBtn.style.opacity = atEnd ? '0.5' : '1';
        nextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
        nextBtn.setAttribute('aria-disabled', atEnd.toString());
    }
    
    container.addEventListener('scroll', updateNavigationVisibility);
    
    // Update on resize to handle responsive changes
    window.addEventListener('resize', updateNavigationVisibility);
    
    // Initialize navigation visibility
    setTimeout(updateNavigationVisibility, 100);
}

// Enhanced filter functionality
function setupFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons in the same container
            const container = this.closest('.section, .service-filters, .product-filters');
            if (container) {
                container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            } else {
                filterBtns.forEach(b => b.classList.remove('active'));
            }
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get category and populate services
            const category = this.dataset.category;
            populateFilteredServices(category);
        });
    });
}

// Product filter setup
function setupProductFilterButtons() {
    const productFilterBtns = document.querySelectorAll('#products .filter-btn');
    productFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from product filter buttons
            productFilterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get category and populate products
            const category = this.dataset.category;
            populateProductsSection(category);
        });
    });
}

function populateFilteredServices(category) {
    const container = document.getElementById('featured-services-container');
    const services = getServicesByCategory(category);
    
    if (services.length === 0) {
        container.innerHTML = '<p class="no-services">No services available in this category.</p>';
        return;
    }
    
    container.innerHTML = services.slice(0, 6).map(service => createFeaturedServiceCard(service)).join('');
    
    // Reset scroll position and update navigation visibility
    container.scrollLeft = 0;
    setTimeout(() => {
        const event = new Event('scroll');
        container.dispatchEvent(event);
    }, 100);
}

// Product category functions
function showProductCategory(category) {
    showSection('products');
    
    // Update active filter button
    const filterBtns = document.querySelectorAll('#products .filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    filterBtns.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    populateProductsSection(category);
}

function populateProductsSection(category) {
    const container = document.getElementById('products-content');
    const products = getServicesByCategory(category);
    
    if (products.length === 0) {
        container.innerHTML = '<p class="no-services">No products available in this category.</p>';
        return;
    }
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Create product card for products section
function createProductCard(product) {
    const discount = product.originalPrice !== product.discountedPrice 
        ? Math.round((1 - product.discountedPrice/product.originalPrice) * 100) 
        : 0;
    
    // All products show as coming soon based on requirements
    const isProductCategory = ['hair-products', 'body-products', 'face-products'].includes(product.category);
    const isComingSoon = isProductCategory;
    
    return `
        <div class="service-card ${isComingSoon ? 'coming-soon-card' : ''}">
            <div class="service-card-image">
                <img src="${product.image}" alt="${product.name}" />
                <div class="service-label">${product.category.toUpperCase().replace('-', ' ')}</div>
                ${discount > 0 ? `<div class="discount-badge">${discount}% OFF</div>` : ''}
                ${isComingSoon ? '<div class="coming-soon-overlay">COMING SOON</div>' : ''}
            </div>
            <div class="service-card-content">
                <div class="service-card-header">
                    <h3 class="service-card-title">${product.name}</h3>
                    <p class="service-card-description">${product.description}</p>
                    ${product.ingredients ? `<div class="product-ingredients"><strong>Ingredients:</strong> ${product.ingredients}</div>` : ''}
                    ${product.usage ? `<div class="product-usage"><strong>How to use:</strong> ${product.usage}</div>` : ''}
                </div>
                
                <div class="service-card-details">
                    <div class="service-card-pricing">
                        <span class="service-current-price">₹${product.discountedPrice}</span>
                        ${product.originalPrice !== product.discountedPrice ? 
                            `<span class="service-original-price">₹${product.originalPrice}</span>` : ''}
                    </div>
                </div>
                
                <div class="service-card-actions">
                    <button class="service-view-btn" onclick="showServiceDetail('${product.id}')" ${isComingSoon ? 'disabled' : ''}>
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                    <button class="service-add-btn" onclick="addToCart('${product.id}')" ${isComingSoon ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Remove duplicate function - already exists above

// Cart functionality
function addToCart(serviceId) {
    // Check if service is available
    if (!isServiceAvailable(serviceId)) {
        showCartNotification('This service is coming soon!');
        return;
    }
    
    const allServices = [
        ...servicesData.facials, 
        ...servicesData['lash-extensions'], 
        ...servicesData.eyebrows, 
        ...servicesData.addons, 
        ...servicesData.combos
        
    ];
    const service = allServices.find(s => s.id === serviceId);
    
    if (!service) return;
    
    const existingItem = cart.find(item => item.id === serviceId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...service,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartBadge();
    showCartNotification(`${service.name} added to cart!`);
}

function removeFromCart(serviceId) {
    cart = cart.filter(item => item.id !== serviceId);
    saveCart();
    updateCartBadge();
    renderCart();
}

function updateQuantity(serviceId, newQuantity) {
    const item = cart.find(item => item.id === serviceId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(serviceId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartBadge();
            renderCart();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function renderCart() {
    const cartContent = document.getElementById('cart-content');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartContent.style.display = 'block';
        cartItems.style.display = 'none';
        cartTotal.style.display = 'none';
        return;
    }
    
    cartContent.style.display = 'none';
    cartItems.style.display = 'block';
    cartTotal.style.display = 'block';
    
    // Render cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-header">
                <h4>${item.name}</h4>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="cart-item-details">
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <div class="service-price">
                    <span class="current-price">₹${item.discountedPrice * item.quantity}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const total = cart.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
    const discount = subtotal - total;
    
    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('discount').textContent = `-₹${discount}`;
    document.getElementById('total').textContent = `₹${total}`;
}

// Show cart when cart section is active
function showCartSection() {
    showSection('cart');
    renderCart();
}

// Search functionality
function handleSearch(event) {
    const query = event.target.value.trim();
    if (query.length < 2) return;
    
    const results = searchServices(query);
    showSearchResults(results);
}

function showSearchResults(results) {
    // Create or update search results section
    let searchSection = document.getElementById('search-results');
    if (!searchSection) {
        searchSection = document.createElement('section');
        searchSection.id = 'search-results';
        searchSection.classList.add('service-category-section');
        document.querySelector('.main-content').appendChild(searchSection);
    }
    
    searchSection.innerHTML = `
        <div class="page-header">
            <button class="back-btn" onclick="showSection('home')">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h1 style="display:flex;align-items:center;gap:10px;">
                <img src="logo.png" alt="GlowOnCall Logo" style="height:1.6em;vertical-align:middle;object-fit:contain;" />
                Search Results
            </h1>
        </div>
        <div class="services-list">
            ${results.length > 0 
                ? results.map(item => {
                    if (item.image && item.category) {
                        // Service card
                        return createServiceCard(item);
                    } else if (item.image && item.type) {
                        // Product card
                        return createProductCard(item);
                    } else {
                        return '';
                    }
                }).join('')
                : '<p class="no-results">No services found matching your search.</p>'
            }
        </div>
    `;
    showSection('search-results');
}

// Utility functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(`Coupon code ${text} copied!`);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification(`Coupon code ${text} copied!`);
    });
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showCartNotification(message) {
    showNotification(message);
}

function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    showCustomerDetailsModal();
}

function showCustomerDetailsModal() {
    const modal = document.createElement('div');
    modal.className = 'customer-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Customer Details</h2>
                <button class="close-btn" onclick="closeCustomerModal()">&times;</button>
            </div>
            <form id="customer-form">
                <div class="form-group">
                    <label for="customer-name">Full Name *</label>
                    <input type="text" id="customer-name" required>
                </div>
                <div class="form-group">
                    <label for="customer-phone">Phone Number *</label>
                    <input type="tel" id="customer-phone" required>
                </div>
                <div class="form-group">
                    <label for="customer-address">Address *</label>
                    <textarea id="customer-address" rows="3" required placeholder="Enter your complete address"></textarea>
                </div>
                <div class="form-group">
                    <button type="button" class="location-btn" onclick="shareLocation()">
                        <i class="fas fa-map-marker-alt"></i>
                        Share Current Location
                    </button>
                    <span id="location-status" class="location-status"></span>
                </div>
                <div class="form-group">
                    <label for="preferred-date">Preferred Date</label>
                    <input type="date" id="preferred-date" min="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="preferred-time">Preferred Time</label>
                    <select id="preferred-time">
                        <option value="">Select Time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="special-requests">Special Requests</label>
                    <textarea id="special-requests" rows="2" placeholder="Any special requirements or allergies?"></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="cancel-btn" onclick="closeCustomerModal()">Cancel</button>
                    <button type="submit" class="submit-btn">Book Appointment</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('customer-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitBooking();
    });
}

function closeCustomerModal() {
    const modal = document.querySelector('.customer-modal');
    if (modal) {
        modal.remove();
    }
}

function shareLocation() {
    const locationStatus = document.getElementById('location-status');
    
    if (!navigator.geolocation) {
        locationStatus.textContent = 'Location sharing not supported';
        locationStatus.className = 'location-status error';
        return;
    }
    
    locationStatus.textContent = 'Getting location...';
    locationStatus.className = 'location-status loading';
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            locationStatus.textContent = `Location shared (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
            locationStatus.className = 'location-status success';
            locationStatus.dataset.location = `${lat},${lng}`;
        },
        function(error) {
            locationStatus.textContent = 'Failed to get location';
            locationStatus.className = 'location-status error';
            console.error('Location error:', error);
        }
    );
}

function submitBooking() {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;
    const date = document.getElementById('preferred-date').value;
    const time = document.getElementById('preferred-time').value;
    const requests = document.getElementById('special-requests').value;
    const locationStatus = document.getElementById('location-status');
    const location = locationStatus.dataset.location || '';
    
    if (!name || !phone || !address) {
        showNotification('Please fill in all required fields');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
    const totalServices = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    let whatsappMessage = `🌟 *GlowOnCall Booking Request* 🌟\n\n`;
    whatsappMessage += `👤 *Customer Details:*\n`;
    whatsappMessage += `Name: ${name}\n`;
    whatsappMessage += `Phone: ${phone}\n`;
    whatsappMessage += `Address: ${address}\n`;
    
    if (location) {
        whatsappMessage += `📍 Location: https://maps.google.com/?q=${location}\n`;
    }
    
    whatsappMessage += `\n💄 *Services Booked:*\n`;
    cart.forEach(item => {
        whatsappMessage += `• ${item.name} x${item.quantity} - ₹${item.discountedPrice * item.quantity}\n`;
    });
    
    whatsappMessage += `\n💰 *Total Amount:* ₹${total}\n`;
    whatsappMessage += `📊 *Total Services:* ${totalServices}\n`;
    
    if (date && time) {
        whatsappMessage += `\n⏰ *Preferred Schedule:*\n`;
        whatsappMessage += `Date: ${date}\n`;
        whatsappMessage += `Time: ${time}\n`;
    }
    
    if (requests) {
        whatsappMessage += `\n📝 *Special Requests:*\n${requests}\n`;
    }
    
    whatsappMessage += `\nPlease confirm my appointment. Thank you! 💕`;
    
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/918431614767?text=${encodedMessage}`, '_blank');

    closeCustomerModal();
    showNotification('Booking request sent! We will contact you soon.');
}

// Service Detail Functions
function showServiceDetail(serviceId) {
    const service = findServiceById(serviceId);
    if (!service) return;
    
    document.getElementById('service-detail-title').textContent = service.name;
    const content = document.getElementById('service-detail-content');
    
    content.innerHTML = `
        <div class="service-detail-main">
            <div class="service-detail-image">
                <img src="${service.image}" alt="${service.name}" />
            </div>
            
            <div class="service-detail-info">
                <h2>${service.name}</h2>
                <p class="service-description">${service.description}</p>
                
                <div class="service-pricing">
                    <div class="price-info">
                        <span class="current-price">₹${service.discountedPrice}</span>
                        ${service.originalPrice !== service.discountedPrice ? 
                            `<span class="original-price">₹${service.originalPrice}</span>
                             <span class="discount-percent">${Math.round((1 - service.discountedPrice/service.originalPrice) * 100)}% OFF</span>` 
                            : ''}
                    </div>
                    <div class="duration-info">
                        <i class="fas fa-clock"></i>
                        <span>${service.duration} minutes</span>
                    </div>
                </div>

                ${service.benefits ? `
                    <div class="service-benefits">
                        <h3>Benefits</h3>
                        <ul>
                            ${service.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${service.procedure ? `
                    <div class="service-procedure">
                        <h3>Procedure</h3>
                        <p>${service.procedure}</p>
                    </div>
                ` : ''}

                ${service.idealFor ? `
                    <div class="service-ideal">
                        <h3>Ideal For</h3>
                        <p>${service.idealFor}</p>
                    </div>
                ` : ''}

                <div class="service-actions">
                    <button class="add-to-cart-btn" onclick="addToCart('${service.id}')">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                    <button class="book-now-btn" onclick="showAppointmentBooking('${service.id}')">
                        <i class="fas fa-calendar-plus"></i>
                        Book Appointment
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showSection('service-detail');
}

function findServiceById(serviceId) {
    const allServices = [
        ...servicesData.facials,
        ...servicesData['lash-extensions'],
        ...servicesData.eyebrows,
        ...servicesData.addons,
        ...servicesData.combos
    ];
    return allServices.find(service => service.id === serviceId);
}

function showAppointmentBooking(serviceId) {
    const service = findServiceById(serviceId);
    if (!service) return;
    
    const modal = document.createElement('div');
    modal.className = 'appointment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Book Appointment</h2>
                <button class="close-btn" onclick="closeAppointmentModal()">&times;</button>
            </div>
            <div class="appointment-form">
                <div class="service-summary">
                    <img src="${service.image}" alt="${service.name}" />
                    <div class="service-info">
                        <h3>${service.name}</h3>
                        <p>Duration: ${service.duration} minutes</p>
                        <p class="price">₹${service.discountedPrice}</p>
                    </div>
                </div>
                
                <form id="appointment-form">
                    <div class="form-group">
                        <label for="appointment-date">Select Date</label>
                        <input type="date" id="appointment-date" required min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    
                    <div class="form-group">
                        <label for="appointment-time">Select Time</label>
                        <div class="time-slots" id="time-slots">
                            <!-- Time slots will be populated here -->
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="customer-name">Full Name</label>
                        <input type="text" id="customer-name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="customer-phone">Phone Number</label>
                        <input type="tel" id="customer-phone" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="customer-address">Address</label>
                        <textarea id="customer-address" rows="3" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <button type="button" class="location-btn" onclick="shareLocation()">
                            <i class="fas fa-map-marker-alt"></i>
                            Share Current Location
                        </button>
                        <span id="location-status" class="location-status"></span>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="cancel-btn" onclick="closeAppointmentModal()">Cancel</button>
                        <button type="submit" class="book-btn">Book Appointment</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Generate time slots
    generateTimeSlots();
    
    // Handle date change to update available slots
    document.getElementById('appointment-date').addEventListener('change', generateTimeSlots);
    
    // Handle form submission
    document.getElementById('appointment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitAppointment(serviceId);
    });
}

function generateTimeSlots() {
    const dateInput = document.getElementById('appointment-date');
    const timeSlotsContainer = document.getElementById('time-slots');
    const selectedDate = dateInput.value;
    
    if (!selectedDate) {
        timeSlotsContainer.innerHTML = '<p>Please select a date first</p>';
        return;
    }
    
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', 
        '13:00', '14:00', '15:00', '16:00', 
        '17:00', '18:00'
    ];
    
    const bookedSlotsForDate = bookedSlots[selectedDate] || [];
    
    timeSlotsContainer.innerHTML = timeSlots.map(time => {
        const isBooked = bookedSlotsForDate.includes(time);
        return `
            <div class="time-slot ${isBooked ? 'booked' : ''}" 
                 data-time="${time}"
                 onclick="${isBooked ? '' : 'selectTimeSlot(this)'}">
                ${formatTime(time)}
                ${isBooked ? '<span class="booked-label">Booked</span>' : ''}
            </div>
        `;
    }).join('');
}

function selectTimeSlot(element) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Add selection to clicked element
    element.classList.add('selected');
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
}

function submitAppointment(serviceId) {
    const service = findServiceById(serviceId);
    const selectedDate = document.getElementById('appointment-date').value;
    const selectedTimeSlot = document.querySelector('.time-slot.selected');
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;
    
    if (!selectedDate || !selectedTimeSlot || !name || !phone || !address) {
        showNotification('Please fill in all required fields and select a time slot');
        return;
    }
    
    const selectedTime = selectedTimeSlot.dataset.time;
    
    // Book the slot
    if (!bookedSlots[selectedDate]) {
        bookedSlots[selectedDate] = [];
    }
    bookedSlots[selectedDate].push(selectedTime);
    localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));
    
    // Prepare WhatsApp message
    const locationStatus = document.getElementById('location-status');
    const location = locationStatus.dataset.location || '';
    
    let whatsappMessage = `🌟 *GlowOnCall Appointment Booking* 🌟\n\n`;
    whatsappMessage += `💄 *Service:* ${service.name}\n`;
    whatsappMessage += `💰 *Price:* ₹${service.discountedPrice}\n`;
    whatsappMessage += `⏱️ *Duration:* ${service.duration} minutes\n\n`;
    whatsappMessage += `📅 *Appointment Details:*\n`;
    whatsappMessage += `Date: ${selectedDate}\n`;
    whatsappMessage += `Time: ${formatTime(selectedTime)}\n\n`;
    whatsappMessage += `👤 *Customer Details:*\n`;
    whatsappMessage += `Name: ${name}\n`;
    whatsappMessage += `Phone: ${phone}\n`;
    whatsappMessage += `Address: ${address}\n`;
    
    if (location) {
        whatsappMessage += `📍 Location: https://maps.google.com/?q=${location}\n`;
    }
    
    whatsappMessage += `\nPlease confirm my appointment. Thank you! 💕`;
    
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/918431614767?text=${encodedMessage}`, '_blank');

    closeAppointmentModal();
    showNotification('Appointment booked! We will contact you for confirmation.');
}

function closeAppointmentModal() {
    const modal = document.querySelector('.appointment-modal');
    if (modal) {
        modal.remove();
    }
}

// Override cart navigation to render cart
document.querySelector('.nav-item[onclick*="cart"]').onclick = showCartSection;
