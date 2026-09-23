# Main Prompt — Controlled Execution

## Instruction

Before doing any implementation work:

1. Fetch and read the prompt located in:
   `Phase-1/ChatGPT Prompt/`
2. Treat that Phase 1 ChatGPT prompt as the immediate task instruction.
3. Read and obey the repository control documents, especially:
   - `agents.md`
   - `context/project-overview.md`
   - `context/architecture-context.md`
   - `context/code-standards.md`
   - `context/ai-workflow-rules.md`
   - `context/ui-context.md`
   - `context/progress-tracker.md`
4. Read the relevant Phase 1 documentation referenced by the prompt.
5. Follow the AI-ready development workflow:
   - understand the task and dependencies
   - identify the exact scope
   - make a plan
   - implement only what the prompt authorizes
   - do not invent requirements
   - do not skip required human-action gates
   - verify the result against objective acceptance criteria
   - update the relevant progress/context documentation
6. If the prompt requires human authorization, access, credentials, or a real-world action that cannot be performed by the AI, stop at that boundary and clearly report **HUMAN ACTION REQUIRED**.
7. Do not proceed to later phases merely because their documentation exists.
8. Do not introduce React/Vite/localStorage/Firebase or paid services. The authoritative architecture is:
   **Google Sites + Google Sheets + Google Forms + Google Drive + Google Apps Script.**

## Primary Rule

**Fetch the prompt in the Phase 1 ChatGPT Prompt folder, understand it together with the repository control documents, and do exactly what it instructs within the authorized scope.**

Do not treat this file as a replacement for the Phase 1 prompt. It is the entry point that tells the AI where the authoritative task prompt is and how to execute it safely.
