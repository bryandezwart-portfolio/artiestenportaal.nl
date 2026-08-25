"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pad = usePathname();

  return (
    <div key={pad} className="bdz-page-in">
      <style>{`
        @keyframes bdz-page-in {
          from {
            opacity: 0;
            filter: blur(8px);
            transform: translateY(8px) scale(0.995);
          }
          to {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0) scale(1);
          }
        }
        .bdz-page-in {
          animation: bdz-page-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .bdz-page-in { animation: none; }
        }
      `}</style>
      {children}
    </div>
  );
}
