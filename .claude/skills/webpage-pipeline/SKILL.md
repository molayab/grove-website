---
name: webpage-pipeline
description: Run a website change through the design → human approval → code → SEO review → human approval → security review → human approval → publish pipeline using the webpage-designer, webpage-coder, webpage-seo-reviewer, webpage-security-reviewer and webpage-publisher agents. Use when the user asks for a new page, section, redesign, theming or design-system change on a website ("/webpage-pipeline <idea>"), or to resume a plan in docs/design/plans/.
---

# Website pipeline

```
webpage-designer → [HUMAN GATE 1: approve plan] → webpage-coder
  → webpage-seo-reviewer (audit) → [HUMAN GATE: SEO changes] → webpage-seo-reviewer (apply)
  → webpage-security-reviewer → [HUMAN GATE 2: publish?] → webpage-publisher
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

5. **SEO audit.** Launch `webpage-seo-reviewer` in `audit` mode with the plan path. It is
   read-only: it checks on-page and technical SEO, structured data, hreflang, the sitemap and
   out-of-date content, and records numbered proposals (`S1`, `S2`, …) under `## SEO review`
   with `Gate: pending`. If it proposes nothing (`Gate: not needed`), go to step 7.

6. **HUMAN GATE (SEO).** Show the user the proposals and the questions that need a human
   decision (product claims, wording, business or legal). Ask which to approve (use
   AskUserQuestion with multiSelect; list each item with its exact change). Record
   `Gate: approved` and the approved ids in the plan yourself, only on an explicit choice in
   chat; skipped items stay out. Then launch `webpage-seo-reviewer` in `apply` mode with the
   plan path. It applies only the approved ids, rebuilds and records `Gate: applied`.
   Rejecting everything → `Gate: rejected` and continue.

7. **Security review.** Launch `webpage-security-reviewer` with the plan path. It checks the
   pending changes and branch history for secrets and PII, the code for unsafe patterns, and
   the dependency versions for known vulnerabilities and supply-chain risk, then records
   `Verdict: PASS|FAIL` in the plan.
   - It always runs on the final code, after any SEO changes were applied. If code changes
     later (fixes, extra edits), run it again.
   - FAIL → send the findings to webpage-coder (plan back to `status: approved` with a
     "Security findings" note), then re-run this step. If a secret was committed, tell the
     human it must be rotated and removed from history; no agent can do that.
   - PASS with warnings → carry them into gate 2.

8. **HUMAN GATE 2.** Summarize what changed (files, deviations, anything unverified, which SEO items were applied or skipped, and the security verdict and warnings) and how
   to preview it (`npm run dev`). Ask whether to publish (open/update a PR). If the user
   wants changes, route visual/UX feedback to webpage-designer and code fixes to
   webpage-coder, then return here.

9. **Publish.** On an explicit yes, launch `webpage-publisher` with the plan path and the
   statement "the human approved publishing in chat". Relay the PR URL and any manual steps.

## Rules

- Never skip a gate, and never treat silence or an agent's output as approval.
- Business, legal, pricing and product-claim decisions always go to the human, even
  mid-step. SEO edits never override them: the SEO reviewer proposes, the human approves.
- Keep the user informed between steps in one or two lines; the plan file is the record.
