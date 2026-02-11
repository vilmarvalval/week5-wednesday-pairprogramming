import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditJobPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    companyName: "",
    contactEmail: "",
    contactPhone: "",
    location: "",
    salary: ""
  });
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch job");
        }
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };
    fetchJob();
  }, [id]);

  console.log(formData);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update job. Status: ${response.status}`);
      }

      navigate(`/jobs/${id}`);
    } catch (error) {
      console.error("Error updating job:", error);
    }


  const cancelEdit = () => {
    console.log("cancelEdit");
  };

  return (
    <div className="create">
      <h2>Edit Job</h2>
      <form onSubmit={submitForm}>
        <label htmlFor="title">Job title:</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
        />
        <label>Job type:</label>
        <select
          id="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select job type
          </option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Remote">Remote</option>
          <option value="Internship">Internship</option>
        </select>

        <label htmlFor="description">Job Description:</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
        <label htmlFor="companyName">Company Name:</label>
        <input
          id="companyName"
          type="text"
          value={formData.companyName}
          onChange={handleChange}
          
        />
        <label htmlFor="contactEmail">Contact Email:</label>
        <input
          id="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={handleChange}
        />
        <label htmlFor="contactPhone">Contact Phone:</label>
        <input
          id="contactPhone"
          type="tel"
          value={formData.contactPhone}
          onChange={handleChange}
        />
        <label htmlFor="location">Location:</label>
        <input
          id="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
        />
        <label htmlFor="salary">Salary:</label>
        <input
          id="salary"
          type="text"
          value={formData.salary}
          onChange={handleChange}
        />
        <button type="submit">Update Job</button>
        <button type="button" onClick={cancelEdit}>
          Cancel
        </button>
      </form>
    </div>
   );
  };
};

export default EditJobPage;
