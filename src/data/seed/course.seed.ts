import type { Course, CourseModule, LearningDay, StudyMaterial, Exercise } from '@/domain/course'
import type { Assignment } from '@/domain/assignment'

export const COURSE: Course = {
  id: 'course-pbi-accelerator',
  slug: 'power-bi-developer-accelerator',
  title: 'BI Visualization Accelerator',
  description:
    'A 2-week, 60-hour accelerator that takes SQL/full-stack developers to customer-ready Power BI prototype developers: BI fundamentals and Power BI architecture, Power Query and data connectivity, semantic modelling, DAX, visualization and report UX, interactive report development, rapid prototyping, Claude-assisted development (including building your own Claude Skill), legacy migration and a certification capstone.',
  totalDays: 9,
  totalHours: 60,
  isPublished: true,
}

export const MODULES: CourseModule[] = [
  {
    id: 'module-week-1',
    courseId: 'course-pbi-accelerator',
    weekNumber: 1,
    title: 'Week 1 — Foundations: Data, Modelling & DAX',
  },
  {
    id: 'module-week-2',
    courseId: 'course-pbi-accelerator',
    weekNumber: 2,
    title: 'Week 2 — Delivery: Prototyping, AI & Certification',
  },
]

export const DAYS: LearningDay[] = [
  {
    id: 'day-1',
    courseId: 'course-pbi-accelerator',
    moduleId: 'module-week-1',
    dayNumber: 1,
    weekNumber: 1,
    title: 'BI Visualization Fundamentals & Power BI Architecture',
    description:
      'Understand what Business Intelligence is and why organizations invest in it, learn the fact/dimension/measure/KPI vocabulary, understand data visualization as a discipline, survey the BI tool landscape in depth (Excel, Power BI, Tableau and others), get Power BI Desktop installed and signed in, and choose the right chart type for a business question.',
    theoryHours: 2,
    labHours: 4,
    learningObjectives: [
      'What Business Intelligence is, and why organizations need it',
      'BI vs OLTP/OLAP',
      'Facts, dimensions, measures, KPIs',
      'Data visualization: what it is and why it matters',
      'BI tool landscape in depth (Excel, Power BI, Tableau and others)',
      'Business question → visual',
      'Power BI Desktop installation & Service basics',
    ],
    studyMaterialId: 'study-day-1',
    exerciseId: 'exercise-day-1',
    quizId: 'quiz-day-1',
    assignmentId: 'assignment-day-1',
    isPublished: true,
    scheduledDate: '2026-09-21',
  },
  {
    id: 'day-2',
    courseId: 'course-pbi-accelerator',
    moduleId: 'module-week-1',
    dayNumber: 2,
    weekNumber: 1,
    title: 'Power Query & Data Connectivity',
    description:
      'Meet the Power BI Desktop architecture, connect to SQL, CSV and Excel sources, choose the right storage mode, and use the Power Query editor to turn a messy retail extract into a clean, reconciled model ready for your first report page.',
    theoryHours: 2,
    labHours: 4,
    learningObjectives: [
      'Power BI Desktop architecture',
      'SQL/CSV/Excel connectivity',
      'Import vs DirectQuery vs Composite',
      'Power Query transformations & data quality',
      'Merge vs Append',
    ],
    studyMaterialId: 'study-day-2',
    exerciseId: 'exercise-day-2',
    quizId: 'quiz-day-2',
    assignmentId: 'assignment-day-2',
    isPublished: true,
    scheduledDate: '2026-09-22',
  },
  {
    id: 'day-3',
    courseId: 'course-pbi-accelerator',
    moduleId: 'module-week-1',
    dayNumber: 3,
    weekNumber: 1,
    title: 'Semantic Modelling & Star Schema',
    description:
      'Design a clean star schema, build a proper date dimension, and understand relationship cardinality and filter direction well enough to spot and fix modelling anti-patterns.',
    theoryHours: 2,
    labHours: 4,
    learningObjectives: [
      'Fact/dimension design',
      'Relationships/cardinality',
      'Date dimension',
      'Filter direction',
      'Modelling anti-patterns',
    ],
    studyMaterialId: 'study-day-3',
    exerciseId: 'exercise-day-3',
    quizId: 'quiz-day-3',
    assignmentId: 'assignment-day-3',
    isPublished: true,
    scheduledDate: '2026-09-23',
  },
  {
    id: 'day-4',
    courseId: 'course-pbi-accelerator',
    moduleId: 'module-week-1',
    dayNumber: 4,
    weekNumber: 1,
    title: 'Visualization & Report UX',
    description:
      'Choose the right visual for the business question, build clear hierarchy, conditional formatting and accessible layout so a report page is trustworthy at a glance.',
    theoryHours: 2,
    labHours: 4,
    learningObjectives: [
      'Visual selection & hierarchy',
      'Conditional formatting & accessibility',
      'Report layout & UX anti-patterns',
      'Slicers & tooltips',
    ],
    studyMaterialId: 'study-day-4',
    exerciseId: 'exercise-day-4',
    quizId: 'quiz-day-4',
    assignmentId: 'assignment-day-4',
    isPublished: true,
    scheduledDate: '2026-09-24',
  },
  {
    id: 'day-5',
    courseId: 'course-pbi-accelerator',
    moduleId: 'module-week-1',
    dayNumber: 5,
    weekNumber: 1,
    title: 'DAX Essentials, Interactive Report Development',
    description:
      'Move from calculated columns to measures, master DIVIDE and CALCULATE, and build a 10-measure KPI library with YTD/LY/YoY time intelligence reconciled to SQL — then put those same measures to work: add drill-down, drill-through, bookmarks and navigation so your reports behave like a considered application, and test the user journeys a real viewer would actually take.',
    theoryHours: 2,
    labHours: 4,
    learningObjectives: [
      'Measures vs calculated columns',
      'SUM/COUNT/DISTINCTCOUNT',
      'DIVIDE',
      'CALCULATE/FILTER',
      'Time intelligence (YTD/LY/YoY)',
      'Drill-down vs drill-through',
      'Bookmarks & buttons',
      'Navigation',
      'Dynamic titles & tooltip pages',
      'User-journey testing',
    ],
    studyMaterialId: 'study-day-5',
    exerciseId: 'exercise-day-5',
    quizId: 'quiz-day-5',
    assignmentId: 'assignment-day-5',
    isPublished: true,
    scheduledDate: '2026-09-25',
  },
  {
    id: 'day-6',
    courseId: 'course-pbi-accelerator',
    moduleId: 'module-week-2',
    dayNumber: 6,
    weekNumber: 2,
    title: 'Rapid Customer Prototyping',
    description:
      'Decompose a vague healthcare reporting requirement into business questions and a KPI dictionary, wireframe first, and deliver a 3-page prototype in a single day.',
    theoryHours: 2,
    labHours: 4,
    learningObjectives: [
      'Requirement decomposition',
      'KPI dictionary',
      'Wireframing',
      'Prototype vs production',
    ],
    studyMaterialId: 'study-day-6',
    exerciseId: 'exercise-day-6',
    quizId: 'quiz-day-6',
    assignmentId: 'assignment-day-6',
    isPublished: true,
    scheduledDate: '2026-09-29',
  },
  {
    id: 'day-7',
    courseId: 'course-pbi-accelerator',
    moduleId: 'module-week-2',
    dayNumber: 7,
    weekNumber: 2,
    title: 'Claude-Assisted BI Development',
    description:
      'Use Claude as a schema-constrained copilot for requirement analysis, DAX and Power Query, validate every output against a four-step checklist, and package a proven prompt as a reusable Claude Skill.',
    theoryHours: 2,
    labHours: 4,
    learningObjectives: [
      'AI-assisted workflow & validation',
      'DAX/Power Query prompting',
      'Requirement analysis & UX review prompting',
      'Authoring a reusable Claude Skill',
    ],
    studyMaterialId: 'study-day-7',
    exerciseId: 'exercise-day-7',
    quizId: 'quiz-day-7',
    assignmentId: 'assignment-day-7',
    isPublished: true,
    scheduledDate: '2026-09-30',
  },
  {
    id: 'day-8',
    courseId: 'course-pbi-accelerator',
    moduleId: 'module-week-2',
    dayNumber: 8,
    weekNumber: 2,
    title: 'Legacy Migration - MicroStrategy / Cognos',
    description:
      'Apply the AI-assisted workflow from Day 7 to inventory, map and reconcile a legacy Cognos/MicroStrategy-style report to Power BI, with full numerical reconciliation and a documented gap/risk log.',
    theoryHours: 2,
    labHours: 4,
    learningObjectives: [
      'Legacy inventory & mapping',
      'Reconciliation',
      'Gap/risk management',
    ],
    studyMaterialId: 'study-day-8',
    exerciseId: 'exercise-day-8',
    quizId: 'quiz-day-8',
    assignmentId: 'assignment-day-8',
    isPublished: true,
    scheduledDate: '2026-10-01',
  },
  {
    id: 'day-9',
    courseId: 'course-pbi-accelerator',
    moduleId: 'module-week-2',
    dayNumber: 9,
    weekNumber: 2,
    title: 'Capstone + Certification',
    description:
      'Finalize your chosen customer capstone, build a 10-test validation sheet, and deliver a 10-minute customer demo plus 5-minute Q&A for certification.',
    theoryHours: 2,
    labHours: 4,
    learningObjectives: [
      'Customer delivery',
      'Technical validation',
      'Presentation',
      'Production hardening',
    ],
    studyMaterialId: 'study-day-9',
    exerciseId: 'exercise-day-9',
    quizId: 'quiz-day-9',
    isPublished: true,
    scheduledDate: '2026-10-05',
  },
]

export const STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'study-day-1',
    dayId: 'day-1',
    title: 'Day 1 Study Guide: BI Visualization Fundamentals & Power BI Architecture',
    markdownContent: `# Day 1 — BI Visualization Fundamentals & Power BI Architecture

## What is Business Intelligence?
**Business Intelligence (BI)** is the discipline of turning raw operational data into information people can act on — and then into decisions. It combines several distinct capabilities into one practice:

- **Data mining** — digging through large volumes of historical data to find patterns, correlations and anomalies that aren't visible from any single transaction.
- **Reporting** — packaging data into a regular, trusted, repeatable format (a daily sales report, a weekly ops scorecard).
- **Business analytics** — going beyond "what happened" to "why it happened" and "what's likely to happen next."
- **Data visualization** — presenting the results of the above as charts, dashboards and other visuals a non-technical audience can read at a glance (its own section below).
- **Data infrastructure** — the pipelines, warehouses and models everything above actually runs on.

Operational systems capture transactions one row at a time — an order placed, a claim filed, a shipment scanned. On their own, those rows answer only narrow questions ("what did order #48213 contain?"). BI exists to turn a large volume of those transactions into decisions: revenue this month vs last month, which region is underperforming, which product is trending. This is the shift from **recording** business events to **understanding** them — and it is a discipline, not a single piece of software; Excel, Power BI and Tableau (covered later in this Day) are three different tools that all deliver it.

## Why Organizations Need BI
BI is not adopted for its own sake — it earns its budget because it changes how decisions get made:

- **Faster decisions.** Without BI, answering "which region missed target?" means someone manually querying a database or reconciling spreadsheets — hours or days of lag. A governed BI layer answers it in seconds, for anyone authorized to ask.
- **Better decisions.** Gut-feel and anecdote get replaced with a number everyone agrees on, because the KPI's definition, source and aggregation rule are documented once and reused everywhere (see the KPI discipline below).
- **Earlier warning.** Trends, at-risk metrics and anomalies surface in a dashboard before they show up as a quarterly surprise in a board meeting.
- **A real, growing market.** Business Intelligence tooling was estimated at roughly **US$26.5 billion** in market size in 2021, and a BI professional's average salary is commonly cited around **US$93,000/year** — this is a durable, in-demand skill set, not a niche one.

> **Note:** A BI layer is only as trustworthy as its weakest KPI. An organization that ships dashboards without a validation discipline (see Day 5's DAX reconciliation habits) doesn't get "faster decisions" — it gets faster wrong decisions, which is worse than no dashboard at all.

## BI vs OLTP vs OLAP

| Concern | OLTP (source systems) | OLAP / BI layer |
|---|---|---|
| Purpose | Record transactions | Analyze trends and patterns |
| Schema | Highly normalized (3NF) | Denormalized star schema |
| Typical query | Insert/update a single order | Aggregate millions of rows |
| Users | Cashiers, order clerks, applications | Executives, analysts, managers |
| Change frequency | Constant, row-by-row | Refreshed in batches (daily/hourly) |

> **Note:** A BI layer is not a replacement for the OLTP system — it is a read-optimized analytical layer that sits on top of it, whether that layer is built in Excel, Power BI, Tableau or another tool.

## Facts, Dimensions, Measures, KPIs
- **Fact table** — stores business events/measures at a defined grain (e.g. one row per order line).
- **Dimension table** — a descriptive entity used to filter and group facts (Customer, Product, Date, Region).
- **Measure** — a calculation performed over facts (e.g. Total Revenue = SUM(Sales[Amount])).
- **Attribute** — descriptive, non-calculated data living on a dimension (e.g. Customer[Segment]).
- **KPI** — a measure that has been given a business target/threshold and a visual indicator of performance against it.

Every KPI you ship must have four things nailed down before it reaches a report: a **definition**, a **source**, an **aggregation rule**, and a **validation method**. If you cannot answer all four, the KPI is not ready — and that is true whether the KPI ends up in a spreadsheet or a Power BI report.

## Data Visualization
**Data visualization** is the practice of representing data graphically — as charts, graphs, maps, dashboards and other visuals — so people can understand it quickly and accurately. It is one of the five capabilities that make up BI (above), but it deserves its own treatment because it's the layer every stakeholder actually sees; a perfectly modeled, perfectly validated dataset that's badly visualized still fails to communicate.

Why it matters:
- **Speed of comprehension.** A well-chosen chart lets a reader absorb a trend or a comparison in seconds — the same insight buried in a table of numbers can take minutes, or get missed entirely.
- **Pattern and outlier detection.** Visual encoding (position, length, color) makes correlations, trends and anomalies visible that are difficult to spot by scanning raw rows.
- **Shared understanding.** A chart everyone is looking at during a meeting creates a shared reference point in a way a spoken number rarely does.
- **It is easy to get wrong.** A misleading axis, an overloaded pie chart, or a 3D effect purely for decoration can actively distort what a viewer takes away — good data visualization is a discipline with rules, not a matter of taste. You'll apply those rules directly below in "Choosing the Right Chart Type," and again on every report page you build for the rest of this course.

Data visualization sits downstream of everything else in BI: you need clean data (Day 2), a sound model (Day 3) and correct measures (Day 5) before a visual can be trusted — a beautiful chart built on a wrong number is still wrong, just more convincingly so.

## The BI Tool Landscape
Business Intelligence is not one product — it is a discipline, and a whole market of tools compete to deliver it. Before you go deep on any one of them, it helps to know what "a BI tool" actually does, and where the major options differ.

### What a BI Tool Generally Does
Almost every BI tool, from a spreadsheet to an enterprise platform, covers the same core pipeline:
1. **Connect** — to databases, files, APIs and cloud services.
2. **Transform** — clean, reshape and combine raw data (Power Query, in Excel and Power BI alike).
3. **Model** — define relationships, hierarchies and calculations over the transformed data.
4. **Visualize** — turn the model into charts, tables and dashboards.
5. **Share/govern** — publish, schedule refresh, and control who can see and edit what.

Tools differ mainly in how much of that pipeline they industrialize (manual and local, vs governed and automated) and who their primary audience is.

### Tool-by-Tool Detail
This course teaches three of them in depth, in order of increasing capability, and you should be able to justify picking any one of them for a given situation:

| Tool | What it is | Best when | Weaker at |
|---|---|---|---|
| **Microsoft Excel** | A spreadsheet application with genuine BI capability via PivotTables/PivotCharts and Power Query (Day 2's skills also exist inside Excel) | Ad-hoc analysis, small teams, no deployment infrastructure, an audience already comfortable in spreadsheets, answers needed today | Governed sharing at scale, large data volumes, real version control, automated/scheduled refresh, row-level security |
| **Power BI** | Microsoft's self-service BI platform: Desktop for authoring, Service for governed publishing (this course's primary tool from Day 2 onward) | Enterprise self-service BI, tight Microsoft 365/Azure integration, scheduled refresh and governed publishing to many viewers, a growing analyst team | Highly bespoke exploratory visual analytics; a steeper authoring learning curve than Excel |
| **Tableau** | A dedicated visual-analytics platform, historically the leader in polished, exploratory chart authoring | Strong exploratory visual analytics, polished out-of-the-box visuals, analyst-led deep dives | Enterprise licensing cost; less native fit inside a Microsoft-centric stack |

Two more names worth knowing even though this course does not build with them:
- **Looker** — SQL-modeling-first (its semantic layer, LookML, is defined in code), tightly coupled to Google Cloud; strong where an engineering-led team wants a single governed metric layer reused across many dashboards.
- **Qlik** — an associative in-memory engine; instead of pre-defined drill paths, clicking any value on any chart instantly filters every other chart, which makes free-form "what if I click here" exploration unusually fast.

The tool landscape keeps moving, but the underlying skill — going from a business question to a validated, well-chosen visual, built with clean, modeled, correct data underneath it — transfers across all of them.

> **Tip:** Do not reach for the most powerful tool by default. A one-off analysis for three stakeholders is often better served by an Excel PivotTable shipped today than a governed Power BI dataset shipped next week — the tables above are there to make that call deliberately, not by habit.

## From Business Question to Visual
The anti-pattern is starting from the chart menu ("let's add a donut chart"). The correct sequence is:
1. Business question — "Which regions are behind their sales target this quarter?"
2. KPI — Revenue, Target, Achievement % by Region
3. Grain and filters — by Region, by Quarter
4. Tool — is this a five-minute Excel PivotTable, or does it need Power BI's governed refresh and sharing?
5. Visual — a bar chart sorted by Achievement % is almost always clearer than a donut chart for ranking regions.

> **Tip:** If you cannot state the business question in one sentence, you are not ready to pick a tool or build the visual yet.

## Choosing the Right Chart Type
Before the lab, skim eazyBI's [Data Visualization – How to Pick the Right Chart Type?](https://eazybi.com/blog/data-visualization-and-chart-types) — the rules of thumb apply directly to every tool's visual picker, Power BI included:

- Start from the **presentation goal**, not the chart menu: Comparison, Composition, Distribution, or Relationship. Then ask how many variables, how many data points, and whether time is involved.
- **Tables** — precise lookups, few variables, no trend to show.
- **Column charts** — comparing up to ~7 categories; put time on the horizontal axis; the value axis must start at zero.
- **Bar charts** — same job as column charts, but for long category labels or 7–15 categories.
- **Line charts** — trends over time with many data points (20+); keep time running left to right.
- **Area charts** — cumulative values over time (stock levels, headcount) — not fluctuating values like prices.
- **Pie/donut charts** — avoid by default; humans misjudge angles. If you must, cap it at under 6 categories and never use it for comparison.
- **Scatter/bubble charts** — correlation or distribution between two or three numeric variables.
- **Map charts** — geography-driven context, not a substitute for exact-value comparison.
- **Gauge charts** — a single KPI against a target, sized for a dashboard tile.
- **Multi-axes charts** — use sparingly; they are powerful but hard to read, since scales differ per axis.

General rules that apply to every visual you build this course, in whichever tool you build it: sort bar/column data by value (not alphabetically), start value axes at zero unless you are deliberately showing rate of change, keep the palette under ~6 colors, and design for colorblind readability.

## Setting Up Your Power BI Environment
Before Day 2's hands-on build work, get Power BI Desktop installed and your accounts sorted — there is nothing to build today, but there is no reason to wait until tomorrow morning to discover a blocked install or a missing license.

### Installing Power BI Desktop
Power BI Desktop is a free, Windows-only authoring tool — install it from the Microsoft Store (auto-updates) or as a direct download from the Power BI website. There is no native macOS version; Mac users run it inside a Windows VM or via Azure Virtual Desktop/Windows 365.

### Personal vs Organizational Accounts

| Account type | What it unlocks |
|---|---|
| Personal Microsoft account (e.g. outlook.com) | Installs and runs Power BI Desktop locally; cannot publish to a governed Power BI Service tenant |
| Organizational / work account (Microsoft Entra ID, e.g. you@company.com) | Everything a personal account gives you, plus publishing to workspaces, scheduled refresh, sharing and a Power BI license (Free/Pro/PPU/Fabric capacity) |

> **Tip:** Sign in to Power BI Desktop with your organizational account from the very first launch (File → Options and settings → Sign in) even if you plan to work locally for a while — it saves a painful re-authentication later when you're ready to publish.

### Power BI Desktop vs Power BI Service
These are two different products that share a name:
- **Power BI Desktop** — the authoring tool installed on your machine. You build the data model, write DAX and design report pages here. Nothing is shared with anyone until you publish.
- **Power BI Service** (app.powerbi.com) — the cloud platform. It hosts published reports and datasets, runs scheduled refresh, and is where workspaces, dashboards, sharing and row-level security actually take effect.

Publishing (Home → Publish in Desktop) moves a report from your machine into a workspace in the Service — it does not copy the underlying data anywhere new; the dataset still refreshes from the same sources you configure in Power Query.

### Workspace Basics
A workspace is a container in the Power BI Service for related reports, datasets and dashboards.
- **My Workspace** — your personal sandbox, private by default, good for early drafts.
- **Shared/team workspaces** — where real project work lives, with role-based access: **Admin** (full control), **Member** (can publish/edit), **Contributor** (can edit but not manage), **Viewer** (read-only).

### First-Launch Checklist

| Step | Done when |
|---|---|
| Install Power BI Desktop | App opens without error |
| Sign in with your organizational account | Account name shows in the top-right corner |
| Check for updates | Help → Check for Updates shows you're current |
| Explore the ribbon | You can locate Home, Insert, Modeling and View tabs |
| Open the Power BI Service in a browser | app.powerbi.com loads and shows My Workspace |

Complete this checklist before Day 2 — that's when you start connecting to real data and building inside Power BI Desktop.

## Lab Preview
- Hour 1: Explore the Retail Sales dataset and discuss which BI tool you would reach for at each stage of analysis.
- Hour 2: Work through five supplied business questions and decide the tool and chart type for each, with written justification.
- Hour 3: Present and peer-review your tool/chart choices in pairs.
- Hour 4: Wrap-up discussion — where Excel, Power BI and Tableau each earn their place across this two-week course, and complete the Power BI environment checklist above.`,
    resources: [
      {
        label: 'Retail dataset (FactSales, DimCustomer, DimProduct, DimRegion, DimDate)',
        url: '/docs/datasets/retail',
      },
      {
        label: 'Microsoft Learn — Power BI documentation home',
        url: 'https://learn.microsoft.com/power-bi/',
      },
      {
        label: 'Microsoft Learn — What is Power BI?',
        url: 'https://learn.microsoft.com/power-bi/fundamentals/power-bi-overview',
      },
      {
        label: 'Microsoft Learn — Install Power BI Desktop',
        url: 'https://learn.microsoft.com/power-bi/fundamentals/desktop-getting-started',
      },
      {
        label: 'eazyBI — Data Visualization: How to Pick the Right Chart Type?',
        url: 'https://eazybi.com/blog/data-visualization-and-chart-types',
      },
      {
        label: 'Simplilearn — Free Business Intelligence Course (BI, Power BI outline)',
        url: 'https://www.simplilearn.com/free-business-intelligence-course-online-skillup',
      },
    ],
  },
  {
    id: 'study-day-2',
    dayId: 'day-2',
    title: 'Day 2 Study Guide: Power Query & Data Connectivity',
    markdownContent: `# Day 2 — Power Query & Data Connectivity

Power BI Desktop is really three tools glued together: the **Power Query editor** (data acquisition and shaping), the **Data Model** (relationships and DAX, starting Day 3), and the **Report canvas** (visuals). Today is about the first of those three — plus the publishing **Power BI Service** layer on top — before Day 3 formalizes the data model into a star schema.

## Power BI Desktop Architecture

\`\`\`text
+------------------+     +------------------+     +------------------+     +------------------+
|   Data Sources   | --> |   Power Query    | --> |    Data Model    | --> |   Report Canvas  |
| SQL / CSV / Excel |     | (transform, M)  |     | (tables, DAX     |     | (visuals, pages, |
| / APIs            |     |                  |     |  relationships)  |     |  slicers)        |
+------------------+     +------------------+     +------------------+     +------------------+
                                                                                     |
                                                                                     v
                                                                          +----------------------+
                                                                          |   Power BI Service   |
                                                                          | (publish, refresh,   |
                                                                          |  share, security)    |
                                                                          +----------------------+
\`\`\`

![Power BI architecture](/images/day-1-architecture.png)

Understanding which layer a problem belongs to is the single most useful debugging skill in this course — "the number is wrong" is either a Power Query problem, a model/relationship problem, or a DAX problem, never all three at once.

## Connecting to Data & Choosing a Storage Mode
Power BI can connect to SQL Server, CSV/Excel files, APIs and dozens of other connectors. Each connector negotiates a **storage mode**:

| Storage mode | How it works | Best for |
|---|---|---|
| Import | Data is copied into the Power BI model (in-memory, compressed) | Most reporting scenarios; fastest DAX performance |
| DirectQuery | Power BI sends queries to the source at report run-time | Very large/live sources, security/latency constraints |
| Composite | Mix of Import and DirectQuery tables in one model | Large fact + small reference tables |

> **Warning:** DirectQuery trades query-time performance and DAX feature completeness for freshness. Default to Import unless source scale, latency or security requirements say otherwise.

## The Power Query Editor
Every transformation you need before the data reaches the model happens here — acquiring, shaping and validating raw data before it becomes something you'd trust on a report.

### SQL Reconciliation Baseline
Before you trust any cleaned result, know what the source system says. Treat SQL as ground truth for the entire course:

\`\`\`sql
SELECT
    r.RegionName,
    SUM(s.Amount) AS TotalRevenue,
    COUNT(DISTINCT s.OrderId) AS TotalOrders
FROM FactSales AS s
INNER JOIN DimRegion AS r ON r.RegionId = s.RegionId
GROUP BY r.RegionName
ORDER BY TotalRevenue DESC;
\`\`\`

Keep this query (or one like it) close at hand for the entire course. Every cleaned table should be reconcilable back to a query like this one.

### Power Query Transformations
Every change you make in the Power Query editor is recorded as a step in the **Applied Steps** pane, and every step is one line of the underlying **M** language:

\`\`\`powerquery
let
    Source = Csv.Document(File.Contents("FactSales.csv")),
    PromotedHeaders = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    ChangedTypes = Table.TransformColumnTypes(PromotedHeaders, {
        {"OrderDate", type date},
        {"Amount", type number},
        {"CustomerId", Int64.Type}
    }),
    RemovedErrors = Table.RemoveRowsWithErrors(ChangedTypes, {"Amount"})
in
    RemovedErrors
\`\`\`

A **query step** is a repeatable, auditable transformation — this is what separates Power Query cleanup from an ad-hoc spreadsheet fix: every change is visible, ordered and reversible.

### Data Quality
Common risks you must actively look for, not just hope don't exist:
- Duplicate rows or duplicate keys
- Nulls in join keys or measure columns
- Invalid or inconsistent date formats
- Inconsistent keys across systems (e.g. \`CUST-001\` vs \`1\`)
- Silent type coercion (text that looks numeric but was imported as text)

> **Note:** Fixing a data-quality issue silently is worse than not fixing it — always document the issue, its business impact, the transformation applied and how you validated the fix.

### Merge vs Append
- **Merge** — combine columns from two queries using a join (e.g. add \`CustomerSegment\` from DimCustomer onto FactSales).
- **Append** — stack rows from two queries with the same shape (e.g. combine 2024 and 2025 yearly sales extracts into one table).

### Loading the Result
Once a query is clean, choose **Close & Apply** to load it into the Power BI **Data Model**. Everything downstream — relationships, DAX, visuals — builds on top of what lands here, so get the query clean before applying it.

## From Business Question to Visual (Recap)
The anti-pattern is starting from the chart menu. The correct sequence, unchanged from Day 1, now fully inside Power BI:
1. Business question — "Which regions are behind their sales target this quarter?"
2. KPI — Revenue, Target, Achievement % by Region
3. Grain and filters — by Region, by Quarter
4. Storage mode — Import unless a specific reason says otherwise
5. Visual — a bar chart sorted by Achievement % is almost always clearer than a donut chart for ranking regions.

## Lab Preview
- Hour 1: Connect to the Retail data sources (CSV/SQL/Excel) inside Power BI Desktop and choose a storage mode for each.
- Hour 2: Fix column types and handle nulls in the Power Query editor on a messy retail extract.
- Hour 3: Merge in the customer dimension and append two years of sales extracts.
- Hour 4: Load the cleaned model, build KPI cards and a first set of visuals, and validate totals against SQL.`,
    resources: [
      {
        label: 'Retail dataset (FactSales — two extract years, DimCustomer, DimProduct, DimRegion, DimDate)',
        url: '/docs/datasets/retail',
      },
      {
        label: 'Microsoft Learn — Power BI documentation home',
        url: 'https://learn.microsoft.com/power-bi/',
      },
      {
        label: 'Microsoft Learn — Power Query documentation',
        url: 'https://learn.microsoft.com/power-query/',
      },
      {
        label: 'Microsoft Learn — Power Query M function reference',
        url: 'https://learn.microsoft.com/powerquery-m/',
      },
      {
        label: 'Microsoft Learn — Data sources in Power BI Desktop',
        url: 'https://learn.microsoft.com/power-bi/connect-data/desktop-data-sources',
      },
    ],
  },
  {
    id: 'study-day-3',
    dayId: 'day-3',
    title: 'Day 3 Study Guide: Semantic Modelling & Star Schema',
    markdownContent: `# Day 3 — Semantic Modelling & Star Schema

## Fact and Dimension Design
A fact table stores business events at a fixed grain; dimension tables describe the "who/what/where/when" that lets you slice those events. Getting the grain right up front (one row per order line, not one row per order) is the decision every downstream measure depends on.

## The Star Schema Shape

\`\`\`text
                    DimDate
                       |
   DimCustomer ---- FactSales ---- DimProduct
                       |
                    DimRegion
\`\`\`

The fact table sits in the middle and every dimension connects to it directly through a single-column relationship — no dimension-to-dimension joins, no chains. That's what makes it a "star."

## Table Inventory (Retail Model)

| Table | Type | Grain |
|---|---|---|
| FactSales | Fact | One row per order line |
| DimCustomer | Dimension | One row per customer |
| DimProduct | Dimension | One row per product |
| DimRegion | Dimension | One row per region |
| DimDate | Dimension | One row per calendar day |

## Relationships and Cardinality
Typical fact-to-dimension cardinality is **one dimension row to many fact rows** (1:*). The dimension sits on the "one" side; FactSales sits on the "many" side. Get this backwards and totals silently double-count.

> **Warning:** A many-to-many relationship between two large tables is rarely correct on day one — it's usually a missing bridge table or a mis-modeled grain, and it increases both ambiguity and calculation complexity.

## The Date Dimension
Why build one instead of using the raw dates on FactSales directly? A dedicated \`DimDate\` table gives you a continuous calendar with no gaps, fiscal/calendar year columns, week/quarter attributes, and a single relationship point for every time-intelligence DAX pattern in Day 5. Mark it as a **Date Table** in the model so time-intelligence functions behave correctly.

## Filter Direction
- **Single direction** (dimension → fact) is the default and the safest choice for star schemas.
- **Bidirectional** filtering can look convenient but easily creates ambiguous filter paths and double-counted totals in more complex models — use it deliberately, not by default.

Ambiguous relationships are one of the most common causes of unexpected or incorrect filter propagation and totals — if Power BI has to guess which path a filter should travel, it will not always guess the way you expect.

## Modelling Anti-Patterns
- One giant flat table instead of a star schema (kills reusability and performance).
- Snowflaking dimensions unnecessarily (splitting DimProduct into DimProduct + DimCategory + DimSubcategory when nothing needs it).
- Bidirectional relationships used to "fix" a broken report instead of fixing the model.
- Multiple fact tables joined directly to each other instead of through shared dimensions.

![Star schema diagram](/images/day-3-star-schema.png)

## Lab Preview
- Hour 1: Build the Retail star schema (FactSales + four dimensions).
- Hour 2: Build and mark the date table.
- Hour 3: Create a Product category → subcategory → product hierarchy.
- Hour 4: Test filter propagation by slicing on each dimension and validating totals.`,
    resources: [
      {
        label: 'Retail dataset (FactSales, DimCustomer, DimProduct, DimRegion, DimDate)',
        url: '/docs/datasets/retail',
      },
      {
        label: 'Microsoft Learn — Understand star schema and its importance for Power BI',
        url: 'https://learn.microsoft.com/power-bi/guidance/star-schema',
      },
      {
        label: 'Microsoft Learn — Model relationships in Power BI Desktop',
        url: 'https://learn.microsoft.com/power-bi/transform-model/desktop-relationships-understand',
      },
    ],
  },
  {
    id: 'study-day-4',
    dayId: 'day-4',
    title: 'Day 4 Study Guide: Visualization & Report UX',
    markdownContent: `# Day 4 — Visualization & Report UX

A report page is only as trustworthy as the visuals and layout choices behind it. Today is about picking the right visual for the business question, building a clear hierarchy, and formatting so status is scannable at a glance — the interactivity that turns these pages into a connected application follows on Day 5.

## Choosing the Right Visual

| Business need | Best visual |
|---|---|
| Trend over time | Line chart |
| Ranking categories | Bar/column chart |
| Part-to-whole (few categories) | Stacked bar or donut (sparingly) |
| Single KPI vs target | Card + gauge / KPI visual |
| Correlation | Scatter chart |
| Detail lookup | Table / matrix |

## Layout and Visual Hierarchy
Visual hierarchy means ordering content so the user sees the most important information first — top-left to bottom-right in most locales. Executive pages should lead with KPI cards, then trend, then breakdown; detail pages can lead with a filterable table.

> **Tip:** If every visual on the page is the same size and weight, nothing on the page is actually important.

## Slicers and Tooltips
Slicers let users interactively filter report context without editing the report itself — critical for a report that will be reused by people who aren't you. Tooltips extend a visual with contextual detail (e.g. hovering a region bar shows top 3 products) without cluttering the base visual.

## Conditional Formatting
Conditional formatting (color scales, data bars, icon sets) lets a viewer spot status or exceptions in a table or matrix at a glance instead of reading every number. Use it to communicate — red/amber/green against a target — not to decorate.

## Accessibility
- Don't rely on color alone — pair color with icons or labels for colorblind users.
- Use sufficient contrast and readable font sizes.
- Give visuals meaningful titles and alt text.
- Keep tab order logical for keyboard navigation.

## UX Anti-Patterns
Common review findings: too many visuals per page, inconsistent units (some cards in thousands, others in raw numbers), unclear or truncated labels, color used decoratively instead of meaningfully, and pages with no clear "starting point" for the eye.

![Executive dashboard layout example](/images/day-4-executive-layout.png)

## Lab Preview
- Hour 1: Build the Executive Overview page (KPI cards + trend + regional breakdown) with conditional formatting.
- Hour 2: Build the Sales Analysis page (product/category ranking and comparison visuals).
- Hour 3: Add a custom tooltip and apply accessibility practices (color+icon pairing, alt text, tab order) across both pages.
- Hour 4: Redesign one deliberately cluttered page and run a 10-point UX review comparing before/after.`,
    resources: [
      {
        label: 'Retail dataset (FactSales, DimProduct, DimRegion)',
        url: '/docs/datasets/retail',
      },
      {
        label: 'Healthcare dataset (FactClaims, DimMember, DimProvider)',
        url: '/docs/datasets/healthcare',
      },
      {
        label: 'Microsoft Learn — Visualization types in Power BI',
        url: 'https://learn.microsoft.com/power-bi/visuals/power-bi-visualization-types-for-reports-and-q-and-a',
      },
      {
        label: 'Microsoft Learn — Slicers in Power BI',
        url: 'https://learn.microsoft.com/power-bi/create-reports/desktop-slicers',
      },
    ],
  },
  {
    id: 'study-day-5',
    dayId: 'day-5',
    title: 'Day 5 Study Guide: DAX Essentials, Interactive Report Development',
    markdownContent: `# Day 5 — DAX Essentials, Interactive Report Development

Today has two connected halves. The morning builds the **measure layer** — the DAX that answers "what are the numbers." The afternoon builds the **interaction layer** on top of those same measures — drill-down, drill-through, bookmarks and dynamic titles that let a user explore those numbers without engineering help. A dynamic title, in particular, is literally a DAX expression (\`SELECTEDVALUE\`) wired into the report canvas, so the two halves are not just scheduled back-to-back — the second depends directly on the first.

## Part 1: DAX Essentials

## Measures vs Calculated Columns
A **calculated column** is computed row-by-row at refresh time and stored in the model (adds to file size, good for slicing/grouping). A **measure** is computed on the fly in the current filter context whenever it's used in a visual (nothing stored, always fresh, aggregation-aware). Prefer measures for anything that adds up or divides.

## Core Aggregations

\`\`\`dax
Total Revenue = SUM(FactSales[Amount])

Total Orders = DISTINCTCOUNT(FactSales[OrderId])

Total Customers = DISTINCTCOUNT(FactSales[CustomerId])

Total Cost = SUM(FactSales[Cost])
\`\`\`

## Safe Division with DIVIDE
Never write \`[Total Revenue] / [Total Orders]\` directly — a zero or blank denominator returns an error and can break an entire visual. Use \`DIVIDE\`, which returns blank (or a supplied alternate) instead of erroring:

\`\`\`dax
Average Order Value = DIVIDE([Total Revenue], [Total Orders], 0)

Gross Margin % = DIVIDE([Total Revenue] - [Total Cost], [Total Revenue])
\`\`\`

## CALCULATE and Filter Context
\`CALCULATE\` evaluates an expression under a **modified filter context** — it is the single most important function in DAX because almost every business comparison ("last year", "this region only", "top customers") is really "the same measure, under a different filter."

\`\`\`dax
Revenue Last Year =
CALCULATE(
    [Total Revenue],
    SAMEPERIODLASTYEAR(DimDate[Date])
)
\`\`\`

> **Note:** \`FILTER\` returns a table; \`CALCULATE\` applies filters. You will reach for \`CALCULATE(..., FILTER(...))\` when a simple column filter isn't expressive enough (e.g. "orders above their category's average").

## Time Intelligence: YTD / LY / YoY

\`\`\`dax
Revenue YTD =
CALCULATE(
    [Total Revenue],
    DATESYTD(DimDate[Date])
)

Revenue YoY % =
VAR CurrentRevenue = [Total Revenue]
VAR PriorRevenue = [Revenue Last Year]
RETURN
    DIVIDE(CurrentRevenue - PriorRevenue, PriorRevenue)
\`\`\`

All time-intelligence functions require a proper marked Date table (see Day 3) with a continuous date range — this is the most common reason \`SAMEPERIODLASTYEAR\`/\`DATESYTD\` silently return blank.

## Validating DAX

> **Tip:** Every measure you ship should be reconcilable to a SQL query with the same filters applied. If DAX and SQL disagree, trust SQL until you find the modeling or filter-context bug.

## Part 2: Interactive Report Development

With a trustworthy measure layer in place, a well-laid-out page (Day 4) is still just a page until a user can navigate between related views without losing context. The rest of today adds the interactions that make a multi-page report feel like a considered application — several of them, like dynamic titles, are really just today's DAX put to work in the report canvas.

## Drill-Down vs Drill-Through
These are the two interactions learners confuse most often:
- **Drill-down** changes the **hierarchy level** of the same visual (Year → Quarter → Month within one chart).
- **Drill-through** navigates to a **separate detail page**, filtered by whatever was clicked (click a region → land on a Sales Detail page filtered to that region).

> **Tip:** If the user needs a fundamentally different set of visuals for the detail, that's drill-through. If they just need one more level of the same breakdown, that's drill-down.

## Bookmarks and Buttons
A bookmark captures the current state of a report page — filters, slicer selections, visibility of objects — so it can be recalled with a button click. Bookmarks are how you build toggle views (e.g. "Revenue view" / "Margin view" on the same page) without duplicating visuals.

## Navigation
Buttons plus bookmarks (or built-in page navigation) turn a stack of report pages into an application-like experience: a home page with clear entry points instead of a row of tiny page tabs the user has to guess between.

## Dynamic Titles
A dynamic title is a measure-driven title that reflects the current filter/selection context, e.g. \`"Revenue Trend — " & SELECTEDVALUE(DimRegion[RegionName], "All Regions")\` — the same \`SELECTEDVALUE\` pattern is just DAX, built exactly like the measures earlier today. It reassures the user that the numbers they're looking at match the filters they've applied.

## Tooltip Pages
A custom tooltip page is a small report page rendered on hover — richer than the default single-value tooltip, useful for showing a mini trend or breakdown without leaving the main page.

## Testing User Journeys
> **Warning:** Interactions multiply combinatorially — a report with 3 slicers and a drill-through can be in dozens of valid states. Screenshotting one state is not enough; test the journeys a real user will actually take, under multiple filter states.

## Lab Preview
- Hour 1: Build a 10-measure KPI library (Revenue, Cost, Profit, Margin, Orders, Customers, AOV, YTD, LY, YoY) and add YTD/LY/YoY variants for each core KPI, reconciling as you go back to a SQL query.
- Hour 2: Test each measure under different slicer/filter combinations, then add a drill-down hierarchy (Category → Subcategory → Product) to the Sales Analysis page from Day 4.
- Hour 3: Build a Sales Detail page and wire up a drill-through path from Sales Analysis, filtered by the clicked context; add a home page with navigation buttons, bookmarks for a toggle view, and a dynamic title built from today's measures.
- Hour 4: Add a custom tooltip page, then write and execute 10 user-journey tests under different filter states.`,
    resources: [
      {
        label: 'Retail dataset (FactSales, DimDate, DimProduct, DimRegion)',
        url: '/docs/datasets/retail',
      },
      {
        label: 'Microsoft Learn — DAX reference',
        url: 'https://learn.microsoft.com/dax/',
      },
      {
        label: 'SQLBI — DAX Guide (function reference)',
        url: 'https://dax.guide/',
      },
      {
        label: 'Microsoft Learn — CALCULATE function reference',
        url: 'https://learn.microsoft.com/dax/calculate-function-dax',
      },
      {
        label: 'Microsoft Learn — Bookmarks in Power BI Desktop',
        url: 'https://learn.microsoft.com/power-bi/create-reports/desktop-bookmarks',
      },
      {
        label: 'Microsoft Learn — Drillthrough in Power BI Desktop',
        url: 'https://learn.microsoft.com/power-bi/create-reports/desktop-drillthrough',
      },
      {
        label: 'Microsoft Learn — Buttons in Power BI Desktop',
        url: 'https://learn.microsoft.com/power-bi/create-reports/desktop-buttons',
      },
    ],
  },
  {
    id: 'study-day-6',
    dayId: 'day-6',
    title: 'Day 6 Study Guide: Rapid Customer Prototyping',
    markdownContent: `# Day 6 — Rapid Customer Prototyping

## From Vague Requirement to Clear Scope
When a customer says "we need a dashboard for claims," your first move is **not** to open Power BI. It's to decompose the requirement: what business questions does the customer actually need answered, what KPIs answer them, what are the assumptions, and what's explicitly out of scope for the prototype.

> **Note:** An undocumented assumption is a defect waiting to be discovered in the customer demo.

## The KPI Dictionary
A KPI dictionary is the contract between you and the customer before you build a single visual. At minimum, every row needs a definition, source table/column, aggregation rule and an owner who can confirm it's correct.

| KPI | Definition | Source | Aggregation | Owner |
|---|---|---|---|---|
| Total Revenue | Billed amount across all claims | FactClaims.BilledAmount | SUM | Finance |
| Claims PMPM | Claims cost per member per month | FactClaims, DimMember | SUM(Cost) / DISTINCTCOUNT(Member) / Months | Finance |
| Member Count | Distinct covered members in period | DimMember | DISTINCTCOUNT | Ops |
| YoY Revenue % | Revenue change vs same period last year | FactClaims, DimDate | Time intelligence | Finance |

## Wireframing Before Building
A wireframe is a low-fidelity sketch of page structure — boxes for KPI cards, a placeholder for the trend chart, a placeholder for the table — agreed with the customer before pixels are spent in Power BI. It's far cheaper to move a box on paper than to rebuild a finished report page.

## Prototype vs Production
A prototype's job is to rapidly validate requirements and UX — it does not need production-grade refresh schedules, row-level security or fully hardened DAX. Being explicit about this distinction with the customer avoids "wait, is this what we're actually deploying?" confusion at demo time.

![Three-page prototype wireframe](/images/day-6-wireframe.png)

## Requirement Traceability
Every prototype should carry a simple traceability matrix: Requirement → KPI → Visual → Page. If you can't trace a requirement to at least one visual, either the requirement wasn't understood or the prototype is incomplete.

## Lab Preview
- Hour 1: Receive and decompose a Healthcare reporting requirement.
- Hour 2: Build the model and core KPI measures.
- Hour 3: Build a 3-page prototype (Executive Overview, Provider Analysis, Claim/Provider Detail).
- Hour 4: Deliver a 5-minute customer demo and capture feedback.`,
    resources: [
      {
        label: 'Healthcare dataset (FactClaims, DimMember, DimProvider)',
        url: '/docs/datasets/healthcare',
      },
      {
        label: 'Microsoft Learn — Power BI guidance documentation (planning & KPI design)',
        url: 'https://learn.microsoft.com/power-bi/guidance/',
      },
    ],
  },
  {
    id: 'study-day-7',
    dayId: 'day-7',
    title: 'Day 7 Study Guide: Claude-Assisted BI Development',
    markdownContent: `# Day 7 — Claude-Assisted BI Development

Today is about using Claude as a disciplined copilot for BI development work, and about packaging what you learn into something reusable: a Claude Skill your team can call on again. Tomorrow applies this same validated workflow to a much higher-stakes problem — migrating a legacy report to Power BI.

## Claude as a Copilot, Not an Author

### The Operating Principle
The operating principle for this entire day: **draft → inspect → test → validate**. Claude can accelerate DAX, Power Query and requirement analysis dramatically, but it does not know your schema, your data quality, or your customer's actual business rules unless you tell it — and even then, every output needs verification.

> **Note:** Usage Rule — Treat AI output as draft material. Validate DAX, M, SQL and business definitions before deployment. Never send confidential or customer-sensitive data to an unapproved AI environment.

### Prompt: Requirement Analyst
Use this to turn a vague customer ask into a structured scope before touching Power BI:

> Analyze this customer requirement. Return business questions, KPI definitions, dimensions, filters, pages, visuals, drill paths, assumptions and open questions. Do not invent missing business definitions.

### Prompt: DAX Builder
Use this once your model and column names are finalized:

> Create Power BI DAX measures using only the supplied table and column names. Explain each measure, filter-context behavior, assumptions and edge cases. Provide a SQL validation approach.

### Prompt: SQL to Power Query
Use this whenever you already have a working SQL transformation and need the Power Query M equivalent:

> Convert this SQL transformation into Power Query M. Preserve joins, null behavior, data types and filtering. Explain each step.

### Prompt: UX Reviewer
Use this once a report page exists and you want a structured critique instead of vague gut feel:

> Review this report for hierarchy, visual choice, consistency, accessibility, cognitive load and navigation. Prioritize the five highest-value improvements.

### Why Give the AI Your Schema
Every prompt above says "using only the supplied table and column names" for a reason: an unconstrained prompt will confidently invent table and column names that don't exist in your model. Giving Claude the actual schema is the single highest-leverage thing you can do to reduce hallucinated DAX.

\`\`\`dax
// Example of AI-drafted DAX that still needs validation
Claims PMPM =
DIVIDE(
    [Total Claims Cost],
    CALCULATE(DISTINCTCOUNT(DimMember[MemberId])) * [Month Count]
)
\`\`\`

### Validating AI Output
Every prompt in the library ends with the same four-step validation checklist — memorize it, you'll use it again tomorrow:
- Confirm schema/table names.
- Test with known expected values.
- Test multiple filter states.
- Review assumptions and edge cases.

## Develop a Claude Skill

### One-Off Prompt vs Reusable Skill
Every prompt above is a one-off: you paste it into a conversation, adjust it for the task at hand, and it lives only in that chat. A **Claude Skill** is what you reach for once a prompt like this becomes something you or your team will reuse across projects — "convert SQL to Power Query M," "review a DAX measure for filter-context bugs," "turn a vague ask into a KPI dictionary" are all recurring tasks, not one-time requests.

| Signal | One-off prompt | Claude Skill |
|---|---|---|
| Frequency | You'll use this once, on this task | You or your team will reuse this across projects |
| Ownership | Lives in your own chat history | Shared, versioned, discoverable by teammates |
| Consistency | Rewritten slightly differently each time | Same instructions, same validation steps, every time |
| Triggering | You have to remember to paste it | Claude can invoke it automatically when it recognizes the task |

### Anatomy of a Skill: SKILL.md
A Skill is a folder containing at minimum a \`SKILL.md\` file with YAML frontmatter and instructions in the body:

\`\`\`markdown
---
name: dax-reviewer
description: Reviews a Power BI DAX measure for filter-context bugs (CALCULATE/FILTER misuse, unsafe division, missing time-intelligence guards). Use whenever a trainee or teammate pastes a DAX measure and asks for a review, a second opinion, or "why is this wrong."
---

# DAX Reviewer

You are reviewing a single DAX measure against the supplied table/column schema.

## Instructions
- Ask for the schema if it has not been supplied — never assume table or column names.
- Check for unsafe division (a bare / instead of DIVIDE).
- Check CALCULATE/FILTER arguments for ambiguous or unintended filter context changes.
- Check time-intelligence functions (SAMEPERIODLASTYEAR, DATESYTD, etc.) assume a properly marked, continuous Date table — flag if that cannot be confirmed.
- Return: a plain-English explanation of what the measure currently does, a list of specific bugs or risks found, a corrected version, and a SQL validation approach.
- Never claim a measure is correct without stating what you checked it against.
\`\`\`

The **description** field is the most important line in the file — it is what Claude uses to decide, automatically, whether this Skill applies to a given request. A vague description ("helps with DAX") will rarely trigger; a specific one naming the task and when to use it ("reviews a DAX measure for filter-context bugs... use whenever a trainee pastes a DAX measure and asks for a review") reliably does.

### When a Skill Is the Right Choice
Reach for a Skill when:
- The task recurs — you've used a version of this prompt more than twice this week.
- The instructions are stable enough to write down once (validation steps, schema constraints, output format).
- Other people would benefit from the exact same discipline you've built into the prompt.

Stay with a one-off prompt when the task is genuinely a one-time ask, or when you're still actively figuring out what "good" looks like — a Skill written too early just fossilizes a bad prompt.

### Worked Example: SQL-to-Power-Query-M Skill
A second example, sketching the SQL to Power Query prompt above as a Skill instead:

\`\`\`markdown
---
name: sql-to-power-query-m
description: Converts a SQL transformation (SELECT/JOIN/WHERE/GROUP BY) into equivalent Power Query M steps, preserving joins, null behavior, data types and filtering. Use whenever a trainee has a working SQL query and needs the Power Query M equivalent for a Power BI data source.
---

# SQL to Power Query M Converter

## Instructions
- Ask for the SQL if not supplied, and for the source connector type (SQL Server, CSV, Excel, etc.).
- Preserve JOIN type (inner vs left) exactly — do not silently change join semantics.
- Preserve null-handling behavior; call out anywhere M's null semantics differ from SQL's.
- Name each Applied Step descriptively (no "Changed Type1" defaults).
- Explain each M step in one sentence.
- End with a suggested reconciliation check: a row count and a total that should match the original SQL result.
\`\`\`

### Lab: Draft Your Own SKILL.md
This afternoon's exercise asks you to package one of the four prompts you used this morning (Requirement Analyst, DAX Builder, SQL to Power Query, UX Reviewer) as a real \`SKILL.md\` — frontmatter, description, and instructions — ready to hand to a teammate.

## Lab Preview
- Hour 1: Use the Requirement Analyst and DAX Builder prompts against your own schema, validating every output with the four-step checklist.
- Hour 2: Use the SQL to Power Query and UX Reviewer prompts, logging at least two AI errors or unsupported assumptions you caught.
- Hour 3: Draft a \`SKILL.md\` for one of today's prompts — frontmatter (name, description) plus instructions.
- Hour 4: Peer-review a partner's SKILL.md description for whether it would actually auto-trigger on the right task, then revise.`,
    resources: [
      {
        label: 'Claude Prompt Library — BI Visualization Accelerator',
        url: '/doc/05_Claude_Prompt_Library.md',
      },
      {
        label: 'Claude (Anthropic) — AI assistant used for this course',
        url: 'https://claude.ai/',
      },
      {
        label: 'Anthropic — Claude Skills documentation',
        url: 'https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview',
      },
      {
        label: 'Retail dataset (FactSales) — schema used for prompt exercises',
        url: '/docs/datasets/retail',
      },
    ],
  },
  {
    id: 'study-day-8',
    dayId: 'day-8',
    title: 'Day 8 Study Guide: Legacy Migration - MicroStrategy / Cognos',
    markdownContent: `# Day 8 — Legacy Migration - MicroStrategy / Cognos

Yesterday you used Claude as a validated copilot for requirement analysis, DAX and Power Query, and packaged one of those prompts as a reusable Claude Skill. Today applies that exact same discipline — draft → inspect → test → validate — to a harder, higher-stakes problem: migrating a legacy Cognos/MicroStrategy-style report to Power BI with full numerical reconciliation.

## Why Migrations Fail on "It Looks the Same"
> **Warning:** Screenshot matching does not prove business logic or numerical equivalence. A migrated report that *looks* identical can still be silently wrong.

## Legacy Inventory
Before mapping anything, inventory what the legacy report actually contains: metrics, attributes, prompts/filters, drill paths, and any embedded business logic (custom groups, derived metrics, conditional formatting rules). This is exactly the kind of structured extraction the Requirement Analyst prompt from Day 7 is good at accelerating — point it at the legacy report definition instead of a fresh customer ask.

## Mapping Legacy Concepts to Power BI

| Legacy concept (Cognos/MicroStrategy) | Power BI equivalent |
|---|---|
| Metric | Measure (after understanding the underlying business logic) |
| Prompt | Slicer / filter |
| Attribute | Dimension column |
| Drill (within hierarchy) | Drill-down |
| Drill (to another report) | Drill-through |

## Reconciliation
Reconciliation means comparing your new Power BI output to an authoritative expected result — usually the legacy report's own numbers, or a SQL query against the same source. Numerical reconciliation is **mandatory**, not optional, for every migrated metric.

\`\`\`sql
-- Baseline query mirroring the legacy "Regional Sales Performance" report
SELECT
    d.[Year],
    r.RegionName,
    SUM(s.Amount) AS Revenue,
    SUM(s.Cost) AS Cost,
    SUM(s.Amount) - SUM(s.Cost) AS Profit,
    COUNT(DISTINCT s.OrderId) AS Orders
FROM FactSales AS s
INNER JOIN DimDate AS d ON d.DateKey = s.DateKey
INNER JOIN DimRegion AS r ON r.RegionId = s.RegionId
GROUP BY d.[Year], r.RegionName;
\`\`\`

## Gap and Risk Management
A gap log should contain, per item: the gap itself, its business impact/risk, an owner, a decision/status, and a workaround if one exists. Never leave a discovered gap undocumented just because it wasn't in scope for today.

> **Tip:** Not every legacy quirk needs to be reproduced. Some are bugs the customer will be relieved to see fixed — but that's their decision to make, not yours to assume.

## Lab Preview
- Hour 1: Analyze the supplied legacy "Regional Sales Performance" report definition, accelerated with the Requirement Analyst prompt from Day 7.
- Hour 2: Build a metric/attribute/prompt/drill mapping matrix.
- Hour 3: Recreate the model and DAX in Power BI, using the SQL-to-Power-Query and DAX Builder prompts from Day 7 where useful.
- Hour 4: Validate every output against the SQL baseline and run a UX critique prompt against the rebuilt report.`,
    resources: [
      {
        label: 'Claude Prompt Library — BI Visualization Accelerator',
        url: '/doc/05_Claude_Prompt_Library.md',
      },
      {
        label: 'Legacy Migration lab brief (Regional Sales Performance)',
        url: '/docs/datasets/legacy-migration',
      },
      {
        label: 'Retail dataset (FactSales) — reconciliation source',
        url: '/docs/datasets/retail',
      },
      {
        label: 'Microsoft Learn — Power BI guidance documentation (migration & adoption planning)',
        url: 'https://learn.microsoft.com/power-bi/guidance/',
      },
      {
        label: 'Microsoft Learn — DAX reference (for recreating legacy metrics)',
        url: 'https://learn.microsoft.com/dax/',
      },
    ],
  },
  {
    id: 'study-day-9',
    dayId: 'day-9',
    title: 'Day 9 Study Guide: Capstone + Certification',
    markdownContent: `# Day 9 — Capstone + Certification

## What "Done" Means for a Customer Delivery
By this point every skill from Days 1–8 (BI fundamentals and Power BI architecture, Power Query and data connectivity, semantic modelling, visualization and report UX, DAX essentials and interactive report development, rapid prototyping, Claude-assisted development including your own Claude Skill, and legacy migration discipline) converges into one deliverable: a capstone package a real customer could receive. Today is about proving it, not learning something new.

## Choose Your Capstone
You will build **one** of the three certification capstones end-to-end:
- \`capstone-healthcare\` — Healthcare Financial & Claims Dashboard
- \`capstone-supplychain\` — Supply Chain Command Center
- \`capstone-sales360\` — Sales & Customer 360

Each has its own KPI list, required pages and acceptance criteria — review the capstone brief for your chosen scenario before you start building.

## Technical Validation
> **Warning:** Presenting unvalidated AI output as correct is a certification **critical failure**. Every KPI on your capstone must reconcile to a supplied or SQL-derived expected value before demo day.

Build a validation sheet with at least 10 explicit tests: filter combinations, totals, time-intelligence, drill-through, and reconciliation to SQL.

## Presentation
Your 10-minute demo should walk through: the original requirement, your design decisions, the report itself, the insights it surfaces, how you validated the numbers, and any trade-offs you made as a prototype rather than a hardened production system. Budget 5 minutes afterward for Q&A — practice defending your own DAX out loud.

## Production Hardening (Beyond the Prototype)
A prototype becoming production-ready adds: security (row-level security, workspace permissions), performance (query folding, aggregations, incremental refresh), governance (naming standards, documentation), scheduled refresh, and a maintainability plan for when the schema changes.

## Certification Rubric

| Area | Weight |
|---|---|
| BI fundamentals & Power BI architecture | 10% |
| Power Query & data connectivity | 15% |
| Semantic modelling | 15% |
| DAX & KPI correctness | 15% |
| Visualization & report UX | 10% |
| Interactive report development | 10% |
| Rapid prototyping | 5% |
| Claude-assisted development (incl. Claude Skill authoring) | 10% |
| Legacy migration | 5% |
| Capstone delivery | 5% |

Pass: 70%+ overall with no critical failure. 90–100% Advanced Practitioner, 80–89% Practitioner, 70–79% Certified Foundation, below 70% Reassessment.

> **Note:** Critical failures include materially incorrect KPI results without detection, a fundamentally broken model, being unable to explain your own DAX, missing reconciliation of important numbers, or presenting unvalidated AI output as correct.

## Lab Preview
- Hour 1: Build/finalize your chosen capstone.
- Hour 2: Complete the validation sheet.
- Hour 3: Rehearse the 10-minute demo.
- Hour 4: Live Q&A and certification assessment.`,
    resources: [
      {
        label: 'Healthcare dataset (FactClaims, DimMember, DimProvider) — capstone-healthcare',
        url: '/docs/datasets/healthcare',
      },
      {
        label: 'Supply Chain dataset (FactInventory, DimSupplier, DimWarehouse) — capstone-supplychain',
        url: '/docs/datasets/supply-chain',
      },
      {
        label: 'Sales dataset (FactSales, FactTargets, DimCustomer, DimProduct, DimRegion, DimDate) — capstone-sales360',
        url: '/docs/datasets/sales',
      },
      {
        label: 'Microsoft Learn — Power BI documentation home',
        url: 'https://learn.microsoft.com/power-bi/',
      },
      {
        label: 'SQLBI — DAX Guide (function reference)',
        url: 'https://dax.guide/',
      },
      {
        label: 'Microsoft Learn — Understand star schema and its importance for Power BI',
        url: 'https://learn.microsoft.com/power-bi/guidance/star-schema',
      },
    ],
  },
]

export const EXERCISES: Exercise[] = [
  {
    id: 'exercise-day-1',
    dayId: 'day-1',
    title: 'BI Question-to-Tool Mapping',
    objective:
      'Given a set of realistic business questions, decide which BI tool (Excel, Power BI or Tableau) and which chart type best answers each one, and justify both choices in writing — no software build required.',
    businessScenario:
      'A retail merchandising lead has a backlog of five different reporting asks of varying size and urgency, and wants a recommendation on which tool should answer each one before any development work starts.',
    dataset:
      'Retail dataset (FactSales, DimCustomer, DimProduct, DimRegion, DimDate) — used as business context only, no build required',
    requirements: [
      'Read all five supplied business questions (varying in audience size, refresh needs and data volume, e.g. a one-off view for a single regional manager vs a governed weekly view for 200 store managers vs free-form exploratory analysis).',
      'For each question, choose Excel, Power BI or Tableau and justify the choice using at least one concrete signal from the Day 1 tool-landscape table (audience size, refresh needs, data volume, governance, collaboration).',
      'For each question, choose the single best chart type and justify it using the presentation-goal framework from the eazyBI reading (Comparison, Composition, Distribution, Relationship).',
      'Identify the underlying KPI and grain for each question before naming the tool or visual.',
      'Flag any question where more than one tool would reasonably work, and explain the trade-off.',
    ],
    expectedOutcome:
      'A short written mapping document covering all five business questions, each with a stated KPI/grain, a tool recommendation with rationale, and a chart-type recommendation with rationale.',
    hints: [
      'Start from the business question and KPI, exactly like the "From Business Question to Visual" sequence in the study guide — naming the tool before the KPI is the same anti-pattern as naming the chart before the KPI.',
      'Audience size and refresh cadence are usually the two strongest signals for Excel vs Power BI vs Tableau — look for them explicitly in the question wording.',
      'It is fine, and realistic, for a question to have a legitimate case for two tools — the justification matters more than landing on a single answer.',
    ],
    acceptanceCriteria: [
      'All five business questions have a stated KPI and grain before any tool or visual is named.',
      'Every tool recommendation cites a specific signal from the tool-landscape comparison, not just a preference.',
      'Every chart-type recommendation is justified using the presentation-goal framework (Comparison/Composition/Distribution/Relationship), not just named.',
      'At least one question explicitly discusses a genuine two-tool trade-off.',
    ],
  },
  {
    id: 'exercise-day-2',
    dayId: 'day-2',
    title: 'Connect, Clean and Build a First Power BI Report',
    objective:
      'Connect to the Retail data sources inside Power BI Desktop, choose appropriate storage modes, clean and reconcile a messy extract in the Power Query editor, and turn the result into a first working report page.',
    businessScenario:
      "A retail merchandising lead wants a first look at company-wide sales performance, but the nightly export has inconsistent types, some null keys and two years of sales split across separate files — before any dashboard work can start, the data has to be trustworthy.",
    dataset: 'Retail dataset (FactSales.csv across two extract years, DimCustomer.csv, DimProduct, DimRegion, DimDate)',
    requirements: [
      'Connect to the Retail CSV/Excel sources inside Power BI Desktop and choose a storage mode for each, justifying the choice.',
      'Fix column types on the raw extract (dates, numbers, IDs) and handle nulls in join keys and measure columns using the Power Query editor.',
      'Merge the customer master (DimCustomer) onto the sales extract to validate keys.',
      'Append the two yearly sales extracts into one table.',
      'Write a data-quality note for every transformation: issue, business impact, transformation, validation.',
      'Load the cleaned model (Close & Apply) and create KPI cards for Total Revenue, Total Orders and Total Customers.',
      'Create a trend visual, a region visual, a product visual, and at least one slicer that filters the page.',
    ],
    expectedOutcome:
      'A cleaned, reconciled Power BI data model — whose row count and Total Revenue reconcile to a SQL baseline — plus a first report page whose KPI cards and visuals are correct and respond to the slicer.',
    hints: [
      'Change types as early as possible in the query — later steps behave unpredictably on wrongly-typed columns.',
      'Table.RemoveRowsWithErrors is a blunt instrument — check what you are throwing away before you throw it away.',
      'Default to Import storage mode unless a specific source-scale, latency or security reason says otherwise.',
      'Sanity-check one KPI card by manually summing a filtered subset of the source data.',
    ],
    acceptanceCriteria: [
      'No unexplained row-count or type changes — every transformation is documented.',
      'Row count and Total Revenue after cleansing match a SQL baseline query within an explained tolerance.',
      'Customer keys are validated against DimCustomer with no orphaned foreign keys left unexplained.',
      'Every storage-mode choice is justified with a specific signal (scale, latency, security).',
      'Report loads without errors, every visual renders data, and the slicer correctly filters every visual on the page.',
    ],
  },
  {
    id: 'exercise-day-3',
    dayId: 'day-3',
    title: 'Build the Retail star schema',
    objective:
      'Model the cleaned Retail data as a proper star schema with a dedicated date dimension and a validated product hierarchy.',
    businessScenario:
      "The retail customer has approved the cleansed data from earlier in the week — now it needs to be shaped into a model that supports fast, correct slicing by customer, product, region and time.",
    dataset: 'Retail dataset (FactSales, DimCustomer, DimProduct, DimRegion, DimDate)',
    requirements: [
      'Build one-to-many relationships from each dimension to FactSales.',
      "Build or import a continuous DimDate table and mark it as the model's Date Table.",
      'Create a Category → Subcategory → Product hierarchy on DimProduct.',
      'Set filter direction on every relationship deliberately (avoid default bidirectional where not needed).',
      'Test filter propagation by slicing on each dimension in turn and validating the resulting total.',
    ],
    expectedOutcome:
      "A clean star schema diagram where FactSales is the only many-side table and every relationship's cardinality and filter direction is intentional and documented.",
    hints: [
      'DimDate needs one row per calendar day with no gaps — check for missing dates before marking it as the Date Table.',
      'If a total looks wrong after adding a relationship, check cardinality and filter direction before touching DAX.',
      'A hierarchy is just grouped columns on one dimension — it does not need its own table.',
    ],
    acceptanceCriteria: [
      "Model diagram shows a clean star shape: all dimensions on the one-side, FactSales on the many-side.",
      "DimDate is a continuous calendar marked as the model's Date Table.",
      'Product hierarchy drills correctly from Category to Product in a matrix visual.',
      'At least one filter-propagation test per dimension is documented with expected vs actual totals.',
    ],
  },
  {
    id: 'exercise-day-4',
    dayId: 'day-4',
    title: 'Executive & Sales Analysis Dashboard with Conditional Formatting & Accessibility',
    objective:
      'Design and build a well-organized Retail report — an Executive Overview and a Sales Analysis page — applying visual selection, hierarchy, conditional formatting and accessibility practices.',
    businessScenario:
      'Two different audiences need two different views of the same Retail model — executives want a fast top-line read, analysts want to rank and compare product and region performance — and both expect a page that is trustworthy at a glance.',
    dataset: 'Retail dataset (FactSales, DimProduct, DimRegion, DimDate)',
    requirements: [
      'Build an Executive Overview page: KPI cards, a trend visual and a regional breakdown, ordered by visual hierarchy (most important information first).',
      'Build a Sales Analysis page: product/category ranking and comparison visuals.',
      'Add a custom tooltip to at least one visual.',
      'Apply conditional formatting to communicate status against a target on at least one table/matrix.',
      'Add at least one slicer that filters the whole page without editing the report itself.',
      'Apply accessibility practices across both pages: color paired with icons/labels, meaningful titles and alt text, logical tab order.',
      'Redesign one deliberately cluttered page and run a 10-point UX review comparing before/after.',
    ],
    expectedOutcome:
      'Two report pages where each leads with the most important information for its audience, conditional formatting communicates status rather than decoration, accessibility practices are applied throughout, and the 10-point UX review documents specific before/after improvements.',
    hints: [
      'Executives scan in under 10 seconds — lead with cards, not tables.',
      'If every visual is the same size and weight, nothing on the page looks important — build in deliberate hierarchy.',
      'Pair color with an icon or label everywhere status is communicated, not just where it is convenient.',
    ],
    acceptanceCriteria: [
      'Executive page shows a clear hierarchy — KPI cards first, trend and breakdown second.',
      'Sales Analysis page supports ranking/comparison with at least two visual types.',
      'Conditional formatting communicates status (e.g. red/amber/green vs target), not decoration.',
      'At least one accessibility practice (color+icon pairing, alt text, tab order) is demonstrated and documented on each page.',
      'The 10-point UX review documents specific before/after improvements with rationale.',
    ],
  },
  {
    id: 'exercise-day-5',
    dayId: 'day-5',
    title: 'Build a DAX KPI Library, Then Make It Interactive',
    objective:
      'Author a reusable library of 10 core DAX measures — including safe division and YTD/LY/YoY time intelligence, reconciled to SQL — then put those measures to work behind a drill-down hierarchy, a drill-through detail page, bookmarks, home-page navigation and a dynamic title, and prove it all works under multiple filter states.',
    businessScenario:
      'The retail customer needs a single, trustworthy set of KPI measures that every future report page can reuse instead of ad-hoc calculations per visual — and wants the Sales Analysis and Executive Overview pages from Day 4 to behave like a considered application, not a static printout, once those measures exist.',
    dataset: 'Retail dataset (FactSales, DimDate, DimProduct, DimRegion)',
    requirements: [
      'Build measures for Revenue, Cost, Profit, Margin %, Orders, Customers, Average Order Value.',
      'Build Revenue YTD, Revenue Last Year and Revenue YoY % using proper time intelligence.',
      'Use DIVIDE everywhere a ratio is calculated.',
      'Test each measure under at least two different slicer/filter combinations, then reconcile every measure to an equivalent SQL query.',
      'Add a drill-down hierarchy to the Sales Analysis page (e.g. Category → Subcategory → Product).',
      'Build a Sales Detail page and wire a drill-through path to it from Sales Analysis, filtered by whatever was clicked.',
      'Add a home page with navigation buttons to both report pages.',
      'Add bookmarks for at least one toggle view (e.g. Revenue view / Margin view) on one page.',
      'Add at least one dynamic title built from your measures (e.g. via SELECTEDVALUE) reflecting the current filter/selection context.',
      'Add a custom tooltip page rendered on hover for at least one visual.',
      'Write and execute 10 user-journey tests covering navigation, drill-down, drill-through and bookmark states under multiple filters.',
    ],
    expectedOutcome:
      'A 10-measure KPI library — every measure tested under multiple filter states and reconciled to SQL — powering a navigable, multi-page Retail report where drill-down and drill-through are correctly distinguished, bookmarks and navigation feel application-like, and all 10 journey tests pass.',
    hints: [
      'Write CALCULATE-based comparisons as their own named measures — do not nest SAMEPERIODLASTYEAR inline everywhere.',
      "If YoY returns blank everywhere, check that DimDate is marked as the Date Table and has a continuous range.",
      'VAR/RETURN makes multi-step measures like YoY % far easier to read and debug.',
      'Decide drill-down vs drill-through per interaction before building — they solve different problems.',
      'Bookmarks + buttons are the standard pattern for a toggle view on one page.',
      'A journey test should specify: starting state, action taken, expected result, actual result.',
    ],
    acceptanceCriteria: [
      'All 10 measures exist, are named consistently, use DIVIDE for every ratio, and are reconciled to a SQL query with matching results.',
      'YTD, Last Year and YoY % measures return correct, non-blank values across at least two fiscal periods.',
      'A plain-English explanation exists for each measure describing its filter-context behavior.',
      'Sales Analysis page has a working drill-down hierarchy from Category to Product.',
      'Drill-through from Sales Analysis lands on the Sales Detail page pre-filtered to the clicked context.',
      'Home page navigation correctly moves between all pages including back to home, and the dynamic title updates correctly when a slicer selection changes.',
      'All 10 user-journey tests are documented with starting state, action, expected result and actual result, and pass.',
    ],
  },
  {
    id: 'exercise-day-6',
    dayId: 'day-6',
    title: 'Healthcare reporting prototype',
    objective:
      'Decompose a vague healthcare reporting request into business questions and a KPI dictionary, then deliver a 3-page prototype in one lab session.',
    businessScenario:
      'A healthcare payer\'s operations lead asks for "a claims dashboard" with no further detail — your job is to turn that into a scoped, demoable prototype the same day.',
    dataset: 'Healthcare dataset (FactClaims, DimMember, DimProvider)',
    requirements: [
      'Decompose the requirement into explicit business questions and stated assumptions.',
      'Build a KPI dictionary (definition, source, aggregation, owner) for at least 6 KPIs.',
      'Build the model and core measures (Revenue, Claims Cost, Margin, Member Count, Claims PMPM).',
      'Build a 3-page prototype: Executive Overview, Provider Analysis, Claim/Provider Detail.',
      'Deliver a 5-minute customer demo and capture feedback in writing.',
    ],
    expectedOutcome:
      'A 3-page Healthcare prototype whose every visual traces back to a documented business question and KPI definition.',
    hints: [
      'Wireframe on paper first — moving a box is free, moving a finished visual is not.',
      "PMPM (per member per month) needs both a distinct member count and a month count in its denominator — get the grain right before writing DAX.",
      "Keep prototype-vs-production trade-offs visible to the \"customer\" during the demo, don't let them assume it's production-ready.",
    ],
    acceptanceCriteria: [
      'A requirement-to-KPI-to-visual traceability matrix exists and covers all three pages.',
      'KPI dictionary entries have a definition, source, aggregation rule and owner for each KPI.',
      'All three required pages exist and each answers at least one stated business question.',
      'Demo feedback is captured in writing, including at least one open question or assumption to confirm.',
    ],
  },
  {
    id: 'exercise-day-7',
    dayId: 'day-7',
    title: 'Use Claude as a Validated BI Copilot — and Package a Reusable Skill',
    objective:
      "Use the Claude Prompt Library (Requirement Analyst, DAX Builder, SQL to Power Query, UX Reviewer) against your own Retail schema, validate every output with the four-step checklist, and draft a SKILL.md packaging one of today's prompts as a reusable Claude Skill.",
    businessScenario:
      'The team wants to use Claude to accelerate BI development work without shipping unvalidated or hallucinated logic to a customer — and wants the best prompts turned into something the whole team can reuse, not re-invented from scratch each time.',
    dataset: 'Retail dataset (FactSales, DimDate, DimRegion, DimCustomer) + Claude Prompt Library',
    requirements: [
      'Use the Requirement Analyst prompt against a supplied vague requirement, with your real schema constraining the output.',
      'Use the DAX Builder prompt (with your real table/column names supplied) to draft at least three measures.',
      'Use the SQL to Power Query prompt to convert at least one SQL transformation into M.',
      'Use the UX Reviewer prompt against an existing report page and capture its top five recommendations.',
      'Validate every AI output against the four-step checklist (schema/table names, known expected values, multiple filter states, assumptions/edge cases) and log at least two specific AI errors or unsupported assumptions caught.',
      'Draft a SKILL.md for one of the four prompts used today: YAML frontmatter (name, description) plus instructions in the body.',
      "Peer-review a partner's SKILL.md description and note whether it is specific enough to auto-trigger on the right task.",
    ],
    expectedOutcome:
      'A validated prompt log covering all four prompts with documented AI errors caught, plus a complete SKILL.md ready to hand to a teammate.',
    hints: [
      'Always paste your real table/column names into the DAX Builder prompt — an unconstrained prompt will invent them.',
      'A "plausible but wrong" AI answer is more dangerous than an obviously broken one — check the ones that look right.',
      'The description field is what triggers a Skill automatically — write it as "use this when..." rather than a generic summary.',
    ],
    acceptanceCriteria: [
      'All four prompts (Requirement Analyst, DAX Builder, SQL to Power Query, UX Reviewer) are used and logged with their outputs.',
      'At least two specific AI errors or unsupported assumptions are identified and corrected.',
      'The SKILL.md has valid YAML frontmatter with a name and a specific, trigger-worthy description.',
      'The SKILL.md instructions are concrete enough that a teammate unfamiliar with the original prompt could follow them.',
      "Peer-review feedback on the description's trigger-worthiness is captured in writing.",
    ],
  },
  {
    id: 'exercise-day-8',
    dayId: 'day-8',
    title: 'Map, Rebuild and Reconcile the Legacy Regional Sales Performance Report',
    objective:
      'Inventory, map and rebuild the legacy "Regional Sales Performance" Cognos-style report in Power BI, validating every migrated metric against a SQL baseline, using the prompts and validation discipline from Day 7 to accelerate the work.',
    businessScenario:
      'The retail customer\'s legacy Cognos "Regional Sales Performance" report is being retired, but leadership will not accept a Power BI replacement until every number reconciles.',
    dataset: 'Legacy Migration brief + Retail dataset (FactSales, DimDate, DimRegion, DimCustomer)',
    requirements: [
      "Inventory the legacy report's metrics, attributes, prompts/filters and drill paths (the Requirement Analyst prompt from Day 7 can accelerate this, pointed at the legacy report definition).",
      'Build a mapping matrix: legacy component → Power BI equivalent.',
      'Draft the Revenue, Cost, Profit, Margin % and Orders measures by Year/Region (the DAX Builder prompt from Day 7 can accelerate this).',
      'Convert at least one SQL transformation from the legacy baseline into M (the SQL to Power Query prompt from Day 7 can accelerate this).',
      'Recreate the model, DAX and the Region → Customer drill path in Power BI.',
      'Validate every migrated metric against a SQL baseline query, logging any gaps or risks found.',
      'Run a UX critique against the rebuilt report and log at least two concrete errors or unsupported assumptions caught during the migration.',
    ],
    expectedOutcome:
      "A rebuilt Power BI report that reconciles exactly to the legacy report's numbers, backed by a documented mapping matrix and gap/risk log.",
    hints: [
      'Do the SQL baseline query first — you need a target to reconcile against before you can call anything "done".',
      'A legacy "prompt" almost always becomes a slicer, but check whether it was multi-select before assuming.',
      "Not every legacy quirk needs to be reproduced — but that is the customer's decision, not yours to assume.",
    ],
    acceptanceCriteria: [
      'Mapping matrix covers every legacy metric, attribute, prompt and drill path with its Power BI equivalent.',
      'Revenue, Cost, Profit, Margin % and Orders reconcile exactly to the SQL baseline by Year and Region.',
      'Region → Customer drill-down/drill-through works and is documented as one or the other.',
      'Gap/risk log contains gap, impact/risk, owner, decision/status and workaround (if any) for every identified discrepancy.',
      'At least two specific AI errors or unsupported assumptions are identified and corrected.',
    ],
  },
  {
    id: 'exercise-day-9',
    dayId: 'day-9',
    title: 'Build and certify your chosen capstone',
    objective:
      'Build, validate and demo one of the three certification capstones end-to-end, meeting every common capstone requirement.',
    businessScenario:
      'This is the certification deliverable: choose one of capstone-healthcare, capstone-supplychain or capstone-sales360 and deliver it as if to the real customer described in that capstone brief.',
    dataset:
      'Healthcare dataset (capstone-healthcare) OR Supply Chain dataset (capstone-supplychain) OR Sales dataset (capstone-sales360) — see the chosen capstone brief for exact tables',
    requirements: [
      'Choose one capstone (capstone-healthcare, capstone-supplychain or capstone-sales360) and build its required data model.',
      'Implement all required KPIs for the chosen capstone as validated DAX measures.',
      'Build all required pages for the chosen capstone with drill-down or drill-through.',
      'Build a validation sheet with at least 10 explicit tests reconciling KPIs to expected values.',
      'Produce a Claude prompt log documenting AI-assisted work and validation performed during the build.',
      'Rehearse and deliver a 10-minute customer demo followed by 5 minutes of Q&A.',
    ],
    expectedOutcome:
      'A complete, reconciled capstone package (model, report, validation sheet, KPI dictionary, prompt log) ready for the certification demo, meeting that capstone\'s own acceptance criteria.',
    hints: [
      "Re-read your chosen capstone brief's acceptance criteria before you start — build to the criteria, not to habit.",
      'Budget time for the validation sheet — it is graded as heavily as the report itself.',
      'Practice explaining your own DAX out loud; "I can\'t explain my own logic" is a certification critical failure.',
    ],
    acceptanceCriteria: [
      'Report has exactly the required pages for the chosen capstone (three pages) with at least 8 DAX measures and 3+ slicers.',
      'At least one drill-down or drill-through path is implemented and tested.',
      'Validation sheet contains 10 tests and every primary KPI reconciles to its expected/supplied value.',
      'A model diagram and a KPI dictionary are included in the submission.',
      'A Claude prompt log is included documenting prompts used and validation performed.',
      'The chosen capstone\'s own acceptance criteria (see capstone-healthcare, capstone-supplychain or capstone-sales360) are fully met.',
      'A 10-minute demo plus 5-minute Q&A is rehearsed and ready to deliver.',
    ],
  },
]

export const ASSIGNMENTS: Assignment[] = [
  {
    id: 'assignment-day-1',
    dayId: 'day-1',
    title: 'BI Tool & Chart Mapping Write-Up',
    objective:
      'Document your BI Question-to-Tool Mapping exercise as a stakeholder-ready recommendation, covering tool choice, chart choice and rationale for all five business questions.',
    businessContext:
      'Stakeholders evaluating a new BI initiative want to see structured business thinking, not just a chart — this is the first proof that you think in business questions, and in tool trade-offs, before opening any BI software.',
    requirements: [
      "State all five business questions from today's exercise.",
      'For each, state the KPI/grain, the recommended tool (Excel, Power BI or Tableau) with rationale, and the recommended chart type with rationale.',
      'Explicitly reference the BI vs OLTP/OLAP distinction for at least one question.',
      'Flag the question(s) with a genuine two-tool trade-off and explain your final call.',
    ],
    deliverables: [
      'A document listing all five business questions, each mapped to a KPI, tool and chart type with rationale.',
    ],
    submissionInstructions:
      'Push the mapping document to your GitHub submission repo under /day-1, then submit the repo URL through the LMS.',
    evaluationCriteria: [
      'Full credit requires a business-oriented question, correct KPI, appropriate tool and appropriate chart choice with clear rationale for each of the five items.',
      'The BI vs OLTP/OLAP distinction is correctly applied at least once.',
      'The two-tool trade-off discussion shows genuine judgment, not a coin-flip.',
    ],
  },
  {
    id: 'assignment-day-2',
    dayId: 'day-2',
    title: 'Data-Quality Report & Business Question Mapping',
    objective:
      "Document every data-quality issue found in the retail extract and how it was resolved in Power BI Desktop's Power Query editor, and map five business questions to KPI and visual choices in your first report page.",
    businessContext:
      'Before the customer trusts any number in the eventual dashboard, they need evidence that data-quality issues were found deliberately, and that visual choices were driven by business questions, not habit.',
    requirements: [
      'List every data-quality issue found (types, nulls, duplicates, inconsistent keys, invalid dates).',
      'For each issue, state its business impact if left unfixed, the transformation applied in the Power Query editor, and how the fix was validated.',
      'State five distinct business questions relevant to the Retail dataset, each mapped to a KPI, a grain/filter, a storage-mode choice and a specific Power BI visual.',
      'Attach the Day 2 report page.',
    ],
    deliverables: [
      'A data-quality report: issue → business impact → transformation → validation, one row per issue.',
      'A document listing five business questions, each mapped to a KPI, storage mode and visual with rationale.',
      'The Day 2 report page (.pbix or exported PDF/screenshots).',
    ],
    submissionInstructions:
      'Commit the data-quality report, business-question mapping document and report page to your GitHub submission repo under /day-2, then submit the repo URL through the LMS.',
    evaluationCriteria: [
      'Full credit requires issue → business impact → transformation → validation for every issue found, with no unexplained data changes.',
      'Row counts and key totals after cleansing are validated against a SQL baseline.',
      'Each of the five business questions has a correct KPI, storage-mode choice and visual with clear rationale.',
    ],
  },
  {
    id: 'assignment-day-3',
    dayId: 'day-3',
    title: 'Star-Schema Model Diagram & Relationship Rationale',
    objective: 'Produce a model diagram of the Retail star schema with a written rationale for every relationship.',
    businessContext:
      "A reviewer who has never seen your model should be able to understand its shape and trust its relationships from the diagram and rationale alone.",
    requirements: [
      'Produce a model diagram showing FactSales and all four dimensions.',
      'State the cardinality and filter direction of every relationship.',
      'Explain why DimDate is a dedicated table rather than using raw dates on FactSales.',
      'Identify and explain how you avoided at least one modelling anti-pattern.',
    ],
    deliverables: [
      'A star-schema model diagram (screenshot or exported image).',
      'A written relationship rationale covering cardinality, filter direction and the date dimension.',
    ],
    submissionInstructions:
      'Commit the model diagram and rationale document to your GitHub submission repo under /day-3, then submit the repo URL through the LMS.',
    evaluationCriteria: [
      'Expected model: dimensions on the one-side, FactSales on the many-side, a clean star schema shape.',
      'A dedicated date dimension is present, marked correctly, and its purpose is explained.',
      'Filter direction is stated and justified for every relationship, not left as an unexamined default.',
    ],
  },
  {
    id: 'assignment-day-4',
    dayId: 'day-4',
    title: 'Two-Page Retail Report + 10-Point UX Review',
    objective: 'Deliver the Executive Overview and Sales Analysis report pages and a completed 10-point UX review.',
    businessContext:
      'The customer wants evidence that the visual design of the report was deliberate — a UX review forces that into writing before interactivity is layered on top tomorrow.',
    requirements: [
      'Attach the finished Executive Overview and Sales Analysis pages.',
      'Complete a 10-point UX review covering hierarchy, consistency, slicers, clutter, labels and comparisons.',
      'For each of the 10 UX points, state pass/fail and the specific evidence.',
      'Document at least one accessibility practice applied and why.',
    ],
    deliverables: [
      'The two-page Retail report (.pbix or exported PDF).',
      'A completed 10-point UX review document.',
    ],
    submissionInstructions:
      'Commit the report and UX review to your GitHub submission repo under /day-4, then submit the repo URL through the LMS.',
    evaluationCriteria: [
      'Full credit requires clear hierarchy, consistent formatting, useful slicers, minimal clutter, readable labels and actionable comparisons.',
      'Every UX review point has specific, checkable evidence rather than a generic pass/fail.',
      'At least one accessibility practice is correctly applied and documented.',
    ],
  },
  {
    id: 'assignment-day-5',
    dayId: 'day-5',
    title: '10-Measure KPI Library + Interactive Report + Interaction Test Script',
    objective:
      'Deliver the 10-measure DAX KPI library with five plain-English explanations of filter-context behavior, plus the drill-through, bookmark and navigation additions those measures power, along with a 10-step interaction test script.',
    businessContext:
      'Anyone maintaining this model after you leave the project needs to understand not just what each measure returns, but why, under changing filters — and the customer wants evidence that the interactive behavior built on top of those measures was deliberate and tested, not assumed to work.',
    requirements: [
      'Attach the 10-measure KPI library (Revenue, Cost, Profit, Margin, Orders, Customers, AOV, YTD, LY, YoY).',
      'Write five plain-English explanations of how specific measures behave under filter context.',
      'Show reconciliation evidence (SQL vs DAX) for at least three measures.',
      'Attach the report with drill-down, drill-through, bookmarks and home-page navigation added.',
      'Attach the executed 10-step interaction test script with pass/fail results.',
      'Explicitly distinguish, in writing, which interactions are drill-down vs drill-through.',
      'State how the dynamic title behaves under at least two different filter selections.',
    ],
    deliverables: [
      'The .pbix containing the 10-measure KPI library and the interactive Retail report.',
      'Five plain-English DAX explanations.',
      'Reconciliation evidence for at least three measures.',
      'A 10-step interaction test script with recorded results.',
    ],
    submissionInstructions:
      'Commit the .pbix, explanations/reconciliation evidence and interaction test script to your GitHub submission repo under /day-5, then submit the repo URL through the LMS.',
    evaluationCriteria: [
      'Expected measures include Revenue, Cost, Profit, Margin, Orders, Customers, AOV, YTD, LY and YoY.',
      'Explanations must reflect actual filter-context behavior, not a generic restatement of the formula.',
      'Reconciliation evidence matches the SQL baseline within an explained tolerance.',
      'Drill-down and drill-through are correctly distinguished and both are tested under multiple filter states.',
      'Navigation correctly moves between all pages including back to home.',
      'All 10 interaction tests are documented with starting state, action, expected result and actual result.',
    ],
  },
  {
    id: 'assignment-day-6',
    dayId: 'day-6',
    title: 'Requirement-to-KPI-to-Visual Traceability Matrix + Prototype',
    objective: "Deliver the traceability matrix and 3-page Healthcare prototype from today's lab.",
    businessContext:
      "The healthcare payer needs proof that every page in the prototype exists because of a stated requirement, not because it looked good.",
    requirements: [
      'Attach the requirement-to-KPI-to-visual traceability matrix.',
      'Attach the 3-page Healthcare prototype (Executive Overview, Provider Analysis, Claim/Provider Detail).',
      'List explicit assumptions made where the requirement was ambiguous.',
    ],
    deliverables: [
      'A requirement-to-KPI-to-visual traceability matrix.',
      'The 3-page Healthcare prototype (.pbix or exported PDF).',
    ],
    submissionInstructions:
      'Commit the traceability matrix and prototype to your GitHub submission repo under /day-6, then submit the repo URL through the LMS.',
    evaluationCriteria: [
      'Full credit requires the requirement to be decomposed before building, with explicit KPI definitions and assumptions.',
      'The prototype demonstrably answers the stated business questions, page by page.',
    ],
  },
  {
    id: 'assignment-day-7',
    dayId: 'day-7',
    title: 'Claude Prompt Log & Claude Skill Submission',
    objective:
      "Deliver a validated prompt log covering today's four prompts and a complete SKILL.md packaging one of them for reuse.",
    businessContext:
      'The team wants evidence that AI was used responsibly — every output validated — and wants a reusable Skill the rest of the team can pick up immediately.',
    requirements: [
      'Attach a prompt log of the actual Claude prompts used today (Requirement Analyst, DAX Builder, SQL to Power Query, UX Reviewer), with their outputs.',
      'Identify and document at least two specific AI errors or unsupported assumptions caught during validation.',
      'Attach the SKILL.md drafted today, with YAML frontmatter (name, description) and instructions.',
      'Explain in one paragraph why the description you wrote would (or would not) reliably auto-trigger the Skill on the right task.',
    ],
    deliverables: [
      'A Claude prompt log with validation notes and at least two documented AI errors.',
      'A complete SKILL.md file.',
    ],
    submissionInstructions:
      'Commit the prompt log and SKILL.md to your GitHub submission repo under /day-7, then submit the repo URL through the LMS.',
    evaluationCriteria: [
      'Prompts constrain schema, require explanations, and include validation steps; at least two AI errors are correctly identified.',
      'SKILL.md has valid YAML frontmatter with a name and a specific, trigger-worthy description.',
      'The instructions are concrete enough for a teammate unfamiliar with the original prompt to follow.',
    ],
  },
  {
    id: 'assignment-day-8',
    dayId: 'day-8',
    title: 'Legacy Migration Package',
    objective:
      'Deliver the legacy mapping matrix, gap/risk log and migrated, reconciled report page for the Regional Sales Performance migration.',
    businessContext:
      'Leadership will only retire the legacy Cognos report once the mapping, gaps and reconciliation are documented.',
    requirements: [
      'Attach the metric/attribute/prompt/drill mapping matrix.',
      'Attach the gap/risk log with owner and decision/status per item.',
      'Attach the rebuilt, reconciled report page.',
      'State which Day 7 prompts were reused to accelerate the migration and how their outputs were validated.',
    ],
    deliverables: [
      'A legacy migration mapping matrix.',
      'A gap/risk log.',
      'The migrated Power BI report page (.pbix or exported PDF) with reconciliation evidence.',
    ],
    submissionInstructions:
      'Commit the mapping matrix, gap/risk log and migrated page to your GitHub submission repo under /day-8, then submit the repo URL through the LMS.',
    evaluationCriteria: [
      'Expected mapping: metric→measure, prompt→slicer/filter, attribute→dimension, drill→drill-down/through.',
      'Numerical reconciliation to the SQL baseline is mandatory and present for every migrated metric.',
      'Gap/risk log contains gap, impact/risk, owner and decision/status for every identified discrepancy.',
    ],
  },
]
