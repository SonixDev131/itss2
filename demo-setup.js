// Demo Setup Script for EatSmart App
// This script provides fallback functionality when Google Maps API is not available

// Mock Google Maps API for demo purposes
window.mockGoogleMaps = function() {
    console.log('🎯 Running in DEMO mode - Google Maps API not configured');
    
    // Create mock Google Maps objects
    window.google = {
        maps: {
            Map: class MockMap {
                constructor(element, options) {
                    this.element = element;
                    this.options = options;
                    this.createMockMap();
                }
                
                createMockMap() {
                    this.element.innerHTML = `
                        <div style="
                            height: 100%;
                            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            text-align: center;
                            border-radius: 0.75rem;
                            color: #64748b;
                            font-family: Inter, sans-serif;
                            padding: 2rem;
                            position: relative;
                            overflow: hidden;
                        ">
                            <div style="
                                position: absolute;
                                top: -50%;
                                left: -50%;
                                width: 200%;
                                height: 200%;
                                background: radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%);
                            "></div>
                            <div style="
                                position: relative;
                                z-index: 1;
                            ">
                                <div style="font-size: 4rem; margin-bottom: 1rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">🗺️</div>
                                <h3 style="margin: 0 0 1rem 0; color: #1e293b; font-weight: 700; font-size: 1.25rem;">DEMO MODE</h3>
                                <div style="
                                    background: rgba(255,255,255,0.8);
                                    backdrop-filter: blur(10px);
                                    border-radius: 12px;
                                    padding: 1.5rem;
                                    border: 1px solid rgba(255,255,255,0.3);
                                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                                ">
                                    <p style="margin: 0 0 1rem 0; font-size: 0.9rem; line-height: 1.6; color: #475569;">
                                        <strong>🔧 Để sử dụng bản đồ thật:</strong><br>
                                        1. Truy cập <a href="https://console.cloud.google.com" target="_blank" style="color: #f97316; text-decoration: none;">Google Cloud Console</a><br>
                                        2. Tạo API key cho Maps JavaScript API<br>
                                        3. Thay thế YOUR_API_KEY trong index.html
                                    </p>
                                    <div style="
                                        margin-top: 1rem;
                                        padding: 0.75rem 1rem;
                                        background: linear-gradient(135deg, #fef3c7, #fed7aa);
                                        border-radius: 8px;
                                        font-size: 0.8rem;
                                        color: #92400e;
                                        border-left: 4px solid #f59e0b;
                                    ">
                                        <strong>📍 Vị trí nhà hàng:</strong><br>
                                        Lat: ${this.options.center.lat.toFixed(6)}<br>
                                        Lng: ${this.options.center.lng.toFixed(6)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
                
                fitBounds() {
                    console.log('📍 Mock: Fitting map bounds');
                    this.showBoundsAnimation();
                }

                showBoundsAnimation() {
                    const container = this.element.querySelector('div');
                    if (container) {
                        container.style.transform = 'scale(0.95)';
                        container.style.transition = 'transform 0.3s ease';
                        setTimeout(() => {
                            container.style.transform = 'scale(1)';
                        }, 300);
                    }
                }
            },
            
            Marker: class MockMarker {
                constructor(options) {
                    this.options = options;
                    console.log('📍 Mock: Creating marker at', options.position);
                    this.showMarkerNotification();
                }
                
                addListener(event, callback) {
                    if (event === 'click') {
                        // Auto-trigger click after 2 seconds for demo
                        setTimeout(() => {
                            console.log('📍 Mock: Marker clicked');
                            callback();
                        }, 2000);
                    }
                }

                showMarkerNotification() {
                    // Create a temporary notification
                    const notification = document.createElement('div');
                    notification.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: #10b981;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 8px;
                        font-family: Inter, sans-serif;
                        font-size: 14px;
                        z-index: 10001;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        transform: translateX(100%);
                        transition: transform 0.3s ease;
                    `;
                    notification.innerHTML = '📍 Marker đã được tạo (Demo)';
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
            },
            
            InfoWindow: class MockInfoWindow {
                constructor(options) {
                    this.content = options.content;
                    console.log('ℹ️ Mock: Creating info window');
                }
                
                open(map, marker) {
                    console.log('ℹ️ Mock: Opening info window');
                    this.showDemoPopup();
                }

                showDemoPopup() {
                    // Create a nicer demo popup
                    const popup = document.createElement('div');
                    popup.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        border-radius: 16px;
                        padding: 2rem;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                        z-index: 10002;
                        font-family: Inter, sans-serif;
                        max-width: 90vw;
                        width: 300px;
                        text-align: center;
                        border: 1px solid #e2e8f0;
                    `;
                    
                    const cleanContent = this.content.replace(/<[^>]*>/g, '').trim();
                    popup.innerHTML = `
                        <div style="font-size: 2rem; margin-bottom: 1rem;">ℹ️</div>
                        <h3 style="margin: 0 0 1rem 0; color: #1e293b;">Info Window Demo</h3>
                        <p style="margin: 0 0 1.5rem 0; color: #64748b; font-size: 0.9rem;">${cleanContent}</p>
                        <button onclick="this.parentElement.remove()" style="
                            background: #f97316;
                            color: white;
                            border: none;
                            padding: 0.75rem 1.5rem;
                            border-radius: 8px;
                            font-size: 0.9rem;
                            cursor: pointer;
                            transition: all 0.2s;
                        " onmouseover="this.style.background='#ea580c'" onmouseout="this.style.background='#f97316'">
                            Đóng
                        </button>
                    `;
                    
                    document.body.appendChild(popup);
                    
                    // Auto close after 5 seconds
                    setTimeout(() => {
                        if (popup.parentElement) {
                            popup.remove();
                        }
                    }, 5000);
                }
            },
            
            DirectionsService: class MockDirectionsService {
                route(request, callback) {
                    console.log('🧭 Mock: Calculating directions...');
                    
                    // Show loading state
                    this.showDirectionsLoading();
                    
                    setTimeout(() => {
                        // Simulate successful response
                        const mockResult = {
                            routes: [{
                                overview_path: [],
                                legs: [{
                                    distance: { text: '2.3 km' },
                                    duration: { text: '8 phút' }
                                }]
                            }]
                        };
                        callback(mockResult, 'OK');
                        this.showDirectionsResult();
                    }, 2000);
                }

                showDirectionsLoading() {
                    const loader = document.createElement('div');
                    loader.id = 'demo-directions-loader';
                    loader.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: rgba(255,255,255,0.95);
                        backdrop-filter: blur(10px);
                        border-radius: 16px;
                        padding: 2rem;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                        z-index: 10003;
                        font-family: Inter, sans-serif;
                        text-align: center;
                        border: 1px solid #e2e8f0;
                    `;
                    loader.innerHTML = `
                        <div style="
                            width: 40px;
                            height: 40px;
                            border: 4px solid #f3f4f6;
                            border-top: 4px solid #f97316;
                            border-radius: 50%;
                            animation: spin 1s linear infinite;
                            margin: 0 auto 1rem auto;
                        "></div>
                        <p style="margin: 0; color: #64748b; font-size: 0.9rem;">🧭 Đang tính toán chỉ đường...</p>
                    `;
                    document.body.appendChild(loader);

                    // Add spin animation
                    if (!document.getElementById('demo-spin-style')) {
                        const style = document.createElement('style');
                        style.id = 'demo-spin-style';
                        style.textContent = `
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                }

                showDirectionsResult() {
                    const loader = document.getElementById('demo-directions-loader');
                    if (loader) loader.remove();

                    const result = document.createElement('div');
                    result.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        border-radius: 16px;
                        padding: 2rem;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                        z-index: 10003;
                        font-family: Inter, sans-serif;
                        text-align: center;
                        border: 1px solid #e2e8f0;
                        min-width: 300px;
                    `;
                    result.innerHTML = `
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🧭</div>
                        <h3 style="margin: 0 0 1rem 0; color: #1e293b;">Chỉ đường (Demo)</h3>
                        <div style="
                            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
                            border-radius: 12px;
                            padding: 1.5rem;
                            margin-bottom: 1.5rem;
                            border-left: 4px solid #0ea5e9;
                        ">
                            <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #0c4a6e;">📏 Khoảng cách: 2.3 km</p>
                            <p style="margin: 0; font-weight: 600; color: #0c4a6e;">⏱️ Thời gian: 8 phút</p>
                        </div>
                        <p style="margin: 0 0 1.5rem 0; color: #64748b; font-size: 0.85rem;">
                            📱 Trên thiết bị thật, bạn sẽ được chuyển đến ứng dụng bản đồ
                        </p>
                        <button onclick="this.parentElement.remove()" style="
                            background: #f97316;
                            color: white;
                            border: none;
                            padding: 0.75rem 1.5rem;
                            border-radius: 8px;
                            font-size: 0.9rem;
                            cursor: pointer;
                            transition: all 0.2s;
                        " onmouseover="this.style.background='#ea580c'" onmouseout="this.style.background='#f97316'">
                            Đóng
                        </button>
                    `;
                    document.body.appendChild(result);

                    // Auto close after 7 seconds
                    setTimeout(() => {
                        if (result.parentElement) {
                            result.remove();
                        }
                    }, 7000);
                }
            },
            
            DirectionsRenderer: class MockDirectionsRenderer {
                constructor(options) {
                    this.options = options;
                }
                
                setDirections(result) {
                    console.log('🗺️ Mock: Setting directions on map');
                    // Direction result is handled by DirectionsService
                }
                
                setMap(map) {
                    console.log('🗺️ Mock: Setting directions renderer on map');
                }
            },
            
            LatLngBounds: class MockLatLngBounds {
                extend(point) {
                    console.log('📍 Mock: Extending bounds to include', point);
                }
            },
            
            Size: class MockSize {
                constructor(width, height) {
                    this.width = width;
                    this.height = height;
                }
            },
            
            TravelMode: {
                DRIVING: 'DRIVING',
                WALKING: 'WALKING',
                TRANSIT: 'TRANSIT'
            }
        }
    };
    
    // Call the original callback
    if (window.initGoogleMaps) {
        window.initGoogleMaps();
    }
};

// Enhanced app opening for mobile maps
window.enhancedMobileMapOpening = function(latitude, longitude, name) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    // Create a comprehensive map opening dialog
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 10004;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        font-family: Inter, sans-serif;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 400px;
        width: 100%;
        text-align: center;
        box-shadow: 0 25px 80px rgba(0,0,0,0.3);
    `;

    let optionsHtml = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">🗺️</div>
        <h3 style="margin: 0 0 1rem 0; color: #1e293b; font-size: 1.5rem;">Chọn ứng dụng bản đồ</h3>
        <p style="margin: 0 0 2rem 0; color: #64748b; font-size: 0.9rem;">📍 <strong>${name}</strong></p>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
    `;

    if (isIOS) {
        optionsHtml += `
            <button onclick="window.location.href='http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d'" style="
                background: linear-gradient(135deg, #007AFF, #0051D5);
                color: white;
                border: none;
                padding: 1rem;
                border-radius: 12px;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.2s;
            " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                🍎 Mở trong Apple Maps
            </button>
        `;
    }

    if (isAndroid) {
        optionsHtml += `
            <button onclick="window.location.href='google.navigation:q=${latitude},${longitude}'" style="
                background: linear-gradient(135deg, #4285F4, #1a73e8);
                color: white;
                border: none;
                padding: 1rem;
                border-radius: 12px;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.2s;
            " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                📱 Mở trong Google Maps App
            </button>
        `;
    }

    optionsHtml += `
            <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving', '_blank')" style="
                background: linear-gradient(135deg, #f97316, #ea580c);
                color: white;
                border: none;
                padding: 1rem;
                border-radius: 12px;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.2s;
            " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                🌐 Mở trong trình duyệt
            </button>
            <button onclick="this.closest('.demo-map-popup').remove()" style="
                background: #e2e8f0;
                color: #64748b;
                border: none;
                padding: 0.75rem;
                border-radius: 12px;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.2s;
            " onmouseover="this.style.background='#cbd5e1'" onmouseout="this.style.background='#e2e8f0'">
                Hủy
            </button>
        </div>
    `;

    content.innerHTML = optionsHtml;
    popup.appendChild(content);
    popup.className = 'demo-map-popup';
    document.body.appendChild(popup);
};

// Auto-initialize mock if Google Maps fails to load
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Google Maps to load
    setTimeout(() => {
        if (typeof google === 'undefined' || !google.maps) {
            console.warn('Google Maps API not loaded, switching to demo mode');
            window.mockGoogleMaps();
            
            // Show enhanced demo mode notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #fef3c7, #fed7aa);
                color: #92400e;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: Inter, sans-serif;
                font-size: 14px;
                text-align: center;
                border: 1px solid #fcd34d;
                max-width: 90vw;
                backdrop-filter: blur(10px);
            `;
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
                    <span style="font-size: 1.2rem;">🎯</span>
                    <div>
                        <div style="font-weight: 700;">DEMO MODE</div>
                        <div style="font-size: 0.8rem; margin-top: 0.25rem;">Bản đồ sẽ hoạt động đầy đủ khi có Google Maps API key</div>
                    </div>
                </div>
            `;
            document.body.appendChild(notification);
            
            // Auto-hide notification after 6 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(-50%) translateY(-100px)';
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 6000);
        }
    }, 2000);
});

// Enhanced error handling for the main app
window.addEventListener('error', function(e) {
    if (e.message.includes('google') || e.message.includes('maps')) {
        console.warn('Maps-related error, app will continue in demo mode:', e.message);
        e.preventDefault();
    }
});

console.log('🚀 Enhanced demo setup script loaded - comprehensive fallback ready for Google Maps API'); 