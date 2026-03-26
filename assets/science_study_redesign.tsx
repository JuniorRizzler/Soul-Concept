import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ArrowLeft, CheckCircle, Circle, Leaf, Beaker, Zap, Globe, ChevronRight, FileText, Lightbulb, Target, X, ClipboardList, Award, Trophy, Star, Flame, Brain, Sparkles } from 'lucide-react';

// ── SOUL UI · Light Mode Style Injection ─────────────────────────────────────
const SoulStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

    :root {
      --s-bg:       #f5f4f0;
      --s-surface:  #ffffff;
      --s-card:     #ffffff;
      --s-card2:    #fafaf8;
      --s-border:   rgba(0,0,0,0.07);
      --s-accent:   #0066ff;
      --s-accent2:  #7c3aed;
      --s-accent3:  #059669;
      --s-text:     #1a1a2e;
      --s-muted:    #6b7280;
    }

    /* --- Base ------------------------------- */
    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { background: var(--s-bg) !important; }

    /* --- Typography -------------------------- */
    h1, h2, h3, h4, h5, h6 { font-family: 'Syne', sans-serif; }
    body, p, span, div, input, button, label, td, th, li {
      font-family: 'DM Sans', sans-serif;
    }
    code, pre, .mono { font-family: 'Space Mono', monospace; }

    /* --- Scrollbar --------------------------- */
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: #f0f0ec; }
    ::-webkit-scrollbar-thumb { background: rgba(0,102,255,0.25); border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(0,102,255,0.45); }

    /* --- Subtle dot grid ---------------------- */
    .soul-grid {
      background-image: radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px);
      background-size: 28px 28px;
      background-color: #f5f4f0;
    }

    /* --- Corner brackets --------------------- */
    .soul-bracket { position: relative; }
    .soul-bracket::before, .soul-bracket::after {
      content: ''; position: absolute;
      width: 8px; height: 8px;
      border-color: rgba(0,102,255,0.3); border-style: solid;
    }
    .soul-bracket::before { top: 0; left: 0; border-width: 1.5px 0 0 1.5px; }
    .soul-bracket::after  { bottom: 0; right: 0; border-width: 0 1.5px 1.5px 0; }

    /* --- Shadows ----------------------------- */
    .soul-shadow { box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05); }
    .soul-shadow-lg { box-shadow: 0 2px 8px rgba(0,0,0,0.07), 0 12px 32px rgba(0,0,0,0.06); }
    .glow-blue   { box-shadow: 0 0 0 1px rgba(0,102,255,0.12), 0 4px 20px rgba(0,102,255,0.08); }

    /* --- Animate utilities ------------------- */
    @keyframes soul-float {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-6px); }
    }
    @keyframes soul-gradient {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes soul-ping {
      0%   { transform: scale(1);   opacity: 0.6; }
      100% { transform: scale(2);   opacity: 0; }
    }
    .animate-soul-float    { animation: soul-float 3.5s ease-in-out infinite; }
    .animate-soul-gradient { animation: soul-gradient 5s ease infinite; background-size: 200% 200%; }
    .animate-soul-ring     { animation: soul-ping 1.8s ease-out infinite; }
    .animate-fadeIn        { animation: fadeIn 0.35s ease both; }

    /* -------------------------------------------------------------------------
       LIGHT MODE OVERRIDES -- restoring Tailwind defaults to clean light values
       ------------------------------------------------------------------------- */

    /* Backgrounds -- undo dark overrides */
    .bg-white    { background-color: #ffffff !important; }
    .bg-gray-50  { background-color: #f9fafb !important; }
    .bg-gray-100 { background-color: #f3f4f6 !important; }
    .bg-gray-200 { background-color: #e5e7eb !important; }

    /* The dark hex overrides from sed -- reset them */
    [class*="bg-white"], [class*="bg-white"], [class*="bg-white"],
    [class*="bg-gray-100"], [class*="bg-gray-100"], [class*="bg-white"],
    [class*="bg-gray-50"], [class*="bg-gray-100"], [class*="bg-[#1c1c30]"] {
      background-color: #ffffff !important;
    }
    [class*="bg-[#f5f4f0]"], [class*="bg-blue-50"], [class*="bg-green-50"],
    [class*="bg-red-50"], [class*="bg-[#180f04]"], [class*="bg-[#100a1e]"],
    [class*="bg-[#0d0a1e]"], [class*="bg-[#061010]"], [class*="bg-[#060f12]"],
    [class*="bg-[#060e18]"], [class*="bg-[#f5f4f0]"], [class*="bg-[#f5f4f0]"],
    [class*="bg-gray-50"], [class*="bg-[#f5f4f0]"] {
      background-color: #f5f4f0 !important;
    }
    [class*="bg-[#f8f9ff]"], [class*="bg-[#f8f9ff]"] {
      background-color: #f8f9ff !important;
    }

    /* Text -- restore dark text */
    .text-gray-800 { color: #111827 !important; }
    .text-gray-200 { color: #1f2937 !important; }
    .text-gray-700 { color: #374151 !important; }
    .text-gray-600 { color: #4b5563 !important; }
    .text-gray-500 { color: #6b7280 !important; }

    /* Colored text -- keep vivid (these are fine already) */
    .text-blue-300   { color: #2563eb !important; }
    .text-green-300  { color: #059669 !important; }
    .text-red-300    { color: #dc2626 !important; }
    .text-amber-300  { color: #d97706 !important; }
    .text-purple-300 { color: #7c3aed !important; }
    .text-indigo-300 { color: #4f46e5 !important; }
    .text-teal-300   { color: #0d9488 !important; }
    .text-cyan-300   { color: #0891b2 !important; }
    .text-orange-300 { color: #ea580c !important; }
    .text-yellow-300 { color: #ca8a04 !important; }
    .text-pink-300   { color: #db2777 !important; }

    /* Borders -- restore subtle light borders */
    [class*="border-gray-100"],  [class*="border-white\/8"]  { border-color: rgba(0,0,0,0.07) !important; }
    [class*="border-gray-200"], [class*="border-white\/10"] { border-color: rgba(0,0,0,0.08) !important; }
    [class*="border-gray-200"], [class*="border-white\/15"] { border-color: rgba(0,0,0,0.10) !important; }
    [class*="border-gray-300"], [class*="border-white\/20"] { border-color: rgba(0,0,0,0.12) !important; }

    /* Progress bars */
    [class*="bg-gray-200"], [class*="bg-white\/10"] { background-color: rgba(0,0,0,0.08) !important; }

    /* Inputs -- light mode */
    input, textarea, select {
      background-color: #ffffff !important;
      border-color: rgba(0,0,0,0.12) !important;
      color: #1a1a2e !important;
    }
    input::placeholder, textarea::placeholder { color: #9ca3af !important; }
    input:focus, textarea:focus {
      border-color: rgba(0,102,255,0.4) !important;
      box-shadow: 0 0 0 3px rgba(0,102,255,0.08) !important;
      outline: none !important;
    }

    /* Tables */
    th { background-color: #f3f4f6 !important; color: #111827 !important; }
    td { border-color: rgba(0,0,0,0.06) !important; }
    tr.bg-\[\#13131d\], tr.bg-\[\#0f0f18\] { background-color: #ffffff !important; }
    tr:nth-child(even) { background-color: #f9fafb !important; }

    /* Modals -- light */
    [class*="fixed inset-0"] > [class*="rounded-3xl"],
    [class*="fixed inset-0"] > [class*="rounded-2xl"] {
      background-color: #ffffff !important;
      border: 1px solid rgba(0,0,0,0.08) !important;
      box-shadow: 0 8px 48px rgba(0,0,0,0.12) !important;
    }

    /* Card shadows -- crisp light mode */
    [class*="rounded-2xl"][class*="shadow-lg"],
    [class*="rounded-xl"][class*="shadow-lg"],
    [class*="rounded-xl"][class*="shadow-md"] {
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05) !important;
    }

    /* Hover card lift */
    [class*="hover:shadow-xl"]:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.09), 0 16px 40px rgba(0,0,0,0.07) !important;
    }

    /* Info box panels -- restore proper light tints */
    .bg-blue-100, .bg-blue-100.rounded-lg, .bg-blue-100.rounded-xl  { background-color: #dbeafe !important; border: none !important; }
    .bg-green-100, .bg-green-100.rounded-lg, .bg-green-100.rounded-xl { background-color: #dcfce7 !important; border: none !important; }
    .bg-red-100, .bg-red-100.rounded-lg   { background-color: #fee2e2 !important; border: none !important; }
    .bg-amber-100, .bg-amber-100.rounded-lg, .bg-amber-100.rounded-xl { background-color: #fef3c7 !important; border: none !important; }
    .bg-yellow-100, .bg-yellow-100.rounded-lg { background-color: #fef9c3 !important; border: none !important; }
    .bg-purple-100, .bg-purple-100.rounded-lg, .bg-purple-100.rounded-xl { background-color: #f3e8ff !important; border: none !important; }
    .bg-indigo-100, .bg-indigo-100.rounded-lg, .bg-indigo-100.rounded-xl { background-color: #e0e7ff !important; border: none !important; }
    .bg-teal-100, .bg-teal-100.rounded-lg { background-color: #ccfbf1 !important; border: none !important; }
    .bg-cyan-100, .bg-cyan-100.rounded-lg { background-color: #cffafe !important; border: none !important; }
    .bg-pink-100   { background-color: #fce7f3 !important; border: none !important; }
    .bg-orange-100 { background-color: #ffedd5 !important; border: none !important; }
    .bg-rose-100   { background-color: #ffe4e6 !important; border: none !important; }

    /* Restore standard subject palette bg-blue-50 etc */
    .bg-blue-50    { background-color: #eff6ff !important; }
    .bg-green-50   { background-color: #f0fdf4 !important; }
    .bg-red-50     { background-color: #fef2f2 !important; }
    .bg-amber-50   { background-color: #fffbeb !important; }
    .bg-purple-50  { background-color: #faf5ff !important; }
    .bg-indigo-50  { background-color: #eef2ff !important; }
    .bg-teal-50    { background-color: #f0fdfa !important; }
    .bg-cyan-50    { background-color: #ecfeff !important; }
    .bg-yellow-50  { background-color: #fefce8 !important; }
    .bg-orange-50  { background-color: #fff7ed !important; }
    .bg-slate-50   { background-color: #f8fafc !important; }
    .bg-sky-50     { background-color: #f0f9ff !important; }
    .bg-violet-50  { background-color: #f5f3ff !important; }
    .bg-pink-50    { background-color: #fdf2f8 !important; }
    .bg-emerald-50 { background-color: #ecfdf5 !important; }

    /* Colored text -- restore original dark values */
    .text-blue-800   { color: #1e40af !important; }
    .text-blue-700   { color: #1d4ed8 !important; }
    .text-green-800  { color: #166534 !important; }
    .text-green-700  { color: #15803d !important; }
    .text-red-800    { color: #991b1b !important; }
    .text-red-700    { color: #b91c1c !important; }
    .text-amber-800  { color: #92400e !important; }
    .text-amber-700  { color: #b45309 !important; }
    .text-yellow-800 { color: #854d0e !important; }
    .text-purple-800 { color: #581c87 !important; }
    .text-purple-700 { color: #7e22ce !important; }
    .text-indigo-800 { color: #312e81 !important; }
    .text-indigo-700 { color: #4338ca !important; }
    .text-teal-800   { color: #115e59 !important; }
    .text-teal-700   { color: #0f766e !important; }
    .text-orange-800 { color: #9a3412 !important; }
    .text-orange-700 { color: #c2410c !important; }
    .text-cyan-800   { color: #155e75 !important; }
    .text-cyan-700   { color: #0e7490 !important; }

    /* Diagram gradient panels -- restore light bg */
    [class*="bg-gradient-to-br"][class*="rounded-xl"][class*="p-8"] {
      background: unset !important;
      border: none !important;
    }

    /* SVG text -- back to dark */
    svg text { fill: #374151 !important; }

    /* Hover states */
    .hover\:bg-gray-50:hover  { background-color: #f9fafb !important; }
    .hover\:bg-gray-100:hover { background-color: #f3f4f6 !important; }
    .hover\:border-gray-200:hover { border-color: #e5e7eb !important; }
    .hover\:border-gray-300:hover { border-color: #d1d5db !important; }

    /* L.Y.N.E AI panel -- clean white */
    .bg-\[\#0e0e1a\] { background-color: #ffffff !important; }
    [class*="bg-gray-100"] { background-color: #f3f4f6 !important; }
    [class*="bg-gray-100"] { background-color: #f3f4f6 !important; }

    /* Mark complete button */
    button[class*="bg-green-100"] {
      background-color: #dcfce7 !important;
      border-color: rgba(34,197,94,0.3) !important;
      color: #166534 !important;
    }

    /* Floating AI button -- vivid blue for light mode */
    .glow-cyan { box-shadow: 0 4px 20px rgba(0,102,255,0.2), 0 0 0 1px rgba(0,102,255,0.15) !important; }
  `}</style>
);
// Diagram Components
const LewisDotDiagram = () => (
  <div className="bg-gradient-to-br from-[#0a0f1e] to-[#0d0a1e] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Lewis Dot Diagram Examples</h4>
    <div className="flex justify-around items-center flex-wrap gap-8">
      {[
        { symbol: 'H', dots: 1, name: 'Hydrogen', group: 1 },
        { symbol: 'C', dots: 4, name: 'Carbon', group: 14 },
        { symbol: 'N', dots: 5, name: 'Nitrogen', group: 15 },
        { symbol: 'O', dots: 6, name: 'Oxygen', group: 16 },
        { symbol: 'F', dots: 7, name: 'Fluorine', group: 17 },
        { symbol: 'Ne', dots: 8, name: 'Neon', group: 18 }
      ].map((element) => (
        <div key={element.symbol} className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-2">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{element.symbol}</span>
              </div>
            </div>
            {/* Draw dots around the symbol */}
            {Array.from({ length: element.dots }).map((_, i) => {
              const angle = (i * 360) / 8 + 45; // Distribute evenly, starting from top-right
              const rad = (angle * Math.PI) / 180;
              const x = 50 + 35 * Math.cos(rad);
              const y = 50 + 35 * Math.sin(rad);
              return (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-red-500 rounded-full"
                  style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                />
              );
            })}
          </div>
          <p className="text-sm font-medium text-gray-600">{element.name}</p>
          <p className="text-xs text-gray-500">{element.dots} valence e⁻</p>
          <p className="text-xs text-blue-600 font-semibold">Group {element.group}</p>
        </div>
      ))}
    </div>
    <div className="mt-6 bg-blue-100 rounded-lg p-4">
      <p className="text-sm text-blue-300 text-center">
        <span className="font-bold">Key Point:</span> The number of dots = number of valence electrons = group number (for main groups)
      </p>
    </div>
  </div>
);

const PhotosynthesisDiagram = () => (
  <div className="bg-gradient-to-br from-[#060f0a] to-[#081408] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Photosynthesis Equation</h4>
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {/* Reactants */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-3xl font-bold">6CO₂</p>
            <p className="text-xs">Carbon Dioxide</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">From Air</p>
      </div>

      <div className="text-4xl text-gray-600">+</div>

      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-3xl font-bold">6H₂O</p>
            <p className="text-xs">Water</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">From Soil</p>
      </div>

      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
          <p className="text-white text-2xl">☀️</p>
        </div>
        <p className="text-xs text-gray-600 mt-1">Sunlight Energy</p>
      </div>

      <div className="text-4xl text-green-600">→</div>

      {/* Products */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-2xl font-bold">C₆H₁₂O₆</p>
            <p className="text-xs">Glucose</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">Sugar (Food)</p>
      </div>

      <div className="text-4xl text-gray-600">+</div>

      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-3xl font-bold">6O₂</p>
            <p className="text-xs">Oxygen</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">Released to Air</p>
      </div>
    </div>

    <div className="mt-6 bg-green-100 rounded-lg p-4">
      <p className="text-sm text-green-300 text-center">
        <span className="font-bold">Key Point:</span> Plants use sunlight energy to convert CO₂ and water into glucose (their food) and oxygen (which we breathe)!
      </p>
    </div>
  </div>
);

const CellRespirationDiagram = () => (
  <div className="bg-gradient-to-br from-[#150808] to-[#180d04] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Cellular Respiration Equation</h4>
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {/* Reactants */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-2xl font-bold">C₆H₁₂O₆</p>
            <p className="text-xs">Glucose</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">Food</p>
      </div>

      <div className="text-4xl text-gray-600">+</div>

      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-3xl font-bold">6O₂</p>
            <p className="text-xs">Oxygen</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">From Air</p>
      </div>

      <div className="text-4xl text-red-600">→</div>

      {/* Products */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-3xl font-bold">6CO₂</p>
            <p className="text-xs">Carbon Dioxide</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">Released to Air</p>
      </div>

      <div className="text-4xl text-gray-600">+</div>

      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-3xl font-bold">6H₂O</p>
            <p className="text-xs">Water</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">Released</p>
      </div>

      <div className="text-4xl text-gray-600">+</div>

      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-yellow-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-3xl font-bold">ATP</p>
            <p className="text-xs">Energy</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">For Life!</p>
      </div>
    </div>

    <div className="mt-6 bg-red-100 rounded-lg p-4">
      <p className="text-sm text-red-300 text-center">
        <span className="font-bold">Key Point:</span> Opposite of photosynthesis! Organisms break down glucose with oxygen to release energy (ATP) for living.
      </p>
    </div>
  </div>
);

const FoodChainDiagram = () => (
  <div className="bg-gradient-to-br from-[#181208] to-[#180f04] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Terrestrial Food Chain Example</h4>
    
    <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
      {/* Grass */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-green-500 flex items-center justify-center shadow-lg mb-2">
          <span className="text-6xl">🌾</span>
        </div>
        <p className="font-bold text-green-300">Grass</p>
        <p className="text-xs text-gray-600">Producer</p>
        <p className="text-xs text-green-600 font-bold mt-1">10,000 kcal</p>
      </div>

      <div className="text-3xl text-gray-600">→</div>

      {/* Grasshopper */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-yellow-500 flex items-center justify-center shadow-lg mb-2">
          <span className="text-6xl">🦗</span>
        </div>
        <p className="font-bold text-yellow-800">Grasshopper</p>
        <p className="text-xs text-gray-600">Primary Consumer</p>
        <p className="text-xs text-yellow-600 font-bold mt-1">1,000 kcal</p>
      </div>

      <div className="text-3xl text-gray-600">→</div>

      {/* Mouse */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg mb-2">
          <span className="text-6xl">🐭</span>
        </div>
        <p className="font-bold text-orange-800">Mouse</p>
        <p className="text-xs text-gray-600">Secondary Consumer</p>
        <p className="text-xs text-orange-600 font-bold mt-1">100 kcal</p>
      </div>

      <div className="text-3xl text-gray-600">→</div>

      {/* Snake */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-red-500 flex items-center justify-center shadow-lg mb-2">
          <span className="text-6xl">🐍</span>
        </div>
        <p className="font-bold text-red-300">Snake</p>
        <p className="text-xs text-gray-600">Tertiary Consumer</p>
        <p className="text-xs text-red-600 font-bold mt-1">10 kcal</p>
      </div>
    </div>

    <div className="bg-amber-100 rounded-lg p-4">
      <p className="text-sm text-amber-300 text-center">
        <span className="font-bold">Energy Flow:</span> Notice how only 10% of energy transfers to each level (10,000 → 1,000 → 100 → 10)
      </p>
    </div>
  </div>
);

const AquaticFoodChainDiagram = () => (
  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Aquatic Food Chain Example</h4>
    
    <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
      {/* Phytoplankton */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-green-400 flex items-center justify-center shadow-lg mb-2">
          <span className="text-6xl">🦠</span>
        </div>
        <p className="font-bold text-green-300">Phytoplankton</p>
        <p className="text-xs text-gray-600">Producer</p>
        <p className="text-xs text-green-600 font-bold mt-1">50,000 kcal</p>
      </div>

      <div className="text-3xl text-blue-600">→</div>

      {/* Small Fish */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-yellow-400 flex items-center justify-center shadow-lg mb-2">
          <span className="text-6xl">🐠</span>
        </div>
        <p className="font-bold text-yellow-800">Small Fish</p>
        <p className="text-xs text-gray-600">Primary Consumer</p>
        <p className="text-xs text-yellow-600 font-bold mt-1">5,000 kcal</p>
      </div>

      <div className="text-3xl text-blue-600">→</div>

      {/* Medium Fish */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-orange-400 flex items-center justify-center shadow-lg mb-2">
          <span className="text-6xl">🐟</span>
        </div>
        <p className="font-bold text-orange-800">Medium Fish</p>
        <p className="text-xs text-gray-600">Secondary Consumer</p>
        <p className="text-xs text-orange-600 font-bold mt-1">500 kcal</p>
      </div>

      <div className="text-3xl text-blue-600">→</div>

      {/* Shark */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg mb-2">
          <span className="text-6xl">🦈</span>
        </div>
        <p className="font-bold text-blue-100">Shark</p>
        <p className="text-xs text-blue-200">Tertiary Consumer</p>
        <p className="text-xs text-blue-100 font-bold mt-1">50 kcal</p>
      </div>
    </div>

    <div className="bg-blue-100 rounded-lg p-4">
      <p className="text-sm text-blue-300 text-center">
        <span className="font-bold">Ocean Food Chain:</span> Starts with microscopic phytoplankton that use sunlight to make food through photosynthesis
      </p>
    </div>
  </div>
);

const NitrogenCycleDiagram = () => (
  <div className="bg-gradient-to-br from-[#0d0a1e] to-[#120a1e] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">The Nitrogen Cycle</h4>
    <div className="relative h-96">
      <svg viewBox="0 0 500 400" className="w-full h-full">
        {/* Atmosphere */}
        <rect x="200" y="10" width="100" height="60" rx="10" fill="#93C5FD" stroke="#3B82F6" strokeWidth="2"/>
        <text x="250" y="35" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1E40AF">Atmosphere</text>
        <text x="250" y="55" textAnchor="middle" fontSize="12" fill="#1E40AF">N₂ Gas (78%)</text>

        {/* Soil/Plants */}
        <rect x="50" y="150" width="100" height="60" rx="10" fill="#86EFAC" stroke="#22C55E" strokeWidth="2"/>
        <text x="100" y="175" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#15803D">Plants</text>
        <text x="100" y="195" textAnchor="middle" fontSize="11" fill="#15803D">Proteins</text>

        {/* Soil */}
        <rect x="200" y="200" width="100" height="60" rx="10" fill="#D97706" stroke="#92400E" strokeWidth="2"/>
        <text x="250" y="220" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#78350F">Soil</text>
        <text x="250" y="235" textAnchor="middle" fontSize="11" fill="#78350F">NH₃, NO₃⁻</text>
        <text x="250" y="250" textAnchor="middle" fontSize="10" fill="#78350F">(Bacteria)</text>

        {/* Animals */}
        <rect x="350" y="150" width="100" height="60" rx="10" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
        <text x="400" y="175" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#92400E">Animals</text>
        <text x="400" y="195" textAnchor="middle" fontSize="11" fill="#92400E">Proteins</text>

        {/* Decomposers */}
        <rect x="200" y="320" width="100" height="60" rx="10" fill="#A78BFA" stroke="#7C3AED" strokeWidth="2"/>
        <text x="250" y="345" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#5B21B6">Decomposers</text>
        <text x="250" y="365" textAnchor="middle" fontSize="10" fill="#5B21B6">(Bacteria/Fungi)</text>

        {/* Arrows and labels */}
        
        {/* Nitrogen Fixation */}
        <defs>
          <marker id="arrowhead1" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#22C55E" />
          </marker>
          <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6" />
          </marker>
          <marker id="arrowhead3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#F59E0B" />
          </marker>
        </defs>

        {/* Fixation: Atmosphere to Soil */}
        <path d="M 230 70 L 230 200" stroke="#22C55E" strokeWidth="3" fill="none" markerEnd="url(#arrowhead1)"/>
        <text x="190" y="130" fontSize="11" fill="#15803D" fontWeight="bold">Fixation</text>
        <text x="180" y="145" fontSize="9" fill="#15803D">(Lightning/</text>
        <text x="180" y="157" fontSize="9" fill="#15803D">Bacteria)</text>

        {/* Assimilation: Soil to Plants */}
        <path d="M 200 230 L 150 210" stroke="#22C55E" strokeWidth="3" fill="none" markerEnd="url(#arrowhead1)"/>
        <text x="150" y="225" fontSize="10" fill="#15803D" fontWeight="bold">Assimilation</text>

        {/* Consumption: Plants to Animals */}
        <path d="M 150 180 L 350 180" stroke="#F59E0B" strokeWidth="3" fill="none" markerEnd="url(#arrowhead3)"/>
        <text x="230" y="170" fontSize="11" fill="#92400E" fontWeight="bold">Eaten</text>

        {/* Death/Waste: Animals to Decomposers */}
        <path d="M 400 210 L 300 320" stroke="#7C3AED" strokeWidth="3" fill="none" markerEnd="url(#arrowhead1)"/>
        <text x="340" y="270" fontSize="10" fill="#5B21B6" fontWeight="bold">Death/Waste</text>

        {/* Death/Waste: Plants to Decomposers */}
        <path d="M 100 210 L 200 320" stroke="#7C3AED" strokeWidth="3" fill="none" markerEnd="url(#arrowhead1)"/>
        <text x="140" y="280" fontSize="10" fill="#5B21B6" fontWeight="bold">Death/Waste</text>

        {/* Ammonification: Decomposers to Soil */}
        <path d="M 250 320 L 250 260" stroke="#D97706" strokeWidth="3" fill="none" markerEnd="url(#arrowhead1)"/>
        <text x="260" y="295" fontSize="10" fill="#92400E" fontWeight="bold">Ammonification</text>

        {/* Denitrification: Soil to Atmosphere */}
        <path d="M 270 200 L 270 70" stroke="#3B82F6" strokeWidth="3" fill="none" markerEnd="url(#arrowhead2)"/>
        <text x="280" y="130" fontSize="10" fill="#1E40AF" fontWeight="bold">Denitrification</text>
      </svg>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
      <div className="bg-green-100 rounded-lg p-2">
        <span className="font-bold text-green-300">Fixation:</span>
        <p className="text-green-300">N₂ → NH₃ (bacteria/lightning)</p>
      </div>
      <div className="bg-orange-100 rounded-lg p-2">
        <span className="font-bold text-orange-800">Nitrification:</span>
        <p className="text-orange-300">NH₃ → NO₂⁻ → NO₃⁻ (bacteria)</p>
      </div>
      <div className="bg-purple-100 rounded-lg p-2">
        <span className="font-bold text-purple-800">Ammonification:</span>
        <p className="text-purple-300">Dead matter → NH₄⁺</p>
      </div>
      <div className="bg-blue-100 rounded-lg p-2">
        <span className="font-bold text-blue-300">Denitrification:</span>
        <p className="text-blue-300">NO₃⁻ → N₂ (back to air)</p>
      </div>
    </div>
  </div>
);

const DensityComparisonDiagram = () => (
  <div className="bg-gradient-to-br from-[#0a0f1e] to-[#0d0a1e] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Density Comparison - Floating vs Sinking</h4>
    
    <div className="grid md:grid-cols-2 gap-6">
      {/* Object Floats */}
      <div className="bg-white rounded-xl p-4 border-2 border-blue-300">
        <h5 className="text-center font-bold text-blue-300 mb-4">Object Floats ⬆️</h5>
        <div className="relative h-64 bg-gradient-to-b from-blue-100 to-blue-300 rounded-lg border-2 border-blue-400">
          {/* Water level */}
          <div className="absolute top-0 left-0 right-0 h-3/4 bg-blue-400/30 border-b-2 border-blue-500"></div>
          
          {/* Floating object */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-20 h-20 bg-yellow-400 rounded-lg border-2 border-yellow-600 flex items-center justify-center shadow-lg">
            <div className="text-center">
              <p className="text-xs font-bold">Wood</p>
              <p className="text-xs">0.6 g/cm³</p>
            </div>
          </div>
          
          {/* Water label */}
          <div className="absolute bottom-4 right-4 text-blue-300 font-bold text-sm">
            Water: 1.0 g/cm³
          </div>
        </div>
        <div className="mt-3 bg-green-100 rounded-lg p-3">
          <p className="text-sm text-green-300 text-center">
            <span className="font-bold">0.6 &lt; 1.0</span><br/>
            Object density &lt; Water density<br/>
            = FLOATS! 🎈
          </p>
        </div>
      </div>

      {/* Object Sinks */}
      <div className="bg-white rounded-xl p-4 border-2 border-red-300">
        <h5 className="text-center font-bold text-red-300 mb-4">Object Sinks ⬇️</h5>
        <div className="relative h-64 bg-gradient-to-b from-blue-100 to-blue-300 rounded-lg border-2 border-blue-400">
          {/* Water level */}
          <div className="absolute top-0 left-0 right-0 h-3/4 bg-blue-400/30 border-b-2 border-blue-500"></div>
          
          {/* Sinking object */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-gray-600 rounded-lg border-2 border-gray-800 flex items-center justify-center shadow-lg">
            <div className="text-center text-white">
              <p className="text-xs font-bold">Rock</p>
              <p className="text-xs">2.5 g/cm³</p>
            </div>
          </div>
          
          {/* Water label */}
          <div className="absolute bottom-4 right-4 text-blue-300 font-bold text-sm">
            Water: 1.0 g/cm³
          </div>
        </div>
        <div className="mt-3 bg-red-100 rounded-lg p-3">
          <p className="text-sm text-red-300 text-center">
            <span className="font-bold">2.5 &gt; 1.0</span><br/>
            Object density &gt; Water density<br/>
            = SINKS! ⚓
          </p>
        </div>
      </div>
    </div>

    <div className="mt-6 bg-indigo-100 rounded-lg p-4">
      <p className="text-sm text-indigo-300 text-center">
        <span className="font-bold">Rule:</span> If object density is less than liquid density → floats. If greater → sinks!
      </p>
    </div>
  </div>
);

const IonDiagram = () => (
  <div className="bg-gradient-to-br from-[#120a1e] to-[#180a14] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Ion Formation Examples</h4>
    
    {/* Cation Example - Sodium */}
    <div className="mb-8 bg-white rounded-xl p-6 shadow-md">
      <h5 className="text-lg font-bold text-gray-800 mb-4 text-center">Cation (Positive Ion) - Sodium</h5>
      <div className="flex items-center justify-center gap-8 flex-wrap">
        {/* Neutral Sodium */}
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-600 mb-3">Neutral Sodium (Na)</p>
          <svg viewBox="0 0 120 120" className="w-32 h-32 mx-auto">
            {/* Nucleus */}
            <circle cx="60" cy="60" r="12" fill="#DC2626"/>
            <text x="60" y="58" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">11p⁺</text>
            <text x="60" y="66" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">12n⁰</text>
            
            {/* Shell 1: 2 electrons */}
            <circle cx="60" cy="60" r="25" fill="none" stroke="#3B82F6" strokeWidth="2"/>
            <circle cx="85" cy="60" r="3" fill="#3B82F6"/>
            <circle cx="35" cy="60" r="3" fill="#3B82F6"/>
            
            {/* Shell 2: 8 electrons */}
            <circle cx="60" cy="60" r="40" fill="none" stroke="#10B981" strokeWidth="2"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 60 + 40 * Math.cos(rad);
              const y = 60 + 40 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="3" fill="#10B981"/>;
            })}
            
            {/* Shell 3: 1 electron */}
            <circle cx="60" cy="60" r="55" fill="none" stroke="#F59E0B" strokeWidth="2"/>
            <circle cx="115" cy="60" r="3" fill="#F59E0B"/>
          </svg>
          <p className="text-xs text-gray-600 mt-2">11 protons, 11 electrons</p>
          <p className="text-xs text-gray-600">Charge: 0 (neutral)</p>
        </div>

        {/* Arrow */}
        <div className="text-center">
          <div className="text-4xl text-red-500">→</div>
          <p className="text-xs text-red-600 font-bold mt-1">Loses 1e⁻</p>
        </div>

        {/* Sodium Ion */}
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-600 mb-3">Sodium Ion (Na⁺)</p>
          <svg viewBox="0 0 120 120" className="w-32 h-32 mx-auto">
            {/* Nucleus */}
            <circle cx="60" cy="60" r="12" fill="#DC2626"/>
            <text x="60" y="58" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">11p⁺</text>
            <text x="60" y="66" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">12n⁰</text>
            
            {/* Shell 1: 2 electrons */}
            <circle cx="60" cy="60" r="25" fill="none" stroke="#3B82F6" strokeWidth="2"/>
            <circle cx="85" cy="60" r="3" fill="#3B82F6"/>
            <circle cx="35" cy="60" r="3" fill="#3B82F6"/>
            
            {/* Shell 2: 8 electrons */}
            <circle cx="60" cy="60" r="40" fill="none" stroke="#10B981" strokeWidth="2"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 60 + 40 * Math.cos(rad);
              const y = 60 + 40 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="3" fill="#10B981"/>;
            })}
            
            {/* No third shell - lost the electron! */}
          </svg>
          <p className="text-xs text-gray-600 mt-2">11 protons, 10 electrons</p>
          <p className="text-xs font-bold text-red-600">Charge: +1 (cation)</p>
          <div className="mt-2 inline-block bg-red-100 px-3 py-1 rounded-full">
            <p className="text-xs text-red-300 font-bold">11p⁺ - 10e⁻ = +1</p>
          </div>
        </div>
      </div>
    </div>

    {/* Anion Example - Chlorine */}
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h5 className="text-lg font-bold text-gray-800 mb-4 text-center">Anion (Negative Ion) - Chlorine</h5>
      <div className="flex items-center justify-center gap-8 flex-wrap">
        {/* Neutral Chlorine */}
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-600 mb-3">Neutral Chlorine (Cl)</p>
          <svg viewBox="0 0 120 120" className="w-32 h-32 mx-auto">
            {/* Nucleus */}
            <circle cx="60" cy="60" r="12" fill="#DC2626"/>
            <text x="60" y="58" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">17p⁺</text>
            <text x="60" y="66" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">18n⁰</text>
            
            {/* Shell 1: 2 electrons */}
            <circle cx="60" cy="60" r="20" fill="none" stroke="#3B82F6" strokeWidth="1.5"/>
            <circle cx="80" cy="60" r="2.5" fill="#3B82F6"/>
            <circle cx="40" cy="60" r="2.5" fill="#3B82F6"/>
            
            {/* Shell 2: 8 electrons */}
            <circle cx="60" cy="60" r="35" fill="none" stroke="#10B981" strokeWidth="1.5"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 60 + 35 * Math.cos(rad);
              const y = 60 + 35 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="2.5" fill="#10B981"/>;
            })}
            
            {/* Shell 3: 7 electrons */}
            <circle cx="60" cy="60" r="50" fill="none" stroke="#F59E0B" strokeWidth="1.5"/>
            {[0, 51.4, 102.8, 154.3, 205.7, 257.1, 308.6].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 60 + 50 * Math.cos(rad);
              const y = 60 + 50 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="2.5" fill="#F59E0B"/>;
            })}
          </svg>
          <p className="text-xs text-gray-600 mt-2">17 protons, 17 electrons</p>
          <p className="text-xs text-gray-600">Charge: 0 (neutral)</p>
        </div>

        {/* Arrow */}
        <div className="text-center">
          <div className="text-4xl text-green-500">→</div>
          <p className="text-xs text-green-600 font-bold mt-1">Gains 1e⁻</p>
        </div>

        {/* Chloride Ion */}
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-600 mb-3">Chloride Ion (Cl⁻)</p>
          <svg viewBox="0 0 120 120" className="w-32 h-32 mx-auto">
            {/* Nucleus */}
            <circle cx="60" cy="60" r="12" fill="#DC2626"/>
            <text x="60" y="58" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">17p⁺</text>
            <text x="60" y="66" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">18n⁰</text>
            
            {/* Shell 1: 2 electrons */}
            <circle cx="60" cy="60" r="20" fill="none" stroke="#3B82F6" strokeWidth="1.5"/>
            <circle cx="80" cy="60" r="2.5" fill="#3B82F6"/>
            <circle cx="40" cy="60" r="2.5" fill="#3B82F6"/>
            
            {/* Shell 2: 8 electrons */}
            <circle cx="60" cy="60" r="35" fill="none" stroke="#10B981" strokeWidth="1.5"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 60 + 35 * Math.cos(rad);
              const y = 60 + 35 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="2.5" fill="#10B981"/>;
            })}
            
            {/* Shell 3: 8 electrons (gained 1!) */}
            <circle cx="60" cy="60" r="50" fill="none" stroke="#F59E0B" strokeWidth="1.5"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 60 + 50 * Math.cos(rad);
              const y = 60 + 50 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="2.5" fill="#F59E0B"/>;
            })}
          </svg>
          <p className="text-xs text-gray-600 mt-2">17 protons, 18 electrons</p>
          <p className="text-xs font-bold text-green-600">Charge: -1 (anion)</p>
          <div className="mt-2 inline-block bg-green-100 px-3 py-1 rounded-full">
            <p className="text-xs text-green-300 font-bold">17p⁺ - 18e⁻ = -1</p>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6 bg-purple-100 rounded-lg p-4">
      <div className="space-y-2 text-sm text-purple-800">
        <p><span className="font-bold">Cations (+):</span> Form when atoms LOSE electrons. More protons than electrons. Metals form cations.</p>
        <p><span className="font-bold">Anions (-):</span> Form when atoms GAIN electrons. More electrons than protons. Non-metals form anions.</p>
        <p><span className="font-bold">Why?</span> Atoms want a full outer shell (8 electrons = stable). Easier to lose 1-2 electrons or gain 1-2 electrons than move 5-6!</p>
      </div>
    </div>
  </div>
);

const BohrDiagram = () => (
  <div className="bg-gradient-to-br from-[#120a1e] to-[#180a14] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Bohr Diagram - Oxygen (8 protons, 8 neutrons, 8 electrons)</h4>
    <div className="flex justify-center">
      <div className="relative w-80 h-80">
        {/* Nucleus */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center shadow-lg z-10">
          <div className="text-center text-white">
            <div className="text-xs font-bold">8p⁺</div>
            <div className="text-xs font-bold">8n⁰</div>
          </div>
        </div>
        
        {/* First shell (2 electrons) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-3 border-blue-300"></div>
        {[0, 180].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 20 * Math.cos(rad);
          const y = 50 + 20 * Math.sin(rad);
          return (
            <div
              key={`shell1-${i}`}
              className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            />
          );
        })}
        
        {/* Second shell (6 electrons) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border-3 border-green-300"></div>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 35 * Math.cos(rad);
          const y = 50 + 35 * Math.sin(rad);
          return (
            <div
              key={`shell2-${i}`}
              className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            />
          );
        })}
        
        {/* Labels */}
        <div className="absolute -right-12 top-1/3 text-xs font-semibold text-blue-600">Shell 1: 2e⁻</div>
        <div className="absolute -right-12 bottom-1/4 text-xs font-semibold text-green-600">Shell 2: 6e⁻</div>
      </div>
    </div>
  </div>
);

const EnergyPyramid = () => (
  <div className="bg-gradient-to-br from-[#060f0a] to-[#081408] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Energy Pyramid (10% Energy Transfer)</h4>
    <div className="flex flex-col items-center gap-3">
      {[
        { level: 'Tertiary Consumers', energy: '54.7 kcal', width: 'w-32', color: 'from-red-400 to-red-500' },
        { level: 'Secondary Consumers', energy: '547 kcal', width: 'w-48', color: 'from-orange-400 to-orange-500' },
        { level: 'Primary Consumers', energy: '5,467 kcal', width: 'w-64', color: 'from-yellow-400 to-yellow-500' },
        { level: 'Producers', energy: '54,670 kcal', width: 'w-80', color: 'from-green-400 to-green-500' }
      ].map((tier, i) => (
        <div key={i} className={`${tier.width} h-16 bg-gradient-to-r ${tier.color} rounded-lg shadow-lg flex items-center justify-center text-white flex-col`}>
          <div className="font-bold text-sm">{tier.level}</div>
          <div className="text-xs">{tier.energy}</div>
        </div>
      ))}
    </div>
    <div className="mt-6 text-center">
      <div className="inline-block bg-blue-100 rounded-lg px-4 py-2">
        <p className="text-sm font-semibold text-blue-300">⚡ Only 10% of energy passes to the next level</p>
        <p className="text-xs text-blue-600 mt-1">90% lost as heat, movement, and waste</p>
      </div>
    </div>
  </div>
);

const CarbonCycle = () => (
  <div className="bg-gradient-to-br from-[#060e18] to-[#080e18] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">The Carbon Cycle</h4>
    <div className="relative h-80">
      {/* Central cycle */}
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Atmosphere */}
        <circle cx="200" cy="60" r="40" fill="#93C5FD" stroke="#3B82F6" strokeWidth="2"/>
        <text x="200" y="60" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E40AF">Atmosphere</text>
        <text x="200" y="75" textAnchor="middle" fontSize="10" fill="#1E40AF">CO₂</text>
        
        {/* Plants */}
        <circle cx="80" cy="150" r="40" fill="#86EFAC" stroke="#22C55E" strokeWidth="2"/>
        <text x="80" y="150" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#15803D">Plants</text>
        <text x="80" y="165" textAnchor="middle" fontSize="10" fill="#15803D">(Producers)</text>
        
        {/* Animals */}
        <circle cx="320" cy="150" r="40" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
        <text x="320" y="150" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#92400E">Animals</text>
        <text x="320" y="165" textAnchor="middle" fontSize="10" fill="#92400E">(Consumers)</text>
        
        {/* Soil/Decomposers */}
        <circle cx="200" cy="240" r="40" fill="#A78BFA" stroke="#7C3AED" strokeWidth="2"/>
        <text x="200" y="240" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#5B21B6">Soil</text>
        <text x="200" y="255" textAnchor="middle" fontSize="10" fill="#5B21B6">Decomposers</text>
        
        {/* Arrows with labels */}
        {/* Photosynthesis */}
        <path d="M 180 90 L 100 130" stroke="#22C55E" strokeWidth="2" fill="none" markerEnd="url(#arrowgreen)"/>
        <text x="130" y="105" fontSize="9" fill="#15803D" fontWeight="bold">Photosynthesis</text>
        
        {/* Respiration from plants */}
        <path d="M 100 110 L 180 70" stroke="#3B82F6" strokeWidth="2" fill="none" markerEnd="url(#arrowblue)"/>
        <text x="120" y="85" fontSize="9" fill="#1E40AF" fontWeight="bold">Respiration</text>
        
        {/* Consumption */}
        <path d="M 120 150 L 280 150" stroke="#F59E0B" strokeWidth="2" fill="none" markerEnd="url(#arroworange)"/>
        <text x="190" y="145" fontSize="9" fill="#92400E" fontWeight="bold">Eaten</text>
        
        {/* Respiration from animals */}
        <path d="M 300 110 L 220 70" stroke="#3B82F6" strokeWidth="2" fill="none" markerEnd="url(#arrowblue)"/>
        <text x="250" y="85" fontSize="9" fill="#1E40AF" fontWeight="bold">Respiration</text>
        
        {/* Death/Waste */}
        <path d="M 310 190 L 220 220" stroke="#7C3AED" strokeWidth="2" fill="none" markerEnd="url(#arrowpurple)"/>
        <text x="270" y="210" fontSize="9" fill="#5B21B6" fontWeight="bold">Death/Waste</text>
        
        {/* Decomposition */}
        <path d="M 180 220 L 180 100" stroke="#3B82F6" strokeWidth="2" fill="none" markerEnd="url(#arrowblue)"/>
        <text x="150" y="160" fontSize="9" fill="#1E40AF" fontWeight="bold">Decomposition</text>
        
        {/* Arrow markers */}
        <defs>
          <marker id="arrowgreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#22C55E" />
          </marker>
          <marker id="arrowblue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6" />
          </marker>
          <marker id="arroworange" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#F59E0B" />
          </marker>
          <marker id="arrowpurple" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#7C3AED" />
          </marker>
        </defs>
      </svg>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
      <div className="bg-green-100 rounded-lg p-2">
        <span className="font-bold text-green-300">Photosynthesis:</span>
        <p className="text-green-300">CO₂ + H₂O → C₆H₁₂O₆ + O₂</p>
      </div>
      <div className="bg-blue-100 rounded-lg p-2">
        <span className="font-bold text-blue-300">Respiration:</span>
        <p className="text-blue-300">C₆H₁₂O₆ + O₂ → CO₂ + H₂O</p>
      </div>
    </div>
  </div>
);

// Electricity Diagrams
const CircuitSymbolsDiagram = () => (
  <div className="bg-gradient-to-br from-[#181208] to-[#181408] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Circuit Symbols Reference</h4>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {/* Battery/Cell */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-4 mb-2 border-2 border-amber-200 h-24 flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-16">
            <line x1="10" y1="20" x2="25" y2="20" stroke="#1F2937" strokeWidth="2"/>
            <line x1="25" y1="10" x2="25" y2="30" stroke="#1F2937" strokeWidth="3"/>
            <line x1="35" y1="15" x2="35" y2="25" stroke="#1F2937" strokeWidth="2"/>
            <line x1="45" y1="10" x2="45" y2="30" stroke="#1F2937" strokeWidth="3"/>
            <line x1="55" y1="15" x2="55" y2="25" stroke="#1F2937" strokeWidth="2"/>
            <line x1="55" y1="20" x2="70" y2="20" stroke="#1F2937" strokeWidth="2"/>
            <text x="20" y="8" fontSize="10" fill="#DC2626" fontWeight="bold">+</text>
            <text x="60" y="8" fontSize="10" fill="#1F2937" fontWeight="bold">−</text>
          </svg>
        </div>
        <p className="font-bold text-gray-800">Battery</p>
        <p className="text-xs text-gray-600">Power source</p>
      </div>

      {/* Wire */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-4 mb-2 border-2 border-amber-200 h-24 flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-16">
            <line x1="10" y1="20" x2="70" y2="20" stroke="#1F2937" strokeWidth="2"/>
          </svg>
        </div>
        <p className="font-bold text-gray-800">Wire</p>
        <p className="text-xs text-gray-600">Conductor</p>
      </div>

      {/* Switch (Open) */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-4 mb-2 border-2 border-amber-200 h-24 flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-16">
            <line x1="10" y1="20" x2="30" y2="20" stroke="#1F2937" strokeWidth="2"/>
            <circle cx="30" cy="20" r="2" fill="#1F2937"/>
            <line x1="30" y1="20" x2="50" y2="10" stroke="#1F2937" strokeWidth="2"/>
            <circle cx="50" cy="20" r="2" fill="#1F2937"/>
            <line x1="50" y1="20" x2="70" y2="20" stroke="#1F2937" strokeWidth="2"/>
          </svg>
        </div>
        <p className="font-bold text-gray-800">Switch (Open)</p>
        <p className="text-xs text-gray-600">Breaks circuit</p>
      </div>

      {/* Bulb/Light */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-4 mb-2 border-2 border-amber-200 h-24 flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-16">
            <line x1="10" y1="20" x2="25" y2="20" stroke="#1F2937" strokeWidth="2"/>
            <circle cx="40" cy="20" r="12" fill="none" stroke="#1F2937" strokeWidth="2"/>
            <line x1="35" y1="15" x2="45" y2="25" stroke="#F59E0B" strokeWidth="2"/>
            <line x1="35" y1="25" x2="45" y2="15" stroke="#F59E0B" strokeWidth="2"/>
            <line x1="55" y1="20" x2="70" y2="20" stroke="#1F2937" strokeWidth="2"/>
          </svg>
        </div>
        <p className="font-bold text-gray-800">Light Bulb</p>
        <p className="text-xs text-gray-600">Load/Output</p>
      </div>

      {/* Resistor */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-4 mb-2 border-2 border-amber-200 h-24 flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-16">
            <line x1="10" y1="20" x2="20" y2="20" stroke="#1F2937" strokeWidth="2"/>
            <path d="M 20 20 L 25 15 L 30 25 L 35 15 L 40 25 L 45 15 L 50 25 L 55 15 L 60 20" fill="none" stroke="#1F2937" strokeWidth="2"/>
            <line x1="60" y1="20" x2="70" y2="20" stroke="#1F2937" strokeWidth="2"/>
          </svg>
        </div>
        <p className="font-bold text-gray-800">Resistor</p>
        <p className="text-xs text-gray-600">Opposes current</p>
      </div>

      {/* Ammeter */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-4 mb-2 border-2 border-amber-200 h-24 flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-16">
            <line x1="10" y1="20" x2="25" y2="20" stroke="#1F2937" strokeWidth="2"/>
            <circle cx="40" cy="20" r="12" fill="none" stroke="#1F2937" strokeWidth="2"/>
            <text x="40" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#DC2626">A</text>
            <line x1="55" y1="20" x2="70" y2="20" stroke="#1F2937" strokeWidth="2"/>
          </svg>
        </div>
        <p className="font-bold text-gray-800">Ammeter</p>
        <p className="text-xs text-gray-600">Measures current</p>
      </div>

      {/* Voltmeter */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-4 mb-2 border-2 border-amber-200 h-24 flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-16">
            <circle cx="40" cy="20" r="12" fill="none" stroke="#1F2937" strokeWidth="2"/>
            <text x="40" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2563EB">V</text>
            <line x1="40" y1="8" x2="40" y2="3" stroke="#1F2937" strokeWidth="1.5"/>
            <line x1="40" y1="32" x2="40" y2="37" stroke="#1F2937" strokeWidth="1.5"/>
          </svg>
        </div>
        <p className="font-bold text-gray-800">Voltmeter</p>
        <p className="text-xs text-gray-600">Measures voltage</p>
      </div>

      {/* Motor */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-4 mb-2 border-2 border-amber-200 h-24 flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-16">
            <line x1="10" y1="20" x2="25" y2="20" stroke="#1F2937" strokeWidth="2"/>
            <circle cx="40" cy="20" r="12" fill="none" stroke="#1F2937" strokeWidth="2"/>
            <text x="40" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#7C3AED">M</text>
            <line x1="55" y1="20" x2="70" y2="20" stroke="#1F2937" strokeWidth="2"/>
          </svg>
        </div>
        <p className="font-bold text-gray-800">Motor</p>
        <p className="text-xs text-gray-600">Electrical → Motion</p>
      </div>
    </div>
  </div>
);

const SeriesCircuitDiagram = () => (
  <div className="bg-gradient-to-br from-[#0a0f1e] to-[#0d0a1e] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Series Circuit</h4>
    <div className="bg-white rounded-xl p-6 mb-4">
      <svg viewBox="0 0 400 250" className="w-full">
        {/* Circuit outline */}
        <rect x="50" y="50" width="300" height="150" fill="none" stroke="#3B82F6" strokeWidth="3" rx="10"/>
        
        {/* Battery */}
        <line x1="50" y1="125" x2="70" y2="125" stroke="#1F2937" strokeWidth="3"/>
        <line x1="70" y1="110" x2="70" y2="140" stroke="#1F2937" strokeWidth="4"/>
        <line x1="80" y1="115" x2="80" y2="135" stroke="#1F2937" strokeWidth="3"/>
        <text x="60" y="105" fontSize="12" fill="#DC2626" fontWeight="bold">+</text>
        <text x="75" y="165" fontSize="11" fill="#1F2937" fontWeight="bold">6V</text>
        
        {/* Bulb 1 */}
        <circle cx="170" cy="60" r="15" fill="none" stroke="#1F2937" strokeWidth="3"/>
        <line x1="165" y1="55" x2="175" y2="65" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="165" y1="65" x2="175" y2="55" stroke="#F59E0B" strokeWidth="2"/>
        <text x="155" y="95" fontSize="11" fill="#1F2937" fontWeight="bold">Bulb 1</text>
        
        {/* Bulb 2 */}
        <circle cx="270" cy="125" r="15" fill="none" stroke="#1F2937" strokeWidth="3"/>
        <line x1="265" y1="120" x2="275" y2="130" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="265" y1="130" x2="275" y2="120" stroke="#F59E0B" strokeWidth="2"/>
        <text x="255" y="160" fontSize="11" fill="#1F2937" fontWeight="bold">Bulb 2</text>
        
        {/* Bulb 3 */}
        <circle cx="170" cy="190" r="15" fill="none" stroke="#1F2937" strokeWidth="3"/>
        <line x1="165" y1="185" x2="175" y2="195" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="165" y1="195" x2="175" y2="185" stroke="#F59E0B" strokeWidth="2"/>
        <text x="155" y="220" fontSize="11" fill="#1F2937" fontWeight="bold">Bulb 3</text>
        
        {/* Current arrows */}
        <defs>
          <marker id="arrowcurrent" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#DC2626" />
          </marker>
        </defs>
        <path d="M 120 50 L 135 50" stroke="#DC2626" strokeWidth="2" fill="none" markerEnd="url(#arrowcurrent)"/>
        <path d="M 320 90 L 320 105" stroke="#DC2626" strokeWidth="2" fill="none" markerEnd="url(#arrowcurrent)"/>
        <path d="M 220 200 L 205 200" stroke="#DC2626" strokeWidth="2" fill="none" markerEnd="url(#arrowcurrent)"/>
        <path d="M 80 165 L 80 180" stroke="#DC2626" strokeWidth="2" fill="none" markerEnd="url(#arrowcurrent)"/>
        
        <text x="110" y="40" fontSize="10" fill="#DC2626" fontWeight="bold">I = 0.5A</text>
      </svg>
    </div>
    
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-blue-100 rounded-lg p-3">
        <p className="text-sm font-bold text-blue-300 mb-1">✓ Current</p>
        <p className="text-xs text-blue-300">Same everywhere (0.5A)</p>
      </div>
      <div className="bg-purple-100 rounded-lg p-3">
        <p className="text-sm font-bold text-purple-800 mb-1">✓ Voltage</p>
        <p className="text-xs text-purple-300">Divides: 6V = 2V + 2V + 2V</p>
      </div>
      <div className="bg-orange-100 rounded-lg p-3">
        <p className="text-sm font-bold text-orange-800 mb-1">✓ Path</p>
        <p className="text-xs text-orange-300">One route only</p>
      </div>
      <div className="bg-red-100 rounded-lg p-3">
        <p className="text-sm font-bold text-red-300 mb-1">✗ One Fails</p>
        <p className="text-xs text-red-300">All stop working</p>
      </div>
    </div>
  </div>
);

const ParallelCircuitDiagram = () => (
  <div className="bg-gradient-to-br from-[#060f0a] to-[#081408] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Parallel Circuit</h4>
    <div className="bg-white rounded-xl p-6 mb-4">
      <svg viewBox="0 0 400 280" className="w-full">
        {/* Battery */}
        <line x1="50" y1="140" x2="70" y2="140" stroke="#1F2937" strokeWidth="3"/>
        <line x1="70" y1="125" x2="70" y2="155" stroke="#1F2937" strokeWidth="4"/>
        <line x1="80" y1="130" x2="80" y2="150" stroke="#1F2937" strokeWidth="3"/>
        <text x="60" y="120" fontSize="12" fill="#DC2626" fontWeight="bold">+</text>
        <text x="55" y="180" fontSize="11" fill="#1F2937" fontWeight="bold">12V</text>
        
        {/* Main lines */}
        <line x1="80" y1="140" x2="120" y2="140" stroke="#3B82F6" strokeWidth="3"/>
        <line x1="120" y1="60" x2="120" y2="220" stroke="#3B82F6" strokeWidth="3"/>
        <line x1="280" y1="60" x2="280" y2="220" stroke="#3B82F6" strokeWidth="3"/>
        <line x1="280" y1="140" x2="320" y2="140" stroke="#3B82F6" strokeWidth="3"/>
        <line x1="320" y1="140" x2="350" y2="140" stroke="#3B82F6" strokeWidth="3"/>
        <line x1="350" y1="140" x2="350" y2="220" stroke="#3B82F6" strokeWidth="3"/>
        <line x1="50" y1="220" x2="350" y2="220" stroke="#3B82F6" strokeWidth="3"/>
        <line x1="50" y1="140" x2="50" y2="220" stroke="#3B82F6" strokeWidth="3"/>
        
        {/* Branch 1 - Top */}
        <line x1="120" y1="70" x2="160" y2="70" stroke="#3B82F6" strokeWidth="3"/>
        <circle cx="200" cy="70" r="15" fill="none" stroke="#1F2937" strokeWidth="3"/>
        <line x1="195" y1="65" x2="205" y2="75" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="195" y1="75" x2="205" y2="65" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="240" y1="70" x2="280" y2="70" stroke="#3B82F6" strokeWidth="3"/>
        <text x="210" y="65" fontSize="10" fill="#1F2937" fontWeight="bold">B1</text>
        
        {/* Branch 2 - Middle */}
        <line x1="120" y1="140" x2="160" y2="140" stroke="#3B82F6" strokeWidth="3"/>
        <circle cx="200" cy="140" r="15" fill="none" stroke="#1F2937" strokeWidth="3"/>
        <line x1="195" y1="135" x2="205" y2="145" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="195" y1="145" x2="205" y2="135" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="240" y1="140" x2="280" y2="140" stroke="#3B82F6" strokeWidth="3"/>
        <text x="210" y="135" fontSize="10" fill="#1F2937" fontWeight="bold">B2</text>
        
        {/* Branch 3 - Bottom */}
        <line x1="120" y1="210" x2="160" y2="210" stroke="#3B82F6" strokeWidth="3"/>
        <circle cx="200" cy="210" r="15" fill="none" stroke="#1F2937" strokeWidth="3"/>
        <line x1="195" y1="205" x2="205" y2="215" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="195" y1="215" x2="205" y2="205" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="240" y1="210" x2="280" y2="210" stroke="#3B82F6" strokeWidth="3"/>
        <text x="210" y="205" fontSize="10" fill="#1F2937" fontWeight="bold">B3</text>
        
        {/* Current arrows */}
        <defs>
          <marker id="arrowcurrent2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#DC2626" />
          </marker>
        </defs>
        <path d="M 100 140 L 115 140" stroke="#DC2626" strokeWidth="2" fill="none" markerEnd="url(#arrowcurrent2)"/>
        <text x="95" y="130" fontSize="10" fill="#DC2626" fontWeight="bold">I=3A</text>
        
        <path d="M 130 70 L 145 70" stroke="#DC2626" strokeWidth="1.5" fill="none" markerEnd="url(#arrowcurrent2)"/>
        <text x="130" y="60" fontSize="9" fill="#DC2626">1A</text>
        
        <path d="M 130 140 L 145 140" stroke="#DC2626" strokeWidth="1.5" fill="none" markerEnd="url(#arrowcurrent2)"/>
        <text x="130" y="130" fontSize="9" fill="#DC2626">1A</text>
        
        <path d="M 130 210 L 145 210" stroke="#DC2626" strokeWidth="1.5" fill="none" markerEnd="url(#arrowcurrent2)"/>
        <text x="130" y="200" fontSize="9" fill="#DC2626">1A</text>
        
        <text x="165" y="250" fontSize="10" fill="#2563EB" fontWeight="bold">V = 12V on each branch</text>
      </svg>
    </div>
    
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-green-100 rounded-lg p-3">
        <p className="text-sm font-bold text-green-300 mb-1">✓ Voltage</p>
        <p className="text-xs text-green-300">Same across all (12V)</p>
      </div>
      <div className="bg-purple-100 rounded-lg p-3">
        <p className="text-sm font-bold text-purple-800 mb-1">✓ Current</p>
        <p className="text-xs text-purple-300">Divides: 3A = 1A + 1A + 1A</p>
      </div>
      <div className="bg-orange-100 rounded-lg p-3">
        <p className="text-sm font-bold text-orange-800 mb-1">✓ Paths</p>
        <p className="text-xs text-orange-300">Multiple routes</p>
      </div>
      <div className="bg-green-100 rounded-lg p-3">
        <p className="text-sm font-bold text-green-300 mb-1">✓ One Fails</p>
        <p className="text-xs text-green-300">Others keep working!</p>
      </div>
    </div>
  </div>
);

const OhmsLawTriangle = () => (
  <div className="bg-gradient-to-br from-[#120a1e] to-[#180a14] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Ohm's Law Triangle</h4>
    
    <div className="flex justify-center mb-6">
      <svg viewBox="0 0 200 200" className="w-64 h-64">
        {/* Triangle */}
        <path d="M 100 20 L 180 180 L 20 180 Z" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="4"/>
        
        {/* Dividing lines */}
        <line x1="20" y1="100" x2="180" y2="100" stroke="#6D28D9" strokeWidth="3"/>
        
        {/* Labels */}
        <text x="100" y="70" textAnchor="middle" fontSize="36" fontWeight="bold" fill="white">V</text>
        <text x="65" y="150" textAnchor="middle" fontSize="36" fontWeight="bold" fill="white">I</text>
        <text x="135" y="150" textAnchor="middle" fontSize="36" fontWeight="bold" fill="white">R</text>
      </svg>
    </div>
    
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-purple-100 rounded-xl p-4 text-center border-2 border-purple-300">
        <p className="text-sm font-bold text-purple-800 mb-2">Find Voltage</p>
        <p className="text-2xl font-bold text-purple-900 mb-1">V = I × R</p>
        <p className="text-xs text-purple-300">Cover V</p>
      </div>
      
      <div className="bg-pink-100 rounded-xl p-4 text-center border-2 border-pink-300">
        <p className="text-sm font-bold text-pink-800 mb-2">Find Current</p>
        <p className="text-2xl font-bold text-pink-900 mb-1">I = V ÷ R</p>
        <p className="text-xs text-pink-700">Cover I</p>
      </div>
      
      <div className="bg-indigo-100 rounded-xl p-4 text-center border-2 border-indigo-300">
        <p className="text-sm font-bold text-indigo-300 mb-2">Find Resistance</p>
        <p className="text-2xl font-bold text-indigo-900 mb-1">R = V ÷ I</p>
        <p className="text-xs text-indigo-300">Cover R</p>
      </div>
    </div>
    
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
      <p className="font-bold mb-2">Example Problem:</p>
      <p className="text-sm mb-2">A circuit has 12V battery and 4Ω resistor. Find current.</p>
      <p className="text-sm font-mono bg-white/20 rounded p-2">I = V ÷ R = 12V ÷ 4Ω = 3A</p>
    </div>
  </div>
);

const CircuitDiagram = () => (
  <div className="bg-gradient-to-br from-[#0a0f1e] to-[#0d0a1e] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Complete Circuit Components</h4>
    <div className="bg-white rounded-xl p-6 mb-4">
      <svg viewBox="0 0 500 300" className="w-full">
        {/* Main circuit rectangle */}
        <rect x="50" y="50" width="400" height="200" fill="none" stroke="#3B82F6" strokeWidth="4" rx="20"/>
        
        {/* Battery */}
        <line x1="50" y1="150" x2="80" y2="150" stroke="#1F2937" strokeWidth="3"/>
        <line x1="80" y1="130" x2="80" y2="170" stroke="#1F2937" strokeWidth="5"/>
        <line x1="95" y1="135" x2="95" y2="165" stroke="#1F2937" strokeWidth="4"/>
        <text x="60" y="120" fontSize="12" fill="#DC2626" fontWeight="bold">+</text>
        <text x="90" y="120" fontSize="12" fill="#1F2937" fontWeight="bold">−</text>
        <text x="55" y="200" fontSize="11" fill="#1F2937" fontWeight="bold">Battery</text>
        
        {/* Switch (closed) */}
        <line x1="200" y1="50" x2="220" y2="50" stroke="#1F2937" strokeWidth="3"/>
        <circle cx="220" cy="50" r="3" fill="#1F2937"/>
        <line x1="220" y1="50" x2="240" y2="50" stroke="#1F2937" strokeWidth="3"/>
        <circle cx="240" cy="50" r="3" fill="#1F2937"/>
        <line x1="240" y1="50" x2="260" y2="50" stroke="#1F2937" strokeWidth="3"/>
        <text x="210" y="35" fontSize="11" fill="#1F2937" fontWeight="bold">Switch</text>
        
        {/* Light Bulb */}
        <circle cx="350" cy="100" r="20" fill="none" stroke="#1F2937" strokeWidth="3"/>
        <line x1="340" y1="90" x2="360" y2="110" stroke="#F59E0B" strokeWidth="3"/>
        <line x1="340" y1="110" x2="360" y2="90" stroke="#F59E0B" strokeWidth="3"/>
        <text x="330" y="140" fontSize="11" fill="#1F2937" fontWeight="bold">Bulb</text>
        
        {/* Resistor */}
        <path d="M 350 200 L 355 195 L 360 205 L 365 195 L 370 205 L 375 195 L 380 205 L 385 195 L 390 200" 
              fill="none" stroke="#1F2937" strokeWidth="3"/>
        <text x="345" y="225" fontSize="11" fill="#1F2937" fontWeight="bold">Resistor</text>
        
        {/* Ammeter */}
        <circle cx="150" cy="150" r="15" fill="none" stroke="#DC2626" strokeWidth="3"/>
        <text x="150" y="155" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#DC2626">A</text>
        <text x="140" y="185" fontSize="11" fill="#1F2937" fontWeight="bold">Ammeter</text>
        
        {/* Arrows showing current direction */}
        <defs>
          <marker id="arrowred" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#DC2626" />
          </marker>
        </defs>
        <path d="M 100 50 L 120 50" stroke="#DC2626" strokeWidth="2" fill="none" markerEnd="url(#arrowred)"/>
        <text x="105" y="40" fontSize="10" fill="#DC2626" fontWeight="bold">Current flow</text>
      </svg>
    </div>
    <div className="bg-blue-100 rounded-lg p-4">
      <p className="text-sm text-blue-300 text-center">
        <span className="font-bold">Complete Circuit:</span> All components connected in a closed loop allowing current to flow
      </p>
    </div>
  </div>
);

const StaticElectricityDiagram = () => (
  <div className="bg-gradient-to-br from-[#181208] to-[#180f04] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Static Electricity - Charge Interactions</h4>
    
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      {/* Like Charges Repel */}
      <div className="bg-white rounded-xl p-6 border-2 border-red-200">
        <h5 className="text-center font-bold text-red-300 mb-4">Like Charges REPEL</h5>
        
        <div className="flex justify-center items-center gap-8 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-red-400 border-4 border-red-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">+</span>
            </div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2">
              <svg width="30" height="30">
                <path d="M 5 15 L 20 15" stroke="#DC2626" strokeWidth="3" markerEnd="url(#arrowrepel1)"/>
                <defs>
                  <marker id="arrowrepel1" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill="#DC2626" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-red-400 border-4 border-red-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">+</span>
            </div>
            <div className="absolute -left-3 top-1/2 -translate-y-1/2">
              <svg width="30" height="30">
                <path d="M 25 15 L 10 15" stroke="#DC2626" strokeWidth="3" markerEnd="url(#arrowrepel2)"/>
                <defs>
                  <marker id="arrowrepel2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill="#DC2626" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center items-center gap-8 mt-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-blue-400 border-4 border-blue-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">−</span>
            </div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2">
              <svg width="30" height="30">
                <path d="M 5 15 L 20 15" stroke="#2563EB" strokeWidth="3" markerEnd="url(#arrowrepel3)"/>
                <defs>
                  <marker id="arrowrepel3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill="#2563EB" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-blue-400 border-4 border-blue-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">−</span>
            </div>
            <div className="absolute -left-3 top-1/2 -translate-y-1/2">
              <svg width="30" height="30">
                <path d="M 25 15 L 10 15" stroke="#2563EB" strokeWidth="3" markerEnd="url(#arrowrepel4)"/>
                <defs>
                  <marker id="arrowrepel4" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill="#2563EB" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        
        <p className="text-center text-sm text-red-300 font-semibold mt-4">+ repels + | − repels −</p>
      </div>
      
      {/* Opposite Charges Attract */}
      <div className="bg-white rounded-xl p-6 border-2 border-green-200">
        <h5 className="text-center font-bold text-green-300 mb-4">Opposite Charges ATTRACT</h5>
        
        <div className="flex justify-center items-center gap-8 mb-8 mt-12">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-red-400 border-4 border-red-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">+</span>
            </div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2">
              <svg width="30" height="30">
                <path d="M 5 15 L 20 15" stroke="#22C55E" strokeWidth="3" markerStart="url(#arrowattract1)"/>
                <defs>
                  <marker id="arrowattract1" markerWidth="10" markerHeight="10" refX="1" refY="3" orient="auto">
                    <path d="M9,0 L9,6 L0,3 z" fill="#22C55E" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-blue-400 border-4 border-blue-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">−</span>
            </div>
            <div className="absolute -left-3 top-1/2 -translate-y-1/2">
              <svg width="30" height="30">
                <path d="M 25 15 L 10 15" stroke="#22C55E" strokeWidth="3" markerStart="url(#arrowattract2)"/>
                <defs>
                  <marker id="arrowattract2" markerWidth="10" markerHeight="10" refX="1" refY="3" orient="auto">
                    <path d="M9,0 L9,6 L0,3 z" fill="#22C55E" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        
        <p className="text-center text-sm text-green-300 font-semibold mt-12">+ attracts − | − attracts +</p>
      </div>
    </div>
    
    <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-300">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
        <div>
          <p className="font-bold text-amber-300 mb-1">Remember:</p>
          <p className="text-sm text-amber-300">Only ELECTRONS move in static electricity! Protons stay in the nucleus. When you rub a balloon on your hair, electrons transfer from your hair to the balloon.</p>
        </div>
      </div>
    </div>
  </div>
);

const PowerFormulaDiagram = () => (
  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Electrical Power Formulas</h4>
    
    <div className="bg-white rounded-xl p-6 mb-6 border-2 border-orange-200">
      <div className="text-center mb-6">
        <p className="text-4xl font-bold text-orange-600 mb-2">P = V × I</p>
        <p className="text-gray-600">Power = Voltage × Current</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-orange-100 rounded-lg p-4 text-center">
          <p className="text-sm font-bold text-orange-800 mb-2">Power (P)</p>
          <p className="text-xs text-orange-300">Measured in Watts (W)</p>
          <p className="text-xs text-orange-600 mt-2">How fast energy is used</p>
        </div>
        
        <div className="bg-red-100 rounded-lg p-4 text-center">
          <p className="text-sm font-bold text-red-300 mb-2">Voltage (V)</p>
          <p className="text-xs text-red-300">Measured in Volts (V)</p>
          <p className="text-xs text-red-600 mt-2">Electrical "pressure"</p>
        </div>
        
        <div className="bg-yellow-100 rounded-lg p-4 text-center">
          <p className="text-sm font-bold text-yellow-800 mb-2">Current (I)</p>
          <p className="text-xs text-yellow-300">Measured in Amperes (A)</p>
          <p className="text-xs text-yellow-600 mt-2">Flow of electrons</p>
        </div>
      </div>
    </div>
    
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-4 border-2 border-orange-300">
        <p className="font-bold text-orange-800 mb-3">Example 1: Light Bulb</p>
        <div className="space-y-2 text-sm">
          <p className="text-gray-700">Given: V = 120V, I = 0.5A</p>
          <p className="text-gray-700">Find: P = ?</p>
          <div className="bg-gray-100 rounded p-3 mt-2">
            <p className="font-mono text-orange-300">P = V × I</p>
            <p className="font-mono text-orange-300">P = 120V × 0.5A</p>
            <p className="font-mono font-bold text-orange-900">P = 60W</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-xl p-4 border-2 border-red-300">
        <p className="font-bold text-red-300 mb-3">Example 2: Heater</p>
        <div className="space-y-2 text-sm">
          <p className="text-gray-700">Given: P = 1500W, V = 120V</p>
          <p className="text-gray-700">Find: I = ?</p>
          <div className="bg-gray-100 rounded p-3 mt-2">
            <p className="font-mono text-red-300">I = P ÷ V</p>
            <p className="font-mono text-red-300">I = 1500W ÷ 120V</p>
            <p className="font-mono font-bold text-red-900">I = 12.5A</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white">
      <div className="flex items-start gap-3">
        <Zap className="w-6 h-6 flex-shrink-0 mt-1" />
        <div>
          <p className="font-bold mb-2">Common Appliance Power:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>• LED bulb: 10W</p>
            <p>• Laptop: 50W</p>
            <p>• Microwave: 1000W</p>
            <p>• Hair dryer: 1800W</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WaterAnalogyDiagram = () => (
  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">The Water Pipe Analogy for Electricity</h4>
    <div className="grid md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-xl p-5 border-2 border-blue-300 shadow-md text-center">
        <div className="w-16 h-16 mx-auto mb-3 bg-blue-500 rounded-full flex items-center justify-center">
          <svg viewBox="0 0 40 40" className="w-10 h-10">
            <path d="M5 20 Q10 10 20 20 Q30 30 35 20" stroke="white" strokeWidth="3" fill="none"/>
            <text x="12" y="38" fontSize="10" fill="white" fontWeight="bold">V</text>
          </svg>
        </div>
        <h5 className="font-bold text-blue-300 text-lg mb-2">VOLTAGE (V)</h5>
        <p className="text-blue-300 text-sm font-semibold">= Water Pressure</p>
        <p className="text-gray-600 text-xs mt-2">The "push" that forces water through the pipe. Higher pressure = more force. Measured in Volts (V).</p>
        <div className="mt-3 bg-blue-100 rounded-lg px-3 py-2">
          <p className="text-xs text-blue-300 font-bold">Think: Pump pushing water</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 border-2 border-cyan-300 shadow-md text-center">
        <div className="w-16 h-16 mx-auto mb-3 bg-cyan-500 rounded-full flex items-center justify-center">
          <svg viewBox="0 0 40 40" className="w-10 h-10">
            <path d="M5 20 L35 20" stroke="white" strokeWidth="3"/>
            <path d="M28 14 L35 20 L28 26" stroke="white" strokeWidth="2" fill="none"/>
            <text x="12" y="38" fontSize="10" fill="white" fontWeight="bold">I</text>
          </svg>
        </div>
        <h5 className="font-bold text-cyan-800 text-lg mb-2">CURRENT (I)</h5>
        <p className="text-cyan-300 text-sm font-semibold">= Flow Rate of Water</p>
        <p className="text-gray-600 text-xs mt-2">How much water flows past a point each second. More flow = higher current. Measured in Amperes (A).</p>
        <div className="mt-3 bg-cyan-100 rounded-lg px-3 py-2">
          <p className="text-xs text-cyan-800 font-bold">Think: Litres per second</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 border-2 border-orange-300 shadow-md text-center">
        <div className="w-16 h-16 mx-auto mb-3 bg-orange-500 rounded-full flex items-center justify-center">
          <svg viewBox="0 0 40 40" className="w-10 h-10">
            <rect x="12" y="14" width="16" height="12" rx="2" fill="white" opacity="0.9"/>
            <text x="14" y="24" fontSize="8" fill="#f97316" fontWeight="bold">Ω</text>
            <text x="12" y="38" fontSize="10" fill="white" fontWeight="bold">R</text>
          </svg>
        </div>
        <h5 className="font-bold text-orange-800 text-lg mb-2">RESISTANCE (R)</h5>
        <p className="text-orange-300 text-sm font-semibold">= Pipe Narrowing</p>
        <p className="text-gray-600 text-xs mt-2">A narrower pipe restricts flow. More resistance = less current for same pressure. Measured in Ohms (Ω).</p>
        <div className="mt-3 bg-orange-100 rounded-lg px-3 py-2">
          <p className="text-xs text-orange-800 font-bold">Think: Narrow kink in pipe</p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
      <div className="flex items-center justify-center gap-4 flex-wrap text-center">
        <div className="text-purple-800 font-bold text-lg">More Pressure (V↑)</div>
        <div className="text-2xl">→</div>
        <div className="text-cyan-300 font-bold text-lg">More Flow (I↑)</div>
        <div className="mx-4 text-gray-600 font-bold">|</div>
        <div className="text-orange-300 font-bold text-lg">Narrower Pipe (R↑)</div>
        <div className="text-2xl">→</div>
        <div className="text-cyan-300 font-bold text-lg">Less Flow (I↓)</div>
      </div>
      <p className="text-center text-sm text-gray-600 mt-3 font-semibold">This is exactly how V = I × R works in Ohm's Law!</p>
    </div>
  </div>
);

const OhmsLawWorkedExamples = () => (
  <div className="bg-gradient-to-br from-[#120a1e] to-[#180a14] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Ohm's Law — Worked Examples</h4>
    <div className="grid md:grid-cols-3 gap-5 mb-6">
      <div className="bg-white rounded-xl p-5 border-2 border-green-300 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
          <h5 className="font-bold text-green-300">Find Current</h5>
        </div>
        <div className="bg-green-50 rounded-lg p-3 mb-3 font-mono text-sm">
          <p className="text-gray-600">Given: V = 12V, R = 4Ω</p>
          <p className="text-gray-600">Find: I = ?</p>
        </div>
        <div className="space-y-1 text-sm">
          <p className="text-gray-700">Formula: <span className="font-bold text-green-300">I = V ÷ R</span></p>
          <p className="text-gray-700">I = 12 ÷ 4</p>
          <p className="text-xl font-bold text-green-300 text-center mt-2">I = 3 A</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 border-2 border-blue-300 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
          <h5 className="font-bold text-blue-300">Find Voltage</h5>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 mb-3 font-mono text-sm">
          <p className="text-gray-600">Given: I = 2A, R = 6Ω</p>
          <p className="text-gray-600">Find: V = ?</p>
        </div>
        <div className="space-y-1 text-sm">
          <p className="text-gray-700">Formula: <span className="font-bold text-blue-300">V = I × R</span></p>
          <p className="text-gray-700">V = 2 × 6</p>
          <p className="text-xl font-bold text-blue-300 text-center mt-2">V = 12 V</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 border-2 border-orange-300 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
          <h5 className="font-bold text-orange-800">Find Resistance</h5>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 mb-3 font-mono text-sm">
          <p className="text-gray-600">Given: V = 24V, I = 3A</p>
          <p className="text-gray-600">Find: R = ?</p>
        </div>
        <div className="space-y-1 text-sm">
          <p className="text-gray-700">Formula: <span className="font-bold text-orange-300">R = V ÷ I</span></p>
          <p className="text-gray-700">R = 24 ÷ 3</p>
          <p className="text-xl font-bold text-orange-300 text-center mt-2">R = 8 Ω</p>
        </div>
      </div>
    </div>
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-300">
      <p className="text-center font-bold text-purple-800 mb-3">⭐ Cover-Up Method — Cover what you want to find!</p>
      <div className="flex justify-center">
        <svg viewBox="0 0 220 120" className="w-64 h-32">
          <path d="M 110 10 L 200 100 L 20 100 Z" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="3"/>
          <line x1="20" y1="55" x2="200" y2="55" stroke="#6D28D9" strokeWidth="2"/>
          <text x="110" y="45" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white">V</text>
          <text x="70" y="85" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white">I</text>
          <text x="150" y="85" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white">R</text>
          <text x="30" y="115" fontSize="9" fill="#6D28D9">Cover V → I×R</text>
          <text x="110" y="115" textAnchor="middle" fontSize="9" fill="#6D28D9">Cover I → V÷R</text>
          <text x="175" y="115" fontSize="9" fill="#6D28D9">Cover R → V÷I</text>
        </svg>
      </div>
    </div>
  </div>
);

const SeriesCircuitCalculations = () => (
  <div className="bg-gradient-to-br from-[#060f0a] to-[#081408] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Series Circuit — Step-by-Step Calculations</h4>
    <div className="bg-white rounded-xl p-5 border-2 border-green-300 mb-5 shadow-md">
      <p className="text-center font-bold text-green-300 mb-4">Example: 12V battery, 3 resistors in series (R₁=2Ω, R₂=3Ω, R₃=7Ω)</p>
      <svg viewBox="0 0 480 120" className="w-full mb-4">
        <line x1="40" y1="30" x2="40" y2="90" stroke="#1F2937" strokeWidth="3"/>
        <line x1="40" y1="30" x2="110" y2="30" stroke="#1F2937" strokeWidth="3"/>
        <line x1="40" y1="90" x2="440" y2="90" stroke="#1F2937" strokeWidth="3"/>
        <line x1="440" y1="90" x2="440" y2="30" stroke="#1F2937" strokeWidth="3"/>
        <line x1="440" y1="30" x2="390" y2="30" stroke="#1F2937" strokeWidth="3"/>
        <line x1="30" y1="55" x2="30" y2="65" stroke="#DC2626" strokeWidth="4"/>
        <line x1="50" y1="58" x2="50" y2="62" stroke="#1F2937" strokeWidth="2"/>
        <text x="55" y="65" fontSize="11" fill="#DC2626" fontWeight="bold">+12V</text>
        <path d="M 110 30 L 115 22 L 120 38 L 125 22 L 130 38 L 135 22 L 140 38 L 145 30" fill="none" stroke="#3B82F6" strokeWidth="2.5"/>
        <text x="122" y="16" fontSize="11" fill="#3B82F6" fontWeight="bold">R₁=2Ω</text>
        <line x1="145" y1="30" x2="195" y2="30" stroke="#1F2937" strokeWidth="3"/>
        <path d="M 195 30 L 200 22 L 205 38 L 210 22 L 215 38 L 220 22 L 225 38 L 230 30" fill="none" stroke="#10B981" strokeWidth="2.5"/>
        <text x="205" y="16" fontSize="11" fill="#10B981" fontWeight="bold">R₂=3Ω</text>
        <line x1="230" y1="30" x2="280" y2="30" stroke="#1F2937" strokeWidth="3"/>
        <path d="M 280 30 L 285 22 L 290 38 L 295 22 L 300 38 L 305 22 L 310 38 L 315 30" fill="none" stroke="#F59E0B" strokeWidth="2.5"/>
        <text x="287" y="16" fontSize="11" fill="#F59E0B" fontWeight="bold">R₃=7Ω</text>
        <line x1="315" y1="30" x2="390" y2="30" stroke="#1F2937" strokeWidth="3"/>
        <path d="M 200 55 L 215 55" stroke="#DC2626" strokeWidth="2" markerEnd="url(#arr1)"/>
        <defs><marker id="arr1" markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#DC2626"/></marker></defs>
        <text x="185" y="72" fontSize="10" fill="#DC2626" fontWeight="bold">I flows →</text>
      </svg>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <p className="font-bold text-green-300 mb-2">① Total Resistance</p>
          <p className="text-gray-700">R_total = R₁+R₂+R₃</p>
          <p className="text-gray-700">= 2+3+7</p>
          <p className="font-bold text-green-300 text-lg">= 12 Ω</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="font-bold text-blue-300 mb-2">② Total Current</p>
          <p className="text-gray-700">I = V ÷ R_total</p>
          <p className="text-gray-700">= 12 ÷ 12</p>
          <p className="font-bold text-blue-300 text-lg">= 1 A (same everywhere)</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <p className="font-bold text-orange-800 mb-2">③ Voltage Drops</p>
          <p className="text-gray-700">V₁=1×2 = <span className="font-bold">2V</span></p>
          <p className="text-gray-700">V₂=1×3 = <span className="font-bold">3V</span></p>
          <p className="text-gray-700">V₃=1×7 = <span className="font-bold">7V</span></p>
          <p className="text-xs text-orange-600 mt-1">✓ 2+3+7=12V ✓</p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="bg-blue-50 rounded-xl p-4">
        <p className="font-bold text-blue-300 mb-2">📌 Series Rules to Memorize:</p>
        <p className="text-blue-300">• Current: I₁ = I₂ = I₃ (same everywhere)</p>
        <p className="text-blue-300">• Voltage: V_total = V₁ + V₂ + V₃</p>
        <p className="text-blue-300">• Resistance: R_total = R₁ + R₂ + R₃</p>
        <p className="text-blue-300">• One break → all stop</p>
      </div>
      <div className="bg-red-950/30 rounded-xl p-4 border border-red-500/20">
        <p className="font-bold text-red-300 mb-2">⚠️ Common Exam Mistakes:</p>
        <p className="text-red-300">• Forgetting current is the SAME in series</p>
        <p className="text-red-300">• Adding voltages wrong</p>
        <p className="text-red-300">• Not checking: ΣV = battery V</p>
        <p className="text-red-300">• Mixing up series and parallel rules</p>
      </div>
    </div>
  </div>
);

const ParallelCircuitCalculations = () => (
  <div className="bg-gradient-to-br from-[#0a0f1e] to-[#0d0a1e] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Parallel Circuit — Step-by-Step Calculations</h4>
    <div className="bg-white rounded-xl p-5 border-2 border-blue-300 mb-5 shadow-md">
      <p className="text-center font-bold text-blue-300 mb-4">Example: 12V battery, 3 resistors in parallel (R₁=6Ω, R₂=4Ω, R₃=12Ω)</p>
      <svg viewBox="0 0 480 160" className="w-full mb-4">
        <line x1="40" y1="20" x2="40" y2="140" stroke="#1F2937" strokeWidth="3"/>
        <line x1="40" y1="20" x2="440" y2="20" stroke="#1F2937" strokeWidth="3"/>
        <line x1="40" y1="140" x2="440" y2="140" stroke="#1F2937" strokeWidth="3"/>
        <line x1="440" y1="20" x2="440" y2="140" stroke="#1F2937" strokeWidth="3"/>
        <line x1="30" y1="75" x2="30" y2="85" stroke="#DC2626" strokeWidth="4"/>
        <line x1="50" y1="78" x2="50" y2="82" stroke="#1F2937" strokeWidth="2"/>
        <text x="55" y="85" fontSize="11" fill="#DC2626" fontWeight="bold">12V</text>
        <line x1="160" y1="20" x2="160" y2="140" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="4"/>
        <line x1="280" y1="20" x2="280" y2="140" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="4"/>
        <path d="M 160 50 L 165 40 L 170 60 L 175 40 L 180 60 L 185 40 L 190 60 L 195 50" fill="none" stroke="#3B82F6" strokeWidth="2.5"/>
        <text x="165" y="35" fontSize="11" fill="#3B82F6" fontWeight="bold">R₁=6Ω</text>
        <text x="162" y="75" fontSize="10" fill="#3B82F6">I₁=2A</text>
        <path d="M 160 90 L 165 80 L 170 100 L 175 80 L 180 100 L 185 80 L 190 100 L 195 90" fill="none" stroke="#10B981" strokeWidth="2.5"/>
        <text x="165" y="75" fontSize="11" fill="#10B981" fontWeight="bold">R₂=4Ω</text>
        <text x="162" y="115" fontSize="10" fill="#10B981">I₂=3A</text>
        <path d="M 280 80 L 285 70 L 290 90 L 295 70 L 300 90 L 305 70 L 310 90 L 315 80" fill="none" stroke="#F59E0B" strokeWidth="2.5"/>
        <text x="280" y="65" fontSize="11" fill="#F59E0B" fontWeight="bold">R₃=12Ω</text>
        <text x="280" y="105" fontSize="10" fill="#F59E0B">I₃=1A</text>
        <text x="80" y="15" fontSize="10" fill="#DC2626" fontWeight="bold">I_total=6A →</text>
        <text x="350" y="15" fontSize="10" fill="#DC2626" fontWeight="bold">← 6A</text>
        <text x="380" y="80" fontSize="10" fill="#6B7280">Each branch:</text>
        <text x="380" y="95" fontSize="10" fill="#6B7280">V = 12V ✓</text>
      </svg>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="font-bold text-blue-300 mb-2">① Voltage (easy!)</p>
          <p className="text-gray-700">All branches = battery V</p>
          <p className="font-bold text-blue-300">V₁=V₂=V₃= 12V</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <p className="font-bold text-green-300 mb-2">② Branch Currents</p>
          <p className="text-gray-700">I₁=12÷6 = <span className="font-bold">2A</span></p>
          <p className="text-gray-700">I₂=12÷4 = <span className="font-bold">3A</span></p>
          <p className="text-gray-700">I₃=12÷12 = <span className="font-bold">1A</span></p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <p className="font-bold text-orange-800 mb-2">③ Total Current</p>
          <p className="text-gray-700">I_total = I₁+I₂+I₃</p>
          <p className="text-gray-700">= 2+3+1</p>
          <p className="font-bold text-orange-300 text-lg">= 6 A</p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="bg-indigo-950/30 rounded-xl p-4 border border-indigo-500/20">
        <p className="font-bold text-indigo-300 mb-2">📌 Parallel Rules to Memorize:</p>
        <p className="text-indigo-300">• Voltage: V₁ = V₂ = V₃ (same everywhere)</p>
        <p className="text-indigo-300">• Current: I_total = I₁ + I₂ + I₃</p>
        <p className="text-indigo-300">• Each branch: I = V ÷ R (that branch's R)</p>
        <p className="text-indigo-300">• One break → others keep working</p>
      </div>
      <div className="bg-amber-950/30 rounded-xl p-4 border border-amber-500/20">
        <p className="font-bold text-amber-300 mb-2">🏠 Real-Life Parallel:</p>
        <p className="text-amber-300">• Home outlets all wired in parallel</p>
        <p className="text-amber-300">• Each device gets full 120V</p>
        <p className="text-amber-300">• Turning one device off doesn't affect others</p>
        <p className="text-amber-300">• Adding devices draws more total current</p>
      </div>
    </div>
  </div>
);

const ChargingMethodsDiagram = () => (
  <div className="bg-gradient-to-br from-[#181208] to-[#180f04] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Three Methods of Charging Objects</h4>
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl p-5 border-2 border-yellow-300 shadow-md">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🫧</div>
          <h5 className="font-bold text-yellow-800 text-lg">FRICTION</h5>
          <p className="text-xs text-gray-500">Triboelectric Effect</p>
        </div>
        <svg viewBox="0 0 160 80" className="w-full mb-3">
          <ellipse cx="50" cy="40" rx="35" ry="20" fill="#FEF08A" stroke="#EAB308" strokeWidth="2"/>
          <text x="50" y="44" textAnchor="middle" fontSize="12" fill="#854D0E" fontWeight="bold">Balloon</text>
          <ellipse cx="120" cy="40" rx="30" ry="18" fill="#D1FAE5" stroke="#10B981" strokeWidth="2"/>
          <text x="120" y="44" textAnchor="middle" fontSize="11" fill="#065F46" fontWeight="bold">Hair</text>
          <path d="M 80 35 Q 95 25 90 40 Q 95 55 80 45" fill="#DC2626" stroke="#DC2626" strokeWidth="1"/>
          <text x="84" y="20" fontSize="9" fill="#DC2626">e⁻ transfer</text>
        </svg>
        <div className="space-y-1 text-xs text-gray-700">
          <p>• Rubbing transfers electrons from one object to another</p>
          <p>• Balloon gains electrons → <span className="font-bold text-blue-600">negative charge</span></p>
          <p>• Hair loses electrons → <span className="font-bold text-red-600">positive charge</span></p>
          <p>• Objects attract each other</p>
        </div>
        <div className="mt-3 bg-yellow-50 rounded-lg p-2 text-xs text-yellow-800 font-semibold text-center">
          Examples: balloon + hair, shoes + carpet
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 border-2 border-orange-300 shadow-md">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">👆</div>
          <h5 className="font-bold text-orange-800 text-lg">CONDUCTION</h5>
          <p className="text-xs text-gray-500">Direct Contact</p>
        </div>
        <svg viewBox="0 0 160 80" className="w-full mb-3">
          <rect x="15" y="25" width="50" height="30" rx="5" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2"/>
          <text x="40" y="44" textAnchor="middle" fontSize="10" fill="#991B1B" fontWeight="bold">Charged</text>
          <text x="40" y="55" textAnchor="middle" fontSize="9" fill="#991B1B">(– – –)</text>
          <rect x="95" y="25" width="50" height="30" rx="5" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
          <text x="120" y="44" textAnchor="middle" fontSize="10" fill="#1D4ED8" fontWeight="bold">Neutral</text>
          <text x="120" y="55" textAnchor="middle" fontSize="9" fill="#1D4ED8">(neutral)</text>
          <line x1="65" y1="40" x2="95" y2="40" stroke="#DC2626" strokeWidth="2"/>
          <path d="M 82 36 L 90 40 L 82 44" fill="#DC2626"/>
          <text x="72" y="32" fontSize="8" fill="#DC2626">touch!</text>
        </svg>
        <div className="space-y-1 text-xs text-gray-700">
          <p>• Charged object TOUCHES the neutral object</p>
          <p>• Electrons flow from charged to neutral</p>
          <p>• Both objects end up with <span className="font-bold">same type of charge</span></p>
          <p>• Charge is shared between objects</p>
        </div>
        <div className="mt-3 bg-orange-50 rounded-lg p-2 text-xs text-orange-800 font-semibold text-center">
          Examples: touching a Van de Graaff generator
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 border-2 border-purple-300 shadow-md">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🧲</div>
          <h5 className="font-bold text-purple-800 text-lg">INDUCTION</h5>
          <p className="text-xs text-gray-500">No Contact Needed</p>
        </div>
        <svg viewBox="0 0 160 80" className="w-full mb-3">
          <rect x="10" y="25" width="45" height="30" rx="5" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2"/>
          <text x="32" y="40" textAnchor="middle" fontSize="10" fill="#991B1B" fontWeight="bold">– – –</text>
          <text x="32" y="52" textAnchor="middle" fontSize="8" fill="#991B1B">charged</text>
          <rect x="85" y="25" width="60" height="30" rx="5" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2"/>
          <text x="100" y="40" fontSize="10" fill="#3730A3" fontWeight="bold">+ –</text>
          <text x="95" y="52" fontSize="8" fill="#3730A3">induced!</text>
          <line x1="55" y1="40" x2="85" y2="40" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="4"/>
          <text x="58" y="34" fontSize="8" fill="#9CA3AF">no touch</text>
          <path d="M 85 39 L 75 35 L 75 43" fill="#9CA3AF"/>
        </svg>
        <div className="space-y-1 text-xs text-gray-700">
          <p>• Charged object brought <span className="font-bold">NEAR</span> (not touching) neutral object</p>
          <p>• Electrons in neutral object rearrange</p>
          <p>• Near side gets opposite charge</p>
          <p>• Far side gets same charge as charged object</p>
        </div>
        <div className="mt-3 bg-purple-50 rounded-lg p-2 text-xs text-purple-800 font-semibold text-center">
          Examples: charged comb attracts paper
        </div>
      </div>
    </div>
    <div className="mt-5 bg-white rounded-xl p-4 border border-gray-200">
      <p className="text-center font-bold text-gray-700 mb-3">Key Rule: Only ELECTRONS Move — Protons NEVER move!</p>
      <div className="flex justify-center gap-8 text-sm">
        <div className="text-center"><span className="text-red-600 font-bold text-xl">+</span><p className="text-gray-600 text-xs">Proton: FIXED in nucleus</p></div>
        <div className="text-center"><span className="text-blue-600 font-bold text-xl">–</span><p className="text-gray-600 text-xs">Electron: moves freely</p></div>
        <div className="text-center"><span className="text-gray-500 font-bold text-xl">○</span><p className="text-gray-600 text-xs">Neutron: no charge</p></div>
      </div>
    </div>
  </div>
);

const ResistanceFactorsDiagram = () => (
  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">What Affects Resistance?</h4>
    <div className="grid md:grid-cols-2 gap-6 mb-5">
      <div className="bg-white rounded-xl p-5 border-2 border-orange-300 shadow-md">
        <h5 className="font-bold text-orange-800 mb-4 text-center">Length of Wire</h5>
        <svg viewBox="0 0 240 100" className="w-full mb-3">
          <text x="10" y="20" fontSize="11" fill="#374151" fontWeight="bold">Short wire (Low R)</text>
          <line x1="10" y1="35" x2="120" y2="35" stroke="#10B981" strokeWidth="6" strokeLinecap="round"/>
          <text x="125" y="39" fontSize="10" fill="#10B981" fontWeight="bold">R = low ✓</text>
          <text x="10" y="65" fontSize="11" fill="#374151" fontWeight="bold">Long wire (High R)</text>
          <line x1="10" y1="80" x2="220" y2="80" stroke="#DC2626" strokeWidth="6" strokeLinecap="round"/>
          <text x="10" y="97" fontSize="10" fill="#DC2626" fontWeight="bold">R = high ✗</text>
        </svg>
        <p className="text-sm text-orange-300 text-center font-semibold">Longer wire = MORE resistance</p>
        <p className="text-xs text-gray-600 text-center mt-1">More collisions between electrons and atoms</p>
      </div>
      <div className="bg-white rounded-xl p-5 border-2 border-red-300 shadow-md">
        <h5 className="font-bold text-red-300 mb-4 text-center">Thickness of Wire</h5>
        <svg viewBox="0 0 240 100" className="w-full mb-3">
          <text x="10" y="20" fontSize="11" fill="#374151" fontWeight="bold">Thick wire (Low R)</text>
          <line x1="10" y1="35" x2="170" y2="35" stroke="#10B981" strokeWidth="14" strokeLinecap="round"/>
          <text x="175" y="39" fontSize="10" fill="#10B981" fontWeight="bold">R = low</text>
          <text x="10" y="70" fontSize="11" fill="#374151" fontWeight="bold">Thin wire (High R)</text>
          <line x1="10" y1="85" x2="170" y2="85" stroke="#DC2626" strokeWidth="3" strokeLinecap="round"/>
          <text x="175" y="89" fontSize="10" fill="#DC2626" fontWeight="bold">R = high</text>
        </svg>
        <p className="text-sm text-red-300 text-center font-semibold">Thinner wire = MORE resistance</p>
        <p className="text-xs text-gray-600 text-center mt-1">Less space for electrons to flow through</p>
      </div>
      <div className="bg-white rounded-xl p-5 border-2 border-yellow-300 shadow-md">
        <h5 className="font-bold text-yellow-800 mb-4 text-center">Material Type</h5>
        <div className="space-y-2">
          {[
            { name: 'Silver', r: 5, color: '#9CA3AF', label: 'Best conductor' },
            { name: 'Copper', r: 8, color: '#F59E0B', label: 'Common wire' },
            { name: 'Aluminium', r: 14, color: '#93C5FD', label: 'Power lines' },
            { name: 'Tungsten', r: 55, color: '#6B7280', label: 'Bulb filament' },
            { name: 'Rubber', r: 90, color: '#DC2626', label: 'Insulator' },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs font-semibold w-16 text-gray-700">{m.name}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${m.r}%`, backgroundColor: m.color }}></div>
              </div>
              <span className="text-xs text-gray-500 w-20">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 border-2 border-blue-300 shadow-md">
        <h5 className="font-bold text-blue-300 mb-4 text-center">Temperature Effect</h5>
        <svg viewBox="0 0 240 110" className="w-full">
          <path d="M 30 90 Q 80 85 130 70 Q 180 55 210 30" fill="none" stroke="#DC2626" strokeWidth="3"/>
          <text x="30" y="105" fontSize="9" fill="#374151">Cold (0°C)</text>
          <text x="180" y="25" fontSize="9" fill="#374151">Hot (100°C)</text>
          <text x="90" y="50" fontSize="10" fill="#DC2626" fontWeight="bold">Resistance ↑</text>
          <line x1="30" y1="15" x2="30" y2="95" stroke="#374151" strokeWidth="2"/>
          <line x1="25" y1="95" x2="215" y2="95" stroke="#374151" strokeWidth="2"/>
          <text x="5" y="60" fontSize="9" fill="#374151">R</text>
          <text x="100" y="108" fontSize="9" fill="#374151">Temperature →</text>
        </svg>
        <p className="text-sm text-blue-300 text-center font-semibold mt-2">Hotter = MORE resistance (for metals)</p>
        <p className="text-xs text-gray-600 text-center mt-1">Atoms vibrate more, blocking electron flow</p>
      </div>
    </div>
    <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-300">
      <p className="font-bold text-amber-300 text-center">Summary: R increases with → longer length, thinner wire, certain materials, higher temperature</p>
    </div>
  </div>
);

const ElectricalSafetyDiagram = () => (
  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Electrical Safety & Protection Devices</h4>
    <div className="grid md:grid-cols-3 gap-5 mb-6">
      <div className="bg-white rounded-xl p-5 border-2 border-yellow-300 shadow-md">
        <div className="text-center mb-3">
          <div className="text-3xl mb-1">🔌</div>
          <h5 className="font-bold text-yellow-800">FUSE</h5>
        </div>
        <svg viewBox="0 0 160 70" className="w-full mb-3">
          <line x1="10" y1="35" x2="40" y2="35" stroke="#1F2937" strokeWidth="3"/>
          <rect x="40" y="20" width="80" height="30" rx="5" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
          <line x1="40" y1="35" x2="120" y2="35" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3"/>
          <text x="75" y="39" textAnchor="middle" fontSize="9" fill="#92400E" fontWeight="bold">thin wire</text>
          <line x1="120" y1="35" x2="150" y2="35" stroke="#1F2937" strokeWidth="3"/>
        </svg>
        <div className="text-xs text-gray-700 space-y-1">
          <p>• Contains a <span className="font-bold">thin wire</span> that melts when current is too high</p>
          <p>• Permanently breaks the circuit</p>
          <p>• Must be <span className="font-bold text-red-600">replaced</span> after it blows</p>
          <p>• Rated in Amperes (e.g., 15A fuse)</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 border-2 border-orange-300 shadow-md">
        <div className="text-center mb-3">
          <div className="text-3xl mb-1">⚡</div>
          <h5 className="font-bold text-orange-800">CIRCUIT BREAKER</h5>
        </div>
        <svg viewBox="0 0 160 70" className="w-full mb-3">
          <line x1="10" y1="35" x2="50" y2="35" stroke="#1F2937" strokeWidth="3"/>
          <rect x="50" y="15" width="60" height="40" rx="5" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2"/>
          <line x1="65" y1="35" x2="65" y2="25" stroke="#1F2937" strokeWidth="2"/>
          <circle cx="65" cy="25" r="3" fill="#DC2626"/>
          <circle cx="95" cy="35" r="3" fill="#1F2937"/>
          <text x="80" y="50" textAnchor="middle" fontSize="8" fill="#92400E">SWITCH</text>
          <line x1="110" y1="35" x2="150" y2="35" stroke="#1F2937" strokeWidth="3"/>
        </svg>
        <div className="text-xs text-gray-700 space-y-1">
          <p>• Electromagnetic switch that <span className="font-bold">trips</span> on overload</p>
          <p>• Can be <span className="font-bold text-green-600">reset</span> (unlike fuse)</p>
          <p>• Used in home electrical panels</p>
          <p>• Resets by flipping the switch back</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 border-2 border-green-300 shadow-md">
        <div className="text-center mb-3">
          <div className="text-3xl mb-1">🌍</div>
          <h5 className="font-bold text-green-300">GROUNDING</h5>
        </div>
        <svg viewBox="0 0 160 80" className="w-full mb-3">
          <rect x="50" y="5" width="60" height="35" rx="5" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2"/>
          <text x="80" y="27" textAnchor="middle" fontSize="10" fill="#15803D" fontWeight="bold">Appliance</text>
          <line x1="80" y1="40" x2="80" y2="55" stroke="#1F2937" strokeWidth="3"/>
          <line x1="60" y1="55" x2="100" y2="55" stroke="#1F2937" strokeWidth="3"/>
          <line x1="65" y1="60" x2="95" y2="60" stroke="#1F2937" strokeWidth="2"/>
          <line x1="70" y1="65" x2="90" y2="65" stroke="#1F2937" strokeWidth="1.5"/>
          <line x1="75" y1="70" x2="85" y2="70" stroke="#1F2937" strokeWidth="1"/>
          <text x="80" y="80" textAnchor="middle" fontSize="9" fill="#16A34A" fontWeight="bold">Earth/Ground</text>
        </svg>
        <div className="text-xs text-gray-700 space-y-1">
          <p>• 3rd prong connects device to Earth</p>
          <p>• Provides safe path for <span className="font-bold">fault current</span></p>
          <p>• Prevents electrocution if wiring fails</p>
          <p>• Required for all metal appliances</p>
        </div>
      </div>
    </div>
    <div className="bg-red-100 rounded-xl p-4 border-2 border-red-400">
      <p className="font-bold text-red-300 text-center mb-3">⚠️ Current Danger Levels — Know These!</p>
      <div className="grid grid-cols-4 gap-3 text-center text-xs">
        {[
          { mA: '1 mA', effect: 'Barely felt', color: 'bg-green-100 border-green-400 text-green-300' },
          { mA: '10 mA', effect: 'Painful, muscle contraction', color: 'bg-yellow-100 border-yellow-400 text-yellow-800' },
          { mA: '100 mA', effect: '⚠️ FATAL — ventricular fibrillation', color: 'bg-orange-100 border-orange-400 text-orange-800' },
          { mA: '1000 mA', effect: '💀 Certain death, severe burns', color: 'bg-red-200 border-red-500 text-red-900' },
        ].map((d, i) => (
          <div key={i} className={`rounded-lg p-2 border-2 ${d.color}`}>
            <p className="font-black text-lg">{d.mA}</p>
            <p>{d.effect}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PowerCostCalculatorDiagram = () => (
  <div className="bg-gradient-to-br from-[#060f0a] to-[#081408] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Electrical Energy Cost — Worked Examples</h4>
    <div className="bg-white rounded-xl p-5 border-2 border-green-300 mb-5 shadow-md">
      <p className="text-center font-bold text-gray-700 mb-4">Formula Chain: <span className="text-green-300">P = V × I</span> → <span className="text-blue-300">E = P × t</span> → <span className="text-purple-300">Cost = E × rate</span></p>
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="bg-green-950/30 rounded-xl p-4 border border-green-500/20">
          <p className="font-bold text-green-300 mb-2">Example 1 — Light Bulb</p>
          <div className="space-y-1 text-gray-600 text-xs">
            <p>60W bulb, 5 hours/day, 30 days</p>
            <p>Rate: $0.13/kWh</p>
            <p className="border-t pt-1">E = 0.06 kW × 5h × 30</p>
            <p>E = <span className="font-bold text-green-300">9 kWh</span></p>
            <p>Cost = 9 × $0.13</p>
            <p className="text-lg font-bold text-green-300">= $1.17/month</p>
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="font-bold text-blue-300 mb-2">Example 2 — Heater</p>
          <div className="space-y-1 text-gray-600 text-xs">
            <p>1500W heater, 8 hours</p>
            <p>Rate: $0.12/kWh</p>
            <p className="border-t pt-1">E = 1.5 kW × 8h</p>
            <p>E = <span className="font-bold text-blue-300">12 kWh</span></p>
            <p>Cost = 12 × $0.12</p>
            <p className="text-lg font-bold text-blue-300">= $1.44</p>
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <p className="font-bold text-purple-800 mb-2">Example 3 — From V & I</p>
          <div className="space-y-1 text-gray-600 text-xs">
            <p>Device: 120V, draws 2.5A, 4 hours</p>
            <p>Rate: $0.10/kWh</p>
            <p className="border-t pt-1">P = 120 × 2.5 = 300W</p>
            <p>E = 0.3 kW × 4h = <span className="font-bold text-purple-300">1.2 kWh</span></p>
            <p>Cost = 1.2 × $0.10</p>
            <p className="text-lg font-bold text-purple-300">= $0.12</p>
          </div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-xl p-4 border-2 border-amber-200">
        <p className="font-bold text-amber-300 mb-3">🏠 Common Appliance Wattages</p>
        <div className="space-y-2">
          {[
            { name: 'LED Bulb', w: 10, bar: 1 },
            { name: 'Laptop', w: 50, bar: 3 },
            { name: 'TV (55")', w: 150, bar: 10 },
            { name: 'Fridge', w: 200, bar: 13 },
            { name: 'Microwave', w: 1000, bar: 67 },
            { name: 'Dryer', w: 5000, bar: 100 },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-20 text-gray-700 font-semibold">{a.name}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-3">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${a.bar}%` }}></div>
              </div>
              <span className="w-14 text-gray-600 font-mono">{a.w}W</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 border-2 border-teal-200">
        <p className="font-bold text-teal-800 mb-3">📝 Step-by-Step Method</p>
        <div className="space-y-2 text-xs">
          <div className="flex gap-2 items-start">
            <span className="w-5 h-5 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</span>
            <p className="text-gray-700">Convert Watts to Kilowatts: <span className="font-mono font-bold">÷ 1000</span></p>
          </div>
          <div className="flex gap-2 items-start">
            <span className="w-5 h-5 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</span>
            <p className="text-gray-700">Calculate Energy: <span className="font-bold">kW × hours = kWh</span></p>
          </div>
          <div className="flex gap-2 items-start">
            <span className="w-5 h-5 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</span>
            <p className="text-gray-700">Calculate Cost: <span className="font-bold">kWh × $/kWh</span></p>
          </div>
          <div className="flex gap-2 items-start">
            <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">!</span>
            <p className="text-gray-700">If given V and I first: <span className="font-bold">P = V × I</span>, then continue</p>
          </div>
        </div>
        <div className="mt-3 bg-teal-50 rounded-lg p-2 text-xs text-teal-800 font-semibold">
          💡 kWh is what your electricity bill charges for!
        </div>
      </div>
    </div>
  </div>
);

const StaticVsCurrentDiagram = () => (
  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Static vs Current Electricity</h4>
    <div className="grid md:grid-cols-2 gap-6 mb-5">
      <div className="bg-white rounded-xl p-5 border-2 border-yellow-400 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-2xl">⚡</div>
          <h5 className="font-bold text-yellow-800 text-xl">STATIC Electricity</h5>
        </div>
        <svg viewBox="0 0 220 90" className="w-full mb-3">
          <rect x="10" y="20" width="200" height="50" rx="8" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2"/>
          <text x="30" y="40" fontSize="18" fill="#B45309">– – – – – – – – –</text>
          <text x="30" y="60" fontSize="18" fill="#B45309">– – – – – – – – –</text>
          <text x="70" y="78" fontSize="10" fill="#92400E" fontWeight="bold">charges STAY in place</text>
        </svg>
        <div className="space-y-1 text-sm text-gray-700">
          <p>• Charge <span className="font-bold text-yellow-300">builds up</span> on surface of object</p>
          <p>• Electrons do <span className="font-bold">not</span> flow continuously</p>
          <p>• Discharge happens suddenly (spark!)</p>
          <p>• Examples: balloon, walking on carpet, lightning</p>
          <p>• Cannot do useful electrical work</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 border-2 border-blue-400 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-2xl">🔋</div>
          <h5 className="font-bold text-blue-300 text-xl">CURRENT Electricity</h5>
        </div>
        <svg viewBox="0 0 220 90" className="w-full mb-3">
          <rect x="10" y="30" width="200" height="30" rx="5" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
          <text x="20" y="50" fontSize="18" fill="#1D4ED8">→ → → → → → → →</text>
          <text x="55" y="75" fontSize="10" fill="#1E40AF" fontWeight="bold">electrons FLOW in a loop</text>
        </svg>
        <div className="space-y-1 text-sm text-gray-700">
          <p>• Electrons <span className="font-bold text-blue-300">flow continuously</span> in a circuit</p>
          <p>• Requires a closed loop (circuit)</p>
          <p>• Needs an energy source (battery, outlet)</p>
          <p>• Examples: lights, phone charger, TV</p>
          <p>• Does useful work (powers devices)</p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
      <div className="grid grid-cols-4 gap-3 text-center text-xs font-semibold">
        {[['Property','Static','Current','Winner'],['Motion','Charges stay','Charges flow','Current'],['Path needed','No','Yes (circuit)','—'],['Continuous?','No (one burst)','Yes','Current'],['Powers devices?','No','Yes','Current'],['Example','Doorknob shock','LED bulb','—']].map((row, i) => (
          <React.Fragment key={i}>
            <div className={`p-2 rounded ${i===0?'bg-purple-100 text-purple-800':i%2===0?'bg-gray-50':'bg-white'} col-span-1`}>{row[0]}</div>
            <div className={`p-2 rounded ${i===0?'bg-yellow-100 text-yellow-800':i%2===0?'bg-gray-50':'bg-white'}`}>{row[1]}</div>
            <div className={`p-2 rounded ${i===0?'bg-blue-100 text-blue-300':i%2===0?'bg-gray-50':'bg-white'}`}>{row[2]}</div>
            <div className={`p-2 rounded ${i===0?'bg-green-100 text-green-300':i%2===0?'bg-gray-50':'bg-white'}`}>{row[3]}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);

const ElectroscopeDiagram = () => (
  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">How an Electroscope Works</h4>
    <div className="grid md:grid-cols-3 gap-6 mb-5">
      {[
        { label: 'Neutral', color: '#6B7280', leafAngle: 0, desc: 'Leaves hang straight down. Equal + and − charges.', borderColor: 'border-gray-200', bg: 'bg-gray-50' },
        { label: 'Charged (−)', color: '#3B82F6', leafAngle: 35, desc: 'Leaves spread apart — both leaves got − charge, repel each other.', borderColor: 'border-blue-300', bg: 'bg-blue-50' },
        { label: 'Charged (+)', color: '#EF4444', leafAngle: 35, desc: 'Leaves spread apart — both leaves got + charge (lost electrons), repel.', borderColor: 'border-red-300', bg: 'bg-red-50' },
      ].map((state, i) => (
        <div key={i} className={`bg-white rounded-xl p-5 border-2 ${state.borderColor} shadow-md text-center`}>
          <h5 className="font-bold mb-3" style={{ color: state.color }}>{state.label}</h5>
          <svg viewBox="0 0 120 160" className="w-full h-36 mx-auto mb-3">
            <rect x="40" y="5" width="40" height="20" rx="5" fill="#D1FAE5" stroke="#10B981" strokeWidth="2"/>
            <text x="60" y="20" textAnchor="middle" fontSize="10" fill="#065F46" fontWeight="bold">Metal plate</text>
            <line x1="60" y1="25" x2="60" y2="75" stroke="#9CA3AF" strokeWidth="3"/>
            <circle cx="60" cy="78" r="6" fill={state.color} opacity="0.8"/>
            {state.leafAngle === 0 ? (
              <>
                <line x1="57" y1="84" x2="50" y2="130" stroke={state.color} strokeWidth="3" strokeLinecap="round"/>
                <line x1="63" y1="84" x2="70" y2="130" stroke={state.color} strokeWidth="3" strokeLinecap="round"/>
              </>
            ) : (
              <>
                <line x1="57" y1="84" x2="35" y2="128" stroke={state.color} strokeWidth="3" strokeLinecap="round"/>
                <line x1="63" y1="84" x2="85" y2="128" stroke={state.color} strokeWidth="3" strokeLinecap="round"/>
              </>
            )}
            <text x="60" y="150" textAnchor="middle" fontSize="9" fill={state.color} fontWeight="bold">
              {state.leafAngle === 0 ? '← closed →' : '← open →'}
            </text>
          </svg>
          <p className="text-xs text-gray-600">{state.desc}</p>
        </div>
      ))}
    </div>
    <div className="bg-amber-950/30 rounded-xl p-4 border border-amber-500/20">
      <p className="font-bold text-amber-300 mb-2 text-center">Key Rule: Leaves spread = charged. Leaves collapse = neutral or opposite charge nearby</p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-white rounded-lg p-3 border border-amber-200">
          <p className="font-bold text-amber-300 mb-1">Using Induction with Electroscope:</p>
          <p className="text-gray-600 text-xs">Bring charged rod near (don't touch) → leaves spread. Touch your finger to plate while rod is near → ground it. Remove finger, then rod → leaves stay slightly spread (opposite charge induced)</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-amber-200">
          <p className="font-bold text-amber-300 mb-1">Using Conduction with Electroscope:</p>
          <p className="text-gray-600 text-xs">Touch charged rod to plate → charge transfers directly. Leaves spread and STAY spread even after rod is removed. Object now holds same type of charge as rod that touched it.</p>
        </div>
      </div>
    </div>
  </div>
);

const LightningDiagram = () => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8">
    <h4 className="text-center font-semibold text-white mb-6">How Lightning Forms — Static on a Massive Scale</h4>
    <div className="grid md:grid-cols-2 gap-6 mb-5">
      <div>
        <svg viewBox="0 0 260 280" className="w-full">
          <defs>
            <radialGradient id="cloudGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#94A3B8"/>
              <stop offset="100%" stopColor="#475569"/>
            </radialGradient>
          </defs>
          <ellipse cx="130" cy="60" rx="110" ry="50" fill="url(#cloudGrad)" opacity="0.9"/>
          <text x="130" y="45" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">Storm Cloud</text>
          <text x="130" y="62" textAnchor="middle" fontSize="20">– – – – –</text>
          <text x="130" y="82" textAnchor="middle" fontSize="11" fill="#FCD34D">Bottom: negative charge</text>
          <text x="65" y="35" fontSize="16" fill="#FCD34D">+ + +</text>
          <text x="65" y="22" fontSize="10" fill="#FCD34D">Top: positive</text>
          <path d="M 120 112 L 100 160 L 118 160 L 100 200 L 140 148 L 122 148 L 145 112 Z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1"/>
          <rect x="10" y="225" width="240" height="50" rx="5" fill="#374151"/>
          <text x="130" y="248" textAnchor="middle" fontSize="11" fill="white">Ground (Earth)</text>
          <text x="130" y="265" textAnchor="middle" fontSize="20" fill="#EF4444">+ + + + + + + + +</text>
          <text x="65" y="215" fontSize="10" fill="#60A5FA">electrons rush</text>
          <text x="65" y="226" fontSize="10" fill="#60A5FA">down = lightning!</text>
        </svg>
      </div>
      <div className="space-y-3">
        {[
          { step: '1', title: 'Charge Separation', text: 'Ice crystals and water droplets collide inside storm cloud, separating charges. Negative (−) charges accumulate at bottom, positive (+) at top.', color: 'bg-blue-900 border-blue-500' },
          { step: '2', title: 'Ground Induction', text: 'The negative cloud base REPELS electrons in the ground below. Ground surface becomes positively charged (electrons pushed away).', color: 'bg-purple-900 border-purple-500' },
          { step: '3', title: 'Leader Stroke', text: 'Invisible "stepped leader" of electrons zigzags down from cloud. A "streamer" of positive charge rises from ground objects (trees, buildings).', color: 'bg-amber-900 border-amber-500' },
          { step: '4', title: 'Return Stroke = LIGHTNING!', text: 'When leader meets streamer → massive current flows. The bright flash is the return stroke — billions of volts, 30,000°C, 30,000 amps!', color: 'bg-yellow-900 border-yellow-400' },
          { step: '5', title: 'Lightning Rod', text: 'Metal rod on building provides easy path for charge to flow safely to ground. Prevents charge buildup that leads to dangerous strike on building.', color: 'bg-green-900 border-green-500' },
        ].map(s => (
          <div key={s.step} className={`rounded-lg p-3 border-2 ${s.color} flex gap-3`}>
            <div className="w-7 h-7 bg-yellow-400 text-slate-900 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">{s.step}</div>
            <div>
              <p className="font-bold text-white text-sm">{s.title}</p>
              <p className="text-gray-600 text-xs mt-1">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const OhmsLawGraph = () => (
  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Ohm's Law — Graphical Relationships</h4>
    <div className="grid md:grid-cols-3 gap-5 mb-5">
      <div className="bg-white rounded-xl p-4 border-2 border-blue-300 shadow-md">
        <h5 className="font-bold text-blue-300 text-center mb-3">V vs I (R constant)</h5>
        <svg viewBox="0 0 160 140" className="w-full mb-2">
          <line x1="25" y1="10" x2="25" y2="115" stroke="#374151" strokeWidth="2"/>
          <line x1="20" y1="110" x2="150" y2="110" stroke="#374151" strokeWidth="2"/>
          <path d="M 25 110 L 140 20" stroke="#3B82F6" strokeWidth="3" fill="none"/>
          <text x="80" y="130" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="bold">Current (I) →</text>
          <text x="10" y="70" fontSize="11" fill="#374151" fontWeight="bold" transform="rotate(-90,10,70)">Voltage (V)</text>
          <text x="100" y="45" fontSize="10" fill="#3B82F6" fontWeight="bold">slope = R</text>
          <circle cx="25" cy="110" r="3" fill="#3B82F6"/>
          <circle cx="60" cy="83" r="3" fill="#3B82F6"/>
          <circle cx="95" cy="56" r="3" fill="#3B82F6"/>
          <circle cx="130" cy="29" r="3" fill="#3B82F6"/>
        </svg>
        <p className="text-xs text-blue-300 text-center font-semibold">Straight line through origin → V ∝ I</p>
        <p className="text-xs text-gray-600 text-center">Steeper slope = higher resistance</p>
      </div>
      <div className="bg-white rounded-xl p-4 border-2 border-green-300 shadow-md">
        <h5 className="font-bold text-green-300 text-center mb-3">I vs R (V constant)</h5>
        <svg viewBox="0 0 160 140" className="w-full mb-2">
          <line x1="25" y1="10" x2="25" y2="115" stroke="#374151" strokeWidth="2"/>
          <line x1="20" y1="110" x2="150" y2="110" stroke="#374151" strokeWidth="2"/>
          <path d="M 30 20 Q 60 40 90 65 Q 120 85 145 100" stroke="#10B981" strokeWidth="3" fill="none"/>
          <text x="80" y="130" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="bold">Resistance (R) →</text>
          <text x="10" y="70" fontSize="11" fill="#374151" fontWeight="bold" transform="rotate(-90,10,70)">Current (I)</text>
          <text x="90" y="38" fontSize="10" fill="#10B981" fontWeight="bold">I = V/R</text>
          <text x="100" y="50" fontSize="9" fill="#10B981">(hyperbola)</text>
        </svg>
        <p className="text-xs text-green-300 text-center font-semibold">Curve → as R↑, I↓ (inverse)</p>
        <p className="text-xs text-gray-600 text-center">Double R → halve I</p>
      </div>
      <div className="bg-white rounded-xl p-4 border-2 border-orange-300 shadow-md">
        <h5 className="font-bold text-orange-800 text-center mb-3">Multiple R values</h5>
        <svg viewBox="0 0 160 140" className="w-full mb-2">
          <line x1="25" y1="10" x2="25" y2="115" stroke="#374151" strokeWidth="2"/>
          <line x1="20" y1="110" x2="150" y2="110" stroke="#374151" strokeWidth="2"/>
          <path d="M 25 110 L 140 30" stroke="#EF4444" strokeWidth="2.5" fill="none"/>
          <path d="M 25 110 L 140 55" stroke="#F59E0B" strokeWidth="2.5" fill="none"/>
          <path d="M 25 110 L 140 85" stroke="#10B981" strokeWidth="2.5" fill="none"/>
          <text x="142" y="30" fontSize="9" fill="#EF4444">R=high</text>
          <text x="142" y="55" fontSize="9" fill="#F59E0B">R=med</text>
          <text x="142" y="85" fontSize="9" fill="#10B981">R=low</text>
          <text x="80" y="130" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="bold">Current (I) →</text>
          <text x="10" y="70" fontSize="11" fill="#374151" fontWeight="bold" transform="rotate(-90,10,70)">Voltage (V)</text>
        </svg>
        <p className="text-xs text-orange-300 text-center font-semibold">All lines through origin</p>
        <p className="text-xs text-gray-600 text-center">Higher R = steeper slope</p>
      </div>
    </div>
    <div className="bg-white rounded-xl p-4 border-2 border-indigo-200">
      <p className="font-bold text-indigo-300 mb-3 text-center">📊 Reading V-I Graphs on Tests</p>
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="bg-indigo-50 rounded-lg p-3">
          <p className="font-bold text-indigo-300 mb-1">Finding Resistance:</p>
          <p className="text-gray-600">Pick any point on the line. R = V ÷ I using those coordinates. Steeper slope = higher R.</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="font-bold text-purple-300 mb-1">Ohmic vs Non-Ohmic:</p>
          <p className="text-gray-600">Straight line through origin = Ohmic (follows V=IR). Curved line = Non-Ohmic (e.g. light bulb filament heats up).</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="font-bold text-blue-300 mb-1">Exam Tip:</p>
          <p className="text-gray-600">If graph is curved at high I → resistance is increasing (filament getting hot). Always check if line passes through origin!</p>
        </div>
      </div>
    </div>
  </div>
);

const AmpmeterVoltmeterDiagram = () => (
  <div className="bg-gradient-to-br from-[#060f10] to-[#061014] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Ammeter & Voltmeter — How to Connect Them</h4>
    <div className="grid md:grid-cols-2 gap-6 mb-5">
      <div className="bg-white rounded-xl p-5 border-2 border-teal-300 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-teal-500 rounded-full flex items-center justify-center text-white font-black text-sm">A</div>
          <h5 className="font-bold text-teal-800 text-lg">AMMETER — measures current (A)</h5>
        </div>
        <svg viewBox="0 0 260 110" className="w-full mb-3">
          <rect x="5" y="45" width="35" height="25" rx="4" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2"/>
          <text x="22" y="62" textAnchor="middle" fontSize="10" fill="#92400E" fontWeight="bold">Cell</text>
          <line x1="40" y1="57" x2="70" y2="57" stroke="#1F2937" strokeWidth="2.5"/>
          <circle cx="82" cy="57" r="12" fill="#CCFBF1" stroke="#0D9488" strokeWidth="2"/>
          <text x="82" y="61" textAnchor="middle" fontSize="10" fill="#065F46" fontWeight="bold">A</text>
          <line x1="94" y1="57" x2="150" y2="57" stroke="#1F2937" strokeWidth="2.5"/>
          <circle cx="162" cy="57" r="12" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
          <text x="162" y="61" textAnchor="middle" fontSize="9" fill="#92400E" fontWeight="bold">R</text>
          <line x1="174" y1="57" x2="245" y2="57" stroke="#1F2937" strokeWidth="2.5"/>
          <line x1="245" y1="57" x2="245" y2="90" stroke="#1F2937" strokeWidth="2.5"/>
          <line x1="5" y1="90" x2="245" y2="90" stroke="#1F2937" strokeWidth="2.5"/>
          <line x1="5" y1="70" x2="5" y2="90" stroke="#1F2937" strokeWidth="2.5"/>
          <text x="82" y="30" textAnchor="middle" fontSize="9" fill="#0D9488" fontWeight="bold">A in SERIES</text>
          <path d="M 82 35 L 82 44" stroke="#0D9488" strokeWidth="1.5" markerEnd="url(#tarr)"/>
          <defs><marker id="tarr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#0D9488"/></marker></defs>
        </svg>
        <div className="space-y-1 text-sm text-gray-700">
          <p>• Connected <span className="font-bold text-teal-300">IN SERIES</span> — current flows THROUGH it</p>
          <p>• Must be in the same wire/path as what you're measuring</p>
          <p>• Has very LOW resistance (doesn't disturb circuit)</p>
          <p>• Breaking circuit and inserting ammeter in the gap</p>
          <p className="text-red-600 font-semibold">⚠️ Never connect directly across a battery — low resistance = huge current = damage!</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 border-2 border-cyan-300 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-cyan-500 rounded-full flex items-center justify-center text-white font-black text-sm">V</div>
          <h5 className="font-bold text-cyan-800 text-lg">VOLTMETER — measures voltage (V)</h5>
        </div>
        <svg viewBox="0 0 260 130" className="w-full mb-3">
          <rect x="5" y="45" width="35" height="25" rx="4" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2"/>
          <text x="22" y="62" textAnchor="middle" fontSize="10" fill="#92400E" fontWeight="bold">Cell</text>
          <line x1="40" y1="57" x2="150" y2="57" stroke="#1F2937" strokeWidth="2.5"/>
          <circle cx="162" cy="57" r="12" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
          <text x="162" y="61" textAnchor="middle" fontSize="9" fill="#92400E" fontWeight="bold">R</text>
          <line x1="174" y1="57" x2="245" y2="57" stroke="#1F2937" strokeWidth="2.5"/>
          <line x1="245" y1="57" x2="245" y2="100" stroke="#1F2937" strokeWidth="2.5"/>
          <line x1="5" y1="100" x2="245" y2="100" stroke="#1F2937" strokeWidth="2.5"/>
          <line x1="5" y1="70" x2="5" y2="100" stroke="#1F2937" strokeWidth="2.5"/>
          <line x1="150" y1="57" x2="150" y2="85" stroke="#0891B2" strokeWidth="2" strokeDasharray="4"/>
          <circle cx="162" cy="90" r="12" fill="#CFFAFE" stroke="#0891B2" strokeWidth="2"/>
          <text x="162" y="94" textAnchor="middle" fontSize="9" fill="#0E7490" fontWeight="bold">V</text>
          <line x1="174" y1="90" x2="174" y2="57" stroke="#0891B2" strokeWidth="2" strokeDasharray="4"/>
          <text x="162" y="118" textAnchor="middle" fontSize="9" fill="#0891B2" fontWeight="bold">V in PARALLEL across R</text>
        </svg>
        <div className="space-y-1 text-sm text-gray-700">
          <p>• Connected <span className="font-bold text-cyan-300">IN PARALLEL</span> — bridges across the component</p>
          <p>• Placed across (in parallel with) the component to measure</p>
          <p>• Has very HIGH resistance (barely any current flows through it)</p>
          <p>• Does NOT break the circuit — just connects across</p>
          <p className="text-green-600 font-semibold">✓ Safe to connect across battery — reads battery voltage</p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <p className="font-bold text-gray-700 text-center mb-3">Memory Trick: <span className="text-teal-300">A</span>mmeter in series = <span className="text-teal-300">A</span>long the path | <span className="text-cyan-300">V</span>oltmeter in parallel = <span className="text-cyan-300">V</span>ertical bridge</p>
    </div>
  </div>
);

const SeriesParallelComparisonTable = () => (
  <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Series vs Parallel — Complete Comparison</h4>
    <div className="overflow-x-auto mb-5">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="bg-purple-200 text-purple-900 p-3 rounded-tl-lg text-left">Property</th>
            <th className="bg-blue-200 text-blue-900 p-3 text-center">Series Circuit</th>
            <th className="bg-green-200 text-green-900 p-3 rounded-tr-lg text-center">Parallel Circuit</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Current (I)', 'SAME everywhere\nI = I₁ = I₂ = I₃', 'DIVIDES at junctions\nI_total = I₁ + I₂ + I₃'],
            ['Voltage (V)', 'DIVIDES among components\nV_total = V₁ + V₂ + V₃', 'SAME across all branches\nV = V₁ = V₂ = V₃'],
            ['Resistance (R)', 'ADDS UP\nR_total = R₁ + R₂ + R₃', 'DECREASES\n1/R_t = 1/R₁ + 1/R₂ + 1/R₃'],
            ['If one breaks', 'ALL stop working ✗', 'Others keep working ✓'],
            ['Adding more', 'More dim (more R shared)', 'Same brightness (same V)'],
            ['Real-life use', 'Old string lights, switches', 'Home wiring, hospital gear'],
            ['Formula check', 'V₁+V₂+V₃ = battery V', 'I₁+I₂+I₃ = total I'],
          ].map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="p-3 font-semibold text-purple-800 border-b border-gray-100">{row[0]}</td>
              <td className="p-3 text-blue-300 border-b border-gray-100 text-center whitespace-pre-line text-xs">{row[1]}</td>
              <td className="p-3 text-green-300 border-b border-gray-100 text-center whitespace-pre-line text-xs">{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-blue-50 rounded-xl p-4">
        <p className="font-bold text-blue-300 mb-2">📌 Series Exam Checklist:</p>
        <div className="space-y-1 text-xs text-blue-300">
          <p>□ R_total = sum of all resistors</p>
          <p>□ I = V_battery ÷ R_total (same everywhere)</p>
          <p>□ Each V = I × that R (voltage divider)</p>
          <p>□ Check: all V's add to battery voltage</p>
        </div>
      </div>
      <div className="bg-green-950/30 rounded-xl p-4 border border-green-500/20">
        <p className="font-bold text-green-300 mb-2">📌 Parallel Exam Checklist:</p>
        <div className="space-y-1 text-xs text-green-300">
          <p>□ Each branch: V = battery voltage</p>
          <p>□ Each branch: I = V ÷ that branch's R</p>
          <p>□ I_total = sum of all branch currents</p>
          <p>□ Check: all I's add to total current</p>
        </div>
      </div>
    </div>
  </div>
);

const EnergyConversionDiagram = () => (
  <div className="bg-gradient-to-br from-[#181208] to-[#181408] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Energy Conversions in Electrical Devices</h4>
    <div className="grid md:grid-cols-2 gap-6 mb-5">
      <div>
        <h5 className="font-bold text-amber-300 mb-4 text-center">Input → Process → Output</h5>
        {[
          { device: '💡 Light Bulb', input: 'Electrical', arrow: '→', output: 'Light + Heat', eff: '~5%', color: 'border-yellow-300 bg-yellow-50' },
          { device: '💡 LED Bulb', input: 'Electrical', arrow: '→', output: 'Light + tiny Heat', eff: '~40%', color: 'border-green-300 bg-green-50' },
          { device: '🔊 Speaker', input: 'Electrical', arrow: '→', output: 'Sound + Heat', eff: '~25%', color: 'border-blue-300 bg-blue-50' },
          { device: '⚙️ Motor', input: 'Electrical', arrow: '→', output: 'Motion + Heat', eff: '~85%', color: 'border-purple-300 bg-purple-50' },
          { device: '🔋 Battery charger', input: 'Electrical', arrow: '→', output: 'Chemical energy', eff: '~90%', color: 'border-teal-300 bg-teal-50' },
          { device: '☀️ Solar Panel', input: 'Light', arrow: '→', output: 'Electrical + Heat', eff: '~20%', color: 'border-orange-300 bg-orange-50' },
        ].map((item, i) => (
          <div key={i} className={`flex items-center gap-3 p-2 rounded-lg border mb-2 ${item.color}`}>
            <span className="text-xl w-8">{item.device.split(' ')[0]}</span>
            <span className="text-xs font-semibold text-gray-700 w-24">{item.device.substring(2)}</span>
            <span className="text-xs text-gray-500 flex-1">{item.input} → {item.output}</span>
            <span className="text-xs font-bold text-gray-600 bg-gray-200 rounded px-1">{item.eff} eff.</span>
          </div>
        ))}
      </div>
      <div>
        <h5 className="font-bold text-amber-300 mb-4 text-center">Law of Conservation of Energy</h5>
        <div className="bg-white rounded-xl p-5 border-2 border-amber-300 mb-4">
          <p className="text-center font-bold text-amber-300 text-lg mb-3">Energy is NEVER created or destroyed — only CONVERTED</p>
          <svg viewBox="0 0 220 140" className="w-full">
            <circle cx="110" cy="70" r="55" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="8"/>
            <rect x="75" y="50" width="70" height="40" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
            <text x="110" y="72" textAnchor="middle" fontSize="12" fill="#92400E" fontWeight="bold">Electrical</text>
            <text x="110" y="84" textAnchor="middle" fontSize="10" fill="#92400E">Energy In</text>
            <text x="110" y="20" textAnchor="middle" fontSize="10" fill="#DC2626" fontWeight="bold">Heat (waste)</text>
            <path d="M 110 50 L 110 28" stroke="#DC2626" strokeWidth="1.5" markerEnd="url(#earr)"/>
            <text x="180" y="72" textAnchor="middle" fontSize="10" fill="#3B82F6" fontWeight="bold">Light</text>
            <path d="M 145 65 L 165 65" stroke="#3B82F6" strokeWidth="1.5" markerEnd="url(#earr2)"/>
            <text x="40" y="72" textAnchor="middle" fontSize="10" fill="#10B981" fontWeight="bold">Sound</text>
            <path d="M 75 68 L 55 68" stroke="#10B981" strokeWidth="1.5"/>
            <text x="110" y="122" textAnchor="middle" fontSize="10" fill="#7C3AED" fontWeight="bold">Motion</text>
            <path d="M 110 90 L 110 110" stroke="#7C3AED" strokeWidth="1.5" markerEnd="url(#earr3)"/>
            <defs>
              <marker id="earr" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#DC2626"/></marker>
              <marker id="earr2" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#3B82F6"/></marker>
              <marker id="earr3" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto"><path d="M0,0 L6,0 L3,6 z" fill="#7C3AED"/></marker>
            </defs>
          </svg>
          <p className="text-xs text-center text-gray-600 mt-2">Total energy out = total energy in. "Lost" energy just became heat!</p>
        </div>
        <div className="bg-red-950/30 rounded-xl p-4 border border-red-500/20">
          <p className="font-bold text-red-300 mb-2">Efficiency Formula:</p>
          <p className="font-mono text-center text-sm font-bold text-red-300 mb-1">Efficiency = (Useful Output ÷ Total Input) × 100%</p>
          <p className="text-xs text-gray-600">Example: motor uses 200J electricity, produces 170J motion → efficiency = (170÷200)×100 = 85%</p>
        </div>
      </div>
    </div>
  </div>
);

const CircuitTroubleshootingDiagram = () => (
  <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Circuit Problem-Solving — Step-by-Step Strategy</h4>
    <div className="grid md:grid-cols-2 gap-6 mb-5">
      <div className="bg-white rounded-xl p-5 border-2 border-rose-300 shadow-md">
        <p className="font-bold text-rose-800 mb-4 text-center">🔎 The 5-Step Method for Any Circuit Problem</p>
        {[
          { n: '1', title: 'Identify circuit type', detail: 'Is it series (one path) or parallel (multiple paths)? Look for branches in the diagram.', color: 'bg-red-100 border-red-300' },
          { n: '2', title: 'Write known values', detail: 'List every V, I, R value given. Label components (R₁, R₂...). Draw and label the circuit.', color: 'bg-orange-100 border-orange-300' },
          { n: '3', title: 'Find total resistance', detail: 'Series: add all R. Parallel: use 1/R_t = 1/R₁+1/R₂+... (or for 2: R_t = R₁×R₂÷(R₁+R₂))', color: 'bg-yellow-100 border-yellow-300' },
          { n: '4', title: 'Apply Ohm\'s Law', detail: 'Use V=IR (or I=V/R or R=V/I). Start from what you know and work toward what you need.', color: 'bg-green-100 border-green-300' },
          { n: '5', title: 'Verify your answer', detail: 'Series: check V₁+V₂+...= V_battery. Parallel: check I₁+I₂+...= I_total. Units correct?', color: 'bg-blue-100 border-blue-300' },
        ].map(s => (
          <div key={s.n} className={`flex gap-3 p-3 rounded-lg border mb-2 ${s.color}`}>
            <div className="w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">{s.n}</div>
            <div>
              <p className="font-bold text-gray-800 text-sm">{s.title}</p>
              <p className="text-xs text-gray-600">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="bg-white rounded-xl p-5 border-2 border-pink-300 shadow-md mb-4">
          <p className="font-bold text-pink-800 mb-3 text-center">⚠️ Most Common Exam Mistakes</p>
          {[
            { mistake: 'Mixing up which quantity is "same" in each circuit type', fix: 'Series = same CURRENT. Parallel = same VOLTAGE. Repeat until automatic.' },
            { mistake: 'Not converting W → kW before energy/cost calculation', fix: 'Divide watts by 1000 first. Then multiply kW × hours = kWh.' },
            { mistake: 'Confusing ammeter and voltmeter connections', fix: 'Ammeter: break circuit, insert IN SERIES. Voltmeter: connect ACROSS (parallel).' },
            { mistake: 'Forgetting to verify: voltages must add up in series', fix: 'Always check: V₁ + V₂ + V₃ = V_battery as a final sanity check.' },
          ].map((item, i) => (
            <div key={i} className="mb-3 p-3 bg-pink-50 rounded-lg border border-pink-200">
              <p className="text-xs text-red-300 font-semibold">✗ Mistake: {item.mistake}</p>
              <p className="text-xs text-green-300 font-semibold mt-1">✓ Fix: {item.fix}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
          <p className="font-bold text-purple-800 mb-2">2-Resistor Parallel Shortcut:</p>
          <p className="font-mono text-center text-sm font-bold text-purple-300 my-2">R_total = (R₁ × R₂) ÷ (R₁ + R₂)</p>
          <p className="text-xs text-gray-600">Example: R₁=6Ω, R₂=12Ω → R_t = (6×12)÷(6+12) = 72÷18 = 4Ω</p>
          <p className="text-xs text-gray-500 mt-1">Note: R_total is always LESS than either individual resistor</p>
        </div>
      </div>
    </div>
  </div>
);


// ── NEW PHYSICS DIAGRAMS ──────────────────────────────────────────────────────

const ElectricChargesDiagram = () => (
  <div className="bg-gradient-to-br from-[#181208] to-[#180f04] rounded-xl p-6">
    <h4 className="text-center font-bold text-gray-700 mb-5 text-lg">⚡ Law of Electric Charges</h4>
    <div className="grid grid-cols-3 gap-4 mb-5">
      {/* Like + repel */}
      <div className="bg-white rounded-xl p-4 border-2 border-red-200 text-center shadow-sm">
        <div className="flex justify-center gap-2 mb-3">
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xl shadow-md">+</div>
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xl shadow-md">+</div>
        </div>
        <div className="flex justify-center mb-2">
          <svg viewBox="0 0 80 20" className="w-20 h-5">
            <path d="M 10 10 L 2 10" stroke="#EF4444" strokeWidth="2.5" markerEnd="url(#rl)" />
            <path d="M 70 10 L 78 10" stroke="#EF4444" strokeWidth="2.5" markerEnd="url(#rr)" />
            <defs>
              <marker id="rl" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#EF4444"/></marker>
              <marker id="rr" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto"><path d="M6,0 L0,3 L6,6 z" fill="#EF4444"/></marker>
            </defs>
          </svg>
        </div>
        <p className="text-xs font-bold text-red-600">+ and + REPEL</p>
      </div>
      {/* Like - repel */}
      <div className="bg-white rounded-xl p-4 border-2 border-blue-200 text-center shadow-sm">
        <div className="flex justify-center gap-2 mb-3">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-md">−</div>
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-md">−</div>
        </div>
        <div className="flex justify-center mb-2">
          <svg viewBox="0 0 80 20" className="w-20 h-5">
            <path d="M 10 10 L 2 10" stroke="#3B82F6" strokeWidth="2.5" markerEnd="url(#bl)" />
            <path d="M 70 10 L 78 10" stroke="#3B82F6" strokeWidth="2.5" markerEnd="url(#br)" />
            <defs>
              <marker id="bl" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#3B82F6"/></marker>
              <marker id="br" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto"><path d="M6,0 L0,3 L6,6 z" fill="#3B82F6"/></marker>
            </defs>
          </svg>
        </div>
        <p className="text-xs font-bold text-blue-600">− and − REPEL</p>
      </div>
      {/* Opposite attract */}
      <div className="bg-white rounded-xl p-4 border-2 border-green-200 text-center shadow-sm">
        <div className="flex justify-center gap-2 mb-3">
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xl shadow-md">+</div>
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-md">−</div>
        </div>
        <div className="flex justify-center mb-2">
          <svg viewBox="0 0 80 20" className="w-20 h-5">
            <path d="M 5 10 L 35 10" stroke="#22C55E" strokeWidth="2.5" markerEnd="url(#ga)" />
            <path d="M 75 10 L 45 10" stroke="#22C55E" strokeWidth="2.5" markerEnd="url(#gb)" />
            <defs>
              <marker id="ga" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#22C55E"/></marker>
              <marker id="gb" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#22C55E"/></marker>
            </defs>
          </svg>
        </div>
        <p className="text-xs font-bold text-green-600">+ and − ATTRACT</p>
      </div>
    </div>
    <div className="bg-amber-100 rounded-lg p-3 text-center">
      <p className="text-sm font-bold text-amber-300">🧠 Memory Trick: "Opposites attract, likes repel" — just like magnets!</p>
    </div>
  </div>
);

const ConductorInsulatorDiagram = () => (
  <div className="bg-gradient-to-br from-[#0a0a12] to-[#0a0e18] rounded-xl p-6">
    <h4 className="text-center font-bold text-gray-700 mb-5 text-lg">🔌 Conductors vs Insulators</h4>
    <div className="grid grid-cols-2 gap-5 mb-4">
      <div className="bg-white rounded-xl p-4 border-2 border-yellow-300 shadow-sm">
        <div className="text-center mb-3">
          <span className="text-3xl">🔩</span>
          <h5 className="font-bold text-yellow-300 mt-1">CONDUCTOR</h5>
          <p className="text-xs text-gray-500">Electrons move FREELY</p>
        </div>
        <svg viewBox="0 0 160 50" className="w-full h-12 mb-2">
          <rect x="5" y="15" width="150" height="20" rx="10" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
          {[20,40,60,80,100,120,140].map((x,i) => (
            <g key={i}>
              <circle cx={x} cy="25" r="4" fill="#D97706"/>
              <path d={`M ${x+5} 25 L ${x+13} 25`} stroke="#F59E0B" strokeWidth="1.5" markerEnd="url(#ya)"/>
            </g>
          ))}
          <defs><marker id="ya" markerWidth="4" markerHeight="4" refX="4" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 z" fill="#F59E0B"/></marker></defs>
        </svg>
        <div className="space-y-1">
          {['Copper wire', 'Aluminum foil', 'Iron nail', 'Saltwater'].map(item => (
            <div key={item} className="flex items-center gap-2 text-xs">
              <span className="text-yellow-500">✓</span><span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 border-2 border-purple-300 shadow-sm">
        <div className="text-center mb-3">
          <span className="text-3xl">🔒</span>
          <h5 className="font-bold text-purple-300 mt-1">INSULATOR</h5>
          <p className="text-xs text-gray-500">Electrons are LOCKED in place</p>
        </div>
        <svg viewBox="0 0 160 50" className="w-full h-12 mb-2">
          <rect x="5" y="15" width="150" height="20" rx="10" fill="#F3E8FF" stroke="#9333EA" strokeWidth="2"/>
          {[20,40,60,80,100,120,140].map((x,i) => (
            <circle key={i} cx={x} cy="25" r="4" fill="#9333EA"/>
          ))}
        </svg>
        <div className="space-y-1">
          {['Rubber', 'Plastic', 'Glass', 'Dry wood'].map(item => (
            <div key={item} className="flex items-center gap-2 text-xs">
              <span className="text-purple-500">✓</span><span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="bg-blue-100 rounded-lg p-3 text-center">
      <p className="text-sm text-blue-300"><span className="font-bold">Real-world example:</span> Copper wire (conductor) coated in rubber (insulator) = safe electrical cable!</p>
    </div>
  </div>
);

const VIRTriangleDiagram = () => (
  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6">
    <h4 className="text-center font-bold text-gray-700 mb-5 text-lg">📐 Ohm's Law — V = I × R</h4>
    <div className="flex gap-5 items-start justify-center flex-wrap">
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 200 180" className="w-48 h-44">
          {/* Triangle */}
          <polygon points="100,10 10,170 190,170" fill="none" stroke="#6366F1" strokeWidth="3"/>
          {/* Dividing line */}
          <line x1="100" y1="170" x2="100" y2="95" stroke="#6366F1" strokeWidth="2" strokeDasharray="4,3"/>
          {/* V at top */}
          <circle cx="100" cy="60" r="30" fill="#6366F1" opacity="0.15"/>
          <text x="100" y="55" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#4338CA">V</text>
          <text x="100" y="75" textAnchor="middle" fontSize="10" fill="#6366F1">Volts</text>
          {/* I left */}
          <circle cx="52" cy="148" r="28" fill="#10B981" opacity="0.15"/>
          <text x="52" y="143" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#059669">I</text>
          <text x="52" y="163" textAnchor="middle" fontSize="10" fill="#10B981">Amps</text>
          {/* R right */}
          <circle cx="148" cy="148" r="28" fill="#F59E0B" opacity="0.15"/>
          <text x="148" y="143" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#D97706">R</text>
          <text x="148" y="163" textAnchor="middle" fontSize="10" fill="#F59E0B">Ohms</text>
          {/* × sign */}
          <text x="100" y="155" textAnchor="middle" fontSize="16" fill="#9CA3AF">×</text>
        </svg>
        <p className="text-xs text-center text-gray-500 mt-1">Cover the unknown → see the formula!</p>
      </div>
      <div className="space-y-3 flex-1 min-w-48">
        <div className="bg-indigo-100 rounded-lg p-3 border-l-4 border-indigo-500">
          <p className="font-bold text-indigo-300 text-sm">Find Voltage:</p>
          <p className="text-indigo-300 text-sm font-mono">V = I × R</p>
          <p className="text-indigo-600 text-xs mt-1">Cover V → I × R</p>
        </div>
        <div className="bg-green-100 rounded-lg p-3 border-l-4 border-green-500">
          <p className="font-bold text-green-300 text-sm">Find Current:</p>
          <p className="text-green-300 text-sm font-mono">I = V ÷ R</p>
          <p className="text-green-600 text-xs mt-1">Cover I → V on top, R below</p>
        </div>
        <div className="bg-amber-100 rounded-lg p-3 border-l-4 border-amber-500">
          <p className="font-bold text-amber-300 text-sm">Find Resistance:</p>
          <p className="text-amber-300 text-sm font-mono">R = V ÷ I</p>
          <p className="text-amber-600 text-xs mt-1">Cover R → V on top, I below</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="text-xs font-bold text-gray-700 mb-1">⚡ Quick Examples:</p>
          <p className="text-xs text-gray-600">V=12V, R=4Ω → <span className="font-bold text-green-300">I = 3A</span></p>
          <p className="text-xs text-gray-600">I=2A, R=6Ω → <span className="font-bold text-indigo-300">V = 12V</span></p>
          <p className="text-xs text-gray-600">V=24V, I=3A → <span className="font-bold text-amber-300">R = 8Ω</span></p>
        </div>
      </div>
    </div>
  </div>
);

const SeriesVsParallelVisual = () => (
  <div className="bg-gradient-to-br from-[#0a0a12] to-[#111118] rounded-xl p-6">
    <h4 className="text-center font-bold text-gray-700 mb-5 text-lg">⚖️ Series vs Parallel — Side by Side</h4>
    <div className="grid grid-cols-2 gap-4 mb-4">
      {/* Series */}
      <div className="bg-white rounded-xl p-4 border-2 border-blue-300 shadow-sm">
        <h5 className="font-bold text-blue-300 text-center mb-3">➡️ SERIES</h5>
        <svg viewBox="0 0 200 80" className="w-full h-20 mb-3">
          {/* Battery */}
          <line x1="10" y1="20" x2="10" y2="60" stroke="#374151" strokeWidth="3"/>
          <line x1="20" y1="25" x2="20" y2="55" stroke="#374151" strokeWidth="2"/>
          <text x="14" y="15" fontSize="8" fill="#6B7280">+</text>
          {/* Top wire */}
          <line x1="20" y1="25" x2="60" y2="25" stroke="#3B82F6" strokeWidth="2"/>
          {/* R1 */}
          <rect x="60" y="17" width="30" height="16" rx="4" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
          <text x="75" y="29" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1D4ED8">R₁</text>
          {/* Wire between */}
          <line x1="90" y1="25" x2="110" y2="25" stroke="#3B82F6" strokeWidth="2"/>
          {/* R2 */}
          <rect x="110" y="17" width="30" height="16" rx="4" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
          <text x="125" y="29" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1D4ED8">R₂</text>
          {/* Top wire to corner */}
          <line x1="140" y1="25" x2="190" y2="25" stroke="#3B82F6" strokeWidth="2"/>
          <line x1="190" y1="25" x2="190" y2="55" stroke="#3B82F6" strokeWidth="2"/>
          {/* Bottom wire */}
          <line x1="10" y1="55" x2="190" y2="55" stroke="#3B82F6" strokeWidth="2"/>
          {/* Arrow showing single path */}
          <path d="M 30 68 L 160 68" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4,2" markerEnd="url(#spa)"/>
          <text x="95" y="79" textAnchor="middle" fontSize="8" fill="#059669">One path</text>
          <defs><marker id="spa" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 z" fill="#10B981"/></marker></defs>
        </svg>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2 bg-blue-50 rounded p-1.5">
            <span className="font-bold text-blue-300 w-12">Current:</span>
            <span className="text-blue-600">Same everywhere (I₁=I₂)</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 rounded p-1.5">
            <span className="font-bold text-blue-300 w-12">Voltage:</span>
            <span className="text-blue-600">Splits (V₁+V₂=V_bat)</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 rounded p-1.5">
            <span className="font-bold text-blue-300 w-12">Resistance:</span>
            <span className="text-blue-600">Adds up (R₁+R₂)</span>
          </div>
          <div className="flex items-center gap-2 bg-red-50 rounded p-1.5 border border-red-200">
            <span className="text-red-600">💥 One breaks → ALL stop</span>
          </div>
        </div>
      </div>
      {/* Parallel */}
      <div className="bg-white rounded-xl p-4 border-2 border-orange-300 shadow-sm">
        <h5 className="font-bold text-orange-300 text-center mb-3">🔀 PARALLEL</h5>
        <svg viewBox="0 0 200 80" className="w-full h-20 mb-3">
          {/* Battery */}
          <line x1="10" y1="20" x2="10" y2="60" stroke="#374151" strokeWidth="3"/>
          <line x1="20" y1="25" x2="20" y2="55" stroke="#374151" strokeWidth="2"/>
          <text x="14" y="15" fontSize="8" fill="#6B7280">+</text>
          {/* Top rail */}
          <line x1="20" y1="25" x2="180" y2="25" stroke="#F97316" strokeWidth="2"/>
          {/* Bottom rail */}
          <line x1="10" y1="55" x2="180" y2="55" stroke="#F97316" strokeWidth="2"/>
          {/* R1 branch */}
          <line x1="80" y1="25" x2="80" y2="35" stroke="#F97316" strokeWidth="2"/>
          <rect x="65" y="35" width="30" height="10" rx="3" fill="#FFF7ED" stroke="#F97316" strokeWidth="1.5"/>
          <text x="80" y="43" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#C2410C">R₁</text>
          <line x1="80" y1="45" x2="80" y2="55" stroke="#F97316" strokeWidth="2"/>
          {/* R2 branch */}
          <line x1="130" y1="25" x2="130" y2="35" stroke="#F97316" strokeWidth="2"/>
          <rect x="115" y="35" width="30" height="10" rx="3" fill="#FFF7ED" stroke="#F97316" strokeWidth="1.5"/>
          <text x="130" y="43" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#C2410C">R₂</text>
          <line x1="130" y1="45" x2="130" y2="55" stroke="#F97316" strokeWidth="2"/>
          {/* Right close */}
          <line x1="180" y1="25" x2="180" y2="55" stroke="#F97316" strokeWidth="2"/>
          <text x="100" y="78" textAnchor="middle" fontSize="8" fill="#EA580C">Two paths</text>
        </svg>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2 bg-orange-50 rounded p-1.5">
            <span className="font-bold text-orange-300 w-12">Voltage:</span>
            <span className="text-orange-600">Same everywhere (V₁=V₂)</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 rounded p-1.5">
            <span className="font-bold text-orange-300 w-12">Current:</span>
            <span className="text-orange-600">Splits (I₁+I₂=I_total)</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 rounded p-1.5">
            <span className="font-bold text-orange-300 w-12">Resistance:</span>
            <span className="text-orange-600">Decreases (less than R₁)</span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 rounded p-1.5 border border-green-200">
            <span className="text-green-600">✅ One breaks → rest continue</span>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-indigo-50 rounded-lg p-3 text-center border border-indigo-200">
      <p className="text-sm text-indigo-300"><span className="font-bold">🏠 Real life:</span> Your home outlets are PARALLEL — every device gets full 120V independently!</p>
    </div>
  </div>
);

const PowerTriangleDiagram = () => (
  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6">
    <h4 className="text-center font-bold text-gray-700 mb-5 text-lg">💡 Power Formulas — 3 Ways</h4>
    <div className="grid grid-cols-3 gap-3 mb-4">
      {[
        { formula: 'P = V × I', label: 'Use when you know\nVoltage & Current', color: 'bg-yellow-100 border-yellow-400', text: 'text-yellow-800', example: '120V × 0.5A = 60W' },
        { formula: 'P = I² × R', label: 'Use when you know\nCurrent & Resistance', color: 'bg-orange-100 border-orange-400', text: 'text-orange-800', example: '2² × 10 = 40W' },
        { formula: 'P = V² ÷ R', label: 'Use when you know\nVoltage & Resistance', color: 'bg-red-100 border-red-400', text: 'text-red-300', example: '12² ÷ 6 = 24W' },
      ].map((item, i) => (
        <div key={i} className={`${item.color} border-2 rounded-xl p-3 text-center`}>
          <p className={`font-bold font-mono text-base ${item.text} mb-1`}>{item.formula}</p>
          <p className="text-xs text-gray-600 mb-2">{item.label}</p>
          <div className="bg-white rounded-lg p-1.5">
            <p className="text-xs font-mono text-gray-700">{item.example}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <p className="text-center text-xs font-bold text-gray-700 mb-3">⚡ Energy & Cost Chain</p>
      <div className="flex items-center justify-center gap-1 flex-wrap text-xs">
        {[
          { label: 'Power', sub: 'Watts (W)', color: 'bg-yellow-200 text-yellow-800' },
          { arrow: '× time (hrs) ÷ 1000' },
          { label: 'Energy', sub: 'kWh', color: 'bg-orange-200 text-orange-800' },
          { arrow: '× rate ($/kWh)' },
          { label: 'Cost', sub: '$$$', color: 'bg-green-200 text-green-300' },
        ].map((item, i) => item.arrow
          ? <div key={i} className="text-gray-500 font-bold mx-1 text-center"><p>→</p><p className="text-gray-600" style={{fontSize:'9px'}}>{item.arrow}</p></div>
          : <div key={i} className={`${item.color} rounded-lg px-3 py-2 text-center font-bold`}>
              <p>{item.label}</p>
              <p className="font-normal opacity-75">{item.sub}</p>
            </div>
        )}
      </div>
      <div className="mt-3 bg-gray-50 rounded-lg p-2 text-xs text-center text-gray-600">
        <span className="font-bold">Example:</span> 1500W heater × 8h ÷ 1000 = 12 kWh × $0.12 = <span className="font-bold text-green-300">$1.44</span>
      </div>
    </div>
  </div>
);

const CurrentDangerDiagram = () => (
  <div className="bg-gradient-to-br from-[#150808] to-[#180d04] rounded-xl p-6">
    <h4 className="text-center font-bold text-gray-700 mb-4 text-lg">⚠️ Current Through the Body — Danger Levels</h4>
    <div className="space-y-2 mb-4">
      {[
        { ma: '1 mA', label: 'Barely noticeable tingle', color: 'bg-green-100 border-green-400', icon: '😐', bar: '5%' },
        { ma: '5 mA', label: 'Mild shock — uncomfortable', color: 'bg-yellow-100 border-yellow-400', icon: '😬', bar: '20%' },
        { ma: '10–20 mA', label: 'Painful! Muscle contraction — may not let go', color: 'bg-orange-100 border-orange-400', icon: '😰', bar: '50%' },
        { ma: '50–100 mA', label: '⚡ POTENTIALLY FATAL — ventricular fibrillation', color: 'bg-red-100 border-red-400', icon: '💀', bar: '80%' },
        { ma: '1–4 A', label: '☠️ FATAL — severe burns, heart stops', color: 'bg-red-200 border-red-600', icon: '☠️', bar: '100%' },
      ].map((row, i) => (
        <div key={i} className={`${row.color} border rounded-lg p-2 flex items-center gap-3`}>
          <span className="text-lg">{row.icon}</span>
          <div className="w-20 text-xs font-bold text-gray-700 shrink-0">{row.ma}</div>
          <div className="flex-1">
            <p className="text-xs text-gray-700">{row.label}</p>
            <div className="mt-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{width: row.bar}}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-red-100 rounded-lg p-3 border-2 border-red-300">
      <p className="text-xs text-red-300 font-bold text-center">⚠️ It's the CURRENT, not the voltage, that kills you.</p>
      <p className="text-xs text-red-300 text-center mt-1">BUT: high voltage → forces more current through body → more dangerous!</p>
      <p className="text-xs text-red-300 text-center mt-1">Water lowers skin resistance 1000× → same voltage = much more current!</p>
    </div>
  </div>
);

const AppliancePowerDiagram = () => (
  <div className="bg-gradient-to-br from-[#0a0f1e] to-[#0d0a1e] rounded-xl p-6">
    <h4 className="text-center font-bold text-gray-700 mb-4 text-lg">🏠 Appliance Power Comparison</h4>
    <div className="space-y-2">
      {[
        { name: 'LED Bulb', watts: 10, max: 5000, color: '#10B981', emoji: '💡' },
        { name: 'Laptop', watts: 50, max: 5000, color: '#6366F1', emoji: '💻' },
        { name: 'Fridge', watts: 150, max: 5000, color: '#3B82F6', emoji: '🧊' },
        { name: 'Microwave', watts: 1000, max: 5000, color: '#F59E0B', emoji: '📡' },
        { name: 'Kettle', watts: 1500, max: 5000, color: '#F97316', emoji: '☕' },
        { name: 'Hair Dryer', watts: 1800, max: 5000, color: '#EF4444', emoji: '💨' },
        { name: 'Clothes Dryer', watts: 5000, max: 5000, color: '#DC2626', emoji: '🌀' },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-lg w-6 text-center">{item.emoji}</span>
          <span className="text-xs text-gray-600 w-24 shrink-0">{item.name}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div className="h-full rounded-full flex items-center pl-2 transition-all"
              style={{width: `${(item.watts/item.max)*100}%`, backgroundColor: item.color, minWidth: '30px'}}>
              <span className="text-white text-xs font-bold">{item.watts}W</span>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-4 bg-indigo-100 rounded-lg p-3 text-xs text-center text-indigo-300">
      <span className="font-bold">💡 Tip:</span> Devices with heating elements (kettle, dryer, oven) use the MOST power!
    </div>
  </div>
);

const FuseCircuitBreakerDiagram = () => (
  <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-6">
    <h4 className="text-center font-bold text-gray-700 mb-4 text-lg">🛡️ Fuse vs Circuit Breaker</h4>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="bg-white rounded-xl p-4 border-2 border-red-200">
        <div className="text-center mb-3">
          <span className="text-3xl">🔥</span>
          <h5 className="font-bold text-red-300 mt-1">FUSE</h5>
        </div>
        <svg viewBox="0 0 160 60" className="w-full h-14 mb-3">
          <line x1="5" y1="30" x2="30" y2="30" stroke="#374151" strokeWidth="3"/>
          <rect x="30" y="15" width="100" height="30" rx="5" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2"/>
          <line x1="30" y1="30" x2="60" y2="30" stroke="#D97706" strokeWidth="2.5"/>
          <path d="M 60 30 Q 80 10 100 30" stroke="#D97706" strokeWidth="2" fill="none"/>
          <line x1="100" y1="30" x2="130" y2="30" stroke="#D97706" strokeWidth="2.5"/>
          <text x="80" y="52" textAnchor="middle" fontSize="9" fill="#6B7280">thin wire inside</text>
          <line x1="130" y1="30" x2="155" y2="30" stroke="#374151" strokeWidth="3"/>
        </svg>
        <div className="space-y-1.5 text-xs">
          <p className="bg-red-50 rounded p-1.5">🔥 Wire <span className="font-bold">MELTS</span> when overloaded</p>
          <p className="bg-red-50 rounded p-1.5">🗑️ Must be <span className="font-bold">REPLACED</span> after blowing</p>
          <p className="bg-red-50 rounded p-1.5">💰 Cheap but single-use</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 border-2 border-green-200">
        <div className="text-center mb-3">
          <span className="text-3xl">⚡</span>
          <h5 className="font-bold text-green-300 mt-1">CIRCUIT BREAKER</h5>
        </div>
        <svg viewBox="0 0 160 60" className="w-full h-14 mb-3">
          <line x1="5" y1="30" x2="40" y2="30" stroke="#374151" strokeWidth="3"/>
          <rect x="40" y="10" width="80" height="40" rx="6" fill="#F0FDF4" stroke="#22C55E" strokeWidth="2"/>
          <line x1="60" y1="30" x2="72" y2="30" stroke="#15803D" strokeWidth="2.5"/>
          <line x1="72" y1="30" x2="82" y2="20" stroke="#15803D" strokeWidth="2.5"/>
          <circle cx="72" cy="30" r="3" fill="#22C55E"/>
          <text x="80" y="48" textAnchor="middle" fontSize="9" fill="#6B7280">switch mechanism</text>
          <line x1="90" y1="30" x2="100" y2="30" stroke="#15803D" strokeWidth="2.5"/>
          <line x1="120" y1="30" x2="155" y2="30" stroke="#374151" strokeWidth="3"/>
        </svg>
        <div className="space-y-1.5 text-xs">
          <p className="bg-green-50 rounded p-1.5">🔄 Switch <span className="font-bold">TRIPS OPEN</span> when overloaded</p>
          <p className="bg-green-50 rounded p-1.5">✅ Just <span className="font-bold">RESET</span> by flipping back</p>
          <p className="bg-green-50 rounded p-1.5">🔁 Reusable — used in homes</p>
        </div>
      </div>
    </div>
    <div className="bg-amber-100 rounded-lg p-3 border border-amber-300 text-xs text-center">
      <p className="font-bold text-amber-300">Both are rated in AMPERES (e.g. 15A breaker trips when current exceeds 15A)</p>
      <p className="text-amber-300 mt-1">GFCI outlets: cut power in 0.025 seconds if they detect tiny current leaks — used in bathrooms & kitchens</p>
    </div>
  </div>
);

const EnergyTransformationsDiagram = () => (
  <div className="bg-gradient-to-br from-[#120a1e] to-[#180a14] rounded-xl p-6">
    <h4 className="text-center font-bold text-gray-700 mb-4 text-lg">🔄 Energy Transformations in Circuits</h4>
    <div className="grid grid-cols-2 gap-3 mb-4">
      {[
        { device: '🔋 Battery', from: 'Chemical', to: 'Electrical', fromColor: 'bg-green-100 text-green-300', toColor: 'bg-yellow-100 text-yellow-300' },
        { device: '💡 Light Bulb', from: 'Electrical', to: 'Light + Heat', fromColor: 'bg-yellow-100 text-yellow-300', toColor: 'bg-orange-100 text-orange-300' },
        { device: '⚙️ Motor', from: 'Electrical', to: 'Mechanical', fromColor: 'bg-yellow-100 text-yellow-300', toColor: 'bg-blue-100 text-blue-300' },
        { device: '🔊 Speaker', from: 'Electrical', to: 'Sound', fromColor: 'bg-yellow-100 text-yellow-300', toColor: 'bg-purple-100 text-purple-300' },
        { device: '🌡️ Toaster', from: 'Electrical', to: 'Heat', fromColor: 'bg-yellow-100 text-yellow-300', toColor: 'bg-red-100 text-red-300' },
        { device: '📱 Charging', from: 'Electrical', to: 'Chemical', fromColor: 'bg-yellow-100 text-yellow-300', toColor: 'bg-green-100 text-green-300' },
      ].map((item, i) => (
        <div key={i} className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
          <p className="text-sm font-bold text-gray-700 mb-2">{item.device}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className={`${item.fromColor} px-2 py-1 rounded font-semibold`}>{item.from}</span>
            <span className="text-gray-600 font-bold">→</span>
            <span className={`${item.toColor} px-2 py-1 rounded font-semibold`}>{item.to}</span>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-purple-100 rounded-lg p-3 text-center text-xs border border-purple-300">
      <p className="font-bold text-purple-800">♾️ Law of Conservation of Energy:</p>
      <p className="text-purple-300 mt-1">Energy is NEVER created or destroyed — it only changes form. Total energy in = total energy out!</p>
    </div>
  </div>
);

const EfficiencyDiagram = () => (
  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
    <h4 className="text-center font-bold text-gray-700 mb-4 text-lg">📊 Efficiency — How Much Energy Is Useful?</h4>
    <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
      <p className="text-center font-bold text-gray-700 mb-3 text-sm">Efficiency (%) = (Useful Output ÷ Total Input) × 100</p>
      {/* Sankey-style diagram */}
      <div className="flex items-center gap-3 justify-center mb-4">
        <div className="bg-blue-200 rounded-lg p-3 text-center text-sm font-bold text-blue-300">100J<br/><span className="text-xs font-normal">IN</span></div>
        <svg viewBox="0 0 80 60" className="w-20 h-14">
          <path d="M 0 20 L 45 20 L 80 5" stroke="#10B981" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M 0 40 L 45 40 L 80 55" stroke="#EF4444" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <text x="60" y="12" fontSize="9" fill="#059669" fontWeight="bold">Useful</text>
          <text x="62" y="59" fontSize="9" fill="#DC2626" fontWeight="bold">Waste</text>
        </svg>
        <div className="space-y-2">
          <div className="bg-green-100 rounded p-2 text-center text-xs font-bold text-green-300">Useful Output</div>
          <div className="bg-red-100 rounded p-2 text-center text-xs font-bold text-red-300">Heat (Wasted)</div>
        </div>
      </div>
    </div>
    <div className="space-y-2">
      {[
        { device: '⚡ Electric Motor', eff: 90, useful: '90J motion', waste: '10J heat', color: '#10B981' },
        { device: '💡 LED Bulb', eff: 40, useful: '40J light', waste: '60J heat', color: '#6366F1' },
        { device: '🔥 Incandescent Bulb', eff: 5, useful: '5J light', waste: '95J heat', color: '#F97316' },
        { device: '🚗 Car Engine', eff: 30, useful: '30J motion', waste: '70J heat', color: '#EF4444' },
      ].map((item, i) => (
        <div key={i} className="bg-white rounded-lg p-2 border border-gray-200 flex items-center gap-2">
          <span className="text-sm w-32 shrink-0">{item.device}</span>
          <div className="flex-1 bg-red-200 rounded-full h-5 overflow-hidden">
            <div className="h-full rounded-full flex items-center justify-center text-white text-xs font-bold" style={{width:`${item.eff}%`, backgroundColor: item.color, minWidth:'30px'}}>
              {item.eff}%
            </div>
          </div>
          <span className="text-xs text-gray-500 w-20 shrink-0">{item.useful}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── END NEW PHYSICS DIAGRAMS ──────────────────────────────────────────────────

const AtomicModels = () => (
  <div className="bg-gradient-to-br from-[#0d0a1e] to-[#120a1e] rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-8">Evolution of Atomic Models</h4>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {/* Dalton - Solid Sphere */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-6 shadow-md mb-3">
          <svg viewBox="0 0 100 100" className="w-full h-24">
            <circle cx="50" cy="50" r="35" fill="#9333EA" opacity="0.8"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#7C3AED" strokeWidth="2"/>
          </svg>
        </div>
        <h5 className="font-bold text-purple-900 mb-1">Dalton (1803)</h5>
        <p className="text-xs text-purple-300">Solid Sphere</p>
        <p className="text-xs text-gray-600 mt-1">Indivisible ball</p>
      </div>

      {/* Thomson - Plum Pudding */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-6 shadow-md mb-3">
          <svg viewBox="0 0 100 100" className="w-full h-24">
            <circle cx="50" cy="50" r="35" fill="#F59E0B" opacity="0.3"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#F59E0B" strokeWidth="2"/>
            {/* Electrons scattered */}
            {[
              {x: 35, y: 35}, {x: 65, y: 35}, {x: 35, y: 50}, 
              {x: 65, y: 50}, {x: 35, y: 65}, {x: 65, y: 65},
              {x: 50, y: 42}, {x: 50, y: 58}
            ].map((pos, i) => (
              <circle key={i} cx={pos.x} cy={pos.y} r="3" fill="#DC2626"/>
            ))}
          </svg>
        </div>
        <h5 className="font-bold text-orange-900 mb-1">Thomson (1897)</h5>
        <p className="text-xs text-orange-300">Plum Pudding</p>
        <p className="text-xs text-gray-600 mt-1">Electrons in positive</p>
      </div>

      {/* Rutherford - Nuclear */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-6 shadow-md mb-3">
          <svg viewBox="0 0 100 100" className="w-full h-24">
            {/* Nucleus */}
            <circle cx="50" cy="50" r="8" fill="#DC2626"/>
            <circle cx="50" cy="50" r="8" fill="none" stroke="#991B1B" strokeWidth="1"/>
            {/* Electrons orbiting */}
            <circle cx="50" cy="50" r="30" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2,2"/>
            <circle cx="80" cy="50" r="3" fill="#3B82F6"/>
            <circle cx="20" cy="50" r="3" fill="#3B82F6"/>
            <circle cx="50" cy="20" r="3" fill="#3B82F6"/>
            <circle cx="50" cy="80" r="3" fill="#3B82F6"/>
          </svg>
        </div>
        <h5 className="font-bold text-red-900 mb-1">Rutherford (1911)</h5>
        <p className="text-xs text-red-300">Nuclear Model</p>
        <p className="text-xs text-gray-600 mt-1">Dense nucleus</p>
      </div>

      {/* Bohr - Planetary */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-6 shadow-md mb-3">
          <svg viewBox="0 0 100 100" className="w-full h-24">
            {/* Nucleus */}
            <circle cx="50" cy="50" r="6" fill="#DC2626"/>
            {/* Shell 1 */}
            <circle cx="50" cy="50" r="15" fill="none" stroke="#3B82F6" strokeWidth="1.5"/>
            <circle cx="65" cy="50" r="2.5" fill="#3B82F6"/>
            {/* Shell 2 */}
            <circle cx="50" cy="50" r="28" fill="none" stroke="#10B981" strokeWidth="1.5"/>
            <circle cx="78" cy="50" r="2.5" fill="#10B981"/>
            <circle cx="22" cy="50" r="2.5" fill="#10B981"/>
          </svg>
        </div>
        <h5 className="font-bold text-blue-900 mb-1">Bohr (1913)</h5>
        <p className="text-xs text-blue-300">Planetary Model</p>
        <p className="text-xs text-gray-600 mt-1">Energy levels</p>
      </div>
    </div>
    <div className="mt-6 bg-blue-100 rounded-lg p-4">
      <p className="text-sm text-blue-300 text-center">
        <span className="font-bold">Evolution:</span> From solid ball → embedded electrons → nuclear center → specific orbits
      </p>
    </div>
  </div>
);

const PeriodicTableDiagram = () => {
  const elements = [
    // Period 1
    { num: 1, sym: 'H', name: 'Hydrogen', type: 'nonmetal', group: 1, period: 1 },
    { num: 2, sym: 'He', name: 'Helium', type: 'noble', group: 18, period: 1 },
    // Period 2
    { num: 3, sym: 'Li', name: 'Lithium', type: 'alkali', group: 1, period: 2 },
    { num: 4, sym: 'Be', name: 'Beryllium', type: 'alkaline', group: 2, period: 2 },
    { num: 5, sym: 'B', name: 'Boron', type: 'metalloid', group: 13, period: 2 },
    { num: 6, sym: 'C', name: 'Carbon', type: 'nonmetal', group: 14, period: 2 },
    { num: 7, sym: 'N', name: 'Nitrogen', type: 'nonmetal', group: 15, period: 2 },
    { num: 8, sym: 'O', name: 'Oxygen', type: 'nonmetal', group: 16, period: 2 },
    { num: 9, sym: 'F', name: 'Fluorine', type: 'halogen', group: 17, period: 2 },
    { num: 10, sym: 'Ne', name: 'Neon', type: 'noble', group: 18, period: 2 },
    // Period 3
    { num: 11, sym: 'Na', name: 'Sodium', type: 'alkali', group: 1, period: 3 },
    { num: 12, sym: 'Mg', name: 'Magnesium', type: 'alkaline', group: 2, period: 3 },
    { num: 13, sym: 'Al', name: 'Aluminum', type: 'metal', group: 13, period: 3 },
    { num: 14, sym: 'Si', name: 'Silicon', type: 'metalloid', group: 14, period: 3 },
    { num: 15, sym: 'P', name: 'Phosphorus', type: 'nonmetal', group: 15, period: 3 },
    { num: 16, sym: 'S', name: 'Sulfur', type: 'nonmetal', group: 16, period: 3 },
    { num: 17, sym: 'Cl', name: 'Chlorine', type: 'halogen', group: 17, period: 3 },
    { num: 18, sym: 'Ar', name: 'Argon', type: 'noble', group: 18, period: 3 },
    // Period 4
    { num: 19, sym: 'K', name: 'Potassium', type: 'alkali', group: 1, period: 4 },
    { num: 20, sym: 'Ca', name: 'Calcium', type: 'alkaline', group: 2, period: 4 },
    { num: 21, sym: 'Sc', name: 'Scandium', type: 'transition', group: 3, period: 4 },
    { num: 22, sym: 'Ti', name: 'Titanium', type: 'transition', group: 4, period: 4 },
    { num: 23, sym: 'V', name: 'Vanadium', type: 'transition', group: 5, period: 4 },
    { num: 24, sym: 'Cr', name: 'Chromium', type: 'transition', group: 6, period: 4 },
    { num: 25, sym: 'Mn', name: 'Manganese', type: 'transition', group: 7, period: 4 },
    { num: 26, sym: 'Fe', name: 'Iron', type: 'transition', group: 8, period: 4 },
    { num: 27, sym: 'Co', name: 'Cobalt', type: 'transition', group: 9, period: 4 },
    { num: 28, sym: 'Ni', name: 'Nickel', type: 'transition', group: 10, period: 4 },
    { num: 29, sym: 'Cu', name: 'Copper', type: 'transition', group: 11, period: 4 },
    { num: 30, sym: 'Zn', name: 'Zinc', type: 'transition', group: 12, period: 4 },
    { num: 31, sym: 'Ga', name: 'Gallium', type: 'metal', group: 13, period: 4 },
    { num: 32, sym: 'Ge', name: 'Germanium', type: 'metalloid', group: 14, period: 4 },
    { num: 33, sym: 'As', name: 'Arsenic', type: 'metalloid', group: 15, period: 4 },
    { num: 34, sym: 'Se', name: 'Selenium', type: 'nonmetal', group: 16, period: 4 },
    { num: 35, sym: 'Br', name: 'Bromine', type: 'halogen', group: 17, period: 4 },
    { num: 36, sym: 'Kr', name: 'Krypton', type: 'noble', group: 18, period: 4 },
    // Period 5
    { num: 37, sym: 'Rb', name: 'Rubidium', type: 'alkali', group: 1, period: 5 },
    { num: 38, sym: 'Sr', name: 'Strontium', type: 'alkaline', group: 2, period: 5 },
    { num: 39, sym: 'Y', name: 'Yttrium', type: 'transition', group: 3, period: 5 },
    { num: 40, sym: 'Zr', name: 'Zirconium', type: 'transition', group: 4, period: 5 },
    { num: 41, sym: 'Nb', name: 'Niobium', type: 'transition', group: 5, period: 5 },
    { num: 42, sym: 'Mo', name: 'Molybdenum', type: 'transition', group: 6, period: 5 },
    { num: 43, sym: 'Tc', name: 'Technetium', type: 'transition', group: 7, period: 5 },
    { num: 44, sym: 'Ru', name: 'Ruthenium', type: 'transition', group: 8, period: 5 },
    { num: 45, sym: 'Rh', name: 'Rhodium', type: 'transition', group: 9, period: 5 },
    { num: 46, sym: 'Pd', name: 'Palladium', type: 'transition', group: 10, period: 5 },
    { num: 47, sym: 'Ag', name: 'Silver', type: 'transition', group: 11, period: 5 },
    { num: 48, sym: 'Cd', name: 'Cadmium', type: 'transition', group: 12, period: 5 },
    { num: 49, sym: 'In', name: 'Indium', type: 'metal', group: 13, period: 5 },
    { num: 50, sym: 'Sn', name: 'Tin', type: 'metal', group: 14, period: 5 },
    { num: 51, sym: 'Sb', name: 'Antimony', type: 'metalloid', group: 15, period: 5 },
    { num: 52, sym: 'Te', name: 'Tellurium', type: 'metalloid', group: 16, period: 5 },
    { num: 53, sym: 'I', name: 'Iodine', type: 'halogen', group: 17, period: 5 },
    { num: 54, sym: 'Xe', name: 'Xenon', type: 'noble', group: 18, period: 5 },
    // Period 6
    { num: 55, sym: 'Cs', name: 'Cesium', type: 'alkali', group: 1, period: 6 },
    { num: 56, sym: 'Ba', name: 'Barium', type: 'alkaline', group: 2, period: 6 },
    { num: 57, sym: 'La', name: 'Lanthanum', type: 'lanthanide', group: 3, period: 6 },
    { num: 72, sym: 'Hf', name: 'Hafnium', type: 'transition', group: 4, period: 6 },
    { num: 73, sym: 'Ta', name: 'Tantalum', type: 'transition', group: 5, period: 6 },
    { num: 74, sym: 'W', name: 'Tungsten', type: 'transition', group: 6, period: 6 },
    { num: 75, sym: 'Re', name: 'Rhenium', type: 'transition', group: 7, period: 6 },
    { num: 76, sym: 'Os', name: 'Osmium', type: 'transition', group: 8, period: 6 },
    { num: 77, sym: 'Ir', name: 'Iridium', type: 'transition', group: 9, period: 6 },
    { num: 78, sym: 'Pt', name: 'Platinum', type: 'transition', group: 10, period: 6 },
    { num: 79, sym: 'Au', name: 'Gold', type: 'transition', group: 11, period: 6 },
    { num: 80, sym: 'Hg', name: 'Mercury', type: 'transition', group: 12, period: 6 },
    { num: 81, sym: 'Tl', name: 'Thallium', type: 'metal', group: 13, period: 6 },
    { num: 82, sym: 'Pb', name: 'Lead', type: 'metal', group: 14, period: 6 },
    { num: 83, sym: 'Bi', name: 'Bismuth', type: 'metal', group: 15, period: 6 },
    { num: 84, sym: 'Po', name: 'Polonium', type: 'metalloid', group: 16, period: 6 },
    { num: 85, sym: 'At', name: 'Astatine', type: 'halogen', group: 17, period: 6 },
    { num: 86, sym: 'Rn', name: 'Radon', type: 'noble', group: 18, period: 6 },
    // Period 7
    { num: 87, sym: 'Fr', name: 'Francium', type: 'alkali', group: 1, period: 7 },
    { num: 88, sym: 'Ra', name: 'Radium', type: 'alkaline', group: 2, period: 7 },
    { num: 89, sym: 'Ac', name: 'Actinium', type: 'actinide', group: 3, period: 7 },
    { num: 104, sym: 'Rf', name: 'Rutherfordium', type: 'transition', group: 4, period: 7 },
    { num: 105, sym: 'Db', name: 'Dubnium', type: 'transition', group: 5, period: 7 },
    { num: 106, sym: 'Sg', name: 'Seaborgium', type: 'transition', group: 6, period: 7 },
    { num: 107, sym: 'Bh', name: 'Bohrium', type: 'transition', group: 7, period: 7 },
    { num: 108, sym: 'Hs', name: 'Hassium', type: 'transition', group: 8, period: 7 },
    { num: 109, sym: 'Mt', name: 'Meitnerium', type: 'transition', group: 9, period: 7 },
    { num: 110, sym: 'Ds', name: 'Darmstadtium', type: 'transition', group: 10, period: 7 },
    { num: 111, sym: 'Rg', name: 'Roentgenium', type: 'transition', group: 11, period: 7 },
    { num: 112, sym: 'Cn', name: 'Copernicium', type: 'transition', group: 12, period: 7 },
    { num: 113, sym: 'Nh', name: 'Nihonium', type: 'metal', group: 13, period: 7 },
    { num: 114, sym: 'Fl', name: 'Flerovium', type: 'metal', group: 14, period: 7 },
    { num: 115, sym: 'Mc', name: 'Moscovium', type: 'metal', group: 15, period: 7 },
    { num: 116, sym: 'Lv', name: 'Livermorium', type: 'metal', group: 16, period: 7 },
    { num: 117, sym: 'Ts', name: 'Tennessine', type: 'halogen', group: 17, period: 7 },
    { num: 118, sym: 'Og', name: 'Oganesson', type: 'noble', group: 18, period: 7 },
    // Lanthanides
    { num: 58, sym: 'Ce', name: 'Cerium', type: 'lanthanide' },
    { num: 59, sym: 'Pr', name: 'Praseodymium', type: 'lanthanide' },
    { num: 60, sym: 'Nd', name: 'Neodymium', type: 'lanthanide' },
    { num: 61, sym: 'Pm', name: 'Promethium', type: 'lanthanide' },
    { num: 62, sym: 'Sm', name: 'Samarium', type: 'lanthanide' },
    { num: 63, sym: 'Eu', name: 'Europium', type: 'lanthanide' },
    { num: 64, sym: 'Gd', name: 'Gadolinium', type: 'lanthanide' },
    { num: 65, sym: 'Tb', name: 'Terbium', type: 'lanthanide' },
    { num: 66, sym: 'Dy', name: 'Dysprosium', type: 'lanthanide' },
    { num: 67, sym: 'Ho', name: 'Holmium', type: 'lanthanide' },
    { num: 68, sym: 'Er', name: 'Erbium', type: 'lanthanide' },
    { num: 69, sym: 'Tm', name: 'Thulium', type: 'lanthanide' },
    { num: 70, sym: 'Yb', name: 'Ytterbium', type: 'lanthanide' },
    { num: 71, sym: 'Lu', name: 'Lutetium', type: 'lanthanide' },
    // Actinides
    { num: 90, sym: 'Th', name: 'Thorium', type: 'actinide' },
    { num: 91, sym: 'Pa', name: 'Protactinium', type: 'actinide' },
    { num: 92, sym: 'U', name: 'Uranium', type: 'actinide' },
    { num: 93, sym: 'Np', name: 'Neptunium', type: 'actinide' },
    { num: 94, sym: 'Pu', name: 'Plutonium', type: 'actinide' },
    { num: 95, sym: 'Am', name: 'Americium', type: 'actinide' },
    { num: 96, sym: 'Cm', name: 'Curium', type: 'actinide' },
    { num: 97, sym: 'Bk', name: 'Berkelium', type: 'actinide' },
    { num: 98, sym: 'Cf', name: 'Californium', type: 'actinide' },
    { num: 99, sym: 'Es', name: 'Einsteinium', type: 'actinide' },
    { num: 100, sym: 'Fm', name: 'Fermium', type: 'actinide' },
    { num: 101, sym: 'Md', name: 'Mendelevium', type: 'actinide' },
    { num: 102, sym: 'No', name: 'Nobelium', type: 'actinide' },
    { num: 103, sym: 'Lr', name: 'Lawrencium', type: 'actinide' },
  ];

  const getColor = (type) => {
    const colors = {
      alkali: 'bg-red-400 border-red-500',
      alkaline: 'bg-orange-400 border-orange-500',
      transition: 'bg-yellow-300 border-yellow-400',
      metal: 'bg-gray-400 border-gray-500',
      metalloid: 'bg-teal-400 border-teal-500',
      nonmetal: 'bg-blue-400 border-blue-500',
      halogen: 'bg-green-400 border-green-500',
      noble: 'bg-purple-400 border-purple-500',
      lanthanide: 'bg-pink-300 border-pink-400',
      actinide: 'bg-rose-300 border-rose-400'
    };
    return colors[type] || 'bg-gray-300 border-gray-400';
  };

  const renderElement = (el, size = 'normal') => {
    const sizeClasses = size === 'small' ? 'p-1' : 'p-2';
    const textSize = size === 'small' ? 'text-xs' : 'text-xs';
    
    return (
      <div className={`${getColor(el.type)} border-2 rounded ${sizeClasses} text-center flex flex-col justify-center hover:shadow-lg transition-shadow cursor-pointer min-h-[70px]`}>
        <div className={`${textSize} font-bold text-gray-800 text-[10px]`}>{el.num}</div>
        <div className={`${size === 'small' ? 'text-sm' : 'text-lg'} font-bold text-gray-900`}>{el.sym}</div>
        {size !== 'small' && <div className="text-[9px] text-gray-700 leading-tight px-0.5">{el.name}</div>}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0a12] to-[#0c0c14] rounded-xl p-4">
      <h4 className="text-center font-semibold text-gray-700 mb-4">Complete Periodic Table of Elements</h4>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-2 mb-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-red-400 border border-red-500"></div>
          <span className="text-gray-700">Alkali</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-orange-400 border border-orange-500"></div>
          <span className="text-gray-700">Alkaline Earth</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-yellow-300 border border-yellow-400"></div>
          <span className="text-gray-700">Transition</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gray-400 border border-gray-500"></div>
          <span className="text-gray-700">Post-transition</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-teal-400 border border-teal-500"></div>
          <span className="text-gray-700">Metalloid</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-blue-400 border border-blue-500"></div>
          <span className="text-gray-700">Nonmetal</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-green-400 border border-green-500"></div>
          <span className="text-gray-700">Halogen</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-purple-400 border border-purple-500"></div>
          <span className="text-gray-700">Noble Gas</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-pink-300 border border-pink-400"></div>
          <span className="text-gray-700">Lanthanide</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-rose-300 border border-rose-400"></div>
          <span className="text-gray-700">Actinide</span>
        </div>
      </div>

      {/* Main Periodic Table */}
      <div className="overflow-x-auto mb-4">
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(18, minmax(50px, 1fr))', gap: '2px', minWidth: '900px'}}>
          {/* Period 1 */}
          {renderElement(elements.find(e => e.num === 1))}
          <div style={{gridColumn: 'span 16'}}></div>
          {renderElement(elements.find(e => e.num === 2))}

          {/* Period 2 */}
          {renderElement(elements.find(e => e.num === 3))}
          {renderElement(elements.find(e => e.num === 4))}
          <div style={{gridColumn: 'span 10'}}></div>
          {[5,6,7,8,9,10].map(n => renderElement(elements.find(e => e.num === n)))}

          {/* Period 3 */}
          {renderElement(elements.find(e => e.num === 11))}
          {renderElement(elements.find(e => e.num === 12))}
          <div style={{gridColumn: 'span 10'}}></div>
          {[13,14,15,16,17,18].map(n => renderElement(elements.find(e => e.num === n)))}

          {/* Period 4 */}
          {[19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36].map(n => 
            renderElement(elements.find(e => e.num === n))
          )}

          {/* Period 5 */}
          {[37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54].map(n => 
            renderElement(elements.find(e => e.num === n))
          )}

          {/* Period 6 */}
          {renderElement(elements.find(e => e.num === 55))}
          {renderElement(elements.find(e => e.num === 56))}
          {renderElement(elements.find(e => e.num === 57))}
          {[72,73,74,75,76,77,78,79,80,81,82,83,84,85,86].map(n => 
            renderElement(elements.find(e => e.num === n))
          )}

          {/* Period 7 */}
          {renderElement(elements.find(e => e.num === 87))}
          {renderElement(elements.find(e => e.num === 88))}
          {renderElement(elements.find(e => e.num === 89))}
          {[104,105,106,107,108,109,110,111,112,113,114,115,116,117,118].map(n => 
            renderElement(elements.find(e => e.num === n))
          )}
        </div>
      </div>

      {/* Lanthanides and Actinides */}
      <div className="space-y-2">
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(15, minmax(40px, 1fr))', gap: '2px', minWidth: '600px'}}>
          {[58,59,60,61,62,63,64,65,66,67,68,69,70,71].map(n => 
            renderElement(elements.find(e => e.num === n), 'small')
          )}
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(15, minmax(40px, 1fr))', gap: '2px', minWidth: '600px'}}>
          {[90,91,92,93,94,95,96,97,98,99,100,101,102,103].map(n => 
            renderElement(elements.find(e => e.num === n), 'small')
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-red-50 rounded-lg p-2 border border-red-200">
          <p className="font-bold text-red-300 mb-1">Group 1: Alkali Metals</p>
          <p className="text-red-300">Soft, highly reactive, 1 valence e⁻</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
          <p className="font-bold text-purple-800 mb-1">Group 18: Noble Gases</p>
          <p className="text-purple-300">Unreactive, full outer shell</p>
        </div>
      </div>
    </div>
  );
};

const studyLibrary = {
  lockdownTests: {
    id: 'lockdownTests',
    name: 'Test Lockdown Simulators',
    description: 'Full-length timed exams simulating real test conditions',
    icon: Award,
    color: 'red',
    gradient: 'from-red-500 to-rose-600',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=600&fit=crop',
    isQuizSection: true,
    sections: [
      {
        id: 'biology-lockdown-simulator',
        title: 'Biology Test Lockdown Simulator - 45 Min Timed Exam',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      },
      {
        id: 'chemistry-lockdown-simulator',
        title: 'Chemistry Test Lockdown Simulator - 45 Min Timed Exam',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      },
      {
        id: 'physics-lockdown-simulator',
        title: 'Physics Test Lockdown Simulator - 45 Min Timed Exam',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      },
      {
        id: 'space-lockdown-simulator',
        title: 'Space Test Lockdown Simulator - 30 Min Timed Exam',
        image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      }
    ]
  },
  flashcards: {
    id: 'flashcards',
    name: 'Flashcard Review',
    description: '70+ interactive flashcards across Biology & Chemistry for quick review',
    icon: Brain,
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-600',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=600&fit=crop',
    isQuizSection: true,
    sections: [
      {
        id: 'bio-flashcards-header',
        title: '🌿 Biology Flashcards',
        isSectionHeader: true,
        headerColor: 'from-emerald-500 to-teal-600',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
        flashcards: [],
        notes: []
      },
      {
        id: 'biology-flashcards',
        title: 'Biology Flashcards',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
        flashcards: [
          { front: 'What are the three types of biodiversity?', back: 'Genetic diversity (variation within species), Species diversity (variety of species), and Ecosystem diversity (variety of ecosystems)' },
          { front: 'What does H.I.P.P.O.C stand for?', back: 'H - Habitat destruction\nI - Invasive species\nP - Pollution\nP - Population (human)\nO - Overharvesting\nC - Climate change' },
          { front: 'What is a biotic factor?', back: 'A living component of an ecosystem (plants, animals, bacteria, fungi)' },
          { front: 'What is an abiotic factor?', back: 'A non-living component of an ecosystem (sunlight, water, soil, temperature)' },
          { front: 'What is the 10% rule in energy transfer?', back: 'Only 10% of energy passes to the next trophic level. 90% is lost as heat, movement, and waste.' },
          { front: 'What is bioaccumulation?', back: 'The build-up of a substance (like a toxin) in a single organism over time' },
          { front: 'What is biomagnification?', back: 'The increase in concentration of a substance as you move up the food chain' },
          { front: 'What is photosynthesis?', back: 'The process where plants use CO₂ and water to make glucose and oxygen using sunlight\n6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂' },
          { front: 'What is cellular respiration?', back: 'The process where organisms break down glucose with oxygen to release energy\nC₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP' },
          { front: 'What is nitrogen fixation?', back: 'The conversion of atmospheric nitrogen (N₂) into ammonia (NH₃) by bacteria or lightning' },
          { front: 'What makes a species invasive?', back: 'A non-native species that causes harm by: rapid reproduction, outcompeting natives, lacking natural predators, and disrupting ecosystems' },
          { front: 'What is reforestation?', back: 'Planting trees in areas where they were previously cut down to restore ecosystems' },
          { front: 'What is bioremediation?', back: 'Adding organisms (like bacteria) that break down waste and improve soil/water quality' },
          { front: 'What are the 4 spheres of Earth?', back: 'Biosphere (living things), Atmosphere (air), Hydrosphere (water), Lithosphere (rocks/soil)' },
          { front: 'What is a sustainable ecosystem?', back: 'An ecosystem that can maintain itself over time with resources regenerating as fast as they are used' },
          { front: 'What is a producer?', back: 'An organism that makes its own food through photosynthesis (plants, algae)' },
          { front: 'What is a primary consumer?', back: 'An herbivore that eats producers (rabbits, deer, caterpillars)' },
          { front: 'What is a secondary consumer?', back: 'A carnivore that eats primary consumers (snakes, frogs, small birds)' },
          { front: 'What is a tertiary consumer?', back: 'A top predator that eats secondary consumers (eagles, sharks, wolves)' },
          { front: 'What is a decomposer?', back: 'An organism that breaks down dead matter and returns nutrients to soil (bacteria, fungi, worms)' },
          { front: 'What is mutualism?', back: 'A symbiotic relationship where both species benefit (bee and flower, clownfish and anemone)' },
          { front: 'What is commensalism?', back: 'A relationship where one benefits and the other is unaffected (bird nesting in tree)' },
          { front: 'What is parasitism?', back: 'A relationship where one benefits and the other is harmed (tick on dog, tapeworm in human)' },
          { front: 'What is an example of genetic diversity?', back: 'Different dog breeds - all are the same species (Canis familiaris) but have genetic variation' },
          { front: 'What is an example of species diversity?', back: 'A coral reef with many different fish species, corals, and marine life' },
          { front: 'What is an example of ecosystem diversity?', back: 'A region with forests, wetlands, grasslands, and lakes' },
          { front: 'Why is biodiversity important?', back: 'More diverse ecosystems are more stable, resilient to change, and provide essential services (clean air, water, food)' },
          { front: 'What is bioaugmentation?', back: 'Using bacteria or fungi to neutralize toxins and clean up pollution (like oil spills)' },
          { front: 'What is nitrification?', back: 'The conversion of ammonia (NH₃) to nitrite (NO₂⁻) and then to nitrate (NO₃⁻) by bacteria' },
          { front: 'What is denitrification?', back: 'The conversion of nitrate (NO₃⁻) back into nitrogen gas (N₂) that returns to the atmosphere' }
        ],
        notes: []
      },
      {
        id: 'physics-flashcards-header',
        title: '⚡ Physics Flashcards',
        isSectionHeader: true,
        headerColor: 'from-amber-500 to-orange-600',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        flashcards: [],
        notes: []
      },
      {
        id: 'physics-flashcards',
        title: 'Physics Flashcards - Electricity Concepts',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        flashcards: [
          { front: 'What is static electricity?', back: 'Build-up of electric charge on the surface of objects. Charges don\'t move - they stay in one place. Caused by imbalance of electrons and protons.' },
          { front: 'What is the Law of Electric Charges?', back: 'Like charges REPEL (push away): + and + OR - and -\nOpposite charges ATTRACT (pull together): + and -' },
          { front: 'What are the three ways to charge objects?', back: 'FRICTION: Rubbing transfers electrons\nCONDUCTION: Direct contact transfers charge\nINDUCTION: Charged object nearby causes separation without touching' },
          { front: 'What is current electricity?', back: 'Continuous flow of electrons through a conductor. Unlike static, charges are MOVING constantly. Requires a complete circuit (closed loop).' },
          { front: 'What is voltage (V)?', back: 'Electrical pressure or "push" that moves electrons through a circuit. Measured in Volts (V). Think: the force that pushes water through a pipe.' },
          { front: 'What is current (I)?', back: 'Rate of flow of electric charge (electrons). Measured in Amperes (A). Think: how much water flows through a pipe per second.' },
          { front: 'What is resistance (R)?', back: 'Opposition to flow of current. Measured in Ohms (Ω). Think: friction that slows down water flow in a pipe.' },
          { front: 'What is Ohm\'s Law?', back: 'V = I × R\nVoltage = Current × Resistance\nIf you know any 2 values, you can find the 3rd.' },
          { front: 'How do you calculate current using Ohm\'s Law?', back: 'I = V / R\nCurrent = Voltage ÷ Resistance\nExample: 12V ÷ 4Ω = 3A' },
          { front: 'How do you calculate resistance using Ohm\'s Law?', back: 'R = V / I\nResistance = Voltage ÷ Current\nExample: 12V ÷ 3A = 4Ω' },
          { front: 'What is a series circuit?', back: 'ONE path for current to flow. Components connected end-to-end. Current is SAME everywhere. Voltage DIVIDES among components. If one breaks, ALL stop working.' },
          { front: 'What is a parallel circuit?', back: 'MULTIPLE paths for current. Components connected across same two points. Voltage is SAME across all branches. Current DIVIDES among paths. If one breaks, others KEEP working.' },
          { front: 'In a series circuit, what happens to current?', back: 'Current is the SAME at all points in the circuit.\nI₁ = I₂ = I₃\nElectrons have only one path to follow.' },
          { front: 'In a series circuit, what happens to voltage?', back: 'Voltage DIVIDES among components.\nV_total = V₁ + V₂ + V₃\nEach component gets a portion of the total voltage.' },
          { front: 'In a parallel circuit, what happens to voltage?', back: 'Voltage is the SAME across all branches.\nV₁ = V₂ = V₃\nEach path gets the full battery voltage.' },
          { front: 'In a parallel circuit, what happens to current?', back: 'Current DIVIDES among branches.\nI_total = I₁ + I₂ + I₃\nMore paths = more total current drawn.' },
          { front: 'What is electrical power (P)?', back: 'Rate at which electrical energy is used or produced. Measured in Watts (W). Higher wattage = more energy used per second. 1000W = 1 Kilowatt (kW).' },
          { front: 'What is the power formula?', back: 'P = V × I\nPower = Voltage × Current\nExample: 120V × 0.5A = 60W' },
          { front: 'What is the difference between energy and power?', back: 'POWER: How fast you use energy (Watts)\nENERGY: Total amount used over time (Joules or kWh)\nEnergy = Power × Time' },
          { front: 'How do you calculate the cost of electricity?', back: 'Cost = (Power in kW) × (Time in hours) × (Rate per kWh)\nExample: 1.5 kW heater × 8 hours × $0.12/kWh = $1.44' },
          { front: 'What is a conductor?', back: 'Material that allows electricity to flow easily. Examples: copper, metals, water with minerals. Low resistance to current flow.' },
          { front: 'What is an insulator?', back: 'Material that resists flow of electricity. Examples: rubber, plastic, wood, glass. High resistance to current flow. Used for safety.' },
          { front: 'What is a circuit breaker?', back: 'Safety switch that automatically opens (trips) when too much current flows. Prevents fires and electrocution. Can be reset after fixing the problem.' },
          { front: 'What is a fuse?', back: 'Safety device with thin wire that melts if too much current flows. Breaks the circuit to prevent fires. Must be replaced after it "blows".' },
          { front: 'What is grounding?', back: 'Third prong on plug connects to ground (Earth). Provides safe path for excess electricity. Prevents shocks if device has internal short. Metal appliances MUST be grounded.' },
          { front: 'Why is electricity dangerous?', back: 'Electric current can disrupt your heart rhythm. As little as 0.1A (100mA) through heart can be fatal. High voltage causes severe burns. Electricity takes easiest path to ground - could be through YOU.' },
          { front: 'What does an ammeter measure?', back: 'Measures electric current (I) in Amperes (A). Must be connected in SERIES with the component. Symbol: Circle with "A" inside.' },
          { front: 'What does a voltmeter measure?', back: 'Measures voltage (V) in Volts. Must be connected in PARALLEL across the component. Symbol: Circle with "V" inside.' },
          { front: 'What are the circuit symbol components?', back: 'Battery: Long line (+) and short line (-)\nWire: Straight line\nBulb/Resistor: Zigzag or circle with X\nSwitch: Break in line that can open/close\nAmmeter: Circle with A\nVoltmeter: Circle with V' },
          { front: 'What happens when you add more bulbs in series?', back: 'More resistance, so dimmer light. Current decreases. Total resistance increases (R_total = R₁ + R₂ + R₃). Voltage divides among more bulbs.' },
          { front: 'What happens when you add more branches in parallel?', back: 'Each bulb stays bright. More total current drawn. Each branch has same voltage. More paths = easier for current to flow (less total resistance).' },
          { front: 'What factors affect resistance?', back: 'LENGTH: Longer wire = MORE resistance\nTHICKNESS: Thinner wire = MORE resistance\nMATERIAL: Copper (low) vs Rubber (high)\nTEMPERATURE: Hotter = MORE resistance (usually)' },
          { front: 'If a 12V battery powers a 3Ω resistor, what is the current?', back: 'Use I = V / R\nI = 12V / 3Ω = 4A\nThe current is 4 Amperes.' },
          { front: 'If 2A of current flows through a 6Ω resistor, what is the voltage?', back: 'Use V = I × R\nV = 2A × 6Ω = 12V\nThe voltage is 12 Volts.' },
          { front: 'A 100W bulb runs for 10 hours. How much energy is used?', back: 'Energy = Power × Time\n= 100W × 10h = 1000 Wh = 1 kWh\nEnergy used is 1 kilowatt-hour.' },
          { front: 'What is a load in a circuit?', back: 'Device that uses electrical energy. Examples: bulb, motor, resistor, heater. Converts electrical energy to light, motion, or heat.' },
          { front: 'What makes a complete circuit?', back: 'Must have: Power source (battery), Wires (conductor), Load (bulb/resistor), Complete loop (closed path). If any part is broken, current stops flowing.' },
          { front: 'Why do homes use parallel circuits?', back: 'Each outlet/appliance works independently. If one device breaks, others keep working. Each device gets full voltage (120V). Can control devices separately.' },
          { front: 'What happens if a circuit is short-circuited?', back: 'Unintended path with very low resistance forms. HUGE current flows. Can cause: fires, melted wires, battery damage. Circuit breaker/fuse should stop it.' },
          { front: 'How does a light switch work?', back: 'Opens or closes the circuit. OPEN: Gap in circuit, no current flows, light OFF. CLOSED: Complete path, current flows, light ON.' },
          { front: 'What is the power of a device using 120V and 5A?', back: 'P = V × I\nP = 120V × 5A = 600W\nThe power is 600 Watts.' }
        ],
        notes: []
      },
      {
        id: 'chem-flashcards-header',
        title: '🧪 Chemistry Flashcards',
        isSectionHeader: true,
        headerColor: 'from-violet-500 to-purple-600',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        flashcards: [],
        notes: []
      },
      {
        id: 'chemistry-flashcards',
        title: 'Chemistry Flashcards',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        flashcards: [
          { front: 'What are the three subatomic particles?', back: 'Protons (+1 charge, in nucleus)\nNeutrons (0 charge, in nucleus)\nElectrons (-1 charge, in shells)' },
          { front: 'What is a pure substance?', back: 'Matter with uniform composition - either an element (one type of atom) or compound (bonded elements)' },
          { front: 'What is a homogeneous mixture?', back: 'A mixture that is uniform throughout - you cannot see the individual parts (solution)' },
          { front: 'What is a heterogeneous mixture?', back: 'A mixture where you can see different parts (mechanical mixture, suspension)' },
          { front: 'What is density?', back: 'Mass per unit volume\nD = m/V\nMeasured in g/cm³ or g/mL' },
          { front: 'What is a physical property?', back: 'A characteristic you can observe WITHOUT changing the substance (color, mass, density, melting point)' },
          { front: 'What is a chemical property?', back: 'How a substance reacts with OTHER substances (combustibility, reactivity, stability)' },
          { front: 'What are 5 signs of a chemical change?', back: 'Color change, gas production, temperature change, light production, precipitate forms' },
          { front: 'Who proposed the plum pudding model?', back: 'J.J. Thomson - discovered electrons and proposed positive material with embedded electrons' },
          { front: 'Who discovered the nucleus?', back: 'Ernest Rutherford - found dense positive nucleus with electrons orbiting around it' },
          { front: 'What did Bohr contribute?', back: 'Niels Bohr proposed that electrons orbit in specific energy levels/shells (planetary model)' },
          { front: 'How do you find the number of neutrons?', back: 'Neutrons = Mass number - Atomic number' },
          { front: 'What are valence electrons?', back: 'Electrons in the outermost shell that determine chemical behavior' },
          { front: 'What is an ion?', back: 'An atom with unequal protons and electrons\nCation = positive (lost electrons)\nAnion = negative (gained electrons)' },
          { front: 'What are isotopes?', back: 'Atoms of the same element with different numbers of neutrons (same protons, different mass)' },
          { front: 'What are alkali metals?', back: 'Group 1 elements: soft, highly reactive, shiny, 1 valence electron' },
          { front: 'What are halogens?', back: 'Group 17 elements: reactive non-metals, diatomic, gain 1 electron, form salts' },
          { front: 'What are noble gases?', back: 'Group 18 elements: unreactive, full valence shell (8 electrons), stable' },
          { front: 'What is the formula for density?', back: 'D = m/V\nWhere D = density, m = mass, V = volume' },
          { front: 'Will an object float or sink?', back: 'Float if object density < liquid density\nSink if object density > liquid density' },
          { front: 'What is the atomic number?', back: 'The number of protons in an atom - this identifies the element' },
          { front: 'What is the mass number?', back: 'The total number of protons + neutrons in the nucleus' },
          { front: 'What is John Dalton known for?', back: 'Proposed atoms are indivisible solid spheres (Solid Sphere Model - 1803)' },
          { front: 'What is an element?', back: 'A pure substance made of only one type of atom (e.g., gold, oxygen, carbon)' },
          { front: 'What is a compound?', back: 'A pure substance made of two or more elements chemically bonded (e.g., H₂O, CO₂, NaCl)' },
          { front: 'What is a cation?', back: 'A positively charged ion formed when an atom LOSES electrons (e.g., Na⁺, Ca²⁺, Al³⁺)' },
          { front: 'What is an anion?', back: 'A negatively charged ion formed when an atom GAINS electrons (e.g., Cl⁻, O²⁻, N³⁻)' },
          { front: 'How many electrons fit in shell 1?', back: '2 electrons maximum' },
          { front: 'How many electrons fit in shell 2?', back: '8 electrons maximum' },
          { front: 'How many electrons fit in shell 3?', back: '8 electrons maximum (for first 20 elements)' },
          { front: 'What are metalloids?', back: 'Elements with properties between metals and non-metals (semiconductors like Silicon, Boron)' },
          { front: 'What are transition metals?', back: 'Metals in the middle of periodic table (Groups 3-12) - can form multiple ion charges' },
          { front: 'What is filtration?', back: 'Separation method that uses a filter to separate solids from liquids' },
          { front: 'What is distillation?', back: 'Separation method using different boiling points to separate liquids' },
          { front: 'What is evaporation?', back: 'Separation method where liquid evaporates leaving dissolved solid behind' },
          { front: 'Why do atoms form ions?', back: 'To achieve a stable electron configuration with a full outer shell (8 valence electrons)' },
          { front: 'What is a qualitative property?', back: 'A property described with words (color, texture, odor, luster)' },
          { front: 'What is a quantitative property?', back: 'A property measured with numbers (mass, volume, density, temperature)' },
          { front: 'What happens in a physical change?', back: 'Substance changes form but remains the same substance (melting, cutting, dissolving)' },
          { front: 'What happens in a chemical change?', back: 'New substance forms with different properties (burning, rusting, cooking)' }
        ],
        notes: []
      },
      {
        id: 'biology-expert-flashcards',
        title: 'Biology Expert Flashcards - Advanced Concepts',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
        locked: true,
        flashcards: [],
        notes: []
      },
      {
        id: 'biology-ecosystems-deep',
        title: 'Advanced Ecosystems - Deep Dive Analysis',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
        locked: true,
        flashcards: [],
        notes: []
      },
      {
        id: 'biology-genetics-intro',
        title: 'Introduction to Genetics & Heredity',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
        locked: true,
        flashcards: [],
        notes: []
      }
    ]
  },
  testReview: {
    id: 'testReview',
    name: 'Test Review Guide',
    description: '10 comprehensive study guides covering everything for your tests',
    icon: Target,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=600&fit=crop',
    isQuizSection: true,
    sections: [
      {
        id: 'biology-review',
        title: 'Biology Test - What You Need to Know',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Lesson 1: Biodiversity Types',
            emoji: '🌿',
                        layout: 'bullets',
            points: [
              'What are the three types of biodiversity? Provide an example of each',
              'Genetic, species, and ecosystem diversity'
            ]
          },
          {
            subtitle: 'Lesson 2: H.I.P.P.O.C Threats',
            emoji: '⚠️',
                        layout: 'bullets',
            points: [
              'Explain what each letter of H.I.P.P.O.C stands for',
              'Provide an example of each threat',
              'Describe one solution to address each threat'
            ]
          },
          {
            subtitle: 'Lesson 3: Ecosystem Factors',
            emoji: '🌍',
                        layout: 'bullets',
            points: [
              'Differentiate between biotic and abiotic factors',
              'Name 6 examples of each type',
              'Explain sustainable vs non-sustainable ecosystems',
              'Name and describe each of the 4 spheres',
              'Provide examples of interactions between spheres'
            ]
          },
          {
            subtitle: 'Lesson 4: Ecosystem Services & Types',
            emoji: '🎯',
                        layout: 'bullets',
            points: [
              'Explain what an ecosystem service is',
              'Give two examples of ecosystem services',
              'Difference between natural and artificial ecosystems',
              'Provide examples of each'
            ]
          },
          {
            subtitle: 'Lesson 5: Symbiosis & Relationships',
            emoji: '🤝',
                        layout: 'bullets',
            points: [
              'What is symbiosis?',
              'Different types of symbiotic relationships (mutualism, commensalism, parasitism)',
              'Give examples of each type'
            ]
          },
          {
            subtitle: 'Lesson 6: Food Chains & Energy',
            emoji: '🔗',
                        layout: 'bullets',
            points: [
              'What is a food chain?',
              'Practice aquatic and terrestrial food chains',
              'Include trophic levels and arrows for energy flow',
              'How much energy passes between levels? (10%)',
              'What happens to the other 90%?'
            ]
          },
          {
            subtitle: 'Lesson 7: Energy Pyramids',
            emoji: '🔺',
                        layout: 'bullets',
            points: [
              'Draw an energy pyramid for a food chain',
              'If producers have 54,670 kcal, calculate each level',
              'Explain bioaccumulation vs biomagnification',
              'Provide examples for each'
            ]
          },
          {
            subtitle: 'Lesson 8: Nutrient Cycles',
            emoji: '♻️',
                        layout: 'bullets',
            points: [
              'What are nutrients? Why are they important?',
              'Examples of reservoirs and transfer processes',
              'Outline Carbon cycle with flow diagram (reservoirs + processes)',
              'Know photosynthesis and cellular respiration (reactants + products)',
              'How do human activities affect these processes?',
              'Outline Nitrogen cycle with flow diagram'
            ]
          },
          {
            subtitle: 'Lesson 9: Invasive Species',
            emoji: '🦟',
                        layout: 'bullets',
            points: [
              'What are invasive species? What criteria defines them?',
              'Examples of invasive species',
              'For one species: origin, location where invasive, harm caused',
              'Describe strategies to control/manage invasive species'
            ]
          },
          {
            subtitle: 'Lesson 10: Climate Change & Restoration',
            emoji: '🌡️',
                        layout: 'bullets',
            points: [
              'What is climate change? Evidence that climate is changing?',
              'Worldwide impacts of climate change',
              'How to fix damaged ecosystems:',
              'Describe reforestation, bioaugmentation, and bioremediation'
            ]
          }
        ]
      },
      {
        id: 'chemistry-review',
        title: 'Chemistry Test - What You Need to Know',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Lesson 1: Safety + Lab Equipment',
            emoji: '🥽',
                        layout: 'bullets',
            points: [
              'Be familiar with WHMIS safety labels on chemical containers',
              'Know all lab safety rules',
              'Identify common lab equipment'
            ]
          },
          {
            subtitle: 'Lesson 2: Types of Matter',
            emoji: '🧪',
                        layout: 'bullets',
            points: [
              'Distinguish between pure substances and mixtures',
              'Heterogeneous mixtures: mechanical mixtures, suspensions, emulsions',
              'Homogeneous mixtures: solutions and alloys',
              'Be able to classify examples of each type'
            ]
          },
          {
            subtitle: 'Lesson 3: Properties of Matter',
            emoji: '⚖️',
                        layout: 'bullets',
            points: [
              'Distinguish chemical vs physical properties (with examples)',
              'Distinguish quantitative vs qualitative properties (with examples)',
              'Know how to solve density problems',
              'Describe how density changes when mass/volume increases or decreases',
              'Draw (plot) a line graph by hand from supplied data',
              'Use a mass vs volume graph to find density of an object'
            ]
          },
          {
            subtitle: 'Lesson 4: Physical/Chemical Changes',
            emoji: '🔬',
                        layout: 'bullets',
            points: [
              'Explain the meaning of physical change vs chemical change',
              'List evidence to look for when checking for chemical change',
              'Color change, gas production, temperature change, energy production, precipitate'
            ]
          },
          {
            subtitle: 'Lesson 5: Organization of Periodic Table',
            emoji: '📋',
                        layout: 'bullets',
            points: [
              'Identify properties and location of families: alkali metals, alkaline earth metals, halogens, noble gases',
              'List name and symbols for first 20 elements',
              'State properties of metals and non-metals',
              'Identify metals, non-metals, metalloids using Periodic Table'
            ]
          },
          {
            subtitle: 'Lesson 6: Models of the Atom',
            emoji: '🔭',
                        layout: 'bullets',
            points: [
              'Outline contributions of Dalton, Thomson, Rutherford, and Bohr',
              'Know the names of each scientist\'s atomic model',
              'Dalton: solid sphere, Thomson: plum pudding, Rutherford: nuclear, Bohr: planetary'
            ]
          },
          {
            subtitle: 'Lesson 7: Subatomic Particles + Bohr-Rutherford Diagrams',
            emoji: '⚛️',
                        layout: 'bullets',
            points: [
              'Explain electrons, protons, neutrons (charge and mass)',
              'Use periodic table to determine # of protons, neutrons, electrons',
              'Draw Bohr-Rutherford diagrams for first 20 elements',
              'Explain what an isotope is',
              'Recognize isotopes in a series of diagrams'
            ]
          },
          {
            subtitle: 'Lesson 8: Valence Electrons & Ions',
            emoji: '💫',
                        layout: 'bullets',
            points: [
              'Explain what valence electrons are',
              'Explain and draw Lewis dot diagrams for different elements',
              'Use periodic table to calculate protons, neutrons, electrons for ions',
              'Understand cations (positive) and anions (negative)'
            ]
          }
        ]
      }
    ]
  },
  practiceQuestions: {
    id: 'practiceQuestions',
    name: 'Practice Questions',
    description: '7 quizzes with 80+ questions and instant feedback',
    icon: FileText,
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1200&h=600&fit=crop',
    isQuizSection: true,
    sections: [
      {
        id: 'biology-section-header',
        title: '🌿 Biology Practice Questions',
        isSectionHeader: true,
        headerColor: 'from-emerald-500 to-teal-600',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
        quiz: [],
        notes: []
      },
      {
        id: 'biology-advanced-quiz',
        title: 'Biology Advanced Quiz - Ecosystems & Evolution',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      },
      {
        id: 'biology-practice-1',
        title: 'Biology Practice Quiz 1 - Biodiversity & Threats',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'What are the three types of biodiversity?',
            options: ['Genetic, species, ecosystem', 'Plant, animal, microbe', 'Land, water, air', 'Producer, consumer, decomposer'],
            correct: 0,
            explanation: 'The three types are genetic diversity (variation within species), species diversity (variety of species), and ecosystem diversity (variety of ecosystems).'
          },
          {
            question: 'In H.I.P.P.O.C., what does the "H" stand for?',
            options: ['Human population', 'Habitat destruction', 'Hunting', 'Hazardous waste'],
            correct: 1,
            explanation: 'H stands for Habitat Destruction - the removal of living spaces that species need to survive.'
          },
          {
            question: 'Which is an example of a biotic factor?',
            options: ['Sunlight', 'Water', 'Bacteria', 'Temperature'],
            correct: 2,
            explanation: 'Bacteria are living organisms, making them biotic factors. Sunlight, water, and temperature are abiotic (non-living) factors.'
          },
          {
            question: 'What does the "C" in H.I.P.P.O.C. represent?',
            options: ['Chemicals', 'Climate change', 'Conservation', 'Carbon emissions'],
            correct: 1,
            explanation: 'C stands for Climate Change - alterations in global weather patterns that threaten ecosystems.'
          },
          {
            question: 'Which is an example of genetic diversity?',
            options: ['Different fish species in a reef', 'Different dog breeds', 'Different ecosystems in a region', 'Different trees in a forest'],
            correct: 1,
            explanation: 'Different dog breeds are an example of genetic diversity - variation within a single species (dogs).'
          },
          {
            question: 'What does "I" stand for in H.I.P.P.O.C.?',
            options: ['Insects', 'Invasive species', 'Industrial waste', 'Ice melting'],
            correct: 1,
            explanation: 'I stands for Invasive Species - non-native organisms that cause harm to native ecosystems.'
          },
          {
            question: 'Which is an example of species diversity?',
            options: ['Different dog breeds', 'Different types of fish in a coral reef', 'Forests and grasslands', 'Tall and short oak trees'],
            correct: 1,
            explanation: 'Different types of fish in a coral reef is species diversity - variety of different species in one habitat.'
          },
          {
            question: 'What does "P" (first one) stand for in H.I.P.P.O.C.?',
            options: ['Plants', 'Pollution', 'Pesticides', 'Plastics'],
            correct: 1,
            explanation: 'The first P stands for Pollution - toxic chemicals, waste, and contaminants that harm organisms.'
          },
          {
            question: 'Which is an abiotic factor?',
            options: ['Mushrooms', 'Temperature', 'Bacteria', 'Grass'],
            correct: 1,
            explanation: 'Temperature is abiotic (non-living). Mushrooms, bacteria, and grass are all living (biotic).'
          },
          {
            question: 'What does "O" stand for in H.I.P.P.O.C.?',
            options: ['Oil spills', 'Overharvesting', 'Oxygen depletion', 'Ocean acidification'],
            correct: 1,
            explanation: 'O stands for Overharvesting - taking too many organisms (fishing, hunting, logging) faster than they can reproduce.'
          },
          {
            question: 'Which is an example of ecosystem diversity?',
            options: ['Different breeds of cats', 'Variety of birds in a forest', 'Forests, wetlands, and grasslands in a region', 'Different colored flowers'],
            correct: 2,
            explanation: 'Forests, wetlands, and grasslands represent ecosystem diversity - variety of different ecosystems in an area.'
          },
          {
            question: 'What is a sustainable ecosystem?',
            options: ['One with no predators', 'One that can maintain itself over time', 'One with only plants', 'One without humans'],
            correct: 1,
            explanation: 'A sustainable ecosystem can maintain itself over time with resources regenerating as fast as they are used.'
          }
        ],
        notes: []
      },
      {
        id: 'biology-practice-2',
        title: 'Biology Practice Quiz 2 - Energy & Food Chains',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'How much energy is transferred between trophic levels?',
            options: ['50%', '25%', '10%', '90%'],
            correct: 2,
            explanation: 'Only about 10% of energy passes to the next trophic level. The remaining 90% is lost as heat, movement, and waste.'
          },
          {
            question: 'If producers have 50,000 kcal, how much energy do primary consumers get?',
            options: ['50,000 kcal', '25,000 kcal', '5,000 kcal', '500 kcal'],
            correct: 2,
            explanation: 'Primary consumers receive 10% of the producer energy: 50,000 × 0.10 = 5,000 kcal.'
          },
          {
            question: 'What is bioaccumulation?',
            options: ['Increase up food chain', 'Build-up in one organism', 'Energy transfer', 'Nutrient cycling'],
            correct: 1,
            explanation: 'Bioaccumulation is the build-up of a substance within a single organism over time, like mercury accumulating in a fish.'
          },
          {
            question: 'What process removes CO₂ from the atmosphere?',
            options: ['Respiration', 'Photosynthesis', 'Combustion', 'Decomposition'],
            correct: 1,
            explanation: 'Photosynthesis removes CO₂ from the atmosphere as plants convert it into glucose using sunlight.'
          },
          {
            question: 'In the nitrogen cycle, what converts N₂ into ammonia?',
            options: ['Photosynthesis', 'Respiration', 'Nitrogen fixation', 'Denitrification'],
            correct: 2,
            explanation: 'Nitrogen fixation (by bacteria or lightning) converts atmospheric N₂ into ammonia (NH₃) that plants can use.'
          },
          {
            question: 'What is biomagnification?',
            options: ['Energy loss between levels', 'Toxin concentration increases up food chain', 'Population growth', 'Nutrient absorption'],
            correct: 1,
            explanation: 'Biomagnification is when toxin concentration increases as you move up the food chain. Top predators have the highest concentrations.'
          },
          {
            question: 'If primary consumers have 10,000 kcal, how much do secondary consumers get?',
            options: ['10,000 kcal', '5,000 kcal', '1,000 kcal', '100 kcal'],
            correct: 2,
            explanation: 'Secondary consumers get 10% of primary consumer energy: 10,000 × 0.10 = 1,000 kcal.'
          },
          {
            question: 'What is the correct order of a food chain?',
            options: ['Consumer → Producer → Decomposer', 'Producer → Consumer → Decomposer', 'Decomposer → Producer → Consumer', 'Consumer → Decomposer → Producer'],
            correct: 1,
            explanation: 'Food chains always start with producers (plants), then consumers (animals), and decomposers break down dead matter.'
          },
          {
            question: 'Which organism is a primary consumer?',
            options: ['Grass', 'Rabbit', 'Fox', 'Mushroom'],
            correct: 1,
            explanation: 'A rabbit is a primary consumer (herbivore) that eats producers (plants). Fox is secondary, mushroom is decomposer.'
          },
          {
            question: 'Where does energy in food chains originally come from?',
            options: ['Soil', 'Water', 'Sun', 'Air'],
            correct: 2,
            explanation: 'All energy in food chains originally comes from the sun. Plants capture solar energy through photosynthesis.'
          },
          {
            question: 'What happens to the 90% of energy that doesn\'t transfer?',
            options: ['It disappears', 'Lost as heat and waste', 'Stored in soil', 'Goes to decomposers'],
            correct: 1,
            explanation: 'The 90% is lost as heat from movement and metabolism, and through waste products. Only 10% is stored in body tissues.'
          },
          {
            question: 'Which has the most energy in an energy pyramid?',
            options: ['Top predators', 'Secondary consumers', 'Primary consumers', 'Producers'],
            correct: 3,
            explanation: 'Producers at the bottom of the pyramid have the most energy. Energy decreases as you move up each level.'
          }
        ],
        notes: []
      },
      {
        id: 'biology-practice-3',
        title: 'Biology Practice Quiz 3 - Cycles & Restoration',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'Which is NOT a characteristic of invasive species?',
            options: ['Native to the area', 'Rapid reproduction', 'Outcompete natives', 'Disrupt ecosystems'],
            correct: 0,
            explanation: 'Invasive species are NOT native to the area - they are introduced from elsewhere and cause harm to native ecosystems.'
          },
          {
            question: 'What is bioremediation?',
            options: ['Planting trees', 'Adding helpful organisms', 'Using bacteria to break down toxins', 'Reducing pollution'],
            correct: 1,
            explanation: 'Bioremediation involves adding species that break down waste and improve soil/water quality to restore ecosystems.'
          },
          {
            question: 'What is the photosynthesis equation (simplified)?',
            options: ['CO₂ + H₂O → Glucose + O₂', 'Glucose + O₂ → CO₂ + H₂O', 'N₂ → NH₃', 'CH₄ + O₂ → CO₂'],
            correct: 0,
            explanation: 'Photosynthesis: CO₂ + H₂O → C₆H₁₂O₆ + O₂. Plants use carbon dioxide and water to make glucose and oxygen.'
          },
          {
            question: 'What does reforestation mean?',
            options: ['Removing forests', 'Planting trees where cut down', 'Creating new forests', 'Protecting old forests'],
            correct: 1,
            explanation: 'Reforestation is planting trees in areas where they were previously cut down to restore ecosystems.'
          },
          {
            question: 'Which sphere contains all living organisms?',
            options: ['Atmosphere', 'Biosphere', 'Hydrosphere', 'Lithosphere'],
            correct: 1,
            explanation: 'The biosphere contains all living organisms on Earth - plants, animals, bacteria, and fungi.'
          },
          {
            question: 'What is cellular respiration?',
            options: ['Making oxygen', 'Breaking down glucose for energy', 'Fixing nitrogen', 'Absorbing sunlight'],
            correct: 1,
            explanation: 'Cellular respiration breaks down glucose with oxygen to release energy (ATP) that organisms need to survive.'
          },
          {
            question: 'What is the atmosphere?',
            options: ['All water on Earth', 'Layer of gases around Earth', 'All living things', 'Earth\'s crust'],
            correct: 1,
            explanation: 'The atmosphere is the layer of gases surrounding Earth, including oxygen, nitrogen, and carbon dioxide.'
          },
          {
            question: 'What is bioaugmentation?',
            options: ['Adding trees', 'Using bacteria/fungi to neutralize toxins', 'Removing invasive species', 'Filtering water'],
            correct: 1,
            explanation: 'Bioaugmentation uses bacteria or fungi to neutralize toxins and pollutants, like in the BP oil spill cleanup.'
          },
          {
            question: 'What do decomposers do?',
            options: ['Make food from sunlight', 'Eat plants', 'Break down dead organisms', 'Hunt other animals'],
            correct: 2,
            explanation: 'Decomposers break down dead plants and animals, returning nutrients to the soil for producers to use.'
          },
          {
            question: 'What is nitrification?',
            options: ['N₂ to NH₃', 'NH₃ to NO₃⁻', 'NO₃⁻ to N₂', 'N₂ to protein'],
            correct: 1,
            explanation: 'Nitrification is when bacteria convert ammonia (NH₃) to nitrite (NO₂⁻) and then to nitrate (NO₃⁻) that plants can use.'
          },
          {
            question: 'Which is an example of an invasive species in North America?',
            options: ['White-tailed deer', 'Bald eagle', 'Zebra mussels', 'Oak trees'],
            correct: 2,
            explanation: 'Zebra mussels are invasive in North American lakes. They came from Europe and outcompete native mussels.'
          },
          {
            question: 'What is denitrification?',
            options: ['Adding nitrogen to soil', 'Converting nitrate back to N₂ gas', 'Plants absorbing nitrogen', 'Bacteria dying'],
            correct: 1,
            explanation: 'Denitrification is when bacteria convert nitrate (NO₃⁻) back into nitrogen gas (N₂) that returns to the atmosphere.'
          }
        ],
        notes: []
      },
      {
        id: 'chemistry-section-header',
        title: '🧪 Chemistry Practice Questions',
        isSectionHeader: true,
        headerColor: 'from-violet-500 to-purple-600',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        quiz: [],
        notes: []
      },
      {
        id: 'chemistry-advanced-quiz',
        title: 'Chemistry Advanced Quiz - Chemical Reactions & Bonding',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      },
      {
        id: 'chemistry-bonding-quiz',
        title: 'Chemistry Advanced Quiz - Chemical Bonding & Reactions',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      },
      {
        id: 'chemistry-practice-1',
        title: 'Chemistry Practice Quiz 1 - Safety & Matter',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'Which WHMIS symbol indicates a flammable substance?',
            options: ['Skull and crossbones', 'Flame', 'Exclamation mark', 'Test tube'],
            correct: 1,
            explanation: 'The flame symbol indicates flammable substances that catch fire easily from heat, sparks, or flames.'
          },
          {
            question: 'What type of mixture is salt water?',
            options: ['Heterogeneous', 'Homogeneous', 'Suspension', 'Mechanical'],
            correct: 1,
            explanation: 'Salt water is a homogeneous mixture (solution) - it is uniform throughout and you cannot see the individual parts.'
          },
          {
            question: 'Which is a chemical property?',
            options: ['Color', 'Density', 'Combustibility', 'Melting point'],
            correct: 2,
            explanation: 'Combustibility (ability to burn) is a chemical property because it describes how a substance reacts with other substances.'
          },
          {
            question: 'What is the difference between an element and a compound?',
            options: ['Elements are pure, compounds are mixed', 'Elements have one atom type, compounds have bonded elements', 'No difference', 'Compounds are always solid'],
            correct: 1,
            explanation: 'Elements contain only one type of atom (like oxygen), while compounds contain two or more elements chemically bonded together (like H₂O).'
          },
          {
            question: 'Which is evidence of a chemical change?',
            options: ['Melting', 'Breaking', 'Color change', 'Dissolving'],
            correct: 2,
            explanation: 'Color change is evidence of a chemical change. Melting, breaking, and dissolving are typically physical changes.'
          },
          {
            question: 'What does the skull and crossbones WHMIS symbol mean?',
            options: ['Flammable', 'Poisonous/toxic', 'Corrosive', 'Explosive'],
            correct: 1,
            explanation: 'The skull and crossbones indicates poisonous or toxic substances that can cause death or serious injury if swallowed or inhaled.'
          },
          {
            question: 'Which is a pure substance?',
            options: ['Salt water', 'Air', 'Gold', 'Trail mix'],
            correct: 2,
            explanation: 'Gold is a pure substance (element). Salt water, air, and trail mix are all mixtures.'
          },
          {
            question: 'What type of mixture is sand and water?',
            options: ['Solution', 'Homogeneous', 'Heterogeneous', 'Compound'],
            correct: 2,
            explanation: 'Sand and water is a heterogeneous mixture because you can see the different parts (sand particles in water).'
          },
          {
            question: 'Which is a physical property?',
            options: ['Flammability', 'Reactivity with acid', 'Melting point', 'Combustibility'],
            correct: 2,
            explanation: 'Melting point is a physical property - it can be observed without changing the substance. The others are chemical properties.'
          },
          {
            question: 'What is a quantitative property?',
            options: ['Color', 'Texture', 'Mass', 'Odor'],
            correct: 2,
            explanation: 'Mass is quantitative (measured with numbers). Color, texture, and odor are qualitative (descriptive).'
          },
          {
            question: 'Which safety rule is most important in the lab?',
            options: ['Wear safety goggles', 'All of them', 'Wash hands', 'Clean up spills'],
            correct: 1,
            explanation: 'All safety rules are important! They work together to keep you safe. Never skip any safety procedures.'
          },
          {
            question: 'What does H₂O represent?',
            options: ['Element', 'Mixture', 'Compound', 'Solution'],
            correct: 2,
            explanation: 'H₂O (water) is a compound - two or more elements (hydrogen and oxygen) chemically bonded together.'
          }
        ],
        notes: []
      },
      {
        id: 'chemistry-practice-2',
        title: 'Chemistry Practice Quiz 2 - Density & Properties',
        image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'A substance has mass of 80g and volume of 20cm³. What is its density?',
            options: ['2 g/cm³', '4 g/cm³', '60 g/cm³', '100 g/cm³'],
            correct: 1,
            explanation: 'D = m/V = 80g / 20cm³ = 4 g/cm³'
          },
          {
            question: 'Will an object with density 1.5 g/cm³ float or sink in water (1.0 g/cm³)?',
            options: ['Float', 'Sink', 'Stay suspended', 'Depends on size'],
            correct: 1,
            explanation: 'The object will sink because its density (1.5 g/cm³) is greater than water\'s density (1.0 g/cm³).'
          },
          {
            question: 'Which is a qualitative property?',
            options: ['Mass', 'Color', 'Volume', 'Density'],
            correct: 1,
            explanation: 'Color is qualitative (descriptive). Mass, volume, and density are quantitative (measured with numbers).'
          },
          {
            question: 'What is the density formula?',
            options: ['D = m × V', 'D = m / V', 'D = V / m', 'D = m + V'],
            correct: 1,
            explanation: 'Density = mass / volume (D = m/V). This tells us how much mass is in a given volume.'
          },
          {
            question: 'Which separation method would you use to separate sand from water?',
            options: ['Evaporation', 'Filtration', 'Distillation', 'Magnetism'],
            correct: 1,
            explanation: 'Filtration separates solids from liquids. The filter paper catches sand while water passes through.'
          },
          {
            question: 'An object has density 0.8 g/cm³. Will it float in water (1.0 g/cm³)?',
            options: ['Yes, float', 'No, sink', 'Cannot tell', 'Depends on shape'],
            correct: 0,
            explanation: 'It will float because its density (0.8) is less than water\'s density (1.0). Objects less dense than the liquid float.'
          },
          {
            question: 'If mass increases and volume stays the same, what happens to density?',
            options: ['Increases', 'Decreases', 'Stays the same', 'Becomes zero'],
            correct: 0,
            explanation: 'Density increases. Since D = m/V, if mass goes up and volume stays the same, density must increase.'
          },
          {
            question: 'Which method separates liquids with different boiling points?',
            options: ['Filtration', 'Magnetism', 'Distillation', 'Chromatography'],
            correct: 2,
            explanation: 'Distillation separates liquids based on different boiling points. The liquid with lower boiling point evaporates first.'
          },
          {
            question: 'What is the mass of an object with density 2 g/cm³ and volume 30 cm³?',
            options: ['15g', '32g', '60g', '28g'],
            correct: 2,
            explanation: 'Rearrange D = m/V to m = D × V. So m = 2 g/cm³ × 30 cm³ = 60g'
          },
          {
            question: 'Which tool would you use to measure liquid volume?',
            options: ['Electronic balance', 'Graduated cylinder', 'Ruler', 'Thermometer'],
            correct: 1,
            explanation: 'A graduated cylinder measures liquid volume accurately. A balance measures mass, not volume.'
          },
          {
            question: 'What is evaporation used for?',
            options: ['Separating mixtures', 'Getting dissolved solid from liquid', 'Measuring density', 'Creating compounds'],
            correct: 1,
            explanation: 'Evaporation separates a dissolved solid from a liquid. The liquid evaporates and leaves the solid behind (like getting salt from salt water).'
          },
          {
            question: 'If volume increases and mass stays the same, density will:',
            options: ['Increase', 'Decrease', 'Stay the same', 'Double'],
            correct: 1,
            explanation: 'Density decreases. Since D = m/V, if volume increases while mass stays constant, density must decrease.'
          }
        ],
        notes: []
      },
      {
        id: 'chemistry-practice-3',
        title: 'Chemistry Practice Quiz 3 - Atoms & Periodic Table',
        image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'What is the symbol for potassium?',
            options: ['P', 'Po', 'K', 'Pt'],
            correct: 2,
            explanation: 'Potassium has the symbol K (from its Latin name Kalium). It is element #19.'
          },
          {
            question: 'Which scientist proposed the plum pudding model?',
            options: ['Dalton', 'Thomson', 'Rutherford', 'Bohr'],
            correct: 1,
            explanation: 'J.J. Thomson proposed the plum pudding model after discovering electrons - positive material with embedded electrons.'
          },
          {
            question: 'An atom has 6 protons, 6 neutrons, and 6 electrons. What element is it?',
            options: ['Nitrogen', 'Carbon', 'Oxygen', 'Boron'],
            correct: 1,
            explanation: 'The number of protons determines the element. 6 protons = Carbon (C).'
          },
          {
            question: 'How many electrons can the second shell hold?',
            options: ['2', '4', '8', '18'],
            correct: 2,
            explanation: 'The second electron shell can hold a maximum of 8 electrons.'
          },
          {
            question: 'What is an ion with more electrons than protons called?',
            options: ['Cation', 'Anion', 'Isotope', 'Neutral'],
            correct: 1,
            explanation: 'An anion is a negatively charged ion that has gained electrons (more electrons than protons).'
          },
          {
            question: 'What is the symbol for sodium?',
            options: ['S', 'So', 'Na', 'Sd'],
            correct: 2,
            explanation: 'Sodium has the symbol Na (from its Latin name Natrium). It is element #11.'
          },
          {
            question: 'How many electrons can the first shell hold?',
            options: ['1', '2', '8', '18'],
            correct: 1,
            explanation: 'The first electron shell can hold a maximum of 2 electrons.'
          },
          {
            question: 'Which scientist discovered that atoms are mostly empty space?',
            options: ['Dalton', 'Thomson', 'Rutherford', 'Bohr'],
            correct: 2,
            explanation: 'Rutherford discovered atoms are mostly empty space with a dense nucleus through his gold foil experiment.'
          },
          {
            question: 'What determines the identity of an element?',
            options: ['Number of neutrons', 'Number of protons', 'Number of electrons', 'Atomic mass'],
            correct: 1,
            explanation: 'The number of protons (atomic number) determines which element it is. This never changes.'
          },
          {
            question: 'What are valence electrons?',
            options: ['Electrons in the nucleus', 'Electrons in the innermost shell', 'Electrons in the outermost shell', 'All electrons'],
            correct: 2,
            explanation: 'Valence electrons are in the outermost shell and determine how atoms bond and react.'
          },
          {
            question: 'An atom has 8 protons and 10 neutrons. What is its mass number?',
            options: ['8', '10', '18', '2'],
            correct: 2,
            explanation: 'Mass number = protons + neutrons = 8 + 10 = 18'
          },
          {
            question: 'Which group contains the most unreactive elements?',
            options: ['Group 1', 'Group 2', 'Group 17', 'Group 18'],
            correct: 3,
            explanation: 'Group 18 (Noble Gases) are the most unreactive because they have full outer electron shells.'
          }
        ],
        notes: []
      },
      {
        id: 'chemistry-practice-4',
        title: 'Chemistry Practice Quiz 4 - Advanced Concepts',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'Which group on the periodic table is most reactive?',
            options: ['Noble gases', 'Alkali metals', 'Halogens', 'Transition metals'],
            correct: 1,
            explanation: 'Alkali metals (Group 1) are the most reactive metals because they easily lose their single valence electron.'
          },
          {
            question: 'What are isotopes?',
            options: ['Same element, different electrons', 'Same element, different neutrons', 'Different elements, same mass', 'Charged atoms'],
            correct: 1,
            explanation: 'Isotopes are atoms of the same element with different numbers of neutrons (same protons, different mass).'
          },
          {
            question: 'How many valence electrons do noble gases have?',
            options: ['1', '4', '7', '8'],
            correct: 3,
            explanation: 'Noble gases have 8 valence electrons (except helium with 2), making them stable and unreactive.'
          },
          {
            question: 'What charge does a cation have?',
            options: ['Positive', 'Negative', 'Neutral', 'Variable'],
            correct: 0,
            explanation: 'A cation has a positive charge because it has lost electrons (more protons than electrons).'
          },
          {
            question: 'Which atomic model showed that atoms are mostly empty space?',
            options: ['Dalton', 'Thomson', 'Rutherford', 'Bohr'],
            correct: 2,
            explanation: 'Rutherford\'s nuclear model showed that atoms are mostly empty space with a dense nucleus at the center.'
          },
          {
            question: 'How many valence electrons do halogens have?',
            options: ['1', '5', '7', '8'],
            correct: 2,
            explanation: 'Halogens (Group 17) have 7 valence electrons. They need to gain 1 electron to have a full outer shell.'
          },
          {
            question: 'What is the difference between mass number and atomic mass?',
            options: ['They are the same', 'Mass number is rounded, atomic mass is precise', 'Mass number includes electrons', 'No difference'],
            correct: 1,
            explanation: 'Mass number is the total protons + neutrons (whole number). Atomic mass is the average mass of all isotopes (decimal).'
          },
          {
            question: 'Which particles are in the nucleus?',
            options: ['Protons only', 'Protons and electrons', 'Protons and neutrons', 'Neutrons and electrons'],
            correct: 2,
            explanation: 'The nucleus contains protons (positive) and neutrons (neutral). Electrons orbit outside the nucleus.'
          },
          {
            question: 'How do you calculate the number of neutrons?',
            options: ['Atomic number - mass number', 'Mass number - atomic number', 'Protons + electrons', 'Atomic mass × 2'],
            correct: 1,
            explanation: 'Neutrons = Mass number - Atomic number (or Mass number - Protons)'
          },
          {
            question: 'What happens when an atom gains electrons?',
            options: ['Becomes a cation', 'Becomes an anion', 'Becomes neutral', 'Changes element'],
            correct: 1,
            explanation: 'When an atom gains electrons, it becomes negatively charged and is called an anion.'
          },
          {
            question: 'Which scientist proposed electrons orbit in specific energy levels?',
            options: ['Dalton', 'Thomson', 'Rutherford', 'Bohr'],
            correct: 3,
            explanation: 'Niels Bohr proposed that electrons orbit the nucleus in specific energy levels or shells (planetary model).'
          },
          {
            question: 'What is the atomic number?',
            options: ['Number of neutrons', 'Number of protons', 'Number of electrons in outer shell', 'Total particles'],
            correct: 1,
            explanation: 'Atomic number is the number of protons in an atom. This identifies which element it is.'
          }
        ],
        notes: []
      },
      {
        id: 'chemistry-mastery-flashcards',
        title: 'Chemistry Mastery Flashcards - Complete Review',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        locked: true,
        flashcards: [],
        notes: []
      },
      {
        id: 'chemistry-reactions-advanced',
        title: 'Advanced Chemical Reactions & Equations',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        locked: true,
        flashcards: [],
        notes: []
      },
      {
        id: 'chemistry-lab-techniques',
        title: 'Laboratory Techniques & Procedures',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
        locked: true,
        flashcards: [],
        notes: []
      },
      {
        id: 'physics-section-header',
        title: '⚡ Physics Practice Questions',
        isSectionHeader: true,
        headerColor: 'from-amber-500 to-orange-600',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        quiz: [],
        notes: []
      },
      {
        id: 'physics-practice-1',
        title: 'Physics Practice Quiz 1 - Static & Current Electricity',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'What type of electricity is created when you rub a balloon on your hair?',
            options: ['Current electricity', 'Static electricity', 'Magnetic electricity', 'Thermal electricity'],
            correct: 1,
            explanation: 'Static electricity is created by friction - rubbing transfers electrons from your hair to the balloon, creating a build-up of charge.'
          },
          {
            question: 'Two objects both have positive charges. What will they do?',
            options: ['Attract each other', 'Repel each other', 'Nothing', 'Create a spark'],
            correct: 1,
            explanation: 'Like charges repel. Both positive charges will push away from each other.'
          },
          {
            question: 'What is voltage?',
            options: ['Flow of electrons', 'Electrical pressure', 'Opposition to current', 'Energy used'],
            correct: 1,
            explanation: 'Voltage is the electrical pressure or "push" that moves electrons through a circuit, measured in Volts (V).'
          },
          {
            question: 'What is current measured in?',
            options: ['Volts', 'Ohms', 'Amperes', 'Watts'],
            correct: 2,
            explanation: 'Current (I) is measured in Amperes (A). It represents the rate of flow of electric charge.'
          },
          {
            question: 'If V = 12V and R = 4Ω, what is I?',
            options: ['3A', '8A', '16A', '48A'],
            correct: 0,
            explanation: 'Using Ohm\'s Law: I = V/R = 12V / 4Ω = 3A'
          },
          {
            question: 'What does resistance measure?',
            options: ['Energy', 'Opposition to current flow', 'Speed of electrons', 'Power'],
            correct: 1,
            explanation: 'Resistance (R) measures the opposition to the flow of electric current, measured in Ohms (Ω).'
          },
          {
            question: 'Which material is a good conductor?',
            options: ['Rubber', 'Plastic', 'Copper', 'Wood'],
            correct: 2,
            explanation: 'Copper is an excellent conductor - it allows electricity to flow easily through it. Rubber, plastic, and wood are insulators.'
          },
          {
            question: 'If V = 24V and I = 3A, what is R?',
            options: ['8Ω', '21Ω', '27Ω', '72Ω'],
            correct: 0,
            explanation: 'Using Ohm\'s Law: R = V/I = 24V / 3A = 8Ω'
          },
          {
            question: 'What is the purpose of an insulator?',
            options: ['Increase current', 'Prevent flow of electricity', 'Store charge', 'Generate voltage'],
            correct: 1,
            explanation: 'Insulators resist the flow of electricity and are used for safety to prevent shocks.'
          },
          {
            question: 'If I = 5A and R = 6Ω, what is V?',
            options: ['1.2V', '11V', '30V', '0.83V'],
            correct: 2,
            explanation: 'Using Ohm\'s Law: V = I × R = 5A × 6Ω = 30V'
          }
        ],
        notes: []
      },
      {
        id: 'physics-practice-2',
        title: 'Physics Practice Quiz 2 - Series & Parallel Circuits',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'In a series circuit, how does current behave?',
            options: ['Divides among components', 'Same everywhere', 'Increases at each bulb', 'Decreases at resistors'],
            correct: 1,
            explanation: 'In series circuits, current is the SAME at all points because there is only one path for electrons to flow.'
          },
          {
            question: 'In a series circuit, how does voltage behave?',
            options: ['Same everywhere', 'Divides among components', 'Only at battery', 'Increases'],
            correct: 1,
            explanation: 'In series circuits, voltage DIVIDES among components: V_total = V₁ + V₂ + V₃'
          },
          {
            question: 'What happens if one bulb breaks in a series circuit?',
            options: ['Others stay on', 'All go out', 'They get brighter', 'Battery explodes'],
            correct: 1,
            explanation: 'In series circuits, if one component breaks, the entire circuit is broken and ALL components stop working.'
          },
          {
            question: 'In a parallel circuit, how does voltage behave?',
            options: ['Divides among branches', 'Same across all branches', 'Only at battery', 'Decreases'],
            correct: 1,
            explanation: 'In parallel circuits, voltage is the SAME across all branches. Each path gets the full battery voltage.'
          },
          {
            question: 'In a parallel circuit, how does current behave?',
            options: ['Same everywhere', 'Divides among branches', 'Only in main wire', 'Zero'],
            correct: 1,
            explanation: 'In parallel circuits, current DIVIDES among branches: I_total = I₁ + I₂ + I₃'
          },
          {
            question: 'What happens if one bulb breaks in a parallel circuit?',
            options: ['All go out', 'Others stay on', 'They get dimmer', 'Battery dies'],
            correct: 1,
            explanation: 'In parallel circuits, if one branch fails, the other branches continue working independently.'
          },
          {
            question: 'Why are home outlets wired in parallel?',
            options: ['Cheaper', 'Each device works independently', 'Uses less power', 'Safer than series'],
            correct: 1,
            explanation: 'Parallel wiring allows each device to work independently and receive full voltage, even if others are turned off.'
          },
          {
            question: 'What happens when you add more bulbs in series?',
            options: ['Get brighter', 'Get dimmer', 'Stay same', 'Voltage increases'],
            correct: 1,
            explanation: 'Adding more bulbs in series increases total resistance, so current decreases and bulbs get dimmer.'
          },
          {
            question: 'In parallel, what does each branch receive?',
            options: ['Different voltages', 'Same voltage', 'No voltage', 'Half voltage'],
            correct: 1,
            explanation: 'Each parallel branch receives the full battery voltage. V₁ = V₂ = V₃ = V_battery'
          },
          {
            question: 'A 12V battery powers 3 identical bulbs in series. Voltage across each bulb?',
            options: ['12V', '6V', '4V', '3V'],
            correct: 2,
            explanation: 'Voltage divides equally in series: 12V ÷ 3 bulbs = 4V per bulb'
          }
        ],
        notes: []
      },
      {
        id: 'physics-practice-3',
        title: 'Physics Practice Quiz 3 - Power & Safety',
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'What is the formula for electrical power?',
            options: ['P = V / I', 'P = V × I', 'P = I / V', 'P = V + I'],
            correct: 1,
            explanation: 'Power = Voltage × Current, or P = V × I, measured in Watts (W).'
          },
          {
            question: 'A device uses 120V and 2A. What is its power?',
            options: ['60W', '122W', '240W', '118W'],
            correct: 2,
            explanation: 'P = V × I = 120V × 2A = 240W'
          },
          {
            question: 'What does a watt measure?',
            options: ['Energy stored', 'Rate of energy use', 'Resistance', 'Charge'],
            correct: 1,
            explanation: 'A watt (W) measures power - the rate at which energy is used or produced per second.'
          },
          {
            question: 'What is the purpose of a circuit breaker?',
            options: ['Increase voltage', 'Stop overload current', 'Store energy', 'Measure power'],
            correct: 1,
            explanation: 'A circuit breaker automatically opens (trips) when too much current flows, preventing fires and damage.'
          },
          {
            question: 'What does the third prong on a plug do?',
            options: ['Increase power', 'Ground connection', 'Extra voltage', 'Nothing'],
            correct: 1,
            explanation: 'The third prong provides a ground connection - a safe path for excess electricity to prevent shocks.'
          },
          {
            question: 'If a 100W bulb runs for 5 hours, how much energy is used?',
            options: ['20 kWh', '0.5 kWh', '500 Wh', '100 kWh'],
            correct: 1,
            explanation: 'Energy = Power × Time = 100W × 5h = 500 Wh = 0.5 kWh'
          },
          {
            question: 'What is a fuse?',
            options: ['Wire that melts if overloaded', 'Energy storage', 'Voltage regulator', 'Power source'],
            correct: 0,
            explanation: 'A fuse contains a thin wire that melts and breaks the circuit if too much current flows, preventing fires.'
          },
          {
            question: 'Why is electricity dangerous to humans?',
            options: ['Makes you glow', 'Can disrupt heart rhythm', 'Makes you magnetic', 'Nothing'],
            correct: 1,
            explanation: 'Electric current can disrupt your heart rhythm. As little as 0.1A through the heart can be fatal.'
          },
          {
            question: 'What should you NEVER do with electricity?',
            options: ['Use near water', 'Turn off switches', 'Use insulators', 'Call electrician'],
            correct: 0,
            explanation: 'Never use electrical devices near water! Water conducts electricity and can cause deadly shocks.'
          },
          {
            question: 'A heater uses 1500W for 4 hours. At $0.10/kWh, what is the cost?',
            options: ['$0.60', '$6.00', '$0.15', '$1.50'],
            correct: 0,
            explanation: 'Energy = 1.5kW × 4h = 6 kWh. Cost = 6 kWh × $0.10 = $0.60'
          }
        ],
        notes: []
      },
      {
        id: 'physics-worksheet-1',
        title: 'Physics Worksheet 1 - Ohm\'s Law Calculations',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'A circuit has a voltage of 24V and a resistance of 6Ω. Calculate the current.',
            options: ['2A', '4A', '18A', '30A'],
            correct: 1,
            explanation: 'Use I = V/R. Current = 24V ÷ 6Ω = 4A. Remember: when voltage goes up or resistance goes down, current increases.'
          },
          {
            question: 'A light bulb draws 0.5A from a 120V outlet. What is its resistance?',
            options: ['60Ω', '120Ω', '240Ω', '119.5Ω'],
            correct: 2,
            explanation: 'Use R = V/I. Resistance = 120V ÷ 0.5A = 240Ω. Higher resistance means less current flows.'
          },
          {
            question: 'A resistor has 3A flowing through it with a resistance of 8Ω. Find the voltage.',
            options: ['2.67V', '11V', '24V', '5V'],
            correct: 2,
            explanation: 'Use V = I × R. Voltage = 3A × 8Ω = 24V. More current or more resistance means higher voltage needed.'
          },
          {
            question: 'If you double the voltage and keep resistance constant, what happens to current?',
            options: ['Stays same', 'Doubles', 'Halves', 'Quadruples'],
            correct: 1,
            explanation: 'Current doubles. I = V/R, so if V doubles and R stays constant, I must double too.'
          },
          {
            question: 'A 9V battery powers a device drawing 0.03A. What is the resistance?',
            options: ['0.27Ω', '3Ω', '27Ω', '300Ω'],
            correct: 3,
            explanation: 'Use R = V/I. Resistance = 9V ÷ 0.03A = 300Ω. Very high resistance means very little current flows.'
          }
        ],
        notes: []
      },
      {
        id: 'physics-worksheet-2',
        title: 'Physics Worksheet 2 - Series & Parallel Circuits',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'Three 4Ω resistors are connected in series to a 12V battery. What is the total resistance?',
            options: ['4Ω', '8Ω', '12Ω', '1.33Ω'],
            correct: 2,
            explanation: 'In series: R_total = R₁ + R₂ + R₃ = 4Ω + 4Ω + 4Ω = 12Ω. Resistances add up in series.'
          },
          {
            question: 'Using the circuit from Q1, what is the total current?',
            options: ['0.5A', '1A', '3A', '4A'],
            correct: 1,
            explanation: 'Use I = V/R. Current = 12V ÷ 12Ω = 1A. This same current flows through all components in series.'
          },
          {
            question: 'Using the circuit from Q1, what is the voltage drop across each resistor?',
            options: ['12V', '6V', '4V', '3V'],
            correct: 2,
            explanation: 'Voltage divides equally: 12V ÷ 3 resistors = 4V per resistor. We can verify: V = I × R = 1A × 4Ω = 4V.'
          },
          {
            question: 'Three identical bulbs are in parallel with a 12V battery. What voltage does each receive?',
            options: ['4V', '6V', '12V', '36V'],
            correct: 2,
            explanation: 'In parallel, each branch receives the FULL battery voltage. All bulbs get 12V regardless of how many there are.'
          },
          {
            question: 'In a parallel circuit, if Branch 1 has 2A and Branch 2 has 3A, what is total current?',
            options: ['1A', '2.5A', '5A', '6A'],
            correct: 2,
            explanation: 'In parallel: I_total = I₁ + I₂ = 2A + 3A = 5A. Currents add up in parallel circuits.'
          }
        ],
        notes: []
      },
      {
        id: 'physics-worksheet-3',
        title: 'Physics Worksheet 3 - Power & Energy Calculations',
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'A device operates at 120V and draws 5A. What is its power consumption?',
            options: ['24W', '115W', '125W', '600W'],
            correct: 3,
            explanation: 'Use P = V × I. Power = 120V × 5A = 600W. This device uses 600 joules of energy per second.'
          },
          {
            question: 'A 60W light bulb runs for 10 hours. How much energy does it use in kWh?',
            options: ['0.06 kWh', '0.6 kWh', '6 kWh', '600 kWh'],
            correct: 1,
            explanation: 'Energy = Power × Time = 60W × 10h = 600 Wh = 0.6 kWh. Remember: 1000 Wh = 1 kWh.'
          },
          {
            question: 'If electricity costs $0.12/kWh, what is the cost to run a 1500W heater for 8 hours?',
            options: ['$0.96', '$1.44', '$14.40', '$9.60'],
            correct: 1,
            explanation: 'Energy = 1.5kW × 8h = 12 kWh. Cost = 12 kWh × $0.12 = $1.44. The heater costs about $1.44 for 8 hours.'
          },
          {
            question: 'A laptop charger outputs 19V and 3A. What is its power output?',
            options: ['6.33W', '16W', '22W', '57W'],
            correct: 3,
            explanation: 'Use P = V × I. Power = 19V × 3A = 57W. The charger delivers 57 watts to charge the laptop.'
          },
          {
            question: 'Which uses more energy: 100W bulb for 5 hours OR 1000W microwave for 30 minutes?',
            options: ['Bulb uses more', 'Same', 'Microwave uses more', 'Cannot determine'],
            correct: 1,
            explanation: 'Bulb: 100W × 5h = 500 Wh. Microwave: 1000W × 0.5h = 500 Wh. They use the SAME energy! Power × time matters, not just power.'
          }
        ],
        notes: []
      },
    ]
  },
  worksheets: {
    id: 'worksheets',
    name: 'Practice Worksheets',
    description: '12 detailed worksheets with 60+ problems and step-by-step answers',
    icon: ClipboardList,
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-600',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=600&fit=crop',
    sections: [
      {
        id: 'bio-worksheets-header',
        title: '🌿 Biology Practice Worksheets',
        isSectionHeader: true,
        headerColor: 'from-emerald-500 to-teal-600',
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop',
        notes: []
      },
      {
        id: 'biology-worksheets',
        title: 'Biology Practice Worksheets',
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Worksheet 1: Biodiversity & H.I.P.P.O.C',
            emoji: '📝',
                        layout: 'bullets',
            points: [
              '1. Define the three types of biodiversity and give an example of each.',
              '2. Create a diagram showing genetic diversity in dogs (3 different breeds).',
              '3. List all letters of H.I.P.P.O.C with full names and one example for each.',
              '4. Choose one H.I.P.P.O.C threat and propose 2 solutions to address it.',
              '5. Explain which H.I.P.P.O.C threat you think is most serious and why.'
            ],
            answers: [
              'Genetic diversity: variation within a species (e.g., different dog breeds) • Species diversity: variety of species in a habitat (e.g., coral reef fish) • Ecosystem diversity: variety of ecosystems in a region (e.g., forests, wetlands, grasslands)',
              'Draw three different dog breeds showing physical differences • Label traits like size, coat color, ear shape • Explain these are same species but different genes',
              'H = Habitat Destruction (deforestation) • I = Invasive Species (zebra mussels) • P = Pollution (oil spills) • P = Population/Human (urban sprawl) • O = Overharvesting (overfishing cod) • C = Climate Change (coral bleaching)',
              'Choose any threat • Example: Habitat Destruction → Solution 1: Protected areas/parks • Solution 2: Reforestation programs',
              'Answers vary • Should explain reasoning • Example: Climate change affects all ecosystems globally • Discuss long-term impacts'
            ]
          },
          {
            subtitle: 'Worksheet 2: Ecosystem Factors & Services',
            emoji: '📝',
                        layout: 'bullets',
            points: [
              '1. List 6 biotic factors and 6 abiotic factors in a forest ecosystem.',
              '2. Explain the difference between sustainable and non-sustainable ecosystems.',
              '3. Name the 4 spheres and give 2 examples for each.',
              '4. Describe 3 interactions between different spheres.',
              '5. Define ecosystem services and list one example from each category (provisioning, regulating, supporting, cultural).',
              '6. Compare natural vs artificial ecosystems with examples.'
            ],
            answers: [
              'Biotic: trees, deer, birds, insects, fungi, bacteria • Abiotic: sunlight, water, soil, air, temperature, rocks',
              'Sustainable: can maintain itself over time, resources regenerate, balanced ecosystem • Non-sustainable: resources depleted faster than replaced, imbalanced, eventually collapses',
              'Biosphere (plants, animals) • Atmosphere (air, oxygen) • Hydrosphere (oceans, rivers) • Lithosphere (rocks, soil)',
              'Example 1: Rain (atmosphere) waters plants (biosphere) • Example 2: Plants (biosphere) add oxygen to air (atmosphere) • Example 3: Rivers (hydrosphere) erode rocks (lithosphere)',
              'Ecosystem services = benefits from nature • Provisioning: food/water • Regulating: climate control • Supporting: nutrient cycling • Cultural: recreation/parks',
              'Natural: self-sustaining, biodiversity, no human maintenance (forest, coral reef) • Artificial: human-made, needs maintenance, limited diversity (farm, aquarium)'
            ]
          },
          {
            subtitle: 'Worksheet 3: Food Chains & Energy',
            emoji: '📝',
                        layout: 'bullets',
            points: [
              '1. Draw an aquatic food chain with 4 trophic levels. Label each level.',
              '2. Draw a terrestrial food chain with 4 trophic levels. Label each level.',
              '3. Add arrows to show energy flow direction in your food chains.',
              '4. Calculate: If producers have 100,000 kcal, how much energy does each level receive?',
              '5. Draw an energy pyramid for the calculation above.',
              '6. Explain where the "missing" 90% of energy goes at each level.',
              '7. Why can\'t food chains be infinitely long? Explain using energy transfer.'
            ],
            answers: [
              'Example: Phytoplankton → Small fish → Medium fish → Shark • Label: Producer → Primary consumer → Secondary consumer → Tertiary consumer',
              'Example: Grass → Grasshopper → Mouse → Snake • Label: Producer → Primary consumer → Secondary consumer → Tertiary consumer',
              'Arrows point from food source to consumer • Shows direction energy flows • Each arrow = "is eaten by"',
              'Producers: 100,000 kcal • Primary consumers: 10,000 kcal (10%) • Secondary consumers: 1,000 kcal (10%) • Tertiary consumers: 100 kcal (10%)',
              'Draw pyramid shape • Bottom largest (producers 100,000) • Each level smaller going up • Top smallest (tertiary 100)',
              '90% lost as heat from movement/metabolism • Used for life processes (breathing, moving) • Released as waste • Only 10% stored in body tissues',
              'Not enough energy left after several levels • By 4-5 levels, too little energy to support organisms • Would need massive producer base for tiny top predator population'
            ]
          },
          {
            subtitle: 'Worksheet 4: Bioaccumulation & Nutrient Cycles',
            emoji: '📝',
                        layout: 'bullets',
            points: [
              '1. Define bioaccumulation and biomagnification. Give an example of each.',
              '2. Draw a simple food chain and show how mercury concentration increases at each level.',
              '3. Draw the carbon cycle. Include: atmosphere, biosphere, lithosphere, hydrosphere.',
              '4. Label these processes on your carbon cycle: photosynthesis, respiration, combustion, decomposition, ocean uptake.',
              '5. Write the equation for photosynthesis (both word and chemical formula).',
              '6. Write the equation for cellular respiration (both word and chemical formula).',
              '7. How do humans affect the carbon cycle? List 3 ways.'
            ],
            answers: [
              'Bioaccumulation: toxin builds up in one organism over time (fish absorbs mercury from water) • Biomagnification: concentration increases up food chain (eagle has more mercury than fish it eats)',
              'Example: Plankton (0.01 ppm) → Small fish (0.1 ppm) → Large fish (1 ppm) → Bird (10 ppm) • Show concentration multiplies at each level',
              'Draw four reservoirs in boxes/circles • Atmosphere (CO₂ gas) • Biosphere (living things) • Lithosphere (fossil fuels, rocks) • Hydrosphere (dissolved CO₂ in water)',
              'Photosynthesis: CO₂ from atmosphere to plants • Respiration: CO₂ from organisms to atmosphere • Combustion: CO₂ from burning to atmosphere • Decomposition: CO₂ from dead matter to atmosphere/soil • Ocean uptake: CO₂ from atmosphere to ocean',
              'Word: Carbon dioxide + Water → Glucose + Oxygen • Chemical: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
              'Word: Glucose + Oxygen → Carbon dioxide + Water + Energy • Chemical: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP',
              'Burning fossil fuels (releases stored carbon) • Deforestation (less CO₂ absorbed) • Agriculture/livestock (releases methane and CO₂)'
            ]
          },
          {
            subtitle: 'Worksheet 5: Nitrogen Cycle & Restoration',
            emoji: '📝',
                        layout: 'bullets',
            points: [
              '1. Draw the nitrogen cycle with reservoirs labeled (atmosphere, soil, organisms, water).',
              '2. Label these processes: nitrogen fixation, nitrification, assimilation, ammonification, denitrification.',
              '3. Explain the role of bacteria in the nitrogen cycle.',
              '4. What are invasive species? List 3 characteristics.',
              '5. Choose one invasive species. State: origin, where it\'s invasive, harm caused, control methods.',
              '6. Define and give examples: reforestation, bioaugmentation, bioremediation.',
              '7. How does climate change affect ecosystems? List 4 impacts.'
            ],
            answers: [
              'Draw cycle showing: Atmosphere (N₂ gas) → Soil (NH₃, NO₃⁻) → Organisms (proteins) → back to atmosphere • Include arrows between reservoirs',
              'Nitrogen fixation: N₂ → NH₃ (atmosphere to soil) • Nitrification: NH₃ → NO₂⁻ → NO₃⁻ (in soil) • Assimilation: NO₃⁻ absorbed by plants • Ammonification: dead matter → NH₄⁺ • Denitrification: NO₃⁻ → N₂ (back to atmosphere)',
              'Bacteria perform most conversions • Rhizobium fixes nitrogen in plant roots • Nitrosomonas/Nitrobacter do nitrification • Decomposers do ammonification • Denitrifying bacteria return N₂ to air',
              'Invasive species: non-native organism that causes harm • Characteristics: rapid reproduction, outcompete natives, lack natural predators, disrupt food chains',
              'Example: Zebra mussels • Origin: Eastern Europe/Russia • Invasive: Great Lakes, North America • Harm: clog water pipes, outcompete native mussels, disrupt food chain • Control: drain/clean boats, chemical treatments',
              'Reforestation: planting trees where cut down (Amazon restoration) • Bioaugmentation: adding bacteria/organisms to break down toxins (oil spill cleanup) • Bioremediation: using organisms to improve soil/water quality (microbes filtering water)',
              'Rising temperatures change habitats • Extreme weather destroys ecosystems • Sea level rise floods coastal areas • Species migration/extinction • Coral bleaching • Changes in precipitation patterns'
            ]
          }
        ]
      },
      {
        id: 'chem-worksheets-header',
        title: '🧪 Chemistry Practice Worksheets',
        isSectionHeader: true,
        headerColor: 'from-violet-500 to-purple-600',
        image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&h=400&fit=crop',
        notes: []
      },
      {
        id: 'chemistry-worksheets',
        title: 'Chemistry Practice Worksheets',
        image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Worksheet 1: Lab Safety & Matter Classification',
            emoji: '📝',
                        layout: 'bullets',
            points: [
              '1. Draw 5 WHMIS symbols and explain what each one means.',
              '2. List 5 important lab safety rules.',
              '3. Create a flow chart showing how matter is classified (pure substances, mixtures, etc.).',
              '4. Classify these: salt water, gold, pizza, air, H₂O, trail mix, brass.',
              '5. For each mixture above, identify if it\'s homogeneous or heterogeneous and explain why.'
            ],
            answers: [
              'Flame (flammable) • Skull/crossbones (poisonous) • Exclamation (irritant) • Test tube on hand (corrosive) • Circle with flame (oxidizer) • Draw symbols and explain hazards',
              'Wear safety goggles • Tie back long hair • No eating/drinking • Report accidents immediately • Know location of safety equipment • Read labels before using chemicals',
              'Matter → Pure substances (elements, compounds) and Mixtures (homogeneous, heterogeneous) • Show branching diagram',
              'Salt water: homogeneous mixture • Gold: element • Pizza: heterogeneous mixture • Air: homogeneous mixture • H₂O: compound • Trail mix: heterogeneous mixture • Brass: homogeneous mixture (alloy)',
              'Salt water: homogeneous, uniform throughout • Pizza: heterogeneous, see different parts • Air: homogeneous, uniform gas mixture • Trail mix: heterogeneous, see nuts/raisins • Brass: homogeneous, metal alloy is uniform'
            ]
          },
          {
            subtitle: 'Worksheet 2: Properties & Density',
            emoji: '📝',
                        layout: 'bullets',
            points: [
              '1. List 4 qualitative physical properties and 4 quantitative physical properties.',
              '2. List 3 chemical properties with examples.',
              '3. Solve: A rock has mass 150g and volume 50cm³. Find density.',
              '4. Solve: An object has density 2.5 g/mL and mass 75g. Find volume.',
              '5. Solve: A liquid has density 0.8 g/mL and volume 200mL. Find mass.',
              '6. Will an object with density 1.5 g/cm³ float or sink in water (1.0 g/cm³)? Explain.',
              '7. Describe how to find the volume of an irregular shaped object using water displacement.'
            ],
            answers: [
              'Qualitative: color, texture, odor, luster • Quantitative: mass, volume, density, melting point',
              'Combustibility: paper burns • Reactivity with acid: metals produce hydrogen • Stability: iron rusts in oxygen',
              'D = m/V = 150g / 50cm³ = 3 g/cm³',
              'V = m/D = 75g / 2.5 g/mL = 30 mL',
              'm = D × V = 0.8 g/mL × 200mL = 160g',
              'Sink • Object density (1.5) > water density (1.0) • Objects denser than liquid sink',
              'Measure initial water level in graduated cylinder • Carefully place object in water • Measure new water level • Volume = final level - initial level'
            ]
          },
          {
            subtitle: 'Worksheet 3: Physical & Chemical Changes',
            emoji: '📝',
                        layout: 'bullets',
            points: [
              '1. Define physical change and chemical change.',
              '2. List the 5 indicators of a chemical change.',
              '3. Classify these as physical or chemical: ice melting, wood burning, cutting paper, rusting nail, dissolving sugar, cooking egg, breaking glass, baking cake.',
              '4. For each chemical change above, state which indicator(s) you would observe.',
              '5. Explain why dissolving salt in water is a physical change, not chemical.',
              '6. Give 2 examples of chemical changes that produce gas.',
              '7. Give 2 examples of chemical changes that produce heat.'
            ],
            answers: [
              'Physical: same substance, different form, usually reversible (ice → water) • Chemical: new substance forms, difficult to reverse (burning wood → ash)',
              'Color change • Gas production/bubbles • Temperature change • Light production • Precipitate forms (solid in liquid)',
              'Physical: ice melting, cutting paper, dissolving sugar, breaking glass • Chemical: wood burning, rusting nail, cooking egg, baking cake',
              'Wood burning: light, heat, gas, color change • Rusting: color change • Cooking egg: color change, temperature • Baking cake: gas (bubbles), color, temperature',
              'Salt molecules separate but don\'t change • Can evaporate water and get salt back • No new substance formed • Reversible process',
              'Vinegar + baking soda → CO₂ bubbles • Antacid tablet in water → gas bubbles',
              'Combustion (burning wood) • Hand warmer packets • Neutralization reactions'
            ]
          },
          {
            subtitle: 'Worksheet 4: Periodic Table',
            emoji: '📝',
                        layout: 'bullets',
            points: [
              '1. Fill in the table: Elements 1-20 with names and symbols.',
              '2. Where are alkali metals located? List 3 properties.',
              '3. Where are halogens located? List 3 properties.',
              '4. Where are noble gases located? Why are they unreactive?',
              '5. List 5 properties of metals and 5 properties of non-metals.',
              '6. What are metalloids? Give 3 examples.',
              '7. Using the periodic table, identify these as metal, non-metal, or metalloid: Fe, Cl, Si, Na, O, B, Cu.'
            ],
            answers: [
              'H, He, Li, Be, B, C, N, O, F, Ne, Na, Mg, Al, Si, P, S, Cl, Ar, K, Ca • Should know names and symbols for all',
              'Group 1, left side • Soft, highly reactive, shiny, low density, form +1 ions, react with water',
              'Group 17, right side before noble gases • Reactive non-metals, diatomic molecules, form salts, gain 1 electron, poisonous/toxic',
              'Group 18, far right column • Unreactive because full valence shell (8 electrons) • Stable, don\'t need to gain/lose electrons',
              'Metals: shiny, conductive, malleable, ductile, lose electrons • Non-metals: dull, insulators, brittle, gain electrons, lower melting points',
              'Metalloids: properties between metals and non-metals, semiconductors • Examples: Silicon (Si), Boron (B), Arsenic (As), Germanium (Ge)',
              'Fe: metal • Cl: non-metal • Si: metalloid • Na: metal • O: non-metal • B: metalloid • Cu: metal'
            ]
          },
          {
            subtitle: 'Worksheet 5: Atomic Structure',
            emoji: '📝',
                        layout: 'bullets',
            points: [
              '1. Draw and label the 4 atomic models: Dalton, Thomson, Rutherford, Bohr.',
              '2. Describe the contribution of each scientist to atomic theory.',
              '3. Complete the table for these atoms: C, O, Na, Mg, Cl (protons, neutrons, electrons).',
              '4. Draw Bohr-Rutherford diagrams for: H, He, C, N, O, Na, Mg.',
              '5. What are isotopes? Draw Bohr diagrams for Carbon-12 and Carbon-14.',
              '6. An atom has 17 protons, 18 neutrons, 17 electrons. What element is it? Draw its Bohr diagram.'
            ],
            answers: [
              'Dalton: solid sphere • Thomson: plum pudding (positive with electrons) • Rutherford: nucleus with orbiting electrons • Bohr: electrons in specific shells',
              'Dalton: atoms are indivisible spheres • Thomson: discovered electrons, positive material • Rutherford: discovered nucleus, mostly empty space • Bohr: electrons in energy levels/shells',
              'C: 6p, 6n, 6e • O: 8p, 8n, 8e • Na: 11p, 12n, 11e • Mg: 12p, 12n, 12e • Cl: 17p, 18n, 17e',
              'H: 1e in shell 1 • He: 2e in shell 1 • C: 2e in shell 1, 4e in shell 2 • N: 2e, 5e • O: 2e, 6e • Na: 2e, 8e, 1e • Mg: 2e, 8e, 2e',
              'Isotopes: same element, different neutrons • C-12: 6p, 6n, 6e • C-14: 6p, 8n, 6e • Both have 2e in shell 1, 4e in shell 2',
              'Chlorine (Cl) • 17 protons = atomic number 17 • Draw: nucleus with 17p 18n, shell 1: 2e, shell 2: 8e, shell 3: 7e'
            ]
          },
          {
            subtitle: 'Worksheet 6: Valence Electrons & Ions',
            emoji: '📝',
                        layout: 'bullets',
            points: [
              '1. What are valence electrons? Why are they important?',
              '2. Draw Lewis dot diagrams for: H, C, N, O, F, Na, Mg, Al, Cl.',
              '3. How many valence electrons does each group have? Groups 1, 2, 13-18.',
              '4. Define cation and anion. Give 2 examples of each.',
              '5. An ion has 11 protons, 12 neutrons, and 10 electrons. What is its charge? What element?',
              '6. Complete the table for these ions: Na⁺, Cl⁻, Mg²⁺, O²⁻ (protons, neutrons, electrons).',
              '7. Why do atoms form ions? Explain using the concept of stability.'
            ],
            answers: [
              'Electrons in outermost shell • Determine how atoms bond and react • Atoms want full outer shell for stability',
              'H: 1 dot • C: 4 dots • N: 5 dots • O: 6 dots • F: 7 dots • Na: 1 dot • Mg: 2 dots • Al: 3 dots • Cl: 7 dots',
              'Group 1: 1 valence e⁻ • Group 2: 2 • Group 13: 3 • Group 14: 4 • Group 15: 5 • Group 16: 6 • Group 17: 7 • Group 18: 8',
              'Cation: positive ion, lost electrons (Na⁺, Ca²⁺) • Anion: negative ion, gained electrons (Cl⁻, O²⁻)',
              'Charge: +1 (11 protons - 10 electrons) • Element: Sodium (Na) because 11 protons',
              'Na⁺: 11p, 12n, 10e • Cl⁻: 17p, 18n, 18e • Mg²⁺: 12p, 12n, 10e • O²⁻: 8p, 8n, 10e',
              'Atoms form ions to achieve stable electron configuration (full outer shell) • Metals lose electrons to empty outer shell • Non-metals gain electrons to fill outer shell • Noble gas configuration is most stable'
            ]
          }
        ]
      }
    ]
  },
  biology: {
    id: 'biology',
    name: 'Biology: Sustainable Ecosystems',
    description: '9 detailed sections covering biodiversity, food chains, and ecosystem restoration',
    icon: Leaf,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop',
    sections: [
      {
        id: 'biology-definitions',
        title: 'Key Biology Definitions',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Biodiversity Terms',
            emoji: '🌿',
            layout: 'cards',
            items: [
              { icon: '🌍', label: 'BIODIVERSITY', value: 'Genetic + Species + Ecosystem', sub: 'Total variety of life in an area across all three levels', color: 'bg-green-50 border-green-300' },
              { icon: '🧬', label: 'GENETIC DIVERSITY', value: 'Within a species', sub: 'Variation of genes in one species (e.g. different dog breeds)', color: 'bg-teal-50 border-teal-300' },
              { icon: '🐠', label: 'SPECIES DIVERSITY', value: 'Within a habitat', sub: 'Variety of different species in one place (e.g. coral reef)', color: 'bg-cyan-50 border-cyan-300' },
              { icon: '🌲', label: 'ECOSYSTEM DIVERSITY', value: 'Within a region', sub: 'Variety of different ecosystems (forests, wetlands, grasslands)', color: 'bg-emerald-50 border-emerald-300' },
              { icon: '👥', label: 'POPULATION', value: 'Same species, one area', sub: 'All members of one species living in the same place', color: 'bg-blue-50 border-blue-300' },
              { icon: '🏡', label: 'HABITAT', value: 'Natural home', sub: 'The environment an organism naturally lives and grows in', color: 'bg-lime-50 border-lime-300' },
            ],
            points: []
          },
          {
            subtitle: 'Ecosystem Terms',
            emoji: '🌍',
            layout: 'cards',
            items: [
              { icon: '🔗', label: 'ECOSYSTEM', value: 'Community + Environment', sub: 'All living things interacting with the non-living environment', color: 'bg-green-50 border-green-300' },
              { icon: '🌱', label: 'BIOTIC FACTOR', value: 'Living component', sub: 'Plants, animals, bacteria, fungi — anything alive', color: 'bg-emerald-50 border-emerald-300' },
              { icon: '☀️', label: 'ABIOTIC FACTOR', value: 'Non-living component', sub: 'Sunlight, water, soil, temperature, pH levels', color: 'bg-yellow-50 border-yellow-300' },
              { icon: '♻️', label: 'SUSTAINABLE ECOSYSTEM', value: 'Self-maintaining', sub: 'Resources regenerate as fast as they are used — balanced', color: 'bg-teal-50 border-teal-300' },
              { icon: '🌎', label: 'BIOSPHERE', value: 'All life on Earth', sub: 'The total of all ecosystems — every living thing on the planet', color: 'bg-blue-50 border-blue-300' },
              { icon: '🪨', label: 'LITHOSPHERE', value: "Earth's crust", sub: 'Rocks, soil, and minerals that form the land surface', color: 'bg-stone-50 border-stone-300' },
            ],
            points: []
          },
          {
            subtitle: 'Organism Roles in the Food Chain',
            emoji: '🔗',
            layout: 'rules',
            items: [
              { icon: '🌿', label: 'PRODUCER — Makes its own food via photosynthesis', sub: 'Plants, algae, phytoplankton. The base of every food chain', color: 'bg-green-50 border-green-400' },
              { icon: '🐇', label: 'PRIMARY CONSUMER — Herbivore that eats producers', sub: 'Rabbit, deer, grasshopper. Trophic level 2', color: 'bg-lime-50 border-lime-400' },
              { icon: '🦊', label: 'SECONDARY CONSUMER — Eats primary consumers', sub: 'Snake, fox, frog. Trophic level 3', color: 'bg-yellow-50 border-yellow-400' },
              { icon: '🦅', label: 'TERTIARY CONSUMER — Top predator', sub: 'Eagle, shark, orca. Trophic level 4. Gets the least energy', color: 'bg-orange-50 border-orange-400' },
              { icon: '🍄', label: 'DECOMPOSER — Breaks down dead matter', sub: 'Bacteria, fungi, worms. Recycle nutrients back into soil', color: 'bg-brown-50 border-amber-400' },
            ],
            points: []
          },
          {
            subtitle: 'Energy Flow Terms',
            emoji: '⚡',
            layout: 'cards',
            items: [
              { icon: '⛓️', label: 'FOOD CHAIN', value: 'Linear sequence', sub: 'Shows who eats whom in a straight line', color: 'bg-green-50 border-green-300' },
              { icon: '🕸️', label: 'FOOD WEB', value: 'Interconnected chains', sub: 'Many food chains linked together — more realistic', color: 'bg-teal-50 border-teal-300' },
              { icon: '🔟', label: '10% RULE', value: 'Energy transfer', sub: 'Only 10% of energy passes to next level — 90% lost as heat', color: 'bg-amber-50 border-amber-300' },
              { icon: '🔺', label: 'ENERGY PYRAMID', value: 'Decreasing energy', sub: 'Diagram showing energy shrinks at each trophic level', color: 'bg-orange-50 border-orange-300' },
              { icon: '🐟', label: 'BIOACCUMULATION', value: 'One organism', sub: 'Toxin builds up inside a single organism over its lifetime', color: 'bg-blue-50 border-blue-300' },
              { icon: '🦅', label: 'BIOMAGNIFICATION', value: 'Up the food chain', sub: 'Toxin concentration multiplies at each trophic level', color: 'bg-red-50 border-red-300' },
            ],
            points: []
          },
          {
            subtitle: 'Species Relationships (Symbiosis)',
            emoji: '🤝',
            layout: 'rules',
            items: [
              { icon: '🐝', label: 'MUTUALISM — Both species benefit', sub: 'Bee pollinates flower; flower gives bee nectar. Win-win', color: 'bg-green-50 border-green-400' },
              { icon: '🐦', label: 'COMMENSALISM — One benefits, other unaffected', sub: 'Bird nests in a tree. Tree is not helped or harmed', color: 'bg-blue-50 border-blue-400' },
              { icon: '🦟', label: 'PARASITISM — One benefits, other is harmed', sub: 'Tick on a dog. Tick feeds; dog loses blood and may get sick', color: 'bg-red-50 border-red-400' },
              { icon: '🐺', label: 'PREDATION — One hunts and eats the other', sub: 'Wolf eats rabbit. Controls population size naturally', color: 'bg-orange-50 border-orange-400' },
            ],
            points: []
          },
          {
            subtitle: 'Photosynthesis & Respiration',
            emoji: '🌱',
            layout: 'formula',
            items: [
              { formula: '6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂', meaning: 'PHOTOSYNTHESIS — Plants convert carbon dioxide + water + light into glucose + oxygen', example: 'Happens in chloroplasts. Only plants, algae, and some bacteria', color: 'border-green-400', headerBg: 'bg-green-600' },
              { formula: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP', meaning: 'CELLULAR RESPIRATION — Organisms break down glucose to release energy (ATP)', example: 'Happens in mitochondria. ALL living organisms do this', color: 'border-blue-400', headerBg: 'bg-blue-600' },
            ],
            points: []
          },
          {
            subtitle: 'Nutrient Cycles — Key Terms',
            emoji: '♻️',
            layout: 'rules',
            items: [
              { icon: '💨', label: 'CARBON CYCLE — Carbon moves through atmosphere, organisms, soil, and water', sub: 'Photosynthesis removes CO₂; respiration and combustion release it', color: 'bg-gray-50 border-gray-400' },
              { icon: '🌱', label: 'NITROGEN CYCLE — Nitrogen moves between atmosphere and soil', sub: '78% of air is N₂ — but plants cannot use it without bacteria', color: 'bg-blue-50 border-blue-400' },
              { icon: '⚡', label: 'NITROGEN FIXATION — N₂ gas converted to ammonia (NH₃)', sub: 'Done by Rhizobium bacteria in root nodules OR lightning', color: 'bg-yellow-50 border-yellow-400' },
              { icon: '🔬', label: 'NITRIFICATION → DENITRIFICATION — Nitrate cycle', sub: 'Nitrification: NH₃ → NO₂⁻ → NO₃⁻ (usable). Denitrification: NO₃⁻ → N₂ (returns to air)', color: 'bg-green-50 border-green-400' },
            ],
            points: []
          },
          {
            subtitle: 'Threats to Biodiversity (H.I.P.P.O.C)',
            emoji: '⚠️',
            layout: 'rules',
            items: [
              { icon: '🏗️', label: 'H — Habitat Destruction', sub: 'Deforestation, urban sprawl. Removes living spaces — #1 threat', color: 'bg-red-50 border-red-400' },
              { icon: '🦟', label: 'I — Invasive Species', sub: 'Non-native species out-compete locals (zebra mussels in Great Lakes)', color: 'bg-orange-50 border-orange-400' },
              { icon: '🏭', label: 'P — Pollution', sub: 'Oil spills, chemicals, plastics, noise all kill or displace organisms', color: 'bg-yellow-50 border-yellow-400' },
              { icon: '👥', label: 'P — Population (Human Growth)', sub: 'More people = more land used, more resources consumed', color: 'bg-purple-50 border-purple-400' },
              { icon: '🎣', label: 'O — Overharvesting', sub: 'Fishing/hunting faster than species can reproduce (Atlantic cod collapse)', color: 'bg-blue-50 border-blue-400' },
              { icon: '🌡️', label: 'C — Climate Change', sub: 'Warming seas → coral bleaching. Shifting seasons → habitat loss', color: 'bg-green-50 border-green-400' },
            ],
            points: []
          },
          {
            subtitle: 'Conservation & Restoration',
            emoji: '🌲',
            layout: 'cards',
            items: [
              { icon: '🌳', label: 'REFORESTATION', value: 'Plant trees back', sub: 'Prevents erosion, restores habitat, stores carbon', color: 'bg-green-50 border-green-300' },
              { icon: '🦠', label: 'BIOREMEDIATION', value: 'Microbes clean up', sub: 'Bacteria/fungi break down toxins naturally (used in oil spill cleanup)', color: 'bg-teal-50 border-teal-300' },
              { icon: '➕', label: 'BIOAUGMENTATION', value: 'Add organisms', sub: 'Introduce specific bacteria/fungi to neutralize pollution faster', color: 'bg-cyan-50 border-cyan-300' },
              { icon: '🔒', label: 'CONSERVATION', value: 'Protect & preserve', sub: 'National parks, protected areas, wildlife reserves', color: 'bg-blue-50 border-blue-300' },
              { icon: '🔄', label: 'SUSTAINABILITY', value: "Don't use faster than nature renews", sub: 'Meet current needs without harming future generations', color: 'bg-emerald-50 border-emerald-300' },
              { icon: '🍂', label: 'BIODEGRADABLE', value: 'Breaks down naturally', sub: 'Decomposers can break it down — unlike plastic', color: 'bg-lime-50 border-lime-300' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'biodiversity',
        title: 'Three Types of Biodiversity',
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Three Levels at a Glance',
            emoji: '🌿',
            layout: 'compare',
            items: [
              {
                label: '🧬 GENETIC',
                color: 'bg-purple-50 border-purple-400',
                rows: ['Variation WITHIN a species', 'Same species, different genes', 'Example: dog breeds', 'Why: helps species adapt']
              },
              {
                label: '🐠 SPECIES',
                color: 'bg-cyan-50 border-cyan-400',
                rows: ['Variety of SPECIES in a habitat', 'Different organisms coexisting', 'Example: coral reef fish', 'Why: stability of ecosystem']
              },
              'Ecosystem diversity = variety of entire ecosystem types (forests, wetlands, grasslands) in a region.'
            ],
            points: []
          },
          {
            subtitle: 'Why Biodiversity Matters',
            emoji: '❓',
            layout: 'rules',
            items: [
              { icon: '💪', label: 'Genetic diversity = resilience', sub: 'More genetic variation = better chance species survives disease or climate shift', color: 'bg-purple-50 border-purple-400' },
              { icon: '⚖️', label: 'Species diversity = stable ecosystems', sub: 'More species = more ways to fill each role. Losing one species hurts fewer others', color: 'bg-cyan-50 border-cyan-400' },
              { icon: '🌍', label: 'Ecosystem diversity = services for all life', sub: 'Different ecosystems provide clean air, water filtration, food, climate control', color: 'bg-green-50 border-green-400' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'hippoc',
        title: 'H.I.P.P.O.C. — Threats to Biodiversity',
        image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'All Six Threats',
            emoji: '⚠️',
            layout: 'rules',
            items: [
              { icon: '🏗️', label: 'H — Habitat Destruction', sub: 'Deforestation, mining, urban sprawl remove living spaces. The #1 cause of extinction', color: 'bg-red-50 border-red-500' },
              { icon: '🦟', label: 'I — Invasive Species', sub: 'Non-native species with no natural predators outcompete locals. Zebra mussels destroyed Great Lakes food webs', color: 'bg-orange-50 border-orange-500' },
              { icon: '🏭', label: 'P — Pollution', sub: 'Oil spills, pesticides, plastic, noise and light pollution all kill or displace wildlife', color: 'bg-yellow-50 border-yellow-500' },
              { icon: '👥', label: 'P — Population (Human Growth)', sub: 'More people = more land cleared, more water used, more waste produced', color: 'bg-purple-50 border-purple-500' },
              { icon: '🎣', label: 'O — Overharvesting', sub: 'Fishing/hunting/logging faster than species can reproduce. Atlantic cod collapsed in 1992', color: 'bg-blue-50 border-blue-500' },
              { icon: '🌡️', label: 'C — Climate Change', sub: 'Warming oceans bleach coral. Shifting seasons disrupt migration and breeding cycles', color: 'bg-teal-50 border-teal-500' },
            ],
            points: []
          },
          {
            subtitle: 'Exam Tip — Solutions for Each Threat',
            emoji: '🎯',
            layout: 'cards',
            items: [
              { icon: '🏗️', label: 'Habitat Destruction', value: 'Solution:', sub: 'Protected areas, reforestation, sustainable forestry certification', color: 'bg-red-50 border-red-200' },
              { icon: '🦟', label: 'Invasive Species', value: 'Solution:', sub: 'Early detection, biological control, preventing new introductions', color: 'bg-orange-50 border-orange-200' },
              { icon: '🏭', label: 'Pollution', value: 'Solution:', sub: 'Stricter regulations, bioremediation, reduce plastic use', color: 'bg-yellow-50 border-yellow-200' },
              { icon: '🎣', label: 'Overharvesting', value: 'Solution:', sub: 'Fishing quotas, seasonal bans, protected marine areas', color: 'bg-blue-50 border-blue-200' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'ecology-interactions',
        title: 'Ecological Interactions & Population Dynamics',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'factors',
        title: 'Biotic vs Abiotic Factors',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Biotic vs Abiotic — Side by Side',
            emoji: '🌍',
            layout: 'compare',
            items: [
              {
                label: '🌱 BIOTIC (Living)',
                color: 'bg-green-50 border-green-400',
                rows: ['Plants, animals, fungi', 'Bacteria and microorganisms', 'Decaying/dead matter still counts!', 'Affect each other through eating, competing, symbiosis']
              },
              {
                label: '☀️ ABIOTIC (Non-living)',
                color: 'bg-yellow-50 border-yellow-400',
                rows: ['Sunlight, temperature', 'Water, soil, air', 'pH levels, salinity', 'Physical & chemical environment']
              },
              'Both biotic and abiotic factors TOGETHER define what can live in a habitat.'
            ],
            points: []
          },
          {
            subtitle: 'The Four Spheres',
            emoji: '🌐',
            layout: 'cards',
            items: [
              { icon: '🌿', label: 'BIOSPHERE', value: 'All living things', sub: 'Every organism on Earth — the living layer of the planet', color: 'bg-green-50 border-green-300' },
              { icon: '💨', label: 'ATMOSPHERE', value: 'All gases', sub: 'Nitrogen (78%), oxygen (21%), CO₂ and others', color: 'bg-sky-50 border-sky-300' },
              { icon: '💧', label: 'HYDROSPHERE', value: 'All water', sub: 'Oceans, rivers, lakes, groundwater, ice caps', color: 'bg-blue-50 border-blue-300' },
              { icon: '🪨', label: 'LITHOSPHERE', value: "Earth's crust", sub: 'Rocks, soil, minerals — what the land is made of', color: 'bg-stone-50 border-stone-300' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'biomes-climates',
        title: 'World Biomes & Climate Zones',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'food-chains',
        title: 'Food Chains & Energy Transfer',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Food Chain — How Energy Flows',
            emoji: '⛓️',
            layout: 'steps',
            items: [
              { label: 'PRODUCERS — Capture energy from the Sun', sub: 'Plants, algae, phytoplankton. Convert sunlight → glucose via photosynthesis' },
              { label: 'PRIMARY CONSUMERS — Eat producers', sub: 'Herbivores (grasshopper, deer, rabbit). Get 10% of producer energy' },
              { label: 'SECONDARY CONSUMERS — Eat primary consumers', sub: 'Omnivores/carnivores (frog, snake, fox). Get 10% of primary consumer energy' },
              { label: 'TERTIARY CONSUMERS — Top predators', sub: 'Eagle, shark, orca. Get only 0.1% of original producer energy!' },
            ],
            points: [],
            diagram: 'food-chain'
          },
          {
            subtitle: 'The 10% Rule — Why Chains Are Short',
            emoji: '🔟',
            layout: 'formula',
            items: [
              { formula: 'Energy at next level = Current level × 10%', meaning: 'Only 10% transfers up — 90% lost as heat, movement, waste, and uneaten parts', example: '100,000 kcal producers → 10,000 primary → 1,000 secondary → 100 tertiary', color: 'border-amber-400', headerBg: 'bg-amber-500' },
            ],
            points: [],
            diagram: 'energy-pyramid'
          },
          {
            subtitle: 'Terrestrial vs Aquatic Chains',
            emoji: '🌊',
            layout: 'compare',
            items: [
              {
                label: '🌾 TERRESTRIAL',
                color: 'bg-green-50 border-green-400',
                rows: ['Grass → Grasshopper', '→ Mouse → Snake → Eagle', 'Producers: land plants', 'Sunlight hits leaves directly']
              },
              {
                label: '🌊 AQUATIC',
                color: 'bg-blue-50 border-blue-400',
                rows: ['Phytoplankton → Zooplankton', '→ Small fish → Large fish → Shark', 'Producers: microscopic algae', 'Same 10% rule applies']
              },
              'Key rule: Arrows in food chains point FROM the food source TO the consumer (show energy flow direction).'
            ],
            points: [],
            diagram: 'aquatic-food-chain'
          },
          {
            subtitle: 'Key Facts Examiners Love',
            emoji: '🎯',
            layout: 'rules',
            items: [
              { icon: '🍄', label: 'Decomposers are NOT shown in the energy pyramid', sub: 'They get energy from ALL levels — breaking down dead matter at every stage', color: 'bg-amber-50 border-amber-400' },
              { icon: '🌿', label: 'Ecosystems can survive without consumers — NOT without producers', sub: 'Remove all plants and the whole system collapses', color: 'bg-green-50 border-green-400' },
              { icon: '👤', label: 'Humans can appear at any trophic level', sub: 'We eat plants (level 2) AND meat (level 3+) — we are omnivores', color: 'bg-blue-50 border-blue-400' },
              { icon: '📏', label: 'Why are food chains limited to 4-5 levels?', sub: 'Not enough energy left after 5 steps to support another organism', color: 'bg-red-50 border-red-400' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'food-webs-advanced',
        title: 'Complex Food Webs & Trophic Cascades',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'bioaccumulation',
        title: 'Bioaccumulation & Biomagnification',
        image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Bioaccumulation vs Biomagnification',
            emoji: '☠️',
            layout: 'compare',
            items: [
              {
                label: '🐟 BIOACCUMULATION',
                color: 'bg-blue-50 border-blue-400',
                rows: ['Toxin builds up in ONE organism', 'Absorbs more than it excretes', 'Example: Fish absorbs mercury from water over its lifetime', 'Happens at EVERY level']
              },
              {
                label: '🦅 BIOMAGNIFICATION',
                color: 'bg-red-50 border-red-400',
                rows: ['Concentration INCREASES up chain', 'Top predators hit hardest', 'Example: DDT killed eagle eggs', 'Plankton: 0.01ppm → Eagle: 10+ ppm']
              },
              'Real example: Mercury → plankton (absorb from water) → small fish (eat many plankton) → large fish → humans. Swordfish/tuna have HIGH mercury.'
            ],
            points: []
          },
          {
            subtitle: 'Why Top Predators Are Most Affected',
            emoji: '🔢',
            layout: 'steps',
            items: [
              { label: 'Plankton absorb tiny amounts of toxin from water', sub: 'e.g. 0.01 ppm mercury each' },
              { label: 'Small fish eat thousands of plankton', sub: 'Toxin from all that plankton concentrates → 0.1 ppm' },
              { label: 'Large fish eat many small fish', sub: 'Concentration keeps multiplying → 1 ppm' },
              { label: 'Top predator eats many large fish across years', sub: 'Can reach 10-25 ppm — enough to cause nerve damage and reproductive failure' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'conservation-strategies',
        title: 'Conservation Biology & Management Strategies',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'restoration',
        title: 'Restoration Techniques',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Three Restoration Methods',
            emoji: '🔧',
            layout: 'rules',
            items: [
              { icon: '🌲', label: 'REFORESTATION — Plant trees where they were removed', sub: 'Prevents soil erosion, restores habitat, captures CO₂. Provides food, shelter, shade', color: 'bg-green-50 border-green-400' },
              { icon: '🌿', label: 'BIOREMEDIATION — Use living organisms to clean up pollution', sub: 'Bacteria and fungi naturally break down toxins. Example: microbes used in 2010 BP Gulf oil spill', color: 'bg-teal-50 border-teal-400' },
              { icon: '🦠', label: 'BIOAUGMENTATION — Add specific organisms to speed up cleanup', sub: 'Introduce bacteria/fungi that target specific toxins. Faster than natural bioremediation', color: 'bg-blue-50 border-blue-400' },
            ],
            points: []
          },
          {
            subtitle: 'Bioremediation vs Bioaugmentation',
            emoji: '🔬',
            layout: 'compare',
            items: [
              {
                label: '🌿 BIOREMEDIATION',
                color: 'bg-teal-50 border-teal-400',
                rows: ['Uses organisms ALREADY there', 'Slower but natural', 'Less intervention needed', 'Example: leaving marsh plants to filter runoff']
              },
              {
                label: '🦠 BIOAUGMENTATION',
                color: 'bg-blue-50 border-blue-400',
                rows: ['ADDS new organisms to site', 'Faster for severe pollution', 'More controlled', 'Example: adding Pseudomonas bacteria to oil spill']
              },
              'Both are preferred over chemical cleanup — they work with nature, not against it.'
            ],
            points: []
          }
        ]
      },
      {
        id: 'carbon-cycle',
        title: 'Carbon Cycle',
        image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Carbon Reservoirs',
            emoji: '💨',
            layout: 'cards',
            items: [
              { icon: '💨', label: 'ATMOSPHERE', value: 'CO₂ gas', sub: 'Small reservoir but drives climate. Increasing from human activity', color: 'bg-sky-50 border-sky-300' },
              { icon: '🌿', label: 'BIOSPHERE', value: 'Living organisms', sub: 'Carbon in all living things — plants store large amounts', color: 'bg-green-50 border-green-300' },
              { icon: '🛢️', label: 'LITHOSPHERE', value: 'Fossil fuels + rock', sub: 'Coal, oil, natural gas — carbon locked away for millions of years', color: 'bg-stone-50 border-stone-300' },
              { icon: '🌊', label: 'HYDROSPHERE', value: 'Dissolved CO₂', sub: 'Oceans absorb ~30% of CO₂ released by humans', color: 'bg-blue-50 border-blue-300' },
            ],
            points: []
          },
          {
            subtitle: 'Processes That Move Carbon',
            emoji: '🔄',
            layout: 'rules',
            items: [
              { icon: '🌱', label: 'PHOTOSYNTHESIS — CO₂ out of atmosphere into plants', sub: '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Carbon stored as glucose', color: 'bg-green-50 border-green-400' },
              { icon: '💨', label: 'RESPIRATION — CO₂ released back to atmosphere', sub: 'All living things do this continuously, day and night', color: 'bg-gray-50 border-gray-400' },
              { icon: '🔥', label: 'COMBUSTION — Carbon from fossil fuels → CO₂ fast', sub: 'Burning coal/oil/gas releases carbon locked away for 300+ million years', color: 'bg-red-50 border-red-400' },
              { icon: '🍂', label: 'DECOMPOSITION — Dead matter → CO₂ and nutrients', sub: 'Bacteria and fungi break down organisms, releasing stored carbon', color: 'bg-amber-50 border-amber-400' },
            ],
            points: [],
            diagram: 'carbon-cycle'
          },
          {
            subtitle: 'Photosynthesis vs Respiration',
            emoji: '⚖️',
            layout: 'formula',
            items: [
              { formula: '6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂', meaning: 'PHOTOSYNTHESIS — Takes CO₂ IN, releases O₂ OUT. Only in plants/algae in LIGHT', example: 'Chloroplasts. Requires chlorophyll (green pigment)', color: 'border-green-400', headerBg: 'bg-green-600' },
              { formula: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP energy', meaning: 'RESPIRATION — Uses O₂, releases CO₂. ALL organisms, ALL the time', example: 'Mitochondria. Plants respire even in the dark', color: 'border-blue-400', headerBg: 'bg-blue-600' },
            ],
            points: [],
            diagram: 'photosynthesis'
          }
        ]
      },
      {
        id: 'nitrogen-cycle',
        title: 'Nitrogen Cycle',
        image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Why Nitrogen Matters',
            emoji: '🔬',
            layout: 'rules',
            items: [
              { icon: '🧬', label: '78% of air is nitrogen (N₂) — but plants CANNOT use it directly', sub: 'N₂ gas has a triple bond too strong for plants to break on their own', color: 'bg-blue-50 border-blue-400' },
              { icon: '💪', label: 'Nitrogen is essential for proteins and DNA', sub: "Every living cell needs nitrogen — it's the backbone of amino acids", color: 'bg-green-50 border-green-400' },
              { icon: '🦠', label: 'Bacteria do the heavy lifting in the nitrogen cycle', sub: 'Different bacteria fix, nitrify, and denitrify nitrogen at each stage', color: 'bg-purple-50 border-purple-400' },
            ],
            points: []
          },
          {
            subtitle: 'The 4 Stages of the Nitrogen Cycle',
            emoji: '♻️',
            layout: 'steps',
            items: [
              { label: 'NITROGEN FIXATION — N₂ → NH₃ (ammonia)', sub: 'Rhizobium bacteria in root nodules (legumes) OR lightning. Makes nitrogen usable for plants' },
              { label: 'NITRIFICATION — NH₃ → NO₂⁻ → NO₃⁻ (nitrate)', sub: 'Nitrosomonas bacteria: ammonia → nitrite. Nitrobacter: nitrite → nitrate. Now plants can absorb it' },
              { label: 'ASSIMILATION — Plants absorb nitrate from soil', sub: 'Roots take up NO₃⁻ and use nitrogen to build proteins and DNA. Animals eat plants to get nitrogen' },
              { label: 'AMMONIFICATION → DENITRIFICATION — Back to N₂', sub: 'Decomposers release NH₃ from dead matter. Denitrifying bacteria convert NO₃⁻ → N₂ gas, returning it to atmosphere' },
            ],
            points: [],
            diagram: 'nitrogen-cycle'
          }
        ]
      },
      {
        id: 'nitrogen-advanced',
        title: 'Advanced Nitrogen Cycle & Applications',
        image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'ecology-interactions',
        title: 'Ecological Interactions & Population Dynamics',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'biomes-climates',
        title: 'World Biomes & Climate Zones',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'conservation-strategies',
        title: 'Conservation Biology & Management Strategies',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'food-webs-advanced',
        title: 'Complex Food Webs & Trophic Cascades',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      }
    ]
  },
  chemistry: {
    id: 'chemistry',
    name: 'Chemistry: Matter & Changes',
    description: '10 comprehensive sections on atoms, periodic table, and chemical properties',
    icon: Beaker,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop',
    sections: [
      {
        id: 'chemistry-definitions',
        title: 'Key Chemistry Definitions',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Matter & Classification',
            emoji: '🧪',
            layout: 'rules',
            items: [
              { icon: '⚛️', label: 'ELEMENT — One type of atom only', sub: 'Cannot be broken down chemically. Examples: Gold (Au), Oxygen (O₂), Carbon (C)', color: 'bg-yellow-50 border-yellow-400' },
              { icon: '🔗', label: 'COMPOUND — Two or more elements BONDED together', sub: 'New substance with new properties. H₂O, CO₂, NaCl — cannot be separated physically', color: 'bg-blue-50 border-blue-400' },
              { icon: '🥗', label: 'MIXTURE — Substances COMBINED but not bonded', sub: 'Retains individual properties. Can be separated physically (filtration, evaporation)', color: 'bg-green-50 border-green-400' },
              { icon: '🥤', label: 'HOMOGENEOUS — Uniform throughout (solution)', sub: 'Cannot see individual parts. Salt water, air, alloys (brass)', color: 'bg-cyan-50 border-cyan-400' },
              { icon: '🥣', label: 'HETEROGENEOUS — Can see different parts', sub: 'Sand and water (suspension), trail mix (mechanical mixture)', color: 'bg-orange-50 border-orange-400' },
            ],
            points: []
          },
          {
            subtitle: 'Properties of Matter',
            emoji: '⚖️',
            layout: 'compare',
            items: [
              {
                label: '👁️ PHYSICAL PROPERTIES',
                color: 'bg-blue-50 border-blue-400',
                rows: ['Observable WITHOUT changing substance', 'Qualitative: color, odor, texture, luster', 'Quantitative: mass, density, boiling point', 'Melting point, solubility, malleability']
              },
              {
                label: '⚗️ CHEMICAL PROPERTIES',
                color: 'bg-orange-50 border-orange-400',
                rows: ['How substance REACTS with others', 'Flammability (ability to burn)', 'Reactivity with acids/water', 'Stability, oxidation (rusting)']
              },
              'Density formula: D = m/V  |  Units: g/cm³ or g/mL  |  1 mL = 1 cm³'
            ],
            points: []
          },
          {
            subtitle: 'Atomic Structure',
            emoji: '⚛️',
            layout: 'cards',
            items: [
              { icon: '🔴', label: 'PROTON', value: 'Charge: +1', sub: 'In the nucleus. Atomic number = number of protons = identity of element', color: 'bg-red-50 border-red-300' },
              { icon: '⚫', label: 'NEUTRON', value: 'Charge: 0', sub: 'In the nucleus. Neutrons = Mass number − Atomic number', color: 'bg-gray-50 border-gray-200' },
              { icon: '🔵', label: 'ELECTRON', value: 'Charge: −1', sub: 'In shells outside nucleus. Negligible mass. Determine bonding behavior', color: 'bg-blue-50 border-blue-300' },
              { icon: '🔢', label: 'ATOMIC NUMBER', value: '= # protons', sub: 'Never changes — defines which element it is. Equal to electrons in neutral atom', color: 'bg-purple-50 border-purple-300' },
              { icon: '⚖️', label: 'MASS NUMBER', value: 'Protons + Neutrons', sub: 'Rounded from atomic mass on periodic table', color: 'bg-indigo-50 border-indigo-300' },
              { icon: '🔄', label: 'ISOTOPE', value: 'Same element, different neutrons', sub: 'Same protons, different mass. Carbon-12 vs Carbon-14', color: 'bg-teal-50 border-teal-300' },
            ],
            points: []
          },
          {
            subtitle: 'Ions & Bonding',
            emoji: '⚡',
            layout: 'rules',
            items: [
              { icon: '➕', label: 'CATION — Positive ion (lost electrons)', sub: 'Metals lose electrons. Na⁺, Ca²⁺, Al³⁺. More protons than electrons', color: 'bg-red-50 border-red-400' },
              { icon: '➖', label: 'ANION — Negative ion (gained electrons)', sub: 'Non-metals gain electrons. Cl⁻, O²⁻, N³⁻. More electrons than protons', color: 'bg-blue-50 border-blue-400' },
              { icon: '🎯', label: 'OCTET RULE — Atoms want 8 valence electrons', sub: 'Stable configuration = full outer shell. Noble gases already have it — do not react', color: 'bg-green-50 border-green-400' },
              { icon: '🔗', label: 'IONIC BOND — Electron TRANSFER between atoms', sub: 'Metal gives electron to non-metal. Forms ions with opposite charges that attract', color: 'bg-yellow-50 border-yellow-400' },
            ],
            points: []
          },
          {
            subtitle: 'Periodic Table Groups',
            emoji: '📊',
            layout: 'cards',
            items: [
              { icon: '1️⃣', label: 'ALKALI METALS (Group 1)', value: '1 valence e⁻', sub: 'Soft, highly reactive, form +1 ions. Li, Na, K. Never found pure in nature', color: 'bg-red-50 border-red-300' },
              { icon: '2️⃣', label: 'ALKALINE EARTH (Group 2)', value: '2 valence e⁻', sub: 'Form +2 ions. Mg, Ca, Ba. Less reactive than Group 1', color: 'bg-orange-50 border-orange-300' },
              { icon: '7️⃣', label: 'HALOGENS (Group 17)', value: '7 valence e⁻', sub: 'Very reactive non-metals, form −1 ions. F, Cl, Br, I. Form diatomic molecules', color: 'bg-green-50 border-green-300' },
              { icon: '8️⃣', label: 'NOBLE GASES (Group 18)', value: '8 valence e⁻', sub: 'Full outer shell — almost completely unreactive. He, Ne, Ar, Kr', color: 'bg-purple-50 border-purple-300' },
              { icon: '🔩', label: 'METALS (left side)', value: 'Lose electrons', sub: 'Shiny, conductive, malleable, ductile. Most elements are metals', color: 'bg-yellow-50 border-yellow-300' },
              { icon: '🔒', label: 'NON-METALS (right side)', value: 'Gain electrons', sub: 'Dull, poor conductors, brittle. Oxygen, sulfur, chlorine', color: 'bg-blue-50 border-blue-300' },
            ],
            points: []
          },
          {
            subtitle: 'Changes in Matter',
            emoji: '🔬',
            layout: 'compare',
            items: [
              {
                label: '❄️ PHYSICAL CHANGE',
                color: 'bg-blue-50 border-blue-400',
                rows: ['Same substance — just different form', 'Usually REVERSIBLE', 'No new substance formed', 'Ice melting, cutting paper, dissolving sugar']
              },
              {
                label: '🔥 CHEMICAL CHANGE',
                color: 'bg-red-50 border-red-400',
                rows: ['NEW substance(s) formed', 'Usually NOT reversible', 'Signs: color, gas, temp change, light, precipitate', 'Burning wood, rusting iron, cooking egg']
              },
              'Key rule: If a new substance is formed with different properties → chemical change.'
            ],
            points: []
          },
          {
            subtitle: 'Key Formulas',
            emoji: '📐',
            layout: 'formula',
            items: [
              { formula: 'D = m ÷ V', meaning: 'Density = mass divided by volume', example: 'm=24g, V=8cm³ → D=3 g/cm³', color: 'border-indigo-300', headerBg: 'bg-indigo-600' },
              { formula: 'Neutrons = Mass number − Atomic number', meaning: 'Find neutrons from periodic table values', example: 'Carbon: mass=12, atomic=6 → 6 neutrons', color: 'border-blue-400', headerBg: 'bg-blue-600' },
              { formula: 'Charge = Protons − Electrons', meaning: 'Positive if more protons, negative if more electrons', example: 'Na⁺: 11 protons, 10 electrons → +1 charge', color: 'border-green-400', headerBg: 'bg-green-600' },
            ],
            points: []
          },
          {
            subtitle: 'Separation Methods',
            emoji: '🔧',
            layout: 'rules',
            items: [
              { icon: '🫙', label: 'FILTRATION — Separates solid from liquid', sub: 'Filter paper traps solid, liquid passes through. Example: sand from water', color: 'bg-blue-50 border-blue-400' },
              { icon: '🌡️', label: 'DISTILLATION — Separates liquids with different boiling points', sub: 'Heat to evaporate one liquid, then cool to condense it. Example: purify water from salt', color: 'bg-orange-50 border-orange-400' },
              { icon: '💨', label: 'EVAPORATION — Leaves dissolved solid behind', sub: 'Evaporate the solvent to collect the solute. Example: collect salt from salt water', color: 'bg-yellow-50 border-yellow-400' },
              { icon: '🧲', label: 'MAGNETISM — Separates magnetic from non-magnetic', sub: 'Iron filings from sand. Only works with magnetic materials', color: 'bg-gray-50 border-gray-400' },
              { icon: '🎨', label: 'CHROMATOGRAPHY — Separates dissolved substances by movement rate', sub: 'Ink on filter paper in water — different dyes travel different distances', color: 'bg-pink-50 border-pink-400' },
            ],
            points: []
          },
          {
            subtitle: 'States of Matter',
            emoji: '🧊',
            layout: 'cards',
            items: [
              { icon: '🧊', label: 'SOLID', value: 'Definite shape + volume', sub: 'Particles tightly packed, vibrate in place. Cannot compress', color: 'bg-blue-50 border-blue-300' },
              { icon: '💧', label: 'LIQUID', value: 'Definite volume, no shape', sub: 'Particles close but can flow. Takes shape of container', color: 'bg-cyan-50 border-cyan-300' },
              { icon: '💨', label: 'GAS', value: 'No definite shape or volume', sub: 'Particles far apart, move fast. Fills any container, compressible', color: 'bg-gray-50 border-gray-200' },
              { icon: '⚡', label: 'PLASMA', value: 'Super-heated gas', sub: 'Charged particles. Found in stars, lightning, neon signs', color: 'bg-purple-50 border-purple-300' },
              { icon: '🔼', label: 'SUBLIMATION', value: 'Solid → Gas directly', sub: 'Dry ice (CO₂) skips liquid phase. Iodine crystals also sublime', color: 'bg-indigo-50 border-indigo-300' },
              { icon: '🔽', label: 'DEPOSITION', value: 'Gas → Solid directly', sub: 'Frost forming on a cold window. Reverse of sublimation', color: 'bg-teal-50 border-teal-300' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'chemistry-definitions-2',
        title: 'More Essential Chemistry Terms',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Lab Safety Rules',
            emoji: '🥽',
            layout: 'rules',
            items: [
              { icon: '👓', label: 'ALWAYS wear safety goggles when chemicals or heat are present', sub: 'Even if you think it is safe — one splash can cause permanent eye damage', color: 'bg-yellow-50 border-yellow-400' },
              { icon: '🚫', label: 'NEVER eat, drink, or smell chemicals directly', sub: 'Waft fumes toward your nose — never sniff directly from container', color: 'bg-red-50 border-red-400' },
              { icon: '💈', label: 'Tie back long hair. No loose clothing near open flames', sub: 'Hair and synthetic fabrics catch fire instantly', color: 'bg-orange-50 border-orange-400' },
              { icon: '🚨', label: 'Report ALL accidents immediately — no exceptions', sub: 'Know location of: eyewash station, safety shower, fire extinguisher, fire blanket', color: 'bg-blue-50 border-blue-400' },
            ],
            points: []
          },
          {
            subtitle: 'WHMIS Symbols — Know These 10',
            emoji: '⚠️',
            layout: 'cards',
            items: [
              { icon: '💥', label: 'EXPLODING BOMB', value: 'Explosive', sub: 'Risk of explosion from heat, shock, or friction', color: 'bg-red-50 border-red-300' },
              { icon: '🔥', label: 'FLAME', value: 'Flammable', sub: 'Catches fire easily. Keep away from heat and sparks', color: 'bg-orange-50 border-orange-300' },
              { icon: '🟡', label: 'FLAME OVER CIRCLE', value: 'Oxidizer', sub: 'Makes fires burn stronger even without fuel', color: 'bg-yellow-50 border-yellow-300' },
              { icon: '💀', label: 'SKULL & CROSSBONES', value: 'Toxic/Poisonous', sub: 'Can cause death even in small amounts', color: 'bg-gray-50 border-gray-400' },
              { icon: '🌊', label: 'CORROSION', value: 'Acid or Base', sub: 'Burns skin and eyes. Destroys metals and fabrics', color: 'bg-blue-50 border-blue-300' },
              { icon: '🫁', label: 'HEALTH HAZARD', value: 'Long-term harm', sub: 'May cause cancer, reproductive harm, or organ damage', color: 'bg-purple-50 border-purple-300' },
            ],
            points: []
          },
          {
            subtitle: 'Chemical Reaction Types',
            emoji: '⚗️',
            layout: 'rules',
            items: [
              { icon: '➕', label: 'SYNTHESIS — A + B → AB', sub: 'Two or more substances combine to make one new substance', color: 'bg-green-50 border-green-400' },
              { icon: '➗', label: 'DECOMPOSITION — AB → A + B', sub: 'One compound breaks down into two or more substances', color: 'bg-blue-50 border-blue-400' },
              { icon: '🔄', label: 'SINGLE REPLACEMENT — A + BC → AC + B', sub: 'One element replaces another in a compound', color: 'bg-yellow-50 border-yellow-400' },
              { icon: '🔃', label: 'DOUBLE REPLACEMENT — AB + CD → AD + CB', sub: 'Two compounds swap parts. Often forms precipitate', color: 'bg-purple-50 border-purple-400' },
              { icon: '🔥', label: 'EXOTHERMIC — Releases energy (heat/light)', sub: 'Combustion, hand warmers, explosions. Products have less energy than reactants', color: 'bg-red-50 border-red-400' },
              { icon: '❄️', label: 'ENDOTHERMIC — Absorbs energy', sub: 'Photosynthesis, cold packs. Products have MORE energy than reactants', color: 'bg-cyan-50 border-cyan-400' },
            ],
            points: []
          },
          {
            subtitle: 'Acids & Bases',
            emoji: '🧪',
            layout: 'compare',
            items: [
              {
                label: '🔴 ACIDS (pH < 7)',
                color: 'bg-red-50 border-red-400',
                rows: ['Taste sour (do not taste in lab!)', 'Donate H⁺ ions', 'Turn litmus paper RED', 'HCl, H₂SO₄, vinegar, citrus juice']
              },
              {
                label: '🔵 BASES (pH > 7)',
                color: 'bg-blue-50 border-blue-400',
                rows: ['Taste bitter, feel slippery', 'Accept H⁺ ions', 'Turn litmus paper BLUE', 'NaOH, ammonia, soap, bleach']
              },
              'Neutralization: Acid + Base → Salt + Water. pH 7 = neutral (pure water). Stronger acid = lower pH number.'
            ],
            points: []
          }
        ]
      },
      {
        id: 'lab-equipment',
        title: 'Lab Equipment & Tools',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Measuring & Transferring',
            emoji: '📏',
            layout: 'cards',
            items: [
              { icon: '🧪', label: 'Graduated Cylinder', value: 'Measures liquid volume', sub: 'Most accurate for liquids. Read at bottom of meniscus', color: 'bg-blue-50 border-blue-300' },
              { icon: '🫙', label: 'Beaker', value: 'Holds & mixes liquids', sub: 'Less accurate for measuring. Good for heating and mixing', color: 'bg-gray-50 border-gray-200' },
              { icon: '🍶', label: 'Erlenmeyer Flask', value: 'Mix, heat, store', sub: 'Conical shape prevents splashing. Good for swirling', color: 'bg-teal-50 border-teal-300' },
              { icon: '⚖️', label: 'Electronic Balance', value: 'Measures mass', sub: 'Zero (tare) it before measuring. Results in grams', color: 'bg-green-50 border-green-300' },
              { icon: '💧', label: 'Overflow Can', value: 'Measures volume by displacement', sub: 'Measures irregular solids. Water displaced = object volume', color: 'bg-cyan-50 border-cyan-300' },
              { icon: '🔥', label: 'Bunsen Burner', value: 'Controlled heat source', sub: 'Blue flame = hotter. Yellow flame = unburned carbon (soot)', color: 'bg-orange-50 border-orange-300' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'lab-safety',
        title: 'Lab Safety & WHMIS',
        image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Non-Negotiable Safety Rules',
            emoji: '⚠️',
            layout: 'rules',
            items: [
              { icon: '👓', label: 'Safety goggles ON whenever chemicals or heating is involved', sub: 'Even if just observing — one accident from a neighbour can hit you', color: 'bg-yellow-50 border-yellow-400' },
              { icon: '🚫', label: 'NO eating, drinking, or smelling containers directly', sub: 'Waft technique: wave hand over top to direct fumes toward nose gently', color: 'bg-red-50 border-red-400' },
              { icon: '💈', label: 'Tie hair back, no loose sleeves near flames', sub: 'Synthetic fabrics melt and stick to skin — wear cotton when possible', color: 'bg-orange-50 border-orange-400' },
              { icon: '🚨', label: 'Report EVERY accident, spill, or broken glass immediately', sub: 'No exception. Your teacher needs to know even small incidents', color: 'bg-blue-50 border-blue-400' },
              { icon: '📍', label: 'Know where ALL safety equipment is BEFORE starting', sub: 'Eyewash station, safety shower, fire extinguisher, fire blanket, first aid kit', color: 'bg-green-50 border-green-400' },
            ],
            points: []
          },
          {
            subtitle: 'Key WHMIS Symbols',
            emoji: '🔶',
            layout: 'cards',
            items: [
              { icon: '💥', label: 'Explosive', value: 'Exploding bomb', sub: 'Risk of explosion. Store in cool, dry place away from shock', color: 'bg-red-50 border-red-300' },
              { icon: '🔥', label: 'Flammable', value: 'Flame symbol', sub: 'Catches fire easily. Keep from heat, sparks, open flames', color: 'bg-orange-50 border-orange-300' },
              { icon: '🌊', label: 'Corrosive', value: 'Dripping onto surface', sub: 'Burns skin, eyes, and destroys metals. Use in fume hood', color: 'bg-blue-50 border-blue-300' },
              { icon: '💀', label: 'Toxic', value: 'Skull and crossbones', sub: 'Poisonous — even small amounts can be fatal', color: 'bg-gray-50 border-gray-400' },
              { icon: '🌿', label: 'Environmental hazard', value: 'Dead tree/fish', sub: 'Toxic to aquatic life and ecosystems. Do not pour down drain', color: 'bg-green-50 border-green-300' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'matter',
        title: 'Classification of Matter',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Pure Substances vs Mixtures',
            emoji: '🧬',
            layout: 'compare',
            items: [
              {
                label: '✨ PURE SUBSTANCE',
                color: 'bg-indigo-50 border-indigo-400',
                rows: ['Uniform composition throughout', 'Fixed properties (melting point, boiling point)', 'Element: one type of atom (Au, O₂)', 'Compound: atoms bonded (H₂O, NaCl, CO₂)']
              },
              {
                label: '🥗 MIXTURE',
                color: 'bg-green-50 border-green-400',
                rows: ['Variable composition', 'Properties vary with ratio', 'Homogeneous: uniform (salt water, air)', 'Heterogeneous: can see parts (sand + water)']
              },
              'Key test: does it have a single fixed melting/boiling point? Yes → pure substance. No → mixture.'
            ],
            points: []
          },
          {
            subtitle: 'Flow Chart: How to Classify',
            emoji: '🔍',
            layout: 'steps',
            items: [
              { label: 'Is it uniform throughout? Can you see separate parts?', sub: 'Yes uniform → pure substance or homogeneous mixture. Can see parts → heterogeneous mixture' },
              { label: 'Can it be separated by physical means (filter, magnet, evaporate)?', sub: 'Yes → mixture. No physical separation possible → pure substance' },
              { label: 'Is the pure substance made of only ONE element?', sub: 'One element → Element (e.g. O₂, Fe). Two or more elements bonded → Compound (e.g. H₂O)' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'separation',
        title: 'Separation Methods',
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Which Method — Which Mixture?',
            emoji: '🔬',
            layout: 'rules',
            items: [
              { icon: '🫙', label: 'FILTRATION → Solid from liquid', sub: 'Use: sand from water, soil from water. Paper traps solid, liquid passes through', color: 'bg-blue-50 border-blue-400' },
              { icon: '🌡️', label: 'DISTILLATION → Liquids with different boiling points', sub: 'Use: separate water from salt (water boils away, salt stays)', color: 'bg-orange-50 border-orange-400' },
              { icon: '💨', label: 'EVAPORATION → Recover dissolved solid', sub: 'Use: extract salt from salt water. Evaporate the water, salt is left behind', color: 'bg-yellow-50 border-yellow-400' },
              { icon: '🧲', label: 'MAGNETISM → Magnetic from non-magnetic', sub: 'Use: iron filings from sand or sawdust', color: 'bg-gray-50 border-gray-400' },
              { icon: '🎨', label: 'CHROMATOGRAPHY → Dissolved dyes/pigments', sub: 'Different compounds travel different distances in a solvent. Identifies inks', color: 'bg-pink-50 border-pink-400' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'changes',
        title: 'Physical vs Chemical Changes',
        image: 'https://images.unsplash.com/photo-1628863353691-0071c8c1874c?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Physical vs Chemical — Key Differences',
            emoji: '🔄',
            layout: 'compare',
            items: [
              {
                label: '❄️ PHYSICAL CHANGE',
                color: 'bg-blue-50 border-blue-400',
                rows: ['Same substance — different form', 'Usually reversible', 'No new substance formed', 'Examples: ice melting, cutting paper, dissolving sugar, tearing cloth']
              },
              {
                label: '🔥 CHEMICAL CHANGE',
                color: 'bg-red-50 border-red-400',
                rows: ['NEW substance(s) formed', 'Usually irreversible', 'Energy usually released or absorbed', 'Examples: burning wood, rusting iron, cooking egg, baking soda + vinegar']
              },
              "Clue words: 'new substance', cannot reverse → chemical. 'Same substance, different form' → physical."
            ],
            points: []
          },
          {
            subtitle: '5 Signs of a Chemical Change',
            emoji: '🔍',
            layout: 'rules',
            items: [
              { icon: '🎨', label: 'COLOR CHANGE (unexpected)', sub: 'Iron turning orange-brown (rusting). Note: dissolving food coloring is physical', color: 'bg-orange-50 border-orange-400' },
              { icon: '💨', label: 'GAS PRODUCED (bubbles)', sub: 'Vinegar + baking soda fizzes. Hydrogen gas from metal + acid', color: 'bg-gray-50 border-gray-400' },
              { icon: '🌡️', label: 'TEMPERATURE CHANGE', sub: 'Hand warmers (exothermic). Cold packs (endothermic). Change without external heating', color: 'bg-red-50 border-red-400' },
              { icon: '✨', label: 'LIGHT PRODUCED', sub: 'Fireworks, burning, glow sticks. Light = energy being released', color: 'bg-yellow-50 border-yellow-400' },
              { icon: '🌧️', label: 'PRECIPITATE FORMS', sub: 'Solid appears in a liquid. Two clear solutions mix → cloudy solid forms', color: 'bg-blue-50 border-blue-400' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'density',
        title: 'Density Calculations',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Density — 3 Formulas',
            emoji: '📐',
            layout: 'formula',
            items: [
              { formula: 'D = m ÷ V', meaning: 'Find Density — cover D, divide mass by volume', example: 'm=24g, V=8cm³ → D=3 g/cm³', color: 'border-indigo-300', headerBg: 'bg-indigo-600' },
              { formula: 'm = D × V', meaning: 'Find Mass — cover m, multiply D × V', example: 'D=3 g/cm³, V=10cm³ → m=30g', color: 'border-blue-400', headerBg: 'bg-blue-600' },
              { formula: 'V = m ÷ D', meaning: 'Find Volume — cover V, divide mass by density', example: 'm=30g, D=3 g/cm³ → V=10cm³', color: 'border-teal-400', headerBg: 'bg-teal-600' },
            ],
            points: []
          },
          {
            subtitle: 'Floating & Sinking Rule',
            emoji: '🛟',
            layout: 'rules',
            items: [
              { icon: '🏊', label: 'Object FLOATS if its density is LESS than the liquid', sub: 'Ice (0.92 g/cm³) floats on water (1.00 g/cm³). Wood floats on water', color: 'bg-blue-50 border-blue-400' },
              { icon: '⬇️', label: 'Object SINKS if its density is GREATER than the liquid', sub: 'Iron (7.9 g/cm³) sinks in water. Steel ship floats because of hollow air spaces', color: 'bg-red-50 border-red-400' },
              { icon: '🪨', label: 'Measuring irregular solid volume — Water Displacement', sub: 'Put object in graduated cylinder with water. Volume of water rise = object volume', color: 'bg-gray-50 border-gray-400' },
            ],
            points: [],
            diagram: 'density'
          }
        ]
      },
      {
        id: 'properties',
        title: 'Physical & Chemical Properties',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Physical Properties — Two Types',
            emoji: '👁️',
            layout: 'compare',
            items: [
              {
                label: '🗣️ QUALITATIVE',
                color: 'bg-blue-50 border-blue-400',
                rows: ['Descriptive — no numbers needed', 'Color, texture, odor, state', 'Luster (shininess), malleability', 'Ductility, transparency, hardness']
              },
              {
                label: '📏 QUANTITATIVE',
                color: 'bg-green-50 border-green-400',
                rows: ['Measurable — has a number + unit', 'Mass, volume, density', 'Melting point, boiling point', 'Solubility, conductivity']
              },
              'Both are observable WITHOUT changing the substance into something new.'
            ],
            points: []
          },
          {
            subtitle: 'Chemical Properties',
            emoji: '⚗️',
            layout: 'rules',
            items: [
              { icon: '🔥', label: 'COMBUSTIBILITY — Ability to burn in oxygen', sub: 'Wood, gasoline, methane are combustible. Water is not', color: 'bg-red-50 border-red-400' },
              { icon: '⚡', label: 'REACTIVITY WITH ACIDS — metals produce H₂ gas', sub: 'Zinc + hydrochloric acid → zinc chloride + hydrogen gas', color: 'bg-yellow-50 border-yellow-400' },
              { icon: '🟤', label: 'STABILITY / OXIDATION — reaction with oxygen over time', sub: 'Iron + oxygen + water → iron oxide (rust). Slow combustion', color: 'bg-orange-50 border-orange-400' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'periodic-table',
        title: 'Periodic Table Organization',
        image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'How the Table is Organized',
            emoji: '📊',
            layout: 'rules',
            items: [
              { icon: '↔️', label: 'PERIODS — Horizontal rows (1 to 7)', sub: 'Each new period = new electron shell being filled. Period 2 has 2 shells, etc.', color: 'bg-blue-50 border-blue-400' },
              { icon: '↕️', label: 'GROUPS / FAMILIES — Vertical columns (1 to 18)', sub: 'Same number of valence electrons = similar chemical properties', color: 'bg-green-50 border-green-400' },
              { icon: '📈', label: 'Atomic number increases LEFT → RIGHT and TOP → BOTTOM', sub: 'Arranged in order of increasing protons. Same as increasing electrons in neutral atom', color: 'bg-indigo-50 border-indigo-400' },
            ],
            points: []
          },
          {
            subtitle: 'Metals, Non-metals & Metalloids',
            emoji: '🔧',
            layout: 'compare',
            items: [
              {
                label: '🔩 METALS (left + middle)',
                color: 'bg-yellow-50 border-yellow-400',
                rows: ['Shiny (lustrous)', 'Conductive (heat & electricity)', 'Malleable & ductile', 'LOSE electrons → cations (+)']
              },
              {
                label: '🔒 NON-METALS (right side)',
                color: 'bg-blue-50 border-blue-400',
                rows: ['Dull appearance', 'Poor conductors', 'Brittle in solid form', 'GAIN electrons → anions (−)']
              },
              'Metalloids (staircase line): Silicon, Boron, Germanium. Semiconductors — used in computer chips.'
            ],
            points: [],
            diagram: 'periodic-table'
          },
          {
            subtitle: 'Key Element Families',
            emoji: '👨‍👩‍👧‍👦',
            layout: 'cards',
            items: [
              { icon: '🔴', label: 'Alkali Metals (Group 1)', value: '1 valence e⁻', sub: 'Li, Na, K. Softest metals. Explode violently with water', color: 'bg-red-50 border-red-300' },
              { icon: '🟠', label: 'Alkaline Earth (Group 2)', value: '2 valence e⁻', sub: 'Mg, Ca. Reactive but less than Group 1. Ca in bones', color: 'bg-orange-50 border-orange-300' },
              { icon: '🟢', label: 'Halogens (Group 17)', value: '7 valence e⁻', sub: 'F, Cl, Br, I. Very reactive. Form diatomic molecules (Cl₂)', color: 'bg-green-50 border-green-300' },
              { icon: '🟣', label: 'Noble Gases (Group 18)', value: '8 valence e⁻', sub: 'He, Ne, Ar. Full outer shell — almost completely unreactive', color: 'bg-purple-50 border-purple-300' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'periodic-trends',
        title: 'Periodic Trends & Advanced Properties',
        image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&h-400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'atomic-models',
        title: 'Atomic Models Through History',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Evolution of the Atomic Model',
            emoji: '🔭',
            layout: 'steps',
            items: [
              { label: 'DALTON (1803) — Solid sphere model', sub: 'Atoms are indivisible, solid balls. All atoms of one element are identical. Atoms combine in whole-number ratios' },
              { label: 'THOMSON (1897) — Plum pudding model', sub: 'Discovered the electron. Atom = positive "pudding" with negative electrons embedded. Like raisins in a bun' },
              { label: 'RUTHERFORD (1911) — Nuclear model', sub: 'Gold foil experiment — most particles went straight through. Concluded: atoms are mostly empty space with tiny dense positive nucleus' },
              { label: 'BOHR (1913) — Planetary model', sub: 'Electrons orbit in specific energy levels (shells). Each shell has a fixed energy. Electrons jump between shells by absorbing/releasing energy' },
            ],
            points: [],
            diagram: 'atomic-models'
          },
          {
            subtitle: 'Rutherford Gold Foil Experiment',
            emoji: '🎯',
            layout: 'rules',
            items: [
              { icon: '🔫', label: 'Fired alpha particles at thin gold foil', sub: 'Expected: all particles to pass straight through (Thomson model predicted this)', color: 'bg-gray-50 border-gray-400' },
              { icon: '😲', label: 'OBSERVED: most passed through, but some bounced back!', sub: '"Like firing artillery at tissue paper and having it bounce back at you" — Rutherford', color: 'bg-red-50 border-red-400' },
              { icon: '💡', label: 'CONCLUSION: Atom has a tiny, dense, positive nucleus', sub: 'Nucleus is ~100,000× smaller than the atom. Most of atom is empty space', color: 'bg-yellow-50 border-yellow-400' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'electron-configuration',
        title: 'Electron Configuration & Quantum Numbers',
        image: 'https://images.unsplash.com/photo-1635070041409-e5e34c1a6ff9?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'subatomic',
        title: 'Subatomic Particles & Bohr Diagrams',
        image: 'https://images.unsplash.com/photo-1635070041409-e5e34c1a6ff9?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'The Three Particles',
            emoji: '⚛️',
            layout: 'cards',
            items: [
              { icon: '🔴', label: 'PROTON', value: 'Charge: +1, mass: 1 amu', sub: 'In nucleus. Atomic number = proton count = identity of element', color: 'bg-red-50 border-red-300' },
              { icon: '⚫', label: 'NEUTRON', value: 'Charge: 0, mass: 1 amu', sub: 'In nucleus alongside protons. Neutrons = Mass# − Atomic#', color: 'bg-gray-50 border-gray-400' },
              { icon: '🔵', label: 'ELECTRON', value: 'Charge: −1, mass: ~0', sub: 'In shells outside nucleus. Determine chemical bonding and charge', color: 'bg-blue-50 border-blue-300' },
            ],
            points: []
          },
          {
            subtitle: 'Reading the Periodic Table',
            emoji: '📊',
            layout: 'steps',
            items: [
              { label: 'Atomic number (top number) = number of PROTONS', sub: 'Also equals number of ELECTRONS in a neutral atom' },
              { label: 'Atomic mass (bottom number, in amu) — round to get Mass Number', sub: 'Carbon: atomic mass ≈ 12.01 → Mass Number = 12' },
              { label: 'Neutrons = Mass Number − Atomic Number', sub: 'Carbon: 12 − 6 = 6 neutrons' },
              { label: 'For ions: Electrons = Protons − Charge', sub: 'Na⁺: 11 protons − (+1) = 10 electrons. Cl⁻: 17 protons − (−1) = 18 electrons' },
            ],
            points: []
          },
          {
            subtitle: 'Bohr-Rutherford Diagram Rules',
            emoji: '🎨',
            layout: 'rules',
            items: [
              { icon: '⭕', label: 'Draw nucleus in center — show p⁺ and n⁰ counts', sub: 'Label: e.g. 6p⁺, 6n⁰ for carbon', color: 'bg-gray-50 border-gray-400' },
              { icon: '1️⃣', label: 'Shell 1 (closest to nucleus): Maximum 2 electrons', sub: 'Fill this before moving to shell 2', color: 'bg-blue-50 border-blue-400' },
              { icon: '2️⃣', label: 'Shell 2: Maximum 8 electrons', sub: 'Fill completely before moving to shell 3', color: 'bg-indigo-50 border-indigo-400' },
              { icon: '3️⃣', label: 'Shell 3: Maximum 8 electrons (for first 20 elements)', sub: 'Works for elements 1-20. Beyond calcium, rules get more complex', color: 'bg-purple-50 border-purple-400' },
            ],
            points: [],
            diagram: 'bohr'
          },
          {
            subtitle: 'Isotopes',
            emoji: '🔄',
            layout: 'rules',
            items: [
              { icon: '🟰', label: 'Isotopes have the SAME number of protons', sub: 'Same element, same atomic number, same chemical behavior', color: 'bg-green-50 border-green-400' },
              { icon: '≠', label: 'Isotopes have DIFFERENT numbers of neutrons', sub: 'Different mass numbers. Carbon-12 (6n) vs Carbon-14 (8n)', color: 'bg-red-50 border-red-400' },
              { icon: '☢️', label: 'Carbon-14 is RADIOACTIVE — used in carbon dating', sub: 'Decays at known rate → can date organic material up to ~50,000 years', color: 'bg-orange-50 border-orange-400' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'chemical-equations',
        title: 'Balancing Chemical Equations & Stoichiometry',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'valence-ions',
        title: 'Valence Electrons & Ions',
        image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Valence Electrons — Why They Matter',
            emoji: '🌟',
            layout: 'rules',
            items: [
              { icon: '🔢', label: 'Group number = number of valence electrons', sub: 'Group 1 → 1 valence e⁻. Group 17 → 7 valence e⁻. Group 18 → 8 (stable!)', color: 'bg-indigo-50 border-indigo-400' },
              { icon: '🎯', label: 'Valence electrons determine ALL chemical behavior', sub: 'Bonding, reactivity, ion formation — all driven by the outer shell', color: 'bg-blue-50 border-blue-400' },
              { icon: '⚖️', label: 'Octet rule — atoms want 8 valence electrons (full outer shell)', sub: 'Nobel gases are already stable. Everything else reacts to get there', color: 'bg-green-50 border-green-400' },
            ],
            points: [],
            diagram: 'lewis'
          },
          {
            subtitle: 'Cations vs Anions',
            emoji: '⚡',
            layout: 'compare',
            items: [
              {
                label: '➕ CATION (positive)',
                color: 'bg-red-50 border-red-400',
                rows: ['LOST electrons', 'Protons > Electrons', 'Formed by METALS', 'Na loses 1e⁻ → Na⁺', 'Mg loses 2e⁻ → Mg²⁺']
              },
              {
                label: '➖ ANION (negative)',
                color: 'bg-blue-50 border-blue-400',
                rows: ['GAINED electrons', 'Electrons > Protons', 'Formed by NON-METALS', 'Cl gains 1e⁻ → Cl⁻', 'O gains 2e⁻ → O²⁻']
              },
              'Memory: cAt-ion = pAWsitive (cat has paws, positive). An-ion = negative (An-gry).'
            ],
            points: [],
            diagram: 'ions'
          },
          {
            subtitle: 'Why Atoms Form Ions',
            emoji: '🎯',
            layout: 'steps',
            items: [
              { label: 'Atoms want a FULL outer shell (8 electrons = stable)', sub: 'Noble gases already have this — that is why they do not react' },
              { label: 'METALS (Groups 1-3): it is easier to LOSE 1-3 electrons', sub: 'Less work to empty the outer shell than fill it. Forms cations (+1, +2, +3)' },
              { label: 'NON-METALS (Groups 15-17): it is easier to GAIN 1-3 electrons', sub: 'Less work to fill the last few spots. Forms anions (−1, −2, −3)' },
              { label: 'Opposite charges attract → IONIC BOND forms', sub: 'Na⁺ + Cl⁻ → NaCl. The compound is electrically neutral overall' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'advanced-bonding',
        title: 'Advanced Chemical Bonding & Molecules',
        image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'acids-bases-advanced',
        title: 'Advanced Acids, Bases & pH Calculations',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'mole-concept',
        title: "The Mole Concept & Avogadro\'s Number",
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      }
    ]
  },
  physics: {
    id: 'physics',
    name: 'Physics: Electricity',
    description: '11 in-depth sections with interactive diagrams — static electricity, Ohm\'s Law, circuits, energy, and safety.',
    icon: Zap,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=600&fit=crop',
    sections: [
      {
        id: 'definitions',
        title: 'Key Electricity Definitions',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'The Big 3: V, I, R',
            emoji: '🔑',
            layout: 'cards',
            items: [
              { icon: '💧', label: 'VOLTAGE (V)', value: 'Volts (V)', sub: 'The "pressure" pushing electrons. Higher V = more push.', color: 'bg-indigo-50 border-indigo-300' },
              { icon: '🌊', label: 'CURRENT (I)', value: 'Amperes (A)', sub: 'How many electrons flow per second.', color: 'bg-cyan-50 border-cyan-300' },
              { icon: '🚧', label: 'RESISTANCE (R)', value: 'Ohms (Ω)', sub: 'Opposes flow. Like a narrow kink in a pipe.', color: 'bg-orange-50 border-orange-300' },
              { icon: '⚡', label: 'CHARGE (Q)', value: 'Coulombs (C)', sub: '1 Ampere = 1 Coulomb flowing per second.', color: 'bg-yellow-50 border-yellow-300' },
            ],
            points: []
          },
          {
            subtitle: 'Circuit Types — Know the Difference',
            emoji: '🔌',
            layout: 'rules',
            items: [
              { icon: '✅', label: 'CLOSED circuit', sub: 'Complete loop — current flows normally', color: 'bg-green-50 border-green-400' },
              { icon: '❌', label: 'OPEN circuit', sub: 'Broken path — current stops completely (what a switch does when off)', color: 'bg-gray-50 border-gray-400' },
              { icon: '⚠️', label: 'SHORT circuit', sub: 'Unintended low-resistance path — massive current → fire risk', color: 'bg-red-50 border-red-400' },
              { icon: '💡', label: 'LOAD', sub: 'Any device using electrical energy: bulb, motor, resistor', color: 'bg-yellow-50 border-yellow-400' },
            ],
            points: []
          },
          {
            subtitle: 'All Formulas at a Glance',
            emoji: '📐',
            layout: 'formula',
            items: [
              { formula: "V = I × R", meaning: "Ohm's Law — Voltage = Current × Resistance", example: "I=3A, R=4Ω → V=12V", color: 'border-indigo-300', headerBg: 'bg-indigo-600' },
              { formula: "P = V × I", meaning: "Power in Watts (also: P=I²R and P=V²÷R)", example: "120V × 0.5A = 60W", color: 'border-amber-300', headerBg: 'bg-amber-500' },
              { formula: "E = P × t", meaning: "Energy — Watts×sec=Joules OR kW×hours=kWh", example: "1.5kW × 8h = 12 kWh", color: 'border-green-300', headerBg: 'bg-green-600' },
              { formula: "Cost = E(kWh) × Rate", meaning: "Electricity cost — always convert W→kW first!", example: "12kWh × $0.12 = $1.44", color: 'border-rose-300', headerBg: 'bg-rose-500' },
            ],
            points: []
          },
          {
            subtitle: 'Safety Devices',
            emoji: '🛡️',
            layout: 'cards',
            items: [
              { icon: '🔥', label: 'FUSE', value: 'Single-use', sub: 'Thin wire MELTS when overloaded. Must be replaced.', color: 'bg-red-50 border-red-300' },
              { icon: '⚡', label: 'CIRCUIT BREAKER', value: 'Reusable', sub: 'Switch TRIPS open. Just reset it — used in homes.', color: 'bg-green-50 border-green-300' },
              { icon: '🌍', label: 'GROUND (3rd prong)', value: 'Safety path', sub: 'Routes fault current to Earth, not through you.', color: 'bg-blue-50 border-blue-300' },
              { icon: '💧', label: 'GFCI outlet', value: 'Cuts in 0.025s', sub: 'Detects tiny leaks. Required in bathrooms/kitchens.', color: 'bg-teal-50 border-teal-300' },
            ],
            points: []
          },
        ]
      },
      {
        id: 'static',
        title: 'Static Electricity',
        image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'What Is Static Electricity?',
            emoji: '⚡',
            layout: 'bullets',
            points: [
              'Static = charge BUILDS UP on the surface of an object and stays there — it does not flow',
              'Too many electrons → object is NEGATIVE (−). Too few → POSITIVE (+)',
              'KEY RULE: Only ELECTRONS move — protons are locked in the nucleus forever',
              'Objects become neutral again by discharge (spark) or grounding',
            ]
          },
          {
            subtitle: 'Law of Electric Charges',
            emoji: '🧲',
            layout: 'rules',
            items: [
              { icon: '↔️', label: 'LIKE charges REPEL each other', sub: '+ pushes + away    — pushes — away', color: 'bg-red-50 border-red-400' },
              { icon: '🔗', label: 'OPPOSITE charges ATTRACT each other', sub: '+ and — pull toward each other', color: 'bg-green-50 border-green-400' },
              { icon: '🎈', label: 'POLARIZATION — why neutral objects are attracted', sub: 'Charged balloon near neutral wall → shifts wall electrons → near side becomes opposite charge → attraction!', color: 'bg-blue-50 border-blue-400' },
            ],
            points: [],
            diagram: 'electric-charges'
          },
          {
            subtitle: '3 Ways to Charge Objects',
            emoji: '🔄',
            layout: 'steps',
            items: [
              { label: 'FRICTION — Rub two objects together', sub: 'Electrons transfer from one surface to the other. Balloon on hair: balloon gets −, hair gets +' },
              { label: 'CONDUCTION — Direct contact with a charged object', sub: 'Charge spreads by touch. Both objects end up with the same type of charge' },
              { label: 'INDUCTION — Bring a charged object NEAR without touching', sub: 'Charges separate inside the neutral object. Remove the charged object — induced charge stays' },
            ],
            points: [],
            diagram: 'charging-methods'
          },
          {
            subtitle: 'Conductors vs Insulators',
            emoji: '🔌',
            layout: 'compare',
            items: [
              {
                label: '🟡 CONDUCTOR',
                color: 'bg-yellow-50 border-yellow-400',
                rows: ['Electrons move FREELY', 'Copper, silver, aluminum', 'Salt water', 'Charge spreads out evenly']
              },
              {
                label: '🟣 INSULATOR',
                color: 'bg-purple-50 border-purple-400',
                rows: ['Electrons are LOCKED in place', 'Rubber, plastic, glass', 'Dry wood', 'Charge stays put']
              },
              'Real-world: copper wire (conductor) inside rubber coating (insulator) = safe electrical cable!'
            ],
            points: [],
            diagram: 'conductor-insulator'
          },
          {
            subtitle: 'Lightning — How It Forms',
            emoji: '🌩️',
            layout: 'steps',
            items: [
              { label: 'Ice crystals and water droplets COLLIDE inside storm clouds', sub: 'Electrons transfer → charge separates inside the cloud' },
              { label: 'Negative charges pool at the cloud bottom, positive at the top', sub: 'Negative base repels electrons from ground → ground surface becomes +' },
              { label: 'Charge difference becomes enormous → electrons find a path down', sub: 'LIGHTNING: 30,000°C — 5× hotter than the sun, carrying ~30,000 amps' },
              { label: 'Lightning rod provides an easy low-resistance path to Earth', sub: 'Safely redirects the strike, protecting the building' },
            ],
            points: [],
            diagram: 'lightning'
          }
        ]
      },
      {
        id: 'magnetism-electromagnetism',
        title: 'Static vs Current Electricity',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Static vs Current — Side by Side',
            emoji: '⚡',
            layout: 'compare',
            items: [
              {
                label: '⚡ STATIC',
                color: 'bg-yellow-50 border-yellow-400',
                rows: ['Charge STORED on surface', 'Does not flow continuously', 'Single sudden burst (spark)', 'Like a water BALLOON']
              },
              {
                label: '🔋 CURRENT',
                color: 'bg-blue-50 border-blue-400',
                rows: ['Charge FLOWS in a loop', 'Moves continuously', 'Steady and controllable', 'Like a running TAP']
              },
              'Both involve electrons — the difference is stored vs flowing.'
            ],
            points: [],
            diagram: 'static-vs-current'
          },
          {
            subtitle: 'Polarization — Why Neutral Objects Are Attracted',
            emoji: '🧲',
            layout: 'steps',
            items: [
              { label: 'Bring a charged object NEAR a neutral object (no touching)', sub: 'Charges rearrange INSIDE the neutral object — they do not transfer' },
              { label: 'Near side becomes the OPPOSITE charge', sub: 'Charged balloon near wall → wall electrons shift away → near side becomes +' },
              { label: 'Opposite charges attract → neutral object is pulled in', sub: 'This is why a charged comb picks up tiny scraps of paper' },
            ],
            points: []
          },
          {
            subtitle: 'Conductors, Insulators & Semiconductors',
            emoji: '🔌',
            layout: 'cards',
            items: [
              { icon: '🔩', label: 'CONDUCTOR', value: 'Copper, Silver, Al', sub: 'Outer electrons loosely held — move freely. Best conductor = silver', color: 'bg-yellow-50 border-yellow-300' },
              { icon: '🔒', label: 'INSULATOR', value: 'Rubber, Plastic, Glass', sub: 'Electrons tightly bound — cannot move. Holds charge in place', color: 'bg-purple-50 border-purple-300' },
              { icon: '💻', label: 'SEMICONDUCTOR', value: 'Silicon, Germanium', sub: 'Conductivity is controllable. Basis of ALL computer chips and electronics', color: 'bg-blue-50 border-blue-300' },
              { icon: '🧊', label: 'SUPERCONDUCTOR', value: 'Near 0 Kelvin', sub: 'Zero resistance at extremely low temperatures. Still experimental', color: 'bg-indigo-50 border-indigo-300' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'current',
        title: "Current Electricity & Ohm\'s Law",
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'V, I, R — Water Pipe Analogy',
            emoji: '💧',
            layout: 'cards',
            items: [
              { icon: '🚰', label: 'Battery = Pump', value: 'Powers the circuit', sub: 'Converts chemical energy into electrical "pressure"', color: 'bg-green-50 border-green-300' },
              { icon: '🌊', label: 'Current = Flow rate', value: 'Amperes (A)', sub: 'More voltage = more flow. More resistance = less flow', color: 'bg-cyan-50 border-cyan-300' },
              { icon: '🚧', label: 'Resistance = Narrow pipe', value: 'Ohms (Ω)', sub: 'Slows current down. Wire, bends, thin sections all add resistance', color: 'bg-orange-50 border-orange-300' },
              { icon: '💡', label: 'Load = Water wheel', value: 'Uses the energy', sub: 'Converts electrical energy into light, heat, motion, sound', color: 'bg-yellow-50 border-yellow-300' },
            ],
            points: [],
            diagram: 'water-analogy'
          },
          {
            subtitle: "Ohm\'s Law — 3 Forms",
            emoji: '📐',
            layout: 'formula',
            items: [
              { formula: 'V = I × R', meaning: 'Find Voltage — cover V, multiply I × R', example: 'I=3A, R=4Ω → V=12V', color: 'border-indigo-300', headerBg: 'bg-indigo-600' },
              { formula: 'I = V ÷ R', meaning: 'Find Current — cover I, divide V by R', example: 'V=12V, R=4Ω → I=3A', color: 'border-green-300', headerBg: 'bg-green-600' },
              { formula: 'R = V ÷ I', meaning: 'Find Resistance — cover R, divide V by I', example: 'V=24V, I=3A → R=8Ω', color: 'border-amber-300', headerBg: 'bg-amber-500' },
            ],
            points: [],
            diagram: 'vir-triangle'
          },
          {
            subtitle: 'What Affects Resistance?',
            emoji: '🔌',
            layout: 'rules',
            items: [
              { icon: '📏', label: 'LENGTH — longer wire = MORE resistance', sub: 'More distance = more electron-atom collisions', color: 'bg-orange-50 border-orange-400' },
              { icon: '🔵', label: 'THICKNESS — thinner wire = MORE resistance', sub: 'Less cross-sectional area = less room for electrons to flow', color: 'bg-orange-50 border-orange-400' },
              { icon: '⚗️', label: 'MATERIAL — Silver < Copper < Al < Tungsten', sub: 'Different atomic structures hold electrons more or less tightly', color: 'bg-blue-50 border-blue-400' },
              { icon: '🌡️', label: 'TEMPERATURE — hotter metal = MORE resistance', sub: 'EXCEPTION: Semiconductors (silicon) resistance DECREASES with heat', color: 'bg-red-50 border-red-400' },
            ],
            points: [],
            diagram: 'resistance-factors'
          }
        ]
      },
      {
        id: 'electronics-components',
        title: 'Measuring Circuits — Ammeter & Voltmeter',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Ammeter vs Voltmeter',
            emoji: '📏',
            layout: 'compare',
            items: [
              {
                label: '🔵 AMMETER',
                color: 'bg-blue-50 border-blue-400',
                rows: ['Measures CURRENT (Amperes)', 'Connected IN SERIES', 'Very LOW internal resistance', 'Break wire — insert in gap', 'NEVER across battery (will burn!)']
              },
              {
                label: '🔴 VOLTMETER',
                color: 'bg-red-50 border-red-400',
                rows: ['Measures VOLTAGE (Volts)', 'Connected IN PARALLEL', 'Very HIGH internal resistance', 'Probe across the component', 'Safe to connect across battery']
              },
              'Memory: Ammeter = in-line (series). Voltmeter = across (parallel).'
            ],
            points: [],
            diagram: 'ammeter-voltmeter'
          },
          {
            subtitle: 'Circuit Diagram Symbols',
            emoji: '📋',
            layout: 'rules',
            items: [
              { icon: '🔋', label: 'Battery/Cell — long line = + (positive), short line = − (negative)', sub: 'Multiple cells in a row = battery. Longer stack = higher voltage', color: 'bg-gray-50 border-gray-400' },
              { icon: '🌀', label: 'Resistor — zigzag (North American) or rectangle (European)', sub: 'Any device that uses energy can be shown as a resistor', color: 'bg-gray-50 border-gray-400' },
              { icon: '💡', label: 'Light bulb — circle with X inside', sub: 'The X represents the filament wire inside', color: 'bg-gray-50 border-gray-400' },
              { icon: '🔓', label: 'Switch — gap with a flap. Open = circuit broken. Closed = flap bridges gap', sub: 'Switches are always connected IN SERIES with their load', color: 'bg-gray-50 border-gray-400' },
            ],
            points: [],
            diagram: 'circuit-symbols'
          },
          {
            subtitle: 'Cell vs Battery',
            emoji: '🔋',
            layout: 'cards',
            items: [
              { icon: '1️⃣', label: 'CELL', value: '~1.5V each', sub: 'Single electrochemical unit (one AA or AAA is a cell)', color: 'bg-gray-50 border-gray-200' },
              { icon: '🔋🔋', label: 'BATTERY', value: 'Cells combined', sub: 'Two or more cells. Technically your "battery" is often a single cell', color: 'bg-gray-50 border-gray-200' },
              { icon: '➕', label: 'Cells in SERIES', value: 'Voltages ADD', sub: '3 × 1.5V = 4.5V total — same current capacity', color: 'bg-green-50 border-green-300' },
              { icon: '↔️', label: 'Cells in PARALLEL', value: 'Voltage same', sub: 'Still 1.5V — but lasts longer (more current capacity)', color: 'bg-blue-50 border-blue-300' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'circuits',
        title: 'Series & Parallel Circuits',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Series vs Parallel — The Core Difference',
            emoji: '⚖️',
            layout: 'compare',
            items: [
              {
                label: '➡️ SERIES',
                color: 'bg-blue-50 border-blue-400',
                rows: ['ONE path for current', 'Current: SAME everywhere', 'Voltage: DIVIDES (V1+V2+V3=Vbat)', 'Resistance: ADDS (R1+R2+R3)', 'One break → ALL stop']
              },
              {
                label: '🔀 PARALLEL',
                color: 'bg-orange-50 border-orange-400',
                rows: ['MULTIPLE paths', 'Voltage: SAME everywhere', 'Current: DIVIDES (I1+I2+I3=Itot)', 'Resistance: DECREASES', 'One break → others continue']
              },
              'Memory: "Series = Same current" | "Parallel = same Pressure (voltage)"'
            ],
            points: [],
            diagram: 'series-vs-parallel'
          },
          {
            subtitle: 'Series Circuit — Worked Example',
            emoji: '🔢',
            layout: 'steps',
            items: [
              { label: 'Given: 12V battery, R1=2Ω, R2=3Ω, R3=7Ω in series', sub: 'Goal: find total resistance, current, and voltage across each resistor' },
              { label: 'Step 1 — Total R: R_total = 2 + 3 + 7 = 12Ω', sub: 'In series, resistances simply add together' },
              { label: 'Step 2 — Total current: I = V ÷ R = 12 ÷ 12 = 1A', sub: 'This same 1A flows through every component' },
              { label: 'Step 3 — Voltage drops: V1=1×2=2V  V2=1×3=3V  V3=1×7=7V', sub: 'Check: 2+3+7 = 12V ✓  Must equal battery voltage' },
            ],
            points: [],
            diagram: 'series-calculations'
          },
          {
            subtitle: 'Parallel Circuit — Worked Example',
            emoji: '🔢',
            layout: 'steps',
            items: [
              { label: 'Given: 12V battery, R1=6Ω, R2=4Ω, R3=12Ω in parallel', sub: 'Goal: find branch currents and total current' },
              { label: 'Step 1 — Voltage: V1=V2=V3=12V (same as battery — always start here!)', sub: 'In parallel, every branch sees the full battery voltage' },
              { label: 'Step 2 — Branch currents: I1=12÷6=2A  I2=12÷4=3A  I3=12÷12=1A', sub: 'Each branch uses V=IR independently' },
              { label: 'Step 3 — Total current: I_total = 2+3+1 = 6A', sub: 'Check: all branch currents must add to total ✓' },
            ],
            points: [],
            diagram: 'parallel-calculations'
          },
          {
            subtitle: 'Spot the Circuit Type on Exams',
            emoji: '🔍',
            layout: 'rules',
            items: [
              { icon: '💥', label: '"A bulb goes out when another is removed"', sub: '→ They are in SERIES (one break = everything stops)', color: 'bg-blue-50 border-blue-400' },
              { icon: '✅', label: '"Removing one bulb does not affect the others"', sub: '→ They are in PARALLEL (independent branches)', color: 'bg-orange-50 border-orange-400' },
              { icon: '🔦', label: '"What happens if R2 is added in series?"', sub: '→ R_total increases → current decreases → ALL bulbs dimmer', color: 'bg-yellow-50 border-yellow-400' },
              { icon: '⚡', label: '"Which resistor has more power?" (series circuit)', sub: '→ Bigger R has more power: P=I²R, same I, bigger R = more P', color: 'bg-red-50 border-red-400' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'circuit-problem-solving',
        title: 'Circuit Problem Solving',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'The 5-Step Method — Use Every Time',
            emoji: '🔎',
            layout: 'steps',
            items: [
              { label: 'IDENTIFY — Series or parallel?', sub: 'One path = series. Branches going off the main line = parallel' },
              { label: 'LIST — Write every known value with labels', sub: 'Label every component R1, R2, V1, I1... Write what you know, circle what you need' },
              { label: 'FIND R_total', sub: 'Series: add all resistors. Parallel: 1/Rt = 1/R1 + 1/R2 (or use product-over-sum shortcut for two resistors)' },
              { label: "APPLY Ohm's Law — V=IR at total level first, then at component level", sub: 'Start with what you can calculate, then work outward' },
              { label: 'VERIFY your answer', sub: 'Series: V1+V2+...=Vbat  |  Parallel: I1+I2+...=Itotal' },
            ],
            points: [],
            diagram: 'circuit-troubleshooting'
          },
          {
            subtitle: 'Series vs Parallel — Full Reference',
            emoji: '📊',
            layout: 'cards',
            items: [
              { icon: '🔵', label: 'Series CURRENT', value: 'I same everywhere', sub: 'I1 = I2 = I3 = I_total — current never splits', color: 'bg-blue-50 border-blue-300' },
              { icon: '🔵', label: 'Series VOLTAGE', value: 'Divides up', sub: 'V1 + V2 + V3 = V_battery — each gets a share', color: 'bg-blue-50 border-blue-300' },
              { icon: '🟠', label: 'Parallel VOLTAGE', value: 'V same everywhere', sub: 'V1 = V2 = V3 = V_battery — every branch gets full voltage', color: 'bg-orange-50 border-orange-300' },
              { icon: '🟠', label: 'Parallel CURRENT', value: 'Divides up', sub: 'I1 + I2 + I3 = I_total — current splits across branches', color: 'bg-orange-50 border-orange-300' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'power',
        title: 'Electrical Energy & Power',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Power — 3 Formulas, When to Use Each',
            emoji: '⚡',
            layout: 'formula',
            items: [
              { formula: 'P = V × I', meaning: 'Use when you know Voltage AND Current', example: '120V × 0.5A = 60W', color: 'border-yellow-400', headerBg: 'bg-yellow-500' },
              { formula: 'P = I² × R', meaning: 'Use when you know Current AND Resistance', example: '2² × 10Ω = 40W', color: 'border-orange-400', headerBg: 'bg-orange-500' },
              { formula: 'P = V² ÷ R', meaning: 'Use when you know Voltage AND Resistance', example: '12² ÷ 6Ω = 24W', color: 'border-red-400', headerBg: 'bg-red-500' },
            ],
            points: [],
            diagram: 'power-formula'
          },
          {
            subtitle: 'Energy → Cost — Step by Step',
            emoji: '💰',
            layout: 'steps',
            items: [
              { label: 'Convert Watts → Kilowatts: divide by 1000', sub: 'CRITICAL: skip this step and your answer is 1000× too large!' },
              { label: 'Calculate Energy: E (kWh) = Power (kW) × Time (hours)', sub: 'Example: 1.5kW heater running 8 hours = 12 kWh' },
              { label: 'Calculate Cost: Cost = Energy (kWh) × Rate ($/kWh)', sub: 'Example: 12 kWh × $0.12 = $1.44  |  Ontario rate: ~$0.12–$0.17/kWh' },
            ],
            points: [],
            diagram: 'power-cost'
          },
          {
            subtitle: 'Appliance Power — Know These!',
            emoji: '🏠',
            layout: 'rules',
            items: [
              { icon: '💡', label: 'LED bulb: 10W  vs  Old incandescent: 60W', sub: 'LEDs use 6× LESS energy for the same light', color: 'bg-green-50 border-green-400' },
              { icon: '💻', label: 'Laptop: ~50W  vs  Desktop + monitor: ~250W', sub: 'Laptops are much more energy-efficient', color: 'bg-blue-50 border-blue-400' },
              { icon: '☕', label: 'Kettle: ~1500W  |  Hair dryer: ~1800W', sub: 'Heating elements use the most power — avoid long use', color: 'bg-orange-50 border-orange-400' },
              { icon: '🌀', label: 'Clothes dryer: ~5000W — the biggest home energy user', sub: 'Run at night (off-peak) to save money on time-of-use pricing', color: 'bg-red-50 border-red-400' },
            ],
            points: [],
            diagram: 'appliance-power'
          }
        ]
      },
      {
        id: 'electrical-energy',
        title: 'Energy Conversions & Efficiency',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Law of Conservation of Energy',
            emoji: '♻️',
            layout: 'rules',
            items: [
              { icon: '♾️', label: 'Energy cannot be created or destroyed — only converted', sub: 'Total energy IN always = total energy OUT', color: 'bg-purple-50 border-purple-400' },
              { icon: '🌡️', label: '"Lost" energy is not really lost — it becomes waste heat', sub: 'It just becomes low-quality heat that cannot do useful work', color: 'bg-orange-50 border-orange-400' },
              { icon: '🚫', label: 'Perpetual motion machines are IMPOSSIBLE', sub: 'Some energy is always wasted as heat — no 100% efficient machine exists', color: 'bg-red-50 border-red-400' },
            ],
            points: []
          },
          {
            subtitle: 'Energy Transformations in Devices',
            emoji: '🔄',
            layout: 'cards',
            items: [
              { icon: '🔋', label: 'Battery', value: 'Chemical → Electrical', sub: 'Chemical reactions push electrons through the circuit', color: 'bg-green-50 border-green-300' },
              { icon: '💡', label: 'Light Bulb', value: 'Electrical → Light + Heat', sub: 'Filament gets so hot it glows (incandescent) or electrons excite phosphor (LED)', color: 'bg-yellow-50 border-yellow-300' },
              { icon: '⚙️', label: 'Motor', value: 'Electrical → Mechanical', sub: 'Magnetic force turns a shaft — some energy lost as heat', color: 'bg-blue-50 border-blue-300' },
              { icon: '🔊', label: 'Speaker', value: 'Electrical → Sound', sub: 'Electrical signal vibrates a membrane, which vibrates air', color: 'bg-purple-50 border-purple-300' },
            ],
            points: [],
            diagram: 'energy-transformations'
          },
          {
            subtitle: 'Efficiency — How Much is Actually Useful?',
            emoji: '📊',
            layout: 'formula',
            items: [
              { formula: 'Efficiency (%) = (Useful Output ÷ Total Input) × 100', meaning: 'Always a percentage between 0% and 100% (never reaches 100%)', example: '170J motion from 200J electrical = 85% efficient', color: 'border-emerald-400', headerBg: 'bg-emerald-600' },
            ],
            points: [],
            diagram: 'efficiency'
          },
          {
            subtitle: 'Efficiency Comparison',
            emoji: '📉',
            layout: 'rules',
            items: [
              { icon: '🥇', label: 'Electric motor: ~90% efficient', sub: 'Best common device — most electrical energy becomes motion', color: 'bg-green-50 border-green-400' },
              { icon: '🥈', label: 'LED bulb: ~40% efficient', sub: 'Much better than incandescent but still produces heat', color: 'bg-blue-50 border-blue-400' },
              { icon: '🚗', label: 'Car engine: ~30% efficient', sub: '70% of fuel energy wasted as heat out the exhaust', color: 'bg-orange-50 border-orange-400' },
              { icon: '💡', label: 'Incandescent bulb: ~5% efficient', sub: '95% of electrical energy wasted as heat — that is why they were banned!', color: 'bg-red-50 border-red-400' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'safety',
        title: 'Electrical Safety',
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Current Through the Body — Danger Levels',
            emoji: '☠️',
            layout: 'danger',
            items: [
              { icon: '😐', label: 'Barely noticeable tingle', value: '1 mA', pct: '5%', barColor: '#22C55E', color: 'bg-green-50 border-green-200' },
              { icon: '😬', label: 'Mild shock — uncomfortable', value: '5 mA', pct: '20%', barColor: '#84CC16', color: 'bg-lime-50 border-lime-200' },
              { icon: '😰', label: 'Painful — muscle locks up, may not let go', value: '10–20 mA', pct: '45%', barColor: '#F59E0B', color: 'bg-yellow-50 border-yellow-200' },
              { icon: '💀', label: 'POTENTIALLY FATAL — ventricular fibrillation', value: '50–100 mA', pct: '75%', barColor: '#EF4444', color: 'bg-red-50 border-red-200' },
              { icon: '☠️', label: 'DEFINITELY FATAL — severe burns, heart stops', value: '1–4 A', pct: '100%', barColor: '#991B1B', color: 'bg-red-100 border-red-400' },
            ],
            points: [],
            diagram: 'current-danger'
          },
          {
            subtitle: 'Fuse vs Circuit Breaker',
            emoji: '🛡️',
            layout: 'compare',
            items: [
              {
                label: '🔥 FUSE',
                color: 'bg-red-50 border-red-400',
                rows: ['Thin wire MELTS when overloaded', 'DESTROYED — must be replaced', 'Cheap but single-use', 'Rated in Amps (e.g. 15A)']
              },
              {
                label: '⚡ CIRCUIT BREAKER',
                color: 'bg-green-50 border-green-400',
                rows: ['Switch TRIPS open when overloaded', 'Just RESET — reusable forever', 'Standard in all modern homes', 'Also rated in Amps (e.g. 15A)']
              },
              'GFCI outlets cut power in 0.025 seconds — detects tiny current leaks. Required near water.'
            ],
            points: [],
            diagram: 'fuse-breaker'
          },
          {
            subtitle: 'Golden Safety Rules',
            emoji: '🚫',
            layout: 'rules',
            items: [
              { icon: '💧', label: 'NEVER use electrical devices near water', sub: 'Water lowers skin resistance 1000× — same voltage = far more current through you', color: 'bg-blue-50 border-blue-400' },
              { icon: '🔌', label: 'NEVER overload outlets', sub: 'Total current from all devices can overheat wires and start a fire', color: 'bg-orange-50 border-orange-400' },
              { icon: '⚡', label: 'NEVER touch downed power lines', sub: 'Call 911. Stay at least 10 metres away', color: 'bg-red-50 border-red-500' },
              { icon: '🔧', label: 'ALWAYS unplug before servicing', sub: 'Pull by the plug, not the cord. Replace frayed cords immediately', color: 'bg-gray-50 border-gray-400' },
            ],
            points: []
          },
          {
            subtitle: 'Emergency Response',
            emoji: '🆘',
            layout: 'steps',
            items: [
              { label: 'DO NOT touch someone who is being shocked', sub: 'You will become part of the circuit — current will flow through you too' },
              { label: 'Turn OFF power at the breaker panel', sub: 'OR push the person away using dry non-conductive material (wood, plastic)' },
              { label: 'Call 911 immediately', sub: 'Even if they seem fine — internal burns and heart damage are possible with no visible injuries' },
              { label: 'Electrical fire? NEVER use water', sub: 'Use a Class C (CO₂) fire extinguisher only. Water conducts electricity' },
            ],
            points: []
          }
        ]
      },
    ]
  },
  space: {
    id: 'space',
    name: 'Space: Exploration',
    description: '4 engaging sections on the solar system, space technology, and the universe',
    icon: Globe,
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1200&h=600&fit=crop',
    sections: [
      {
        id: 'space-definitions',
        title: 'Key Space Science Definitions',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Objects in the Solar System',
            emoji: '☀️',
            layout: 'cards',
            items: [
              { icon: '☀️', label: 'STAR', value: 'Nuclear fusion reactor', sub: 'Massive ball of gas producing light & heat. Our Sun fuses H → He', color: 'bg-yellow-50 border-yellow-300' },
              { icon: '🪐', label: 'PLANET', value: 'Orbits star, cleared orbit', sub: '8 in our solar system. Must orbit Sun AND dominate its orbital zone', color: 'bg-blue-50 border-blue-300' },
              { icon: '🔴', label: 'DWARF PLANET', value: 'Orbits star, NOT cleared', sub: 'Pluto, Eris, Ceres. Too small to clear their orbital neighborhood', color: 'bg-red-50 border-red-300' },
              { icon: '🌑', label: 'MOON', value: 'Natural satellite', sub: 'Orbits a planet. Earth has 1. Jupiter has 95! Saturn has 146', color: 'bg-gray-50 border-gray-400' },
              { icon: '🪨', label: 'ASTEROID', value: 'Rocky, in asteroid belt', sub: 'Mostly between Mars and Jupiter. Ceres is the largest', color: 'bg-stone-50 border-stone-300' },
              { icon: '☄️', label: 'COMET', value: 'Icy with tail near Sun', sub: 'Dust and ice. Tail always points AWAY from Sun (solar wind)', color: 'bg-indigo-50 border-indigo-300' },
            ],
            points: []
          },
          {
            subtitle: 'Motion Terms — Rotation vs Revolution',
            emoji: '🌍',
            layout: 'compare',
            items: [
              {
                label: '🔄 ROTATION (spinning)',
                color: 'bg-blue-50 border-blue-400',
                rows: ['Spinning on its own AXIS', 'Earth: 24 hours = 1 day', 'Causes day and night cycle', 'Earth tilts 23.5° on axis']
              },
              {
                label: '🔁 REVOLUTION (orbiting)',
                color: 'bg-purple-50 border-purple-400',
                rows: ['Orbiting AROUND another object', 'Earth: 365.25 days = 1 year', 'Caused by gravity and inertia', 'Closer to Sun = shorter year']
              },
              'Memory: Rotation = spinning like a top. Revolution = racing AROUND a track.'
            ],
            points: []
          },
          {
            subtitle: 'Stars, Galaxies & the Universe',
            emoji: '⭐',
            layout: 'cards',
            items: [
              { icon: '🌌', label: 'GALAXY', value: 'Billions of stars', sub: 'Our galaxy = Milky Way (~300 billion stars). Observable universe has ~2 trillion galaxies', color: 'bg-purple-50 border-purple-300' },
              { icon: '💡', label: 'LIGHT-YEAR', value: '9.46 trillion km', sub: 'Distance light travels in one year. Used to measure space distances', color: 'bg-yellow-50 border-yellow-300' },
              { icon: '💨', label: 'NEBULA', value: 'Star nursery', sub: 'Cloud of gas and dust where new stars form. Orion Nebula visible with binoculars', color: 'bg-pink-50 border-pink-300' },
              { icon: '💥', label: 'SUPERNOVA', value: 'Dying massive star', sub: 'Massive explosion — briefly outshines entire galaxy. Scatters heavy elements into space', color: 'bg-red-50 border-red-300' },
              { icon: '⚫', label: 'BLACK HOLE', value: 'Gravity trap', sub: 'Gravity so strong light cannot escape. Forms when massive star collapses', color: 'bg-gray-900 border-gray-700 text-white' },
              { icon: '🌫️', label: 'DARK MATTER/ENERGY', value: '~95% of universe', sub: 'Cannot be seen but detected by gravity. Dark energy is driving expansion of universe', color: 'bg-indigo-50 border-indigo-300' },
            ],
            points: []
          },
          {
            subtitle: 'Space Exploration Vocabulary',
            emoji: '🚀',
            layout: 'cards',
            items: [
              { icon: '🛰️', label: 'SATELLITE', value: 'Orbits a planet', sub: 'Natural (Moon) or artificial (GPS, weather satellites)', color: 'bg-blue-50 border-blue-300' },
              { icon: '🏠', label: 'SPACE STATION', value: 'Orbiting lab', sub: 'ISS: 400km up, 90 min per orbit, 6 astronauts at a time', color: 'bg-green-50 border-green-300' },
              { icon: '🤖', label: 'ROVER', value: 'Surface explorer', sub: 'Remotely controlled vehicle. Perseverance currently on Mars (2021-)', color: 'bg-red-50 border-red-300' },
              { icon: '🔭', label: 'SPACE TELESCOPE', value: 'Above atmosphere', sub: 'Hubble (1990-): optical. James Webb (2021-): infrared, sees 13.7 billion light-years back', color: 'bg-purple-50 border-purple-300' },
            ],
            points: []
          },
          {
            subtitle: 'Moon Phases & Eclipses',
            emoji: '🌙',
            layout: 'steps',
            items: [
              { label: 'NEW MOON — Moon is between Earth and Sun', sub: 'We see the unlit side. Moon not visible. Spring tides (highest high tides)' },
              { label: 'FIRST QUARTER → FULL MOON — Moon moves to opposite side of Earth', sub: 'Full Moon: Earth between Sun and Moon. We see the fully lit side' },
              { label: 'SOLAR ECLIPSE — Moon blocks Sun (Moon between Earth and Sun)', sub: 'Rare — Moon must be perfectly aligned. Total eclipse only along narrow path' },
              { label: 'LUNAR ECLIPSE — Earth blocks Sun from Moon (Earth between Sun and Moon)', sub: 'Moon turns red ("Blood Moon"). Visible everywhere on the night side of Earth' },
            ],
            points: []
          },
          {
            subtitle: 'Key Space Measurements',
            emoji: '📏',
            layout: 'cards',
            items: [
              { icon: '🌍', label: 'AU (Astronomical Unit)', value: '150 million km', sub: 'Earth-Sun distance. Neptune is 30 AU from the Sun', color: 'bg-blue-50 border-blue-300' },
              { icon: '💡', label: 'Light-year', value: '9.46 × 10¹² km', sub: 'Nearest star (Proxima Centauri): 4.24 light-years away', color: 'bg-yellow-50 border-yellow-300' },
              { icon: '🌎', label: 'Earth to Moon', value: '384,400 km', sub: 'Apollo 11 took 3 days to get there', color: 'bg-gray-50 border-gray-200' },
              { icon: '💨', label: 'Speed of light', value: '300,000 km/s', sub: 'Fastest possible speed. Light takes 8 min 20 sec to reach Earth from Sun', color: 'bg-purple-50 border-purple-300' },
            ],
            points: []
          },
          {
            subtitle: 'Key Space Missions — Timeline',
            emoji: '🏆',
            layout: 'steps',
            items: [
              { label: 'SPUTNIK 1 (1957, USSR) — First artificial satellite', sub: 'Proved humans could put objects into orbit. Kicked off the Space Race' },
              { label: 'APOLLO 11 (1969, USA) — First humans on the Moon', sub: 'Neil Armstrong and Buzz Aldrin landed July 20. "One small step for man..."' },
              { label: 'HUBBLE SPACE TELESCOPE (1990) — Deep space imaging', sub: 'Orbiting optical telescope. Images of galaxies 13 billion light-years away' },
              { label: 'ISS (1998-present) — International Space Station', sub: 'Continuous human presence in space since 2000. 15 nations cooperating' },
              { label: 'JAMES WEBB TELESCOPE (2021) — Infrared, deepest ever view', sub: 'Sees 13.7 billion light-years away — nearly to the Big Bang itself' },
            ],
            points: []
          },
          {
            subtitle: 'The Universe — Big Picture',
            emoji: '🌌',
            layout: 'rules',
            items: [
              { icon: '💥', label: 'BIG BANG THEORY — Universe began ~13.8 billion years ago', sub: 'Everything expanded from an incredibly hot, dense single point. Evidence: cosmic background radiation, redshift', color: 'bg-red-50 border-red-400' },
              { icon: '📡', label: 'COSMIC BACKGROUND RADIATION — Leftover heat from Big Bang', sub: 'Discovered 1965 by accident (appeared as noise in radio telescopes). Strongest evidence for Big Bang', color: 'bg-orange-50 border-orange-400' },
              { icon: '🌌', label: 'UNIVERSE IS STILL EXPANDING — and accelerating', sub: 'All galaxies moving away from each other. Dark energy is driving this acceleration', color: 'bg-blue-50 border-blue-400' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'solar-system',
        title: 'The Solar System',
        image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Inner vs Outer Planets',
            emoji: '🪐',
            layout: 'compare',
            items: [
              {
                label: '🪨 INNER (Terrestrial)',
                color: 'bg-red-50 border-red-400',
                rows: ['Mercury, Venus, Earth, Mars', 'Rocky solid surfaces', 'Small, dense', 'Few or no moons', 'Close to Sun — short years']
              },
              {
                label: '🌪️ OUTER (Gas/Ice Giants)',
                color: 'bg-blue-50 border-blue-400',
                rows: ['Jupiter, Saturn, Uranus, Neptune', 'Mostly gas/ice — no solid surface', 'Huge, low density', 'Many moons + ring systems', 'Far from Sun — long years']
              },
              'Asteroid Belt between Mars and Jupiter separates the two groups.'
            ],
            points: []
          },
          {
            subtitle: 'Planet Facts',
            emoji: '🌍',
            layout: 'cards',
            items: [
              { icon: '⚫', label: 'MERCURY', value: 'Closest to Sun', sub: 'Extreme temps: −180°C to 430°C. No atmosphere to hold heat. No moons', color: 'bg-gray-50 border-gray-200' },
              { icon: '🔥', label: 'VENUS', value: 'Hottest planet (465°C)', sub: 'Thick CO₂ atmosphere causes runaway greenhouse effect. Hotter than Mercury!', color: 'bg-orange-50 border-orange-300' },
              { icon: '🌍', label: 'EARTH', value: 'Only known life', sub: 'Liquid water, ozone layer, perfect temperature range. 1 moon', color: 'bg-blue-50 border-blue-300' },
              { icon: '🔴', label: 'MARS', value: 'Red Planet', sub: 'Iron oxide (rust) gives red color. Polar ice caps. Olympus Mons = largest volcano in solar system', color: 'bg-red-50 border-red-300' },
              { icon: '🟠', label: 'JUPITER', value: 'Largest planet', sub: 'Great Red Spot = storm larger than Earth, raging 350+ years. 95 moons including Europa', color: 'bg-amber-50 border-amber-300' },
              { icon: '🪐', label: 'SATURN', value: 'Famous ring system', sub: 'Rings made of ice and rock. Least dense planet — would float on water!', color: 'bg-yellow-50 border-yellow-300' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'space-tech',
        title: 'Space Technology',
        image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Key Milestones in Order',
            emoji: '📅',
            layout: 'steps',
            items: [
              { label: 'SPUTNIK 1 — Oct 4, 1957 (USSR)', sub: 'First artificial satellite. Proved orbit was possible. Started the Space Race' },
              { label: 'APOLLO 11 — July 20, 1969 (USA)', sub: 'First Moon landing. Armstrong + Aldrin walked on Moon. Collins orbited above' },
              { label: 'HUBBLE SPACE TELESCOPE — 1990 (NASA)', sub: 'Orbiting telescope above atmosphere. Crisp images of deep space. Still operating' },
              { label: 'ISS — 1998–present (15 nations)', sub: 'Permanent human presence in space. Research in microgravity, medicine, engineering' },
            ],
            points: []
          },
          {
            subtitle: 'Types of Spacecraft',
            emoji: '🛸',
            layout: 'cards',
            items: [
              { icon: '🛸', label: 'SPACE PROBE', value: 'Unmanned explorer', sub: 'Voyager 1 (1977) now beyond our solar system. Sends data back to Earth', color: 'bg-blue-50 border-blue-300' },
              { icon: '🤖', label: 'ROVER', value: 'Surface vehicle', sub: 'Perseverance on Mars since 2021. Searches for signs of ancient life', color: 'bg-red-50 border-red-300' },
              { icon: '🏠', label: 'SPACE STATION', value: 'Orbiting habitat', sub: 'ISS: 109m wide, 6 crew, travelling at 27,600 km/h', color: 'bg-green-50 border-green-300' },
              { icon: '🛰️', label: 'SATELLITE', value: 'Communications & observation', sub: 'GPS, weather forecasting, internet, TV — all use satellites', color: 'bg-purple-50 border-purple-300' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'universe',
        title: 'The Universe',
        image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'The Scale of the Universe',
            emoji: '🔭',
            layout: 'steps',
            items: [
              { label: 'YOU → Earth (12,742 km diameter)', sub: 'Your reference point. Light takes 0.04 seconds to travel around Earth' },
              { label: 'Earth → Moon (384,400 km)', sub: 'Light travel time: 1.3 seconds. Apollo took 3 days' },
              { label: 'Earth → Sun (150 million km = 1 AU)', sub: 'Light travel time: 8 minutes 20 seconds' },
              { label: 'Sun → Nearest star (4.24 light-years)', sub: 'Proxima Centauri. Our fastest spacecraft would take 70,000+ years to reach it' },
              { label: 'Our galaxy → edge of observable universe (46 billion light-years)', sub: 'Universe is 13.8 billion years old — but has expanded much farther in that time' },
            ],
            points: []
          },
          {
            subtitle: 'Big Bang & Evidence',
            emoji: '💥',
            layout: 'rules',
            items: [
              { icon: '💥', label: 'BIG BANG — Universe began 13.8 billion years ago', sub: 'All matter, energy, space, and time originated from a single infinitely hot, dense point', color: 'bg-red-50 border-red-400' },
              { icon: '📡', label: 'EVIDENCE 1: Cosmic Microwave Background Radiation', sub: 'Faint afterglow of the Big Bang fills the entire sky. Discovered in 1965 by Penzias & Wilson', color: 'bg-orange-50 border-orange-400' },
              { icon: '🔴', label: 'EVIDENCE 2: Redshift of galaxies', sub: 'All distant galaxies moving away. Like a raisin cake expanding — every raisin sees all others moving away', color: 'bg-yellow-50 border-yellow-400' },
              { icon: '🌌', label: 'Universe is not just expanding — it is ACCELERATING', sub: 'Dark energy (unknown force) is pushing galaxies apart faster over time', color: 'bg-purple-50 border-purple-400' },
            ],
            points: []
          }
        ]
      },
      {
        id: 'chemistry-expert-worksheets',
        title: 'Chemistry Expert Worksheets - Challenge Problems',
        image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'biology-expert-worksheets',
        title: 'Biology Expert Worksheets - Advanced Applications',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'physics-expert-worksheets',
        title: 'Physics Expert Worksheets - Circuit Mastery',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      }
    ]
  }
};

// Achievement definitions
const achievements = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first section',
    icon: Star,
    color: 'from-blue-400 to-blue-600',
    requirement: (stats) => stats.sectionsCompleted >= 1
  },
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Complete 5 sections',
    icon: BookOpen,
    color: 'from-green-400 to-green-600',
    requirement: (stats) => stats.sectionsCompleted >= 5
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Complete 10 sections',
    icon: Brain,
    color: 'from-purple-400 to-purple-600',
    requirement: (stats) => stats.sectionsCompleted >= 10
  },
  {
    id: 'master',
    name: 'Master Student',
    description: 'Complete all sections',
    icon: Trophy,
    color: 'from-yellow-400 to-yellow-600',
    requirement: (stats) => stats.totalSections > 0 && stats.sectionsCompleted >= stats.totalSections
  },
  {
    id: 'quiz-ace',
    name: 'Quiz Ace',
    description: 'Get 5 quiz questions correct',
    icon: Target,
    color: 'from-pink-400 to-pink-600',
    requirement: (stats) => stats.quizCorrect >= 5
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Complete a quiz with 100% accuracy',
    icon: Sparkles,
    color: 'from-amber-400 to-amber-600',
    requirement: (stats) => stats.perfectQuizzes >= 1
  },
  {
    id: 'dedicated',
    name: 'Dedicated Learner',
    description: 'Complete 3 quizzes',
    icon: Flame,
    color: 'from-orange-400 to-orange-600',
    requirement: (stats) => stats.quizzesCompleted >= 3
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'View all subjects',
    icon: Globe,
    color: 'from-teal-400 to-teal-600',
    requirement: (stats) => stats.subjectsViewed >= stats.totalSubjects
  },
  {
    id: 'worksheet-warrior',
    name: 'Worksheet Warrior',
    description: 'Reveal 20 worksheet answers',
    icon: ClipboardList,
    color: 'from-indigo-400 to-indigo-600',
    requirement: (stats) => stats.worksheetAnswersRevealed >= 20
  },
  {
    id: 'search-expert',
    name: 'Search Expert',
    description: 'Use search 10 times',
    icon: Search,
    color: 'from-cyan-400 to-cyan-600',
    requirement: (stats) => stats.searchesPerformed >= 10
  }
];

export default function ScienceStudyLibrary() {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [readSections, setReadSections] = useState(new Set());
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [revealedAnswers, setRevealedAnswers] = useState(new Set());
  
  // Split screen state
  const [splitScreenMode, setSplitScreenMode] = useState(false);
  const [leftPanel, setLeftPanel] = useState(null);
  const [rightPanel, setRightPanel] = useState(null);
  
  // Separate quiz states for each panel
  const [leftQuizState, setLeftQuizState] = useState({
    currentQuestion: 0,
    selectedAnswer: null,
    showExplanation: false,
    score: { correct: 0, total: 0 }
  });
  const [rightQuizState, setRightQuizState] = useState({
    currentQuestion: 0,
    selectedAnswer: null,
    showExplanation: false,
    score: { correct: 0, total: 0 }
  });
  
  // Dropdown state for collapsible sections
  const [expandedDefinitionNotes, setExpandedDefinitionNotes] = useState(new Set());
  
  // Flashcard state
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardStats, setFlashcardStats] = useState({ known: 0, learning: 0 });
  
  // Feature highlights visibility
  const [showFeatureHighlights, setShowFeatureHighlights] = useState(false);
  const internalAIAssistantEnabled = false;
  
  // Achievement tracking
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set());
  const [newAchievement, setNewAchievement] = useState(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [stats, setStats] = useState({
    sectionsCompleted: 0,
    totalSections: 0,
    quizCorrect: 0,
    quizzesCompleted: 0,
    perfectQuizzes: 0,
    subjectsViewed: new Set(),
    totalSubjects: Object.keys(studyLibrary).length,
    worksheetAnswersRevealed: 0,
    searchesPerformed: 0
  });

  // Study Session Manager
  const [showStudyPlanner, setShowStudyPlanner] = useState(false);
  const [studyPlan, setStudyPlan] = useState([]);
  const [currentStudySession, setCurrentStudySession] = useState(null);
  const [studyTimer, setStudyTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Mobile optimization mode
  const [mobileMode, setMobileMode] = useState(false);

  // Premium interest modal
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // L.Y.N.E AI Assistant Widget state
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m L.Y.N.E (Logical Yield Neural Engine), your AI study companion. Ask me anything about your science topics - I can explain concepts, create practice questions, or help you understand difficult material!' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Timer effect for study sessions
  useEffect(() => {
    let interval;
    if (isTimerRunning && currentStudySession) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, currentStudySession]);

  // Calculate efficient study time based on content

  // ── VISUAL NOTE RENDERER ─────────────────────────────────────────────────
  const renderNotePoints = (note: any, gradient: string) => {
    const layout = note.layout || 'bullets';
    const items = note.items || [];

    if (layout === 'cards' && items.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {items.map((item: any, i: number) => (
            <div key={i} className={`rounded-xl border-2 p-3 ${item.color || 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{item.icon}</span>
                <span className="font-bold text-gray-800 text-sm">{item.label}</span>
                {item.value && <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-white/70 text-gray-700`}>{item.value}</span>}
              </div>
              {item.sub && <p className="text-xs text-gray-600 ml-7 leading-relaxed">{item.sub}</p>}
            </div>
          ))}
        </div>
      );
    }

    if (layout === 'rules' && items.length > 0) {
      return (
        <div className="space-y-2 mt-2">
          {items.map((item: any, i: number) => (
            <div key={i} className={`flex items-start gap-3 rounded-xl border-l-4 p-3 ${item.color || 'bg-gray-50 border-gray-200'}`}>
              <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">{item.label}</p>
                {item.sub && <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.sub}</p>}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (layout === 'steps' && items.length > 0) {
      return (
        <div className="space-y-3 mt-2">
          {items.map((item: any, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5 shadow`}>
                {i + 1}
              </div>
              <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                {item.sub && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.sub}</p>}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (layout === 'compare' && items.length >= 2) {
      const [left, right, summary] = items;
      return (
        <div className="mt-2 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[left, right].map((panel: any, i: number) => (
              <div key={i} className={`rounded-xl border-2 p-3 ${panel.color || 'bg-gray-50 border-gray-200'}`}>
                <p className="font-bold text-gray-800 text-sm mb-2">{panel.label}</p>
                <div className="space-y-1">
                  {(panel.rows || []).map((row: string, j: number) => (
                    <div key={j} className="flex items-start gap-1.5">
                      <span className="text-gray-600 mt-1 text-xs flex-shrink-0">•</span>
                      <span className="text-xs text-gray-700 leading-relaxed">{row}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {typeof summary === 'string' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-300 leading-relaxed">{summary}</p>
            </div>
          )}
        </div>
      );
    }

    if (layout === 'formula' && items.length > 0) {
      return (
        <div className="space-y-3 mt-2">
          {items.map((item: any, i: number) => (
            <div key={i} className={`rounded-xl border-2 overflow-hidden ${item.color || 'border-indigo-300'}`}>
              <div className={`${item.headerBg || 'bg-indigo-600'} px-4 py-2`}>
                <p className="text-white font-bold text-lg font-mono tracking-wide">{item.formula}</p>
              </div>
              <div className="bg-gray-100 px-4 py-3 space-y-1">
                {item.meaning && <p className="text-sm text-gray-700">{item.meaning}</p>}
                {item.example && <p className="text-xs text-gray-500 font-mono bg-gray-50 rounded px-2 py-1">{item.example}</p>}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (layout === 'danger' && items.length > 0) {
      return (
        <div className="space-y-2 mt-2">
          {items.map((item: any, i: number) => (
            <div key={i} className={`rounded-xl p-3 ${item.color || 'bg-red-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{item.icon}</span>
                <span className="font-semibold text-sm text-gray-800">{item.label}</span>
                <span className="ml-auto text-xs font-bold text-red-300">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className={`h-full rounded-full ${item.barColor || 'bg-red-500'}`} style={{width: `${item.pct || 50}%`}} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Default: bullets (layout === 'bullets' or fallback)
    const points = note.points || [];
    return (
      <div className="space-y-1 mt-2">
        {points.map((point: string, i: number) => (
          <div key={i} className="flex items-start gap-2">
            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient} flex-shrink-0`} />
            <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
          </div>
        ))}
      </div>
    );
  };

  const calculateStudyTime = (section) => {
    // Quiz sections - quick practice and review
    if (section.quiz && section.quiz.length > 0) {
      const questionsCount = section.quiz.length;
      // 1 minute per question (efficient: read, answer, check explanation)
      return Math.max(Math.ceil(questionsCount * 1), 10); // minimum 10 minutes
    }
    
    // Flashcard sections - focused memorization
    if (section.flashcards && section.flashcards.length > 0) {
      const cardsCount = section.flashcards.length;
      // Quick review: 20 seconds per card (one focused pass)
      return Math.ceil(cardsCount * 0.33); // ~20 sec each
    }
    
    // Notes/reading sections - efficient scanning and key points
    if (section.notes && section.notes.length > 0) {
      let totalTime = 0;
      
      section.notes.forEach(note => {
        const pointsCount = (note.items || note.points).length;
        
        // Definition sections - skim and highlight key terms
        if (section.id.includes('definitions')) {
          // 20 seconds per definition (quick read)
          totalTime += pointsCount * 0.33;
        }
        // Worksheet sections - attempt key problems
        else if (section.id.includes('worksheet')) {
          // 1.5 minutes per problem (quick attempt + answer check)
          totalTime += pointsCount * 1.5;
        }
        // Regular content sections - read for understanding
        else {
          // 30 seconds per point (efficient reading)
          totalTime += pointsCount * 0.5;
        }
        
        // Add minimal time for diagrams (visual learners absorb quickly)
        if (note.diagram) {
          totalTime += 2; // 2 minutes to review each diagram
        }
      });
      
      // Add small buffer for focus
      return Math.ceil(totalTime * 1.1); // 10% buffer
    }
    
    return 15; // default fallback
  };

  // Add function to add section to study plan
  const addToStudyPlan = (subject, section) => {
    const estimatedTime = calculateStudyTime(section);
    const newItem = {
      id: `${subject.id}-${section.id}-${Date.now()}`,
      subject,
      section,
      estimatedTime,
      completed: false
    };
    setStudyPlan([...studyPlan, newItem]);
  };

  // Remove from study plan
  const removeFromStudyPlan = (itemId) => {
    setStudyPlan(studyPlan.filter(item => item.id !== itemId));
  };

  // Start study session
  const startStudySession = (item) => {
    setCurrentStudySession(item);
    setStudyTimer(0);
    setIsTimerRunning(true);
  };

  // End study session
  const endStudySession = () => {
    if (currentStudySession) {
      const updatedPlan = studyPlan.map(item => 
        item.id === currentStudySession.id ? { ...item, completed: true } : item
      );
      setStudyPlan(updatedPlan);
    }
    setCurrentStudySession(null);
    setIsTimerRunning(false);
    setStudyTimer(0);
  };

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Play welcome sound on mount
  useEffect(() => {
    // Create AudioContext
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Function to play a note
    const playNote = (frequency, startTime, duration) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      // Envelope for smooth sound
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    // Play a cheerful welcome melody (C-E-G-C chord arpeggio)
    const now = audioContext.currentTime;
    playNote(523.25, now, 0.15);        // C5
    playNote(659.25, now + 0.1, 0.15);  // E5
    playNote(783.99, now + 0.2, 0.15);  // G5
    playNote(1046.50, now + 0.3, 0.3);  // C6 (longer)
    
    // Cleanup
    return () => {
      audioContext.close();
    };
  }, []);

  // Calculate total sections on mount
  useEffect(() => {
    const total = Object.values(studyLibrary).reduce((sum, subject) => sum + subject.sections.length, 0);
    setStats(prev => ({ ...prev, totalSections: total }));
  }, []);

  // Check for new achievements whenever stats change
  useEffect(() => {
    achievements.forEach(achievement => {
      if (!unlockedAchievements.has(achievement.id) && achievement.requirement(stats)) {
        setUnlockedAchievements(prev => new Set([...prev, achievement.id]));
        setNewAchievement(achievement);
        setTimeout(() => setNewAchievement(null), 5000);
      }
    });
  }, [stats, unlockedAchievements]);

  // AI Assistant handler
  const handleAISubmit = async (e) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiThinking) return;

    const userMessage = aiInput.trim();
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsAiThinking(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are a helpful Grade 9 science tutor for Appleby College students. The student is studying Biology (biodiversity, ecosystems, food chains), Chemistry (matter, atoms, periodic table), Physics (electricity, circuits), and Space. 

Be encouraging, clear, and concise. Use analogies when helpful. If asked for practice questions, create them. If explaining concepts, break them down simply.

Student question: ${userMessage}`
            }
          ]
        })
      });

      const data = await response.json();
      const assistantMessage = data.content[0].text;

      setAiMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      setAiMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try asking your question again!' 
      }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const toggleDefinitionNote = (sectionId, noteIndex) => {
    const key = `${sectionId}-${noteIndex}`;
    const newExpanded = new Set(expandedDefinitionNotes);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedDefinitionNotes(newExpanded);
  };

  const toggleRead = (sectionId) => {
    const newRead = new Set(readSections);
    if (newRead.has(sectionId)) {
      newRead.delete(sectionId);
      setStats(prev => ({ ...prev, sectionsCompleted: prev.sectionsCompleted - 1 }));
    } else {
      newRead.add(sectionId);
      setStats(prev => ({ ...prev, sectionsCompleted: prev.sectionsCompleted + 1 }));
    }
    setReadSections(newRead);
  };

  const toggleAnswer = (noteIndex, pointIndex) => {
    const key = `${noteIndex}-${pointIndex}`;
    const newRevealed = new Set(revealedAnswers);
    if (newRevealed.has(key)) {
      newRevealed.delete(key);
      setStats(prev => ({ ...prev, worksheetAnswersRevealed: Math.max(0, prev.worksheetAnswersRevealed - 1) }));
    } else {
      newRevealed.add(key);
      setStats(prev => ({ ...prev, worksheetAnswersRevealed: prev.worksheetAnswersRevealed + 1 }));
    }
    setRevealedAnswers(newRevealed);
  };

  const startQuiz = (section) => {
    setCurrentQuiz(section);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizScore({ correct: 0, total: 0 });
    setAnsweredQuestions([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerSelect = (answerIndex) => {
    if (!showExplanation) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleCheckAnswer = () => {
    const isCorrect = selectedAnswer === currentQuiz.quiz[currentQuestion].correct;
    setShowExplanation(true);
    setAnsweredQuestions([...answeredQuestions, { 
      questionIndex: currentQuestion, 
      selectedAnswer, 
      isCorrect 
    }]);
    if (isCorrect) {
      setQuizScore({ ...quizScore, correct: quizScore.correct + 1, total: quizScore.total + 1 });
      setStats(prev => ({ ...prev, quizCorrect: prev.quizCorrect + 1 }));
    } else {
      setQuizScore({ ...quizScore, total: quizScore.total + 1 });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < currentQuiz.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Quiz completed
      const isPerfect = quizScore.correct + 1 === currentQuiz.quiz.length;
      setStats(prev => ({ 
        ...prev, 
        quizzesCompleted: prev.quizzesCompleted + 1,
        perfectQuizzes: isPerfect ? prev.perfectQuizzes + 1 : prev.perfectQuizzes
      }));
      setCurrentQuiz(null);
      setSelectedSection(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    
    if (value.trim().length > 0) {
      setStats(prev => ({ ...prev, searchesPerformed: prev.searchesPerformed + 1 }));
      
      const results = [];
      const searchLower = value.toLowerCase();
      
      Object.values(studyLibrary).forEach(subject => {
        subject.sections.forEach(section => {
          // Check section title
          if (section.title.toLowerCase().includes(searchLower)) {
            results.push({
              type: 'section',
              subject: subject,
              section: section,
              title: section.title,
              match: 'Section Title',
              relevance: section.title.toLowerCase().indexOf(searchLower) === 0 ? 3 : 2
            });
          }
          
          // Check note subtitles and content
          section.notes.forEach(note => {
            if (note.subtitle.toLowerCase().includes(searchLower)) {
              results.push({
                type: 'note',
                subject: subject,
                section: section,
                title: `${section.title} - ${note.subtitle}`,
                match: 'Topic',
                relevance: note.subtitle.toLowerCase().indexOf(searchLower) === 0 ? 3 : 2
              });
            }
            
            // Check points for matches
            note.points.forEach(point => {
              if (point.toLowerCase().includes(searchLower)) {
                results.push({
                  type: 'content',
                  subject: subject,
                  section: section,
                  title: `${section.title} - ${note.subtitle}`,
                  preview: point.substring(0, 80) + (point.length > 80 ? '...' : ''),
                  match: 'Content',
                  relevance: 1
                });
              }
            });
          });
        });
      });
      
      // Sort by relevance and remove duplicates
      const uniqueResults = [];
      const seen = new Set();
      
      results
        .sort((a, b) => b.relevance - a.relevance)
        .forEach(result => {
          const key = `${result.section.id}-${result.type}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueResults.push(result);
          }
        });
      
      setSearchResults(uniqueResults.slice(0, 8)); // Limit to 8 results
      setShowSearchDropdown(uniqueResults.length > 0);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const handleSearchResultClick = (result) => {
    if (splitScreenMode && !leftPanel) {
      setLeftPanel({ subject: result.subject, section: result.section, type: 'notes' });
    } else if (splitScreenMode && !rightPanel) {
      setRightPanel({ subject: result.subject, section: result.section, type: 'notes' });
    } else {
      setSelectedSubject(result.subject);
      setSelectedSection(result.section);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setSearchTerm('');
    setShowSearchDropdown(false);
    setStats(prev => ({ 
      ...prev, 
      subjectsViewed: new Set([...prev.subjectsViewed, result.subject.id])
    }));
  };

  const openInSplitScreen = (subject, section, type = 'notes') => {
    setSplitScreenMode(true);
    if (!leftPanel) {
      setLeftPanel({ subject, section, type });
    } else if (!rightPanel) {
      setRightPanel({ subject, section, type });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeSplitScreen = () => {
    setSplitScreenMode(false);
    setLeftPanel(null);
    setRightPanel(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFlashcardKnown = () => {
    setFlashcardStats(prev => ({ ...prev, known: prev.known + 1 }));
    handleNextFlashcard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFlashcardLearning = () => {
    setFlashcardStats(prev => ({ ...prev, learning: prev.learning + 1 }));
    handleNextFlashcard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextFlashcard = () => {
    if (currentFlashcard < selectedSection.flashcards.length - 1) {
      setCurrentFlashcard(currentFlashcard + 1);
      setIsFlipped(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Flashcards completed
      setCurrentFlashcard(0);
      setIsFlipped(false);
      setSelectedSection(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousFlashcard = () => {
    if (currentFlashcard > 0) {
      setCurrentFlashcard(currentFlashcard - 1);
      setIsFlipped(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Achievement notification popup
  const AchievementPopup = ({ achievement }) => {
    if (!achievement) return null;
    
    const Icon = achievement.icon;
    
    return (
      <div className="fixed top-4 right-4 z-50 animate-bounce">
        <div className={`bg-gradient-to-r ${achievement.color} rounded-2xl shadow-2xl p-6 text-white max-w-sm border-4 border-white`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4" />
                <p className="text-xs font-bold uppercase tracking-wider">Achievement Unlocked!</p>
              </div>
              <h3 className="text-xl font-bold">{achievement.name}</h3>
              <p className="text-white/90 text-sm">{achievement.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Premium Interest Modal Component
  const PremiumInterestModal = () => {
    if (!showPremiumModal) return null;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl border border-gray-200 max-w-2xl w-full my-8 animate-fadeIn">
          <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gray-200 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-200 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-2xl">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Unlock Premium</h2>
                    <p className="text-white/90">Get full access to advanced content</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                What's Included in Premium?
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-[#0a0f1e] to-[#0d0a1e] rounded-xl border-2 border-blue-200">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Advanced Quiz Library</h4>
                    <p className="text-sm text-gray-600">4 premium quizzes with 50+ advanced questions personally crafted by Dean</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-[#060f0a] to-[#081408] rounded-xl border-2 border-green-200">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Exclusive Flashcard Sets</h4>
                    <p className="text-sm text-gray-600">50+ additional flashcards with expert explanations</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-[#120a1e] to-[#180a14] rounded-xl border-2 border-purple-200">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Detailed Study Guides</h4>
                    <p className="text-sm text-gray-600">Comprehensive summaries and exam-ready cheat sheets</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Personal Updates by Dean</h4>
                    <p className="text-sm text-gray-600">Continuously updated with new features and content as you study</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border-2 border-rose-200">
                  <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Direct Support Access</h4>
                    <p className="text-sm text-gray-600">Get help directly from Dean for any questions or improvements</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border-2 border-cyan-200">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Custom Study Tools</h4>
                    <p className="text-sm text-gray-600">Advanced features tailored specifically for Appleby students</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80 mb-1">One-time payment</p>
                  <p className="text-4xl font-bold">Affordable Price</p>
                  <p className="text-white/90 mt-2">Lifetime access • No subscriptions • Pay once, use forever</p>
                  <p className="text-white/80 text-sm mt-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold">Personally maintained and updated by Dean Concepcion</span>
                  </p>
                </div>
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Trophy className="w-10 h-10" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0a0f1e] to-[#0d0a1e] rounded-2xl p-6 border-2 border-blue-200 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Why Premium is Worth It</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span><span className="font-semibold">Continuously evolving:</span> Dean personally adds new quizzes, diagrams, and study tools based on student feedback</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span><span className="font-semibold">Appleby-specific:</span> Content tailored exactly to the Grade 9 Appleby curriculum and teaching style</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span><span className="font-semibold">Direct creator access:</span> Get personalized help and request specific features from Dean himself</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span><span className="font-semibold">Advanced AI features:</span> Premium unlocks enhanced L.Y.N.E AI capabilities for deeper explanations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Interested in Premium?</h3>
                  <p className="text-gray-600 mb-4">
                    Contact <span className="font-bold text-blue-600">Dean Concepcion</span> for pricing details and to unlock your premium access.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="mailto:2029089@appleby.on.ca?subject=Premium%20Access%20Inquiry%20-%20Grade%209%20Science%20Study%20Library&body=Hi%20Dean,%0D%0A%0D%0AI'm%20interested%20in%20upgrading%20to%20premium%20access%20for%20the%20Grade%209%20Science%20Study%20Library.%0D%0A%0D%0APlease%20send%20me%20more%20details%20about%20pricing%20and%20how%20to%20unlock%20the%20premium%20content.%0D%0A%0D%0AThank%20you!"
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact Dean
                    </a>
                    
                    <button
                      onClick={() => setShowPremiumModal(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Study Planner Modal Component
  const StudyPlannerModal = () => {
    if (!showStudyPlanner) return null;

    const totalTime = studyPlan.reduce((sum, item) => sum + item.estimatedTime, 0);
    const completedTime = studyPlan.filter(item => item.completed).reduce((sum, item) => sum + item.estimatedTime, 0);
    const progressPercent = totalTime > 0 ? (completedTime / totalTime) * 100 : 0;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Study Session Planner</h2>
                  <p className="text-white/80">Organize your study time efficiently</p>
                </div>
              </div>
              <button
                onClick={() => setShowStudyPlanner(false)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Progress Bar */}
            {studyPlan.length > 0 && (
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Overall Progress</span>
                  <span className="text-sm">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-indigo-400 h-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>{completedTime} / {totalTime} minutes completed</span>
                  <span>{studyPlan.filter(i => i.completed).length} / {studyPlan.length} items</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
            {studyPlan.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Study Sessions Planned</h3>
                <p className="text-gray-500 mb-4">Add sections from the library to create your study schedule</p>
                <button
                  onClick={() => setShowStudyPlanner(false)}
                  className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-colors"
                >
                  Browse Library
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {studyPlan.map((item, index) => (
                  <div
                    key={item.id}
                    className={`rounded-xl border-2 overflow-hidden transition-all ${
                      item.completed
                        ? 'bg-green-50 border-green-200'
                        : currentStudySession?.id === item.id
                        ? 'bg-blue-50 border-blue-300 shadow-lg'
                        : 'bg-white border-gray-200 hover:border-gray-200'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Session Number */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${
                          item.completed
                            ? 'bg-green-500 text-white'
                            : currentStudySession?.id === item.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {item.completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-gray-800 mb-1">{item.section.title}</h3>
                              <p className="text-sm text-gray-600">{item.subject.name}</p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                              <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                                item.completed
                                  ? 'bg-green-100 text-green-300'
                                  : currentStudySession?.id === item.id
                                  ? 'bg-blue-100 text-blue-300'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {item.estimatedTime} min
                              </div>
                            </div>
                          </div>

                          {/* Timer for current session */}
                          {currentStudySession?.id === item.id && (
                            <div className="bg-blue-100 rounded-lg p-3 mb-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-blue-300">Time Elapsed:</span>
                                <span className="text-2xl font-bold text-blue-600">{formatTime(studyTimer)}</span>
                              </div>
                              <div className="mt-2 w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-blue-500 h-full transition-all"
                                  style={{ 
                                    width: `${Math.min((studyTimer / (item.estimatedTime * 60)) * 100, 100)}%` 
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {!item.completed && currentStudySession?.id !== item.id && (
                              <button
                                onClick={() => startStudySession(item)}
                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors"
                              >
                                Start Session
                              </button>
                            )}
                            
                            {currentStudySession?.id === item.id && (
                              <>
                                <button
                                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors"
                                >
                                  {isTimerRunning ? 'Pause' : 'Resume'}
                                </button>
                                <button
                                  onClick={endStudySession}
                                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
                                >
                                  Complete
                                </button>
                              </>
                            )}
                            
                            <button
                              onClick={() => {
                                setSelectedSubject(item.subject);
                                setSelectedSection(item.section);
                                setShowStudyPlanner(false);
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                            >
                              View
                            </button>
                            
                            {!item.completed && currentStudySession?.id !== item.id && (
                              <button
                                onClick={() => removeFromStudyPlan(item.id)}
                                className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {studyPlan.length > 0 && (
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (confirm('Clear all study sessions?')) {
                      setStudyPlan([]);
                      setCurrentStudySession(null);
                      setIsTimerRunning(false);
                    }
                  }}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-colors"
                >
                  Clear All
                </button>
                <div className="text-sm text-gray-600">
                  Total estimated study time: <span className="font-bold text-gray-800">{totalTime} minutes</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Achievements modal
  const AchievementsModal = () => {
    if (!showAchievements) return null;
    
    const unlockedCount = unlockedAchievements.size;
    const totalCount = achievements.length;
    const progress = (unlockedCount / totalCount) * 100;
    
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                <h2 className="text-3xl font-bold">Achievements</h2>
              </div>
              <button
                onClick={() => setShowAchievements(false)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/90">Progress: {unlockedCount} of {totalCount}</p>
                <p className="font-bold">{Math.round(progress)}%</p>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-400 to-indigo-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map(achievement => {
                const isUnlocked = unlockedAchievements.has(achievement.id);
                const Icon = achievement.icon;
                
                return (
                  <div
                    key={achievement.id}
                    className={`rounded-xl p-6 border-2 transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isUnlocked
                          ? `bg-gradient-to-r ${achievement.color}`
                          : 'bg-gray-300'
                      }`}>
                        <Icon className={`w-8 h-8 ${isUnlocked ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-lg font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                            {achievement.name}
                          </h3>
                          {isUnlocked && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </div>
                        <p className={`text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-600'}`}>
                          {achievement.description}
                        </p>
                        {!isUnlocked && (
                          <p className="text-xs text-gray-600 mt-2">🔒 Locked</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Split Screen Rendering Component
  const renderPanelContent = (panel, panelSide) => {
    if (!panel) {
      return (
        <div className="h-full flex items-center justify-center text-gray-600">
          <div className="text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="font-semibold">Select content to view here</p>
            <p className="text-sm mt-2">Click any section or quiz to open</p>
          </div>
        </div>
      );
    }

    const { subject, section, type } = panel;
    
    // Get the correct quiz state for this panel
    const quizState = panelSide === 'left' ? leftQuizState : rightQuizState;
    const setQuizState = panelSide === 'left' ? setLeftQuizState : setRightQuizState;
    
    // Close button for the panel
    const closePanel = () => {
      if (panelSide === 'left') {
        setLeftPanel(null);
        setLeftQuizState({ currentQuestion: 0, selectedAnswer: null, showExplanation: false, score: { correct: 0, total: 0 } });
      } else {
        setRightPanel(null);
        setRightQuizState({ currentQuestion: 0, selectedAnswer: null, showExplanation: false, score: { correct: 0, total: 0 } });
      }
      
      // If both panels are empty, exit split screen
      if ((panelSide === 'left' && !rightPanel) || (panelSide === 'right' && !leftPanel)) {
        setSplitScreenMode(false);
      }
    };

    if (type === 'quiz' && section.quiz) {
      // Mini quiz view for split screen
      const question = section.quiz[quizState.currentQuestion];
      const quizProgress = ((quizState.currentQuestion + 1) / section.quiz.length) * 100;
      
      return (
        <div className="h-full overflow-y-auto p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
            <button
              onClick={closePanel}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Question {quizState.currentQuestion + 1} of {section.quiz.length}</p>
              <p className="text-sm font-bold text-gray-800">{quizState.score.correct}/{quizState.score.total}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${subject.gradient} h-2 rounded-full transition-all`}
                style={{ width: `${quizProgress}%` }}
              />
            </div>
          </div>

          <h4 className="text-lg font-semibold text-gray-800 mb-4">{question.question}</h4>

          <div className="space-y-2 mb-4">
            {question.options.map((option, idx) => {
              let buttonStyle = 'border-gray-200 bg-white hover:border-gray-400';
              
              if (quizState.showExplanation) {
                if (idx === question.correct) {
                  buttonStyle = 'border-green-500 bg-green-50';
                } else if (idx === quizState.selectedAnswer) {
                  buttonStyle = 'border-red-500 bg-red-50';
                }
              } else if (quizState.selectedAnswer === idx) {
                buttonStyle = 'border-blue-500 bg-blue-50';
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (!quizState.showExplanation) {
                      setQuizState({ ...quizState, selectedAnswer: idx });
                    }
                  }}
                  disabled={quizState.showExplanation}
                  className={`w-full p-3 text-left text-sm rounded-lg border-2 transition-all ${buttonStyle}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {quizState.showExplanation && (
            <div className="p-3 rounded-lg mb-4 bg-blue-50 border-2 border-blue-200">
              <p className="text-sm font-semibold text-blue-300 mb-1">
                {quizState.selectedAnswer === question.correct ? '✓ Correct!' : 'Explanation:'}
              </p>
              <p className="text-sm text-gray-700">{question.explanation}</p>
            </div>
          )}

          {!quizState.showExplanation ? (
            <button
              onClick={() => {
                const isCorrect = quizState.selectedAnswer === question.correct;
                setQuizState({
                  ...quizState,
                  showExplanation: true,
                  score: {
                    correct: isCorrect ? quizState.score.correct + 1 : quizState.score.correct,
                    total: quizState.score.total + 1
                  }
                });
                if (isCorrect) {
                  setStats(prev => ({ ...prev, quizCorrect: prev.quizCorrect + 1 }));
                }
              }}
              disabled={quizState.selectedAnswer === null}
              className={`w-full py-2 bg-gradient-to-r ${subject.gradient} text-white rounded-lg font-semibold text-sm disabled:opacity-50`}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={() => {
                if (quizState.currentQuestion < section.quiz.length - 1) {
                  setQuizState({
                    ...quizState,
                    currentQuestion: quizState.currentQuestion + 1,
                    selectedAnswer: null,
                    showExplanation: false
                  });
                } else {
                  // Quiz completed
                  const isPerfect = quizState.score.correct + 1 === section.quiz.length;
                  setStats(prev => ({ 
                    ...prev, 
                    quizzesCompleted: prev.quizzesCompleted + 1,
                    perfectQuizzes: isPerfect ? prev.perfectQuizzes + 1 : prev.perfectQuizzes
                  }));
                  closePanel();
                }
              }}
              className={`w-full py-2 bg-gradient-to-r ${subject.gradient} text-white rounded-lg font-semibold text-sm`}
            >
              {quizState.currentQuestion < section.quiz.length - 1 ? 'Next →' : 'Finish'}
            </button>
          )}
        </div>
      );
    }

    // Notes view for split screen
    const isWorksheet = subject.id === 'worksheets';
    
    return (
      <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-[#0a0a12] to-[#111118]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
          <button
            onClick={closePanel}
            className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-200 flex items-center justify-center shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {section.notes.map((note, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className={`bg-gradient-to-r ${subject.gradient} p-3`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{note.emoji}</span>
                  <h4 className="text-lg font-bold text-white">{note.subtitle}</h4>
                </div>
              </div>
              
              <div className="p-4">
                <div>
                  {renderNotePoints(note, subject.gradient)}
                </div>
                
                {note.diagram && (
                  <div className="mt-4 text-xs">
                    {note.diagram === 'lewis' && <LewisDotDiagram />}
                    {note.diagram === 'bohr' && <BohrDiagram />}
                    {note.diagram === 'energy-pyramid' && <EnergyPyramid />}
                    {note.diagram === 'carbon-cycle' && <CarbonCycle />}
                    {note.diagram === 'atomic-models' && <AtomicModels />}
                    {note.diagram === 'periodic-table' && <PeriodicTableDiagram />}
                    {note.diagram === 'ions' && <IonDiagram />}
                    {note.diagram === 'circuit-symbols' && <CircuitSymbolsDiagram />}
                    {note.diagram === 'series-circuit' && <SeriesCircuitDiagram />}
                    {note.diagram === 'parallel-circuit' && <ParallelCircuitDiagram />}
                    {note.diagram === 'ohms-law' && <OhmsLawTriangle />}
                    {note.diagram === 'static-electricity' && <StaticElectricityDiagram />}
                    {note.diagram === 'power-formula' && <PowerFormulaDiagram />}
                    {note.diagram === 'complete-circuit' && <CircuitDiagram />}
                    {note.diagram === 'water-analogy' && <WaterAnalogyDiagram />}
                    {note.diagram === 'ohms-law-worked' && <OhmsLawWorkedExamples />}
                    {note.diagram === 'series-calculations' && <SeriesCircuitCalculations />}
                    {note.diagram === 'parallel-calculations' && <ParallelCircuitCalculations />}
                    {note.diagram === 'charging-methods' && <ChargingMethodsDiagram />}
                    {note.diagram === 'resistance-factors' && <ResistanceFactorsDiagram />}
                    {note.diagram === 'safety-devices' && <ElectricalSafetyDiagram />}
                    {note.diagram === 'power-cost' && <PowerCostCalculatorDiagram />}
                    {note.diagram === 'static-vs-current' && <StaticVsCurrentDiagram />}
                    {note.diagram === 'electroscope' && <ElectroscopeDiagram />}
                    {note.diagram === 'lightning' && <LightningDiagram />}
                    {note.diagram === 'ohms-law-graph' && <OhmsLawGraph />}
                    {note.diagram === 'ammeter-voltmeter' && <AmpmeterVoltmeterDiagram />}
                    {note.diagram === 'series-parallel-table' && <SeriesParallelComparisonTable />}
                    {note.diagram === 'energy-conversion' && <EnergyConversionDiagram />}
                    {note.diagram === 'circuit-troubleshooting' && <CircuitTroubleshootingDiagram />}
                    {note.diagram === 'renewable-energy' && <RenewableEnergyDiagram />}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Split screen mode
  if (splitScreenMode) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-[#0a0a12] to-[#111118]">
        <AchievementPopup achievement={newAchievement} />
        <AchievementsModal />
        
        {/* L.Y.N.E AI Assistant Widget */}
        {internalAIAssistantEnabled && showAIAssistant && (
          <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center relative">
                  <Sparkles className="w-5 h-5" />
                  <div className="absolute inset-0 rounded-full bg-gray-200 animate-ping"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-widest text-white" style={{fontFamily:"Space Mono,monospace"}}>L.Y.N.E</h3>
                  <p className="text-xs text-white/90 font-semibold">Logical Yield Neural Engine</p>
                  <p className="text-xs text-white/70">Your AI Study Companion</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIAssistant(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAISubmit(e);
                    }
                  }}
                  placeholder="Ask a question..."
                  className="flex-1 px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-800 focus:border-cyan-500 focus:outline-none text-sm placeholder:text-gray-400"
                  disabled={isAiThinking}
                />
                <button
                  onClick={handleAISubmit}
                  disabled={!aiInput.trim() || isAiThinking}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  {isAiThinking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : (
                    <>Send</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* L.Y.N.E AI Assistant Toggle Button */}
        {internalAIAssistantEnabled && !showAIAssistant && (
          <button
            onClick={() => setShowAIAssistant(true)}
            className="fixed bottom-6 right-6 group z-50"
          >
            <div className="relative">
              {/* Pulsing ring */}
              <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-ping opacity-60"></div>
              
              {/* Main button */}
              <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:shadow-blue-500/30 transition-all">
                <Sparkles className="w-6 h-6" />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shadow-xl">
                  Chat with L.Y.N.E
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </button>
        )}
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 text-white shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Split Screen Study Mode</h1>
                <p className="text-xs text-slate-300">View notes and quizzes side by side</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSplitScreenMode(false);
                  setLeftPanel(null);
                  setRightPanel(null);
                  setSelectedSubject(null);
                  setSelectedSection(null);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Library
              </button>
              
              <button
                onClick={closeSplitScreen}
                className="px-4 py-2 bg-gray-200 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Exit Split View
              </button>
            </div>
          </div>
        </div>

        {/* Content browser sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar for browsing content */}
          <div className="w-80 bg-white border-r-2 border-gray-200 overflow-y-auto p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Browse Content</h3>
            
            <div className="space-y-4">
              {Object.values(studyLibrary).map(subject => (
                <div key={subject.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className={`bg-gradient-to-r ${subject.gradient} p-3`}>
                    <div className="flex items-center gap-2">
                      <subject.icon className="w-5 h-5 text-white" />
                      <h4 className="font-bold text-white text-sm">{subject.name}</h4>
                    </div>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    {subject.sections.map(section => (
                      <button
                        key={section.id}
                        onClick={() => {
                          // Skip flashcards and locked sections in split screen
                          if (section.flashcards && section.flashcards.length > 0) {
                            return;
                          }
                          if (section.locked) {
                            return;
                          }
                          
                          const panelData = { subject, section, type: section.quiz ? 'quiz' : 'notes' };
                          if (!leftPanel) {
                            setLeftPanel(panelData);
                            setLeftQuizState({ currentQuestion: 0, selectedAnswer: null, showExplanation: false, score: { correct: 0, total: 0 } });
                          } else if (!rightPanel) {
                            setRightPanel(panelData);
                            setRightQuizState({ currentQuestion: 0, selectedAnswer: null, showExplanation: false, score: { correct: 0, total: 0 } });
                          } else {
                            // Replace right panel if both are filled
                            setRightPanel(panelData);
                            setRightQuizState({ currentQuestion: 0, selectedAnswer: null, showExplanation: false, score: { correct: 0, total: 0 } });
                          }
                        }}
                        disabled={section.flashcards && section.flashcards.length > 0 || section.locked}
                        className={`w-full text-left p-2 text-sm rounded-lg transition-colors ${
                          section.locked
                            ? 'opacity-50 cursor-not-allowed blur-sm'
                            : section.flashcards && section.flashcards.length > 0
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {section.quiz ? (
                            <FileText className="w-4 h-4 text-indigo-500" />
                          ) : section.flashcards && section.flashcards.length > 0 ? (
                            <Brain className="w-4 h-4 text-cyan-500" />
                          ) : (
                            <BookOpen className="w-4 h-4 text-emerald-500" />
                          )}
                          <span className="text-gray-600 text-xs">{section.title}</span>
                          {section.flashcards && section.flashcards.length > 0 && (
                            <span className="ml-auto text-xs text-gray-600">(Full screen only)</span>
                          )}
                          {section.locked && (
                            <span className="ml-auto text-xs text-gray-600">(Premium)</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Split panels */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel */}
            <div className="flex-1 border-r-2 border-gray-200 overflow-hidden">
              {renderPanelContent(leftPanel, 'left')}
            </div>

            {/* Right Panel */}
            <div className="flex-1 overflow-hidden">
              {renderPanelContent(rightPanel, 'right')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Flashcard interface
  if (selectedSection && selectedSection.flashcards && selectedSection.flashcards.length > 0) {
    const flashcard = selectedSection.flashcards[currentFlashcard];
    const progress = ((currentFlashcard + 1) / selectedSection.flashcards.length) * 100;

    return (
      <div className="min-h-screen bg-[#f5f4f0] soul-grid">
      <SoulStyles />
        {/* L.Y.N.E AI Assistant Widget */}
        {internalAIAssistantEnabled && showAIAssistant && (
          <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center relative">
                  <Sparkles className="w-5 h-5" />
                  <div className="absolute inset-0 rounded-full bg-gray-200 animate-ping"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-widest text-white" style={{fontFamily:"Space Mono,monospace"}}>L.Y.N.E</h3>
                  <p className="text-xs text-white/90 font-semibold">Logical Yield Neural Engine</p>
                  <p className="text-xs text-white/70">Your AI Study Companion</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIAssistant(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAISubmit(e);
                    }
                  }}
                  placeholder="Ask a question..."
                  className="flex-1 px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-800 focus:border-cyan-500 focus:outline-none text-sm placeholder:text-gray-400"
                  disabled={isAiThinking}
                />
                <button
                  onClick={handleAISubmit}
                  disabled={!aiInput.trim() || isAiThinking}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  {isAiThinking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : (
                    <>Send</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* L.Y.N.E AI Assistant Toggle Button */}
        {internalAIAssistantEnabled && !showAIAssistant && (
          <button
            onClick={() => setShowAIAssistant(true)}
            className="fixed bottom-6 right-6 group z-50"
          >
            <div className="relative">
              {/* Pulsing ring */}
              <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-ping opacity-60"></div>
              
              {/* Main button */}
              <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:shadow-blue-500/30 transition-all">
                <Sparkles className="w-6 h-6" />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shadow-xl">
                  Chat with L.Y.N.E
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </button>
        )}
        
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                setSelectedSection(null);
                setCurrentFlashcard(0);
                setIsFlipped(false);
                setFlashcardStats({ known: 0, learning: 0 });
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Exit Flashcards
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedSection.title}</h2>
                <p className="text-gray-600">Card {currentFlashcard + 1} of {selectedSection.flashcards.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Progress</p>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xs text-green-600">Known: {flashcardStats.known}</p>
                    <p className="text-xs text-yellow-600">Learning: {flashcardStats.learning}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className={`bg-gradient-to-r ${selectedSubject.gradient} h-2 rounded-full transition-all`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Flashcard */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full h-96 cursor-pointer perspective-1000 mb-6"
              style={{ perspective: '1000px' }}
            >
              <div 
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front of card */}
                <div 
                  className={`absolute w-full h-full bg-gradient-to-br ${selectedSubject.gradient} rounded-2xl shadow-2xl flex items-center justify-center p-8 backface-hidden`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-center">
                    <p className="text-sm text-white/80 mb-4 font-semibold uppercase tracking-wide">Question</p>
                    <h3 className="text-3xl font-bold text-white leading-relaxed">{flashcard.front}</h3>
                    <p className="text-white/70 mt-6 text-sm">Click to reveal answer</p>
                  </div>
                </div>

                {/* Back of card */}
                <div 
                  className="absolute w-full h-full bg-white rounded-2xl shadow-2xl flex items-center justify-center p-8 backface-hidden border-4 border-gray-200"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4 font-semibold uppercase tracking-wide">Answer</p>
                    <h3 className="text-2xl font-semibold text-gray-800 leading-relaxed whitespace-pre-line">{flashcard.back}</h3>
                    <p className="text-gray-600 mt-6 text-sm">Click to flip back</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation and response buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePreviousFlashcard}
                disabled={currentFlashcard === 0}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 transition-all"
              >
                ← Previous
              </button>

              {isFlipped && (
                <div className="flex gap-3">
                  <button
                    onClick={handleFlashcardLearning}
                    className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-all"
                  >
                    Still Learning
                  </button>
                  <button
                    onClick={handleFlashcardKnown}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all"
                  >
                    I Know This!
                  </button>
                </div>
              )}

              <button
                onClick={handleNextFlashcard}
                disabled={currentFlashcard === selectedSection.flashcards.length - 1}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 transition-all"
              >
                Next →
              </button>
            </div>
          </div>

          <div className={`bg-gradient-to-r ${selectedSubject.gradient} rounded-2xl p-6 text-white`}>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-6 h-6" />
              <h3 className="text-xl font-bold">Study Tip</h3>
            </div>
            <p className="text-white/90">
              Flashcards work best with spaced repetition. Review cards you marked "Still Learning" more frequently!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Quiz interface
  if (currentQuiz) {
    const question = currentQuiz.quiz[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;
    const progress = ((currentQuestion + 1) / currentQuiz.quiz.length) * 100;

    return (
      <div className="min-h-screen bg-[#f5f4f0] soul-grid">
      <SoulStyles />
        {/* L.Y.N.E AI Assistant Widget */}
        {internalAIAssistantEnabled && showAIAssistant && (
          <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center relative">
                  <Sparkles className="w-5 h-5" />
                  <div className="absolute inset-0 rounded-full bg-gray-200 animate-ping"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-widest text-white" style={{fontFamily:"Space Mono,monospace"}}>L.Y.N.E</h3>
                  <p className="text-xs text-white/90 font-semibold">Logical Yield Neural Engine</p>
                  <p className="text-xs text-white/70">Your AI Study Companion</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIAssistant(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAISubmit(e);
                    }
                  }}
                  placeholder="Ask a question..."
                  className="flex-1 px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-800 focus:border-cyan-500 focus:outline-none text-sm placeholder:text-gray-400"
                  disabled={isAiThinking}
                />
                <button
                  onClick={handleAISubmit}
                  disabled={!aiInput.trim() || isAiThinking}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  {isAiThinking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : (
                    <>Send</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* L.Y.N.E AI Assistant Toggle Button */}
        {internalAIAssistantEnabled && !showAIAssistant && (
          <button
            onClick={() => setShowAIAssistant(true)}
            className="fixed bottom-6 right-6 group z-50"
          >
            <div className="relative">
              {/* Pulsing ring */}
              <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-ping opacity-60"></div>
              
              {/* Main button */}
              <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:shadow-blue-500/30 transition-all">
                <Sparkles className="w-6 h-6" />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shadow-xl">
                  Chat with L.Y.N.E
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </button>
        )}
        
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                setCurrentQuiz(null);
                setSelectedSection(null);
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Exit Quiz
            </button>
            
            <button
              onClick={() => openInSplitScreen(selectedSubject, selectedSection, 'quiz')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
              Open Split View
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{currentQuiz.title}</h2>
                <p className="text-gray-600">Question {currentQuestion + 1} of {currentQuiz.quiz.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Score</p>
                <p className="text-2xl font-bold text-gray-800">{quizScore.correct}/{quizScore.total}</p>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className={`bg-gradient-to-r ${selectedSubject.gradient} h-2 rounded-full transition-all`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-6">{question.question}</h3>

            <div className="space-y-3 mb-6">
              {question.options.map((option, idx) => {
                let buttonStyle = 'border-gray-200 bg-white hover:border-gray-400';
                
                if (showExplanation) {
                  if (idx === question.correct) {
                    buttonStyle = 'border-green-500 bg-green-50';
                  } else if (idx === selectedAnswer) {
                    buttonStyle = 'border-red-500 bg-red-50';
                  }
                } else if (selectedAnswer === idx) {
                  buttonStyle = 'border-blue-500 bg-blue-50';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={showExplanation}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${buttonStyle} ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        showExplanation && idx === question.correct
                          ? 'border-green-500 bg-green-500'
                          : showExplanation && idx === selectedAnswer
                          ? 'border-red-500 bg-red-500'
                          : selectedAnswer === idx
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-200'
                      }`}>
                        {((showExplanation && idx === question.correct) || (!showExplanation && selectedAnswer === idx)) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                        {showExplanation && idx === selectedAnswer && idx !== question.correct && (
                          <X className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-gray-700">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className={`p-4 rounded-xl mb-6 ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-blue-50 border-2 border-blue-200'}`}>
                <div className="flex items-start gap-3">
                  <Lightbulb className={`w-6 h-6 flex-shrink-0 ${isCorrect ? 'text-green-600' : 'text-blue-600'}`} />
                  <div>
                    <p className={`font-semibold mb-1 ${isCorrect ? 'text-green-300' : 'text-blue-300'}`}>
                      {isCorrect ? '✓ Correct!' : 'Explanation:'}
                    </p>
                    <p className="text-gray-700">{question.explanation}</p>
                  </div>
                </div>
              </div>
            )}

            {!showExplanation ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
                className={`w-full py-3 bg-gradient-to-r ${selectedSubject.gradient} text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all`}
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className={`w-full py-3 bg-gradient-to-r ${selectedSubject.gradient} text-white rounded-xl font-semibold hover:shadow-lg transition-all`}
              >
                {currentQuestion < currentQuiz.quiz.length - 1 ? 'Next Question →' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Section view
  if (selectedSection && selectedSubject) {
    const section = selectedSection;
    const isRead = readSections.has(section.id);
    const hasQuiz = section.quiz && section.quiz.length > 0;
    const isWorksheet = selectedSubject.id === 'worksheets';

    // If this is a quiz section, show quiz interface
    if (hasQuiz && !currentQuiz) {
      return (
        <div className="min-h-screen bg-[#f5f4f0] soul-grid">
      <SoulStyles />
          {/* L.Y.N.E AI Assistant Widget */}
          {internalAIAssistantEnabled && showAIAssistant && (
            <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center relative">
                    <Sparkles className="w-5 h-5" />
                    <div className="absolute inset-0 rounded-full bg-gray-200 animate-ping"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg tracking-widest text-white" style={{fontFamily:"Space Mono,monospace"}}>L.Y.N.E</h3>
                    <p className="text-xs text-white/90 font-semibold">Logical Yield Neural Engine</p>
                    <p className="text-xs text-white/70">Your AI Study Companion</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIAssistant(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {aiMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3 ${
                      msg.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isAiThinking && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAISubmit(e);
                      }
                    }}
                    placeholder="Ask a question..."
                    className="flex-1 px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-800 focus:border-cyan-500 focus:outline-none text-sm placeholder:text-gray-400"
                    disabled={isAiThinking}
                  />
                  <button
                    onClick={handleAISubmit}
                    disabled={!aiInput.trim() || isAiThinking}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    {isAiThinking ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </>
                    ) : (
                      <>Send</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* L.Y.N.E AI Assistant Toggle Button */}
          {internalAIAssistantEnabled && !showAIAssistant && (
            <button
              onClick={() => setShowAIAssistant(true)}
              className="fixed bottom-6 right-6 group z-50"
            >
              <div className="relative">
                {/* Pulsing ring */}
                <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-ping opacity-60"></div>
                
                {/* Main button */}
                <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:shadow-blue-500/30 transition-all">
                  <Sparkles className="w-6 h-6" />
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shadow-xl">
                    Chat with L.Y.N.E
                    <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            </button>
          )}
          
          <div className="max-w-5xl mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedSection(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to {selectedSubject.name}
              </button>
              
              <button
                onClick={() => openInSplitScreen(selectedSubject, selectedSection, 'quiz')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
                Open Split View
              </button>
            </div>

            <div className="relative h-64 rounded-2xl overflow-hidden mb-6 shadow-xl">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${selectedSubject.gradient} opacity-60`} />
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-4xl font-bold text-white mb-2">{section.title}</h1>
                <p className="text-white/90 text-lg">{section.quiz.length} practice questions</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Practice?</h2>
                <p className="text-gray-600 mb-8">
                  Test your knowledge with {section.quiz.length} practice questions. 
                  Each question includes detailed explanations to help you learn!
                </p>
                <button
                  onClick={() => startQuiz(section)}
                  className={`px-8 py-4 bg-gradient-to-r ${selectedSubject.gradient} text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5`}
                >
                  Start Practice Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#f5f4f0] soul-grid">
      <SoulStyles />
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedSection(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to {selectedSubject.name}
            </button>
            
            <button
              onClick={() => openInSplitScreen(selectedSubject, selectedSection, 'notes')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
              Open Split View
            </button>
          </div>

          <div className={`relative rounded-xl overflow-hidden mb-6 bg-gradient-to-br ${selectedSubject.gradient} border border-gray-200`}>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gray-200 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gray-200 rounded-full blur-xl"></div>
            
            <div className="relative z-10 p-6 flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1">{section.title}</h1>
                {section.quiz && section.quiz.length > 0 && (
                  <p className="text-white/90 text-sm">{section.quiz.length} practice questions</p>
                )}
                {section.flashcards && section.flashcards.length > 0 && (
                  <p className="text-white/90 text-sm">{section.flashcards.length} flashcards</p>
                )}
                {section.notes && section.notes.length > 0 && !section.quiz && !section.flashcards && (
                  <p className="text-white/90 text-sm">{section.notes.length} topics to review</p>
                )}
              </div>
              <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <selectedSubject.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="mb-6 flex justify-end">
            <button
              onClick={() => toggleRead(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isRead
                  ? 'bg-green-100 text-green-300 hover:bg-green-200'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {isRead ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              {isRead ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>

          {/* Add to Study Plan button */}
          <div className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-lg">Quick Study Time</p>
                  <p className="text-white/80 text-sm">
                    {calculateStudyTime(section)} minutes • 
                    {section.quiz ? ' Efficient quiz practice' : 
                     section.flashcards ? ' Focused card review' : 
                     section.id.includes('definitions') ? ' Skim key terms' :
                     section.id.includes('worksheet') ? ' Key problems only' :
                     ' Essential concepts'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  addToStudyPlan(selectedSubject, section);
                  setShowStudyPlanner(true);
                }}
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Add to Study Plan
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {section.notes.map((note, idx) => {
              // Check if this is a collapsible section (electricity or definitions)
              const isDefinitionSection = section.id === 'biology-definitions' || 
                                         section.id === 'chemistry-definitions' || 
                                         section.id === 'chemistry-definitions-2' ||
                                         section.id === 'space-definitions';
              const isElectricitySection = selectedSubject?.id === 'physics' && section.id !== 'definitions';
              const isCollapsible = isDefinitionSection || isElectricitySection;
              
              const noteKey = `${section.id}-${idx}`;
              const isExpanded = expandedDefinitionNotes.has(noteKey);
              
              return (
                <div key={idx} className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all border-2 ${
                  isExpanded ? 'border-blue-200 shadow-xl' : 'border-gray-100 hover:border-gray-200'
                }`}>
                  <div 
                    className={`bg-gradient-to-r ${selectedSubject.gradient} p-5 relative overflow-hidden ${isCollapsible ? 'cursor-pointer hover:opacity-95' : ''} transition-all`}
                    onClick={() => isCollapsible && toggleDefinitionNote(section.id, idx)}
                  >
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gray-200 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-200 rounded-full blur-2xl"></div>
                    
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30">
                          <span className="text-3xl">{note.emoji}</span>
                        </div>
                        <h2 className="text-xl font-bold text-white drop-shadow-lg">{note.subtitle}</h2>
                      </div>
                      {isCollapsible && (
                        <div className={`w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center transition-all ${
                          isExpanded ? 'bg-white/30' : ''
                        }`}>
                          <ChevronRight className={`w-5 h-5 text-white transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                      )}
                    </div>
                    
                    {isCollapsible && !isExpanded && (
                      <div className="mt-2 relative z-10">
                        <p className="text-white/80 text-sm">
                          Click to expand • {(note.items || note.points).length} {(note.items || note.points).length === 1 ? 'term' : 'terms'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {(!isCollapsible || isExpanded) && (
                    <div className="p-6 bg-gray-50">
                      <div>
                        {renderNotePoints(note, selectedSubject.gradient)}
                      </div>
                      
                      {note.diagram && (
                        <div className="mt-6 p-4 bg-gradient-to-br from-[#0a0a12] to-[#111118] rounded-xl border border-gray-200 shadow-inner">
                          {note.diagram === 'lewis' && <LewisDotDiagram />}
                          {note.diagram === 'bohr' && <BohrDiagram />}
                          {note.diagram === 'energy-pyramid' && <EnergyPyramid />}
                          {note.diagram === 'carbon-cycle' && <CarbonCycle />}
                          {note.diagram === 'atomic-models' && <AtomicModels />}
                          {note.diagram === 'periodic-table' && <PeriodicTableDiagram />}
                          {note.diagram === 'ions' && <IonDiagram />}
                          {note.diagram === 'photosynthesis' && <PhotosynthesisDiagram />}
                          {note.diagram === 'respiration' && <CellRespirationDiagram />}
                          {note.diagram === 'food-chain' && <FoodChainDiagram />}
                          {note.diagram === 'aquatic-food-chain' && <AquaticFoodChainDiagram />}
                          {note.diagram === 'nitrogen-cycle' && <NitrogenCycleDiagram />}
                          {note.diagram === 'density' && <DensityComparisonDiagram />}
                          {note.diagram === 'circuit-symbols' && <CircuitSymbolsDiagram />}
                          {note.diagram === 'series-circuit' && <SeriesCircuitDiagram />}
                          {note.diagram === 'parallel-circuit' && <ParallelCircuitDiagram />}
                          {note.diagram === 'ohms-law' && <OhmsLawTriangle />}
                          {note.diagram === 'static-electricity' && <StaticElectricityDiagram />}
                          {note.diagram === 'power-formula' && <PowerFormulaDiagram />}
                          {note.diagram === 'complete-circuit' && <CircuitDiagram />}
                          {note.diagram === 'water-analogy' && <WaterAnalogyDiagram />}
                          {note.diagram === 'ohms-law-worked' && <OhmsLawWorkedExamples />}
                          {note.diagram === 'series-calculations' && <SeriesCircuitCalculations />}
                          {note.diagram === 'parallel-calculations' && <ParallelCircuitCalculations />}
                          {note.diagram === 'charging-methods' && <ChargingMethodsDiagram />}
                          {note.diagram === 'resistance-factors' && <ResistanceFactorsDiagram />}
                          {note.diagram === 'safety-devices' && <ElectricalSafetyDiagram />}
                          {note.diagram === 'power-cost' && <PowerCostCalculatorDiagram />}
                          {note.diagram === 'static-vs-current' && <StaticVsCurrentDiagram />}
                          {note.diagram === 'electroscope' && <ElectroscopeDiagram />}
                          {note.diagram === 'lightning' && <LightningDiagram />}
                          {note.diagram === 'ohms-law-graph' && <OhmsLawGraph />}
                          {note.diagram === 'ammeter-voltmeter' && <AmpmeterVoltmeterDiagram />}
                          {note.diagram === 'series-parallel-table' && <SeriesParallelComparisonTable />}
                          {note.diagram === 'energy-conversion' && <EnergyConversionDiagram />}
                          {note.diagram === 'circuit-troubleshooting' && <CircuitTroubleshootingDiagram />}
                          {note.diagram === 'renewable-energy' && <RenewableEnergyDiagram />}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`mt-8 bg-gradient-to-r ${selectedSubject.gradient} rounded-2xl p-6 text-white`}>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-6 h-6" />
              <h3 className="text-xl font-bold">Study Tip</h3>
            </div>
            <p className="text-white/90">
              Try explaining these concepts to someone else or writing them out from memory. 
              This helps solidify your understanding!
            </p>
          </div>

          {/* Exit button at bottom */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setSelectedSection(null)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to {selectedSubject.name}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Subject view
  if (selectedSubject) {
    const subject = selectedSubject;
    const completedCount = subject.sections.filter(s => readSections.has(s.id) && !s.isSectionHeader).length;
    const nonHeaderCount = subject.sections.filter(s => !s.isSectionHeader).length; const progress = nonHeaderCount > 0 ? (completedCount / nonHeaderCount) * 100 : 0;

    return (
      <div className="min-h-screen bg-[#f5f4f0] soul-grid">
      <SoulStyles />
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          <button
            onClick={() => setSelectedSubject(null)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Library
          </button>

          <div className={`relative rounded-xl overflow-hidden mb-6 bg-gradient-to-br ${subject.gradient} border border-gray-200`}>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gray-200 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gray-200 rounded-full blur-xl"></div>
            
            <div className="relative z-10 p-6 flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1">{subject.name}</h1>
                <p className="text-white/90 text-sm">
                  {subject.sections.filter(s => !s.isSectionHeader).length} sections • {completedCount} completed
                </p>
              </div>
              <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <subject.icon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="relative z-10 px-6 pb-4">
              <div className="bg-white/20 backdrop-blur rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-400 to-indigo-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-4 ${mobileMode ? 'grid-cols-1' : ''}`}>
            {subject.sections.map((section) => {
              const isRead = readSections.has(section.id);
              const hasQuiz = section.quiz && section.quiz.length > 0;
              const hasFlashcards = section.flashcards && section.flashcards.length > 0;
              const isLocked = section.locked;
              const isSectionHeader = section.isSectionHeader;
              
              // Render section headers differently
              if (isSectionHeader) {
                return (
                  <div
                    key={section.id}
                    className={`col-span-full bg-gradient-to-r ${section.headerColor} rounded-xl p-6 text-white shadow-lg border-2 border-gray-300`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                          <span className="text-2xl">{section.title.split(' ')[0]}</span>
                        </div>
                        <h3 className="text-2xl font-bold">{section.title}</h3>
                      </div>
                      <div className="text-white/80 text-sm">
                        {subject.sections.filter(s => s.id.includes(section.id.split('-')[0]) && !s.isSectionHeader).length} quizzes available
                      </div>
                    </div>
                  </div>
                );
              }
              
              return (
                <div
                  key={section.id}
                  onClick={() => !isLocked && setSelectedSection(section)}
                  className={`bg-white rounded-xl overflow-hidden ${isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:shadow-lg'} group transition-all border border-gray-100 ${!isLocked && 'hover:border-gray-200'} relative`}
                >
                  {isLocked && (
                    <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold text-gray-600">Premium</p>
                      </div>
                    </div>
                  )}
                  
                  <div className={`relative h-24 bg-gradient-to-br ${subject.gradient} p-4 overflow-hidden ${isLocked ? 'blur-sm' : ''}`}>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gray-200 rounded-full blur-lg"></div>
                    <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gray-200 rounded-full blur-lg"></div>
                    
                    <div className="relative z-10 flex items-start justify-between h-full">
                      <h3 className="text-sm font-bold text-white pr-2 line-clamp-2 leading-tight">{section.title}</h3>
                      {!isLocked && isRead && (
                        <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`p-3 ${isLocked ? 'blur-sm' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {hasQuiz && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-indigo-50 rounded-md">
                          <FileText className="w-3 h-3 text-indigo-600" />
                          <span className="text-xs font-medium text-indigo-300">{section.quiz.length} questions</span>
                        </div>
                      )}
                      {hasFlashcards && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-cyan-50 rounded-md">
                          <Brain className="w-3 h-3 text-cyan-600" />
                          <span className="text-xs font-medium text-cyan-300">{section.flashcards.length} cards</span>
                        </div>
                      )}
                      {!hasQuiz && !hasFlashcards && section.notes && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-md">
                          <BookOpen className="w-3 h-3 text-emerald-600" />
                          <span className="text-xs font-medium text-emerald-700">{section.notes.length} topics</span>
                        </div>
                      )}
                      {isLocked && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-md">
                          <Award className="w-3 h-3 text-yellow-600" />
                          <span className="text-xs font-medium text-yellow-300">Premium</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{isLocked ? 'Locked' : isRead ? 'Completed' : 'Not started'}</span>
                      {!isLocked && <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Premium CTA Banner at bottom of subject view */}
          {subject.sections.some(s => s.locked) && (
            <div className="mt-8 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gray-200 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-200 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold">Interested in Premium Content?</h3>
                  </div>
                  <p className="text-white/90 text-lg mb-2">
                    Unlock advanced quizzes, exclusive flashcards, and detailed study guides
                  </p>
                  <p className="text-white/80 mb-2">
                    <span className="font-bold">Affordable one-time payment</span> • No subscriptions • Lifetime access
                  </p>
                  <p className="text-white/90 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Personally updated with new features by Dean Concepcion</span>
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setShowPremiumModal(true)}
                    className="px-8 py-4 bg-white text-amber-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
                  >
                    Learn More
                  </button>
                  <p className="text-white/80 text-xs text-center">
                    Contact Dean for pricing details
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Introduction modal
  if (showIntro) {
    return (
      <div className="min-h-screen bg-[#f5f4f0] soul-grid flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
          <div className="bg-[#f8f9ff] border-b border-gray-100 p-8 text-white relative overflow-hidden">
            {/* Animated sound wave decoration */}
            <div className="absolute top-0 right-0 opacity-20">
              <div className="flex gap-1 items-end h-16">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-gradient-to-t from-emerald-400 to-blue-500 rounded-t animate-pulse"
                    style={{
                      height: `${30 + Math.random() * 40}px`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '1s'
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center animate-bounce">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold soul-font-display">Welcome to Soul Study</h1>
                <p className="text-slate-300">Grade 9 Science • Appleby College</p>
                <p className="text-slate-400 text-sm mt-1">Created by Dean Concepcion</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Why This Was Made
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                This interactive study library was created by <span className="font-semibold">Dean Concepcion</span> specifically to help Grade 9 students at Appleby College prepare for their Science tests more effectively. Instead of scattered notes across different pages, everything is organized in one place with clear sections, visual aids, and practice questions tailored to the Appleby curriculum.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Whether you're reviewing for Biology's ecosystem concepts, Chemistry's atomic structure, or tackling practice questions, this tool makes studying more organized and less overwhelming—designed with Appleby Grade 9 students in mind.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-500" />
                How to Use This Library
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Browse Subjects</h3>
                    <p className="text-gray-700 text-sm">Click on any subject card (Biology, Chemistry, etc.) to view all the topics inside.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Study Sections</h3>
                    <p className="text-gray-700 text-sm">Each section has visual notes with key points. Mark sections as complete to track your progress!</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Practice & Review</h3>
                    <p className="text-gray-700 text-sm">Try the Test Review Guide and Practice Questions sections to test your knowledge with instant feedback.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Search Anything</h3>
                    <p className="text-gray-700 text-sm">Use the search bar to quickly find specific topics, concepts, or keywords across all subjects.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold flex-shrink-0">5</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Use Annotation & Study Planner</h3>
                    <p className="text-gray-700 text-sm">Use the annotation tools for quick markup, and the Study Planner to schedule sessions with automatic time tracking.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold flex-shrink-0">6</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Track Your Progress</h3>
                    <p className="text-gray-700 text-sm">Mark sections complete, unlock achievements, and use split screen mode for efficient multi-tasking while studying.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-6 text-white mb-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Pro Tips for Efficient Studying</h3>
                  <div className="space-y-2 text-white/90 text-sm">
                    <p>💡 <strong>Study Planner:</strong> Click "+ Add to Plan" on sections to build your custom schedule with time estimates</p>
                    <p>✍️ <strong>Annotation:</strong> Mark up diagrams and notes directly while you study difficult sections</p>
                    <p>📱 <strong>Split Screen:</strong> Use dual-panel view to reference notes while taking quizzes simultaneously</p>
                    <p>🏆 <strong>Achievements:</strong> Unlock all 10 badges by completing sections and maintaining study streaks</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowIntro(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Let's Get Started! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main library view
  const subjects = Object.values(studyLibrary);

  // Filter subjects and sections based on search
  const filteredSubjects = subjects.filter(subject => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    // Search in subject name and description
    if (subject.name.toLowerCase().includes(searchLower)) return true;
    
    // Search in section titles
    const hasMatchingSection = subject.sections.some(section => 
      section.title.toLowerCase().includes(searchLower)
    );
    if (hasMatchingSection) return true;
    
    // Search in section notes content
    const hasMatchingContent = subject.sections.some(section =>
      (section.notes || []).some(note =>
        note.subtitle.toLowerCase().includes(searchLower) ||
        (note.points || []).some(point => typeof point === 'string' && point.toLowerCase().includes(searchLower))
      )
    );
    if (hasMatchingContent) return true;
    
    return false;
  });

  // Feature highlights section
  const FeatureHighlights = () => (
    <div className="mb-8 bg-gradient-to-br from-[#0a0f1e] to-[#0d0a1e] rounded-2xl p-6 border-2 border-blue-200 relative">
      <button
        onClick={() => setShowFeatureHighlights(false)}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-sm border border-gray-200"
        title="Close guide"
      >
        <X className="w-4 h-4 text-gray-600" />
      </button>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Quick Start Guide</h2>
          <p className="text-sm text-gray-600">Learn about the powerful features available</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Feature 1: Annotation */}
        <div className="bg-white rounded-xl p-4 border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-gray-800">Annotation Tools</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Mark diagrams, sketch ideas, and write quick reminders while you study
          </p>
          <div className="text-xs text-blue-600 font-semibold">
            → Use the annotation controls on the page
          </div>
        </div>

        {/* Feature 2: Study Planner */}
        <div className="bg-white rounded-xl p-4 border-2 border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="font-bold text-gray-800">Study Session Planner</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Build custom study sessions with time tracking
          </p>
          <div className="text-xs text-indigo-600 font-semibold">
            → Click "+ Add to Plan" or "Study Planner" in header
          </div>
        </div>

        {/* Feature 3: Split Screen */}
        <div className="bg-white rounded-xl p-4 border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-0.5">
              <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
            </div>
            <h3 className="font-bold text-gray-800">Split Screen Mode</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            View quizzes and notes side by side for efficient studying
          </p>
          <div className="text-xs text-purple-600 font-semibold">
            → Click "Open Split View" on any section
          </div>
        </div>

        {/* Feature 4: Achievements */}
        <div className="bg-white rounded-xl p-4 border-2 border-yellow-100 hover:border-yellow-300 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-gray-800">Unlock Achievements</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Earn badges as you complete sections and quizzes
          </p>
          <div className="text-xs text-yellow-600 font-semibold">
            → Study to unlock all 10 achievements!
          </div>
        </div>

        {/* Feature 5: Flashcards */}
        <div className="bg-white rounded-xl p-4 border-2 border-cyan-100 hover:border-cyan-300 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-cyan-500" />
            <h3 className="font-bold text-gray-800">Interactive Flashcards</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            70+ cards with flip animation for memorization
          </p>
          <div className="text-xs text-cyan-600 font-semibold">
            → Click to flip, mark as "Known" or "Learning"
          </div>
        </div>

        {/* Feature 6: Smart Search */}
        <div className="bg-white rounded-xl p-4 border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-5 h-5 text-green-500" />
            <h3 className="font-bold text-gray-800">Smart Search</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Find topics instantly across all subjects
          </p>
          <div className="text-xs text-green-600 font-semibold">
            → Type keywords like "density" or "biodiversity"
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Pro Study Tips</p>
            <p className="text-sm text-white/90 mb-2">
              • Use the <span className="font-bold">Study Planner</span> to organize sessions with automatic time tracking
            </p>
            <p className="text-sm text-white/90 mb-2">
              • Use <span className="font-bold">annotation tools</span> to mark diagrams and keep quick study notes in context
            </p>
            <p className="text-sm text-white/90">
              • Enable <span className="font-bold">Split Screen</span> to quiz yourself while referencing notes simultaneously
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f4f0] soul-grid">
      <SoulStyles />
      <AchievementPopup achievement={newAchievement} />
      <AchievementsModal />
      <StudyPlannerModal />
      <PremiumInterestModal />
      
      {/* AI Assistant Widget */}
      {internalAIAssistantEnabled && showAIAssistant && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center relative">
                <Sparkles className="w-5 h-5" />
                <div className="absolute inset-0 rounded-full bg-gray-200 animate-ping"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-widest text-white" style={{fontFamily:"Space Mono,monospace"}}>L.Y.N.E</h3>
                <p className="text-xs text-white/90 font-semibold">Logical Yield Neural Engine</p>
                <p className="text-xs text-white/70">Your AI Study Companion</p>
              </div>
            </div>
            <button
              onClick={() => setShowAIAssistant(false)}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {aiMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isAiThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAISubmit(e);
                  }
                }}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-800 focus:border-cyan-500 focus:outline-none text-sm placeholder:text-gray-400"
                disabled={isAiThinking}
              />
              <button
                onClick={handleAISubmit}
                disabled={!aiInput.trim() || isAiThinking}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                {isAiThinking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  <>Send</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* L.Y.N.E AI Assistant Toggle Button */}
      {internalAIAssistantEnabled && !showAIAssistant && (
        <button
          onClick={() => setShowAIAssistant(true)}
          className="fixed bottom-6 right-6 group z-50"
        >
          <div className="relative">
            {/* Pulsing ring */}
            <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-ping opacity-60"></div>
            
            {/* Main button */}
            <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:shadow-blue-500/30 transition-all">
              <Sparkles className="w-6 h-6" />
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shadow-xl">
                Chat with L.Y.N.E
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </button>
      )}
      
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-8">
          <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 rounded-3xl p-8 md:p-10 text-white shadow-2xl overflow-hidden border border-gray-200 group">
            {/* Ultra-advanced animated background layers */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e520_1px,transparent_1px),linear-gradient(to_bottom,#4f46e520_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] animate-pulse"></div>
            
            {/* Animated gradient orbs with better physics */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-emerald-500/30 to-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animation: 'float 8s ease-in-out infinite' }}></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/30 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animation: 'float 10s ease-in-out infinite reverse', animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-purple-500/30 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animation: 'float 12s ease-in-out infinite', animationDelay: '2s' }}></div>
            
            {/* Scanning line effect */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent top-0" style={{ animation: 'scan 3s ease-in-out infinite' }}></div>
            </div>
            
            {/* Enhanced floating particles with trails */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                >
                  <div className="w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg shadow-blue-500/50"></div>
                  <div className="absolute top-0 left-0 w-20 h-px bg-gradient-to-r from-blue-400/50 to-transparent -rotate-45"></div>
                </div>
              ))}
            </div>
            
            {/* Mesh gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 mix-blend-overlay"></div>
            
            {/* Noise texture */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")' }}></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl group-hover:shadow-emerald-500/50 transition-all duration-500">
                    {/* Rotating border effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-2xl opacity-75 blur animate-pulse"></div>
                    <div className="absolute inset-0 rounded-2xl border-2 border-gray-300 group-hover:border-white/40 transition-colors duration-500"></div>
                    
                    {/* Icon with 3D effect */}
                    <BookOpen className="w-10 h-10 relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }} />
                    
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-400 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-purple-400 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-pink-400 rounded-br-lg"></div>
                  </div>
                  <div>
                    <h1 className="soul-font-display text-5xl md:text-6xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-[#7c5cfc] to-[#00ff9d] bg-clip-text text-transparent tracking-tight animate-soul-gradient drop-shadow-2xl animate-gradient" style={{ backgroundSize: '200% 200%' }}>
                      Science Study Library
                    </h1>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-sm font-semibold backdrop-blur-xl relative overflow-hidden group/badge">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000"></div>
                        Grade 9
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-semibold backdrop-blur-xl relative overflow-hidden group/badge">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000"></div>
                        Appleby College
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowAchievements(true)}
                  className="relative px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-yellow-400/50 overflow-hidden group/btn"
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  
                  {/* Rotating trophy */}
                  <Trophy className="w-5 h-5 relative z-10 group-hover/btn:rotate-12 group-hover/btn:scale-110 transition-transform duration-300" />
                  <span className="relative z-10">Achievements</span>
                  <span className="relative z-10 px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-xl border border-gray-300">
                    {unlockedAchievements.size}/{achievements.length}
                  </span>
                  
                  {/* Glow pulse */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/50 to-orange-400/50 blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="inline-block bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-2xl p-1 shadow-2xl hover:shadow-emerald-500/50 transition-all group">
                  <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl px-6 py-3 group-hover:bg-slate-900/90 transition-all">
                    <p className="text-white font-black text-xl md:text-2xl tracking-wide text-center bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text">
                      🔌 Plug In. 📚 Study Smart. 🚀 Succeed Fast.
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-300 text-lg max-w-3xl">
                Your complete science companion with <span className="text-emerald-400 font-bold">70+ flashcards</span>, 
                <span className="text-blue-400 font-bold"> 80+ quiz questions</span>, and 
                <span className="text-purple-400 font-bold"> interactive diagrams</span>
              </p>
              
              <div className="flex items-center gap-6 mt-6 flex-wrap">
                <div className="flex items-center gap-2 group/stat cursor-pointer relative">
                  <div className="relative">
                    {/* Multi-layer pulse effect */}
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping opacity-75"></div>
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 opacity-50 blur-sm"></div>
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/50 group-hover/stat:shadow-green-500/70 transition-shadow"></div>
                  </div>
                  <div className="group-hover/stat:translate-x-1 transition-all duration-300">
                    <p className="text-3xl font-bold text-white drop-shadow-lg group-hover/stat:text-green-400 transition-colors">{readSections.size}</p>
                    <p className="text-xs text-slate-400 group-hover/stat:text-slate-300 transition-colors">Sections Completed</p>
                  </div>
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-green-500/0 group-hover/stat:bg-green-500/10 rounded-lg blur-xl transition-colors duration-500"></div>
                </div>
                
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-600 to-transparent relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/50 to-transparent blur-sm"></div>
                </div>
                
                <div className="flex items-center gap-2 group/stat cursor-pointer relative">
                  <div className="relative">
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-yellow-400 animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-yellow-400 opacity-50 blur-sm"></div>
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50 group-hover/stat:shadow-yellow-500/70 transition-shadow"></div>
                  </div>
                  <div className="group-hover/stat:translate-x-1 transition-all duration-300">
                    <p className="text-3xl font-bold text-white drop-shadow-lg group-hover/stat:text-yellow-400 transition-colors">{unlockedAchievements.size}</p>
                    <p className="text-xs text-slate-400 group-hover/stat:text-slate-300 transition-colors">Achievements Unlocked</p>
                  </div>
                  <div className="absolute inset-0 bg-yellow-500/0 group-hover/stat:bg-yellow-500/10 rounded-lg blur-xl transition-colors duration-500"></div>
                </div>
                
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-600 to-transparent relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/50 to-transparent blur-sm"></div>
                </div>
                
                <div className="flex items-center gap-2 group/stat cursor-pointer relative">
                  <div className="relative">
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-blue-400 animate-ping opacity-75" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-blue-400 opacity-50 blur-sm"></div>
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg shadow-blue-500/50 group-hover/stat:shadow-blue-500/70 transition-shadow"></div>
                  </div>
                  <div className="group-hover/stat:translate-x-1 transition-all duration-300">
                    <p className="text-3xl font-bold text-white drop-shadow-lg group-hover/stat:text-blue-400 transition-colors">{stats.quizCorrect}</p>
                    <p className="text-xs text-slate-400 group-hover/stat:text-slate-300 transition-colors">Quiz Questions Correct</p>
                  </div>
                  <div className="absolute inset-0 bg-blue-500/0 group-hover/stat:bg-blue-500/10 rounded-lg blur-xl transition-colors duration-500"></div>
                </div>
                
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-600 to-transparent relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/50 to-transparent blur-sm"></div>
                </div>
                
                <button
                  onClick={() => setShowStudyPlanner(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-white/20 rounded-lg transition-all backdrop-blur-xl border border-gray-300 hover:border-white/40 group/planner relative overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 -translate-x-full group-hover/planner:translate-x-full transition-transform duration-1000"></div>
                  
                  <svg className="w-5 h-5 group-hover/planner:rotate-12 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="text-left relative z-10">
                    <p className="text-sm font-bold">Study Planner</p>
                    <p className="text-xs text-slate-300">{studyPlan.length} sessions</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-white/20 rounded-lg transition-colors backdrop-blur border border-gray-300 relative group"
                  title="Dark Mode (Premium)"
                >
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-sm font-bold">Dark Mode</p>
                    <p className="text-xs text-yellow-300 font-semibold">Premium</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-white/20 rounded-lg transition-colors backdrop-blur border border-gray-300 relative group"
                  title="Mobile/Desktop Mode (Premium)"
                >
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-bold">View Mode</p>
                      <p className="text-xs text-yellow-300 font-semibold">Premium</p>
                    </div>
                  </>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
          <input
            type="text"
            placeholder="Search topics, concepts, keywords..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchTerm && setShowSearchDropdown(true)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-gray-800 bg-white shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setShowSearchDropdown(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          {/* Search Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-600">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearchResultClick(result)}
                  className="w-full p-4 text-left hover:bg-blue-50 border-b border-gray-100 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${result.subject.gradient} flex items-center justify-center flex-shrink-0`}>
                      <result.subject.icon className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase">
                          {result.match}
                        </span>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-gray-500">
                          {result.subject.name}
                        </span>
                      </div>
                      
                      <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                        {result.title}
                      </p>
                      
                      {result.preview && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {result.preview}
                        </p>
                      )}
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {showFeatureHighlights ? (
          <FeatureHighlights />
        ) : (
          <button
            onClick={() => setShowFeatureHighlights(true)}
            className="mb-8 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl p-4 flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Show Quick Start Guide</span>
          </button>
        )}

        {searchTerm && (
          <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-blue-300">
              <span className="font-semibold">Found {filteredSubjects.length} subject(s)</span> matching "{searchTerm}"
            </p>
          </div>
        )}

        {filteredSubjects.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
            <p className="text-gray-500">Try searching for different keywords like "biodiversity", "density", or "atoms"</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            {/* Quiz & Practice Features Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg">
                  <FileText className="w-5 h-5 text-white" />
                  <span className="text-white font-bold">Practice & Test Preparation</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
              </div>

              <div className={`grid gap-6 ${
                mobileMode 
                  ? 'grid-cols-1' 
                  : 'md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {filteredSubjects.filter(subject => subject.isQuizSection).map((subject) => {
                  const completedCount = subject.sections.filter(s => readSections.has(s.id) && !s.isSectionHeader).length;
                  const nonHeaderCount = subject.sections.filter(s => !s.isSectionHeader).length; const progress = nonHeaderCount > 0 ? (completedCount / nonHeaderCount) * 100 : 0;

                  return (
                    <div
                      key={subject.id}
                      onClick={() => {
                        setSelectedSubject(subject);
                        setStats(prev => ({ 
                          ...prev, 
                          subjectsViewed: new Set([...prev.subjectsViewed, subject.id])
                        }));
                      }}
                      className={`bg-white rounded-xl overflow-hidden cursor-pointer group hover:shadow-xl transition-all border border-gray-100 hover:border-gray-200 ${
                        mobileMode ? 'w-full' : ''
                      }`}
                    >
                      <div className={`relative bg-gradient-to-br ${subject.gradient} p-5 overflow-hidden ${
                        mobileMode ? 'h-24' : 'h-32'
                      }`}>
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gray-200 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gray-200 rounded-full blur-xl"></div>
                        
                        <div className="relative z-10 flex items-start justify-between h-full">
                          <div className="flex-1">
                            <h2 className={`font-bold text-white mb-1 ${
                              mobileMode ? 'text-lg' : 'text-xl'
                            }`}>{subject.name}</h2>
                            <p className="text-white/90 text-xs">{subject.sections.filter(s => !s.isSectionHeader).length} sections</p>
                          </div>
                          <div className={`rounded-lg bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform ${
                            mobileMode ? 'w-10 h-10' : 'w-12 h-12'
                          }`}>
                            <subject.icon className={`text-white ${
                              mobileMode ? 'w-5 h-5' : 'w-6 h-6'
                            }`} />
                          </div>
                        </div>
                      </div>

                      <div className={mobileMode ? 'p-3' : 'p-4'}>
                        <p className={`text-gray-600 mb-3 ${
                          mobileMode ? 'text-xs line-clamp-2' : 'text-sm line-clamp-2'
                        }`}>{subject.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{completedCount}/{subject.sections.filter(s => !s.isSectionHeader).length} complete</span>
                          <span className="font-bold text-gray-700">{Math.round(progress)}%</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`bg-gradient-to-r ${subject.gradient} h-full transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Study Notes & Content Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                  <span className="text-white font-bold soul-font-display tracking-wide">STUDY NOTES & CONTENT</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
              </div>

              <div className={`grid gap-6 ${
                mobileMode 
                  ? 'grid-cols-1' 
                  : 'md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {filteredSubjects.filter(subject => !subject.isQuizSection).map((subject) => {
                  const completedCount = subject.sections.filter(s => readSections.has(s.id) && !s.isSectionHeader).length;
                  const nonHeaderCount = subject.sections.filter(s => !s.isSectionHeader).length; const progress = nonHeaderCount > 0 ? (completedCount / nonHeaderCount) * 100 : 0;

                  return (
                    <div
                      key={subject.id}
                      onClick={() => {
                        setSelectedSubject(subject);
                        setStats(prev => ({ 
                          ...prev, 
                          subjectsViewed: new Set([...prev.subjectsViewed, subject.id])
                        }));
                      }}
                      className={`bg-white rounded-xl overflow-hidden cursor-pointer group hover:shadow-xl transition-all border border-gray-100 hover:border-gray-200 ${
                        mobileMode ? 'w-full' : ''
                      }`}
                    >
                      <div className={`relative bg-gradient-to-br ${subject.gradient} p-5 overflow-hidden ${
                        mobileMode ? 'h-24' : 'h-32'
                      }`}>
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gray-200 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gray-200 rounded-full blur-xl"></div>
                        
                        <div className="relative z-10 flex items-start justify-between h-full">
                          <div className="flex-1">
                            <h2 className={`font-bold text-white mb-1 ${
                              mobileMode ? 'text-lg' : 'text-xl'
                            }`}>{subject.name}</h2>
                            <p className="text-white/90 text-xs">{subject.sections.filter(s => !s.isSectionHeader).length} sections</p>
                          </div>
                          <div className={`rounded-lg bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform ${
                            mobileMode ? 'w-10 h-10' : 'w-12 h-12'
                          }`}>
                            <subject.icon className={`text-white ${
                              mobileMode ? 'w-5 h-5' : 'w-6 h-6'
                            }`} />
                          </div>
                        </div>
                      </div>

                      <div className={mobileMode ? 'p-3' : 'p-4'}>
                        <p className={`text-gray-600 mb-3 ${
                          mobileMode ? 'text-xs line-clamp-2' : 'text-sm line-clamp-2'
                        }`}>{subject.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{completedCount}/{subject.sections.filter(s => !s.isSectionHeader).length} complete</span>
                          <span className="font-bold text-gray-700">{Math.round(progress)}%</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`bg-gradient-to-r ${subject.gradient} h-full transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Special Thanks Section */}
        <div className="mt-12 mb-8 text-center">
          <div className="inline-block bg-gradient-to-r from-[#181208] to-[#181408] rounded-2xl px-8 py-4 border-2 border-amber-200">
            <p className="text-sm text-gray-600 mb-1">Special Thanks to Our Sponsors</p>
            <div className="flex items-center gap-3 justify-center flex-wrap">
              <span className="text-lg font-bold text-amber-600">⭐</span>
              <span className="font-bold text-gray-800">Aland Cai</span>
              <span className="text-gray-600">•</span>
              <span className="font-bold text-gray-800">Derek Zhu</span>
              <span className="text-gray-600">•</span>
              <span className="font-bold text-gray-800">Max James</span>
              <span className="text-gray-600">•</span>
              <span className="font-bold text-gray-800">Yoshi Imaizumi</span>
              <span className="text-gray-600">•</span>
              <span className="font-bold text-gray-800">Lachlan McGuire</span>
              <span className="text-lg font-bold text-amber-600">⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
