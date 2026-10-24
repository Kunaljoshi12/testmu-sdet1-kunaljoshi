# TestMu SDET-1 Assessment

A TypeScript and Playwright test automation project demonstrating UI testing, REST API testing, prompt engineering for test-case generation, and an attempted LLM-powered Failure Explainer.

**GitHub Repository:** https://github.com/Kunaljoshi12/testmu-sdet1-kunaljoshi

## Project Status

This project was created for the TestMu SDET-1 AI-Native Quality Engineering Challenge.

It contains executable Playwright tests, documented test cases and prompts, an OpenAI integration implementation, a custom test reporter, GitHub Actions configuration, and an AI usage log.

### Verification Summary

- **Chromium:** 23 tests passed in the latest verified local run.
- **Test discovery:** 69 tests discovered across Chromium, Firefox, and WebKit.
- **API tests:** 10 tests passed against a local mock HTTP server.
- **UI tests:** Login and Dashboard scenarios use controlled local fixtures.
- **Baseline tests:** 2 tests passed in Chromium.
- **LLM integration:** A real OpenAI API request was attempted but returned HTTP 429 because no API credits remained.
- **LLM response:** A successful live LLM-generated explanation has not been verified.
- **Public repository:** Published on GitHub.

The 69 discovered tests represent test cases across three browser projects. They should not be interpreted as 69 passing tests. The verified passing result is 23 tests in Chromium.

The passing tests demonstrate the implemented fixture-based UI scenarios and mock-server API scenarios. They do not establish that the tests have been validated against a production application.

## Assessment Tasks

### Task 1 — Setup and Scaffold

The project uses TypeScript and Playwright Test, with separate directories for UI tests, API tests, AI integration, and reporting.

Completed:
- Created the project structure.
- Configured Playwright and npm scripts.
- Added a GitHub Actions workflow.
- Created the initial Git commit with a message mentioning ChatGPT assistance.
- Published the repository publicly.

### Task 2 — Prompt Engineering and Test Case Generation

The file `prompts.md` documents prompts, generated test cases, prompt refinement notes, assumptions, and limitations for the Login, Dashboard, and REST API modules.

#### Login

The implemented scenarios cover:
- Valid login
- Invalid credentials
- Forgot-password confirmation
- Repeated login failures and fixture lockout
- Required-field validation

**Remaining coverage:** Session expiry still needs to be implemented and verified.

#### Dashboard

The implemented scenarios cover:
- Widget loading
- Data accuracy against fixture data
- Sorting and filtering
- Permission-based visibility
- Mobile viewport rendering

#### REST API

The implemented scenarios cover:
- Authentication token validation
- Create, read, update, and delete operations
- Invalid input and not-found responses
- Rate limiting
- HTTP 500 server-error handling
- Response schema validation

The latest API tests include:
- **API-009:** Verifies the HTTP 500 status and error response payload.
- **API-010:** Verifies that the records response contains the expected fields and data types.

Both tests passed in the local mock API test run.

#### Coverage Limitations

Not every scenario documented in `prompts.md` has been implemented as an executable test.

The Login and Dashboard tests use controlled local fixtures. The API tests use a local mock HTTP server rather than a production API.

These tests verify the implemented test logic and expected mock responses, not the behavior of a real application or external production API.

### Task 3 — LLM Failure Explainer

The project implements an LLM-powered Failure Explainer using the OpenAI JavaScript SDK.

#### Intended Workflow

1. Playwright executes the test suite.
2. The custom reporter identifies failed or timed-out tests.
3. The reporter collects the test title and error message.
4. The failure details are passed to the `explainFailure` function.
5. The function attempts a real OpenAI API request.
6. When a response is available, the reporter prints the explanation and writes the result to a JSON file.

#### Implementation Files

- `src/ai/failure-explainer.ts` — Sends failure details to the OpenAI API and processes the response.
- `src/ai/check-openai.cjs` — Provides a separate API connectivity check.
- `src/reporting/failure-reporter.ts` — Collects failed tests and attempts to generate explanations.

#### Current Verification Status

A real OpenAI API request was attempted, but the API returned HTTP 429 because no API credits remained.

Therefore:
- A successful live LLM-generated explanation has not been verified.
- No fabricated response is presented as actual LLM output.
- The reporter records an error when an explanation cannot be generated.
- The reporter writes to `reports/failure-explanations.json` when failures are analyzed.
- Attaching the LLM explanation directly to an individual test in the Playwright HTML report has not been implemented and verified as a completed requirement.

When no tests fail, the reporter prints:

`Failure Explainer: no failed tests to analyze.`

This is the expected message for a run with no failed tests; it is not itself a test failure.

The implementation is present, but successful live-response verification and report attachment remain outstanding.

**Design choice:** The Failure Explainer was selected to provide understandable failure explanations and suggested fixes. Its usefulness depends on successful API access and verified integration with the test-reporting workflow.

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

Install Playwright browsers:

```bash
npx playwright install
```

On Linux CI runners, browser system dependencies may also be required. The included GitHub Actions workflow uses `npx playwright install --with-deps`.

## Running the Tests

Run the complete test suite across configured browser projects:

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

Open Playwright UI mode:

```bash
npm run test:ui
```

Run the API tests in Chromium:

```bash
npx playwright test tests/api/api.spec.ts --project=chromium --reporter=list
```

Run the Login tests in Chromium:

```bash
npx playwright test tests/ui/login.spec.ts --project=chromium
```

Run the Dashboard tests in Chromium:

```bash
npx playwright test tests/ui/dashboard.spec.ts --project=chromium
```

List discovered tests:

```bash
npx playwright test --list --reporter=list
```

Open the HTML report:

```bash
npm run report
```

The latest verified Chromium run completed with 23 passing tests in approximately 3.8 seconds. Results can vary with environment and code changes.

## Configuring the OpenAI API

The Failure Explainer requires API access to generate a live explanation.

1. Create a local `.env` file in the project root.
2. Add your API key locally:

```dotenv
OPENAI_API_KEY=your_openai_api_key_here
```

3. Replace the placeholder locally with your own valid API key if you have API access and available credits.

**Security requirements:**
- Never commit `.env`.
- Never hardcode API keys in source code.
- Never publish secrets in logs, screenshots, or documentation.
- Keep `.env.example` limited to a placeholder.
- Configure GitHub Actions secrets if a workflow requires authenticated API access.

A ChatGPT subscription does not automatically provide OpenAI API credits. The live Failure Explainer cannot be fully verified until a real API request succeeds.

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

The actual workflow result must be verified in GitHub Actions after changes are pushed.

Because the custom reporter attempts an OpenAI request when tests fail, a failed test may produce an API error if valid API access or credits are unavailable. The test result and the availability of the LLM explanation should be evaluated separately.

## AI Usage Documentation

The file `ai-usage-log.md` records the AI tools used, their purpose, the assistance provided, and verification evidence.

The file `prompts.md` contains the documented prompts and test cases for the three assessment modules.

AI-generated suggestions and code should be reviewed and verified before being used in a real testing environment.

## Known Limitations and Next Steps

1. Implement and verify Login session-expiry coverage.
2. Run UI tests against a real application when an appropriate test environment and test credentials are available.
3. Restore API access and verify a successful live LLM response.
4. Implement and verify attachment of the LLM explanation to the Playwright HTML test report.
5. Run and review the complete test suite across Chromium, Firefox, and WebKit.
6. Review GitHub Actions results and ensure the documented commands work from a clean clone.
7. Expand failure-analysis context with safe, relevant page state or API response details when available.
8. Confirm that `prompts.md` contains the exact prompts used and that all assessment documentation matches the implemented tests.

## Assessment Transparency

This repository demonstrates the project structure, executable fixture-based UI tests, mock-server API tests, prompt documentation, a custom reporter, and an attempted real LLM integration.

The latest verified local Chromium run passed all 23 tests. Playwright discovered 69 tests across the three configured browser projects, but that discovery result is not evidence that all 69 tests have passed.

The project status and limitations are documented explicitly. A successful live LLM response and its inclusion in the test report remain outstanding verification items.
