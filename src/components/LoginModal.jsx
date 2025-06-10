// components/LoginModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import './LoginModal.css';

const LoginModal = ({ show, onClose, onLogin }) => {
  const modalRef = useRef();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors

    try {
      const credentials = btoa(`${username}:${password}`);

      // First API call to authenticate
      const response = await fetch("/api/me", {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        // Handle authentication errors based on status code
        switch (response.status) {
          case 401:
            setErrorMessage('Invalid credentials. Please check your email and password.');
            break;
          case 403:
            setErrorMessage('Account locked. Please contact support.');
            break;
          case 410:
            setErrorMessage('Account expired. Please renew your account.');
            break;
          case 429:
            setErrorMessage('Too many login attempts. Please try again later.');
            break;
          case 500:
            setErrorMessage('Server error. Please try again later.');
            break;
          default:
            setErrorMessage(`Authentication failed: ${response.statusText}`);
        }
        onLogin(false); // Indicate login failure to App.jsx
        return; // Stop further execution
      }

      // If authentication successful, fetch organization units
      const orgUnitsResponse = await fetch(
        "/api/me?fields=organisationUnits[id,displayName]",
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      );

      if (orgUnitsResponse.ok) {
        const data = await orgUnitsResponse.json();
        if (data.organisationUnits && data.organisationUnits.length > 0) {
          // Store session data in localStorage
          localStorage.setItem("userOrgUnitId", data.organisationUnits[0].id);
          localStorage.setItem("userOrgUnitName", data.organisationUnits[0].displayName);
          localStorage.setItem("userCredentials", credentials);
          console.log("User Data and Organization Units:", data);
          onLogin(true); // Login successful
          onClose(); // Close modal on successful login
        } else {
          setErrorMessage('No organization units found for this user.');
          onLogin(false); // Login failed
        }
      } else {
        setErrorMessage(`Failed to fetch organization units: ${orgUnitsResponse.statusText}`);
        onLogin(false); // Login failed
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage('Network error or unexpected issue. Please try again.');
      onLogin(false); // Login failed due to network or other error
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <h5 className="modal-title">Login</h5>
          <button type="button" className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Display error message */}
          <form onSubmit={handleSubmit}>
            {/* Username input */}
            <div className="form-outline mb-4">
              <input 
                type="text"
                id="form2Example1" 
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
              <label className="form-label" htmlFor="form2Example1">Username</label>
            </div>

            {/* Password input */}
            <div className="form-outline mb-4">
              <input 
                type="password" 
                id="form2Example2" 
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter any password"
              />
              <label className="form-label" htmlFor="form2Example2">Password</label>
            </div>

            {/* 2 column grid layout for inline styling */}
            <div className="row mb-4">
              <div className="col d-flex justify-content-center">
                {/* Checkbox */}
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" value="" id="form2Example31" defaultChecked />
                  <label className="form-check-label" htmlFor="form2Example31"> Remember me </label>
                </div>
              </div>

              <div className="col">
                {/* Simple link */}
                <a href="#!">Forgot password?</a>
              </div>
            </div>

            {/* Submit button */}
            <button type="submit" className="btn btn-primary btn-block mb-4">Sign in</button>

            {/* Register buttons */}
            <div className="text-center">
              <p>Not a member? <a href="#!">Register</a></p>
              <p>or sign up with:</p>
              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-facebook-f"></i>
              </button>

              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-google"></i>
              </button>

              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-twitter"></i>
              </button>

              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-github"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;