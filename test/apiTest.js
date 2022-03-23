const request = require("supertest");
const { server } = require("../index");

describe("GET /", function () {
  it("respond with 200", function () {
    request(server).get("/").expect(200);
  });
});
describe("POST /", function () {
  it("respond with 200", function (done) {
    request(server).post("/create").expect(200, done);
  });
});
describe("PUT /", function () {
  it("respond with 200", function (done) {
    request(server).put("/edit").expect(200, done);
  });
});
describe("DELETE /", function () {
  it("respond with 200", function (done) {
    request(server).delete("/delete").expect(200, done);
  });
});
