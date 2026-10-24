# TestMu SDET-1 Assessment

A TypeScript and Playwright test automation project demonstrating UI testing, REST API testing, AI-assisted test-case generation, prompt engineering, and an attempted LLM-powered Failure Explainer.

**GitHub Repository:** https://github.com/Kunaljoshi12/testmu-sdet1-kunaljoshi

## Project Overview

This project was created for the TestMu SDET-1 AI-Native Quality Engineering Challenge.

It includes:
- Playwright UI tests for Login and Dashboard scenarios.
- REST API tests using a local mock HTTP server.
- Prompt documentation and generated test cases.
- An OpenAI SDK integration for failure explanations.
- A custom Playwright reporter.
- GitHub Actions workflow configuration.
- An AI usage log.
- Test execution and verification documentation.

## Project Status

The project contains implemented and locally verified test automation components. Some assessment requirements remain incomplete or require additional verification.

### Latest Verification Summary

| Item | Current result |
|---|---|
| Chromium test suite | 23 tests passed in the latest recorded local run |
| API tests | 10 passed against a local mock HTTP server |
| Dashboard tests | 6 included in the verified Chromium run |
| Login tests | 5 included in the verified Chromium run |
| Baseline tests | 2 included in the verified Chromium run |
| Test discovery | 69 tests discovered across Chromium, Firefox, and WebKit |
| Live OpenAI request | Attempted; returned HTTP 429 because no API credits remained |
| Successful live LLM explanation | Not verified |
| LLM explanation attached to HTML test results | Not completed / not verified |
| Public GitHub repository | Available |

The 69 discovered tests must not be interpreted as 69 passing tests. The verified result recorded for this project is 23 passing tests in Chromium.

The UI tests use controlled local fixtures, and the API tests use a local mock HTTP server. These results verify the implemented test logic against those fixtures and mock responses; they do not establish that the tests pass against a production application or external API.

## Assessment Completion Matrix

The following statuses distinguish implementation from verification.

| Assessment requirement | Status | Reason or evidence |
|---|---|---|
| Project structure and Playwright setup | Completed | TypeScript project, Playwright configuration, npm scripts, and separate test directories are present. |
| Public GitHub repository | Completed | Repository is publicly available. Verify the latest commit is pushed before submission. |
| Initial commit mentioning AI assistance | Completed | Initial commit message mentions ChatGPT assistance. |
| Login test coverage | Partially completed | Five scenarios are implemented; session-expiry coverage remains outstanding. |
| Dashboard test coverage | Implemented | Six scenarios cover widget loading, fixture data, sorting/filtering, permission visibility, and mobile viewport rendering. |
| REST API test coverage | Implemented | Ten tests cover authentication, CRUD, validation, rate limiting, server errors, and schema validation. |
| API-009: HTTP 500 response | Verified against mock API | The test checks the status and error response payload. |
| API-010: response schema validation | Verified against mock API | The test checks expected fields and data types. |
| Prompt engineering documentation | Needs final audit | `prompts.md` exists; exact prompt history and coverage against every required scenario need review. |
| AI usage log | Needs final audit | `ai-usage-log.md` exists; verify that all required tool usage and verification evidence are documented. |
| Failure Explainer implementation | Partially completed | OpenAI integration and custom reporter exist. |
| Successful live LLM response | Not completed | The API request returned HTTP 429 because no API credits remained. |
| LLM explanation attached to individual HTML test results | Not completed / not verified | The current implementation logs explanations and writes JSON; attachment to an individual Playwright test result has not been demonstrated. |
| Chromium test execution | Completed for latest recorded run | 23 tests passed locally. |
| Firefox and WebKit test execution | Not verified | Tests were discovered for these browser projects, but successful execution has not been established. |
| GitHub Actions execution | Needs verification | Check the actual workflow run in GitHub after pushing the latest changes. |
| Clean-clone verification | Not verified | Run the documented installation and test commands from a fresh checkout. |

## Assessment Task 1 — Setup and Scaffold

The project uses TypeScript and Playwright Test.

Completed setup work includes:
- Created the project structure.
- Configured Playwright and npm scripts.
- Added the GitHub Actions workflow.
- Created the initial commit with a message mentioning ChatGPT assistance.
- Published the repository publicly.

## Assessment Task 2 — Prompt Engineering and Test Case Generation

The file `prompts.md` documents prompts, generated test cases, prompt refinement notes, assumptions, and limitations for the Login, Dashboard, and REST API modules.

The prompt and test-case documentation should be checked against the assessment instructions before submission. In particular, verify that the documented prompts match the prompts actually used and that the required scenarios are covered.

### Login Scenarios

Implemented scenarios:
- Valid login.
- Invalid credentials.
- Forgot-password confirmation.
- Repeated login failures and fixture lockout.
- Required-field validation.

**Outstanding:** Implement and verify a session-expiry scenario. The test should establish an authenticated session, expire or invalidate it, and verify the expected redirect or authentication response.

### Dashboard Scenarios

Implemented scenarios:
- Widget loading.
- Data accuracy against fixture data.
- Sorting and filtering.
- Permission-based visibility.
- Mobile viewport rendering.

These tests use controlled local fixtures rather than a production dashboard.

### REST API Scenarios

Implemented scenarios:
- Authentication token validation.
- Create, read, update, and delete operations.
- Invalid input and not-found responses.
- Rate limiting.
- HTTP 500 server-error handling.
- Response schema validation.

The latest API tests include:

- **API-009:** Verifies the HTTP 500 status and error response payload.
- **API-010:** Verifies that the records response contains the expected fields and data types.

Both tests passed in the recorded local mock API test run.

### Coverage Limitations

Not every scenario documented in `prompts.md` has necessarily been implemented as an executable test.

The Login and Dashboard tests use controlled local fixtures. The API tests use a local mock HTTP server rather than a production API.

These tests validate the implemented logic and expected mock responses. They do not establish application-wide or production-system correctness.

## Assessment Task 3 — LLM Failure Explainer

The project implements a Failure Explainer using the OpenAI JavaScript SDK.

### Intended Workflow

1. Playwright executes the test suite.
2. The custom reporter identifies failed or timed-out tests.
3. The reporter collects the test title and error message.
4. The failure details are passed to the `explainFailure` function.
5. The function attempts a real OpenAI API request.
6. If a response is available, the reporter prints the explanation and writes the result to a JSON file.

### Implementation Files

- `src/ai/failure-explainer.ts` — Sends failure details to the OpenAI API and processes the response.
- `src/ai/check-openai.cjs` — Provides a separate API connectivity check.
- `src/reporting/failure-reporter.ts` — Collects failed tests and attempts to generate explanations.

### Current Verification Status

A real OpenAI API request was attempted, but it returned HTTP 429 because no API credits remained.

Consequently:
- Successful live LLM-generated output has not been verified.
- No fabricated response is presented as actual LLM output.
- The reporter records an error when an explanation cannot be generated.
- The reporter writes to `reports/failure-explanations.json` when failures are analyzed.
- Attaching the explanation directly to an individual test in the Playwright HTML report has not been implemented and verified as complete.

When no tests fail, the reporter prints:

`Failure Explainer: no failed tests to analyze.`

This is the expected message when there are no failures to analyze; it is not itself a test failure.

### Design Choice

The Failure Explainer was selected to make test failures easier to understand by providing plain-English explanations and suggested fixes. A Flaky Test Classifier was not selected for this implementation.

The integration remains partially completed until a successful live response is verified and the required test-report integration is demonstrated.

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
- Node.js with npm.
- Git, if cloning the repository.

## Installation

Clone the repository:

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

Run the complete suite across configured browser projects:

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

Run API tests in Chromium:

```bash
npx playwright test tests/api/api.spec.ts --project=chromium --reporter=list
```

Run Login tests in Chromium:

```bash
npx playwright test tests/ui/login.spec.ts --project=chromium
```

Run Dashboard tests in Chromium:

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

The latest recorded local Chromium run completed with 23 passing tests in approximately 3.8 seconds. Results can vary after code changes or in different environments.

## Configuring the OpenAI API

The Failure Explainer requires API access to generate a live explanation.

1. Create a local `.env` file in the project root.
2. Add your API key locally:

```dotenv
OPENAI_API_KEY=your_openai_api_key_here
```

3. Replace the placeholder locally with a valid API key only if you have API access and available credits.

### Security Requirements

- Never commit `.env`.
- Never hardcode API keys in source code.
- Never publish secrets in logs, screenshots, or documentation.
- Keep `.env.example` limited to a placeholder.
- Configure GitHub Actions secrets if a workflow requires authenticated API access.
- If a key has been exposed, revoke it and create a replacement before using the integration again.

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

The latest actual workflow result must be checked in GitHub Actions after changes are pushed. The presence of a workflow file does not prove that a workflow run succeeded.

Because the custom reporter attempts an OpenAI request when tests fail, a failed test may also produce an API error if valid API access or credits are unavailable. Evaluate the test result and LLM explanation availability separately.

## AI Usage Documentation

The repository includes:

- `prompts.md` — Documents prompts and test cases for Login, Dashboard, and REST API modules.
- `ai-usage-log.md` — Records AI tools used, their purpose, assistance provided, and verification evidence.

Before submission, confirm that these files satisfy the assessment requirements and accurately distinguish AI-generated suggestions from code and results that were executed and verified.

## Known Limitations and Next Steps

1. Implement and verify Login session-expiry coverage.
2. Run UI tests against a real application when a suitable test environment and test credentials are available.
3. Restore API access and verify a successful live LLM response if API credits become available.
4. Implement and verify attachment of LLM explanations to individual Playwright HTML test results.
5. Run and review the complete test suite across Chromium, Firefox, and WebKit.
6. Review GitHub Actions results.
7. Verify installation and test execution from a clean checkout.
8. Expand failure-analysis context with safe, relevant page-state or API-response details when available.
9. Audit `prompts.md` to confirm that it contains the exact prompts used and covers all required assessment scenarios.
10. Audit `ai-usage-log.md` against the assessment instructions.

## Assessment Transparency

This repository demonstrates project setup, fixture-based UI tests, mock-server API tests, prompt documentation, a custom reporter, and an attempted real LLM integration.

The latest recorded local Chromium run passed all 23 tests. Playwright discovered 69 tests across three configured browser projects, but that discovery result is not evidence that all 69 tests have passed.

A successful live LLM response, attachment of explanations to individual test results, session-expiry coverage, and complete cross-browser verification remain outstanding. The project should be described as partially completed until these requirements have been implemented and verified.
