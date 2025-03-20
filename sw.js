self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    clients.claim();
});


self.addEventListener("push", event => {
    const data = event.data.json();
    console.log("📩 Nhận Push Notification:", data);
  
    const options = {
        body: data.body,
        requireInteraction: true,
        icon: "/assets/image/landing_page_right.webp",
        badge: "/assets/image/landing_page_right.webp",
        vibrate: [200, 100, 200]
    };

    console.log("🚀 Hiển thị thông báo:", data.title, options);
  
    event.waitUntil(self.registration.showNotification(data.title, options));
  });
  
  // 🎯 Xử lý khi người dùng nhấn vào thông báo
  self.addEventListener("notificationclick", event => {
    event.notification.close();
    clients.openWindow("http://localhost:5500/components/login/login.html");
  });