import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Phone_Number: "",
    Username: "",
    Password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  // Validate fields on typing
  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "Name":
        if (!value) errorMsg = "Name is required";
        break;
      case "Email":
        if (!/\S+@\S+\.\S+/.test(value)) errorMsg = "Invalid email address";
        break;
      case "Phone_Number":
        if (!/^\d{10}$/.test(value))
          errorMsg = "Phone number must be 10 digits";
        break;
      case "Username":
        if (!value) errorMsg = "Username is required";
        break;
      case "Password":
        if (value.length < 8)
          errorMsg = "Password must be at least 8 characters long";
        break;
      case "confirmPassword":
        if (value !== formData.Password) errorMsg = "Passwords do not match";
        break;
      default:
        break;
    }

    return errorMsg;
  };

  // Handle input change and validate immediately
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate field and set errors
    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Re-validate all fields before submitting
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Show all errors
      return;
    }

    try {
      await axios.post("/customer/signup", formData);
      setStatus("Sign up successful");
      setErrors({});
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message;

        // Display server-side error for a specific field
        if (errorMessage.includes("Username")) {
          setErrors({ Username: errorMessage });
        } else if (errorMessage.includes("Email")) {
          setErrors({ Email: errorMessage });
        } else {
          setStatus("Sign up failed. Try again.");
        }
      } else {
        setStatus("Sign up failed. Try again.");
      }
    }
  };

  return (
    <div className="background">
      <div className="signupbody">
        <div className="signup-form-outer">
          <form className="signup-form-inner" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>

            <div className="form-group">
              <label htmlFor="fullname">Full Name:</label>
              <input
                type="text"
                id="fullname"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
              {errors.Name && <span className="error">{errors.Name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                placeholder="Email Address"
                required
              />
              {errors.Email && <span className="error">{errors.Email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number:</label>
              <input
                type="tel"
                id="phone"
                name="Phone_Number"
                value={formData.Phone_Number}
                onChange={handleChange}
                placeholder="Phone number"
                required
              />
              {errors.Phone_Number && (
                <span className="error">{errors.Phone_Number}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="Username"
                value={formData.Username}
                onChange={handleChange}
                placeholder="Create a username"
                required
              />
              {errors.Username && (
                <span className="error">{errors.Username}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Create Password:</label>
              <input
                type="password"
                id="password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />
              {errors.Password && (
                <span className="error">{errors.Password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Retype password"
                required
              />
              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit">Sign Up</button>

            {status && <p>{status}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
