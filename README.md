# AWS SAP-C02: decision trees

Study notes for the **AWS Certified Solutions Architect – Professional (SAP-C02)** exam, organized around the decisions the exam tests.

📖 **Site:** https://damienjacinto.github.io/aws-sap-c02/

## Layout

```
docs/
  index.md           home, key dates
  curriculum.md      day-by-day plan (lectures, trees, reading, labs, practice)
  decisions/         one page per exam decision (tree, reasoning, traps, self-test)
  keywords.md        question-stem phrases → likely answers
  mistakes.md        practice-exam mistakes, paraphrased
templates/
  decision.md        template for new decision pages
```

## Local preview

```bash
python -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

Pushing to `main` builds and deploys the site with GitHub Actions.

## Content rules

- Notes are written in my own words. No practice-exam questions are copied verbatim.
- No account IDs, ARNs with real IDs, or credentials.
