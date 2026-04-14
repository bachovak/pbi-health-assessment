# Claude Code Prompt — BI Health Check Report Generator
# Copy the full prompt below into Claude Code after a new assessment submission.
# Replace the [PLACEHOLDER] sections with actual values from the submission before running.

---

## PROMPT (paste this into Claude Code)

You are generating a standalone HTML report for a Power BI Health Check client.
The report is based on a completed assessment submission and must match the
visual design and code style of kristinabachova.com exactly.

---

### Design system

Use the following CSS variables and conventions — do not deviate:

```
--colour-primary:    #D97706   (amber — links, accents, CTAs)
--colour-accent:     #EA580C   (orange — hover)
--colour-dark:       #1C1917   (near-black — nav, header bg, footer bg)
--colour-mid:        #92400E   (dark amber — hover text)
--colour-bg:         #FAF7F5   (warm off-white — page background)
--colour-card:       #FFFFFF   (white — card backgrounds)
--colour-text:       #44403C   (warm dark — body text)
--colour-text-muted: #78716C   (muted — secondary text, labels)
--colour-border:     #E7E5E4   (light warm grey — borders)
--colour-green:      #16A34A   (green — good scores)
--colour-warning:    #CA8A04   (amber-yellow — medium/high issues)
--colour-red:        #DC2626   (red — critical issues, high costs)

--font-heading: 'Playfair Display', Georgia, serif   (headings, large numbers)
--font-body:    'Source Sans 3', system-ui, sans-serif  (all other text)

--radius: 8px
--radius-pill: 100px
--shadow-sm: 0 1px 3px rgba(0,0,0,0.06)
--shadow-md: 0 4px 12px rgba(0,0,0,0.08)
--nav-height: 72px
--container-width: 1120px
```

Load fonts from Google Fonts:
`https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap`

---

### Report structure

The report is a single self-contained HTML file. It has no JavaScript frameworks.
It must be print-friendly and render correctly in a browser at 1200px width.

**Important:** This report is intentionally high-level. It contains an executive
summary and a pillar scorecard only. It does not include individual issue detail,
fix guidance, effort estimates, or an action plan — those are delivered as part
of the paid Health Check engagement. Do not add them.

Build the following sections in order:

1. **Fixed nav bar** — dark background (#1C1917), logo "kristinabachova.com" in
   Playfair Display white, right-side label "Power BI Health Check — Confidential"
   in muted white text.

2. **Page header** — dark background. Shows:
   - Eyebrow: "Power BI Health Check" in primary amber, all caps, small
   - H1: "Your Results, [ClientName]" in white Playfair Display
   - Subtitle: "[Company] · [CompanySize] employees · [NumPBIUsers] Power BI users"
   - Meta line: "Assessment completed [Timestamp] · Prepared by Kristína Bachová"

3. **Executive summary section** — white background. Contains in order:
   a) Client bar — off-white card showing company name (Playfair), meta line
      ([ClientName] · [CompanySize] employees · [NumPBIUsers] Power BI users ·
      [NumPBIDevelopers] developers), and a risk rating pill on the right
      (coloured dot + "High risk" / "Medium risk" / "Low risk").
      Colour rule: overall score 0–39 = red/High risk, 40–69 = amber/Medium risk,
      70–100 = green/Low risk.
   b) Four KPI cards in a row:
      - Overall risk score (colour-coded, "out of 100")
      - Annual cost of inaction (sum of Annual Cost Impact, red)
      - Hours lost / month (sum of Est. Hours Lost/Month, amber)
      - Critical issues count (count of rows where Priority = "Critical", red)
   c) Top 3 risks label ("Top 3 risks by impact", small uppercase muted)
      followed by three risk items sorted by Annual Cost Impact descending.
      Each item shows:
      - Left accent border (red for Critical, amber for High)
      - Row number (01, 02, 03) in large muted Playfair
      - Risk title (from the Risk column) in dark bold Source Sans
      - One-line description (from the Why column) in muted text
      - Annual Cost Impact in Playfair on the right, "per year" below
      No fix text. No effort estimates. No badges.

4. **Pillar scorecard section** — warm off-white background. Contains:
   a) Two cards side by side:
      Left card — SVG radar chart with one axis per Pillar value. Grid rings
      at 25/50/75/100% with light border colour. Spoke lines from centre to
      each axis tip. Data polygon filled with primary amber at 12% opacity,
      stroked with primary amber at 2px. Axis labels in muted Source Sans 11px.
      Derive each pillar's score by averaging Score values for that Pillar.
      Right card — horizontal bar chart, one row per Category, sorted worst
      (lowest score) first. Each row: category label (right-aligned, 120px
      fixed width, muted), thin track bar, score value. Bar fill colour:
      0–39 = red, 40–69 = amber, 70–100 = green.
   b) Full-width table card — verbal ratings by subcategory.
      Columns: Pillar | Subcategory | Rating (badge) | Score | Weight
      All subcategory rows from the Responses table, sorted by Score ascending.
      Rating badge uses VerbalScore value; colour by score band.
      Score column in Playfair bold, colour-coded.

5. **CTA callout** — amber-bordered box (2px solid --colour-primary,
   rgba(217,119,6,0.04) background). Contains:
   - H2: "Ready to fix this?"
   - Body: "These results give us a clear starting point. In a 30-minute
     discovery call we'll walk through your priorities, discuss what each issue
     is actually costing your team, and map out a realistic remediation plan."
   - Primary amber pill button: "Book your discovery call"
     href="https://calendly.com/bachovak/30min"
   - Italic note below button: "A full breakdown of every identified issue —
     including effort estimates, recommended fixes, and a prioritised action
     plan — is delivered as part of the Health Check engagement."

6. **Footer** — dark background. Centred. Name "Kristína Bachová" in white
   Playfair, tagline "Independent Power BI Consultant · Algarve, Portugal" in
   muted, copyright line:
   "This report is confidential and prepared exclusively for [ClientName] at
   [Company]. © [Year] kristinabachova.com"

---

### Data to inject

Replace all [PLACEHOLDER] values below with real data from the submission
before running this prompt.

```
ClientName:         [e.g. Jan Kowalski]
Company:            [e.g. Acme Manufacturing B.V.]
CompanySize:        [e.g. 120]
NumPBIUsers:        [e.g. 18]
NumPBIDevelopers:   [e.g. 3]
Timestamp:          [e.g. 27 March 2026]
AvgHourlyRate:      [e.g. €65]
CompanySizeMidpoint:[e.g. 120]
Email:              [e.g. jan.kowalski@acme.com]
```

Paste the full Responses table rows as JSON below (copy from your data source):

```json
[
  {
    "CategoryID": "",
    "Category": "",
    "Pillar": "",
    "SubcategoryID": "",
    "Subcategory": "",
    "QuestionID": "",
    "Question": "",
    "Weight": "",
    "Score": 0,
    "VerbalScoreID": "",
    "VerbalScore": "",
    "Priority": "",
    "Why": "",
    "Risk": "",
    "Fix": "",
    "RiskScore": 0,
    "AffectedUsers": 0,
    "DetailedRiskExplanation": "",
    "Est. Hours Lost/Month": 0,
    "Annual Cost Impact": 0
  }
]
```

---

### Output requirements

- Single self-contained HTML file, no external dependencies except Google Fonts.
- Filename: `bi-health-check-[CompanySlug]-[YYYY-MM-DD].html`
  (e.g. `bi-health-check-acme-2026-03-27.html`)
- All colours, fonts, spacing, and border-radius match the design system above.
- Responsive: works at 640px mobile, 900px tablet, 1200px desktop.
- Print-friendly: `@media print` hides the nav, removes shadows, expands to
  full width.
- No JavaScript required. All scores, bars, and badges are rendered from the
  data at generation time.
- Score colour logic (apply everywhere scores appear):
  - 0–39:  var(--colour-red)
  - 40–69: var(--colour-warning)
  - 70–100: var(--colour-green)
- Priority badge colours:
  - "Critical": red background tint, red text
  - "High": amber background tint, amber text
  - "Medium" / "Good": green background tint, green text

---

### Reference file

The wireframe HTML at `bi-health-check-report.html` in this repo is a static
prototype showing the exact intended layout, component patterns, and visual
style. Use it as your primary reference — your output should match it precisely
with real data substituted in place of all placeholder values.

Do not add sections, change the section order, or introduce components not
present in the wireframe. The intentional absence of fix detail, effort
estimates, and action plan items is by design — do not add them.
