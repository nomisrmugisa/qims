// components/Header.jsx
import {React, useState} from 'react';
import './Header.css';
import LoginModal from './LoginModal';

const Header = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <header id="header" className="header sticky-top">
            <div className="topbar d-flex align-items-center">
                <div className="container d-flex justify-content-center justify-content-md-between">
                    <div className="contact-info d-flex align-items-center">
                        <i className="bi bi-envelope d-flex align-items-center"><a href="mailto:contact@example.com">health@gov.bw</a></i>
                        <i className="bi bi-phone d-flex align-items-center ms-4"><span>+267 363 2500</span></i>
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
                    {/* <a href="index.html" className="logo align-items-center "> */}
                    <img src="src/assets/moh-bots-log.jpg" alt="" className="img-fluid header-logo"></img>
                    {/* </a> */}

                    <nav id="navmenu" className="navmenu">
                        <ul>
                            <li><a href="#hero" className="active">Home<br></br></a></li>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#services">Check License</a></li>
                            <li><a href="#departments">Report Incident</a></li>
                            {/* <li><a href="#doctors">Documents Repository</a></li> */}
                            <li className="dropdown"><a href="#"><span>Documents Repository</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
                                <ul>
                                    <li><a href="#">Dropdown 1</a></li>
                                    <li className="dropdown"><a href="#"><span>Deep Dropdown</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
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
                            {/* <li><a href="#contact">Contact</a></li> */}
                            <li>
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setShowLoginModal(true);
                                }}>
                                    <b>Login</b>
                                </a>
                            </li>
                        </ul>
                        <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
                    </nav>

                    <a className="cta-btn d-none d-sm-block" href="#Registration">Register</a>
                </div>
            </div>
            <LoginModal
                show={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </header>
    );
};

export default Header;