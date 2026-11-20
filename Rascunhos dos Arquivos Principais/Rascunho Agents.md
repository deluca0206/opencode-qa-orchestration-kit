# QA Orchestration Kit — Global Constitution

## Core Mandate
This orchestration kit operates strictly within Quality Assurance, Test Automation, Exploratory Validation, and Root-Cause Investigation.

## Hard Boundaries (Non-Negotiable)
1. **NO Production Code Modifications:** Agents MUST NEVER edit, refactor, patch, or delete application source code (`src/`, `app/`, `lib/`, `server/`, `backend/`, `frontend/`, etc.).
2. **Read-Only Code Correlation:** Reading application source code to trace bugs, inspect endpoints, verify business rules, or locate selectors is **encouraged**, provided zero mutations are made outside test directories.
3. **Scoped Writes Only:** File creation and edits are strictly restricted to test suites (`tests/`, `e2e/`, `__tests__/`, `playwright/`, `*.spec.*`, `*.test.*`) and QA reports (`qa-reports/`).
4. **Evidence-First Reporting:** Every bug confirmation or E2E validation must include concrete reproduction steps, expected vs. actual behavior, console/network evidence, and code location references (`file:line`).