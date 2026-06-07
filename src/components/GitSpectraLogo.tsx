/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export function GitSpectraLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        {/* Prism color gradient representing spectrum dispersion */}
        <linearGradient id="prism-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="35%" stopColor="#8B5CF6" />
          <stop offset="70%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        
        {/* Ambient glow definition */}
        <radialGradient id="prism-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Decorative ambient background blur */}
      <circle cx="50" cy="50" r="32" fill="url(#prism-glow)" />

      {/* White laser light beam entering from the left (representing input code analysis) */}
      <path 
        d="M 5 50 L 40 50" 
        stroke="#F4F4F5" 
        strokeWidth="3" 
        strokeLinecap="round"
        opacity="0.95"
      />
      
      {/* Git branch node integrated on the input beam */}
      <circle cx="18" cy="50" r="4.5" fill="#6366F1" stroke="#F4F4F5" strokeWidth="1.5" />
      <path 
        d="M 18 50 Q 23 41 33 41" 
        stroke="#F4F4F5" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        fill="none" 
      />
      <circle cx="33" cy="41" r="3" fill="#EC4899" />

      {/* Rainbow Spectrum output rails radiating from the prism's right face */}
      {/* Violet/Indigo */}
      <path d="M 55 45 L 88 24" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      {/* Blue/Cyan */}
      <path d="M 58 48 L 94 36" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      {/* Green */}
      <path d="M 60 52 L 95 52" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      {/* Orange */}
      <path d="M 58 56 L 92 68" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      {/* Red/Pink */}
      <path d="M 54 60 L 84 81" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />

      {/* Futuristic digital connection nodes at the end of spectrum lines */}
      <circle cx="88" cy="24" r="2.5" fill="#8B5CF6" />
      <circle cx="94" cy="36" r="2.5" fill="#06B6D4" />
      <circle cx="95" cy="52" r="2.5" fill="#10B981" />
      <circle cx="92" cy="68" r="2.5" fill="#F59E0B" />
      <circle cx="84" cy="81" r="2.5" fill="#EF4444" />

      {/* Sleek triangular glass refract glass prism container */}
      <polygon 
        points="50,18 25,68 75,68" 
        stroke="url(#prism-gradient)" 
        strokeWidth="4" 
        strokeLinejoin="round"
        fill="#09090b"
        fillOpacity="0.8"
      />

      {/* Glowing interior "S" curved light thread inside the prism */}
      <path 
        d="M 50 28 C 43 38, 57 44, 50 56 C 45 61, 36 56, 36 56" 
        stroke="url(#prism-gradient)" 
        strokeWidth="3" 
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}
