// E2E/Integration tests using supertest (API testing)
// Tests the full CRUD flow

const request = require('supertest');
const app = require('../../src/server');

describe('E2E - Encomenda de Bolo (API)', () => {
  test('Happy path: criar encomenda e verificar na listagem', async () => {
    const data = {
      massa: 'baunilha-e2e',
      recheio: 'doce-e2e',
      cobertura: 'choco-e2e',
      peso: 2.5,
      decoracaoExtra: false
    };

    // POST /items
    const postRes = await request(app)
      .post('/items')
      .send(data)
      .expect(201);
    expect(postRes.body.massa).toBe(data.massa);
    expect(postRes.body.id).toBeDefined();
    const id = postRes.body.id;

    // GET /items
    const listRes = await request(app)
      .get('/items')
      .expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThan(0);
    const found = listRes.body.find(it => it.id === id);
    expect(found).toBeDefined();
    expect(found.massa).toBe(data.massa);
  });

  test('Validação negativa: buscar item que não existe', async () => {
    await request(app)
      .get('/items/find?id=nao-existe')
      .expect(404);
  });

  test('Atualizar encomenda', async () => {
    // Create
    const created = await request(app)
      .post('/items')
      .send({ massa: 'test', recheio: 'r1', cobertura: 'c1', peso: 1 })
      .expect(201);
    const id = created.body.id;

    // Update
    const updateRes = await request(app)
      .put('/items')
      .send({ match: { id }, patch: { recheio: 'r-updated' } })
      .expect(200);
    expect(updateRes.body.recheio).toBe('r-updated');
  });

  test('Remover encomenda', async () => {
    // Create
    const created = await request(app)
      .post('/items')
      .send({ massa: 'del-test', recheio: 'r', cobertura: 'c', peso: 1 })
      .expect(201);
    const id = created.body.id;

    // Delete
    await request(app)
      .delete('/items')
      .send({ match: { id } })
      .expect(204);

    // Verify deleted
    await request(app)
      .get(`/items/find?id=${id}`)
      .expect(404);
  });
});
