// Data management for EatSmart app
let restaurantsData = [];
let dishesData = [];
let reviewsData = [];

// Load data from JSON files
async function loadData() {
    try {
        // Load restaurants data
        const restaurantsResponse = await fetch('./data/restaurant.json');
        const restaurants = await restaurantsResponse.json();
        
        // Load dishes data  
        const dishesResponse = await fetch('./data/dishes.json');
        const dishes = await dishesResponse.json();
        
        // Transform restaurants data
        restaurantsData = restaurants.map(restaurant => ({
            id: restaurant.restaurant_id,
            name: restaurant.name,
            address: restaurant.address,
            contact: restaurant.contact,
            rating: restaurant.rating,
            image: restaurant.image_url,
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
            dishes: dishes.filter(dish => dish.restaurant_id === restaurant.restaurant_id)
        }));

        // Transform dishes data
        dishesData = dishes.map(dish => ({
            id: dish.dish_id,
            restaurantId: dish.restaurant_id,
            name: dish.name,
            description: dish.description,
            price: dish.price,
            category: dish.category,
            image: dish.image_url,
            restaurant: restaurants.find(r => r.restaurant_id === dish.restaurant_id)?.name || '',
            address: restaurants.find(r => r.restaurant_id === dish.restaurant_id)?.address || '',
            rating: restaurants.find(r => r.restaurant_id === dish.restaurant_id)?.rating || 0,
            timeToEat: Math.floor(Math.random() * 30) + 15, // Random time between 15-45 mins
            relatedDishes: []
        }));

        // Add related dishes (3 random dishes from the same restaurant)
        dishesData.forEach(dish => {
            const samRestaurantDishes = dishesData.filter(d => 
                d.restaurantId === dish.restaurantId && d.id !== dish.id
            );
            dish.relatedDishes = samRestaurantDishes
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(d => ({
                    id: d.id,
                    name: d.name,
                    image: d.image
                }));
        });

        // Generate sample reviews
        generateSampleReviews();
        
        return true;
    } catch (error) {
        console.error('Error loading data:', error);
        return false;
    }
}

// Generate sample reviews for dishes
function generateSampleReviews() {
    const reviewTexts = [
        "Món ăn rất ngon, đậm đà hương vị!",
        "Chất lượng tuyệt vời, sẽ quay lại lần sau.",
        "Giá cả hợp lý, phục vụ chu đáo.",
        "Không gian thoáng mát, món ăn tươi ngon.",
        "Đồ ăn ngon nhưng phải đợi hơi lâu.",
        "Vị ngon, phần ăn vừa đủ.",
        "Rất đáng để thử, món ăn độc đáo.",
        "Chất lượng ổn, giá hợp lý.",
        "Không gian đẹp, thức ăn tươi ngon.",
        "Sẽ giới thiệu cho bạn bè."
    ];
    
    const reviewerNames = [
        "Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", 
        "Hoàng Văn E", "Vũ Thị F", "Đỗ Văn G", "Bùi Thị H",
        "Ngô Văn I", "Đặng Thị K"
    ];

    reviewsData = [];
    let reviewId = 1;

    // Generate 2-5 reviews per dish (only for first 30 dishes to keep it manageable)
    dishesData.slice(0, 30).forEach(dish => {
        const numReviews = Math.floor(Math.random() * 4) + 2; // 2-5 reviews
        
        for (let i = 0; i < numReviews; i++) {
            const randomDate = new Date();
            randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
            
            reviewsData.push({
                id: reviewId++,
                dishId: dish.id,
                reviewer: reviewerNames[Math.floor(Math.random() * reviewerNames.length)],
                date: randomDate.toISOString().split('T')[0],
                rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
                text: reviewTexts[Math.floor(Math.random() * reviewTexts.length)]
            });
        }
    });
}

// Helper functions
function getDishById(id) {
    return dishesData.find(dish => dish.id === parseInt(id));
}

function getRestaurantById(id) {
    return restaurantsData.find(restaurant => restaurant.id === parseInt(id));
}

function getDishByRestaurantId(restaurantId) {
    return dishesData.filter(dish => dish.restaurantId === parseInt(restaurantId));
}

function getReviewsByDishId(dishId) {
    return reviewsData.filter(review => review.dishId === parseInt(dishId));
}

function getFilteredRestaurants(filter) {
    let filteredRestaurants = [...restaurantsData];
    
    switch(filter) {
        case 'nearby':
            // Sort by distance (simulated - in real app would use geolocation)
            return filteredRestaurants.sort((a, b) => {
                // Simple distance calculation based on lat/lng
                const distA = Math.abs(a.latitude - 21.0) + Math.abs(a.longitude - 105.8);
                const distB = Math.abs(b.latitude - 21.0) + Math.abs(b.longitude - 105.8);
                return distA - distB;
            });
        case 'popular':
            // Sort by number of dishes (as popularity proxy)
            return filteredRestaurants.sort((a, b) => b.dishes.length - a.dishes.length);
        case 'rating':
            // Sort by rating
            return filteredRestaurants.sort((a, b) => b.rating - a.rating);
        default:
            return filteredRestaurants;
    }
}

function getRestaurantsWithDishes() {
    // Return restaurants that have dishes for the restaurant list view
    return restaurantsData.map(restaurant => {
        const dishes = getDishByRestaurantId(restaurant.id);
        const primaryDish = dishes[0]; // Take first dish as primary
        
        return {
            id: restaurant.id,
            name: restaurant.name,
            dish: primaryDish ? primaryDish.name : 'Đang cập nhật',
            image: primaryDish ? primaryDish.image : restaurant.image,
            timeToEat: primaryDish ? primaryDish.timeToEat : 30,
            address: restaurant.address,
            rating: restaurant.rating
        };
    }).filter(restaurant => restaurant.dish !== 'Đang cập nhật'); // Only show restaurants with dishes
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    // Simple distance calculation (Haversine formula)
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
} 