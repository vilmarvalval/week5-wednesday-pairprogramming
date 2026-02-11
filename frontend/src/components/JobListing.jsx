import { Link } from "react-router-dom";
const JobListing = ({ id, title, type, description, company }) => {
  return (
    <div className="job-preview">
      <h2>{title}</h2>
      <p>Type: {type}</p>
      <p>Description: {description}</p>
      <p>Company: {company.name}</p>
      <Link to={`/jobs/${id}`}>
        <button>View Job</button>
      </Link>
    </div>
  );
};

export default JobListing;
