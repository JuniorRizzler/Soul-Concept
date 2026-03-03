import React from "react";
import { createRoot } from "react-dom/client";
import MathStudyG9 from "./FreeStudyLib";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <MathStudyG9 />
    </React.StrictMode>
  );
}