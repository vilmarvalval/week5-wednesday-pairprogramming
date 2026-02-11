const supertest = require("supertest");
const app = require("./app-test");
const Job = require("../models/jobModel");
const api = supertest(app);

//test get all jobs
describe("GET /api/jobs for all jobs", () => {
  it("must returns all jobs saved", async () => {
    const allJobs = await api
      .get("/api/jobs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

//test create a job
describe("POST /api/jobs", () => {
  describe("Create a job", () => {
    it("must save a new job to the systeym with code 201", async () => {
      const newJob = await api
        .post("/api/jobs")
        .send({
          title: "Job title 1",
          type: "Job type 1",
          description: "Job description 1",
          company: {
            name: "Company 1",
            contactEmail: "email1@yahoo.com",
            contactPhone: "012345678",
          },
          location: "Vantaa",
          salary: 1000,
        })
        .expect(201)
        .expect("Content-Type", /application\/json/);
    });

    it("must return status code 400 if required fields are missing", async () => {
      const newJob = await api
        .post("/api/jobs")
        .send({
          title: "Job title 1",
          type: "Job type 1",
          description: "Job description 1",
        })
        .expect(400);
    });
  });
});

//test GET BY ID
describe("GET /api/jobs/:id", () => {
  describe("Get a specific job by id", () => {
    it("must return that specific job with code 200", async () => {
      const job = await Job.findOne();
      const jobToFind = await api.get(`/api/jobs/${job.id}`).expect(200);
      // .expect("Content-Type", /application\/json/);
    });
    it("must return that specific job with content type of JSON", async () => {
      const job = await Job.findOne();
      const jobToFind = await api
        .get(`/api/jobs/${job.id}`)
        // .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    it("must return error 400 if job id is invalid", async () => {
      const invalidId = "123";
      const jobToFind = await api.get(`/api/jobs/${invalidId}`).expect(400);
    });

    it("must return error 404 if valid job id but not found", async () => {
      const notFoundId = "66fa5dff5da0804da2c91d5a";
      const jobToFind = await api.get(`/api/jobs/${notFoundId}`).expect(404);
    });
  });
});

//test PUT BY ID
describe("PUT /api/jobs", () => {
  describe("Edit a specific job", () => {
    it("must return the job with edited information with status 200", async () => {
      const job = await Job.findOne();
      const newJob = { title: "Changed Titled" };
      const jobUpdate = await api
        .put(`/api/jobs/${job.id}`)
        .send(newJob)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const updateJobCheck = await Job.findById(job.id);

      expect(updateJobCheck.title).toBe(newJob.title);
    });
    it("must return error 400 if job id is invalid", async () => {
      const invalidId = "123";
      const jobToFind = await api.get(`/api/jobs/${invalidId}`).expect(400);
    });

    it("must return error 404 if valid job id but not found", async () => {
      const nonFoundId = "66fa5dff5da0804da2c91d5a";
      const jobToFind = await api.get(`/api/jobs/${nonFoundId}`).expect(404);
    });
  });
});

//test DELETE
describe("DELETE /api/jobs", () => {
  describe("Delete a job", () => {
    it("must delete a job from the system with code 204", async () => {
      const job = await Job.findOne();
      const jobDeleted = await api.delete(`/api/jobs/${job.id}`).expect(204);
    });
    it("must return error 400 if job id is invalid", async () => {
      const invalidId = "123";
      const jobToFind = await api.get(`/api/jobs/${invalidId}`).expect(400);
    });

    it("must return error 404 if valid job id but not found", async () => {
      const nonFoundId = "66fa5dff5da0804da2c91d5a";
      const jobToFind = await api.get(`/api/jobs/${nonFoundId}`).expect(404);
    });
  });
});

//test unknown endpoint
describe("GET /api/unknown", () => {
  it('must return status code 404 and error message: "unknown endpoint"', async () => {
    const response = await api.get("/api/job/unknown").expect(404);
    expect(response.body.error).toContain("unknown endpoint");
  });
});
