description: Run security audit across all packages
---
Use the security-auditor subagent to review:
1. All contract changes since last audit
2. API endpoint security (auth, rate limiting, input validation)
3. SDK security (key handling, budget enforcement)
4. Dashboard security (XSS, CSRF, CSP)
5. Dependency audit: `bun audit`
Generate report with CRITICAL/HIGH/MEDIUM/LOW findings.
