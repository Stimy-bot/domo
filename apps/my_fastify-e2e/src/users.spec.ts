import { expect, test } from '@playwright/test';

test.describe('Fastify Users API', () => {
  test('GET /api/users - returns array of users with status 200', async ({ request }) => {
    // Perform GET request (uses baseURL from playwright.config.mts)
    const response = await request.get('/api/users');

    // Assert HTTP status code
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // Parse JSON body
    const body = await response.json();

    // Validate payload array structure
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
    });
  });

  test('POST /api/users - creates new user and validates response headers/body', async ({
    request,
  }) => {
    const newUser = {
      name: 'Sarah',
      role: 'developer',
    };

    const response = await request.post('/api/users', {
      data: newUser,
    });

    // Fastify returns 201 Created
    expect(response.status()).toBe(201);

    // Verify response headers
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();

    // Assert exact response shape
    expect(body).toEqual({
      id: expect.any(String),
      name: newUser.name,
      role: newUser.role,
      createdAt: expect.any(String),
    });
  });

  test('POST /api/users - returns 400 when validation fails', async ({ request }) => {
    const response = await request.post('/api/users', {
      data: {}, // Missing required 'name' field
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toEqual({ error: 'Name is required' });
  });

  test('GET /api/users/:id - returns 404 for unknown user', async ({ request }) => {
    const response = await request.get('/api/users/999');

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body).toEqual({ error: 'User not found' });
  });
});
