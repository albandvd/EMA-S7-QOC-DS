import server from '../src/application/server';
import request from 'supertest';
import { Server } from 'http';

describe('Tree API', () => {
  let serverInstance: Server;

  beforeAll((done) => {
    serverInstance = server.listen(4001, () => {
      done();
    });
  });

  afterAll((done) => {
    serverInstance.close(done);
  });

  it('should create a new tree', async () => {
    const response = await request(server)
      .post('/trees')
      .send({
        name: 'test tree',
        species: 'test species',
      });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('test tree');
  });

  it('should get all trees', async () => {
    const response = await request(server).get('/trees');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get a tree by id', async () => {
    const postResponse = await request(server)
      .post('/trees')
      .send({
        name: 'test tree',
        species: 'test species',
      });
    const treeId = postResponse.body.id;
    const response = await request(server).get(`/trees/${treeId}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('test tree');
  });

  it('should update a tree', async () => {
    const postResponse = await request(server)
      .post('/trees')
      .send({
        name: 'test tree',
        species: 'test species',
      });
    const treeId = postResponse.body.id;
    const response = await request(server)
      .put(`/trees/${treeId}`)
      .send({
        name: 'updated tree',
      });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('updated tree');
  });

  it('should delete a tree', async () => {
    const postResponse = await request(server)
      .post('/trees')
      .send({
        name: 'test tree',
        species: 'test species',
      });
    const treeId = postResponse.body.id;
    const response = await request(server).delete(`/trees/${treeId}`);
    expect(response.status).toBe(204);
  });
});
