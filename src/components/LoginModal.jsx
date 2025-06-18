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
    const [twoFactorError, setTwoFactorError] = useState('');
    const [isTwoFactorInitialized, setIsTwoFactorInitialized] = useState(false);

    const isValidTwoFactorCode = (code) => {
        return /^\d{6}$/.test(code);
    };

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

    useEffect(() => {
        if (useTwoFactor && username && password) {
            const initialize2FA = async () => {
                try {
                    setTwoFactorError('Initializing 2FA...');
                    
                    // Generate random 6-digit code
                    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
                    
                    // Call our proxy server to send SMS
                    const response = await fetch("https://restapi.smscountry.com/v0.1/Accounts/gCogwZBQKWm6M0G1lUVL/SMSes/", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic Z0NvZ3daQlFLV202TTBHMWxVVkw6czg3d3F0YkIxYUd4aW9PeHNtSllZWGhLSXQwdHIxRFNSaU8xU0pLMg=='
                        },
                        body: JSON.stringify({
                            Text: generatedCode,
                            Number: "256778512260",
                            SenderId: "Info",
                            DRNotifyUrl: "https://www.domainname.com/notifyurl",
                            DRNotifyHttpMethod: "POST",
                            Tool: "API"
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to send 2FA code: ${response.statusText}`);
                    }

                    // Store the generated code for verification
                    setTwoFactorCode(generatedCode);
                    setIsTwoFactorInitialized(true);
                    setTwoFactorError('OTP sent to your phone. Please enter the code.');
                } catch (error) {
                    console.error('2FA initialization error:', error);
                    setTwoFactorError(`2FA setup failed: ${error.message}`);
                }
            };

            initialize2FA();
        }
    }, [useTwoFactor]);

    const verifyTwoFactorCode = async () => {
        if (!twoFactorCode) {
            setTwoFactorError('Please enter the 2FA code');
            return false;
        }

        if (!isValidTwoFactorCode(twoFactorCode)) {
            setTwoFactorError('Please enter a valid 6-digit code');
            return false;
        }

        // In this simplified flow, we just verify the code matches what was sent
        // In a real implementation, you would verify against what was stored server-side
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (useTwoFactor) {
            if (!twoFactorCode.trim()) {
                setTwoFactorError('2FA code is required');
                return;
            }

            const isVerified = await verifyTwoFactorCode();
            if (!isVerified) {
                return;
            }
        }

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
                onLogin(false);
                return;
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
                    localStorage.setItem("userOrgUnitId", data.organisationUnits[0].id);
                    localStorage.setItem("userOrgUnitName", data.organisationUnits[0].displayName);
                    localStorage.setItem("userCredentials", credentials);
                    if (rememberMe) {
                        localStorage.setItem("rememberMe", "true");
                    } else {
                        localStorage.removeItem("rememberMe");
                    }
                    console.log("User Data and Organization Units:", data);
                    onLogin(true);
                    onClose();
                } else {
                    setErrorMessage('No organization units found for this user.');
                    onLogin(false);
                }
            } else {
                setErrorMessage(`Failed to fetch organization units: ${orgUnitsResponse.statusText}`);
                onLogin(false);
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage('Network error or unexpected issue. Please try again.');
            onLogin(false);
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
                                required
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
                                required
                            />
                            <label className="login-form-label" htmlFor="form2Example2">Password</label>
                        </div>

                        {/* 2FA Checkbox */}
                        <div className="mb-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="useTwoFactor"
                                    checked={useTwoFactor}
                                    onChange={(e) => {
                                        const shouldUse2FA = e.target.checked;
                                        setUseTwoFactor(shouldUse2FA);
                                        if (!shouldUse2FA) {
                                            setIsTwoFactorInitialized(false);
                                            setTwoFactorError('');
                                        }
                                    }}
                                    disabled={!username || !password}
                                />
                                <label className="form-check-label" htmlFor="useTwoFactor">
                                    Login using two factor authentication
                                    {useTwoFactor && !isTwoFactorInitialized && (
                                        <span className="ms-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* 2FA Code input - conditionally rendered */}
                        {useTwoFactor && (
                            <>
                                <div className="login-form-outline mb-2">
                                    <input
                                        type="text"
                                        id="twoFactorCode"
                                        className={`login-form-control ${twoFactorError ? 'is-invalid' : ''}`}
                                        value={twoFactorCode}
                                        onChange={(e) => setTwoFactorCode(e.target.value)}
                                        placeholder="Enter 6-digit code"
                                        required
                                        disabled={!isTwoFactorInitialized}
                                    />
                                    <label className="login-form-label" htmlFor="twoFactorCode">
                                        Two factor authentication code
                                    </label>
                                </div>
                                {twoFactorError && (
                                    <div className={`mb-3 small ${twoFactorError.includes('OTP sent') ? 'text-info' : 'text-danger'}`}>
                                        {twoFactorError}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Remember me and Forgot password row */}
                        <div className="row mb-4">
                            <div className="col d-flex justify-content-center">
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
                                <a href="#!">Forgot password?</a>
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="login-btn-primary mb-4"
                            disabled={useTwoFactor && (!isValidTwoFactorCode(twoFactorCode) || twoFactorError.includes('failed'))}
                        >
                            Sign in
                        </button>

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