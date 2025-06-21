import React, { useState } from 'react';
import './AddServiceOfferingDialog.css';
import ModalPortal from './ModalPortal';

const AddServiceOfferingDialog = ({ open, onClose, onAddSuccess, trackedEntityInstanceId }) => {
  const [formData, setFormData] = useState({
    coreEmergencyServices: false,
    coreGeneralPracticeServices: false,
    coreTreatmentAndCare: false,
    coreUrgentCare: false,
    additionalHealthEducation: false,
    specialisedMaternityAndReproductiveHealth: false,
    specialisedMentalHealthAndSubstanceAbuse: false,
    specialisedRadiology: false,
    specialisedRehabilitation: false,
    supportAmbulatoryCare: false,
    supportDialysisCenters: false,
    supportHospices: false,
    supportLabServices: false,
    supportNursingHomes: false,
    supportOutpatientDepartment: false,
    supportPatientTransportation: false,
    supportPharmacy: false,
    additionalCounseling: false,
    additionalCommunityBased: false
  });
  
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };
  
  // Function to generate a unique event ID
  const generateEventId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    
    try {
      const credentials = localStorage.getItem('userCredentials');
      const orgUnitId = localStorage.getItem('userOrgUnitId');
      
      if (!credentials || !orgUnitId) {
        setErrorMessage("Authentication required. Please log in again.");
        setIsSubmitting(false);
        return;
      }
      
      const eventId = generateEventId();
      const today = new Date().toISOString().split('T')[0];
      
      // Create data values array based on form data
      const dataValues = [
        // Use default values for the excluded fields
        { dataElement: "IR8eO63QKKe", value: "Services" },
        { dataElement: "pRPw37nqZQ3", value: "Health facility services" }
      ];
      
      // Add boolean/checkbox values
      if (formData.coreEmergencyServices) dataValues.push({ dataElement: "j57HXXX4Ijz", value: "true" });
      if (formData.coreGeneralPracticeServices) dataValues.push({ dataElement: "ECjGkIq0Deq", value: "true" });
      if (formData.coreTreatmentAndCare) dataValues.push({ dataElement: "aM41KiGDJAs", value: "true" });
      if (formData.coreUrgentCare) dataValues.push({ dataElement: "flzyZUlf30v", value: "true" });
      if (formData.additionalHealthEducation) dataValues.push({ dataElement: "SMvKa2EWeBO", value: "true" });
      if (formData.specialisedMaternityAndReproductiveHealth) dataValues.push({ dataElement: "y9QSgKRoc6L", value: "true" });
      if (formData.specialisedMentalHealthAndSubstanceAbuse) dataValues.push({ dataElement: "yZhlCTgamq0", value: "true" });
      if (formData.specialisedRadiology) dataValues.push({ dataElement: "RCvjFJQUaPV", value: "true" });
      if (formData.specialisedRehabilitation) dataValues.push({ dataElement: "uxcdCPnaqWL", value: "true" });
      if (formData.supportAmbulatoryCare) dataValues.push({ dataElement: "r76ODkNZv43", value: "true" });
      if (formData.supportDialysisCenters) dataValues.push({ dataElement: "E7OMKr09N0R", value: "true" });
      if (formData.supportHospices) dataValues.push({ dataElement: "GyQNkXpNraW", value: "true" });
      if (formData.supportLabServices) dataValues.push({ dataElement: "OgpVvPxkLwf", value: "true" });
      if (formData.supportNursingHomes) dataValues.push({ dataElement: "rLC2CE79p7Q", value: "true" });
      if (formData.supportOutpatientDepartment) dataValues.push({ dataElement: "w86r0XZCLCr", value: "true" });
      if (formData.supportPatientTransportation) dataValues.push({ dataElement: "m8Kl585eWSK", value: "true" });
      if (formData.supportPharmacy) dataValues.push({ dataElement: "yecnkdC7HtM", value: "true" });
      if (formData.additionalCounseling) dataValues.push({ dataElement: "i0QXYWMOUjy", value: "true" });
      if (formData.additionalCommunityBased) dataValues.push({ dataElement: "e48W7983nBs", value: "true" });
      
      const payload = {
        event: eventId,
        eventDate: today,
        orgUnit: orgUnitId,
        program: "EE8yeLVo6cN", // From the provided DHIS2 data
        programStage: "mTuN7RTnmaB", // Using a program stage ID for Services
        status: "ACTIVE",
        trackedEntityInstance: trackedEntityInstanceId,
        dataValues: dataValues
      };
      
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
      
      console.log("Service offering added successfully!");
      onAddSuccess(); // Call success callback to reload data in parent
      onClose(); // Close modal on successful addition
    } catch (error) {
      console.error("Error adding service offering:", error);
      setErrorMessage(`Failed to add service offering: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Form is always valid since we don't need the name and service fields anymore
  const isFormValid = true;
  
  return (
    <ModalPortal open={open} onClose={onClose}>
      <div className="modal-content" style={{ padding: '0', maxWidth: '1200px' }}>
        <div className="modal-header">
          <h5 className="modal-title">Add Services Offered</h5>
          <button 
            type="button" 
            className="close-btn" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <form onSubmit={handleSubmit} className="service-offering-form">
            <h6 className="service-category">Core Services</h6>
            <div className="services-grid">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="coreEmergencyServices"
                  name="coreEmergencyServices"
                  checked={formData.coreEmergencyServices}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="coreEmergencyServices">Core Emergency Services</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="coreGeneralPracticeServices"
                  name="coreGeneralPracticeServices"
                  checked={formData.coreGeneralPracticeServices}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="coreGeneralPracticeServices">Core General Practice Services</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="coreTreatmentAndCare"
                  name="coreTreatmentAndCare"
                  checked={formData.coreTreatmentAndCare}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="coreTreatmentAndCare">Core Treatment and Care</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="coreUrgentCare"
                  name="coreUrgentCare"
                  checked={formData.coreUrgentCare}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="coreUrgentCare">Core Urgent Care</label>
              </div>
            </div>
            
            <h6 className="service-category">Specialised Services</h6>
            <div className="services-grid">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="specialisedMaternityAndReproductiveHealth"
                  name="specialisedMaternityAndReproductiveHealth"
                  checked={formData.specialisedMaternityAndReproductiveHealth}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="specialisedMaternityAndReproductiveHealth">Maternity & Reproductive Health</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="specialisedMentalHealthAndSubstanceAbuse"
                  name="specialisedMentalHealthAndSubstanceAbuse"
                  checked={formData.specialisedMentalHealthAndSubstanceAbuse}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="specialisedMentalHealthAndSubstanceAbuse">Mental Health & Substance Abuse</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="specialisedRadiology"
                  name="specialisedRadiology"
                  checked={formData.specialisedRadiology}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="specialisedRadiology">Radiology</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="specialisedRehabilitation"
                  name="specialisedRehabilitation"
                  checked={formData.specialisedRehabilitation}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="specialisedRehabilitation">Rehabilitation</label>
              </div>
            </div>
            
            <h6 className="service-category">Support Services</h6>
            <div className="services-grid">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="supportAmbulatoryCare"
                  name="supportAmbulatoryCare"
                  checked={formData.supportAmbulatoryCare}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="supportAmbulatoryCare">Ambulatory Care</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="supportDialysisCenters"
                  name="supportDialysisCenters"
                  checked={formData.supportDialysisCenters}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="supportDialysisCenters">Dialysis Centers</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="supportHospices"
                  name="supportHospices"
                  checked={formData.supportHospices}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="supportHospices">Hospices</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="supportLabServices"
                  name="supportLabServices"
                  checked={formData.supportLabServices}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="supportLabServices">Lab Services</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="supportNursingHomes"
                  name="supportNursingHomes"
                  checked={formData.supportNursingHomes}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="supportNursingHomes">Nursing Homes</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="supportOutpatientDepartment"
                  name="supportOutpatientDepartment"
                  checked={formData.supportOutpatientDepartment}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="supportOutpatientDepartment">Outpatient Department</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="supportPatientTransportation"
                  name="supportPatientTransportation"
                  checked={formData.supportPatientTransportation}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="supportPatientTransportation">Patient Transportation</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="supportPharmacy"
                  name="supportPharmacy"
                  checked={formData.supportPharmacy}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="supportPharmacy">Pharmacy</label>
              </div>
            </div>
            
            <h6 className="service-category">Additional Services</h6>
            <div className="services-grid">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="additionalHealthEducation"
                  name="additionalHealthEducation"
                  checked={formData.additionalHealthEducation}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="additionalHealthEducation">Health Education</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="additionalCounseling"
                  name="additionalCounseling"
                  checked={formData.additionalCounseling}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="additionalCounseling">Counseling</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="additionalCommunityBased"
                  name="additionalCommunityBased"
                  checked={formData.additionalCommunityBased}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="additionalCommunityBased">Community-Based Services</label>
              </div>
            </div>
            
            <div className="button-container">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? "Adding..." : "Add Services"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};

export default AddServiceOfferingDialog; 