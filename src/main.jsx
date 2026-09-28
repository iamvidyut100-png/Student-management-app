import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

window.addEventListener("error", (event) => {
  const root = document.getElementById("root");
  if (root && !root.dataset.rendered) {
    root.innerHTML = '<div style="padding:24px;font-family:Arial,sans-serif;color:#111827"><h2 style="margin:0 0 12px">Student Management</h2><p style="color:#dc2626;font-weight:600">App loading error</p><pre style="white-space:pre-wrap;background:#f3f4f6;padding:12px;border-radius:8px;overflow:auto">' + String(event.error?.stack || event.message || "Unknown error") + '</pre></div>';
  }
});

window.addEventListener("unhandledrejection", (event) => {
  const root = document.getElementById("root");
  if (root && !root.dataset.rendered) {
    root.innerHTML = '<div style="padding:24px;font-family:Arial,sans-serif;color:#111827"><h2 style="margin:0 0 12px">Student Management</h2><p style="color:#dc2626;font-weight:600">App startup error</p><pre style="white-space:pre-wrap;background:#f3f4f6;padding:12px;border-radius:8px;overflow:auto">' + String(event.reason?.stack || event.reason || "Unknown error") + '</pre></div>';
  }
});

try {
  createRoot(document.getElementById("root")).render(
    <React.StrictMode><App /></React.StrictMode>
  );
  document.getElementById("root").dataset.rendered = "true";
} catch (error) {
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = '<div style="padding:24px;font-family:Arial,sans-serif;color:#111827"><h2 style="margin:0 0 12px">Student Management</h2><p style="color:#dc2626;font-weight:600">App failed to start</p><pre style="white-space:pre-wrap;background:#f3f4f6;padding:12px;border-radius:8px;overflow:auto">' + String(error?.stack || error) + '</pre></div>';
  }
}
