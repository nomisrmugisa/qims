// components/Header.jsx
import React from 'react';
import './Header.css';

const Header = ({ onLoginClick, isLoggedIn, onLogout, activeDashboardSection, setActiveDashboardSection }) => {
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
          <div className="social-links d-none d-md-flex align-items-center">
            <a href="#" className="twitter"><i className="bi bi-twitter-x"></i></a>
            <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
            <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
            <a href="#" className="linkedin"><i className="bi bi-linkedin"></i></a>
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
              <li><a href="#registration" className={activeDashboardSection === 'registration' ? 'active' : ''} onClick={() => setActiveDashboardSection('registration')}>Complete Registration</a></li>
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

          <a className="cta-btn d-none d-sm-block" href="#Registration">Register</a>
        </div>
      </div>
    </header>
  );
};

export default Header;