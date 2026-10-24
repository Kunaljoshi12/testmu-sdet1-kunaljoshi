# TestMu SDET-1 Assessment

A TypeScript and Playwright test automation project demonstrating UI testing, REST API testing, prompt engineering for test-case generation, and an attempted LLM-powered Failure Explainer.

**GitHub Repository:** https://github.com/Kunaljoshi12/testmu-sdet1-kunaljoshi

## Project Status

This project was created for the TestMu SDET-1 AI-Native Quality Engineering Challenge.

The project contains executable Playwright tests, documented test cases and prompts, an LLM integration implementation, a custom test reporter, GitHub Actions configuration, and an AI usage log.

### Verification Summary

- **Chromium tests:** 21 passed in the verified local run.
- **UI tests:** Login and Dashboard tests use controlled local fixtures.
- **API tests:** Use a local mock HTTP server.
- **LLM integration:** A real OpenAI API request was attempted.
- **LLM response:** Not successfully verified because the API returned HTTP 429 due to no remaining API credits.
- **Public repository:** Published on GitHub.

The passing tests demonstrate the implemented fixture and mock-server scenarios. They do not establish that the tests have been validated against a production application.

## Assessment Tasks

### Task 1 — Setup and Scaffold

The project uses TypeScript and Playwright Test with separate directories for UI tests, API tests, AI integration, and reporting.

Completed:
- Created the project structure.
- Configured Playwright and npm scripts.
- Added a GitHub Actions workflow.
- Created the initial Git commit with a message mentioning ChatGPT assistance.
- Published the repository publicly.

### Task 2 — Prompt Engineering and Test Case Generation

The file `prompts.md` documents prompts, generated test cases, prompt refinement notes, assumptions, and limitations for the Login, Dashboard, and REST API modules.

The test cases cover the following areas:

**Login**
- Valid login
- Invalid credentials
- Forgot password
- Repeated login failures and fixture lockout
- Required-field validation

**Dashboard**
- Widget loading
- Data accuracy against fixture data
- Sorting and filtering
- Permission-based visibility
- Mobile viewport rendering

**REST API**
- Authentication token validation
- Create, read, update, and delete operations
- Invalid input and not-found responses
- Rate limiting

**Coverage limitations**

Not every scenario documented in `prompts.md` has been implemented as an executable test. Session expiry, dedicated server-error handling for HTTP 5xx responses, and schema validation remain areas for further implementation and verification.

The Login and Dashboard tests use controlled fixtures. The API tests use a local mock server rather than a production application.

## Task 3 — LLM Failure Explainer

The project implements an LLM-powered Failure Explainer using the OpenAI JavaScript SDK.

### Intended workflow

1. Playwright executes the test suite.
2. The custom reporter identifies failed or timed-out tests.
3. The reporter collects the test title and error message.
4. The failure details are passed to the `explainFailure` function.
5. The function attempts a real OpenAI API request.
6. When a response is returned, the reporter prints the explanation and writes the result to a JSON file.

### Implementation files

- `src/ai/failure-explainer.ts` — Sends failure details to the OpenAI API and processes the response.
- `src/ai/check-openai.cjs` — A separate script for checking API connectivity.
- `src/reporting/failure-reporter.ts` — Collects failures and attempts to generate explanations.

### Current verification status

A real API request was attempted during testing, but the OpenAI API returned HTTP 429 because no API credits remained.

Therefore:
- A successful live LLM-generated explanation has not been verified.
- No fabricated response is presented as actual LLM output.
- The reporter records the API error when an explanation cannot be generated.
- The reporter writes to `reports/failure-explanations.json` when failures are analyzed.
- Attachment of the LLM explanation directly to the Playwright HTML test report has not been verified.

The implementation is present, but the successful live-response requirement remains outstanding.

## Technology Stack

- Node.js
- TypeScript
- Playwright Test
- OpenAI JavaScript SDK
- dotenv
- Git and GitHub
- GitHub Actions

## Project Structure

```text
testmu-sdet1-kunaljoshi/
├── .github/
│   └── workflows/
│       └── playwright.yml
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
│   │   ├── dashboard.spec.ts
│   │   └── login.spec.ts
│   └── baseline.spec.ts
├── prompts.md
├── ai-usage-log.md
├── playwright.config.ts
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

Generated reports and local environment files are excluded from version control.

## Prerequisites

Install:
- Node.js with npm
- Git, if you want to clone the repository

## Installation

Clone the repository and enter the project directory:

```bash
git clone https://github.com/Kunaljoshi12/testmu-sdet1-kunaljoshi.git
cd testmu-sdet1-kunaljoshi
```

Install dependencies:

```bash
npm ci
```

Install the Playwright browsers:

```bash
npx playwright install
```

On Linux CI runners, browser system dependencies may also be required. The included GitHub Actions workflow installs them with `npx playwright install --with-deps`.

## Running the Tests

Run the complete Playwright test suite:

```bash
npm test
```

Run the Chromium project:

```bash
npm run test:chromium
```

Run tests in headed mode:

```bash
npm run test:headed
```

Open the Playwright UI:

```bash
npm run test:ui
```

Run the API tests in Chromium:

```bash
npx playwright test tests/api/api.spec.ts --project=chromium
```

Run the Login tests in Chromium:

```bash
npx playwright test tests/ui/login.spec.ts --project=chromium
```

Run the Dashboard tests in Chromium:

```bash
npx playwright test tests/ui/dashboard.spec.ts --project=chromium
```

Open the HTML report:

```bash
npm run report
```

The verified local Chromium run completed with 21 passing tests. Test results can vary with environment and code changes.

## Configuring the OpenAI API

The Failure Explainer requires API access to generate a live explanation.

1. Create a local `.env` file in the project root.
2. Add your own API key:

```dotenv
OPENAI_API_KEY=your_openai_api_key_here
```

3. Replace the placeholder locally with your own valid API key if you have API access.

**Security requirements:**
- Never commit `.env`.
- Never hardcode API keys in source code.
- Never publish secrets in logs, screenshots, or documentation.
- Keep `.env.example` limited to a placeholder.
- Configure GitHub Actions secrets if a workflow later needs authenticated API access.

A ChatGPT subscription does not automatically provide OpenAI API credits. The live Failure Explainer cannot be fully verified until a valid API request succeeds.

## GitHub Actions

The workflow is located at:

`.github/workflows/playwright.yml`

It is configured to:
- Run on pushes to `main` or `master`.
- Run on pull requests targeting `main` or `master`.
- Install Node.js dependencies.
- Install Playwright browsers and system dependencies.
- Execute the Playwright test suite.
- Upload the Playwright HTML report as an artifact when available.

Because the custom reporter attempts an OpenAI request when tests fail, a failed test may produce an API error if the required API access or credits are unavailable. CI execution should be checked in GitHub Actions after changes are pushed.

## AI Usage Documentation

The file `ai-usage-log.md` records the AI tools used, their purpose, the assistance provided, and the verification evidence.

The file `prompts.md` contains the documented prompts and test cases for the three assessment modules.

AI-generated suggestions and code should be reviewed and verified before being used in a real testing environment.

## Known Limitations and Next Steps

1. Implement and verify the remaining documented scenarios, including session expiry, dedicated HTTP 5xx handling, and schema validation.
2. Run UI tests against a real application when an appropriate test environment and test credentials are available.
3. Restore API access and verify a successful live LLM response.
4. Verify how the LLM explanation is attached to test results and reporting artifacts.
5. Run and review the complete test suite across Chromium, Firefox, and WebKit.
6. Review GitHub Actions results and ensure the documented commands work from a clean clone.
7. Expand failure-analysis context with safe, relevant page state or API response details when available.

## Assessment Transparency

This repository demonstrates the project structure, executable fixture-based UI tests, mock-server API tests, prompt documentation, and an attempted real LLM integration.

The project status and limitations are documented explicitly. A successful live LLM response and its inclusion in the test report remain outstanding verification items.
