import JobListing from "../components/JobListing";
import JobFilters from "../components/JobFilters";
import { useEffect, useState } from "react";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchJobs = async (endpoint) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs. Status: ${response.status}`);
      }
      const jobData = await response.json();
      setJobs(Array.isArray(jobData) ? jobData : []);
    } catch (fetchError) {
      console.error("Error fetching jobs:", fetchError);
      setJobs([]);
      setError("Failed to load jobs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs("/api/jobs");
  }, []);

  const handleFilterByType = (type) => {
    fetchJobs(`/api/jobs/type/${encodeURIComponent(type)}`);
  };

  const handleFilterByLocation = (location) => {
    fetchJobs(`/api/jobs/location/${encodeURIComponent(location)}`);
  };

  const handleReset = () => {
    fetchJobs("/api/jobs");
  };

  return (
    <div className="home">
      <JobFilters
        onFilterByType={handleFilterByType}
        onFilterByLocation={handleFilterByLocation}
        onReset={handleReset}
        isLoading={isLoading}
      />
      {error && <p>{error}</p>}
      <div className="job-list">
        {jobs.length === 0 && <p>No jobs found</p>}
        {jobs.length !== 0 &&
          jobs.map((job) => <JobListing key={job.id || job._id} {...job} />)}
      </div>
    </div>
  );
};

export default Home;
