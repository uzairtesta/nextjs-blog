# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT open a public GitHub issue**
2. Email the maintainer directly
3. Include detailed steps to reproduce
4. Allow reasonable time for a fix before disclosure

## Security Practices

- All dependencies should be regularly audited with `npm audit`
- The `postinstall` script runs `prisma generate` only — this is safe and expected
- No code in this repository should use `eval()`, `new Function()`, `child_process`, or obfuscated code
- Configuration files (`next.config.js`, `postcss.config.js`, `tailwind.config.ts`) should contain only standard, readable configuration

## Past Incidents

### 2026-04 Repository Compromise

The repository was compromised through a force-push attack. The attacker:
- Cloned a legitimate commit and injected obfuscated malware into `postcss.config.js`
- Force-pushed the modified commit to replace the legitimate one on the remote
- Later injected malware into `next.config.js` via a spoofed merge commit
- Used a `config.bat` tool to spoof commit author identity and timestamps

The compromise was detected and remediated. All malicious code was removed and the repository was rebuilt from verified clean commits.
