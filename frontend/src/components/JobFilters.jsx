import { useState } from "react";

const JobFilters = ({ onFilterByType, onFilterByLocation, onReset, isLoading }) => {
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  const handleTypeSubmit = (e) => {
    e.preventDefault();
    if (!type) return;
    onFilterByType(type);
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    if (!trimmedLocation) return;
    onFilterByLocation(trimmedLocation);
  };

  const handleReset = () => {
    setType("");
    setLocation("");
    onReset();
  };

  return (
    <section className="job-filters">
      <h3>Filter Jobs</h3>
      <div className="job-filters-controls">
        <form onSubmit={handleTypeSubmit}>
          <label htmlFor="job-type-filter">Type</label>
          <select
            id="job-type-filter"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
          <button type="submit" disabled={isLoading || !type}>
            Filter by Type
          </button>
        </form>

        <form onSubmit={handleLocationSubmit}>
          <label htmlFor="job-location-filter">Location</label>
          <input
            id="job-location-filter"
            type="text"
            placeholder="e.g. Helsinki"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button type="submit" disabled={isLoading || !location.trim()}>
            Filter by Location
          </button>
        </form>

        <button type="button" onClick={handleReset} disabled={isLoading}>
          Reset
        </button>
      </div>
    </section>
  );
};

export default JobFilters;
