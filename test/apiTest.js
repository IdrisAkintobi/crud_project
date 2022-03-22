const request = require("supertest");
const { server } = require("../index");

describe("POST /", function () {
  it("respond with 200", function (done) {
    request(server).post("/").expect(200, done);
  });
});
