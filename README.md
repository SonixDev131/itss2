# EatSmart - Food Discovery App

## 🍽️ Mô tả

EatSmart là ứng dụng mobile-first giúp bạn tìm kiếm nhà hàng và món ăn phù hợp với thời gian của bạn. Ứng dụng có tích hợp Google Maps với chức năng dẫn đường thật.

## ✨ Tính năng

### 🎯 Core Features

- **Tìm kiếm theo thời gian**: Nhập thời gian bắt đầu và kết thúc để tìm nhà hàng phù hợp
- **Bộ lọc thông minh**: Lọc theo gần nhất, phổ biến, đánh giá
- **Chi tiết món ăn**: Xem thông tin chi tiết, đánh giá và món liên quan
- **Đánh giá**: Xem và đọc reviews từ người dùng khác

### 🗺️ Google Maps Integration

- **Bản đồ thật**: Hiển thị vị trí nhà hàng trên Google Maps
- **Dẫn đường**: Chỉ đường từ vị trí hiện tại đến nhà hàng
- **Gọi điện**: Gọi trực tiếp đến nhà hàng
- **Mở ứng dụng Maps**: Tự động mở Google Maps hoặc Apple Maps trên mobile

### 📱 Mobile-Optimized

- **Responsive design**: Tối ưu cho tất cả kích thước màn hình
- **Touch-friendly**: Các nút và tương tác được thiết kế cho di động
- **PWA ready**: Có thể cài đặt như app native
- **iPhone support**: Hỗ trợ Safe Area và notch

## 🚀 Cài đặt và Chạy

### 1. Clone Repository

```bash
git clone <repository-url>
cd eatsmart-vanilla
```

### 2. Setup Google Maps API

#### Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Enable các APIs sau:
   - **Maps JavaScript API**
   - **Directions API**
   - **Places API** (optional)
   - **Geolocation API** (optional)

#### Bước 2: Tạo API Key

1. Vào **APIs & Services > Credentials**
2. Click **Create Credentials > API Key**
3. Copy API key được tạo

#### Bước 3: Cấu hình API Key (Khuyến nghị)

1. Click vào API key vừa tạo
2. Thêm **Application restrictions**:
   - **HTTP referrers** cho web app
   - Thêm domain của bạn (ví dụ: `localhost:*`, `yourdomain.com/*`)
3. Thêm **API restrictions**:
   - Chọn "Restrict key"
   - Chọn các APIs: Maps JavaScript API, Directions API

#### Bước 4: Cập nhật API Key vào Code

Mở file `index.html` và thay `YOUR_API_KEY` bằng API key thật:

```html
<!-- Thay đổi dòng này -->
<script
  async
  defer
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initGoogleMaps&libraries=geometry,places"
></script>

<!-- Thành -->
<script
  async
  defer
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&callback=initGoogleMaps&libraries=geometry,places"
></script>
```

#### Bước 5: **Enable Billing (Bắt buộc cho Maps API)**

🚨 **Quan trọng**: Google Maps API yêu cầu enable billing, ngay cả khi sử dụng free tier.

##### **Enable Billing:**

1. Trong Google Cloud Console, vào **"Billing"**
2. Click **"Link a billing account"**
3. Tạo billing account mới hoặc chọn account hiện có
4. Thêm thẻ tín dụng (không bị charge nếu ở trong free tier)

##### **Free Tier - $200 mỗi tháng:**

- **28,000 map loads** miễn phí/tháng
- **40,000 geolocation requests** miễn phí/tháng
- **40,000 directions requests** miễn phí/tháng
- Đủ cho hầu hết small/medium websites

##### **Set Usage Limits (Khuyến nghị):**

1. Vào **"APIs & Services" > "Quotas"**
2. Tìm APIs đã enable
3. Set daily limits để tránh vượt quá free tier:
   - Maps JavaScript API: 900 requests/day
   - Directions API: 1,300 requests/day
   - Places API: 1,300 requests/day

### 3. Chạy Ứng dụng

#### Sử dụng Python HTTP Server

```bash
# Python 3
python3 -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

#### Sử dụng Node.js HTTP Server

```bash
# Cài đặt http-server globally
npm install -g http-server

# Chạy server
http-server -p 8080
```

#### Sử dụng Live Server (VS Code Extension)

1. Cài đặt Live Server extension trong VS Code
2. Right-click vào `index.html` > "Open with Live Server"

### 4. Truy cập Ứng dụng

Mở trình duyệt và truy cập: `http://localhost:8080`

## 📱 Test trên Mobile

### Cách 1: Sử dụng ngrok (Khuyến nghị)

```bash
# Cài đặt ngrok
npm install -g ngrok

# Expose local server
ngrok http 8080
```

Sử dụng HTTPS URL từ ngrok để test trên mobile device thật.

### Cách 2: Local Network

1. Tìm IP address của máy: `ipconfig` (Windows) hoặc `ifconfig` (Mac/Linux)
2. Truy cập từ mobile: `http://YOUR_IP:8080`

### Cách 3: Chrome DevTools Mobile Simulation

1. Mở Chrome DevTools (F12)
2. Click biểu tượng mobile/tablet
3. Chọn device để simulate

## 🛠️ Cấu trúc File

```
eatsmart-vanilla/
├── index.html          # Main HTML file
├── styles.css          # Mobile-optimized styles
├── app.js              # Main JavaScript app with Maps integration
├── data.js             # Data management functions
├── data/
│   ├── restaurant.json # Restaurant data with coordinates
│   └── dishes.json     # Dishes data
└── README.md           # This file
```

## 🎯 Cách sử dụng

### 1. Trang Chủ

- Nhập thời gian bắt đầu và kết thúc
- Click "Find Restaurants" để tìm kiếm

### 2. Danh sách Nhà hàng

- Sử dụng các bộ lọc: Nearby, Popular, Rating
- Click vào nhà hàng để xem chi tiết món ăn

### 3. Chi tiết Món ăn

- Xem thông tin món ăn, đánh giá
- Click "Reviews" để xem đánh giá chi tiết
- Click "Map & Directions" để xem bản đồ và dẫn đường

### 4. Maps & Directions

- **Dẫn đường**: Click "Dẫn đường" để hiển thị route trên map
- **Gọi điện**: Click "Gọi điện" để gọi cho nhà hàng
- **Mobile**: Trên mobile sẽ tự động mở Google Maps app

## 🔧 Tùy chỉnh

### Thêm nhà hàng mới

Chỉnh sửa file `data/restaurant.json`:

```json
{
  "restaurant_id": 21,
  "name": "Tên nhà hàng",
  "address": "Địa chỉ",
  "contact": "0987654321",
  "rating": 4.5,
  "image_url": "https://example.com/image.jpg",
  "latitude": 21.0,
  "longitude": 105.0
}
```

### Thêm món ăn mới

Chỉnh sửa file `data/dishes.json`:

```json
{
  "dish_id": 101,
  "restaurant_id": 21,
  "name": "Tên món ăn",
  "description": "Mô tả món ăn",
  "price": 50000,
  "category": "Danh mục",
  "image_url": "https://example.com/dish.jpg"
}
```

## 🚨 Troubleshooting

### Maps không hiển thị

1. Kiểm tra API key có chính xác không
2. Kiểm tra các APIs đã được enable
3. Kiểm tra Console để xem lỗi
4. Kiểm tra domain restrictions

### Geolocation không hoạt động

1. Đảm bảo đang chạy trên HTTPS (hoặc localhost)
2. Allow location permission trong browser
3. Kiểm tra device có GPS không

### Performance Issues

1. Tối ưu images - sử dụng WebP format
2. Enable browser caching
3. Minify CSS/JS cho production

## 🌟 Features Roadmap

- [ ] **Offline support** với Service Workers
- [ ] **Push notifications** cho offers
- [ ] **User accounts** và favorites
- [ ] **Real-time tracking** của đơn hàng
- [ ] **AR menu** scanning
- [ ] **Voice search** functionality
- [ ] **Social sharing** features

## 📄 License

MIT License - feel free to use and modify.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

**Happy coding! 🚀**
# itss2
