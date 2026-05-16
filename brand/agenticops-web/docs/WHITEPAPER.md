# AgenticOp.io & Chrysalis — Technical Whitepaper

**Version:** 1.0 · **Audience:** Engineering leadership, architects, and senior ICs evaluating verification-first legacy modernization.

---

## Abstract

**AgenticOp.io** is an operating model for changing legacy software **one bounded system at a time**: humans own outcomes, agents accelerate exploration, and **systems enforce correctness** through capture, replay, behavioral diff, and gated cutover. **Chrysalis** is the flagship **verification-backed migration engine** (PHP-first today) that implements that loop. This document states technical intent and architecture at a level sufficient for due diligence; implementation detail lives in the **Chrysalis** source repository and in pilot engagements.

---

## 1. Problem framing

Enterprise legacy stacks (PHP, Perl, classic .NET, monoliths) resist “big bang” rewrites because **behavior is under-documented** and **risk is concentrated**. Conventional AI-assisted refactors amplify throughput but, without proof harnesses, **cannot answer** “did we preserve production semantics?” AgenticOp.io treats that question as **non-negotiable**: no silent wrong output; merges fail when oracle and candidate disagree.

---

## 2. Operating model — AgenticOp.io

| Layer | Responsibility |
|--------|------------------|
| **Humans** | Scope, risk acceptance, cutover approval, business tradeoffs |
| **Agents** | Exploration, refactors, tests, runbooks, migration drafts |
| **Systems (Chrysalis)** | Oracle corpus, deterministic replay, diff reporting, chimera orchestration |

Engagements are deliberately scoped to **one legacy system** (or a thin vertical slice) per phase so that oracle surface area, replay cost, and human review stay bounded.

---

## 3. Engine — Chrysalis (conceptual architecture)

Chrysalis orients work around a **five-stage verified pipeline** aligned to how production behavior is observed, transformed, and proven:

1. **Observe** — Record ground-truth behavior from running systems (oracle-oriented capture).  
2. **Ingest** — Normalize traces / IR suitable for tooling (e.g. WebIR-oriented pipelines in implementation).  
3. **Emit** — Generate or refactor candidate implementations under human + CI policy.  
4. **Verify** — Deterministic replay and behavioral comparison; explicit reporting of partial translation (“holes”) where full parity is not yet proven.  
5. **Deploy / Chimera** — Dual-stack or shadow paths until parity earns traffic; reversible, observable shifts.

**Chimera** here means **parallel-run cutover**: old and new earn parity under replay and operational checks before commitment—not a single-flip rewrite.

---

## 4. PHP-first proving surface

The first flagship proving surface is **legacy PHP estates** (custom apps, long-lived frameworks, shared hosting patterns) because they dominate a large fraction of the web’s long tail and because **runtime behavior** is observable at the request boundary. The same verification pattern **generalizes** to other runtimes; PHP is where the loop is hardened first, not where it ends.

---

## 5. Production discipline — wisptools.io

**wisptools.io** (WISP-Management ecosystem, MIT-licensed) is cited as **production proof** of agent-assisted delivery at operational scale—multi-tenant telecom / ISP workflows—not as a merge of product identity with AgenticOp.io. It demonstrates the **same shipping discipline** that informed Chrysalis: agents in the loop, humans gating risk, production as the referee.

---

## 6. Pilots, maturity, and licensing

Chrysalis is **early** in public maturity; commercial work runs as **scoped pilots** (“private alpha” describes **engagement shape**, not hidden source). Source: **https://github.com/4GEngineer/chrysalis** — verify **LICENSE** in that repository before legal claims.

---

## 7. Security and trust posture

- No merge on silent behavioral disagreement with the oracle.  
- Honest surfacing of partial translation gaps.  
- Human-in-the-loop on cutover; audit trails for agent and system actions.  
- Customer secrets, CI, and review processes remain **the customer’s**; self-hosted options may apply on retainer engagements.

---

## 8. References (public)

| Resource | URL |
|----------|-----|
| AgenticOp.io (marketing) | https://agenticop.io/ |
| Chrysalis (engine source) | https://github.com/4GEngineer/chrysalis |
| wisptools.io (production proof stack) | https://wisptools.io/ |

---

*Canonical copy (edit here): `brand/agenticops-web/docs/WHITEPAPER.md`. Before deploy, mirror the same bytes to **`../WHITEPAPER.md`** at site root so `whitepaper.html` can fetch it — see `AGENTS.md`.*
