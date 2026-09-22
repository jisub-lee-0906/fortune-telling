# Security

## Reporting

Report suspected vulnerabilities privately to the repository owner. Do not include live API keys, tokens, personal data, or exploit traffic in public issues.

## Deployment boundary

Source publication does not deploy an internet service. Production operators must keep `INTERPRET_ENABLED=false` unless Gemini use is intentionally enabled, set a long random `INTERPRET_SERVER_TOKEN`, and keep both that token and `GEMINI_API_KEY` server-only. The browser calls the same-origin Next.js route; neither secret may use a `NEXT_PUBLIC_` variable.

The backend enforces a bounded per-process interpretation rate and concurrency. Multi-replica deployments should add a shared gateway quota and provider billing cap.
