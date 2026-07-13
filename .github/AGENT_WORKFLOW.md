# Agent issue queue and review contract

This document defines how repository issues become safe units of autonomous
work. It applies to implementation agents and to humans preparing work for
them.

## Label contract

| Label | Meaning |
| --- | --- |
| `agent-ready` | A maintainer has confirmed that the issue has sufficient scope, acceptance criteria, and verification instructions for autonomous implementation. |
| `blocked` | Work cannot proceed until a named dependency or decision is resolved. A blocked issue is never in the agent queue, even if it still has `agent-ready`. |
| `priority: p0` | Correctness, security, legal, or release foundation that should be handled first. |
| `priority: p1` | High-impact user or maintainer improvement. |
| `priority: p2` | Important follow-up with lower urgency. |
| `area: accessibility` | Accessibility and inclusive interaction. |
| `area: tooling` | Build, test, CI, or developer tooling. |
| `area: components` | Component API, behavior, or styling. |
| `area: docs` | Documentation and examples. |
| `area: demo` | Angular demo application and website. |
| `area: design-system` | Tokens, theming, or motion. |
| `area: release` | Versioning, packaging, or publishing. |
| `epic` | Tracking issue whose child issues, rather than the epic itself, are implementation units. |

## Ready queue

The automatic queue is exactly:

```text
is:issue is:open label:agent-ready -label:blocked
```

Priority labels order eligible work (`p0`, then `p1`, then `p2`). Priority does
not override dependencies, issue scope, or repository permissions.

Before applying `agent-ready`, a maintainer verifies that the issue contains:

- a concrete objective and evidence;
- bounded scope and explicit non-goals when ambiguity is likely;
- testable acceptance criteria;
- dependencies, or an explicit statement that there are none;
- expected verification evidence;
- the affected area and priority labels; and
- any external-state or maintainer-only steps.

Issue forms do not apply `agent-ready` automatically. Triage is the readiness
gate.

## Claiming and implementation

An agent claims one issue by commenting with its branch name and intended
scope. If another active claim exists, the agent does not start overlapping
work. Use a branch named `codex/issue-<number>-<short-name>` unless the issue
specifies another convention.

Agents may implement, test, commit, push their branch, and open a pull request
when those actions are requested by the issue. They must not merge, publish,
create a release, rotate credentials, change repository settings, or broaden
scope without explicit maintainer authorization.

If a dependency appears during implementation:

1. stop the dependent portion of the work;
2. report the evidence and exact decision or dependency needed;
3. apply or request `blocked`; and
4. do not silently substitute a materially different design.

## Pull request and completion

The implementation pull request must:

- include `Closes #N` for the claimed issue;
- map its changes to the acceptance criteria;
- report commands and manual checks actually performed;
- identify risk, accessibility, documentation, and semver impact;
- contain no unrelated changes; and
- remain unmerged for owner review.

Opening a pull request does not make the issue complete. The issue closes only
after the pull request is reviewed and merged. If acceptance criteria change,
the issue must be updated so the issue remains the source of truth.

## Review ownership

CODEOWNERS requests review from `@banegasn` for all paths. When GitHub cannot
request that owner automatically, the pull request author must request review
from the repository maintainer manually. Self-authored or agent-authored work
is never self-approved; a maintainer owns merge and release decisions.
