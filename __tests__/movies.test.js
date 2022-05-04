const request = require("supertest");
const { app } = require("../src/server");
const { removeItems } = require("../src/movies/movie.service");

const getToken = async () => {
  const res = await request(app).post("/auth").send({
    username: "basic-thomas",
    password: "sR-_pcoow-27-6PAwCD8",
  });

  return res.body.token;
}

describe("Movies Post Endpoint", () => {
  let token;

  beforeEach(async () => {
    token = await getToken();
    await removeItems();
  });

  it("should create a new movie", async () => {
    const res = await request(app)
      .post("/movie")
      .set("Authorization", "Bearer " + token)
      .send({ title: "Superman" });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("title");
    expect(res.body).toMatchObject({ title: "Superman" });
  });

  it("should throw error when movie not found", async () => {
    const res = await request(app)
      .post("/movie")
      .set("Authorization", "Bearer " + token)
      .send({ title: "KGF" });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Movie not found");
  });

  it("should throw error without token", async () => {
    const res = await request(app).post("/movie").send({ title: "Black" });

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual("Unauthorized");
  });

  it("should throw error when title is empty", async () => {
    const res = await request(app)
      .post("/movie")
      .set("Authorization", "Bearer " + token)
      .send({ title: "" });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Title is required");
  });

  it("should throw error when basic user has created movie more than 5 times", async () => {
    //create 5 movies
    let movieArr = ["Black", "Superman", "Batman", "Avengers", "Thor"];
    for (let movie of movieArr) {
      await request(app)
        .post("/movie")
        .set("Authorization", "Bearer " + token)
        .send({ title: movie });
    }

    const res = await request(app)
      .post("/movie")
      .set("Authorization", "Bearer " + token)
      .send({ title: "String" });

    expect(res.statusCode).toEqual(405);
    expect(res.body.message).toEqual(
      "Basic users are restricted to create 5 movies per month"
    );
  });

  it("should throw error when title is not unique w.r.t userId", async () => {
    //create movie
    const response = await request(app)
      .post("/movie")
      .set("Authorization", "Bearer " + token)
      .send({ title: "Black" });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty("title");
    expect(response.body).toMatchObject({ title: "Black" });

    const res = await request(app)
      .post("/movie")
      .set("Authorization", "Bearer " + token)
      .send({ title: "black" });

    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toEqual("Duplicate Error");
  });
});

describe("Movies Get Endpoint", () => {
  let token;

  beforeEach(async () => {
    token = await getToken();
  });

  it("should get movies by user", async () => {
    const res = await request(app)
      .get("/movie")
      .set("Authorization", "Bearer " + token);

    expect(res.statusCode).toEqual(200);
  });
});
