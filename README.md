
# TestMu SDET-1 Assessment

A Playwright and TypeScript test automation project covering Login, Dashboard, and REST API scenarios, with an LLM-assisted test failure explanation feature.

## Project Status

- Playwright UI and API tests have been executed locally.
- The Failure Explainer reporter detects failed tests and attempts a real OpenAI API request.
- The live LLM response is not verified because the API returned HTTP 429: no credits remaining.
- Login and Dashboard tests use local fixtures. API tests use a local mock HTTP server; they do not validate a production application.

## Technology Stack

- Node.js
- TypeScript
- Playwright Test
- OpenAI JavaScript SDK
- dotenv

## Project Structure

```text
testmu-sdet1-kunaljoshi/
├── .github/
├── src/
│   ├── ai/
│   │   ├── check-openai.cjs
│   │   └── failure-explainer.ts
│   └── reporting/
│       └── failure-reporter.ts
├── tests/
│   ├── api/
│   │   └── api.spec.ts
│   ├── ui/
│   │   ├── login.spec.ts
│   │   └── dashboard.spec.ts
│   └── baseline.spec.ts
├── reports/
├── prompts.md
├── ai-usage-log.md
├── playwright.config.ts
├── package.json
└── .env.example
```

## Prerequisites

Install Node.js and npm. Then open a terminal in the project directory.

## Installation

```bash
npm install
npx playwright install
```

## Run Tests

Run all tests:

```bash
npx playwright test
```

Run Chromium tests:

```bash
npx playwright test --project=chromium
```

Run the API tests:

```bash
npx playwright test tests/api/api.spec.ts --project=chromium
```

Run the Login tests:

```bash
npx playwright test tests/ui/login.spec.ts --project=chromium
```

Run the Dashboard tests:

```bash
npx playwright test tests/ui/dashboard.spec.ts --project=chromium
```

Open the HTML report:

```bash
npx playwright show-report
```

## LLM Failure Explainer

The custom Playwright reporter collects failed test titles and error messages. It calls the `explainFailure` function, prints any returned explanation, and writes the result to:

`reports/failure-explanations.json`

### Configure the API key

Create a local `.env` file in the project root:

```text
OPENAI_API_KEY=your_api_key_here
```

Never commit `.env` or expose API keys in source code, logs, or screenshots. The `.gitignore` file excludes local environment files.

### Current limitation

A real API request was attempted, but OpenAI returned HTTP 429 because no API credits remained. Therefore, a successful LLM explanation has not yet been verified. The reporter records the API error rather than generating a fabricated explanation.

## Test Case Documentation

See `prompts.md` for the prompts, illustrative test cases, assumptions, and limitations for Login, Dashboard, and REST API modules.

## AI Usage

See `ai-usage-log.md` for the AI tools used, assistance provided, implementation status, and verification evidence.

## Known Limitations and Next Steps

1. Test against a real application when its URL and test credentials are available.
2. Replace local fixtures and the mock API with application-specific test environments where appropriate.
3. Configure API credits and verify a successful live LLM response.
4. Verify the generated explanation in the Playwright reporting workflow.
5. Review the full test suite across Chromium, Firefox, and WebKit.
6. Review the repository and publish it to GitHub.
