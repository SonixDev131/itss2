// EatSmart Vanilla JavaScript App with Enhanced Map Modal
class MapModal {
    constructor() {
        this.isOpen = false;
        this.userLocation = null;
        this.currentRestaurant = null;
        this.trackingInterval = null;
        this.isTracking = false;
        this.useEmbed = true; // Prefer Google Maps Embed over JavaScript API
        
        this.bindEvents();
    }

    bindEvents() {
        // Modal close events
        const closeBtn = document.getElementById('close-map-btn');
        closeBtn?.addEventListener('click', () => this.close());

        const modal = document.getElementById('map-modal');
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });

        // Navigation buttons
        const startNavBtn = document.getElementById('start-navigation-btn');
        startNavBtn?.addEventListener('click', () => this.toggleTracking());

        const directionsBtn = document.getElementById('get-directions-btn');
        directionsBtn?.addEventListener('click', () => this.getDirections());

        const callBtn = document.getElementById('call-restaurant-btn');
        callBtn?.addEventListener('click', () => this.callRestaurant());
    }

    open(restaurantName, restaurantAddress, lat, lng, contact) {
        this.currentRestaurant = {
            name: restaurantName,
            address: restaurantAddress,
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
            contact: contact
        };

        this.isOpen = true;
        this.updateModalContent();
        this.getCurrentLocation();
        this.showModal();
    }

    close() {
        this.isOpen = false;
        this.stopTracking();
        this.hideModal();
    }

    updateModalContent() {
        // Update restaurant info
        const nameTitle = document.getElementById('map-restaurant-name-title');
        const name = document.getElementById('map-restaurant-name');
        const address = document.getElementById('map-restaurant-address');

        if (nameTitle) nameTitle.textContent = this.currentRestaurant.name;
        if (name) name.textContent = this.currentRestaurant.name;
        if (address) address.textContent = this.currentRestaurant.address;
    }

    getCurrentLocation() {
        const statusEl = document.getElementById('location-status');
        if (statusEl) {
            statusEl.textContent = '📍 Getting your location...';
            statusEl.className = 'location-status';
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.updateLocationStatus('✅ Location found');
                    this.updateMap();
                    this.enableNavigation();
                },
                (error) => {
                    console.warn('Geolocation error:', error);
                    // Fallback to Hanoi city center
                    this.userLocation = { lat: 21.0285, lng: 105.8542 };
                    this.updateLocationStatus('⚠️ Using default location', true);
                    this.updateMap();
                    this.enableNavigation();
                }
            );
        } else {
            this.userLocation = { lat: 21.0285, lng: 105.8542 };
            this.updateLocationStatus('⚠️ Geolocation not supported', true);
            this.updateMap();
            this.enableNavigation();
        }
    }

    updateLocationStatus(message, isError = false) {
        const statusEl = document.getElementById('location-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `location-status ${isError ? 'error' : ''} ${this.isTracking ? 'tracking' : ''}`;
        }
    }

    updateMap() {
        if (!this.userLocation || !this.currentRestaurant) return;

        if (this.useEmbed) {
            this.updateGoogleMapsEmbed();
        } else {
            this.updateJavaScriptMap();
        }
    }

    updateGoogleMapsEmbed() {
        const iframe = document.getElementById('map-iframe');
        const mapContainer = document.getElementById('map');
        
        if (iframe) {
            // Use your API key here
            const apiKey = 'AIzaSyAYZNO0XQpmLX2A6ceNrHeWSQQhIxc1vCM'; // Your API key
            const embedSrc = `https://www.google.com/maps/embed/v1/directions?origin=${this.userLocation.lat},${this.userLocation.lng}&destination=${this.currentRestaurant.latitude},${this.currentRestaurant.longitude}&key=${apiKey}&avoid=tolls|highways&mode=driving`;
            
            iframe.src = embedSrc;
            iframe.style.display = 'block';
            mapContainer.style.display = 'none';
            
            console.log('📍 Google Maps Embed updated:', embedSrc);
        }
    }

    updateJavaScriptMap() {
        const iframe = document.getElementById('map-iframe');
        const mapContainer = document.getElementById('map');
        
        if (typeof google !== 'undefined' && google.maps && mapContainer) {
            iframe.style.display = 'none';
            mapContainer.style.display = 'block';
            
            // Use the existing JavaScript Maps API implementation
            // This is a fallback when embed doesn't work
            console.log('📍 Using JavaScript Maps API fallback');
        }
    }

    enableNavigation() {
        const startNavBtn = document.getElementById('start-navigation-btn');
        if (startNavBtn) {
            startNavBtn.disabled = false;
        }
    }

    toggleTracking() {
        if (this.isTracking) {
            this.stopTracking();
        } else {
            this.startTracking();
        }
    }

    startTracking() {
        this.isTracking = true;
        this.updateNavigationButton();
        this.updateLocationStatus('🧭 Tracking your location...', false);
        
        // Update location every 3 seconds
        this.trackingInterval = setInterval(() => {
            this.getCurrentLocation();
        }, 3000);

        console.log('📍 Started location tracking');
    }

    stopTracking() {
        this.isTracking = false;
        this.updateNavigationButton();
        
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
            this.trackingInterval = null;
        }

        if (this.userLocation) {
            this.updateLocationStatus('📍 Location tracking stopped');
        }

        console.log('📍 Stopped location tracking');
    }

    updateNavigationButton() {
        const startNavBtn = document.getElementById('start-navigation-btn');
        if (startNavBtn) {
            const icon = startNavBtn.querySelector('i');
            const text = startNavBtn.querySelector('span');
            
            if (this.isTracking) {
                startNavBtn.classList.add('active');
                icon.className = 'fas fa-stop';
                text.textContent = 'Stop Navigation';
            } else {
                startNavBtn.classList.remove('active');
                icon.className = 'fas fa-navigation';
                text.textContent = 'Start Navigation';
            }
        }
    }

    getDirections() {
        if (!this.currentRestaurant) return;
        
        // Open external maps with directions
        const { latitude, longitude } = this.currentRestaurant;
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        const isMobile = isIOS || isAndroid;
        
        if (isMobile) {
            this.showMobileMapOptions(latitude, longitude);
        } else {
            const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
            window.open(webUrl, '_blank');
        }
    }

    callRestaurant() {
        if (!this.currentRestaurant || !this.currentRestaurant.contact) {
            this.showNotification('⚠️ Phone number not available', 'error');
            return;
        }

        const phoneNumber = this.currentRestaurant.contact.replace(/\D/g, '');
        window.location.href = `tel:${phoneNumber}`;
    }

    showMobileMapOptions(latitude, longitude) {
        // Reuse the enhanced mobile map options from the main app
        if (window.app && window.app.showMobileMapOptions) {
            window.app.showMobileMapOptions(latitude, longitude);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : '#10b981'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-family: Inter, sans-serif;
            font-size: 14px;
            z-index: 10005;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showModal() {
        const modal = document.getElementById('map-modal');
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }
    }

    hideModal() {
        const modal = document.getElementById('map-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restore background scroll
        }
    }
}

// EatSmart Vanilla JavaScript App with Google Maps Integration
class EatSmartApp {
    constructor() {
        this.currentPage = 'home';
        this.currentTimeRange = '12:00 — 13:00';
        this.currentFilter = 'nearby';
        this.map = null;
        this.directionsService = null;
        this.directionsRenderer = null;
        this.userLocation = null;
        this.currentRestaurant = null;
        
        // Initialize enhanced map modal
        this.mapModal = new MapModal();
        
        this.init();
    }

    async init() {
        // Load data first
        const dataLoaded = await loadData();
        if (!dataLoaded) {
            console.error('Failed to load data');
            return;
        }

        this.bindEvents();
        this.showPage('home');
        this.requestUserLocation();
    }

    bindEvents() {
        // Home page events
        const findRestaurantsBtn = document.getElementById('find-restaurants-btn');
        findRestaurantsBtn?.addEventListener('click', this.handleFindRestaurants.bind(this));

        // Navigation events
        const backBtn = document.getElementById('back-btn');
        backBtn?.addEventListener('click', () => this.showPage('home'));

        const reviewsBackBtn = document.getElementById('reviews-back-btn');
        reviewsBackBtn?.addEventListener('click', () => this.goBackFromReviews());

        // Filter events
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', this.handleFilterChange.bind(this));
        });

        // Note: MapModal handles its own events internally
    }

    // Request user's location for better directions
    requestUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    console.log('User location obtained:', this.userLocation);
                },
                (error) => {
                    console.warn('Could not get user location:', error.message);
                    // Set default location to Hanoi city center
                    this.userLocation = { lat: 21.0285, lng: 105.8542 };
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        } else {
            console.warn('Geolocation not supported');
            this.userLocation = { lat: 21.0285, lng: 105.8542 };
        }
    }

    handleFindRestaurants() {
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;
        
        this.currentTimeRange = `${startTime} — ${endTime}`;
        this.showRestaurants();
    }

    handleFilterChange(e) {
        const filter = e.target.closest('.filter-btn').dataset.filter;
        this.currentFilter = filter;

        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.closest('.filter-btn').classList.add('active');

        // Reload restaurants with new filter
        this.loadRestaurants();
    }

    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }
    }

    showRestaurants() {
        this.showPage('restaurants');
        
        // Update time range title
        const timeRangeTitle = document.getElementById('time-range-title');
        if (timeRangeTitle) {
            timeRangeTitle.innerHTML = `Top Picks for<br>${this.currentTimeRange}`;
        }

        this.loadRestaurants();
    }

    loadRestaurants() {
        const container = document.getElementById('restaurants-container');
        if (!container) return;

        // Get filtered restaurants
        const restaurants = getFilteredRestaurants(this.currentFilter);
        const restaurantsWithDishes = restaurants.map(restaurant => {
            const dishes = getDishByRestaurantId(restaurant.id);
            const primaryDish = dishes[0];
            
            return {
                id: restaurant.id,
                name: restaurant.name,
                dish: primaryDish ? primaryDish.name : 'Đang cập nhật',
                image: primaryDish ? primaryDish.image : restaurant.image,
                timeToEat: primaryDish ? primaryDish.timeToEat : 30,
                address: restaurant.address,
                rating: restaurant.rating,
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
                contact: restaurant.contact
            };
        }).filter(restaurant => restaurant.dish !== 'Đang cập nhật');

        // Clear container
        container.innerHTML = '';

        // Add restaurants
        restaurantsWithDishes.forEach(restaurant => {
            const restaurantCard = this.createRestaurantCard(restaurant);
            container.appendChild(restaurantCard);
        });
    }

    createRestaurantCard(restaurant) {
        const card = document.createElement('div');
        card.className = 'restaurant-card fade-in';
        card.addEventListener('click', () => this.showDishDetail(restaurant.id));

        const imageContent = restaurant.image && restaurant.image.startsWith('http') 
            ? `<img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image">`
            : `<div class="restaurant-image"><i class="fas fa-utensils"></i></div>`;

        card.innerHTML = `
            ${imageContent}
            <div class="restaurant-info">
                <div class="restaurant-name">${restaurant.name}</div>
                <div class="restaurant-dish">${restaurant.dish}</div>
                <div class="restaurant-meta">
                    <div class="time-badge" title="Thời gian đi đến quán, ăn và trở lại">
                        <i class="fas fa-route"></i>
                        <span class="time-text">
                            <span class="time-duration">${restaurant.timeToEat} phút</span>
                            <span class="time-description">đi & về</span>
                        </span>
                    </div>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        ${restaurant.rating.toFixed(1)}
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    showDishDetail(restaurantId) {
        const dishes = getDishByRestaurantId(restaurantId);
        if (dishes.length === 0) return;

        const dish = dishes[0]; // Show first dish
        this.currentDishId = dish.id;
        this.currentRestaurant = getRestaurantById(restaurantId);
        
        this.showPage('dish');
        this.loadDishDetail(dish);
    }

    loadDishDetail(dish) {
        const container = document.getElementById('dish-detail-container');
        if (!container) return;

        const reviews = getReviewsByDishId(dish.id);
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : dish.rating.toFixed(1);

        const imageContent = dish.image && dish.image.startsWith('http') 
            ? `<img src="${dish.image}" alt="${dish.name}" style="width: 100%; height: 100%; object-fit: cover;">`
            : `<i class="fas fa-utensils"></i><p>Món ăn ngon</p>`;

        container.innerHTML = `
            <div class="dish-header">
                <button class="back-btn" onclick="app.showPage('restaurants')">
                    <i class="fas fa-chevron-left"></i>
                </button>
                ${imageContent}
            </div>
            <div class="dish-content">
                <h1 class="dish-title">${dish.name}</h1>
                <p class="dish-restaurant">${dish.restaurant}</p>
                
                <div class="dish-rating">
                    <div class="rating-stars">
                        ${this.generateStars(parseFloat(avgRating))}
                    </div>
                    <span class="rating-text">${avgRating} (${reviews.length} đánh giá)</span>
                </div>
                
                <div class="dish-quote">
                    "${dish.description || 'Món ăn được chế biến từ những nguyên liệu tươi ngon nhất.'}"
                </div>
                
                <div class="dish-actions">
                    <button class="action-btn" onclick="app.showReviews(${dish.id})">
                        <i class="fas fa-star"></i>
                        Reviews
                    </button>
                    <button class="action-btn" onclick="app.showMap('${this.currentRestaurant?.address}', '${this.currentRestaurant?.name}', ${this.currentRestaurant?.latitude}, ${this.currentRestaurant?.longitude}, '${this.currentRestaurant?.contact}')">
                        <i class="fas fa-map-marker-alt"></i>
                        Map & Directions
                    </button>
                </div>
                
                ${this.createRelatedDishesSection(dish)}
            </div>
        `;
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    createRelatedDishesSection(dish) {
        if (!dish.relatedDishes || dish.relatedDishes.length === 0) {
            return '';
        }

        let relatedHtml = `
            <div class="related-dishes">
                <h3>Related Dishes</h3>
                <div class="related-grid">
        `;

        dish.relatedDishes.forEach(relatedDish => {
            const imageContent = relatedDish.image && relatedDish.image.startsWith('http')
                ? `<img src="${relatedDish.image}" alt="${relatedDish.name}">`
                : `<i class="fas fa-utensils"></i>`;

            relatedHtml += `
                <div class="related-item" onclick="app.showDishDetail(${getDishById(relatedDish.id)?.restaurantId})">
                    <div class="related-image">${imageContent}</div>
                    <div class="related-name">${relatedDish.name}</div>
                </div>
            `;
        });

        relatedHtml += `
                </div>
            </div>
        `;

        return relatedHtml;
    }

    showReviews(dishId) {
        this.currentDishId = dishId;
        this.showPage('reviews');
        this.loadReviews(dishId);
    }

    loadReviews(dishId) {
        const container = document.getElementById('reviews-container');
        const dish = getDishById(dishId);
        const reviews = getReviewsByDishId(dishId);
        
        if (!container) return;

        // Update reviews title
        const reviewsTitle = document.getElementById('reviews-title');
        if (reviewsTitle && dish) {
            reviewsTitle.textContent = `Reviews for ${dish.name}`;
        }

        // Clear container
        container.innerHTML = '';

        if (reviews.length === 0) {
            container.innerHTML = `
                <div class="review-card">
                    <p style="text-align: center; color: #9ca3af; font-style: italic;">
                        Chưa có đánh giá nào cho món này.
                    </p>
                </div>
            `;
            return;
        }

        // Add reviews
        reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card fade-in';
            
            reviewCard.innerHTML = `
                <div class="review-header">
                    <div class="reviewer-avatar">
                        ${review.reviewer.charAt(0).toUpperCase()}
                    </div>
                    <div class="reviewer-info">
                        <h4>${review.reviewer}</h4>
                        <span class="review-date">${this.formatDate(review.date)}</span>
                    </div>
                </div>
                <div class="review-rating">
                    ${this.generateStars(review.rating)}
                </div>
                <div class="review-text">
                    ${review.text}
                </div>
            `;

            container.appendChild(reviewCard);
        });
    }

    goBackFromReviews() {
        this.showPage('dish');
    }

    // Enhanced Google Maps Integration with new modal
    showMap(address, restaurantName, lat, lng, contact) {
        // Use the new enhanced MapModal instead of the old implementation
        this.mapModal.open(restaurantName, address, lat, lng, contact);
    }

    callRestaurant() {
        if (!this.currentRestaurant || !this.currentRestaurant.contact) {
            alert('Số điện thoại không khả dụng');
            return;
        }

        const phoneNumber = this.currentRestaurant.contact.replace(/\D/g, ''); // Remove non-digits
        window.location.href = `tel:${phoneNumber}`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Global callback for Google Maps API
window.initGoogleMaps = function() {
    console.log('Google Maps API loaded');
    // The app will handle map initialization when needed
};

// Initialize app - make it globally available for onclick handlers
window.app = new EatSmartApp(); 