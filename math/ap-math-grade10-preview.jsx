import { useState, useEffect, useCallback } from "react";

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";

const SUBJECTS = [
  { id: "polynomials", name: "Polynomial Functions", icon: "📈", gradient: "from-blue-500 to-indigo-600", topics: ["Characteristics & End Behaviour","Dividing Polynomials","Factor & Remainder Theorems","Factoring Higher Degree","Graphing Polynomials"] },
  { id: "explog", name: "Exponential & Logarithms", icon: "🔢", gradient: "from-purple-500 to-fuchsia-600", topics: ["Exponential Functions","Solving Exponential Equations","Introduction to Logarithms","Logarithm Laws","Applications & Modelling"] },
  { id: "trig", name: "Trigonometric Functions", icon: "〰️", gradient: "from-emerald-500 to-teal-600", topics: ["Radian Measure & Unit Circle","CAST Rule & Exact Values","Graphing Trig Functions","Trig Identities","Solving Trig Equations"] },
  { id: "sequences", name: "Sequences & Series", icon: "∑", gradient: "from-amber-500 to-orange-600", topics: ["Arithmetic Sequences","Arithmetic Series","Geometric Sequences","Geometric Series","Sigma Notation & Convergence"] },
];

const MODES = [
  { id: "notes", label: "Study Notes", icon: "📖" },
  { id: "flashcards", label: "Flashcards", icon: "🃏" },
  { id: "quiz", label: "Practice Quiz", icon: "✏️" },
  { id: "worksheet", label: "Worksheet", icon: "📝" },
];

const SYSTEM_PROMPT = `You are an expert AP-level Grade 10 math tutor. You always respond with ONLY valid JSON — no markdown, no explanation outside the JSON.

For NOTES mode, return:
{"sections":[{"title":"...","emoji":"...","points":["...","..."]}]}
3-5 sections, 5-8 detailed AP-level bullet points each. Include formulas, proofs, worked examples.

For FLASHCARDS mode, return:
{"cards":[{"front":"...","back":"..."}]}
8-12 cards. Front: question or term. Back: precise AP-level answer with formula or example.

For QUIZ mode, return:
{"questions":[{"question":"...","options":["A","B","C","D"],"correct":0,"explanation":"..."}]}
5 multiple-choice questions. AP difficulty. Full explanation for correct answer.

For WORKSHEET mode, return:
{"problems":[{"question":"...","hint":"...","solution":"..."}]}
5 problems. Include hint and full step-by-step solution.`;

async function fetchContent(subject, topic, mode) {
  const prompt = `Generate AP Grade 10 math content.
Subject: ${subject}
Topic: ${topic}
Mode: ${mode.toUpperCase()}
Make it genuinely AP-level — rigorous, precise, with real worked examples and proper mathematical notation.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const text = data.content?.map(b => b.text || "").join("") || "{}";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

function Badge({ children, color = "indigo" }) {
  const colors = { indigo: "bg-indigo-50 text-indigo-700 border-indigo-200", emerald: "bg-emerald-50 text-emerald-700 border-emerald-200", amber: "bg-amber-50 text-amber-700 border-amber-200" };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors[color]}`}>{children}</span>;
}

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
      <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 14 }}>Generating AP content…</p>
    </div>
  );
}

function NotesView({ data }) {
  if (!data?.sections) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {data.sections.map((sec, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden", boxShadow: "0 2px 12px rgba(15,23,42,0.06)" }}>
          <div style={{ padding: "14px 20px", background: "linear-gradient(135deg,#f8faff,#f0f4ff)", borderBottom: "1px solid rgba(99,102,241,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>{sec.emoji}</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "#1e1b4b" }}>{sec.title}</span>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {sec.points.map((pt, j) => {
                const hasColon = /^([A-Z][A-Z\s/&]+):/.test(pt);
                const colonIdx = pt.indexOf(":");
                const key = hasColon ? pt.slice(0, colonIdx) : null;
                const rest = hasColon ? pt.slice(colonIdx + 1).trim() : pt;
                return (
                  <li key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 12px", borderRadius: 10, background: "transparent", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", flexShrink: 0, marginTop: 7 }} />
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.7, color: "rgba(15,23,42,0.65)", margin: 0 }}>
                      {key ? <><strong style={{ color: "#0f172a", fontWeight: 600 }}>{key}:</strong> {rest}</> : pt}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function FlashcardsView({ data }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [learning, setLearning] = useState(0);
  const cards = data?.cards || [];
  if (!cards.length) return null;
  const card = cards[idx];

  const next = (wasKnown) => {
    if (wasKnown) setKnown(k => k + 1); else setLearning(l => l + 1);
    setFlipped(false);
    setTimeout(() => setIdx(i => Math.min(i + 1, cards.length - 1)), 200);
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {cards.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i < idx ? "#10b981" : i === idx ? "#6366f1" : "rgba(99,102,241,0.12)", transition: "background 0.3s" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>{idx + 1} / {cards.length}</span>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "#059669" }}>✓ {known}</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "#d97706" }}>↺ {learning}</span>
        </div>
      </div>

      <div onClick={() => setFlipped(f => !f)} style={{ perspective: 1200, cursor: "pointer", marginBottom: 20 }}>
        <div style={{ position: "relative", minHeight: 220, transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: 24, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 32, boxShadow: "0 8px 32px rgba(99,102,241,0.25)" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Question</p>
              <p style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: 20, fontWeight: 700, lineHeight: 1.4, margin: 0 }}>{card.front}</p>
              <p style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 20 }}>tap to reveal</p>
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 24, background: "#fff", border: "2px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", padding: 32, boxShadow: "0 8px 32px rgba(15,23,42,0.08)" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Answer</p>
              <p style={{ fontFamily: "var(--font-body)", color: "#0f172a", fontSize: 16, lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>{card.back}</p>
            </div>
          </div>
        </div>
      </div>

      {flipped ? (
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => next(false)} style={{ flex: 1, padding: "12px", borderRadius: 14, border: "1.5px solid rgba(217,119,6,0.3)", background: "rgba(245,158,11,0.06)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "#b45309", cursor: "pointer" }}>↺ Still Learning</button>
          <button onClick={() => next(true)} style={{ flex: 1, padding: "12px", borderRadius: 14, border: "1.5px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.06)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "#059669", cursor: "pointer" }}>✓ Got It</button>
        </div>
      ) : (
        <button onClick={() => setIdx(i => Math.max(i - 1, 0))} disabled={idx === 0} style={{ width: "100%", padding: "12px", borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)", background: "#fff", fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", cursor: idx === 0 ? "not-allowed" : "pointer", opacity: idx === 0 ? 0.4 : 1 }}>← Previous</button>
      )}
    </div>
  );
}

function QuizView({ data }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const questions = data?.questions || [];
  if (!questions.length) return null;
  const q = questions[qIdx];

  const check = () => { if (selected === null) return; setRevealed(true); if (selected === q.correct) setScore(s => s + 1); };
  const next = () => { if (qIdx < questions.length - 1) { setQIdx(i => i + 1); setSelected(null); setRevealed(false); } else setDone(true); };

  if (done) return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36, boxShadow: "0 8px 24px rgba(99,102,241,0.3)" }}>🏆</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.03em" }}>{score}/{questions.length}</h2>
      <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", marginBottom: 24 }}>{score === questions.length ? "Perfect score! 🎉" : score >= questions.length * 0.8 ? "Great work!" : "Keep practising!"}</p>
      <button onClick={() => { setQIdx(0); setSelected(null); setRevealed(false); setScore(0); setDone(false); }} style={{ padding: "12px 28px", borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Retry Quiz</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {questions.map((_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i < qIdx ? "#10b981" : i === qIdx ? "#6366f1" : "rgba(99,102,241,0.12)" }} />)}
      </div>
      <div style={{ background: "#fff", borderRadius: 20, padding: 24, marginBottom: 16, border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(15,23,42,0.06)" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-display)", color: "#fff", fontWeight: 700, fontSize: 13 }}>{qIdx + 1}</span>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: "#0f172a", lineHeight: 1.5, margin: 0 }}>{q.question}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {q.options.map((opt, i) => {
            let bg = "rgba(15,23,42,0.03)", border = "rgba(15,23,42,0.1)", color = "rgba(15,23,42,0.65)";
            if (!revealed && selected === i) { bg = "rgba(99,102,241,0.08)"; border = "rgba(99,102,241,0.5)"; color = "#3730a3"; }
            if (revealed && i === q.correct) { bg = "rgba(16,185,129,0.08)"; border = "rgba(16,185,129,0.5)"; color = "#065f46"; }
            if (revealed && selected === i && i !== q.correct) { bg = "rgba(239,68,68,0.08)"; border = "rgba(239,68,68,0.4)"; color = "#991b1b"; }
            return (
              <button key={i} disabled={revealed} onClick={() => setSelected(i)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, border: `1.5px solid ${border}`, background: bg, cursor: revealed ? "default" : "pointer", textAlign: "left", transition: "all 0.15s" }}>
                <span style={{ width: 26, height: 26, borderRadius: 8, background: `${border}40`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color, flexShrink: 0 }}>
                  {["A","B","C","D"][i]}
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color }}>{opt}</span>
                {revealed && i === q.correct && <span style={{ marginLeft: "auto" }}>✓</span>}
                {revealed && selected === i && i !== q.correct && <span style={{ marginLeft: "auto" }}>✗</span>}
              </button>
            );
          })}
        </div>
      </div>
      {revealed && (
        <div style={{ background: selected === q.correct ? "rgba(16,185,129,0.06)" : "rgba(99,102,241,0.06)", border: `1.5px solid ${selected === q.correct ? "rgba(16,185,129,0.25)" : "rgba(99,102,241,0.25)"}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: selected === q.correct ? "#059669" : "#4f46e5", marginBottom: 6 }}>{selected === q.correct ? "✓ Correct!" : "Here's why:"}</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>{q.explanation}</p>
        </div>
      )}
      {!revealed ? (
        <button onClick={check} disabled={selected === null} style={{ width: "100%", padding: 14, borderRadius: 14, background: selected !== null ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(99,102,241,0.1)", border: "none", color: selected !== null ? "#fff" : "rgba(99,102,241,0.4)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, cursor: selected !== null ? "pointer" : "not-allowed", transition: "all 0.2s" }}>Check Answer</button>
      ) : (
        <button onClick={next} style={{ width: "100%", padding: 14, borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{qIdx < questions.length - 1 ? "Next Question →" : "Finish Quiz ✓"}</button>
      )}
    </div>
  );
}

function WorksheetView({ data }) {
  const [revealed, setRevealed] = useState(new Set());
  const problems = data?.problems || [];
  if (!problems.length) return null;
  const toggle = (i) => setRevealed(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {problems.map((p, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden", boxShadow: "0 2px 12px rgba(15,23,42,0.06)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, borderRadius: 9, background: "linear-gradient(135deg,#0ea5e9,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-mono)", color: "#fff", fontWeight: 600, fontSize: 12 }}>{i + 1}</span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500, color: "#0f172a", lineHeight: 1.6, margin: 0 }}>{p.question}</p>
            </div>
            {p.hint && (
              <div style={{ marginTop: 10, marginLeft: 40, padding: "8px 12px", borderRadius: 10, background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#92400e" }}>💡 Hint: {p.hint}</span>
              </div>
            )}
          </div>
          <div style={{ padding: "12px 20px" }}>
            <button onClick={() => toggle(i)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, color: "#0d9488" }}>
              {revealed.has(i) ? "▾ Hide Solution" : "▸ Show Solution"}
            </button>
            {revealed.has(i) && (
              <div style={{ marginTop: 12, padding: "14px 16px", borderRadius: 12, background: "rgba(16,185,129,0.05)", borderLeft: "3px solid rgba(16,185,129,0.4)" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#064e3b", lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{p.solution}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function APMathStudy() {
  const [subject, setSubject] = useState(null);
  const [topic, setTopic] = useState(null);
  const [mode, setMode] = useState("notes");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    const styleId = "ap-math-styles";
    if (!document.getElementById(styleId)) {
      const link = document.createElement("link");
      link.rel = "stylesheet"; link.href = FONT_LINK;
      document.head.appendChild(link);
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        :root {
          --bg: #f6f7fb; --font-display: 'Syne', sans-serif;
          --font-body: 'DM Sans', sans-serif; --font-mono: 'JetBrains Mono', monospace;
          --muted: rgba(15,23,42,0.52); --dim: rgba(15,23,42,0.35);
        }
        body { background: var(--bg); margin: 0; }
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 99px; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const load = useCallback(async (subjectObj, topicName, modeName) => {
    setLoading(true); setContent(null); setError(null);
    try {
      const data = await fetchContent(subjectObj.name, topicName, modeName);
      setContent(data);
      if (modeName === "notes") setCompleted(s => new Set([...s, `${subjectObj.id}::${topicName}`]));
    } catch (e) { setError("Failed to load content. Please try again."); }
    setLoading(false);
  }, []);

  const selectTopic = (subjectObj, topicName) => {
    setSubject(subjectObj); setTopic(topicName); setMode("notes"); setContent(null);
    load(subjectObj, topicName, "notes");
  };

  const switchMode = (m) => { setMode(m); load(subject, topic, m); };

  const totalTopics = SUBJECTS.reduce((s, sub) => s + sub.topics.length, 0);

  // Intro screen
  if (intro) return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 20% 40%, rgba(99,102,241,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 10%, rgba(139,92,246,0.06) 0%, transparent 55%), var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.07) 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }}>
      <div style={{ maxWidth: 520, width: "100%" }} className="fade-up">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)", borderRadius: 99, padding: "6px 16px", marginBottom: 24 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, color: "#4f46e5", textTransform: "uppercase", letterSpacing: 2 }}>AP Grade 10</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 800, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.05, letterSpacing: "-0.04em" }}>
            Your complete<br />
            <span style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed,#0891b2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AP math system</span>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 15, lineHeight: 1.6 }}>Notes, flashcards, quizzes & worksheets — AI-generated for every AP topic.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
          {SUBJECTS.map(sub => (
            <div key={sub.id} style={{ background: "#fff", borderRadius: 18, padding: 16, border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>{sub.icon}</div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>{sub.name}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", margin: 0 }}>{sub.topics.length} topics</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: 20, marginBottom: 20, border: "1px solid rgba(0,0,0,0.07)" }}>
          {[["01","Browse AP topics","Select a subject area and dive into any topic."],["02","Choose your mode","Study notes, flashcards, quiz, or worksheet."],["03","AI-generated content","Every section is generated fresh at AP difficulty."]].map(([n, title, body]) => (
            <div key={n} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "rgba(99,102,241,0.6)", minWidth: 24 }}>{n}</span>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "#0f172a", margin: "0 0 2px" }}>{title}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", margin: 0 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setIntro(false)} style={{ width: "100%", padding: "15px", borderRadius: 16, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 20px rgba(99,102,241,0.35)", letterSpacing: "-0.01em" }}>
          Open Library →
        </button>
      </div>
    </div>
  );

  // Topic detail view
  if (subject && topic) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.06) 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "0 20px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", height: 54, display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => { setSubject(null); setTopic(null); setContent(null); }}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "var(--muted)", padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = "#0f172a"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>
            ← Library
          </button>
          <span style={{ color: "var(--dim)" }}>›</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>{subject.name}</span>
          <span style={{ color: "var(--dim)" }}>›</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{topic}</span>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ borderRadius: 24, padding: 28, marginBottom: 24, background: `linear-gradient(135deg, #6366f1, #8b5cf6)`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.18) 0%, transparent 60%)" }} />
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 36 }}>{subject.icon}</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "#fff", margin: "8px 0 4px", letterSpacing: "-0.03em" }}>{topic}</h1>
            <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.7)", fontSize: 13, margin: 0 }}>{subject.name}</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {MODES.map(m => (
            <button key={m.id} onClick={() => switchMode(m.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 12, border: mode === m.id ? "2px solid rgba(99,102,241,0.4)" : "1.5px solid rgba(0,0,0,0.08)", background: mode === m.id ? "rgba(99,102,241,0.08)" : "#fff", fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: mode === m.id ? "#4f46e5" : "var(--muted)", cursor: "pointer", transition: "all 0.15s", boxShadow: mode === m.id ? "none" : "0 1px 4px rgba(15,23,42,0.05)" }}>
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>

        <div className="fade-up" key={`${topic}-${mode}`}>
          {loading && <Spinner />}
          {error && <div style={{ textAlign: "center", padding: 40, color: "#dc2626", fontFamily: "var(--font-body)", fontSize: 14 }}>{error}</div>}
          {!loading && !error && content && (
            <>
              {mode === "notes" && <NotesView data={content} />}
              {mode === "flashcards" && <FlashcardsView data={content} />}
              {mode === "quiz" && <QuizView data={content} />}
              {mode === "worksheet" && <WorksheetView data={content} />}
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Subject / topic browser
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.07) 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "0 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 13 }}>∑</span>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "#0f172a" }}>MathLib</span>
            <span style={{ color: "var(--dim)" }}>·</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)" }}>AP Grade 10</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: "5px 12px" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px rgba(16,185,129,0.6)" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>{completed.size} completed</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 20px" }}>
        <div style={{ borderRadius: 28, padding: "36px 40px", marginBottom: 40, background: "linear-gradient(135deg,#eef2ff 0%,#f0fdf4 60%,#faf5ff 100%)", border: "1px solid rgba(99,102,241,0.1)", position: "relative", overflow: "hidden" }} className="fade-up">
          <div style={{ position: "absolute", top: 0, right: 0, width: 280, height: 280, borderRadius: "50%", background: "rgba(99,102,241,0.1)", filter: "blur(60px)", transform: "translate(30%, -30%)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)", borderRadius: 99, padding: "5px 14px", marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 700, color: "#4f46e5", textTransform: "uppercase", letterSpacing: 2 }}>Interactive Study Library</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 42, fontWeight: 800, color: "#0f172a", margin: "0 0 10px", lineHeight: 1.05, letterSpacing: "-0.04em" }}>AP Grade 10 Math</h1>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 15, maxWidth: 480, lineHeight: 1.6, margin: "0 0 24px" }}>
              AI-powered notes, flashcards, AP-style quizzes, and worksheets across all four units.
            </p>
            <div style={{ display: "flex", gap: 32 }}>
              {[{ val: totalTopics, label: "Topics" }, { val: SUBJECTS.length, label: "Units" }, { val: completed.size, label: "Completed" }].map(({ val, label }) => (
                <div key={label}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "#0f172a", margin: 0, lineHeight: 1 }}>{val}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--dim)", margin: "4px 0 0" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {SUBJECTS.map((sub, si) => (
          <div key={sub.id} style={{ marginBottom: 32, animation: `fadeUp 0.35s ${si * 0.08}s cubic-bezier(0.22,1,0.36,1) both` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 4, height: 18, borderRadius: 99, background: "linear-gradient(to bottom,#6366f1,#8b5cf6)" }} />
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>{sub.name}</h2>
              <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.06)" }} />
              <Badge color="indigo">{sub.topics.filter(t => completed.has(`${sub.id}::${t}`)).length}/{sub.topics.length}</Badge>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {sub.topics.map((t, ti) => {
                const isDone = completed.has(`${sub.id}::${t}`);
                return (
                  <button key={ti} onClick={() => selectTopic(sub, t)}
                    style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: 16, background: isDone ? "rgba(16,185,129,0.04)" : "#fff", border: isDone ? "1.5px solid rgba(16,185,129,0.3)" : "1.5px solid rgba(0,0,0,0.08)", cursor: "pointer", textAlign: "left", transition: "all 0.15s", boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(99,102,241,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,23,42,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, background: isDone ? "rgba(16,185,129,0.12)" : `linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
                      {isDone ? "✓" : sub.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: isDone ? "#065f46" : "#0f172a", margin: "0 0 3px", lineHeight: 1.3 }}>{t}</p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", margin: 0 }}>Notes · Cards · Quiz · Sheet</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
