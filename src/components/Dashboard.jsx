import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import RegistrationDetails from './RegistrationDetails';

const Dashboard = ({ activeSection, setActiveSection }) => {
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [trackedEntityInstanceId, setTrackedEntityInstanceId] = useState(null);
    const [showFacilityReviewDialog, setShowFacilityReviewDialog] = useState(false);

    const fetchTrackedEntityInstance = async () => {
        const credentials = localStorage.getItem('userCredentials');
        const userOrgUnitId = localStorage.getItem('userOrgUnitId');

        if (!credentials || !userOrgUnitId) {
            // Redirect to login if credentials are missing
            // This should ideally be handled by a global authentication context
            console.error('Credentials or Org Unit ID missing. Redirecting to login.');
            // window.location.href = "/authentication/sign-in/basic"; 
            return;
        }

        try {
            const url = `/api/trackedEntityInstances?ou=${userOrgUnitId}&ouMode=SELECTED&program=EE8yeLVo6cN&fields=trackedEntityInstance&paging=false`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `Basic ${credentials}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
                const instance = data.trackedEntityInstances[0];
                setTrackedEntityInstanceId(instance.trackedEntityInstance);
            } else {
                // Handle case where no tracked entity instance is found
                // This might indicate a fresh registration or an issue.
                // For now, set to null and allow the child components to handle
                setTrackedEntityInstanceId(null);
                // Potentially show a message to the user that no facility is registered
                // setShowFacilityReviewDialog(true);
            }
        } catch (error) {
            console.error("Error fetching tracked entity instance:", error);
            setTrackedEntityInstanceId(null); // Ensure TEI is null on error
            setShowFacilityReviewDialog(true);
        } finally {
            setDashboardLoading(false);
        }
    };

    useEffect(() => {
        fetchTrackedEntityInstance();
    }, []);

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="dashboard-section">
                        <h2>Welcome to Your Dashboard</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Active Inspections</h3>
                                <p className="stat-number">3</p>
                            </div>
                            <div className="stat-card">
                                <h3>Pending Tasks</h3>
                                <p className="stat-number">5</p>
                            </div>
                            <div className="stat-card">
                                <h3>Completed Reports</h3>
                                <p className="stat-number">12</p>
                            </div>
                            <div className="stat-card">
                                <h3>Upcoming Deadlines</h3>
                                <p className="stat-number">2</p>
                            </div>
                        </div>
                    </div>
                );
            case 'registration':
                return (
                    <div className="dashboard-section">
                        <RegistrationDetails 
                            trackedEntityInstanceId={trackedEntityInstanceId} 
                            showReviewDialog={showFacilityReviewDialog}
                        />
                    </div>
                );
            case 'reports':
                return (
                    <div className="dashboard-section">
                        <h2>Recent Reports</h2>
                        <div className="reports-list">
                            <div className="report-item">
                                <h4>Monthly Inspection Report</h4>
                                <p>Last updated: 2024-03-15</p>
                            </div>
                            <div className="report-item">
                                <h4>Safety Compliance Review</h4>
                                <p>Last updated: 2024-03-10</p>
                            </div>
                        </div>
                    </div>
                );
            case 'tasks':
                return (
                    <div className="dashboard-section">
                        <h2>Pending Tasks</h2>
                        <div className="tasks-list">
                            <div className="task-item">
                                <h4>Complete Facility Inspection</h4>
                                <p>Due: 2024-03-25</p>
                            </div>
                            <div className="task-item">
                                <h4>Update Safety Protocols</h4>
                                <p>Due: 2024-03-28</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
            </div>
            <div className="dashboard-main">
                <div className="dashboard-sidebar">
                    <button
                        onClick={() => setActiveSection('overview')}
                        className={activeSection === 'overview' ? 'active' : ''}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveSection('registration')}
                        className={activeSection === 'registration' ? 'active' : ''}
                    >
                        Complete Registration
                    </button>
                    <button
                        onClick={() => setActiveSection('reports')}
                        className={activeSection === 'reports' ? 'active' : ''}
                    >
                        Reports
                    </button>
                    <button
                        onClick={() => setActiveSection('tasks')}
                        className={activeSection === 'tasks' ? 'active' : ''}
                    >
                        Tasks
                    </button>
                </div>
                <div className="dashboard-content">
                    {dashboardLoading ? (
                        <div className="dashboard-loading-container">
                            <img src="https://i.stack.imgur.com/hzk6C.gif" alt="Loading..." className="dashboard-loading-gif" />
                            <p>Loading Dashboard...</p>
                        </div>
                    ) : (
                        renderContent()
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 