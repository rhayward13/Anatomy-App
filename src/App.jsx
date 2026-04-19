import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';

const SEGMENTS = {
  afferent: { label: 'Afferent Arteriole', kind: 'vascular', station: 'filtration' },
  glomerulus: { label: 'Glomerulus', kind: 'vascular', station: 'filtration' },
  efferent: { label: 'Efferent Arteriole', kind: 'vascular' },
  peritubular: { label: 'Peritubular Capillaries', kind: 'vascular' },
  bowmans: { label: "Bowman's Capsule", kind: 'tubular', station: 'filtration' },
  pct: { label: 'Proximal Convoluted Tubule', kind: 'tubular', station: 'pct' },
  loop: { label: 'Loop of Henle', kind: 'tubular', station: 'loop' },
  dct: { label: 'Distal Convoluted Tubule', kind: 'tubular', station: 'distal' },
  collecting: { label: 'Collecting Duct', kind: 'tubular', station: 'distal' },
};

const AMBER = '#F59E0B';
const BLUE = '#3B82F6';

function Pill({ children, color = BLUE }) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold"
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}55` }}
    >
      {children}
    </span>
  );
}

function Callout({ children, title }) {
  return (
    <div
      className="rounded-lg p-3 text-sm"
      style={{ border: `1px solid ${AMBER}`, backgroundColor: `${AMBER}14` }}
    >
      {title && (
        <div
          className="text-xs font-bold uppercase tracking-wider mb-1"
          style={{ color: AMBER }}
        >
          {title}
        </div>
      )}
      <div className="text-slate-200">{children}</div>
    </div>
  );
}

function FlowRow({ from, to }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-300">
      <span className="px-2 py-1 rounded bg-navy-800 border border-navy-700 whitespace-nowrap">
        {from}
      </span>
      <span style={{ color: BLUE }}>→</span>
      <span className="px-2 py-1 rounded bg-navy-800 border border-navy-700 whitespace-nowrap">
        {to}
      </span>
    </div>
  );
}

function GoDeeper({ children }) {
  return (
    <details className="mt-4 group rounded-lg border border-navy-700 bg-navy-800/40">
      <summary
        className="px-4 py-2.5 text-sm font-semibold flex items-center justify-between"
        style={{ color: BLUE }}
      >
        <span>Go Deeper</span>
        <span
          className="transition-transform group-open:rotate-90 text-slate-400"
          aria-hidden
        >
          ▸
        </span>
      </summary>
      <div className="px-4 pb-4 pt-1 space-y-4 text-sm text-slate-300">
        {children}
      </div>
    </details>
  );
}

const STATION_CONTENT = {
  filtration: {
    title: 'Filtration',
    subtitle: 'Afferent arteriole → Glomerulus → Bowman’s capsule',
    plain:
      'Blood is forced through a filter under high pressure. 20% of plasma becomes protein-free filtrate.',
    details: (
      <>
        <Callout title="Net filtration pressure">
          <div className="font-mono text-base text-white">
            P<sub>H</sub>(55) − π(30) − P<sub>fluid</sub>(15) ={' '}
            <span style={{ color: AMBER }} className="font-bold">
              10 mmHg
            </span>
          </div>
          <div className="text-xs text-slate-300 mt-1">
            Blood pressure promotes filtration; colloid osmotic pressure and
            Bowman’s capsule fluid pressure oppose it.
          </div>
        </Callout>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-navy-700 bg-navy-900 p-3">
            <div className="text-xs text-slate-400">GFR</div>
            <div className="text-base font-semibold" style={{ color: BLUE }}>
              125 mL/min
            </div>
            <div className="text-xs text-slate-400">= 180 L/day</div>
          </div>
          <div className="rounded-lg border border-navy-700 bg-navy-900 p-3">
            <div className="text-xs text-slate-400">Filtration fraction</div>
            <div className="text-base font-semibold" style={{ color: BLUE }}>
              20%
            </div>
            <div className="text-xs text-slate-400">of plasma entering</div>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
            Filtration barrier (3 layers)
          </div>
          <ol className="space-y-1.5">
            {[
              'Capillary endothelium (pores)',
              'Basal lamina (fused basement membrane)',
              'Podocyte foot processes (filtration slits)',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold shrink-0"
                  style={{ backgroundColor: `${BLUE}33`, color: BLUE }}
                >
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-navy-700 bg-navy-900 p-3 space-y-2">
          <div>
            <Pill color={AMBER}>Mesangial cells</Pill>
            <span className="ml-2 text-slate-300">
              contract/relax to alter surface area and blood flow (change GFR).
            </span>
          </div>
          <div className="pt-2 border-t border-navy-700 text-xs space-y-1">
            <div>
              <span className="text-slate-400">Visceral layer =</span>{' '}
              <span className="text-white font-medium">podocytes</span>
            </div>
            <div>
              <span className="text-slate-400">Parietal layer =</span>{' '}
              <span className="text-white font-medium">capsular epithelium</span>
            </div>
          </div>
        </div>
      </>
    ),
  },

  pct: {
    title: 'Proximal Convoluted Tubule',
    subtitle: 'Reabsorption + Secretion',
    plain:
      'The workhorse. Reclaims 70% of everything — glucose, amino acids, Na+, water. Isosmotic: volume drops but concentration stays at 300 mOsm.',
    details: (
      <>
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-slate-400">
            Filtrate flow
          </div>
          <FlowRow
            from="180 L/day · 100% · 300 mOsm"
            to="54 L/day · 30% · 300 mOsm"
          />
          <div className="text-xs text-slate-400 italic">
            Isosmotic reabsorption — water follows solutes proportionally.
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
            4 Reabsorption mechanisms
          </div>
          <ul className="space-y-2">
            {[
              {
                tag: 'Primary active',
                icon: '⚡',
                text: 'ENaC (apical) + Na⁺/K⁺-ATPase (basolateral) — the engine driving everything else.',
              },
              {
                tag: 'Secondary active',
                icon: '🔄',
                text: 'SGLT (apical) co-transports glucose with Na⁺; GLUT (basolateral) releases glucose to blood.',
              },
              {
                tag: 'Passive',
                icon: '💧',
                text: 'Urea follows water osmotically as filtrate concentrates.',
              },
              {
                tag: 'Endocytosis',
                icon: '📊',
                text: 'Small peptides → receptor-mediated endocytosis → lysosomes → amino acids returned to blood.',
              },
            ].map((m, i) => (
              <li
                key={i}
                className="rounded-lg border border-navy-700 bg-navy-900 p-2.5 flex gap-2.5"
              >
                <span className="text-lg leading-none mt-0.5" aria-hidden>
                  {m.icon}
                </span>
                <div className="min-w-0">
                  <Pill>{m.tag}</Pill>
                  <div className="text-slate-300 mt-1 text-xs">{m.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Callout title="Secretion">
          <span className="text-slate-200">
            Tertiary active transport of organic anions via the{' '}
            <span className="font-semibold" style={{ color: AMBER }}>
              OAT
            </span>{' '}
            pathway. Penicillin and PAH are secreted here — classic exam
            examples.
          </span>
        </Callout>

        <div className="rounded-lg border border-navy-700 bg-navy-900 p-3">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-1.5">
            Peritubular capillaries — Starling forces
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded bg-navy-800 p-2">
              <div className="text-slate-400">P<sub>H</sub></div>
              <div className="font-semibold text-red-300">10 mmHg</div>
              <div className="text-[10px] text-slate-500">opposes</div>
            </div>
            <div className="rounded bg-navy-800 p-2">
              <div className="text-slate-400">π</div>
              <div className="font-semibold" style={{ color: BLUE }}>
                30 mmHg
              </div>
              <div className="text-[10px] text-slate-500">promotes</div>
            </div>
            <div
              className="rounded p-2"
              style={{ backgroundColor: `${AMBER}1a`, border: `1px solid ${AMBER}55` }}
            >
              <div className="text-slate-400">Net</div>
              <div className="font-semibold" style={{ color: AMBER }}>
                20 mmHg
              </div>
              <div className="text-[10px] text-slate-500">reabsorb</div>
            </div>
          </div>
        </div>
      </>
    ),
  },

  loop: {
    title: 'Loop of Henle',
    subtitle: 'Sets up the medullary concentration gradient',
    plain:
      'Descending limb loses water. Ascending limb pumps out ions but NOT water — diluting filtrate to 100 mOsm and salting the medulla.',
    details: (
      <>
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-slate-400">
            Filtrate flow
          </div>
          <FlowRow
            from="54 L/day · 300 mOsm"
            to="18 L/day · 100 mOsm (dilute)"
          />
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className="rounded-lg border border-navy-700 bg-navy-900 p-3">
            <div className="flex items-center gap-2 mb-1">
              <span aria-hidden>💧</span>
              <Pill>Descending limb</Pill>
            </div>
            <div className="text-xs text-slate-300">
              Permeable to <span className="text-white font-medium">water only</span>.
              Water exits by osmosis into the increasingly salty medulla; filtrate
              concentrates as it descends.
            </div>
          </div>

          <div className="rounded-lg border border-navy-700 bg-navy-900 p-3">
            <div className="flex items-center gap-2 mb-1">
              <span aria-hidden>🚫</span>
              <Pill color={AMBER}>Ascending limb</Pill>
            </div>
            <div className="text-xs text-slate-300">
              <span className="text-white font-medium">Impermeable to water</span>.
              Actively pumps{' '}
              <span className="font-semibold" style={{ color: AMBER }}>
                Na⁺, Cl⁻, K⁺
              </span>{' '}
              out into the medulla → filtrate dilutes; medullary interstitium
              gets saltier.
            </div>
          </div>
        </div>

        <Callout title="Unusual urea handling">
          Urea is <span className="font-semibold" style={{ color: AMBER }}>secreted</span>{' '}
          INTO the ascending limb from the medullary interstitium — one of the
          few places urea moves that direction.
        </Callout>
      </>
    ),
  },

  distal: {
    title: 'Distal Tubule + Collecting Duct',
    subtitle: 'Regulated reabsorption · pH balance · final output',
    plain:
      'Fine-tuning. Hormones decide how much Na⁺, K⁺, Ca²⁺, and water to keep. pH balance happens here. Past the papilla = officially urine.',
    details: (
      <>
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-slate-400">
            Filtrate flow
          </div>
          <FlowRow
            from="18 L/day (entering DCT)"
            to="1.5 L/day · 50–1200 mOsm"
          />
          <div className="text-xs text-slate-400 italic">
            Osmolarity range is wide because water reabsorption is hormonally
            controlled (ADH, Ch. 20).
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
            K⁺ handling — diet-dependent
          </div>
          <div className="space-y-1.5">
            {[
              { diet: 'Low K⁺', value: '2% excreted', note: 'conserve', color: BLUE },
              { diet: 'Normal K⁺', value: '10–20% excreted', note: 'balance', color: BLUE },
              { diet: 'High K⁺', value: 'up to 150% excreted', note: 'net secretion', color: AMBER },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-xs"
              >
                <span className="w-20 text-slate-400 shrink-0">{row.diet}</span>
                <span className="font-semibold" style={{ color: row.color }}>
                  {row.value}
                </span>
                <span className="ml-auto text-[10px] text-slate-500 italic">
                  {row.note}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className="rounded-lg border border-navy-700 bg-navy-900 p-3">
            <Pill>DCT</Pill>
            <div className="text-xs text-slate-300 mt-1.5">
              Reabsorbs <span className="text-white font-medium">Na⁺, Cl⁻, Ca²⁺</span>{' '}
              (regulated) · secretes{' '}
              <span className="text-white font-medium">K⁺ and H⁺</span> (pH balance)
            </div>
          </div>
          <div className="rounded-lg border border-navy-700 bg-navy-900 p-3">
            <Pill>Collecting duct</Pill>
            <div className="text-xs text-slate-300 mt-1.5">
              Reabsorbs <span className="text-white font-medium">Na⁺, Cl⁻, urea</span>.
              K⁺ reabsorbed OR secreted depending on diet.
            </div>
          </div>
        </div>

        <Callout title="When does filtrate become urine?">
          The moment it passes the{' '}
          <span className="font-semibold" style={{ color: AMBER }}>
            papilla
          </span>{' '}
          at the bottom of the medullary pyramid. Beyond that point it's URINE,
          not filtrate.
        </Callout>
      </>
    ),
  },

  micturition: {
    title: 'Micturition',
    subtitle: 'The urination reflex',
    plain:
      'Urine flows into the bladder. When it fills, stretch receptors trigger a reflex. Higher CNS can override — that\'s why you can "hold it."',
    details: (
      <>
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
            At rest (bladder filling)
          </div>
          <ul className="space-y-1.5">
            {[
              { label: 'Detrusor', value: 'Relaxed' },
              { label: 'Internal sphincter (smooth)', value: 'Passively contracted' },
              { label: 'External sphincter (skeletal)', value: 'Contracted — tonic motor neuron firing' },
            ].map((row, i) => (
              <li
                key={i}
                className="rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-xs flex items-center gap-2"
              >
                <span className="text-slate-400 shrink-0 min-w-0">{row.label}</span>
                <span className="ml-auto text-white text-right">{row.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
            Micturition reflex
          </div>
          <ol className="space-y-1.5">
            {[
              'Stretch receptors fire as bladder fills',
              'Sensory neuron → spinal cord',
              'Parasympathetic fires; external-sphincter motor neuron inhibited',
              'Detrusor contracts; internal sphincter passively opens; external sphincter relaxes',
              'Urine flows',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <span
                  className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold shrink-0"
                  style={{ backgroundColor: `${BLUE}33`, color: BLUE }}
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <Callout title="Voluntary control">
          Higher CNS input can facilitate or inhibit the reflex — that's how you
          consciously delay urination or initiate it.
        </Callout>
      </>
    ),
  },
};

function KidneyOverview({ onOpenMicturition }) {
  const funcs = [
    { icon: '💧', label: 'Volume regulation' },
    { icon: '❤️', label: 'Blood pressure' },
    { icon: '⚖️', label: 'Osmolarity regulation' },
    { icon: '⚡', label: 'Ion balance' },
    { icon: '🚫', label: 'Waste removal' },
    { icon: '📊', label: 'Endocrine' },
  ];
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-2">
          Kidney Overview
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          Start by clicking a nephron segment — or read the big picture first.
        </p>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
          6 Functions
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {funcs.map((f, i) => (
            <div
              key={i}
              className="rounded-md border border-navy-700 bg-navy-900 px-2.5 py-1.5 text-xs flex items-center gap-2"
            >
              <span aria-hidden>{f.icon}</span>
              <span className="text-slate-200">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Callout title="Endocrine — professor's callout">
        <ul className="space-y-1 text-xs">
          <li>
            <span className="font-semibold" style={{ color: AMBER }}>EPO</span> —{' '}
            cytokine, <em>not</em> a hormone
          </li>
          <li>
            <span className="font-semibold" style={{ color: AMBER }}>Renin</span> —{' '}
            enzyme, <em>not</em> a hormone
          </li>
          <li>
            <span className="font-semibold" style={{ color: AMBER }}>1,25-dihydroxyvitamin D</span> —{' '}
            promotes phosphate/calcium absorption
          </li>
        </ul>
      </Callout>

      <div className="rounded-lg border border-navy-700 bg-navy-900 p-3">
        <div className="text-xs uppercase tracking-wider text-slate-400 mb-1.5">
          Path of urine
        </div>
        <div className="text-xs text-slate-200 leading-relaxed">
          Nephron → renal pelvis → ureter → bladder → urethra
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div className="rounded-lg border border-navy-700 bg-navy-900 p-3">
          <Pill>Cortex</Pill>
          <div className="text-xs text-slate-300 mt-1.5">
            Bowman's capsules · PCT · DCT
          </div>
        </div>
        <div className="rounded-lg border border-navy-700 bg-navy-900 p-3">
          <Pill color={AMBER}>Medulla</Pill>
          <div className="text-xs text-slate-300 mt-1.5">
            Loops of Henle · collecting ducts
          </div>
        </div>
      </div>

      <button
        onClick={onOpenMicturition}
        className="w-full text-left text-xs text-slate-400 hover:text-white underline underline-offset-2"
      >
        Or jump to micturition →
      </button>
    </div>
  );
}

function FormulaBar() {
  const formulas = [
    {
      label: 'Excretion',
      body: (
        <>
          <span style={{ color: AMBER }}>Filtration</span> −{' '}
          <span style={{ color: BLUE }}>Reabsorption</span> +{' '}
          <span style={{ color: AMBER }}>Secretion</span>
        </>
      ),
    },
    {
      label: 'Net filtration pressure',
      body: (
        <>
          55 − 30 − 15 ={' '}
          <span style={{ color: AMBER }} className="font-bold">10 mmHg</span>
        </>
      ),
    },
    {
      label: 'Clearance of X',
      body: (
        <>
          <span style={{ color: BLUE }}>excretion rate (mg/min)</span> ÷{' '}
          <span style={{ color: BLUE }}>[X]<sub>plasma</sub> (mg/mL)</span>
        </>
      ),
    },
  ];

  return (
    <div
      role="region"
      aria-label="Master formulas"
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-navy-800 bg-navy-950/95 backdrop-blur"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto panel-scroll">
          <span
            className="text-[10px] font-bold uppercase tracking-widest shrink-0 hidden sm:inline"
            style={{ color: AMBER }}
          >
            Formulas
          </span>
          <div className="flex items-stretch gap-2 flex-1">
            {formulas.map((f, i) => (
              <div
                key={i}
                className="flex-1 min-w-[240px] rounded-md border border-navy-800 bg-navy-900 px-3 py-1.5"
              >
                <div className="text-[10px] uppercase tracking-wider text-slate-400">
                  {f.label}
                </div>
                <div className="text-xs sm:text-sm font-mono text-slate-100 truncate">
                  {f.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const GREEN = '#10B981';

const SOLUTES = [
  { solute: 'Na⁺',     pct: 'R',        loop: 'R',   distal: 'Regulated R', excretion: '~1%',        trap: false },
  { solute: 'Cl⁻',     pct: 'R',        loop: 'R',   distal: 'R',           excretion: '~1%',        trap: false },
  { solute: 'K⁺',      pct: 'R',        loop: 'R',   distal: 'R or S (diet)', excretion: '2–150%',   trap: false },
  { solute: 'Ca²⁺',    pct: 'R',        loop: 'R',   distal: 'Regulated R', excretion: '~1%',        trap: false },
  { solute: 'Glucose', pct: '100% R',   loop: '—',   distal: '—',           excretion: '0% normally',trap: false },
  { solute: 'Urea',    pct: 'R',        loop: 'S',   distal: 'R',           excretion: '30–50%',     trap: true, trapCell: 'loop' },
  { solute: 'PAH',     pct: 'S',        loop: '—',   distal: '—',           excretion: '500%',       trap: true, trapCell: 'pct' },
];

function SoluteCell({ value, highlight }) {
  // Decide color from leading token
  const isR = /^R\b|^100% R|^Regulated R|^R or/.test(value);
  const isS = /^S\b|^R or S|or S/.test(value);
  let color = null;
  if (isR && !isS) color = GREEN;
  else if (isS && !isR) color = BLUE;
  else if (isR && isS) color = null;

  return (
    <td
      className="px-3 py-2 text-xs align-middle"
      style={
        highlight
          ? { border: `2px solid ${AMBER}`, backgroundColor: `${AMBER}1f`, borderRadius: 4 }
          : undefined
      }
    >
      {value === 'R' || value === 'S' ? (
        <span
          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold"
          style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}66` }}
        >
          {value}
        </span>
      ) : value === '—' ? (
        <span className="text-slate-500">—</span>
      ) : (
        <span style={color ? { color } : undefined} className="font-medium">
          {value}
        </span>
      )}
    </td>
  );
}

function SolutesTable() {
  return (
    <section className="rounded-xl border border-navy-800 bg-navy-900 p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div>
          <h2 className="text-base font-semibold">Renal Handling of Key Solutes</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            What each segment does with each solute, end-to-end.
          </p>
        </div>
        <div
          className="rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest"
          style={{ backgroundColor: `${AMBER}22`, color: AMBER, border: `1px solid ${AMBER}` }}
        >
          Professor: KNOW THIS
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-3 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
            style={{ backgroundColor: `${GREEN}22`, color: GREEN, border: `1px solid ${GREEN}66` }}
          >R</span>
          <span className="text-slate-400">Reabsorbed</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
            style={{ backgroundColor: `${BLUE}22`, color: BLUE, border: `1px solid ${BLUE}66` }}
          >S</span>
          <span className="text-slate-400">Secreted</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block w-5 h-5 rounded"
            style={{ border: `2px solid ${AMBER}`, backgroundColor: `${AMBER}1f` }}
          />
          <span className="text-slate-400">Exam trap</span>
        </span>
      </div>

      <div className="overflow-x-auto panel-scroll">
        <table className="w-full border-separate" style={{ borderSpacing: 0 }}>
          <thead>
            <tr className="text-left">
              <th className="px-3 py-2 text-[11px] uppercase tracking-wider text-slate-400 border-b border-navy-700">
                Solute
              </th>
              <th className="px-3 py-2 text-[11px] uppercase tracking-wider text-slate-400 border-b border-navy-700">
                PCT
              </th>
              <th className="px-3 py-2 text-[11px] uppercase tracking-wider text-slate-400 border-b border-navy-700">
                Ascending Loop
              </th>
              <th className="px-3 py-2 text-[11px] uppercase tracking-wider text-slate-400 border-b border-navy-700">
                Distal Nephron
              </th>
              <th className="px-3 py-2 text-[11px] uppercase tracking-wider text-slate-400 border-b border-navy-700">
                Net Excretion
              </th>
            </tr>
          </thead>
          <tbody>
            {SOLUTES.map((row, i) => (
              <tr
                key={row.solute}
                className={i % 2 === 0 ? 'bg-navy-900' : 'bg-navy-800/40'}
              >
                <td className="px-3 py-2 text-sm font-semibold text-white">
                  {row.solute}
                  {row.trap && (
                    <span
                      className="ml-2 text-[10px] font-bold uppercase tracking-wider align-middle"
                      style={{ color: AMBER }}
                    >
                      ⚠
                    </span>
                  )}
                </td>
                <SoluteCell value={row.pct}    highlight={row.trap && row.trapCell === 'pct'} />
                <SoluteCell value={row.loop}   highlight={row.trap && row.trapCell === 'loop'} />
                <SoluteCell value={row.distal} />
                <SoluteCell value={row.excretion} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Callout title="Urea — the odd one out">
          Urea is <span className="font-semibold" style={{ color: AMBER }}>secreted</span> into
          the ascending limb (everywhere else it's reabsorbed).
        </Callout>
        <Callout title="PAH — net secretion">
          Cleared at <span className="font-semibold" style={{ color: AMBER }}>500%</span> of GFR —
          way more excreted than filtered. Classic example of net secretion.
        </Callout>
      </div>
    </section>
  );
}

function buildGlucoseData() {
  const GFR_PER_100ML = 1.25; // 125 mL/min divided by 100 mL
  const THRESHOLD = 300;
  const TM = 375;
  const data = [];
  for (let x = 0; x <= 500; x += 10) {
    const filtration = GFR_PER_100ML * x;
    const reabsorption = x <= THRESHOLD ? filtration : TM;
    const excretion = x <= THRESHOLD ? 0 : filtration - TM;
    data.push({ x, filtration, reabsorption, excretion });
  }
  return data;
}

function GlucoseTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-navy-700 bg-navy-950/95 px-3 py-2 text-xs shadow-lg">
      <div className="text-slate-400 mb-1">
        Plasma glucose: <span className="text-white font-semibold">{label}</span> mg/100mL
      </div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-slate-300 capitalize">{p.name}:</span>
          <span className="text-white font-medium">
            {Math.round(p.value)} mg/min
          </span>
        </div>
      ))}
    </div>
  );
}

function GlucoseGraph() {
  const data = useMemo(() => buildGlucoseData(), []);
  const RED = '#EF4444';
  const THRESHOLD = 300;
  const TM = 375;

  return (
    <section className="rounded-xl border border-navy-800 bg-navy-900 p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div>
          <h2 className="text-base font-semibold">Glucose: Filtration, Reabsorption, Excretion</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            How the 3 curves relate — and why glucose spills into urine above threshold.
          </p>
        </div>
        <div
          className="rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest"
          style={{ backgroundColor: `${AMBER}22`, color: AMBER, border: `1px solid ${AMBER}` }}
        >
          Tm / renal threshold
        </div>
      </div>

      <div className="w-full h-[420px] mt-2">
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 16, right: 24, bottom: 36, left: 24 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1c2850" />
            <XAxis
              dataKey="x"
              type="number"
              domain={[0, 500]}
              ticks={[0, 70, 140, 200, 300, 400, 500]}
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{
                value: 'Plasma glucose (mg/100mL)',
                position: 'insideBottom',
                offset: -18,
                fill: '#cbd5e1',
                fontSize: 12,
              }}
            />
            <YAxis
              domain={[0, 700]}
              ticks={[0, 125, 250, 375, 500, 625]}
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{
                value: 'Rate (mg/min)',
                angle: -90,
                position: 'insideLeft',
                offset: 8,
                fill: '#cbd5e1',
                fontSize: 12,
              }}
            />

            {/* Normal range shaded zone */}
            <ReferenceArea
              x1={70}
              x2={140}
              y1={0}
              y2={700}
              fill={GREEN}
              fillOpacity={0.1}
              stroke={GREEN}
              strokeOpacity={0.35}
              strokeDasharray="4 4"
              label={{
                value: 'Normal range',
                position: 'insideTop',
                fill: GREEN,
                fontSize: 11,
                offset: 8,
              }}
            />

            {/* Renal threshold marker */}
            <ReferenceLine
              x={THRESHOLD}
              stroke={AMBER}
              strokeDasharray="6 4"
              label={{
                value: 'Renal threshold ≈ 300',
                position: 'top',
                fill: AMBER,
                fontSize: 11,
              }}
            />

            {/* Tm marker */}
            <ReferenceLine
              y={TM}
              stroke={GREEN}
              strokeDasharray="2 4"
              strokeOpacity={0.6}
              label={{
                value: `Tm = ${TM} mg/min`,
                position: 'right',
                fill: GREEN,
                fontSize: 11,
              }}
            />
            <ReferenceDot
              x={THRESHOLD}
              y={TM}
              r={4}
              fill={AMBER}
              stroke="#0a1020"
              strokeWidth={2}
            />

            <Tooltip content={<GlucoseTooltip />} />
            <Legend
              verticalAlign="top"
              height={28}
              iconType="plainline"
              wrapperStyle={{ color: '#cbd5e1', fontSize: 12 }}
            />

            <Line
              type="linear"
              dataKey="filtration"
              name="Filtration"
              stroke={RED}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="linear"
              dataKey="reabsorption"
              name="Reabsorption"
              stroke={GREEN}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="linear"
              dataKey="excretion"
              name="Excretion"
              stroke={BLUE}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="rounded-lg border border-navy-700 bg-navy-900 p-3 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-0.5" style={{ backgroundColor: RED }} />
            <span className="font-semibold" style={{ color: RED }}>Filtration</span>
          </div>
          <div className="text-slate-300">
            Linear, never saturates — purely pressure-driven.
          </div>
        </div>
        <div className="rounded-lg border border-navy-700 bg-navy-900 p-3 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-0.5" style={{ backgroundColor: GREEN }} />
            <span className="font-semibold" style={{ color: GREEN }}>Reabsorption</span>
          </div>
          <div className="text-slate-300">
            Transporters saturate at <span className="text-white font-medium">Tm ≈ 375 mg/min</span>.
          </div>
        </div>
        <div className="rounded-lg border border-navy-700 bg-navy-900 p-3 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-0.5" style={{ backgroundColor: BLUE }} />
            <span className="font-semibold" style={{ color: BLUE }}>Excretion</span>
          </div>
          <div className="text-slate-300">
            Zero until plasma exceeds renal threshold, then linear — this is glucosuria.
          </div>
        </div>
      </div>
    </section>
  );
}

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
  const [tab, setTab] = useState('nephron');
  const [active, setActive] = useState(null);

  const seg = active ? SEGMENTS[active] : null;
  const stationKey = seg?.station || (active && !seg ? active : null);
  const content = stationKey ? STATION_CONTENT[stationKey] : null;
  const headerTitle = content ? content.title : seg?.label;
  const headerSubtitle = content
    ? content.subtitle
    : seg
    ? seg.kind === 'vascular'
      ? 'Vascular side'
      : 'Tubular side'
    : null;

  // Only the nephron SVG uses segment IDs; micturition is a pseudo-station.
  const svgActive = seg ? active : null;

  return (
    <div className="min-h-full bg-navy-950 text-slate-100 pb-24">
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

      {mode === 'learn' && (
        <div className="border-b border-navy-800 bg-navy-950/80 sticky top-[56px] sm:top-[65px] z-10 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav role="tablist" aria-label="Learn views" className="flex gap-1 sm:gap-2 overflow-x-auto panel-scroll">
              {[
                { id: 'nephron', label: 'Nephron' },
                { id: 'solutes', label: 'Solutes Table' },
                { id: 'graph',   label: 'Glucose Graph' },
              ].map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-3 sm:px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                    tab === t.id
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200 border-transparent'
                  }`}
                  style={
                    tab === t.id
                      ? { borderColor: BLUE, color: '#fff' }
                      : undefined
                  }
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {mode === 'quiz' ? (
          <div className="rounded-xl border border-amber-warm/40 bg-navy-900 p-8 text-center">
            <div className="text-4xl mb-2" aria-hidden>📊</div>
            <h2 className="text-xl font-semibold mb-1">Quiz Mode</h2>
            <p className="text-slate-400">Coming soon — stations will light up one at a time with questions.</p>
          </div>
        ) : tab === 'solutes' ? (
          <SolutesTable />
        ) : tab === 'graph' ? (
          <GlucoseGraph />
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
              <NephronDiagram active={svgActive} onSelect={setActive} />
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

              <button
                onClick={() => setActive('micturition')}
                className={`mt-4 w-full flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  active === 'micturition'
                    ? 'text-navy-950'
                    : 'text-slate-200 hover:bg-navy-800'
                }`}
                style={
                  active === 'micturition'
                    ? { backgroundColor: AMBER }
                    : { border: `1px solid ${AMBER}66`, backgroundColor: `${AMBER}10` }
                }
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden>🚽</span>
                  Micturition — the urination reflex
                </span>
                <span aria-hidden>→</span>
              </button>
            </section>

            {/* Side panel */}
            <aside className="rounded-xl border border-navy-800 bg-navy-900 p-5 h-fit lg:sticky lg:top-20 max-h-[calc(100vh-10rem)] overflow-y-auto panel-scroll">
              {active ? (
                <>
                  <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-2">
                    Station
                  </h3>
                  <p className="text-xl font-semibold mb-0.5">{headerTitle}</p>
                  {headerSubtitle && (
                    <p className="text-xs text-slate-400 mb-4">{headerSubtitle}</p>
                  )}
                  {content ? (
                    <>
                      <div
                        className="rounded-lg p-4 text-sm leading-relaxed"
                        style={{
                          border: `1px solid ${BLUE}66`,
                          backgroundColor: `${BLUE}14`,
                          color: '#E5EEFB',
                        }}
                      >
                        {content.plain}
                      </div>
                      <GoDeeper>{content.details}</GoDeeper>
                    </>
                  ) : (
                    <div className="rounded-lg border border-navy-700 bg-navy-800/60 p-4 text-sm text-slate-300">
                      Station info coming soon.
                    </div>
                  )}
                  <button
                    onClick={() => setActive(null)}
                    className="mt-4 text-xs text-slate-400 hover:text-white underline underline-offset-2"
                  >
                    Clear selection
                  </button>
                </>
              ) : (
                <KidneyOverview onOpenMicturition={() => setActive('micturition')} />
              )}
            </aside>
          </div>
        )}
      </main>

      <FormulaBar />
    </div>
  );
}
