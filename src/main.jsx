import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const showError = (title, error) => {
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML =
    '<div style="padding:24px;font-family:Arial,sans-serif;color:#111827">' +
    '<h2 style="margin:0 0 12px">Student Management</h2>' +
    '<p style="color:#dc2626;font-weight:600">' + title + '</p>' +
    '<pre style="white-space:pre-wrap;background:#f3f4f6;padding:12px;border-radius:8px;overflow:auto">' +
    String(error?.stack || error?.message || error || "Unknown error") +
    "</pre></div>";
};

window.addEventListener("error", (event) => {
  if (event.error || event.message) showError("App loading error", event.error || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  showError("App startup error", event.reason);
});

try {
  const root = document.getElementById("root");
  createRoot(root).render(
    <React.StrictMode><App /></React.StrictMode>
  );
} catch (error) {
  showError("App failed to start", error);
}
