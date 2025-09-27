import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SlotProvider } from "./context/SlotContext"; // ✅ correct path

createRoot(document.getElementById("root")!).render(
  <SlotProvider>
    <App />
  </SlotProvider>
);
