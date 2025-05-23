(self as unknown as ServiceWorkerGlobalScope).addEventListener(
  "push",
  (event: PushEvent) => {
    // Kiểm tra xem dữ liệu có tồn tại và parse JSON
    const data = event.data
      ? event.data.json()
      : { title: "Default Title", body: "Default Body" };

    const { title, body } = data;

    // Hiển thị thông báo push
    (self as unknown as ServiceWorkerGlobalScope).registration.showNotification(
      title,
      {
        body,
        icon: "/icon.png", // icon hiển thị trong notification
      }
    );
  }
);
