import type React from "react";
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string; ar?: boolean; "ar-modes"?: string; "camera-controls"?: boolean; "shadow-intensity"?: string;
      };
    }
  }
}
export {};
