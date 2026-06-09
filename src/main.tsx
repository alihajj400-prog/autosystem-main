import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
if (supabaseUrl) {
  try {
    const origin = new URL(supabaseUrl).origin;
    if (!document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = origin;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }
  } catch {
    // ignore invalid URL
  }
}

createRoot(document.getElementById("root")!).render(<App />);
