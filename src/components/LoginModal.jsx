// components/LoginModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import './LoginModal.css';

const LoginModal = ({ show, onClose, onLogin }) => {
  const modalRef = useRef();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [useTwoFactor, setUseTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

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
          ...(useTwoFactor && twoFactorCode && { 'X-2FA-Code': twoFactorCode }),
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
          case 423:
            setErrorMessage('Two factor authentication required.');
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
          if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
          } else {
            localStorage.removeItem("rememberMe");
          }
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
    <div className="login-modal-overlay">
      <div className="login-modal-content" ref={modalRef}>
        <div className="login-modal-header">
          <h5 className="login-modal-title">Login</h5>
          <button type="button" className="login-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="login-modal-body">
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <form onSubmit={handleSubmit}>
            {/* Username input */}
            <div className="login-form-outline mb-4">
              <input 
                type="text"
                id="form2Example1" 
                className="login-form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
              <label className="login-form-label" htmlFor="form2Example1">Username</label>
            </div>

            {/* Password input */}
            <div className="login-form-outline mb-4">
              <input 
                type="password" 
                id="form2Example2" 
                className="login-form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter any password"
              />
              <label className="login-form-label" htmlFor="form2Example2">Password</label>
            </div>

            {/* 2FA Checkbox - appears above the input field */}
            <div className="mb-3">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="useTwoFactor"
                  checked={useTwoFactor}
                  onChange={(e) => setUseTwoFactor(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="useTwoFactor">
                  Login using two factor authentication
                </label>
              </div>
            </div>

            {/* 2FA Code input - conditionally rendered */}
            {useTwoFactor && (
              <div className="login-form-outline mb-4">
                <input 
                  type="text" 
                  id="twoFactorCode"
                  className="login-form-control"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  // placeholder="Enter two factor authentication code"
                />
                <label className="login-form-label" htmlFor="twoFactorCode" >
                  Two factor authentication code
                </label>
              </div>
            )}

            {/* Remember me and Forgot password row */}
            <div className="row mb-4">
              <div className="col d-flex justify-content-center">
                {/* Remember me checkbox */}
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
              </div>

              <div className="col">
                {/* Forgot password link */}
                <a href="#!">Forgot password?</a>
              </div>
            </div>

            {/* Submit button */}
            <button type="submit" className="login-btn-primary mb-4">Sign in</button>

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