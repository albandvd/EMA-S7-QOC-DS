import server from '../src/application/server';
import request from 'supertest';
import { Server } from 'http';

describe('Forest API', () => {
  let serverInstance: Server;

  beforeAll((done) => {
    serverInstance = server.listen(4000, () => {
      done();
    });
  });

  afterAll((done) => {
    serverInstance.close(done);
  });

  it('should create a new forest', async () => {
    const response = await request(server)
      .post('/forests')
      .send({
        name: 'test forest',
        description: 'test description',
        location: 'test location',
      });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('test forest');
  });

  it('should get all forests', async () => {
    const response = await request(server).get('/forests');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get a forest by id', async () => {
    const postResponse = await request(server)
      .post('/forests')
      .send({
        name: 'test forest',
        description: 'test description',
        location: 'test location',
      });
    const forestId = postResponse.body.id;
    const response = await request(server).get(`/forests/${forestId}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('test forest');
  });

  it('should update a forest', async () => {
    const postResponse = await request(server)
      .post('/forests')
      .send({
        name: 'test forest',
        description: 'test description',
        location: 'test location',
      });
    const forestId = postResponse.body.id;
    const response = await request(server)
      .put(`/forests/${forestId}`)
      .send({
        name: 'updated forest',
      });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('updated forest');
  });

  it('should delete a forest', async () => {
    const postResponse = await request(server)
      .post('/forests')
      .send({
        name: 'test forest',
        description: 'test description',
        location: 'test location',
      });
    const forestId = postResponse.body.id;
    const response = await request(server).delete(`/forests/${forestId}`);
    expect(response.status).toBe(204);
  });
});
