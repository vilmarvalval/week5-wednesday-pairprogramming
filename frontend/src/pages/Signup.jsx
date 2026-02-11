import { useState } from "react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [membershipStatus, setMembershipStatus] = useState("");
  const [address, setAddress] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(
      name,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      membershipStatus,
      address,
      profilePicture
    );
  };

  return (
    <div className="create">
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Email address:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Phone Number:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <label>Date of Birth:</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
        <label>Membership Status:</label>
        <select
          value={membershipStatus}
          onChange={(e) => setMembershipStatus(e.target.value)}
        >
          <option value="" disabled>
            Select membership status
          </option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <label>Address:</label>{" "}
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></textarea>
        <label>Profile Picture:</label>
        <input
          type="text"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
        />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
};

export default Signup;
