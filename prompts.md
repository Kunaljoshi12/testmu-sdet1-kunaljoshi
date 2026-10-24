
# LLM Prompts and Generated Test Cases

## Module 1: Login

### Prompt

Act as a senior SDET. Generate practical test cases for a web application's Login module. Cover:

1. Successful login with valid credentials.
2. Login failure with invalid credentials.
3. Forgot password flow.
4. Session expiry and re-authentication.
5. Account lockout or rate limiting after repeated failed login attempts.

For each test case, provide a unique ID, title, preconditions, test data, steps, expected result, and positive or negative classification. Use clear, executable language. Do not assume application-specific URLs, selectors, credentials, or security policies that have not been provided. Mark missing application details as assumptions.

### Generated Test Cases

#### LOGIN-001: Successful login with valid credentials
- **Preconditions:** A registered user exists and the login page is accessible.
- **Test Data:** Valid username and password supplied by the test environment.
- **Steps:**
  1. Open the login page.
  2. Enter valid credentials.
  3. Click the Login button.
- **Expected Result:** The user is authenticated and redirected to the authorized landing page.
- **Classification:** Positive

#### LOGIN-002: Login with an incorrect password
- **Preconditions:** A registered user exists.
- **Test Data:** Valid username and incorrect password.
- **Steps:**
  1. Open the login page.
  2. Enter the username and incorrect password.
  3. Click Login.
- **Expected Result:** Login is rejected and an appropriate error message is displayed. Protected content remains inaccessible.
- **Classification:** Negative

#### LOGIN-003: Forgot password request
- **Preconditions:** The forgot-password feature is available.
- **Test Data:** Registered email address.
- **Steps:**
  1. Open the login page.
  2. Select Forgot Password.
  3. Enter the registered email address.
  4. Submit the request.
- **Expected Result:** The application displays the configured confirmation message and follows the approved password-reset process.
- **Classification:** Positive

#### LOGIN-004: Session expiry and re-authentication
- **Preconditions:** A user can log in and the application has a defined session-expiry policy.
- **Test Data:** Valid credentials and an expired session.
- **Steps:**
  1. Log in successfully.
  2. Allow the session to expire or invalidate it using the test environment.
  3. Attempt to access a protected page.
- **Expected Result:** The application prevents unauthorized access and requests re-authentication according to its session policy.
- **Classification:** Negative

#### LOGIN-005: Repeated failed login attempts
- **Preconditions:** The account lockout or rate-limiting policy is documented.
- **Test Data:** Valid username and repeated incorrect passwords.
- **Steps:**
  1. Open the login page.
  2. Submit an incorrect password repeatedly within the configured threshold.
  3. Attempt another login.
- **Expected Result:** The configured lockout or rate-limiting behavior is enforced without exposing sensitive account information.
- **Classification:** Negative

### Prompt Refinement Notes

- **Initial limitation:** The application URL, login selectors, credentials, session timeout, and lockout threshold were not supplied.
- **Refinement:** The prompt was constrained to use placeholders and identify missing application-specific details instead of inventing values.
- **Improvement:** The test cases now include explicit preconditions, test data, steps, expected results, and classifications.
- **Remaining limitation:** Forgot-password delivery, real session expiry, and account lockout require a real application or dedicated test fixtures to verify end to end.

---

## Module 2: Dashboard

### Prompt

Act as a senior SDET. Generate practical test cases for a web application's Dashboard module. Cover:

1. Dashboard widgets loading successfully.
2. Accuracy of displayed data against a trusted source.
3. Filter and sort behavior.
4. Responsive layout at desktop, tablet, and mobile viewports.
5. Visibility of widgets and data based on user permissions.

For each test case, provide a unique ID, title, preconditions, test data, steps, expected result, and positive or negative classification. Use clear, executable language. Do not invent application-specific selectors, data, permissions, or expected values. Identify assumptions and missing test fixtures.

### Generated Test Cases

#### DASH-001: Dashboard widgets load
- **Preconditions:** The user is authenticated and dashboard data is available.
- **Test Data:** A valid user session.
- **Steps:**
  1. Open the Dashboard.
  2. Wait for the widgets to finish loading.
  3. Check the expected widgets.
- **Expected Result:** All configured widgets load without unexpected errors.
- **Classification:** Positive

#### DASH-002: Dashboard data accuracy
- **Preconditions:** A trusted source of expected values is available.
- **Test Data:** Known reference values for the dashboard widgets.
- **Steps:**
  1. Open the Dashboard.
  2. Record the displayed values.
  3. Compare them with the trusted reference data.
- **Expected Result:** Displayed values match the reference data according to the application's defined formatting and rounding rules.
- **Classification:** Positive

#### DASH-003: Sort records in ascending order
- **Preconditions:** The dashboard contains sortable records.
- **Test Data:** Records with distinct values in the selected column.
- **Steps:**
  1. Open the Dashboard.
  2. Select a sortable column.
  3. Choose ascending order.
  4. Inspect the resulting records.
- **Expected Result:** Records appear in ascending order according to the selected field.
- **Classification:** Positive

#### DASH-004: Filter dashboard records
- **Preconditions:** The dashboard supports filtering.
- **Test Data:** A filter value that matches a known subset of records.
- **Steps:**
  1. Open the Dashboard.
  2. Apply the selected filter.
  3. Review the returned records.
- **Expected Result:** Only records matching the filter are displayed.
- **Classification:** Positive

#### DASH-005: Dashboard responsive layout
- **Preconditions:** The dashboard supports desktop, tablet, and mobile layouts.
- **Test Data:** Viewports of 1440 × 900, 768 × 1024, and 390 × 844 pixels.
- **Steps:**
  1. Open the Dashboard at the desktop viewport.
  2. Inspect widget visibility and alignment.
  3. Repeat at tablet and mobile viewports.
- **Expected Result:** Supported widgets remain usable, content is readable, and unintended horizontal overflow is absent.
- **Classification:** Positive

#### DASH-006: Permission-based widget visibility
- **Preconditions:** Two test accounts with different documented permissions are available.
- **Test Data:** Authorized and restricted test accounts.
- **Steps:**
  1. Log in with the authorized account.
  2. Record the visible widgets and data.
  3. Log in with the restricted account.
  4. Compare the available widgets and access permissions.
- **Expected Result:** Each account sees only the widgets and data permitted by its assigned role.
- **Classification:** Positive

### Prompt Refinement Notes

- **Initial limitation:** No actual dashboard URL, widget definitions, trusted data source, or role-permission matrix was supplied.
- **Refinement:** The prompt explicitly prohibits invented values and requires assumptions and missing fixtures to be identified.
- **Improvement:** The test cases cover loading, data accuracy, sorting, filtering, responsive layouts, and permission-based visibility.
- **Remaining limitation:** Data accuracy and authorization behavior require real reference data and configured test accounts. The current local dashboard fixture does not prove production behavior.

---

## Module 3: REST API

### Prompt

Act as a senior API test engineer. Generate practical REST API test cases covering:

1. Authentication token validation.
2. Create, read, update, and delete operations.
3. Appropriate 4xx and 5xx error handling.
4. Rate limiting.
5. Response schema validation.

For each test case, provide a unique ID, title, HTTP method and endpoint placeholder, preconditions, request data, expected status code, expected response assertions, and positive or negative classification. Do not invent real endpoints, schemas, tokens, rate limits, or business rules. Mark missing API specifications as assumptions.

### Generated Test Cases

**Assumptions for these examples:** The current Playwright suite uses a local mock API with `/records`, `/records/{id}`, and `/limited` routes. The mock uses a test-only bearer token, record fields `id` and `name`, and a rate limit that returns HTTP 429 after three accepted requests. These are fixture-specific values, not a real API contract.

#### API-001: Read records with a valid token
- **Endpoint:** `GET /records`
- **Preconditions:** The local mock API is running.
- **Test Data:** `Authorization: Bearer valid-test-token`
- **Steps:**
  1. Send a GET request to `/records` with the valid token.
  2. Inspect the status and response body.
- **Expected Result:** HTTP 200; the response contains the expected record list.
- **Classification:** Positive

#### API-002: Reject a missing authentication token
- **Endpoint:** `GET /records`
- **Preconditions:** The local mock API is running.
- **Test Data:** No Authorization header.
- **Steps:**
  1. Send a GET request to `/records` without a token.
  2. Inspect the response.
- **Expected Result:** HTTP 401 with an unauthorized error response.
- **Classification:** Negative

#### API-003: Create a record
- **Endpoint:** `POST /records`
- **Preconditions:** The local mock API is running.
- **Test Data:** Valid token and JSON body `{"name":"Beta"}`.
- **Steps:**
  1. Send a POST request with the valid token and request body.
  2. Inspect the status and response body.
- **Expected Result:** HTTP 201 with a record containing a generated ID and the submitted name.
- **Classification:** Positive

#### API-004: Reject an invalid record
- **Endpoint:** `POST /records`
- **Preconditions:** The local mock API is running.
- **Test Data:** Valid token and JSON body `{"name":""}`.
- **Steps:**
  1. Send a POST request with an empty name.
  2. Inspect the response.
- **Expected Result:** HTTP 400 with an invalid-name error.
- **Classification:** Negative

#### API-005: Return 404 for an unknown record
- **Endpoint:** `GET /records/999`
- **Preconditions:** Record 999 does not exist.
- **Test Data:** Valid token.
- **Steps:**
  1. Send a GET request for record 999.
  2. Inspect the response.
- **Expected Result:** HTTP 404 with a not-found error.
- **Classification:** Negative

#### API-006: Enforce rate limiting
- **Endpoint:** `GET /limited`
- **Preconditions:** The mock rate-limit behavior is enabled.
- **Test Data:** Four consecutive requests with the valid token.
- **Steps:**
  1. Send three requests and inspect their responses.
  2. Send a fourth request.
  3. Inspect the fourth response.
- **Expected Result:** The first three requests return HTTP 200 and the fourth returns HTTP 429.
- **Classification:** Negative

#### API-007: Update an existing record
- **Endpoint:** `PUT /records/1`
- **Preconditions:** Record 1 exists.
- **Test Data:** Valid token and JSON body `{"name":"Updated Alpha"}`.
- **Steps:**
  1. Send a PUT request with the updated name.
  2. Inspect the status and response body.
- **Expected Result:** HTTP 200 and the updated record is returned.
- **Classification:** Positive

#### API-008: Delete an existing record
- **Endpoint:** `DELETE /records/1`
- **Preconditions:** Record 1 exists.
- **Test Data:** Valid token.
- **Steps:**
  1. Send a DELETE request for record 1.
  2. Verify the response status.
  3. Send a GET request for the same record.
- **Expected Result:** DELETE returns HTTP 204 and the subsequent GET returns HTTP 404.
- **Classification:** Positive

#### API-009: Validate response schema
- **Endpoint:** `GET /records`
- **Preconditions:** The local mock API is running and returns its expected record structure.
- **Test Data:** Valid token.
- **Steps:**
  1. Send a GET request to `/records`.
  2. Verify the response is an array.
  3. Verify each record has a numeric `id` and string `name`.
- **Expected Result:** The response conforms to the expected fixture schema.
- **Classification:** Positive

#### API-010: Handle an internal server error
- **Endpoint:** `GET <documented-error-test-endpoint>`
- **Preconditions:** A test environment or mock route can deliberately return a server error.
- **Test Data:** Valid authentication and a controlled server-error response.
- **Steps:**
  1. Trigger the documented server-error scenario.
  2. Inspect the HTTP status and error response.
- **Expected Result:** HTTP 500 is handled according to the documented API error contract without exposing sensitive internal details.
- **Classification:** Negative

### Prompt Refinement Notes

- **Initial limitation:** No real API specification, base URL, authentication contract, response schema, or production rate limit was provided.
- **Refinement:** The prompt requires endpoint placeholders and explicit assumptions instead of invented production details.
- **Improvement:** The examples now cover authentication, CRUD operations, 4xx errors, rate limiting, and response schema validation.
- **Remaining limitation:** API-010 requires a dedicated server-error route or test environment. The current mock suite does not implement that route, so API-010 is documented but not yet automated.

---

## Review and Limitations

- These test cases are documentation examples generated for the assessment and should be reviewed before being treated as application requirements.
- Login and Dashboard tests currently use local fixtures rather than a real application.
- REST API tests use a local mock HTTP server rather than a production API.
- Documented test cases are not automatically equivalent to executed automated tests.
- Prompt refinement notes describe the constraints addressed in the prompts; they do not claim a measured comparison of multiple LLM generations.
- The current LLM API connection previously returned a no-credits error. A successful live LLM response remains unverified until the API request succeeds.
