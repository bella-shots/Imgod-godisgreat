| ALIGNMENT WITH UPLOADED APP-BUILDING PLAYBOOK |  |  |  |  |
|---|---|---|---|---|
| Playbook Principle | How this workbook applies it | Where | Why it matters for 2-day build | Status |
| Architecture before coding | Architecture, builder-engine choice, data ownership, security boundaries are first tasks. | D1-01:D1-04 | Prevents Google AI Studio from improvising the system. | Applied |
| Six-file context + agents.md | Created before implementation and restored on Day 2. | D1-05,D2-01 | Lets AI Studio resume without rediscovering requirements. | Applied |
| Feature specs | Business modules and builder capabilities are decomposed into units. | Feature Specs | Controls AI scope and reduces debugging loops. | Applied |
| One unit at a time | Each checklist item has dependency, exact action and verification. | 2-Day Checklist | Allows parallel-looking speed without architectural drift. | Applied |
| Provider-native capabilities | Full builder uses mature editor engine rather than custom canvas implementation. | D1-19,D2-10:D2-18 | This is the main mechanism for fitting full builder into 2 days. | Applied |
| Server-side authorization | Permissions are enforced at mutation/API boundaries. | Permissions Matrix,D2-19:D2-20 | UI-only hiding is insufficient. | Applied |
| Focused corrections | Exact errors become corrective prompts rather than full-project re-prompts. | AI Studio Prompt Sequence | Reduces regression and wasted time. | Applied |
| Review before completion | AI-generated code is reviewed before merge/deploy. | D2-23 | Catches spec/security mismatches. | Applied |
| Production verification | Deploy, inspect logs and test critical flows. | D2-24:D2-25 | Prevents assuming a successful build is a successful product. | Applied |
| Cost-aware architecture | Architecture assigns each responsibility to an existing/free/open-source service appropriate for a ~20-person internal system. | Read Me; Required Tools; architecture tasks | Prevents unnecessary infrastructure and keeps the 2-day build aligned with the user's ₹0 additional-cost constraint. | Applied |