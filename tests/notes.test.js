const request = require('supertest');
const app = require('../src/app');

beforeEach(() => {
  app.resetNotes();
});

describe("Notes API", () => {

  test("GET /notes should return empty array", async () => {
    const res = await request(app).get('/notes');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("POST /notes should create note", async () => {
    const res = await request(app)
      .post('/notes')
      .send({ title: "Test Note" });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Note");
  });

  test("GET /notes/:id should return note", async () => {
    const note = await request(app)
      .post('/notes')
      .send({ title: "Note1" });

    const res = await request(app).get(`/notes/${note.body.id}`);
    expect(res.statusCode).toBe(200);
  });

  test("PUT /notes/:id should update note", async () => {
    const note = await request(app)
      .post('/notes')
      .send({ title: "Old" });

    const res = await request(app)
      .put(`/notes/${note.body.id}`)
      .send({ title: "New" });

    expect(res.body.title).toBe("New");
  });

  test("DELETE /notes/:id should delete note", async () => {
    const note = await request(app)
      .post('/notes')
      .send({ title: "Delete Me" });

    const res = await request(app)
      .delete(`/notes/${note.body.id}`);

    expect(res.statusCode).toBe(200);
  });

  test("SEARCH notes", async () => {
    await request(app).post('/notes').send({ title: "Java" });
    await request(app).post('/notes').send({ title: "Python" });

    const res = await request(app).get('/notes/search?q=java');
    expect(res.body.length).toBe(1);
  });

});
