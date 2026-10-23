import { SLUG } from "../api";

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL;
  if (typeof window !== "undefined") {
    if (!url || url === "/" || url === "/api") {
      return "/api";
    }
    if (url.startsWith("/")) {
      return url.endsWith("/api") ? url : `${url}/api`.replace(/\/+/g, "/");
    }
  }
  if (!url) {
    const host = typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "localhost";
    url = `http://${host}:4000/api`;
  }
  url = url.trim().replace(/\/+$/, "");
  if (!url.endsWith("/api")) {
    url += "/api";
  }
  return url;
};

let eventSource = null;
let reconnectTimer = null;

export function initRealtimeSync() {
  if (typeof window === "undefined" || eventSource) return;

  const streamUrl = `${getBaseUrl()}/store/${SLUG}/realtime/events`;

  try {
    eventSource = new EventSource(streamUrl);

    const handleEvent = (type) => (e) => {
      let data = {};
      try {
        data = JSON.parse(e.data || "{}");
      } catch (err) {}

      window.dispatchEvent(
        new CustomEvent("app_realtime_event", {
          detail: { type, data, timestamp: Date.now() }
        })
      );
    };

    eventSource.addEventListener("order_updated", handleEvent("order_updated"));
    eventSource.addEventListener("order_created", handleEvent("order_created"));
    eventSource.addEventListener("product_updated", handleEvent("product_updated"));
    eventSource.addEventListener("boutique_updated", handleEvent("boutique_updated"));
    eventSource.addEventListener("category_updated", handleEvent("category_updated"));

    eventSource.onerror = () => {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(initRealtimeSync, 5000);
    };
  } catch (err) {
    console.warn("Realtime sync warning:", err);
  }
}

export function subscribeRealtime(callback) {
  const handler = (e) => {
    if (callback && e.detail) {
      callback(e.detail);
    }
  };
  window.addEventListener("app_realtime_event", handler);
  return () => window.removeEventListener("app_realtime_event", handler);
}
