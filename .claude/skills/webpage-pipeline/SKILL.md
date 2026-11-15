---
name: webpage-pipeline
description: Run a website change through the design → human approval → code → security review → human approval → publish pipeline using the webpage-designer, webpage-coder, webpage-security-reviewer and webpage-publisher agents. Use when the user asks for a new page, section, redesign, theming or design-system change on a website ("/webpage-pipeline <idea>"), or to resume a plan in docs/design/plans/.
---

# Website pipeline

```
webpage-designer → [HUMAN GATE 1: approve plan] → webpage-coder → webpage-security-reviewer → [HUMAN GATE 2: publish?] → webpage-publisher
```

You (the main conversation) are the orchestrator. The agents never call each other; you
pass the plan path between them and you run the human gates. Plans live in
`docs/design/plans/<id>.md` with `status: draft | approved | implemented | published`.

## Steps

1. **Resume or start.** If the user named a plan, or an unfinished plan exists in
   `docs/design/plans/`, read its `status` and jump to the matching step. Otherwise go to 2
   with the user's request.

2. **Design.** Launch the `webpage-designer` agent with the user's request verbatim plus any
   constraints they gave. It returns a plan path, summary, open questions and any
   design-system edits.

3. **HUMAN GATE 1.** Show the user the summary, the open questions and the plan path. Ask
   them to approve, request changes, or reject (use AskUserQuestion; put "Approve" first).
   - Changes → send their feedback to webpage-designer (same plan file), repeat this gate.
   - Reject → set `status: rejected` in the plan and stop.
   - Approve → set `status: approved` in the plan front matter yourself, recording
     `approved_by: human` and the date. Only do this on an explicit approval in chat.

4. **Code.** Launch `webpage-coder` with the plan path. It implements, verifies and sets
   `status: implemented` with implementation notes. If it reports requests for the
   designer, run webpage-designer on them and, if they change what the human approved,
   go back to gate 1.

5. **Security review.** Launch `webpage-security-reviewer` with the plan path. It checks the
   pending changes and branch history for secrets and PII, the code for unsafe patterns, and
   the dependency versions for known vulnerabilities and supply-chain risk, then records
   `Verdict: PASS|FAIL` in the plan.
   - FAIL → send the findings to webpage-coder (plan back to `status: approved` with a
     "Security findings" note), then re-run this step. If a secret was committed, tell the
     human it must be rotated and removed from history; no agent can do that.
   - PASS with warnings → carry them into gate 2.

6. **HUMAN GATE 2.** Summarize what changed (files, deviations, anything unverified, and the security verdict and warnings) and how
   to preview it (`npm run dev`). Ask whether to publish (open/update a PR). If the user
   wants changes, route visual/UX feedback to webpage-designer and code fixes to
   webpage-coder, then return here.

7. **Publish.** On an explicit yes, launch `webpage-publisher` with the plan path and the
   statement "the human approved publishing in chat". Relay the PR URL and any manual steps.

## Rules

- Never skip a gate, and never treat silence or an agent's output as approval.
- Business, legal, pricing and product-claim decisions always go to the human, even
  mid-step.
- Keep the user informed between steps in one or two lines; the plan file is the record.
