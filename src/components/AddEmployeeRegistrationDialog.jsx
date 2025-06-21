import React, { useState, useEffect } from 'react';
import './AddEmployeeRegistrationDialog.css';
import ModalPortal from './ModalPortal';

const AddEmployeeRegistrationDialog = ({ open, onClose, onAddSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bhpcNmcNumber: "",
    position: "",
    contractType: "",
    qualifications: null,
    professionalLicense: null,
    cv: null
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Prevent scrolling on the main body when the modal is open
  useEffect(() => {
    if (open) {
      // Disable scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
      
      // Re-enable scrolling when component is unmounted or closed
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // Here you would typically make an API call to save the employee registration
      // For now, we'll just simulate a successful submission
      console.log("Form submitted:", formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onAddSuccess();
      onClose();
    } catch (error) {
      setErrorMessage("Failed to add employee registration. Please try again.");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const isFormValid = 
    formData.firstName &&
    formData.lastName &&
    formData.bhpcNmcNumber &&
    formData.position &&
    formData.contractType &&
    formData.qualifications &&
    formData.professionalLicense &&
    formData.cv;

  return (
    <ModalPortal open={open} onClose={onClose}>
      <div className="modal-content" style={{ padding: '0', maxWidth: '1200px' }}>
        <div className="modal-header">
          <h5 className="modal-title">Add New Employee Registration</h5>
          <button 
            type="button" 
            className="close-btn" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <form onSubmit={handleSubmit} className="employee-registration-form">
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-control"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-control"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label>BHPC/NMC Number:</label>
              <input
                type="text"
                name="bhpcNmcNumber"
                value={formData.bhpcNmcNumber}
                onChange={handleInputChange}
                className="form-control"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label>Position:</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="form-control"
                required
                disabled={isSubmitting}
              >
                <option value="">Select Position</option>
                <option value="Head of Medical Services">Head of Medical Services</option>
                <option value="Medical/Dental Personnel: Dentist">Medical/Dental Personnel: Dentist</option>
                <option value="Facility Manager">Facility Manager</option>
                <option value="Nurse">Nurse</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Laboratory Technician">Laboratory Technician</option>
              </select>
            </div>
            <div className="form-group">
              <label>Contract Type:</label>
              <select
                name="contractType"
                value={formData.contractType}
                onChange={handleInputChange}
                className="form-control"
                required
                disabled={isSubmitting}
              >
                <option value="">Select Contract Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contracted Staff">Contracted Staff</option>
              </select>
            </div>
            <div className="form-group">
              <label>Qualifications:</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  name="qualifications"
                  id="qualifications"
                  onChange={handleInputChange}
                  className="form-control-file"
                  required
                  disabled={isSubmitting}
                />
                <label htmlFor="qualifications" className="custom-file-upload">
                  Choose File
                </label>
                <span className="file-name">
                  {formData.qualifications ? formData.qualifications.name : 'No file chosen'}
                </span>
              </div>
            </div>
            <div className="form-group">
              <label>Professional License:</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  name="professionalLicense"
                  id="professionalLicense"
                  onChange={handleInputChange}
                  className="form-control-file"
                  required
                  disabled={isSubmitting}
                />
                <label htmlFor="professionalLicense" className="custom-file-upload">
                  Choose File
                </label>
                <span className="file-name">
                  {formData.professionalLicense ? formData.professionalLicense.name : 'No file chosen'}
                </span>
              </div>
            </div>
            <div className="form-group">
              <label>CV:</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  name="cv"
                  id="cv"
                  onChange={handleInputChange}
                  className="form-control-file"
                  required
                  disabled={isSubmitting}
                />
                <label htmlFor="cv" className="custom-file-upload">
                  Choose File
                </label>
                <span className="file-name">
                  {formData.cv ? formData.cv.name : 'No file chosen'}
                </span>
              </div>
            </div>
            <div className="button-container">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? "Adding..." : "Add Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};

export default AddEmployeeRegistrationDialog; 