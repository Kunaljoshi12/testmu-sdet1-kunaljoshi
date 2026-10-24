
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
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      const bodyText = Buffer.concat(chunks).toString('utf8');
      let body: any = {};

      try {
        body = bodyText ? JSON.parse(bodyText) : {};
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
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

      if (path === '/limited') {
        limitedRequests++;
        send(
          limitedRequests > 3 ? 429 : 200,
          limitedRequests > 3
            ? { error: 'rate_limited' }
            : { message: 'request accepted' },
        );
        return;
      }

      if (req.headers.authorization !== 'Bearer valid-test-token') {
        send(401, { error: 'unauthorized' });
        return;
      }

      if (path === '/records' && method === 'GET') {
        send(200, records);
        return;
      }

      if (path === '/records' && method === 'POST') {
        if (typeof body.name !== 'string' || !body.name.trim()) {
          send(400, { error: 'invalid_name' });
          return;
        }

        const record = { id: nextId++, name: body.name };
        records.push(record);
        send(201, record);
        return;
      }

      const match = path.match(/^\/records\/(\d+)$/);

      if (match) {
        const id = Number(match[1]);
        const index = records.findIndex((record) => record.id === id);

        if (index === -1) {
          send(404, { error: 'not_found' });
          return;
        }

        if (method === 'GET') {
          send(200, records[index]);
          return;
        }

        if (method === 'PUT') {
          if (typeof body.name !== 'string' || !body.name.trim()) {
            send(400, { error: 'invalid_name' });
            return;
          }

          records[index] = { id, name: body.name };
          send(200, records[index]);
          return;
        }

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
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  const authHeaders = {
    Authorization: 'Bearer valid-test-token',
  };

  test('API-001: valid token can read records', async ({ request }) => {
    const response = await request.get(`${baseUrl}/records`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual([{ id: 1, name: 'Alpha' }]);
  });

  test('API-002: missing token is rejected', async ({ request }) => {
    const response = await request.get(`${baseUrl}/records`);

    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ error: 'unauthorized' });
  });

  test('API-003: create a record', async ({ request }) => {
    const response = await request.post(`${baseUrl}/records`, {
      headers: authHeaders,
      data: { name: 'Beta' },
    });

    expect(response.status()).toBe(201);
    expect(await response.json()).toEqual({ id: 2, name: 'Beta' });
  });

  test('API-004: invalid record data is rejected', async ({ request }) => {
    const response = await request.post(`${baseUrl}/records`, {
      headers: authHeaders,
      data: { name: '' },
    });

    expect(response.status()).toBe(400);
  });

  test('API-005: unknown record returns not found', async ({ request }) => {
    const response = await request.get(`${baseUrl}/records/999`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(404);
  });

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
    expect(await response.json()).toEqual({ error: 'rate_limited' });
  });

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
});
