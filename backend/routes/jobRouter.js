const express = require("express");
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobsByType,
  getJobsByLocation,
  filterJobsBySalary,
  countJobsByType,
} = require("../controllers/jobControllers");

const router = express.Router();

router.get("/", getAllJobs);
router.post("/", createJob);

router.get("/salary", filterJobsBySalary);
router.get("/:jobId", getJobById);
router.put("/:jobId", updateJob);
router.delete("/:jobId", deleteJob);

router.get("/type/:type", getJobsByType);
router.get("/location/:location", getJobsByLocation);
router.get('/count/type/:type', countJobsByType);

module.exports = router;
