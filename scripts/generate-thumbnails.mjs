import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, "public/images/thumbnails");

mkdirSync(outDir, { recursive: true });

const FONT = "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Arial, sans-serif";
const MONO = "JetBrains Mono, SFMono-Regular, Consolas, ui-monospace, monospace";

const covers = [
  {
    file: "sql-explain-analyze.svg",
    title: "SQL EXPLAIN and EXPLAIN ANALYZE thumbnail",
    desc: "Execution plan cover showing estimated and actual SQL performance metrics.",
    theme: {
      bg0: "#08111F",
      bg1: "#0F172A",
      accent: "#34D399",
      accent2: "#60A5FA",
      hot: "#F472B6",
    },
    eyebrow: "SQL Performance",
    titleLines: ["EXPLAIN", "ANALYZE"],
    subtitle: "Plan vs actual runtime",
    visual: planVisual(["Parser", "Optimizer", "Plan", "Actual"], ["rows", "index", "sort", "actual ms"]),
  },
  {
    file: "sql-view-derived-cte-temp-table.svg",
    title: "SQL view derived table CTE temporary table thumbnail",
    desc: "SQL internals cover showing optimizer merge and materialize behavior.",
    theme: {
      bg0: "#0A1020",
      bg1: "#111827",
      accent: "#2DD4BF",
      accent2: "#A78BFA",
      hot: "#F59E0B",
    },
    eyebrow: "SQL Internal",
    titleLines: ["VIEW / CTE", "TEMP TABLE"],
    subtitle: "Merge or materialize",
    visual: optimizerVisual(),
  },
  {
    file: "git-squash-rebase-conflict.svg",
    title: "Git squash merge rebase conflict thumbnail",
    desc: "Git history cover explaining conflicts after squash merge.",
    theme: {
      bg0: "#0B1120",
      bg1: "#18181B",
      accent: "#34D399",
      accent2: "#94A3B8",
      hot: "#FB7185",
    },
    eyebrow: "Git History",
    titleLines: ["SQUASH", "MERGE"],
    subtitle: "Why conflicts happen after rebase",
    visual: conflictVisual(),
  },
  {
    file: "github-pr-merge-methods.svg",
    title: "GitHub pull request merge methods thumbnail",
    desc: "Pull request cover comparing merge commit, squash merge, and rebase merge.",
    theme: {
      bg0: "#08111F",
      bg1: "#111827",
      accent: "#60A5FA",
      accent2: "#34D399",
      hot: "#A78BFA",
    },
    eyebrow: "GitHub Pull Request",
    titleLines: ["MERGE", "METHODS"],
    subtitle: "Merge commit / squash / rebase",
    visual: mergeMethodsVisual(),
  },
  {
    file: "git-switch-checkout.svg",
    title: "Git switch and checkout thumbnail",
    desc: "Git command cover comparing branch switching and legacy checkout behavior.",
    theme: {
      bg0: "#0C1222",
      bg1: "#132018",
      accent: "#34D399",
      accent2: "#60A5FA",
      hot: "#FBBF24",
    },
    eyebrow: "Git Commands",
    titleLines: ["SWITCH", "CHECKOUT"],
    subtitle: "Branch operation separated from restore",
    visual: switchCheckoutVisual(),
  },
  {
    file: "nextjs-github-pages.svg",
    title: "Next.js static export to GitHub Pages thumbnail",
    desc: "Next.js deployment pipeline cover for GitHub Pages static export.",
    theme: {
      bg0: "#070A12",
      bg1: "#111827",
      accent: "#FFFFFF",
      accent2: "#34D399",
      hot: "#60A5FA",
    },
    eyebrow: "Next.js Deploy",
    titleLines: ["NEXT.JS", "PAGES"],
    subtitle: "Static export to GitHub Pages",
    visual: deployVisual(),
  },
  {
    file: "rails-insert-select.svg",
    title: "Rails INSERT SELECT thumbnail",
    desc: "Rails migration cover showing set-based SQL copy from SELECT to INSERT.",
    theme: {
      bg0: "#160B0B",
      bg1: "#251111",
      accent: "#FB7185",
      accent2: "#34D399",
      hot: "#60A5FA",
    },
    eyebrow: "Rails Migration",
    titleLines: ["INSERT", "SELECT"],
    subtitle: "Move rows inside the database",
    visual: insertSelectVisual(),
  },
  {
    file: "rails-raw-sql-summary.svg",
    title: "Rails raw SQL patterns thumbnail",
    desc: "Rails raw SQL cover showing migration snippets and practical SQL patterns.",
    theme: {
      bg0: "#100B1F",
      bg1: "#1F1833",
      accent: "#F472B6",
      accent2: "#34D399",
      hot: "#FBBF24",
    },
    eyebrow: "Rails + SQL",
    titleLines: ["RAW SQL", "PATTERNS"],
    subtitle: "Migration snippets for real work",
    visual: rawSqlVisual(),
  },
  {
    file: "rails-row-number.svg",
    title: "SQL ROW_NUMBER thumbnail",
    desc: "Window function cover showing partitioned ranking with ROW_NUMBER.",
    theme: {
      bg0: "#07111A",
      bg1: "#102331",
      accent: "#60A5FA",
      accent2: "#34D399",
      hot: "#FBBF24",
    },
    eyebrow: "Window Function",
    titleLines: ["ROW_NUMBER()"],
    subtitle: "Pick the latest row per group",
    visual: rowNumberVisual(),
  },
  {
    file: "rails-upsert.svg",
    title: "MySQL UPSERT thumbnail",
    desc: "MySQL upsert cover showing insert or update decision by unique key.",
    theme: {
      bg0: "#171008",
      bg1: "#261A0C",
      accent: "#FBBF24",
      accent2: "#34D399",
      hot: "#FB7185",
    },
    eyebrow: "MySQL",
    titleLines: ["UPSERT"],
    subtitle: "ON DUPLICATE KEY UPDATE",
    visual: upsertVisual(),
  },
];

for (const cover of covers) {
  writeFileSync(join(outDir, cover.file), renderCover(cover), "utf8");
}

function renderCover(cover) {
  const { bg0, bg1, accent, accent2, hot } = cover.theme;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(cover.title)}</title>
  <desc id="desc">${escapeXml(cover.desc)}</desc>
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${bg0}"/>
      <stop offset="1" stop-color="${bg1}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${accent}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="${accent}" stop-opacity="0.32"/>
      <stop offset="1" stop-color="${accent2}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="#FFFFFF" stroke-opacity="0.07" stroke-width="1"/>
    </pattern>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000000" flood-opacity="0.32"/>
    </filter>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <rect width="1200" height="675" fill="url(#grid)" opacity="0.7"/>
  <path d="M-60 580C170 456 293 528 514 406C726 289 857 114 1264 156V735H-60Z" fill="${accent}" opacity="0.13"/>
  <path d="M741 -80L1268 151V675H974L597 96Z" fill="${accent2}" opacity="0.14"/>
  <rect x="-120" y="210" width="1440" height="86" transform="rotate(-10 600 253)" fill="url(#shine)" opacity="0.8"/>
  <rect x="28" y="28" width="1144" height="619" rx="34" fill="none" stroke="#FFFFFF" stroke-opacity="0.09"/>
  ${titleBlock(cover, accent, accent2)}
  ${cover.visual({ accent, accent2, hot })}
</svg>
`;
}

function titleBlock(cover, accent, accent2) {
  const title = cover.titleLines
    .map((line, index) => text(72, 188 + index * 76, line, 68, "#FFFFFF", 850))
    .join("\n  ");

  return `<g font-family="${FONT}">
    <rect x="72" y="72" width="${Math.max(240, cover.eyebrow.length * 13)}" height="42" rx="21" fill="#FFFFFF" fill-opacity="0.10" stroke="#FFFFFF" stroke-opacity="0.16"/>
    <circle cx="94" cy="93" r="6" fill="${accent}"/>
    ${text(112, 99, cover.eyebrow, 22, "#DDE6F3", 750)}
    ${title}
    <path d="M74 358H334" stroke="${accent}" stroke-width="9" stroke-linecap="round"/>
    <path d="M356 358H430" stroke="${accent2}" stroke-width="9" stroke-linecap="round" opacity="0.72"/>
    ${text(72, 416, cover.subtitle, 28, "#CBD5E1", 650)}
  </g>`;
}

function planVisual(labels, metrics) {
  return ({ accent, accent2, hot }) => {
    const nodes = labels
      .map((label, index) => {
        const x = 560 + index * 144;
        const color = index === 0 ? accent : index === 1 ? "#F8FAFC" : index === 2 ? accent2 : hot;
        const textColor = index === 1 ? "#111827" : "#06111F";
        return `<rect x="${x}" y="228" width="116" height="64" rx="16" fill="${color}" opacity="${index === 1 ? 0.94 : 0.98}"/>
    ${text(x + 58, 267, label, 17, textColor, 850, "middle")}`;
      })
      .join("\n    ");
    const metricNodes = metrics
      .map((label, index) => {
        const x = 546 + index * 136;
        return `<rect x="${x}" y="400" width="118" height="42" rx="12" fill="#FFFFFF" fill-opacity="0.12" stroke="#FFFFFF" stroke-opacity="0.12"/>
    ${text(x + 59, 427, label, 15, "#E2E8F0", 750, "middle")}`;
      })
      .join("\n    ");

    return `<g font-family="${FONT}" filter="url(#softShadow)">
    <rect x="518" y="166" width="602" height="346" rx="28" fill="#08111F" fill-opacity="0.82" stroke="#FFFFFF" stroke-opacity="0.12"/>
    ${text(558, 207, "execution plan", 22, accent, 800)}
    ${nodes}
    <path d="M676 260H704M820 260H848M964 260H992" stroke="#E2E8F0" stroke-width="8" stroke-linecap="round"/>
    <path d="M616 292C616 352 604 354 604 400M760 292C760 348 741 354 741 400M904 292C904 348 878 354 878 400M1048 292C1048 351 1015 354 1015 400" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round" opacity="0.92"/>
    ${metricNodes}
    <path d="M562 474H1045" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="2"/>
    <path d="M562 474H905" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
  </g>`;
  };
}

function optimizerVisual() {
  return ({ accent, accent2, hot }) => `<g font-family="${FONT}" filter="url(#softShadow)">
    <rect x="524" y="150" width="612" height="386" rx="30" fill="#07111C" fill-opacity="0.84" stroke="#FFFFFF" stroke-opacity="0.12"/>
    <circle cx="830" cy="318" r="76" fill="${accent}" opacity="0.16"/>
    <circle cx="830" cy="318" r="52" fill="#FFFFFF" fill-opacity="0.92"/>
    ${text(830, 310, "Optimizer", 20, "#111827", 850, "middle")}
    ${text(830, 338, "decides", 16, "#475569", 750, "middle")}
    ${node(610, 206, "View", accent2)}
    ${node(1000, 206, "CTE", hot)}
    ${node(610, 432, "Derived", "#E2E8F0", "#0F172A")}
    ${node(1000, 432, "Temp", accent)}
    <path d="M728 238C764 256 786 276 810 296M958 238C919 257 883 278 850 298M728 464C765 428 791 391 812 344M958 464C914 424 883 387 850 344" fill="none" stroke="#CBD5E1" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
    <rect x="682" y="548" width="298" height="46" rx="14" fill="#FFFFFF" fill-opacity="0.12"/>
    ${text(831, 577, "merge / materialize / storage", 18, "#E2E8F0", 750, "middle")}
  </g>`;
}

function conflictVisual() {
  return ({ accent, hot }) => `<g font-family="${FONT}" filter="url(#softShadow)">
    <rect x="520" y="160" width="616" height="368" rx="30" fill="#070B14" fill-opacity="0.82" stroke="#FFFFFF" stroke-opacity="0.12"/>
    <path d="M598 352H766" stroke="#E5E7EB" stroke-width="16" stroke-linecap="round"/>
    <path d="M766 352C860 352 856 250 950 250H1052" stroke="#E5E7EB" stroke-width="16" stroke-linecap="round"/>
    <path d="M766 352C858 352 858 454 952 454H1058" stroke="${accent}" stroke-width="16" stroke-linecap="round"/>
    ${commit(598, 352, "#E5E7EB")}
    ${commit(766, 352, "#E5E7EB")}
    ${commit(950, 250, "#E5E7EB")}
    ${commit(1052, 250, "#E5E7EB")}
    ${commit(952, 454, accent)}
    ${commit(1058, 454, accent)}
    <rect x="776" y="284" width="236" height="74" rx="18" fill="${hot}" fill-opacity="0.16" stroke="${hot}" stroke-opacity="0.78"/>
    ${text(894, 329, "conflict", 32, "#FECACA", 850, "middle")}
    ${text(580, 500, "D/E/F are not S", 24, "#CBD5E1", 750)}
  </g>`;
}

function mergeMethodsVisual() {
  return ({ accent, accent2, hot }) => {
    const cards = [
      ["merge commit", 548, accent, "branch kept"],
      ["squash", 742, accent2, "1 PR = 1 commit"],
      ["rebase", 936, hot, "linear history"],
    ];
    return `<g font-family="${FONT}" filter="url(#softShadow)">
    ${cards
      .map(
        ([label, x, color, note]) => `<rect x="${x}" y="176" width="170" height="300" rx="24" fill="#FFFFFF" fill-opacity="0.10" stroke="#FFFFFF" stroke-opacity="0.14"/>
    <rect x="${x + 18}" y="206" width="134" height="48" rx="14" fill="${color}" fill-opacity="0.95"/>
    ${text(x + 85, 237, label, 17, "#06111F", 850, "middle")}
    <path d="M${x + 34} 330H${x + 136}" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
    <path d="M${x + 34} 374H${x + 136}" stroke="#E2E8F0" stroke-width="8" stroke-linecap="round" opacity="0.72"/>
    ${text(x + 85, 432, note, 16, "#CBD5E1", 750, "middle")}`,
      )
      .join("\n    ")}
  </g>`;
  };
}

function switchCheckoutVisual() {
  return ({ accent, accent2, hot }) => `<g font-family="${FONT}" filter="url(#softShadow)">
    <rect x="524" y="158" width="612" height="370" rx="30" fill="#06111E" fill-opacity="0.84" stroke="#FFFFFF" stroke-opacity="0.12"/>
    <rect x="560" y="198" width="540" height="236" rx="20" fill="#0B1020" stroke="#FFFFFF" stroke-opacity="0.12"/>
    ${terminalLine(594, 258, "$ git switch feature/login", accent)}
    ${terminalLine(594, 314, "$ git restore app.rb", accent2)}
    ${terminalLine(594, 370, "$ git checkout legacy", "#CBD5E1")}
    <rect x="602" y="462" width="178" height="44" rx="14" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-opacity="0.55"/>
    ${text(691, 491, "branch", 18, "#D1FAE5", 850, "middle")}
    <rect x="822" y="462" width="178" height="44" rx="14" fill="${hot}" fill-opacity="0.18" stroke="${hot}" stroke-opacity="0.55"/>
    ${text(911, 491, "file state", 18, "#FEF3C7", 850, "middle")}
  </g>`;
}

function deployVisual() {
  return ({ accent, accent2, hot }) => `<g font-family="${FONT}" filter="url(#softShadow)">
    <rect x="520" y="160" width="616" height="372" rx="30" fill="#050A12" fill-opacity="0.84" stroke="#FFFFFF" stroke-opacity="0.12"/>
    ${pipelineBox(570, 230, "next build", accent, "#111827")}
    ${pipelineBox(772, 230, "out/", accent2, "#06111F")}
    ${pipelineBox(946, 230, "Pages", hot, "#06111F")}
    <path d="M724 270H772M902 270H946" stroke="#E2E8F0" stroke-width="8" stroke-linecap="round"/>
    <rect x="578" y="382" width="506" height="86" rx="20" fill="#FFFFFF" fill-opacity="0.10" stroke="#FFFFFF" stroke-opacity="0.12"/>
    ${text(620, 434, "GitHub Actions publishes /out as static assets", 24, "#E2E8F0", 750)}
  </g>`;
}

function insertSelectVisual() {
  return ({ accent, accent2, hot }) => `<g font-family="${FONT}" filter="url(#softShadow)">
    <rect x="526" y="154" width="602" height="386" rx="30" fill="#0C111D" fill-opacity="0.84" stroke="#FFFFFF" stroke-opacity="0.12"/>
    ${tablePanel(566, 226, "SELECT", hot, ["users", "orders", "source rows"])}
    ${tablePanel(868, 226, "INSERT", accent2, ["profiles", "summary", "target table"])}
    <path d="M792 332H854" stroke="${accent}" stroke-width="12" stroke-linecap="round"/>
    <path d="M836 304L864 332L836 360" fill="none" stroke="${accent}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    ${text(634, 478, "set based", 24, "#E2E8F0", 850)}
    ${text(906, 478, "no Ruby loop", 24, "#E2E8F0", 850)}
  </g>`;
}

function rawSqlVisual() {
  return ({ accent, accent2, hot }) => `<g font-family="${MONO}" filter="url(#softShadow)">
    <rect x="512" y="142" width="626" height="404" rx="30" fill="#050A12" fill-opacity="0.88" stroke="#FFFFFF" stroke-opacity="0.12"/>
    <circle cx="554" cy="184" r="7" fill="#FB7185"/><circle cx="580" cy="184" r="7" fill="#FBBF24"/><circle cx="606" cy="184" r="7" fill="#34D399"/>
    ${code(552, 248, "execute(<<~SQL)", accent)}
    ${code(586, 302, "INSERT ... SELECT", "#E2E8F0")}
    ${code(586, 356, "ROW_NUMBER() OVER", hot)}
    ${code(586, 410, "ON DUPLICATE KEY UPDATE", accent2)}
    ${code(552, 486, "SQL", "#64748B")}
  </g>`;
}

function rowNumberVisual() {
  return ({ accent, accent2, hot }) => `<g font-family="${FONT}" filter="url(#softShadow)">
    <rect x="518" y="154" width="612" height="386" rx="30" fill="#07111E" fill-opacity="0.86" stroke="#FFFFFF" stroke-opacity="0.12"/>
    <rect x="568" y="218" width="512" height="238" rx="20" fill="#FFFFFF" fill-opacity="0.10" stroke="#FFFFFF" stroke-opacity="0.12"/>
    <rect x="568" y="218" width="512" height="56" rx="20" fill="${accent}" fill-opacity="0.95"/>
    ${text(616, 254, "user_id", 18, "#06111F", 850)}
    ${text(770, 254, "updated_at", 18, "#06111F", 850)}
    ${text(1010, 254, "rn", 18, "#06111F", 850)}
    ${row(616, 318, "1", "2026-06-26", "1", accent2)}
    ${row(616, 374, "1", "2026-05-12", "2", "#CBD5E1")}
    <path d="M936 302H1052" stroke="${hot}" stroke-width="4" stroke-linecap="round"/>
    <rect x="654" y="482" width="352" height="44" rx="14" fill="${accent2}" fill-opacity="0.16" stroke="${accent2}" stroke-opacity="0.55"/>
    ${text(830, 511, "PARTITION BY user_id", 18, "#D1FAE5", 850, "middle")}
  </g>`;
}

function upsertVisual() {
  return ({ accent, accent2, hot }) => `<g font-family="${FONT}" filter="url(#softShadow)">
    <rect x="524" y="156" width="606" height="380" rx="30" fill="#0F1117" fill-opacity="0.86" stroke="#FFFFFF" stroke-opacity="0.12"/>
    <circle cx="830" cy="320" r="74" fill="${accent}" fill-opacity="0.14"/>
    <rect x="704" y="236" width="252" height="72" rx="20" fill="${accent}" fill-opacity="0.92"/>
    ${text(830, 282, "UNIQUE KEY", 26, "#111827", 850, "middle")}
    <path d="M830 308V376" stroke="#E2E8F0" stroke-width="7" stroke-linecap="round"/>
    <path d="M830 376C768 376 740 418 690 448" fill="none" stroke="${accent2}" stroke-width="8" stroke-linecap="round"/>
    <path d="M830 376C892 376 920 418 974 448" fill="none" stroke="${hot}" stroke-width="8" stroke-linecap="round"/>
    <rect x="594" y="442" width="178" height="58" rx="16" fill="${accent2}" fill-opacity="0.20" stroke="${accent2}" stroke-opacity="0.65"/>
    ${text(683, 478, "INSERT", 22, "#D1FAE5", 850, "middle")}
    <rect x="896" y="442" width="178" height="58" rx="16" fill="${hot}" fill-opacity="0.20" stroke="${hot}" stroke-opacity="0.65"/>
    ${text(985, 478, "UPDATE", 22, "#FECACA", 850, "middle")}
  </g>`;
}

function node(x, y, label, fill, color = "#06111F") {
  return `<rect x="${x}" y="${y}" width="142" height="64" rx="18" fill="${fill}" opacity="0.96"/>
    ${text(x + 71, y + 40, label, 19, color, 850, "middle")}`;
}

function commit(x, y, color) {
  return `<circle cx="${x}" cy="${y}" r="24" fill="${color}"/>`;
}

function pipelineBox(x, y, label, fill, color) {
  return `<rect x="${x}" y="${y}" width="154" height="80" rx="18" fill="${fill}" fill-opacity="0.95"/>
    ${text(x + 77, y + 50, label, 21, color, 850, "middle")}`;
}

function tablePanel(x, y, label, color, lines) {
  return `<rect x="${x}" y="${y}" width="226" height="176" rx="20" fill="#FFFFFF" fill-opacity="0.10" stroke="#FFFFFF" stroke-opacity="0.14"/>
    <rect x="${x + 22}" y="${y + 24}" width="118" height="38" rx="12" fill="${color}" fill-opacity="0.92"/>
    ${text(x + 81, y + 49, label, 18, "#06111F", 850, "middle")}
    ${lines.map((line, index) => text(x + 28, y + 94 + index * 34, line, 18, "#E2E8F0", 750)).join("\n    ")}`;
}

function terminalLine(x, y, value, color) {
  return `${text(x, y, value, 24, color, 800, "start", MONO)}`;
}

function code(x, y, value, color) {
  return `${text(x, y, value, 27, color, 800, "start", MONO)}`;
}

function row(x, y, userId, date, rn, color) {
  return `${text(x, y, userId, 23, "#E2E8F0", 750)}
    ${text(x + 154, y, date, 23, "#E2E8F0", 750)}
    ${text(x + 400, y, rn, 24, color, 900)}`;
}

function text(x, y, value, size, fill, weight = 700, anchor = "start", family = FONT) {
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${escapeXml(value)}</text>`;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
