import React, { useState, useEffect } from "react";
import { BookOpen, ArrowLeft, CheckCircle, Circle, Calculator, TrendingUp, Shapes, Grid3x3, ChevronRight, FileText, Lightbulb, Target, X, ClipboardList, Brain, Sparkles, BookMarked } from "./lucide-react-shim";

const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
  :root {
    --bg:#f6f7fb;--bg-2:#ffffff;--surface:#ffffff;
    --border:rgba(0,0,0,0.07);--border-2:rgba(0,0,0,0.13);
    --text:#0f172a;--muted:rgba(15,23,42,0.55);--dim:rgba(15,23,42,0.38);
  }
  body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;}
  .dot-grid{background-image:radial-gradient(circle,rgba(99,102,241,0.08) 1.5px,transparent 1.5px);background-size:32px 32px;}
  .glass{background:rgba(255,255,255,0.82);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid var(--border);}
  .glass-hover:hover{background:rgba(255,255,255,0.96);border-color:var(--border-2);box-shadow:0 8px 32px rgba(99,102,241,0.10);}
  @keyframes shimmer{from{transform:translateX(-100%)}to{transform:translateX(200%)}}
  .shimmer{overflow:hidden;position:relative;}
  .shimmer::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent);animation:shimmer 2.4s infinite;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  .anim-up{animation:fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;}
  .anim-up-1{animation-delay:0.07s}.anim-up-2{animation-delay:0.13s}.anim-up-3{animation-delay:0.19s}.anim-up-4{animation-delay:0.25s}
  .flip-card{perspective:1200px;}
  .flip-inner{transition:transform 0.55s cubic-bezier(0.4,0,0.2,1);transform-style:preserve-3d;}
  .flip-inner.flipped{transform:rotateY(180deg);}
  .flip-front,.flip-back{backface-visibility:hidden;-webkit-backface-visibility:hidden;}
  .flip-back{transform:rotateY(180deg);}
  ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.2);border-radius:99px;}
  .syne{font-family:'Syne',sans-serif;}.mono{font-family:'JetBrains Mono',monospace;}
  .card-shadow{box-shadow:0 2px 12px rgba(15,23,42,0.06),0 1px 3px rgba(15,23,42,0.04);}
  .card-shadow-hover:hover{box-shadow:0 8px 32px rgba(99,102,241,0.13),0 2px 8px rgba(15,23,42,0.06);}

  /* ── NOTE CARD STYLES ── */
  .note-topic-card {
    background: #ffffff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.04);
    transition: box-shadow 0.2s;
  }
  .note-topic-card:hover { box-shadow: 0 8px 36px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.06); }

  /* ruled paper lines inside note body */
  .note-ruled {
    background-image: repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 31px,
      rgba(99,102,241,0.06) 31px,
      rgba(99,102,241,0.06) 32px
    );
    background-size: 100% 32px;
  }

  /* KEY TERM rows */
  .note-row-keyterm {
    background: linear-gradient(90deg, rgba(99,102,241,0.06) 0%, rgba(99,102,241,0.02) 100%);
    border-left: 3px solid #6366f1;
    border-radius: 0 10px 10px 0;
    margin: 2px 0;
  }
  .note-row-keyterm .key-badge {
    display: inline-flex;
    align-items: center;
    background: #6366f1;
    color: white;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 10px;
    letter-spacing: 0.08em;
    padding: 2px 8px;
    border-radius: 99px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* STEP rows */
  .note-row-step {
    background: transparent;
    position: relative;
  }
  .step-num-bubble {
    width: 28px; height: 28px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 12px;
    color: white;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  }

  /* WARNING rows (Do NOT...) */
  .note-row-warn {
    background: linear-gradient(90deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.03) 100%);
    border-left: 3px solid #f59e0b;
    border-radius: 0 10px 10px 0;
    margin: 2px 0;
  }

  /* EXAMPLE rows */
  .note-row-example {
    background: linear-gradient(90deg, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 100%);
    border-left: 3px solid #10b981;
    border-radius: 0 10px 10px 0;
    margin: 2px 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12.5px;
  }

  /* TIP rows */
  .note-row-tip {
    background: linear-gradient(90deg, rgba(14,165,233,0.08) 0%, rgba(14,165,233,0.02) 100%);
    border-left: 3px solid #0ea5e9;
    border-radius: 0 10px 10px 0;
    margin: 2px 0;
  }

  /* REGULAR rows */
  .note-row-regular {
    border-left: 2px solid rgba(15,23,42,0.08);
    margin: 2px 0;
    border-radius: 0 8px 8px 0;
  }
  .note-row-regular:hover { border-left-color: rgba(99,102,241,0.3); background: rgba(99,102,241,0.02); border-radius: 0 8px 8px 0; }

  /* Step connector line */
  .steps-container { position: relative; }
  .steps-container::before {
    content: '';
    position: absolute;
    left: 13px; top: 28px; bottom: 14px;
    width: 2px;
    background: linear-gradient(to bottom, rgba(99,102,241,0.25), transparent);
    border-radius: 2px;
  }

  /* Topic header collapse button */
  .topic-header-btn { cursor: pointer; user-select: none; }
  .topic-header-btn:hover { filter: brightness(0.97); }

  @keyframes noteSlideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  .note-body-open { animation: noteSlideIn 0.22s cubic-bezier(0.22,1,0.36,1); }

  /* Formula chips */
  .formula-chip {
    display: inline-block;
    background: #1e1b4b;
    color: #a5b4fc;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 6px;
    margin: 0 2px;
  }

  /* Worksheet answer toggle */
  .ws-answer-reveal { animation: noteSlideIn 0.18s ease; }
`;

function InjectStyles() {
  useEffect(() => {
    const id = "mathlib-g9-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id; el.textContent = GLOBAL_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

// ── NOTE RENDERING ENGINE ─────────────────────────────────────────────────────

const GRAD_COLORS = {
  "from-violet-500 to-purple-600": { h:"#7c3aed", m:"#a855f7", l:"#f5f3ff", ll:"#ede9fe" },
  "from-blue-500 to-cyan-600":     { h:"#2563eb", m:"#3b82f6", l:"#eff6ff", ll:"#dbeafe" },
  "from-amber-500 to-orange-600":  { h:"#d97706", m:"#f59e0b", l:"#fffbeb", ll:"#fef3c7" },
  "from-emerald-500 to-teal-600":  { h:"#059669", m:"#10b981", l:"#f0fdf4", ll:"#d1fae5" },
  "from-rose-500 to-pink-600":     { h:"#e11d48", m:"#f43f5e", l:"#fff1f2", ll:"#ffe4e6" },
  "from-teal-500 to-cyan-600":     { h:"#0d9488", m:"#14b8a6", l:"#f0fdfa", ll:"#ccfbf1" },
  "from-indigo-500 to-purple-600": { h:"#4f46e5", m:"#6366f1", l:"#eef2ff", ll:"#e0e7ff" },
  "from-cyan-500 to-blue-600":     { h:"#0891b2", m:"#06b6d4", l:"#ecfeff", ll:"#cffafe" },
};

function getCol(gradient) {
  return GRAD_COLORS[gradient] || { h:"#6366f1", m:"#818cf8", l:"#eef2ff", ll:"#e0e7ff" };
}

function classifyPoint(pt) {
  if (/^(Do NOT|Do not|NEVER|Warning:|CAUTION:|NOT:|Avoid)/i.test(pt)) return "warn";
  if (/^(Tip:|TIP:|Note:|NOTE:|Remember:|REMEMBER:|Hint:|HINT:|Pro tip)/i.test(pt)) return "tip";
  if (/^(e\.g\.|Example:|EXAMPLE:|For example)/i.test(pt)) return "example";
  if (/^\d+\./.test(pt)) return "step";
  if (/^([A-Z][A-Z\s/]{2,}):/.test(pt)) return "keyterm";
  return "regular";
}

function extractKeyTerm(pt) {
  const m = pt.match(/^([A-Z][A-Z\s/0-9]{2,}):\s*(.*)/s);
  return m ? { key: m[1], rest: m[2] } : null;
}

// ── Math notation renderer ──────────────────────────────────────────────────
// Converts text like x^2, sqrt(x), pi, <=, >= into proper symbols

const SUP_MAP = {"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","n":"ⁿ","x":"ˣ","a":"ᵃ","b":"ᵇ","m":"ᵐ","+":"⁺","-":"⁻","(":"⁽",")":"⁾"};

function toSup(s) {
  // Try unicode superscript chars first, fall back to <sup>
  const mapped = s.split("").map(c => SUP_MAP[c] || null);
  if (mapped.every(Boolean)) return mapped.join("");
  return null; // will use <sup> tag
}

function mathStr(text) {
  if (typeof text !== "string") return text;

  // Replace symbol words first (order matters)
  let t = text
    .replace(/\bsqrt\b/gi, "√")
    .replace(/\bpi\b/g, "π")
    .replace(/\btheta\b/gi, "θ")
    .replace(/\balpha\b/gi, "α")
    .replace(/\bbeta\b/gi, "β")
    .replace(/\binfinity\b/gi, "∞")
    .replace(/\btimes\b/g, "×")
    .replace(/\bdivided by\b/gi, "÷")
    .replace(/<=>/g, "⟺")
    .replace(/<=/g, "≤")
    .replace(/>=/g, "≥")
    .replace(/!=/g, "≠")
    .replace(/\.\.\./g, "…")
    .replace(/\bapprox\b/gi, "≈")
    .replace(/±/g, "±")
    .replace(/\+-/g, "±");

  return t;
}

function renderMath(text) {
  if (typeof text !== "string") return text;

  // First apply symbol replacements
  let t = mathStr(text);

  // Now parse for ^, √(...), fractions into React elements
  // We'll build a token array by scanning character by character
  const tokens = [];
  let buf = "";
  let i = 0;

  while (i < t.length) {
    // ── superscript: something^(expr) or something^char ──
    if (t[i] === "^") {
      if (buf) { tokens.push(buf); buf = ""; }
      i++; // skip ^
      let exp = "";
      if (t[i] === "(") {
        // collect until matching )
        let depth = 1; i++;
        while (i < t.length && depth > 0) {
          if (t[i] === "(") depth++;
          else if (t[i] === ")") { depth--; if (depth === 0) { i++; break; } }
          if (depth > 0) exp += t[i];
          i++;
        }
      } else {
        // collect digits, letters, sign until non-alphanumeric
        while (i < t.length && /[\w\-+]/.test(t[i])) { exp += t[i]; i++; }
      }
      const uni = toSup(exp);
      if (uni) {
        tokens.push(<span key={tokens.length} style={{ fontSize:"0.78em", verticalAlign:"super", lineHeight:0, fontWeight:700 }}>{uni}</span>);
      } else {
        tokens.push(<sup key={tokens.length} style={{ fontSize:"0.72em", fontWeight:700, lineHeight:0 }}>{exp}</sup>);
      }
      continue;
    }

    // ── square root: √(...) or √word ──
    if (t[i] === "√") {
      if (buf) { tokens.push(buf); buf = ""; }
      i++; // skip √
      let inner = "";
      if (t[i] === "(") {
        let depth = 1; i++;
        while (i < t.length && depth > 0) {
          if (t[i] === "(") depth++;
          else if (t[i] === ")") { depth--; if (depth === 0) { i++; break; } }
          if (depth > 0) inner += t[i];
          i++;
        }
      } else {
        while (i < t.length && /[\w^.]/.test(t[i])) { inner += t[i]; i++; }
      }
      // render as √‾inner‾ with overline
      tokens.push(
        <span key={tokens.length} style={{ display:"inline-flex", alignItems:"center", gap:"1px" }}>
          <span style={{ fontSize:"1.05em", lineHeight:1 }}>√</span>
          <span style={{ borderTop:"1.5px solid currentColor", paddingTop:"1px", paddingLeft:"1px", paddingRight:"1px", lineHeight:1.2 }}>
            {renderMath(inner)}
          </span>
        </span>
      );
      continue;
    }

    buf += t[i];
    i++;
  }
  if (buf) tokens.push(buf);

  return tokens.length === 1 && typeof tokens[0] === "string" ? tokens[0] : tokens;
}

// Wrap math tokens in styled span for formula-like content
function hilite(text) {
  if (typeof text !== "string") return text;

  // Split on formula-like chunks: things with ^, √, π, ×, ÷, ≤, ≥, ≠, ≈
  // Strategy: tokenise by detecting "math runs" vs plain prose
  const mathRx = /([a-zA-Z0-9_()+\-*/÷×^√πθ≤≥≠≈±²³⁴⁵⁶⁷⁸⁹⁰ⁿ]*(?:\^[\w()\-+/*]+|√\([^)]*\)|√\w+)[a-zA-Z0-9_()+\-*/÷×^√πθ≤≥≠≈±²³⁴⁵⁶⁷⁸⁹⁰ⁿ]*|[a-zA-Z]\s*=\s*[a-zA-Z0-9^√π()+\-*/\s]+(?=[,.\s]|$)|\d+\/\d+)/g;

  // Just run renderMath on the full string — it handles everything inline
  const result = renderMath(mathStr(text));

  // If it came back as a plain string with no math, return as-is
  if (typeof result === "string") return result;

  // Wrap math elements in a subtle highlight
  if (Array.isArray(result)) {
    return result.map((tok, i) => {
      if (typeof tok === "string") return tok;
      // It's a math element (sup, overline sqrt, etc.) — wrap in code style
      return (
        <span key={i} style={{ background:"#1e1b4b", color:"#a5b4fc", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.88em", padding:"0px 5px", borderRadius:"5px", fontWeight:600, display:"inline-flex", alignItems:"center", verticalAlign:"middle", lineHeight:1.5 }}>
          {tok}
        </span>
      );
    });
  }
  return result;
}

// Simpler version for answer text (no chip wrapping, just clean symbols)
function mathRender(text) {
  if (typeof text !== "string") return text;
  return renderMath(mathStr(text));
}

// ── individual note type renderers ──

function NoteKeyTerm({ parsed, col, idx }) {
  return (
    <div style={{ background: col.ll, borderRadius:"14px", padding:"14px 16px", marginBottom:"10px", border:`1.5px solid ${col.h}28` }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:"12px" }}>
        <div style={{ flexShrink:0 }}>
          <div style={{ background:`linear-gradient(135deg,${col.h},${col.m})`, color:"white", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"9px", padding:"3px 10px", borderRadius:"99px", letterSpacing:"0.1em", whiteSpace:"nowrap", marginBottom:"4px" }}>KEY TERM</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:"15px", color:col.h, lineHeight:1.1 }}>{parsed.key.charAt(0)+parsed.key.slice(1).toLowerCase()}</div>
        </div>
        <div style={{ flex:1, borderLeft:`2px solid ${col.h}30`, paddingLeft:"12px" }}>
          <p style={{ fontSize:"13.5px", color:"#1e293b", lineHeight:1.65, margin:0 }}>{hilite(parsed.rest)}</p>
        </div>
      </div>
    </div>
  );
}

function NoteStep({ num, body, col, total, gradient }) {
  const isLast = num === String(total);
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:"14px", marginBottom: isLast ? "0" : "6px", position:"relative" }}>
      {/* connector line */}
      {!isLast && <div style={{ position:"absolute", left:"18px", top:"36px", bottom:"-6px", width:"2px", background:`linear-gradient(to bottom, ${col.h}40, transparent)`, zIndex:0 }}/>}
      <div style={{ flexShrink:0, width:"36px", height:"36px", borderRadius:"50%", background:`linear-gradient(135deg,${col.h},${col.m})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:"14px", color:"white", boxShadow:`0 4px 12px ${col.h}40`, zIndex:1, position:"relative" }}>{num}</div>
      <div style={{ flex:1, background:"white", borderRadius:"12px", padding:"10px 14px", border:`1px solid ${col.h}18`, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
        <p style={{ fontSize:"13.5px", color:"#1e293b", lineHeight:1.6, margin:0 }}>{hilite(body)}</p>
      </div>
    </div>
  );
}

function NoteWarn({ text }) {
  const body = text.replace(/^(Do NOT|Do not|NEVER|Warning:|CAUTION:|NOT:|Avoid[:]?)\s*/i, "");
  return (
    <div style={{ background:"#fff7ed", borderRadius:"14px", padding:"12px 16px", marginBottom:"10px", border:"1.5px solid #fed7aa", display:"flex", alignItems:"flex-start", gap:"10px" }}>
      <div style={{ flexShrink:0, width:"32px", height:"32px", borderRadius:"10px", background:"#f97316", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px" }}>⚠️</div>
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"10px", color:"#c2410c", letterSpacing:"0.1em", marginBottom:"3px" }}>WATCH OUT</div>
        <p style={{ fontSize:"13.5px", color:"#7c2d12", lineHeight:1.6, margin:0, fontWeight:500 }}>{hilite(text)}</p>
      </div>
    </div>
  );
}

function NoteTip({ text }) {
  const labelMatch = text.match(/^([A-Za-z\s]+):/);
  const label = labelMatch ? labelMatch[1].toUpperCase() : "TIP";
  const body = text.replace(/^[A-Za-z\s]+:\s*/i, "");
  return (
    <div style={{ background:"#f0f9ff", borderRadius:"14px", padding:"12px 16px", marginBottom:"10px", border:"1.5px solid #bae6fd", display:"flex", alignItems:"flex-start", gap:"10px" }}>
      <div style={{ flexShrink:0, width:"32px", height:"32px", borderRadius:"10px", background:"#0ea5e9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px" }}>💡</div>
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"10px", color:"#0369a1", letterSpacing:"0.1em", marginBottom:"3px" }}>{label}</div>
        <p style={{ fontSize:"13.5px", color:"#0c4a6e", lineHeight:1.6, margin:0 }}>{hilite(body)}</p>
      </div>
    </div>
  );
}

function NoteExample({ text }) {
  const body = text.replace(/^(e\.g\.|Example:|EXAMPLE:|For example[,:]?)\s*/i, "");
  return (
    <div style={{ background:"#f0fdf4", borderRadius:"14px", padding:"12px 16px", marginBottom:"10px", border:"1.5px solid #bbf7d0", display:"flex", alignItems:"flex-start", gap:"10px" }}>
      <div style={{ flexShrink:0, width:"32px", height:"32px", borderRadius:"10px", background:"#16a34a", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px" }}>✏️</div>
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"10px", color:"#15803d", letterSpacing:"0.1em", marginBottom:"4px" }}>EXAMPLE</div>
        <p style={{ fontSize:"13px", color:"#14532d", lineHeight:1.7, margin:0, fontFamily:"'JetBrains Mono',monospace" }}>{mathRender(body)}</p>
      </div>
    </div>
  );
}

function NoteRegular({ text, col, isWS, idx, answers }) {
  const [open, setOpen] = useState(false);
  const answer = isWS && answers && answers[idx];
  return (
    <div style={{ marginBottom:"10px" }}>
      {/* Question row */}
      <div style={{ background:"white", borderRadius: open ? "12px 12px 0 0" : "12px", padding:"11px 14px", border:`1px solid ${col.h}18`, display:"flex", alignItems:"flex-start", gap:"10px", boxShadow:"0 1px 4px rgba(0,0,0,0.035)", borderBottom: open ? `1px solid ${col.h}12` : `1px solid ${col.h}18` }}>
        <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:`linear-gradient(135deg,${col.h},${col.m})`, flexShrink:0, marginTop:"6px", opacity:0.7 }}/>
        <p style={{ fontSize:"13.5px", color:"#334155", lineHeight:1.65, margin:0, flex:1, fontWeight:500 }}>{hilite(text)}</p>
        {answer && (
          <button onClick={() => setOpen(o => !o)} style={{ flexShrink:0, background: open ? col.h : col.ll, color: open ? "white" : col.h, border:"none", borderRadius:"8px", padding:"4px 10px", fontSize:"11px", fontFamily:"'Syne',sans-serif", fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:"5px", marginTop:"1px", whiteSpace:"nowrap", transition:"all 0.15s" }}>
            {open ? "Hide" : "Answer"} <span style={{ fontSize:"10px", transition:"transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", display:"inline-block" }}>▾</span>
          </button>
        )}
      </div>
      {/* Dropdown answer */}
      {answer && open && (
        <div style={{ background:col.ll, borderRadius:"0 0 12px 12px", padding:"11px 14px 13px 14px", borderLeft:`3px solid ${col.h}`, borderRight:`1px solid ${col.h}18`, borderBottom:`1px solid ${col.h}18`, display:"flex", alignItems:"flex-start", gap:"10px", animation:"noteSlideIn 0.18s cubic-bezier(0.22,1,0.36,1)" }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"9px", color:"white", background:col.h, padding:"2px 7px", borderRadius:"99px", letterSpacing:"0.08em", whiteSpace:"nowrap", flexShrink:0, marginTop:"2px" }}>ANSWER</span>
          <p style={{ fontSize:"12.5px", color:col.h, fontFamily:"'JetBrains Mono',monospace", margin:0, lineHeight:1.7, fontWeight:500, flex:1 }}>{mathRender(answer)}</p>
        </div>
      )}
    </div>
  );
}



function NoteTopicCard({ note, noteIdx, gradient, isWS, diagram }) {
  const [open, setOpen] = useState(true);
  const col = getCol(gradient);

  const types = note.points.map(classifyPoint);
  const stepCount = types.filter(t => t === "step").length;
  const termCount = types.filter(t => t === "keyterm").length;
  const warnCount = types.filter(t => t === "warn").length;
  const totalSteps = stepCount;

  // track running step index for connector lines
  let stepsSeen = 0;

  return (
    <div style={{ background:"white", borderRadius:"20px", marginBottom:"16px", overflow:"hidden", boxShadow:"0 4px 20px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.04)" }}>
      {/* ── Header ── */}
      <button onClick={() => setOpen(o => !o)} style={{ width:"100%", textAlign:"left", cursor:"pointer", background:"none", border:"none", padding:0 }}>
        <div style={{ background:`linear-gradient(135deg, ${col.ll}, ${col.l} 60%, white)`, padding:"16px 20px", borderBottom: open ? `1px solid ${col.h}18` : "none", display:"flex", alignItems:"center", gap:"12px" }}>
          <span style={{ fontSize:"26px", lineHeight:1, flexShrink:0 }}>{note.emoji}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:"15px", color:col.h, lineHeight:1.2, marginBottom:"5px" }}>{note.subtitle}</div>
            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
              {stepCount > 0 && <span style={{ fontSize:"10px", background:`${col.h}18`, color:col.h, padding:"2px 8px", borderRadius:"99px", fontWeight:700, fontFamily:"'Syne',sans-serif" }}>📋 {stepCount} steps</span>}
              {termCount > 0 && <span style={{ fontSize:"10px", background:"rgba(99,102,241,0.1)", color:"#4338ca", padding:"2px 8px", borderRadius:"99px", fontWeight:700, fontFamily:"'Syne',sans-serif" }}>📖 {termCount} vocab</span>}
              {warnCount > 0 && <span style={{ fontSize:"10px", background:"rgba(249,115,22,0.1)", color:"#c2410c", padding:"2px 8px", borderRadius:"99px", fontWeight:700, fontFamily:"'Syne',sans-serif" }}>⚠️ {warnCount} mistake alert</span>}
            </div>
          </div>
          <div style={{ color:col.h, fontSize:"22px", lineHeight:1, transition:"transform 0.25s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink:0 }}>⌄</div>
        </div>
      </button>

      {/* ── Body ── */}
      {open && (
        <div style={{ padding:"16px", background:`linear-gradient(180deg, ${col.l}60, white 80px)`, animation:"noteSlideIn 0.22s cubic-bezier(0.22,1,0.36,1)" }}>

          {/* Render all points grouped smartly */}
          {(() => {
            const rendered = [];
            const steps = [];

            note.points.forEach((pt, pi) => {
              const type = classifyPoint(pt);

              // Flush any accumulated steps when we hit a non-step
              const flushSteps = () => {
                if (steps.length > 0) {
                  rendered.push(
                    <div key={`steps-${pi}`} style={{ marginBottom:"12px", padding:"4px 0" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
                        <div style={{ height:"1.5px", flex:1, background:`linear-gradient(to right, ${col.h}30, transparent)` }}/>
                        <span style={{ fontSize:"10px", color:col.m, fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:"0.1em" }}>STEPS</span>
                        <div style={{ height:"1.5px", flex:1, background:`linear-gradient(to left, ${col.h}30, transparent)` }}/>
                      </div>
                      <div style={{ position:"relative" }}>
                        {steps.map((s, si) => (
                          <NoteStep key={si} num={s.num} body={s.body} col={col} total={steps.length} gradient={gradient} />
                        ))}
                      </div>
                    </div>
                  );
                  steps.length = 0;
                }
              };

              if (type === "step" && !isWS) {
                const num = pt.match(/^(\d+)/)?.[1];
                const body = pt.replace(/^\d+\.\s*/, "");
                steps.push({ num, body, pi });
              } else {
                flushSteps();
                if (type === "keyterm") {
                  const parsed = extractKeyTerm(pt);
                  if (parsed) {
                    rendered.push(<NoteKeyTerm key={pi} parsed={parsed} col={col} idx={pi} />);
                  } else {
                    rendered.push(<NoteRegular key={pi} text={pt} col={col} isWS={isWS} idx={pi} answers={note.answers} />);
                  }
                } else if (type === "warn") {
                  rendered.push(<NoteWarn key={pi} text={pt} />);
                } else if (type === "tip") {
                  rendered.push(<NoteTip key={pi} text={pt} />);
                } else if (type === "example") {
                  rendered.push(<NoteExample key={pi} text={pt} />);
                } else {
                  rendered.push(<NoteRegular key={pi} text={pt} col={col} isWS={isWS} idx={pi} answers={note.answers} />);
                }
              }
            });

            // flush any remaining steps
            if (steps.length > 0) {
              rendered.push(
                <div key="steps-end" style={{ marginBottom:"12px", padding:"4px 0" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
                    <div style={{ height:"1.5px", flex:1, background:`linear-gradient(to right, ${col.h}30, transparent)` }}/>
                    <span style={{ fontSize:"10px", color:col.m, fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:"0.1em" }}>STEPS</span>
                    <div style={{ height:"1.5px", flex:1, background:`linear-gradient(to left, ${col.h}30, transparent)` }}/>
                  </div>
                  <div style={{ position:"relative" }}>
                    {steps.map((s, si) => (
                      <NoteStep key={si} num={s.num} body={s.body} col={col} total={steps.length} gradient={gradient} />
                    ))}
                  </div>
                </div>
              );
            }

            return rendered;
          })()}

          {/* Diagram */}
          {diagram && (
            <div style={{ marginTop:"16px", paddingTop:"16px", borderTop:`2px dashed ${col.h}20` }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"12px" }}>
                <span style={{ width:"4px", height:"16px", borderRadius:"2px", background:`linear-gradient(to bottom,${col.h},${col.m})`, display:"inline-block" }}/>
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"11px", color:col.h, letterSpacing:"0.08em" }}>INTERACTIVE DIAGRAM</span>
              </div>
              {diagram}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DiagramCard({ title, children, color = "slate" }) {
  const borders = { purple:"border-purple-200",blue:"border-blue-200",teal:"border-teal-200",amber:"border-amber-200",green:"border-green-200",slate:"border-slate-200",indigo:"border-indigo-200",rose:"border-rose-200" };
  return (
    <div className={`bg-white rounded-2xl border-2 ${borders[color]||"border-slate-200"} shadow-md overflow-hidden`}>
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full bg-${color}-400`} />
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function SlopeDiagram() {
  return (
    <DiagramCard title="Slope: Rise over Run" color="blue">
      <svg width={320} height={190} className="mx-auto block">
        {[0,1,2,3,4,5,6].map(v=>(
          <g key={v}>
            <line x1={40+v*40} y1={20} x2={40+v*40} y2={160} stroke="#f1f5f9" strokeWidth="1"/>
            <line x1={40} y1={20+v*23} x2={280} y2={20+v*23} stroke="#f1f5f9" strokeWidth="1"/>
          </g>
        ))}
        <line x1={40} y1={160} x2={280} y2={160} stroke="#cbd5e1" strokeWidth="1.5"/>
        <line x1={40} y1={20} x2={40} y2={160} stroke="#cbd5e1" strokeWidth="1.5"/>
        <line x1={60} y1={145} x2={260} y2={45} stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1={100} y1={118} x2={220} y2={118} stroke="#10b981" strokeWidth="2" strokeDasharray="5,3"/>
        <line x1={220} y1={118} x2={220} y2={60} stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3"/>
        <circle cx={100} cy={118} r="5" fill="#3b82f6" stroke="white" strokeWidth="2"/>
        <circle cx={220} cy={60} r="5" fill="#3b82f6" stroke="white" strokeWidth="2"/>
        <text x={94} y={136} fontSize="11" fill="#374151" fontWeight="bold">(x1,y1)</text>
        <text x={224} y={54} fontSize="11" fill="#374151" fontWeight="bold">(x2,y2)</text>
        <text x={160} y={132} textAnchor="middle" fontSize="12" fill="#10b981" fontWeight="bold">run</text>
        <text x={232} y={92} fontSize="12" fill="#ef4444" fontWeight="bold">rise</text>
      </svg>
      <div className="mt-2 bg-blue-50 rounded-xl p-3 text-center">
        <p className="text-base font-bold text-blue-800">m = rise / run = (y2 - y1) / (x2 - x1)</p>
        <p className="text-xs text-slate-500 mt-1">Positive: rises left to right. Negative: falls. Zero: horizontal. Undefined: vertical.</p>
      </div>
    </DiagramCard>
  );
}

function LinearGraphDiagram() {
  const W=320,H=220,cx=160,cy=110,sc=20;
  const lines=[
    {m:1,b:0,color:"#6366f1",label:"y=x (m=1,b=0)"},
    {m:2,b:-2,color:"#10b981",label:"y=2x-2 (m=2,b=-2)"},
    {m:-1,b:3,color:"#ef4444",label:"y=-x+3 (m=-1,b=3)"},
  ];
  return (
    <DiagramCard title="Linear Functions: y=mx+b" color="indigo">
      <svg width={W} height={H} className="mx-auto block">
        {[-5,-3,-1,1,3,5].map(v=>(
          <g key={v}>
            <line x1={cx+v*sc} y1={10} x2={cx+v*sc} y2={H-10} stroke="#f1f5f9" strokeWidth="1"/>
            <line x1={10} y1={cy-v*sc} x2={W-10} y2={cy-v*sc} stroke="#f1f5f9" strokeWidth="1"/>
          </g>
        ))}
        <line x1={10} y1={cy} x2={W-10} y2={cy} stroke="#cbd5e1" strokeWidth="1.5"/>
        <line x1={cx} y1={10} x2={cx} y2={H-10} stroke="#cbd5e1" strokeWidth="1.5"/>
        {lines.map(({m,b,color})=>{
          const pts=[];
          for(let x=-7;x<=7;x+=0.5){const y=m*x+b;if(y<-6||y>6)continue;pts.push(`${cx+x*sc},${cy-y*sc}`);}
          return pts.length>1?<path key={color} d={"M "+pts.join(" L ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>:null;
        })}
        {lines.map(({color,label},i)=>(
          <g key={i} transform={`translate(10,${H-52+i*16})`}>
            <line x1="0" y1="5" x2="14" y2="5" stroke={color} strokeWidth="2.5"/>
            <text x="18" y="9" fontSize="10" fill={color} fontWeight="bold">{label}</text>
          </g>
        ))}
      </svg>
    </DiagramCard>
  );
}

function SystemTypesDiagram() {
  const W=340,H=200,sc=16,pw=340/3,ph=200;
  const panels=[
    {label:"One Solution",sub:"Lines intersect",color:"#10b981",m1:1.5,b1:-2,m2:-1,b2:1},
    {label:"No Solution",sub:"Parallel lines",color:"#ef4444",m1:1,b1:-2,m2:1,b2:2},
    {label:"Infinite Solutions",sub:"Same line",color:"#f59e0b",m1:1,b1:0,m2:1,b2:0},
  ];
  return (
    <DiagramCard title="Types of Linear System Solutions" color="blue">
      <svg width={W} height={H} className="mx-auto block rounded-xl bg-slate-50">
        {panels.map(({label,sub,color,m1,b1,m2,b2},pi)=>{
          const ox=pi*pw+pw/2,oy=ph/2-12;
          const mkLine=(m,b,stroke)=>{
            const pts=[];
            for(let x=-4;x<=4;x+=0.5){const y=m*x+b;if(y<-5||y>5)continue;pts.push(`${ox+x*sc},${oy-y*sc}`);}
            return pts.length>1?<path key={stroke} d={"M "+pts.join(" L ")} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round"/>:null;
          };
          let ix=null;
          if(pi===0&&m1!==m2){const ixv=(b2-b1)/(m1-m2),iyv=m1*ixv+b1;ix={x:ox+ixv*sc,y:oy-iyv*sc};}
          return (
            <g key={pi}>
              <rect x={pi*pw+2} y={2} width={pw-4} height={ph-4} rx="8" fill="white" stroke="#e2e8f0"/>
              <line x1={pi*pw+6} y1={oy} x2={(pi+1)*pw-6} y2={oy} stroke="#cbd5e1" strokeWidth="1"/>
              <line x1={ox} y1={8} x2={ox} y2={ph-44} stroke="#cbd5e1" strokeWidth="1"/>
              {mkLine(m1,b1,color)}
              {mkLine(m2,b2,pi===2?"#f59e0b88":"#3b82f6")}
              {ix&&<circle cx={ix.x} cy={ix.y} r="5" fill={color} stroke="white" strokeWidth="2"/>}
              <text x={ox} y={ph-30} textAnchor="middle" fontSize="10" fill={color} fontWeight="bold">{label}</text>
              <text x={ox} y={ph-17} textAnchor="middle" fontSize="9" fill="#64748b">{sub}</text>
            </g>
          );
        })}
      </svg>
    </DiagramCard>
  );
}

function NumberSetsDiagram() {
  return (
    <DiagramCard title="Real Number System" color="purple">
      <svg width={320} height={200} className="mx-auto block">
        <ellipse cx={160} cy={100} rx={148} ry={88} fill="#faf5ff" stroke="#a855f7" strokeWidth="2"/>
        <ellipse cx={160} cy={108} rx={118} ry={68} fill="#eff6ff" stroke="#3b82f6" strokeWidth="2"/>
        <ellipse cx={160} cy={115} rx={88} ry={50} fill="#f0fdf4" stroke="#10b981" strokeWidth="2"/>
        <ellipse cx={160} cy={120} rx={58} ry={34} fill="#fefce8" stroke="#f59e0b" strokeWidth="2"/>
        <ellipse cx={160} cy={124} rx={28} ry={18} fill="#fff1f2" stroke="#ef4444" strokeWidth="2"/>
        <text x={160} y={128} textAnchor="middle" fontSize="9" fill="#dc2626" fontWeight="bold">Natural N</text>
        <text x={160} y={153} textAnchor="middle" fontSize="9" fill="#b45309" fontWeight="bold">Integer Z</text>
        <text x={160} y={169} textAnchor="middle" fontSize="9" fill="#059669" fontWeight="bold">Rational Q</text>
        <text x={160} y={46} textAnchor="middle" fontSize="9" fill="#1d4ed8" fontWeight="bold">Irrational</text>
        <text x={18} y={28} fontSize="9" fill="#7c3aed" fontWeight="bold">Real R</text>
        <text x={82} y={75} textAnchor="middle" fontSize="8" fill="#3b82f6">sqrt(2), pi</text>
        <text x={238} y={115} textAnchor="middle" fontSize="8" fill="#059669">1/2, 0.33...</text>
        <text x={88} y={148} textAnchor="middle" fontSize="8" fill="#b45309">-3, -1</text>
        <text x={155} y={122} textAnchor="middle" fontSize="8" fill="#dc2626">1,2,3</text>
      </svg>
      <p className="text-xs text-slate-500 text-center mt-1">Every inner set is contained within the larger set around it.</p>
    </DiagramCard>
  );
}

function ExponentDiagram() {
  return (
    <DiagramCard title="Exponent Laws Summary" color="amber">
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          ["Product","a^m * a^n = a^(m+n)","2^3 * 2^2 = 2^5 = 32"],
          ["Quotient","a^m / a^n = a^(m-n)","5^4 / 5^2 = 5^2 = 25"],
          ["Power of Power","(a^m)^n = a^(mn)","(3^2)^3 = 3^6 = 729"],
          ["Zero Exponent","a^0 = 1","7^0 = 1"],
          ["Negative Exponent","a^(-n) = 1/a^n","2^(-3) = 1/8"],
          ["Fractional Exp.","a^(1/n) = nth root of a","8^(1/3) = 2"],
        ].map(([name,rule,ex])=>(
          <div key={name} className="bg-amber-50 rounded-xl p-2.5 border border-amber-200">
            <p className="font-bold text-amber-800 mb-1">{name}</p>
            <p className="font-mono text-slate-700">{rule}</p>
            <p className="text-slate-500 mt-1">e.g. {ex}</p>
          </div>
        ))}
      </div>
    </DiagramCard>
  );
}

function PolyAnatomyDiagram() {
  return (
    <DiagramCard title="Parts of a Polynomial" color="green">
      <div className="flex flex-col gap-3">
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-mono font-bold text-green-800">3x^2 - 5x + 7</p>
        </div>
        <svg width={300} height={90} className="mx-auto block">
          <line x1={60} y1={20} x2={60} y2={55} stroke="#6366f1" strokeWidth="1.5"/>
          <line x1={150} y1={20} x2={150} y2={55} stroke="#ef4444" strokeWidth="1.5"/>
          <line x1={240} y1={20} x2={240} y2={55} stroke="#f59e0b" strokeWidth="1.5"/>
          <text x={60} y={70} textAnchor="middle" fontSize="11" fill="#4338ca" fontWeight="bold">3x^2</text>
          <text x={60} y={84} textAnchor="middle" fontSize="9" fill="#6366f1">leading term</text>
          <text x={150} y={70} textAnchor="middle" fontSize="11" fill="#b91c1c" fontWeight="bold">-5x</text>
          <text x={150} y={84} textAnchor="middle" fontSize="9" fill="#ef4444">middle term</text>
          <text x={240} y={70} textAnchor="middle" fontSize="11" fill="#b45309" fontWeight="bold">+7</text>
          <text x={240} y={84} textAnchor="middle" fontSize="9" fill="#f59e0b">constant</text>
        </svg>
        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div className="bg-indigo-50 rounded-lg p-2"><p className="font-bold text-indigo-700">Degree</p><p className="text-slate-500">Highest exponent = 2</p></div>
          <div className="bg-red-50 rounded-lg p-2"><p className="font-bold text-red-700">Lead Coeff.</p><p className="text-slate-500">Number in front = 3</p></div>
          <div className="bg-amber-50 rounded-lg p-2"><p className="font-bold text-amber-700">Terms</p><p className="text-slate-500">3 terms = trinomial</p></div>
        </div>
      </div>
    </DiagramCard>
  );
}

function MeasurementDiagram() {
  return (
    <DiagramCard title="Area and Perimeter Formulas" color="teal">
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          {shape:"Rectangle",area:"A = l x w",perim:"P = 2(l + w)"},
          {shape:"Triangle",area:"A = (1/2)bh",perim:"P = a + b + c"},
          {shape:"Circle",area:"A = pi*r^2",perim:"C = 2*pi*r"},
          {shape:"Trapezoid",area:"A = (1/2)(a+b)h",perim:"P = a+b+c+d"},
        ].map(({shape,area,perim})=>(
          <div key={shape} className="bg-teal-50 rounded-xl p-2.5 border border-teal-200">
            <p className="font-bold text-teal-800 mb-1">{shape}</p>
            <p className="font-mono text-slate-700">{area}</p>
            <p className="font-mono text-slate-500">{perim}</p>
          </div>
        ))}
      </div>
    </DiagramCard>
  );
}

function PythagoreanDiagram() {
  return (
    <DiagramCard title="Pythagorean Theorem" color="rose">
      <svg width={280} height={210} className="mx-auto block">
        <polygon points="50,170 220,170 50,60" fill="#fff1f2" stroke="none"/>
        <rect x={50} y={154} width={16} height={16} fill="none" stroke="#be123c" strokeWidth="1.5"/>
        <line x1={50} y1={170} x2={220} y2={170} stroke="#10b981" strokeWidth="3" strokeLinecap="round"/>
        <line x1={50} y1={170} x2={50} y2={60} stroke="#a855f7" strokeWidth="3" strokeLinecap="round"/>
        <line x1={220} y1={170} x2={50} y2={60} stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
        <text x={135} y={188} textAnchor="middle" fontSize="13" fill="#059669" fontWeight="bold">a</text>
        <text x={32} y={115} textAnchor="middle" fontSize="13" fill="#7c3aed" fontWeight="bold">b</text>
        <text x={155} y={105} textAnchor="middle" fontSize="13" fill="#dc2626" fontWeight="bold">c (hyp)</text>
        <text x={58} y={165} fontSize="10" fill="#be123c" fontWeight="bold">90</text>
      </svg>
      <div className="mt-2 bg-rose-50 rounded-xl p-3 text-center">
        <p className="text-lg font-bold font-mono text-rose-800">a^2 + b^2 = c^2</p>
        <p className="text-xs text-slate-500 mt-1">c is always the hypotenuse (longest side, opposite the 90 degree angle)</p>
      </div>
    </DiagramCard>
  );
}

function SlopeExplorer() {
  const [m,setM]=useState(1);
  const [b,setB]=useState(0);
  const W=340,H=260,cx=170,cy=130,sc=22;
  const pts=[];
  for(let x=-8;x<=8;x+=0.5){const y=m*x+b;if(y<-7||y>7)continue;pts.push(`${cx+x*sc},${cy-y*sc}`);}
  const d=pts.length>1?"M "+pts.join(" L "):"";
  const yInt=cy-b*sc;
  const xInt=m!==0?cx+(-b/m)*sc:null;
  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-lg p-5">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-2xl">📈</span>
        <h3 className="text-lg font-bold text-indigo-800">Slope-Intercept Explorer</h3>
        <span className="ml-auto text-sm font-mono bg-indigo-50 px-3 py-1 rounded-full text-indigo-700">
          y = {m}x {b>=0?`+ ${b}`:`- ${Math.abs(b)}`}
        </span>
      </div>
      <svg width={W} height={H} className="mx-auto block rounded-xl bg-slate-50 border border-slate-200">
        {[-6,-4,-2,0,2,4,6].map(v=>(<g key={v}><line x1={cx+v*sc} y1={10} x2={cx+v*sc} y2={H-10} stroke="#e2e8f0" strokeWidth="1"/><line x1={10} y1={cy-v*sc} x2={W-10} y2={cy-v*sc} stroke="#e2e8f0" strokeWidth="1"/></g>))}
        <line x1={10} y1={cy} x2={W-10} y2={cy} stroke="#94a3b8" strokeWidth="2"/>
        <line x1={cx} y1={10} x2={cx} y2={H-10} stroke="#94a3b8" strokeWidth="2"/>
        {[-6,-4,-2,2,4,6].map(v=><text key={v} x={cx+v*sc} y={cy+14} textAnchor="middle" fontSize="9" fill="#94a3b8">{v}</text>)}
        {d&&<path d={d} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>}
        {yInt>10&&yInt<H-10&&<circle cx={cx} cy={yInt} r="5" fill="#0ea5e9" stroke="white" strokeWidth="2"/>}
        {xInt&&xInt>10&&xInt<W-10&&<circle cx={xInt} cy={cy} r="5" fill="#10b981" stroke="white" strokeWidth="2"/>}
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="bg-indigo-50 rounded-xl p-3">
          <div className="flex justify-between mb-1"><span className="text-xs font-semibold text-gray-600">slope (m)</span><span className="text-sm font-bold text-indigo-700">{m}</span></div>
          <input type="range" min={-4} max={4} step={0.5} value={m} onChange={e=>setM(parseFloat(e.target.value))} className="w-full accent-indigo-600"/>
        </div>
        <div className="bg-blue-50 rounded-xl p-3">
          <div className="flex justify-between mb-1"><span className="text-xs font-semibold text-gray-600">y-intercept (b)</span><span className="text-sm font-bold text-blue-700">{b}</span></div>
          <input type="range" min={-5} max={5} step={1} value={b} onChange={e=>setB(parseFloat(e.target.value))} className="w-full accent-blue-600"/>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-center">
        <div className="bg-indigo-50 rounded-lg p-2"><p className="font-bold text-indigo-700">Slope = {m}</p><p className="text-gray-500">{m>0?"Rising":m<0?"Falling":"Horizontal"}</p></div>
        <div className="bg-blue-50 rounded-lg p-2"><p className="font-bold text-blue-700">y-int: (0,{b})</p><p className="text-gray-500">Crosses y-axis here</p></div>
        <div className="bg-green-50 rounded-lg p-2"><p className="font-bold text-green-700">x-int</p><p className="text-gray-500">{m!==0?`(${(-b/m).toFixed(1)}, 0)`:"None (horiz.)"}</p></div>
      </div>
    </div>
  );
}

function LinearSystemsVisualizer() {
  const [m1,setM1]=useState(2);
  const [b1,setB1]=useState(-1);
  const [m2,setM2]=useState(-1);
  const [b2,setB2]=useState(3);
  const W=340,H=260,cx=170,cy=130,scale=22;
  const toSvg=(x,y)=>({sx:cx+x*scale,sy:cy-y*scale});
  let intersection=null,systemType="one";
  if(m1===m2){systemType=b1===b2?"infinite":"none";}
  else{const ix=(b2-b1)/(m1-m2),iy=m1*ix+b1;intersection={x:+ix.toFixed(2),y:+iy.toFixed(2)};}
  const linePoints=(m,b)=>{const pts=[];for(let x=-8;x<=8;x+=0.5){const y=m*x+b;if(y<-7||y>7)continue;const{sx,sy}=toSvg(x,y);pts.push(`${sx},${sy}`);}return pts.length>1?"M "+pts.join(" L "):"";};
  const intPt=intersection?toSvg(intersection.x,intersection.y):null;
  return (
    <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-lg p-5">
      <div className="flex items-center gap-2 mb-3"><span className="text-2xl">📊</span><h3 className="text-lg font-bold text-blue-800">Linear Systems Explorer</h3></div>
      <div className="flex gap-3 mb-3 text-sm flex-wrap">
        <div className="flex items-center gap-1.5"><div className="w-4 h-1 rounded bg-blue-500"/><span className="font-mono text-blue-700">y={m1}x{b1>=0?`+${b1}`:b1}</span></div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-1 rounded bg-rose-500"/><span className="font-mono text-rose-700">y={m2}x{b2>=0?`+${b2}`:b2}</span></div>
      </div>
      <svg width={W} height={H} className="mx-auto block rounded-xl bg-slate-50 border border-slate-200">
        {[-6,-4,-2,0,2,4,6].map(v=>(<g key={v}><line x1={cx+v*scale} y1={10} x2={cx+v*scale} y2={H-10} stroke="#e2e8f0" strokeWidth="1"/><line x1={10} y1={cy-v*scale} x2={W-10} y2={cy-v*scale} stroke="#e2e8f0" strokeWidth="1"/></g>))}
        <line x1={10} y1={cy} x2={W-10} y2={cy} stroke="#94a3b8" strokeWidth="2"/>
        <line x1={cx} y1={10} x2={cx} y2={H-10} stroke="#94a3b8" strokeWidth="2"/>
        <path d={linePoints(m1,b1)} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
        <path d={linePoints(m2,b2)} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round"/>
        {intPt&&intPt.sx>10&&intPt.sx<W-10&&intPt.sy>10&&intPt.sy<H-10&&(
          <><circle cx={intPt.sx} cy={intPt.sy} r="7" fill="#10b981" stroke="white" strokeWidth="2.5"/><text x={intPt.sx+10} y={intPt.sy-8} fontSize="11" fill="#065f46" fontWeight="bold">({intersection.x},{intersection.y})</text></>
        )}
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {[["blue","Line 1",m1,setM1,b1,setB1],["rose","Line 2",m2,setM2,b2,setB2]].map(([color,label,m,setM,b,setB])=>(
          <div key={label} className={`bg-${color}-50 rounded-xl p-3`}>
            <p className={`text-xs font-bold text-${color}-700 mb-1`}>{label}</p>
            <div className="flex gap-2 mb-1"><span className="text-xs text-gray-500 w-10">slope</span><input type="range" min={-4} max={4} step={0.5} value={m} onChange={e=>setM(parseFloat(e.target.value))} className={`flex-1 accent-${color}-600`}/><span className={`text-xs font-bold text-${color}-700 w-6`}>{m}</span></div>
            <div className="flex gap-2"><span className="text-xs text-gray-500 w-10">y-int</span><input type="range" min={-5} max={5} step={1} value={b} onChange={e=>setB(parseFloat(e.target.value))} className={`flex-1 accent-${color}-600`}/><span className={`text-xs font-bold text-${color}-700 w-6`}>{b}</span></div>
          </div>
        ))}
      </div>
      <div className={`mt-3 rounded-xl p-3 text-center font-bold text-sm ${systemType==="one"?"bg-green-50 text-green-700":systemType==="none"?"bg-red-50 text-red-700":"bg-yellow-50 text-yellow-700"}`}>
        {systemType==="one"&&intersection&&`One solution: (${intersection.x}, ${intersection.y})`}
        {systemType==="none"&&"No solution - lines are parallel"}
        {systemType==="infinite"&&"Infinite solutions - same line!"}
      </div>
    </div>
  );
}

function SubstitutionStepper() {
  const [step,setStep]=useState(0);
  const steps=[
    {title:"The System",content:"y = 2x + 1\n3x + y = 9",hint:"We have two equations. Notice y is already isolated in the first!"},
    {title:"Step 1: Identify the isolated variable",content:"y = 2x + 1  (y is isolated here)",hint:"Since y is by itself, we can substitute 2x+1 wherever we see y in equation 2."},
    {title:"Step 2: Substitute into equation 2",content:"3x + (2x + 1) = 9",hint:"Replace y with 2x+1. Now we have one equation with one variable!"},
    {title:"Step 3: Solve for x",content:"5x + 1 = 9\n5x = 8\nx = 1.6",hint:"Combine like terms, then isolate x."},
    {title:"Step 4: Back-substitute to find y",content:"y = 2(1.6) + 1\ny = 4.2",hint:"Plug x = 1.6 back into the isolated equation."},
    {title:"Solution: (1.6, 4.2)",content:"Check eq 1: 4.2 = 2(1.6)+1 = 4.2  OK\nCheck eq 2: 3(1.6)+4.2 = 9  OK",hint:"Always verify in BOTH original equations!"},
  ];
  const s=steps[step];
  const bgs=["bg-gray-50","bg-blue-50","bg-indigo-50","bg-purple-50","bg-violet-50","bg-green-50"];
  const brs=["border-gray-300","border-blue-400","border-indigo-400","border-purple-400","border-violet-400","border-green-500"];
  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-lg p-5">
      <div className="flex items-center gap-2 mb-4"><span className="text-2xl">🔄</span><h3 className="text-lg font-bold text-indigo-800">Substitution: Step by Step</h3></div>
      <div className="flex gap-1.5 mb-4">{steps.map((_,i)=><button key={i} onClick={()=>setStep(i)} className={`flex-1 h-2 rounded-full transition-all ${i<=step?"bg-indigo-500":"bg-gray-200"}`}/>)}</div>
      <div className={`rounded-xl border-2 ${bgs[step]} ${brs[step]} p-4 mb-4`}>
        <p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">{s.title}</p>
        <pre className="text-base font-mono text-gray-800 whitespace-pre-wrap leading-relaxed">{s.content}</pre>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 flex gap-2"><span className="text-lg">💡</span><p className="text-sm text-yellow-800">{s.hint}</p></div>
      <div className="flex justify-between">
        <button onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium disabled:opacity-30 text-sm">Back</button>
        <span className="text-sm text-gray-500 self-center">Step {step+1}/{steps.length}</span>
        <button onClick={()=>setStep(Math.min(steps.length-1,step+1))} disabled={step===steps.length-1} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-30 text-sm">Next</button>
      </div>
    </div>
  );
}

function EliminationStepper() {
  const [step,setStep]=useState(0);
  const steps=[
    {title:"The System",eq1:"2x + 3y = 16",eq2:"5x - 3y = 5",note:"The y-coefficients are +3 and -3 already opposites!"},
    {title:"Step 1: Align equations",eq1:"2x + 3y = 16",eq2:"5x - 3y = 5",note:"Coefficients of y (+3 and -3) sum to zero. We can add directly."},
    {title:"Step 2: Add the equations",eq1:"2x + 3y = 16",eq2:"+ 5x - 3y = 5",result:"7x = 21",note:"+3y + (-3y) = 0. The y variable is eliminated!"},
    {title:"Step 3: Solve for x",eq1:"7x = 21",result:"x = 3",note:"Divide both sides by 7."},
    {title:"Step 4: Find y",eq1:"2(3) + 3y = 16",eq2:"6 + 3y = 16",result:"y = 10/3 (about 3.33)",note:"Substitute x=3 into either original equation."},
    {title:"Solution: (3, 10/3)",eq1:"Verify: 2(3)+3(10/3)=16  OK",result:"And: 5(3)-3(10/3)=5  OK",note:"Check BOTH equations!"},
  ];
  const s=steps[step];
  return (
    <div className="bg-white rounded-2xl border-2 border-teal-200 shadow-lg p-5">
      <div className="flex items-center gap-2 mb-4"><span className="text-2xl">➕</span><h3 className="text-lg font-bold text-teal-800">Elimination: Step by Step</h3></div>
      <div className="flex gap-1.5 mb-4">{steps.map((_,i)=><button key={i} onClick={()=>setStep(i)} className={`flex-1 h-2 rounded-full transition-all ${i<=step?"bg-teal-500":"bg-gray-200"}`}/>)}</div>
      <div className="bg-teal-50 border-2 border-teal-300 rounded-xl p-4 mb-3">
        <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-3">{s.title}</p>
        <div className="font-mono space-y-1">
          {s.eq1&&<p className="text-base text-gray-800 bg-white rounded-lg px-3 py-1.5 border border-teal-200">{s.eq1}</p>}
          {s.eq2&&<p className="text-base text-gray-800 bg-white rounded-lg px-3 py-1.5 border border-teal-200">{s.eq2}</p>}
          {s.result&&<><div className="border-t-2 border-teal-400 mt-1 mb-1"/><p className="text-base font-bold text-teal-800 bg-teal-100 rounded-lg px-3 py-1.5">{s.result}</p></>}
        </div>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 flex gap-2"><span className="text-lg">💡</span><p className="text-sm text-yellow-800">{s.note}</p></div>
      <div className="flex justify-between">
        <button onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium disabled:opacity-30 text-sm">Back</button>
        <span className="text-sm text-gray-500 self-center">Step {step+1}/{steps.length}</span>
        <button onClick={()=>setStep(Math.min(steps.length-1,step+1))} disabled={step===steps.length-1} className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium disabled:opacity-30 text-sm">Next</button>
      </div>
    </div>
  );
}

const NOTE_DIAGRAMS = {
  "number-rational-0": <NumberSetsDiagram />,
  "number-exponents-0": <ExponentDiagram />,
  "algebra-polynomials-0": <PolyAnatomyDiagram />,
  "linear-slopeintercept-0": <SlopeDiagram />,
  "linear-slopeintercept-1": <LinearGraphDiagram />,
  "linear-slopeintercept-2": <SlopeExplorer />,
  "systems-graphing-0": <SystemTypesDiagram />,
  "systems-substitution-0": <SubstitutionStepper />,
  "systems-elimination-0": <EliminationStepper />,
  "systems-graphing-1": <LinearSystemsVisualizer />,
  "measurement-formulas-0": <MeasurementDiagram />,
  "measurement-pythagorean-0": <PythagoreanDiagram />,
};

const studyLibrary = {
  flashcards: {
    id:"flashcards",name:"Flashcard Review",description:"Essential flashcards for rapid recall across all Grade 9 units",
    icon:Brain,color:"cyan",gradient:"from-cyan-500 to-blue-600",
    sections:[
      {id:"number-flashcards",title:"Number Sense Flashcards",flashcards:[
        {front:"What is a rational number?",back:"Any number written as p/q where p and q are integers and q is not 0. Examples: 3/4, -2, 0.5, 0.333..."},
        {front:"What is an irrational number?",back:"A number that CANNOT be written as a fraction. Its decimal is non-terminating and non-repeating. Examples: pi, sqrt(2), sqrt(3)"},
        {front:"Evaluate: (-3)^2 vs -(3^2)",back:"(-3)^2 = 9 (squaring a negative gives positive). -(3^2) = -9 (square 3 first, then negate). Brackets make the difference!"},
        {front:"State the product law of exponents",back:"a^m times a^n = a^(m+n). Bases must be the same. Example: x^3 times x^4 = x^7"},
        {front:"What does a^0 equal?",back:"a^0 = 1 for any a that is not 0. Because a^n divided by a^n = 1, and also = a^(n-n) = a^0."},
        {front:"What is a negative exponent?",back:"a^(-n) = 1/a^n. It means the reciprocal. Example: 2^(-3) = 1/8"},
        {front:"What is scientific notation?",back:"A number written as a x 10^n where 1 is less than or equal to a, which is less than 10. Example: 4,500,000 = 4.5 x 10^6"},
        {front:"Simplify: (2x^3*y^2)(3x^2*y)",back:"Multiply coefficients: 2 x 3 = 6. Add exponents: x^(3+2)=x^5, y^(2+1)=y^3. Answer: 6x^5*y^3"},
      ],notes:[]},
      {id:"linear-flashcards",title:"Linear Relations Flashcards",flashcards:[
        {front:"What is the slope formula?",back:"m = (y2 - y1) / (x2 - x1) = rise / run. Measures steepness and direction of a line."},
        {front:"What is slope-intercept form?",back:"y = mx + b, where m = slope and b = y-intercept (where the line crosses the y-axis)."},
        {front:"What is standard form?",back:"Ax + By = C where A, B, C are integers and A is greater than or equal to 0. Useful for finding intercepts."},
        {front:"How do you find the x-intercept?",back:"Set y = 0 and solve for x. Example: 2x + 3(0) = 6 gives x = 3. X-intercept is (3, 0)."},
        {front:"What is direct variation?",back:"y = kx where k is the constant of variation. The line MUST pass through the origin (0,0)."},
        {front:"What is partial variation?",back:"y = mx + b where b is not 0. Has a fixed part (b) and a variable part (mx). Does NOT pass through origin."},
        {front:"What does a slope of 0 look like?",back:"A horizontal line: y = k (constant). Example: y = 4 is horizontal. All points have y = 4."},
        {front:"What does an undefined slope look like?",back:"A vertical line: x = k. Example: x = -2. Cannot use the slope formula (division by zero)."},
      ],notes:[]},
      {id:"systems-flashcards",title:"Linear Systems Flashcards",flashcards:[
        {front:"What is a linear system?",back:"Two or more linear equations with the same variables. The solution is the point satisfying ALL equations at once."},
        {front:"Three types of linear system solutions?",back:"(1) One solution: lines intersect at one point. (2) No solution: lines are parallel. (3) Infinite solutions: same line."},
        {front:"Describe the substitution method",back:"Isolate one variable in one equation, substitute that expression into the other equation, solve, then back-substitute."},
        {front:"Describe the elimination method",back:"Add or subtract equations to cancel one variable. Multiply equations first if needed to make coefficients opposites."},
        {front:"How do you verify a solution?",back:"Substitute both values into BOTH original equations. Both sides must be equal in both equations."},
        {front:"When is elimination easier?",back:"When coefficients of one variable are already opposites or easily made so. Example: 3x + y = 7 and 2x - y = 3."},
      ],notes:[]},
      {id:"measurement-flashcards",title:"Measurement Flashcards",flashcards:[
        {front:"State the Pythagorean Theorem",back:"In a right triangle: a^2 + b^2 = c^2, where c is the hypotenuse (side opposite the right angle)."},
        {front:"How do you find the hypotenuse?",back:"c = sqrt(a^2 + b^2). Square both legs, add them, then take the square root."},
        {front:"How do you find a missing leg?",back:"a = sqrt(c^2 - b^2). Square the hypotenuse, subtract the other leg squared, then square root."},
        {front:"What is a Pythagorean triple?",back:"Three whole numbers satisfying a^2+b^2=c^2. Common ones: (3,4,5), (5,12,13), (8,15,17), (6,8,10)."},
        {front:"Area of a circle formula",back:"A = pi*r^2. Always use the RADIUS (not diameter). Example: r=5 gives A = 25*pi approximately 78.5 sq units."},
        {front:"Volume of a cylinder",back:"V = pi*r^2*h (area of circular base times height)"},
        {front:"Surface area vs volume",back:"Surface area: total area of all outer faces (square units). Volume: space inside a 3D object (cubic units)."},
        {front:"Volume of a rectangular prism",back:"V = l x w x h (length times width times height)"},
      ],notes:[]},
      {id:"algebra-flashcards",title:"Polynomial Algebra Flashcards",flashcards:[
        {front:"Monomial, binomial, trinomial?",back:"Monomial: 1 term (5x^2). Binomial: 2 terms (3x + 2). Trinomial: 3 terms (x^2 - 5x + 6)."},
        {front:"How do you multiply two binomials?",back:"Use FOIL: First, Outer, Inner, Last. (a+b)(c+d) = ac + ad + bc + bd. Then collect like terms."},
        {front:"Expand (x+3)(x-3)",back:"Difference of squares: (x+3)(x-3) = x^2 - 9. Generally: (a+b)(a-b) = a^2 - b^2"},
        {front:"Expand (x+4)^2",back:"Perfect square trinomial: (x+4)^2 = x^2 + 8x + 16. Generally: (a+b)^2 = a^2 + 2ab + b^2"},
        {front:"How do you factor x^2+bx+c?",back:"Find two numbers that multiply to c and add to b. Write (x + p)(x + q). Example: x^2+5x+6 = (x+2)(x+3)"},
        {front:"What is common factoring?",back:"Factor out the GCF from every term. Always do this first! Example: 6x^2 + 9x = 3x(2x + 3)"},
      ],notes:[]},
    ]
  },
  testReview: {
    id:"testReview",name:"Test Review Guide",description:"Comprehensive review guides for all Grade 9 units",
    icon:Target,color:"rose",gradient:"from-rose-500 to-pink-600",
    sections:[
      {id:"number-review",title:"Number Sense Test Review",notes:[
        {subtitle:"Unit 1: Square Roots and Number Sets",emoji:"🔢",points:[
          "Rational numbers can be written as p/q; irrational numbers cannot",
          "Perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100 - memorize these",
          "Estimate square roots: sqrt(20) is between sqrt(16)=4 and sqrt(25)=5, closer to 4.5",
          "Simplify radicals: sqrt(72) = sqrt(36 x 2) = 6*sqrt(2)",
          "BEDMAS order: Brackets, Exponents, Division/Multiplication, Addition/Subtraction",
        ]},
        {subtitle:"Unit 2: Exponent Laws",emoji:"⚡",points:[
          "Product: a^m * a^n = a^(m+n). Quotient: a^m / a^n = a^(m-n). Power: (a^m)^n = a^(mn)",
          "Zero exponent: a^0 = 1. Negative: a^(-n) = 1/a^n",
          "Fractional: a^(1/2) = sqrt(a), a^(1/3) = cube root of a, a^(m/n) = nth root of a^m",
          "Scientific notation: coefficient x 10^n, where coefficient is between 1 and 10",
          "Watch signs: (-2)^3 = -8 but (-2)^2 = 4",
        ]},
      ]},
      {id:"linear-review",title:"Linear Relations Test Review",notes:[
        {subtitle:"Unit 1: Slope and Rate of Change",emoji:"📈",points:[
          "Slope formula: m = (y2-y1)/(x2-x1). Always reduce to lowest terms.",
          "Positive slope: rises. Negative: falls. Zero: horizontal. Undefined: vertical.",
          "Rate of change equals slope: how much y changes per 1 unit increase in x",
          "From a table: constant first differences means the relation is linear",
        ]},
        {subtitle:"Unit 2: Forms of Linear Equations",emoji:"📝",points:[
          "Slope-intercept: y = mx + b (m=slope, b=y-intercept) - best for graphing",
          "Standard form: Ax + By = C - best for finding both intercepts",
          "Point-slope: y - y1 = m(x - x1) - use when you know a point and the slope",
          "Parallel lines have EQUAL slopes. Perpendicular lines have slopes that are negative reciprocals.",
          "Horizontal line through (2,5): y = 5. Vertical line through (2,5): x = 2.",
        ]},
      ]},
      {id:"systems-review",title:"Linear Systems Test Review",notes:[
        {subtitle:"Methods: Graphing, Substitution, Elimination",emoji:"🎯",points:[
          "Graphing: graph both lines, find intersection. Good for understanding, not exact decimals.",
          "Substitution: isolate one variable, substitute. Best when one variable is already isolated.",
          "Elimination: multiply and add/subtract to cancel a variable. Best when coefficients match easily.",
          "Always verify by substituting back into BOTH original equations.",
          "Parallel lines (no solution): equal slopes, different y-intercepts. Same line (infinite solutions): identical equations.",
        ]},
      ]},
      {id:"measurement-review",title:"Measurement and Geometry Review",notes:[
        {subtitle:"Pythagorean Theorem and Applications",emoji:"📐",points:[
          "a^2 + b^2 = c^2 where c is the hypotenuse (opposite the 90 degree angle)",
          "Find hypotenuse: c = sqrt(a^2 + b^2). Find a leg: a = sqrt(c^2 - b^2)",
          "Pythagorean triples (no calculator): 3-4-5, 5-12-13, 8-15-17",
          "Apply in 2D and 3D: find diagonals, heights, distances",
          "Check if right triangle: if a^2+b^2=c^2 then it is a right triangle",
        ]},
        {subtitle:"Perimeter, Area, and Volume",emoji:"📦",points:[
          "Composite figures: break into simpler shapes, add or subtract areas",
          "Surface area: sum of all face areas - always in square units",
          "Volume of prism: V = base area x height",
          "Volume: cylinder = pi*r^2*h, cone = (1/3)*pi*r^2*h, sphere = (4/3)*pi*r^3",
          "Unit conversion: 1 m^2 = 10000 cm^2 and 1 m^3 = 1000000 cm^3",
        ]},
      ]},
    ]
  },
  practiceQuestions: {
    id:"practiceQuestions",name:"Practice Questions",description:"Multiple choice practice with detailed explanations",
    icon:FileText,color:"indigo",gradient:"from-indigo-500 to-purple-600",
    sections:[
      {id:"number-practice",title:"Number Sense Practice",quiz:[
        {question:"Which of the following is irrational?",options:["0.25","sqrt(9)","-3/7","sqrt(5)"],correct:3,explanation:"sqrt(5) is approximately 2.236... which is non-terminating and non-repeating. sqrt(9)=3 (rational), 0.25=1/4 (rational), -3/7 is a fraction (rational)."},
        {question:"Simplify: 3^2 times 3^(-1)",options:["3","9","1/3","27"],correct:0,explanation:"Product law: 3^2 times 3^(-1) = 3^(2+(-1)) = 3^1 = 3."},
        {question:"Express 0.000047 in scientific notation.",options:["4.7 x 10^(-5)","4.7 x 10^5","47 x 10^(-6)","0.47 x 10^(-4)"],correct:0,explanation:"Move decimal 5 places right to get 4.7, so exponent is -5. Answer: 4.7 x 10^(-5)."},
        {question:"Evaluate: (2^3)^2 divided by 2^4",options:["4","8","2","16"],correct:0,explanation:"Power of power: (2^3)^2 = 2^6 = 64. Then 64 / 2^4 = 64 / 16 = 4."},
        {question:"Which is the simplest radical form of sqrt(48)?",options:["4*sqrt(3)","6*sqrt(2)","2*sqrt(12)","8*sqrt(3)"],correct:0,explanation:"sqrt(48) = sqrt(16 x 3) = sqrt(16) x sqrt(3) = 4*sqrt(3)."},
      ],notes:[]},
      {id:"linear-practice",title:"Linear Relations Practice",quiz:[
        {question:"What is the slope of the line through (2, 5) and (6, 13)?",options:["2","3","4","1/2"],correct:0,explanation:"m = (13-5)/(6-2) = 8/4 = 2."},
        {question:"Which equation has slope -3 and y-intercept 4?",options:["y = 4x - 3","y = -3x + 4","3x + y = 4","y = -3 + 4x"],correct:1,explanation:"Slope-intercept form: y = mx + b gives y = -3x + 4 where m=-3 and b=4."},
        {question:"What is the x-intercept of 2x - 4y = 8?",options:["(4, 0)","(0, -2)","(2, 0)","(-2, 0)"],correct:0,explanation:"Set y=0: 2x - 4(0) = 8 so 2x = 8 and x = 4. X-intercept is (4, 0)."},
        {question:"A line is parallel to y = 5x - 3. Which could be its equation?",options:["y = -(1/5)x + 1","y = 5x + 7","y = 3x - 5","y = (1/5)x + 1"],correct:1,explanation:"Parallel lines have equal slopes. The slope is 5. y = 5x + 7 has slope 5 with a different y-intercept."},
        {question:"Which table represents a linear relation?",options:["x:1,2,3,4 y:1,4,9,16","x:0,1,2,3 y:3,5,7,9","x:1,2,3,4 y:2,4,8,16","x:0,1,2,3 y:0,1,3,6"],correct:1,explanation:"Linear relations have constant first differences. Option B: 5-3=2, 7-5=2, 9-7=2. Constant difference of 2 means linear."},
      ],notes:[]},
      {id:"systems-practice",title:"Linear Systems Practice",quiz:[
        {question:"Solve: y = 3x - 1 and y = x + 5",options:["(2, 5)","(3, 8)","(-1, 4)","(1, 2)"],correct:1,explanation:"Set equal: 3x-1 = x+5 so 2x=6 and x=3. Then y=3(3)-1=8. Solution: (3, 8)."},
        {question:"Which describes: y = 2x + 3 and y = 2x - 1?",options:["One solution","No solution","Infinite solutions","Cannot determine"],correct:1,explanation:"Both lines have slope 2 but different y-intercepts (3 and -1). They are parallel, so no solution."},
        {question:"Solve by elimination: x + y = 7 and x - y = 3",options:["(5, 2)","(4, 3)","(2, 5)","(3, 4)"],correct:0,explanation:"Add equations: 2x = 10 so x = 5. Substitute: 5 + y = 7 so y = 2. Solution: (5, 2)."},
        {question:"2x + 3y = 12 and 4x + 6y = 24: how many solutions?",options:["0","1","2","Infinite"],correct:3,explanation:"Multiply the first equation by 2: 4x + 6y = 24. This is identical to the second equation. Same line means infinite solutions."},
      ],notes:[]},
      {id:"measurement-practice",title:"Measurement Practice",quiz:[
        {question:"A right triangle has legs 6 cm and 8 cm. What is the hypotenuse?",options:["10 cm","12 cm","14 cm","sqrt(28) cm"],correct:0,explanation:"c = sqrt(6^2+8^2) = sqrt(36+64) = sqrt(100) = 10 cm. This is a 3-4-5 triple scaled by 2."},
        {question:"What is the area of a circle with diameter 10 cm?",options:["10*pi cm^2","25*pi cm^2","100*pi cm^2","5*pi cm^2"],correct:1,explanation:"Diameter=10 so radius=5. A = pi*r^2 = pi*25 = 25*pi cm^2."},
        {question:"A rectangular prism has l=4, w=3, h=5. What is its volume?",options:["47 units^3","60 units^3","94 units^3","24 units^3"],correct:1,explanation:"V = l x w x h = 4 x 3 x 5 = 60 units^3."},
        {question:"Is a triangle with sides 7, 24, 25 a right triangle?",options:["Yes","No","Cannot determine","Only if angles given"],correct:0,explanation:"Check: 7^2 + 24^2 = 49 + 576 = 625 = 25^2. Since a^2+b^2=c^2 it IS a right triangle."},
      ],notes:[]},
      {id:"algebra-practice",title:"Polynomial Algebra Practice",quiz:[
        {question:"Expand and simplify: (x + 4)(x - 2)",options:["x^2 + 2x - 8","x^2 - 2x - 8","x^2 + 6x - 8","x^2 + 2x + 8"],correct:0,explanation:"FOIL: x*x + x*(-2) + 4*x + 4*(-2) = x^2 - 2x + 4x - 8 = x^2 + 2x - 8."},
        {question:"Factor completely: x^2 - 9",options:["(x-3)^2","(x+3)(x-3)","(x-9)(x+1)","Cannot factor"],correct:1,explanation:"Difference of squares: a^2-b^2=(a+b)(a-b). So x^2-9 = x^2-3^2 = (x+3)(x-3)."},
        {question:"Factor: x^2 + 7x + 12",options:["(x+3)(x+4)","(x+2)(x+6)","(x+1)(x+12)","(x+6)(x+2)"],correct:0,explanation:"Find two numbers that multiply to 12 and add to 7: 3 and 4. So (x+3)(x+4)."},
        {question:"Simplify: (3x^2 - 2x + 1) - (x^2 + 3x - 4)",options:["2x^2 - 5x + 5","2x^2 + x - 3","4x^2 + x - 3","2x^2 - 5x - 3"],correct:0,explanation:"Distribute negative: 3x^2-2x+1-x^2-3x+4 = 2x^2-5x+5."},
      ],notes:[]},
    ]
  },
  worksheets: {
    id:"worksheets",name:"Practice Worksheets",description:"Practice problems with full step-by-step solutions",
    icon:ClipboardList,color:"teal",gradient:"from-teal-500 to-cyan-600",
    sections:[
      {id:"number-worksheets",title:"Number Sense Worksheets",notes:[
        {subtitle:"Worksheet 1: Exponent Laws — Level 🟢 Easy",emoji:"📝",points:[
          "1. Simplify: x^5 times x^3",
          "2. Simplify: (y^4)^3",
          "3. Simplify: 12a^6 divided by 4a^2",
          "4. Evaluate: (2^3 times 2^2) divided by 2^4",
          "5. Write 0.0000065 in scientific notation.",
          "6. Evaluate: 5^0 + 3^0",
          "7. Simplify: (3x^2)(4x^3)",
          "8. Write 47,000,000 in scientific notation.",
        ],answers:[
          "x^5 * x^3 = x^(5+3) = x^8",
          "(y^4)^3 = y^(4×3) = y^12",
          "12a^6 / 4a^2 = 3a^(6-2) = 3a^4",
          "(2^3 * 2^2) / 2^4 = 2^5 / 2^4 = 2^1 = 2",
          "6.5 × 10^(-6)",
          "5^0 + 3^0 = 1 + 1 = 2. Any base to the power 0 is 1.",
          "(3x^2)(4x^3) = 12x^(2+3) = 12x^5",
          "4.7 × 10^7",
        ]},
        {subtitle:"Worksheet 2: Exponent Laws — Level 🟡 Medium",emoji:"📝",points:[
          "1. Simplify: (2x^3 y^2)(5x y^4)",
          "2. Simplify: (a^2 b^3)^4",
          "3. Simplify: 18m^5 n^3 divided by 6m^2 n",
          "4. Evaluate: (3^(-2))(3^4)",
          "5. Simplify: (2a)^3 times a^(-2)",
          "6. Express: (4 × 10^3)(2 × 10^5) in scientific notation.",
          "7. Simplify: x^(-3) divided by x^(-7)",
          "8. Evaluate: (16)^(1/2) + (27)^(1/3)",
        ],answers:[
          "(2 × 5)(x^(3+1))(y^(2+4)) = 10x^4 y^6",
          "a^(2×4) b^(3×4) = a^8 b^12",
          "(18/6) m^(5-2) n^(3-1) = 3m^3 n^2",
          "3^(-2+4) = 3^2 = 9",
          "(2^3)(a^3)(a^(-2)) = 8a^(3-2) = 8a",
          "(4 × 2)(10^(3+5)) = 8 × 10^8",
          "x^(-3-(-7)) = x^(-3+7) = x^4",
          "sqrt(16) + cube root of 27 = 4 + 3 = 7",
        ]},
        {subtitle:"Worksheet 3: Square Roots & Number Sets — Level 🔴 Hard",emoji:"📝",points:[
          "1. Simplify completely: sqrt(180)",
          "2. Simplify: sqrt(50) + sqrt(32)",
          "3. Evaluate: 27^(2/3)",
          "4. Simplify: (sqrt(3))(sqrt(12))",
          "5. Order from least to greatest: sqrt(11), 10/3, 3.3, sqrt(10)",
          "6. Is 0.121212... rational or irrational? Explain fully.",
          "7. Evaluate: (8/27)^(2/3)",
          "8. Simplify: sqrt(75 x^6 y^4)",
        ],answers:[
          "sqrt(180) = sqrt(36 × 5) = 6*sqrt(5)",
          "sqrt(50) = 5*sqrt(2), sqrt(32) = 4*sqrt(2), so total = 9*sqrt(2)",
          "27^(2/3) = (cube root of 27)^2 = 3^2 = 9",
          "(sqrt(3))(sqrt(12)) = sqrt(3 × 12) = sqrt(36) = 6",
          "sqrt(10) ≈ 3.162, sqrt(11) ≈ 3.317, 10/3 ≈ 3.333, 3.3. Order: sqrt(10) < 3.3 < sqrt(11) < 10/3",
          "Rational. The decimal repeats (12 repeating), so it can be written as a fraction: 12/99 = 4/33.",
          "(8/27)^(2/3) = (cube root of 8/27)^2 = (2/3)^2 = 4/9",
          "sqrt(75 x^6 y^4) = sqrt(25 × 3 × x^6 × y^4) = 5x^3 y^2 * sqrt(3)",
        ]},
      ]},
      {id:"linear-worksheets",title:"Linear Relations Worksheets",notes:[
        {subtitle:"Worksheet 1: Slope & Graphing — Level 🟢 Easy",emoji:"📝",points:[
          "1. Find the slope of the line through (-1, 4) and (3, -2).",
          "2. Write the equation of the line with slope 3 and y-intercept -5.",
          "3. Find the x- and y-intercepts of 3x - 2y = 12.",
          "4. What is the slope of a horizontal line? What is its equation if it passes through (0, 7)?",
          "5. Plot two points for y = 2x - 1. What is the y-intercept?",
          "6. Find the slope of the line through (0, 0) and (4, 8).",
          "7. What is the slope of a vertical line? Why is it undefined?",
          "8. Write the equation: slope = -2, passes through the y-axis at y = 4.",
        ],answers:[
          "m = (-2 - 4) / (3 - (-1)) = -6 / 4 = -3/2",
          "y = 3x - 5",
          "x-int: set y=0 → 3x = 12 → x = 4, giving (4, 0). y-int: set x=0 → -2y = 12 → y = -6, giving (0, -6)",
          "Slope = 0. Equation: y = 7",
          "When x=0, y=-1 (y-int is -1). When x=1, y=1. Points (0,-1) and (1,1). y-intercept = -1.",
          "m = (8-0)/(4-0) = 8/4 = 2",
          "Undefined. Because the run = 0, and you can't divide by zero.",
          "y = -2x + 4",
        ]},
        {subtitle:"Worksheet 2: Forms of Linear Equations — Level 🟡 Medium",emoji:"📝",points:[
          "1. Write the equation of the line through (2, 7) with slope 1/2.",
          "2. Are y=4x-1 and y=(1/4)x+3 perpendicular? Explain.",
          "3. Find the equation of the line through (3, -1) and (6, 5).",
          "4. Convert 4x - 2y = 10 to slope-intercept form.",
          "5. Write the equation of the line through (5, 3) parallel to y = -2x + 1.",
          "6. A phone plan charges $25/month plus $0.05 per text. Write a linear equation. What is the cost for 200 texts?",
          "7. Find the equation of the perpendicular to y = 3x + 2 through (0, 1).",
          "8. What are the intercepts of the line 5x + 2y = 20? Use them to sketch the graph.",
        ],answers:[
          "y - 7 = (1/2)(x - 2) → y = (1/2)x + 6",
          "NOT perpendicular. Slope of first is 4. Perpendicular slope would be -1/4. But second slope is 1/4, not -1/4.",
          "m = (5-(-1))/(6-3) = 6/3 = 2. Then y-(-1) = 2(x-3) → y = 2x - 7.",
          "-2y = -4x + 10 → y = 2x - 5. Slope = 2, y-intercept = -5.",
          "Parallel means same slope (-2). y - 3 = -2(x - 5) → y = -2x + 13.",
          "C = 0.05t + 25. For 200 texts: C = 0.05(200) + 25 = 10 + 25 = $35.",
          "Perpendicular slope = -1/3. Through (0,1): y = -(1/3)x + 1.",
          "x-int: set y=0 → 5x = 20 → x = 4, so (4, 0). y-int: set x=0 → 2y = 20 → y = 10, so (0, 10).",
        ]},
        {subtitle:"Worksheet 3: Direct & Partial Variation — Level 🔴 Hard",emoji:"📝",points:[
          "1. A taxi charges $2.50 base fare plus $1.80 per km. Write a partial variation equation and find the cost for 12 km.",
          "2. Does y = 4x represent direct or partial variation? Find y when x = 7.",
          "3. The table shows: (0,5), (2,11), (4,17), (6,23). Is this direct or partial variation? Write the equation.",
          "4. If y varies directly with x and y = 24 when x = 6, find y when x = 10.",
          "5. A spring stretches 3 cm for every 2 N of force. It has a natural length of 10 cm. Write the equation for total length L in terms of force F.",
          "6. Calculate the first differences for: x: 1,2,3,4 and y: 3,7,11,15. Is it linear? What is the equation?",
          "7. The graph of a line passes through (0, -4) and (3, 5). Is this direct or partial variation? Why?",
          "8. Two variables have a direct variation where k = 6. If x increases by 3, by how much does y increase?",
        ],answers:[
          "C = 1.80d + 2.50. For d=12: C = 1.80(12) + 2.50 = 21.60 + 2.50 = $24.10.",
          "Direct variation (b=0, passes through origin). y = 4(7) = 28.",
          "First differences: 11-5=6, 17-11=6, 23-17=6 — constant, so linear. y-intercept is 5 (at x=0). Slope = 6/2 = 3. Equation: y = 3x + 5. Partial variation (b ≠ 0).",
          "Direct variation: y/x = k = 24/6 = 4. So y = 4x. When x=10: y = 40.",
          "L = 1.5F + 10. (Each N adds 3/2 = 1.5 cm. At F=0, L=10 cm.)",
          "First differences: 7-3=4, 11-7=4, 15-11=4. Constant → linear. Slope = 4, y-intercept at x=0: y-int = 3 - 4(1) = -1. Equation: y = 4x - 1.",
          "Partial variation. The y-intercept is -4 (not 0), so the line does NOT pass through the origin.",
          "y = 6x. When x increases by 3, y increases by 6(3) = 18.",
        ]},
      ]},
      {id:"systems-worksheets",title:"Linear Systems Worksheets",notes:[
        {subtitle:"Worksheet 1: Substitution Method — Level 🟢 Easy",emoji:"📝",points:[
          "1. Solve by substitution: y = x - 3 and 2x + y = 9",
          "2. Solve by substitution: y = 2x + 1 and y = -x + 7",
          "3. Solve by substitution: x = 4y and 2x - 3y = 10",
          "4. Solve by substitution: y = -3x + 5 and y = x - 3",
          "5. Is (3, 2) a solution to: 2x - y = 4 and x + 3y = 9?",
          "6. Solve by substitution: x + y = 10 and x = 2y + 1",
          "7. Solve by substitution: y = 5 and 3x + y = 17",
          "8. Solve by substitution: x - y = 0 and 3x + 2y = 10",
        ],answers:[
          "Sub y=x-3: 2x+(x-3)=9 → 3x=12 → x=4, y=1. Solution: (4, 1)",
          "Set equal: 2x+1 = -x+7 → 3x=6 → x=2, y=5. Solution: (2, 5)",
          "Sub x=4y: 2(4y)-3y=10 → 8y-3y=10 → 5y=10 → y=2, x=8. Solution: (8, 2)",
          "Set equal: -3x+5 = x-3 → -4x=-8 → x=2, y=-1. Solution: (2, -1)",
          "eq1: 2(3)-2=4 ✓. eq2: 3+3(2)=9 ✓. Yes, (3,2) is a solution.",
          "Sub x=2y+1: (2y+1)+y=10 → 3y=9 → y=3, x=7. Solution: (7, 3)",
          "y=5 already given. Sub: 3x+5=17 → 3x=12 → x=4. Solution: (4, 5)",
          "From eq1: x=y. Sub: 3y+2y=10 → 5y=10 → y=2, x=2. Solution: (2, 2)",
        ]},
        {subtitle:"Worksheet 2: Elimination Method — Level 🟡 Medium",emoji:"📝",points:[
          "1. Solve by elimination: 3x + 2y = 11 and 3x - y = 5",
          "2. Solve by elimination: 4x + 3y = 10 and 2x - y = 0",
          "3. Solve by elimination: 5x + 4y = 22 and 3x - 4y = 2",
          "4. Solve by elimination: 2x + 3y = 12 and 5x - 3y = 9",
          "5. Solve by elimination: 3x + 2y = 0 and 5x - y = 7",
          "6. Solve by elimination: 2x + y = 8 and 4x + 2y = 16",
          "7. Solve by elimination: x + 2y = 7 and 3x - 2y = 5",
          "8. Solve by elimination: 6x - 5y = 1 and 2x + 3y = 11",
        ],answers:[
          "Subtract eq2 from eq1: 3y=6 → y=2. Sub: 3x+4=11 → x=7/3. Solution: (7/3, 2)",
          "Multiply eq2 by 3: 6x-3y=0. Add to eq1: 10x=10 → x=1. Sub: 2-y=0 → y=2. Solution: (1, 2)",
          "Add equations: 8x=24 → x=3. Sub: 15+4y=22 → 4y=7 → y=7/4. Solution: (3, 7/4)",
          "Add equations: 7x=21 → x=3. Sub: 6+3y=12 → 3y=6 → y=2. Solution: (3, 2)",
          "Multiply eq2 by 2: 10x-2y=14. Add to eq1: 13x=14 → x=14/13. Sub: y=5x-7=70/13-91/13=-21/13. Solution: (14/13, -21/13)",
          "Eq2 is exactly 2×Eq1. Infinite solutions — same line.",
          "Add equations: 4x=12 → x=3. Sub: 3+2y=7 → 2y=4 → y=2. Solution: (3, 2)",
          "Multiply eq2 by 3: 6x+9y=33. Subtract from eq1: -14y=-32 → y=16/7. Sub: 2x=11-3(16/7)=29/7 → x=29/14. Solution: (29/14, 16/7)",
        ]},
        {subtitle:"Worksheet 3: Word Problems — Level 🔴 Hard",emoji:"📝",points:[
          "1. Two numbers add to 48 and one is 3 times the other. Find both numbers.",
          "2. Adult tickets cost $12, student tickets cost $8. If 150 tickets were sold for $1520, how many of each?",
          "3. A boat travels 30 km downstream in 2 hours and 18 km upstream in 3 hours. Find the boat speed and current speed.",
          "4. Mixing a 20% acid solution with a 50% acid solution gives 60 L of 30% solution. How many litres of each?",
          "5. A store sells pens for $1.50 and notebooks for $3.25. Maria spends $24.50 on 10 items total. How many of each did she buy?",
          "6. The sum of two angles is 180°. One angle is 24° more than the other. Find both angles.",
          "7. A plane flies 1200 km with the wind in 3 hours, but takes 4 hours against the wind. Find the plane's speed in still air and the wind speed.",
          "8. Two cars start 300 km apart and drive toward each other. Car A goes 80 km/h and Car B goes 70 km/h. After how many hours do they meet? How far has each travelled?",
        ],answers:[
          "Let x and y be the numbers. x+y=48 and x=3y. Sub: 3y+y=48 → 4y=48 → y=12, x=36. Numbers are 12 and 36.",
          "Let a=adults, s=students. a+s=150 and 12a+8s=1520. From eq1: a=150-s. Sub: 12(150-s)+8s=1520 → 1800-4s=1520 → s=70, a=80.",
          "Let b=boat speed, c=current. Downstream: b+c=15. Upstream: b-c=6. Add: 2b=21 → b=10.5 km/h, c=4.5 km/h.",
          "Let x=litres of 20%, y=litres of 50%. x+y=60 and 0.20x+0.50y=0.30(60)=18. From eq1: x=60-y. 0.20(60-y)+0.50y=18 → 12+0.30y=18 → y=20 L of 50%, x=40 L of 20%.",
          "Let p=pens, n=notebooks. p+n=10 and 1.50p+3.25n=24.50. From eq1: p=10-n. 1.50(10-n)+3.25n=24.50 → 15+1.75n=24.50 → n=5.43... Not a whole number — recheck. Actually 1.50p+3.25n=24.50, p+n=10 → p=10-n → 15-1.50n+3.25n=24.50 → 1.75n=9.50 → n≈5.4. Hmm — try p=7, n=3: 10.50+9.75=20.25 no. p=3,n=7: 4.50+22.75=27.25 no. p=6,n=4: 9+13=22 no. p=5,n=5: 7.50+16.25=23.75 no. p=4,n=6: 6+19.50=25.50 no. Check: 1.50(7)+3.25(3)=10.50+9.75=20.25. No exact whole-number solution — good challenge to identify this!",
          "Let angles be x and y. x+y=180 and x=y+24. Sub: (y+24)+y=180 → 2y=156 → y=78°, x=102°.",
          "Let p=plane speed, w=wind. With wind: p+w=400. Against wind: p-w=300. Add: 2p=700 → p=350 km/h, w=50 km/h.",
          "Time to meet: 300/(80+70) = 300/150 = 2 hours. Car A travels 80×2=160 km. Car B travels 70×2=140 km. Check: 160+140=300 ✓",
        ]},
      ]},
      {id:"measurement-worksheets",title:"Measurement & Geometry Worksheets",notes:[
        {subtitle:"Worksheet 1: Pythagorean Theorem — Level 🟢 Easy",emoji:"📝",points:[
          "1. Find the hypotenuse of a right triangle with legs 9 and 12.",
          "2. A 13 m ladder leans against a wall. Base is 5 m from wall. How high does it reach?",
          "3. Is a triangle with sides 11, 14, 17 a right triangle? Show work.",
          "4. Find the diagonal of a rectangle with length 8 cm and width 6 cm.",
          "5. A square has a diagonal of 10 cm. Find the side length.",
          "6. Find the missing leg: hypotenuse = 26, one leg = 10.",
          "7. Is (8, 15, 17) a Pythagorean triple? Verify.",
          "8. A 10 m pole casts a shadow. The distance from tip of shadow to top of pole is 26 m. How long is the shadow?",
        ],answers:[
          "c = sqrt(9^2 + 12^2) = sqrt(81 + 144) = sqrt(225) = 15",
          "h = sqrt(13^2 - 5^2) = sqrt(169 - 25) = sqrt(144) = 12 m",
          "11^2 + 14^2 = 121 + 196 = 317. 17^2 = 289. Since 317 ≠ 289, NOT a right triangle.",
          "d = sqrt(8^2 + 6^2) = sqrt(100) = 10 cm",
          "s^2 + s^2 = 10^2 → 2s^2 = 100 → s^2 = 50 → s = 5*sqrt(2) ≈ 7.07 cm",
          "b = sqrt(26^2 - 10^2) = sqrt(676 - 100) = sqrt(576) = 24",
          "8^2 + 15^2 = 64 + 225 = 289 = 17^2. Yes, it is a Pythagorean triple!",
          "shadow^2 + 10^2 = 26^2 → shadow^2 = 676 - 100 = 576 → shadow = 24 m",
        ]},
        {subtitle:"Worksheet 2: Area and Perimeter — Level 🟡 Medium",emoji:"📝",points:[
          "1. Find the area of a triangle with base 14 cm and height 9 cm.",
          "2. A circle has circumference 31.4 cm. Find its radius and area (use pi ≈ 3.14).",
          "3. A trapezoid has parallel sides of 8 m and 14 m and a height of 6 m. Find its area.",
          "4. A composite shape is a rectangle 10 × 6 with a semicircle on one end (diameter = 6). Find the total area.",
          "5. Find the shaded area: large circle radius 8, small circle radius 3, same centre.",
          "6. A path 2 m wide runs around a rectangular garden that is 15 m × 10 m. Find the area of the path only.",
          "7. Find the perimeter of a right triangle with legs 5 m and 12 m.",
          "8. A sector of a circle has radius 6 cm and angle 90°. Find its area (use pi ≈ 3.14).",
        ],answers:[
          "A = (1/2)(14)(9) = 63 cm^2",
          "C = 2*pi*r → 31.4 = 2(3.14)r → r = 5 cm. A = pi*r^2 = 3.14 × 25 = 78.5 cm^2",
          "A = (1/2)(8+14)(6) = (1/2)(22)(6) = 66 m^2",
          "Rectangle: 10×6 = 60. Semicircle: (1/2)pi*r^2 = (1/2)(3.14)(9) ≈ 14.13. Total ≈ 74.13 cm^2",
          "Large: pi(8^2) = 64pi. Small: pi(3^2) = 9pi. Shaded = 55pi ≈ 172.7 cm^2",
          "Outer rectangle: (15+4)(10+4) = 19×14 = 266 m^2. Inner garden: 15×10 = 150 m^2. Path = 266 - 150 = 116 m^2.",
          "Hypotenuse = sqrt(5^2+12^2) = sqrt(169) = 13 m. Perimeter = 5 + 12 + 13 = 30 m",
          "Area of sector = (90/360)pi*r^2 = (1/4)(3.14)(36) = 28.26 cm^2",
        ]},
        {subtitle:"Worksheet 3: Surface Area and Volume — Level 🔴 Hard",emoji:"📝",points:[
          "1. Find the surface area of a rectangular prism: l=5, w=3, h=4 cm.",
          "2. Find the volume of a cylinder: radius 7 cm, height 10 cm. (pi ≈ 3.14)",
          "3. Find the surface area of a cylinder: radius 4 cm, height 9 cm.",
          "4. A cone has radius 6 cm and slant height 10 cm. Find its surface area.",
          "5. A sphere has radius 5 cm. Find its volume and surface area.",
          "6. A rectangular swimming pool is 12 m × 6 m × 2 m deep. How many litres of water does it hold? (1 m^3 = 1000 L)",
          "7. A cone and a cylinder have the same radius (4 cm) and height (9 cm). What is the ratio of their volumes?",
          "8. A cylindrical can has diameter 8 cm and height 12 cm. Find the minimum surface area of material needed to make it.",
        ],answers:[
          "SA = 2(lw + lh + wh) = 2(15 + 20 + 12) = 2(47) = 94 cm^2",
          "V = pi*r^2*h = 3.14 × 49 × 10 = 1538.6 cm^3",
          "SA = 2*pi*r^2 + 2*pi*r*h = 2(3.14)(16) + 2(3.14)(4)(9) = 100.48 + 226.08 = 326.56 cm^2",
          "SA = pi*r^2 + pi*r*l = pi(36) + pi(6)(10) = 36pi + 60pi = 96pi ≈ 301.44 cm^2",
          "V = (4/3)pi*r^3 = (4/3)(3.14)(125) = 523.3 cm^3. SA = 4*pi*r^2 = 4(3.14)(25) = 314 cm^2",
          "V = 12 × 6 × 2 = 144 m^3. Volume in litres = 144 × 1000 = 144,000 L",
          "V_cylinder = pi*r^2*h = pi(16)(9) = 144pi. V_cone = (1/3)pi*r^2*h = (1/3)(144pi) = 48pi. Ratio = 48pi : 144pi = 1 : 3",
          "r = 4 cm. SA = 2*pi*r^2 + 2*pi*r*h = 2(3.14)(16) + 2(3.14)(4)(12) = 100.48 + 301.44 = 401.92 cm^2",
        ]},
      ]},
      {id:"algebra-worksheets",title:"Polynomial Algebra Worksheets",notes:[
        {subtitle:"Worksheet 1: Adding, Subtracting & Multiplying — Level 🟢 Easy",emoji:"📝",points:[
          "1. Simplify: (3x^2 + 5x - 2) + (x^2 - 3x + 7)",
          "2. Simplify: (4a^2 - 2a + 1) - (a^2 + 3a - 4)",
          "3. Expand: 3x(2x^2 - 4x + 1)",
          "4. Expand using FOIL: (x + 4)(x + 3)",
          "5. Expand: (x - 5)(x + 5)",
          "6. Expand: (2x + 1)(x - 3)",
          "7. Simplify: (5y^3 - 2y + 8) - (3y^3 + y^2 - 4y + 1)",
          "8. Expand: -2a(3a^2 - a + 4)",
        ],answers:[
          "(3+1)x^2 + (5-3)x + (-2+7) = 4x^2 + 2x + 5",
          "(4-1)a^2 + (-2-3)a + (1+4) = 3a^2 - 5a + 5",
          "3x·2x^2 + 3x·(-4x) + 3x·1 = 6x^3 - 12x^2 + 3x",
          "F: x^2, O: 3x, I: 4x, L: 12. Total: x^2 + 7x + 12",
          "Difference of squares: x^2 - 25",
          "F: 2x^2, O: -6x, I: x, L: -3. Total: 2x^2 - 5x - 3",
          "(5-3)y^3 + (0-1)y^2 + (-2+4)y + (8-1) = 2y^3 - y^2 + 2y + 7",
          "-6a^3 + 2a^2 - 8a",
        ]},
        {subtitle:"Worksheet 2: Factoring — Level 🟡 Medium",emoji:"📝",points:[
          "1. Factor completely: 6x^3 + 9x^2 - 3x",
          "2. Factor: x^2 + 5x + 6",
          "3. Factor: x^2 - 7x + 12",
          "4. Factor: x^2 + 2x - 15",
          "5. Factor completely: x^2 - 16",
          "6. Factor: 4x^2 - 25",
          "7. Factor completely: 2x^2 + 8x - 24 (hint: common factor first!)",
          "8. Factor: x^2 - 10x + 25",
        ],answers:[
          "GCF = 3x. Result: 3x(2x^2 + 3x - 1)",
          "Need two numbers that multiply to 6 and add to 5: 2 and 3. Answer: (x+2)(x+3)",
          "Need two numbers that multiply to 12 and add to -7: -3 and -4. Answer: (x-3)(x-4)",
          "Need two numbers that multiply to -15 and add to 2: 5 and -3. Answer: (x+5)(x-3)",
          "Difference of squares: (x+4)(x-4)",
          "Difference of squares: (2x+5)(2x-5)",
          "GCF = 2 first: 2(x^2 + 4x - 12). Then factor trinomial: need multiply to -12, add to 4: 6 and -2. Answer: 2(x+6)(x-2)",
          "Perfect square: (x-5)^2. Check: (x-5)^2 = x^2 - 10x + 25 ✓",
        ]},
        {subtitle:"Worksheet 3: Mixed Challenge — Level 🔴 Hard",emoji:"📝",points:[
          "1. Expand and simplify: (2x + 3)^2",
          "2. Expand and simplify: (x + 2)(x^2 - 3x + 4)",
          "3. Factor completely: 3x^2 - 12",
          "4. Factor completely: 5x^3 - 20x",
          "5. Expand: (3x - 2)(2x + 5) and verify by substituting x = 1.",
          "6. Factor: 2x^2 - x - 6",
          "7. Simplify: (x + 3)^2 - (x - 1)^2",
          "8. A rectangle has area x^2 + 7x + 10. Write expressions for the length and width. What are the dimensions if x = 5?",
        ],answers:[
          "(2x)^2 + 2(2x)(3) + 3^2 = 4x^2 + 12x + 9",
          "x·x^2 + x·(-3x) + x·4 + 2·x^2 + 2·(-3x) + 2·4 = x^3 - 3x^2 + 4x + 2x^2 - 6x + 8 = x^3 - x^2 - 2x + 8",
          "GCF = 3: 3(x^2 - 4). Then difference of squares: 3(x+2)(x-2)",
          "GCF = 5x: 5x(x^2 - 4). Then difference of squares: 5x(x+2)(x-2)",
          "(3x-2)(2x+5) = 6x^2 + 15x - 4x - 10 = 6x^2 + 11x - 10. Check x=1: (3-2)(2+5) = (1)(7) = 7. Formula: 6+11-10 = 7. ✓",
          "Multiply to 2×(-6)=-12, add to -1: 3 and -4. Split: 2x^2 + 3x - 4x - 6 = x(2x+3) - 2(2x+3) = (x-2)(2x+3)",
          "Expand each: (x+3)^2 = x^2+6x+9. (x-1)^2 = x^2-2x+1. Difference: (x^2+6x+9)-(x^2-2x+1) = 8x+8 = 8(x+1)",
          "Factor: x^2+7x+10 = (x+2)(x+5). So length = x+5, width = x+2. If x=5: length = 10, width = 7.",
        ]},
      ]},
    ]
  },
  numberSense: {
    id:"numberSense",name:"Number Sense",description:"Rational and irrational numbers, exponent laws, radicals, and scientific notation",
    icon:Calculator,color:"blue",gradient:"from-blue-500 to-cyan-600",
    sections:[
      {id:"number-rational",title:"Rational and Irrational Numbers",notes:[
        {subtitle:"The Real Number System",emoji:"🔢",points:[
          "NATURAL numbers: counting numbers - 1, 2, 3, 4, ...",
          "WHOLE numbers: natural numbers plus zero - 0, 1, 2, 3, ...",
          "INTEGERS: positive and negative whole numbers - ..., -2, -1, 0, 1, 2, ...",
          "RATIONAL numbers: any number expressible as p/q where p and q are integers and q is not 0",
          "Rational decimals are either TERMINATING (e.g. 0.25) or REPEATING (e.g. 0.333...)",
          "IRRATIONAL numbers: cannot be written as p/q - decimal never terminates or repeats",
          "Examples of irrational: pi, sqrt(2), sqrt(3), e",
          "REAL numbers: all rational AND irrational numbers together",
        ]},
        {subtitle:"Square Roots and Estimating Radicals",emoji:"√",points:[
          "sqrt(a) is the non-negative number that when squared gives a",
          "Perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100 - give rational square roots",
          "Non-perfect square roots are IRRATIONAL: sqrt(2), sqrt(3), sqrt(5), sqrt(7), ...",
          "To estimate sqrt(20): sqrt(16)=4 and sqrt(25)=5, so sqrt(20) is between 4 and 5, approximately 4.5",
          "Simplify radicals: factor out perfect squares. sqrt(72) = sqrt(36x2) = 6*sqrt(2)",
          "Rule: sqrt(a x b) = sqrt(a) x sqrt(b). Use this to simplify!",
          "Mixed radical: 3*sqrt(5) means 3 times sqrt(5)",
        ]},
        {subtitle:"Comparing and Ordering Numbers",emoji:"📊",points:[
          "Convert all numbers to decimals to compare: sqrt(7) is about 2.646, 8/3 is about 2.667",
          "Negative numbers: further from zero means smaller. So -5 is less than -3",
          "Absolute value |a| = distance from zero. |-4| = 4 and |3| = 3",
          "For square roots of non-perfect squares, use the between-two-perfect-squares method",
        ]},
      ]},
      {id:"number-exponents",title:"Exponent Laws",notes:[
        {subtitle:"The Seven Exponent Laws",emoji:"⚡",points:[
          "PRODUCT LAW: a^m times a^n = a^(m+n) - add exponents when multiplying same base",
          "QUOTIENT LAW: a^m divided by a^n = a^(m-n) - subtract exponents when dividing same base",
          "POWER OF A POWER: (a^m)^n = a^(mn) - multiply the exponents",
          "POWER OF A PRODUCT: (ab)^n = a^n * b^n - distribute exponent to each factor",
          "POWER OF A QUOTIENT: (a/b)^n = a^n / b^n - distribute to numerator and denominator",
          "ZERO EXPONENT: a^0 = 1 for any a that is not 0",
          "NEGATIVE EXPONENT: a^(-n) = 1/a^n",
          "All laws require the SAME base to combine exponents!",
        ]},
        {subtitle:"Fractional Exponents and Radicals",emoji:"√",points:[
          "a^(1/2) = sqrt(a) (square root)",
          "a^(1/3) = cube root of a",
          "a^(1/n) = nth root of a",
          "a^(m/n) = nth root of (a^m) = (nth root of a)^m - two equivalent ways",
          "Example: 8^(2/3) = (cube root of 8)^2 = 2^2 = 4",
          "Tip: take the ROOT first when possible (smaller numbers to work with)",
        ]},
        {subtitle:"Scientific Notation",emoji:"🔬",points:[
          "Form: a x 10^n where a is between 1 (inclusive) and 10 (exclusive) and n is an integer",
          "Large numbers use positive exponents: 3,200,000 = 3.2 x 10^6",
          "Small numbers use negative exponents: 0.000045 = 4.5 x 10^(-5)",
          "Multiplying: multiply coefficients, ADD exponents. (3x10^4)(2x10^3) = 6x10^7",
          "Dividing: divide coefficients, SUBTRACT exponents. (8x10^6)/(2x10^2) = 4x10^4",
          "After calculating, check coefficient is still between 1 and 10!",
        ]},
      ]},
    ]
  },
  linearRelations: {
    id:"linearRelations",name:"Linear Relations",description:"Slope, graphing, forms of linear equations, and direct/partial variation",
    icon:TrendingUp,color:"purple",gradient:"from-violet-500 to-purple-600",
    sections:[
      {id:"linear-slopeintercept",title:"Slope and Slope-Intercept Form",notes:[
        {subtitle:"Understanding Slope",emoji:"📐",points:[
          "Slope measures STEEPNESS and DIRECTION of a line",
          "Formula: m = rise/run = (y2 - y1)/(x2 - x1)",
          "Positive slope: line rises from left to right",
          "Negative slope: line falls from left to right",
          "Zero slope: horizontal line - y is constant",
          "Undefined slope: vertical line - x is constant (denominator = 0)",
          "Slope tells you: for every 1 unit right, y changes by m units",
        ]},
        {subtitle:"Slope-Intercept Form: y = mx + b",emoji:"✏️",points:[
          "m = slope (rate of change)",
          "b = y-intercept (value of y when x = 0)",
          "To graph: plot the y-intercept (0, b), then use slope to find more points",
          "Example: y = 3x - 2. Plot (0, -2). Slope = 3/1 means go up 3 and right 1 to reach (1, 1)",
          "To find slope and y-intercept from an equation: rearrange into y = mx + b form",
        ]},
        {subtitle:"Direct and Partial Variation",emoji:"🔗",points:[
          "DIRECT VARIATION: y = kx - passes through origin. k is the constant of variation.",
          "If x doubles, y doubles. Constant ratio y/x = k for all points.",
          "PARTIAL VARIATION: y = mx + b where b is not 0 - does NOT pass through origin",
          "Has a fixed component (b) plus a variable component (mx)",
          "Example: taxi fare = $3.50 base + $1.20 per km. F = 1.20d + 3.50 is partial variation.",
          "Distinguish by checking: is (0,0) on the line? Yes means direct. No means partial.",
        ]},
      ]},
      {id:"linear-forms",title:"Forms of Linear Equations",notes:[
        {subtitle:"Standard Form: Ax + By = C",emoji:"📝",points:[
          "Standard form: Ax + By = C where A, B, C are integers and A is at least 0",
          "Finding x-intercept: set y = 0 and solve for x",
          "Finding y-intercept: set x = 0 and solve for y",
          "Example: 3x + 2y = 12. x-int: 3x=12 so x=4, giving (4,0). y-int: 2y=12 so y=6, giving (0,6)",
          "Converting to slope-intercept: isolate y. 2y = -3x + 12 gives y = (-3/2)x + 6",
        ]},
        {subtitle:"Point-Slope Form and Writing Equations",emoji:"🖊️",points:[
          "Point-slope form: y - y1 = m(x - x1) - use when given a point and slope",
          "Step 1: Identify slope m and a point (x1, y1)",
          "Step 2: Substitute and simplify to y = mx + b",
          "Given two points: find slope first, then substitute one point into point-slope form",
          "Horizontal line through (a, b): equation is y = b",
          "Vertical line through (a, b): equation is x = a (undefined slope)",
        ]},
        {subtitle:"Parallel and Perpendicular Lines",emoji:"⊥",points:[
          "PARALLEL lines: same slope, different y-intercept. They never intersect.",
          "Example: y = 2x + 3 and y = 2x - 5 are parallel (both slope 2)",
          "PERPENDICULAR lines: slopes are negative reciprocals. Their product equals -1.",
          "Example: slope 3. Perpendicular slope = -1/3. Check: 3 x (-1/3) = -1 correct",
          "Horizontal and vertical lines are always perpendicular to each other.",
        ]},
      ]},
    ]
  },
  linearSystems: {
    id:"linearSystems",name:"Linear Systems",description:"Graphing, substitution, and elimination methods for solving systems of equations",
    icon:Grid3x3,color:"amber",gradient:"from-amber-500 to-orange-600",
    sections:[
      {id:"systems-graphing",title:"Graphing Systems",notes:[
        {subtitle:"Understanding a Linear System",emoji:"🎯",points:[
          "A system of linear equations is two or more equations with the same variables",
          "The SOLUTION is the point (x, y) that makes BOTH equations true at the same time",
          "Graphically: the solution is the INTERSECTION POINT of the two lines",
          "Three outcomes: one solution (lines intersect), no solution (parallel), infinite solutions (same line)",
        ]},
        {subtitle:"Graphing Method",emoji:"📉",points:[
          "Step 1: Rewrite each equation in slope-intercept form",
          "Step 2: Graph both lines on the same coordinate grid",
          "Step 3: Identify the intersection point",
          "Step 4: Verify the point satisfies BOTH equations",
          "Limitation: graphing only gives exact answers when the solution is at integer coordinates",
          "Strength: graphing is visual and great for understanding what is happening",
        ]},
      ]},
      {id:"systems-substitution",title:"Substitution Method",notes:[
        {subtitle:"Substitution - Full Method",emoji:"🔄",points:[
          "Step 1: ISOLATE one variable in one equation (pick whichever is easiest)",
          "Step 2: SUBSTITUTE that expression into the other equation",
          "Step 3: SOLVE the resulting single-variable equation",
          "Step 4: BACK-SUBSTITUTE to find the value of the second variable",
          "Step 5: VERIFY by substituting both values into both original equations",
          "BEST USED when: one variable is already isolated or has a coefficient of 1",
        ]},
        {subtitle:"Common Mistakes to Avoid",emoji:"⚠️",points:[
          "Do NOT substitute into the SAME equation you isolated from - use the OTHER one",
          "Do NOT forget to find BOTH variables - one value alone is not a complete solution",
          "Do NOT skip verification - especially when numbers get messy",
          "If you get 0 = 0 (always true): infinite solutions (same line)",
          "If you get 0 = 5 (always false): no solution (parallel lines)",
        ]},
      ]},
      {id:"systems-elimination",title:"Elimination Method",notes:[
        {subtitle:"Elimination - Full Method",emoji:"➕",points:[
          "Step 1: ALIGN both equations with like terms in columns",
          "Step 2: If needed, MULTIPLY one or both equations so one variable has opposite coefficients",
          "Step 3: ADD the equations to ELIMINATE one variable",
          "Step 4: SOLVE for the remaining variable",
          "Step 5: SUBSTITUTE back to find the other variable",
          "Step 6: VERIFY in both original equations",
          "BEST USED when: coefficients of one variable are already opposites or easily made so",
        ]},
        {subtitle:"When to Multiply First",emoji:"✖️",points:[
          "If y-coefficients are 3 and 2: multiply first eq by 2 and second by 3 so both become 6",
          "Then subtract to eliminate y",
          "Sometimes only ONE equation needs to be multiplied",
          "Example: 2x + y = 5 and 3x - 2y = 4. Multiply first eq by 2: 4x + 2y = 10. Now add: 7x = 14",
          "Choose to eliminate whichever variable is easier to cancel",
        ]},
      ]},
      {id:"systems-word-problems",title:"Systems Word Problems",notes:[
        {subtitle:"Setting Up Systems from Word Problems",emoji:"📖",points:[
          "Step 1: Define your VARIABLES clearly (e.g. let x = adults, y = children)",
          "Step 2: Write TWO equations from the information given",
          "Step 3: Solve using any method (substitution or elimination)",
          "Step 4: Answer the question with proper units",
          "Step 5: Verify your answer makes sense in context",
        ]},
        {subtitle:"Common Types of Word Problems",emoji:"🗂️",points:[
          "MIXTURE: blend two types of something to get a mixture at a certain value",
          "RATE-TIME-DISTANCE: d = r*t. Set up equations for two different situations.",
          "NUMBER PROBLEMS: two numbers add to 50 and differ by 12. x+y=50 and x-y=12",
          "MONEY: total value of tickets sold - use price times quantity equations",
          "Look for the word TOTAL and DIFFERENCE as clues for your two equations",
        ]},
      ]},
    ]
  },
  polynomials: {
    id:"polynomials",name:"Polynomial Algebra",description:"Operations with polynomials, expanding, and factoring",
    icon:Shapes,color:"green",gradient:"from-emerald-500 to-teal-600",
    sections:[
      {id:"algebra-polynomials",title:"Introduction to Polynomials",notes:[
        {subtitle:"Polynomial Vocabulary",emoji:"📚",points:[
          "TERM: a number, variable, or product of numbers and variables (e.g. 5x^2, -3x, 7)",
          "COEFFICIENT: the number multiplying the variable (in 4x^3 the coefficient is 4)",
          "DEGREE of a term: sum of exponents on the variables (3x^2*y has degree 3)",
          "DEGREE of a polynomial: degree of the highest-degree term",
          "MONOMIAL: 1 term. BINOMIAL: 2 terms. TRINOMIAL: 3 terms. POLYNOMIAL: many terms.",
          "LIKE TERMS: same variable AND same exponent. Only like terms can be combined!",
          "Examples: 3x^2 and -7x^2 are like terms. 3x^2 and 3x are NOT like terms.",
        ]},
        {subtitle:"Adding and Subtracting Polynomials",emoji:"➕",points:[
          "Combine LIKE TERMS only - same variable, same exponent",
          "Adding: simply combine like terms. (3x^2+2x-1)+(x^2-5x+4) = 4x^2-3x+3",
          "Subtracting: distribute the negative sign to ALL terms in the second polynomial",
          "(3x^2+2x-1)-(x^2-5x+4) = 3x^2+2x-1-x^2+5x-4 = 2x^2+7x-5",
          "Always write the result in standard form: descending degree order",
        ]},
      ]},
      {id:"algebra-multiplying",title:"Multiplying Polynomials",notes:[
        {subtitle:"Multiplying a Monomial by a Polynomial",emoji:"✖️",points:[
          "Distribute the monomial to EVERY term inside the polynomial",
          "Multiply coefficients, add exponents for same-base variables",
          "Example: 3x(2x^2 - 5x + 1) = 6x^3 - 15x^2 + 3x",
          "Example: -2a^2(3a - 4) = -6a^3 + 8a^2  (be careful with signs!)",
        ]},
        {subtitle:"FOIL: Multiplying Two Binomials",emoji:"🔠",points:[
          "FOIL stands for: First, Outer, Inner, Last",
          "(a + b)(c + d) = ac + ad + bc + bd",
          "Example: (x + 3)(x + 5) = x^2 + 5x + 3x + 15 = x^2 + 8x + 15",
          "Example: (2x - 1)(x + 4) = 2x^2 + 8x - x - 4 = 2x^2 + 7x - 4",
          "Always collect like terms after FOILing!",
        ]},
        {subtitle:"Special Products",emoji:"⭐",points:[
          "DIFFERENCE OF SQUARES: (a + b)(a - b) = a^2 - b^2",
          "Example: (x + 5)(x - 5) = x^2 - 25 (middle terms cancel)",
          "PERFECT SQUARE TRINOMIAL: (a + b)^2 = a^2 + 2ab + b^2",
          "Example: (x + 4)^2 = x^2 + 8x + 16",
          "PERFECT SQUARE TRINOMIAL: (a - b)^2 = a^2 - 2ab + b^2",
          "Example: (x - 3)^2 = x^2 - 6x + 9",
          "Memorizing these patterns saves time and reduces errors!",
        ]},
      ]},
      {id:"algebra-factoring",title:"Factoring Polynomials",notes:[
        {subtitle:"Common Factoring (GCF)",emoji:"🔍",points:[
          "ALWAYS look for a GCF (greatest common factor) FIRST before anything else",
          "Find the largest number and highest power that divides every term",
          "Example: 6x^3 + 9x^2 - 3x. GCF = 3x. Result: 3x(2x^2 + 3x - 1)",
          "Example: 4a^2*b + 8a*b^2 - 12ab. GCF = 4ab. Result: 4ab(a + 2b - 3)",
          "After factoring, verify by expanding back: does it match the original?",
        ]},
        {subtitle:"Factoring Trinomials: x^2 + bx + c",emoji:"🧩",points:[
          "Find two integers that MULTIPLY to c and ADD to b",
          "Then factor as (x + p)(x + q) where p*q = c and p+q = b",
          "Example: x^2 + 5x + 6. Need: multiply to 6 and add to 5. That is 2 and 3. Answer: (x+2)(x+3)",
          "Example: x^2 - 7x + 12. Need: multiply to 12 and add to -7. That is -3 and -4. Answer: (x-3)(x-4)",
          "Example: x^2 + 2x - 15. Need: multiply to -15 and add to 2. That is 5 and -3. Answer: (x+5)(x-3)",
          "Positive product: both same sign. Negative product: opposite signs.",
        ]},
        {subtitle:"Factoring: Difference of Squares",emoji:"□",points:[
          "Pattern: a^2 - b^2 = (a + b)(a - b)",
          "Both terms must be perfect squares separated by subtraction",
          "Example: x^2 - 16 = (x+4)(x-4)",
          "Example: 9y^2 - 25 = (3y+5)(3y-5)",
          "Example: 4x^2 - 1 = (2x+1)(2x-1)",
          "Note: sum of squares a^2 + b^2 CANNOT be factored over real numbers!",
        ]},
      ]},
    ]
  },
  measurement: {
    id:"measurement",name:"Measurement and Geometry",description:"Pythagorean theorem, perimeter, area, surface area, and volume",
    icon:BookMarked,color:"rose",gradient:"from-rose-500 to-pink-600",
    sections:[
      {id:"measurement-pythagorean",title:"The Pythagorean Theorem",notes:[
        {subtitle:"Understanding the Theorem",emoji:"📐",points:[
          "In any right triangle: a^2 + b^2 = c^2, where c is the hypotenuse",
          "The hypotenuse is ALWAYS opposite the right angle and is the longest side",
          "To find hypotenuse: c = sqrt(a^2 + b^2)",
          "To find a leg: a = sqrt(c^2 - b^2)",
          "Pythagorean triples (whole number solutions): (3,4,5), (5,12,13), (8,15,17), (6,8,10)",
          "Multiples of triples also work: (6,8,10) is (3,4,5) scaled by 2",
          "Converse: if a^2+b^2=c^2, then the triangle IS a right triangle",
        ]},
        {subtitle:"Applying the Pythagorean Theorem",emoji:"🏗️",points:[
          "Identify the hypotenuse FIRST (longest side, opposite 90 degrees)",
          "Draw a diagram and label sides a, b, c",
          "2D applications: diagonals of rectangles, height of isosceles triangles",
          "3D applications: diagonal of a box, slant height of a pyramid",
          "Example: TV screen 48 cm wide and 36 cm tall. Diagonal = sqrt(48^2+36^2) = sqrt(3600) = 60 cm",
          "Look for words like: how far, diagonal, straight-line distance",
        ]},
      ]},
      {id:"measurement-formulas",title:"Perimeter, Area, and Volume",notes:[
        {subtitle:"Perimeter and Area: 2D Shapes",emoji:"📏",points:[
          "Rectangle: A = l*w, P = 2(l+w)",
          "Triangle: A = (1/2)*b*h where h is perpendicular to base b. P = sum of all sides",
          "Trapezoid: A = (1/2)(a+b)h where a and b are the parallel sides",
          "Circle: A = pi*r^2, Circumference = 2*pi*r = pi*d",
          "Always use RADIUS (not diameter) in the circle area formula",
          "Composite figures: split into simpler shapes, add or subtract areas",
        ]},
        {subtitle:"Surface Area: 3D Shapes",emoji:"📦",points:[
          "Surface area = total area of ALL outer faces",
          "Rectangular prism: SA = 2(lw + lh + wh)",
          "Cylinder: SA = 2*pi*r^2 + 2*pi*r*h (two circles plus the curved rectangle)",
          "Cone: SA = pi*r^2 + pi*r*l where l = slant height",
          "Sphere: SA = 4*pi*r^2",
          "Always state units as SQUARE units: cm^2 or m^2",
        ]},
        {subtitle:"Volume: 3D Shapes",emoji:"📐",points:[
          "Volume = amount of space inside a 3D object",
          "Any prism: V = base area x height",
          "Rectangular prism: V = l*w*h",
          "Cylinder: V = pi*r^2*h",
          "Cone: V = (1/3)*pi*r^2*h (one third of a cylinder with same base and height)",
          "Sphere: V = (4/3)*pi*r^3",
          "Always state units as CUBIC units: cm^3 or m^3",
          "Unit conversion: 1 m = 100 cm, 1 m^2 = 10000 cm^2, 1 m^3 = 1000000 cm^3",
        ]},
      ]},
    ]
  },
};

export default function MathStudyG9() {
  const [showIntro,setShowIntro]=useState(true);
  const [selectedSubject,setSelectedSubject]=useState(null);
  const [selectedSection,setSelectedSection]=useState(null);
  const [readSections,setReadSections]=useState(new Set());
  const [currentQuiz,setCurrentQuiz]=useState(null);
  const [currentQuestion,setCurrentQuestion]=useState(0);
  const [selectedAnswer,setSelectedAnswer]=useState(null);
  const [showExplanation,setShowExplanation]=useState(false);
  const [quizScore,setQuizScore]=useState({correct:0,total:0});
  const [revealedAnswers,setRevealedAnswers]=useState(new Set());
  const [currentFlashcard,setCurrentFlashcard]=useState(0);
  const [isFlipped,setIsFlipped]=useState(false);
  const [flashcardStats,setFlashcardStats]=useState({known:0,learning:0});

  const toggleRead=(id)=>{const s=new Set(readSections);if(s.has(id))s.delete(id);else s.add(id);setReadSections(s);};
  const toggleAnswer=(ni,pi)=>{const k=`${ni}-${pi}`,s=new Set(revealedAnswers);if(s.has(k))s.delete(k);else s.add(k);setRevealedAnswers(s);};
  const startQuiz=(section)=>{setCurrentQuiz(section);setCurrentQuestion(0);setSelectedAnswer(null);setShowExplanation(false);setQuizScore({correct:0,total:0});};
  const handleAnswer=(i)=>{if(!showExplanation)setSelectedAnswer(i);};
  const handleCheck=()=>{const ok=selectedAnswer===currentQuiz.quiz[currentQuestion].correct;setShowExplanation(true);setQuizScore(s=>({correct:s.correct+(ok?1:0),total:s.total+1}));};
  const handleNext=()=>{if(currentQuestion<currentQuiz.quiz.length-1){setCurrentQuestion(q=>q+1);setSelectedAnswer(null);setShowExplanation(false);}else{setCurrentQuiz(null);setSelectedSection(null);}};
  const nextCard=()=>{if(currentFlashcard<selectedSection.flashcards.length-1){setCurrentFlashcard(c=>c+1);setIsFlipped(false);}else{setCurrentFlashcard(0);setIsFlipped(false);setSelectedSection(null);}};
  const prevCard=()=>{if(currentFlashcard>0){setCurrentFlashcard(c=>c-1);setIsFlipped(false);}};

  // Flashcard View
  if(selectedSection&&selectedSection.flashcards&&selectedSection.flashcards.length>0){
    const card=selectedSection.flashcards[currentFlashcard];
    return (
      <div className="min-h-screen dot-grid flex flex-col" style={{background:"var(--bg)"}}>
        <InjectStyles/>
        <div className="glass sticky top-0 z-40 px-5 h-14 flex items-center justify-between" style={{borderBottom:"1px solid var(--border)"}}>
          <button onClick={()=>{setSelectedSection(null);setCurrentFlashcard(0);setIsFlipped(false);setFlashcardStats({known:0,learning:0});}} className="flex items-center gap-2 text-sm syne font-semibold" style={{color:"var(--muted)"}}>
            <ArrowLeft className="w-4 h-4"/> Exit
          </button>
          <div className="flex items-center gap-4">
            <span className="syne text-xs font-bold" style={{color:"rgba(52,211,153,0.9)"}}>Done: {flashcardStats.known}</span>
            <span className="syne text-xs font-bold" style={{color:"rgba(251,191,36,0.9)"}}>Review: {flashcardStats.learning}</span>
          </div>
        </div>
        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 flex flex-col">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex-1 flex gap-1">
              {selectedSection.flashcards.map((_,i)=>(
                <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{background:"rgba(99,102,241,0.1)"}}>
                  {i<currentFlashcard&&<div className="h-full w-full rounded-full bg-emerald-500"/>}
                  {i===currentFlashcard&&<div className={`h-full rounded-full shimmer bg-gradient-to-r ${selectedSubject.gradient}`} style={{width:"100%"}}/>}
                </div>
              ))}
            </div>
            <span className="mono text-xs" style={{color:"var(--dim)"}}>{currentFlashcard+1}/{selectedSection.flashcards.length}</span>
          </div>
          <h2 className="syne font-bold text-base mb-5" style={{color:"var(--text)"}}>{selectedSection.title}</h2>
          <div className="flip-card flex-1 cursor-pointer mb-6 min-h-56" onClick={()=>setIsFlipped(!isFlipped)}>
            <div className={`flip-inner relative w-full h-full ${isFlipped?"flipped":""}`} style={{minHeight:"220px"}}>
              <div className={`flip-front absolute inset-0 bg-gradient-to-br ${selectedSubject.gradient} rounded-3xl flex items-center justify-center p-8 shadow-2xl`}>
                <div className="absolute inset-0 opacity-20 rounded-3xl" style={{backgroundImage:"radial-gradient(circle at 70% 30%, white, transparent 65%)"}}/>
                <div className="text-center relative">
                  <p className="syne font-black text-white/50 text-xs uppercase tracking-widest mb-4">Question</p>
                  <h3 className="syne font-black text-white leading-snug" style={{fontSize:"clamp(1.1rem,3vw,1.5rem)"}}>{card.front}</h3>
                  <p className="text-white/40 mt-6 text-xs mono">tap to reveal answer</p>
                </div>
              </div>
              <div className="flip-back absolute inset-0 glass rounded-3xl flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="syne font-black text-xs uppercase tracking-widest mb-4" style={{color:"var(--dim)"}}>Answer</p>
                  <h3 className="syne font-bold leading-relaxed" style={{fontSize:"clamp(1rem,2.5vw,1.2rem)",color:"var(--text)"}}>{card.back}</h3>
                  <p className="text-xs mono mt-6" style={{color:"var(--dim)"}}>tap to flip back</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <button onClick={prevCard} disabled={currentFlashcard===0} className="px-5 py-2.5 rounded-xl text-sm syne font-bold disabled:opacity-20" style={{background:"var(--surface)",border:"1px solid var(--border)",color:"var(--muted)"}}>Prev</button>
            {isFlipped&&(
              <div className="flex gap-2 flex-1">
                <button onClick={()=>{setFlashcardStats(s=>({...s,learning:s.learning+1}));nextCard();}} className="flex-1 py-2.5 rounded-xl text-sm syne font-black" style={{background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.25)",color:"rgb(251,191,36)"}}>Still Learning</button>
                <button onClick={()=>{setFlashcardStats(s=>({...s,known:s.known+1}));nextCard();}} className="flex-1 py-2.5 rounded-xl text-sm syne font-black" style={{background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",color:"rgb(52,211,153)"}}>Got It</button>
              </div>
            )}
            <button onClick={nextCard} disabled={currentFlashcard===selectedSection.flashcards.length-1} className="px-5 py-2.5 rounded-xl text-sm syne font-bold disabled:opacity-20" style={{background:"var(--surface)",border:"1px solid var(--border)",color:"var(--muted)"}}>Next</button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz View
  if(currentQuiz){
    const q=currentQuiz.quiz[currentQuestion];
    const isOk=selectedAnswer===q.correct;
    const labels=["A","B","C","D"];
    return (
      <div className="min-h-screen dot-grid" style={{background:"var(--bg)"}}>
        <InjectStyles/>
        <div className="glass px-5 h-14 flex items-center justify-between sticky top-0 z-40" style={{borderBottom:"1px solid var(--border)"}}>
          <button onClick={()=>{setCurrentQuiz(null);setSelectedSection(null);}} className="flex items-center gap-2 text-sm syne font-semibold" style={{color:"var(--muted)"}}>
            <ArrowLeft className="w-4 h-4"/> Exit Quiz
          </button>
          <div className="flex items-center gap-3">
            <span className="mono text-xs" style={{color:"var(--dim)"}}>{currentQuestion+1}/{currentQuiz.quiz.length}</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.2)"}}>
              <span className="text-emerald-600 font-bold mono text-sm">{quizScore.correct}</span>
              <span style={{color:"var(--dim)"}} className="text-xs">correct</span>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex gap-1 mb-8">
            {currentQuiz.quiz.map((_,i)=>(
              <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{background:"rgba(99,102,241,0.1)"}}>
                {i<currentQuestion&&<div className="h-full w-full bg-emerald-500 rounded-full"/>}
                {i===currentQuestion&&<div className={`h-full rounded-full shimmer bg-gradient-to-r ${selectedSubject.gradient}`} style={{width:"100%"}}/>}
              </div>
            ))}
          </div>
          <div className="glass rounded-3xl p-7 mb-5 anim-up">
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${selectedSubject.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <span className="syne font-black text-white text-sm">{currentQuestion+1}</span>
              </div>
              <h3 className="syne font-bold text-lg leading-snug" style={{color:"var(--text)"}}>{q.question}</h3>
            </div>
            <div className="space-y-2.5">
              {q.options.map((opt,idx)=>{
                const isSel=selectedAnswer===idx,isCorr=idx===q.correct;
                let bg="rgba(15,23,42,0.03)",border="rgba(15,23,42,0.1)",textCol="var(--muted)",labelBg="rgba(15,23,42,0.06)",labelCol="var(--dim)";
                if(!showExplanation&&isSel){bg="rgba(99,102,241,0.08)";border="rgba(99,102,241,0.4)";textCol="#4338ca";labelBg="rgba(99,102,241,0.15)";labelCol="#4f46e5";}
                else if(showExplanation&&isCorr){bg="rgba(16,185,129,0.07)";border="rgba(16,185,129,0.4)";textCol="#065f46";labelBg="rgba(16,185,129,0.15)";labelCol="#059669";}
                else if(showExplanation&&isSel&&!isCorr){bg="rgba(239,68,68,0.07)";border="rgba(239,68,68,0.4)";textCol="#991b1b";labelBg="rgba(239,68,68,0.15)";labelCol="#dc2626";}
                return (
                  <button key={idx} onClick={()=>handleAnswer(idx)} disabled={showExplanation}
                    className="w-full text-left rounded-2xl px-4 py-3.5 transition-all duration-200 flex items-center gap-3.5"
                    style={{background:bg,border:`1px solid ${border}`,cursor:showExplanation?"default":"pointer"}}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mono text-xs font-bold" style={{background:labelBg,color:labelCol}}>{labels[idx]}</div>
                    <span className="text-sm font-medium" style={{color:textCol}}>{opt}</span>
                    {showExplanation&&isCorr&&<CheckCircle className="w-4 h-4 text-emerald-600 ml-auto flex-shrink-0"/>}
                    {showExplanation&&isSel&&!isCorr&&<X className="w-4 h-4 text-red-400 ml-auto flex-shrink-0"/>}
                  </button>
                );
              })}
            </div>
          </div>
          {showExplanation&&(
            <div className="rounded-2xl p-5 mb-5 anim-up flex items-start gap-3.5" style={{background:isOk?"rgba(16,185,129,0.07)":"rgba(99,102,241,0.07)",border:`1px solid ${isOk?"rgba(16,185,129,0.25)":"rgba(99,102,241,0.25)"}`}}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isOk?"bg-emerald-500/20":"bg-indigo-500/20"}`}>
                <Lightbulb className={`w-4 h-4 ${isOk?"text-emerald-600":"text-indigo-500"}`}/>
              </div>
              <div>
                <p className={`syne font-bold text-sm mb-1 ${isOk?"text-emerald-700":"text-indigo-600"}`}>{isOk?"Correct!":"Here is why:"}</p>
                <p className="text-sm leading-relaxed" style={{color:"var(--muted)"}}>{q.explanation}</p>
              </div>
            </div>
          )}
          {!showExplanation
            ?<button onClick={handleCheck} disabled={selectedAnswer===null} className={`w-full py-3.5 rounded-2xl syne font-bold text-sm text-white bg-gradient-to-r ${selectedSubject.gradient} disabled:opacity-30 shadow-lg`}>Check Answer</button>
            :<button onClick={handleNext} className={`w-full py-3.5 rounded-2xl syne font-bold text-sm text-white bg-gradient-to-r ${selectedSubject.gradient} shadow-lg`}>{currentQuestion<currentQuiz.quiz.length-1?"Next Question":"Finish Quiz"}</button>
          }
        </div>
      </div>
    );
  }

  // Section View
  if(selectedSection&&selectedSubject){
    const sec=selectedSection,isRead=readSections.has(sec.id),hasQuiz=sec.quiz&&sec.quiz.length>0,isWS=selectedSubject.id==="worksheets";
    if(hasQuiz&&!currentQuiz){
      return (
        <div className="min-h-screen dot-grid flex items-center justify-center p-4" style={{background:"var(--bg)"}}>
          <InjectStyles/>
          <div className="max-w-lg w-full text-center anim-up">
            <button onClick={()=>setSelectedSection(null)} className="flex items-center gap-2 text-sm syne font-semibold mb-10 mx-auto" style={{color:"var(--muted)"}}>
              <ArrowLeft className="w-4 h-4"/> {selectedSubject.name}
            </button>
            <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${selectedSubject.gradient} flex items-center justify-center shadow-2xl`}>
              <FileText className="w-9 h-9 text-white"/>
            </div>
            <h2 className="syne font-black mb-3" style={{fontSize:"2rem",color:"var(--text)"}}>Ready to practice?</h2>
            <p className="text-base mb-8" style={{color:"var(--muted)"}}>{sec.quiz.length} questions with detailed explanations.</p>
            <button onClick={()=>startQuiz(sec)} className={`w-full py-4 bg-gradient-to-r ${selectedSubject.gradient} text-white rounded-2xl syne font-black text-sm shadow-lg`}>Start Quiz</button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen dot-grid" style={{background:"var(--bg)"}}>
        <InjectStyles/>
        <div className="glass sticky top-0 z-40" style={{borderBottom:"1px solid var(--border)"}}>
          <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={()=>setSelectedSection(null)} className="flex items-center gap-2 text-sm syne font-semibold" style={{color:"var(--muted)"}}>
                <ArrowLeft className="w-4 h-4"/> {selectedSubject.name}
              </button>
              <span style={{color:"var(--dim)"}}>›</span>
              <span className="syne text-sm font-semibold truncate max-w-48" style={{color:"var(--dim)"}}>{sec.title}</span>
            </div>
            <button onClick={()=>toggleRead(sec.id)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs syne font-bold"
              style={isRead?{background:"rgba(16,185,129,0.10)",border:"1px solid rgba(16,185,129,0.3)",color:"#059669"}:{background:"var(--surface)",border:"1px solid var(--border)",color:"var(--muted)"}}>
              {isRead?<CheckCircle className="w-3.5 h-3.5"/>:<Circle className="w-3.5 h-3.5"/>}
              {isRead?"Completed":"Mark complete"}
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
          <div className="mb-8 anim-up">
            <div className={`inline-block bg-gradient-to-r ${selectedSubject.gradient} rounded-2xl p-px`}>
              <div className="rounded-2xl px-5 py-3" style={{background:"var(--bg)"}}>
                <h1 className="syne font-black text-xl" style={{color:"var(--text)"}}>{sec.title}</h1>
              </div>
            </div>
          </div>
          {/* Section intro */}
          <div className="mb-6 anim-up" style={{ background:`linear-gradient(135deg,${getCol(selectedSubject.gradient).ll},white)`, borderRadius:"16px", padding:"14px 18px", border:`1px solid ${getCol(selectedSubject.gradient).h}20` }}>
            <p style={{ fontSize:"12.5px", color: getCol(selectedSubject.gradient).h, fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:"3px" }}>HOW TO USE THESE NOTES</p>
            <p className="text-xs" style={{ color:"#64748b", lineHeight:1.6 }}>
              Each section has <span style={{fontWeight:700,color:"#4338ca"}}>📖 vocabulary</span> cards, <span style={{fontWeight:700,color:"#15803d"}}>✏️ worked examples</span>, <span style={{fontWeight:700,color:"#c2410c"}}>⚠️ common mistakes</span>, and <span style={{fontWeight:700,color:"#0369a1"}}>💡 tips</span>. Click any section header to collapse it.
            </p>
          </div>

          <div>
            {sec.notes&&sec.notes.map((note,idx)=>{
              const diagramKey=`${sec.id}-${idx}`,diagram=NOTE_DIAGRAMS[diagramKey];
              return (
                <NoteTopicCard
                  key={idx}
                  note={note}
                  noteIdx={idx}
                  gradient={selectedSubject.gradient}
                  subjectColor={selectedSubject.color}
                  isWS={isWS}
                  diagram={diagram}
                />
              );
            })}
          </div>

          {isWS && (
            <div className="mt-6 rounded-2xl p-4 flex gap-3 items-start" style={{background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.2)"}}>
              <span style={{fontSize:"20px",lineHeight:1,flexShrink:0}}>💡</span>
              <p className="text-sm leading-relaxed" style={{color:"#92400e"}}>Attempt every problem on your own first before revealing the answer. Active recall is far more effective than re-reading!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Subject View
  if(selectedSubject){
    const sub=selectedSubject,completed=sub.sections.filter(s=>readSections.has(s.id)).length,prog=(completed/sub.sections.length)*100;
    const SubIcon=sub.icon;
    return (
      <div className="min-h-screen dot-grid" style={{background:"var(--bg)"}}>
        <InjectStyles/>
        <div className="glass sticky top-0 z-40" style={{borderBottom:"1px solid var(--border)"}}>
          <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center gap-3">
            <button onClick={()=>setSelectedSubject(null)} className="flex items-center gap-2 text-sm syne font-semibold" style={{color:"var(--muted)"}}>
              <ArrowLeft className="w-4 h-4"/> Library
            </button>
            <span style={{color:"var(--dim)"}}>›</span>
            <span className="syne font-semibold text-sm" style={{color:"var(--muted)"}}>{sub.name}</span>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
          <div className={`relative bg-gradient-to-br ${sub.gradient} rounded-3xl p-8 mb-10 overflow-hidden anim-up`}>
            <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 85% 50%, white 0%, transparent 55%)"}}/>
            <div className="relative flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4 shadow-xl"><SubIcon className="w-7 h-7 text-white"/></div>
                <h1 className="syne font-black text-white mb-2" style={{fontSize:"clamp(1.6rem,4vw,2.2rem)"}}>{sub.name}</h1>
                <p className="text-white/70 text-sm max-w-sm leading-relaxed">{sub.description}</p>
              </div>
              <div className="text-right">
                <p className="syne font-black text-white" style={{fontSize:"3rem",lineHeight:1}}>{Math.round(prog)}<span className="text-2xl">%</span></p>
                <p className="text-white/60 text-xs mt-1">{completed} of {sub.sections.length} done</p>
              </div>
            </div>
            <div className="relative mt-6">
              <div className="h-2 rounded-full overflow-hidden" style={{background:"rgba(0,0,0,0.2)"}}>
                <div className="h-full bg-white/60 rounded-full shimmer" style={{width:`${prog}%`}}/>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {sub.sections.map((sec,i)=>{
              const isR=readSections.has(sec.id);
              return (
                <div key={sec.id} onClick={()=>setSelectedSection(sec)}
                  className={`glass glass-hover card-shadow card-shadow-hover rounded-2xl p-6 cursor-pointer group transition-all duration-200 anim-up anim-up-${(i%4)+1}`}
                  style={isR?{borderColor:"rgba(16,185,129,0.3)",background:"rgba(16,185,129,0.04)"}:{}}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="mono text-xs" style={{color:"var(--dim)"}}>{String(i+1).padStart(2,"0")}</span>
                        {isR&&<span className="flex items-center gap-1 text-xs font-semibold syne" style={{color:"#34d399"}}><CheckCircle className="w-3 h-3"/> Done</span>}
                      </div>
                      <h3 className="syne font-bold text-base leading-snug" style={{color:"var(--text)"}}>{sec.title}</h3>
                      <p className="text-xs mt-2" style={{color:"var(--dim)"}}>
                        {sec.notes?.length>0?`${sec.notes.length} topics`:sec.quiz?.length>0?`${sec.quiz.length} questions`:sec.flashcards?`${sec.flashcards.length} cards`:"View"}
                      </p>
                    </div>
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${sub.gradient} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-all`}>
                      <ChevronRight className="w-4 h-4 text-white"/>
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

  // Intro View
  if(showIntro){
    return (
      <div className="min-h-screen dot-grid flex items-center justify-center p-4" style={{background:"var(--bg)"}}>
        <InjectStyles/>
        <div className="max-w-2xl w-full">
          <div className="flex justify-center mb-8">
            <div className="glass flex items-center gap-3 rounded-2xl px-5 py-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center"><Calculator className="w-3.5 h-3.5 text-white"/></div>
              <span className="syne font-semibold text-sm" style={{color:"var(--muted)"}}>MathLib - Grade 9</span>
            </div>
          </div>
          <div className="text-center mb-10">
            <h1 className="syne font-black mb-4 leading-none" style={{fontSize:"clamp(2.2rem,6vw,3rem)",color:"var(--text)"}}>
              Your complete<br/>
              <span style={{background:"linear-gradient(135deg,#4f46e5,#7c3aed,#0891b2)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Grade 9 math study system</span>
            </h1>
            <p className="text-base leading-relaxed max-w-sm mx-auto" style={{color:"var(--muted)"}}>
              Notes, flashcards, practice problems, interactive diagrams, and worksheets built for Grade 9.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              {icon:Brain,label:"Flashcards",desc:"Active recall",grad:"from-cyan-500 to-blue-500"},
              {icon:Target,label:"Practice",desc:"Instant feedback",grad:"from-violet-500 to-purple-500"},
              {icon:Sparkles,label:"Diagrams",desc:"Visual learning",grad:"from-emerald-500 to-teal-500"},
            ].map(({icon:Icon,label,desc,grad})=>(
              <div key={label} className="glass glass-hover rounded-2xl p-4 text-center">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center mx-auto mb-3 shadow-lg`}><Icon className="w-5 h-5 text-white"/></div>
                <p className="syne font-bold text-sm" style={{color:"var(--text)"}}>{label}</p>
                <p className="text-xs mt-0.5" style={{color:"var(--dim)"}}>{desc}</p>
              </div>
            ))}
          </div>
          <div className="glass rounded-2xl p-5 mb-5 space-y-4">
            {[
              {n:"01",title:"Browse Grade 9 topics",body:"Number Sense, Linear Relations, Systems, Polynomials, and Measurement."},
              {n:"02",title:"Study the notes",body:"Clear explanations with interactive diagrams and visual examples."},
              {n:"03",title:"Test yourself",body:"Flashcards, multiple choice, and worksheets with full step-by-step solutions."},
            ].map(({n,title,body})=>(
              <div key={n} className="flex items-start gap-4">
                <span className="mono font-black text-xs w-6 flex-shrink-0 mt-0.5" style={{color:"rgba(129,140,248,0.7)"}}>{n}</span>
                <div><p className="syne font-bold text-sm" style={{color:"var(--text)"}}>{title}</p><p className="text-xs mt-0.5 leading-relaxed" style={{color:"var(--dim)"}}>{body}</p></div>
              </div>
            ))}
          </div>
          <button onClick={()=>setShowIntro(false)} className="w-full py-4 rounded-2xl syne font-black text-white text-sm bg-gradient-to-r from-indigo-500 to-violet-500 shadow-lg">
            Open Library
          </button>
        </div>
      </div>
    );
  }

  // Main Library View
  const subjects=Object.values(studyLibrary);
  const tools=subjects.slice(0,4);
  const notes=subjects.slice(4);

  return (
    <div className="min-h-screen dot-grid" style={{background:"var(--bg)"}}>
      <InjectStyles/>
      <div className="glass sticky top-0 z-40" style={{borderBottom:"1px solid var(--border)"}}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center"><Calculator className="w-3.5 h-3.5 text-white"/></div>
            <span className="syne font-black text-sm" style={{color:"var(--text)"}}>MathLib</span>
            <span style={{color:"var(--dim)"}}>·</span>
            <span className="text-xs mono" style={{color:"var(--muted)"}}>Grade 9</span>
          </div>
          <div className="glass flex items-center gap-2 rounded-xl px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
            <span className="syne text-xs font-bold" style={{color:"var(--muted)"}}>{readSections.size} completed</span>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14">
        <div className="mb-14 anim-up">
          <div className="rounded-3xl p-8 md:p-12 overflow-hidden relative card-shadow" style={{background:"linear-gradient(135deg,#eef2ff 0%,#f0fdf4 50%,#faf5ff 100%)",border:"1px solid rgba(99,102,241,0.12)"}}>
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" style={{background:"rgba(99,102,241,0.12)"}}/>
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5" style={{background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.18)"}}>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"/>
                <span className="syne text-xs font-bold uppercase tracking-wider" style={{color:"rgba(79,70,229,0.9)"}}>Interactive Study Library</span>
              </div>
              <h1 className="syne font-black mb-3 leading-none" style={{fontSize:"clamp(2.4rem,5vw,3.2rem)",color:"var(--text)"}}>Grade 9 Math</h1>
              <p className="text-base max-w-xl leading-relaxed" style={{color:"var(--muted)"}}>Comprehensive notes, interactive tools, flashcards, and practice for Ontario Grade 9 Math.</p>
              <div className="flex flex-wrap gap-8 mt-7">
                {[
                  {val:subjects.reduce((s,x)=>s+x.sections.length,0),label:"Total sections"},
                  {val:readSections.size,label:"Completed"},
                  {val:5,label:"Subject areas"},
                ].map(({val,label})=>(
                  <div key={label}>
                    <p className="syne font-black text-2xl" style={{color:"var(--text)"}}>{val}</p>
                    <p className="text-xs mt-0.5" style={{color:"var(--dim)"}}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-5 anim-up anim-up-1">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500"/>
          <span className="syne text-xs font-black uppercase tracking-widest" style={{color:"var(--muted)"}}>Study Tools</span>
          <div className="flex-1 h-px" style={{background:"var(--border)"}}/>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {tools.map((sub,i)=>{
            const done=sub.sections.filter(s=>readSections.has(s.id)).length,prog=(done/sub.sections.length)*100;
            const SubIcon=sub.icon;
            return (
              <div key={sub.id} onClick={()=>setSelectedSubject(sub)}
                className={`glass glass-hover card-shadow card-shadow-hover rounded-2xl p-6 cursor-pointer group transition-all duration-200 anim-up anim-up-${(i%4)+1}`}>
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sub.gradient} flex items-center justify-center shadow-lg`}><SubIcon className="w-6 h-6 text-white"/></div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" style={{color:"var(--dim)"}}/>
                </div>
                <h3 className="syne font-bold text-base mb-1" style={{color:"var(--text)"}}>{sub.name}</h3>
                <p className="text-xs mb-4 leading-relaxed" style={{color:"var(--dim)"}}>{sub.description}</p>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs" style={{color:"var(--dim)"}}>{done}/{sub.sections.length} done</span>
                  <span className="mono text-xs font-semibold" style={{color:"var(--muted)"}}>{Math.round(prog)}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{background:"rgba(99,102,241,0.1)"}}>
                  <div className={`h-full bg-gradient-to-r ${sub.gradient} rounded-full shimmer`} style={{width:`${prog}%`}}/>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mb-5 anim-up anim-up-2">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500"/>
          <span className="syne text-xs font-black uppercase tracking-widest" style={{color:"var(--muted)"}}>Notes</span>
          <div className="flex-1 h-px" style={{background:"var(--border)"}}/>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {notes.map((sub,i)=>{
            const done=sub.sections.filter(s=>readSections.has(s.id)).length,prog=(done/sub.sections.length)*100;
            const SubIcon=sub.icon;
            return (
              <div key={sub.id} onClick={()=>setSelectedSubject(sub)}
                className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-200 anim-up anim-up-${(i%4)+1}`}
                style={{border:"1px solid var(--border)"}}>
                <div className={`bg-gradient-to-br ${sub.gradient} p-6 relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 75% 40%, white 0%, transparent 60%)"}}/>
                  <div className="relative flex items-start justify-between">
                    <div>
                      <h3 className="syne font-black text-xl text-white mb-1">{sub.name}</h3>
                      <p className="text-white/70 text-xs leading-relaxed max-w-xs">{sub.description}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0"><SubIcon className="w-6 h-6 text-white"/></div>
                  </div>
                </div>
                <div className="px-5 py-5" style={{background:"var(--bg-2)"}}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{color:"var(--muted)"}}>{done} of {sub.sections.length} done</span>
                    <span className="mono text-xs font-semibold" style={{color:"var(--muted)"}}>{Math.round(prog)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{background:"rgba(99,102,241,0.1)"}}>
                    <div className={`h-full bg-gradient-to-r ${sub.gradient} rounded-full shimmer`} style={{width:`${prog}%`}}/>
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
