

import request from 'supertest';
import app from '../app/app.js';
import sequelize from '../models/db.js';
import { Patterns } from '../models/patterns.js';

beforeAll(async () => {
  // Connecting to the real DB and ensure table exists
  await sequelize.authenticate();
  await Patterns.sync();
});

afterAll(async () => {
  // Closes DB connection after all tests
  await sequelize.close();
});

beforeEach(async () => {
  // Clears Patterns table before each test (fresh state)
  await Patterns.destroy({ where: {} });
});

describe('Patterns API integration', () => {
  test('POST /patterns creates a pattern and GET endpoints return it', async () => {
    const payload = {
      pattern_name: 'Integration Test Pattern',
      pattern_info: {
        width: 2,
        height: 2,
        colorConfig: ['#ffffff', '#000000', '#000000', '#ffffff'],
      },
      author: 'Integration Tester',
      description: 'Created by integration test',
    };

    // CREATE via API
    const postRes = await request(app)
      .post('/patterns')
      .send(payload)
      .expect(201);

    // uploadPattern returns the new pattern_ID as JSON
    const createdId = postRes.body;
    expect(typeof createdId === 'number' || typeof createdId === 'string').toBe(true);

    // LIST via API
    const listRes = await request(app)
      .get('/patterns')
      .expect(200);

    expect(Array.isArray(listRes.body)).toBe(true);
    const names = listRes.body.map((p) => p.pattern_name);
    expect(names).toContain(payload.pattern_name);

    // GET SINGLE via API
    const getRes = await request(app)
      .get(`/patterns/${createdId}`)
      .expect(200);

    expect(getRes.body.pattern_name).toBe(payload.pattern_name);
    expect(getRes.body.author).toBe(payload.author);
    expect(getRes.body.description).toBe(payload.description);
    expect(getRes.body.pattern_info.width).toBe(payload.pattern_info.width);
    expect(getRes.body.pattern_info.height).toBe(payload.pattern_info.height);
  });

  test('DELETE /patterns/:id removes the pattern from the database', async () => {
    // Seeds a pattern directly via the model
    const created = await Patterns.create({
      pattern_name: 'To Be Deleted',
      pattern_info: {
        width: 1,
        height: 1,
        colorConfig: ['#ff0000'],
      },
      author: 'Delete Tester',
      description: 'This will be deleted',
    });

    const id = created.pattern_ID;

    // Confirms it exists via API
    await request(app).get(`/patterns/${id}`).expect(200);

    // DELETE via API
    const deleteRes = await request(app)
      .delete(`/patterns/${id}`)
      .expect(200);

    expect(deleteRes.body).toMatchObject({
      message: 'Pattern deleted successfully',
    });

    // LIST should no longer include it
    const listRes = await request(app)
      .get('/patterns')
      .expect(200);

    const ids = listRes.body.map((p) => p.pattern_ID);
    expect(ids).not.toContain(id);
  });
});
