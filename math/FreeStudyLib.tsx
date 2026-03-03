import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ArrowLeft, CheckCircle, Circle, Calculator, TrendingUp, Shapes, Grid3x3, ChevronRight, FileText, Lightbulb, Target, X, ClipboardList, Award, Trophy, Star, Flame, Brain, Sparkles, Zap, BookMarked } from 'lucide-react';

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
function DiscriminantStaticDiagram() {
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

// Diagrams keyed by "sectionId-noteIndex" — rendered inside that note card, below its bullet points.
// noteIndex is 0-based (the order notes appear in the section).
const NOTE_DIAGRAMS = {
  // ── Linear Systems ──────────────────────────────────────────────────────────
  'graphing-lines-0':      <LinearSystemsVisualizer />, // "Slope-Intercept Form" — live line explorer
  'graphing-lines-2':      <SlopeDiagram />,            // "Finding Slope" — rise/run diagram
  'substitution-1':        <SubstitutionFlowDiagram />, // "Step-by-Step Process" — flow diagram
  'substitution-0':        <SubstitutionStepper />,     // "When to Use" — interactive walkthrough
  'elimination-1':         <EliminationFlowDiagram />,  // "Step-by-Step Process" — flow diagram
  'elimination-2':         <EliminationStepper />,      // "Example Walkthrough" — interactive stepper
  'types-of-solutions-0':  <SystemTypesDiagram />,      // "One Solution" note — shows all 3 cases visually

  // ── Quadratics ──────────────────────────────────────────────────────────────
  'parabola-features-0':   <ParabolaAnatomyDiagram />,  // "Key Features" — annotated parabola
  'parabola-features-1':   <AValueDiagram />,            // "Role of a" — side-by-side width comparison
  'parabola-features-3':   <ParabolaExplorer />,         // "Step Pattern and Graphing" — live explorer

  'vertex-form-0':         <VertexFormDiagram />,        // "Understanding Vertex Form" — a/h/k breakdown
  'vertex-form-4':         <ParabolaExplorer />,         // "Transformations" — interactive explorer

  'standard-form-2':       <DiscriminantStaticDiagram />, // "The Discriminant" — 3-case zeros diagram
  'standard-form-1':       <ParabolaExplorer />,          // "Finding the Vertex" — live parabola

  'factored-form-0':       <DiscriminantStaticDiagram />, // "Understanding Factored Form" — zeros visual

  'quadratic-formula-0':   <QuadraticFormulaDiagram />,  // "The Formula" — annotated formula
  'quadratic-formula-2':   <DiscriminantExplorer />,     // "Using the Discriminant" — interactive

  'completing-square-0':   <VertexFormDiagram />,        // "Completing the Square" intro — vertex form card

  // ── Analytic Geometry ───────────────────────────────────────────────────────
  'distance-midpoint-0':   <DistanceMidpointDiagram />, // "Distance Formula" — coordinate diagram
  'circles-0':             <CircleStaticDiagram />,      // "Standard Form" — labeled circle
  'circles-1':             <CircleExplorer />,            // "Finding Equation" — interactive circle

  // ── Trigonometry ────────────────────────────────────────────────────────────
  'right-triangle-trig-0': <TrigStaticDiagram />,        // "SOH CAH TOA" — static labeled triangle
  'right-triangle-trig-1': <TrigTriangle />,              // next note — interactive triangle
  'sine-law-0':            <SineLawDiagram />,            // "Sine Law" intro — labeled triangle + formula
  'cosine-law-0':          <CosineLawDiagram />,          // "Cosine Law" intro — labeled diagram
  'choosing-method-0':     <LawSelectorDiagram />,        // "When to Use Which" — selector card
  'word-problems-trig-0':  <TrigTriangle />,              // trig word problems — interactive triangle
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
            explanation: 'Perpendicular lines have slopes that are negative reciprocals. 2 and -1/2 are negative reciprocals.'
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
            explanation: 'Since y is already isolated (y = x + 2), substitute this expression for y in the second equation.'
          },
          {
            question: 'What is the solution to the system: x + y = 5 and x - y = 1?',
            options: ['(3, 2)', '(2, 3)', '(4, 1)', '(1, 4)'],
            correct: 0,
            explanation: 'Using elimination: add the equations to get 2x = 6, so x = 3. Then substitute: 3 + y = 5, so y = 2.'
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
            explanation: 'Use x = -b/(2a) = -(-4)/(2·1) = 4/2 = 2'
          },
          {
            question: 'What is the discriminant of x² + 6x + 9 = 0?',
            options: ['0', '36', '12', '-36'],
            correct: 0,
            explanation: 'Discriminant = b² - 4ac = (6)² - 4(1)(9) = 36 - 36 = 0. This means one x-intercept (perfect square).'
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
    description: 'Right triangle trig, sine law, cosine law',
    icon: Calculator,
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
    sections: [
      {
        id: 'right-triangle-trig',
        title: 'Right Triangle Trigonometry',
        notes: [
          {
            subtitle: 'SOH CAH TOA',
            emoji: '🔺',
            points: [
              'sin(θ) = Opposite / Hypotenuse',
              'cos(θ) = Adjacent / Hypotenuse',
              'tan(θ) = Opposite / Adjacent',
              'ALWAYS identify the angle you\'re working with',
              'Hypotenuse is always the longest side (opposite right angle)'
            ]
          },
          {
            subtitle: 'Finding Sides',
            emoji: '📏',
            points: [
              'Given angle and one side, find another side',
              'Choose correct ratio based on what you know/need',
              'Example: sin(30°) = x/10, so x = 10·sin(30°) = 5',
              'Use calculator in DEGREE mode',
              'Always label your diagram first'
            ]
          },
          {
            subtitle: 'Finding Angles',
            emoji: '∠',
            points: [
              'Given two sides, find an angle',
              'Use inverse trig: sin⁻¹, cos⁻¹, tan⁻¹',
              'Example: tan(θ) = 5/3, so θ = tan⁻¹(5/3) ≈ 59°',
              'On calculator: use [2nd] or [shift] then trig button',
              'Angles in a triangle sum to 180°'
            ]
          },
          {
            subtitle: 'Special Right Triangles',
            emoji: '⭐',
            points: [
              '45-45-90 triangle: sides in ratio 1:1:√2',
              '30-60-90 triangle: sides in ratio 1:√3:2',
              'Useful for exact values without calculator',
              'Example: sin(45°) = 1/√2 = √2/2',
              'Memorize these ratios for quick calculations'
            ]
          }
        ]
      },
      {
        id: 'sine-law',
        title: 'Sine Law',
        notes: [
          {
            subtitle: 'The Sine Law Formula',
            emoji: '📐',
            points: [
              'Formula: a/sin(A) = b/sin(B) = c/sin(C)',
              'Relates sides to their opposite angles',
              'Works for ANY triangle (not just right triangles)',
              'Use when you have: angle-side-angle (ASA) or angle-angle-side (AAS)',
              'Also use for side-side-angle (SSA) - ambiguous case'
            ]
          },
          {
            subtitle: 'When to Use Sine Law',
            emoji: '🎯',
            points: [
              'When you know: 2 angles and 1 side (ASA or AAS)',
              'When you know: 2 sides and an angle opposite one of them (SSA)',
              'NOT useful when you have: 3 sides (SSS) or 2 sides and included angle (SAS)',
              'For those cases, use Cosine Law instead',
              'Always draw and label the triangle first'
            ]
          },
          {
            subtitle: 'Example Problem',
            emoji: '💡',
            points: [
              'Triangle ABC: angle A = 50°, angle B = 70°, side a = 10',
              'Find angle C: 180° - 50° - 70° = 60°',
              'Find side b: a/sin(A) = b/sin(B)',
              '10/sin(50°) = b/sin(70°)',
              'b = 10·sin(70°)/sin(50°) ≈ 12.3'
            ]
          },
          {
            subtitle: 'Ambiguous Case (SSA)',
            emoji: '⚠️',
            points: [
              'When you know 2 sides and angle opposite one of them',
              'May have 0, 1, or 2 possible triangles',
              'Use sine law to find second angle',
              'Check if sin⁻¹ gives acute or obtuse angle',
              'Both might be valid - check if angles sum < 180°'
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
              'Formula: c² = a² + b² - 2ab·cos(C)',
              'Extension of Pythagorean theorem',
              'Use when sine law doesn\'t work',
              'Can be rearranged for any side or angle',
              'Works for ANY triangle'
            ]
          },
          {
            subtitle: 'When to Use Cosine Law',
            emoji: '🎯',
            points: [
              'When you know: 3 sides (SSS)',
              'When you know: 2 sides and the included angle (SAS)',
              'Use to find missing side or missing angle',
              'NOT efficient for ASA or AAS (use sine law instead)',
              'Remember: the angle in formula is between the two sides'
            ]
          },
          {
            subtitle: 'Finding a Side (SAS)',
            emoji: '📏',
            points: [
              'Example: a = 5, b = 7, angle C = 60°',
              'Use: c² = a² + b² - 2ab·cos(C)',
              'c² = 25 + 49 - 2(5)(7)·cos(60°)',
              'c² = 74 - 70(0.5) = 74 - 35 = 39',
              'c = √39 ≈ 6.2'
            ]
          },
          {
            subtitle: 'Finding an Angle (SSS)',
            emoji: '∠',
            points: [
              'Example: a = 5, b = 7, c = 8, find angle C',
              'Rearrange: cos(C) = (a² + b² - c²)/(2ab)',
              'cos(C) = (25 + 49 - 64)/(2·5·7) = 10/70',
              'C = cos⁻¹(10/70) ≈ 81.8°',
              'Check: use other angles sum to 180°'
            ]
          }
        ]
      },
      {
        id: 'choosing-method',
        title: 'Choosing the Right Method',
        notes: [
          {
            subtitle: 'Decision Tree',
            emoji: '🌳',
            points: [
              'Is it a RIGHT triangle? → Use SOH CAH TOA',
              'Know 2 angles and 1 side? → Use Sine Law',
              'Know 2 sides and included angle? → Use Cosine Law',
              'Know 3 sides? → Use Cosine Law',
              'Know 2 sides and angle NOT between them? → Use Sine Law (watch for ambiguous case)'
            ]
          },
          {
            subtitle: 'Quick Reference Chart',
            emoji: '📋',
            points: [
              'SSS (3 sides): Cosine Law',
              'SAS (2 sides, included angle): Cosine Law',
              'ASA (2 angles, included side): Sine Law',
              'AAS (2 angles, non-included side): Sine Law',
              'SSA (2 sides, non-included angle): Sine Law - ambiguous'
            ]
          }
        ]
      },
      {
        id: 'word-problems-trig',
        title: 'Trigonometry Word Problems',
        notes: [
          {
            subtitle: 'Angle of Elevation/Depression',
            emoji: '🏔️',
            points: [
              'Elevation: looking UP from horizontal',
              'Depression: looking DOWN from horizontal',
              'Always measured from horizontal line',
              'Draw a clear diagram with right triangle',
              'Example: Person 50m from building sees top at 40° elevation. Find height.'
            ]
          },
          {
            subtitle: 'Bearing Problems',
            emoji: '🧭',
            points: [
              'Bearing: direction measured clockwise from North',
              'Example: N 40° E means 40° east of north',
              'Draw North line, measure angle from there',
              'May need to find actual angle in triangle',
              'Often involves multiple triangles'
            ]
          },
          {
            subtitle: 'Navigation and Distance',
            emoji: '⛵',
            points: [
              'Ships, planes, hiking - all use trig',
              'Break complex paths into triangles',
              'Use sine/cosine law to find distances and directions',
              'May need to use multiple steps',
              'Always draw a clear, labeled diagram'
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
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
          {/* Section title */}
          <div className="mb-8 anim-up">
            <div className={`inline-block bg-gradient-to-r ${selectedSubject.gradient} rounded-2xl p-px`}>
              <div className="rounded-2xl px-5 py-3" style={{background:'var(--bg)'}}>
                <h1 className="syne font-black text-xl" style={{color:'var(--text)',letterSpacing:'-0.02em'}}>{section.title}</h1>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {section.notes && section.notes.map((note, idx) => {
              const diagramKey = `${section.id}-${idx}`;
              const diagram = NOTE_DIAGRAMS[diagramKey];
              return (
              <div key={idx} className={`glass rounded-2xl overflow-hidden anim-up anim-up-${Math.min(idx+1,4)}`} style={{borderColor:'var(--border)'}}>
                {/* Card header */}
                <div className={`bg-gradient-to-r ${selectedSubject.gradient} px-5 py-3 flex items-center gap-3`} style={{opacity:0.92}}>
                  <span className="text-xl leading-none">{note.emoji}</span>
                  <h2 className="syne font-bold text-sm text-white leading-snug tracking-wide">{note.subtitle}</h2>
                </div>
                {/* Card body */}
                <div className="px-6 py-5">
                  <ul className="space-y-1.5">
                    {note.points.map((point, pointIdx) => {
                      const isStep = /^\d+\./.test(point);
                      const hasKeyTerm = /^([A-Z][A-Z\s/]+):/.test(point);
                      const colonIdx = point.indexOf(':');
                      const keyTerm = hasKeyTerm && colonIdx > 0 ? point.slice(0, colonIdx) : null;
                      const rest = hasKeyTerm && colonIdx > 0 ? point.slice(colonIdx + 1).trim() : point;

                      return (
                        <li key={pointIdx}>
                          <div className={`flex items-start gap-3 rounded-xl px-3 py-2 transition-colors ${isStep ? '' : ''}`}
                            style={{background:'transparent'}}
                            onMouseOver={e=>e.currentTarget.style.background='rgba(99,102,241,0.04)'}
                            onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                            {isStep ? (
                              <span className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-lg bg-gradient-to-br ${selectedSubject.gradient} text-white text-xs font-bold flex items-center justify-center mono`} style={{opacity:0.85}}>
                                {point.match(/^(\d+)/)?.[1]}
                              </span>
                            ) : (
                              <span className={`flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${selectedSubject.gradient}`} style={{opacity:0.7}}/>
                            )}
                            <p className="text-sm leading-relaxed" style={{color:'var(--muted)'}}>
                              {keyTerm ? (
                                <><span className="font-bold" style={{color:'var(--text)'}}>{keyTerm}:</span>{' '}{rest}</>
                              ) : isStep ? (
                                <span>{point.replace(/^\d+\.\s*/, '')}</span>
                              ) : point}
                            </p>
                          </div>

                          {isWorksheet && note.answers && note.answers[pointIdx] && (
                            <div className="ml-8 mt-1">
                              <button onClick={() => toggleAnswer(idx, pointIdx)}
                                className="text-xs syne font-bold flex items-center gap-1 px-2 py-1 rounded-lg transition-colors"
                                style={{color:'rgba(13,148,136,0.8)'}}
                                onMouseOver={e=>e.currentTarget.style.color='rgb(13,148,136)'}
                                onMouseOut={e=>e.currentTarget.style.color='rgba(13,148,136,0.8)'}>
                                {revealedAnswers.has(`${idx}-${pointIdx}`) ? '▾ Hide' : '▸ Show Answer'}
                              </button>
                              {revealedAnswers.has(`${idx}-${pointIdx}`) && (
                                <div className="mt-1.5 px-4 py-2.5 rounded-r-xl" style={{background:'rgba(16,185,129,0.07)',borderLeft:'2px solid rgba(16,185,129,0.35)'}}>
                                  <p className="text-sm mono" style={{color:'rgba(6,78,59,0.9)'}}>{note.answers[pointIdx]}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  {diagram && (
                    <div className="mt-5 pt-4" style={{borderTop:'1px solid var(--border)'}}>
                      {diagram}
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>

          {/* Study tip */}
          <div className="mt-8 glass rounded-2xl p-5 flex gap-3">
            <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color:'rgba(180,83,9,0.8)'}} />
            <p className="text-sm leading-relaxed" style={{color:'var(--dim)'}}>
              Work through problems yourself before checking answers. Active recall is the single most effective study strategy.
            </p>
          </div>
        </div>
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
    );
  }

  // Introduction modal
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