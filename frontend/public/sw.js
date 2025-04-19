// sw.js (Service Worker)

self.addEventListener("push", (event) => {
  let data = { title: "Default Title", body: "Default Body" };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (err) {
    console.error("Push data is not valid JSON", err);
  }

  const { title, body } = data;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "frontend/public/vite.svg",  // nên dùng icon tồn tại thực sự
      badge: "frontend/public/vite.svg",
    })
  );
});
