# OWASP Top 10 (2021) — Quick Reference

## A01: Broken Access Control
- Enforce least privilege; deny by default
- Invalidate server-side sessions on logout
- Rate limit API and controller access
- Disable web server directory listing
- Log access control failures and alert admins
- **CWEs:** CWE-200, CWE-284, CWE-285, CWE-352, CWE-639

## A02: Cryptographic Failures
- Classify data by sensitivity; don't store sensitive data unnecessarily
- Encrypt all sensitive data at rest (AES-256)
- Enforce TLS 1.2+ for data in transit; use HSTS
- Never use deprecated algorithms (MD5, SHA1, DES, RC4)
- Use bcrypt/scrypt/Argon2id for password storage — never plaintext
- **CWEs:** CWE-259, CWE-327, CWE-331

## A03: Injection
- Use parameterized queries / prepared statements (SQL, NoSQL, LDAP)
- Validate and sanitize all server-side input
- Escape output contextually (HTML, JS, URL, CSS)
- Use LIMIT and other SQL controls to prevent mass data disclosure
- **CWEs:** CWE-20, CWE-74, CWE-79, CWE-89

## A04: Insecure Design
- Establish secure design patterns and reference architecture
- Use threat modeling for critical flows (auth, access control, business logic)
- Write unit and integration tests for security-critical paths
- Limit resource consumption by user or service
- **CWEs:** CWE-209, CWE-256, CWE-501, CWE-522

## A05: Security Misconfiguration
- Repeatable hardening process for all environments
- Remove unused features, frameworks, and accounts
- Review cloud storage permissions (S3 buckets, etc.)
- Send security directives (CSP, X-Frame-Options, etc.)
- Automated verification of configuration across environments
- **CWEs:** CWE-16, CWE-611

## A06: Vulnerable and Outdated Components
- Remove unused dependencies and unnecessary features
- Continuously inventory client-side and server-side component versions
- Monitor CVE and NVD for vulnerabilities; use SCA tools
- Only obtain components from official sources over secure links
- **CWEs:** CWE-1104

## A07: Identification and Authentication Failures
- Implement multi-factor authentication where possible
- Never ship default credentials
- Check passwords against known-breached password lists
- Align password policies with NIST 800-63b
- Limit or delay failed login attempts; log all failures
- **CWEs:** CWE-255, CWE-259, CWE-287, CWE-384

## A08: Software and Data Integrity Failures
- Use digital signatures or checksums to verify software/data integrity
- Ensure libraries and dependencies are from trusted repositories
- Use a review process for code and configuration changes
- Ensure CI/CD pipelines have proper access control and integrity verification
- **CWEs:** CWE-345, CWE-353, CWE-426, CWE-494, CWE-502, CWE-565

## A09: Security Logging and Monitoring Failures
- Log all login, access control, and server-side input validation failures
- Ensure logs are in a format consumable by log management solutions
- Ensure high-value transactions have audit trails with integrity controls
- Establish effective monitoring and alerting for suspicious activity
- **CWEs:** CWE-117, CWE-223, CWE-532, CWE-778

## A10: Server-Side Request Forgery (SSRF)
- Sanitize and validate all client-supplied input data
- Enforce URL schema, port, and destination with an allow list
- Do not send raw responses to clients
- Disable HTTP redirections
- **CWEs:** CWE-918
