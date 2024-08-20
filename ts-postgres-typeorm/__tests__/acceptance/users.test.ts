import { DataSource } from "typeorm";
import * as request from "supertest";
import { AppDataSource } from "../../src/data-source";
import app from "../../src/app";
import { port } from "../../src/config";

const testUser = { firstName: "John", lastName: "Doe", age: 30 };
let server, connection;
beforeEach(async () => {
  connection = await AppDataSource.initialize();
  await connection.synchronize(true);
  server = app.listen(port);
});

afterEach(() => {
  server.close();
  connection.close();
});

it("should not have users", async () => {
  const res = await request(app).get("/users");
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual([]);
});

it("should save user", async () => {
  const res = await request(app).post("/users").send(testUser);
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ ...testUser, id: expect.any(Number) });
});

it("should not save user without fistName", async () => {
  const res = await request(app)
    .post("/users")
    .send({ lastName: "Doe", age: 30 });
  expect(res.statusCode).toBe(400);
  expect(res.body.errors).not.toBeNull();
  expect(res.body.errors.length).toBe(1);
  expect(res.body.errors[0]).toEqual({
    type: "field",
    msg: "Invalid value",
    path: "firstName",
    location: "body",
  });
});

it("should not save user with negative age", async () => {
  const res = await request(app)
    .post("/users")
    .send({ firstName: "John", lastName: "Doe", age: -30 });
  expect(res.statusCode).toBe(400);
  expect(res.body.errors).not.toBeNull();
  expect(res.body.errors.length).toBe(1);
  expect(res.body.errors[0]).toEqual({
    type: "field",
    value: -30,
    msg: "Age must be a positive number",
    path: "age",
    location: "body",
  });
});
