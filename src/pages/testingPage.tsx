// ToastTestPage.tsx
import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function debugToast(message: string, type: "success" | "error" = "success") {
  console.log(`[DEBUG TOAST] firing: ${message}`, new Date().toISOString());
  if (type === "success") toast.success(message);
  else toast.error(message);
}


export default function ToastTestPage() {
  const showRandomToast = () => {
    toast.info("Random toast: " + Math.floor(Math.random() * 1000));
  };

  const showDuplicateToast = () => {
    toast.warn("Duplicate toast — should appear every time?");
  };

  const showIdToast = () => {
    toast.error("Toast with fixed ID", { toastId: "fixedId" });
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Toast Debug Page</h1>
      <button onClick={showRandomToast} style={{ marginRight: 10 }}>
        Show Random Toast
      </button>
      <button onClick={showDuplicateToast} style={{ marginRight: 10 }}>
        Show Duplicate Toast
      </button>
      <button onClick={showIdToast} style={{ marginRight: 10 }}>
        Show Fixed-ID Toast
      </button>
      <button onClick={dismissAll}>Dismiss All</button>
    </div>
  );
}
