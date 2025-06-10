import React, { useState } from 'react';
import './AddFacilityOwnershipDialog.css'; // We'll create this CSS file next

const AddFacilityOwnershipDialog = ({ onClose, onAddSuccess, trackedEntityInstanceId }) => {
  const [newFormData, setNewFormData] = useState({
    firstName: "",
    surname: "",
    citizen: "",
    ownershipType: "",
    idType: "",
    id: "",
    copyOfIdPassport: null,
    professionalReference1: null,
    professionalReference2: null,
    qualificationCertificates: null,
    validRecentPermit: null,
    workPermitWaiver: null,
  });

  const [errorMessage, setErrorMessage] = useState("");

  // Function to generate a unique event ID (simplified for now)
  const generateEventId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  // Function to upload file and get file resource ID
  const uploadFileAndGetId = async (file) => {
    if (!file) return null;
    const credentials = localStorage.getItem('userCredentials');
    const fileData = new FormData();
    fileData.append("file", file);
    
    try {
      const fileRes = await fetch("/api/fileResources", {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
        body: fileData,
      });

      if (!fileRes.ok) {
        const errorText = await fileRes.text();
        throw new Error(`File upload failed: ${fileRes.status} - ${errorText}`);
      }
      const responseJson = await fileRes.json();
      return responseJson.response.fileResource.id;
    } catch (error) {
      console.error("Error uploading file:", file.name, error);
      throw error; // Re-throw to be caught by handleAddSubmit
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setNewFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    const credentials = localStorage.getItem('userCredentials');
    const orgUnitId = localStorage.getItem('userOrgUnitId');

    if (!credentials || !orgUnitId) {
      setErrorMessage("Authentication required. Please log in again.");
      console.error("Missing credentials or organization unit ID.");
      // Optionally redirect to login page
      return;
    }

    try {
      // 1. Upload all files in parallel
      const [ 
        copyOfIdPassportId,
        professionalReference1Id,
        professionalReference2Id,
        qualificationCertificatesId,
        validRecentPermitId,
        workPermitWaiverId,
      ] = await Promise.all([
        uploadFileAndGetId(newFormData.copyOfIdPassport),
        uploadFileAndGetId(newFormData.professionalReference1),
        uploadFileAndGetId(newFormData.professionalReference2),
        uploadFileAndGetId(newFormData.qualificationCertificates),
        uploadFileAndGetId(newFormData.validRecentPermit),
        uploadFileAndGetId(newFormData.workPermitWaiver),
      ]);

      const eventId = generateEventId();
      const today = new Date().toISOString().split('T')[0];

      const payload = {
        event: eventId,
        eventDate: today,
        orgUnit: orgUnitId,
        program: "EE8yeLVo6cN",
        programStage: "MuJubgTzJrY",
        status: "ACTIVE",
        trackedEntityInstance: trackedEntityInstanceId,
        dataValues: [
          { dataElement: "HMk4LZ9ESOq", value: newFormData.firstName },
          { dataElement: "ykwhsQQPVH0", value: newFormData.surname },
          { dataElement: "zVmmto7HwOc", value: newFormData.citizen },
          { dataElement: "aUGSyyfbUVI", value: newFormData.id },
          { dataElement: "FLcrCfTNcQi", value: newFormData.idType },
          { dataElement: "vAHHXaW0Pna", value: newFormData.ownershipType },
          // Add file references if they exist
          ...(copyOfIdPassportId ? [{ dataElement: "KRj1TOR5cVM", value: copyOfIdPassportId }] : []),
          ...(professionalReference1Id ? [{ dataElement: "yP49GKSQxPl", value: professionalReference1Id }] : []),
          ...(professionalReference2Id ? [{ dataElement: "lC217zTgC6C", value: professionalReference2Id }] : []),
          ...(qualificationCertificatesId ? [{ dataElement: "pelCBFPIFY1", value: qualificationCertificatesId }] : []),
          ...(validRecentPermitId ? [{ dataElement: "cUObXSGtCuD", value: validRecentPermitId }] : []),
          ...(workPermitWaiverId ? [{ dataElement: "g9jXH9LJyxU", value: workPermitWaiverId }] : []),
        ],
      };

      console.log("Event creation payload:", payload);

      const eventRes = await fetch("/api/events", {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!eventRes.ok) {
        const errorText = await eventRes.text();
        throw new Error(`Event creation failed: ${eventRes.status} - ${errorText}`);
      }

      console.log("Event created successfully!");
      onAddSuccess(); // Call success callback to reload data in parent
      onClose(); // Close modal on successful addition

    } catch (error) {
      console.error("Error creating new facility ownership:", error);
      setErrorMessage(`Failed to add facility ownership: ${error.message}`);
    }
  };

  const isFormValid = (
    newFormData.firstName &&
    newFormData.surname &&
    newFormData.citizen &&
    newFormData.ownershipType &&
    newFormData.idType &&
    newFormData.id &&
    newFormData.copyOfIdPassport && newFormData.copyOfIdPassport.size > 0 &&
    newFormData.professionalReference1 && newFormData.professionalReference1.size > 0 &&
    newFormData.professionalReference2 && newFormData.professionalReference2.size > 0 &&
    newFormData.qualificationCertificates && newFormData.qualificationCertificates.size > 0 &&
    newFormData.validRecentPermit && newFormData.validRecentPermit.size > 0 &&
    newFormData.workPermitWaiver && newFormData.workPermitWaiver.size > 0
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add New Facility Ownership</h5>
          <button type="button" className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <form onSubmit={handleAddSubmit}>
            <div className="form-group">
              <label>First Name:</label>
              <input type="text" name="firstName" value={newFormData.firstName} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Surname:</label>
              <input type="text" name="surname" value={newFormData.surname} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Citizen:</label>
              <input type="text" name="citizen" value={newFormData.citizen} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Ownership Type:</label>
              <select name="ownershipType" value={newFormData.ownershipType} onChange={handleInputChange} className="form-control" required>
                <option value="">Select Ownership Type</option>
                <option value="State Owned">State Owned</option>
                <option value="Private Owned">Private Owned</option>
              </select>
            </div>
            <div className="form-group">
              <label>ID Type:</label>
              <input type="text" name="idType" value={newFormData.idType} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>ID:</label>
              <input type="text" name="id" value={newFormData.id} onChange={handleInputChange} className="form-control" required />
            </div>

            {/* File Inputs */}
            <div className="form-group">
              <label>Copy of ID/Passport:</label>
              <div className="file-input-wrapper">
                <input type="file" name="copyOfIdPassport" id="copyOfIdPassport" onChange={handleInputChange} className="form-control-file" required />
                <label htmlFor="copyOfIdPassport" className="custom-file-upload">Choose File</label>
                <span className="file-name">{newFormData.copyOfIdPassport ? newFormData.copyOfIdPassport.name : 'No file chosen'}</span>
              </div>
            </div>
            <div className="form-group">
              <label>Professional Reference 1:</label>
              <div className="file-input-wrapper">
                <input type="file" name="professionalReference1" id="professionalReference1" onChange={handleInputChange} className="form-control-file" required />
                <label htmlFor="professionalReference1" className="custom-file-upload">Choose File</label>
                <span className="file-name">{newFormData.professionalReference1 ? newFormData.professionalReference1.name : 'No file chosen'}</span>
              </div>
            </div>
            <div className="form-group">
              <label>Professional Reference 2:</label>
              <div className="file-input-wrapper">
                <input type="file" name="professionalReference2" id="professionalReference2" onChange={handleInputChange} className="form-control-file" required />
                <label htmlFor="professionalReference2" className="custom-file-upload">Choose File</label>
                <span className="file-name">{newFormData.professionalReference2 ? newFormData.professionalReference2.name : 'No file chosen'}</span>
              </div>
            </div>
            <div className="form-group">
              <label>Qualification Certificates:</label>
              <div className="file-input-wrapper">
                <input type="file" name="qualificationCertificates" id="qualificationCertificates" onChange={handleInputChange} className="form-control-file" required />
                <label htmlFor="qualificationCertificates" className="custom-file-upload">Choose File</label>
                <span className="file-name">{newFormData.qualificationCertificates ? newFormData.qualificationCertificates.name : 'No file chosen'}</span>
              </div>
            </div>
            <div className="form-group">
              <label>Valid Recent Permit:</label>
              <div className="file-input-wrapper">
                <input type="file" name="validRecentPermit" id="validRecentPermit" onChange={handleInputChange} className="form-control-file" required />
                <label htmlFor="validRecentPermit" className="custom-file-upload">Choose File</label>
                <span className="file-name">{newFormData.validRecentPermit ? newFormData.validRecentPermit.name : 'No file chosen'}</span>
              </div>
            </div>
            <div className="form-group">
              <label>Work Permit Waiver:</label>
              <div className="file-input-wrapper">
                <input type="file" name="workPermitWaiver" id="workPermitWaiver" onChange={handleInputChange} className="form-control-file" required />
                <label htmlFor="workPermitWaiver" className="custom-file-upload">Choose File</label>
                <span className="file-name">{newFormData.workPermitWaiver ? newFormData.workPermitWaiver.name : 'No file chosen'}</span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={!isFormValid}>
              Add
            </button>
            <button type="button" className="btn btn-secondary cancel-btn" onClick={onClose}>Cancel</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFacilityOwnershipDialog; 