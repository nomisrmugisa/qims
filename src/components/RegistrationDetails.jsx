import React, { useState, useEffect } from 'react';
import './RegistrationDetails.css'; // We'll create this CSS file next
import AddFacilityOwnershipDialog from './AddFacilityOwnershipDialog';
import EditFacilityOwnershipDialog from './EditFacilityOwnershipDialog';
import AddEmployeeRegistrationDialog from './AddEmployeeRegistrationDialog';

const RegistrationDetails = ({ trackedEntityInstanceId, showReviewDialog }) => {
  const [activeTab, setActiveTab] = useState('facilityOwnership');
  const [events, setEvents] = useState([]);
  const [employeeEvents, setEmployeeEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);

  const fetchFacilityOwnershipData = async () => {
    if (!trackedEntityInstanceId) {
      setIsLoading(false);
      return;
    }
    const credentials = localStorage.getItem('userCredentials');
    const userOrgUnitId = localStorage.getItem('userOrgUnitId');

    if (!credentials || !userOrgUnitId || !trackedEntityInstanceId) {
      // Redirect to login or handle missing credentials/trackedEntityInstanceId
      // console.error("Missing credentials, Org Unit ID, or Tracked Entity Instance ID.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const url = `/api/trackedEntityInstances/${trackedEntityInstanceId}?ou=${userOrgUnitId}&ouMode=SELECTED&program=EE8yeLVo6cN&fields=enrollments[events]!programStage=MuJubgTzJrY&paging=false`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let fetchedEvents = [];

      if (data.enrollments && data.enrollments.length > 0) {
        data.enrollments.forEach((enrollment) => {
          fetchedEvents = fetchedEvents.concat(enrollment.events);
        });
      }

      setEvents(fetchedEvents);
      setIsLoading(false);

    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
      // setShowReviewDialog(true); // This prop is now managed by Dashboard
    }
  };

  useEffect(() => {
    if (trackedEntityInstanceId) {
      fetchFacilityOwnershipData();
      fetchEmployeeData();
    }
  }, [trackedEntityInstanceId]);

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setShowEditDialog(true);
  };

  const handleAddEmployee = (e) => {
    console.log('Add employee button clicked');
    e.preventDefault();
    e.stopPropagation();
    setOpenEmployeeDialog(true);
  };

  const handleCloseEmployeeDialog = () => {
    console.log('Closing employee dialog');
    setOpenEmployeeDialog(false);
  };

  const handleEmployeeAddSuccess = () => {
    console.log('Employee added successfully');
    setOpenEmployeeDialog(false);
    fetchEmployeeData();
  };

  const fetchEmployeeData = async () => {
    if (!trackedEntityInstanceId) {
      setIsLoadingEmployees(false);
      return;
    }

    const credentials = localStorage.getItem('userCredentials');
    const userOrgUnitId = localStorage.getItem('userOrgUnitId');

    if (!credentials || !userOrgUnitId) {
      setIsLoadingEmployees(false);
      return;
    }

    try {
      setIsLoadingEmployees(true);
      const url = `/api/trackedEntityInstances/${trackedEntityInstanceId}?ou=${userOrgUnitId}&ouMode=SELECTED&program=EE8yeLVo6cN&fields=enrollments[events]!programStage=xjhA4eEHyhw&paging=false`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let fetchedEvents = [];

      if (data.enrollments && data.enrollments.length > 0) {
        data.enrollments.forEach((enrollment) => {
          fetchedEvents = fetchedEvents.concat(enrollment.events);
        });
      }

      setEmployeeEvents(fetchedEvents);
      setIsLoadingEmployees(false);

    } catch (error) {
      console.error("Error fetching employee data:", error);
      setIsLoadingEmployees(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'facilityOwnership':
        return (
          <div className="tab-content">
            <div className="facility-ownership-details">
              <h2>Facility Ownership Details <span className="add-icon" onClick={() => setOpenAddDialog(true)}>+</span></h2>
              {isLoading ? (
                <p>Loading facility ownership data...</p>
              ) : showReviewDialog ? (
                <p className="error-message">Error loading data. Please try again or contact support.</p>
              ) : events.length === 0 ? (
                <p>No facility ownership records found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Report Date</th>
                        <th>Organization Unit</th>
                        <th>First Name</th>
                        <th>Surname</th>
                        <th>Citizenship</th>
                        <th>Program Stage ID</th>
                        <th>Event ID</th>
                        <th>Tracked Entity Instance ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event, index) => {
                        const dataValues = event.dataValues || [];
                        const getFormattedValue = (dataElementId) => {
                          const dataValue = dataValues.find(dv => dv.dataElement === dataElementId);
                          return dataValue ? dataValue.value : '';
                        };

                        return (
                          <tr 
                            key={event.event || index}
                            onClick={() => handleRowClick(event)}
                            style={{ cursor: 'pointer' }}
                            className="hover-row"
                          >
                            <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                            <td>{localStorage.getItem('userOrgUnitName')}</td>
                            <td>{getFormattedValue("HMk4LZ9ESOq")}</td> {/* First Name */}
                            <td>{getFormattedValue("ykwhsQQPVH0")}</td> {/* Surname */}
                            <td>{getFormattedValue("zVmmto7HwOc")}</td> {/* Citizenship */}
                            <td>{event.programStage}</td>
                            <td>{event.event}</td>
                            <td>{event.trackedEntityInstance}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      case 'employeeRegistration':
        return (
          <div className="tab-content">
            <div className="employee-registration-details">
              <h2>
                Employee Registration Details 
                <button 
                  className="add-icon" 
                  onClick={handleAddEmployee}
                  style={{ 
                    background: 'none',
                    border: 'none',
                    fontSize: '28px',
                    color: '#28a745',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    padding: '0 5px'
                  }}
                >
                  +
                </button>
              </h2>
              {isLoadingEmployees ? (
                <p>Loading employee data...</p>
              ) : employeeEvents.length === 0 ? (
                <p>No employee records found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>BHPC/NMC Number</th>
                        <th>Position</th>
                        <th>Contract Type</th>
                        <th>Organization Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeEvents.map((event, index) => {
                        const dataValues = event.dataValues || [];
                        const getFormattedValue = (dataElementId) => {
                          const dataValue = dataValues.find(dv => dv.dataElement === dataElementId);
                          return dataValue ? dataValue.value : '';
                        };

                        return (
                          <tr key={event.event || index}>
                            <td>{getFormattedValue("IIxbad41cH6")}</td>
                            <td>{getFormattedValue("VFTRgPnvSHV")}</td>
                            <td>{getFormattedValue("xcTxmEUy6g6")}</td>
                            <td>{getFormattedValue("FClCncccLzw")}</td>
                            <td>{getFormattedValue("F3h1A96t3uL")}</td>
                            <td>{localStorage.getItem('userOrgUnitName')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      case 'servicesOffered':
        return (
          <div className="tab-content">
            <div className="services-offered-details">
              <h2>Services Offered Details <span className="add-icon">+</span></h2>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Core Emergency</th>
                      <th>Core General Practice</th>
                      <th>Core Treatment & Care</th>
                      <th>Core Urgent Care</th>
                      <th>Additional Health Education</th>
                      <th>Specialised Maternity & Reprod. Health</th>
                      <th>Specialised Mental Health & Subst. Abuse</th>
                      <th>Specialised Radiology</th>
                      <th>Specialised Rehabilitation</th>
                      <th>Support Dialysis Centers</th>
                      <th>Support Hospices</th>
                      <th>Support Lab Services</th>
                      <th>Support Nursing Homes</th>
                      <th>Support Outpatient Department</th>
                      <th>Support Patient Transportation</th>
                      <th>Support Pharmacy</th>
                      <th>Additional Counseling</th>
                      <th>Additional Community-Based</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Yes</td>
                      <td>Yes</td>
                      <td>No</td>
                      <td>Yes</td>
                      <td>No</td>
                      <td>No</td>
                      <td>No</td>
                      <td>No</td>
                      <td>No</td>
                      <td>No</td>
                      <td>No</td>
                      <td>No</td>
                      <td>No</td>
                      <td>No</td>
                      <td>No</td>
                      <td>Yes</td>
                      <td>No</td>
                      <td>No</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'inspectionSchedule':
        return (
          <div className="tab-content">
            <div className="inspection-schedule-details">
              <h2>Inspection Schedule Details <span className="add-icon">+</span></h2>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Inspection Date</th>
                      <th>Facility Name</th>
                      <th>Inspector</th>
                      <th>Status</th>
                      <th>Findings</th>
                      <th>Recommendations</th>
                      <th>Follow-up Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2024-03-20</td>
                      <td>Central Clinic</td>
                      <td>John Doe</td>
                      <td>Completed</td>
                      <td>Minor non-compliance</td>
                      <td>Update fire extinguishers</td>
                      <td>2024-04-20</td>
                    </tr>
                    <tr>
                      <td>2024-03-22</td>
                      <td>City Hospital</td>
                      <td>Jane Smith</td>
                      <td>Pending</td>
                      <td>N/A</td>
                      <td>N/A</td>
                      <td>2024-04-22</td>
                    </tr>
                    <tr>
                      <td>2024-03-25</td>
                      <td>Rural Health Post</td>
                      <td>Peter Jones</td>
                      <td>Completed</td>
                      <td>Good compliance</td>
                      <td>None</td>
                      <td>N/A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="registration-details-container">
      <div className="tab-buttons">
        <button
          className={activeTab === 'facilityOwnership' ? 'active' : ''}
          onClick={() => setActiveTab('facilityOwnership')}
        >
          Facility Ownership
        </button>
        <button
          className={activeTab === 'employeeRegistration' ? 'active' : ''}
          onClick={() => setActiveTab('employeeRegistration')}
        >
          Employee Registration
        </button>
        <button
          className={activeTab === 'servicesOffered' ? 'active' : ''}
          onClick={() => setActiveTab('servicesOffered')}
        >
          Services Offered
        </button>
        <button
          className={activeTab === 'inspectionSchedule' ? 'active' : ''}
          onClick={() => setActiveTab('inspectionSchedule')}
        >
          Inspection Schedule
        </button>
      </div>
      {renderTabContent()}

      {/* Add New Facility Ownership Dialog */}
      {openAddDialog && (
        <AddFacilityOwnershipDialog
          onClose={() => setOpenAddDialog(false)}
          onAddSuccess={fetchFacilityOwnershipData}
          trackedEntityInstanceId={trackedEntityInstanceId}
        />
      )}

      {/* Edit Facility Ownership Dialog */}
      {showEditDialog && selectedEvent && (
        <EditFacilityOwnershipDialog
          onClose={() => {
            setShowEditDialog(false);
            setSelectedEvent(null);
          }}
          onUpdateSuccess={fetchFacilityOwnershipData}
          event={selectedEvent}
        />
      )}

      {/* Add New Employee Registration Dialog */}
      {openEmployeeDialog && (
        <AddEmployeeRegistrationDialog
          onClose={handleCloseEmployeeDialog}
          onAddSuccess={handleEmployeeAddSuccess}
        />
      )}
    </div>
  );
};

export default RegistrationDetails;