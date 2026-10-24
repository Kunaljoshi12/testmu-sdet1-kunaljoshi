
# AI Usage Log

## AI Tools Used

- **Tool:** ChatGPT
- **Purpose:** Project planning, Playwright setup guidance, test-case drafting, TypeScript implementation guidance, debugging, and documentation.
- **Human review:** Commands and code were reviewed and executed locally. Results below reflect observed terminal output.

## Task 1 — Project Setup

- **AI assistance:** Guidance for creating a Playwright and TypeScript project, npm scripts, Git initialization, and `.gitignore`.
- **Output:** Project structure, Playwright configuration, and dependency setup.
- **Verification:** The Chromium suite previously passed 21 tests.
- **Status:** Core setup verified.

## Task 2 — Test Case Generation

- **AI assistance:** Drafted test cases and prompts for Login, Dashboard, and REST API modules.
- **Output:** `prompts.md`, containing prompts, illustrative test cases, assumptions, and limitations.
- **Human review:** Reviewed the generated test cases and retained explicit limitations where real application specifications were unavailable.
- **Verification:** Local Login, Dashboard, and API tests were run. These use fixtures and a local mock API rather than a production application.
- **Status:** Documentation drafted; application-specific validation remains outstanding.

## Task 3 — LLM Failure Explainer

- **AI assistance:** Guidance for implementing an OpenAI API client and a custom Playwright reporter.
- **Output:**
  - `src/ai/failure-explainer.ts`
  - `src/ai/check-openai.cjs`
  - `src/reporting/failure-reporter.ts`
  - JSON output at `reports/failure-explanations.json`
- **Verification evidence:**
  - The reporter ran when the Chromium tests passed and reported that there were no failed tests to analyze.
  - A temporary intentional-failure test triggered the reporter.
  - The reporter attempted a real OpenAI API request.
  - The request returned HTTP 429 with a no-credits-remaining error.
  - The reporter recorded the failure explanation as unavailable and wrote the JSON output file.
- **Status:** Reporter execution and API request attempt verified. A successful live LLM explanation is not verified because API credits were unavailable.
- **Next step:** Restore API access and run the controlled failure test again to verify a genuine LLM response.

## Security and Limitations

- API credentials are stored in the local `.env` file and must not be committed.
- `.gitignore` excludes `.env`.
- Never add API keys, passwords, cookies, access tokens, or other secrets to prompts or reports.
- Login and Dashboard tests use local fixtures.
- API tests use a local mock HTTP server.
- The test cases are examples and have not been validated against a real production application's requirements.
- A successful live LLM response has not yet been captured.
- AI-generated code and test cases require human review.

## Honest Reporting

Only claim successful verification when supported by an observed test run or API response. Keep blocked, untested, and simulated behavior clearly identified.
