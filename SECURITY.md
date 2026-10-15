# Security Policy

## Supported Versions

We actively maintain and provide security updates for the latest major and minor releases of `fmds-responsive`:

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :x:                |
| < 1.0.0 | :x:                |

---

## Reporting a Vulnerability

The FMDS team takes supply chain and software security very seriously. If you discover a security vulnerability or potential threat within this package, please report it responsibly:

1. **Email:** Send details directly to [mohitthakur8907@gmail.com](mailto:mohitthakur8907@gmail.com).
2. **Subject:** Please include `[SECURITY] fmds-responsive: <Brief Summary>` in the subject line.
3. **Details:** Include steps to reproduce the issue, proof-of-concept code, affected versions, and potential impact.

### Response Timeline
- **Initial Acknowledgement:** Within 24-48 hours.
- **Triage & Assessment:** Within 3-5 business days.
- **Fix & Advisory:** A patch release will be published to npm promptly once verified, followed by an advisory.

Please **do not** open public GitHub issues or discussions for active vulnerabilities until a patch has been coordinated.

---

## Supply Chain Security Commitments

- **Zero Runtime Dependencies:** `fmds-responsive` maintains zero production runtime dependencies to eliminate third-party supply chain attack surfaces.
- **No Install Scripts:** We never use `preinstall`, `postinstall`, or lifecycle scripts that execute arbitrary code.
- **Signed Provenance:** Releases published via GitHub Actions include cryptographically verified SLSA provenance attestations.
- **Minimal Package Footprint:** Every release is strictly trimmed to include only verified library files (`src`, `bin`, `README.md`, `LICENSE`).
