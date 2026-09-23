# AI-Ready App Building Playbook

## Source
This repository includes a repository-ready version of the uploaded **AI-Ready App Building Playbook — Spec-Driven, Context-Driven, Agentic Application Development**.

The playbook is derived from the uploaded source transcript and is intended as a reusable reference for AI-assisted application development. Technology choices in the source are examples, not universal requirements.

## 1. Core thesis

The developer remains the architect. The AI coding agent is the implementation engine.

Do not begin serious application development by asking an AI to "build the app." First make the system understandable, bounded and persistent in written context.

The preferred model is spec-driven development rather than vibe coding:
- define architecture and requirements first;
- encode decisions in durable context;
- break work into small feature units;
- implement one unit at a time;
- verify objectively;
- review generated code;
- update the living project state.

## 2. Core loop

IDEA
→ ARCHITECTURAL CONVERSATION
→ CONTEXT SYSTEM
→ FEATURE MAP / UNITS
→ ONE FEATURE SPEC
→ AGENT READS CONTEXT + SPEC
→ PLAN
→ IMPLEMENT EXACTLY IN SCOPE
→ VERIFY
→ CODE REVIEW
→ UPDATE PROGRESS + DECISIONS
→ NEXT UNIT

## 3. Complete lifecycle

1. Clarify product and users.
2. Pressure-test flows, difficult areas, failure modes and scope.
3. Choose architecture and technology boundaries.
4. Create the six context documents and `agents.md`.
5. Initialize a clean foundation.
6. Create feature specifications before implementation.
7. Implement one feature unit at a time.
8. Define explicit acceptance checks.
9. Review generated code separately.
10. Use focused corrective prompts for defects.
11. Record decisions and current state.
12. Use Git branches and pull requests as the project grows.
13. Configure production services/credentials separately.
14. Deploy, inspect logs/build output and run production E2E tests.

If a change crosses unrelated boundaries or cannot be verified quickly, split it.

## 4. Architectural conversation

Before coding, answer:
- What does the application actually do?
- Who uses it?
- What are the core user flows?
- What are the complex/risky parts?
- What can go wrong?
- What must not be built yet?
- Which technology/service owns each responsibility?
- Which boundaries must never be crossed?
- What does observable success look like?

Outputs:
- product definition;
- primary E2E journey;
- feature inventory;
- in/out-of-scope list;
- architecture responsibilities;
- data/storage strategy;
- security/ownership boundaries;
- UI direction;
- feature-unit roadmap;
- acceptance criteria.

## 5. Six-file context system + agents.md

Required durable context:

```
/
├── agents.md
├── context/
│   ├── project-overview.md
│   ├── architecture-context.md
│   ├── code-standards.md
│   ├── ai-workflow-rules.md
│   ├── ui-context.md
│   ├── progress-tracker.md
│   └── feature-specs/
│       ├── 01-...
│       ├── 02-...
│       └── ...
```

### agents.md
The coding agent's entry point. It must require the agent to:
- read the context before implementation;
- read the requested feature spec;
- plan before changes;
- preserve architecture boundaries;
- update progress after changes;
- leave enough state for a future session to resume.

### Context files

**project-overview.md**
- product intent;
- users;
- core flows;
- features;
- scope;
- success criteria.

**architecture-context.md**
- stack;
- layer boundaries;
- storage;
- integrations;
- ownership;
- invariants.

**code-standards.md**
- coding conventions;
- typing;
- component/API patterns;
- styling rules.

**ai-workflow-rules.md**
- agent behavior;
- scope rules;
- ambiguity handling;
- protected areas;
- completion gates;
- documentation synchronization.

**ui-context.md**
- visual language;
- tokens;
- typography;
- spacing;
- components.

**progress-tracker.md**
- current phase;
- in-progress work;
- completed units;
- decisions;
- session notes;
- next work;
- open questions.

## 6. Feature specification

Every feature spec contains:

### Goal
What the unit produces.

### Design Decisions
Already-decided visual, structural, interaction and architecture choices.

### Dependencies
Existing systems/features required first.

### Implementation
Concrete work to create/update.

### Explicitly Out of Scope
Things the agent must not implement.

### Verification Checklist
Objective checks proving completion.

Standard execution:
1. Read `agents.md`.
2. Read required context.
3. Read the feature spec completely.
4. Mark the unit IN PROGRESS.
5. Plan.
6. Implement exactly in scope.
7. Verify.
8. Update progress with completion, decisions, notes and next unit.

## 7. Foundation before features

The source demonstrates establishing UI primitives and layout before feature-specific behavior.

Principles:
- centralize design tokens;
- use reusable primitives;
- keep foundation components stable;
- keep application behavior at the appropriate feature layer;
- verify imports/type/build/lint behavior.

The example source uses Next.js, React, TypeScript, Tailwind, shadcn/ui and lucide-react, but the playbook explicitly says the methodology is tool-agnostic.

## 8. Authentication and authorization

Authentication is an explicit feature, not an assumption.

Requirements:
- configure the selected provider correctly;
- use environment variables for secrets;
- explicitly protect routes;
- verify authenticated and unauthenticated flows;
- verify redirects/sign-out;
- enforce ownership/authorization at mutation boundaries.

Client-side visibility is not a substitute for authorization.

## 9. Data and API architecture

Define data ownership before implementation.

For persistent applications:
- define explicit models and relationships;
- make schema changes repeatable;
- use appropriate indexes;
- separate relational metadata from large artifacts when necessary;
- define backend/API responsibilities in architecture context;
- keep API routes narrow and aligned with feature specs;
- verify CRUD end to end.

Separate large front-end/API changes when combining them would give the agent too much surface area for assumptions.

## 10. Collaboration

When collaboration is required:
- membership is a real application concept;
- verify project membership before granting collaboration access;
- enforce ownership at mutation boundaries;
- keep collaboration providers from becoming authorization bypasses.

The source uses React Flow and Liveblocks as examples for collaborative canvas systems.

## 11. Persistence

Persistence/autosave is its own feature.

Define:
- what is authoritative;
- when state is saved;
- where it is stored;
- how reload/reopen behavior is verified.

Real-time state and durable state must not silently diverge.

## 12. Background work and AI

Long-running AI work should not block ordinary synchronous requests.

Preferred boundary:

User action
→ short request/task trigger
→ background task
→ AI/long-running work
→ persist result
→ expose status/result
→ UI updates

AI output must:
- use a known structured schema;
- be validated before entering application state;
- remain subordinate to the architecture context;
- never silently redefine the core data model.

The source uses Trigger.dev as its example background-task provider.

## 13. AI architecture/spec generation

Natural-language requirements can be converted into structured architecture data.

Rules:
- structured input/output;
- background execution for long jobs;
- explicit run/status lifecycle;
- retries and actionable errors;
- schema validation;
- persistence of generated artifacts;
- deterministic output with respect to defined graph/schema/context where applicable.

Technical specification generation is a separate feature from architecture generation.

## 14. Debugging and corrective prompting

Use this loop:

FAILURE
→ capture exact error/observed behavior
→ identify smallest affected boundary
→ inspect relevant contract/best practice
→ apply ONLY focused correction
→ re-run verification
→ update progress/issue state

Do not:
- re-prompt the entire project for every defect;
- let a corrective task become a new feature;
- patch downstream symptoms when the root integration boundary is wrong.

If specification and implementation disagree, decide which is authoritative and update the authoritative context rather than leaving the mismatch unresolved.

## 15. Git, branches and review

Feature delivery gate:

feature spec
→ implementation
→ local verification
→ development branch
→ pull request
→ AI/human review
→ fix findings
→ merge
→ progress tracker = COMPLETE

The source recommends reviewing AI-generated code rather than assuming generated code is correct.

## 16. Deployment

Before production:
- configure production services/credentials;
- configure environment variables;
- remove development-only keys;
- deploy only after the application is coherent and reviewed;
- inspect build output and deployment logs;
- run critical production E2E flows.

## 17. Master operating procedure

### Phase 0 — Understand
Product, users, value, core journey, risks, dependencies, out-of-scope.

### Phase 1 — Architecture
Framework/runtime, service responsibilities, client/server/background boundaries, auth, data ownership, invariants.

### Phase 2 — Context
Six context files + `agents.md` + consistent terminology + progress tracker.

### Phase 3 — Foundation
Clean foundation, environment handling, UI primitives, design tokens, checks.

### Phase 4 — Feature map
Small dependency-ordered units with clear done conditions.

### Phase 5 — Feature execution
One spec → context → IN PROGRESS → plan → implementation → verification → review → progress update.

### Phase 6 — Integration
Integrate only after foundations are stable and boundaries are explicit.

### Phase 7 — AI features
Structured I/O, background work, status, persistence, validation.

### Phase 8 — Production
Production configuration, environment, deploy, logs, E2E.

## 18. AI-facing master instruction

The coding agent must treat these as authoritative, in order:

1. `agents.md`
2. `context/project-overview.md`
3. `context/architecture-context.md`
4. `context/code-standards.md`
5. `context/ai-workflow-rules.md`
6. `context/ui-context.md`
7. `context/progress-tracker.md`
8. requested feature specification

Mandatory:
- read the required context;
- work on ONE feature unit;
- split unrelated boundaries;
- mark IN PROGRESS;
- plan before modifying files;
- implement exactly in scope;
- preserve invariants;
- do not invent unspecified behavior;
- enforce auth/ownership at mutations;
- use provider-native integration patterns;
- run verification;
- use focused corrective fixes;
- update progress after success.

If a requirement is missing:
- do not invent it;
- record the open question;
- resolve it before dependent behavior is implemented.

## 19. Definition of Done

A feature is complete only when:
- required behavior works;
- applicable type/build/lint checks pass;
- architecture invariants remain intact;
- no unrelated scope was introduced;
- the feature specification is satisfied;
- the progress tracker is updated.

## 20. Final checklist

### Before coding
- product/user defined;
- core flow documented;
- risks identified;
- out-of-scope explicit;
- architecture boundaries written;
- data ownership defined;
- security invariants written;
- UI context defined.

### Before each feature
- small enough for one unit;
- spec exists;
- dependencies known;
- out-of-scope explicit;
- verification checklist exists;
- progress tracker identifies next/in-progress state.

### After implementation
- behavior works;
- checks pass;
- existing behavior remains intact;
- no unrelated scope;
- invariants preserved;
- generated code reviewed;
- tracker accurate.

### Before deployment
- production credentials/services;
- environment variables;
- no development-only keys;
- build succeeds;
- logs inspected;
- critical production flows tested.

## 21. Tooling principle

The source demonstrates a stack including:
- VS Code;
- Claude Code / Codex / GitHub Copilot and alternatives;
- ChatGPT / Claude / Gemini for planning;
- terminal;
- Next.js / React / TypeScript / ESLint / Tailwind;
- shadcn/ui / lucide-react;
- Clerk;
- PostgreSQL / Prisma;
- Liveblocks;
- React Flow;
- Trigger.dev;
- Vercel Blob;
- Git / GitHub;
- CodeRabbit;
- deployment and provider documentation.

These are NOT a mandatory shopping list. The source explicitly states that the methodology is tool-agnostic. Choose technologies based on actual application requirements, assign one clear responsibility to each, document those decisions in `architecture-context.md`, and enforce the boundaries consistently.

## Source-derived principle

AI-assisted application development is fundamentally an architecture-and-control problem: the developer makes the system explicit, gives the coding agent persistent context, bounded specifications, objective verification criteria and living project state. The agent then executes inside those boundaries rather than repeatedly rediscovering the application.
