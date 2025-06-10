import React, { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import Header from './header/header';
import LoginModal from './authentication/LoginModal';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeDashboardSection, setActiveDashboardSection] = useState('overview');
  // const navigate = useNavigate();

  const handleLogin = (status) => {
    setIsLoading(true);
    // Simulate loading time of 2 seconds
    setTimeout(() => {
      setIsLoggedIn(status);
      setIsLoading(false);
      setShowLoginModal(false);
      if (status) {
        navigate('/dashboards/facility-ownership');
      }
    }, 2000);
  };

  const handleLogout = () => {
    setIsLoading(true);
    localStorage.clear(); // Clear local storage on logout
    setTimeout(() => {
      setIsLoggedIn(false);
      setIsLoading(false);
      navigate('/'); // Redirect to home/login page after logout
    }, 2000);
  };
  return (
    <ThemeCustomization>
      
      <ScrollTop>
        <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  );
}
