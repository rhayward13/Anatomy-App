import { useState } from 'react';

const SEGMENTS = {
  afferent: { label: 'Afferent Arteriole', kind: 'vascular' },
  glomerulus: { label: 'Glomerulus', kind: 'vascular' },
  efferent: { label: 'Efferent Arteriole', kind: 'vascular' },
  peritubular: { label: 'Peritubular Capillaries', kind: 'vascular' },
  bowmans: { label: "Bowman's Capsule", kind: 'tubular' },
  pct: { label: 'Proximal Convoluted Tubule', kind: 'tubular' },
  loop: { label: 'Loop of Henle', kind: 'tubular' },
  dct: { label: 'Distal Convoluted Tubule', kind: 'tubular' },
  collecting: { label: 'Collecting Duct', kind: 'tubular' },
};

function Segment({ id, active, onSelect, children }) {
  return (
    <g
      className={`nephron-segment ${active ? 'active' : ''}`}
      onClick={() => onSelect(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(id);
        }
      }}
      aria-label={SEGMENTS[id].label}
    >
      {children}
    </g>
  );
}

function NephronDiagram({ active, onSelect }) {
  const tubular = '#3ea6ff';
  const vascular = '#e05a5a';
  const vascularLight = '#f08585';
  const labelColor = '#cbd5e1';

  return (
    <svg
      viewBox="0 0 820 680"
      className="w-full h-auto select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cortex / Medulla divider */}
      <line
        x1="20"
        y1="310"
        x2="800"
        y2="310"
        stroke="#64748b"
        strokeWidth="1.5"
        strokeDasharray="8 6"
      />
      <text x="28" y="300" fill={labelColor} fontSize="13" fontWeight="600" letterSpacing="2">
        CORTEX
      </text>
      <text x="28" y="330" fill={labelColor} fontSize="13" fontWeight="600" letterSpacing="2">
        MEDULLA
      </text>

      {/* ---------- VASCULAR SIDE (left) ---------- */}

      {/* Afferent arteriole */}
      <Segment id="afferent" active={active === 'afferent'} onSelect={onSelect}>
        <path
          d="M 60 80 C 90 110, 130 130, 175 160"
          stroke={vascular}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        <text x="40" y="70" fill={labelColor} fontSize="13" fontWeight="500">
          Afferent arteriole
        </text>
      </Segment>

      {/* Glomerulus (capillary tuft) */}
      <Segment id="glomerulus" active={active === 'glomerulus'} onSelect={onSelect}>
        <g>
          <circle cx="210" cy="180" r="36" fill="#2a1015" stroke={vascular} strokeWidth="2" />
          {/* tangled capillaries */}
          <path
            d="M 185 170 C 195 155, 220 158, 235 170 M 180 180 C 200 168, 225 180, 240 175 M 182 195 C 200 185, 220 200, 240 190 M 190 205 C 205 198, 225 210, 238 202"
            stroke={vascularLight}
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <text x="168" y="140" fill={labelColor} fontSize="13" fontWeight="500">
            Glomerulus
          </text>
        </g>
      </Segment>

      {/* Bowman's capsule (cup around glomerulus) */}
      <Segment id="bowmans" active={active === 'bowmans'} onSelect={onSelect}>
        <path
          d="M 255 155 C 285 165, 290 200, 260 215 L 248 212 C 272 200, 270 175, 250 168 Z"
          stroke={tubular}
          strokeWidth="2.5"
          fill="rgba(62,166,255,0.08)"
        />
        <path
          d="M 170 160 C 145 170, 140 200, 170 212"
          stroke={tubular}
          strokeWidth="2.5"
          fill="none"
        />
        <text x="270" y="158" fill={labelColor} fontSize="13" fontWeight="500">
          Bowman's capsule
        </text>
      </Segment>

      {/* Efferent arteriole */}
      <Segment id="efferent" active={active === 'efferent'} onSelect={onSelect}>
        <path
          d="M 240 200 C 275 215, 295 245, 300 290"
          stroke={vascular}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <text x="245" y="245" fill={labelColor} fontSize="13" fontWeight="500">
          Efferent arteriole
        </text>
      </Segment>

      {/* Peritubular capillaries — a winding net alongside PCT / DCT */}
      <Segment id="peritubular" active={active === 'peritubular'} onSelect={onSelect}>
        <path
          d="M 300 290 C 330 270, 360 300, 385 280 C 420 258, 455 295, 490 275 C 525 255, 560 290, 590 270"
          stroke={vascularLight}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 305 298 C 340 285, 370 308, 400 288 C 430 272, 465 306, 500 286 C 530 270, 565 302, 595 280"
          stroke={vascular}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.75"
        />
        <text x="380" y="255" fill={labelColor} fontSize="13" fontWeight="500">
          Peritubular capillaries
        </text>
      </Segment>

      {/* ---------- TUBULAR SIDE (right) ---------- */}

      {/* Proximal convoluted tubule */}
      <Segment id="pct" active={active === 'pct'} onSelect={onSelect}>
        <path
          d="M 270 215
             C 310 205, 310 245, 350 235
             C 390 225, 390 265, 430 255
             C 470 245, 470 285, 510 275
             L 520 290"
          stroke={tubular}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="340" y="220" fill={labelColor} fontSize="13" fontWeight="500">
          Proximal tubule
        </text>
      </Segment>

      {/* Loop of Henle — descending + bottom + ascending */}
      <Segment id="loop" active={active === 'loop'} onSelect={onSelect}>
        {/* descending */}
        <path
          d="M 520 290 L 520 560"
          stroke={tubular}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        {/* U-turn */}
        <path
          d="M 520 560 C 520 600, 580 600, 580 560"
          stroke={tubular}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        {/* ascending — drawn thicker to imply impermeable-to-water / active transport */}
        <path
          d="M 580 560 L 580 290"
          stroke={tubular}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="0"
        />
        <text x="440" y="460" fill={labelColor} fontSize="13" fontWeight="500">
          Loop of Henle
        </text>
        <text x="500" y="540" fill="#94a3b8" fontSize="11">
          desc.
        </text>
        <text x="585" y="540" fill="#94a3b8" fontSize="11">
          asc.
        </text>
      </Segment>

      {/* Distal convoluted tubule */}
      <Segment id="dct" active={active === 'dct'} onSelect={onSelect}>
        <path
          d="M 580 290
             C 615 280, 615 240, 655 250
             C 695 260, 695 220, 720 230"
          stroke={tubular}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="610" y="215" fill={labelColor} fontSize="13" fontWeight="500">
          Distal tubule
        </text>
      </Segment>

      {/* Collecting duct */}
      <Segment id="collecting" active={active === 'collecting'} onSelect={onSelect}>
        <path
          d="M 720 230
             C 735 250, 740 270, 740 290
             L 740 630"
          stroke={tubular}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        {/* papilla */}
        <path
          d="M 730 630 L 750 630 L 740 655 Z"
          fill={tubular}
          opacity="0.8"
        />
        <text x="755" y="450" fill={labelColor} fontSize="13" fontWeight="500">
          Collecting
        </text>
        <text x="755" y="466" fill={labelColor} fontSize="13" fontWeight="500">
          duct
        </text>
      </Segment>
    </svg>
  );
}

export default function App() {
  const [mode, setMode] = useState('learn');
  const [active, setActive] = useState(null);

  const activeLabel = active ? SEGMENTS[active].label : null;

  return (
    <div className="min-h-full bg-navy-950 text-slate-100">
      {/* Top nav */}
      <header className="border-b border-navy-800 bg-navy-900/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl" aria-hidden>💧</span>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight truncate">
                Follow the Drop
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Chapter 19 — A Journey Through the Nephron
              </p>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Mode"
            className="inline-flex rounded-full bg-navy-800 p-1 border border-navy-700 shrink-0"
          >
            <button
              role="tab"
              aria-selected={mode === 'learn'}
              onClick={() => setMode('learn')}
              className={`px-3 sm:px-4 py-1.5 text-sm font-medium rounded-full transition ${
                mode === 'learn'
                  ? 'bg-electric text-navy-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Learn
            </button>
            <button
              role="tab"
              aria-selected={mode === 'quiz'}
              onClick={() => setMode('quiz')}
              className={`px-3 sm:px-4 py-1.5 text-sm font-medium rounded-full transition ${
                mode === 'quiz'
                  ? 'bg-amber-warm text-navy-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Quiz
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {mode === 'quiz' ? (
          <div className="rounded-xl border border-amber-warm/40 bg-navy-900 p-8 text-center">
            <div className="text-4xl mb-2" aria-hidden>📊</div>
            <h2 className="text-xl font-semibold mb-1">Quiz Mode</h2>
            <p className="text-slate-400">Coming soon — stations will light up one at a time with questions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            {/* Diagram */}
            <section className="rounded-xl border border-navy-800 bg-navy-900 p-4 sm:p-6">
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="text-base font-semibold">The Nephron</h2>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Click a segment to inspect
                </p>
              </div>
              <NephronDiagram active={active} onSelect={setActive} />
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-1.5 rounded-full bg-electric" />
                  Tubular (nephron)
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-1.5 rounded-full bg-[#e05a5a]" />
                  Vascular (blood)
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-5 border-t border-dashed border-slate-400" />
                  Cortex / medulla boundary
                </span>
              </div>
            </section>

            {/* Side panel */}
            <aside className="rounded-xl border border-navy-800 bg-navy-900 p-5 h-fit lg:sticky lg:top-20">
              <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-2">
                Station
              </h3>
              {activeLabel ? (
                <>
                  <p className="text-xl font-semibold mb-1">{activeLabel}</p>
                  <p className="text-xs text-slate-400 mb-4">
                    {SEGMENTS[active].kind === 'vascular' ? 'Vascular side' : 'Tubular side'}
                  </p>
                  <div className="rounded-lg border border-navy-700 bg-navy-800/60 p-4 text-sm text-slate-300">
                    Station info coming soon.
                  </div>
                  <button
                    onClick={() => setActive(null)}
                    className="mt-4 text-xs text-slate-400 hover:text-white underline underline-offset-2"
                  >
                    Clear selection
                  </button>
                </>
              ) : (
                <div className="text-sm text-slate-400">
                  <p className="mb-2">
                    Select a nephron segment from the diagram to begin.
                  </p>
                  <p className="text-xs text-slate-500">
                    Each segment will glow on hover.
                  </p>
                </div>
              )}
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
