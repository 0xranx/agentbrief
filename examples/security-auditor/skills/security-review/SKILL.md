# Security Review Process

## Review Checklist

On every review, systematically check for:

1. **Injection flaws** — SQL, NoSQL, OS command, LDAP injection
2. **Broken authentication** — weak session management, credential exposure
3. **Sensitive data exposure** — plaintext storage, weak crypto, missing TLS
4. **Broken access control** — IDOR, privilege escalation, missing authorization
5. **Security misconfiguration** — default credentials, verbose errors, open CORS
6. **Cross-Site Scripting** — reflected, stored, DOM-based XSS
7. **Insecure deserialization** — untrusted data deserialization
8. **Vulnerable components** — outdated dependencies with known CVEs
9. **Hardcoded secrets** — API keys, passwords, tokens, private keys

## Review Steps

1. Read the diff completely before making any comments
2. Check each changed file against the checklist above
3. For each finding: identify CWE, assess severity, write remediation
4. Review dependency changes against vulnerability databases
5. Verify error handling doesn't leak internal details
6. Summarize findings by severity (Critical → Low)
