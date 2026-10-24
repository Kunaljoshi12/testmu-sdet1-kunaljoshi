
import { test, expect } from '@playwright/test';
import { createServer, type Server } from 'node:http';
import { type AddressInfo } from 'node:net';

test.describe('REST API module - local mock API', () => {
  test.describe.configure({ mode: 'serial' });

  let server: Server;
  let baseUrl = '';
  let records: Array<{ id: number; name: string }>;
  let nextId: number;
  let limitedRequests: number;

  test.beforeAll(async () => {
    server = createServer(async (req, res) => {
      const chunks: Buffer[] = [];

      for await (const chunk of req) {
        chunks.push(
          Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk),
        );
      }

      const bodyText = Buffer.concat(chunks).toString('utf8');
      let body: any = {};

      try {
        body = bodyText ? JSON.parse(bodyText) : {};
      } catch {
        res.writeHead(400, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'invalid_json' }));
        return;
      }

      const send = (status: number, data?: unknown) => {
        res.writeHead(status, {
          'Content-Type': 'application/json',
        });
        res.end(data === undefined ? '' : JSON.stringify(data));
      };

      const url = new URL(req.url ?? '/', 'http://127.0.0.1');
      const path = url.pathname;
      const method = req.method ?? 'GET';

      // Simulate an internal server error.
      if (path === '/server-error') {
        send(500, {
          error: 'internal_server_error',
          message: 'An unexpected server error occurred',
        });
        return;
      }

      // Simulate rate limiting.
      if (path === '/limited') {
        limitedRequests++;

        if (limitedRequests > 3) {
          send(429, { error: 'rate_limited' });
        } else {
          send(200, { message: 'request accepted' });
        }
        return;
      }

      // Validate the authorization token for regular endpoints.
      if (
        req.headers.authorization !== 'Bearer valid-test-token'
      ) {
        send(401, { error: 'unauthorized' });
        return;
      }

      // Read all records.
      if (path === '/records' && method === 'GET') {
        send(200, records);
        return;
      }

      // Create a record.
      if (path === '/records' && method === 'POST') {
        if (
          typeof body.name !== 'string' ||
          !body.name.trim()
        ) {
          send(400, { error: 'invalid_name' });
          return;
        }

        const record = {
          id: nextId++,
          name: body.name,
        };

        records.push(record);
        send(201, record);
        return;
      }

      // Handle operations on an individual record.
      const match = path.match(/^\/records\/(\d+)$/);

      if (match) {
        const id = Number(match[1]);
        const index = records.findIndex(
          (record) => record.id === id,
        );

        if (index === -1) {
          send(404, { error: 'not_found' });
          return;
        }

        // Read a record.
        if (method === 'GET') {
          send(200, records[index]);
          return;
        }

        // Update a record.
        if (method === 'PUT') {
          if (
            typeof body.name !== 'string' ||
            !body.name.trim()
          ) {
            send(400, { error: 'invalid_name' });
            return;
          }

          records[index] = {
            id,
            name: body.name,
          };

          send(200, records[index]);
          return;
        }

        // Delete a record.
        if (method === 'DELETE') {
          records.splice(index, 1);
          res.writeHead(204);
          res.end();
          return;
        }
      }

      send(404, { error: 'not_found' });
    });

    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });

    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  test.beforeEach(() => {
    records = [{ id: 1, name: 'Alpha' }];
    nextId = 2;
    limitedRequests = 0;
  });

  test.afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  });

  const authHeaders = {
    Authorization: 'Bearer valid-test-token',
  };

  // API-001: Valid authentication.
  test('API-001: valid token can read records', async ({ request }) => {
    const response = await request.get(`${baseUrl}/records`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual([
      { id: 1, name: 'Alpha' },
    ]);
  });

  // API-002: Missing authentication.
  test('API-002: missing token is rejected', async ({ request }) => {
    const response = await request.get(`${baseUrl}/records`);

    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({
      error: 'unauthorized',
    });
  });

  // API-003: Create a record.
  test('API-003: create a record', async ({ request }) => {
    const response = await request.post(`${baseUrl}/records`, {
      headers: authHeaders,
      data: { name: 'Beta' },
    });

    expect(response.status()).toBe(201);
    expect(await response.json()).toEqual({
      id: 2,
      name: 'Beta',
    });
  });

  // API-004: Reject invalid input.
  test('API-004: invalid record data is rejected', async ({ request }) => {
    const response = await request.post(`${baseUrl}/records`, {
      headers: authHeaders,
      data: { name: '' },
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      error: 'invalid_name',
    });
  });

  // API-005: Return 404 for a missing record.
  test('API-005: unknown record returns not found', async ({ request }) => {
    const response = await request.get(`${baseUrl}/records/999`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({
      error: 'not_found',
    });
  });

  // API-006: Rate limiting.
  test('API-006: repeated requests trigger rate limiting', async ({ request }) => {
    for (let i = 0; i < 3; i++) {
      const response = await request.get(`${baseUrl}/limited`, {
        headers: authHeaders,
      });

      expect(response.status()).toBe(200);
    }

    const response = await request.get(`${baseUrl}/limited`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(429);
    expect(await response.json()).toEqual({
      error: 'rate_limited',
    });
  });

  // API-007: Update a record.
  test('API-007: update an existing record', async ({ request }) => {
    const response = await request.put(`${baseUrl}/records/1`, {
      headers: authHeaders,
      data: { name: 'Updated Alpha' },
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({
      id: 1,
      name: 'Updated Alpha',
    });
  });

  // API-008: Delete a record and confirm it no longer exists.
  test('API-008: delete an existing record', async ({ request }) => {
    const response = await request.delete(`${baseUrl}/records/1`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(204);

    const followUp = await request.get(`${baseUrl}/records/1`, {
      headers: authHeaders,
    });

    expect(followUp.status()).toBe(404);
  });

  // API-009: Handle an HTTP 500 response.
  test('API-009: server error response is handled', async ({ request }) => {
    const response = await request.get(`${baseUrl}/server-error`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(500);
    expect(await response.json()).toEqual({
      error: 'internal_server_error',
      message: 'An unexpected server error occurred',
    });
  });

  // API-010: Validate the records response schema.
  test('API-010: records response follows the expected schema', async ({ request }) => {
    const response = await request.get(`${baseUrl}/records`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(200);

    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(1);
    expect(data[0]).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
    });
    expect(Object.keys(data[0]).sort()).toEqual([
      'id',
      'name',
    ]);
  });
});
