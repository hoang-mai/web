import { pushNotificationSubscribe } from "./api.ts";
import { post } from "./callApi.ts";

export function serviceWorkerRegistration() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(async (reg) => {
        console.log("Service Worker registered");

        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            import.meta.env.VITE_VAPID_PUBLIC_KEY
          ),
        });

        // Gửi subscription lên server
        post(pushNotificationSubscribe, { subscription });
        console.log("Subscription sent to server", subscription);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);

  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
