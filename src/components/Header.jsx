// components/Header.jsx
import React, { useEffect, useState } from 'react';
import './Header.css';

const Header = ({ onLoginClick, isLoggedIn, onLogout, activeDashboardSection, setActiveDashboardSection }) => {
  const [orgUnitName, setOrgUnitName] = useState('');

  useEffect(() => {
    // Get organization unit name when component mounts or isLoggedIn changes
    if (isLoggedIn) {
      const fetchOrgUnitName = async () => {
        try {
          const credentials = localStorage.getItem('userCredentials');
          if (!credentials) {
            console.error('No credentials found in localStorage');
            return;
          }

          const response = await fetch('/api/me?fields=organisationUnits[displayName]', {
            headers: {
              Authorization: `Basic ${credentials}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data && data.organisationUnits && data.organisationUnits.length > 0) {
              setOrgUnitName(data.organisationUnits[0].displayName);
              // Also store in localStorage for future use
              localStorage.setItem('userOrgUnitName', data.organisationUnits[0].displayName);
            }
          } else {
            console.error('Failed to fetch organization unit data');
            // Fallback to stored value if API call fails
            const storedOrgUnitName = localStorage.getItem('userOrgUnitName');
            if (storedOrgUnitName) {
              setOrgUnitName(storedOrgUnitName);
            }
          }
        } catch (error) {
          console.error('Error fetching organization unit data:', error);
          // Fallback to stored value if API call fails
          const storedOrgUnitName = localStorage.getItem('userOrgUnitName');
          if (storedOrgUnitName) {
            setOrgUnitName(storedOrgUnitName);
          }
        }
      };

      fetchOrgUnitName();
    }
  }, [isLoggedIn]);

  return (
    <header id="header" className="header sticky-top">
      <div className="topbar d-flex align-items-center">
        <div className="container d-flex justify-content-center justify-content-md-between">
          <div className="contact-info d-flex align-items-center">
            <i className="bi bi-envelope d-flex align-items-center">
              <a href="mailto:contact@example.com">health@gov.bw</a>
            </i>
            <i className="bi bi-phone d-flex align-items-center ms-4">
              <span>+267 363 2500</span>
            </i>
          </div>
          <div className="d-flex align-items-center">
            {isLoggedIn && (
              <div className="logged-in-message me-3">
                <i className="bi bi-building me-1"></i>
                <span>Facility: {orgUnitName || 'Loading...'}</span>
              </div>
            )}
            <div className="social-links d-none d-md-flex align-items-center">
              <a href="#" className="twitter"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
              <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
              <a href="#" className="linkedin"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>
        </div>
      </div>

      <div className="branding d-flex align-items-center">
        <div className="container position-relative d-flex align-items-center justify-content-between">
          <div className="logo d-flex flex-column align-items-center">
            <img src="/assets/img/moh-bots-log.jpg" alt="Ministry of Health Logo" className="header-logo"></img>
          </div>

          <nav id="navmenu" className="navmenu">
            <ul>
              <li><a href="#registration" className={activeDashboardSection === 'registration' ? 'active' : ''} onClick={() => setActiveDashboardSection('registration')}>Complete Application</a></li>
              <li><a href="#overview" className={activeDashboardSection === 'overview' ? 'active' : ''} onClick={() => setActiveDashboardSection('overview')}>Overview</a></li>
              <li><a href="#reports" className={activeDashboardSection === 'reports' ? 'active' : ''} onClick={() => setActiveDashboardSection('reports')}>Report</a></li>
              <li><a href="#tasks" className={activeDashboardSection === 'tasks' ? 'active' : ''} onClick={() => setActiveDashboardSection('tasks')}>Tasks</a></li>
              <li className="dropdown">
                <a href="#"><span>Documents Repository</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
                <ul>
                  <li><a href="#">Dropdown 1</a></li>
                  <li className="dropdown">
                    <a href="#"><span>Deep Dropdown</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
                    <ul>
                      <li><a href="#">Deep Dropdown 1</a></li>
                      <li><a href="#">Deep Dropdown 2</a></li>
                      <li><a href="#">Deep Dropdown 3</a></li>
                      <li><a href="#">Deep Dropdown 4</a></li>
                      <li><a href="#">Deep Dropdown 5</a></li>
                    </ul>
                  </li>
                  <li><a href="#">Dropdown 2</a></li>
                  <li><a href="#">Dropdown 3</a></li>
                  <li><a href="#">Dropdown 4</a></li>
                </ul>
              </li>
              <li>
                {isLoggedIn ? (
                  <button className="login-button" onClick={onLogout}>
                    Logout
                  </button>
                ) : (
                  <button className="login-button" onClick={onLoginClick}>
                    Login
                  </button>
                )}
              </li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>

          <a className="cta-btn d-none d-sm-block" href="#Registration">Apply</a>
        </div>
      </div>
    </header>
  );
};

export default Header;