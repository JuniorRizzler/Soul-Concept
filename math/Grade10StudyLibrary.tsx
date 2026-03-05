import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, Search, ArrowLeft, CheckCircle, Circle, Calculator, TrendingUp, Shapes, Grid3x3, ChevronRight, FileText, Lightbulb, Target, X, ClipboardList, Award, Trophy, Star, Flame, Brain, Sparkles, Zap, BookMarked, Pencil, Eraser, Trash2 } from 'lucide-react';

// ── Global styles injected once ──────────────────────────────────────────────
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
  :root {
    --bg: #f6f7fb; --bg-2: #ffffff; --surface: #ffffff;
    --border: rgba(0,0,0,0.07); --border-2: rgba(0,0,0,0.13);
    --text: #0f172a; --muted: rgba(15,23,42,0.55); --dim: rgba(15,23,42,0.38);
    --font-display: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif; --font-mono: 'JetBrains Mono', monospace;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
  .dot-grid { background-image: radial-gradient(circle, rgba(99,102,241,0.08) 1.5px, transparent 1.5px); background-size: 32px 32px; }
  .glass { background: rgba(255,255,255,0.82); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); border: 1px solid var(--border); }
  .glass-hover:hover { background: rgba(255,255,255,0.96); border-color: var(--border-2); box-shadow: 0 8px 32px rgba(99,102,241,0.10); }
  .glow-i { box-shadow: 0 0 32px rgba(99,102,241,0.2), 0 0 8px rgba(99,102,241,0.08); }
  .glow-e { box-shadow: 0 0 32px rgba(16,185,129,0.2), 0 0 8px rgba(16,185,129,0.08); }
  .glow-v { box-shadow: 0 0 32px rgba(139,92,246,0.2), 0 0 8px rgba(139,92,246,0.08); }
  .glow-a { box-shadow: 0 0 32px rgba(245,158,11,0.2),  0 0 8px rgba(245,158,11,0.08); }
  @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(200%)} }
  .shimmer { overflow:hidden; position:relative; }
  .shimmer::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent); animation:shimmer 2.4s infinite; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .anim-up { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
  .anim-up-1 { animation-delay:0.07s } .anim-up-2 { animation-delay:0.13s } .anim-up-3 { animation-delay:0.19s } .anim-up-4 { animation-delay:0.25s }
  @keyframes pulseRing { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.75;transform:scale(1.09)} }
  .pulse-ring { animation: pulseRing 2.8s ease-in-out infinite; }
  .flip-card { perspective: 1200px; }
  .flip-inner { transition: transform 0.55s cubic-bezier(0.4,0,0.2,1); transform-style: preserve-3d; }
  .flip-inner.flipped { transform: rotateY(180deg); }
  .flip-front,.flip-back { backface-visibility:hidden; -webkit-backface-visibility:hidden; }
  .flip-back { transform: rotateY(180deg); }
  ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-track { background:transparent; } ::-webkit-scrollbar-thumb { background:rgba(99,102,241,0.2); border-radius:99px; }
  .syne { font-family: var(--font-display); } .mono { font-family: var(--font-mono); }
  .card-shadow { box-shadow: 0 2px 12px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.04); }
  .card-shadow-hover:hover { box-shadow: 0 8px 32px rgba(99,102,241,0.13), 0 2px 8px rgba(15,23,42,0.06); }
`;

function InjectStyles() {
  useEffect(() => {
    const id = 'mathlib-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style'); el.id = id; el.textContent = GLOBAL_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DIAGRAM COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function DiagramCard({ title, children, color = 'slate' }) {
  const borderMap = { purple: 'border-purple-200', blue: 'border-blue-200', teal: 'border-teal-200', amber: 'border-amber-200', green: 'border-green-200', slate: 'border-slate-200', indigo: 'border-indigo-200', rose: 'border-rose-200' };
  return (
    <div className={`bg-white rounded-2xl border-2 ${borderMap[color] || 'border-slate-200'} shadow-md overflow-hidden`}>
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full bg-${color}-400`} />
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// Parabola anatomy — static, annotated
function ParabolaAnatomyDiagram() {
  const W = 320, H = 230, cx = 160, cy = 115, sc = 22;
  const a = 0.8, h = 0, k = -3;
  const pts = [];
  for (let x = -5.5; x <= 5.5; x += 0.2) {
    const y = a * (x - h) ** 2 + k;
    if (y > 7) continue;
    pts.push(`${cx + x * sc},${cy - y * sc}`);
  }
  const curve = 'M ' + pts.join(' L ');
  const vx = cx + h * sc, vy = cy - k * sc;
  const yi = cy - (a * h * h + k) * sc;
  const sqr = Math.sqrt(-k / a);
  const z1x = cx + (h + sqr) * sc, z2x = cx + (h - sqr) * sc;
  const axisX = cx + h * sc;

  return (
    <DiagramCard title="Parabola — Key Features" color="purple">
      <svg width={W} height={H} className="mx-auto block">
        {/* Grid */}
        {[-4,-2,0,2,4].map(v => (
          <g key={v}>
            <line x1={cx+v*sc} y1={10} x2={cx+v*sc} y2={H-10} stroke="#f1f5f9" strokeWidth="1"/>
            <line x1={10} y1={cy-v*sc} x2={W-10} y2={cy-v*sc} stroke="#f1f5f9" strokeWidth="1"/>
          </g>
        ))}
        {/* Axes */}
        <line x1={10} y1={cy} x2={W-10} y2={cy} stroke="#cbd5e1" strokeWidth="1.5"/>
        <line x1={cx} y1={10} x2={cx} y2={H-10} stroke="#cbd5e1" strokeWidth="1.5"/>
        <text x={W-8} y={cy+4} fontSize="10" fill="#94a3b8" textAnchor="end">x</text>
        <text x={cx+4} y={14} fontSize="10" fill="#94a3b8">y</text>
        {/* Axis of symmetry */}
        <line x1={axisX} y1={12} x2={axisX} y2={H-12} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="5,3"/>
        {/* Curve */}
        <path d={curve} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Vertex */}
        <circle cx={vx} cy={vy} r="5" fill="#7c3aed" stroke="white" strokeWidth="2"/>
        <text x={vx+8} y={vy+4} fontSize="10" fill="#7c3aed" fontWeight="bold">Vertex (0,−3)</text>
        {/* Y-intercept */}
        <circle cx={cx} cy={yi} r="4" fill="#0ea5e9" stroke="white" strokeWidth="2"/>
        <line x1={cx-28} y1={yi} x2={cx-6} y2={yi} stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3,2"/>
        <text x={cx-30} y={yi+4} fontSize="10" fill="#0ea5e9" fontWeight="bold" textAnchor="end">y-int</text>
        {/* Zeros */}
        <circle cx={z1x} cy={cy} r="4" fill="#10b981" stroke="white" strokeWidth="2"/>
        <circle cx={z2x} cy={cy} r="4" fill="#10b981" stroke="white" strokeWidth="2"/>
        <text x={z1x} y={cy+16} fontSize="10" fill="#10b981" fontWeight="bold" textAnchor="middle">zero</text>
        <text x={z2x} y={cy+16} fontSize="10" fill="#10b981" fontWeight="bold" textAnchor="middle">zero</text>
        {/* Axis of symmetry label */}
        <text x={axisX+3} y={18} fontSize="10" fill="#a855f7" fontWeight="bold">axis x=0</text>
        {/* Opens up arrow */}
        <text x={vx-50} y={vy-18} fontSize="10" fill="#7c3aed">opens up (a&gt;0)</text>
      </svg>
      <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
        {[['🟣 Vertex','Highest/lowest point — (h, k)'],['🔵 y-intercept','Where curve hits y-axis (x=0)'],['🟢 Zeros','Where curve hits x-axis (y=0)'],['🟤 Axis','Vertical line x=h (mirror line)']].map(([k,v])=>(
          <div key={k} className="bg-slate-50 rounded-lg p-2"><span className="font-semibold text-slate-700">{k}:</span><span className="text-slate-500 ml-1">{v}</span></div>
        ))}
      </div>
    </DiagramCard>
  );
}

// "a" value effects on parabola width/direction — static compare
function AValueDiagram() {
  const W = 320, H = 200, cx = 160, cy = 120, sc = 18;
  const parabolas = [
    { a: 2, color: '#ef4444', label: 'a=2 (narrow)' },
    { a: 1, color: '#7c3aed', label: 'a=1 (standard)' },
    { a: 0.4, color: '#0ea5e9', label: 'a=0.4 (wide)' },
    { a: -1, color: '#f59e0b', label: 'a=−1 (down)' },
  ];
  return (
    <DiagramCard title="Effect of 'a' on Parabola Shape" color="purple">
      <svg width={W} height={H} className="mx-auto block">
        <line x1={10} y1={cy} x2={W-10} y2={cy} stroke="#e2e8f0" strokeWidth="1.5"/>
        <line x1={cx} y1={10} x2={cx} y2={H-10} stroke="#e2e8f0" strokeWidth="1.5"/>
        {parabolas.map(({ a, color, label }) => {
          const pts = [];
          for (let x = -5; x <= 5; x += 0.25) {
            const y = a * x * x;
            if (y > 6.5 || y < -5) continue;
            pts.push(`${cx+x*sc},${cy-y*sc}`);
          }
          return pts.length > 1 ? <path key={label} d={'M '+pts.join(' L ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/> : null;
        })}
        {/* Legend */}
        {parabolas.map(({ color, label }, i) => (
          <g key={label} transform={`translate(${i < 2 ? 10 : 185}, ${i % 2 === 0 ? H-38 : H-20})`}>
            <line x1="0" y1="5" x2="16" y2="5" stroke={color} strokeWidth="2.5"/>
            <text x="20" y="9" fontSize="10" fill={color} fontWeight="bold">{label}</text>
          </g>
        ))}
      </svg>
      <p className="text-xs text-slate-500 text-center mt-1">Larger |a| = narrower curve. Negative a = opens downward.</p>
    </DiagramCard>
  );
}

// Three types of linear system solutions
function SystemTypesDiagram() {
  const W = 340, H = 200, sc = 16;
  const panels = [
    { label: 'One Solution', sub: 'Different slopes → intersect', color: '#10b981', m1: 1.5, b1: -2, m2: -1, b2: 1 },
    { label: 'No Solution', sub: 'Same slope → parallel', color: '#ef4444', m1: 1, b1: -2, m2: 1, b2: 2 },
    { label: 'Infinite Solutions', sub: 'Same line', color: '#f59e0b', m1: 1, b1: 0, m2: 1, b2: 0 },
  ];
  const pw = W / 3, ph = H;
  return (
    <DiagramCard title="Types of Linear System Solutions" color="blue">
      <svg width={W} height={H} className="mx-auto block rounded-xl bg-slate-50">
        {panels.map(({ label, sub, color, m1, b1, m2, b2 }, pi) => {
          const ox = pi * pw + pw / 2, oy = ph / 2 - 12;
          const line = (m, b, stroke, dash) => {
            const pts = [];
            for (let x = -4; x <= 4; x += 0.5) {
              const y = m * x + b;
              if (y < -5 || y > 5) continue;
              pts.push(`${ox + x * sc},${oy - y * sc}`);
            }
            return pts.length > 1 ? <path key={stroke} d={'M '+pts.join(' L ')} fill="none" stroke={stroke} strokeWidth="2" strokeDasharray={dash} strokeLinecap="round"/> : null;
          };
          // Intersection point for one solution
          let ix = null;
          if (pi === 0 && m1 !== m2) {
            const ixv = (b2 - b1) / (m1 - m2);
            const iyv = m1 * ixv + b1;
            ix = { x: ox + ixv * sc, y: oy - iyv * sc };
          }
          return (
            <g key={pi}>
              {/* Panel bg */}
              <rect x={pi * pw + 2} y={2} width={pw - 4} height={ph - 4} rx="8" fill="white" stroke="#e2e8f0"/>
              {/* Axes */}
              <line x1={pi*pw+6} y1={oy} x2={(pi+1)*pw-6} y2={oy} stroke="#cbd5e1" strokeWidth="1"/>
              <line x1={ox} y1={8} x2={ox} y2={ph-44} stroke="#cbd5e1" strokeWidth="1"/>
              {/* Lines */}
              {line(m1, b1, color, '')}
              {line(m2, b2, pi === 2 ? '#f59e0b88' : '#3b82f6', pi === 0 ? '' : '')}
              {/* Intersection dot */}
              {ix && <circle cx={ix.x} cy={ix.y} r="5" fill={color} stroke="white" strokeWidth="2"/>}
              {/* Labels */}
              <text x={ox} y={ph-30} textAnchor="middle" fontSize="10" fill={color} fontWeight="bold">{label}</text>
              <text x={ox} y={ph-17} textAnchor="middle" fontSize="9" fill="#64748b">{sub}</text>
            </g>
          );
        })}
      </svg>
    </DiagramCard>
  );
}

// Slope formula with rise/run visual
function SlopeDiagram() {
  return (
    <DiagramCard title="Understanding Slope — Rise over Run" color="blue">
      <svg width={320} height={190} className="mx-auto block">
        {/* Grid */}
        {[0,1,2,3,4,5,6].map(v => (
          <g key={v}>
            <line x1={40+v*40} y1={20} x2={40+v*40} y2={160} stroke="#f1f5f9" strokeWidth="1"/>
            <line x1={40} y1={20+v*23} x2={280} y2={20+v*23} stroke="#f1f5f9" strokeWidth="1"/>
          </g>
        ))}
        <line x1={40} y1={160} x2={280} y2={160} stroke="#cbd5e1" strokeWidth="1.5"/>
        <line x1={40} y1={20} x2={40} y2={160} stroke="#cbd5e1" strokeWidth="1.5"/>
        {/* The line y = 0.75x + some offset */}
        <line x1={60} y1={145} x2={260} y2={45} stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Rise / Run triangle */}
        <line x1={100} y1={118} x2={220} y2={118} stroke="#10b981" strokeWidth="2" strokeDasharray="5,3"/>
        <line x1={220} y1={118} x2={220} y2={60} stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3"/>
        <line x1={100} y1={118} x2={220} y2={60} stroke="#3b82f6" strokeWidth="2"/>
        {/* Points */}
        <circle cx={100} cy={118} r="5" fill="#3b82f6" stroke="white" strokeWidth="2"/>
        <circle cx={220} cy={60} r="5" fill="#3b82f6" stroke="white" strokeWidth="2"/>
        <text x={100-6} y={118+18} fontSize="11" fill="#374151" fontWeight="bold">(x₁, y₁)</text>
        <text x={220+4} y={60-6} fontSize="11" fill="#374151" fontWeight="bold">(x₂, y₂)</text>
        {/* Labels */}
        <text x={160} y={132} textAnchor="middle" fontSize="12" fill="#10b981" fontWeight="bold">run (Δx)</text>
        <text x={232} y={92} textAnchor="start" fontSize="12" fill="#ef4444" fontWeight="bold">rise (Δy)</text>
      </svg>
      <div className="mt-2 bg-blue-50 rounded-xl p-3 text-center">
        <p className="text-base font-bold text-blue-800">m = <span className="text-red-600">rise</span> / <span className="text-green-600">run</span> = (y₂ − y₁) / (x₂ − x₁)</p>
        <p className="text-xs text-slate-500 mt-1">Positive slope rises left→right. Negative slope falls left→right.</p>
      </div>
    </DiagramCard>
  );
}

// SOH-CAH-TOA static diagram
function TrigStaticDiagram() {
  const A = { x: 50, y: 175 }, B = { x: 260, y: 175 }, C = { x: 50, y: 55 };
  return (
    <DiagramCard title="Right Triangle — SOH CAH TOA" color="amber">
      <svg width={320} height={220} className="mx-auto block">
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#fef9c3" stroke="none"/>
        {/* Right angle */}
        <rect x={A.x} y={A.y-16} width={16} height={16} fill="none" stroke="#92400e" strokeWidth="1.5"/>
        {/* Sides */}
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#10b981" strokeWidth="3" strokeLinecap="round"/>
        <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="#a855f7" strokeWidth="3" strokeLinecap="round"/>
        <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
        {/* Angle arc at B */}
        <path d="M 242,175 A 18,18 0 0 0 254,160" fill="none" stroke="#b45309" strokeWidth="1.5"/>
        {/* Labels */}
        <text x={(A.x+B.x)/2} y={A.y+18} textAnchor="middle" fontSize="13" fill="#059669" fontWeight="bold">adjacent</text>
        <text x={A.x-42} y={(A.y+C.y)/2+5} textAnchor="middle" fontSize="13" fill="#7c3aed" fontWeight="bold">opposite</text>
        <text x={(B.x+C.x)/2+28} y={(B.y+C.y)/2} textAnchor="middle" fontSize="13" fill="#dc2626" fontWeight="bold">hypotenuse</text>
        {/* Angle labels */}
        <text x={A.x+5} y={A.y+6} fontSize="11" fill="#92400e" fontWeight="bold">90°</text>
        <text x={B.x-36} y={B.y-10} fontSize="13" fill="#b45309" fontWeight="bold">θ</text>
        <text x={C.x+8} y={C.y+16} fontSize="11" fill="#b45309" fontWeight="bold">90°−θ</text>
      </svg>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-purple-50 rounded-xl p-2.5">
          <p className="font-bold text-purple-700 text-sm">sin θ</p>
          <p className="text-gray-600 font-mono">opp / hyp</p>
          <p className="text-purple-400 text-xs mt-0.5">SOH</p>
        </div>
        <div className="bg-green-50 rounded-xl p-2.5">
          <p className="font-bold text-green-700 text-sm">cos θ</p>
          <p className="text-gray-600 font-mono">adj / hyp</p>
          <p className="text-green-400 text-xs mt-0.5">CAH</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-2.5">
          <p className="font-bold text-amber-700 text-sm">tan θ</p>
          <p className="text-gray-600 font-mono">opp / adj</p>
          <p className="text-amber-400 text-xs mt-0.5">TOA</p>
        </div>
      </div>
    </DiagramCard>
  );
}

// Sine Law and triangle labeling
function SineLawDiagram() {
  return (
    <DiagramCard title="Sine Law — Triangle Labeling Convention" color="teal">
      <svg width={320} height={200} className="mx-auto block">
        {/* Triangle */}
        <polygon points="60,170 270,170 160,50" fill="#f0fdf4" stroke="none"/>
        <line x1={60} y1={170} x2={270} y2={170} stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1={60} y1={170} x2={160} y2={50} stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1={270} y1={170} x2={160} y2={50} stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Vertices */}
        <circle cx={60} cy={170} r="4" fill="#0d9488"/>
        <circle cx={270} cy={170} r="4" fill="#0d9488"/>
        <circle cx={160} cy={50} r="4" fill="#0d9488"/>
        {/* Vertex labels */}
        <text x={42} y={188} fontSize="14" fill="#0f766e" fontWeight="bold">A</text>
        <text x={272} y={188} fontSize="14" fill="#0f766e" fontWeight="bold">B</text>
        <text x={155} y={40} fontSize="14" fill="#0f766e" fontWeight="bold">C</text>
        {/* Side labels — opposite to vertex */}
        <text x={155} y={188} textAnchor="middle" fontSize="12" fill="#b45309" fontWeight="bold">c (opposite C)</text>
        <text x={95} y={108} fontSize="12" fill="#7c3aed" fontWeight="bold">b (opp B)</text>
        <text x={210} y={108} fontSize="12" fill="#dc2626" fontWeight="bold">a (opp A)</text>
      </svg>
      <div className="mt-2 bg-teal-50 rounded-xl p-3 text-center">
        <p className="font-bold text-teal-800 text-base">a/sin A = b/sin B = c/sin C</p>
        <p className="text-xs text-slate-500 mt-1">Side 'a' is always opposite angle A, 'b' opposite B, etc.</p>
      </div>
    </DiagramCard>
  );
}

// Cosine Law diagram
function CosineLawDiagram() {
  return (
    <DiagramCard title="Cosine Law" color="teal">
      <svg width={320} height={180} className="mx-auto block">
        <polygon points="50,160 270,160 120,55" fill="#f0fdf4" stroke="none"/>
        <line x1={50} y1={160} x2={270} y2={160} stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1={50} y1={160} x2={120} y2={55} stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1={270} y1={160} x2={120} y2={55} stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
        <circle cx={50} cy={160} r="4" fill="#0d9488"/>
        <circle cx={270} cy={160} r="4" fill="#0d9488"/>
        <circle cx={120} cy={55} r="4" fill="#0d9488"/>
        <text x={32} y={178} fontSize="13" fill="#0f766e" fontWeight="bold">A</text>
        <text x={272} y={178} fontSize="13" fill="#0f766e" fontWeight="bold">B</text>
        <text x={114} y={44} fontSize="13" fill="#0f766e" fontWeight="bold">C</text>
        {/* Angle C arc */}
        <path d="M 62,160 A 14,14 0 0 1 72,150" fill="none" stroke="#b45309" strokeWidth="1.5"/>
        <text x={66} y={148} fontSize="11" fill="#b45309" fontWeight="bold">C</text>
        {/* Side c in red */}
        <text x={190} y={100} fontSize="12" fill="#dc2626" fontWeight="bold">c</text>
        <text x={155} y={178} textAnchor="middle" fontSize="11" fill="#b45309">c² = a² + b² − 2ab·cos(C)</text>
      </svg>
      <div className="mt-2 bg-teal-50 rounded-xl p-3">
        <p className="text-xs text-slate-600"><span className="font-bold text-teal-700">Use when you know:</span> SAS (two sides + included angle) or SSS (all three sides)</p>
      </div>
    </DiagramCard>
  );
}

// Circle with center/radius labeled
function CircleStaticDiagram() {
  return (
    <DiagramCard title="Circle — Standard Equation" color="green">
      <svg width={300} height={200} className="mx-auto block">
        {/* Axes */}
        <line x1={20} y1={100} x2={280} y2={100} stroke="#e2e8f0" strokeWidth="1.5"/>
        <line x1={150} y1={15} x2={150} y2={185} stroke="#e2e8f0" strokeWidth="1.5"/>
        {/* Circle */}
        <circle cx={170} cy={90} r={60} fill="#f0fdf4" stroke="#10b981" strokeWidth="2.5"/>
        {/* Center */}
        <circle cx={170} cy={90} r="4" fill="#10b981"/>
        <text x={178} y={87} fontSize="11" fill="#065f46" fontWeight="bold">(h, k) = center</text>
        {/* Radius line */}
        <line x1={170} y1={90} x2={228} y2={72} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,3"/>
        <text x={204} y={76} fontSize="11" fill="#b45309" fontWeight="bold">r</text>
        {/* Points on circle */}
        <circle cx={228} cy={72} r="3" fill="#f59e0b"/>
        {/* Equation box */}
        <rect x={14} y={150} width={182} height={36} rx="8" fill="#f0fdf4" stroke="#10b981" strokeWidth="1.5"/>
        <text x={105} y={165} textAnchor="middle" fontSize="12" fill="#065f46" fontWeight="bold">(x − h)² + (y − k)² = r²</text>
        <text x={105} y={180} textAnchor="middle" fontSize="10" fill="#64748b">r = radius (always positive)</text>
      </svg>
    </DiagramCard>
  );
}

// Distance and midpoint diagram
function DistanceMidpointDiagram() {
  const P1 = { x: 70, y: 155, lx: 1, ly: 2 };
  const P2 = { x: 245, y: 60, lx: 6, ly: 5 };
  const Mx = (P1.x + P2.x) / 2, My = (P1.y + P2.y) / 2;
  return (
    <DiagramCard title="Distance & Midpoint Formulas" color="indigo">
      <svg width={320} height={200} className="mx-auto block">
        {/* Grid */}
        {[1,2,3,4,5,6].map(v => (
          <g key={v}>
            <line x1={40+v*35} y1={20} x2={40+v*35} y2={175} stroke="#f1f5f9" strokeWidth="1"/>
            <line x1={40} y1={v*28+6} x2={280} y2={v*28+6} stroke="#f1f5f9" strokeWidth="1"/>
          </g>
        ))}
        <line x1={40} y1={175} x2={280} y2={175} stroke="#c7d2fe" strokeWidth="1.5"/>
        <line x1={40} y1={20} x2={40} y2={175} stroke="#c7d2fe" strokeWidth="1.5"/>
        {/* Distance line */}
        <line x1={P1.x} y1={P1.y} x2={P2.x} y2={P2.y} stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Dashed right triangle */}
        <line x1={P1.x} y1={P1.y} x2={P2.x} y2={P1.y} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,3"/>
        <line x1={P2.x} y1={P1.y} x2={P2.x} y2={P2.y} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3"/>
        <text x={(P1.x+P2.x)/2} y={P1.y+14} textAnchor="middle" fontSize="10" fill="#059669">x₂−x₁</text>
        <text x={P2.x+4} y={(P1.y+P2.y)/2+4} fontSize="10" fill="#dc2626">y₂−y₁</text>
        {/* Points */}
        <circle cx={P1.x} cy={P1.y} r="5" fill="#6366f1" stroke="white" strokeWidth="2"/>
        <circle cx={P2.x} cy={P2.y} r="5" fill="#6366f1" stroke="white" strokeWidth="2"/>
        <circle cx={Mx} cy={My} r="5" fill="#f59e0b" stroke="white" strokeWidth="2"/>
        <text x={P1.x-8} y={P1.y+16} fontSize="11" fill="#4338ca" fontWeight="bold">(x₁,y₁)</text>
        <text x={P2.x-8} y={P2.y-8} fontSize="11" fill="#4338ca" fontWeight="bold">(x₂,y₂)</text>
        <text x={Mx+6} y={My-8} fontSize="11" fill="#b45309" fontWeight="bold">Midpoint M</text>
      </svg>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="bg-indigo-50 rounded-xl p-2.5 text-center">
          <p className="text-xs font-bold text-indigo-700 mb-1">Distance Formula</p>
          <p className="text-xs font-mono text-slate-700">d = √[(x₂−x₁)²+(y₂−y₁)²]</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-2.5 text-center">
          <p className="text-xs font-bold text-amber-700 mb-1">Midpoint Formula</p>
          <p className="text-xs font-mono text-slate-700">M = ((x₁+x₂)/2, (y₁+y₂)/2)</p>
        </div>
      </div>
    </DiagramCard>
  );
}

// Substitution process flow diagram (static)
function SubstitutionFlowDiagram() {
  const steps = [
    { n: '1', text: 'Isolate one variable', sub: 'e.g. y = 2x + 1', color: '#3b82f6' },
    { n: '2', text: 'Substitute into 2nd equation', sub: '3x + (2x+1) = 9', color: '#6366f1' },
    { n: '3', text: 'Solve for remaining variable', sub: '5x = 8 → x = 1.6', color: '#8b5cf6' },
    { n: '4', text: 'Back-substitute to find other', sub: 'y = 2(1.6)+1 = 4.2', color: '#a855f7' },
    { n: '✓', text: 'Check in BOTH equations', sub: 'Verify solution is correct', color: '#10b981' },
  ];
  return (
    <DiagramCard title="Substitution Method — Process Flow" color="indigo">
      <div className="space-y-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: s.color }}>{s.n}</div>
            <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2">
              <p className="text-sm font-semibold text-slate-800">{s.text}</p>
              <p className="text-xs font-mono text-slate-500 mt-0.5">{s.sub}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="absolute mt-8 ml-3 w-px h-3 bg-slate-300" style={{ position: 'relative', left: '-100%' }}/>
            )}
          </div>
        ))}
      </div>
    </DiagramCard>
  );
}

// Elimination process flow (static)
function EliminationFlowDiagram() {
  const steps = [
    { n: '1', text: 'Align equations in columns', sub: '2x + 3y = 16  and  5x − 3y = 5', color: '#0d9488' },
    { n: '2', text: 'Make one variable cancel', sub: 'Multiply so coefficients are opposites', color: '#0891b2' },
    { n: '3', text: 'Add (or subtract) equations', sub: '7x + 0y = 21 → y is eliminated!', color: '#7c3aed' },
    { n: '4', text: 'Solve for remaining variable', sub: '7x = 21 → x = 3', color: '#6366f1' },
    { n: '✓', text: 'Substitute back & check', sub: 'Find y and verify both equations', color: '#10b981' },
  ];
  return (
    <DiagramCard title="Elimination Method — Process Flow" color="teal">
      <div className="space-y-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: s.color }}>{s.n}</div>
            <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2">
              <p className="text-sm font-semibold text-slate-800">{s.text}</p>
              <p className="text-xs font-mono text-slate-500 mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </DiagramCard>
  );
}

// Discriminant visual — 3 cases
function DiscriminantStaticDiagramLegacy() {
  const W = 340, H = 175;
  const cases = [
    { label: 'b²−4ac > 0', sub: '2 zeros', color: '#10b981', a: 1, k: -3 },
    { label: 'b²−4ac = 0', sub: '1 zero', color: '#f59e0b', a: 1, k: 0 },
    { label: 'b²−4ac < 0', sub: '0 zeros', color: '#ef4444', a: 1, k: 3 },
  ];
  const pw = W / 3, sc = 16, oy = 100;
  return (
    <DiagramCard title="Discriminant — Number of Zeros" color="purple">
      <svg width={W} height={H} className="mx-auto block rounded-xl bg-slate-50">
        {cases.map(({ label, sub, color, a, k }, i) => {
          const ox = i * pw + pw / 2;
          const pts = [];
          for (let x = -3; x <= 3; x += 0.2) {
            const y = a * x * x + k;
            if (y < -5 || y > 7) continue;
            pts.push(`${ox + x * sc},${oy - y * sc}`);
          }
          const curve = 'M ' + pts.join(' L ');
          return (
            <g key={i}>
              <rect x={i*pw+2} y={2} width={pw-4} height={H-4} rx="8" fill="white" stroke="#e2e8f0"/>
              <line x1={i*pw+6} y1={oy} x2={(i+1)*pw-6} y2={oy} stroke="#e2e8f0" strokeWidth="1.5"/>
              <path d={curve} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Zeros */}
              {k < 0 && (() => {
                const sq = Math.sqrt(-k/a);
                return [sq, -sq].map((zx, zi) => <circle key={zi} cx={ox+zx*sc} cy={oy} r="4" fill={color} stroke="white" strokeWidth="2"/>);
              })()}
              {k === 0 && <circle cx={ox} cy={oy} r="4" fill={color} stroke="white" strokeWidth="2"/>}
              <text x={ox} y={H-30} textAnchor="middle" fontSize="9" fill={color} fontWeight="bold">{label}</text>
              <text x={ox} y={H-16} textAnchor="middle" fontSize="10" fill="#374151" fontWeight="bold">{sub}</text>
            </g>
          );
        })}
      </svg>
    </DiagramCard>
  );
}

// Vertex form transformations diagram
function VertexFormDiagram() {
  return (
    <DiagramCard title="Vertex Form — y = a(x − h)² + k" color="purple">
      <div className="flex items-center justify-center mb-4">
        <div className="text-2xl font-bold font-mono text-purple-700 bg-purple-50 px-5 py-3 rounded-2xl border-2 border-purple-200">
          y = <span className="text-amber-600">a</span>(x − <span className="text-blue-600">h</span>)² + <span className="text-green-600">k</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
          <p className="text-2xl font-bold text-amber-600">a</p>
          <p className="font-semibold text-amber-800 text-xs mt-1">Direction & Width</p>
          <p className="text-xs text-slate-500 mt-1">a&gt;0 opens ↑<br/>a&lt;0 opens ↓<br/>|a|&gt;1 = narrow<br/>|a|&lt;1 = wide</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
          <p className="text-2xl font-bold text-blue-600">h</p>
          <p className="font-semibold text-blue-800 text-xs mt-1">Horizontal Shift</p>
          <p className="text-xs text-slate-500 mt-1">h&gt;0 shifts right<br/>h&lt;0 shifts left<br/><br/>⚠️ Sign is FLIPPED<br/>(x−h), not (x+h)</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 border border-green-200">
          <p className="text-2xl font-bold text-green-600">k</p>
          <p className="font-semibold text-green-800 text-xs mt-1">Vertical Shift</p>
          <p className="text-xs text-slate-500 mt-1">k&gt;0 shifts up<br/>k&lt;0 shifts down<br/><br/>k = optimal value<br/>(max or min)</p>
        </div>
      </div>
      <div className="mt-3 bg-slate-50 rounded-xl p-2.5 text-center">
        <p className="text-xs text-slate-600">Vertex = <span className="font-bold text-blue-600">(h, k)</span> &nbsp;|&nbsp; Axis of symmetry: <span className="font-bold text-purple-600">x = h</span></p>
      </div>
    </DiagramCard>
  );
}

// Quadratic formula broken down
function QuadraticFormulaDiagram() {
  return (
    <DiagramCard title="Quadratic Formula — Parts Explained" color="purple">
      <div className="text-center mb-3">
        <div className="inline-block bg-purple-50 border-2 border-purple-200 rounded-2xl px-6 py-3">
          <p className="text-xl font-bold font-mono text-purple-800">x = (−b ± √(b²−4ac)) / (2a)</p>
        </div>
      </div>
      <svg width={320} height={90} className="mx-auto block">
        {/* Annotation arrows pointing to parts */}
        {/* −b */}
        <text x={55} y={30} textAnchor="middle" fontSize="11" fill="#3b82f6" fontWeight="bold">−b</text>
        <line x1={55} y1={34} x2={55} y2={48} stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arr)"/>
        <text x={55} y={62} textAnchor="middle" fontSize="9" fill="#3b82f6">shift numerator</text>
        {/* ± */}
        <text x={115} y={30} textAnchor="middle" fontSize="11" fill="#8b5cf6" fontWeight="bold">±</text>
        <line x1={115} y1={34} x2={115} y2={48} stroke="#8b5cf6" strokeWidth="1.5"/>
        <text x={115} y={62} textAnchor="middle" fontSize="9" fill="#8b5cf6">2 solutions</text>
        {/* discriminant */}
        <text x={185} y={18} textAnchor="middle" fontSize="11" fill="#ef4444" fontWeight="bold">b²−4ac</text>
        <text x={185} y={30} textAnchor="middle" fontSize="9" fill="#ef4444">= discriminant</text>
        <line x1={185} y1={34} x2={185} y2={48} stroke="#ef4444" strokeWidth="1.5"/>
        <text x={185} y={62} textAnchor="middle" fontSize="9" fill="#ef4444">&gt;0: 2 zeros</text>
        <text x={185} y={74} textAnchor="middle" fontSize="9" fill="#ef4444">=0: 1 zero, &lt;0: none</text>
        {/* 2a */}
        <text x={275} y={30} textAnchor="middle" fontSize="11" fill="#10b981" fontWeight="bold">2a</text>
        <line x1={275} y1={34} x2={275} y2={48} stroke="#10b981" strokeWidth="1.5"/>
        <text x={275} y={62} textAnchor="middle" fontSize="9" fill="#10b981">denominator</text>
      </svg>
      <div className="mt-1 bg-amber-50 rounded-xl p-2.5 text-center">
        <p className="text-xs text-amber-800">Use when: factoring is difficult or impossible. Works for <span className="font-bold">any</span> quadratic.</p>
      </div>
    </DiagramCard>
  );
}

// Sine / Cosine law selector
function LawSelectorDiagram() {
  return (
    <DiagramCard title="Sine Law vs Cosine Law — When to Use Which" color="teal">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-200">
          <p className="font-bold text-blue-800 mb-2">📐 Use Sine Law</p>
          <p className="text-xs font-semibold text-blue-700 mb-1">When you know:</p>
          <div className="space-y-1 text-xs text-slate-700">
            <div className="bg-white rounded-lg px-2 py-1 font-mono">AAS — 2 angles + 1 side</div>
            <div className="bg-white rounded-lg px-2 py-1 font-mono">ASA — 2 angles + included side</div>
            <div className="bg-white rounded-lg px-2 py-1 font-mono">SSA — 2 sides + opposite angle</div>
          </div>
          <p className="text-xs font-mono text-blue-700 mt-2 bg-blue-100 rounded-lg p-1.5 text-center">a/sin A = b/sin B = c/sin C</p>
        </div>
        <div className="bg-teal-50 rounded-xl p-3 border-2 border-teal-200">
          <p className="font-bold text-teal-800 mb-2">📏 Use Cosine Law</p>
          <p className="text-xs font-semibold text-teal-700 mb-1">When you know:</p>
          <div className="space-y-1 text-xs text-slate-700">
            <div className="bg-white rounded-lg px-2 py-1 font-mono">SAS — 2 sides + included angle</div>
            <div className="bg-white rounded-lg px-2 py-1 font-mono">SSS — all 3 sides</div>
            <div className="bg-white rounded-lg px-2 py-1 font-mono text-slate-400">(that's it!)</div>
          </div>
          <p className="text-xs font-mono text-teal-700 mt-2 bg-teal-100 rounded-lg p-1.5 text-center">c²=a²+b²−2ab·cos C</p>
        </div>
      </div>
    </DiagramCard>
  );
}

// ─── INTERACTIVE Diagram Components ───────────────────────────────────────────

// Parabola Explorer: drag sliders for a, h, k and see the curve update live
function ParabolaExplorer() {
  const [a, setA] = useState(1);
  const [h, setH] = useState(0);
  const [k, setK] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const W = 340, H = 280, cx = 170, cy = 140, scale = 22;

  const toSvg = (x, y) => ({ sx: cx + x * scale, sy: cy - y * scale });

  // Clamp y to avoid SVG weirdness
  const pathPoints = [];
  for (let px = -7; px <= 7; px += 0.15) {
    const py = a * (px - h) ** 2 + k;
    if (py < -7 || py > 9) continue;
    const { sx, sy } = toSvg(px, py);
    pathPoints.push(`${sx},${sy}`);
  }
  const d = pathPoints.length > 1 ? 'M ' + pathPoints.join(' L ') : '';

  const vertex = toSvg(h, k);
  const yInt = toSvg(0, a * h * h + k);
  const discriminant = -4 * a * k + 4 * a * a * h * h; // = (2ah)^2 - 4a*(-k)... simplified for vertex form zeros: x = h ± sqrt(-k/a)
  const zeros = [];
  if (a !== 0 && -k / a >= 0) {
    const sq = Math.sqrt(-k / a);
    zeros.push(toSvg(h + sq, 0));
    if (sq > 0.05) zeros.push(toSvg(h - sq, 0));
  }

  const axisX = cx + h * scale;

  return (
    <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎛️</span>
        <h3 className="text-lg font-bold text-purple-800">Parabola Explorer</h3>
        <span className="ml-auto text-sm font-mono bg-purple-50 px-3 py-1 rounded-full text-purple-700">
          y = {a}(x {h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`})² {k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`}
        </span>
      </div>

      <svg width={W} height={H} className="mx-auto block rounded-xl bg-slate-50 border border-slate-200">
        {/* Grid */}
        {[-6,-4,-2,0,2,4,6].map(v => (
          <g key={v}>
            <line x1={cx + v*scale} y1={10} x2={cx + v*scale} y2={H-10} stroke="#e2e8f0" strokeWidth="1"/>
            <line x1={10} y1={cy - v*scale} x2={W-10} y2={cy - v*scale} stroke="#e2e8f0" strokeWidth="1"/>
          </g>
        ))}
        {/* Axes */}
        <line x1={10} y1={cy} x2={W-10} y2={cy} stroke="#94a3b8" strokeWidth="2"/>
        <line x1={cx} y1={10} x2={cx} y2={H-10} stroke="#94a3b8" strokeWidth="2"/>
        {/* Axis labels */}
        {[-6,-4,-2,2,4,6].map(v => (
          <text key={v} x={cx + v*scale} y={cy+14} textAnchor="middle" fontSize="9" fill="#94a3b8">{v}</text>
        ))}
        {/* Axis of symmetry */}
        <line x1={axisX} y1={10} x2={axisX} y2={H-10} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7"/>
        {/* Parabola curve */}
        {d && <path d={d} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>}
        {/* Vertex */}
        <circle cx={vertex.sx} cy={vertex.sy} r="6" fill="#7c3aed" stroke="white" strokeWidth="2"
          onMouseEnter={() => setHoveredPoint('vertex')} onMouseLeave={() => setHoveredPoint(null)} style={{cursor:'pointer'}}/>
        {hoveredPoint === 'vertex' && (
          <text x={vertex.sx+10} y={vertex.sy-8} fontSize="11" fill="#7c3aed" fontWeight="bold">Vertex ({h}, {k})</text>
        )}
        {/* Y-intercept */}
        {yInt.sy > 15 && yInt.sy < H-15 && (
          <>
            <circle cx={yInt.sx} cy={yInt.sy} r="5" fill="#0ea5e9" stroke="white" strokeWidth="2"
              onMouseEnter={() => setHoveredPoint('yint')} onMouseLeave={() => setHoveredPoint(null)} style={{cursor:'pointer'}}/>
            {hoveredPoint === 'yint' && (
              <text x={yInt.sx+10} y={yInt.sy-6} fontSize="11" fill="#0ea5e9" fontWeight="bold">y-int (0, {+(a*h*h+k).toFixed(2)})</text>
            )}
          </>
        )}
        {/* X-intercepts / Zeros */}
        {zeros.map((z, i) => (
          <g key={i}>
            <circle cx={z.sx} cy={z.sy} r="5" fill="#10b981" stroke="white" strokeWidth="2"
              onMouseEnter={() => setHoveredPoint(`zero${i}`)} onMouseLeave={() => setHoveredPoint(null)} style={{cursor:'pointer'}}/>
            {hoveredPoint === `zero${i}` && (
              <text x={z.sx+8} y={z.sy-8} fontSize="11" fill="#10b981" fontWeight="bold">
                Zero ({+(h + (i===0?1:-1)*Math.sqrt(-k/a)).toFixed(2)}, 0)
              </text>
            )}
          </g>
        ))}
        {a > 0 && <text x={axisX+4} y={22} fontSize="10" fill="#a855f7">x={h}</text>}
        {a < 0 && <text x={axisX+4} y={H-14} fontSize="10" fill="#a855f7">x={h}</text>}
      </svg>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: 'a (width/direction)', val: a, set: setA, min: -3, max: 3, step: 0.5, color: 'purple' },
          { label: 'h (horizontal shift)', val: h, set: setH, min: -5, max: 5, step: 1, color: 'indigo' },
          { label: 'k (vertical shift)', val: k, set: setK, min: -5, max: 5, step: 1, color: 'pink' },
        ].map(({ label, val, set, min, max, step, color }) => (
          <div key={label} className={`bg-${color}-50 rounded-xl p-3`}>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-semibold text-gray-600">{label}</span>
              <span className={`text-sm font-bold text-${color}-700`}>{val}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={e => set(parseFloat(e.target.value))}
              className="w-full accent-violet-600"/>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="bg-purple-50 rounded-lg p-2 text-center">
          <p className="font-bold text-purple-700">Opens {a > 0 ? '⬆️ Up' : a < 0 ? '⬇️ Down' : '—'}</p>
          <p className="text-gray-500">{a > 0 ? 'Minimum' : 'Maximum'} at vertex</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <p className="font-bold text-blue-700">Vertex ({h}, {k})</p>
          <p className="text-gray-500">Optimal value: {k}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-2 text-center">
          <p className="font-bold text-green-700">{zeros.length} Zero{zeros.length !== 1 ? 's' : ''}</p>
          <p className="text-gray-500">{zeros.length === 0 ? 'No x-intercepts' : zeros.length === 1 ? '1 x-intercept' : '2 x-intercepts'}</p>
        </div>
      </div>
    </div>
  );
}

// Linear Systems Visualizer: shows two lines, their intersection
function LinearSystemsVisualizer() {
  const [m1, setM1] = useState(2);
  const [b1, setB1] = useState(-1);
  const [m2, setM2] = useState(-1);
  const [b2, setB2] = useState(3);

  const W = 340, H = 260, cx = 170, cy = 130, scale = 22;
  const toSvg = (x, y) => ({ sx: cx + x * scale, sy: cy - y * scale });

  // Intersection
  let intersection = null;
  let systemType = 'one';
  if (m1 === m2) {
    systemType = b1 === b2 ? 'infinite' : 'none';
  } else {
    const ix = (b2 - b1) / (m1 - m2);
    const iy = m1 * ix + b1;
    intersection = { x: +ix.toFixed(2), y: +iy.toFixed(2) };
  }

  const linePoints = (m, b) => {
    const pts = [];
    for (let x = -8; x <= 8; x += 0.5) {
      const y = m * x + b;
      if (y < -7 || y > 7) continue;
      const { sx, sy } = toSvg(x, y);
      pts.push(`${sx},${sy}`);
    }
    return pts.length > 1 ? 'M ' + pts.join(' L ') : '';
  };

  const intPt = intersection ? toSvg(intersection.x, intersection.y) : null;

  return (
    <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-lg p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">📊</span>
        <h3 className="text-lg font-bold text-blue-800">Linear Systems Visualizer</h3>
      </div>

      <div className="flex gap-3 mb-3 text-sm">
        <div className="flex items-center gap-1.5"><div className="w-4 h-1 rounded bg-blue-500"/><span className="font-mono text-blue-700">y = {m1}x {b1 >= 0 ? `+ ${b1}` : `- ${Math.abs(b1)}`}</span></div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-1 rounded bg-rose-500"/><span className="font-mono text-rose-700">y = {m2}x {b2 >= 0 ? `+ ${b2}` : `- ${Math.abs(b2)}`}</span></div>
      </div>

      <svg width={W} height={H} className="mx-auto block rounded-xl bg-slate-50 border border-slate-200">
        {[-6,-4,-2,0,2,4,6].map(v => (
          <g key={v}>
            <line x1={cx+v*scale} y1={10} x2={cx+v*scale} y2={H-10} stroke="#e2e8f0" strokeWidth="1"/>
            <line x1={10} y1={cy-v*scale} x2={W-10} y2={cy-v*scale} stroke="#e2e8f0" strokeWidth="1"/>
          </g>
        ))}
        <line x1={10} y1={cy} x2={W-10} y2={cy} stroke="#94a3b8" strokeWidth="2"/>
        <line x1={cx} y1={10} x2={cx} y2={H-10} stroke="#94a3b8" strokeWidth="2"/>
        {[-6,-4,-2,2,4,6].map(v => (
          <text key={v} x={cx+v*scale} y={cy+14} textAnchor="middle" fontSize="9" fill="#94a3b8">{v}</text>
        ))}
        <path d={linePoints(m1, b1)} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
        <path d={linePoints(m2, b2)} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round"/>
        {intPt && intPt.sx > 10 && intPt.sx < W-10 && intPt.sy > 10 && intPt.sy < H-10 && (
          <>
            <circle cx={intPt.sx} cy={intPt.sy} r="7" fill="#10b981" stroke="white" strokeWidth="2.5"/>
            <text x={intPt.sx+10} y={intPt.sy-8} fontSize="11" fill="#065f46" fontWeight="bold">({intersection.x}, {intersection.y})</text>
          </>
        )}
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-xl p-3">
          <p className="text-xs font-bold text-blue-700 mb-1">Line 1: y = {m1}x + b</p>
          <div className="flex gap-2 mb-1">
            <span className="text-xs text-gray-500 w-10">slope</span>
            <input type="range" min={-4} max={4} step={0.5} value={m1} onChange={e => setM1(parseFloat(e.target.value))} className="flex-1 accent-blue-600"/>
            <span className="text-xs font-bold text-blue-700 w-6">{m1}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-xs text-gray-500 w-10">y-int</span>
            <input type="range" min={-5} max={5} step={1} value={b1} onChange={e => setB1(parseFloat(e.target.value))} className="flex-1 accent-blue-600"/>
            <span className="text-xs font-bold text-blue-700 w-6">{b1}</span>
          </div>
        </div>
        <div className="bg-rose-50 rounded-xl p-3">
          <p className="text-xs font-bold text-rose-700 mb-1">Line 2: y = {m2}x + b</p>
          <div className="flex gap-2 mb-1">
            <span className="text-xs text-gray-500 w-10">slope</span>
            <input type="range" min={-4} max={4} step={0.5} value={m2} onChange={e => setM2(parseFloat(e.target.value))} className="flex-1 accent-rose-600"/>
            <span className="text-xs font-bold text-rose-700 w-6">{m2}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-xs text-gray-500 w-10">y-int</span>
            <input type="range" min={-5} max={5} step={1} value={b2} onChange={e => setB2(parseFloat(e.target.value))} className="flex-1 accent-rose-600"/>
            <span className="text-xs font-bold text-rose-700 w-6">{b2}</span>
          </div>
        </div>
      </div>

      <div className={`mt-3 rounded-xl p-3 text-center font-bold text-sm ${
        systemType === 'one' ? 'bg-green-50 text-green-700' :
        systemType === 'none' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
      }`}>
        {systemType === 'one' && intersection && `✅ One solution: intersection at (${intersection.x}, ${intersection.y})`}
        {systemType === 'none' && '🚫 No solution — lines are parallel (same slope, different y-intercepts)'}
        {systemType === 'infinite' && '♾️ Infinite solutions — these are the same line!'}
      </div>
    </div>
  );
}

// Substitution Method Step-Through
function SubstitutionStepper() {
  const [step, setStep] = useState(0);
  const steps = [
    { title: 'The System', content: 'y = 2x + 1   and   3x + y = 9', hint: 'We have two equations. Notice y is already isolated in the first!', highlight: null },
    { title: 'Step 1: Identify the isolated variable', content: 'y = 2x + 1  ← y is isolated here!', hint: 'Since y is by itself, we can substitute 2x + 1 wherever we see y in the other equation.', highlight: 'y' },
    { title: 'Step 2: Substitute', content: '3x + (2x + 1) = 9', hint: 'Replace y in the 2nd equation with "2x + 1". Now we have one equation with one variable!', highlight: 'substitute' },
    { title: 'Step 3: Solve for x', content: '3x + 2x + 1 = 9\n5x + 1 = 9\n5x = 8\nx = 8/5 = 1.6', hint: 'Simplify and solve for x. Combine like terms, then isolate x.', highlight: 'x' },
    { title: 'Step 4: Back-substitute', content: 'y = 2(1.6) + 1\ny = 3.2 + 1\ny = 4.2', hint: 'Plug x = 1.6 back into the first equation to find y.', highlight: 'y' },
    { title: '✅ Solution', content: 'x = 1.6,  y = 4.2\nSolution point: (1.6, 4.2)', hint: 'Check: y = 2(1.6)+1 = 4.2 ✓   and   3(1.6)+4.2 = 4.8+4.2 = 9 ✓', highlight: 'check' },
  ];
  const s = steps[step];
  const colors = ['bg-gray-50','bg-blue-50','bg-indigo-50','bg-purple-50','bg-violet-50','bg-green-50'];
  const borders = ['border-gray-300','border-blue-400','border-indigo-400','border-purple-400','border-violet-400','border-green-500'];

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔄</span>
        <h3 className="text-lg font-bold text-indigo-800">Substitution Method – Step by Step</h3>
      </div>

      <div className="flex gap-1.5 mb-4">
        {steps.map((_, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`flex-1 h-2 rounded-full transition-all ${i <= step ? 'bg-indigo-500' : 'bg-gray-200'}`}/>
        ))}
      </div>

      <div className={`rounded-xl border-2 ${colors[step]} ${borders[step]} p-4 mb-4 transition-all`}>
        <p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">{s.title}</p>
        <pre className="text-base font-mono text-gray-800 whitespace-pre-wrap leading-relaxed">{s.content}</pre>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 flex gap-2">
        <span className="text-lg">💡</span>
        <p className="text-sm text-yellow-800">{s.hint}</p>
      </div>

      <div className="flex justify-between">
        <button onClick={() => setStep(Math.max(0, step-1))} disabled={step === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium disabled:opacity-30 hover:bg-gray-300 transition-all text-sm">
          ← Back
        </button>
        <span className="text-sm text-gray-500 self-center">Step {step+1} of {steps.length}</span>
        <button onClick={() => setStep(Math.min(steps.length-1, step+1))} disabled={step === steps.length-1}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-30 hover:bg-indigo-700 transition-all text-sm">
          Next →
        </button>
      </div>
    </div>
  );
}

// Elimination Method Step-Through
function EliminationStepper() {
  const [step, setStep] = useState(0);
  const steps = [
    { title: 'The System', eq1: '2x + 3y = 16', eq2: '5x − 3y = 5', note: 'Notice the y-coefficients are +3 and −3 — they\'re already opposites!' },
    { title: 'Step 1: Align coefficients (already done!)', eq1: '2x + 3y = 16', eq2: '5x − 3y = 5', note: 'The y-coefficients (+3 and −3) sum to zero. We can add directly. If they weren\'t opposites, we\'d multiply one or both equations first.' },
    { title: 'Step 2: Add the equations', eq1: '2x + 3y = 16', eq2: '+ 5x − 3y = 5', result: '7x + 0y = 21', note: 'The y terms cancel out! +3y + (−3y) = 0. Now we have one equation, one unknown.' },
    { title: 'Step 3: Solve for x', eq1: '7x = 21', result: 'x = 3', note: 'Divide both sides by 7. We found x!' },
    { title: 'Step 4: Substitute to find y', eq1: '2(3) + 3y = 16', eq2: '6 + 3y = 16', result: 'y = 10/3 ≈ 3.33', note: 'Plug x = 3 into either original equation and solve for y.' },
    { title: '✅ Solution', eq1: 'x = 3,   y = 10/3', result: 'Point: (3, 3.33)', note: 'Verify: 2(3)+3(10/3) = 6+10 = 16 ✓   and   5(3)−3(10/3) = 15−10 = 5 ✓' },
  ];
  const s = steps[step];

  return (
    <div className="bg-white rounded-2xl border-2 border-teal-200 shadow-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">➕</span>
        <h3 className="text-lg font-bold text-teal-800">Elimination Method – Step by Step</h3>
      </div>

      <div className="flex gap-1.5 mb-4">
        {steps.map((_, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`flex-1 h-2 rounded-full transition-all ${i <= step ? 'bg-teal-500' : 'bg-gray-200'}`}/>
        ))}
      </div>

      <div className="bg-teal-50 border-2 border-teal-300 rounded-xl p-4 mb-3">
        <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-3">{s.title}</p>
        <div className="font-mono space-y-1">
          {s.eq1 && <p className="text-base text-gray-800 bg-white rounded-lg px-3 py-1.5 border border-teal-200">{s.eq1}</p>}
          {s.eq2 && <p className="text-base text-gray-800 bg-white rounded-lg px-3 py-1.5 border border-teal-200">{s.eq2}</p>}
          {s.result && (
            <>
              <div className="border-t-2 border-teal-400 mt-1 mb-1"/>
              <p className="text-base font-bold text-teal-800 bg-teal-100 rounded-lg px-3 py-1.5">{s.result}</p>
            </>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 flex gap-2">
        <span className="text-lg">💡</span>
        <p className="text-sm text-yellow-800">{s.note}</p>
      </div>

      <div className="flex justify-between">
        <button onClick={() => setStep(Math.max(0, step-1))} disabled={step === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium disabled:opacity-30 hover:bg-gray-300 transition-all text-sm">
          ← Back
        </button>
        <span className="text-sm text-gray-500 self-center">Step {step+1} of {steps.length}</span>
        <button onClick={() => setStep(Math.min(steps.length-1, step+1))} disabled={step === steps.length-1}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium disabled:opacity-30 hover:bg-teal-700 transition-all text-sm">
          Next →
        </button>
      </div>
    </div>
  );
}

// SOH-CAH-TOA Interactive Triangle
function TrigTriangle() {
  const [angle, setAngle] = useState(35);
  const [hyp, setHyp] = useState(10);
  const rad = (angle * Math.PI) / 180;
  const opp = +(hyp * Math.sin(rad)).toFixed(2);
  const adj = +(hyp * Math.cos(rad)).toFixed(2);
  const [highlighted, setHighlighted] = useState(null);

  // SVG coords
  const W = 340, H = 220;
  const A = { x: 40, y: H - 40 };       // bottom-left (right angle)
  const B = { x: 40 + adj * 22, y: H - 40 };  // bottom-right
  const C = { x: 40, y: H - 40 - opp * 22 };  // top-left

  // Clamp to fit in box
  const scale = Math.min(
    (W - 80) / Math.max(adj * 22, 1),
    (H - 80) / Math.max(opp * 22, 1),
    1
  );
  const A2 = { x: 40, y: H - 40 };
  const B2 = { x: 40 + adj * 22 * scale, y: H - 40 };
  const C2 = { x: 40, y: H - 40 - opp * 22 * scale };

  const midAB = { x: (A2.x + B2.x) / 2, y: A2.y + 16 };
  const midAC = { x: A2.x - 44, y: (A2.y + C2.y) / 2 };
  const midBC = { x: (B2.x + C2.x) / 2 + 12, y: (B2.y + C2.y) / 2 };

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📐</span>
        <h3 className="text-lg font-bold text-amber-800">SOH-CAH-TOA Interactive Triangle</h3>
      </div>

      <div className="flex gap-4 mb-3">
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-600">Angle θ = {angle}°</label>
          <input type="range" min={5} max={85} step={1} value={angle} onChange={e => setAngle(+e.target.value)} className="w-full accent-amber-500"/>
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-600">Hypotenuse = {hyp}</label>
          <input type="range" min={3} max={12} step={0.5} value={hyp} onChange={e => setHyp(+e.target.value)} className="w-full accent-amber-500"/>
        </div>
      </div>

      <svg width={W} height={H} className="mx-auto block rounded-xl bg-amber-50 border border-amber-200">
        {/* Triangle */}
        <polygon points={`${A2.x},${A2.y} ${B2.x},${B2.y} ${C2.x},${C2.y}`}
          fill="rgba(251,191,36,0.15)" stroke="none"/>
        {/* Right angle box */}
        <rect x={A2.x} y={A2.y-14} width={14} height={14} fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
        {/* Sides */}
        <line x1={A2.x} y1={A2.y} x2={B2.x} y2={B2.y}
          stroke={highlighted === 'adj' ? '#0ea5e9' : '#64748b'} strokeWidth={highlighted === 'adj' ? 3 : 2}
          onMouseEnter={() => setHighlighted('adj')} onMouseLeave={() => setHighlighted(null)} style={{cursor:'pointer'}}/>
        <line x1={A2.x} y1={A2.y} x2={C2.x} y2={C2.y}
          stroke={highlighted === 'opp' ? '#a855f7' : '#64748b'} strokeWidth={highlighted === 'opp' ? 3 : 2}
          onMouseEnter={() => setHighlighted('opp')} onMouseLeave={() => setHighlighted(null)} style={{cursor:'pointer'}}/>
        <line x1={B2.x} y1={B2.y} x2={C2.x} y2={C2.y}
          stroke={highlighted === 'hyp' ? '#ef4444' : '#64748b'} strokeWidth={highlighted === 'hyp' ? 3 : 2}
          onMouseEnter={() => setHighlighted('hyp')} onMouseLeave={() => setHighlighted(null)} style={{cursor:'pointer'}}/>
        {/* Labels */}
        <text x={midAB.x} y={midAB.y} textAnchor="middle" fontSize="12" fill={highlighted === 'adj' ? '#0369a1' : '#374151'} fontWeight="bold">adj = {adj}</text>
        <text x={midAC.x} y={midAC.y} textAnchor="middle" fontSize="12" fill={highlighted === 'opp' ? '#7c3aed' : '#374151'} fontWeight="bold" transform={`rotate(-90,${midAC.x},${midAC.y})`}>opp = {opp}</text>
        <text x={midBC.x} y={midBC.y} textAnchor="middle" fontSize="12" fill={highlighted === 'hyp' ? '#b91c1c' : '#374151'} fontWeight="bold">{hyp}</text>
        {/* Angle arc */}
        <text x={B2.x - 20} y={B2.y - 10} fontSize="13" fill="#92400e" fontWeight="bold">θ={angle}°</text>
        {/* Vertices */}
        <circle cx={A2.x} cy={A2.y} r="4" fill="#374151"/>
        <circle cx={B2.x} cy={B2.y} r="4" fill="#374151"/>
        <circle cx={C2.x} cy={C2.y} r="4" fill="#374151"/>
      </svg>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className={`rounded-xl p-2.5 text-center cursor-pointer transition-all border-2 ${highlighted === 'opp' ? 'bg-purple-100 border-purple-400' : 'bg-purple-50 border-transparent'}`}
          onMouseEnter={() => setHighlighted('opp')} onMouseLeave={() => setHighlighted(null)}>
          <p className="font-bold text-purple-700 text-sm">sin(θ)</p>
          <p className="text-gray-600 font-mono">opp/hyp</p>
          <p className="font-bold text-purple-800">{opp}/{hyp} = {+(opp/hyp).toFixed(3)}</p>
        </div>
        <div className={`rounded-xl p-2.5 text-center cursor-pointer transition-all border-2 ${highlighted === 'adj' ? 'bg-blue-100 border-blue-400' : 'bg-blue-50 border-transparent'}`}
          onMouseEnter={() => setHighlighted('adj')} onMouseLeave={() => setHighlighted(null)}>
          <p className="font-bold text-blue-700 text-sm">cos(θ)</p>
          <p className="text-gray-600 font-mono">adj/hyp</p>
          <p className="font-bold text-blue-800">{adj}/{hyp} = {+(adj/hyp).toFixed(3)}</p>
        </div>
        <div className={`rounded-xl p-2.5 text-center cursor-pointer transition-all border-2 ${highlighted === 'hyp' ? 'bg-red-100 border-red-400' : 'bg-red-50 border-transparent'}`}
          onMouseEnter={() => setHighlighted('hyp')} onMouseLeave={() => setHighlighted(null)}>
          <p className="font-bold text-red-700 text-sm">tan(θ)</p>
          <p className="text-gray-600 font-mono">opp/adj</p>
          <p className="font-bold text-red-800">{opp}/{adj} = {+(opp/adj).toFixed(3)}</p>
        </div>
      </div>
    </div>
  );
}

// Circle Equation Explorer
function CircleExplorer() {
  const [h, setH] = useState(1);
  const [k, setK] = useState(1);
  const [r, setR] = useState(3);

  const W = 300, H = 260, cx = 150, cy = 130, scale = 22;
  const toSvg = (x, y) => ({ sx: cx + x * scale, sy: cy - y * scale });
  const center = toSvg(h, k);
  const rPx = r * scale;

  return (
    <div className="bg-white rounded-2xl border-2 border-green-200 shadow-lg p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">⭕</span>
        <h3 className="text-lg font-bold text-green-800">Circle Equation Explorer</h3>
        <span className="ml-auto text-sm font-mono bg-green-50 px-2 py-1 rounded-full text-green-700">
          (x{h >= 0 ? ` - ${h}` : ` + ${Math.abs(h)}`})² + (y{k >= 0 ? ` - ${k}` : ` + ${Math.abs(k)}`})² = {r}²
        </span>
      </div>

      <svg width={W} height={H} className="mx-auto block rounded-xl bg-slate-50 border border-slate-200">
        {[-5,-3,-1,1,3,5].map(v => (
          <g key={v}>
            <line x1={cx+v*scale} y1={10} x2={cx+v*scale} y2={H-10} stroke="#e2e8f0" strokeWidth="1"/>
            <line x1={10} y1={cy-v*scale} x2={W-10} y2={cy-v*scale} stroke="#e2e8f0" strokeWidth="1"/>
          </g>
        ))}
        <line x1={10} y1={cy} x2={W-10} y2={cy} stroke="#94a3b8" strokeWidth="2"/>
        <line x1={cx} y1={10} x2={cx} y2={H-10} stroke="#94a3b8" strokeWidth="2"/>
        <circle cx={center.sx} cy={center.sy} r={rPx} fill="rgba(16,185,129,0.1)" stroke="#10b981" strokeWidth="2.5"/>
        {/* Radius line */}
        <line x1={center.sx} y1={center.sy} x2={center.sx + rPx} y2={center.sy} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,3"/>
        <text x={(center.sx + center.sx + rPx)/2} y={center.sy - 6} textAnchor="middle" fontSize="11" fill="#b45309" fontWeight="bold">r = {r}</text>
        {/* Center */}
        <circle cx={center.sx} cy={center.sy} r="5" fill="#10b981" stroke="white" strokeWidth="2"/>
        <text x={center.sx+8} y={center.sy-8} fontSize="11" fill="#065f46" fontWeight="bold">({h}, {k})</text>
      </svg>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { label: 'h (center x)', val: h, set: setH, min: -4, max: 4 },
          { label: 'k (center y)', val: k, set: setK, min: -4, max: 4 },
          { label: 'r (radius)', val: r, set: setR, min: 1, max: 5 },
        ].map(({ label, val, set, min, max }) => (
          <div key={label} className="bg-green-50 rounded-xl p-2">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-500">{label}</span>
              <span className="text-xs font-bold text-green-700">{val}</span>
            </div>
            <input type="range" min={min} max={max} step={1} value={val}
              onChange={e => set(+e.target.value)} className="w-full accent-green-600"/>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-center text-gray-500">Center: ({h}, {k}) • Radius: {r} • Area: {+(Math.PI * r * r).toFixed(1)} • Circumference: {+(2 * Math.PI * r).toFixed(1)}</p>
    </div>
  );
}

// Discriminant Explorer
function DiscriminantExplorer() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(-4);
  const disc = b*b - 4*a*c;
  const numSolutions = disc > 0 ? 2 : disc === 0 ? 1 : 0;

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🔍</span>
        <h3 className="text-lg font-bold text-orange-800">Discriminant Explorer</h3>
        <span className="ml-auto font-mono text-sm bg-orange-50 px-2 py-1 rounded-full text-orange-700">y = {a}x² {b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`} {c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'a', val: a, set: setA, min: -3, max: 3, step: 1 },
          { label: 'b', val: b, set: setB, min: -6, max: 6, step: 1 },
          { label: 'c', val: c, set: setC, min: -6, max: 6, step: 1 },
        ].map(({ label, val, set, min, max, step }) => (
          <div key={label} className="bg-orange-50 rounded-xl p-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-bold text-orange-700">{label}</span>
              <span className="text-sm font-bold">{val}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={e => set(+e.target.value)} className="w-full accent-orange-500"/>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-4 bg-slate-50 border border-slate-200 mb-3 font-mono text-center">
        <p className="text-sm text-gray-500 mb-1">Discriminant = b² − 4ac</p>
        <p className="text-xl font-bold text-gray-800">= ({b})² − 4({a})({c})</p>
        <p className="text-xl font-bold text-gray-800">= {b*b} − {4*a*c < 0 ? `(${4*a*c})` : 4*a*c}</p>
        <p className={`text-2xl font-bold mt-1 ${disc > 0 ? 'text-green-600' : disc === 0 ? 'text-yellow-600' : 'text-red-600'}`}>= {disc}</p>
      </div>

      <div className={`rounded-xl p-4 text-center font-bold ${
        numSolutions === 2 ? 'bg-green-50 border-2 border-green-400 text-green-800' :
        numSolutions === 1 ? 'bg-yellow-50 border-2 border-yellow-400 text-yellow-800' :
        'bg-red-50 border-2 border-red-400 text-red-800'
      }`}>
        {numSolutions === 2 && `✅ Discriminant > 0 → 2 real x-intercepts (zeros)\nx = (−${b} ± √${disc}) / ${2*a}`}
        {numSolutions === 1 && `⚠️ Discriminant = 0 → exactly 1 x-intercept\nx = −${b} / ${2*a} = ${(-b/(2*a)).toFixed(2)}`}
        {numSolutions === 0 && `❌ Discriminant < 0 → no real x-intercepts\nThe parabola doesn't cross the x-axis`}
      </div>
    </div>
  );
}

// ── NEW DIAGRAM COMPONENTS ────────────────────────────────────────────────────

// Coordinate plane basics
function CoordinatePlaneDiagram() {
  const W=320, H=240, cx=160, cy=120, sc=22;
  const points = [{x:3,y:2,label:'(3,2)',q:'Q1',c:'#10b981'},{x:-2,y:3,label:'(−2,3)',q:'Q2',c:'#6366f1'},{x:-3,y:-2,label:'(−3,−2)',q:'Q3',c:'#f59e0b'},{x:2,y:-3,label:'(2,−3)',q:'Q4',c:'#ef4444'}];
  return (
    <DiagramCard title="The Coordinate Plane" color="blue">
      <svg width={W} height={H} className="mx-auto block">
        {[-5,-4,-3,-2,-1,1,2,3,4,5].map(v=>(
          <g key={v}>
            <line x1={cx+v*sc} y1={12} x2={cx+v*sc} y2={H-12} stroke="#f1f5f9" strokeWidth="1"/>
            <line x1={12} y1={cy+v*sc} x2={W-12} y2={cy+v*sc} stroke="#f1f5f9" strokeWidth="1"/>
            <text x={cx+v*sc} y={cy+12} textAnchor="middle" fontSize="8" fill="#94a3b8">{v}</text>
            <text x={cx-10} y={cy-v*sc+3} textAnchor="middle" fontSize="8" fill="#94a3b8">{v !== 0 ? v : ''}</text>
          </g>
        ))}
        <line x1={12} y1={cy} x2={W-12} y2={cy} stroke="#94a3b8" strokeWidth="2"/>
        <line x1={cx} y1={12} x2={cx} y2={H-12} stroke="#94a3b8" strokeWidth="2"/>
        <text x={W-10} y={cy-4} fontSize="11" fill="#64748b" fontWeight="bold">x</text>
        <text x={cx+5} y={16} fontSize="11" fill="#64748b" fontWeight="bold">y</text>
        <text x={cx+6} y={cy-6} fontSize="9" fill="#94a3b8">O(0,0)</text>
        {['Q1 (+,+)','Q2 (−,+)','Q3 (−,−)','Q4 (+,−)'].map((q,i)=>{
          const qx=[cx+30,cx-55,cx-55,cx+30][i], qy=[cy-30,cy-30,cy+40,cy+40][i], qc=['#10b981','#6366f1','#f59e0b','#ef4444'][i];
          return <text key={q} x={qx} y={qy} fontSize="9" fill={qc} fontWeight="bold" opacity="0.7">{q}</text>;
        })}
        {points.map(p=>(
          <g key={p.label}>
            <circle cx={cx+p.x*sc} cy={cy-p.y*sc} r="5" fill={p.c} stroke="white" strokeWidth="1.5"/>
            <text x={cx+p.x*sc+(p.x>0?6:-6)} y={cy-p.y*sc-6} fontSize="9" fill={p.c} fontWeight="bold" textAnchor={p.x>0?'start':'end'}>{p.label}</text>
          </g>
        ))}
      </svg>
    </DiagramCard>
  );
}

// Linear equation forms comparison
function LinearFormsCard() {
  return (
    <DiagramCard title="Three Forms of a Linear Equation" color="blue">
      <div className="space-y-2">
        {[
          {name:'Slope-Intercept',form:'y = mx + b',use:'Best for graphing',eg:'y = 2x + 3 → slope 2, y-int 3',c:'#3b82f6'},
          {name:'Standard Form',form:'Ax + By = C',use:'Best for intercepts',eg:'2x + 3y = 12 → find x,y intercepts',c:'#6366f1'},
          {name:'Point-Slope',form:'y − y₁ = m(x − x₁)',use:'Best for writing equations',eg:'m=3 through (2,1) → y−1=3(x−2)',c:'#8b5cf6'},
        ].map(f=>(
          <div key={f.name} className="rounded-xl p-3 border-l-4" style={{background:'#f8fafc',borderLeftColor:f.c}}>
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div><span className="font-bold text-sm" style={{color:f.c}}>{f.name}</span><span className="ml-2 font-mono text-sm font-bold text-slate-700">{f.form}</span></div>
              <span className="text-xs bg-white rounded-lg px-2 py-0.5 border text-slate-500">{f.use}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">e.g. {f.eg}</p>
          </div>
        ))}
      </div>
    </DiagramCard>
  );
}

// Slope types visual
function SlopeTypesDiagram() {
  const W=320, H=160, mid=80;
  const types=[
    {label:'Positive',sub:'rises left→right',m:1.2,b:-1.5,c:'#10b981',x:10},
    {label:'Negative',sub:'falls left→right',m:-1.2,b:3,c:'#ef4444',x:90},
    {label:'Zero',sub:'horizontal',m:0,b:1.5,c:'#3b82f6',x:170},
    {label:'Undefined',sub:'vertical',m:null,b:null,c:'#f59e0b',x:250},
  ];
  const sc=14, ox=40, ph=H-20;
  return (
    <DiagramCard title="Types of Slope" color="blue">
      <svg width={W} height={H} className="mx-auto block">
        {types.map((t,i)=>{
          const panelX=i*80, panelW=76, panelCx=panelX+38, panelCy=ph/2-10;
          return (
            <g key={t.label}>
              <rect x={panelX+2} y={2} width={panelW} height={H-2} rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
              <line x1={panelX+8} y1={panelCy} x2={panelX+panelW-4} y2={panelCy} stroke="#cbd5e1" strokeWidth="1"/>
              <line x1={panelCx} y1={8} x2={panelCx} y2={ph-20} stroke="#cbd5e1" strokeWidth="1"/>
              {t.m !== null ? (
                (() => {
                  const pts=[];
                  for(let x=-3;x<=3;x+=0.5){
                    const y=t.m*x+t.b;
                    if(y<-4||y>4) continue;
                    pts.push(`${panelCx+x*sc},${panelCy-y*sc}`);
                  }
                  return pts.length>1 ? <path d={'M '+pts.join(' L ')} fill="none" stroke={t.c} strokeWidth="2.5" strokeLinecap="round"/> : null;
                })()
              ) : (
                <line x1={panelCx} y1={12} x2={panelCx} y2={ph-22} stroke={t.c} strokeWidth="2.5" strokeLinecap="round"/>
              )}
              <text x={panelCx} y={H-14} textAnchor="middle" fontSize="9.5" fill={t.c} fontWeight="bold">{t.label}</text>
              <text x={panelCx} y={H-4} textAnchor="middle" fontSize="8" fill="#94a3b8">{t.sub}</text>
            </g>
          );
        })}
      </svg>
    </DiagramCard>
  );
}

// Parallel & perpendicular lines
function ParallelPerpendicularDiagram() {
  const W=320, H=180, cx=160, cy=90, sc=20;
  return (
    <DiagramCard title="Parallel vs Perpendicular Lines" color="blue">
      <svg width={W} height={H} className="mx-auto block">
        <line x1={12} y1={cy} x2={W-12} y2={cy} stroke="#e2e8f0" strokeWidth="1.5"/>
        <line x1={cx} y1={12} x2={cx} y2={H-12} stroke="#e2e8f0" strokeWidth="1.5"/>
        {/* Parallel lines: same slope, different intercepts */}
        {[[2,1,'#3b82f6','m=2'],[2,-2,'#93c5fd','m=2']].map(([m,b,c,lbl],i)=>{
          const pts=[];
          for(let x=-4;x<=4;x+=0.5){const y=m*x+b; if(y<-5||y>5) continue; pts.push(`${cx+x*sc},${cy-y*sc}`);}
          return pts.length>1 ? <g key={i}><path d={'M '+pts.join(' L ')} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><text x={cx+3.5*sc} y={cy-(m*3.5+b)*sc-5} fontSize="9" fill={c} fontWeight="bold">{lbl}</text></g> : null;
        })}
        <text x={60} y={25} fontSize="10" fill="#3b82f6" fontWeight="bold">PARALLEL</text>
        <text x={55} y={37} fontSize="9" fill="#64748b">same slope</text>
        <text x={55} y={47} fontSize="9" fill="#64748b">never meet</text>
        {/* Perpendicular: slopes m and -1/m */}
        {[[1.5,0,'#10b981','m=3/2'],[-0.667,0,'#34d399','m=−2/3']].map(([m,b,c,lbl],i)=>{
          const pts=[];
          for(let x=-4;x<=4;x+=0.5){const y=m*x+b; if(y<-5||y>5) continue; pts.push(`${cx+x*sc},${cy-y*sc}`);}
          return pts.length>1 ? <g key={i}><path d={'M '+pts.join(' L ')} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></g> : null;
        })}
        {/* Right angle marker at origin */}
        <path d="M 168 90 L 168 82 L 160 82" fill="none" stroke="#10b981" strokeWidth="1.5"/>
        <text x={190} y={40} fontSize="10" fill="#10b981" fontWeight="bold">PERPENDICULAR</text>
        <text x={188} y={52} fontSize="9" fill="#64748b">slopes: m × (−1/m) = −1</text>
        <text x={188} y={62} fontSize="9" fill="#64748b">meet at 90°</text>
      </svg>
    </DiagramCard>
  );
}

// Triangle labelling diagram
function TriangleLabellingDiagram() {
  const A={x:60,y:190}, B={x:280,y:190}, C={x:140,y:50};
  const midAB={x:(A.x+B.x)/2,y:(A.y+B.y)/2+14};
  const midBC={x:(B.x+C.x)/2+12,y:(B.y+C.y)/2};
  const midCA={x:(C.x+A.x)/2-16,y:(C.y+A.y)/2};
  return (
    <DiagramCard title="Standard Triangle Labelling" color="amber">
      <svg width={320} height={220} className="mx-auto block">
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(251,191,36,0.08)" stroke="#f59e0b" strokeWidth="2.5"/>
        {/* Vertex labels */}
        {[{p:A,lbl:'A',off:{x:-14,y:14}},{p:B,lbl:'B',off:{x:10,y:14}},{p:C,lbl:'C',off:{x:0,y:-10}}].map(({p,lbl,off})=>(
          <g key={lbl}><circle cx={p.x} cy={p.y} r="4" fill="#f59e0b"/><text x={p.x+off.x} y={p.y+off.y} fontSize="16" fontWeight="bold" fill="#b45309" textAnchor="middle">{lbl}</text></g>
        ))}
        {/* Side labels (lowercase = opposite vertex) */}
        <text x={midAB.x} y={midAB.y} fontSize="13" fontWeight="bold" fill="#6366f1" textAnchor="middle">c</text>
        <text x={midBC.x} y={midBC.y} fontSize="13" fontWeight="bold" fill="#6366f1" textAnchor="middle">a</text>
        <text x={midCA.x} y={midCA.y} fontSize="13" fontWeight="bold" fill="#6366f1" textAnchor="middle">b</text>
        {/* Angle arcs */}
        <path d="M 75 190 Q 73 178 68 171" fill="none" stroke="#ef4444" strokeWidth="1.5"/>
        <path d="M 266 190 Q 265 178 260 171" fill="none" stroke="#ef4444" strokeWidth="1.5"/>
        <path d="M 145 63 Q 152 62 158 68" fill="none" stroke="#ef4444" strokeWidth="1.5"/>
        <text x={80} y={175} fontSize="12" fill="#ef4444" fontWeight="bold">∠A</text>
        <text x={245} y={175} fontSize="12" fill="#ef4444" fontWeight="bold">∠B</text>
        <text x={147} y={82} fontSize="12" fill="#ef4444" fontWeight="bold">∠C</text>
        {/* Annotations */}
        <text x={160} y={212} textAnchor="middle" fontSize="10" fill="#64748b">Side a is opposite ∠A · Side b is opposite ∠B · Side c is opposite ∠C</text>
      </svg>
    </DiagramCard>
  );
}

// Types of triangles by sides
function TriangleTypesDiagram() {
  const types = [
    {label:'Scalene',sub:'all sides different',pts:'30,170 120,170 65,70',ticks:[],c:'#6366f1'},
    {label:'Isosceles',sub:'2 sides equal',pts:'175,170 265,170 220,70',ticks:[[175,170,220,70],[265,170,220,70]],c:'#10b981'},
    {label:'Equilateral',sub:'all sides equal',pts:'310,170 430,170 370,68',ticks:[[310,170,370,68],[430,170,370,68],[310,170,430,170]],c:'#f59e0b'},
  ];
  return (
    <DiagramCard title="Types of Triangles by Sides" color="amber">
      <svg width={460} height={195} className="mx-auto block" viewBox="0 0 460 195">
        {types.map(t=>{
          const pts=t.pts.split(' ').map(p=>p.split(',').map(Number));
          const cx=(pts[0][0]+pts[1][0]+pts[2][0])/3, cy=(pts[0][1]+pts[1][1]+pts[2][1])/3;
          return (
            <g key={t.label}>
              <polygon points={t.pts} fill={`${t.c}18`} stroke={t.c} strokeWidth="2.5"/>
              {t.ticks.map(([x1,y1,x2,y2],i)=>{
                const mx=(x1+x2)/2, my=(y1+y2)/2, angle=Math.atan2(y2-y1,x2-x1), perp=angle+Math.PI/2;
                return <g key={i}><line x1={mx+6*Math.cos(perp)} y1={my+6*Math.sin(perp)} x2={mx-6*Math.cos(perp)} y2={my-6*Math.sin(perp)} stroke={t.c} strokeWidth="2"/><line x1={mx+6*Math.cos(perp)+3*Math.cos(angle)} y1={my+6*Math.sin(perp)+3*Math.sin(angle)} x2={mx-6*Math.cos(perp)+3*Math.cos(angle)} y2={my-6*Math.sin(perp)+3*Math.sin(angle)} stroke={t.c} strokeWidth="2"/></g>;
              })}
              <text x={cx} y={185} textAnchor="middle" fontSize="11" fill={t.c} fontWeight="bold">{t.label}</text>
              <text x={cx} y={196} textAnchor="middle" fontSize="9" fill="#94a3b8">{t.sub}</text>
            </g>
          );
        })}
      </svg>
    </DiagramCard>
  );
}

// Similar triangles diagram
function SimilarTrianglesDiagram() {
  return (
    <DiagramCard title="Similar Triangles — Same Shape, Different Size" color="amber">
      <svg width={320} height={200} className="mx-auto block">
        {/* Small triangle */}
        <polygon points="30,170 130,170 75,100" fill="rgba(99,102,241,0.1)" stroke="#6366f1" strokeWidth="2.5"/>
        <text x={80} y={186} textAnchor="middle" fontSize="10" fill="#6366f1" fontWeight="bold">△ABC</text>
        <text x={22} y={170} fontSize="11" fill="#6366f1" fontWeight="bold">A</text>
        <text x={132} y={170} fontSize="11" fill="#6366f1" fontWeight="bold">B</text>
        <text x={70} y={96} fontSize="11" fill="#6366f1" fontWeight="bold">C</text>
        {/* Sides of small */}
        <text x={80} y={182} textAnchor="middle" fontSize="9" fill="#6366f1">c=5</text>
        <text x={36} y={136} fontSize="9" fill="#6366f1">b=4</text>
        <text x={110} y={136} fontSize="9" fill="#6366f1">a=3</text>
        {/* Large triangle */}
        <polygon points="165,170 305,170 225,70" fill="rgba(16,185,129,0.1)" stroke="#10b981" strokeWidth="2.5"/>
        <text x={155} y={170} fontSize="11" fill="#10b981" fontWeight="bold">D</text>
        <text x={308} y={170} fontSize="11" fill="#10b981" fontWeight="bold">E</text>
        <text x={220} y={65} fontSize="11" fill="#10b981" fontWeight="bold">F</text>
        <text x={235} y={185} textAnchor="middle" fontSize="9" fill="#10b981">f=10</text>
        <text x={168} y={122} fontSize="9" fill="#10b981">e=8</text>
        <text x={278} y={122} fontSize="9" fill="#10b981">d=6</text>
        {/* Ratio arrows */}
        <text x={160} y={50} textAnchor="middle" fontSize="11" fill="#f59e0b" fontWeight="bold">△ABC ~ △DEF</text>
        <text x={160} y={64} textAnchor="middle" fontSize="10" fill="#64748b">a/d = b/e = c/f = 1/2</text>
        <text x={160} y={76} textAnchor="middle" fontSize="10" fill="#64748b">∠A=∠D · ∠B=∠E · ∠C=∠F</text>
      </svg>
    </DiagramCard>
  );
}

// AA similarity proof diagram
function AASimilarityDiagram() {
  return (
    <DiagramCard title="AA Similarity — Two Equal Angles = Similar" color="amber">
      <svg width={320} height={210} className="mx-auto block">
        {/* Triangle 1 */}
        <polygon points="20,185 150,185 90,75" fill="rgba(99,102,241,0.1)" stroke="#6366f1" strokeWidth="2.5"/>
        {/* Angle marks at A and B */}
        <path d="M 35 185 Q 37 173 45 167" fill="none" stroke="#ef4444" strokeWidth="2"/>
        <path d="M 136 185 Q 133 173 126 167" fill="none" stroke="#3b82f6" strokeWidth="2"/>
        <text x={42} y={173} fontSize="10" fill="#ef4444" fontWeight="bold">40°</text>
        <text x={117} y={173} fontSize="10" fill="#3b82f6" fontWeight="bold">60°</text>
        <text x={85} y={198} textAnchor="middle" fontSize="10" fill="#6366f1" fontWeight="bold">△PQR</text>
        {/* Triangle 2 */}
        <polygon points="170,185 310,185 225,95" fill="rgba(16,185,129,0.1)" stroke="#10b981" strokeWidth="2.5"/>
        <path d="M 185 185 Q 188 168 199 159" fill="none" stroke="#ef4444" strokeWidth="2"/>
        <path d="M 294 185 Q 290 168 280 159" fill="none" stroke="#3b82f6" strokeWidth="2"/>
        <text x={198} y={168} fontSize="10" fill="#ef4444" fontWeight="bold">40°</text>
        <text x={270} y={168} fontSize="10" fill="#3b82f6" fontWeight="bold">60°</text>
        <text x={240} y={198} textAnchor="middle" fontSize="10" fill="#10b981" fontWeight="bold">△STU</text>
        {/* Conclusion */}
        <text x={160} y={45} textAnchor="middle" fontSize="11" fill="#f59e0b" fontWeight="bold">∴ △PQR ~ △STU by AA Similarity</text>
        <text x={160} y={58} textAnchor="middle" fontSize="10" fill="#64748b">2 pairs of equal angles → same shape → similar!</text>
      </svg>
    </DiagramCard>
  );
}

// Pythagorean theorem visual
function PythagoreanDiagram() {
  const A={x:60,y:190}, B={x:240,y:190}, C={x:60,y:70};
  return (
    <DiagramCard title="Pythagorean Theorem: a² + b² = c²" color="amber">
      <svg width={320} height={220} className="mx-auto block">
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(251,191,36,0.1)" stroke="#f59e0b" strokeWidth="2.5"/>
        {/* Right angle marker */}
        <path d={`M ${A.x+14} ${A.y} L ${A.x+14} ${A.y-14} L ${A.x} ${A.y-14}`} fill="none" stroke="#64748b" strokeWidth="1.5"/>
        {/* Side labels */}
        <text x={(A.x+B.x)/2} y={A.y+16} textAnchor="middle" fontSize="14" fill="#6366f1" fontWeight="bold">a</text>
        <text x={A.x-14} y={(A.y+C.y)/2} textAnchor="middle" fontSize="14" fill="#10b981" fontWeight="bold">b</text>
        <text x={(B.x+C.x)/2+14} y={(B.y+C.y)/2} textAnchor="middle" fontSize="14" fill="#ef4444" fontWeight="bold">c</text>
        {/* Squares on sides */}
        <rect x={A.x} y={A.y} width={B.x-A.x} height={30} fill="rgba(99,102,241,0.12)" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4,2"/>
        <text x={(A.x+B.x)/2} y={A.y+46} textAnchor="middle" fontSize="11" fill="#6366f1" fontWeight="bold">a²</text>
        <rect x={A.x-30} y={C.y} width={30} height={A.y-C.y} fill="rgba(16,185,129,0.12)" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,2"/>
        <text x={A.x-46} y={(A.y+C.y)/2+4} textAnchor="middle" fontSize="11" fill="#10b981" fontWeight="bold">b²</text>
        {/* Formula box */}
        <rect x={170} y={50} width={135} height={58} rx="10" fill="#fff7ed" stroke="#f59e0b" strokeWidth="1.5"/>
        <text x={237} y={68} textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold">If right angle at A:</text>
        <text x={237} y={84} textAnchor="middle" fontSize="14" fill="#b45309" fontWeight="bold">a² + b² = c²</text>
        <text x={237} y={100} textAnchor="middle" fontSize="10" fill="#92400e">c = hypotenuse (longest)</text>
        <text x={160} y={210} textAnchor="middle" fontSize="10" fill="#64748b">Common triples: 3-4-5, 5-12-13, 8-15-17</text>
      </svg>
    </DiagramCard>
  );
}

// SOH CAH TOA side labelling
function TrigSideLabelsDiagram() {
  const A={x:50,y:185}, B={x:265,y:185}, C={x:50,y:65};
  const θx=70, θy=175;
  return (
    <DiagramCard title="Labelling Sides Relative to Angle θ" color="amber">
      <svg width={320} height={215} className="mx-auto block">
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(251,191,36,0.09)" stroke="#e2e8f0" strokeWidth="1.5"/>
        {/* Right angle */}
        <path d={`M ${A.x+14} ${A.y} L ${A.x+14} ${A.y-14} L ${A.x} ${A.y-14}`} fill="none" stroke="#64748b" strokeWidth="1.5"/>
        {/* Angle θ at B */}
        <path d="M 245 185 Q 242 171 232 165" fill="none" stroke="#6366f1" strokeWidth="2"/>
        <text x={230} y={170} fontSize="13" fill="#6366f1" fontWeight="bold">θ</text>
        {/* Side labels */}
        <rect x={105} y={177} width={95} height={18} rx="5" fill="#6366f180" />
        <text x={152} y={190} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">ADJACENT to θ</text>
        <rect x={32} y={115} width={58} height={18} rx="5" fill="#10b98180"/>
        <text x={61} y={128} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">OPPOSITE θ</text>
        <rect x={135} y={108} width={90} height={18} rx="5" fill="#ef444480"/>
        <text x={180} y={121} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">HYPOTENUSE</text>
        <line x1={135} y1={117} x2={162} y2={133} stroke="#ef444480" strokeWidth="1" strokeDasharray="3,2"/>
        {/* SOH CAH TOA box */}
        <rect x={10} y={200} width={300} height={14} rx="5" fill="#fff7ed"/>
        <text x={160} y={211} textAnchor="middle" fontSize="10" fill="#92400e" fontWeight="bold">sin=Opp/Hyp · cos=Adj/Hyp · tan=Opp/Adj</text>
      </svg>
    </DiagramCard>
  );
}

// Special angles 30-60-90 and 45-45-90
function SpecialAnglesDiagram() {
  return (
    <DiagramCard title="Special Right Triangles" color="amber">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-orange-50 rounded-xl p-3">
          <div className="font-bold text-orange-700 text-sm mb-2 text-center">30-60-90 Triangle</div>
          <svg width="120" height="110" className="mx-auto block">
            <polygon points="10,95 110,95 10,15" fill="rgba(249,115,22,0.1)" stroke="#f97316" strokeWidth="2"/>
            <path d="M 10 80 L 22 80 L 22 95" fill="none" stroke="#64748b" strokeWidth="1.5"/>
            <text x={10} y={108} fontSize="10" fill="#f97316" fontWeight="bold">30°</text>
            <text x={105} y={108} fontSize="10" fill="#f97316" fontWeight="bold">60°</text>
            <text x={-4} y={55} fontSize="10" fill="#f97316" fontWeight="bold">90°</text>
            <text x={60} y={108} textAnchor="middle" fontSize="11" fill="#6366f1" fontWeight="bold">√3</text>
            <text x={0} y={55} fontSize="11" fill="#10b981" fontWeight="bold">1</text>
            <text x={62} y={50} fontSize="11" fill="#ef4444" fontWeight="bold">2</text>
          </svg>
          <div className="text-xs text-center text-slate-600 mt-1">Ratio 1 : √3 : 2</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-3">
          <div className="font-bold text-yellow-700 text-sm mb-2 text-center">45-45-90 Triangle</div>
          <svg width="120" height="110" className="mx-auto block">
            <polygon points="10,95 110,95 110,15" fill="rgba(234,179,8,0.1)" stroke="#eab308" strokeWidth="2"/>
            <path d="M 95 95 L 95 80 L 110 80" fill="none" stroke="#64748b" strokeWidth="1.5"/>
            <text x={7} y={108} fontSize="10" fill="#eab308" fontWeight="bold">45°</text>
            <text x={105} y={108} fontSize="10" fill="#eab308" fontWeight="bold">45°</text>
            <text x={112} y={55} fontSize="10" fill="#eab308" fontWeight="bold">90°</text>
            <text x={60} y={108} textAnchor="middle" fontSize="11" fill="#6366f1" fontWeight="bold">1</text>
            <text x={115} y={58} fontSize="11" fill="#10b981" fontWeight="bold">1</text>
            <text x={46} y={55} fontSize="11" fill="#ef4444" fontWeight="bold">√2</text>
          </svg>
          <div className="text-xs text-center text-slate-600 mt-1">Ratio 1 : 1 : √2</div>
        </div>
        <div className="col-span-2 bg-white rounded-xl border border-orange-200 p-2">
          <table className="w-full text-xs text-center">
            <thead><tr className="font-bold text-slate-600"><th>θ</th><th>sin θ</th><th>cos θ</th><th>tan θ</th></tr></thead>
            <tbody>
              {[['30°','1/2','√3/2','1/√3'],['45°','√2/2','√2/2','1'],['60°','√3/2','1/2','√3']].map(r=>(
                <tr key={r[0]} className="border-t border-slate-100"><td className="font-bold text-orange-600 py-0.5">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DiagramCard>
  );
}

// Quadrilateral types diagram
function QuadrilateralTypesDiagram() {
  const shapes = [
    {label:'Parallelogram',pts:'10,40 90,40 80,80 0,80',props:'opp sides ∥ & =',c:'#6366f1'},
    {label:'Rectangle',pts:'105,40 195,40 195,80 105,80',props:'4 right angles',c:'#3b82f6'},
    {label:'Rhombus',pts:'265,20 310,60 265,100 220,60',props:'4 equal sides',c:'#10b981'},
    {label:'Square',pts:'10,130 70,130 70,190 10,190',props:'4=sides & 4 right ∠',c:'#f59e0b'},
    {label:'Trapezoid',pts:'110,130 210,130 190,190 130,190',props:'1 pair ∥ sides',c:'#ef4444'},
  ];
  return (
    <DiagramCard title="Types of Quadrilaterals" color="teal">
      <svg width={340} height={210} className="mx-auto block">
        {shapes.map(s=>{
          const pts=s.pts.split(' ').map(p=>p.split(',').map(Number));
          const cx=pts.reduce((a,p)=>a+p[0],0)/4, cy=pts.reduce((a,p)=>a+p[1],0)/4;
          return (
            <g key={s.label}>
              <polygon points={s.pts} fill={`${s.c}15`} stroke={s.c} strokeWidth="2"/>
              <text x={cx} y={cy+3} textAnchor="middle" fontSize="9" fill={s.c} fontWeight="bold">{s.label}</text>
              <text x={cx} y={cy+13} textAnchor="middle" fontSize="8" fill="#94a3b8">{s.props}</text>
            </g>
          );
        })}
      </svg>
    </DiagramCard>
  );
}

// Distance formula derivation
function DistanceFormulaDerivationDiagram() {
  const A={x:60,y:170}, B={x:250,y:80}, sc=1;
  const dx=B.x-A.x, dy=A.y-B.y;
  const C={x:B.x,y:A.y};
  return (
    <DiagramCard title="Distance Formula — From Pythagoras" color="teal">
      <svg width={320} height={210} className="mx-auto block">
        {/* Grid */}
        {[0,1,2,3,4,5,6,7,8].map(i=>(
          <g key={i}>
            <line x1={40+i*30} y1={20} x2={40+i*30} y2={190} stroke="#f1f5f9" strokeWidth="1"/>
            <line x1={40} y1={20+i*20} x2={280} y2={20+i*20} stroke="#f1f5f9" strokeWidth="1"/>
          </g>
        ))}
        <line x1={40} y1={190} x2={280} y2={190} stroke="#cbd5e1" strokeWidth="1.5"/>
        <line x1={40} y1={20} x2={40} y2={190} stroke="#cbd5e1" strokeWidth="1.5"/>
        {/* Right triangle */}
        <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="#10b981" strokeWidth="2.5" strokeDasharray="6,3"/>
        <line x1={C.x} y1={C.y} x2={B.x} y2={B.y} stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6,3"/>
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#6366f1" strokeWidth="3"/>
        {/* Right angle */}
        <path d={`M ${C.x-12} ${C.y} L ${C.x-12} ${C.y-12} L ${C.x} ${C.y-12}`} fill="none" stroke="#64748b" strokeWidth="1.5"/>
        {/* Labels */}
        <circle cx={A.x} cy={A.y} r="5" fill="#6366f1" stroke="white" strokeWidth="2"/>
        <circle cx={B.x} cy={B.y} r="5" fill="#6366f1" stroke="white" strokeWidth="2"/>
        <text x={A.x-12} y={A.y+14} fontSize="11" fill="#374151" fontWeight="bold">(x₁,y₁)</text>
        <text x={B.x-12} y={B.y-8} fontSize="11" fill="#374151" fontWeight="bold">(x₂,y₂)</text>
        <text x={(A.x+C.x)/2} y={A.y+14} textAnchor="middle" fontSize="11" fill="#10b981" fontWeight="bold">x₂−x₁</text>
        <text x={C.x+14} y={(B.y+C.y)/2+4} textAnchor="start" fontSize="11" fill="#ef4444" fontWeight="bold">y₂−y₁</text>
        <text x={(A.x+B.x)/2-14} y={(A.y+B.y)/2-8} fontSize="11" fill="#6366f1" fontWeight="bold">d = ?</text>
        <rect x={55} y={5} width={210} height={16} rx="4" fill="#f0f9ff"/>
        <text x={160} y={17} textAnchor="middle" fontSize="10" fill="#1e40af" fontWeight="bold">d = √[(x₂−x₁)² + (y₂−y₁)²]</text>
      </svg>
    </DiagramCard>
  );
}

// Circle diagram with all labels
function CircleFullDiagram() {
  const W=320, H=210, cx=160, cy=105, r=75;
  return (
    <DiagramCard title="Circle — Standard Form (x−h)² + (y−k)² = r²" color="teal">
      <svg width={W} height={H} className="mx-auto block">
        {/* Axes */}
        <line x1={20} y1={cy} x2={W-20} y2={cy} stroke="#e2e8f0" strokeWidth="1.5"/>
        <line x1={cx} y1={10} x2={cx} y2={H-10} stroke="#e2e8f0" strokeWidth="1.5"/>
        {/* Circle */}
        <circle cx={cx} cy={cy} r={r} fill="rgba(16,185,129,0.07)" stroke="#10b981" strokeWidth="2.5"/>
        {/* Center */}
        <circle cx={cx} cy={cy} r="4" fill="#6366f1" stroke="white" strokeWidth="2"/>
        <text x={cx+8} y={cy-6} fontSize="11" fill="#6366f1" fontWeight="bold">Center (h, k)</text>
        {/* Radius */}
        <line x1={cx} y1={cy} x2={cx+r} y2={cy} stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3"/>
        <text x={cx+r/2} y={cy-6} textAnchor="middle" fontSize="11" fill="#ef4444" fontWeight="bold">r</text>
        {/* Point on circle */}
        <circle cx={cx+r*Math.cos(-0.6)} cy={cy+r*Math.sin(-0.6)} r="4" fill="#f59e0b" stroke="white" strokeWidth="2"/>
        <text x={cx+r*Math.cos(-0.6)+8} y={cy+r*Math.sin(-0.6)-4} fontSize="10" fill="#f59e0b" fontWeight="bold">(x,y) on circle</text>
        {/* Formula */}
        <rect x={18} y={H-30} width={284} height={22} rx="6" fill="#f0fdf4"/>
        <text x={160} y={H-15} textAnchor="middle" fontSize="11" fill="#065f46" fontWeight="bold">(x−h)² + (y−k)² = r²</text>
      </svg>
    </DiagramCard>
  );
}

// Angle of elevation/depression diagram
function ElevationDepressionDiagram() {
  return (
    <DiagramCard title="Angle of Elevation & Depression" color="amber">
      <svg width={320} height={200} className="mx-auto block">
        {/* Ground */}
        <line x1={10} y1={160} x2={310} y2={160} stroke="#10b981" strokeWidth="2"/>
        <text x={160} y={175} textAnchor="middle" fontSize="10" fill="#10b981">ground / horizontal</text>
        {/* Person */}
        <circle cx={50} cy={150} r="8" fill="#6366f1"/>
        <line x1={50} y1={158} x2={50} y2={178} stroke="#6366f1" strokeWidth="2"/>
        <text x={50} y={192} textAnchor="middle" fontSize="9" fill="#6366f1">Person</text>
        {/* Building */}
        <rect x={240} y={60} width={30} height={100} fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="2"/>
        <text x={255} y={55} textAnchor="middle" fontSize="9" fill="#6366f1" fontWeight="bold">Top</text>
        {/* Horizontal from person */}
        <line x1={50} y1={150} x2={160} y2={150} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5,3"/>
        {/* Elevation line */}
        <line x1={50} y1={150} x2={242} y2={62} stroke="#ef4444" strokeWidth="2.5"/>
        {/* Angle arc elevation */}
        <path d="M 90 150 Q 88 138 82 132" fill="none" stroke="#ef4444" strokeWidth="2"/>
        <text x={96} y={143} fontSize="11" fill="#ef4444" fontWeight="bold">↑ elevation</text>
        {/* Horizontal from top */}
        <line x1={242} y1={62} x2={160} y2={62} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5,3"/>
        {/* Depression line */}
        <line x1={242} y1={62} x2={50} y2={150} stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,3"/>
        {/* Angle arc depression */}
        <path d="M 220 62 Q 218 74 212 80" fill="none" stroke="#3b82f6" strokeWidth="2"/>
        <text x={160} y={55} fontSize="11" fill="#3b82f6" fontWeight="bold">depression ↓</text>
        {/* Key fact */}
        <text x={160} y={190} textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold">elevation angle = depression angle (alternate angles)</text>
      </svg>
    </DiagramCard>
  );
}

// Sine law labelled triangle
function SineLawFullDiagram() {
  const A={x:60,y:190}, B={x:260,y:190}, C={x:120,y:60};
  const midAB={x:(A.x+B.x)/2,y:210};
  const midBC={x:(B.x+C.x)/2+16,y:(B.y+C.y)/2};
  const midCA={x:(C.x+A.x)/2-18,y:(C.y+A.y)/2+4};
  return (
    <DiagramCard title="Sine Law — Any Triangle" color="amber">
      <svg width={320} height={230} className="mx-auto block">
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(251,191,36,0.09)" stroke="#f59e0b" strokeWidth="2.5"/>
        {/* Vertices */}
        {[{p:A,lbl:'A',ox:-12,oy:14},{p:B,lbl:'B',ox:10,oy:14},{p:C,lbl:'C',ox:4,oy:-10}].map(({p,lbl,ox,oy})=>(
          <g key={lbl}><circle cx={p.x} cy={p.y} r="4" fill="#f59e0b"/><text x={p.x+ox} y={p.y+oy} fontSize="15" fontWeight="bold" fill="#b45309">{lbl}</text></g>
        ))}
        {/* Sides */}
        <text x={midAB.x} y={midAB.y} textAnchor="middle" fontSize="13" fill="#6366f1" fontWeight="bold">c</text>
        <text x={midBC.x} y={midBC.y} fontSize="13" fill="#6366f1" fontWeight="bold">a</text>
        <text x={midCA.x} y={midCA.y} fontSize="13" fill="#6366f1" fontWeight="bold">b</text>
        {/* Formula */}
        <rect x={10} y={5} width={300} height={40} rx="8" fill="#fff7ed"/>
        <text x={160} y={20} textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold">a / sin(A) = b / sin(B) = c / sin(C)</text>
        <text x={160} y={36} textAnchor="middle" fontSize="10" fill="#92400e">Use when you have a matched angle–side pair</text>
        {/* Matched pair arrows */}
        <path d="M 60 190 Q 70 220 90 225" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2"/>
        <text x={92} y={228} fontSize="9" fill="#ef4444">∠A ↔ side a</text>
      </svg>
    </DiagramCard>
  );
}

// Cosine law full diagram
function CosineLawFullDiagram() {
  const A={x:50,y:185}, B={x:270,y:185}, C={x:100,y:65};
  return (
    <DiagramCard title="Cosine Law — SAS or SSS" color="amber">
      <svg width={320} height={220} className="mx-auto block">
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(239,68,68,0.07)" stroke="#ef4444" strokeWidth="2.5"/>
        {/* Vertices */}
        {[{p:A,lbl:'A',ox:-12,oy:14},{p:B,lbl:'B',ox:10,oy:14},{p:C,lbl:'C',ox:4,oy:-10}].map(({p,lbl,ox,oy})=>(
          <g key={lbl}><circle cx={p.x} cy={p.y} r="4" fill="#ef4444"/><text x={p.x+ox} y={p.y+oy} fontSize="14" fontWeight="bold" fill="#b91c1c">{lbl}</text></g>
        ))}
        {/* Side labels */}
        <text x={(A.x+B.x)/2} y={A.y+16} textAnchor="middle" fontSize="13" fill="#6366f1" fontWeight="bold">c</text>
        <text x={(B.x+C.x)/2+14} y={(B.y+C.y)/2} fontSize="13" fill="#6366f1" fontWeight="bold">a</text>
        <text x={(C.x+A.x)/2-16} y={(C.y+A.y)/2+4} fontSize="13" fill="#6366f1" fontWeight="bold">b</text>
        {/* Angle arc at C (included angle) */}
        <path d="M 108 80 Q 120 80 124 90" fill="none" stroke="#f59e0b" strokeWidth="2.5"/>
        <text x={128} y={88} fontSize="11" fill="#f59e0b" fontWeight="bold">C</text>
        {/* Formula boxes */}
        <rect x={8} y={5} width={304} height={40} rx="8" fill="#fef2f2"/>
        <text x={160} y={20} textAnchor="middle" fontSize="11" fill="#991b1b" fontWeight="bold">c² = a² + b² − 2ab·cos(C)</text>
        <text x={160} y={35} textAnchor="middle" fontSize="10" fill="#991b1b">SAS: know 2 sides + included angle → find 3rd side</text>
        <rect x={8} y={196} width={304} height={22} rx="8" fill="#fff7ed"/>
        <text x={160} y={211} textAnchor="middle" fontSize="10" fill="#92400e" fontWeight="bold">SSS: cos(C) = (a²+b²−c²) / (2ab) → find angle</text>
      </svg>
    </DiagramCard>
  );
}

// Method selector card
function TrigMethodSelectorCard() {
  const cases=[
    {label:'Right triangle?',result:'SOH CAH TOA',c:'#10b981'},
    {label:'Have AAS or ASA?',result:'Sine Law',c:'#6366f1'},
    {label:'Have SSA?',result:'Sine Law (ambiguous!)',c:'#f59e0b'},
    {label:'Have SAS?',result:'Cosine Law',c:'#ef4444'},
    {label:'Have SSS?',result:'Cosine Law',c:'#ef4444'},
  ];
  return (
    <DiagramCard title="Which Method? — Decision Guide" color="amber">
      <div className="space-y-2">
        {cases.map(c=>(
          <div key={c.label} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{background:`${c.c}12`,border:`1px solid ${c.c}40`}}>
            <span className="text-sm text-slate-600 flex-1">{c.label}</span>
            <span className="text-sm font-bold rounded-lg px-2 py-0.5" style={{color:c.c,background:`${c.c}18`}}>→ {c.result}</span>
          </div>
        ))}
      </div>
    </DiagramCard>
  );
}

// Quadratics discriminant 3-case
function DiscriminantStaticDiagram() {
  const W=320, H=170, sc=16;
  const cases=[
    {disc:'>0',label:'2 zeros',sub:'crosses x-axis twice',a:0.8,b:0,c:-3,c1:'#10b981',ox:55},
    {disc:'=0',label:'1 zero',sub:'touches x-axis (vertex ON axis)',a:0.8,b:0,c:0,c1:'#f59e0b',ox:160},
    {disc:'<0',label:'0 zeros',sub:'no x-intercepts',a:0.8,b:0,c:3,c1:'#ef4444',ox:265},
  ];
  const cy=100;
  return (
    <DiagramCard title="Discriminant: Number of Zeros" color="purple">
      <svg width={W} height={H} className="mx-auto block">
        {cases.map(({a,b,c,c1,ox,label,sub,disc})=>{
          const pts=[];
          for(let x=-4;x<=4;x+=0.3){const y=a*x*x+b*x+c;if(y<-4||y>8)continue;pts.push(`${ox+x*sc},${cy-y*sc}`);}
          const sqr=b*b-4*a*c;
          const zeros=sqr>0?[(-b+Math.sqrt(sqr))/(2*a),(-b-Math.sqrt(sqr))/(2*a)]:sqr===0?[-b/(2*a)]:[];
          return (
            <g key={label}>
              <line x1={ox-52} y1={cy} x2={ox+52} y2={cy} stroke="#e2e8f0" strokeWidth="1.5"/>
              {pts.length>1&&<path d={'M '+pts.join(' L ')} fill="none" stroke={c1} strokeWidth="2.5" strokeLinecap="round"/>}
              {zeros.map((z,i)=><circle key={i} cx={ox+z*sc} cy={cy} r="4" fill={c1} stroke="white" strokeWidth="1.5"/>)}
              <text x={ox} y={H-30} textAnchor="middle" fontSize="10" fill={c1} fontWeight="bold">b²−4ac {disc}</text>
              <text x={ox} y={H-18} textAnchor="middle" fontSize="10" fill={c1} fontWeight="bold">{label}</text>
              <text x={ox} y={H-6} textAnchor="middle" fontSize="8" fill="#94a3b8">{sub}</text>
            </g>
          );
        })}
      </svg>
    </DiagramCard>
  );
}

// Parabola 3 forms comparison
function ParabolaFormsCard() {
  return (
    <DiagramCard title="Three Forms — Same Parabola" color="purple">
      <div className="space-y-2">
        {[
          {form:'Standard',eq:'y = ax² + bx + c',reads:'y-intercept = c directly',eg:'y = x² − 4x + 3',c:'#7c3aed'},
          {form:'Vertex',eq:'y = a(x−h)² + k',reads:'Vertex = (h, k) directly',eg:'y = (x−2)² − 1',c:'#6366f1'},
          {form:'Factored',eq:'y = a(x−r)(x−s)',reads:'Zeros x = r and x = s directly',eg:'y = (x−1)(x−3)',c:'#3b82f6'},
        ].map(f=>(
          <div key={f.form} className="rounded-xl p-2.5" style={{background:`${f.c}10`,border:`1.5px solid ${f.c}35`}}>
            <div className="flex gap-2 items-baseline flex-wrap">
              <span className="text-xs font-bold" style={{color:f.c}}>{f.form}</span>
              <span className="font-mono text-sm font-bold text-slate-700">{f.eq}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">✓ Instantly reads: {f.reads}</p>
            <p className="text-xs font-mono text-slate-400 mt-0.5">e.g. {f.eg}</p>
          </div>
        ))}
        <div className="text-xs text-slate-500 text-center mt-1 bg-slate-50 rounded-lg p-2">All three describe the SAME parabola — y=x²−4x+3 = (x−2)²−1 = (x−1)(x−3)</div>
      </div>
    </DiagramCard>
  );
}

// Nested triangle (parallel line) situation
function NestedTriangleDiagram() {
  const A={x:160,y:30}, B={x:30,y:200}, C={x:290,y:200};
  const t=0.6; // D and E are 60% of the way from A
  const D={x:A.x+t*(B.x-A.x), y:A.y+t*(B.y-A.y)};
  const E={x:A.x+t*(C.x-A.x), y:A.y+t*(C.y-A.y)};
  return (
    <DiagramCard title="Situation 1 — Nested Triangle (DE ∥ BC)" color="amber">
      <svg width={320} height={230} className="mx-auto block">
        {/* Large triangle */}
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(99,102,241,0.07)" stroke="#6366f1" strokeWidth="2.5"/>
        {/* Small inner triangle */}
        <polygon points={`${A.x},${A.y} ${D.x},${D.y} ${E.x},${E.y}`} fill="rgba(16,185,129,0.12)" stroke="#10b981" strokeWidth="2.5"/>
        {/* Parallel line DE */}
        <line x1={D.x-10} y1={D.y} x2={E.x+10} y2={E.y} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,3"/>
        <line x1={B.x-10} y1={B.y} x2={C.x+10} y2={C.y} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,3"/>
        {/* Parallel marks */}
        {[[D.x,D.y,E.x,E.y],[B.x,B.y,C.x,C.y]].map(([x1,y1,x2,y2],i)=>{
          const mx=(x1+x2)/2, my=(y1+y2)/2;
          return <g key={i}><line x1={mx-5} y1={my-3} x2={mx+5} y2={my-3} stroke="#f59e0b" strokeWidth="2"/><line x1={mx-5} y1={my+3} x2={mx+5} y2={my+3} stroke="#f59e0b" strokeWidth="2"/></g>;
        })}
        {/* Labels */}
        <text x={A.x} y={A.y-8} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#b45309">A</text>
        <text x={B.x-14} y={B.y+4} fontSize="14" fontWeight="bold" fill="#6366f1">B</text>
        <text x={C.x+6} y={C.y+4} fontSize="14" fontWeight="bold" fill="#6366f1">C</text>
        <text x={D.x-14} y={D.y+4} fontSize="13" fontWeight="bold" fill="#10b981">D</text>
        <text x={E.x+6} y={E.y+4} fontSize="13" fontWeight="bold" fill="#10b981">E</text>
        <text x={160} y={145} textAnchor="middle" fontSize="10" fill="#f59e0b" fontWeight="bold">DE ∥ BC</text>
        {/* Shared angle mark */}
        <path d="M 160 46 Q 167 50 172 58" fill="none" stroke="#ef4444" strokeWidth="2"/>
        <text x={175} y={55} fontSize="9" fill="#ef4444" fontWeight="bold">∠A shared</text>
        {/* Result */}
        <rect x={10} y={210} width={300} height={18} rx="5" fill="#f0fdf4"/>
        <text x={160} y={223} textAnchor="middle" fontSize="10" fill="#065f46" fontWeight="bold">△ADE ~ △ABC by AA   |   AD/AB = AE/AC = DE/BC</text>
      </svg>
    </DiagramCard>
  );
}

// Overlapping / shared angle situation
function SharedAngleDiagram() {
  const A={x:60,y:195}, B={x:280,y:195}, C={x:130,y:60};
  const D={x:110,y:195}, E={x:200,y:120};
  return (
    <DiagramCard title="Situation 2 — Shared Angle Triangles" color="amber">
      <svg width={320} height={220} className="mx-auto block">
        {/* Outer triangle ABC */}
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(99,102,241,0.07)" stroke="#6366f1" strokeWidth="2.5"/>
        {/* Inner/overlapping triangle ADE */}
        <polygon points={`${A.x},${A.y} ${D.x},${D.y} ${E.x},${E.y}`} fill="rgba(16,185,129,0.13)" stroke="#10b981" strokeWidth="2"/>
        {/* Shared angle arc at A */}
        <path d="M 78 195 Q 77 181 84 172" fill="none" stroke="#ef4444" strokeWidth="2.5"/>
        <text x={88} y={178} fontSize="10" fill="#ef4444" fontWeight="bold">∠A</text>
        <text x={63} y={210} fontSize="9" fill="#ef4444">SHARED</text>
        {/* Labels */}
        <text x={A.x-14} y={A.y+4} fontSize="14" fontWeight="bold" fill="#b45309">A</text>
        <text x={B.x+6} y={B.y+4} fontSize="13" fontWeight="bold" fill="#6366f1">B</text>
        <text x={C.x-4} y={C.y-8} fontSize="13" fontWeight="bold" fill="#6366f1">C</text>
        <text x={D.x} y={D.y+14} fontSize="13" fontWeight="bold" fill="#10b981">D</text>
        <text x={E.x+6} y={E.y} fontSize="13" fontWeight="bold" fill="#10b981">E</text>
        {/* Equal angle annotation */}
        <text x={160} y={30} textAnchor="middle" fontSize="10" fill="#f59e0b" fontWeight="bold">If ∠ADE = ∠ABC → △ADE ~ △ABC (AA)</text>
        <text x={160} y={43} textAnchor="middle" fontSize="9" fill="#64748b">∠A is shared + one more equal angle = similar!</text>
      </svg>
    </DiagramCard>
  );
}

// Shadow / indirect measurement situation
function ShadowDiagram() {
  return (
    <DiagramCard title="Situation 3 — Shadow & Height Problems" color="amber">
      <svg width={320} height={200} className="mx-auto block">
        {/* Ground */}
        <line x1={10} y1={170} x2={310} y2={170} stroke="#10b981" strokeWidth="2"/>
        {/* Person */}
        <circle cx={60} cy={142} r="8" fill="#6366f1"/>
        <line x1={60} y1={150} x2={60} y2={170} stroke="#6366f1" strokeWidth="2.5"/>
        <line x1={60} y1={155} x2={50} y2={165} stroke="#6366f1" strokeWidth="2"/>
        <line x1={60} y1={155} x2={70} y2={165} stroke="#6366f1" strokeWidth="2"/>
        <text x={60} y={186} textAnchor="middle" fontSize="9" fill="#6366f1" fontWeight="bold">h = 1.8m</text>
        {/* Person shadow */}
        <line x1={60} y1={170} x2={100} y2={170} stroke="#6366f1" strokeWidth="3"/>
        <text x={80} y={183} textAnchor="middle" fontSize="9" fill="#6366f1">2.4m</text>
        {/* Tree */}
        <rect x={200} y={80} width={8} height={90} fill="#92400e"/>
        <polygon points="204,30 180,85 228,85" fill="#15803d"/>
        <text x={204} y={198} textAnchor="middle" fontSize="9" fill="#92400e" fontWeight="bold">h = ?</text>
        {/* Tree shadow */}
        <line x1={204} y1={170} x2={290} y2={170} stroke="#92400e" strokeWidth="3"/>
        <text x={247} y={183} textAnchor="middle" fontSize="9" fill="#92400e">8.0m</text>
        {/* Sun rays */}
        <line x1={60} y1={150} x2={100} y2={170} stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3"/>
        <line x1={204} y1={35} x2={290} y2={170} stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3"/>
        <text x={310} y={40} fontSize="9" fill="#f59e0b" fontWeight="bold">☀</text>
        {/* Right angle markers */}
        <path d="M 60 170 L 60 160 L 70 160" fill="none" stroke="#64748b" strokeWidth="1.5"/>
        <path d="M 204 170 L 204 160 L 214 160" fill="none" stroke="#64748b" strokeWidth="1.5"/>
        {/* Formula */}
        <rect x={8} y={6} width={304} height={22} rx="5" fill="#fef9c3"/>
        <text x={160} y={20} textAnchor="middle" fontSize="10" fill="#713f12" fontWeight="bold">1.8/2.4 = h/8.0  →  h = 8.0 × 1.8 ÷ 2.4 = 6.0 m</text>
      </svg>
    </DiagramCard>
  );
}

// Altitude to hypotenuse situation
function AltitudeHypotenuseDiagram() {
  const A={x:40,y:185}, B={x:280,y:185}, C={x:105,y:75};
  // Foot of altitude from C to AB
  const dx=B.x-A.x, dy=B.y-A.y, t=((C.x-A.x)*dx+(C.y-A.y)*dy)/(dx*dx+dy*dy);
  const D={x:A.x+t*dx, y:A.y+t*dy};
  return (
    <DiagramCard title="Situation 4 — Altitude to Hypotenuse" color="amber">
      <svg width={320} height={215} className="mx-auto block">
        {/* Main right triangle */}
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(99,102,241,0.07)" stroke="#6366f1" strokeWidth="2.5"/>
        {/* Right angle at C */}
        <path d={`M ${C.x+10} ${C.y+8} L ${C.x+18} ${C.y-2} L ${C.x+8} ${C.y-10}`} fill="none" stroke="#64748b" strokeWidth="1.5"/>
        {/* Altitude */}
        <line x1={C.x} y1={C.y} x2={D.x} y2={D.y} stroke="#ef4444" strokeWidth="2.5"/>
        {/* Right angle at D */}
        <path d={`M ${D.x-8} ${D.y-8} L ${D.x} ${D.y-12} L ${D.x+8} ${D.y-4}`} fill="none" stroke="#64748b" strokeWidth="1.5"/>
        {/* Three similar triangles filled */}
        <polygon points={`${A.x},${A.y} ${D.x},${D.y} ${C.x},${C.y}`} fill="rgba(16,185,129,0.12)" stroke="#10b981" strokeWidth="1.5"/>
        <polygon points={`${D.x},${D.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(251,191,36,0.15)" stroke="#f59e0b" strokeWidth="1.5"/>
        {/* Labels */}
        <text x={A.x-12} y={A.y+14} fontSize="13" fontWeight="bold" fill="#6366f1">A</text>
        <text x={B.x+6} y={B.y+14} fontSize="13" fontWeight="bold" fill="#6366f1">B</text>
        <text x={C.x-4} y={C.y-10} fontSize="13" fontWeight="bold" fill="#6366f1">C</text>
        <text x={D.x-4} y={D.y+16} fontSize="13" fontWeight="bold" fill="#ef4444">D</text>
        <text x={(A.x+D.x)/2+2} y={(A.y+D.y)/2+10} fontSize="9" fill="#10b981" fontWeight="bold">△ACD</text>
        <text x={(D.x+B.x)/2-4} y={(D.y+B.y)/2+10} fontSize="9" fill="#f59e0b" fontWeight="bold">△CDB</text>
        {/* Results */}
        <rect x={10} y={198} width={300} height={14} rx="4" fill="#fef2f2"/>
        <text x={160} y={209} textAnchor="middle" fontSize="9" fill="#991b1b" fontWeight="bold">△ABC ~ △ACD ~ △CDB  |  CD² = AD × DB</text>
      </svg>
    </DiagramCard>
  );
}

// Mirror / reflection indirect measurement
function MirrorDiagram() {
  return (
    <DiagramCard title="Situation 5 — Mirror Indirect Measurement" color="amber">
      <svg width={320} height={200} className="mx-auto block">
        {/* Ground */}
        <line x1={10} y1={165} x2={310} y2={165} stroke="#94a3b8" strokeWidth="1.5"/>
        {/* Mirror on ground */}
        <rect x={148} y={160} width={24} height={8} rx="2" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x={160} y={185} textAnchor="middle" fontSize="9" fill="#3b82f6" fontWeight="bold">mirror</text>
        {/* Person */}
        <circle cx={60} cy={135} r="9" fill="#6366f1"/>
        <line x1={60} y1={144} x2={60} y2={165} stroke="#6366f1" strokeWidth="2.5"/>
        <text x={60} y={197} textAnchor="middle" fontSize="9" fill="#6366f1">you (1.6m)</text>
        {/* Person triangle */}
        <polygon points="60,144 60,165 160,165" fill="rgba(99,102,241,0.1)" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4,2"/>
        {/* Building */}
        <rect x={232} y={60} width={30} height={105} fill="rgba(15,23,42,0.08)" stroke="#374151" strokeWidth="2"/>
        <text x={247} y={50} textAnchor="middle" fontSize="9" fill="#374151" fontWeight="bold">h = ?</text>
        {/* Building triangle */}
        <polygon points="160,165 247,165 247,60" fill="rgba(251,191,36,0.12)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,2"/>
        {/* Light path */}
        <line x1={60} y1={144} x2={160} y2={165} stroke="#ef4444" strokeWidth="2"/>
        <line x1={160} y1={165} x2={247} y2={60} stroke="#ef4444" strokeWidth="2"/>
        {/* Equal angle marks */}
        <path d="M 152 158 Q 154 152 162 152" fill="none" stroke="#ef4444" strokeWidth="2"/>
        <path d="M 158 158 Q 162 152 168 154" fill="none" stroke="#ef4444" strokeWidth="2"/>
        <text x={160} y={148} textAnchor="middle" fontSize="8" fill="#ef4444">equal angles</text>
        {/* Distances */}
        <text x={110} y={178} textAnchor="middle" fontSize="9" fill="#6366f1">d₁</text>
        <text x={203} y={178} textAnchor="middle" fontSize="9" fill="#f59e0b">d₂</text>
        {/* Formula */}
        <rect x={8} y={8} width={304} height={22} rx="5" fill="#f0f9ff"/>
        <text x={160} y={22} textAnchor="middle" fontSize="10" fill="#1e40af" fontWeight="bold">your height / d₁  =  object height / d₂</text>
      </svg>
    </DiagramCard>
  );
}

// Diagrams keyed by "sectionId-noteIndex" — rendered inside that note card, below its bullet points.
// noteIndex is 0-based (the order notes appear in the section).
const NOTE_DIAGRAMS = {
  // ── Linear Systems — BASICS ─────────────────────────────────────────────────
  'linear-basics-2':       <CoordinatePlaneDiagram />,      // "The Coordinate Plane"
  'linear-basics-3':       <SlopeTypesDiagram />,           // "Understanding Slope"
  'linear-basics-4':       <LinearFormsCard />,             // "Three Forms of a Linear Equation"
  'linear-basics-6':       <ParallelPerpendicularDiagram />, // "Parallel and Perpendicular"

  // ── Linear Systems — EXISTING ────────────────────────────────────────────────
  'graphing-lines-0':      <LinearSystemsVisualizer />,
  'graphing-lines-2':      <SlopeDiagram />,
  'substitution-1':        <SubstitutionFlowDiagram />,
  'substitution-0':        <SubstitutionStepper />,
  'elimination-1':         <EliminationFlowDiagram />,
  'elimination-2':         <EliminationStepper />,
  'types-of-solutions-0':  <SystemTypesDiagram />,

  // ── Quadratics — BASICS ──────────────────────────────────────────────────────
  'quadratics-basics-1':   <ParabolaAnatomyDiagram />,      // "The Parabola — shape"
  'quadratics-basics-2':   <ParabolaFormsCard />,           // "Three Forms"
  'quadratics-basics-4':   <DiscriminantStaticDiagram />,   // "The Discriminant"

  // ── Quadratics — EXISTING ────────────────────────────────────────────────────
  'parabola-features-0':   <ParabolaAnatomyDiagram />,
  'parabola-features-1':   <AValueDiagram />,
  'parabola-features-3':   <ParabolaExplorer />,
  'vertex-form-0':         <VertexFormDiagram />,
  'vertex-form-4':         <ParabolaExplorer />,
  'standard-form-2':       <DiscriminantStaticDiagram />,
  'standard-form-1':       <ParabolaExplorer />,
  'factored-form-0':       <DiscriminantStaticDiagram />,
  'quadratic-formula-0':   <QuadraticFormulaDiagram />,
  'quadratic-formula-2':   <DiscriminantExplorer />,
  'completing-square-0':   <VertexFormDiagram />,

  // ── Analytic Geometry — BASICS ───────────────────────────────────────────────
  'analytic-basics-1':     <CoordinatePlaneDiagram />,      // "Coordinate Plane"
  'analytic-basics-2':     <ParallelPerpendicularDiagram />, // "Slope — parallel/perp"
  'analytic-basics-3':     <QuadrilateralTypesDiagram />,   // "Types of Quadrilaterals"
  'analytic-basics-4':     <TriangleTypesDiagram />,        // "Types of Triangles"

  // ── Analytic Geometry — EXISTING ─────────────────────────────────────────────
  'distance-midpoint-0':   <DistanceFormulaDerivationDiagram />,
  'circles-0':             <CircleFullDiagram />,
  'circles-1':             <CircleExplorer />,

  // ── Trigonometry — TRIANGLE BASICS ───────────────────────────────────────────
  'triangle-basics-0':     <TriangleLabellingDiagram />,    // "Parts of a Triangle"
  'triangle-basics-1':     <TriangleLabellingDiagram />,    // "Standard Labelling"
  'triangle-basics-2':     <TriangleTypesDiagram />,        // "Types by Angles"
  'triangle-basics-3':     <TriangleTypesDiagram />,        // "Types by Sides"
  'triangle-basics-4':     <PythagoreanDiagram />,          // "Pythagorean Theorem"

  // ── Trigonometry — SIMILAR TRIANGLES ─────────────────────────────────────────
  'similar-triangles-0':   <SimilarTrianglesDiagram />,     // "What Are Similar Triangles"
  'similar-triangles-1':   <AASimilarityDiagram />,         // "Three Ways to Prove"
  'similar-triangles-3':   <SimilarTrianglesDiagram />,     // "Using to Find Missing Sides"
  'similar-triangles-4':   <NestedTriangleDiagram />,       // "Situation 1 — Nested/Parallel"
  'similar-triangles-5':   <SharedAngleDiagram />,          // "Situation 2 — Shared Angle"
  'similar-triangles-6':   <ShadowDiagram />,               // "Situation 3 — Shadow/Height"
  'similar-triangles-7':   <AltitudeHypotenuseDiagram />,   // "Situation 4 — Altitude to Hypotenuse"
  'similar-triangles-8':   <MirrorDiagram />,               // "Situation 5 — Mirror"

  // ── Trigonometry — RIGHT TRIANGLE TRIG ───────────────────────────────────────
  'right-triangle-trig-1': <TrigSideLabelsDiagram />,       // "Labelling Sides"
  'right-triangle-trig-2': <TrigStaticDiagram />,           // "SOH CAH TOA"
  'right-triangle-trig-3': <TrigTriangle />,                 // "Finding a Missing Side"
  'right-triangle-trig-5': <SpecialAnglesDiagram />,        // "Special Right Triangles"

  // ── Trigonometry — SINE LAW ───────────────────────────────────────────────────
  'sine-law-0':            <SineLawFullDiagram />,           // "Sine Law Formula"
  'sine-law-3':            <SineLawFullDiagram />,           // "Step-by-Step"

  // ── Trigonometry — COSINE LAW ─────────────────────────────────────────────────
  'cosine-law-0':          <CosineLawFullDiagram />,         // "Cosine Law Formula"
  'cosine-law-2':          <CosineLawFullDiagram />,         // "SAS example"

  // ── Trigonometry — CHOOSING METHOD ───────────────────────────────────────────
  'choosing-method-0':     <TrigMethodSelectorCard />,       // "Decision Process"
  'choosing-method-1':     <TrigMethodSelectorCard />,       // "Quick Reference"

  // ── Trigonometry — WORD PROBLEMS ─────────────────────────────────────────────
  'word-problems-trig-1':  <ElevationDepressionDiagram />,  // "Angle of Elevation/Depression"
  'word-problems-trig-0':  <TrigTriangle />,                 // "Step-by-Step Strategy"
};

const studyLibrary = {
  flashcards: {
    id: 'flashcards',
    name: 'Flashcard Review',
    description: 'Interactive flashcards for quick review and memorization',
    icon: Brain,
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-600',
    sections: [
      {
        id: 'linear-systems-flashcards',
        title: 'Linear Systems Flashcards',
        flashcards: [
          { front: 'What is a linear system?', back: 'Two or more linear equations with the same variables. Solutions are points where the lines intersect.' },
          { front: 'How many solutions can a linear system have?', back: 'One solution (intersecting lines)\nNo solution (parallel lines)\nInfinite solutions (same line)' },
          { front: 'What is the substitution method?', back: 'Solve one equation for a variable, then substitute into the other equation to find values.' },
          { front: 'What is the elimination method?', back: 'Add or subtract equations to eliminate one variable, then solve for the remaining variable.' },
          { front: 'When do lines have no solution?', back: 'When they are parallel (same slope, different y-intercepts)' },
          { front: 'When do lines have infinite solutions?', back: 'When they are the same line (same slope and y-intercept)' },
          { front: 'What is slope-intercept form?', back: 'y = mx + b where m is slope and b is y-intercept' },
          { front: 'What is standard form?', back: 'Ax + By = C where A, B, and C are integers' },
          { front: 'How do you find slope from two points?', back: 'm = (y₂ - y₁)/(x₂ - x₁) or rise over run' },
          { front: 'What does the y-intercept represent?', back: 'The point where the line crosses the y-axis (when x = 0)' }
        ],
        notes: []
      },
      {
        id: 'quadratics-flashcards',
        title: 'Quadratics Flashcards',
        flashcards: [
          { front: 'What is standard form of a quadratic?', back: 'y = ax² + bx + c where a ≠ 0' },
          { front: 'What is vertex form of a quadratic?', back: 'y = a(x - h)² + k where (h, k) is the vertex' },
          { front: 'What is factored form of a quadratic?', back: 'y = a(x - r)(x - s) where r and s are x-intercepts (zeros)' },
          { front: 'What does "a" tell you in a quadratic?', back: 'Direction of opening (a > 0: up, a < 0: down) and width (|a| > 1: narrow, |a| < 1: wide)' },
          { front: 'What is the vertex?', back: 'The highest or lowest point on the parabola (turning point)' },
          { front: 'What is the axis of symmetry?', back: 'Vertical line through the vertex: x = h (in vertex form) or x = -b/2a (in standard form)' },
          { front: 'What are zeros/roots/x-intercepts?', back: 'Points where the parabola crosses the x-axis (where y = 0)' },
          { front: 'What is the discriminant?', back: 'b² - 4ac. Tells how many x-intercepts: >0: two, =0: one, <0: none' },
          { front: 'What is the quadratic formula?', back: 'x = (-b ± √(b² - 4ac))/(2a)' },
          { front: 'How do you complete the square?', back: 'Take half of b, square it, add and subtract to create a perfect square trinomial' }
        ],
        notes: []
      },
      {
        id: 'analytic-geometry-flashcards',
        title: 'Analytic Geometry Flashcards',
        flashcards: [
          { front: 'What is the distance formula?', back: 'd = √[(x₂ - x₁)² + (y₂ - y₁)²]' },
          { front: 'What is the midpoint formula?', back: 'M = ((x₁ + x₂)/2, (y₁ + y₂)/2)' },
          { front: 'How do you verify a right triangle?', back: 'Use Pythagorean theorem: a² + b² = c² where c is the longest side' },
          { front: 'What is the equation of a circle?', back: '(x - h)² + (y - k)² = r² where (h, k) is center and r is radius' },
          { front: 'How do you find the slope of perpendicular lines?', back: 'Take the negative reciprocal. If m₁ = 2, then m₂ = -1/2' },
          { front: 'What makes lines parallel?', back: 'They have the same slope but different y-intercepts' }
        ],
        notes: []
      },
      {
        id: 'trigonometry-flashcards',
        title: 'Trigonometry Flashcards',
        flashcards: [
          { front: 'What is SOH CAH TOA?', back: 'sin = opposite/hypotenuse\ncos = adjacent/hypotenuse\ntan = opposite/adjacent' },
          { front: 'What is the Pythagorean theorem?', back: 'a² + b² = c² where c is the hypotenuse' },
          { front: 'What is the sine law?', back: 'a/sin(A) = b/sin(B) = c/sin(C)' },
          { front: 'What is the cosine law?', back: 'c² = a² + b² - 2ab·cos(C)' },
          { front: 'When do you use sine law?', back: 'When you have: AAS, ASA, or SSA triangle configurations' },
          { front: 'When do you use cosine law?', back: 'When you have: SAS or SSS triangle configurations' }
        ],
        notes: []
      }
    ]
  },
  testReview: {
    id: 'testReview',
    name: 'Test Review Guide',
    description: 'Comprehensive guides covering everything you need to know for tests',
    icon: Target,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    sections: [
      {
        id: 'linear-systems-review',
        title: 'Linear Systems Test Review',
        notes: [
          {
            subtitle: 'Unit 1: Graphing Linear Equations',
            emoji: '📊',
            points: [
              'Be able to graph linear equations using slope and y-intercept',
              'Convert between slope-intercept form (y = mx + b) and standard form (Ax + By = C)',
              'Find slope from two points or from a graph',
              'Identify parallel lines (same slope) and perpendicular lines (negative reciprocal slopes)',
              'Write equations given slope and a point or two points'
            ]
          },
          {
            subtitle: 'Unit 2: Solving Systems Graphically',
            emoji: '📈',
            points: [
              'Graph two equations and find the point of intersection',
              'Understand that the intersection point satisfies both equations',
              'Identify systems with one solution, no solution, or infinite solutions',
              'Verify solutions by substituting into both original equations'
            ]
          },
          {
            subtitle: 'Unit 3: Substitution Method',
            emoji: '🔄',
            points: [
              'Solve one equation for one variable',
              'Substitute the expression into the other equation',
              'Solve for the remaining variable',
              'Substitute back to find the other variable',
              'Check your solution in both original equations'
            ]
          },
          {
            subtitle: 'Unit 4: Elimination Method',
            emoji: '➕',
            points: [
              'Multiply equations to get opposite coefficients for one variable',
              'Add or subtract equations to eliminate one variable',
              'Solve for the remaining variable',
              'Substitute to find the other variable',
              'Know when to use elimination vs substitution'
            ]
          },
          {
            subtitle: 'Unit 5: Word Problems',
            emoji: '📝',
            points: [
              'Define variables for unknown quantities',
              'Write two equations based on the problem',
              'Solve using substitution or elimination',
              'Check if your answer makes sense in context',
              'Common types: mixture problems, distance problems, age problems'
            ]
          }
        ]
      },
      {
        id: 'quadratics-review',
        title: 'Quadratics Test Review',
        notes: [
          {
            subtitle: 'Unit 1: Characteristics of Parabolas',
            emoji: '⛰️',
            points: [
              'Identify vertex, axis of symmetry, direction of opening',
              'Find y-intercept and x-intercepts (zeros)',
              'Determine if parabola has maximum or minimum value',
              'Understand domain (all real numbers) and range',
              'Know how "a" affects the width and direction'
            ]
          },
          {
            subtitle: 'Unit 2: Standard Form y = ax² + bx + c',
            emoji: '📐',
            points: [
              'Find vertex using x = -b/(2a), then substitute to find y',
              'Axis of symmetry: x = -b/(2a)',
              'Y-intercept: (0, c)',
              'Use discriminant b² - 4ac to find number of x-intercepts',
              'Graph parabolas from standard form'
            ]
          },
          {
            subtitle: 'Unit 3: Vertex Form y = a(x - h)² + k',
            emoji: '🎯',
            points: [
              'Vertex is at (h, k)',
              'Axis of symmetry is x = h',
              'Converting from standard to vertex form by completing the square',
              'Graphing is easier from vertex form',
              'Know the transformations: h shifts horizontal, k shifts vertical'
            ]
          },
          {
            subtitle: 'Unit 4: Factored Form y = a(x - r)(x - s)',
            emoji: '✂️',
            points: [
              'X-intercepts (zeros) are at x = r and x = s',
              'Factor simple quadratics: x² + bx + c',
              'Factor when a ≠ 1 using decomposition or grouping',
              'Find vertex from factored form: x-coordinate is (r + s)/2',
              'Use zero product property to solve equations'
            ]
          },
          {
            subtitle: 'Unit 5: Quadratic Formula',
            emoji: '🧮',
            points: [
              'x = (-b ± √(b² - 4ac))/(2a)',
              'Use when factoring is difficult or impossible',
              'Discriminant tells number of solutions',
              'Remember to simplify radicals',
              'Check solutions by substituting back'
            ]
          },
          {
            subtitle: 'Unit 6: Word Problems & Applications',
            emoji: '🚀',
            points: [
              'Projectile motion: height = -5t² + vt + h',
              'Area and perimeter optimization problems',
              'Revenue and profit problems: R = (price)(quantity)',
              'Always define variables clearly',
              'Interpret vertex in context (maximum/minimum)'
            ]
          }
        ]
      },
      {
        id: 'analytic-geometry-review',
        title: 'Analytic Geometry Test Review',
        notes: [
          {
            subtitle: 'Unit 1: Distance & Midpoint Formulas',
            emoji: '📏',
            points: [
              'Distance formula: d = √[(x₂-x₁)² + (y₂-y₁)²] — derived from Pythagorean theorem',
              'Midpoint formula: M = ((x₁+x₂)/2, (y₁+y₂)/2) — average x and y coordinates',
              'Use distance formula to find perimeter of triangles and polygons in the plane',
              'Use midpoint formula to find the centre of a line segment',
              'To find a missing endpoint given midpoint: double the midpoint coordinate and subtract the known endpoint'
            ]
          },
          {
            subtitle: 'Unit 2: Classifying Triangles & Shapes',
            emoji: '🔺',
            points: [
              'Equilateral triangle: all 3 side lengths equal (use distance formula)',
              'Isosceles triangle: exactly 2 side lengths equal',
              'Scalene triangle: all 3 side lengths different',
              'Right triangle: verify with a² + b² = c² where c is the longest side',
              'Parallel lines: equal slopes (m₁ = m₂) but different y-intercepts',
              'Perpendicular lines: slopes are negative reciprocals → m₁ × m₂ = -1'
            ]
          },
          {
            subtitle: 'Unit 3: Verifying Properties of Shapes',
            emoji: '▭',
            points: [
              'Parallelogram: prove by showing opposite sides are parallel (equal slopes) OR equal length, OR diagonals bisect each other (same midpoint)',
              'Rectangle: prove it is a parallelogram AND show one right angle (perpendicular slopes)',
              'Rhombus: prove it is a parallelogram AND all four sides are equal length',
              'Square: both a rectangle AND a rhombus — all equal sides with right angles',
              'For any proof, only ONE valid method needs to be shown — organize work clearly with labels'
            ]
          },
          {
            subtitle: 'Unit 4: Equation of a Circle',
            emoji: '⭕',
            points: [
              'Standard form: (x - h)² + (y - k)² = r² where (h, k) is center, r is radius',
              'Be careful with signs: (x + 4)² means h = -4, not h = 4!',
              'Given center and point on circle: use distance formula to find r, then write equation',
              'Given diameter endpoints: find midpoint to get center, then use distance formula for r',
              'To check if a point is ON the circle: substitute and verify it equals r²',
              'If result > r²: point is outside; if result < r²: point is inside'
            ]
          },
          {
            subtitle: 'Key Formulas to Know Cold',
            emoji: '📋',
            points: [
              'Distance: d = √[(x₂-x₁)² + (y₂-y₁)²]',
              'Midpoint: M = ((x₁+x₂)/2, (y₁+y₂)/2)',
              'Slope: m = (y₂-y₁)/(x₂-x₁)',
              'Circle: (x-h)² + (y-k)² = r²',
              'Perpendicular slope: flip and negate (e.g. m=3 → m_perp = -1/3)',
              'Parallel lines check: m₁ = m₂ and b₁ ≠ b₂'
            ]
          }
        ]
      },
      {
        id: 'trigonometry-review',
        title: 'Trigonometry Test Review',
        notes: [
          {
            subtitle: 'Unit 1: Right Triangle Trig — SOH CAH TOA',
            emoji: '🔺',
            points: [
              'sin(θ) = Opposite / Hypotenuse',
              'cos(θ) = Adjacent / Hypotenuse',
              'tan(θ) = Opposite / Adjacent',
              'ALWAYS identify which angle you are working from — "opposite" and "adjacent" change depending on the angle!',
              'Hypotenuse is always the side OPPOSITE the right angle (the longest side)',
              'To find a missing side: set up ratio, then multiply across (e.g. sin(30°)= x/10 → x = 10·sin(30°))',
              'To find a missing angle: use inverse trig (sin⁻¹, cos⁻¹, tan⁻¹) on your calculator'
            ]
          },
          {
            subtitle: 'Unit 2: Special Angles & Calculator Tips',
            emoji: '🧮',
            points: [
              'Always make sure your calculator is in DEGREE mode (not radians) for this course',
              'sin(30°) = 0.5, cos(60°) = 0.5, tan(45°) = 1 — useful to remember',
              '30-60-90 triangle sides: 1 : √3 : 2 (opposite 30°, 60°, 90° respectively)',
              '45-45-90 triangle sides: 1 : 1 : √2',
              'Angles in any triangle always sum to 180° — use this to find missing angles',
              'For inverse trig: if sin(θ) = 0.6 → θ = sin⁻¹(0.6) ≈ 36.9°'
            ]
          },
          {
            subtitle: 'Unit 3: Sine Law',
            emoji: '📐',
            points: [
              'Formula: a/sin(A) = b/sin(B) = c/sin(C)',
              'Use when you know: AAS (2 angles + 1 side), ASA (2 angles + included side), or SSA (2 sides + non-included angle)',
              'To find a SIDE: cross-multiply. Example: a/sin(A) = b/sin(B) → a = b·sin(A)/sin(B)',
              'To find an ANGLE: isolate sin. Example: a/sin(A) = b/sin(B) → sin(A) = a·sin(B)/b → A = sin⁻¹(...)',
              'Ambiguous Case (SSA): may have 0, 1, or 2 valid triangles — check if second angle solution makes the angle sum < 180°'
            ]
          },
          {
            subtitle: 'Unit 4: Cosine Law',
            emoji: '📊',
            points: [
              'Formula: c² = a² + b² - 2ab·cos(C)',
              'Use when you know: SAS (2 sides + included angle) or SSS (all 3 sides)',
              'To find a SIDE (SAS): plug values directly and solve for c²',
              'To find an ANGLE (SSS): rearrange → cos(C) = (a² + b² - c²)/(2ab), then use cos⁻¹',
              'Note: When angle C = 90°, cos(90°) = 0, so the formula becomes c² = a² + b² — the Pythagorean theorem!',
              'The angle in the formula is ALWAYS the angle BETWEEN the two sides you know (included angle for SAS)'
            ]
          },
          {
            subtitle: 'Unit 5: Choosing the Right Method',
            emoji: '🌳',
            points: [
              'Right triangle (has 90° angle)? → Use SOH CAH TOA',
              'Non-right triangle with AAS or ASA? → Sine Law',
              'Non-right triangle with SSA? → Sine Law (watch for ambiguous case)',
              'Non-right triangle with SAS or SSS? → Cosine Law',
              'Quick memory trick: Cosine Law for S-S combos (SSS, SAS). Sine Law for A-A combos (AAS, ASA) or SSA',
              'Always draw and label a clear diagram before picking your method!'
            ]
          },
          {
            subtitle: 'Unit 6: Word Problems — Angles of Elevation & Depression',
            emoji: '🏔️',
            points: [
              'Angle of Elevation: angle measured UPWARD from horizontal (looking up at something)',
              'Angle of Depression: angle measured DOWNWARD from horizontal (looking down at something)',
              'These angles are always measured from the horizontal line, NOT from vertical',
              'Draw a horizontal reference line at the observer\'s eye level first',
              'The angle of elevation and angle of depression between the same two points are EQUAL (alternate interior angles)',
              'Strategy: draw diagram → label all given info → identify right triangle or non-right triangle → choose method'
            ]
          }
        ]
      }
    ]
  },
  practiceQuestions: {
    id: 'practiceQuestions',
    name: 'Practice Questions',
    description: 'Interactive quizzes with instant feedback and explanations',
    icon: FileText,
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
    sections: [
      {
        id: 'linear-systems-practice',
        title: 'Linear Systems Practice',
        quiz: [
          {
            question: 'What is the slope of the line y = 3x - 5?',
            options: ['3', '-5', '3x', '-5x'],
            correct: 0,
            explanation: 'In slope-intercept form y = mx + b, m is the slope. Here m = 3.'
          },
          {
            question: 'Two lines with slopes 2 and -1/2 are:',
            options: ['Parallel', 'Perpendicular', 'The same line', 'Neither parallel nor perpendicular'],
            correct: 1,
            explanation: 'Perpendicular lines have slopes that are negative reciprocals. 2 × (-1/2) = -1, confirming they are perpendicular.'
          },
          {
            question: 'How many solutions does the system y = 2x + 1 and y = 2x - 3 have?',
            options: ['One solution', 'No solution', 'Infinite solutions', 'Two solutions'],
            correct: 1,
            explanation: 'These lines have the same slope (2) but different y-intercepts (1 and -3), so they are parallel and never intersect.'
          },
          {
            question: 'Using substitution to solve y = x + 2 and 2x + y = 8, what is the first step?',
            options: ['Solve for x in the second equation', 'Substitute x + 2 for y in the second equation', 'Add the equations', 'Multiply the first equation by 2'],
            correct: 1,
            explanation: 'Since y is already isolated (y = x + 2), substitute this expression for y in the second equation: 2x + (x+2) = 8.'
          },
          {
            question: 'What is the solution to the system: x + y = 5 and x - y = 1?',
            options: ['(3, 2)', '(2, 3)', '(4, 1)', '(1, 4)'],
            correct: 0,
            explanation: 'Using elimination: add the equations to get 2x = 6, so x = 3. Then substitute: 3 + y = 5, so y = 2. Solution: (3, 2).'
          },
          {
            question: 'What is the y-intercept of the line 4x - 2y = 10?',
            options: ['-5', '5', '2', '-2'],
            correct: 0,
            explanation: 'Rearrange to slope-intercept form: -2y = -4x + 10 → y = 2x - 5. The y-intercept is b = -5.'
          },
          {
            question: 'Solve by substitution: y = 2x and x + y = 9. What is x?',
            options: ['x = 3', 'x = 6', 'x = 9', 'x = 4.5'],
            correct: 0,
            explanation: 'Substitute y = 2x into x + y = 9: x + 2x = 9 → 3x = 9 → x = 3. Then y = 2(3) = 6.'
          },
          {
            question: 'Which system has infinite solutions?',
            options: ['y = x + 1 and y = x - 1', 'y = 2x + 3 and 2y = 4x + 6', 'y = x and y = -x', 'y = 3x and y = 3x + 1'],
            correct: 1,
            explanation: '2y = 4x + 6 simplifies to y = 2x + 3, which is identical to the first equation. Same line = infinite solutions.'
          },
          {
            question: 'Use elimination: 3x + 2y = 16 and 3x - y = 7. What is y?',
            options: ['y = 3', 'y = -3', 'y = 9', 'y = 2'],
            correct: 0,
            explanation: 'Subtract the second from the first: 3y = 9, so y = 3. Coefficients of x are equal, so subtraction eliminates x.'
          },
          {
            question: 'A line passes through (0, 4) and (2, 8). What is its equation?',
            options: ['y = 2x + 4', 'y = 4x + 2', 'y = 2x - 4', 'y = -2x + 4'],
            correct: 0,
            explanation: 'Slope = (8-4)/(2-0) = 4/2 = 2. y-intercept is 4 (when x=0, y=4). So y = 2x + 4.'
          },
          {
            question: 'What is the solution to 2x + 3y = 12 and x - y = 1?',
            options: ['(3, 2)', '(2, 3)', '(4, 1)', '(1, 3)'],
            correct: 0,
            explanation: 'From x - y = 1: x = y + 1. Substitute: 2(y+1) + 3y = 12 → 5y = 10 → y = 2. Then x = 3. Solution: (3, 2).'
          },
          {
            question: 'Two friends have a total of $50. One has $8 more than the other. How much does each have?',
            options: ['$21 and $29', '$25 and $25', '$20 and $30', '$22 and $28'],
            correct: 0,
            explanation: 'Let x + y = 50 and x - y = 8. Adding: 2x = 58 → x = 29, y = 21. They have $29 and $21.'
          },
          {
            question: 'What does it mean algebraically when you get 0 = 5 while solving a system?',
            options: ['x = 0 and y = 5', 'No solution (parallel lines)', 'Infinite solutions', 'There is an error — redo the algebra'],
            correct: 1,
            explanation: 'A false statement like 0 = 5 means the system is inconsistent — the lines are parallel and never intersect, so there is no solution.'
          },
          {
            question: 'Convert 5x - 2y = 14 to slope-intercept form.',
            options: ['y = 5/2x - 7', 'y = -5/2x + 7', 'y = 2/5x - 7', 'y = 5x - 7'],
            correct: 0,
            explanation: '-2y = -5x + 14 → y = (5/2)x - 7. The slope is 5/2 and y-intercept is -7.'
          },
          {
            question: 'A cafeteria sells apples for $0.50 and bananas for $0.75. Maya buys 10 fruits for $6.25. How many apples did she buy?',
            options: ['5', '3', '7', '4'],
            correct: 0,
            explanation: 'Let a + b = 10 and 0.5a + 0.75b = 6.25. From first: a = 10 - b. Substitute: 0.5(10-b) + 0.75b = 6.25 → 0.25b = 1.25 → b = 5, a = 5.'
          }
        ],
        notes: []
      },
      {
        id: 'quadratics-practice',
        title: 'Quadratics Practice',
        quiz: [
          {
            question: 'What is the vertex of y = (x - 3)² + 5?',
            options: ['(3, 5)', '(-3, 5)', '(3, -5)', '(-3, -5)'],
            correct: 0,
            explanation: 'In vertex form y = a(x - h)² + k, the vertex is (h, k). Here h = 3 and k = 5.'
          },
          {
            question: 'Which parabola opens downward?',
            options: ['y = 2x²', 'y = -3x² + 1', 'y = 0.5x² - 2', 'y = x² + 4x'],
            correct: 1,
            explanation: 'A parabola opens downward when a < 0. Only y = -3x² + 1 has a negative "a" value.'
          },
          {
            question: 'What are the zeros of y = (x - 2)(x + 5)?',
            options: ['x = 2 and x = 5', 'x = -2 and x = 5', 'x = 2 and x = -5', 'x = -2 and x = -5'],
            correct: 2,
            explanation: 'Set each factor to zero: x - 2 = 0 gives x = 2, and x + 5 = 0 gives x = -5.'
          },
          {
            question: 'For y = x² - 4x + 3, what is the axis of symmetry?',
            options: ['x = -2', 'x = 2', 'x = -4', 'x = 4'],
            correct: 1,
            explanation: 'Use x = -b/(2a) = -(-4)/(2·1) = 4/2 = 2. The axis of symmetry is x = 2.'
          },
          {
            question: 'What is the discriminant of x² + 6x + 9 = 0?',
            options: ['0', '36', '12', '-36'],
            correct: 0,
            explanation: 'Discriminant = b² - 4ac = 36 - 4(1)(9) = 36 - 36 = 0. One x-intercept (perfect square trinomial).'
          },
          {
            question: 'What is the y-intercept of y = 2x² - 5x + 3?',
            options: ['(0, 3)', '(0, -5)', '(0, 2)', '(0, -3)'],
            correct: 0,
            explanation: 'The y-intercept is always (0, c) in standard form y = ax² + bx + c. Here c = 3, so the y-intercept is (0, 3).'
          },
          {
            question: 'Factor: x² + 7x + 12',
            options: ['(x + 3)(x + 4)', '(x + 6)(x + 2)', '(x - 3)(x - 4)', '(x + 12)(x + 1)'],
            correct: 0,
            explanation: 'Find two numbers that multiply to 12 and add to 7: 3 and 4. So x² + 7x + 12 = (x + 3)(x + 4).'
          },
          {
            question: 'What is the vertex of y = 2x² - 8x + 1?',
            options: ['(2, -7)', '(-2, 17)', '(4, 1)', '(2, 1)'],
            correct: 0,
            explanation: 'x = -b/(2a) = 8/4 = 2. Then y = 2(4) - 8(2) + 1 = 8 - 16 + 1 = -7. Vertex is (2, -7).'
          },
          {
            question: 'How many x-intercepts does y = x² + 2x + 5 have?',
            options: ['Two', 'One', 'Zero', 'Cannot be determined'],
            correct: 2,
            explanation: 'Discriminant = 4 - 4(1)(5) = 4 - 20 = -16 < 0. Negative discriminant means no real x-intercepts.'
          },
          {
            question: 'Solve x² - 5x + 6 = 0 by factoring.',
            options: ['x = 2 or x = 3', 'x = -2 or x = -3', 'x = 1 or x = 6', 'x = -1 or x = -6'],
            correct: 0,
            explanation: 'Factor: (x - 2)(x - 3) = 0. Set each to zero: x - 2 = 0 → x = 2, x - 3 = 0 → x = 3.'
          },
          {
            question: 'Using the quadratic formula on x² - 4x - 5 = 0, what are the solutions?',
            options: ['x = 5 or x = -1', 'x = -5 or x = 1', 'x = 4 or x = -1', 'x = 2 ± 3'],
            correct: 0,
            explanation: 'a=1, b=-4, c=-5. Discriminant = 16+20 = 36. x = (4 ± 6)/2. So x = 10/2 = 5 or x = -2/2 = -1.'
          },
          {
            question: 'A ball is thrown upward. Its height is h = -5t² + 20t + 2. What is the maximum height?',
            options: ['22 m', '20 m', '2 m', '10 m'],
            correct: 0,
            explanation: 'Max height at vertex. t = -20/(2(-5)) = 2. h = -5(4) + 20(2) + 2 = -20 + 40 + 2 = 22 m.'
          },
          {
            question: 'What is the range of y = -(x - 1)² + 6?',
            options: ['y ≤ 6', 'y ≥ 6', 'y ≤ 1', 'All real numbers'],
            correct: 0,
            explanation: 'Since a = -1 < 0, the parabola opens downward. The vertex (1, 6) is the maximum. So range is y ≤ 6.'
          },
          {
            question: 'Convert y = x² + 4x + 7 to vertex form.',
            options: ['y = (x + 2)² + 3', 'y = (x - 2)² + 3', 'y = (x + 2)² + 7', 'y = (x + 4)² + 7'],
            correct: 0,
            explanation: 'Complete the square: y = (x² + 4x + 4) + 3 = (x + 2)² + 3. Half of 4 is 2, squared is 4.'
          },
          {
            question: 'A rectangular garden has perimeter 40 m. Its area is A = w(20 - w). What width gives maximum area?',
            options: ['w = 10 m', 'w = 20 m', 'w = 5 m', 'w = 40 m'],
            correct: 0,
            explanation: 'A = -w² + 20w is a downward parabola. Maximum at w = -20/(2(-1)) = 10 m. Max area = 10 × 10 = 100 m².'
          }
        ],
        notes: []
      },
      {
        id: 'analytic-geometry-practice',
        title: 'Analytic Geometry Practice',
        quiz: [
          {
            question: 'What is the distance between points (1, 2) and (4, 6)?',
            options: ['5', '7', '√7', '25'],
            correct: 0,
            explanation: 'd = √[(4-1)² + (6-2)²] = √[9 + 16] = √25 = 5. Use the distance formula!'
          },
          {
            question: 'What is the midpoint of the segment joining (0, 4) and (6, 2)?',
            options: ['(3, 3)', '(6, 6)', '(3, 6)', '(0, 3)'],
            correct: 0,
            explanation: 'Midpoint = ((0+6)/2, (4+2)/2) = (3, 3). Average the x-coordinates, then average the y-coordinates.'
          },
          {
            question: 'What is the equation of a circle with center (2, -3) and radius 5?',
            options: ['(x-2)² + (y+3)² = 25', '(x+2)² + (y-3)² = 25', '(x-2)² + (y-3)² = 5', '(x+2)² + (y+3)² = 5'],
            correct: 0,
            explanation: 'Standard form: (x-h)² + (y-k)² = r². Center (2,-3): h=2, k=-3. So (x-2)² + (y+3)² = 25.'
          },
          {
            question: 'Is the point (3, 4) on the circle x² + y² = 25?',
            options: ['Yes, it lies on the circle', 'No, it is inside the circle', 'No, it is outside the circle', 'Cannot be determined'],
            correct: 0,
            explanation: 'Substitute: 3² + 4² = 9 + 16 = 25 = 25 ✓. Since it equals r², the point is ON the circle.'
          },
          {
            question: 'Two lines have slopes 3 and -1/3. What is the relationship?',
            options: ['Parallel', 'Perpendicular', 'Same line', 'Neither'],
            correct: 1,
            explanation: 'Perpendicular lines have slopes that are negative reciprocals. 3 × (-1/3) = -1 ✓. These lines are perpendicular.'
          },
          {
            question: 'A triangle has vertices A(0,0), B(4,0), C(0,3). What type of triangle is it?',
            options: ['Equilateral', 'Isosceles', 'Scalene right triangle', 'Obtuse triangle'],
            correct: 2,
            explanation: 'Side lengths: AB=4, AC=3, BC=5. Check: 3²+4²=5² ✓ — right triangle. All sides different — scalene.'
          },
          {
            question: 'What is the center of the circle (x+4)² + (y-1)² = 9?',
            options: ['(-4, 1)', '(4, -1)', '(-4, -1)', '(4, 1)'],
            correct: 0,
            explanation: 'The form is (x-h)² + (y-k)² = r². (x+4)² means h = -4. (y-1)² means k = 1. Center = (-4, 1).'
          },
          {
            question: 'One endpoint of a segment is A(2, 5) and the midpoint is M(6, 3). What is endpoint B?',
            options: ['(10, 1)', '(4, 4)', '(8, 8)', '(14, 6)'],
            correct: 0,
            explanation: 'Midpoint formula: (2+Bx)/2 = 6 → Bx = 10. (5+By)/2 = 3 → By = 1. So B = (10, 1).'
          },
          {
            question: 'What is the radius of the circle (x-1)² + (y+2)² = 49?',
            options: ['7', '49', '√7', '14'],
            correct: 0,
            explanation: 'The equation is (x-h)² + (y-k)² = r². Here r² = 49, so r = √49 = 7.'
          },
          {
            question: 'Triangle vertices are P(1,1), Q(4,1), R(4,5). What is the perimeter?',
            options: ['3 + 4 + 5 = 12', '3 + 4 + 7 = 14', '12 + √5', '3 + 4 + √25 = 12'],
            correct: 0,
            explanation: 'PQ = 3 (horizontal), QR = 4 (vertical), PR = √(9+16) = 5. Perimeter = 3 + 4 + 5 = 12.'
          },
          {
            question: 'Is the point (6, 2) inside, outside, or on the circle (x-2)² + (y-2)² = 9?',
            options: ['Inside', 'Outside', 'On the circle', 'Cannot tell'],
            correct: 1,
            explanation: 'Substitute: (6-2)² + (2-2)² = 16 + 0 = 16. Since 16 > 9 (= r²), the point is OUTSIDE the circle.'
          },
          {
            question: 'To prove a quadrilateral is a parallelogram, what is the most efficient method using midpoints?',
            options: ['Show diagonals bisect each other (same midpoint)', 'Show all 4 sides are equal', 'Show all angles are 90°', 'Show one pair of parallel sides'],
            correct: 0,
            explanation: 'If the diagonals share the same midpoint, they bisect each other — this proves a parallelogram in one calculation per diagonal.'
          },
          {
            question: 'A circle has diameter endpoints A(1, 3) and B(7, 11). What is the equation?',
            options: ['(x-4)² + (y-7)² = 25', '(x-4)² + (y-7)² = 5', '(x-1)² + (y-3)² = 25', '(x-7)² + (y-11)² = 25'],
            correct: 0,
            explanation: 'Center = midpoint = (4, 7). r = distance from (4,7) to (1,3) = √(9+16) = 5. Equation: (x-4)² + (y-7)² = 25.'
          },
          {
            question: 'Lines y = 3x + 2 and y = 3x - 7 are:',
            options: ['Parallel', 'Perpendicular', 'The same line', 'Intersecting at one point'],
            correct: 0,
            explanation: 'Both lines have slope 3 but different y-intercepts (2 and -7). Same slope, different intercepts = parallel lines.'
          },
          {
            question: 'The perpendicular slope to a line with slope -4 is:',
            options: ['1/4', '-1/4', '4', '-4'],
            correct: 0,
            explanation: 'The perpendicular slope is the negative reciprocal. Flip -4 to get -1/4, then negate to get 1/4.'
          }
        ],
        notes: []
      },
      {
        id: 'trigonometry-practice',
        title: 'Trigonometry Practice',
        quiz: [
          {
            question: 'In a right triangle, the opposite side is 6 and the hypotenuse is 10. What is sin(θ)?',
            options: ['0.6', '0.8', '0.75', '1.67'],
            correct: 0,
            explanation: 'sin(θ) = opposite/hypotenuse = 6/10 = 0.6. SOH: Sine = Opposite over Hypotenuse.'
          },
          {
            question: 'In a right triangle with adjacent = 5 and hypotenuse = 13, what is cos(θ)?',
            options: ['5/13', '12/13', '5/12', '13/5'],
            correct: 0,
            explanation: 'cos(θ) = adjacent/hypotenuse = 5/13. CAH: Cosine = Adjacent over Hypotenuse.'
          },
          {
            question: 'You know two angles and the side between them. Which law do you use?',
            options: ['SOH CAH TOA', 'Cosine Law', 'Sine Law', 'Pythagorean Theorem'],
            correct: 2,
            explanation: 'ASA (Angle-Side-Angle) is a Sine Law case. Use Sine Law: a/sin(A) = b/sin(B) = c/sin(C).'
          },
          {
            question: 'You know 3 sides of a non-right triangle. Which law finds an angle?',
            options: ['Sine Law', 'SOH CAH TOA', 'Cosine Law', 'Pythagorean Theorem'],
            correct: 2,
            explanation: 'SSS requires Cosine Law. Rearrange to: cos(C) = (a² + b² - c²) / (2ab), then use cos⁻¹.'
          },
          {
            question: 'In triangle ABC, a = 8, angle A = 40°, angle B = 60°. Using Sine Law, what is b?',
            options: ['b = 8·sin(60°)/sin(40°)', 'b = 8·sin(40°)/sin(60°)', 'b = sin(60°)/8', 'b = 8/(sin(40°)·sin(60°))'],
            correct: 0,
            explanation: 'Sine Law: a/sin(A) = b/sin(B) → b = a·sin(B)/sin(A) = 8·sin(60°)/sin(40°) ≈ 10.8.'
          },
          {
            question: 'What does tan(θ) equal in terms of sides?',
            options: ['adjacent/hypotenuse', 'opposite/hypotenuse', 'opposite/adjacent', 'hypotenuse/opposite'],
            correct: 2,
            explanation: 'TOA: Tangent = Opposite over Adjacent. Remember SOH-CAH-TOA!'
          },
          {
            question: 'Using Cosine Law with a=5, b=7, C=60°, what is c²?',
            options: ['39', '74', '109', '-24'],
            correct: 0,
            explanation: 'c² = a² + b² - 2ab·cos(C) = 25 + 49 - 2(5)(7)·cos(60°) = 74 - 70(0.5) = 74 - 35 = 39.'
          },
          {
            question: 'A ladder 8 m long leans against a wall at 65° from the ground. How high up the wall does it reach?',
            options: ['8·sin(65°) ≈ 7.25 m', '8·cos(65°) ≈ 3.38 m', '8·tan(65°) ≈ 17.1 m', '8/sin(65°) ≈ 8.83 m'],
            correct: 0,
            explanation: 'The wall is opposite the 65° angle, the ladder (8 m) is the hypotenuse. sin(65°) = height/8 → height = 8·sin(65°) ≈ 7.25 m.'
          },
          {
            question: 'An angle of elevation to the top of a 30 m tree is 40° from a point on the ground. How far away is the point?',
            options: ['30/tan(40°) ≈ 35.7 m', '30·tan(40°) ≈ 25.2 m', '30/sin(40°) ≈ 46.7 m', '30·cos(40°) ≈ 23.0 m'],
            correct: 0,
            explanation: 'tan(40°) = opposite/adjacent = 30/d → d = 30/tan(40°) ≈ 35.7 m. The tree is opposite, the ground distance is adjacent.'
          },
          {
            question: 'In triangle PQR, p = 9, q = 12, r = 15. Is it a right triangle?',
            options: ['Yes, since 9² + 12² = 15²', 'No, it is obtuse', 'No, it is acute', 'Cannot be determined'],
            correct: 0,
            explanation: '9² + 12² = 81 + 144 = 225 = 15². Pythagorean theorem holds, so it IS a right triangle!'
          },
          {
            question: 'Find angle θ if tan(θ) = 4/3.',
            options: ['θ = tan⁻¹(4/3) ≈ 53.1°', 'θ = 4/3°', 'θ = tan(4/3) ≈ 0.93°', 'θ ≈ 36.9°'],
            correct: 0,
            explanation: 'To find an angle from a trig ratio, use the inverse function: θ = tan⁻¹(4/3) ≈ 53.1°. Use the [2nd][tan] key on your calculator.'
          },
          {
            question: 'You know two sides and the included angle (SAS). Which law should you use?',
            options: ['Cosine Law', 'Sine Law', 'SOH CAH TOA', 'Either law works equally'],
            correct: 0,
            explanation: 'SAS (2 sides + included angle) is a Cosine Law case. Use c² = a² + b² - 2ab·cos(C) to find the missing side.'
          },
          {
            question: 'In triangle ABC, angle A = 35°, angle B = 75°, side c = 10. What is angle C?',
            options: ['70°', '110°', '35°', '75°'],
            correct: 0,
            explanation: 'Angles in a triangle sum to 180°. C = 180° - 35° - 75° = 70°. Always find missing angles first!'
          },
          {
            question: 'What is sin(30°)?',
            options: ['0.5', '√3/2 ≈ 0.866', '1', '√2/2 ≈ 0.707'],
            correct: 0,
            explanation: 'sin(30°) = 0.5 (or 1/2). This is a special angle worth memorizing. In a 30-60-90 triangle, the side opposite 30° is half the hypotenuse.'
          },
          {
            question: 'From a 50 m cliff, the angle of depression to a boat is 25°. How far is the boat from the base of the cliff?',
            options: ['50/tan(25°) ≈ 107 m', '50·tan(25°) ≈ 23.3 m', '50·sin(25°) ≈ 21.1 m', '50/sin(25°) ≈ 118 m'],
            correct: 0,
            explanation: 'Angle of depression = angle of elevation from boat. tan(25°) = 50/d → d = 50/tan(25°) ≈ 107 m. Cliff height is opposite, distance is adjacent.'
          }
        ],
        notes: []
      }
    ]
  },
  worksheets: {
    id: 'worksheets',
    name: 'Practice Worksheets',
    description: 'Detailed practice problems with step-by-step solutions',
    icon: ClipboardList,
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-600',
    sections: [
      {
        id: 'linear-systems-worksheets',
        title: 'Linear Systems Worksheets',
        notes: [
          {
            subtitle: 'Worksheet 1: Graphing & Slope',
            emoji: '📝',
            points: [
              '1. Find the slope of the line passing through (-2, 5) and (4, -1).',
              '2. Write the equation of the line with slope 3 and y-intercept -2.',
              '3. Graph the equation y = -1/2x + 4.',
              '4. Convert 3x + 2y = 12 to slope-intercept form.',
              '5. Are the lines y = 4x - 1 and y = 4x + 3 parallel, perpendicular, or neither?'
            ],
            answers: [
              'm = (y₂ - y₁)/(x₂ - x₁) = (-1 - 5)/(4 - (-2)) = -6/6 = -1',
              'y = mx + b → y = 3x - 2',
              'Start at (0, 4), go down 1 and right 2 repeatedly to plot points',
              '2y = -3x + 12 → y = -3/2x + 6',
              'Parallel (same slope of 4, different y-intercepts)'
            ]
          },
          {
            subtitle: 'Worksheet 2: Substitution Method',
            emoji: '📝',
            points: [
              '1. Solve: y = 2x and 3x + y = 10',
              '2. Solve: x = y + 3 and 2x + y = 11',
              '3. Solve: y = -x + 7 and 3x + 2y = 12',
              '4. Solve: 2x - y = 5 and x + y = 4',
              '5. Solve: y = 3x - 1 and 2x + 3y = 17'
            ],
            answers: [
              'Substitute y = 2x into second equation: 3x + 2x = 10 → 5x = 10 → x = 2, y = 4. Solution: (2, 4)',
              'Substitute x = y + 3 into second: 2(y + 3) + y = 11 → 2y + 6 + y = 11 → 3y = 5 → y = 5/3, x = 14/3',
              'Substitute into second: 3x + 2(-x + 7) = 12 → 3x - 2x + 14 = 12 → x = -2, y = 9. Solution: (-2, 9)',
              'Solve second for y: y = 4 - x. Substitute: 2x - (4 - x) = 5 → 3x = 9 → x = 3, y = 1. Solution: (3, 1)',
              'Substitute: 2x + 3(3x - 1) = 17 → 2x + 9x - 3 = 17 → 11x = 20 → x = 20/11, y = 49/11'
            ]
          }
        ]
      },
      {
        id: 'quadratics-worksheets',
        title: 'Quadratics Worksheets',
        notes: [
          {
            subtitle: 'Worksheet 1: Parabola Characteristics',
            emoji: '📝',
            points: [
              '1. For y = -2x² + 4x - 1, find: direction of opening, vertex, axis of symmetry, y-intercept.',
              '2. State the domain and range of y = (x - 3)² - 4.',
              '3. Does y = 3x² - 12x + 8 have a maximum or minimum? What is it?',
              '4. Find the discriminant and number of x-intercepts for y = x² + 2x + 5.',
              '5. Sketch a parabola with vertex (2, -3) that opens upward.'
            ],
            answers: [
              'Opens down (a < 0) • Vertex: x = -4/(2(-2)) = 1, y = -2(1)² + 4(1) - 1 = 1 → (1, 1) • Axis: x = 1 • y-int: (0, -1)',
              'Domain: all real numbers • Range: y ≥ -4 (minimum at vertex)',
              'Minimum (a > 0). Vertex: x = 12/6 = 2, y = 3(4) - 24 + 8 = -4. Minimum value: -4',
              'b² - 4ac = 4 - 20 = -16 < 0. No x-intercepts (doesn\'t cross x-axis)',
              'Plot vertex at (2, -3), sketch U-shaped parabola opening upward'
            ]
          },
          {
            subtitle: 'Worksheet 2: Factoring Quadratics',
            emoji: '📝',
            points: [
              '1. Factor: x² + 9x + 20',
              '2. Factor: x² - 7x + 12',
              '3. Factor: x² - 25',
              '4. Factor: 2x² + 7x + 3',
              '5. Factor: 3x² - 14x - 5'
            ],
            answers: [
              'Find two numbers that multiply to 20 and add to 9: 4 and 5. Answer: (x + 4)(x + 5)',
              'Find two numbers that multiply to 12 and add to -7: -3 and -4. Answer: (x - 3)(x - 4)',
              'Difference of squares: (x + 5)(x - 5)',
              'Split middle: 2x² + 6x + x + 3 = 2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3)',
              'Split middle: 3x² - 15x + x - 5 = 3x(x - 5) + 1(x - 5) = (3x + 1)(x - 5)'
            ]
          }
        ]
      },
      {
        id: 'analytic-geometry-worksheets',
        title: 'Analytic Geometry Worksheets',
        notes: [
          {
            subtitle: 'Worksheet 1: Distance & Midpoint',
            emoji: '📝',
            points: [
              '1. Find the distance between A(2, 5) and B(8, 13).',
              '2. Find the midpoint of the segment joining P(-3, 4) and Q(7, -2).',
              '3. The midpoint of a segment is M(3, 1). One endpoint is A(1, -2). Find the other endpoint B.',
              '4. Show that the triangle with vertices (0, 0), (4, 0), and (2, 2√3) is equilateral.',
              '5. Find the perimeter of the quadrilateral with vertices A(0,0), B(4,0), C(5,3), D(1,3).'
            ],
            answers: [
              'd = √[(8-2)² + (13-5)²] = √[36 + 64] = √100 = 10',
              'M = ((-3+7)/2, (4+(-2))/2) = (2, 1)',
              'B = (2(3)-1, 2(1)-(-2)) = (5, 4)',
              'AB = √[16+0] = 4, AC = √[4+12] = 4, BC = √[4+12] = 4. All sides = 4 → equilateral',
              'AB=4, BC=√(1+9)=√10, CD=4, DA=√(1+9)=√10. Perimeter = 4+√10+4+√10 = 8+2√10 ≈ 14.3'
            ]
          },
          {
            subtitle: 'Worksheet 2: Circles',
            emoji: '📝',
            points: [
              '1. Write the equation of a circle with center (-1, 3) and radius 4.',
              '2. Find the center and radius of (x+2)² + (y-5)² = 49.',
              '3. Does the point (5, 1) lie on, inside, or outside (x-2)² + (y+1)² = 16?',
              '4. A circle has diameter endpoints A(1, 3) and B(7, 11). Write the circle equation.',
              '5. A circle has center (0, 0) and passes through (3, 4). Write the equation.'
            ],
            answers: [
              '(x+1)² + (y-3)² = 16',
              'Center = (-2, 5), Radius = √49 = 7',
              '(5-2)² + (1+1)² = 9 + 4 = 13. Since 13 > 16? No: 13 < 16, so point is INSIDE.',
              'Center = midpoint = (4, 7). r = distance from (4,7) to (1,3) = √(9+16) = 5. Equation: (x-4)²+(y-7)²=25',
              'r = √(9+16) = 5. Equation: x² + y² = 25'
            ]
          },
          {
            subtitle: 'Worksheet 3: Classifying Shapes',
            emoji: '📝',
            points: [
              '1. Show that the triangle A(1,1), B(5,1), C(3,4) is isosceles.',
              '2. Verify that A(0,0), B(4,0), C(4,3), D(0,3) is a rectangle.',
              '3. Find the equation of the line through (2,3) perpendicular to y = 2x + 1.',
              '4. Are the lines 3x + y = 5 and x - 3y = 2 parallel, perpendicular, or neither?',
              '5. The vertices of a parallelogram are A(0,0), B(4,0), C(6,3), D(2,3). Verify it is a parallelogram using midpoints of diagonals.'
            ],
            answers: [
              'AB = 4, AC = √(4+9) = √13, BC = √(4+9) = √13. AC = BC → isosceles ✓',
              'Slopes: AB=0, BC=undefined, CD=0, DA=undefined. Opposite sides parallel. Adjacent sides perpendicular (horizontal⊥vertical) → rectangle ✓',
              'Slope of given line = 2. Perpendicular slope = -1/2. Equation: y - 3 = -1/2(x - 2) → y = -1/2x + 4',
              'm₁ = -3, m₂ = 1/3. Product = -3(1/3) = -1. Perpendicular ✓',
              'Diagonal AC midpoint = (3, 1.5). Diagonal BD midpoint = (3, 1.5). Same midpoint → diagonals bisect each other → parallelogram ✓'
            ]
          }
        ]
      },
      {
        id: 'trigonometry-worksheets',
        title: 'Trigonometry Worksheets',
        notes: [
          {
            subtitle: 'Worksheet 1: Right Triangle Trig',
            emoji: '📝',
            points: [
              '1. A ladder 10 m long leans against a wall making a 60° angle with the ground. How high does it reach?',
              '2. From a point 40 m from the base of a building, the angle of elevation to the top is 55°. Find the height.',
              '3. In a right triangle, opposite = 7, hypotenuse = 25. Find cos(θ).',
              '4. A ramp rises 1.5 m over a horizontal distance of 8 m. Find the angle of inclination.',
              '5. In right triangle ABC with right angle at C, angle A = 35° and hypotenuse = 12. Find sides a and b.'
            ],
            answers: [
              'sin(60°) = h/10 → h = 10·sin(60°) = 10 × 0.866 = 8.66 m',
              'tan(55°) = h/40 → h = 40·tan(55°) ≈ 40 × 1.428 = 57.1 m',
              'Adjacent = √(25² - 7²) = √(625-49) = √576 = 24. cos(θ) = 24/25',
              'tan(θ) = 1.5/8 = 0.1875. θ = tan⁻¹(0.1875) ≈ 10.6°',
              'a = opposite to A = 12·sin(35°) ≈ 6.88. b = adjacent to A = 12·cos(35°) ≈ 9.83'
            ]
          },
          {
            subtitle: 'Worksheet 2: Sine Law & Cosine Law',
            emoji: '📝',
            points: [
              '1. In triangle ABC, angle A = 50°, angle B = 65°, side a = 12. Find side b.',
              '2. In triangle PQR, p = 8, q = 11, angle R = 40°. Find side r.',
              '3. In triangle XYZ, x = 7, y = 9, z = 5. Find angle Z.',
              '4. In triangle ABC, a = 6, b = 8, angle C = 120°. Find side c.',
              '5. A ship sails 20 km north, then turns and sails 30 km at N 60° E. How far is the ship from its starting point?'
            ],
            answers: [
              'Angle C = 180-50-65=65°. b/sin(65°) = 12/sin(50°) → b = 12·sin(65°)/sin(50°) ≈ 14.2',
              'r² = p² + q² - 2pq·cos(R) = 64 + 121 - 2(8)(11)cos(40°) = 185 - 176(0.766) ≈ 50.4. r ≈ 7.1',
              'cos(Z) = (x²+y²-z²)/(2xy) = (49+81-25)/(2·7·9) = 105/126 ≈ 0.833. Z = cos⁻¹(0.833) ≈ 33.6°',
              'c² = 36 + 64 - 2(6)(8)cos(120°) = 100 - 96(-0.5) = 100 + 48 = 148. c ≈ 12.2',
              'Angle between paths = 90+60=150°. Use cosine law: d² = 400+900-2(20)(30)cos(150°) = 1300+1039 = 2339. d ≈ 48.4 km'
            ]
          }
        ]
      }
    ]
  },
  linearSystems: {
    id: 'linearSystems',
    name: 'Linear Systems',
    description: 'Master solving systems of equations using multiple methods',
    icon: TrendingUp,
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    sections: [
      {
        id: 'linear-basics',
        title: 'The Basics — What is a Linear Equation?',
        notes: [
          {
            subtitle: 'What Does "Linear" Mean?',
            emoji: '📏',
            points: [
              'A LINEAR equation is one whose graph is a perfectly straight line — no curves, no bends',
              'The word "linear" comes from "line" — if you plot every solution, you get a line',
              'The key feature: in a linear equation, the variables (x and y) are only ever raised to the FIRST power — no x², no √x, no 1/x',
              'Examples of linear equations: y = 3x + 2 ✓, 2x + 5y = 10 ✓, y = -x ✓',
              'Examples of NON-linear: y = x² (parabola), y = √x (curve), y = 1/x (hyperbola)',
              'Any linear equation in two variables (x and y) has infinitely many solutions — all the points on the line'
            ]
          },
          {
            subtitle: 'What is a System of Equations?',
            emoji: '🔗',
            points: [
              'A SYSTEM OF EQUATIONS is two (or more) equations with the SAME variables that must BOTH be true at the same time',
              'The SOLUTION to a system is the point (x, y) that satisfies ALL equations simultaneously — it is where the lines intersect',
              'Think of it like two conditions that must both be met: "x + y = 10" AND "x - y = 4" — what values of x and y satisfy both?',
              'Answer: x = 7, y = 3 works in both: 7+3=10 ✓ and 7-3=4 ✓',
              'Why do we care? Real-world problems often have TWO unknowns and TWO conditions — systems let us find both'
            ]
          },
          {
            subtitle: 'The Coordinate Plane — The Foundation',
            emoji: '🗺️',
            points: [
              'The COORDINATE PLANE (Cartesian plane) has two perpendicular number lines: the horizontal x-axis and vertical y-axis',
              'They intersect at the ORIGIN, which is the point (0, 0)',
              'Every point is written as an ORDERED PAIR (x, y) — x first (left/right), y second (up/down)',
              'QUADRANTS: the axes divide the plane into 4 quadrants. Quadrant I: (+,+), Quadrant II: (−,+), Quadrant III: (−,−), Quadrant IV: (+,−)',
              'To PLOT a point (3, −2): start at origin, move RIGHT 3, then DOWN 2',
              'To READ a point from a graph: count how far right/left (x) and up/down (y) from the origin'
            ]
          },
          {
            subtitle: 'Understanding Slope — The Big Idea',
            emoji: '⛰️',
            points: [
              'SLOPE measures the STEEPNESS and DIRECTION of a line',
              'Formula: slope (m) = rise / run = (change in y) / (change in x) = (y₂ − y₁) / (x₂ − x₁)',
              'RISE means vertical change (up = positive, down = negative)',
              'RUN means horizontal change (right = positive, left = negative)',
              'POSITIVE slope: line goes up from left to right (like climbing a hill)',
              'NEGATIVE slope: line goes down from left to right (like going downhill)',
              'ZERO slope: perfectly horizontal line (y = constant) — no rise, flat',
              'UNDEFINED slope: perfectly vertical line (x = constant) — no run, straight up',
              'Example: slope of 2/3 means "go UP 2, go RIGHT 3" to find the next point'
            ]
          },
          {
            subtitle: 'The Three Forms of a Linear Equation',
            emoji: '📋',
            points: [
              'SLOPE-INTERCEPT FORM: y = mx + b. Best for graphing — m is slope, b is y-intercept (where line hits y-axis)',
              'STANDARD FORM: Ax + By = C, where A, B, C are integers. Best for finding x and y intercepts quickly',
              'POINT-SLOPE FORM: y − y₁ = m(x − x₁). Best for writing an equation when you know the slope and one point',
              'All three forms describe the SAME line — they are just different ways of writing it',
              'To convert from standard to slope-intercept: isolate y. Example: 2x + 3y = 6 → 3y = −2x + 6 → y = −(2/3)x + 2',
              'KNOW WHICH FORM TO USE: exams often ask you to write equations in a specific form'
            ]
          },
          {
            subtitle: 'X-intercept and Y-intercept',
            emoji: '🎯',
            points: [
              'Y-INTERCEPT: where the line crosses the y-axis. At this point, x = 0. To find it: substitute x = 0 into the equation',
              'X-INTERCEPT: where the line crosses the x-axis. At this point, y = 0. To find it: substitute y = 0 into the equation',
              'Example: find intercepts of 3x + 2y = 12',
              'Y-intercept: set x = 0 → 2y = 12 → y = 6. Point: (0, 6)',
              'X-intercept: set y = 0 → 3x = 12 → x = 4. Point: (4, 0)',
              'These two points are enough to draw the full line — plot them and connect with a ruler',
              'In slope-intercept form y = mx + b, the b value IS the y-intercept (no calculation needed)'
            ]
          },
          {
            subtitle: 'Parallel and Perpendicular Lines',
            emoji: '↔️',
            points: [
              'PARALLEL lines: same slope (m₁ = m₂), different y-intercepts. They NEVER intersect',
              'Example: y = 2x + 3 and y = 2x − 5 are parallel (both have slope 2)',
              'PERPENDICULAR lines: slopes are NEGATIVE RECIPROCALS of each other: m₁ × m₂ = −1',
              'To find perpendicular slope: flip the fraction and change the sign. e.g. slope 3 → perpendicular slope is −1/3',
              'Example: slope 2/3 → perpendicular slope is −3/2',
              'SAME LINE: same slope AND same y-intercept (the equations are equivalent) → infinite solutions',
              'These relationships are crucial for solving systems: parallel lines = NO solution, same line = INFINITE solutions'
            ]
          }
        ]
      },
      {
        id: 'graphing-lines',
        title: 'Graphing Linear Equations',
        notes: [
          {
            subtitle: 'Slope-Intercept Form',
            emoji: '📊',
            points: [
              'Form: y = mx + b',
              'm is the slope (rise over run)',
              'b is the y-intercept (where line crosses y-axis)',
              'Example: y = 3x - 2 has slope 3 and y-intercept -2',
              'To graph: start at b on y-axis, use slope to find next points'
            ]
          },
          {
            subtitle: 'Standard Form',
            emoji: '📐',
            points: [
              'Form: Ax + By = C',
              'A, B, and C are integers',
              'Example: 2x + 3y = 12',
              'To convert to slope-intercept: solve for y',
              'Useful for finding intercepts quickly'
            ]
          },
          {
            subtitle: 'Finding Slope',
            emoji: '📈',
            points: [
              'From two points: m = (y₂ - y₁)/(x₂ - x₁)',
              'From a graph: count rise over run',
              'Positive slope: line goes up left to right',
              'Negative slope: line goes down left to right',
              'Zero slope: horizontal line',
              'Undefined slope: vertical line'
            ]
          }
        ]
      },
      {
        id: 'substitution',
        title: 'Substitution Method',
        notes: [
          {
            subtitle: 'When to Use Substitution',
            emoji: '🔄',
            points: [
              'Best when one variable is already isolated',
              'Example: y = 2x + 1 and 3x + y = 9',
              'Also good when easy to isolate a variable',
              'Less messy than elimination sometimes',
              'Works for any system'
            ]
          },
          {
            subtitle: 'Step-by-Step Process',
            emoji: '1️⃣',
            points: [
              '1. Solve one equation for one variable',
              '2. Substitute that expression into other equation',
              '3. Solve for the remaining variable',
              '4. Substitute back to find the other variable',
              '5. Check solution in both original equations'
            ]
          }
        ]
      },
      {
        id: 'elimination',
        title: 'Elimination Method',
        notes: [
          {
            subtitle: 'When to Use Elimination',
            emoji: '➕',
            points: [
              'Best when coefficients are already aligned',
              'Example: 3x + 2y = 8 and 3x - 4y = 2',
              'Efficient when you can easily make coefficients opposite',
              'Good for systems in standard form',
              'Often cleaner than substitution'
            ]
          },
          {
            subtitle: 'Step-by-Step Process',
            emoji: '2️⃣',
            points: [
              '1. Line up equations with like terms in columns',
              '2. Multiply one or both equations to get opposite coefficients',
              '3. Add or subtract equations to eliminate one variable',
              '4. Solve for the remaining variable',
              '5. Substitute to find other variable and check'
            ]
          },
          {
            subtitle: 'Example Walkthrough',
            emoji: '💡',
            points: [
              'Solve: 2x + 3y = 16 and 5x - 3y = 5',
              'Notice: y coefficients are already opposite (3 and -3)',
              'Add equations: 7x = 21, so x = 3',
              'Substitute: 2(3) + 3y = 16 → 6 + 3y = 16 → y = 10/3',
              'Check in both equations to verify'
            ]
          }
        ]
      },
      {
        id: 'types-of-solutions',
        title: 'Types of Solutions',
        notes: [
          {
            subtitle: 'One Solution (Intersecting Lines)',
            emoji: '✖️',
            points: [
              'Lines have different slopes',
              'Lines cross at exactly one point',
              'The system is called "independent and consistent"',
              'Example: y = 2x + 1 and y = -x + 4 intersect at (1, 3)',
              'Most systems you solve will have one solution'
            ]
          },
          {
            subtitle: 'No Solution (Parallel Lines)',
            emoji: '∥',
            points: [
              'Lines have same slope but different y-intercepts',
              'Lines never cross (parallel)',
              'The system is called "inconsistent"',
              'Example: y = 3x + 2 and y = 3x - 5',
              'When solving, you get a false statement like 0 = 7'
            ]
          },
          {
            subtitle: 'Infinite Solutions (Same Line)',
            emoji: '∞',
            points: [
              'Lines have same slope AND same y-intercept',
              'Lines are identical (coincident)',
              'The system is called "dependent and consistent"',
              'Example: y = 2x + 3 and 2y = 4x + 6',
              'When solving, you get a true statement like 0 = 0'
            ]
          }
        ]
      }
    ]
  },
  quadratics: {
    id: 'quadratics',
    name: 'Quadratic Functions',
    description: 'Explore parabolas, factoring, and solving quadratic equations',
    icon: Shapes,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-600',
    sections: [
      {
        id: 'quadratics-basics',
        title: 'The Basics — What is a Quadratic?',
        notes: [
          {
            subtitle: 'What Makes an Equation Quadratic?',
            emoji: '🔺',
            points: [
              'A QUADRATIC equation or function has x² as its highest power — the degree is 2',
              '"Quad" comes from Latin for "square" — it is all about x being squared',
              'Standard form: y = ax² + bx + c, where a ≠ 0 (if a were 0, the x² term vanishes and it becomes linear)',
              'Examples that ARE quadratic: y = x², y = 3x² − 5x + 2, y = −x² + 4, y = (x+3)(x−1)',
              'Examples that are NOT quadratic: y = 3x + 2 (linear), y = x³ − 1 (cubic), y = √x (square root)',
              'Every quadratic function produces a U-shaped curve called a PARABOLA when graphed'
            ]
          },
          {
            subtitle: 'The Parabola — Understanding the Shape',
            emoji: '⛰️',
            points: [
              'A PARABOLA is the curved shape you get when you graph a quadratic function',
              'Every parabola has a LINE OF SYMMETRY — a vertical line that cuts it perfectly in half, creating mirror images',
              'Every parabola has a VERTEX — the single point at the very top (maximum) or very bottom (minimum) of the curve',
              'The vertex always sits exactly on the axis of symmetry',
              'If a > 0: parabola opens UPWARD (like a bowl ∪) and the vertex is the LOWEST point',
              'If a < 0: parabola opens DOWNWARD (like a dome ∩) and the vertex is the HIGHEST point',
              'Real-world parabolas: the path of a thrown ball, the cables of a suspension bridge, satellite dishes'
            ]
          },
          {
            subtitle: 'The Three Forms and What They Tell You',
            emoji: '📋',
            points: [
              'STANDARD FORM: y = ax² + bx + c. Easiest to identify a, b, c for formulas. The y-intercept is immediately visible as (0, c)',
              'VERTEX FORM: y = a(x − h)² + k. The vertex is immediately visible as (h, k). Best form for reading the vertex, axis, domain, and range',
              'FACTORED FORM: y = a(x − r)(x − s). The x-intercepts (zeros/roots) are immediately visible as x = r and x = s',
              'All three forms describe the EXACT SAME parabola — they are just different ways of writing it',
              'You need to be able to CONVERT between forms (completing the square, expanding, factoring)',
              'EXAM TIP: Read the question carefully — it often tells you which form to use or which features to find'
            ]
          },
          {
            subtitle: 'Key Vocabulary You Must Know',
            emoji: '📖',
            points: [
              'ZEROS / ROOTS / X-INTERCEPTS: all mean the same thing — the x-values where y = 0, where the parabola touches/crosses the x-axis',
              'VERTEX: the turning point (maximum or minimum point) of the parabola',
              'AXIS OF SYMMETRY: the vertical line x = h that the parabola is symmetric about',
              'OPTIMAL VALUE: another name for the y-value of the vertex — either a maximum or minimum',
              'DOMAIN: all possible x-values. For quadratics, domain is ALWAYS all real numbers (the curve extends left and right forever)',
              'RANGE: all possible y-values. For quadratics, range is restricted by the vertex: y ≥ k (opens up) or y ≤ k (opens down)',
              'DISCRIMINANT: the expression b² − 4ac that tells you HOW MANY zeros the parabola has'
            ]
          },
          {
            subtitle: 'The Discriminant — How Many Zeros?',
            emoji: '🔍',
            points: [
              'The DISCRIMINANT (b² − 4ac) is calculated from standard form y = ax² + bx + c',
              'It tells you how many times the parabola crosses the x-axis — without having to solve the equation',
              'If b² − 4ac > 0 (positive): TWO x-intercepts. The parabola crosses the x-axis at two different points',
              'If b² − 4ac = 0 (zero): ONE x-intercept. The parabola just touches the x-axis at the vertex (the vertex IS on the x-axis)',
              'If b² − 4ac < 0 (negative): ZERO x-intercepts. The parabola does not cross the x-axis at all',
              'Example: y = x² − 5x + 6. b²−4ac = 25−24 = 1 > 0 → two zeros. y = x² − 4x + 4. b²−4ac = 16−16 = 0 → one zero (vertex touches x-axis)',
              'The discriminant comes from INSIDE the square root of the quadratic formula — a negative inside a square root has no real answer'
            ]
          },
          {
            subtitle: 'Expanding and Collecting Like Terms — The Skills You Need',
            emoji: '✏️',
            points: [
              'To convert FROM vertex or factored form TO standard form, you need to EXPAND and SIMPLIFY',
              'FOIL method for expanding (x + a)(x + b): First × First, Outer × Inner, Last × Last, then collect',
              'Example: (x + 3)(x − 2) = x² − 2x + 3x − 6 = x² + x − 6',
              'LIKE TERMS: terms with the same variable and power. 3x² and −x² are like terms; 5x and 2 are NOT like terms',
              'Collect like terms by adding/subtracting their coefficients: 3x² − x² = 2x²',
              'Always expand STEP BY STEP — one multiplication at a time — to avoid sign errors',
              'Watch negative signs especially when expanding: −(x − 4) = −x + 4 (NOT −x − 4)'
            ]
          }
        ]
      },
      {
        id: 'parabola-features',
        title: 'Characteristics of Parabolas',
        notes: [
          {
            subtitle: 'Key Features of Parabolas',
            emoji: '⛰️',
            points: [
              'Vertex: The turning point of the parabola. If a > 0, it is the MINIMUM point (lowest y-value). If a < 0, it is the MAXIMUM point (highest y-value)',
              'Axis of Symmetry: A vertical line passing through the vertex that divides the parabola into two mirror images. Equation is always x = h (in vertex form) or x = -b/(2a) (in standard form)',
              'Y-intercept: The point where the parabola crosses the y-axis. Found by substituting x = 0 into the equation. In standard form y = ax² + bx + c, the y-intercept is always the point (0, c)',
              'X-intercepts (also called zeros, roots, or solutions): Points where the parabola crosses the x-axis. Found by setting y = 0 and solving. A parabola can have 0, 1, or 2 x-intercepts',
              'Direction of Opening: Determined solely by the sign of a. If a > 0, parabola opens upward (U-shaped). If a < 0, parabola opens downward (∩-shaped)',
              'Domain: For all quadratic functions, the domain is ALL REAL NUMBERS, written as {x ∈ ℝ} or (-∞, ∞) in interval notation',
              'Range: Depends on vertex and direction. If opens up: {y ∈ ℝ | y ≥ k} where k is y-coordinate of vertex. If opens down: {y ∈ ℝ | y ≤ k}'
            ]
          },
          {
            subtitle: 'The Role of "a" in Detail',
            emoji: '🔍',
            points: [
              'The parameter "a" in y = ax² + bx + c (or any form) controls TWO properties: direction and width',
              'DIRECTION: If a > 0 (positive), parabola opens UPWARD and has a MINIMUM value at the vertex. If a < 0 (negative), parabola opens DOWNWARD and has a MAXIMUM value at the vertex',
              'WIDTH: The absolute value |a| determines how wide or narrow the parabola is. Compare to the parent function y = x² where a = 1',
              'If |a| > 1 (example: a = 2, 3, -5): The parabola is NARROWER/STEEPER than y = x². The larger |a| is, the steeper the sides',
              'If 0 < |a| < 1 (example: a = 1/2, 0.25, -0.5): The parabola is WIDER/FLATTER than y = x². The smaller |a| is (closer to 0), the wider it gets',
              'If |a| = 1 (example: a = 1 or a = -1): The parabola has the same width as the parent function y = x², but a = -1 opens downward',
              'Examples: y = 3x² is narrow and opens up. y = -0.5x² is wide and opens down. y = -2x² is narrow and opens down'
            ]
          },
          {
            subtitle: 'Optimal Value (Maximum or Minimum)',
            emoji: '🎯',
            points: [
              'Every parabola has either a maximum value OR a minimum value, never both',
              'The optimal value always occurs at the VERTEX of the parabola',
              'If a > 0 (opens upward): The vertex is the MINIMUM point. The minimum value is the y-coordinate of the vertex',
              'If a < 0 (opens downward): The vertex is the MAXIMUM point. The maximum value is the y-coordinate of the vertex',
              'Example: For y = -2(x - 3)² + 8, vertex is (3, 8). Since a = -2 < 0, the maximum value is 8 (occurs when x = 3)',
              'Example: For y = (x + 1)² - 4, vertex is (-1, -4). Since a = 1 > 0, the minimum value is -4 (occurs when x = -1)',
              'This is crucial for word problems involving optimization (maximizing profit, minimizing cost, finding maximum height, etc.)'
            ]
          },
          {
            subtitle: 'Step Pattern and Graphing',
            emoji: '📊',
            points: [
              'Parabolas follow a predictable step pattern from the vertex based on the value of a',
              'For y = x² (a = 1): From vertex, move 1 right and 1 up, then 1 right and 3 up, then 1 right and 5 up (odd number pattern: 1, 3, 5, 7...)',
              'For y = ax²: Multiply each vertical step by a. Example: y = 2x² goes 1 right and 2 up, then 1 right and 6 up, then 1 right and 10 up',
              'For negative a: Same pattern but reflected (steps go down instead of up)',
              'For a < 1: Steps are smaller. Example: y = 0.5x² goes 1 right and 0.5 up, then 1 right and 1.5 up',
              'Always plot vertex first, then use step pattern on both sides (parabola is symmetric)'
            ]
          }
        ]
      },
      {
        id: 'vertex-form',
        title: 'Vertex Form: y = a(x - h)² + k',
        notes: [
          {
            subtitle: 'Understanding Vertex Form',
            emoji: '✨',
            points: [
              'Vertex Form: y = a(x - h)² + k where (h, k) is the vertex of the parabola',
              'The vertex (h, k) is the turning point - the maximum or minimum of the parabola',
              'The value "a" determines direction (a > 0 opens up, a < 0 opens down) and width (|a| > 1 is narrow, 0 < |a| < 1 is wide)',
              'Example: y = 2(x - 3)² + 5 has vertex at (3, 5), opens upward (a = 2 > 0), and is narrower than y = x²',
              'Example: y = -0.5(x + 4)² - 1 has vertex at (-4, -1), opens downward (a = -0.5 < 0), and is wider than y = x²',
              'This is the EASIEST form for graphing because you can immediately see the vertex'
            ]
          },
          {
            subtitle: 'CRITICAL: Watch the Signs in (x - h)',
            emoji: '⚠️',
            points: [
              'The form is ALWAYS written as y = a(x - h)² + k, with a MINUS sign before h',
              'If you see (x - 3)², then h = +3 and the vertex x-coordinate is +3',
              'If you see (x + 3)², rewrite as (x - (-3))², so h = -3 and the vertex x-coordinate is -3',
              'RULE: Whatever makes the expression (x - h) equal to ZERO is the x-coordinate of the vertex',
              'Example: In (x - 5)², set x - 5 = 0, so x = 5 is the vertex x-coordinate',
              'Example: In (x + 2)², set x + 2 = 0, so x = -2 is the vertex x-coordinate',
              'Common mistake: Thinking (x + 3)² has vertex at x = 3. WRONG! It is at x = -3'
            ]
          },
          {
            subtitle: 'Finding Key Features from Vertex Form',
            emoji: '🔑',
            points: [
              'Vertex: Directly read as (h, k). Example: y = 3(x - 1)² + 7 has vertex (1, 7)',
              'Axis of Symmetry: Always x = h. Example: For y = 3(x - 1)² + 7, axis of symmetry is x = 1',
              'Direction: Check sign of a. If a > 0 opens up, if a < 0 opens down',
              'Optimal Value: The y-coordinate k. If a > 0, k is the minimum. If a < 0, k is the maximum',
              'Y-intercept: Substitute x = 0 and solve for y. Example: y = 2(0 - 3)² + 5 = 2(9) + 5 = 23, so y-intercept is (0, 23)',
              'X-intercepts: Set y = 0 and solve for x using square roots. May have 0, 1, or 2 solutions'
            ]
          },
          {
            subtitle: 'Finding X-intercepts from Vertex Form',
            emoji: '📍',
            points: [
              'Set y = 0: 0 = a(x - h)² + k',
              'Isolate the squared term: a(x - h)² = -k, then (x - h)² = -k/a',
              'Take square root of both sides: x - h = ±√(-k/a)',
              'Solve for x: x = h ± √(-k/a)',
              'IMPORTANT: If -k/a is NEGATIVE, there are NO x-intercepts (cannot take square root of negative)',
              'If -k/a = 0, there is ONE x-intercept (parabola touches x-axis at vertex)',
              'If -k/a is POSITIVE, there are TWO x-intercepts',
              'Example: y = (x - 2)² - 9. Set to 0: (x - 2)² = 9, so x - 2 = ±3, giving x = 5 or x = -1'
            ]
          },
          {
            subtitle: 'Transformations in Vertex Form',
            emoji: '🔄',
            points: [
              'Vertex form shows transformations from parent function y = x²',
              'The value h represents a HORIZONTAL SHIFT: If h > 0, shift RIGHT by h units. If h < 0, shift LEFT by |h| units',
              'The value k represents a VERTICAL SHIFT: If k > 0, shift UP by k units. If k < 0, shift DOWN by |k| units',
              'The value a represents VERTICAL STRETCH/COMPRESSION: If |a| > 1, vertical stretch (narrower). If 0 < |a| < 1, vertical compression (wider)',
              'If a < 0, there is also a REFLECTION over the x-axis (parabola flips upside down)',
              'Example: y = -2(x + 3)² - 4 represents: Start with y = x², reflect over x-axis, stretch by factor 2, shift left 3, shift down 4'
            ]
          }
        ]
      },
      {
        id: 'standard-form',
        title: 'Standard Form: y = ax² + bx + c',
        notes: [
          {
            subtitle: 'Understanding Standard Form',
            emoji: '📐',
            points: [
              'Standard Form: y = ax² + bx + c where a ≠ 0 (if a = 0, it is not a quadratic, just a line)',
              'This is the most common form you will see quadratics written in',
              'Example: y = 2x² - 8x + 3 has a = 2, b = -8, c = 3',
              'Example: y = -x² + 5x - 1 has a = -1, b = 5, c = -1',
              'The coefficients a, b, and c can be any real number (positive, negative, zero, fraction, etc.)',
              'The y-intercept is ALWAYS the point (0, c) - this is immediate and requires no calculation'
            ]
          },
          {
            subtitle: 'Finding the Vertex from Standard Form',
            emoji: '🎯',
            points: [
              'The x-coordinate of the vertex is found using the formula: x = -b/(2a)',
              'After finding x-coordinate, SUBSTITUTE it back into the original equation to find the y-coordinate',
              'Example: y = 2x² - 8x + 3. Find x: x = -(-8)/(2·2) = 8/4 = 2',
              'Find y by substituting x = 2: y = 2(2)² - 8(2) + 3 = 8 - 16 + 3 = -5',
              'Therefore vertex is (2, -5)',
              'The axis of symmetry is x = -b/(2a), which is the same as the x-coordinate of the vertex',
              'IMPORTANT: You MUST calculate the y-coordinate by substitution. The formula -b/(2a) only gives you x'
            ]
          },
          {
            subtitle: 'The Discriminant: b² - 4ac',
            emoji: '🔢',
            points: [
              'The discriminant is the expression b² - 4ac (the part under the square root in the quadratic formula)',
              'The discriminant tells you how many x-intercepts (zeros/roots) the parabola has WITHOUT actually solving',
              'If b² - 4ac > 0 (POSITIVE): The parabola has TWO distinct x-intercepts (crosses x-axis twice)',
              'If b² - 4ac = 0 (ZERO): The parabola has EXACTLY ONE x-intercept (touches x-axis at the vertex)',
              'If b² - 4ac < 0 (NEGATIVE): The parabola has NO x-intercepts (does not touch or cross x-axis)',
              'Example: For y = x² + 2x + 5, discriminant = (2)² - 4(1)(5) = 4 - 20 = -16 < 0, so NO x-intercepts',
              'Example: For y = x² - 6x + 9, discriminant = (-6)² - 4(1)(9) = 36 - 36 = 0, so ONE x-intercept (at x = 3)',
              'Example: For y = x² - 5x + 6, discriminant = (-5)² - 4(1)(6) = 25 - 24 = 1 > 0, so TWO x-intercepts'
            ]
          },
          {
            subtitle: 'Complete Example: Analyzing y = 2x² - 8x + 3',
            emoji: '💡',
            points: [
              'Given: y = 2x² - 8x + 3, so a = 2, b = -8, c = 3',
              'Direction: a = 2 > 0, so opens UPWARD and has a MINIMUM',
              'Y-intercept: (0, c) = (0, 3)',
              'Vertex x-coordinate: x = -(-8)/(2·2) = 8/4 = 2',
              'Vertex y-coordinate: y = 2(2)² - 8(2) + 3 = 8 - 16 + 3 = -5',
              'Vertex: (2, -5), which is the MINIMUM point (minimum value is -5)',
              'Axis of symmetry: x = 2',
              'Discriminant: (-8)² - 4(2)(3) = 64 - 24 = 40 > 0, so TWO x-intercepts exist',
              'Domain: All real numbers, (-∞, ∞)',
              'Range: Since opens up with minimum at y = -5, range is [-5, ∞) or {y ∈ ℝ | y ≥ -5}'
            ]
          },
          {
            subtitle: 'Converting Standard Form to Vertex Form',
            emoji: '🔄',
            points: [
              'Method 1 - Using Vertex Formula: Find vertex (h, k) using x = -b/(2a), then write as y = a(x - h)² + k',
              'Example: y = x² + 6x + 2. Vertex: x = -6/2 = -3, y = (-3)² + 6(-3) + 2 = 9 - 18 + 2 = -7. So y = (x + 3)² - 7',
              'Method 2 - Completing the Square (more general, works for all cases): See "Completing the Square" section',
              'Both methods give the same answer, but completing the square is more algebraic and shows the process'
            ]
          }
        ]
      },
      {
        id: 'factored-form',
        title: 'Factored Form & Factoring',
        notes: [
          {
            subtitle: 'Understanding Factored Form',
            emoji: '✂️',
            points: [
              'Factored Form: y = a(x - r)(x - s) where r and s are the x-intercepts (zeros/roots)',
              'The values r and s are the solutions to the equation when y = 0',
              'Example: y = 2(x - 3)(x + 1) has x-intercepts at x = 3 and x = -1 (not at 3 and 1!)',
              'Example: y = -(x + 4)(x - 2) has x-intercepts at x = -4 and x = 2',
              'To find x-intercepts from factors: Set each factor equal to zero. From (x - 3), get x = 3. From (x + 1), get x = -1',
              'WATCH SIGNS: (x - r) gives zero at x = r. (x + r) gives zero at x = -r'
            ]
          },
          {
            subtitle: 'Finding Other Features from Factored Form',
            emoji: '🔑',
            points: [
              'X-intercepts: Set each factor to zero and solve. These are r and s',
              'Axis of Symmetry: Located exactly halfway between the two x-intercepts. Formula: x = (r + s)/2',
              'Vertex x-coordinate: Same as axis of symmetry, x = (r + s)/2',
              'Vertex y-coordinate: Substitute the vertex x-coordinate back into the original equation',
              'Example: y = (x - 1)(x - 5). Zeros at x = 1 and x = 5. Axis: x = (1 + 5)/2 = 3. Vertex: (3, y) where y = (3-1)(3-5) = (2)(-2) = -4, so vertex is (3, -4)',
              'Y-intercept: Substitute x = 0 into the equation. Example: y = 2(0 - 3)(0 + 1) = 2(-3)(1) = -6, so y-intercept is (0, -6)',
              'Direction: Determined by sign of a (the coefficient in front)'
            ]
          },
          {
            subtitle: 'Simple Factoring: x² + bx + c (when a = 1)',
            emoji: '🎯',
            points: [
              'Goal: Express x² + bx + c as (x + m)(x + n)',
              'Find two numbers m and n such that: m × n = c (they multiply to the constant term) AND m + n = b (they add to the coefficient of x)',
              'Example: Factor x² + 7x + 12. Need two numbers that multiply to 12 and add to 7',
              'Numbers are 3 and 4 because 3 × 4 = 12 and 3 + 4 = 7',
              'Answer: (x + 3)(x + 4)',
              'Example: Factor x² - 5x + 6. Need two numbers that multiply to 6 and add to -5',
              'Numbers are -2 and -3 because (-2) × (-3) = 6 and (-2) + (-3) = -5',
              'Answer: (x - 2)(x - 3)',
              'SIGN RULES: If c is positive, m and n have the SAME sign (both + or both -). If c is negative, m and n have OPPOSITE signs'
            ]
          },
          {
            subtitle: 'Common Factoring Patterns',
            emoji: '🔄',
            points: [
              'ALWAYS check for Greatest Common Factor (GCF) FIRST before other methods',
              'Example: 3x² + 12x = 3x(x + 4). Factor out 3x first',
              'Difference of Squares: a² - b² = (a + b)(a - b). ONLY works when subtracting two perfect squares',
              'Example: x² - 25 = (x + 5)(x - 5) because x² and 25 are both perfect squares',
              'Example: 4x² - 49 = (2x + 7)(2x - 7) because 4x² = (2x)² and 49 = 7²',
              'Perfect Square Trinomial: a² + 2ab + b² = (a + b)² or a² - 2ab + b² = (a - b)²',
              'Example: x² + 6x + 9 = (x + 3)² because 9 = 3² and 6x = 2(x)(3)',
              'Example: x² - 10x + 25 = (x - 5)² because 25 = 5² and -10x = -2(x)(5)',
              'NOT factorable (Prime): Some trinomials cannot be factored using integers. Example: x² + 2x + 5 (no two integers multiply to 5 and add to 2)'
            ]
          },
          {
            subtitle: 'Complex Factoring: ax² + bx + c (when a ≠ 1)',
            emoji: '🧩',
            points: [
              'When a ≠ 1, factoring is more complex. Use decomposition (splitting the middle term)',
              'Steps: 1) Multiply a × c. 2) Find two numbers that multiply to a×c and add to b. 3) Split bx into two terms. 4) Factor by grouping',
              'Example: Factor 2x² + 7x + 3',
              'Step 1: a × c = 2 × 3 = 6',
              'Step 2: Find two numbers that multiply to 6 and add to 7. Numbers are 6 and 1',
              'Step 3: Rewrite: 2x² + 6x + 1x + 3 (split 7x into 6x + 1x)',
              'Step 4: Factor by grouping: 2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3)',
              'CHECK: (2x + 1)(x + 3) = 2x² + 6x + x + 3 = 2x² + 7x + 3 ✓'
            ]
          },
          {
            subtitle: 'Factor by Grouping (Four Terms)',
            emoji: '📦',
            points: [
              'Used when polynomial has FOUR terms',
              'Steps: 1) Group terms in pairs. 2) Factor out GCF from each pair. 3) Factor out common binomial',
              'Example: x³ + 3x² + 2x + 6',
              'Step 1: Group: (x³ + 3x²) + (2x + 6)',
              'Step 2: Factor GCF from each: x²(x + 3) + 2(x + 3)',
              'Step 3: Factor out (x + 3): (x + 3)(x² + 2)',
              'This method is also used in decomposition for factoring when a ≠ 1'
            ]
          },
          {
            subtitle: 'Solving Quadratic Equations by Factoring',
            emoji: '✅',
            points: [
              'Zero Product Property: If A × B = 0, then A = 0 OR B = 0 (or both)',
              'Steps: 1) Set equation equal to zero. 2) Factor completely. 3) Set each factor equal to zero. 4) Solve each equation',
              'Example: Solve x² + 5x + 6 = 0',
              'Factor: (x + 2)(x + 3) = 0',
              'Set each factor to zero: x + 2 = 0 OR x + 3 = 0',
              'Solutions: x = -2 or x = -3',
              'IMPORTANT: The equation MUST equal zero before applying zero product property. If x² + 5x + 6 = 10, you cannot factor and solve - must rearrange to x² + 5x - 4 = 0 first'
            ]
          }
        ]
      },
      {
        id: 'completing-square',
        title: 'Completing the Square',
        notes: [
          {
            subtitle: 'Why Complete the Square?',
            emoji: '🎨',
            points: [
              'Completing the square is a method to convert standard form (y = ax² + bx + c) into vertex form (y = a(x - h)² + k)',
              'Once in vertex form, you can immediately identify the vertex (h, k)',
              'This method ALWAYS works, even when factoring is impossible',
              'Completing the square is the foundation of the quadratic formula',
              'Used in solving quadratic equations, graphing parabolas, and finding maximum/minimum values',
              'This is one of the most important algebraic techniques in Grade 10 math'
            ]
          },
          {
            subtitle: 'Step-by-Step Process (when a = 1)',
            emoji: '📝',
            points: [
              'Example: Convert x² + 6x + 2 to vertex form',
              'Step 1: Move the constant to the right side: x² + 6x = -2',
              'Step 2: Take HALF of the coefficient of x (which is 6). Half of 6 = 3',
              'Step 3: SQUARE that number: 3² = 9',
              'Step 4: ADD this number to BOTH sides: x² + 6x + 9 = -2 + 9',
              'Step 5: The left side is now a perfect square trinomial. Factor it: (x + 3)² = 7',
              'Step 6: This is vertex form. The vertex is (-3, 7). To write as equation: y = (x + 3)² + 7 if we move 7 to left, or y - 7 = (x + 3)²',
              'IMPORTANT: The number you add (9) comes from (b/2)² where b is the coefficient of x'
            ]
          },
          {
            subtitle: 'Understanding Why It Works',
            emoji: '💡',
            points: [
              'Perfect square trinomials have the form: (x + n)² = x² + 2nx + n²',
              'Notice the pattern: The constant term (n²) equals (coefficient of x / 2)²',
              'Example: (x + 3)² = x² + 6x + 9. Notice 9 = (6/2)²',
              'Example: (x - 5)² = x² - 10x + 25. Notice 25 = (-10/2)²',
              'When we "complete the square", we are forcing the quadratic to become a perfect square trinomial by adding the missing piece',
              'If we have x² + 6x, we need to add 9 to make it (x + 3)²'
            ]
          },
          {
            subtitle: 'When a ≠ 1: Must Factor Out "a" First',
            emoji: '⚡',
            points: [
              'If the coefficient of x² is not 1, you MUST factor it out before completing the square',
              'Example: Convert 2x² + 8x - 5 to vertex form',
              'Step 1: Factor out the 2 from ONLY the x² and x terms: 2(x² + 4x) - 5',
              'Step 2: Complete the square INSIDE the parentheses. Half of 4 = 2, squared = 4',
              'Step 3: Add 4 inside parentheses, but remember it is being multiplied by 2: 2(x² + 4x + 4) - 5',
              'Step 4: We added 2(4) = 8 to the expression, so subtract 8 outside: 2(x² + 4x + 4) - 5 - 8',
              'Step 5: Factor inside: 2(x + 2)² - 13',
              'The vertex is (-2, -13)',
              'CRITICAL: When you add inside parentheses with a coefficient, you must account for that coefficient outside'
            ]
          },
          {
            subtitle: 'Detailed Example: 3x² - 12x + 5',
            emoji: '🔍',
            points: [
              'Step 1: Factor out 3 from x² and x terms: 3(x² - 4x) + 5',
              'Step 2: Complete square inside. Half of -4 = -2, squared = 4',
              'Step 3: Add and subtract 4 inside: 3(x² - 4x + 4 - 4) + 5',
              'Step 4: Rearrange: 3(x² - 4x + 4) - 3(4) + 5',
              'Step 5: Simplify: 3(x - 2)² - 12 + 5 = 3(x - 2)² - 7',
              'Vertex form: y = 3(x - 2)² - 7, so vertex is (2, -7)',
              'Note: We multiplied the 4 by 3 when taking it outside parentheses'
            ]
          },
          {
            subtitle: 'Solving Equations by Completing the Square',
            emoji: '✅',
            points: [
              'You can use completing the square to SOLVE quadratic equations (find x-intercepts)',
              'Example: Solve x² + 8x + 3 = 0',
              'Step 1: Move constant: x² + 8x = -3',
              'Step 2: Complete square: (8/2)² = 16. Add to both sides: x² + 8x + 16 = -3 + 16',
              'Step 3: Factor: (x + 4)² = 13',
              'Step 4: Take square root of both sides: x + 4 = ±√13',
              'Step 5: Solve: x = -4 ± √13',
              'Solutions: x = -4 + √13 ≈ -0.39 or x = -4 - √13 ≈ -7.61',
              'This method gives exact answers with radicals'
            ]
          }
        ]
      },
      {
        id: 'quadratic-formula',
        title: 'Quadratic Formula',
        notes: [
          {
            subtitle: 'The Formula',
            emoji: '🧮',
            points: [
              'x = (-b ± √(b² - 4ac))/(2a)',
              'Works for ANY quadratic equation',
              'Use when factoring is difficult or impossible',
              'Always gives exact solutions',
              'Remember to check discriminant first'
            ]
          },
          {
            subtitle: 'Step-by-Step Example',
            emoji: '👣',
            points: [
              'Solve: 3x² + 5x - 2 = 0',
              'Identify: a = 3, b = 5, c = -2',
              'x = (-5 ± √(25 - 4(3)(-2)))/(2·3)',
              'x = (-5 ± √(25 + 24))/6 = (-5 ± √49)/6 = (-5 ± 7)/6',
              'Solutions: x = 2/6 = 1/3 or x = -12/6 = -2'
            ]
          },
          {
            subtitle: 'Common Mistakes to Avoid',
            emoji: '⚠️',
            points: [
              'Don\'t forget the ± sign (gives TWO solutions)',
              'Simplify radicals when possible',
              'Check that equation is in standard form (= 0)',
              'Be careful with negative signs',
              'Always substitute answers back to check'
            ]
          }
        ]
      },
      {
        id: 'word-problems',
        title: 'Quadratic Word Problems',
        notes: [
          {
            subtitle: 'Projectile Motion',
            emoji: '🚀',
            points: [
              'Formula: h(t) = -5t² + v₀t + h₀',
              'h is height, t is time, v₀ is initial velocity, h₀ is initial height',
              'Maximum height occurs at vertex',
              'Object hits ground when h = 0',
              'Example: Ball thrown up at 20 m/s from 2m high'
            ]
          },
          {
            subtitle: 'Area Problems',
            emoji: '📐',
            points: [
              'Often involve rectangles or enclosed spaces',
              'Use formulas: A = length × width',
              'Perimeter constraints create equations',
              'Example: Rectangular garden with 40m of fencing',
              'Set up equation, then maximize area'
            ]
          },
          {
            subtitle: 'Profit and Revenue',
            emoji: '💰',
            points: [
              'Revenue = (price)(quantity sold)',
              'Often: higher price → fewer sales',
              'Profit = Revenue - Cost',
              'Maximum profit at vertex',
              'Example: Concert tickets $10 each, lose 5 sales per $1 increase'
            ]
          }
        ]
      }
    ]
  },
  analyticGeometry: {
    id: 'analyticGeometry',
    name: 'Analytic Geometry',
    description: 'Distance, midpoint, circles, and geometric proofs',
    icon: Grid3x3,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    sections: [
      {
        id: 'analytic-basics',
        title: 'The Basics — Geometry Meets Algebra',
        notes: [
          {
            subtitle: 'What is Analytic Geometry?',
            emoji: '🗺️',
            points: [
              'ANALYTIC GEOMETRY (also called coordinate geometry) combines ALGEBRA and GEOMETRY — it uses the coordinate plane to study shapes, lines, and distances using equations and formulas',
              'The big idea: every geometric shape (line, circle, triangle) can be described using coordinates (numbers), and we can use algebra to prove geometric properties',
              'Example: instead of using a ruler to measure if two sides of a triangle are equal, we use the DISTANCE FORMULA',
              'Example: instead of visually checking if lines are perpendicular, we check if their slopes multiply to −1',
              'This is powerful because algebra is precise — it gives exact answers, not estimates'
            ]
          },
          {
            subtitle: 'The Coordinate Plane — Your Grid',
            emoji: '📐',
            points: [
              'The COORDINATE PLANE has a horizontal x-axis and vertical y-axis, crossing at the ORIGIN (0, 0)',
              'Every point is an ORDERED PAIR (x, y): x tells you left (+) or right (−) from origin, y tells you up (+) or down (−)',
              'To plot point (−3, 4): go LEFT 3 from origin, then UP 4',
              'The four QUADRANTS: Q1 = (+, +), Q2 = (−, +), Q3 = (−, −), Q4 = (+, −)',
              'Points ON the x-axis have y = 0. Points ON the y-axis have x = 0',
              'The coordinate plane is infinite — it extends forever in all four directions'
            ]
          },
          {
            subtitle: 'Slope — The Foundation of Lines in Analytic Geometry',
            emoji: '⛰️',
            points: [
              'SLOPE (m) = rise / run = (y₂ − y₁) / (x₂ − x₁). It measures steepness and direction',
              'PARALLEL lines have EQUAL slopes: m₁ = m₂. They never meet',
              'PERPENDICULAR lines have slopes that are NEGATIVE RECIPROCALS: m₁ × m₂ = −1',
              'To get the perpendicular slope: flip the fraction and change the sign. e.g. slope 3/4 → perpendicular slope is −4/3',
              'HORIZONTAL line: slope = 0 (y = constant). VERTICAL line: slope is UNDEFINED (x = constant)',
              'Slope is crucial in analytic geometry for proving parallel/perpendicular sides, classifying shapes, and more'
            ]
          },
          {
            subtitle: 'Types of Quadrilaterals — Know Your Shapes',
            emoji: '🔷',
            points: [
              'PARALLELOGRAM: 2 pairs of PARALLEL sides. Opposite sides are equal. Diagonals BISECT each other',
              'RECTANGLE: parallelogram with 4 RIGHT ANGLES (90°). Diagonals are EQUAL in length AND bisect each other',
              'RHOMBUS: parallelogram with all 4 SIDES EQUAL. Diagonals BISECT each other at 90°',
              'SQUARE: rectangle AND rhombus — all 4 sides equal AND all 4 angles 90°. Diagonals equal, bisect, and are perpendicular',
              'TRAPEZOID: exactly ONE pair of parallel sides (the two non-parallel sides are called legs)',
              'To PROVE what type a quadrilateral is: calculate slopes (for parallel/perpendicular), distances (for equal sides), and midpoints (for bisecting diagonals)'
            ]
          },
          {
            subtitle: 'Types of Triangles — Classification Review',
            emoji: '🔺',
            points: [
              'BY SIDES — EQUILATERAL: all 3 sides equal. ISOSCELES: exactly 2 sides equal. SCALENE: all 3 sides different',
              'BY ANGLES — ACUTE: all angles less than 90°. RIGHT: one angle exactly 90°. OBTUSE: one angle greater than 90°',
              'To classify BY SIDES in analytic geometry: use the DISTANCE FORMULA to calculate all three side lengths, then compare',
              'To prove a RIGHT ANGLE: show that two sides have slopes that are negative reciprocals (m₁ × m₂ = −1). OR show that the sides satisfy the Pythagorean theorem (a² + b² = c²)',
              'Common task: "Classify triangle ABC" — calculate all 3 side lengths using distance formula, then classify',
              'Another common task: "Prove triangle ABC is isosceles" — show two sides have equal length'
            ]
          },
          {
            subtitle: 'How to Write a Geometric Proof Using Coordinates',
            emoji: '✍️',
            points: [
              'A GEOMETRIC PROOF in analytic geometry uses calculations to PROVE a statement is true — not just "looks true from the diagram"',
              'STRUCTURE of a proof: (1) State what you are given, (2) State what you need to prove, (3) Show your calculations, (4) Write a concluding statement',
              'Use the appropriate formula for what you need to show: distance (equal lengths), slope (parallel/perpendicular), midpoint (bisection)',
              'Concluding statement example: "Since AB = CD = 5 and BC = AD = 3, ABCD has two pairs of equal opposite sides, therefore ABCD is a parallelogram"',
              'NEVER just say "the shape looks like a square" — you must PROVE it with numbers',
              'Common mistake: forgetting the conclusion. Always end with a clear sentence stating what you proved'
            ]
          }
        ]
      },
      {
        id: 'distance-midpoint',
        title: 'Distance and Midpoint Formulas',
        notes: [
          {
            subtitle: 'Distance Formula',
            emoji: '📏',
            points: [
              'Formula: d = √[(x₂ - x₁)² + (y₂ - y₁)²]',
              'Derived from Pythagorean theorem',
              'Finds straight-line distance between two points',
              'Example: Distance from (1, 2) to (4, 6)',
              'd = √[(4-1)² + (6-2)²] = √[9 + 16] = √25 = 5'
            ]
          },
          {
            subtitle: 'Midpoint Formula',
            emoji: '⚖️',
            points: [
              'Formula: M = ((x₁ + x₂)/2, (y₁ + y₂)/2)',
              'Finds the exact middle point between two points',
              'Average the x-coordinates, average the y-coordinates',
              'Example: Midpoint of (2, 3) and (8, 7)',
              'M = ((2+8)/2, (3+7)/2) = (5, 5)'
            ]
          },
          {
            subtitle: 'Applications',
            emoji: '🎯',
            points: [
              'Finding perimeter of triangles and polygons',
              'Verifying midpoints on line segments',
              'Finding centers of shapes',
              'Checking if points form specific shapes',
              'Used in proofs and geometric constructions'
            ]
          }
        ]
      },
      {
        id: 'circles',
        title: 'Equation of a Circle',
        notes: [
          {
            subtitle: 'Standard Form',
            emoji: '⭕',
            points: [
              'Formula: (x - h)² + (y - k)² = r²',
              'Center: (h, k)',
              'Radius: r',
              'Example: (x - 3)² + (y + 2)² = 25',
              'Center: (3, -2), Radius: 5'
            ]
          },
          {
            subtitle: 'Finding Equation from Information',
            emoji: '🔍',
            points: [
              'Given center and radius: plug directly into formula',
              'Given center and point on circle: use distance formula for r',
              'Given diameter endpoints: find midpoint for center',
              'Example: Center (1, 1), passes through (4, 5)',
              'r = √[(4-1)² + (5-1)²] = √25 = 5, so (x-1)² + (y-1)² = 25'
            ]
          },
          {
            subtitle: 'Points on a Circle',
            emoji: '📍',
            points: [
              'To check if point is ON circle: substitute and see if equation is true',
              'Example: Is (3, 4) on circle x² + y² = 25?',
              '3² + 4² = 9 + 16 = 25 ✓ Yes!',
              'If result > r²: point is outside',
              'If result < r²: point is inside'
            ]
          }
        ]
      },
      {
        id: 'verifying-shapes',
        title: 'Verifying Properties of Shapes',
        notes: [
          {
            subtitle: 'Verifying a Right Triangle',
            emoji: '📐',
            points: [
              'Use Pythagorean theorem: a² + b² = c²',
              'Find all three side lengths using distance formula',
              'Check if (shortest)² + (middle)² = (longest)²',
              'Example: Vertices (0,0), (3,0), (0,4)',
              'Sides: 3, 4, 5. Check: 3² + 4² = 9 + 16 = 25 = 5² ✓'
            ]
          },
          {
            subtitle: 'Verifying a Rectangle',
            emoji: '▭',
            points: [
              'Opposite sides must be equal length',
              'All angles must be 90° (use perpendicular slopes)',
              'Diagonals must be equal length',
              'Find all side lengths and check conditions',
              'Perpendicular slopes: m₁ × m₂ = -1'
            ]
          },
          {
            subtitle: 'Verifying Parallel and Perpendicular Lines',
            emoji: '∥⊥',
            points: [
              'Parallel lines: same slope (m₁ = m₂)',
              'Perpendicular lines: slopes are negative reciprocals (m₁ × m₂ = -1)',
              'Example: slope 2 and slope -1/2 are perpendicular',
              'Find slopes using m = (y₂ - y₁)/(x₂ - x₁)',
              'Vertical and horizontal lines are always perpendicular'
            ]
          },
          {
            subtitle: 'Classifying Triangles',
            emoji: '🔺',
            points: [
              'Equilateral: all three sides equal',
              'Isosceles: exactly two sides equal',
              'Scalene: all sides different',
              'Right triangle: satisfies Pythagorean theorem',
              'Calculate all side lengths first, then classify'
            ]
          }
        ]
      },
      {
        id: 'geometric-proofs',
        title: 'Coordinate Geometry Proofs',
        notes: [
          {
            subtitle: 'Proof Strategies',
            emoji: '🎓',
            points: [
              'Always start by plotting or sketching the shape',
              'Use distance formula to show sides are equal/unequal',
              'Use slope to show lines are parallel/perpendicular',
              'Use midpoint formula to show diagonals bisect',
              'Organize work clearly with labels'
            ]
          },
          {
            subtitle: 'Example: Prove ABCD is a Parallelogram',
            emoji: '▱',
            points: [
              'Method 1: Show opposite sides are parallel (equal slopes)',
              'Method 2: Show opposite sides are equal length',
              'Method 3: Show diagonals bisect each other (same midpoint)',
              'Only need to prove ONE method',
              'State conclusion clearly'
            ]
          }
        ]
      }
    ]
  },
  trigonometry: {
    id: 'trigonometry',
    name: 'Trigonometry',
    description: 'Triangle basics, similar triangles, right triangle trig, sine law, cosine law',
    icon: Calculator,
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
    sections: [
      {
        id: 'triangle-basics',
        title: 'Triangle Basics & Labelling',
        notes: [
          {
            subtitle: 'Parts of a Triangle — The Vocabulary You Need',
            emoji: '🔺',
            points: [
              'A triangle has 3 VERTICES (corners), 3 SIDES, and 3 ANGLES',
              'Vertices are named with CAPITAL letters: A, B, C (or P, Q, R etc.)',
              'Sides are named with LOWERCASE letters matching the OPPOSITE vertex: side a is opposite angle A, side b is opposite angle B, side c is opposite angle C',
              'Angles are written as ∠A, ∠B, ∠C — or you may see them written as angle A, angle B, angle C',
              'The INTERIOR ANGLES of any triangle always add up to exactly 180°: ∠A + ∠B + ∠C = 180°',
              'This is called the Triangle Angle Sum Property and you will use it constantly!'
            ]
          },
          {
            subtitle: 'The Standard Labelling Convention',
            emoji: '🏷️',
            points: [
              'In triangle ABC, the side OPPOSITE to angle A is called side "a" (lowercase)',
              'The side OPPOSITE to angle B is called side "b"',
              'The side OPPOSITE to angle C is called side "c"',
              'MEMORY TRICK: The letter of the ANGLE and its OPPOSITE SIDE always match (just upper vs lower case)',
              'Example: If angle A = 40° and it is opposite a 10 cm side, then a = 10',
              'Why does this matter? Sine and Cosine Laws REQUIRE this matching — a/sin(A) only works when a and A are a matched pair',
              'Always re-label your triangle with the standard convention before applying any formula'
            ]
          },
          {
            subtitle: 'Types of Triangles by Angles',
            emoji: '📐',
            points: [
              'ACUTE triangle: ALL three angles are less than 90°. Example: 50°, 60°, 70°',
              'RIGHT triangle: exactly ONE angle equals 90° (marked with a small square in diagrams). The side opposite the 90° is the hypotenuse — the longest side',
              'OBTUSE triangle: exactly ONE angle is greater than 90°. Example: 110°, 40°, 30°',
              'A triangle CANNOT have two right angles (that would make angles sum > 180°)',
              'A triangle CANNOT have two obtuse angles for the same reason'
            ]
          },
          {
            subtitle: 'Types of Triangles by Sides',
            emoji: '📏',
            points: [
              'SCALENE triangle: all three sides have DIFFERENT lengths. No equal sides, no equal angles',
              'ISOSCELES triangle: exactly TWO sides are EQUAL. The angles opposite those equal sides are also equal (base angles)',
              'EQUILATERAL triangle: all THREE sides are EQUAL. All three angles are also equal, each being 60°',
              'Tick marks on sides in diagrams show which sides are equal: one tick = equal to other sides with one tick',
              'Arc marks on angles show which angles are equal: one arc = equal to other angles with one arc'
            ]
          },
          {
            subtitle: 'The Pythagorean Theorem — Your Right Triangle Best Friend',
            emoji: '⚡',
            points: [
              'For any RIGHT triangle: a² + b² = c², where c is ALWAYS the hypotenuse',
              'The hypotenuse is the side OPPOSITE the 90° angle — it is always the LONGEST side',
              'Use it to: find a missing side, OR check if a triangle is a right triangle',
              'Finding missing side: if a = 3 and c = 5, then b² = c² - a² = 25 - 9 = 16, so b = 4',
              'Checking for right angle: if the three sides satisfy a² + b² = c², the triangle has a 90° angle',
              'COMMON PYTHAGOREAN TRIPLES (whole number right triangles): 3-4-5, 5-12-13, 8-15-17, 7-24-25',
              'Any multiple of these also works: 6-8-10, 9-12-15 etc.'
            ]
          },
          {
            subtitle: 'How to Draw and Label a Triangle Properly',
            emoji: '✏️',
            points: [
              '1. Draw the triangle shape and label all three vertices with capital letters (A, B, C)',
              '2. Mark any known angles inside the triangle near the vertex with their value',
              '3. Label each side with its lowercase letter NEAR THE MIDDLE of that side',
              '4. Mark any known side lengths next to their lowercase letter',
              '5. Mark the right angle with a small square if present',
              '6. Mark equal sides with matching tick marks if any sides are equal',
              'GOOD HABIT: Always draw a fresh, clear diagram — a messy diagram causes mistakes!',
              'GOOD HABIT: Re-read the problem while looking at your diagram to make sure you have labelled everything correctly'
            ]
          }
        ]
      },
      {
        id: 'similar-triangles',
        title: 'Similar Triangles',
        notes: [
          {
            subtitle: 'What Are Similar Triangles?',
            emoji: '🔍',
            points: [
              'Two triangles are SIMILAR if they have the SAME SHAPE but NOT necessarily the same size',
              'Similar triangles are like a photograph and an enlargement — same proportions, different scale',
              'TWO conditions must BOTH be true: (1) All three pairs of corresponding angles are EQUAL, AND (2) All three pairs of corresponding sides are in the SAME RATIO',
              'In practice, TWO equal angles is enough to prove similarity — the third angle must match too (since angles sum to 180°)',
              'Symbol: △ABC ~ △DEF (the tilde ~ means "is similar to")'
            ]
          },
          {
            subtitle: 'The Three Ways to Prove Triangles Are Similar',
            emoji: '✅',
            points: [
              'AA (Angle-Angle): Show TWO pairs of equal angles. Most common method on tests',
              'SSS Similarity: All THREE pairs of corresponding sides share the SAME ratio. e.g. sides 3,4,5 vs 6,8,10 → each ratio = 1:2 → similar',
              'SAS Similarity: TWO pairs of sides in the same ratio AND the INCLUDED angle between them is equal',
              'IMPORTANT: These are DIFFERENT from SSS/SAS/ASA congruence. Similarity = same shape only. Congruence = same shape AND same size'
            ]
          },
          {
            subtitle: 'How to STATE Similarity Correctly (Exam Format)',
            emoji: '📝',
            points: [
              'The ORDER of letters in your statement tells the reader which vertices correspond — this is critical',
              'Format: △ABC ~ △DEF means A↔D, B↔E, C↔F — those pairs share equal angles',
              'Always write: "[triangle 1] ~ [triangle 2] by [AA/SSS/SAS] similarity because [reason]"',
              'Full example: "△PQR ~ △STU by AA similarity because ∠P = ∠S = 35° and ∠Q = ∠T = 80°"',
              'NEVER just say "the triangles are similar" — state which triangles, which method, and why'
            ]
          },
          {
            subtitle: 'Using Similar Triangles to Find Missing Sides',
            emoji: '🔢',
            points: [
              'Once similarity is proven, corresponding sides form EQUAL RATIOS (proportions)',
              'Set up: (side₁ from △1) / (matching side from △2) = (side₂ from △1) / (matching side₂ from △2)',
              'Example: △ABC ~ △DEF, AB=6, DE=9, BC=8. Find EF.',
              'Set up: AB/DE = BC/EF → 6/9 = 8/EF → EF = 8×9/6 = 12',
              'The SCALE FACTOR is the ratio of any pair of corresponding sides: here it is 6/9 = 2/3',
              'Multiply any side of △1 by (9/6) to get the corresponding side of △2',
              'ALWAYS identify corresponding pairs using the similarity statement letter order BEFORE setting up ratios'
            ]
          },
          {
            subtitle: 'Situation 1 — Nested Triangles (Parallel Line Inside)',
            emoji: '🔺',
            points: [
              'A line drawn PARALLEL to one side of a triangle, connecting the other two sides, creates a SMALLER triangle INSIDE that is similar to the whole triangle',
              'In △ABC, if DE ∥ BC with D on AB and E on AC, then △ADE ~ △ABC',
              'WHY? ∠A is shared (common angle). ∠ADE = ∠ABC (corresponding angles, DE ∥ BC). Two equal angles → AA similarity',
              'This means: AD/AB = AE/AC = DE/BC (all ratios equal the same scale factor)',
              'Classic exam question: "D is on AB and E is on AC, DE ∥ BC, AD=4, DB=2. Find DE if BC=9"',
              'Scale factor = AD/AB = 4/6 = 2/3, so DE = BC × 2/3 = 9 × 2/3 = 6'
            ]
          },
          {
            subtitle: 'Situation 2 — Overlapping / Shared Angle Triangles',
            emoji: '🔗',
            points: [
              'When two triangles SHARE a common angle at a vertex, that shared angle gives you one of the two AA conditions automatically',
              'Example: △ABC and △ADE share angle A (same vertex, same angle). If you can show one more pair of equal angles, they are similar by AA',
              'Common setup: lines from one vertex meeting a transversal create two overlapping triangles',
              'Look for: the SHARED angle is always at the common vertex. Then look for parallel lines, equal angles from the problem, or vertically opposite angles',
              'Vertically opposite angles (X-shape intersection) are ALWAYS equal — use this as your second angle pair',
              'State clearly: "∠A = ∠A (common/shared angle)" — you must say why it is equal'
            ]
          },
          {
            subtitle: 'Situation 3 — Shadow and Height Problems',
            emoji: '☀️',
            points: [
              'A person and a nearby tall object (tree, flagpole, building) cast shadows at the same time of day — the sun rays hit both at the SAME ANGLE',
              'This creates two right triangles: one formed by the person + shadow, one by the object + shadow',
              'The triangles share the same sun angle, AND both have a right angle (vertical person/object) → AA similarity',
              'Proportion: height of person / shadow of person = height of object / shadow of object',
              'Example: Person is 1.8 m tall with a 2.4 m shadow. Tree has a 8.0 m shadow. Find tree height.',
              'Set up: 1.8/2.4 = h/8.0 → h = 8.0 × 1.8/2.4 = 6.0 m',
              'DRAW THE DIAGRAM: sketch both triangles with the sun ray as the hypotenuse of each'
            ]
          },
          {
            subtitle: 'Situation 4 — Right Triangle Altitude (Altitude to Hypotenuse)',
            emoji: '📐',
            points: [
              'When the ALTITUDE (height) is drawn from the right angle to the hypotenuse of a right triangle, it creates TWO smaller triangles inside',
              'All THREE triangles (the original and the two smaller ones) are similar to each other — this is a classic result',
              'In right △ABC with altitude CD to hypotenuse AB: △ABC ~ △ACD ~ △CBD',
              'This means you can set up three different proportions to find missing sides',
              'Geometric Mean Relationships: CD² = AD × DB (altitude squared = product of two hypotenuse segments)',
              'Also: AC² = AD × AB and BC² = DB × AB',
              'This situation always appears when you see a right angle with a perpendicular drawn to the opposite side'
            ]
          },
          {
            subtitle: 'Situation 5 — Indirect Measurement (Using Mirrors)',
            emoji: '🪞',
            points: [
              'You can find the height of a tall object using a mirror placed flat on the ground',
              'Physics law: angle of incidence = angle of reflection (the light bounces off at the same angle)',
              'Setup: place mirror on ground, step back until you see the top of the object in the mirror',
              'Two right triangles are formed: your triangle (you + your distance to mirror) and the object triangle (object + its distance to mirror)',
              'Both share the same reflection angle at the mirror, and both have right angles → AA similarity',
              'Proportion: your height / your distance to mirror = object height / object\'s distance to mirror',
              'Example: You are 1.6 m tall, 2 m from the mirror, object is 10 m from mirror. Height = 1.6 × 10/2 = 8 m'
            ]
          },
          {
            subtitle: 'Worked Proof — Nested Triangle (Full Exam Answer)',
            emoji: '💡',
            points: [
              'Given: In △ABC, D is on AB and E is on AC such that DE ∥ BC. Prove △ADE ~ △ABC and find DE if AD=5, DB=3, BC=12.',
              'PROOF:',
              '∠DAE = ∠BAC (same angle — shared at vertex A)',
              '∠ADE = ∠ABC (corresponding angles, since DE ∥ BC and AB is a transversal)',
              '∴ △ADE ~ △ABC by AA similarity',
              'FINDING DE:',
              'AB = AD + DB = 5 + 3 = 8. Scale factor = AD/AB = 5/8',
              'DE/BC = 5/8 → DE = 12 × 5/8 = 7.5',
              'CONCLUSION: DE = 7.5'
            ]
          }
        ]
      },
      {
        id: 'right-triangle-trig',
        title: 'Right Triangle Trigonometry',
        notes: [
          {
            subtitle: 'Why Trig? The Connection to Similar Triangles',
            emoji: '🔗',
            points: [
              'Here is the key idea: ALL right triangles with the same acute angle are SIMILAR to each other',
              'Because they are similar, the RATIOS of their sides are always the same — no matter how big or small the triangle is',
              'sin, cos, and tan are just NAMES we give to these constant ratios',
              'sin(30°) is always 0.5 no matter what — because every right triangle with a 30° angle is similar, so the ratio opposite/hypotenuse is always the same',
              'This is why trig works: the ratios depend ONLY on the angle, not the size of the triangle'
            ]
          },
          {
            subtitle: 'Labelling Sides RELATIVE to an Angle',
            emoji: '🏷️',
            points: [
              'In a right triangle, you always label sides RELATIVE to the acute angle you are working with (call it θ)',
              'HYPOTENUSE: always the side opposite the right angle (90°) — the longest side. It does NOT change based on which angle you pick',
              'OPPOSITE: the side directly across from angle θ — it does NOT touch angle θ',
              'ADJACENT: the side right next to angle θ that is NOT the hypotenuse — it DOES touch angle θ',
              'CRITICAL: if you switch to the other acute angle, the opposite and adjacent sides SWAP — only the hypotenuse stays the same',
              'Always circle or mark the angle you are using before labelling opposite/adjacent'
            ]
          },
          {
            subtitle: 'SOH CAH TOA — The Three Ratios',
            emoji: '📐',
            points: [
              'SOH: sin(θ) = Opposite ÷ Hypotenuse',
              'CAH: cos(θ) = Adjacent ÷ Hypotenuse',
              'TOA: tan(θ) = Opposite ÷ Adjacent',
              'Memory trick: "Some Old Horses Can Always Hear Their Owners Approach"',
              'Another trick: write the letters S-O-H-C-A-H-T-O-A and think of it like a word',
              'tan(θ) = sin(θ)/cos(θ) — tangent is just sine divided by cosine. Useful to know!',
              'ALWAYS write out the ratio (e.g. sin(θ) = opp/hyp = x/10) before solving — do not skip this step!'
            ]
          },
          {
            subtitle: 'Finding a Missing SIDE',
            emoji: '📏',
            points: [
              'Step 1: Label the sides of your triangle as Hyp, Opp, Adj relative to the angle you know',
              'Step 2: Identify which two sides are involved (one you know, one you want to find)',
              'Step 3: Choose the trig ratio that connects those two sides (SOH, CAH, or TOA)',
              'Step 4: Write the equation: e.g. sin(35°) = x / 12',
              'Step 5: Solve for x: x = 12 × sin(35°) ≈ 12 × 0.574 ≈ 6.88',
              'If the unknown is on the BOTTOM: e.g. sin(35°) = 8/x → x = 8/sin(35°) ≈ 13.9',
              'Make sure your calculator is in DEGREE mode — this is a very common mistake!'
            ]
          },
          {
            subtitle: 'Finding a Missing ANGLE',
            emoji: '∠',
            points: [
              'Step 1: Label the sides. You are given two sides and want to find an angle',
              'Step 2: Identify which two sides you have and choose the correct ratio',
              'Step 3: Write the equation: e.g. tan(θ) = 5/8 = 0.625',
              'Step 4: Use INVERSE trig to solve: θ = tan⁻¹(0.625) ≈ 32°',
              'On your calculator: press [2nd] or [SHIFT] then [tan] then enter 0.625',
              'The inverse functions are written sin⁻¹, cos⁻¹, tan⁻¹ (also called arcsin, arccos, arctan)',
              'Always find the second angle using: other angle = 180° - 90° - θ'
            ]
          },
          {
            subtitle: 'Special Right Triangles — Exact Values',
            emoji: '⭐',
            points: [
              '45-45-90 triangle: sides are in ratio 1 : 1 : √2. Example: legs = 5, 5 → hypotenuse = 5√2',
              '30-60-90 triangle: sides are in ratio 1 : √3 : 2. The side opposite 30° is HALF the hypotenuse',
              'Exact values to memorize: sin(30°) = 1/2, cos(30°) = √3/2, tan(30°) = 1/√3',
              'Exact values: sin(45°) = √2/2, cos(45°) = √2/2, tan(45°) = 1',
              'Exact values: sin(60°) = √3/2, cos(60°) = 1/2, tan(60°) = √3',
              'These come up in exams — knowing them saves calculator time and gives exact answers'
            ]
          }
        ]
      },
      {
        id: 'sine-law',
        title: 'Sine Law',
        notes: [
          {
            subtitle: 'Moving Beyond Right Triangles',
            emoji: '🔓',
            points: [
              'SOH CAH TOA ONLY works in right triangles — it is useless for triangles with no 90° angle',
              'The Sine Law and Cosine Law extend trig to ANY triangle — acute, right, or obtuse',
              'Before using either law, always: (1) Draw and label the triangle, (2) Check if it is a right triangle first, (3) Identify what you know and what you need'
            ]
          },
          {
            subtitle: 'The Sine Law Formula',
            emoji: '📐',
            points: [
              'Formula: a/sin(A) = b/sin(B) = c/sin(C)',
              'This says: in any triangle, each SIDE divided by the SINE of its OPPOSITE ANGLE gives the same value',
              'You can also flip it: sin(A)/a = sin(B)/b = sin(C)/c — use this version when solving for an ANGLE',
              'Use a/sin(A) = b/sin(B) when solving for a SIDE',
              'Use sin(A)/a = sin(B)/b when solving for an ANGLE',
              'You only ever need TWO of the three fractions at a time — pick the pair that has one unknown'
            ]
          },
          {
            subtitle: 'When to Use Sine Law',
            emoji: '🎯',
            points: [
              'AAS — 2 angles and a side NOT between them: you can find the third angle first (180° rule), then apply Sine Law',
              'ASA — 2 angles and the side BETWEEN them: find third angle first, then apply Sine Law',
              'SSA — 2 sides and an angle opposite one of them: works but watch for the ambiguous case!',
              'NOT for SSS (3 sides) — use Cosine Law',
              'NOT for SAS (2 sides and included angle) — use Cosine Law',
              'Quick check: do you have a matched angle-side pair? (both angle A AND side a known?) If yes, Sine Law usually works'
            ]
          },
          {
            subtitle: 'Step-by-Step: Using Sine Law',
            emoji: '👣',
            points: [
              'Step 1: Draw and label your triangle with the standard a-b-c / A-B-C convention',
              'Step 2: Find any missing angles using ∠A + ∠B + ∠C = 180°',
              'Step 3: Pick the two ratios that share your unknown',
              'Step 4: Cross-multiply to solve',
              'Example: Triangle ABC, ∠A = 50°, ∠B = 70°, a = 10. Find b.',
              'First: ∠C = 180 - 50 - 70 = 60°',
              'Set up: a/sin(A) = b/sin(B) → 10/sin(50°) = b/sin(70°)',
              'Solve: b = 10 × sin(70°)/sin(50°) = 10 × 0.940/0.766 ≈ 12.3'
            ]
          },
          {
            subtitle: 'Ambiguous Case (SSA) — 0, 1, or 2 Triangles',
            emoji: '⚠️',
            points: [
              'The ambiguous case happens when you know SSA: 2 sides (a, b) and an angle (A) opposite one of them',
              'The problem: when you solve sin(B) = b·sin(A)/a, your calculator gives ONE answer — but there might be TWO valid triangles',
              'This is because sin(θ) = sin(180° - θ), so both an acute AND an obtuse angle have the same sine value',
              'After finding angle B with sin⁻¹, ALSO try B₂ = 180° - B. Check if A + B₂ < 180° — if so, a second valid triangle exists',
              '0 triangles: if sin(B) > 1 (impossible), no triangle exists',
              '1 triangle: if B₂ would make the angles exceed 180°, or if B = 90°',
              '2 triangles: both B and B₂ = 180° - B produce valid angle sums'
            ]
          }
        ]
      },
      {
        id: 'cosine-law',
        title: 'Cosine Law',
        notes: [
          {
            subtitle: 'The Cosine Law Formula',
            emoji: '📊',
            points: [
              'Formula to find a SIDE: c² = a² + b² - 2ab·cos(C)',
              'The angle C is the INCLUDED angle — the one sitting BETWEEN sides a and b',
              'You can write it for any side: a² = b² + c² - 2bc·cos(A) or b² = a² + c² - 2ac·cos(B)',
              'Formula to find an ANGLE (rearranged): cos(C) = (a² + b² - c²) / (2ab)',
              'CONNECTION to Pythagorean theorem: when C = 90°, cos(90°) = 0, so the -2ab·cos(C) term vanishes and you get c² = a² + b². The cosine law is the Pythagorean theorem for non-right triangles!',
              'Works for ANY triangle — acute, right, or obtuse'
            ]
          },
          {
            subtitle: 'When to Use Cosine Law',
            emoji: '🎯',
            points: [
              'SAS — 2 sides and the INCLUDED angle (angle between them): use c² = a² + b² - 2ab·cos(C) to find the third side',
              'SSS — all 3 sides known, need to find an angle: rearrange to cos(C) = (a² + b² - c²)/(2ab)',
              'These are the ONLY two cases — if you have neither SAS nor SSS, use Sine Law',
              'Common mistake: using Cosine Law when you have SSA — that is a Sine Law situation',
              'After finding one angle with Cosine Law, you can find the remaining angles with Sine Law (it is often easier)'
            ]
          },
          {
            subtitle: 'Step-by-Step: Finding a Side (SAS)',
            emoji: '📏',
            points: [
              'Example: In triangle PQR, p = 5, q = 7, ∠R = 60°. Find r.',
              'Step 1: Identify the included angle and its opposite side. ∠R is between sides p and q, so we solve for r',
              'Step 2: Write the formula: r² = p² + q² - 2pq·cos(R)',
              'Step 3: Substitute: r² = 25 + 49 - 2(5)(7)·cos(60°)',
              'Step 4: Evaluate: r² = 74 - 70 × 0.5 = 74 - 35 = 39',
              'Step 5: Take square root: r = √39 ≈ 6.24',
              'Step 6: Now use Sine Law to find the remaining angles if needed'
            ]
          },
          {
            subtitle: 'Step-by-Step: Finding an Angle (SSS)',
            emoji: '∠',
            points: [
              'Example: Triangle ABC with a = 5, b = 7, c = 8. Find angle C (the largest angle, opposite the longest side).',
              'Step 1: Rearrange the formula: cos(C) = (a² + b² - c²) / (2ab)',
              'Step 2: Substitute: cos(C) = (25 + 49 - 64) / (2 × 5 × 7) = 10/70',
              'Step 3: Simplify: cos(C) = 1/7 ≈ 0.1429',
              'Step 4: Find the angle: C = cos⁻¹(0.1429) ≈ 81.8°',
              'Step 5: Find the remaining angles using Sine Law (usually easier at this point)',
              'TIP: Always find the LARGEST angle (opposite longest side) first when using SSS — this tells you if the triangle is acute or obtuse'
            ]
          }
        ]
      },
      {
        id: 'choosing-method',
        title: 'Choosing the Right Method',
        notes: [
          {
            subtitle: 'The Complete Decision Process',
            emoji: '🌳',
            points: [
              'Step 1: Draw and label your triangle clearly before deciding anything',
              'Step 2: Is there a RIGHT ANGLE (90°)? → Yes: use SOH CAH TOA (and Pythagorean theorem for sides)',
              'Step 3: No right angle — what do you have? Count your known pieces',
              'Step 4: Do you have a matched side-angle pair (e.g. both side a AND angle A)? → Sine Law is likely the tool',
              'Step 5: Do you have SAS or SSS (no matched pair yet)? → Cosine Law',
              'Step 6: After one calculation, reassess — you may be able to switch to Sine Law for the rest'
            ]
          },
          {
            subtitle: 'Quick Reference Chart',
            emoji: '📋',
            points: [
              'Right triangle (has 90°): SOH CAH TOA + Pythagorean Theorem',
              'AAS (2 angles + non-included side): Sine Law — find third angle first with 180° rule',
              'ASA (2 angles + included side): Sine Law — find third angle first with 180° rule',
              'SSA (2 sides + non-included angle): Sine Law — watch for ambiguous case!',
              'SAS (2 sides + included angle): Cosine Law to find third side, then Sine Law',
              'SSS (3 sides): Cosine Law to find an angle, then Sine Law'
            ]
          },
          {
            subtitle: 'Common Mistakes and How to Avoid Them',
            emoji: '🚨',
            points: [
              'MISTAKE: Using SOH CAH TOA on a non-right triangle. FIX: Check for a right angle first',
              'MISTAKE: Wrong side-angle pairing in Sine Law (e.g. using a with sin(B)). FIX: Side a always pairs with ∠A — check your labels',
              'MISTAKE: Forgetting the ambiguous case in SSA problems. FIX: Always check if 180° - (your angle) also works',
              'MISTAKE: Using Cosine Law when you have AAS/ASA. FIX: If you have a matched pair, use Sine Law',
              'MISTAKE: Calculator in radians instead of degrees. FIX: Always check MODE before calculating',
              'MISTAKE: Not rounding only at the END. FIX: Keep full decimals in your calculator throughout; only round the final answer'
            ]
          }
        ]
      },
      {
        id: 'word-problems-trig',
        title: 'Trigonometry Word Problems',
        notes: [
          {
            subtitle: 'A Step-by-Step Strategy for All Word Problems',
            emoji: '🗺️',
            points: [
              'Step 1: READ the entire problem carefully before drawing anything',
              'Step 2: DRAW a diagram — even a rough sketch helps you see the triangle',
              'Step 3: LABEL all given information on your diagram (sides, angles)',
              'Step 4: IDENTIFY what you need to find and mark it with a "?"',
              'Step 5: CHOOSE your method: right triangle (SOH CAH TOA) or non-right (Sine/Cosine Law)',
              'Step 6: SOLVE, showing all steps',
              'Step 7: CHECK — does your answer make sense in context? (e.g. can a height be negative?)'
            ]
          },
          {
            subtitle: 'Angle of Elevation and Depression',
            emoji: '🏔️',
            points: [
              'ANGLE OF ELEVATION: the angle measured UPWARD from a horizontal line to a line of sight going UP to an object',
              'ANGLE OF DEPRESSION: the angle measured DOWNWARD from a horizontal line to a line of sight going DOWN to an object',
              'Both angles are always measured from the HORIZONTAL — never from the vertical',
              'KEY FACT: The angle of elevation from point A looking up to point B EQUALS the angle of depression from point B looking down to point A (they are alternate interior angles between parallel horizontal lines)',
              'In diagrams: draw your horizontal reference line first, then draw the line of sight, then mark the angle between them',
              'Example: Person 50 m from building sees top at 40° elevation. tan(40°) = height/50 → height = 50·tan(40°) ≈ 42 m'
            ]
          },
          {
            subtitle: 'Bearing Problems',
            emoji: '🧭',
            points: [
              'BEARING: a direction measured CLOCKWISE from NORTH, written as a 3-digit number. N is 000°, E is 090°, S is 180°, W is 270°',
              'Example: a bearing of 130° means 130° clockwise from North (between South-East)',
              'COMPASS NOTATION: N 40° E means start facing North, rotate 40° toward East',
              'To find the angle INSIDE the triangle from a bearing: draw the North line at each vertex, then use geometry to find the interior angle',
              'Bearing problems almost always involve non-right triangles — use Sine or Cosine Law',
              'Always re-draw the compass rose (N-S-E-W) at EACH point — the North line is always pointing straight up'
            ]
          },
          {
            subtitle: '3D and Multi-Step Problems',
            emoji: '🏗️',
            points: [
              'Some problems have triangles in 3D space or require two separate triangle calculations',
              'Strategy: break it into separate right triangles or separate non-right triangles and solve one at a time',
              'Label intermediate results clearly — write them down before moving to the next triangle',
              'Common setup: find the height of one triangle, then use that height as a side in a second triangle',
              'Example: A pole stands on a hill. Find the height of the pole by first finding the height of the hill',
              'Always check: is the triangle horizontal (flat on the ground) or vertical (standing upright)?'
            ]
          }
        ]
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
  }
];

// ─── Drawing Canvas Component ──────────────────────────────────────────────────
// DrawingCanvas handles both the persistent overlay (always visible) and the
// interactive drawing layer (only active when isActive=true).
// The canvas stays mounted so drawings never need to be re-projected as images.
function DrawingCanvas({ pageKey, isActive, onClose }) {
  const canvasRef = useRef(null);
  const NAV_H = 56;
  const PEN_COLOR = '#1e1b4b';
  const PEN_SIZE = 3;
  const ERASER_SIZE = 24;

  // eraser mode: true when user holds eraser button or stylus eraser
  const eraserRef = useRef(false);
  const isPaintingRef = useRef(false);
  const lastPosRef = useRef(null);
  const pointsRef = useRef([]);
  const historyRef = useRef([]);
  const historyIdx = useRef(-1);
  const [eraser, setEraserState] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);

  function getStorageApi() {
    const custom = typeof window !== 'undefined' ? window.storage : null;
    if (custom && typeof custom.get === 'function' && typeof custom.set === 'function' && typeof custom.delete === 'function') {
      return custom;
    }
    return {
      async get(key) {
        try { return { value: localStorage.getItem(key) }; } catch (e) { return { value: null }; }
      },
      async set(key, value) {
        try { localStorage.setItem(key, value); } catch (e) {}
      },
      async delete(key) {
        try { localStorage.removeItem(key); } catch (e) {}
      }
    };
  }

  const setEraser = (v) => { eraserRef.current = v; setEraserState(v); };

  const snapshot = useCallback(() => {
    if (!canvasRef.current) return;
    const data = canvasRef.current.toDataURL();
    historyRef.current = historyRef.current.slice(0, historyIdx.current + 1);
    historyRef.current.push(data);
    historyIdx.current = historyRef.current.length - 1;
  }, []);

  const saveToStorage = useCallback(async () => {
    if (!canvasRef.current) return;
    const data = canvasRef.current.toDataURL('image/png', 0.85);
    try { await getStorageApi().set(`drawing:v2:${pageKey}`, data); } catch(e) {}
  }, [pageKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = window.innerWidth;
    const H = document.documentElement.scrollHeight - NAV_H;
    canvas.width = W;
    canvas.height = H;
    historyRef.current = [];
    historyIdx.current = -1;
    isPaintingRef.current = false;
    lastPosRef.current = null;
    setHasDrawing(false);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    getStorageApi().get(`drawing:v2:${pageKey}`).then(result => {
      if (result?.value) {
        const img = new Image();
        img.onload = () => { ctx.drawImage(img, 0, 0, W, H); setHasDrawing(true); snapshot(); };
        img.src = result.value;
      } else { snapshot(); }
    }).catch(() => snapshot());
  }, [pageKey, snapshot]);

  const getPos = (e) => {
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX, y: src.clientY - NAV_H + window.scrollY };
  };

  // Detect stylus eraser via pointerType + buttons bitmask (button=32 on most styluses)
  const isEraserInput = (e) => eraserRef.current || (e.pointerType === 'pen' && e.buttons === 32);

  const startDraw = useCallback((e) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const pos = getPos(e);
    lastPosRef.current = pos;
    pointsRef.current = [pos];
    isPaintingRef.current = true;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (isEraserInput(e)) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.arc(pos.x, pos.y, ERASER_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,1)'; ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath(); ctx.arc(pos.x, pos.y, PEN_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = PEN_COLOR; ctx.fill();
    }
  }, []);

  const draw = useCallback((e) => {
    if (!isPaintingRef.current || !canvasRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    pointsRef.current.push(pos);
    const pts = pointsRef.current;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (isEraserInput(e)) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)'; ctx.lineWidth = ERASER_SIZE;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = PEN_COLOR; ctx.lineWidth = PEN_SIZE;
    }
    if (pts.length < 3) {
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(pos.x, pos.y); ctx.stroke();
    } else {
      const p1 = pts[pts.length-3], p2 = pts[pts.length-2], p3 = pts[pts.length-1];
      ctx.beginPath();
      ctx.moveTo((p1.x+p2.x)/2, (p1.y+p2.y)/2);
      ctx.quadraticCurveTo(p2.x, p2.y, (p2.x+p3.x)/2, (p2.y+p3.y)/2);
      ctx.stroke();
    }
    lastPosRef.current = pos;
    if (pts.length > 3) pointsRef.current = pts.slice(-3);
    setHasDrawing(true);
  }, []);

  const endDraw = useCallback(() => {
    if (!isPaintingRef.current) return;
    isPaintingRef.current = false;
    snapshot(); saveToStorage();
  }, [snapshot, saveToStorage]);

  const undo = useCallback(() => {
    if (historyIdx.current <= 0 || !canvasRef.current) return;
    historyIdx.current--;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0); saveToStorage(); };
    img.src = historyRef.current[historyIdx.current];
    if (historyIdx.current === 0) setHasDrawing(false);
  }, [saveToStorage]);

  const clearCanvas = useCallback(async () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false); historyRef.current = []; historyIdx.current = -1; snapshot();
    try { await getStorageApi().delete(`drawing:v2:${pageKey}`); } catch(e) {}
  }, [pageKey, snapshot]);

  const canvasH = Math.max(document.documentElement.scrollHeight - NAV_H, window.innerHeight - NAV_H);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position:'absolute', top: NAV_H + 'px', left:0,
          width: window.innerWidth + 'px', height: canvasH + 'px',
          pointerEvents: isActive ? 'all' : 'none',
          cursor: isActive ? (eraser ? 'cell' : 'crosshair') : 'default',
          touchAction:'none', zIndex:28,
          opacity: isActive ? 1 : 0.75,
        }}
        onMouseDown={isActive ? startDraw : undefined}
        onMouseMove={isActive ? draw : undefined}
        onMouseUp={isActive ? endDraw : undefined}
        onMouseLeave={isActive ? endDraw : undefined}
        onTouchStart={isActive ? startDraw : undefined}
        onTouchMove={isActive ? draw : undefined}
        onTouchEnd={isActive ? endDraw : undefined}
        onPointerDown={isActive ? startDraw : undefined}
        onPointerMove={isActive ? draw : undefined}
        onPointerUp={isActive ? endDraw : undefined}
      />

      {isActive && (
        <div style={{position:'fixed', inset:0, top: NAV_H, zIndex:50, pointerEvents:'none'}}>
          {/* Minimal toolbar */}
          <div style={{position:'absolute', left:'50%', bottom:24, transform:'translateX(-50%)', pointerEvents:'auto'}}>
            <div style={{display:'flex', alignItems:'center', gap:6, padding:'8px 12px', borderRadius:20, background:'rgba(255,255,255,0.97)', border:'1.5px solid rgba(99,102,241,0.15)', backdropFilter:'blur(20px)', boxShadow:'0 8px 32px rgba(0,0,0,0.12)'}}>

              {/* Pen */}
              <button onClick={() => setEraser(false)} title="Pen"
                style={{width:38, height:38, borderRadius:10, border:'none', cursor:'pointer', transition:'all 0.15s', display:'flex', alignItems:'center', justifyContent:'center',
                  background: !eraser ? 'rgba(99,102,241,0.12)' : 'transparent',
                  outline: !eraser ? '1.5px solid rgba(99,102,241,0.4)' : '1.5px solid transparent'}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: !eraser ? '#6366f1' : '#64748b'}}>
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                </svg>
              </button>

              {/* Eraser */}
              <button onClick={() => setEraser(true)} title="Eraser"
                style={{width:38, height:38, borderRadius:10, border:'none', cursor:'pointer', transition:'all 0.15s', display:'flex', alignItems:'center', justifyContent:'center',
                  background: eraser ? 'rgba(99,102,241,0.12)' : 'transparent',
                  outline: eraser ? '1.5px solid rgba(99,102,241,0.4)' : '1.5px solid transparent'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: eraser ? '#6366f1' : '#64748b'}}>
                  <path d="M20 20H7L3 16l10-10 7 7-2.5 2.5"/>
                  <path d="M6.0001 10.0001 13 17"/>
                </svg>
              </button>

              <div style={{width:1, height:24, background:'rgba(0,0,0,0.09)'}} />

              {/* Undo */}
              <button onClick={undo} title="Undo"
                style={{width:38, height:38, borderRadius:10, fontSize:18, border:'none', background:'transparent', cursor:'pointer', color:'#64748b'}}>
                ↩
              </button>

              {/* Clear */}
              {hasDrawing && (
                <button onClick={clearCanvas} title="Clear all"
                  style={{width:38, height:38, borderRadius:10, border:'none', background:'transparent', cursor:'pointer', color:'#ef4444', display:'flex', alignItems:'center', justifyContent:'center'}}>
                  <Trash2 size={16} />
                </button>
              )}

              <div style={{width:1, height:24, background:'rgba(0,0,0,0.09)'}} />

              {/* Close */}
              <button onClick={onClose} title="Exit drawing mode"
                style={{width:38, height:38, borderRadius:10, border:'1.5px solid rgba(99,102,241,0.25)', background:'rgba(99,102,241,0.1)', cursor:'pointer', color:'#6366f1', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Mode badge */}
          <div style={{position:'absolute', top:16, left:'50%', transform:'translateX(-50%)', pointerEvents:'none'}}>
            <div style={{display:'flex', alignItems:'center', gap:8, padding:'5px 12px', borderRadius:999, background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.25)', color:'#6366f1', fontSize:11, fontWeight:700}}>
              <div style={{width:5, height:5, borderRadius:'50%', background:'#6366f1'}} className="pulse-ring" />
              {eraser ? 'Eraser' : 'Drawing'} mode
            </div>
          </div>
        </div>
      )}
    </>
  );
}


export default function MathStudyLibrary() {
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
  const [revealedAnswers, setRevealedAnswers] = useState(new Set());
  
  // Flashcard state
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardStats, setFlashcardStats] = useState({ known: 0, learning: 0 });
  
  // Achievement tracking
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set());
  const [newAchievement, setNewAchievement] = useState(null);
  const [stats, setStats] = useState({
    sectionsCompleted: 0,
    totalSections: 0,
    quizCorrect: 0,
    quizzesCompleted: 0,
    perfectQuizzes: 0,
    worksheetAnswersRevealed: 0,
    searchesPerformed: 0
  });

  // Drawing state
  const [drawingActive, setDrawingActive] = useState(false);
  const drawingPageKey = selectedSection ? `section-${selectedSection.id}` :
                         selectedSubject ? `subject-${selectedSubject.id}` :
                         currentQuiz ? `quiz-${currentQuiz.id}` : 'home';

  useEffect(() => {
    const total = Object.values(studyLibrary).reduce((sum, subject) => sum + subject.sections.length, 0);
    setStats(prev => ({ ...prev, totalSections: total }));
  }, []);

  useEffect(() => {
    achievements.forEach(achievement => {
      if (!unlockedAchievements.has(achievement.id) && achievement.requirement(stats)) {
        setUnlockedAchievements(prev => new Set([...prev, achievement.id]));
        setNewAchievement(achievement);
        setTimeout(() => setNewAchievement(null), 5000);
      }
    });
  }, [stats, unlockedAchievements]);

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
  };

  const handleAnswerSelect = (answerIndex) => {
    if (!showExplanation) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleCheckAnswer = () => {
    const isCorrect = selectedAnswer === currentQuiz.quiz[currentQuestion].correct;
    setShowExplanation(true);
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
    } else {
      const isPerfect = quizScore.correct + 1 === currentQuiz.quiz.length;
      setStats(prev => ({ 
        ...prev, 
        quizzesCompleted: prev.quizzesCompleted + 1,
        perfectQuizzes: isPerfect ? prev.perfectQuizzes + 1 : prev.perfectQuizzes
      }));
      setCurrentQuiz(null);
      setSelectedSection(null);
    }
  };

  const handleFlashcardKnown = () => {
    setFlashcardStats(prev => ({ ...prev, known: prev.known + 1 }));
    handleNextFlashcard();
  };

  const handleFlashcardLearning = () => {
    setFlashcardStats(prev => ({ ...prev, learning: prev.learning + 1 }));
    handleNextFlashcard();
  };

  const handleNextFlashcard = () => {
    if (currentFlashcard < selectedSection.flashcards.length - 1) {
      setCurrentFlashcard(currentFlashcard + 1);
      setIsFlipped(false);
    } else {
      setCurrentFlashcard(0);
      setIsFlipped(false);
      setSelectedSection(null);
    }
  };

  const handlePreviousFlashcard = () => {
    if (currentFlashcard > 0) {
      setCurrentFlashcard(currentFlashcard - 1);
      setIsFlipped(false);
    }
  };

  // Achievement notification popup
  const AchievementPopup = ({ achievement }) => {
    if (!achievement) return null;
    const AchIcon = achievement.icon;
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white border border-amber-300/60 rounded-2xl shadow-2xl shadow-amber-500/10 p-4 max-w-xs flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${achievement.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <AchIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-amber-600 text-xs font-bold uppercase tracking-wider mb-0.5">Achievement Unlocked</p>
            <p className="font-bold text-sm" style={{color:'var(--text)'}}>{achievement.name}</p>
            <p className="text-xs" style={{color:'var(--muted)'}}>{achievement.description}</p>
          </div>
        </div>
      </div>
    );
  };

  // Flashcard interface
  if (selectedSection && selectedSection.flashcards && selectedSection.flashcards.length > 0) {
    const flashcard = selectedSection.flashcards[currentFlashcard];
    const progress = ((currentFlashcard + 1) / selectedSection.flashcards.length) * 100;

    return (
      <div className="min-h-screen dot-grid flex flex-col" style={{background:'var(--bg)'}}>
        <InjectStyles />
        {/* Nav */}
        <div className="glass sticky top-0 z-40 px-5 h-14 flex items-center justify-between" style={{borderBottom:'1px solid var(--border)'}}>
          <button onClick={() => { setSelectedSection(null); setCurrentFlashcard(0); setIsFlipped(false); setFlashcardStats({ known: 0, learning: 0 }); }}
            className="flex items-center gap-2 text-sm syne font-semibold transition-colors" style={{color:'var(--muted)'}}
            onMouseOver={e=>e.currentTarget.style.color='var(--text)'} onMouseOut={e=>e.currentTarget.style.color='var(--muted)'}>
            <ArrowLeft className="w-4 h-4" /> Exit
          </button>
          <div className="flex items-center gap-4">
            <span className="syne text-xs font-bold" style={{color:'rgba(52,211,153,0.9)'}}>✓ {flashcardStats.known}</span>
            <span className="syne text-xs font-bold" style={{color:'rgba(251,191,36,0.9)'}}>↻ {flashcardStats.learning}</span>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 flex flex-col">
          {/* Progress */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex-1 flex gap-1">
              {selectedSection.flashcards.map((_, i) => (
                <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{background:'rgba(99,102,241,0.1)'}}>
                  {i < currentFlashcard && <div className="h-full w-full rounded-full bg-emerald-500" />}
                  {i === currentFlashcard && <div className={`h-full rounded-full bg-gradient-to-r ${selectedSubject.gradient} shimmer`} style={{width:'100%'}} />}
                </div>
              ))}
            </div>
            <span className="mono text-xs flex-shrink-0" style={{color:'var(--dim)'}}>{currentFlashcard+1}/{selectedSection.flashcards.length}</span>
          </div>

          <h2 className="syne font-bold text-base mb-5" style={{color:'var(--text)'}}>{selectedSection.title}</h2>

          {/* Card */}
          <div className="flip-card flex-1 cursor-pointer mb-6 min-h-56" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`flip-inner relative w-full h-full ${isFlipped ? 'flipped' : ''}`} style={{minHeight:'220px'}}>
              <div className={`flip-front absolute inset-0 bg-gradient-to-br ${selectedSubject.gradient} rounded-3xl flex items-center justify-center p-8 shadow-2xl`}>
                <div className="absolute inset-0 opacity-20 rounded-3xl" style={{backgroundImage:'radial-gradient(circle at 70% 30%, white, transparent 65%)'}} />
                <div className="text-center relative">
                  <p className="syne font-black text-white/50 text-xs uppercase tracking-widest mb-4">Question</p>
                  <h3 className="syne font-black text-white leading-snug" style={{fontSize:'clamp(1.1rem,3vw,1.5rem)',letterSpacing:'-0.02em'}}>{flashcard.front}</h3>
                  <p className="text-white/40 mt-6 text-xs mono">tap to reveal</p>
                </div>
              </div>
              <div className="flip-back absolute inset-0 glass rounded-3xl flex items-center justify-center p-8" style={{borderColor:'var(--border-2)'}}>
                <div className="text-center">
                  <p className="syne font-black text-xs uppercase tracking-widest mb-4" style={{color:'var(--dim)'}}>Answer</p>
                  <h3 className="syne font-bold leading-relaxed whitespace-pre-line" style={{fontSize:'clamp(1rem,2.5vw,1.25rem)',color:'var(--text)'}}>{flashcard.back}</h3>
                  <p className="text-xs mono mt-6" style={{color:'var(--dim)'}}>tap to flip back</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-3">
            <button onClick={handlePreviousFlashcard} disabled={currentFlashcard === 0}
              className="px-5 py-2.5 rounded-xl text-sm syne font-bold transition-all disabled:opacity-20"
              style={{background:'var(--surface)',border:'1px solid var(--border)',color:'var(--muted)'}}>
              ← Prev
            </button>
            {isFlipped && (
              <div className="flex gap-2 flex-1">
                <button onClick={handleFlashcardLearning} className="flex-1 py-2.5 rounded-xl text-sm syne font-black transition-all hover:opacity-90"
                  style={{background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.25)',color:'rgb(251,191,36)'}}>
                  Still Learning
                </button>
                <button onClick={handleFlashcardKnown} className="flex-1 py-2.5 rounded-xl text-sm syne font-black transition-all hover:opacity-90"
                  style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.25)',color:'rgb(52,211,153)'}}>
                  Got It ✓
                </button>
              </div>
            )}
            <button onClick={handleNextFlashcard} disabled={currentFlashcard === selectedSection.flashcards.length - 1}
              className="px-5 py-2.5 rounded-xl text-sm syne font-bold transition-all disabled:opacity-20"
              style={{background:'var(--surface)',border:'1px solid var(--border)',color:'var(--muted)'}}>
              Next →
            </button>
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
    const labels = ['A', 'B', 'C', 'D'];

    return (
      <div style={{position:'relative'}}>
      <div className="min-h-screen dot-grid" style={{background:'var(--bg)'}}>
        <InjectStyles />
        {/* Nav */}
        <div className="glass px-5 h-14 flex items-center justify-between sticky top-0 z-40" style={{borderBottom:'1px solid var(--border)'}}>
          <button onClick={() => { setCurrentQuiz(null); setSelectedSection(null); }}
            className="flex items-center gap-2 text-sm syne font-semibold" style={{color:'var(--muted)'}}>
            <ArrowLeft className="w-4 h-4" /> Exit Quiz
          </button>
          <div className="flex items-center gap-3">
            <span className="mono text-xs" style={{color:'var(--dim)'}}>{currentQuestion + 1} / {currentQuiz.quiz.length}</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)'}}>
              <span className="text-emerald-600 font-bold mono text-sm">{quizScore.correct}</span>
              <span style={{color:'var(--dim)'}} className="text-xs">correct</span>
            </div>
            <button onClick={() => setDrawingActive(d => !d)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs syne font-bold transition-all"
              style={drawingActive
                ? {background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.4)', color:'#6366f1'}
                : {background:'var(--surface)', border:'1px solid var(--border)', color:'var(--muted)'}}>
              <Pencil className="w-3.5 h-3.5" /> Draw
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Progress track */}
          <div className="flex gap-1 mb-8">
            {currentQuiz.quiz.map((_, i) => (
              <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{background:'rgba(99,102,241,0.1)'}}>
                {i < currentQuestion && <div className="h-full w-full bg-emerald-500 rounded-full" />}
                {i === currentQuestion && <div className={`h-full rounded-full shimmer bg-gradient-to-r ${selectedSubject.gradient}`} style={{width:`${progress}%`}} />}
              </div>
            ))}
          </div>

          {/* Question card */}
          <div className="glass rounded-3xl p-7 mb-5 anim-up">
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${selectedSubject.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <span className="syne font-black text-white text-sm">{currentQuestion + 1}</span>
              </div>
              <h3 className="syne font-bold text-lg leading-snug" style={{color:'var(--text)', letterSpacing:'-0.01em'}}>{question.question}</h3>
            </div>

            <div className="space-y-2.5">
              {question.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrectOpt = idx === question.correct;
                let bg = 'rgba(15,23,42,0.03)';
                let border = 'rgba(15,23,42,0.1)';
                let textCol = 'var(--muted)';
                let labelBg = 'rgba(15,23,42,0.06)';
                let labelCol = 'var(--dim)';

                if (!showExplanation && isSelected) {
                  bg = 'rgba(99,102,241,0.08)'; border = 'rgba(99,102,241,0.4)';
                  textCol = '#4338ca'; labelBg = 'rgba(99,102,241,0.15)'; labelCol = '#4f46e5';
                } else if (showExplanation && isCorrectOpt) {
                  bg = 'rgba(16,185,129,0.07)'; border = 'rgba(16,185,129,0.4)';
                  textCol = '#065f46'; labelBg = 'rgba(16,185,129,0.15)'; labelCol = '#059669';
                } else if (showExplanation && isSelected && !isCorrectOpt) {
                  bg = 'rgba(239,68,68,0.07)'; border = 'rgba(239,68,68,0.4)';
                  textCol = '#991b1b'; labelBg = 'rgba(239,68,68,0.15)'; labelCol = '#dc2626';
                }

                return (
                  <button key={idx} onClick={() => handleAnswerSelect(idx)} disabled={showExplanation}
                    className="w-full text-left rounded-2xl px-4 py-3.5 transition-all duration-200 flex items-center gap-3.5"
                    style={{background: bg, border: `1px solid ${border}`, cursor: showExplanation ? 'default' : 'pointer'}}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mono text-xs font-bold transition-all"
                      style={{background: labelBg, color: labelCol}}>{labels[idx]}</div>
                    <span className="text-sm font-medium transition-colors" style={{color: textCol}}>{option}</span>
                    {showExplanation && isCorrectOpt && <CheckCircle className="w-4 h-4 text-emerald-600 ml-auto flex-shrink-0" />}
                    {showExplanation && isSelected && !isCorrectOpt && <X className="w-4 h-4 text-red-400 ml-auto flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="rounded-2xl p-5 mb-5 anim-up flex items-start gap-3.5"
              style={{background: isCorrect ? 'rgba(16,185,129,0.07)' : 'rgba(99,102,241,0.07)', border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.25)' : 'rgba(99,102,241,0.25)'}`}}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-emerald-500/20' : 'bg-indigo-500/20'}`}>
                <Lightbulb className={`w-4 h-4 ${isCorrect ? 'text-emerald-600' : 'text-indigo-500'}`} />
              </div>
              <div>
                <p className={`syne font-bold text-sm mb-1 ${isCorrect ? 'text-emerald-700' : 'text-indigo-600'}`}>
                  {isCorrect ? '✓ Correct!' : 'Here\'s why:'}
                </p>
                <p className="text-sm leading-relaxed" style={{color:'var(--muted)'}}>{question.explanation}</p>
              </div>
            </div>
          )}

          {/* Action button */}
          {!showExplanation ? (
            <button onClick={handleCheckAnswer} disabled={selectedAnswer === null}
              className={`w-full py-3.5 rounded-2xl syne font-bold text-sm text-white bg-gradient-to-r ${selectedSubject.gradient} disabled:opacity-30 transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg`}>
              Check Answer
            </button>
          ) : (
            <button onClick={handleNextQuestion}
              className={`w-full py-3.5 rounded-2xl syne font-bold text-sm text-white bg-gradient-to-r ${selectedSubject.gradient} transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg`}>
              {currentQuestion < currentQuiz.quiz.length - 1 ? 'Next Question →' : 'Finish Quiz ✓'}
            </button>
          )}
        </div>
      </div>
      <DrawingCanvas pageKey={drawingPageKey} isActive={drawingActive} onClose={() => setDrawingActive(false)} />
      </div>
    );
  }

  // Section view
  if (selectedSection && selectedSubject) {
    const section = selectedSection;
    const isRead = readSections.has(section.id);
    const hasQuiz = section.quiz && section.quiz.length > 0;
    const isWorksheet = selectedSubject.id === 'worksheets';

    if (hasQuiz && !currentQuiz) {
      return (
        <div className="min-h-screen dot-grid flex items-center justify-center p-4" style={{background:'var(--bg)'}}>
          <InjectStyles />
          <div className="max-w-lg w-full text-center anim-up">
            <button onClick={() => setSelectedSection(null)} className="flex items-center gap-2 text-sm syne font-semibold mb-10 mx-auto transition-colors" style={{color:'var(--muted)'}}
              onMouseOver={e=>e.currentTarget.style.color='var(--text)'} onMouseOut={e=>e.currentTarget.style.color='var(--muted)'}>
              <ArrowLeft className="w-4 h-4" /> {selectedSubject.name}
            </button>
            <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${selectedSubject.gradient} flex items-center justify-center shadow-2xl`}>
              <FileText className="w-9 h-9 text-white" />
            </div>
            <h2 className="syne font-black mb-3" style={{fontSize:'2rem', letterSpacing:'-0.03em', color:'var(--text)'}}>Ready to practice?</h2>
            <p className="text-base mb-8 leading-relaxed" style={{color:'var(--muted)'}}>
              {section.quiz.length} questions with detailed explanations.
            </p>
            <button onClick={() => startQuiz(section)}
              className={`w-full py-4 bg-gradient-to-r ${selectedSubject.gradient} text-white rounded-2xl syne font-black text-sm hover:opacity-90 transition-all shadow-lg hover:-translate-y-0.5`}>
              Start Quiz →
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{position:'relative'}}>
      <div className="min-h-screen dot-grid" style={{background:'var(--bg)'}}>
        <InjectStyles />
        {/* Nav */}
        <div className="glass sticky top-0 z-40" style={{borderBottom:'1px solid var(--border)'}}>
          <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedSection(null)} className="flex items-center gap-2 text-sm syne font-semibold transition-colors" style={{color:'var(--muted)'}}
                onMouseOver={e=>e.currentTarget.style.color='var(--text)'} onMouseOut={e=>e.currentTarget.style.color='var(--muted)'}>
                <ArrowLeft className="w-4 h-4" /> {selectedSubject.name}
              </button>
              <span style={{color:'var(--dim)'}}>›</span>
              <span className="syne text-sm font-semibold truncate max-w-48" style={{color:'var(--dim)'}}>{section.title}</span>
            </div>
            <button onClick={() => toggleRead(section.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs syne font-bold transition-all"
              style={isRead
                ? {background:'rgba(16,185,129,0.10)',border:'1px solid rgba(16,185,129,0.3)',color:'#059669'}
                : {background:'var(--surface)',border:'1px solid var(--border)',color:'var(--muted)'}}>
              {isRead ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
              {isRead ? 'Completed' : 'Mark complete'}
            </button>
            <button onClick={() => setDrawingActive(d => !d)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs syne font-bold transition-all"
              style={drawingActive
                ? {background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.4)', color:'#6366f1'}
                : {background:'var(--surface)', border:'1px solid var(--border)', color:'var(--muted)'}}>
              <Pencil className="w-3.5 h-3.5" /> Draw
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">

          {/* Section hero */}
          <div className="mb-10 anim-up">
            <div className={`rounded-3xl p-8 relative overflow-hidden`} style={{background:`linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.06) 100%)`, border:'1.5px solid rgba(99,102,241,0.13)'}}>
              <div className="absolute top-0 right-0 text-8xl leading-none select-none pointer-events-none" style={{opacity:0.07, transform:'translate(10%, -15%)'}}>
                {section.notes?.[0]?.emoji || '📚'}
              </div>
              <div className="relative">
                <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4 text-xs font-bold syne uppercase tracking-wider`}
                  style={{background:'rgba(99,102,241,0.1)', color:'#6366f1', border:'1px solid rgba(99,102,241,0.2)'}}>
                  {selectedSubject.name}
                </div>
                <h1 className="syne font-black mb-2 leading-tight" style={{fontSize:'clamp(1.6rem,4vw,2.2rem)', letterSpacing:'-0.03em', color:'var(--text)'}}>{section.title}</h1>
                <p className="text-sm" style={{color:'var(--muted)'}}>
                  {section.notes?.length || 0} topics · {section.notes?.reduce((s,n)=>s+(n.points?.length||0),0) || 0} key points
                </p>
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="space-y-8">
            {section.notes && section.notes.map((note, idx) => {
              const diagramKey = `${section.id}-${idx}`;
              const diagram = NOTE_DIAGRAMS[diagramKey];
              const allPoints = note.points || [];
              const stepPoints = allPoints.filter(p => /^\d+\./.test(p));
              const isStepByStep = stepPoints.length >= 3;

              return (
                <div key={idx} className={`anim-up anim-up-${Math.min(idx+1,4)}`}>
                  {/* Topic header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${selectedSubject.gradient} flex items-center justify-center text-lg shadow-md flex-shrink-0`}>
                      {note.emoji}
                    </div>
                    <div>
                      <h2 className="syne font-black text-lg leading-tight" style={{color:'var(--text)', letterSpacing:'-0.02em'}}>{note.subtitle}</h2>
                      <p className="text-xs mt-0.5" style={{color:'var(--dim)'}}>{allPoints.length} key points</p>
                    </div>
                  </div>

                  {/* Step-by-step layout */}
                  {isStepByStep ? (
                    <div className="space-y-2 pl-1">
                      {allPoints.map((point, pointIdx) => {
                        const stepMatch = point.match(/^(\d+)\.\s*(.*)/s);
                        if (!stepMatch) return null;
                        const [, num, text] = stepMatch;
                        const colonIdx = text.indexOf(':');
                        const hasLabel = colonIdx > 0 && colonIdx < 40;
                        const label = hasLabel ? text.slice(0, colonIdx) : null;
                        const body = hasLabel ? text.slice(colonIdx + 1).trim() : text;
                        return (
                          <div key={pointIdx} className="flex gap-4 rounded-2xl p-4 transition-all"
                            style={{background:'white', border:'1.5px solid rgba(0,0,0,0.06)', boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br ${selectedSubject.gradient} flex items-center justify-center text-white text-sm font-black mono shadow`}>
                              {num}
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                              {label && <p className="text-sm font-black mb-0.5" style={{color:'var(--text)'}}>{label}</p>}
                              <p className="text-sm leading-relaxed" style={{color: label ? 'var(--muted)' : 'var(--text)', opacity: label ? 1 : 0.88}}>{body}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Key point cards */
                    <div className="space-y-2 pl-1">
                      {allPoints.map((point, pointIdx) => {
                        const colonIdx = point.indexOf(':');
                        const hasKeyTerm = /^([A-Z][A-Za-z\s/()²³]+):/.test(point) && colonIdx > 0 && colonIdx < 50;
                        const keyTerm = hasKeyTerm ? point.slice(0, colonIdx) : null;
                        const body = hasKeyTerm ? point.slice(colonIdx + 1).trim() : point;

                        // Detect formula-like content (has =, +, -, ×, /, ^, or ²)
                        const hasFormula = /[=+\-×/^²³()]/.test(body) && body.length < 80;

                        return (
                          <div key={pointIdx}>
                            <div className="rounded-2xl p-4 transition-all"
                              style={{background:'white', border:'1.5px solid rgba(0,0,0,0.06)', boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                              <div className="flex items-start gap-3">
                                <span className={`flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-gradient-to-br ${selectedSubject.gradient}`} />
                                <div className="flex-1 min-w-0">
                                  {keyTerm ? (
                                    <>
                                      <p className="text-sm font-black mb-1" style={{color:'var(--text)'}}>{keyTerm}</p>
                                      {hasFormula ? (
                                        <p className="mono text-sm px-3 py-1.5 rounded-lg inline-block font-semibold" style={{background:'rgba(99,102,241,0.07)', color:'#4338ca', border:'1px solid rgba(99,102,241,0.12)'}}>{body}</p>
                                      ) : (
                                        <p className="text-sm leading-relaxed" style={{color:'var(--muted)'}}>{body}</p>
                                      )}
                                    </>
                                  ) : hasFormula ? (
                                    <p className="mono text-sm font-semibold" style={{color:'#4338ca'}}>{body}</p>
                                  ) : (
                                    <p className="text-sm leading-relaxed" style={{color:'var(--text)', opacity:0.88}}>{point}</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {isWorksheet && note.answers && note.answers[pointIdx] && (
                              <div className="mt-1.5 ml-4">
                                <button onClick={() => toggleAnswer(idx, pointIdx)}
                                  className="text-xs syne font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all"
                                  style={{background: revealedAnswers.has(`${idx}-${pointIdx}`) ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.06)', color:'#059669', border:'1px solid rgba(16,185,129,0.2)'}}>
                                  {revealedAnswers.has(`${idx}-${pointIdx}`) ? '▾ Hide answer' : '▸ Show answer'}
                                </button>
                                {revealedAnswers.has(`${idx}-${pointIdx}`) && (
                                  <div className="mt-2 px-4 py-3 rounded-2xl" style={{background:'rgba(16,185,129,0.06)', border:'1.5px solid rgba(16,185,129,0.2)'}}>
                                    <p className="text-sm mono font-semibold" style={{color:'rgba(6,78,59,0.9)'}}>{note.answers[pointIdx]}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {diagram && (
                    <div className="mt-4 rounded-2xl overflow-hidden" style={{border:'1.5px solid rgba(0,0,0,0.06)'}}>
                      {diagram}
                    </div>
                  )}

                  {/* Divider between topics (not after last) */}
                  {idx < (section.notes.length - 1) && (
                    <div className="mt-8 flex items-center gap-3">
                      <div className="flex-1 h-px" style={{background:'var(--border)'}} />
                      <span className="text-xs" style={{color:'var(--dim)'}}>Topic {idx + 2}</span>
                      <div className="flex-1 h-px" style={{background:'var(--border)'}} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom tip */}
          {section.notes?.length > 0 && (
            <div className="mt-10 rounded-2xl p-5 flex gap-3" style={{background:'rgba(245,158,11,0.06)', border:'1.5px solid rgba(245,158,11,0.18)'}}>
              <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
              <div>
                <p className="text-sm font-bold mb-0.5" style={{color:'#92400e'}}>Study tip</p>
                <p className="text-sm leading-relaxed" style={{color:'rgba(120,53,15,0.8)'}}>
                  Cover the details and try to recall each point from memory — active recall beats re-reading every time.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <DrawingCanvas pageKey={drawingPageKey} isActive={drawingActive} onClose={() => setDrawingActive(false)} />
      </div>
    );
  }

  // Subject view
  if (selectedSubject) {
    const subject = selectedSubject;
    const completedCount = subject.sections.filter(s => readSections.has(s.id)).length;
    const progress = (completedCount / subject.sections.length) * 100;
    const SubjectIcon = subject.icon;

    return (
      <div style={{position:'relative'}}>
      <div className="min-h-screen dot-grid" style={{background:'var(--bg)'}}>
        <InjectStyles />
        {/* Nav */}
        <div className="glass sticky top-0 z-40" style={{borderBottom:'1px solid var(--border)'}}>
          <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center gap-3">
            <button onClick={() => setSelectedSubject(null)} className="flex items-center gap-2 text-sm syne font-semibold transition-colors" style={{color:'var(--muted)'}}
              onMouseOver={e=>e.currentTarget.style.color='var(--text)'} onMouseOut={e=>e.currentTarget.style.color='var(--muted)'}>
              <ArrowLeft className="w-4 h-4" /> Library
            </button>
            <span style={{color:'var(--dim)'}}>›</span>
            <span className="syne font-semibold text-sm" style={{color:'var(--muted)'}}>{subject.name}</span>
            <div className="flex-1" />
            <button onClick={() => setDrawingActive(d => !d)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs syne font-bold transition-all"
              style={drawingActive
                ? {background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.4)', color:'#6366f1'}
                : {background:'var(--surface)', border:'1px solid var(--border)', color:'var(--muted)'}}>
              <Pencil className="w-3.5 h-3.5" /> Draw
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
          {/* Subject header */}
          <div className={`relative bg-gradient-to-br ${subject.gradient} rounded-3xl p-8 mb-10 overflow-hidden anim-up`}>
            <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 85% 50%, white 0%, transparent 55%)'}} />
            <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
            <div className="relative flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4 shadow-xl">
                  <SubjectIcon className="w-7 h-7 text-white" />
                </div>
                <h1 className="syne font-black text-white mb-2" style={{fontSize:'clamp(1.6rem,4vw,2.2rem)', letterSpacing:'-0.03em'}}>{subject.name}</h1>
                <p className="text-white/70 text-sm max-w-sm leading-relaxed">{subject.description}</p>
              </div>
              <div className="text-right">
                <p className="syne font-black text-white" style={{fontSize:'3rem', letterSpacing:'-0.04em', lineHeight:1}}>{Math.round(progress)}<span className="text-2xl">%</span></p>
                <p className="text-white/60 text-xs mt-1">{completedCount} of {subject.sections.length} done</p>
              </div>
            </div>
            <div className="relative mt-6">
              <div className="h-2 rounded-full overflow-hidden" style={{background:'rgba(0,0,0,0.2)'}}>
                <div className="h-full bg-white/60 rounded-full shimmer transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          {/* Section cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {subject.sections.map((section, i) => {
              const isRead = readSections.has(section.id);
              return (
                <div key={section.id} onClick={() => setSelectedSection(section)}
                  className={`glass glass-hover card-shadow card-shadow-hover rounded-2xl p-6 cursor-pointer group transition-all duration-200 anim-up anim-up-${(i%4)+1}`}
                  style={isRead ? {borderColor:'rgba(16,185,129,0.3)',background:'rgba(16,185,129,0.04)'} : {}}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="mono text-xs" style={{color:'var(--dim)'}}>{String(i+1).padStart(2,'0')}</span>
                        {isRead && <span className="flex items-center gap-1 text-xs font-semibold syne" style={{color:'#34d399'}}><CheckCircle className="w-3 h-3" /> Done</span>}
                      </div>
                      <h3 className="syne font-bold text-base leading-snug" style={{color:'var(--text)'}}>{section.title}</h3>
                      <p className="text-xs mt-2" style={{color:'var(--dim)'}}>
                        {section.notes?.length > 0 ? `${section.notes.length} topics` :
                         section.quiz?.length > 0 ? `${section.quiz.length} questions` :
                         section.flashcards ? `${section.flashcards.length} cards` : 'View'}
                      </p>
                    </div>
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110 shadow-md`}>
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <DrawingCanvas pageKey={drawingPageKey} isActive={drawingActive} onClose={() => setDrawingActive(false)} />
      </div>
    );
  }
  if (showIntro) {
    return (
      <div className="min-h-screen dot-grid flex items-center justify-center p-4" style={{background:'var(--bg)', backgroundImage:'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%)'}}>
        <InjectStyles />
        <div className="max-w-2xl w-full">
          {/* Logo / badge */}
          <div className="flex justify-center mb-8">
            <div className="glass flex items-center gap-3 rounded-2xl px-5 py-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center glow-i">
                <Calculator className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="syne font-semibold text-sm" style={{color:'var(--muted)'}}>MathLib · Grade 10</span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-10">
            <h1 className="syne font-black mb-4 leading-none" style={{fontSize:'clamp(2.2rem,6vw,3rem)', letterSpacing:'-0.04em', color:'var(--text)'}}>
              Your complete<br/>
              <span style={{background:'linear-gradient(135deg,#4f46e5,#7c3aed,#0891b2)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>math study system</span>
            </h1>
            <p className="text-base leading-relaxed max-w-sm mx-auto" style={{color:'var(--muted)'}}>
              Notes, flashcards, practice problems, and interactive diagrams — all in one place.
            </p>
          </div>

          {/* Feature pills */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: Brain, label: 'Flashcards', desc: 'Active recall', grad: 'from-cyan-500 to-blue-500' },
              { icon: Target, label: 'Practice', desc: 'Instant feedback', grad: 'from-violet-500 to-purple-500' },
              { icon: Sparkles, label: 'Diagrams', desc: 'Visual learning', grad: 'from-emerald-500 to-teal-500' },
            ].map(({ icon: Icon, label, desc, grad }) => (
              <div key={label} className="glass glass-hover rounded-2xl p-4 text-center">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="syne font-bold text-sm" style={{color:'var(--text)'}}>{label}</p>
                <p className="text-xs mt-0.5" style={{color:'var(--dim)'}}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="glass rounded-2xl p-5 mb-5 space-y-4">
            {[
              { n: '01', title: 'Browse topics', body: 'Linear Systems, Quadratics, Trig, or Analytic Geometry.' },
              { n: '02', title: 'Study the notes', body: 'Clear bullet points paired with labeled diagrams per concept.' },
              { n: '03', title: 'Test yourself', body: 'Flashcards, quizzes and worksheets with reveal-on-click answers.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex items-start gap-4">
                <span className="mono font-black text-xs w-6 flex-shrink-0 mt-0.5" style={{color:'rgba(129,140,248,0.7)'}}>{n}</span>
                <div>
                  <p className="syne font-bold text-sm" style={{color:'var(--text)'}}>{title}</p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{color:'var(--dim)'}}>{body}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setShowIntro(false)}
            className="w-full py-4 rounded-2xl syne font-black text-white text-sm bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg glow-i">
            Open Library →
          </button>
        </div>
      </div>
    );
  }

  // Main library view
  const subjects = Object.values(studyLibrary);

  return (
    <div className="min-h-screen dot-grid" style={{background:'var(--bg)'}}>
      <InjectStyles />
      <AchievementPopup achievement={newAchievement} />

      {/* Top nav bar */}
      <div className="glass sticky top-0 z-40" style={{borderBottom:'1px solid var(--border)'}}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center glow-i">
              <Calculator className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="syne font-black text-sm" style={{color:'var(--text)'}}>MathLib</span>
            <span className="text-sm" style={{color:'var(--dim)'}}>·</span>
            <span className="text-xs mono" style={{color:'var(--muted)'}}>Grade 10</span>
          </div>
          <div className="glass flex items-center gap-2 rounded-xl px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{boxShadow:'0 0 6px rgba(16,185,129,0.7)'}} />
            <span className="syne text-xs font-bold" style={{color:'var(--muted)'}}>{readSections.size} completed</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14">
        {/* Hero */}
        <div className="mb-14 relative anim-up">
          <div className="rounded-3xl p-8 md:p-12 overflow-hidden relative card-shadow" style={{background:'linear-gradient(135deg, #eef2ff 0%, #f0fdf4 50%, #faf5ff 100%)', border:'1px solid rgba(99,102,241,0.12)'}}>
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" style={{background:'rgba(99,102,241,0.12)'}} />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full blur-3xl translate-y-1/2" style={{background:'rgba(139,92,246,0.10)'}} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5" style={{background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.18)'}}>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span className="syne text-xs font-bold uppercase tracking-wider" style={{color:'rgba(79,70,229,0.9)'}}>Interactive Study Library</span>
              </div>
              <h1 className="syne font-black mb-3 leading-none" style={{fontSize:'clamp(2.4rem,5vw,3.2rem)',letterSpacing:'-0.04em',color:'var(--text)'}}>
                Grade 10 Math
              </h1>
              <p className="text-base max-w-xl leading-relaxed" style={{color:'var(--muted)'}}>
                Everything you need — annotated notes, interactive diagrams, flashcards, and practice quizzes.
              </p>
              <div className="flex flex-wrap gap-8 mt-7">
                {[
                  { val: Object.values(studyLibrary).reduce((s,x)=>s+x.sections.length,0), label: 'Total sections' },
                  { val: readSections.size, label: 'Completed' },
                  { val: 4, label: 'Subject areas' },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <p className="syne font-black text-2xl" style={{color:'var(--text)'}}>{val}</p>
                    <p className="text-xs mt-0.5" style={{color:'var(--dim)'}}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Study Tools */}
        <div className="flex items-center gap-4 mb-5 anim-up anim-up-1">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
          <span className="syne text-xs font-black uppercase tracking-widest" style={{color:'var(--muted)'}}>Study Tools</span>
          <div className="flex-1 h-px" style={{background:'var(--border)'}} />
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {subjects.slice(0, 4).map((subject, i) => {
            const completedCount = subject.sections.filter(s => readSections.has(s.id)).length;
            const progress = (completedCount / subject.sections.length) * 100;
            const SubjectIcon = subject.icon;
            return (
              <div key={subject.id} onClick={() => setSelectedSubject(subject)}
                className={`glass glass-hover card-shadow card-shadow-hover rounded-2xl p-6 cursor-pointer group transition-all duration-200 anim-up anim-up-${(i%4)+1}`}>
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center shadow-lg`}>
                    <SubjectIcon className="w-6 h-6 text-white" />
                  </div>
                  <ChevronRight className="w-4 h-4 transition-all group-hover:translate-x-1" style={{color:'var(--dim)'}} />
                </div>
                <h3 className="syne font-bold text-base mb-1" style={{color:'var(--text)'}}>{subject.name}</h3>
                <p className="text-xs mb-4 leading-relaxed" style={{color:'var(--dim)'}}>{subject.description}</p>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs" style={{color:'var(--dim)'}}>{completedCount}/{subject.sections.length} done</span>
                  <span className="mono text-xs font-semibold" style={{color:'var(--muted)'}}>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{background:'rgba(99,102,241,0.1)'}}>
                  <div className={`h-full bg-gradient-to-r ${subject.gradient} rounded-full shimmer transition-all duration-500`} style={{ width: `${progress}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Notes */}
        <div className="flex items-center gap-4 mb-5 anim-up anim-up-2">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
          <span className="syne text-xs font-black uppercase tracking-widest" style={{color:'var(--muted)'}}>Notes</span>
          <div className="flex-1 h-px" style={{background:'var(--border)'}} />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {subjects.slice(4).map((subject, i) => {
            const completedCount = subject.sections.filter(s => readSections.has(s.id)).length;
            const progress = (completedCount / subject.sections.length) * 100;
            const SubjectIcon = subject.icon;
            return (
              <div key={subject.id} onClick={() => setSelectedSubject(subject)}
                className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-200 anim-up anim-up-${(i%4)+1}`}
                style={{border:'1px solid var(--border)'}}>
                <div className={`bg-gradient-to-br ${subject.gradient} p-6 relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 75% 40%, white 0%, transparent 60%)'}} />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <h3 className="syne font-black text-xl text-white mb-1" style={{letterSpacing:'-0.02em'}}>{subject.name}</h3>
                      <p className="text-white/70 text-xs leading-relaxed max-w-xs">{subject.description}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                      <SubjectIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="px-5 py-5" style={{background:'var(--bg-2)'}}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{color:'var(--muted)'}}>{completedCount} of {subject.sections.length} done</span>
                    <span className="mono text-xs font-semibold" style={{color:'var(--muted)'}}>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{background:'rgba(99,102,241,0.1)'}}>
                    <div className={`h-full bg-gradient-to-r ${subject.gradient} rounded-full shimmer transition-all duration-500`} style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
